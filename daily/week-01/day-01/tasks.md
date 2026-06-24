---
week: 1
day: 1
date: 2026-06-24
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, 环境配置, 异步基础, Event Loop]
file: tasks.md
---

# 今日任务清单

## 理论学习：30-40min

- [x] 安装 Node.js 并理解 npm / pnpm 包管理器
  - 建议时间段：0:00-0:20
  - 验收标准：`node --version` 和 `pnpm --version` 能正常输出版本号
  - AI 辅助提示：AI 可以帮你：生成最小 `tsconfig.json` 并解释每个字段的含义，对比 npm / yarn / pnpm 的差异。

- [ ] 理解 TypeScript 编译流程与 `tsconfig.json` 核心字段（部分完成）
  > 卡点：对 target / module / lib 的对应关系没完全理解
  - 建议时间段：0:20-0:40
  - 验收标准：能解释 `target`、`module`、`outDir`、`rootDir`、`strict` 的作用，并运行 `npx tsc --version` 输出版本号
  - AI 辅助提示：AI 可以帮你：逐行解释 `tsconfig.json` 配置，推荐适合 Node.js 项目的 starter 配置。

## 动手实践：40-60min

- [x] 初始化最小 TypeScript 工程并运行第一个 `.ts` 文件
  - 建议时间段：0:40-1:20
  - 验收标准：工程目录包含 `package.json`、`tsconfig.json`，`npx tsc` 编译无报错，且能生成 `.js` 文件；运行 `node dist/index.js` 或 `npx tsx src/index.ts` 能打印出预期输出
  - AI 辅助提示：AI 可以帮你：生成最小工程骨架，排查 "Cannot find module" 等常见报错。

- [x] 复习 Promise 三种状态与链式调用
  - 建议时间段：1:20-1:40
  - 验收标准：能手写 `new Promise((resolve, reject) => { ... })` 并解释执行顺序，能用 `.then().catch()` 处理成功与失败分支
  - AI 辅助提示：AI 可以帮你：出 3 道 Promise 执行顺序题并逐行讲解，纠正常见误区。

## 验证/测试：25-35min

- [x] 用 `async/await` 改写回调函数
  - 建议时间段：1:40-1:55
  - 验收标准：给出一个包含错误处理的 async 函数示例，能正确捕获异常并打印错误信息
  - AI 辅助提示：AI 可以帮你：对比 `.then().catch()` 与 `async/await` 的写法差异，生成带边界条件的测试用例。

- [x] 预测并验证 Event Loop 执行顺序
  - 建议时间段：1:55-2:10
  - 验收标准：能独立预测 `同步代码 → 微任务 → 宏任务` 的执行顺序，并解释为什么 `setTimeout(fn, 0)` 不会立即执行；运行 `demo/event-loop-order.ts` 并观察输出是否与预测一致
  - AI 辅助提示：AI 可以帮你：生成 3 道由浅入深的 Event Loop 练习题，并逐行讲解执行流程。

## 复盘：10min

- [x] 整理今日疑问到 `review.md`
  - 建议时间段：2:10-2:20
  - 验收标准：`review.md` 中至少记录 1 个疑问和 1 个收获
  - AI 辅助提示：AI 可以帮你：根据记录内容生成结构化复盘模板，提炼关键概念清单。

---

## 今日结束后项目状态

从零开始，没有前置代码。今日完成后，你将拥有一个可运行的最小 TypeScript 工程骨架，理解 Promise 基础、async/await 语法与 Event Loop 执行顺序，并能描述本周如何在此基础上用原生 `http` 模块写出最小 JSON 服务。
