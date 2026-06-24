---
week: 1
day: 2
date: 2026-06-24
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, Promise, async-await, 错误处理]
file: tasks.md
---

# 今日任务清单

## 理论学习：30-40min

- [ ] 深入理解 Promise 链式调用与错误传播机制
  - 建议时间段：0:00-0:20
  - 验收标准：能解释 `.then()` 返回新 Promise 的原理，能说明未捕获的 `reject` 会如何传播
  - AI 辅助提示：AI 可以帮你：用播客场景（如"同时获取多个播客封面"）解释 Promise 链，出 2 道错误传播分析题。

- [ ] 对比 `Promise.all` vs 循环中 `await` 的执行差异
  - 建议时间段：0:20-0:40
  - 验收标准：能画出串行循环（`for...of` + `await`）与 `Promise.all` 并行执行的时序图，并说明适用场景
  - AI 辅助提示：AI 可以帮你：生成对比代码示例，分析性能差异与错误处理行为（`Promise.all` 一个失败 vs 循环中单个失败）。

## 动手实践：40-60min

- [ ] 手写 Promise 链并处理复杂异步流程
  - 建议时间段：0:40-1:20
  - 验收标准：`demo/promise-chain.ts` 可运行，包含至少 3 个 `.then()` 步骤、1 个 `.catch()` 错误处理，且能按预期输出成功与失败分支
  - AI 辅助提示：AI 可以帮你：审查 Promise 链是否遗漏错误处理，建议更清晰的 async/await 改写方案。

- [ ] 实现 `Promise.all` 与串行循环的对比 demo
  - 建议时间段：1:20-1:40
  - 验收标准：创建 `demo/promise-all-vs-loop.ts`，分别用两种方式模拟"获取 3 个播客详情"，打印各自耗时，验证并行更快
  - AI 辅助提示：AI 可以帮你：生成计时逻辑，解释为什么 `Promise.all` 在 IO 密集型场景更优。

## 验证/测试：15-20min

- [ ] 运行 demo 并验证输出符合预期
  - 建议时间段：1:40-1:55
  - 验收标准：终端运行 `npx tsx demo/promise-chain.ts` 和 `npx tsx demo/promise-all-vs-loop.ts` 无报错，输出顺序与耗时符合理论分析
  - AI 辅助提示：AI 可以帮你：分析实际输出与预期不符的原因，排查异步时序问题。

## 复盘：10min

- [ ] 整理今日疑问到 `review.md`
  - 建议时间段：1:55-2:00
  - 验收标准：`review.md` 中至少记录 1 个疑问和 1 个收获
  - AI 辅助提示：AI 可以帮你：根据记录内容生成结构化复盘模板，提炼关键概念清单。

---

## 今日结束后项目状态

拥有一个可运行的 `demo/promise-chain.ts` 和 `demo/promise-all-vs-loop.ts`，深入理解 Promise 链式调用、错误处理、`Promise.all` 与串行循环的差异。
