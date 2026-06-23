---
week: 1
day: 4
date: 2026-06-23
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, HTTP, Event Loop]
file: demo.md
---

# 今日代码目标

实现一个基于 Node.js 原生 `http` 模块的最小 TypeScript HTTP 服务，支持健康检查、播客列表查询、404 兜底和 500 错误处理。

## `demo/` 文件说明

| 文件 | 作用 |
|------|------|
| `package.json` | 工程配置，安装 TypeScript 与 `tsx` 运行时 |
| `tsconfig.json` | TypeScript 编译配置，启用严格模式 |
| `minimal-http-server.ts` | 最小 HTTP 服务源码 |

## 运行步骤

1. 进入 demo 目录：

```bash
cd daily/week-01/day-04/demo
```

2. 安装依赖：

```bash
pnpm install
```

3. 启动服务：

```bash
pnpm dev
```

终端应输出：

```text
Server is running at http://localhost:3000
```

4. 另开一个终端测试接口：

```bash
# 健康检查
curl http://localhost:3000/health

# 播客列表
curl http://localhost:3000/api/podcasts

# 不存在的路由
curl -i http://localhost:3000/not-found
```

## 预期输出

`/health`：

```json
{"status":"ok"}
```

`/api/podcasts`：

```json
[
  {"id":1,"title":"全栈电台 Vol.1"},
  {"id":2,"title":"TypeScript 实战"}
]
```

`/not-found`：

```text
HTTP/1.1 404 Not Found

{"error":"Not Found"}
```

## 扩展练习

- 给 `/api/podcasts/:id` 增加详情路由，用 `req.url` 做简单解析。
- 给 `/api/podcasts` 增加 POST 支持，读取 `req` 的 data 事件拼请求体。
