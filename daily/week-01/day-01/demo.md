---
week: 1
day: 1
date: 2026-06-23
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, 环境配置, 异步基础]
file: demo.md
---

# 今日代码目标

## 目标
创建一个可编译、可运行的最小 TypeScript 项目，包含：
1. 基础 `tsconfig.json`
2. 一个演示 Promise 链式调用的示例
3. 一个演示 async/await 错误处理的示例

## `demo/` 文件说明

| 文件 | 说明 |
|------|------|
| `demo/package.json` | 项目配置，含 TypeScript 依赖 |
| `demo/tsconfig.json` | 严格模式配置 |
| `demo/promise-chain.ts` | Promise 链式调用示例 |
| `demo/async-error-handling.ts` | async/await 错误处理示例 |

## 运行步骤

```bash
cd daily/week-01/day-01/demo
pnpm install
npx tsc
node dist/promise-chain.js
node dist/async-error-handling.js
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
