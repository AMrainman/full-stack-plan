---
week: 1
day: 4
date: 2026-06-23
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, HTTP, Event Loop]
file: knowledge.md
---

# 核心知识点

## 1. 为什么要先学原生 `http` 模块？

Express、NestJS 等框架底层都基于 Node.js 的 `http`/`https` 模块。先写原生服务能帮你理解：

- 请求长什么样：`method`、`url`、`headers`。
- 响应如何构造：`statusCode`、`setHeader`、`end`。
- 路由其实只是一堆 `if/else` 或 `switch`。

框架帮你封装了这些细节，但面试和线上排错时，底层知识决定你能挖多深。

## 2. `req` 和 `res` 的生命周期

```
客户端发起请求
    │
    ▼
http.createServer((req, res) => { ... })
    │
    ├── 读取 req.method / req.url / req.headers
    │
    ├── 业务逻辑（路由、参数校验、查询数据）
    │
    └── 调用 res.writeHead / res.setHeader / res.end 返回响应
```

关键点：`res.end()` 必须被调用，否则客户端会一直挂起等待响应。

## 3. async/await 在 HTTP 服务里的位置

Node.js 的 `http` 回调是同步调用的。即使你在回调里写 `await`，也要让回调本身是 `async` 函数，否则未捕获的 Promise 拒绝可能导致进程退出。

常见误区：

```ts
// ❌ 错误：异步错误可能吞掉或导致崩溃
server.on('request', (req, res) => {
  const data = await fetchSomething(); // 语法上就报错，因为回调不是 async
});

// ✅ 正确：把回调声明为 async
server.on('request', async (req, res) => {
  const data = await fetchSomething();
});
```

## 4. Event Loop 与本节的关系

HTTP 请求到达时，Node.js 把 I/O 事件交给 Event Loop 调度。你在回调里写的异步操作（读取文件、查询数据库）不会阻塞主线程，等结果就绪后再由 Event Loop 推回调用栈。

今天先建立直觉：

- `await` 后面的代码会被挂起，主线程继续处理其他请求。
- `setTimeout` / `setImmediate` / Promise 回调的优先级不同，后续会专门练习。

## 5. 为什么错误处理必须放在路由层？

未捕获的异常会让整个 Node.js 进程退出。对于 HTTP 服务来说，一个请求的异常不应该影响其他请求。因此要在每个路由里 `try/catch`，把异常转换为 500 响应。

下阶段学习 Express 时，你会看到 `express-async-errors` 或统一错误中间件，本质也是这个思路的封装。
