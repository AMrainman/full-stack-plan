---
week: 1
day: 5
date: 2026-07-08
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, http, middleware, router, Express]
file: README.md
---

# 今日目标

把 day-04 的路由分发器与中间件执行器组合成一个更接近 Express 的 `App` 对象，理解 `app.use`、`app.get` 的注册顺序与执行顺序，以及错误处理中间件的特殊签名。

## 与本周主题的关系

本周主题「TypeScript + Node.js 热身」到今天进入收尾阶段。前四天分别完成了：

- day-01：TypeScript 环境配置
- day-02：Promise / async-await / Event Loop 复习
- day-03：原生 HTTP 服务 + 中间件流水线
- day-04：原生路由分发器

今天是「最小 HTTP 服务」的最后一环：把中间件和路由封装成 `App` 对象，让它在接口层面几乎等同于 Express 的 `app`。这为下周正式学习 Express 框架打下最直观的认知基础。

## 时间块概览

| 时间段 | 内容 | 时长 |
|--------|------|------|
| 0:00-0:30 | 理论学习：`app.use` 与 `app.get` 的执行顺序、错误处理中间件 | 30min |
| 0:30-1:15 | 动手实践：实现 `demo/app.ts`，支持 use/get/post/put/delete 和错误处理 | 45min |
| 1:15-1:45 | 编码验证：用 `App` 重构播客 CRUD 服务 | 30min |
| 1:45-2:00 | curl 验证中间件、路由、错误处理执行顺序 | 15min |

## 关键产出

- `demo/app.ts`：一个类 Express 的 `App` 对象。
- `demo/minimal-http-server.ts`：基于 `App` 重构的播客 CRUD 服务。
- 对 Express 注册顺序、执行顺序、`next()` 行为有直观理解。

## 前置依赖

- 已完成 day-04 的路由分发器 `demo/router.ts`。
- 已完成 day-03 的中间件执行器 `demo/middleware-runner.ts`。
