# Week 1 Demo：最小 HTTP 服务

本目录是第 1 周「TypeScript + Node.js 热身」的最终产出：一个手写、接口接近 Express、基于原生 `node:http` 的播客 CRUD 服务。

## 文件说明

| 文件 | 说明 |
|------|------|
| `app.ts` | 类 Express 的 `App` 对象，管理中间件、路由、错误处理 |
| `router.ts` | 请求/响应类型定义 |
| `minimal-http-server.ts` | 播客 CRUD 服务入口 |
| `test.sh` | 一键接口测试脚本 |
| `package.json` | 依赖与脚本 |
| `tsconfig.json` | TypeScript 配置 |

## 快速开始

```bash
cd daily/week-01/day-06/demo
pnpm install
pnpm dev        # 启动服务
```

## 接口清单

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/health` | 健康检查 |
| GET | `/podcasts` | 播客列表，支持 `?category=tech` 过滤 |
| GET | `/podcasts/:id` | 播客详情 |
| POST | `/podcasts` | 创建播客，body 需包含 `title` |
| PUT | `/podcasts/:id` | 更新播客 |
| DELETE | `/podcasts/:id` | 删除播客 |

## 一键测试

```bash
./test.sh
```

脚本会启动服务、自动测试关键接口、最后关闭服务。
