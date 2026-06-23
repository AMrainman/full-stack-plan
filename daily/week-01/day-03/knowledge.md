---
week: 1
day: 3
date: 2026-06-23
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [nodejs, http, typescript, json]
file: knowledge.md
---

# 核心知识点

## 1. Node.js `http` 模块

Node.js 内置 `http` 模块，无需安装第三方库即可创建 HTTP 服务器。它是后续 Express、NestJS 等框架的底层基础。

### 最小服务器结构

```ts
import { createServer } from 'http';

const server = createServer((req, res) => {
  res.end('hello');
});

server.listen(3000);
```

### 为什么从原生 `http` 开始

- 理解框架底层：Express 只是对 `http` 的封装。
- 理解请求/响应生命周期：这是所有 Web 服务的核心。
- 面试高频：能解释「请求进来后 Node.js 做了什么」。

## 2. 请求对象 `req` 与响应对象 `res`

| 对象 | 关键属性 / 方法 | 含义 |
|------|----------------|------|
| `req` | `method` | HTTP 方法，如 GET、POST |
| `req` | `url` | 请求路径和查询字符串 |
| `req` | `headers` | 请求头 |
| `res` | `writeHead(status, headers)` | 设置状态码和响应头 |
| `res` | `end(data)` | 结束响应并发送数据 |

### 为什么需要正确设置响应头

浏览器和客户端根据响应头判断如何解析返回内容。返回 JSON 时必须设置：

```ts
res.writeHead(200, { 'Content-Type': 'application/json' });
```

否则客户端可能把 JSON 当纯文本处理。

## 3. 路由与 404 处理

原生 `http` 没有内置路由，需要手动判断 `req.method` 和 `req.url`：

```ts
if (req.method === 'GET' && req.url === '/api/hello') {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello' }));
} else {
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
}
```

### 常见误区

- 忘记调用 `res.end()`，导致客户端一直等待。
- 忘记设置 `Content-Type`，导致前端无法正确解析 JSON。
- 没有处理 404，让未知路径返回默认的 200 空响应。

## 4. TypeScript 与 http 模块

TypeScript 能让我们明确 `req` 和 `res` 的类型：

```ts
import { createServer, IncomingMessage, ServerResponse } from 'http';

createServer((req: IncomingMessage, res: ServerResponse) => {
  // ...
});
```

类型提示能减少拼写错误，也是后续 NestJS 装饰器路由的基础。
