---
week: 1
day: 5
date: 2026-06-24
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, HTTP, JSON, 持久化]
file: demo.md
---

# 今日代码目标

## demo 文件

| 文件 | 说明 |
|------|------|
| `demo/podcast-server.ts` | 支持 GET/POST/查询参数/文件持久化的播客服务 |
| `demo/podcasts.json` | 本地持久化数据文件 |

## 运行步骤

1. 进入 demo 目录：
   ```bash
   cd daily/week-01/day-05/demo
   ```

2. 安装依赖（如果还没有）：
   ```bash
   pnpm install
   ```

3. 启动服务：
   ```bash
   npx tsx podcast-server.ts
   ```

4. 在另一个终端测试：
   ```bash
   curl http://localhost:3000/api/podcasts
   curl "http://localhost:3000/api/podcasts?category=tech"
   curl -X POST -H "Content-Type: application/json" -d '{"title":"新播客","category":"tech"}' http://localhost:3000/api/podcasts
   curl http://localhost:3000/unknown
   ```

## 预期输出

- `GET /api/podcasts`：返回全部播客 JSON 数组。
- `GET /api/podcasts?category=tech`：返回 `category` 为 `tech` 的播客数组。
- `POST /api/podcasts`：返回 201 + 新创建的播客对象，且 `podcasts.json` 被更新。
- `GET /unknown`：返回 404 + `{ "error": "Not Found" }`。

## 今日结束后项目状态

拥有一个可运行的播客 HTTP 服务，支持 GET 列表、查询参数过滤、POST 新增、404 处理、500 错误捕获，并把数据持久化到 `podcasts.json`。
