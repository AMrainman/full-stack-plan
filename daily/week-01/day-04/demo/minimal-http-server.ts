import { createServer, type ServerResponse } from 'node:http';
import { compose } from './middleware-runner.ts';
import { Router, type Request } from './router.ts';

/**
 * 内存中的播客数据，仅用于演示。
 * 真实项目会用 PostgreSQL，现阶段先关注路由分发器本身。
 */
interface Podcast {
  id: number;
  title: string;
  description: string;
  category: string;
}

const podcasts: Podcast[] = [
  { id: 1, title: '全栈电台 Vol.1', description: '开场白', category: 'tech' },
  { id: 2, title: 'TypeScript 实战', description: '类型体操', category: 'tech' },
  { id: 3, title: '前端周刊', description: '每周速递', category: 'frontend' },
];

const router = new Router();

// 健康检查
router.get('/health', (_req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok' }));
});

// 列表 + 按 category 过滤
router.get('/podcasts', (req, res) => {
  const category = req.query?.category as string | undefined;
  const result = category
    ? podcasts.filter((p) => p.category === category)
    : podcasts;

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(result));
});

// 详情
router.get('/podcasts/:id', (req, res) => {
  const id = Number(req.params?.id);
  const podcast = podcasts.find((p) => p.id === id);

  if (!podcast) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Podcast not found' }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(podcast));
});

// 创建
router.post('/podcasts', (req, res) => {
  parseBody(req, (err, body) => {
    if (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
      return;
    }

    if (!body.title) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'title is required' }));
      return;
    }

    const newPodcast: Podcast = {
      id: podcasts.length + 1,
      title: body.title,
      description: body.description || '',
      category: body.category || 'uncategorized',
    };
    podcasts.push(newPodcast);

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newPodcast));
  });
});

// 更新
router.put('/podcasts/:id', (req, res) => {
  const id = Number(req.params?.id);
  const podcast = podcasts.find((p) => p.id === id);

  if (!podcast) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Podcast not found' }));
    return;
  }

  parseBody(req, (err, body) => {
    if (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
      return;
    }

    if (!body.title) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'title is required' }));
      return;
    }

    podcast.title = body.title;
    podcast.description = body.description ?? podcast.description;
    podcast.category = body.category ?? podcast.category;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(podcast));
  });
});

// 删除
router.delete('/podcasts/:id', (req, res) => {
  const id = Number(req.params?.id);
  const index = podcasts.findIndex((p) => p.id === id);

  if (index === -1) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Podcast not found' }));
    return;
  }

  const deleted = podcasts.splice(index, 1)[0];
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(deleted));
});

// 日志中间件：打印 METHOD URL STATUS DURATION
function logger(req: Request, res: ServerResponse, next: () => void) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
  });
  next();
}

// 请求体解析中间件：把 JSON body 挂载到 req.body
function bodyParser(req: Request, res: ServerResponse, next: () => void) {
  if (req.method === 'GET' || req.method === 'DELETE') {
    next();
    return;
  }

  let raw = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => {
    raw += chunk;
  });
  req.on('end', () => {
    if (!raw) {
      (req as Request & { body?: unknown }).body = {};
      next();
      return;
    }

    try {
      (req as Request & { body?: unknown }).body = JSON.parse(raw);
      next();
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  });
}

// 辅助函数：读取 req.body，这里简单封装以兼容当前路由 handler 风格
function parseBody(req: Request, callback: (err: Error | null, body: any) => void) {
  const body = (req as Request & { body?: any }).body;
  if (body !== undefined) {
    callback(null, body);
    return;
  }

  let raw = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => (raw += chunk));
  req.on('end', () => {
    try {
      callback(null, raw ? JSON.parse(raw) : {});
    } catch {
      callback(new Error('Invalid JSON'), {});
    }
  });
}

// 404 兜底中间件
function notFound(_req: Request, res: ServerResponse, _next: () => void) {
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
}

const server = createServer((req, res) => {
  const app = compose([logger, bodyParser, router.handler(), notFound]);
  app(req, res);
});

server.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
