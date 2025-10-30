import { strict as assert } from 'node:assert';
import { after, before, test } from 'node:test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { VisitorStatsStore } from '../server/visitorStatsStore';

let tempDir: string;

before(async () => {
  tempDir = await mkdtemp(join(tmpdir(), 'visitor-store-'));
});

after(async () => {
  if (tempDir) {
    await rm(tempDir, { recursive: true, force: true });
  }
});

const createStore = (filename: string) => new VisitorStatsStore(join(tempDir, filename));

test('initial stats are zeroed when no file exists', async () => {
  const store = createStore('stats-a.json');
  const stats = await store.getAggregatedStats();
  assert.equal(stats.totalVisits, 0);
  assert.equal(stats.uniqueVisitors, 0);
  assert.deepEqual(stats.locations, {});
});

test('recordVisit increments totals and unique visitors', async () => {
  const store = createStore('stats-b.json');
  await store.recordVisit('visitor-1', 'Madrid, Spain');
  const afterFirst = await store.getAggregatedStats();

  assert.equal(afterFirst.totalVisits, 1);
  assert.equal(afterFirst.uniqueVisitors, 1);
  assert.equal(afterFirst.locations['Madrid, Spain'], 1);

  await store.recordVisit('visitor-1', 'Madrid, Spain');
  const afterSecond = await store.getAggregatedStats();

  assert.equal(afterSecond.totalVisits, 2);
  assert.equal(afterSecond.uniqueVisitors, 1, 'same visitor should not increment unique count');
  assert.equal(afterSecond.locations['Madrid, Spain'], 2);

  await store.recordVisit('visitor-2', 'Paris, France');
  const afterThird = await store.getAggregatedStats();

  assert.equal(afterThird.totalVisits, 3);
  assert.equal(afterThird.uniqueVisitors, 2);
  assert.equal(afterThird.locations['Paris, France'], 1);
});

test('stats persist between store instances', async () => {
  const filename = 'stats-c.json';
  const storeA = createStore(filename);
  await storeA.recordVisit('visitor-3', 'Berlin, Germany');
  await storeA.recordVisit('visitor-4', 'Berlin, Germany');

  const storeB = createStore(filename);
  const persisted = await storeB.getAggregatedStats();

  assert.equal(persisted.totalVisits, 2);
  assert.equal(persisted.uniqueVisitors, 2);
  assert.equal(persisted.locations['Berlin, Germany'], 2);
});
