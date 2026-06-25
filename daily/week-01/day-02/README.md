---
week: 1
day: 2
date: 2026-06-25
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 3
tags: [TypeScript, Node.js, http, JSON, RESTful]
file: README.md
---

# 第 1 周第 2 天：用原生 http 模块写最小 JSON 服务

## 今日目标

- 补齐 `tsconfig.json` 核心字段的理解（承接 day-01 的 🟡 卡点）。
- 掌握 Node.js 原生 `http` 模块的 `createServer`、请求生命周期、`req` / `res` 对象。
- 实现一个可运行的最小 HTTP 服务，支持 `GET /health`、`GET /podcasts`、`POST /podcasts`。
- 理解 JSON 请求体解析、状态码、`Content-Type` 与基础错误处理。

## 与本周主题的关系

本周主题是「TypeScript + Node.js 热身」。day-01 完成了 TS 工程骨架与异步基础复习；今天进入**核心知识学习**，把基础落在 Node.js 原生 HTTP 服务上，为本周产出「最小 HTTP 服务」奠定代码基础。

## 时间块概览（3h）

| 时段 | 时长 | 内容 |
|------|------|------|
| 第 1 块 | 45min | 补齐 tsconfig 字段 + http 模块核心概念 |
| 第 2 块 | 60min | 实现最小 HTTP 服务与路由匹配 |
| 第 3 块 | 60min | POST 请求体解析、JSON 响应、错误处理 |
| 第 4 块 | 15min | 运行验证与复盘 |

## 关键产出

- `demo/minimal-http-server.ts`：可直接运行的原生 HTTP 服务。
- `knowledge.md` 中对 `req`、`res`、路由、状态码的笔记。
- 完成 `tasks.md` 中的 checkbox。

## 前置依赖

- 已完成 day-01，拥有可编译的 TypeScript 工程骨架。
- Node.js 版本建议 v20+。
