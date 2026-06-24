# `/review` Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现一个 Claude Code skill `/review`，用于每日学习结束后交互式复盘，记录任务完成情况、卡点与掌握度，并同步回写 `tasks.md` 和 `review.md`。

**Architecture:** 纯 Prompt Skill，不引入脚本或依赖。在 `.claude/skills/review/SKILL.md` 中通过结构化 prompt 约束行为，使用 `Read` 读取文件、`AskUserQuestion` 交互、`Edit`/`Write` 更新文件。

**Tech Stack:** Claude Code Skill（Markdown prompt），无外部依赖。

---

### Task 1: Create skill directory and frontmatter

**Files:**
- Create: `.claude/skills/review/SKILL.md`

- [ ] **Step 1: Create directory**

Run:
```bash
mkdir -p .claude/skills/review
```

- [ ] **Step 2: Write frontmatter**

Create `.claude/skills/review/SKILL.md` with:
```markdown
---
name: review
description: 每日学习结束后交互式复盘，记录任务完成情况、卡点与掌握度
---

# `/review` Skill

当用户调用 `/review` 或 `/review <week> <day>` 时，按本 prompt 执行。
```

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/review/SKILL.md
git commit -m "chore: init review skill"
```

---

### Task 2: Add argument parsing and target directory resolution

**Files:**
- Modify: `.claude/skills/review/SKILL.md`

- [ ] **Step 1: Add section "1. 解析参数与定位目标目录"**

Append to `.claude/skills/review/SKILL.md`:
```markdown
## 1. 解析参数与定位目标目录

### 1.1 命令格式

```text
/review                 # 自动定位最新 day-* 目录
/review <week> <day>    # 指定复盘第几周第几天
```

### 1.2 无参数 `/review`

1. 使用 `Bash` 工具运行：
   ```bash
   find daily -type d -name 'day-*' | sort -V | tail -1
   ```
2. 如果返回空，向用户报错并停止：
   > 未找到任何已有计划，请先使用 `/daily 1 1` 生成第一天计划。
3. 从输出解析 `week` 和 `day`，例如 `daily/week-01/day-02` → week=1, day=2。

### 1.3 带参数 `/review <week> <day>`

1. 提取 `week` 和 `day`，要求均为正整数。
2. 如果任一不是正整数，报错并停止：
   > `week` 和 `day` 都必须是正整数。
3. 计算目标目录：`daily/week-{ww}/day-{dd}/`，其中 `{ww}` 和 `{dd}` 为两位补零。
4. 如果目录不存在，报错并停止：
   > 未找到 `daily/week-{ww}/day-{dd}/`，请确认周/天参数正确。

### 1.4 目标文件

- `daily/week-{ww}/day-{dd}/tasks.md`
- `daily/week-{ww}/day-{dd}/review.md`

使用 `Read` 工具读取这两个文件。如果任一不存在，报错并停止：
> 当天的 `tasks.md` 或 `review.md` 不存在，无法复盘。
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/review/SKILL.md
git commit -m "docs(review): add argument parsing and directory resolution"
```

---

### Task 3: Add interactive task review flow

**Files:**
- Modify: `.claude/skills/review/SKILL.md`

- [ ] **Step 1: Add section "2. 逐项询问任务完成情况"**

Append to `.claude/skills/review/SKILL.md`:
```markdown
## 2. 逐项询问任务完成情况

1. 从 `tasks.md` 中提取所有 checkbox 任务条目（以 `- [ ]` 或 `- [x]` 开头）。
2. 对每个任务，使用 `AskUserQuestion` 工具询问用户完成情况。

选项：
- ✅ 已完成
- 🟡 部分完成
- ⏭️ 跳过（今天没做 / 不适合做）
- ❌ 未完成

提问示例：
> 任务：理解 TypeScript 编译流程与 `tsconfig.json` 核心字段。请选择完成情况。

记录每个任务的回答，用于后续回写。

如果 `tasks.md` 中没有任何 checkbox 任务，跳过本节，直接进入第 4 节「总体复盘问题」。
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/review/SKILL.md
git commit -m "docs(review): add per-task review flow"
```

---

### Task 4: Add mastery and blocker follow-up questions

**Files:**
- Modify: `.claude/skills/review/SKILL.md`

- [ ] **Step 1: Add section "3. 追问掌握度与卡点"**

Append to `.claude/skills/review/SKILL.md`:
```markdown
## 3. 追问掌握度与卡点

对第 2 节中选择「🟡 部分完成」或「❌ 未完成」的任务，继续追问：

1. 使用 `AskUserQuestion` 询问掌握度：
   - 🟢 已掌握（只是时间不够）
   - 🟡 部分理解
   - 🔴 不太懂
2. 使用 `AskUserQuestion` 询问卡点（可选，允许空）：
   > 请简述卡点或原因（可直接回车跳过）。

记录每个未完成/部分完成任务的掌握度标签和卡点文本。
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/review/SKILL.md
git commit -m "docs(review): add mastery and blocker follow-up"
```

---

### Task 5: Add overall reflection questions

**Files:**
- Modify: `.claude/skills/review/SKILL.md`

- [ ] **Step 1: Add section "4. 总体复盘问题"**

Append to `.claude/skills/review/SKILL.md`:
```markdown
## 4. 总体复盘问题

全部任务问完后，使用 `AskUserQuestion` 依次询问：

1. 今天最大的收获是什么？
2. 有没有需要后续回顾的未解决疑问？

两个问题均为开放输入，允许空。
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/review/SKILL.md
git commit -m "docs(review): add overall reflection questions"
```

---

### Task 6: Add summary preview and confirmation

**Files:**
- Modify: `.claude/skills/review/SKILL.md`

- [ ] **Step 1: Add section "5. 汇总预览与确认"**

Append to `.claude/skills/review/SKILL.md`:
```markdown
## 5. 汇总预览与确认

向用户展示今日复盘摘要：

```text
📋 今日复盘摘要

目标目录：daily/week-{ww}/day-{dd}/
完成率：{completed}/{total}（{percentage}%）

✅ 已完成：
- 任务 A
- 任务 B

🟡/❌ 未完成：
- 任务 C（🟡 部分理解）— 卡点：xxx
- 任务 D（🔴 不太懂）— 卡点：yyy

💡 今日最大收获：
{用户输入}

❓ 后续疑问：
{用户输入}
```

然后使用 `AskUserQuestion` 询问：
- 确认写入
- 重新回答
- 取消

如果用户选择「重新回答」，回到第 2 节重新逐项询问。
如果用户选择「取消」，不写入任何文件，直接结束并提示：
> 已取消，未修改任何文件。
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/review/SKILL.md
git commit -m "docs(review): add summary preview and confirmation"
```

---

### Task 7: Add file write-back rules for tasks.md

**Files:**
- Modify: `.claude/skills/review/SKILL.md`

- [ ] **Step 1: Add section "6. 回写 tasks.md"**

Append to `.claude/skills/review/SKILL.md`:
```markdown
## 6. 回写 tasks.md

用户选择「确认写入」后，使用 `Edit` 工具更新 `tasks.md`：

- 已完成 → 改为 `- [x]`
- 部分完成 → 改为 `- [/]`；如果担心渲染问题，可保持 `- [ ]` 并在行尾追加 `（部分完成）`
- 跳过 → 保持 `- [ ]`，行尾追加 `（跳过）`
- 未完成 → 保持 `- [ ]`，行尾追加 `（未完成）`

如果该任务在 第 3 节中记录了卡点，在该任务条目下方新增一行缩进说明：
```markdown
- [ ] 理解 TypeScript 编译流程与 `tsconfig.json` 核心字段（未完成）
  > 卡点：对 `moduleResolution` 和 `esModuleInterop` 的区别还不清楚
```

仅修改 checkbox 状态，不改动任务描述、时间段、验收标准等其他内容。
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/review/SKILL.md
git commit -m "docs(review): add tasks.md write-back rules"
```

---

### Task 8: Add file write-back rules for review.md

**Files:**
- Modify: `.claude/skills/review/SKILL.md`

- [ ] **Step 1: Add section "7. 回写 review.md"**

Append to `.claude/skills/review/SKILL.md`:
```markdown
## 7. 回写 review.md

### 7.1 更新「完成检查清单」

找到 `review.md` 中的「完成检查清单」区块，将其 checkbox 与用户回答同步：

- 已完成的任务 → `[x]`
- 未完成的任务 → `[ ]`

如果清单项与 `tasks.md` 的任务无法精确对应，则根据用户总体完成情况合理更新。

### 7.2 追加「今日实际复盘」

在 `review.md` 末尾追加以下内容：

```markdown
## 今日实际复盘（{YYYY-MM-DD}）

- 完成率：{completed} / {total}（{percentage}%）

### 未完成任务

{列出每个部分完成/未完成的任务，包含掌握度标签和卡点}

### 今日最大收获

{用户输入}

### 后续疑问

{用户输入}
```

未完成任务示例：
```markdown
- [ ] 任务 C（🟡 部分完成）
  - 掌握度：🟡 部分理解
  - 卡点：xxx
- [ ] 任务 D（❌ 未完成）
  - 掌握度：🔴 不太懂
  - 卡点：yyy
```
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/review/SKILL.md
git commit -m "docs(review): add review.md write-back rules"
```

---

### Task 9: Add edge cases, output summary, and closing rules

**Files:**
- Modify: `.claude/skills/review/SKILL.md`

- [ ] **Step 1: Add final sections**

Append to `.claude/skills/review/SKILL.md`:
```markdown
## 8. 边界情况

| 场景 | 处理 |
|------|------|
| `daily/` 不存在或没有 `day-*` 目录 | 报错：未找到任何已有计划，请先使用 `/daily 1 1` |
| 指定了 `week/day` 但目录不存在 | 报错：未找到 `daily/week-{ww}/day-{dd}/`，请确认参数 |
| 目标目录存在但 `tasks.md` 或 `review.md` 缺失 | 报错：当天的 tasks.md 或 review.md 不存在，无法复盘 |
| `tasks.md` 里没有 checkbox 任务 | 跳过第 2-3 节，直接询问总体完成情况并追加到 `review.md` |
| 用户在汇总预览时选择「重新回答」 | 回到第 2 节重新逐项询问 |
| 用户选择「取消」 | 不写入任何文件，直接结束 |

## 9. 不自动调用 /today 或 /daily

`/review` 只负责复盘当天计划，不生成新计划。如需生成下一天计划，用户需单独调用 `/today` 或 `/daily`。

## 10. 输出摘要

写入完成后，向用户输出：

```text
✅ 复盘已写入 daily/week-{ww}/day-{dd}/
- tasks.md：已同步任务完成状态
- review.md：已更新完成检查清单并追加今日实际复盘

完成率：{completed}/{total}（{percentage}%）
```
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/review/SKILL.md
git commit -m "docs(review): add edge cases and output summary"
```

---

### Task 10: Verify skill structure

**Files:**
- Read: `.claude/skills/review/SKILL.md`

- [ ] **Step 1: Read the complete skill file**

Run:
```bash
cat .claude/skills/review/SKILL.md
```

- [ ] **Step 2: Check against spec**

对照 `docs/superpowers/specs/2026-06-24-review-skill-design.md`，确认：
- [ ] 包含 frontmatter（name 和 description）
- [ ] 支持 `/review` 和 `/review <week> <day>`
- [ ] 能自动定位最新 day-* 目录
- [ ] 逐项询问任务完成情况
- [ ] 对未完成任务追问掌握度和卡点
- [ ] 同步更新 `tasks.md` 和 `review.md`
- [ ] 有汇总预览与确认
- [ ] 不自动调用 `/today`/`/daily`

- [ ] **Step 3: Fix any gaps inline**

如果发现缺失，直接编辑 `.claude/skills/review/SKILL.md` 补充。

---

### Task 11: Final commit

**Files:**
- Add: `.claude/skills/review/SKILL.md`

- [ ] **Step 1: Review git status**

Run:
```bash
git status --short
```

- [ ] **Step 2: Commit all remaining changes**

```bash
git add .claude/skills/review/SKILL.md
git commit -m "feat: add /review skill for daily learning retrospective"
```

---

## Self-Review Checklist

- [ ] Spec coverage: 设计文档中的每个要求都有对应任务。
- [ ] Placeholder scan: 计划中没有 TBD/TODO、"implement later" 等占位符。
- [ ] Type consistency: 不涉及类型或函数签名，N/A。
- [ ] Commit granularity: 每个任务完成后都有独立提交。
