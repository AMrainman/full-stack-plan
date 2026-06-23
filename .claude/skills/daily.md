---
name: daily
description: 根据 full-stack-plan.md 生成第 w 周第 d 天的学习计划
---

# `/daily` Skill

当用户调用 `/daily <week> <day> [hours]` 时，按本 prompt 执行。

## 1. 解析参数

从用户输入中提取三个值：

- `week`：整数，第几周（1-52）。
- `day`：整数，一周中的第几天（>=1）。不再强制 1-7，允许超过 7 天。
- `hours`：可选整数，今日学习时长。

如果 `week < 1` 或 `week > 52`，向用户说明 `week` 必须在 1-52 之间并停止执行。
如果 `day < 1`，向用户说明 `day` 必须是正整数并停止执行。

`hours` 默认值规则：
- 如果 `day` 在 1-5 之间，默认 `2`。
- 如果 `day` 在 6-7 之间，默认 `5`。
- 如果 `day` 大于 7，默认 `2`。
- 如果用户提供了 `hours` 但 <=0，使用默认值。

示例：
- `/daily 1 1` -> week=1, day=1, hours=2
- `/daily 1 6 5` -> week=1, day=6, hours=5
- `/daily 3 2 3` -> week=3, day=2, hours=3
- `/daily 1 8` -> week=1, day=8, hours=2

## 2. 读取 `full-stack-plan.md`

使用 `Read` 工具读取仓库根目录的 `full-stack-plan.md`。

定位到「阶段 X：...」下对应 `week` 的周计划表格，提取：
- `stage`：阶段名称（如「后端基础与数据库」）。
- `theme`：本周主题（如「TypeScript + Node.js 热身」）。
- `coreTasks`：本周核心任务描述。
- `output`：本周产出物。

如果找不到对应 `week`，向用户说明并停止执行。
如果 `week` 大于 52，向用户说明本计划只覆盖 52 周并停止执行。

## 3. 计算输出目录

目录格式：

```text
daily/week-{ww}/day-{dd}/
```

`{ww}` 和 `{dd}` 为两位补零的整数，例如 `week-01`、`day-01`。
示例：`/daily 1 1` -> `daily/week-01/day-01/`。

## 4. 处理已存在的目录

如果目标目录已存在，使用 `AskUserQuestion` 工具询问用户：

> 检测到 `daily/week-{ww}/day-{dd}/` 已存在，请选择操作：
> - 覆盖：重新生成 6 个标准 markdown 文件和 `demo/` 目录。
> - 查缺补漏（默认）：保留已有文件，并基于本周计划增加学习任务。
> - 取消：不生成任何文件。

如果 `AskUserQuestion` 工具不可用，默认使用「查缺补漏」模式。

- 如果用户选择「取消」，停止执行。
- 如果用户选择「查缺补漏」：
  - 保留现有 `.md` 文件和 `demo/` 目录下的所有文件。
  - 读取已有的 `tasks.md`，保留所有未勾选的任务。
  - 根据本周计划追加新任务，使今日计划更完整。
  - 补齐缺失的标准文件（`README.md`、`knowledge.md`、`demo.md`、`resources.md`、`review.md`）和 `demo/` 文件。
- 如果用户选择「覆盖」：
  - 重新生成 6 个标准 markdown 文件。
  - 重新生成 `demo/` 目录及其中文件。
  - 不删除用户额外添加的非标准文件。

## 5. 生成文件

### 5.1 统一 frontmatter

每个 markdown 文件顶部必须包含：

```yaml
---
week: {week}
day: {day}
date: {YYYY-MM-DD}
stage: {stage}
theme: {theme}
hours: {hours}
tags: [{tag1}, {tag2}, ...]
file: {filename}
---
```

`date` 使用今天的日期（调用当天）。`tags` 根据当日主题选取 2-5 个相关技术标签。

### 5.2 按天拆分本周任务

根据 `day` 把 `coreTasks` 拆成 7 份（day > 7 时进入复习/扩展模式）：

| day | 重点 |
|-----|------|
| 1 | 概念理解 / 环境准备 |
| 2-3 | 核心知识学习 |
| 4-5 | 编码实践 |
| 6 | 产出物整理 / 测试 / 文档 |
| 7 | 复盘 / 预习下周 |
| >7 | 复习深化 / 扩展练习 |

按 `hours` 线性缩放任务量：每小时约 1 个主要任务块。

### 5.3 生成 6 个 markdown 文件

使用 `Write` 工具在目标目录创建以下文件。如果 `daily/week-{ww}/README.md` 不存在，先创建 `daily/week-{ww}/README.md`，包含本周概览（stage、theme、coreTasks、output）。

- `README.md`：今日目标、与本周主题关系、时间块概览、关键产出、前置依赖。
- `tasks.md`：按优先级排序的任务清单（使用 `- [ ]` checkbox）、建议时间段、验收标准。
- `knowledge.md`：核心知识点讲解，解释「为什么重要」和常见误区。
- `demo.md`：今日代码目标、`demo/` 文件说明、运行步骤、预期输出。
- `resources.md`：官方文档、精选文章/视频、参考仓库、练习题。
- `review.md`：完成检查清单、复盘问题、明日预习、卡点记录区。

所有自然语言用中文，技术术语保留英文。代码注释用中文解释「为什么」。

### 5.4 生成 demo 代码文件

在目标目录下创建 `demo/` 子目录，并生成语义化源文件，例如：

- `demo/minimal-http-server.ts`
- `demo/create-users-table.sql`

要求：
- 文件名体现内容。
- 代码可直接运行或可直接在对应环境中执行。
- 注释用中文解释设计意图。
- 每个 demo 文件在 `demo.md` 中有对应说明。

## 6. 自动 Git 提交

1. 先运行 `git status`。如果命令失败（非 0 退出码），说明仓库未初始化 git，跳过 git 操作并提示用户文件已生成本地目录。
2. 如果 `git status` 成功，但目标目录或周 README 不在变更列表中（没有任何变更），跳过提交并提示用户。
3. 否则执行：
   ```bash
   git add daily/week-{ww}/
   git commit -m "docs: add daily plan for week {week} day {day}" -- daily/week-{ww}/
   git push
   ```

## 7. 输出摘要

最后向用户输出：

```text
✅ 已生成 daily/week-{ww}/day-{dd}/ 学习计划
- README.md
- tasks.md
- knowledge.md
- demo.md
- resources.md
- review.md
- demo/（x 个文件）

已自动 commit + push。
```
