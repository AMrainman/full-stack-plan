import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';

/**
 * Koa 完整示例
 *
 * 运行前请安装依赖：
 *   npm install koa @types/koa @koa/router @types/koa__router koa-bodyparser @types/koa-bodyparser
 *   或使用 tsx 直接运行：npx tsx demo/koa-demo.ts
 *
 * 本示例展示：
 * 1. 洋葱模型中间件（日志、请求耗时）
 * 2. 路由参数与查询参数
 * 3. 异步路由的自然错误冒泡
 * 4. 最外层 try/catch 统一错误处理
 */

const app = new Koa();
const router = new Router();
const PORT = 3002;

// ============================================================
// 1. 内存数据存储（仅作演示，生产环境应使用数据库）
// ============================================================

interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
];

// ============================================================
// 2. 最外层错误捕获中间件
//
// Koa 的中间件都是 async 函数，异常会沿着洋葱模型向上冒泡，
// 因此只需在最外层包一层 try/catch，即可统一处理所有路由错误。
// ============================================================

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // 任何中间件抛出的异常都会汇聚到这里
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    const status = (err as Error & { status?: number }).status || 500;
    ctx.status = status;
    ctx.body = { error: message, status };
    console.error('统一错误处理：', message);
  }
});

// ============================================================
// 3. 洋葱模型：请求日志 + 耗时统计
//
// await next() 之前是"进入"阶段，之后是"离开"阶段。
// 这种写法在 Express 里需要分别在请求前后插入两个中间件，
// 而在 Koa 里一个中间件即可完成。
// ============================================================

app.use(async (ctx, next) => {
  const start = Date.now();
  console.log(`→ [${new Date().toISOString()}] ${ctx.method} ${ctx.url}`);
  await next();
  const ms = Date.now() - start;
  console.log(`← [${new Date().toISOString()}] ${ctx.method} ${ctx.url} - ${ms}ms`);
});

// ============================================================
// 4. 解析请求体
// ============================================================

app.use(bodyParser());

// ============================================================
// 5. 路由定义
// ============================================================

// 健康检查
router.get('/health', (ctx) => {
  ctx.body = { status: 'ok', framework: 'koa' };
});

// 获取用户列表，支持查询参数 ?name=Alice
router.get('/users', (ctx) => {
  const name = ctx.query.name as string | undefined;
  const result = name
    ? users.filter((u) => u.name.toLowerCase().includes(name.toLowerCase()))
    : users;
  ctx.body = result;
});

// 根据 ID 获取单个用户
router.get('/users/:id', (ctx) => {
  const id = Number(ctx.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) {
    // 直接抛出异常，由最外层错误中间件统一处理
    const error = new Error('用户不存在') as Error & { status: number };
    error.status = 404;
    throw error;
  }
  ctx.body = user;
});

// 创建用户
router.post('/users', (ctx) => {
  const { name, email } = ctx.request.body as Partial<User>;
  if (!name || !email) {
    ctx.status = 400;
    ctx.body = { error: 'name 和 email 不能为空' };
    return;
  }
  const newUser: User = {
    id: users.length + 1,
    name,
    email,
  };
  users.push(newUser);
  ctx.status = 201;
  ctx.body = newUser;
});

// ============================================================
// 6. 异步路由：模拟数据库查询
//
// 不需要 catchAsync 包装器，自然 throw 即可。
// ============================================================

router.get('/users/:id/async', async (ctx) => {
  const id = Number(ctx.params.id);
  const user = await Promise.resolve(users.find((u) => u.id === id));
  if (!user) {
    const error = new Error('异步查询：用户不存在') as Error & { status: number };
    error.status = 404;
    throw error;
  }
  ctx.body = user;
});

// ============================================================
// 7. 注册路由并启动服务
// ============================================================

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`Koa server is running at http://localhost:${PORT}`);
});

export {};
