---
week: 1
day: 5
date: 2026-06-24
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, HTTP, JSON, 持久化]
file: knowledge.md
---

# 今日核心知识点

## 1. 请求体解析

Node.js 的 `req` 是一个可读流。客户端发送的 POST 请求体可能分多次到达，因此需要监听 `data` 和 `end` 事件：

```typescript
let body = '';
req.on('data', chunk => body += chunk);
req.on('end', () => {
  const data = JSON.parse(body);
  // 处理 data
});
```

为什么重要：不理解流式读取，会在大请求体或慢网络场景下丢失数据。

常见误区：
- 直接在 `createServer` 回调里同步读取 `req.body`，结果永远是 `undefined`。
- 不处理 `JSON.parse` 异常，导致整个进程崩溃。

## 2. URL 查询参数

使用 `URL` 全局对象解析带查询参数的 URL：

```typescript
const url = new URL(req.url, 'http://localhost');
const category = url.searchParams.get('category');
```

为什么重要：RESTful 接口中，查询参数是实现过滤、分页、排序的主要手段。

常见误区：
- 手动用字符串 split 解析 `?category=tech&page=2`，容易遗漏 URL 编码问题。
- 不区分 `category` 不存在和 `category` 为空字符串的情况。

## 3. JSON 文件持久化

开发环境中可用 `fs.readFileSync` / `writeFileSync` 读写 JSON 文件：

```typescript
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('podcasts.json', 'utf-8'));
fs.writeFileSync('podcasts.json', JSON.stringify(data, null, 2));
```

为什么重要：持久化是把「内存服务」变成「有状态服务」的第一步，后续会替换为数据库。

常见误区：
- 高并发下同步写文件会阻塞事件循环，生产环境应使用数据库或异步写入。
- 写入前不处理异常，导致文件损坏或数据丢失。

## 4. 错误处理

在 HTTP 服务中，要为以下情况返回合适状态码：

- 200：成功
- 201：创建成功
- 400：请求格式错误（如 JSON 解析失败）
- 404：路由不存在
- 500：服务器内部错误

为什么重要：统一错误响应是 API 可维护性的基础，也是前后端联调时快速定位问题的关键。

常见误区：
- 所有错误都返回 500，让客户端无法区分「请求错了」和「服务器崩了」。
- 不捕获异常，导致一个请求出错就拖垮整个服务。
