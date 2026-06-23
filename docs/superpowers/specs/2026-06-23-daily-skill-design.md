# `/daily` Skill 设计文档

> 设计日期：2026-06-23
> 适用仓库：full-stack-plan（播客应用全栈学习计划）
> 设计目标：把 `full-stack-plan.md` 中的周计划拆成可执行的每日任务包

---

## 1. 背景与问题

`full-stack-plan.md` 是一份 52 周的全栈学习路线图，颗粒度到「周」。实际学习时，用户需要：

- 知道今天具体学什么、写什么代码、产出什么。
- 有一个固定格式的学习档案，方便复盘和面试时回顾。
- 当计划调整时，生成的每日计划能自动跟着变。

因此设计一个 Claude Code skill `/daily`，根据周计划和当前日期生成每日学习包。

---

## 2. Skill 调用方式

- **文件位置**：`.claude/skills/daily.md`
- **命令格式**：

```text
/daily <week> <day> [hours]
```

- `week`：第几周（1-52）。
- `day`：一周中的第几天（1=周一，7=周日）。
- `hours`：可选，今日学习时长。默认工作日（1-5）2h，周末（6-7）5h。

**示例**：

```text
/daily 1 1      # 第 1 周周一，默认 2h
/daily 1 6 5    # 第 1 周周六，5h
/daily 3 2 3    # 第 3 周周二，3h
```

---

## 3. 输出目录结构

生成结果放在仓库根目录的 `daily/` 下：

```text
daily/
├── week-01/
│   ├── README.md          # 本周总览（首次生成该周时创建）
│   └── day-01/
│       ├── README.md
│       ├── tasks.md
│       ├── knowledge.md
│       ├── demo.md
│       ├── resources.md
│       ├── review.md
│       └── demo/
│           ├── minimal-http-server.ts
│           └── ...
├── week-02/
│   └── ...
```

---

## 4. 文件模板规范

### 4.1 统一 Frontmatter

每个 `.md` 文件顶部必须包含：

```yaml
---
week: 1
day: 1
date: 2026-06-23
stage: 后端基础与数据库
theme: TypeScript + Node.js 热身
hours: 2
tags: [typescript, nodejs]
file: tasks.md
---
```

字段说明：

| 字段 | 含义 |
|------|------|
| `week` | 第几周 |
| `day` | 一周中的第几天 |
| `date` | 生成当天日期 |
| `stage` | 所属阶段（从 `full-stack-plan.md` 读取） |
| `theme` | 本周主题（从 `full-stack-plan.md` 读取） |
| `hours` | 今日计划学习时长 |
| `tags` | 当日涉及的技术标签 |
| `file` | 当前文件名 |

### 4.2 各文件内容定位

| 文件 | 内容要求 |
|------|----------|
| `README.md` | 今日目标、与本周主题关系、时间块概览、关键产出、前置依赖 |
| `tasks.md` | 按优先级排序的任务清单（含 checkbox）、建议时间段、验收标准 |
| `knowledge.md` | 今日核心知识点：概念解释 + 为什么重要 + 常见误区 |
| `demo.md` | 今日代码目标、`demo/` 文件说明、运行步骤、预期输出 |
| `resources.md` | 官方文档、精选文章/视频、参考仓库、练习题 |
| `review.md` | 完成检查清单、复盘问题、明日预习、卡点记录区 |

### 4.3 Demo 代码文件

`demo/` 目录存放可运行代码：

- 文件名语义化，例如 `minimal-http-server.ts`、`user-table.sql`。
- 代码注释用中文解释「为什么」，而非「做了什么」。
- 每个文件在 `demo.md` 中有对应说明和运行命令。

---

## 5. 生成逻辑

### 5.1 读取周计划

1. 读取 `full-stack-plan.md`。
2. 定位到第 `week` 周，提取：
   - 阶段名（`stage`）
   - 周主题（`theme`）
   - 本周核心任务
   - 本周产出物

### 5.2 拆分到 7 天

按以下比例把本周核心任务拆成 7 份：

| 星期 | 重点 |
|------|------|
| 周一 | 概念/环境准备 |
| 周二-周三 | 核心知识学习 |
| 周四-周五 | 编码实践 |
| 周六 | 产出物整理与测试 |
| 周日 | 复盘与预习下周 |

### 5.3 根据时长调整颗粒度

- **2h（工作日）**：1-2 个知识块 + 1 个小 demo。
- **5h（周末）**：2-3 个知识块 + 2 个 demo + 完整 review。
- 自定义 `hours` 时，按每小时约 1 个任务块线性缩放。

### 5.4 标签与资源

- 根据当天主题生成 `tags`。
- `resources.md` 优先引用 `full-stack-plan.md` 中「学习资源索引」的对应章节。

---

## 6. 目录已存在时的处理

如果 `daily/week-XX/day-XX/` 已存在，按以下流程处理：

1. 列出当前目录已有文件。
2. 向用户提问，提供两个选项：
   - **覆盖**：重新生成全部 6 个文件和 `demo/` 目录。
   - **追加补充（默认）**：保留已有文件，只补齐缺失文件，并基于本周计划重新检查是否有遗漏内容。
3. 追加模式下：
   - 补齐缺失的 `.md` 文件和 `demo/` 文件。
   - 读取已有 `tasks.md`，保留未勾选任务，并补充新任务。
   - 不删除用户手写的备注或额外文件。

---

## 7. Git 自动提交

生成完成后自动执行：

```bash
git add daily/week-XX/day-XX/
git commit -m "docs: add daily plan for week X day X"
git push
```

- 如果没有任何变更，跳过提交并提示用户。
- 提交信息遵循约定式提交格式。

---

## 8. 边界情况

| 场景 | 处理 |
|------|------|
| `week` 超出 1-52 | 提示计划只覆盖 52 周，拒绝生成 |
| `day` 超出 1-7 | 提示 `day` 应为 1-7 |
| `hours` 为 0 或负数 | 使用默认值 |
| `full-stack-plan.md` 中找不到对应周 | 提示检查计划文件 |
| 仓库未初始化 git | 跳过 git 操作，仅生成本地文件 |
| 用户修改 `full-stack-plan.md` 后重新生成 | 以最新计划为准 |

---

## 9. 实现方案

采用**纯 Prompt Skill**：

- 不引入 `package.json`、Node 脚本或外部依赖。
- 在 `.claude/skills/daily.md` 中通过结构化 prompt 约束生成行为。
- 未来如果生成逻辑变得复杂，可迁移为「Skill + Node 脚本」的混合方案。

---

## 10. 验收标准

- [ ] `/daily 1 1` 能在 `daily/week-01/day-01/` 生成 6 个 markdown 和 `demo/` 目录。
- [ ] 每个 markdown 文件都包含规范 frontmatter。
- [ ] `tasks.md` 中的任务与 `full-stack-plan.md` 第 1 周主题一致。
- [ ] 目录已存在时默认进入追加补充模式。
- [ ] 生成后自动 commit + push。
- [ ] 修改 `full-stack-plan.md` 后重新生成，内容能反映最新计划。
