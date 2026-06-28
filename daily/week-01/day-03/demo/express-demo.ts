import express, { Request, Response, NextFunction } from 'express';

/**
 * Express 完整示例
 *
 * 运行前请安装依赖：
 *   npm install express @types/express
 *   或使用 tsx 直接运行：npx tsx demo/express-demo.ts
 *
 * 本示例展示：
 * 1. 应用级中间件（日志、JSON 解析）
 * 2. 路由参数与查询参数
 * 3. 异步路由的错误处理
 * 4. 集中式错误处理中间件
 */

const app = express();
const PORT = 3001;

// ============================================================
// 1. 全局中间件
// ============================================================

// 解析 application/json 请求体，后续路由可直接使用 req.body
app.use(express.json());

// 记录每个请求的方法、URL 和时间戳，便于调试和链路追踪
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ============================================================
// 2. 内存数据存储（仅作演示，生产环境应使用数据库）
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
// 3. 路由定义
// ============================================================

// 健康检查
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', framework: 'express' });
});

// 获取用户列表，支持查询参数 ?name=Alice
app.get('/users', (req: Request, res: Response) => {
  const { name } = req.query;
  const result = name
    ? users.filter((u) => u.name.toLowerCase().includes(String(name).toLowerCase()))
    : users;
  res.json(result);
});

// 根据 ID 获取单个用户
app.get('/users/:id', (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) {
    // 通过 next 传递 404 错误，交给集中错误处理中间件
    next(Object.assign(new Error('用户不存在'), { status: 404 }));
    return;
  }
  res.json(user);
});

// 创建用户
app.post('/users', (req: Request, res: Response) => {
  const { name, email } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: 'name 和 email 不能为空' });
    return;
  }
  const newUser: User = {
    id: users.length + 1,
    name,
    email,
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// ============================================================
// 4. 异步路由：模拟数据库查询，展示 Express 异步错误处理
// ============================================================

// catchAsync 包装器：把 async 路由里的异常自动交给 next(err)
const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

app.get(
  '/users/:id/async',
  catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    // 模拟异步查询
    const user = await Promise.resolve(users.find((u) => u.id === id));
    if (!user) {
      const error = new Error('异步查询：用户不存在');
      (error as Error & { status: number }).status = 404;
      throw error;
    }
    res.json(user);
  }),
);

// ============================================================
// 5. 集中式错误处理（必须放在所有路由之后）
// ============================================================

interface HttpError extends Error {
  status?: number;
}

app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
  console.error('错误处理中间件捕获：', err.message);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message,
    status,
  });
});

// ============================================================
// 6. 启动服务
// ============================================================

app.listen(PORT, () => {
  console.log(`Express server is running at http://localhost:${PORT}`);
});

export {};
