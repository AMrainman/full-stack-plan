---
week: 1
day: 1
date: 2026-06-24
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, 环境配置, 异步基础, Event Loop]
file: knowledge.md
---

# 核心知识点

## 1. 为什么用 TypeScript 而不是纯 JavaScript？

**原因：** 类型系统在团队协作和长期维护中能显著降低隐性 bug。对于从 Vue3 转型全栈的开发者，TypeScript 已经是前端标配，后端延续同一语言栈可以减少上下文切换成本。

**常见误区：**
- 认为 TS 只是「加了类型的 JS」，忽略了类型推导对代码设计的影响。
- 过度使用 `any`，导致类型系统形同虚设。

## 2. Promise 为什么重要？

Node.js 是单线程事件驱动模型，几乎所有 I/O 操作（文件、网络、数据库）都是异步的。Promise 是统一异步操作的标准接口，也是 async/await 的底层基础。

**关键理解：**
- Promise 一旦进入 `fulfilled` 或 `rejected` 状态，就不可再变。
- `.then()` 返回的是新 Promise，支持链式调用。
- 忘记写 `.catch()` 会导致未处理的 Promise 拒绝，可能让进程崩溃。

## 3. Event Loop 与异步执行顺序

Node.js 的 Event Loop 分为多个阶段（timers、poll、check、close callbacks 等）。理解以下顺序是排查异步 bug 的基础：

1. 同步代码先执行
2. 微任务（microtask）：`Promise.then()`、`process.nextTick()`
3. 宏任务（macrotask）：`setTimeout`、`setInterval`、`I/O 回调`

**常见误区：** 认为 `setTimeout(fn, 0)` 会「立即」执行。实际上它会被放入 timers 队列，至少要等当前同步代码和微任务全部执行完。

**最小示例：**
```js
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// 输出顺序：1 → 4 → 3 → 2
```

## 4. tsconfig.json 严格模式的意义

`"strict": true` 开启一系列严格类型检查，包括：
- `noImplicitAny`：禁止隐式 any
- `strictNullChecks`：区分 `null`/`undefined` 与具体类型
- `strictFunctionTypes`：函数参数双向协变检查

**为什么重要：** 严格模式在前端 Vue3 项目中可能带来初期不适应，但在后端 API 开发中，严格的入参和出参类型能大幅减少运行时错误。

## 5. 本周产出物「最小 HTTP 服务」是什么？

本周最终目标是使用 Node.js 原生 `http` 模块启动一个服务，对外暴露一个返回 JSON 的接口。例如：
```ts
import http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello Podcast API' }));
});

server.listen(3000);
```

Day 1 不直接写这个服务，但要理解：HTTP 服务本质上就是「监听端口 → 解析请求 → 返回响应」的异步流程，Promise/Event Loop 是支撑这条链路的基础。
