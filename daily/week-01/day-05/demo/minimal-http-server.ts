import type { ServerResponse } from 'node:http';
import { App } from './app.ts';
import type { Request } from './router.ts';

/**
 * 内存中的播客数据，仅用于演示。
 * 真实项目会用 PostgreSQL，现阶段先关注 App 对象本身。
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

const app = new App();

// 日志中间件：打印 METHOD URL STATUS DURATION
app.use((req: Request, res: ServerResponse, next: (err?: Error) => void) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// 请求体解析中间件：把 JSON body 挂载到 req.body
app.use((req: Request, res: ServerResponse, next: (err?: Error) => void) => {
  if (req.method === 'GET' || req.method === 'DELETE') {
    next();
    return;
  }

  let raw = '';
  req.setEncoding('utf8');
  req.on('data', (chunk: string) => {
    raw += chunk;
  });
  req.on('end', () => {
    if (!raw) {
      req.body = {};
      next();
      return;
    }

    try {
      req.body = JSON.parse(raw);
      next();
    } catch {
      // JSON 解析失败，把错误交给错误处理中间件
      next(new Error('Invalid JSON'));
    }
  });
});

// 健康检查
app.get('/health', (_req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok' }));
});

// 列表 + 按 category 过滤
app.get('/podcasts', (req, res) => {
  const category = req.query?.category as string | undefined;
  const result = category
    ? podcasts.filter((p) => p.category === category)
    : podcasts;

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(result));
});

// 详情
app.get('/podcasts/:id', (req, res) => {
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
app.post('/podcasts', (req, res) => {
  const body = req.body as { title?: string; description?: string; category?: string };

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

// 更新
app.put('/podcasts/:id', (req, res) => {
  const id = Number(req.params?.id);
  const podcast = podcasts.find((p) => p.id === id);

  if (!podcast) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Podcast not found' }));
    return;
  }

  const body = req.body as { title?: string; description?: string; category?: string };

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

// 删除
app.delete('/podcasts/:id', (req, res) => {
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

// 404 兜底中间件：所有普通中间件和路由都没命中时执行
app.use((_req: Request, res: ServerResponse, _next: (err?: Error) => void) => {
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

// 错误处理中间件：4 个参数，负责统一捕获异常
app.use((err, _req, res, _next) => {
  console.error('Error:', err.message);
  if (!res.headersSent) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
});

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
