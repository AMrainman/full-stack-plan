---
week: 1
day: 2
date: 2026-06-23
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [typescript, nodejs, promise, async-await, event-loop]
file: tasks.md
---

# 今日任务清单

## 知识学习

- [ ] **Task 1：TypeScript 最小工程配置（40min）**
  - 创建 `tsconfig.json` 并理解 `target`、`module`、`outDir`、`rootDir`、`strict`。
  - 用 `tsc` 编译一个 `.ts` 文件，观察输出目录。
  - 验收标准：能成功运行 `npx tsc` 并生成 `.js`。

- [ ] **Task 2：Promise / async / await（40min）**
  - 手写一个返回 Promise 的异步函数。
  - 用 `.then().catch()` 和 `async/await` 两种方式调用。
  - 理解 `await` 在 `for` 循环与 `Promise.all` 中的差异。
  - 验收标准：`demo/promise-chain.ts` 能按预期输出成功与错误分支。

- [ ] **Task 3：Event Loop 宏观流程（30min）**
  - 阅读 Node.js Event Loop 官方文档或图解资料。
  - 能解释同步代码、setTimeout、Promise microtask 的执行顺序。
  - 验收标准：能独立画出 `demo/event-loop-order.js` 的输出顺序。

## 复盘

- [ ] **Task 4：填写 review.md（10min）**
  - 记录今天最大的一个收获和一个疑问。
  - 验收标准：`review.md` 不为空。

## 时间提醒

- 总时长约 2h，如果某个任务超时，先标记为「未完成」，明天继续。
