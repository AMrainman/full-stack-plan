---
week: 1
day: 6
date: 2026-06-24
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, HTTP, 测试, 文档]
file: resources.md
---

# 学习资源

## 官方文档

- [Node.js http 模块](https://nodejs.org/api/http.html)
- [Bash 脚本基础](https://www.gnu.org/software/bash/manual/bash.html)
- [curl 官方文档](https://curl.se/docs/manpage.html)

## 精选文章

- 《如何写好可复现的 demo 项目》
- 《HTTP 接口测试的常用方法与工具》

## 练习题

1. 为 `test.sh` 增加 400 场景测试：发送非法 JSON，断言返回 400。
2. 为 `test.sh` 增加 500 场景测试：临时修改服务端代码抛出异常，断言返回 500 且服务未崩溃。
3. 把 `test.sh` 改写为 Node.js 脚本，使用 `node:http` 直接发起请求。
