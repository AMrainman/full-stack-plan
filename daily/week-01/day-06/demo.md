---
week: 1
day: 6
date: 2026-07-15
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, HTTP, 测试, 文档]
file: demo.md
---

# 今日 Demo 说明

## 目标

把本周手写 HTTP 服务的最终成果整理成一个可独立运行、可一键测试的 demo 工程。

## 文件结构

```text
demo/
├── README.md              # 运行说明与接口清单
├── package.json           # 依赖与脚本
├── tsconfig.json          # TypeScript 配置
├── app.ts                 # 类 Express 的 App 对象
├── router.ts              # 路由类型定义
├── minimal-http-server.ts # 播客 CRUD 服务入口
└── test.sh                # 一键测试脚本
```

## 运行步骤

```bash
cd daily/week-01/day-06/demo
pnpm install
pnpm dev        # 启动服务
```

服务启动后访问：

```bash
curl http://localhost:3000/health
curl http://localhost:3000/podcasts
curl "http://localhost:3000/podcasts?category=tech"
curl http://localhost:3000/podcasts/1
```

## 一键测试

```bash
./test.sh
```

预期输出：
- 启动服务
- 依次调用健康检查、列表、过滤、详情、创建、更新、删除、404、500 接口
- 每个请求打印状态码和响应体
- 最后关闭服务并输出「所有测试通过」

## 今日结束后 demo 状态

`demo/` 目录是一个结构完整的可复现工程，任何人克隆仓库后都能按 README 跑通本周「最小 HTTP 服务」的全部能力。
