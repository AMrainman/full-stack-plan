# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 仓库定位

这是一个个人全栈学习计划的仓库，目标是以「播客应用」为实战项目，从 Vue3 前端工程师成长为能独立交付产品的全栈开发工程师。仓库目前只包含规划文档，没有实际业务代码。

## 当前状态

- `README.md`：仓库简介，说明这是全栈学习计划的资料集合。
- `full-stack-plan.md`：一年期学习路线图，包含核心目标、技术栈、项目功能、阶段计划、学习资源等。
- 无 `package.json`、无构建脚本、无测试框架、无 CI/CD 配置。

> 如果后续加入代码，请先确认仓库里是否已经存在对应的项目结构（如 `frontend/`、`backend/`、`docker-compose.yml` 等），不要默认根目录就是单一应用。

## 项目目标与技术栈

### 核心目标（一年后）

1. 独立完成一个完整的前端 + 后端 + 数据库全栈应用。
2. 完成用户鉴权、RESTful API、数据库建模、测试、部署上线。
3. 掌握缓存、消息队列、日志、监控、CI/CD 等生产环境必备技能。
4. 产出可写进简历、可演示的高质量开源项目。

### 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Vue3 + TypeScript + Vite + Pinia + Vue Router + Axios |
| 后端 | Node.js + TypeScript + NestJS |
| 数据库 | PostgreSQL（主数据库）+ Redis（缓存/会话/队列） |
| ORM | Prisma |
| 鉴权 | Passport.js + JWT + OAuth 2.0（GitHub） |
| 测试 | Vitest + Supertest |
| 部署 | Docker + Docker Compose + Nginx + GitHub Actions |
| 监控 | Sentry + Prometheus + Grafana |
| 队列 | BullMQ |
| 对象存储 | 阿里云 OSS / 腾讯云 COS / MinIO（本地开发） |
| 搜索 | PostgreSQL 全文检索 / Meilisearch |

## 实战项目：播客应用

### 功能范围

- 用户系统：注册、登录、JWT 鉴权、OAuth 登录、个人资料。
- 内容系统：节目上传、封面/音频管理、分类、标签、搜索。
- 互动系统：订阅播客、收藏单集、播放进度、评论。
- 后台管理：节目审核、用户管理、数据看板。
- 通知系统：新节目推送、邮件通知。
- 播放体验：前端音频播放器、播放历史。

### 核心数据表（规划）

- `users`：用户
- `podcasts`：播客频道
- `episodes`：单集
- `categories`：分类
- `subscriptions`：订阅关系
- `favorites`：收藏关系
- `play_histories`：播放进度
- `comments`：评论
- `uploads`：文件上传记录

## 学习阶段

仓库采用分阶段推进，每个阶段都有明确的产出和验收标准：

1. 阶段一（1-8 周）：后端基础与数据库
2. 阶段二（9-15 周）：鉴权、测试与业务闭环
3. 阶段三（16-18 周）：前端联调与本地完整跑通
4. 阶段四（19-22 周）：部署与基础设施
5. 阶段五（23-28 周）：缓存、队列与可观测性
6. 阶段六（29-36 周）：进阶功能与项目收尾
7. 阶段七（37-52 周）：面试冲刺

具体周任务、产出物和验收标准见 `full-stack-plan.md`。

## 常用命令

目前仓库没有代码工程，因此没有可用的 build / lint / test 命令。后续如果新增工程，请从对应子目录的 `package.json` 读取脚本，常见预期如下：

```bash
# 前端
pnpm install
pnpm dev
pnpm build
pnpm test

# 后端
pnpm install
pnpm start:dev
pnpm build
pnpm test

# Docker 本地一键启动
docker compose up -d
```

> 在 `package.json` 出现之前，不要自行假设运行方式。

## 代码架构（当前未建立）

仓库目前只有文档，尚未形成代码架构。后续预期结构可能为：

```
.
├── frontend/          # Vue3 + Vite 前端
├── backend/           # NestJS + Prisma 后端
├── docker-compose.yml # 本地开发编排
└── README.md
```

当代码仓库建立后，需要补充：

- 前后端目录的入口文件和启动方式。
- Prisma schema 和数据库迁移命令。
- 环境变量模板与配置说明。
- 测试命令和测试数据库隔离方案。

## 文档维护约定

- 学习计划有调整时，同步更新 `full-stack-plan.md`。
- 每阶段产出（设计文档、API 文档、部署文档）按阶段归档，便于后续复盘和面试准备。
- README 需要随着项目进展补充：技术栈、架构图、本地启动、部署方式。
