import { strict as assert } from 'node:assert';
import { after, before, test } from 'node:test';
import { AddressInfo, createServer } from 'node:http';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createVisitorStatsMiddleware } from '../server/visitorStatsPlugin';
import { VisitorStatsStore } from '../server/visitorStatsStore';

let tempDir: string;

before(async () => {
  tempDir = await mkdtemp(join(tmpdir(), 'visitor-plugin-'));
});

after(async () => {
  if (tempDir) {
    await rm(tempDir, { recursive: true, force: true });
  }
});

const startServer = (store: VisitorStatsStore) => {
  const middleware = createVisitorStatsMiddleware(store);

  const server = createServer((req, res) => {
    middleware(req, res).then(handled => {
      if (!handled) {
        res.statusCode = 404;
        res.end();
      }
    });
  });

  return new Promise<{ close: () => Promise<void>; url: string }>((resolve, reject) => {
    server.listen(0, () => {
      const address = server.address() as AddressInfo;
      if (!address) {
        reject(new Error('Server has no address'));
        return;
      }

      resolve({
        url: `http://127.0.0.1:${address.port}`,
        close: () =>
          new Promise<void>((res, rej) => {
            server.close(err => {
              if (err) rej(err);
              else res();
            });
          }),
      });
    });
    server.on('error', reject);
  });
};

test('API aggregates visits and preserves unique counts using cookies', async () => {
  const store = new VisitorStatsStore(join(tempDir, 'plugin-stats.json'));
  const server = await startServer(store);

  try {
    const firstResponse = await fetch(`${server.url}/api/visitor-stats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location: 'Lisbon, Portugal' }),
    });

    assert.equal(firstResponse.status, 200);
    const firstBody = (await firstResponse.json()) as { totalVisits: number; uniqueVisitors: number };
    assert.equal(firstBody.totalVisits, 1);
    assert.equal(firstBody.uniqueVisitors, 1);

    const rawCookie = firstResponse.headers.get('set-cookie');
    assert.ok(rawCookie, 'response should set visitor cookie');
    const visitorCookie = rawCookie.split(';')[0];

    const secondResponse = await fetch(`${server.url}/api/visitor-stats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: visitorCookie,
      },
      body: JSON.stringify({ location: 'Lisbon, Portugal' }),
    });

    assert.equal(secondResponse.status, 200);
    const secondBody = (await secondResponse.json()) as { totalVisits: number; uniqueVisitors: number };
    assert.equal(secondBody.totalVisits, 2);
    assert.equal(secondBody.uniqueVisitors, 1, 'same visitor should not count twice');

    const getResponse = await fetch(`${server.url}/api/visitor-stats`, {
      headers: {
        Cookie: visitorCookie,
      },
    });

    assert.equal(getResponse.status, 200);
    const aggregated = (await getResponse.json()) as { totalVisits: number; locations: Record<string, number> };
    assert.equal(aggregated.totalVisits, 2);
    assert.equal(aggregated.locations['Lisbon, Portugal'], 2);
  } finally {
    await server.close();
  }
});
