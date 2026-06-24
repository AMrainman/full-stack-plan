---
week: 1
day: 4
date: 2026-06-24
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, HTTP, 原生模块]
file: tasks.md
---

# 今日任务清单

## 理论学习：30-40min

- [ ] 阅读 Node.js `http` 模块文档，理解请求生命周期
  - 建议时间段：0:00-0:20
  - 验收标准：能口头解释 `createServer` 回调参数 `req` / `res` 的作用，以及 HTTP Method、URL、Header、Status Code 的含义
  - AI 辅助提示：AI 可以帮你：用播客场景（如"用户请求播客列表时，数据如何从服务器流回客户端"）解释请求生命周期，生成核心概念速查表。

- [ ] 理解原生 HTTP 模块的路由匹配原理
  - 建议时间段：0:20-0:40
  - 验收标准：能解释为什么原生 `http` 模块没有内置路由，需要手动解析 `req.url` 和 `req.method`
  - AI 辅助提示：AI 可以帮你：对比原生 `http` 与 Express / NestJS 的路由差异，生成最小路由匹配伪代码。

## 动手实践：40-60min

- [ ] 用 TypeScript 写最小 HTTP 服务
  - 建议时间段：0:40-1:20
  - 验收标准：创建 `demo/minimal-http-server.ts`，使用 `http` 模块监听 3000 端口；实现 `/health` 返回 `{ "status": "ok" }`；实现 `/api/podcasts` 返回 JSON 数组（可先用硬编码数据）
  - AI 辅助提示：AI 可以帮你：生成路由框架，学习者填写具体处理逻辑；排查端口占用、CORS 等常见问题。

- [ ] 为未知路径返回 404 JSON 错误
  - 建议时间段：1:20-1:40
  - 验收标准：访问未定义路由时返回 `{ "error": "Not Found" }` 和 404 状态码，Content-Type 为 `application/json`
  - AI 辅助提示：AI 可以帮你：审查响应头设置是否正确，建议统一的 JSON 响应格式。

## 验证/测试：15-20min

- [ ] 使用 curl 手动测试接口
  - 建议时间段：1:40-1:55
  - 验收标准：`curl http://localhost:3000/health`、`curl http://localhost:3000/api/podcasts`、`curl http://localhost:3000/unknown` 分别返回 200 + JSON、200 + 数组、404 + 错误 JSON
  - AI 辅助提示：AI 可以帮你：生成 curl 命令集合，分析返回结果与预期不符的原因（如端口未监听、路径拼写错误）。

## 复盘：10min

- [ ] 整理今日疑问到 `review.md`
  - 建议时间段：1:55-2:00
  - 验收标准：`review.md` 中至少记录 1 个疑问和 1 个收获
  - AI 辅助提示：AI 可以帮你：根据记录内容生成结构化复盘模板，提炼关键概念清单。

---

## 今日结束后项目状态

拥有一个可运行的最小原生 HTTP 服务（`demo/minimal-http-server.ts`），支持 `/health`、`/api/podcasts` 和 404 处理，能返回正确 JSON。
