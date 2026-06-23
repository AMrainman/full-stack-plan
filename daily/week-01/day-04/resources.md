---
week: 1
day: 4
date: 2026-06-23
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, HTTP, Event Loop]
file: resources.md
---

# 学习资源

## 官方文档

- [Node.js http 模块文档](https://nodejs.org/api/http.html)
- [TypeScript 官方手册](https://www.typescriptlang.org/docs/handbook/intro.html)
- [tsx 快速运行 TypeScript](https://github.com/privatenumber/tsx)

## 精选文章

- [Node.js 事件循环详解（Node.js 官方）](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
- [JavaScript 异步编程：Promise / async-await 前端派](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Asynchronous)

## 参考仓库

- [Node.js 官方示例](https://github.com/nodejs/examples)
- [typescript-node-starter](https://github.com/microsoft/TypeScript-Node-Starter)（可作为后续项目模板）

## 练习题

1. 在不重启进程的前提下，如何让 `/api/podcasts` 返回的数据从 JSON 文件读取？
2. 如果路由处理函数里抛出一个未捕获的错误，当前服务会怎么表现？为什么加了 `try/catch` 就安全了？
3. `res.writeHead(200, { 'Content-Type': 'application/json' })` 和先 `res.statusCode = 200` 再 `res.setHeader()` 有什么区别？
