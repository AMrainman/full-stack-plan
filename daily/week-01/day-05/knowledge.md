---
week: 1
day: 5
date: 2026-07-08
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, http, middleware, router, Express]
file: knowledge.md
---

# 今日核心知识点

## 1. `app.use` 与 `app.get` 的注册顺序和执行顺序

Express 中所有中间件和路由都按注册顺序放入同一个队列。请求到达时，从队列头部开始依次执行，遇到 `next()` 就继续下一个。

```typescript
app.use(m1);
app.get('/a', h1);
app.use(m2);
app.get('/b', h2);
```

请求 `GET /b` 的执行顺序是：m1 → 尝试匹配 `/a`（不匹配，跳过）→ m2 → h2。也就是说，**注册顺序决定执行顺序**，而路由是否命中只影响「是否执行对应的 handler」。

为什么重要：这是理解 Express 中间件链的核心。很多 bug 源于「以为路由会先匹配再执行中间件」。

常见误区：
- 以为 `app.get` 注册的路由会优先于后面 `app.use` 的中间件执行。
- 在 `app.use(bodyParser)` 之前注册路由，导致路由里拿不到 `req.body`。

## 2. 路由是带条件的中间件

从执行器角度看，`app.get('/podcasts/:id', handler)` 等价于：

```typescript
app.use((req, res, next) => {
  if (req.method === 'GET' && req.url matches '/podcasts/:id') {
    handler(req, res, next);
  } else {
    next();
  }
});
```

路由 handler 和普通中间件的区别只是「多了一层匹配条件」。

为什么重要：理解这一点后，就不会把「中间件」和「路由」当成两个完全不同的东西。

常见误区：
- 认为路由 handler 不能调用 `next()`。
- 认为中间件不能返回响应。

## 3. `next()` 的两种用法

- `next()`：正常进入下一个中间件/路由。
- `next(err)`：跳过普通中间件，直接进入第一个错误处理中间件。

错误处理中间件的签名是 `(err, req, res, next)`，Express 通过函数形参个数（`fn.length === 4`）来识别。

为什么重要：统一的错误处理是生产服务必备的兜底能力。没有它，一个未捕获异常就可能导致连接挂起或进程崩溃。

常见误区：
- 在错误处理中间件里继续调用 `next(err)` 但不处理，导致错误被吞掉。
- 把错误处理中间件放在普通中间件之前注册，导致它永远捕获不到错误。

## 4. `app.use('/api', handler)` 的「路径前缀匹配」

Express 的 `app.use` 支持路径前缀。`app.use('/api', handler)` 会匹配所有以 `/api` 开头的请求。这在真实项目中常用于挂载子路由或统一前缀校验。

今天的手写 `App` 可以先实现不带路径前缀的 `app.use(handler)`，把路径前缀匹配作为扩展练习。

为什么重要：路径前缀匹配是模块化路由（如 `app.use('/users', userRouter)`）的基础。

常见误区：
- 把 `app.use('/api', handler)` 理解为精确匹配 `/api`，而不是前缀匹配。
