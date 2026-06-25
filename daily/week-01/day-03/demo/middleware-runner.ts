// 一个最简的中间件执行器：把多个处理函数串成流水线
// 目的：理解 Express / NestJS 框架里「中间件」的本质——函数按顺序处理请求

import http from 'http';

// 中间件可以同步也可以异步；调用 next() 把控制权交给下一个
export type Middleware = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: (err?: Error) => void
) => void | Promise<void>;

export function compose(middlewares: Middleware[]) {
  return function run(req: http.IncomingMessage, res: http.ServerResponse) {
    let index = 0;

    const dispatch = (err?: Error): void => {
      // 如果响应已经结束，不再继续处理，避免写入已关闭的流
      if (res.writableEnded) return;

      const mw = middlewares[index++];

      // 没有更多中间件时，统一处理 404 或未捕获错误
      if (!mw) {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: err.message }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: 'Not Found' }));
        }
        return;
      }

      try {
        // 执行中间件，并捕获同步异常
        const result = mw(req, res, dispatch);

        // 如果是 Promise，还要捕获异步异常
        if (result && typeof result.then === 'function') {
          result.catch(dispatch);
        }
      } catch (e) {
        dispatch(e instanceof Error ? e : new Error(String(e)));
      }
    };

    dispatch();
  };
}
