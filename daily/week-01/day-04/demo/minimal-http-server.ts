import http from 'node:http';

// 模拟一个简单的异步数据读取：体现 async/await 在 HTTP 回调里的用法
async function fetchPodcasts(): Promise<Array<{ id: number; title: string }>> {
  // 用 setTimeout 模拟 IO 延迟，让主线程可以先处理其他请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: '全栈电台 Vol.1' },
        { id: 2, title: 'TypeScript 实战' },
      ]);
    }, 100);
  });
}

// 发送 JSON 响应的辅助函数：避免每个路由重复写 header
function sendJson(res: http.ServerResponse, statusCode: number, payload: unknown): void {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

// 创建 HTTP 服务器
const server = http.createServer(async (req, res) => {
  try {
    const { method, url } = req;

    // 健康检查：最简单且最有用的端点，部署时用于探活
    if (method === 'GET' && url === '/health') {
      sendJson(res, 200, { status: 'ok' });
      return;
    }

    // 播客列表：带异步 IO 模拟，演示 async 路由处理
    if (method === 'GET' && url === '/api/podcasts') {
      const podcasts = await fetchPodcasts();
      sendJson(res, 200, podcasts);
      return;
    }

    // 兜底 404：未匹配路由必须显式返回，否则客户端会挂起
    sendJson(res, 404, { error: 'Not Found' });
  } catch (error) {
    // 捕获同步 + 异步异常，防止单个请求错误导致整个进程退出
    console.error('Unhandled request error:', error);
    sendJson(res, 500, { error: 'Internal Server Error' });
  }
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
