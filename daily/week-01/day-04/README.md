---
week: 1
day: 4
date: 2026-06-30
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, http, router, middleware]
file: README.md
---

# 今日目标

在 day-03 的中间件流水线基础上，**用原生 `http` 实现一个更接近 Express 的路由分发器**，理解「路由」与「中间件」的关系，为下周 Express 框架学习做铺垫。

## 与本周主题的关系

第 1 周的主题是「TypeScript + Node.js 热身」。day-01 到 day-03 完成了最小 HTTP 服务：从直接 `createServer` 回调，到中间件流水线，再到完整 CRUD。今天把「路由」这一层抽出来，让 URL + Method 的匹配逻辑不再散落在业务代码里，而是交给一个可注册、可匹配的路由表。

## 时间块概览

| 时间段 | 时长 | 内容 |
|--------|------|------|
| 0:00-0:30 | 30min | 理论学习：路由分发器的设计思路 |
| 0:30-1:15 | 45min | 动手实践：实现支持方法 + 路径匹配的路由分发器 |
| 1:15-1:45 | 30min | 编码验证：用路由表重构昨天的播客 CRUD |
| 1:45-2:00 | 15min | 测试与复盘：curl 验证 + 填写 review.md |

## 关键产出

- `demo/router.ts`：原生路由分发器核心。
- `demo/minimal-http-server.ts`：基于路由分发器的播客 CRUD 服务。

## 前置依赖

- 已完成 day-03 的中间件执行器与完整 CRUD。
- 理解 `next()`、`req`、`res`、请求体解析、统一错误响应。
