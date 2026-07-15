---
week: 1
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
---

# 第 1 周概览

## 阶段
阶段一：后端基础与数据库

## 本周主题
TypeScript + Node.js 热身

## 核心任务
配置 TS 环境；复习 Promise/async-await/Event Loop；用原生 `http` 写最小 JSON 服务

## 产出物
最小 HTTP 服务

## 本周目标
- 搭建 TypeScript + Node.js 开发环境
- 理解异步编程核心概念
- 能写出可运行的原生 HTTP 服务

## 本周学习报告

- 报告文件：[REPORT.md](./REPORT.md)
- 生成日期：2026-07-15
- 总学习时长：13 小时
- 完成率：31 / 38（81.6%）
- 整体掌握度：🟢 10 · 🟡 1 · 🔴 0

### 学习结果记录

- 主要收获：
  - 理解了 Node.js Event Loop 的执行顺序与异步任务调度。
  - 掌握了原生 `http` 模块的请求-响应流程，能独立实现最小 JSON 服务。
  - 理解了中间件模式，以及 `next()` / `next(err)` 的控制权传递。
  - 实现了类 Express 的 `App` 对象，清楚了框架底层的中间件队列与路由匹配。
  - 了解了 Express 与 Koa 的设计差异及适用场景。
- 遗留疑问：
  - 需加强 `tsconfig.json` 中 `target / module / moduleResolution / lib / types` 的对应关系记忆。
  - day-06 尚未复盘，待补充接口测试策略和 demo 工程化的掌握度。
- 产出物状态：最小 HTTP 服务已基本完成，待完成 day-06 的 `test.sh` 与工程化整理。
