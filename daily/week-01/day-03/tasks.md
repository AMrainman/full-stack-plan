---
week: 1
day: 3
date: 2026-06-23
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [nodejs, http, typescript, json]
file: tasks.md
---

# 今日任务清单

## 知识学习

- [ ] **Task 1：理解 http 模块与请求生命周期（40min）**
  - 阅读 Node.js `http` 模块文档，理解 `createServer`、回调参数 `req` / `res`。
  - 理解 HTTP Method、URL、Header、Status Code 的作用。
  - 验收标准：能口头解释「请求进来后，Node.js 如何调用回调函数」。

- [ ] **Task 2：用 TypeScript 写最小 JSON 服务（40min）**
  - 创建 `demo/minimal-http-server.ts`。
  - 实现一个监听 3000 端口的服务，对 `/api/hello` 返回 JSON：`{ "message": "Hello from Node.js" }`。
  - 对未知路径返回 404 JSON 错误。
  - 验收标准：运行 `npx tsx demo/minimal-http-server.ts` 后，curl 能拿到正确 JSON。

- [ ] **Task 3：手动测试接口（30min）**
  - 使用 curl 或 Postman 测试 `/api/hello` 和 `/unknown`。
  - 验收标准：能正确返回 200 和 404。

## 复盘

- [ ] **Task 4：填写 review.md（10min）**
  - 记录今天最大的一个收获和一个疑问。
  - 验收标准：`review.md` 不为空。

## 时间提醒

- 总时长约 2h，如果服务调试超时，先标记为「未完成」，明天继续。
