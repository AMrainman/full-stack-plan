---
week: 1
day: 2
date: 2026-06-25
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 3
tags: [TypeScript, Node.js, http, JSON, RESTful]
file: resources.md
---

# 学习资源

## 官方文档

- [Node.js http 模块官方文档](https://nodejs.org/api/http.html)
- [Node.js 事件循环官方指南](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
- [TypeScript tsconfig 参考](https://www.typescriptlang.org/tsconfig)

## 精选文章

- [MDN HTTP 概述](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Overview)
- [MDN HTTP 状态码](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)
- [RESTful API 设计指南](https://restfulapi.net/)

## 视频

- 搜索关键词：「Node.js 原生 http 模块」「手写 HTTP 服务器」「RESTful API 入门」

## 练习

- 给 `minimal-http-server.ts` 增加 `PUT /podcasts/:id` 和 `DELETE /podcasts/:id`。
- 用 `URL` 对象解析 `req.url`，支持查询参数（如 `?author=张三`）。
- 给 `POST /podcasts` 增加必填字段校验，缺少字段时返回 400。

## 参考仓库

- 本项目：`full-stack-plan` 中 `daily/week-01/day-02/demo/`
