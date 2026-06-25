---
week: 1
day: 3
date: 2026-06-25
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, http, middleware, async-await, error-handling]
file: README.md
---

# 第 1 周第 3 天：中间件、异步错误处理与完整 CRUD

## 今日目标

- 理解「中间件」概念：用函数把日志、请求体解析、错误处理从路由里抽离。
- 在原生 `http` 基础上实现一个最简的中间件流水线。
- 增强 JSON 请求体解析的健壮性，并集中处理异步错误。
- 为播客资源补齐 `PUT /podcasts/:id` 与 `DELETE /podcasts/:id`，形成完整内存版 CRUD。

## 与本周主题的关系

本周主题是「TypeScript + Node.js 热身」。第 2 天已实现最小 HTTP 服务，今天在其基础上抽象出中间件模型，为下周 Express 框架的 `app.use()` / `next()` 打下基础。

## 时间块概览（2h）

| 时段 | 时长 | 内容 |
|------|------|------|
| 第 1 块 | 30min | 中间件概念、请求处理流水线 |
| 第 2 块 | 60min | 实现中间件执行器 + 日志/请求体解析/错误处理中间件 |
| 第 3 块 | 30min | 补齐 PUT / DELETE，用 curl 验证完整 CRUD |
| 第 4 块 | 10min | 复盘与明日预习 |

## 关键产出

- `demo/middleware-runner.ts`：可复用的最简中间件执行器。
- `demo/minimal-http-server.ts`：基于中间件流水线的完整 CRUD 服务。
- `tasks.md` 与 `review.md` 中的完成记录。

## 前置依赖

- 已完成 day-02：能运行原生 `http` 服务，已实现 `GET /podcasts`、`GET /podcasts/:id`、`POST /podcasts`。
- 了解 `Promise` / `async-await` 基本语法。
