---
week: 1
day: 2
date: 2026-06-25
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 3
tags: [TypeScript, Node.js, http, JSON, RESTful]
file: demo.md
---

# 今日 Demo

## 目标

通过手写一个原生 Node.js HTTP 服务，理解请求生命周期、路由匹配、JSON 响应与错误处理。

## 文件清单

| 文件 | 说明 |
|------|------|
| `demo/minimal-http-server.ts` | 最小 HTTP 服务，含 GET / POST 路由与错误处理 |

## 运行步骤

### 方式一：用 tsx 直接运行（推荐）

```bash
npx tsx demo/minimal-http-server.ts
```

如果本地没有 `tsx`，可安装为开发依赖：

```bash
pnpm add -D tsx
```

### 方式二：先编译再运行

```bash
npx tsc demo/minimal-http-server.ts --outDir dist-demo --module nodenext --target esnext --moduleResolution nodenext --esModuleInterop --strict
node dist-demo/minimal-http-server.js
```

服务启动后，终端应输出：

```text
Server running at http://localhost:3000/
```

## 接口验证

### 健康检查

```bash
curl -i http://localhost:3000/health
```

预期响应：

```http
HTTP/1.1 200 OK
Content-Type: application/json

{"status":"ok"}
```

### 获取播客列表

```bash
curl -i http://localhost:3000/podcasts
```

预期响应：

```http
HTTP/1.1 200 OK
Content-Type: application/json

[{"id":1,"title":"前端乱炖","author":"张三"}]
```

### 获取单个播客

```bash
curl -i http://localhost:3000/podcasts/1
```

预期响应：

```http
HTTP/1.1 200 OK
Content-Type: application/json

{"id":1,"title":"前端乱炖","author":"张三"}
```

### 创建播客

```bash
curl -i -X POST http://localhost:3000/podcasts \
  -H "Content-Type: application/json" \
  -d '{"title":"后端沉思录","author":"李四"}'
```

预期响应：

```http
HTTP/1.1 201 Created
Content-Type: application/json

{"id":2,"title":"后端沉思录","author":"李四"}
```

### 404 处理

```bash
curl -i http://localhost:3000/not-found
```

预期响应：

```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{"error":"Not Found"}
```

## 今日代码产出要求

- `demo/minimal-http-server.ts` 必须能直接运行（用 tsx）或编译后运行。
- 代码注释用中文解释「为什么」这样写。
- 所有接口用 curl 验证一遍，把实际输出和预期输出对比记录在 `review.md`。
