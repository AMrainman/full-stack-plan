---
week: 1
day: 3
date: 2026-06-23
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [nodejs, http, typescript, json]
file: resources.md
---

# 学习资源

## 官方文档

- [Node.js http 模块官方文档](https://nodejs.org/api/http.html)
- [Node.js 创建 HTTP 服务入门](https://nodejs.org/en/learn/modules/what-is-the-http-module)

## 精选文章

- [HTTP 状态码速查](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)
- [Content-Type 对照表](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Type)

## 视频

- 搜索关键词：「Node.js http 模块 手写服务器」「原生 http 模块 JSON API」

## 练习

- 给 `/api/hello` 增加一个查询参数 `name`，返回 `{ "message": "Hello, {name}" }`。
- 实现一个 `/api/health` 接口，返回 `{ "status": "ok" }`。
- 尝试用 `POST` 方法接收 JSON body 并原样返回（需要读取 req 流）。
