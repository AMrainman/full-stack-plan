---
week: 1
day: 1
date: 2026-06-24
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, 环境配置, 异步基础, Event Loop]
file: demo.md
---

# 今日代码目标

## 目标
创建一个可编译、可运行的最小 TypeScript 项目，包含：
1. 基础 `tsconfig.json`
2. 一个演示 Promise 链式调用的示例
3. 一个演示 async/await 错误处理的示例
4. 一个演示 Event Loop 执行顺序的示例

## `demo/` 文件说明

| 文件 | 说明 |
|------|------|
| `demo/package.json` | 项目配置，含 TypeScript 依赖 |
| `demo/tsconfig.json` | 严格模式配置 |
| `demo/promise-chain.ts` | Promise 链式调用示例 |
| `demo/async-error-handling.ts` | async/await 错误处理示例 |
| `demo/event-loop-order.ts` | Event Loop 执行顺序示例 |

## 运行步骤

```bash
cd daily/week-01/day-01/demo
pnpm install
npx tsc
node dist/promise-chain.js
node dist/async-error-handling.js
node dist/event-loop-order.js
```

## 预期输出

`promise-chain.js`：
```
开始读取用户...
用户: Alice
订单: [ 'book', 'pen' ]
```

`async-error-handling.js`：
```
尝试获取数据...
请求失败: 网络错误
清理资源...
```

`event-loop-order.js`（输出顺序可能因运行时机略有不同，详见文件内注释）：
```
1. 同步代码开始
2. 同步代码结束
3. nextTick 1
4. nextTick 嵌套
5. Promise.then 1
6. Promise.then 嵌套
7. setInterval（第一次触发）
8. setTimeout 0ms（timers 阶段）
9. setTimeout 里的 nextTick
10. setTimeout 里的 Promise.then
11. setImmediate（check 阶段）
12. setImmediate 里的 nextTick
13. setImmediate 里的 Promise.then
14. setTimeout 里的 setImmediate
15. fs.readFile 回调（poll 阶段）
16. I/O 回调里的 nextTick
17. I/O 回调里的 setImmediate
18. I/O 回调里的 setTimeout
```

> 如果输出顺序与你的预期不同，请回到 `knowledge.md` 复习 Event Loop 的「同步 → nextTick → Promise → timers/poll/check」顺序。
