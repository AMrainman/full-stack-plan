---
week: 1
day: 5
date: 2026-06-24
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, HTTP, JSON, 持久化]
file: README.md
---

# 第 1 周第 5 天：HTTP 服务进阶——请求体、查询参数与持久化

## 今日目标

- 在昨天的最小 HTTP 服务基础上，加入请求体解析能力。
- 支持查询参数过滤播客列表。
- 把播客数据持久化到本地 JSON 文件。
- 完善错误处理，确保服务不因异常崩溃。

## 与本周主题的关系

今天是编码实践日。前两天完成了 TS 环境、Promise/Event Loop 和最小 HTTP 服务。今天的任务是把一个静态服务扩展成可接收输入、可过滤、可持久化的服务，这是后续 Express + 数据库 CRUD 的过渡练习。

## 时间块概览

| 时间段 | 内容 | 产出 |
|--------|------|------|
| 0:00-0:40 | 理论学习：请求体解析、URL 查询参数、JSON 文件读写 | 知识笔记 |
| 0:40-1:40 | 动手实践：扩展 HTTP 服务，支持 POST / 查询参数 / 文件持久化 | demo 代码 |
| 1:40-1:55 | 验证/测试：用 curl 测试新增接口 | 测试通过 |
| 1:55-2:00 | 复盘：记录疑问到 review.md | review.md |

## 关键产出

- `demo/podcast-server.ts`：支持 GET/POST/查询参数/文件持久化的播客服务。
- `demo/podcasts.json`：本地持久化数据文件。

## 前置依赖

- 已完成 day-04 的最小 HTTP 服务。
- 理解 `req` / `res` 对象、`JSON.stringify/parse`。
