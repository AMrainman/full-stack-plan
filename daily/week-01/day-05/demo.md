---
week: 1
day: 5
date: 2026-07-08
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, http, middleware, router, Express]
file: demo.md
---

# 今日代码目标

## demo 文件

| 文件 | 说明 |
|------|------|
| `demo/app.ts` | 类 Express 的 `App` 对象，内部把中间件和路由按注册顺序统一管理 |
| `demo/router.ts` | 原生路由分发器（day-04 产物），本日代码复用其类型定义 |
| `demo/middleware-runner.ts` | 中间件执行器（day-03 产物），本日 `App` 已内化其核心逻辑 |
| `demo/minimal-http-server.ts` | 基于 `App` 重构的播客 CRUD 服务 |
| `demo/package.json` | 依赖与运行脚本 |
| `demo/tsconfig.json` | TypeScript 配置 |

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
   npx tsx minimal-http-server.ts
   ```

4. 在另一个终端测试：
   ```bash
   curl http://localhost:3000/health
   curl "http://localhost:3000/podcasts?category=tech"
   curl http://localhost:3000/podcasts/1
   curl -X POST -H "Content-Type: application/json" -d '{"title":"新播客","category":"tech"}' http://localhost:3000/podcasts
   curl http://localhost:3000/unknown
   ```

## 预期输出

- `GET /health`：返回 `{ "status": "ok" }`。
- `GET /podcasts?category=tech`：返回 `category` 为 `tech` 的播客数组。
- `GET /podcasts/1`：返回 id 为 1 的播客对象。
- `POST /podcasts`：返回 201 + 新创建的播客对象。
- `GET /unknown`：返回 404 + `{ "error": "Not Found" }`。
- 如果某个 handler 抛出异常，会被 4 参数错误处理中间件捕获并返回 500。

## 今日结束后项目状态

拥有一个类 Express 接口的最小 HTTP 服务。通过 `App` 对象统一管理中间件、路由和错误处理，代码结构清晰，为下周学习 Express 框架做好铺垫。
