---
week: 1
day: 4
date: 2026-06-23
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, HTTP, Event Loop]
file: tasks.md
---

# 今日任务清单

## 高优先级

- [ ] 在 `demo/` 目录下初始化 TypeScript 工程
  - 创建 `package.json`，安装 `typescript` 和 `tsx` 作为 devDependencies
  - 创建 `tsconfig.json`，启用 `strict` 和 `esModuleInterop`
  - 建议时间段：0:00-0:30
  - 验收标准：`pnpm install` 无报错，`npx tsc --noEmit` 能正常检查类型

- [ ] 实现最小 HTTP 服务
  - 使用 Node.js 原生 `http` 模块创建服务器
  - 监听端口 3000，至少支持 `/health` 和 `/api/podcasts` 两个路由
  - `/api/podcasts` 返回 JSON 数组（可先用硬编码数据）
  - 建议时间段：0:30-1:10
  - 验收标准：`pnpm dev` 启动后，`curl http://localhost:3000/health` 返回 `200 OK`

- [ ] 加入异步逻辑与错误处理
  - 在路由处理函数中使用 `async/await` 模拟一次异步读取（例如 100ms 延迟）
  - 为未匹配路由返回 `404 Not Found`
  - 为未捕获异常返回 `500 Internal Server Error`，避免进程崩溃
  - 建议时间段：1:10-1:40
  - 验收标准：访问不存在的路由返回 404；手动抛错时服务不崩溃并返回 500

## 中优先级

- [ ] 阅读 `demo.md` 中的运行说明，按步骤在本地跑通
  - 建议时间段：1:40-1:55
  - 验收标准：终端能看到服务启动日志，接口返回预期 JSON

## 低优先级

- [ ] 在 `review.md` 记录今天卡点和收获
  - 建议时间段：1:55-2:00
  - 验收标准：至少写一条「今天才理解」和一条「还不太懂」
