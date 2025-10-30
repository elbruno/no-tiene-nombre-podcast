import { createHash, randomUUID } from 'crypto';
import { constants } from 'fs';
import { access, mkdir, readFile, rename, writeFile } from 'fs/promises';
import { dirname, resolve } from 'path';

export interface AggregatedVisitorStats {
  totalVisits: number;
  uniqueVisitors: number;
  locations: Record<string, number>;
  lastUpdated: string;
}

interface PersistedVisitorStats extends AggregatedVisitorStats {
  visitorIds: string[];
}

const DATA_DIRECTORY = resolve(process.cwd(), 'data');
const DATA_FILE = resolve(DATA_DIRECTORY, 'visitor-stats.json');

const DEFAULT_STATS: PersistedVisitorStats = {
  totalVisits: 0,
  uniqueVisitors: 0,
  locations: {},
  lastUpdated: new Date(0).toISOString(),
  visitorIds: [],
};

type UpdateFn = (stats: PersistedVisitorStats) => PersistedVisitorStats | Promise<PersistedVisitorStats>;

export class VisitorStatsStore {
  private queue: Promise<void> = Promise.resolve();
  private cachedStats: PersistedVisitorStats | null = null;

  constructor(private readonly dataFilePath = DATA_FILE) {}

  async getAggregatedStats(): Promise<AggregatedVisitorStats> {
    const stats = await this.read();
    return this.stripPrivateFields(stats);
  }

  async recordVisit(visitorId: string, location: string | undefined): Promise<AggregatedVisitorStats> {
    await this.enqueue(async current => {
      const visitorHash = this.hashVisitorId(visitorId);
      const seenVisitor = current.visitorIds.includes(visitorHash);

      const next: PersistedVisitorStats = {
        ...current,
        totalVisits: current.totalVisits + 1,
        uniqueVisitors: seenVisitor ? current.uniqueVisitors : current.uniqueVisitors + 1,
        locations: { ...current.locations },
        lastUpdated: new Date().toISOString(),
        visitorIds: seenVisitor ? current.visitorIds : [...current.visitorIds, visitorHash],
      };

      if (location && location.trim().length > 0) {
        next.locations[location] = (next.locations[location] || 0) + 1;
      }

      this.cachedStats = next;
      await this.writeToDisk(next);
      return next;
    });

    return this.getAggregatedStats();
  }

  private async enqueue(fn: UpdateFn) {
    this.queue = this.queue.then(async () => {
      const next = await fn(await this.read());
      if (next) {
        this.cachedStats = next;
      }
    });
    await this.queue;
  }

  private async read(): Promise<PersistedVisitorStats> {
    if (this.cachedStats) {
      return this.cachedStats;
    }

    const stats = await this.readFromDisk();
    this.cachedStats = stats;
    return stats;
  }

  private stripPrivateFields(stats: PersistedVisitorStats): AggregatedVisitorStats {
    return {
      totalVisits: stats.totalVisits,
      uniqueVisitors: stats.uniqueVisitors,
      locations: stats.locations,
      lastUpdated: stats.lastUpdated,
    };
  }

  private hashVisitorId(visitorId: string): string {
    return createHash('sha256').update(visitorId).digest('hex');
  }

  private async readFromDisk(): Promise<PersistedVisitorStats> {
    try {
      await access(this.dataFilePath, constants.F_OK);
    } catch {
      return { ...DEFAULT_STATS };
    }

    try {
      const content = await readFile(this.dataFilePath, 'utf-8');
      const parsed = JSON.parse(content ?? '{}');
      if (
        typeof parsed !== 'object' ||
        parsed === null ||
        typeof parsed.totalVisits !== 'number' ||
        typeof parsed.uniqueVisitors !== 'number' ||
        typeof parsed.locations !== 'object' ||
        !Array.isArray(parsed.visitorIds)
      ) {
        throw new Error('Invalid visitor stats shape on disk');
      }

      return {
        totalVisits: parsed.totalVisits,
        uniqueVisitors: parsed.uniqueVisitors,
        locations: parsed.locations,
        lastUpdated: typeof parsed.lastUpdated === 'string' ? parsed.lastUpdated : new Date(0).toISOString(),
        visitorIds: parsed.visitorIds,
      };
    } catch (error) {
      console.error('Failed to parse visitor stats. Re-initializing store.', error);
      return { ...DEFAULT_STATS };
    }
  }

  private async writeToDisk(stats: PersistedVisitorStats) {
    await mkdir(dirname(this.dataFilePath), { recursive: true });
    const tempFile = resolve(dirname(this.dataFilePath), `.${randomUUID()}-visitor-stats.tmp`);
    const payload = JSON.stringify(stats, null, 2);
    await writeFile(tempFile, payload, 'utf-8');
    await rename(tempFile, this.dataFilePath);
  }
}

export const visitorStatsStore = new VisitorStatsStore();
