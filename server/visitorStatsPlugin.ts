import type { IncomingMessage, ServerResponse } from 'http';
import type { Plugin } from 'vite';
import { randomUUID } from 'crypto';
import { visitorStatsStore, type VisitorStatsStore } from './visitorStatsStore';

interface VisitPayload {
  location?: string;
}

const VISITOR_COOKIE_NAME = 'visitor_id';

interface CookieOptions {
  maxAge?: number;
  sameSite?: 'Strict' | 'Lax' | 'None';
  path?: string;
  httpOnly?: boolean;
  secure?: boolean;
}

const parseCookies = (req: IncomingMessage): Record<string, string> => {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(';').reduce<Record<string, string>>((all, part) => {
    const [rawKey, ...rawValue] = part.trim().split('=');
    all[decodeURIComponent(rawKey)] = decodeURIComponent(rawValue.join('='));
    return all;
  }, {});
};

const serializeCookie = (name: string, value: string, options: CookieOptions = {}) => {
  const segments: string[] = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];
  if (typeof options.maxAge === 'number') segments.push(`Max-Age=${options.maxAge}`);
  if (options.sameSite) segments.push(`SameSite=${options.sameSite}`);
  if (options.path) segments.push(`Path=${options.path}`);
  if (options.httpOnly) segments.push('HttpOnly');
  if (options.secure) segments.push('Secure');
  return segments.join('; ');
};

const readRequestBody = async <T>(req: IncomingMessage): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      if (!data) {
        resolve({} as T);
        return;
      }

      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
};

const sendJson = (res: ServerResponse, status: number, payload: unknown) => {
  const json = JSON.stringify(payload);
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(json);
};

const ensureVisitorId = (req: IncomingMessage, res: ServerResponse): string => {
  const cookies = parseCookies(req);
  let visitorId = cookies[VISITOR_COOKIE_NAME];

  if (!visitorId) {
    visitorId = randomUUID();
    const isSecure =
      (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'].toString().includes('https')) ||
      Boolean((req.socket as { encrypted?: boolean }).encrypted);
    const cookie = serializeCookie(VISITOR_COOKIE_NAME, visitorId, {
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'Lax',
      path: '/',
      httpOnly: true,
      secure: isSecure,
    });
    res.setHeader('Set-Cookie', cookie);
  }

  return visitorId;
};

const handleGet = async (res: ServerResponse, store: VisitorStatsStore) => {
  try {
    const stats = await store.getAggregatedStats();
    sendJson(res, 200, stats);
  } catch (error) {
    console.error('Unable to fetch visitor stats', error);
    sendJson(res, 500, { error: 'failed_to_read_stats' });
  }
};

const handlePost = async (req: IncomingMessage, res: ServerResponse, store: VisitorStatsStore) => {
  const visitorId = ensureVisitorId(req, res);

  try {
    const body = await readRequestBody<VisitPayload>(req);
    const stats = await store.recordVisit(visitorId, body.location);
    sendJson(res, 200, stats);
  } catch (error) {
    console.error('Unable to record visit', error);
    sendJson(res, 500, { error: 'failed_to_record_visit' });
  }
};

export const createVisitorStatsMiddleware =
  (store: VisitorStatsStore = visitorStatsStore) => async (req: IncomingMessage, res: ServerResponse) => {
    if (!req.url || !req.url.startsWith('/api/visitor-stats')) {
      return false;
    }

    if (req.method === 'GET') {
      await handleGet(res, store);
      return true;
    }

    if (req.method === 'POST') {
      await handlePost(req, res, store);
      return true;
    }

    res.statusCode = 405;
    res.setHeader('Allow', 'GET, POST');
    res.end();
    return true;
  };

export const visitorStatsPlugin = (): Plugin => ({
  name: 'visitor-stats-plugin',
  configureServer(server) {
    const middleware = createVisitorStatsMiddleware();
    server.middlewares.use(async (req, res, next) => {
      const handled = await middleware(req, res);
      if (!handled) {
        next();
      }
    });
  },
  configurePreviewServer(server) {
    return () => {
      const middleware = createVisitorStatsMiddleware();
      server.middlewares.use(async (req, res, next) => {
        const handled = await middleware(req, res);
        if (!handled) {
          next();
        }
      });
    };
  },
});
