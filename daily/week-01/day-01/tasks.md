---
week: 1
day: 1
date: 2026-06-23
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, 环境配置, 异步基础]
file: tasks.md
---

# 今日任务清单

## 高优先级

- [ ] 初始化 Node.js 项目并安装 TypeScript 依赖
  - 建议时间段：0:00-0:20
  - 验收标准：`npx tsc --version` 能正常输出版本号

- [ ] 配置 `tsconfig.json`（严格模式）
  - 建议时间段：0:20-0:40
  - 验收标准：编译示例文件无报错，且能捕获 `any` 隐式类型

- [ ] 复习 Promise 三种状态与链式调用
  - 建议时间段：0:40-1:00
  - 验收标准：能手写 `new Promise((resolve, reject) => ...)` 并解释执行顺序

- [ ] 用 `async/await` 改写回调函数
  - 建议时间段：1:00-1:20
  - 验收标准：给出一个包含错误处理的 async 函数示例

- [ ] 画出 Event Loop 执行顺序图（macrotask vs microtask）
  - 建议时间段：1:20-1:40
  - 验收标准：能解释 `setTimeout(() => console.log(1), 0)` 与 `Promise.resolve(2).then(...)` 的打印顺序

- [ ] 整理今日疑问到 `review.md`
  - 建议时间段：1:40-2:00
  - 验收标准：`review.md` 中至少记录 1 个疑问和 1 个收获

## 低优先级（时间充裕时）

- [ ] 阅读 Node.js 官方文档「Introduction to Node.js」章节
- [ ] 浏览本周后续天数的任务，提前了解学习路径
