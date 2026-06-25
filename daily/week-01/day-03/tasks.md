---
week: 1
day: 3
date: 2026-06-25
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, http, middleware, async-await, error-handling]
file: tasks.md
---

# 今日任务清单

## 理论学习：30min

- [ ] 理解中间件（middleware）概念与 `next()` 的作用
  - 建议时间段：0:00-0:30
  - 验收标准：能用自己的话解释「中间件就是一个处理函数，决定是把请求交给下一个函数，还是直接结束响应」；能说明 `next()` 不调用会怎样
  - AI 辅助提示：AI 可以帮你：把「请求 → 日志中间件 → 请求体解析中间件 → 路由 → 错误处理」画成流程图，并对比 Express 的 `app.use()`。
  - 今日结束后项目状态：脑子里有一张请求处理流水线图，知道每个中间件负责什么。

## 动手实践：60min

- [ ] 实现最简中间件执行器 `demo/middleware-runner.ts`
  - 建议时间段：0:30-1:00
  - 验收标准：能把多个 `(req, res, next) => void | Promise<void>` 函数串起来执行；某个中间件抛出异常或返回 rejected Promise 时，能交给后续错误处理；响应结束后不再调用后续中间件
  - AI 辅助提示：AI 可以帮你：检查 `compose` 函数是否正确处理了同步异常、异步异常、重复调用 `next()` 三种情况。
  - 今日结束后项目状态：项目里多了一个可复用的中间件执行器，为 Express 学习做铺垫。

- [ ] 用中间件改造 HTTP 服务，补齐日志、请求体解析、错误处理
  - 建议时间段：1:00-1:30
  - 验收标准：`demo/minimal-http-server.ts` 使用 `compose([logger, bodyParser, router])` 启动；日志中间件打印 `METHOD URL STATUS DURATION`；请求体解析中间件对非法 JSON 返回 400；路由抛出异常时被集中捕获并返回 500 JSON
  - AI 辅助提示：AI 可以帮你：解释为什么 `req.on('data')` 必须在中间件里完成，以及如何用 `res.on('finish')` 获取最终状态码。
  - 今日结束后项目状态：服务从「所有逻辑塞在一个回调」升级为「分层中间件流水线」。

## 编码验证：30min

- [ ] 实现 `PUT /podcasts/:id` 与 `DELETE /podcasts/:id`
  - 建议时间段：1:30-1:45
  - 验收标准：`PUT /podcasts/1` 能更新标题和描述；`DELETE /podcasts/1` 能删除资源并返回被删除对象；id 不存在返回 404；缺少 `title` 时返回 400
  - AI 辅助提示：AI 可以帮你：生成一组 curl 命令，覆盖正常更新、删除不存在资源、提交非法 JSON 三种场景。
  - 今日结束后项目状态：播客资源具备完整内存版 CRUD，可独立运行演示。

- [ ] 用 curl 验证完整 CRUD 与边界情况
  - 建议时间段：1:45-2:00
  - 验收标准：依次验证 `GET /health`、`GET /podcasts`、`GET /podcasts/:id`、`POST /podcasts`、`PUT /podcasts/:id`、`DELETE /podcasts/:id`、非法 JSON、404 路径，结果与预期一致
  - AI 辅助提示：AI 可以帮你：把 curl 输出整理成表格，对比状态码与响应体结构。
  - 今日结束后项目状态：服务经过手动测试，能稳定处理正常请求与常见异常请求。

---

## 今日结束后项目状态

在 day-02 的 HTTP 服务基础上，引入中间件流水线：日志、请求体解析、业务路由、集中错误处理。服务支持 `GET /health`、`GET /podcasts`、`GET /podcasts/:id`、`POST /podcasts`、`PUT /podcasts/:id`、`DELETE /podcasts/:id`，并对非法 JSON、资源不存在、必填字段缺失等边界情况返回统一 JSON 错误响应。这是本周产出「最小 HTTP 服务」的完整版。
