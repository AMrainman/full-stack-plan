---
week: 1
day: 3
date: 2026-06-25
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, http, middleware, async-await, error-handling]
file: knowledge.md
---

# 核心知识点

## 1. 什么是中间件

中间件（middleware）是请求处理流水线中的函数，它接收 `req`、`res` 和 `next`：

- 可以修改 `req` / `res`。
- 可以结束响应（不再调用 `next`）。
- 可以调用 `next()` 把控制权交给下一个中间件。
- 可以调用 `next(err)` 把错误交给错误处理中间件。

```ts
type Middleware = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: (err?: Error) => void
) => void | Promise<void>;
```

### 为什么中间件很重要

- **关注点分离**：日志、请求体解析、鉴权、路由各司其职。
- **可复用**：同一份日志中间件可以挂在所有路由上。
- **框架基础**：Express 的 `app.use()`、NestJS 的 `MiddlewareConsumer` 都是这种模式的扩展。

## 2. 原生 `http` 中实现中间件的关键

原生 `http` 没有 `app.use()`，但可以用一个数组保存所有中间件，然后按顺序调用：

```ts
const dispatch = (err?: Error) => {
  const mw = stack[index++];
  if (!mw) { /* 没有更多中间件，处理 404 或错误 */ }
  // 调用中间件，并捕获同步/异步异常
};
```

### 常见陷阱

- **忘记调用 `next()`**：请求会挂起，客户端一直等待。
- **多次调用 `next()`**：可能导致重复响应或异常。
- **响应结束后还调用 `next()`**：会写入已关闭的流，触发 `ERR_HTTP_HEADERS_SENT`。

## 3. 异步错误处理

Node.js 原生 `http` 的回调里如果抛出同步异常，进程会崩溃（除非用 `process.on('uncaughtException')`，但那是兜底方案）。对于中间件：

- 同步错误用 `try / catch` 捕获。
- 异步错误在返回的 Promise 上 `.catch(next)`。
- 错误统一交给最后一个中间件返回 JSON，避免进程崩溃。

### 为什么 `async` 中间件容易漏掉错误

```ts
const router = async (req, res, next) => {
  const data = await parseBody(req); // 如果这里 reject，没有 .catch 就会 unhandledRejection
};
```

正确做法是在执行器里把 Promise 结果和异常一起管：

```ts
const result = mw(req, res, dispatch);
if (result && typeof result.then === 'function') {
  result.catch(dispatch);
}
```

## 4. 请求体解析的健壮性

day-02 的请求体解析能跑通示例，但边界情况容易漏：

| 场景 | 期望行为 |
|------|----------|
| 空 body | 返回空对象或交给校验层处理，不要 `JSON.parse('')` 报错 |
| 非法 JSON | 返回 400，并给出明确错误信息 |
| `Content-Type` 不对 | 教学阶段可暂不强制，但生产环境应校验 |
| body 过大 | 应设置上限，防止内存被打爆 |

## 5. Express 与原生 `http` 的关系

Express 本质上是对 `http.createServer` 的封装：

- `app.use(mw)` 把中间件 push 到内部数组。
- `app.get('/path', handler)` 把路由和处理器一起注册。
- `next()` 内部就是按数组顺序调用下一个匹配项。

理解原生实现后，再看 Express 源码或 NestJS 中间件会轻松很多。
