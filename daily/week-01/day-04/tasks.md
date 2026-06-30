---
week: 1
day: 4
date: 2026-06-30
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, http, router, middleware]
file: tasks.md
---

# 今日任务清单

## 理论学习：30min

- [ ] 理解路由分发器的设计思路
  - 建议时间段：0:00-0:30
  - 验收标准：能解释「路由表」是什么；能说明 `app.get('/podcasts/:id', handler)` 内部大致如何匹配 URL；能区分路径参数 `:id` 与查询参数 `?category=x`
  - AI 辅助提示：AI 可以帮你：把 Express 路由匹配过程画成流程图，解释 `req.params` 和 `req.query` 的由来。
  - 今日结束后项目状态：脑子里有一张「Method + Path → Handler」的映射图，知道路由本质上是带条件的中间件。

## 动手实践：45min

- [ ] 实现原生路由分发器 `demo/router.ts`
  - 建议时间段：0:30-1:15
  - 验收标准：`router.get('/podcasts/:id', handler)` 能把路径参数解析到 `req.params`；`router.get('/podcasts', handler)` 能处理 `?category=x` 并解析到 `req.query`；匹配失败时返回 404； handler 抛出异常时被集中捕获
  - AI 辅助提示：AI 可以帮你：设计路由表的数据结构、把 `/podcasts/:id` 转成可匹配的正则、处理查询参数解析。
  - 今日结束后项目状态：项目里多了一个可复用的原生路由分发器，接口风格接近 Express。

## 编码验证：30min

- [ ] 用路由表重构播客 CRUD 服务 `demo/minimal-http-server.ts`
  - 建议时间段：1:15-1:45
  - 验收标准：`GET /health`、`GET /podcasts`、`GET /podcasts/:id`、`POST /podcasts`、`PUT /podcasts/:id`、`DELETE /podcasts/:id` 都通过路由表注册；业务 handler 不再处理 `req.method` 和 `req.url` 的分发逻辑；非法 JSON、资源不存在、404 路径仍返回统一 JSON 错误
  - AI 辅助提示：AI 可以帮你：把 day-03 的 `minimal-http-server.ts` 里的路由判断迁移到新的 `router` 上，并检查是否有遗漏的边界情况。
  - 今日结束后项目状态：服务从「中间件流水线 + 手动路由判断」升级为「中间件流水线 + 路由表分发」，代码结构更接近 Express。

## 测试与复盘：15min

- [ ] 用 curl 验证路由分发与边界情况
  - 建议时间段：1:45-2:00
  - 验收标准：依次验证 `GET /health`、`GET /podcasts?category=tech`、`GET /podcasts/1`、`POST /podcasts`、`PUT /podcasts/1`、`DELETE /podcasts/1`、访问 `/podcasts/abc`、404 路径，结果与预期一致
  - AI 辅助提示：AI 可以帮你：把 curl 输出整理成表格，检查路径参数和查询参数是否正确解析。
  - 今日结束后项目状态：路由分发器经过手动测试，能稳定处理正常请求、路径参数、查询参数和常见异常请求。

---

## 今日结束后项目状态

在 day-03 的中间件流水线 + 完整 CRUD 基础上，引入原生路由分发器。服务支持通过 `router.get/post/put/delete` 注册路由，自动解析路径参数 `:id` 和查询参数 `?category=x`，业务 handler 只关心请求处理本身。这是本周产出「最小 HTTP 服务」的进一步结构化和 Express 化的版本。
