---
week: 1
day: 3
date: 2026-06-24
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, Event Loop, macrotask, microtask]
file: tasks.md
---

# 今日任务清单

## 理论学习：30-40min

- [ ] 阅读 Node.js 官方 Event Loop 文档，理解阶段划分
  - 建议时间段：0:00-0:20
  - 验收标准：能口头解释 timers、poll、check、close callbacks 四个核心阶段的作用
  - AI 辅助提示：AI 可以帮你：用播客场景（如"用户点击播放按钮后，音频加载与进度更新如何排队"）解释 Event Loop 阶段，生成记忆口诀。

- [ ] 区分 macrotask（宏任务）与 microtask（微任务）
  - 建议时间段：0:20-0:40
  - 验收标准：能列举常见的 macrotask（`setTimeout`、`setImmediate`、I/O）和 microtask（`Promise.then`、`process.nextTick`），并解释执行优先级
  - AI 辅助提示：AI 可以帮你：用播客场景解释 macrotask/microtask（如"新节目推送通知 vs 播放进度更新"），生成对比表格。

## 动手实践：40-60min

- [ ] 画出 Event Loop 执行顺序图
  - 建议时间段：0:40-1:10
  - 验收标准：手绘或电子图包含：同步代码、macrotask 队列、microtask 队列，以及它们之间的执行顺序箭头
  - AI 辅助提示：AI 可以帮你：根据你画的图检查逻辑是否正确，补充遗漏的边缘情况（如 `process.nextTick` 在 Node.js 中的特殊优先级）。

- [ ] 编写 `demo/event-loop-order.ts` 验证理论
  - 建议时间段：1:10-1:40
  - 验收标准：代码包含 `setTimeout`、`Promise.then`、`process.nextTick`（Node.js 环境），运行后输出顺序与你的理论分析一致
  - AI 辅助提示：AI 可以帮你：生成包含陷阱的执行顺序题，讲解为什么实际输出与直觉不同。

## 验证/测试：15-20min

- [ ] 运行代码并对比理论预测与实际输出
  - 建议时间段：1:40-1:55
  - 验收标准：能独立解释 `demo/event-loop-order.ts` 的每一行输出顺序，说明它属于哪个阶段或队列
  - AI 辅助提示：AI 可以帮你：如果输出与预测不符，逐行分析执行流程，定位理解偏差。

## 复盘：10min

- [ ] 整理今日疑问到 `review.md`
  - 建议时间段：1:55-2:00
  - 验收标准：`review.md` 中至少记录 1 个疑问和 1 个收获
  - AI 辅助提示：AI 可以帮你：根据记录内容生成结构化复盘模板，提炼关键概念清单。

---

## 今日结束后项目状态

拥有 `demo/event-loop-order.ts` 可运行示例，能独立解释 macrotask/microtask 输出顺序，手绘 Event Loop 执行流程图。
