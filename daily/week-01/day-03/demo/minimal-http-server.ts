// 用 Node.js 原生 http 模块实现最小 JSON 服务
// 目的：理解请求进来后，服务器如何根据 URL 和 Method 返回不同响应

import { createServer, IncomingMessage, ServerResponse } from 'http';

const PORT = 3000;

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  // 统一设置 JSON 响应头，让客户端知道返回的是 JSON
  const writeJson = (statusCode: number, data: unknown) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
  };

  // 只对 GET /api/hello 返回成功 JSON，演示最简单的路由判断
  if (req.method === 'GET' && req.url === '/api/hello') {
    writeJson(200, { message: 'Hello from Node.js' });
    return;
  }

  // 其他路径统一返回 404，避免客户端收到无意义的 200 空响应
  writeJson(404, { error: 'Not Found' });
});

server.listen(PORT, () => {
  console.log(`服务器已启动：http://localhost:${PORT}`);
  console.log('测试命令：curl http://localhost:3000/api/hello');
});
