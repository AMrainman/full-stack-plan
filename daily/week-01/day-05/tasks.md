---
week: 1
day: 5
date: 2026-07-08
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, http, middleware, router, Express]
file: tasks.md
---

# 今日任务清单

## 理论学习：30min

- [x] 理解 `app.use` 与 `app.get` 的注册顺序和执行顺序
  - 建议时间段：0:00-0:30
  - 验收标准：能解释「先注册的中间件先执行」；能解释路由也是特殊的中间件；能说明 `app.use('/api', handler)` 与 `app.get('/api', handler)` 的区别
  - AI 辅助提示：AI 可以帮你：把 Express 的请求处理流程画成时间线图，标注每个中间件和路由的入栈、执行、出栈顺序。
  - 今日结束后项目状态：脑子里有一张「注册顺序 ≠ 匹配顺序，执行顺序由注册顺序和 next() 共同决定」的图。

## 动手实践：45min

- [x] 实现类 Express 的 `App` 对象 `demo/app.ts`
  - 建议时间段：0:30-1:15
  - 验收标准：`app.use(middleware)` 可注册普通中间件；`app.get/post/put/delete(path, handler)` 可注册路由；`app.use(errorHandler)` 可注册 4 参数错误处理中间件；`app.listen(port)` 能启动服务；`next()` 能把控制权交给下一个中间件；调用 `next(err)` 能跳到错误处理中间件
  - AI 辅助提示：AI 可以帮你：设计 `App` 内部的数据结构，决定如何存放普通中间件、路由表、错误处理中间件；把 day-03 的 `compose` 和 day-04 的 `Router` 组合起来。
  - 今日结束后项目状态：项目里多了一个可复用的 `App` 类，接口风格接近 Express，能同时管理中间件和路由。

## 编码验证：30min

- [x] 用 `App` 重构播客 CRUD 服务 `demo/minimal-http-server.ts`
  - 建议时间段：1:15-1:45
  - 验收标准：服务通过 `const app = new App()` 创建；`app.use(logger)`、`app.use(bodyParser)`、`app.get('/health', ...)`、`app.use(notFound)`、`app.use(errorHandler)` 这种链式/顺序式注册；业务 handler 不再直接调用 `compose` 或 `new Router()`；handler 抛出的异常被 4 参数错误处理中间件捕获
  - AI 辅助提示：AI 可以帮你：把 day-04 的 `minimal-http-server.ts` 里的 `compose([...])` 调用迁移到 `App` 上，并补上一个 `(err, req, res, next) => {}` 错误处理中间件。
  - 今日结束后项目状态：服务从「手动组合 compose + Router」升级为「用 App 对象管理全生命周期」，代码结构几乎和 Express 一致。

## 测试与复盘：15min

- [x] 用 curl 验证中间件、路由、错误处理的执行顺序
  - 建议时间段：1:45-2:00
  - 验收标准：依次验证 `GET /health`、带查询参数的 `GET /podcasts?category=tech`、路径参数 `GET /podcasts/1`、触发 404 的路径、触发 handler 异常的路径，观察日志中间件和错误处理中间件是否按预期工作
  - AI 辅助提示：AI 可以帮你：整理 curl 命令和预期输出表格，检查中间件执行顺序是否符合注册顺序。
  - 今日结束后项目状态：`App` 经过手动测试，能稳定处理中间件、路由、404 和异常，本周「最小 HTTP 服务」目标完成。

---

## 今日结束后项目状态

在 day-04 的路由分发器基础上，引入类 Express 的 `App` 对象。服务通过 `app.use` 注册中间件、通过 `app.get/post/put/delete` 注册路由、通过 4 参数 `app.use(errorHandler)` 统一捕获异常。这是本周产出「最小 HTTP 服务」的最终形态：接口接近 Express，但全部由原生 `http` 模块手写实现。
