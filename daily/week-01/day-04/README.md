---
week: 1
day: 4
date: 2026-06-23
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, HTTP, Event Loop]
file: README.md
---

# 第 1 周第 4 天：原生 HTTP 服务编码实践

## 今日目标

- 用 TypeScript + Node.js 原生 `http` 模块写一个可运行的 JSON 服务。
- 在真实代码中体会 Promise / async-await / Event Loop 的协作方式。
- 为下周 Express 框架学习打好「请求-响应生命周期」的感性认识。

## 与本周主题的关系

第 1 周主题是「TypeScript + Node.js 热身」。前两天侧重概念理解，今天进入编码实践：把 TypeScript 类型、异步语法、Node.js 原生 HTTP 能力串起来，跑通一个最小服务。

## 时间块概览（2 小时）

| 时间 | 内容 | 产出 |
|------|------|------|
| 0:00-0:30 | 搭建 demo 工程，理解 `http` 模块 API | `package.json`、`tsconfig.json` |
| 0:30-1:10 | 实现带路由和 JSON 响应的最小 HTTP 服务 | `minimal-http-server.ts` |
| 1:10-1:40 | 加入 async 处理与错误兜底 | 可处理异步错误的稳定服务 |
| 1:40-2:00 | 自测、记录卡点、更新 review | 本地验证通过 + review.md |

## 关键产出

- `daily/week-01/day-04/demo/minimal-http-server.ts`
- `daily/week-01/day-04/demo/package.json`
- `daily/week-01/day-04/demo/tsconfig.json`

## 前置依赖

- 已安装 Node.js（建议 v18+）和 pnpm / npm。
- 理解 `Promise` 与 `async/await` 基本写法。
