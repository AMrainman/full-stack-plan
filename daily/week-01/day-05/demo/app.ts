import { createServer, type ServerResponse } from 'node:http';
import type { Request, RequestHandler, ErrorHandler } from './router.ts';

/**
 * 类 Express 的 App 对象。
 *
 * 为什么需要它？
 * day-03 的中间件执行器和 day-04 的路由分发器是两个独立模块。
 * 真实框架（如 Express）把它们封装成一个 `app`，让使用者只需关心：
 *   app.use(middleware)
 *   app.get('/path', handler)
 *   app.listen(3000)
 * 今天我们要亲手把这两个能力合在一起。
 *
 * 核心设计：
 * Express 把所有 `app.use` 和 `app.get` 都按注册顺序放入同一个「层」队列。
 * 请求到达后按顺序执行每一层：
 * - 普通中间件层：直接执行 handler；
 * - 路由层：先匹配 method + path，命中才执行对应 handler，否则 next() 跳过。
 */
interface MiddlewareLayer {
  type: 'middleware';
  handler: RequestHandler;
}

interface RouteLayer {
  type: 'route';
  method: string;
  path: string;
  pattern: RegExp;
  paramNames: string[];
  handler: RequestHandler;
}

type Layer = MiddlewareLayer | RouteLayer;

export class App {
  // 普通中间件 + 路由层，按注册顺序存放
  private layers: Layer[] = [];
  // 错误处理中间件队列（4 参数 app.use 注册）
  private errorHandlers: ErrorHandler[] = [];

  /**
   * 注册中间件或错误处理中间件。
   *
   * 判断技巧：Express 通过函数形参个数区分错误处理中间件。
   * 如果 handler.length === 4，说明是 (err, req, res, next)，放入错误处理队列。
   */
  use(handler: RequestHandler | ErrorHandler) {
    if (handler.length === 4) {
      this.errorHandlers.push(handler as ErrorHandler);
    } else {
      this.layers.push({ type: 'middleware', handler: handler as RequestHandler });
    }
  }

  get(path: string, handler: RequestHandler) {
    this.addRoute('GET', path, handler);
  }

  post(path: string, handler: RequestHandler) {
    this.addRoute('POST', path, handler);
  }

  put(path: string, handler: RequestHandler) {
    this.addRoute('PUT', path, handler);
  }

  delete(path: string, handler: RequestHandler) {
    this.addRoute('DELETE', path, handler);
  }

  private addRoute(method: string, path: string, handler: RequestHandler) {
    const { pattern, paramNames } = this.pathToPattern(path);
    this.layers.push({ type: 'route', method, path, pattern, paramNames, handler });
  }

  /**
   * 把 `/podcasts/:id` 转成正则 /^\/podcasts\/([^\/]+)$/
   * 同时收集参数名 ['id']。
   */
  private pathToPattern(path: string): { pattern: RegExp; paramNames: string[] } {
    const paramNames: string[] = [];
    const regexSource = path
      .replace(/:([^/]+)/g, (_, name) => {
        paramNames.push(name);
        return '([^/]+)';
      })
      .replace(/\//g, '\\/');

    return {
      pattern: new RegExp(`^${regexSource}$`),
      paramNames,
    };
  }

  /**
   * 返回一个可被 createServer 使用的请求处理函数。
   *
   * 执行顺序：
   * 1. 按注册顺序遍历 layers；
   * 2. 普通中间件层直接执行；
   * 3. 路由层先匹配 method + path，命中则执行 handler，否则 next()；
   * 4. 如果任何一步调用 next(err)，立即切换到错误处理中间件链。
   */
  handler(): (req: Request, res: ServerResponse) => void {
    return (req, res) => {
      let index = -1;

      const dispatch = (i: number, err?: Error): void => {
        if (i <= index) {
          // 防止同一个 next() 被重复调用
          throw new Error('next() called multiple times');
        }
        index = i;

        // 如果发生了错误，跳过剩余普通中间件，进入错误处理链
        if (err) {
          this.runErrorHandlers(err, req, res);
          return;
        }

        const layer = this.layers[i];
        if (!layer) return;

        // 根据层的类型，生成当前要执行的 handler
        let fn: RequestHandler;
        if (layer.type === 'middleware') {
          fn = layer.handler;
        } else {
          fn = this.createRouteHandler(layer);
        }

        const next = (error?: Error) => dispatch(i + 1, error);

        try {
          const result = fn(req, res, next);
          if (result instanceof Promise) {
            result.catch((e) => {
              next(e instanceof Error ? e : new Error(String(e)));
            });
          }
        } catch (e) {
          next(e instanceof Error ? e : new Error(String(e)));
        }
      };

      dispatch(0);
    };
  }

  /**
   * 根据路由层生成一个匹配后执行的 handler。
   */
  private createRouteHandler(layer: RouteLayer): RequestHandler {
    return (req, res, next) => {
      if (req.method !== layer.method) {
        next();
        return;
      }

      const url = new URL(req.url || '/', 'http://localhost');
      const match = layer.pattern.exec(url.pathname);
      if (!match) {
        next();
        return;
      }

      // 解析路径参数
      req.params = {};
      layer.paramNames.forEach((name, index) => {
        req.params![name] = match[index + 1];
      });

      // 解析查询参数
      req.query = Object.fromEntries(url.searchParams.entries());

      layer.handler(req, res, next);
    };
  }

  /**
   * 按注册顺序执行错误处理中间件。
   *
   * 只要有一个错误处理中间件返回响应，流程就结束了。
   * 如果都调用了 next(err) 或都没处理，最后兜底返回 500。
   */
  private runErrorHandlers(err: Error, req: Request, res: ServerResponse) {
    let index = -1;

    const dispatch = (i: number, currentErr: Error): void => {
      if (i <= index) return;
      index = i;

      const fn = this.errorHandlers[i];
      if (!fn) {
        // 没有更多错误处理中间件，兜底响应
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: currentErr.message }));
        }
        return;
      }

      const next = (error?: Error) => {
        if (error) {
          dispatch(i + 1, error);
        }
        // next() 不带参数时，默认当前错误处理中间件已返回响应
      };

      try {
        fn(currentErr, req, res, next);
      } catch (e) {
        dispatch(i + 1, e instanceof Error ? e : new Error(String(e)));
      }
    };

    dispatch(0, err);
  }

  /**
   * 启动 HTTP 服务。
   */
  listen(port: number, callback?: () => void) {
    const server = createServer((req, res) => {
      this.handler()(req as Request, res);
    });
    server.listen(port, callback);
  }
}
