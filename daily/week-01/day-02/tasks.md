---
week: 1
day: 2
date: 2026-06-25
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 3
tags: [TypeScript, Node.js, http, JSON, RESTful]
file: tasks.md
---

# 今日任务清单

## 理论学习：45min

- [ ] 补齐 `tsconfig.json` 核心字段理解（针对 day-01 卡点）
  - 建议时间段：0:00-0:20
  - 验收标准：能解释 `target`、`module`、`moduleResolution`、`lib`、`types` 的对应关系，能根据 Node.js 版本选择合理的 `target` 与 `module`
  - AI 辅助提示：AI 可以帮你：逐行解释现有 `tsconfig.json`，用表格对比 `CommonJS` / `ESNext` / `NodeNext` 的适用场景。
  - 今日结束后项目状态：`tsconfig.json` 的每个字段不再陌生，能判断字段变更会如何影响编译产物。

- [ ] 理解 Node.js `http` 模块的请求生命周期
  - 建议时间段：0:20-0:45
  - 验收标准：能口述 `http.createServer` 回调何时触发、`req` 和 `res` 分别代表什么、`req.method` / `req.url` 的取值
  - AI 辅助提示：AI 可以帮你：把「浏览器发请求 → 服务器接收 → 返回响应」画成时序图，标注每个阶段 `req` / `res` 的关键属性。
  - 今日结束后项目状态：对 HTTP 服务的数据流动建立清晰模型，为手写路由做准备。

## 动手实践：120min

- [ ] 实现最小 HTTP 服务骨架
  - 建议时间段：0:45-1:30
  - 验收标准：`demo/minimal-http-server.ts` 能启动，访问 `GET /health` 返回 `{"status":"ok"}`；访问不存在的路径返回 404
  - AI 辅助提示：AI 可以帮你：生成最小 `http.createServer` 模板，但你必须亲手改路由、调状态码、验证响应头。
  - 今日结束后项目状态：项目里多了一个可独立运行的 HTTP 服务文件，能理解每条路由背后的匹配逻辑。

- [ ] 实现 `GET /podcasts` 与 `GET /podcasts/:id`
  - 建议时间段：1:30-1:55
  - 验收标准：`GET /podcasts` 返回播客列表数组；`GET /podcasts/1` 返回对应 id 的播客对象；id 不存在时返回 404 + JSON 错误信息
  - AI 辅助提示：AI 可以帮你：设计内存中的播客数据结构和查找函数，但路由解析和错误处理要自己写。
  - 今日结束后项目状态：服务支持读取类 RESTful 资源接口，能处理路径参数与资源不存在的情况。

- [ ] 实现 `POST /podcasts` 与 JSON 请求体解析
  - 建议时间段：1:55-2:30
  - 验收标准：用 `curl` 或 Postman 发送 `POST /podcasts` 并携带 JSON body，服务能解析、校验必填字段，并返回新创建的播客对象（含自增 id）
  - AI 辅助提示：AI 可以帮你：解释 `req.on('data')` 和 `req.on('end')` 的关系，提示 Buffer 拼接与 `JSON.parse` 的常见错误。
  - 今日结束后项目状态：服务支持写入类接口，能解析 JSON body、做基础校验、返回统一响应格式。

## 验证/测试：30min

- [ ] 用 curl 验证所有接口
  - 建议时间段：2:30-2:50
  - 验收标准：依次验证 `GET /health`、`GET /podcasts`、`GET /podcasts/:id`、`POST /podcasts`、错误路径，输出与预期一致
  - AI 辅助提示：AI 可以帮你：生成一组 curl 命令，检查响应状态码、响应头 `Content-Type`、响应体结构。
  - 今日结束后项目状态：服务经过手动测试，能稳定处理正常请求与异常请求。

## 复盘：10min

- [ ] 整理今日疑问到 `review.md`
  - 建议时间段：2:50-3:00
  - 验收标准：`review.md` 中至少记录 1 个疑问、1 个收获、明日预习要点
  - AI 辅助提示：AI 可以帮你：根据记录内容生成结构化复盘模板，提炼「http 模块关键 API」清单。
  - 今日结束后项目状态：留下今日学习痕迹，为 day-03 扩展路由/中间件概念做准备。

---

## 今日结束后项目状态

在 day-01 的 TypeScript 工程骨架基础上，新增一个可独立运行的原生 HTTP 服务。它支持 `GET /health` 健康检查、`GET /podcasts` 列表查询、`GET /podcasts/:id` 详情查询、`POST /podcasts` 创建资源，并具备 404 和 JSON 错误响应能力。这是本周产出「最小 HTTP 服务」的可用雏形。
