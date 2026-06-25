---
week: 1
day: 2
date: 2026-06-25
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 3
tags: [TypeScript, Node.js, http, JSON, RESTful]
file: knowledge.md
---

# 核心知识点

## 1. `tsconfig.json` 字段对应关系

### 为什么 day-01 这里卡住了

`target`、`module`、`moduleResolution`、`lib`、`types` 这几个字段相互影响，单独看文档容易迷失。把它们放在一起理解：

| 字段 | 作用 | 与 Node.js 的关系 |
|------|------|------------------|
| `target` | TypeScript 编译成哪一版 ECMAScript | Node.js 版本越高，可设越新；v20+ 可放心用 `ES2022` / `ESNext` |
| `module` | 生成的模块系统 | `CommonJS` 对应 `require`；`ESNext` / `NodeNext` 对应 `import`，需配合 `package.json#type: "module"` |
| `moduleResolution` | TS 如何解析 `import` 路径 | Node 项目通常用 `node` 或 `nodenext`，需与 `module` 一致 |
| `lib` | 编译时可用的内置类型库 | 不写时 TS 会根据 `target` 自动引入；Node 项目通常无需手动写 |
| `types` | 显式引入哪些全局类型 | `"node"` 让 `process`、`Buffer` 等 Node API 有类型提示 |

### 关键记忆点

- `module: "NodeNext"` + `moduleResolution: "NodeNext"` 是 Node.js 原生 ES Module 项目的推荐组合。
- `target` 决定语法降级程度，`module` 决定模块封装方式，二者不要混为一谈。
- `package.json` 里 `"type": "module"` 告诉 Node.js 用 ES Module，但 TS 编译还要靠 `module` 字段生成对应产物。

## 2. Node.js 原生 `http` 模块

### `http.createServer`

```ts
import http from 'node:http';

const server = http.createServer((req, res) => {
  // req: 请求对象，可读流
  // res: 响应对象，可写流
  res.end('hello');
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));
```

### `req` 的关键属性

| 属性 | 含义 | 示例 |
|------|------|------|
| `req.method` | HTTP 方法 | `GET`、`POST`、`PUT`、`DELETE` |
| `req.url` | 请求路径 + 查询字符串 | `/podcasts?id=1` |
| `req.headers` | 请求头对象 | `{ 'content-type': 'application/json' }` |

### `res` 的关键方法

| 方法 | 作用 |
|------|------|
| `res.writeHead(statusCode, headers)` | 写入状态码和响应头 |
| `res.statusCode = 404` | 单独设置状态码 |
| `res.setHeader('Content-Type', 'application/json')` | 单独设置响应头 |
| `res.end(data)` | 结束响应，可带数据 |

## 3. 路由匹配与 RESTful 风格

原生 `http` 没有路由系统，需要手写匹配逻辑：

```ts
if (req.method === 'GET' && req.url === '/podcasts') {
  // 返回列表
} else if (req.method === 'GET' && req.url?.startsWith('/podcasts/')) {
  // 解析 id，返回详情
}
```

RESTful 风格的核心：用 URL 表示资源，用 HTTP 方法表示操作。

| 方法 + 路径 | 含义 |
|------------|------|
| `GET /podcasts` | 查询播客列表 |
| `GET /podcasts/:id` | 查询单个播客 |
| `POST /podcasts` | 创建播客 |
| `PUT /podcasts/:id` | 更新播客 |
| `DELETE /podcasts/:id` | 删除播客 |

## 4. JSON 请求体解析

`req` 是一个可读流，需要手动拼接数据：

```ts
const chunks: Buffer[] = [];
req.on('data', (chunk) => chunks.push(chunk));
req.on('end', () => {
  const body = JSON.parse(Buffer.concat(chunks).toString());
  // 处理 body
});
```

### 常见错误

- 忘记处理 `req.on('error')`：客户端断开时可能触发。
- 直接 `JSON.parse` 而不 `try/catch`：非法 JSON 会抛异常导致进程崩溃。
- 没设置 `Content-Type: application/json`：客户端可能无法正确识别响应格式。

## 5. 状态码与错误响应

| 状态码 | 含义 | 使用场景 |
|--------|------|----------|
| 200 | OK | 成功响应 |
| 201 | Created | 创建资源成功 |
| 400 | Bad Request | 请求参数错误 |
| 404 | Not Found | 资源不存在 |
| 500 | Internal Server Error | 服务器内部错误 |

建议养成习惯：即使是错误，也返回 JSON 格式的统一错误体，方便前端处理。

```ts
res.writeHead(404, { 'Content-Type': 'application/json' });
res.end(JSON.stringify({ error: 'Not Found' }));
```

## 6. 为什么先学原生 http

框架（Express / NestJS）底层仍然是 `http`。理解原生模块能让你：

- 清楚「请求怎么进来、响应怎么出去」。
- 排查框架里的高级问题（如流式响应、自定义 header）。
- 不被框架的语法糖遮住对 HTTP 协议本身的理解。
