---
week: 1
day: 6
date: 2026-06-24
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, HTTP, 测试, 文档]
file: demo.md
---

# 今日代码目标

## demo 文件结构

```text
demo/
├── README.md              # 运行说明
├── package.json           # 依赖与脚本
├── tsconfig.json          # TypeScript 配置
├── promise-chain.ts       # day-01：Promise 链与错误处理
├── event-loop-order.js    # day-02：Event Loop 执行顺序
├── minimal-http-server.ts # day-04：最小 HTTP 服务
├── podcast-server.ts      # day-05：带持久化的播客 CRUD
├── podcasts.json          # 持久化数据
└── test.sh                # 自动测试脚本
```

## 运行步骤

1. 进入 demo 目录：
   ```bash
   cd daily/week-01/day-06/demo
   ```

2. 安装依赖：
   ```bash
   pnpm install
   ```

3. 运行单个 demo：
   ```bash
   npx tsx promise-chain.ts
   npx tsx minimal-http-server.ts
   npx tsx podcast-server.ts
   ```

4. 运行自动测试：
   ```bash
   bash test.sh
   ```

## 预期输出

- `test.sh` 会启动 `podcast-server.ts`，依次测试：
  - `GET /health` → 200
  - `GET /api/podcasts` → 200 + 数组
  - `GET /api/podcasts?category=tech` → 200 + 过滤后数组
  - `POST /api/podcasts` → 201 + 新对象
  - `GET /unknown` → 404
- 测试结束后自动关闭服务。

## 今日结束后项目状态

本周所有 demo 文件整理为可复现工程，`test.sh` 可自动验证关键接口。
