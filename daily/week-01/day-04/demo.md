---
week: 1
day: 4
date: 2026-06-30
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, http, router, middleware]
file: demo.md
---

# 今日代码目标

实现一个基于原生 `http` 的路由分发器，并用它重构播客 CRUD 服务。目标是让业务 handler 不再处理 Method / URL 判断，只专注于请求处理。

## `demo/` 文件说明

| 文件 | 作用 |
|------|------|
| `middleware-runner.ts` | 从 day-03 沿用，把多个中间件串成流水线执行 |
| `router.ts` | 原生路由分发器，支持 `get/post/put/delete` 注册、路径参数、查询参数 |
| `minimal-http-server.ts` | 使用 `compose([logger, bodyParser, router.handler()])` 启动的播客 CRUD 服务 |

## 运行步骤

1. 进入 demo 目录：

```bash
cd daily/week-01/day-04/demo
```

2. 启动服务（假设已全局安装 `tsx`，或在 day-03 的 demo 中已有依赖）：

```bash
npx tsx minimal-http-server.ts
```

终端应输出：

```text
Server is running at http://localhost:3000
```

3. 另开一个终端测试接口：

```bash
# 健康检查
curl http://localhost:3000/health

# 带查询参数的列表
curl "http://localhost:3000/podcasts?category=tech"

# 路径参数详情
curl http://localhost:3000/podcasts/1

# 创建资源
curl -X POST http://localhost:3000/podcasts \
  -H 'Content-Type: application/json' \
  -d '{"title":"新节目","description":"测试","category":"tech"}'

# 更新资源
curl -X PUT http://localhost:3000/podcasts/1 \
  -H 'Content-Type: application/json' \
  -d '{"title":"更新后标题","description":"更新后描述"}'

# 删除资源
curl -X DELETE http://localhost:3000/podcasts/1

# 不存在的路由
curl -i http://localhost:3000/not-found
```

## 预期输出

`/health`：

```json
{"status":"ok"}
```

`/podcasts?category=tech`：

```json
[{"id":1,"title":"全栈电台 Vol.1","category":"tech"}]
```

`/podcasts/1`：

```json
{"id":1,"title":"全栈电台 Vol.1","category":"tech"}
```

`/not-found`：

```text
HTTP/1.1 404 Not Found

{"error":"Not Found"}
```

## 扩展练习

- 给路由表增加 `router.use(middleware)`，支持注册全局中间件。
- 实现 `router.use('/podcasts', subRouter)`，支持子路由挂载。
- 用正则让 `:id` 只匹配数字，遇到 `/podcasts/abc` 返回更友好的 400 提示。
