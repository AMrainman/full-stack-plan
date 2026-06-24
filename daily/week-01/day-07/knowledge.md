---
week: 1
day: 7
date: 2026-06-24
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, 复盘, Express, 预习]
file: knowledge.md
---

# 本周核心知识回顾

## 1. TypeScript 编译配置

为什么重要：TypeScript 是后端开发的类型安全基础，`tsconfig.json` 决定了编译目标、模块系统、严格程度。

常见误区：
- 以为 `strict: true` 只是多报几个错，实际上它能避免大量运行时问题。
- 混淆 `module` 与 `moduleResolution`，前者决定输出模块格式，后者决定模块查找策略。

## 2. Promise 链与错误处理

为什么重要：Node.js 中大量异步操作依赖 Promise，错误处理不当会导致未捕获异常。

常见误区：
- 在 `.then()` 中抛出错误却没有 `.catch()`。
- `async/await` 中忘记 `try/catch`，导致错误被吞掉。

## 3. Event Loop

为什么重要：理解 macrotask 与 microtask 的执行顺序，是排查异步 bug 和性能问题的基础。

常见误区：
- 认为 `setTimeout(fn, 0)` 会立即执行。
- 混淆 `process.nextTick` 与 `Promise.then` 的优先级。

## 4. 原生 HTTP 服务

为什么重要：Express 等框架都建立在 `http` 模块之上，理解原生实现能更清楚框架在做什么。

常见误区：
- 忽略 `req` / `res` 的流式特性，一次性读取大请求体导致内存问题。
- 不设置 `Content-Type` 或状态码，客户端无法正确解析响应。

## 5. 中间件概念

为什么重要：中间件是 Express/Koa/NestJS 的核心设计模式，掌握它才能理解框架的请求处理流程。

常见误区：
- 忘记调用 `next()`，导致后续中间件不执行。
- 在异步中间件中不处理错误，导致请求挂起。

## 6. 下周 Express 预习重点

- `app.get/post/put/delete` 路由注册与路径参数。
- `req` / `res` / `next` 对象的核心属性与方法。
- 中间件执行顺序与错误处理中间件。
- 如何用 Express 替代原生 `http` 实现播客 CRUD。
