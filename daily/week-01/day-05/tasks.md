---
week: 1
day: 5
date: 2026-06-24
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, HTTP, JSON, 持久化]
file: tasks.md
---

# 今日任务清单

## 理论学习：30-40min

- [ ] 理解请求体解析流程
  - 建议时间段：0:00-0:20
  - 验收标准：能解释为什么 `req` 是流，需要监听 `data` 和 `end` 事件才能拿到完整请求体；能说明 `Content-Type: application/json` 的作用
  - AI 辅助提示：AI 可以帮你：用「快递拆包裹」类比解释流式读取，生成一个最小请求体解析函数。

- [ ] 理解 URL 查询参数与 JSON 文件持久化
  - 建议时间段：0:20-0:40
  - 验收标准：能用 `new URL(req.url, 'http://localhost')` 提取 `searchParams`；能解释 `fs.readFileSync` / `writeFileSync` 在开发环境的使用场景与风险
  - AI 辅助提示：AI 可以帮你：生成查询参数解析示例，对比同步/异步文件读写对 HTTP 服务吞吐的影响。

## 动手实践：40-60min

- [ ] 扩展 HTTP 服务，支持 POST /api/podcasts
  - 建议时间段：0:40-1:20
  - 验收标准：创建 `demo/podcast-server.ts`，在 day-04 服务基础上新增 `POST /api/podcasts`；能解析 JSON 请求体，把新播客加入内存数组，并返回 201 + 创建后的对象
  - AI 辅助提示：AI 可以帮你：生成路由分发骨架，学习者填充 POST 处理逻辑；排查 `JSON.parse` 失败、请求体为空等常见问题。

- [ ] 支持 `GET /api/podcasts?category=tech` 查询参数过滤，并把数据持久化到 JSON 文件
  - 建议时间段：1:20-1:40
  - 验收标准：`GET /api/podcasts?category=tech` 只返回 `category=tech` 的播客；服务启动时从 `demo/podcasts.json` 读取数据，写入时同步回文件；不存在的分类返回空数组 `[]`
  - AI 辅助提示：AI 可以帮你：审查查询参数匹配逻辑，建议如何优雅处理文件读写异常，避免服务崩溃。

## 验证/测试：15-20min

- [ ] 用 curl 测试新增接口
  - 建议时间段：1:40-1:55
  - 验收标准：以下命令均返回预期结果：
    - `curl http://localhost:3000/api/podcasts`
    - `curl "http://localhost:3000/api/podcasts?category=tech"`
    - `curl -X POST -H "Content-Type: application/json" -d '{"title":"新播客","category":"tech"}' http://localhost:3000/api/podcasts`
    - `curl http://localhost:3000/unknown`
  - AI 辅助提示：AI 可以帮你：生成完整 curl 命令集合，分析 400/500 错误原因。

## 复盘：10min

- [ ] 整理今日疑问到 `review.md`
  - 建议时间段：1:55-2:00
  - 验收标准：`review.md` 中至少记录 1 个疑问和 1 个收获
  - AI 辅助提示：AI 可以帮你：根据记录内容生成结构化复盘模板，提炼关键概念清单。

---

## 今日结束后项目状态

拥有一个可运行的播客 HTTP 服务（`demo/podcast-server.ts`），支持 GET 列表、查询参数过滤、POST 新增、404 处理、500 错误捕获，并把数据持久化到 `demo/podcasts.json`。
