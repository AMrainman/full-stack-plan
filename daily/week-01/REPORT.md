---
week: 1
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
date: 2026-07-15
hours: 13
tags: [TypeScript, Node.js, HTTP, middleware, router, Express, RESTful, async-await, Event Loop]
output: 最小 HTTP 服务
file: REPORT.md
---

# 第 1 周学习总结报告

## 一、本周概览

- **阶段**：后端基础与数据库
- **主题**：TypeScript + Node.js 热身
- **核心任务**：配置 TS 环境；复习 Promise/async-await/Event Loop；用原生 `http` 写最小 JSON 服务
- **预期产出物**：最小 HTTP 服务
- **学习天数**：6 天
- **总学习时长**：13 小时
- **平均每日时长**：约 2.2 小时

### 完成率统计

- 已完成检查项：31 / 38（81.6%）
- 整体掌握度：🟢 10 · 🟡 1 · 🔴 0

> 本周 day-06 尚未完成复盘，因此完成率偏低。待 day-06 复盘后，可重新生成本报告更新数据。

---

## 二、本周核心知识地图

本周用 6 天时间，从 TypeScript 工程环境出发，经过异步基础、原生 HTTP 服务、中间件流水线、路由分发器，最终封装出一个类 Express 的 `App` 对象。整条路径的设计意图非常清晰：**先理解底层机制，再体会框架为什么这样设计**。

**学习链路：**

```text
TypeScript 环境配置
    ↓
Promise / async-await / Event Loop（异步基础）
    ↓
原生 http.createServer（请求-响应本质）
    ↓
中间件流水线（next、错误处理、关注点分离）
    ↓
路由分发器（Method + Path 匹配、路径参数、查询参数）
    ↓
类 Express 的 App 对象（app.use / app.get / 错误处理中间件）
    ↓
demo 工程化与接口测试（可复现、可验证）
```

**与播客应用的关系：** 播客应用最终是一个 RESTful API 服务，要处理用户注册、节目 CRUD、订阅收藏等请求。本周写的「最小 HTTP 服务」虽然简单，但已经覆盖了真实服务的核心骨架：接收 HTTP 请求 → 解析路径与方法 → 经过中间件处理 → 路由到对应 handler → 返回 JSON 响应 → 统一捕获错误。下周学习 Express 时，你会发现 Express 只是把本周手写的逻辑标准化、工程化了。

---

## 三、重点知识详解

### 📌 TypeScript 严格模式与 `tsconfig.json` 字段

**为什么重要：** TypeScript 是前后端统一的语言栈。后端 API 对入参、出参的类型要求比前端更严格，因为一旦接口上线，类型错误会直接变成线上 bug 或 500 响应。`tsconfig.json` 里的 `target`、`module`、`moduleResolution`、`types` 共同决定了 TS 如何编译、如何解析模块、Node.js 能否正确运行。

**核心要点：**
- `target` 决定语法降级程度，`module` 决定模块封装方式，**两者不要混为一谈**。
- Node.js v20+ 的 ES Module 项目推荐 `module: "NodeNext"` + `moduleResolution: "NodeNext"`。
- `package.json#type: "module"` 告诉 Node.js 用 ES Module，但 TS 编译还要靠 `module` 字段生成对应产物。
- `"strict": true` 开启 `noImplicitAny`、`strictNullChecks` 等检查，能在编译期拦截大量运行时错误。

**常见误区 / 面试常问：**
- ❌ 误区：以为 `module: "ESNext"` 就能让 Node.js 直接运行 TS。
  - ✅ 正解：TS 需要先编译成 JS，Node.js 执行的是编译后的 JS；`module` 影响的是编译产物格式。
- ❌ 误区：看到类型报错就加 `any`。
  - ✅ 正解：`any` 会关闭类型检查，应优先用具体类型、泛型或 `unknown` + 类型收窄。

**与本周其他知识的联系：** 只有 TS 环境配置正确，后续的原生 HTTP 服务、`demo/app.ts` 才能顺利编译运行；也是进入 Express / NestJS 项目前的必要准备。

---

### 📌 Node.js 事件循环与异步执行顺序

**为什么重要：** Node.js 是单线程事件驱动模型，I/O 操作（文件、网络、数据库）全是异步的。理解 Event Loop 能帮你预测代码执行顺序、排查异步 bug、避免未处理的 Promise 拒绝导致进程崩溃。

**核心要点：**
- 同步代码先执行。
- 微任务（microtask）：`Promise.then()`、`process.nextTick()` 优先于宏任务。
- 宏任务（macrotask）：`setTimeout`、`setInterval`、I/O 回调。
- Promise 一旦进入 `fulfilled` / `rejected` 状态就不可再变；`.then()` 返回新 Promise，支持链式调用。
- `async` 函数返回 Promise，内部 `await` 会暂停并把后续代码放入微任务队列。

**常见误区 / 面试常问：**
- ❌ 误区：以为 `setTimeout(fn, 0)` 会「立即」执行。
  - ✅ 正解：它至少要等当前同步代码和微任务全部执行完。
- ❌ 误区：认为 `async` 函数里的同步异常会自动被 Promise 捕获。
  - ✅ 正解：`async` 函数内抛出的异常会被包装成 rejected Promise；但如果是在回调里抛出的同步错误，仍需 `try/catch`。

**与本周其他知识的联系：** Event Loop 是中间件执行器、异步错误处理、HTTP 请求处理的底层基础。day-03 的 `result.catch(dispatch)` 正是为了不漏掉 Promise 形式的中间件错误。

---

### 📌 原生 `http` 模块与最小 JSON 服务

**为什么重要：** Express / NestJS 底层都是 `http.createServer`。理解原生模块能让你清楚「请求怎么进来、响应怎么出去」，也能在框架高级问题（流式响应、自定义 header）时排查到底层。

**核心要点：**
- `req` 是可读流，`res` 是可写流。
- `req.method`、`req.url`、`req.headers` 是处理请求的三大入口信息。
- `res.writeHead(statusCode, headers)` 用于设置状态码和响应头；`res.end(data)` 结束响应。
- RESTful 风格：URL 表示资源，HTTP 方法表示操作（GET 查、POST 建、PUT 改、DELETE 删）。
- JSON 请求体需要手动拼接 Buffer 再 `JSON.parse`，且必须 `try/catch` 防止非法 JSON 导致进程崩溃。

**常见误区 / 面试常问：**
- ❌ 误区：直接 `JSON.parse(body)` 而不处理空字符串或非法 JSON。
  - ✅ 正解：空 body 时 `JSON.parse('')` 会抛异常，生产环境应设置默认值或返回 400。
- ❌ 误区：忘记设置 `Content-Type: application/json`。
  - ✅ 正解：统一返回 JSON 错误体能显著提升前后端协作效率。

**与本周其他知识的联系：** 原生 HTTP 服务是中间件和路由的「舞台」。day-02 先实现它，day-03 抽象出中间件，day-04 抽象出路由，day-05 再组合成 `App`。

---

### 📌 中间件（Middleware）与 `next()`

**为什么重要：** 中间件是 Express / Koa / NestJS 的核心设计模式。它把日志、请求体解析、鉴权、错误处理等横切关注点从业务路由中抽离，让代码可复用、可组合。

**核心要点：**
- 中间件签名：`(req, res, next) => void | Promise<void>`。
- `next()` 把控制权交给下一个中间件；不调用 `next()` 请求会挂起。
- `next(err)` 跳过普通中间件，直接进入错误处理中间件。
- 多次调用 `next()` 或在响应结束后还调用 `next()` 会导致 `ERR_HTTP_HEADERS_SENT`。

**常见误区 / 面试常问：**
- ❌ 误区：认为中间件和路由是完全不同的两个东西。
  - ✅ 正解：路由是「带条件匹配的中间件」，`app.get` 本质上是在队列里注册了一个带 `if` 判断的函数。
- ❌ 误区：错误处理中间件放在最前面注册。
  - ✅ 正解：错误处理中间件必须放在所有普通中间件和路由之后，否则捕获不到后面抛出的错误。

**与本周其他知识的联系：** 中间件让 day-02 的「所有逻辑写在 createServer 回调里」进化成可组合的流水线；day-05 的 `app.use` 就是中间件的批量注册入口。

---

### 📌 路由分发器与 RESTful 设计

**为什么重要：** 路由是 RESTful API 的入口。清晰的路由设计让接口语义明确、易于维护，也是前后端协作的契约。

**核心要点：**
- 路由 = Method + Path 匹配 → handler。
- 路径参数 `:id` 用于定位唯一资源（如 `/podcasts/1`）。
- 查询参数 `?category=tech` 用于过滤、排序、分页。
- 路由表可用正则把 `:id` 转换成捕获组，请求到达时按注册顺序匹配。

**常见误区 / 面试常问：**
- ❌ 误区：路径参数和查询参数混用。
  - ✅ 正解：路径参数定位资源，查询参数修饰请求。
- ❌ 误区：只匹配路径，不匹配 Method。
  - ✅ 正解：`POST /podcasts/1` 不应命中 `GET /podcasts/:id`。

**与本周其他知识的联系：** 路由分发器是 day-05 `App` 对象的核心组件；理解它之后，再看 Express 的 `Router` 就会知道底层只是维护了一个路由数组。

---

### 📌 类 Express 的 `App` 对象与错误处理

**为什么重要：** Express 是后续学习 NestJS 的跳板。手写一个 `App` 对象能把前 4 天的知识点串起来，形成对框架设计的整体认知。

**核心要点：**
- `app.use(middleware)` 和 `app.get(path, handler)` 都按注册顺序进入同一个队列。
- 请求到达时从队列头部开始执行，命中路由就执行 handler，不命中就 `next()` 继续。
- 错误处理中间件签名是 `(err, req, res, next)`，Express 通过 `fn.length === 4` 识别。
- `app.use('/api', handler)` 是路径前缀匹配，常用于挂载子路由。

**常见误区 / 面试常问：**
- ❌ 误区：以为 `app.get` 注册的路由会优先于后面 `app.use` 的中间件执行。
  - ✅ 正解：**注册顺序决定执行顺序**。`app.use(bodyParser)` 应放在需要 `req.body` 的路由之前。
- ❌ 误区：在 Express 的 async 路由里不处理异常。
  - ✅ 正解：Express 5.0 以下对 async 函数没有原生支持，需要 `try/catch` + `next(err)`，或使用 `catchAsync` 包装。

**与本周其他知识的联系：** `App` 对象是中间件 + 路由 + 错误处理的组合体，也是本周「最小 HTTP 服务」的最终形态。

---

### 📌 demo 工程化与接口测试

**为什么重要：** 能跑通的代码只是第一步；能复现、可验证、有文档的工程才能进简历、能面试展示。

**核心要点：**
- demo 工程化三阶段：一个文件跑通 → 可复现工程（`package.json`、脚本、README） → 可交付项目（测试、CI、文档）。
- 接口测试至少覆盖 4 类场景：正常路径、参数错误（400）、资源不存在（404）、服务端异常（500）。
- 测试脚本应能重复运行：通过独立进程 + `trap` 清理保证状态可重置。
- README 应包含环境要求、安装命令、启动命令、接口清单、项目结构说明。

**常见误区 / 面试常问：**
- ❌ 误区：只测正常路径。
  - ✅ 正解：边界和异常路径才是区分「能跑」和「健壮」的关键。
- ❌ 误区：把大段原理科普写进 demo README。
  - ✅ 正解：README 聚焦「如何跑起来」，原理放在 `knowledge.md`。

**与本周其他知识的联系：** 工程化和测试是本周产出物的「最后一公里」，让前 5 天的代码从练习变成可交付物。

---

## 四、每日学习回顾

### 第 1 天（2026-06-24）

- **今日目标**：配置 TypeScript + Node.js 开发环境；梳理 Promise、async/await 与 Event Loop 执行顺序。
- **关键知识点**：TS 严格模式意义、Promise 三种状态、Event Loop 执行顺序、本周产出物路线图。
- **完成状态**：5 / 5（100%）
- **最大收获**：理解了 Node.js 的 Event Loop 执行顺序。
- **遗留卡点**：需加强 `tsconfig` 中各个字段的理解记忆。

### 第 2 天（2026-06-25）

- **今日目标**：补齐 tsconfig 核心字段；用原生 `http` 写最小 JSON 服务，支持 `GET /health`、`GET /podcasts`、`POST /podcasts`。
- **关键知识点**：`tsconfig.json` 字段对应关系、`http.createServer`、`req/res` 关键属性、路由匹配、JSON 请求体解析、状态码与错误响应。
- **完成状态**：6 / 6（100%）
- **最大收获**：无
- **遗留卡点**：无

### 第 3 天（2026-06-25）

- **今日目标**：理解中间件概念；实现最简中间件流水线；补齐完整 CRUD；集中处理异步错误。
- **关键知识点**：中间件定义与作用、原生 `http` 中实现中间件执行器、异步错误处理、请求体解析健壮性、Express 与 Koa 对比。
- **完成状态**：5 / 5（100%）
- **最大收获**：（未填写）
- **遗留卡点**：无

### 第 4 天（2026-06-30）

- **今日目标**：用原生 `http` 实现更接近 Express 的路由分发器，理解路由与中间件的关系。
- **关键知识点**：路由本质、路由与中间件关系、路径参数与查询参数、路由表数据结构。
- **完成状态**：7 / 7（100%）
- **最大收获**：路由就是「根据请求的 Method 和 URL，找到对应的处理函数」。
- **遗留卡点**：无

### 第 5 天（2026-07-08）

- **今日目标**：把路由分发器与中间件执行器组合成类 Express 的 `App` 对象，理解 `app.use`、`app.get` 注册/执行顺序与错误处理中间件。
- **关键知识点**：`app.use` 与 `app.get` 注册顺序和执行顺序、路由是带条件的中间件、`next()` 与 `next(err)`、4 参数错误处理中间件、路径前缀匹配。
- **完成状态**：8 / 8（100%）
- **最大收获**：了解了 Express 的整体架构，这个 `app.ts` 是个很不错的 Express 学习资源。
- **遗留卡点**：无

### 第 6 天（2026-07-15）

- **今日目标**：整理 demo 工程、补齐工程文件、编写 `test.sh`、梳理本周知识点。
- **关键知识点**：接口测试最小矩阵、demo 工程化意义、README 写作边界、测试脚本工程细节。
- **完成状态**：0 / 7（0%）
- **最大收获**：无
- **遗留卡点**：无（今日尚未复盘）

---

## 五、本周学习成果与反思

### 5.1 本周最大收获

- 理解了 Node.js Event Loop 的执行顺序，能预测同步/微任务/宏任务的输出。
- 掌握了原生 `http` 模块的请求-响应流程，能独立写出带路由匹配的最小 JSON 服务。
- 理解了中间件模式的价值：关注点分离、可复用、可组合。
- 实现了类 Express 的 `App` 对象，清楚了 `app.use` / `app.get` / `next()` / 错误处理中间件的底层机制。
- 了解了 Express 与 Koa 的设计差异，为后续框架选型建立初步认知。

### 5.2 仍待解决的疑问

- 需加强 `tsconfig.json` 中 `target / module / moduleResolution / lib / types` 的对应关系记忆。
- day-06 尚未复盘，待补充接口测试策略和 demo 工程化的掌握度。

### 5.3 对本周产出物的评价

- **预期产出物**：最小 HTTP 服务
- **当前状态**：已基本完成。day-02 到 day-05 逐步实现了原生 HTTP 服务、中间件流水线、路由分发器、类 Express 的 `App` 对象，并在 day-06 进入工程化整理阶段。
- **待完善项**：完成 day-06 的 `test.sh` 编写与运行验证，确保 demo 目录可独立运行、可重复测试。

---

## 六、下周预告

### Express 框架入门

- **所属阶段**：阶段一：后端基础与数据库
- **核心任务**：路由、中间件、请求生命周期；用 Express 实现内存版播客 CRUD
- **预期产出物**：Express 播客 CRUD
- **与本周的衔接**：
  - 本周手写的 `App` 对象已经覆盖了 Express 的核心机制（中间件队列、路由匹配、`next()`、错误处理）。下周学习 Express 时，重点不是「它是什么」，而是「它如何把这些机制标准化、工程化」。
  - 建议下周开始前复习 day-05 的 `knowledge.md`，尤其是 `app.use` 与 `app.get` 的注册/执行顺序、4 参数错误处理中间件。

### 下周预习建议

- 复习 `daily/week-01/day-05/knowledge.md` 中关于 `App` 与 Express 对应关系的内容。
- 提前阅读 [Express 官方指南](https://expressjs.com/en/guide/routing.html)，关注 `Router` 对象和中间件写法。
- 确保本周 `demo/` 目录能独立运行，避免下周开头返工。
- 思考一个问题：Express 相比本周手写的 `App`，在开发效率和可维护性上主要多了哪些能力？
