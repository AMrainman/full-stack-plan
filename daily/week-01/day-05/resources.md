---
week: 1
day: 5
date: 2026-06-24
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, HTTP, JSON, 持久化]
file: resources.md
---

# 学习资源

## 官方文档

- [Node.js http 模块](https://nodejs.org/api/http.html)
- [Node.js fs 模块](https://nodejs.org/api/fs.html)
- [MDN - URL API](https://developer.mozilla.org/zh-CN/docs/Web/API/URL)

## 精选文章

- [Node.js 流（Stream）基础](https://nodejs.org/api/stream.html)
- [MDN - HTTP 请求方法](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods)

## 参考仓库

- 暂无外部仓库，以当天 `demo/podcast-server.ts` 为准。

## 练习题

1. 为 `POST /api/podcasts` 增加字段校验：要求 `title` 必填且长度 > 0，否则返回 400。
2. 实现 `DELETE /api/podcasts/:id`，从 JSON 文件中删除指定 id 的播客。
3. 把文件读写改为异步版本（`fs.promises.readFile` / `writeFile`），观察对并发请求的影响。
