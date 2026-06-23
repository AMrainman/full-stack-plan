---
week: 1
day: 3
date: 2026-06-23
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [nodejs, http, typescript, json]
file: demo.md
---

# 今日 Demo

## 目标

写一个最小的 TypeScript HTTP 服务，支持返回 JSON 和处理 404。

## 文件清单

| 文件 | 说明 |
|------|------|
| `demo/minimal-http-server.ts` | 原生 `http` 模块实现的最小 JSON 服务 |

## 运行步骤

```bash
npx tsx demo/minimal-http-server.ts
```

服务启动后，在另一个终端测试：

```bash
curl http://localhost:3000/api/hello
```

**预期输出：**

```json
{ "message": "Hello from Node.js" }
```

测试 404：

```bash
curl http://localhost:3000/unknown
```

**预期输出：**

```json
{ "error": "Not Found" }
```

## 代码要点

- 使用 `createServer` 创建服务器。
- 根据 `req.method` 和 `req.url` 判断路由。
- 显式设置 `Content-Type: application/json`。
- 未知路径返回 404 并附带 JSON 错误信息。

## 今日代码产出要求

- `demo/minimal-http-server.ts` 能直接运行。
- 代码注释用中文解释「为什么」这样写。
- 测试通过后再继续下一天。
