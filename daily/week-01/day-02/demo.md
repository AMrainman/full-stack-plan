---
week: 1
day: 2
date: 2026-06-23
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [typescript, nodejs, promise, async-await, event-loop]
file: demo.md
---

# 今日 Demo

## 目标

通过两个可运行的小例子，把 Promise / async / await 和 Event Loop 的执行顺序跑一遍。

## 文件清单

| 文件 | 说明 |
|------|------|
| `demo/promise-chain.ts` | 演示 Promise 创建、链式调用、async/await、错误捕获 |
| `demo/event-loop-order.js` | 演示同步代码、setTimeout、Promise microtask 的执行顺序 |

## 运行步骤

### 1. promise-chain.ts

```bash
npx tsx demo/promise-chain.ts
```

或先编译再运行：

```bash
npx tsc demo/promise-chain.ts --outDir dist
node dist/promise-chain.js
```

**预期输出：**

```text
开始请求...
用户: alice
处理结果: ALICE
捕获错误: 模拟网络错误
```

### 2. event-loop-order.js

```bash
node demo/event-loop-order.js
```

**预期输出：**

```text
同步 1
Promise 1
同步 2
setTimeout 1
Promise 2
```

如果你第一次想错了顺序，回到 `knowledge.md` 复习 Event Loop。

## 今日代码产出要求

- 两个 demo 文件必须能直接运行。
- 代码注释用中文解释「为什么」这样写。
- 运行后把实际输出和预期输出对比，记录在 `review.md`。
