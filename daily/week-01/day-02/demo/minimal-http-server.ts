import http from 'node:http';

/**
 * 内存中的播客数据，用于演示 RESTful 接口。
 * 实际项目中会换成数据库。
 */
interface Podcast {
  id: number;
  title: string;
  author: string;
}

const podcasts: Podcast[] = [
  { id: 1, title: '前端乱炖', author: '张三' },
  { id: 2, title: '后端沉思录', author: '李四' },
];

let nextId = podcasts.length + 1;

/**
 * 辅助函数：统一返回 JSON 响应。
 * 这样所有接口的响应格式一致，避免到处写响应头。
 */
function sendJson(res: http.ServerResponse, statusCode: number, data: unknown) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

/**
 * 辅助函数：解析请求体为 JSON。
 * 注意：req 是可读流，需要监听 data 和 end 事件拼接数据。
 */
function parseJsonBody(req: http.IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on('data', (chunk) => {
      // 数据会分片到达，先收集到数组里
      chunks.push(chunk);
    });

    req.on('end', () => {
      try {
        const body = Buffer.concat(chunks).toString('utf-8');
        // 空 body 时返回空对象，避免 JSON.parse 抛异常
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });

    req.on('error', (err) => reject(err));
  });
}

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  try {
    // 健康检查：最简单的一个接口，用来确认服务活着
    if (method === 'GET' && url === '/health') {
      sendJson(res, 200, { status: 'ok' });
      return;
    }

    // 获取播客列表
    if (method === 'GET' && url === '/podcasts') {
      sendJson(res, 200, podcasts);
      return;
    }

    // 获取单个播客详情：从 URL 中解析 id
    if (method === 'GET' && url?.startsWith('/podcasts/')) {
      const id = Number(url.split('/')[2]);
      const podcast = podcasts.find((p) => p.id === id);

      if (!podcast) {
        sendJson(res, 404, { error: 'Podcast not found' });
        return;
      }

      sendJson(res, 200, podcast);
      return;
    }

    // 创建播客：解析 JSON body 并校验必填字段
    if (method === 'POST' && url === '/podcasts') {
      const body = (await parseJsonBody(req)) as Partial<Podcast>;

      if (!body.title || !body.author) {
        sendJson(res, 400, { error: 'title and author are required' });
        return;
      }

      const newPodcast: Podcast = {
        id: nextId++,
        title: body.title,
        author: body.author,
      };

      podcasts.push(newPodcast);
      // 201 表示资源创建成功
      sendJson(res, 201, newPodcast);
      return;
    }

    // 没有匹配到任何路由，返回 404
    sendJson(res, 404, { error: 'Not Found' });
  } catch (err) {
    // 捕获同步和异步异常，防止进程崩溃
    console.error('Request handling error:', err);
    sendJson(res, 500, { error: 'Internal Server Error' });
  }
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
