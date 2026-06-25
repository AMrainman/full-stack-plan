// 用 Node.js 原生 http 模块实现基于中间件的完整 CRUD 服务
// 目的：把日志、请求体解析、业务路由拆成独立中间件，理解请求处理流水线

import http from 'http';
import { compose, Middleware } from './middleware-runner';

const PORT = 3000;

// 内存数据：模拟数据库
interface Podcast {
  id: number;
  title: string;
  description: string;
}

let podcasts: Podcast[] = [
  { id: 1, title: '前端下午茶', description: 'Vue 与工程化' },
  { id: 2, title: '后端夜话', description: 'Node.js 基础' },
];
let nextId = 3;

// 辅助：统一返回 JSON，避免每个路由重复写响应头
const sendJson = (res: http.ServerResponse, status: number, data: unknown) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
};

// 辅助：把 req 可读流中的数据拼成字符串并解析为 JSON
const parseBody = (req: http.IncomingMessage): Promise<Partial<Podcast>> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on('data', (chunk) => chunks.push(chunk));

    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf-8');
      if (!raw) {
        // 空 body 不算语法错误，返回空对象让校验层处理
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });

    req.on('error', reject);
  });
};

// 中间件 1：日志
// 在响应 finish 事件触发后打印耗时，确保能拿到最终状态码
const logger: Middleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
  });

  next();
};

// 中间件 2：请求体解析
// 只对可能携带 body 的方法读取 req 流，避免不必要的工作
const bodyParser: Middleware = async (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    try {
      // 扩展 req 类型以保存 body，教学阶段用类型断言简化
      (req as any).body = await parseBody(req);
    } catch (err) {
      next(err instanceof Error ? err : new Error(String(err)));
      return;
    }
  }
  next();
};

// 中间件 3：业务路由
const router: Middleware = async (req, res, next) => {
  const url = req.url || '/';
  const method = req.method || '';

  // GET /health：健康检查
  if (method === 'GET' && url === '/health') {
    sendJson(res, 200, { status: 'ok' });
    return;
  }

  // GET /podcasts：列表
  if (method === 'GET' && url === '/podcasts') {
    sendJson(res, 200, podcasts);
    return;
  }

  // 匹配 /podcasts/:id 这类路径
  const detailMatch = url.match(/^\/podcasts\/(\d+)$/);

  // GET /podcasts/:id：详情
  if (detailMatch && method === 'GET') {
    const id = Number(detailMatch[1]);
    const item = podcasts.find((p) => p.id === id);
    if (!item) {
      sendJson(res, 404, { error: 'Podcast not found' });
      return;
    }
    sendJson(res, 200, item);
    return;
  }

  // POST /podcasts：创建
  if (method === 'POST' && url === '/podcasts') {
    const body = (req as any).body || {};
    if (!body.title || typeof body.title !== 'string') {
      sendJson(res, 400, { error: 'title is required' });
      return;
    }
    const newPodcast: Podcast = {
      id: nextId++,
      title: body.title,
      description: body.description || '',
    };
    podcasts.push(newPodcast);
    sendJson(res, 201, newPodcast);
    return;
  }

  // PUT /podcasts/:id：更新
  if (detailMatch && method === 'PUT') {
    const id = Number(detailMatch[1]);
    const index = podcasts.findIndex((p) => p.id === id);
    if (index === -1) {
      sendJson(res, 404, { error: 'Podcast not found' });
      return;
    }
    const body = (req as any).body || {};
    if (!body.title || typeof body.title !== 'string') {
      sendJson(res, 400, { error: 'title is required' });
      return;
    }
    podcasts[index] = {
      ...podcasts[index],
      title: body.title,
      description: body.description || podcasts[index].description,
    };
    sendJson(res, 200, podcasts[index]);
    return;
  }

  // DELETE /podcasts/:id：删除
  if (detailMatch && method === 'DELETE') {
    const id = Number(detailMatch[1]);
    const index = podcasts.findIndex((p) => p.id === id);
    if (index === -1) {
      sendJson(res, 404, { error: 'Podcast not found' });
      return;
    }
    const removed = podcasts.splice(index, 1)[0];
    sendJson(res, 200, removed);
    return;
  }

  // 没有命中任何路由，交给下游（最终会变成 404）
  next();
};

const server = http.createServer(compose([logger, bodyParser, router]));

server.listen(PORT, () => {
  console.log(`服务器已启动：http://localhost:${PORT}`);
  console.log('测试命令：curl http://localhost:3000/health');
});
