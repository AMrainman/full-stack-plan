---
week: 1
day: 3
date: 2026-06-25
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, http, middleware, async-await, error-handling]
file: demo.md
---

# 今日 Demo

## 目标

基于原生 `http` 模块实现一个中间件流水线，并补齐播客资源的完整 CRUD。

## 文件清单

| 文件 | 说明 |
|------|------|
| `demo/middleware-runner.ts` | 最简中间件执行器，演示 `compose` 原理 |
| `demo/minimal-http-server.ts` | 使用中间件执行器的完整 CRUD 服务 |

## 运行步骤

```bash
npx tsx demo/minimal-http-server.ts
```

服务启动后，在另一个终端测试：

```bash
# 健康检查
curl http://localhost:3000/health

# 列表
curl http://localhost:3000/podcasts

# 详情
curl http://localhost:3000/podcasts/1

# 创建
curl -X POST http://localhost:3000/podcasts \
  -H 'Content-Type: application/json' \
  -d '{"title":"新播客","description":"测试描述"}'

# 更新
curl -X PUT http://localhost:3000/podcasts/1 \
  -H 'Content-Type: application/json' \
  -d '{"title":"前端下午茶（更新）","description":"Vue 与更多"}'

# 删除
curl -X DELETE http://localhost:3000/podcasts/1

# 非法 JSON
curl -X POST http://localhost:3000/podcasts \
  -H 'Content-Type: application/json' \
  -d '{"title":'

# 404
curl http://localhost:3000/not-found
```

## 代码要点

- `middleware-runner.ts` 把中间件串成流水线，并统一捕获同步/异步异常。
- `logger` 中间件在响应 `finish` 时打印耗时，演示「事后统计」。
- `bodyParser` 中间件只在需要解析的方法里读取 `req` 流。
- `router` 中间件用正则匹配 `/podcasts/:id`，集中处理业务。
- 非法 JSON、资源不存在、必填字段缺失都返回统一 JSON 错误体。

## 今日代码产出要求

- `demo/middleware-runner.ts` 与 `demo/minimal-http-server.ts` 可直接运行。
- 代码注释用中文解释「为什么」这样写。
- 用 curl 验证所有接口后再继续下一天。
