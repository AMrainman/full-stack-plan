---
week: 1
day: 2
date: 2026-06-23
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [typescript, nodejs, promise, async-await, event-loop]
file: knowledge.md
---

# 核心知识点

## 1. TypeScript 在 Node.js 中的角色

TypeScript 是 JavaScript 的超集，提供静态类型检查。它不会直接运行，而是先编译成 JS，再由 Node.js 执行。

### 最小配置关注点

| 字段 | 作用 | 为什么重要 |
|------|------|-----------|
| `target` | 编译目标 JS 版本 | 决定生成的代码能否在当前 Node 版本运行 |
| `module` | 模块系统 | Node 常用 `CommonJS`，现代项目可用 `ESNext` + `"type": "module"` |
| `outDir` | 编译输出目录 | 避免 `.js` 和 `.ts` 混在一起，便于清理 |
| `rootDir` | 源码根目录 | 保持编译后的目录结构与源码一致 |
| `strict` | 开启严格模式 | 尽早暴露类型错误，减少运行时意外 |

### 为什么先学配置

后续 NestJS、Prisma 等框架都基于 TypeScript。理解 `tsconfig.json` 能让你在遇到编译错误时快速定位是类型问题还是配置问题。

## 2. Promise / async / await

### Promise 解决什么问题

回调地狱（Callback Hell）让异步代码难以阅读和维护。Promise 把异步结果包装成对象，通过 `.then()` 和 `.catch()` 链式处理。

### async / await 是什么

`async` 函数会自动把返回值包装成 Promise；`await` 会暂停当前 async 函数的执行，等待 Promise 解决。它让异步代码看起来像同步代码，但本质上仍是 Promise。

### 错误处理两种方式

```ts
// 方式一：.catch()
fetchData().catch(err => console.error(err));

// 方式二：try / await
try {
  const data = await fetchData();
} catch (err) {
  console.error(err);
}
```

### 常见误区

- `await` 只能用在 `async` 函数内部（顶层 await 需要特定环境）。
- `async` 函数内部抛出错误会返回一个 rejected Promise。
- 在循环里 `await` 会串行执行；需要并行时用 `Promise.all`。

## 3. Event Loop 宏观流程

Node.js 的 Event Loop 让单线程能够处理大量并发 I/O。宏观上记住以下几点即可：

1. **同步代码先执行**：所有同步任务进入调用栈，执行完毕。
2. **宏任务（macrotask）排队**：`setTimeout`、`setInterval`、I/O 回调等进入对应队列。
3. **微任务（microtask）优先执行**：`Promise.then()`、`process.nextTick` 等在当前阶段结束后尽快执行。
4. **Node.js 分阶段**：timers → pending callbacks → idle/prepare → poll → check → close callbacks，每阶段之间会清空微任务。

### 为什么要理解 Event Loop

后端服务大量依赖异步 I/O（数据库、文件、网络）。理解 Event Loop 能帮你：
- 避免阻塞主线程的长耗时操作。
- 理解为什么 `setTimeout(fn, 0)` 不会立即执行。
- 排查「为什么我的异步代码顺序不对」这类问题。
