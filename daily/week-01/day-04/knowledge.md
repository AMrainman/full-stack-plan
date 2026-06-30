---
week: 1
day: 4
date: 2026-06-30
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [TypeScript, Node.js, http, router, middleware]
file: knowledge.md
---

# 核心知识点

## 1. 路由是什么？

路由就是「根据请求的 Method 和 URL，找到对应的处理函数」。在 Express 里你写：

```ts
app.get('/podcasts/:id', (req, res) => { ... });
```

底层本质上是：

```ts
if (req.method === 'GET' && match('/podcasts/:id', req.url)) {
  req.params = extractParams('/podcasts/:id', req.url);
  handler(req, res);
}
```

框架把这段判断封装成了优雅 API，但核心逻辑永远离不开字符串匹配和参数提取。

## 2. 路由与中间件的关系

- **中间件**：对请求做通用处理，不挑 URL（日志、请求体解析、错误处理）。
- **路由**：只处理特定 Method + Path 的请求，是带条件的中间件。
- **关系**：路由可以看作「只命中特定路径的中间件」；中间件执行器 `compose` 加上条件匹配，就能变成路由分发器。

## 3. 路径参数 vs 查询参数

| 类型 | 示例 | 来源 | 用途 |
|------|------|------|------|
| 路径参数 | `/podcasts/1` | URL 路径段 | 标识唯一资源 |
| 查询参数 | `/podcasts?category=tech` | URL `?` 后 | 过滤、排序、分页 |

解析方法：

```ts
const url = new URL(req.url || '', 'http://localhost');
const category = url.searchParams.get('category'); // tech
```

## 4. 路由表的数据结构

一个简单但可扩展的路由表：

```ts
interface Route {
  method: string;           // GET / POST / PUT / DELETE
  path: string;             // /podcasts/:id
  pattern: RegExp;          // /^\/podcasts\/([^\/]+)$/
  paramNames: string[];     // ['id']
  handler: RequestHandler;
}
```

注册时把 `:id` 替换成正则捕获组，请求到达时按顺序匹配，命中后把捕获值填进 `req.params`。

## 5. 常见误区

- **误区 1**：认为路由匹配是从长到短或从精确到模糊。很多框架确实是这么排序的，但最小实现里先注册先匹配就够了。
- **误区 2**：路径参数和查询参数混用。路径参数用于定位资源，查询参数用于修饰请求，不要反过来。
- **误区 3**：忽略 Method。只匹配路径不匹配 Method 会导致 `POST /podcasts/1` 意外命中 `GET /podcasts/:id`。

## 6. 为什么明天要学 Express？

今天我们用原生代码「手工实现」了路由分发器，明天开始用 Express 时，你会清楚：

- `app.get` 底层就是路由表匹配。
- `req.params` / `req.query` 是框架帮你解析的。
- 路由中间件化、子路由、错误处理，都是在这个基础上扩展的。
