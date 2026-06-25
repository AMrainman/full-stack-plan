---
week: 1
day: 3
date: 2026-06-25
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, http, middleware, async-await, error-handling]
file: resources.md
---

# 学习资源

## 官方文档

- [Node.js http 模块官方文档](https://nodejs.org/api/http.html)
- [Express 中间件文档](https://expressjs.com/en/guide/using-middleware.html)
- [Node.js 错误处理最佳实践](https://nodejs.org/en/learn/modules/error-handling)

## 精选文章

- [HTTP 状态码速查](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)
- [Content-Type 对照表](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Type)
- [JavaScript async/await 错误处理指南](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Asynchronous/Async_await)

## 视频

- 搜索关键词：「Node.js 手写中间件」「Express middleware 原理」「async await 错误处理」

## 练习

- 给 `middleware-runner.ts` 增加一个「限流大小」的 body 解析器，当 body 超过 1MB 时返回 413。
- 给日志中间件增加 `X-Request-Id` 请求头追踪。
- 尝试把 `router` 拆成按 `req.method` 分发的独立处理函数。
