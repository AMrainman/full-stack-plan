import type { Request, RequestHandler } from './router.ts';
import type { ServerResponse } from 'node:http';

/**
 * 中间件执行器。
 *
 * 作用：把多个 `(req, res, next) => void` 函数串成一条流水线，
 * 让每个中间件决定「继续交给下一个」还是「直接结束响应」。
 */
export function compose(middlewares: RequestHandler[]) {
  return function (req: Request, res: ServerResponse) {
    let index = -1;

    function dispatch(i: number): void {
      if (i <= index) {
        // 防止同一个 next() 被重复调用导致死循环
        throw new Error('next() called multiple times');
      }
      index = i;

      const fn = middlewares[i];
      if (!fn) return;

      const next = () => dispatch(i + 1);

      try {
        const result = fn(req, res, next);
        // 如果 handler 返回 Promise，把异步错误交给全局捕获
        if (result instanceof Promise) {
          result.catch((err) => {
            handleError(err, req, res);
          });
        }
      } catch (err) {
        handleError(err, req, res);
      }
    }

    dispatch(0);
  };
}

function handleError(err: unknown, _req: Request, res: ServerResponse) {
  // 统一错误响应，避免把异常细节暴露给客户端
  const message = err instanceof Error ? err.message : 'Internal Server Error';
  if (!res.headersSent) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: message }));
  }
}
