---
name: weekly
description: Use when the user wants to consolidate several days of daily study plans into a weekly knowledge report, mark key points, connect concepts, and preview next week's content
---

# `/weekly` Skill

当用户调用 `/weekly <week>` 时，按本 prompt 执行。

## 1. 解析参数

从用户输入中提取：

- `week`：整数，第几周（1-52）。

如果 `week < 1` 或 `week > 52`，向用户说明 `week` 必须在 1-52 之间并停止执行。

示例：
- `/weekly 1` -> week=1
- `/weekly 3` -> week=3

## 2. 读取 `full-stack-plan.md`

使用 `Read` 工具读取仓库根目录的 `full-stack-plan.md`。

定位到「阶段 X：...」下对应 `week` 的周计划表格，提取：
- `stage`：阶段名称（如「后端基础与数据库」）。
- `theme`：本周主题（如「TypeScript + Node.js 热身」）。
- `coreTasks`：本周核心任务描述。
- `output`：本周产出物。
- `nextWeek`：下周主题（同一阶段下一行，或下一阶段第一周）。
- `nextStage`：下周所属阶段（如果跨阶段）。

如果找不到对应 `week`，向用户说明并停止执行。

## 3. 发现本周每日计划

使用 `Bash` 工具运行：

```bash
find daily/week-{ww} -type d -name 'day-*' | sort -V
```

其中 `{ww}` 为两位补零的周数，例如 `week-01`。

- 如果目录不存在，报错并停止：
  > 未找到 `daily/week-{ww}/`，请确认周数参数正确。
- 如果存在但没有 `day-*` 子目录，向用户说明本周尚未生成任何日计划，无法生成周报。

记录每一天的目录路径，例如 `daily/week-01/day-01` 到 `daily/week-01/day-07`。

## 4. 读取每日学习资料

对每一天目录，使用 `Read` 工具读取以下文件：

- `README.md`：今日目标、时间块、关键产出。
- `knowledge.md`：核心知识点讲解。
- `review.md`：完成检查清单、掌握度、今日实际复盘。
- `tasks.md`：任务清单与完成状态（可选，用于补充细节）。

如果某个文件不存在，跳过该文件，不中断流程。

提取每日关键信息：
- `date`：从 frontmatter 读取。
- `hours`：从 frontmatter 读取，汇总到本周总时长。
- `tags`：从 frontmatter 读取，合并为本周标签集合。
- `objectives`：今日目标列表。
- `keyKnowledge`：knowledge.md 中的标题与要点。
- `completedTasks`：review.md 中标记为 `[x]` 的完成检查清单项。
- `unfinishedTasks`：review.md 中标记为 `[ ]` 的未完成项。
- `mastery`：review.md 中的掌握度勾选情况（🟢/🟡/🔴）。
- `insights`：review.md 中「今日最大收获」的内容。
- `blockers`：review.md 中「后续疑问」或卡点记录区的内容。

## 5. 生成 `daily/week-{ww}/REPORT.md`

使用 `Write` 工具创建 `daily/week-{ww}/REPORT.md`。如果文件已存在，使用 `AskUserQuestion` 询问用户是否覆盖；若工具不可用，默认覆盖。

### 5.1 统一 frontmatter

```yaml
---
week: {week}
stage: {stage}
theme: {theme}
date: {YYYY-MM-DD}
hours: {totalHours}
tags: [{tag1}, {tag2}, ...]
output: {output}
file: REPORT.md
---
```

- `date`：今天日期（调用当天）。
- `hours`：本周每日 `hours` 的总和。
- `tags`：合并所有 daily 的 tags，去重，按技术相关性排序，保留 5-10 个。

### 5.2 REPORT.md 正文结构

必须使用以下结构：

```markdown
# 第 {week} 周学习总结报告

## 一、本周概览

- 阶段：{stage}
- 主题：{theme}
- 核心任务：{coreTasks}
- 预期产出物：{output}
- 学习天数：{dayCount}
- 总学习时长：{totalHours} 小时
- 平均每日时长：{avgHours} 小时

### 完成率统计

- 已完成检查项：{completed} / {total}（{percentage}%）
- 整体掌握度：🟢 {greenCount} · 🟡 {yellowCount} · 🔴 {redCount}

## 二、本周核心知识地图

用 1-3 段话把本周所有知识点串成一个整体，说明它们之间的依赖关系、共同服务的目标，以及与播客实战项目的联系。**不要罗列孤立概念，要解释「为什么这一周要按这个顺序学」。**

## 三、重点知识详解

针对本周每个核心知识点，输出一个小节：

### 📌 {知识点标题}

**为什么重要：** 解释该知识点在播客项目或后端开发中的作用。

**核心要点：**
- 要点 1（必须解释「为什么」，而不是只写「是什么」）
- 要点 2
- 要点 3

**常见误区 / 面试常问：**
- 误区 1 及正确理解
- 误区 2 及正确理解

**与本周其他知识的联系：** 该知识点如何支撑前后内容。

要求：
- 每个知识点小节必须包含「为什么重要」「核心要点」「常见误区/面试常问」「联系」四部分。
- 用 `📌` 标记重点小节标题。
- 对易混淆、易出错、面试高频的内容用 `**重点**` 或 `> ⚠️ 注意` 突出。

## 四、每日学习回顾

按 day 顺序，每天一个小节：

### 第 {day} 天（{date}）

- 今日目标：{objectives}
- 关键知识点：{keyKnowledge 摘要，2-4 条}
- 完成状态：{completed}/{total}（{percentage}%）
- 最大收获：{insights}
- 遗留卡点：{blockers}

如果某天没有 review.md 或没有勾选数据，标注「未复盘」并只列目标与知识点。

## 五、本周学习成果与反思

综合所有 review.md 的「今日实际复盘」内容，输出：

### 5.1 本周最大收获

用 3-5 条 bullet 列出跨天的、成体系的理解。

### 5.2 仍待解决的疑问

合并所有 day 的「后续疑问」和「卡点记录区」，去重后列出。

### 5.3 对本周产出物的评价

- 是否完成了 `full-stack-plan.md` 中预期的产出物？
- 如果没有，说明还差什么。
- 如果已完成，简要描述产出物状态（可运行 / 可展示 / 需完善）。

## 六、下周预告

### {下周主题}

- 所属阶段：{nextStage}
- 核心任务：{nextWeekCoreTasks}
- 预期产出物：{nextWeekOutput}
- 与本周的衔接：
  - 解释本周知识如何为下周打基础。
  - 提示学习者下周开始前应复习本周哪 1-2 个关键点。

### 下周预习建议

- 复习本周 day-{lastDay} 的 `knowledge.md`。
- 提前阅读下周相关的官方文档或资源。
- 整理本周 demo，确保能独立运行，避免下周开头返工。
```

## 6. 更新 `daily/week-{ww}/README.md`

如果 `daily/week-{ww}/README.md` 不存在，创建它。

无论是否存在，都在其中追加或更新「本周学习报告」区块：

```markdown
## 本周学习报告

- 报告文件：[REPORT.md](./REPORT.md)
- 生成日期：{YYYY-MM-DD}
- 总学习时长：{totalHours} 小时
- 完成率：{completed}/{total}（{percentage}%）
- 整体掌握度：🟢 {greenCount} · 🟡 {yellowCount} · 🔴 {redCount}

### 学习结果记录

- 主要收获：{3-5 条}
- 遗留疑问：{列表}
- 产出物状态：{完成 / 部分完成 / 未完成}
```

如果 README.md 中已存在「本周学习报告」区块，更新其中的数据，不要重复追加多个区块。

## 7. 自动 Git 提交

1. 先运行 `git status`。如果命令失败（非 0 退出码），跳过 git 操作并提示用户文件已生成本地目录。
2. 如果 `git status` 成功，但 `daily/week-{ww}/REPORT.md` 不在变更列表中（没有任何变更），跳过提交并提示用户。
3. 否则执行：
   ```bash
   git add daily/week-{ww}/REPORT.md daily/week-{ww}/README.md
   git commit -m "docs: add weekly report for week {week}" -- daily/week-{ww}/
   git push
   ```

## 8. 输出摘要

最后向用户输出：

```text
✅ 已生成第 {week} 周学习总结报告
- 文件：daily/week-{ww}/REPORT.md
- 本周总时长：{totalHours} 小时
- 完成率：{completed}/{total}（{percentage}%）
- 掌握度：🟢 {greenCount} · 🟡 {yellowCount} · 🔴 {redCount}
- 已同步更新 daily/week-{ww}/README.md
- 已自动 commit + push。
```
