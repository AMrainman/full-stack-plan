import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

// 数据文件路径：用 __dirname 保证从任意目录启动都能找到文件
const DATA_FILE = path.join(__dirname, 'podcasts.json');

// 播客类型定义：提前约束字段，避免后续拼写错误
interface Podcast {
  id: number;
  title: string;
  category: string;
}

// 从 JSON 文件读取播客列表：启动时加载，模拟数据库初始化
function loadPodcasts(): Podcast[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as Podcast[];
  } catch (error) {
    // 文件不存在或解析失败时返回默认值，避免启动崩溃
    console.warn('无法读取 podcasts.json，使用默认数据:', error);
    return [
      { id: 1, title: '全栈电台 Vol.1', category: 'tech' },
      { id: 2, title: 'TypeScript 实战', category: 'tech' },
      { id: 3, title: '设计生活', category: 'design' },
    ];
  }
}

// 把播客列表写回 JSON 文件：同步写入，开发环境足够
function savePodcasts(podcasts: Podcast[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(podcasts, null, 2), 'utf-8');
}

// 全局内存数据：实际生产应使用数据库，这里用文件 + 内存演示状态管理
let podcasts = loadPodcasts();

// 发送 JSON 响应的辅助函数：统一 Content-Type 和编码
function sendJson(res: http.ServerResponse, statusCode: number, payload: unknown): void {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

// 解析请求体：req 是流，需要拼接 chunk
function parseBody(req: http.IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

// 创建 HTTP 服务器
const server = http.createServer(async (req, res) => {
  try {
    const { method, url } = req;

    // 健康检查
    if (method === 'GET' && url === '/health') {
      sendJson(res, 200, { status: 'ok' });
      return;
    }

    // 解析 URL 和查询参数：用基地址补全，避免 req.url 是相对路径导致 URL 构造失败
    const requestUrl = new URL(url || '/', 'http://localhost');
    const pathname = requestUrl.pathname;
    const category = requestUrl.searchParams.get('category');

    // GET /api/podcasts：支持 ?category=xxx 过滤
    if (method === 'GET' && pathname === '/api/podcasts') {
      const result = category
        ? podcasts.filter((p) => p.category === category)
        : podcasts;
      sendJson(res, 200, result);
      return;
    }

    // POST /api/podcasts：解析 JSON 请求体并持久化
    if (method === 'POST' && pathname === '/api/podcasts') {
      const body = await parseBody(req) as Partial<Podcast>;

      if (!body.title || typeof body.title !== 'string') {
        sendJson(res, 400, { error: 'title 是必填字段' });
        return;
      }

      const newPodcast: Podcast = {
        id: podcasts.length > 0 ? podcasts[podcasts.length - 1].id + 1 : 1,
        title: body.title,
        category: body.category || 'uncategorized',
      };

      podcasts.push(newPodcast);
      savePodcasts(podcasts);
      sendJson(res, 201, newPodcast);
      return;
    }

    // 兜底 404
    sendJson(res, 404, { error: 'Not Found' });
  } catch (error) {
    console.error('Unhandled request error:', error);
    sendJson(res, 500, { error: 'Internal Server Error' });
  }
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
