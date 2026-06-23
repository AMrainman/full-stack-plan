---
week: 1
day: 1
date: 2026-06-23
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, 环境配置, 异步基础]
file: resources.md
---

# 学习资源

## 官方文档

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [Node.js 官方文档](https://nodejs.org/en/docs/)

## 精选文章 / 视频

- [TypeScript 严格模式指南](https://www.typescriptlang.org/tsconfig#strict)
- [Promise 详解 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [async/await 详解 - MDN](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Asynchronous/Async_await)
- [Node.js Event Loop 可视化](https://www.youtube.com/watch?v=8aGhZQkoFbQ)（Philip Roberts，经典演讲）

## 参考仓库

- [microsoft/TypeScript-Node-Starter](https://github.com/microsoft/TypeScript-Node-Starter) — 官方推荐的 TS + Node 项目模板

## 练习题

1. 将以下回调代码改写为 Promise + async/await：
   ```js
   fs.readFile('file.txt', (err, data) => {
     if (err) throw err;
     console.log(data);
   });
   ```
2. 预测以下代码输出顺序并解释原因：
   ```js
   console.log('1');
   setTimeout(() => console.log('2'), 0);
   Promise.resolve().then(() => console.log('3'));
   console.log('4');
   ```
