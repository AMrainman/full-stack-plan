import type { IncomingMessage, ServerResponse } from 'node:http';

// 扩展 Node.js 原生请求对象，附加路由解析结果
export interface Request extends IncomingMessage {
  params?: Record<string, string>;
  query?: Record<string, string | string[]>;
}

// 路由处理函数签名，与 Express 的 handler 类似
export type RequestHandler = (req: Request, res: ServerResponse, next: () => void) => void | Promise<void>;

interface Route {
  method: string;
  path: string;
  pattern: RegExp;
  paramNames: string[];
  handler: RequestHandler;
}

/**
 * 原生路由分发器。
 *
 * 为什么不用 Express？
 * 通过手写路由表，理解 `app.get('/podcasts/:id', handler)` 底层就是：
 * 1. 把路径模板转成正则；
 * 2. 用 req.method + req.url 去匹配；
 * 3. 命中后把捕获值填进 req.params。
 */
export class Router {
  private routes: Route[] = [];

  get(path: string, handler: RequestHandler) {
    this.register('GET', path, handler);
  }

  post(path: string, handler: RequestHandler) {
    this.register('POST', path, handler);
  }

  put(path: string, handler: RequestHandler) {
    this.register('PUT', path, handler);
  }

  delete(path: string, handler: RequestHandler) {
    this.register('DELETE', path, handler);
  }

  private register(method: string, path: string, handler: RequestHandler) {
    const { pattern, paramNames } = this.pathToPattern(path);
    this.routes.push({ method, path, pattern, paramNames, handler });
  }

  /**
   * 把 `/podcasts/:id` 转成正则 /^\/podcasts\/([^\/]+)$/
   * 同时收集参数名 ['id']。
   */
  private pathToPattern(path: string): { pattern: RegExp; paramNames: string[] } {
    const paramNames: string[] = [];
    // 把 :id 替换为捕获组，并记录参数名
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
   * 返回一个可作为中间件使用的 handler。
   * 匹配成功则执行对应路由 handler；匹配失败调用 next() 交给后续中间件（如 404 处理）。
   */
  handler(): RequestHandler {
    return (req, res, next) => {
      const url = new URL(req.url || '/', 'http://localhost');
      const pathname = url.pathname;

      for (const route of this.routes) {
        if (route.method !== req.method) continue;

        const match = route.pattern.exec(pathname);
        if (!match) continue;

        // 解析路径参数
        req.params = {};
        route.paramNames.forEach((name, index) => {
          req.params![name] = match[index + 1];
        });

        // 解析查询参数
        req.query = Object.fromEntries(url.searchParams.entries());

        route.handler(req, res, next);
        return;
      }

      // 没有命中任何路由，交给后续中间件
      next();
    };
  }
}
