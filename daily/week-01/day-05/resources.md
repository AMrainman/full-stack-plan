---
week: 1
day: 5
date: 2026-07-08
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, http, middleware, router, Express]
file: resources.md
---

# 学习资源

## 官方文档

- [Express 路由指南](https://expressjs.com/zh-cn/guide/routing.html)
- [Express 中间件指南](https://expressjs.com/zh-cn/guide/using-middleware.html)
- [Express 错误处理](https://expressjs.com/zh-cn/guide/error-handling.html)
- [Node.js http 模块](https://nodejs.org/api/http.html)

## 精选文章

- [Express 中间件执行机制详解](https://expressjs.com/zh-cn/guide/writing-middleware.html)
- [从 0 实现 Express（英文）](https://github.com/ryanmcdermott/express-from-scratch) — 可作为手写 App 的参考思路

## 参考仓库

- 暂无外部仓库，以当天 `demo/app.ts` 为准。

## 练习题

1. 给 `app.use` 增加路径前缀支持：`app.use('/api', handler)` 只匹配以 `/api` 开头的请求。
2. 在 `App` 中实现 `app.all(path, handler)`，让它匹配所有 HTTP 方法。
3. 尝试实现子路由挂载：`app.use('/podcasts', podcastRouter)`，其中 `podcastRouter` 本身也是一个 `App` 实例。
4. 测试错误处理中间件：在 handler 里 `throw new Error('boom')`，验证 4 参数错误处理中间件能否正确返回 500。
