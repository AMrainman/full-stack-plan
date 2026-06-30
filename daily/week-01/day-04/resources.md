---
week: 1
day: 4
date: 2026-06-30
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, http, router, middleware]
file: resources.md
---

# 学习资源

## 官方文档

- [Node.js http 模块文档](https://nodejs.org/api/http.html)
- [Express 路由指南](https://expressjs.com/en/guide/routing.html)
- [TypeScript 官方手册](https://www.typescriptlang.org/docs/handbook/intro.html)

## 精选文章

- [从零实现 Express 系列（路由篇）](https://github.com/ruanyf/node-cookbook)
- [JavaScript URL 对象与 URLSearchParams](https://developer.mozilla.org/zh-CN/docs/Web/API/URL)
- [Express 源码解析：路由系统](https://segmentfault.com/a/1190000008244918)

## 参考仓库

- [tiny-node-router](https://github.com/)
- [koa-router 源码](https://github.com/koajs/router)（看它是如何用正则匹配路径参数的）

## 练习题

1. 如果不使用正则，只用 `String.prototype.split`，如何实现路径参数解析？边界情况有哪些？
2. 为什么 `req.url` 包含查询参数时，`new URL(req.url, 'http://localhost')` 能正确解析？第二个参数的作用是什么？
3. 路由表按「先注册先匹配」有什么潜在问题？Express 是如何优化的？
