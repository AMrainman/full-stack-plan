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
  - res.json() — 发送 JSON
  - res.send() — 发送任意内容
  - res.end() — 发送空响应或原始数据
  - res.redirect() — 重定向
  - res.sendFile() — 发送文件
  - res.render() — 渲染模板
  - res.download() — 触发文件下载
  - res.sendStatus() — 只发状态码（如 res.sendStatus(204)）
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

## 6. Express 详解

Express 是目前 Node.js 生态里最流行的 Web 框架之一，它的核心哲学是**最小化、灵活、中间件驱动**：只提供一套请求/响应封装和中间件调度机制，路由、模板、静态文件等功能都通过中间件或子模块扩展。

### 6.1 核心抽象

| 抽象 | 作用 |
|------|------|
| `Application`（`app`） | 整个 Web 应用实例，负责注册中间件、监听端口 |
| `Router` | 子路由分组，支持模块化路由定义 |
| `Middleware` | `(req, res, next) => void` 形式的处理函数 |
| `Request` / `Response` | 对原生 `http.IncomingMessage` 和 `http.ServerResponse` 的扩展 |
| 错误处理中间件 | `(err, req, res, next) => void`，必须带 4 个参数 |

### 6.2 常用 API

```ts
import express, { Request, Response, NextFunction } from 'express';

const app = express();

// 解析 JSON 请求体（Express 4.16+ 内置）
app.use(express.json());

// 应用级中间件：记录请求日志
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// 路由处理器
app.get('/users/:id', (req: Request, res: Response) => {
  // req.params 来自路径参数
  res.json({ id: req.params.id, name: 'Alice' });
});

// 错误处理中间件必须放在所有路由之后
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});
```

### 6.3 异步错误为什么容易漏

Express 的中间件签名基于回调，5.0以下对 `async` 函数没有原生支持：

```ts
// ❌ 错误：Promise reject 后不会进入错误处理中间件
app.get('/bad', async (_req, res) => {
  const data = await fetchData(); // 如果 reject，会得到 unhandledRejection
  res.json(data);
});

// ✅ 正确：手动把异常交给 next(err)
app.get('/good', async (_req, res, next) => {
  try {
    const data = await fetchData();
    res.json(data);
  } catch (err) {
    next(err);
  }
});
```

这也是很多 Express 项目会封装 `catchAsync` 工具函数的原因：

```ts
const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
```

### 6.4 Express 的优势与适用场景

- **生态极其丰富**：几乎任何需求都有现成中间件。
- **学习资料多**：文档、教程、招聘信息齐全。
- **约定明确**：适合团队快速上手、维护成本可控。
- **适用场景**：中小型项目、传统 MVC、需要快速交付的业务。

## 7. Koa 详解

Koa 由 Express 原班团队打造，设计目标是**更现代、更轻量、更优雅**。它把 Node.js 的 `req` / `res` 封装成一个 `Context` 对象，并基于 ES2017 的 `async/await` 和**洋葱模型**组织中间件。

### 7.1 核心抽象

| 抽象 | 作用 |
|------|------|
| `Application`（`app`） | 应用实例，通过 `app.use()` 注册中间件 |
| `Context`（`ctx`） | 单次请求的上下文，聚合 `ctx.request`、`ctx.response`、`ctx.req`、`ctx.res` |
| `Middleware` | `async (ctx, next) => void` 形式的函数 |
| 洋葱模型 | 中间件先顺序进入，再逆序返回，形成“洋葱”状执行流 |

### 7.2 常用 API

```ts
import Koa from 'koa';
import Router from '@koa/router';

const app = new Koa();
const router = new Router();

// 洋葱模型中间件：进入和离开都会执行
app.use(async (ctx, next) => {
  const start = Date.now();
  console.log(`→ ${ctx.method} ${ctx.url}`);
  await next(); // 进入下一个中间件
  const ms = Date.now() - start;
  console.log(`← ${ctx.method} ${ctx.url} - ${ms}ms`);
});

router.get('/users/:id', (ctx) => {
  // 直接给 ctx.body 赋值即可返回响应
  ctx.body = { id: ctx.params.id, name: 'Bob' };
});

app.use(router.routes()).use(router.allowedMethods());

app.on('error', (err) => {
  console.error('server error', err);
});
```

### 7.3 洋葱模型图解

假设注册了三个中间件 A、B、C，执行顺序如下：

```text
A 开始
  B 开始
    C 开始
    C 结束
  B 结束
A 结束
```

这种模型天然适合：

- **请求耗时统计**：在 A 里 `await next()` 前后各记一次时间。
- **统一错误捕获**：最外层用 `try { await next(); } catch (err) { ... }`。
- **上下文注入**：在中间件里给 `ctx.state` 挂载用户信息，后续中间件都能读取。

### 7.4 统一的异步错误处理

由于 Koa 的中间件都是 `async` 函数，可以用最外层的 `try/catch` 统一捕获：

```ts
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // 任何中间件抛出的异常都会汇聚到这里
    ctx.status = err.status || 500;
    ctx.body = { error: err.message };
  }
});
```

这是 Koa 相比 Express 在异步代码上最显著的优势：**不需要在每个路由里写 `try/catch` 或 `next(err)`**。

## 8. Express vs Koa 对比

本质区别就一句话：Koa 的洋葱模型让错误可以沿 async 调用链自然冒泡，Express 的中间件链是割裂的，错误只能靠 next(err) 手动传递。

| 对比维度 | Express | Koa |
|----------|---------|-----|
| 设计哲学 | 功能丰富、开箱即用 | 极简内核、按需组装 |
| 中间件模型 | 线性数组，基于回调 | 洋葱模型，基于 `async/await` |
| 内置功能 | 路由、静态文件、JSON 解析、模板引擎等 | 几乎无内置功能，路由需 `@koa/router` |
| 错误处理 | 同步错误自动捕获；异步错误需手动 `next(err)` | 最外层 `try/catch` 统一捕获异步错误 |
| 体积 | 相对较大 | 核心极小 |
| 生态 | 庞大，中间件数不胜数 | 精而小，质量普遍较高 |
| 学习曲线 | 平缓 | 需理解洋葱模型和 Context |
| 团队熟悉度 | 高 | 相对较低 |
| 典型适用场景 | 快速 CRUD、传统 MVC、团队技能树偏 Express | 高并发 API、复杂中间件链、现代 Node.js 项目 |

### 8.1 错误处理差异示例

同样的逻辑在 Express 和 Koa 中的写法对比：

```ts
// Express：每个 async 路由都要处理异常
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await findUser(req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Koa：异常自然向上冒泡到最外层错误中间件
router.get('/users/:id', async (ctx) => {
  const user = await findUser(ctx.params.id);
  ctx.body = user;
});
```

### 8.2 中间件执行顺序差异

```ts
// Express：线性执行，A -> B -> C，结束即结束
app.use(A);
app.use(B);
app.use(C);

// Koa：洋葱执行，A 进入 -> B 进入 -> C -> B 离开 -> A 离开
app.use(A);
app.use(B);
app.use(C);
```

## 9. 如何选择

- **选 Express**：团队熟悉、项目周期紧、需要大量现成中间件、招聘维护成本敏感。
- **选 Koa**：项目以 API 为主、中间件链路复杂、希望用 `async/await` 写出更整洁的异步代码、愿意接受较小的生态。

在后续学习 NestJS 时你会发现，NestJS 默认底层就是 Express（也可切换到 Fastify），因此**先理解 Express 的中间件思想和 Koa 的洋葱模型**，对理解现代 Node.js 框架设计非常有帮助。
