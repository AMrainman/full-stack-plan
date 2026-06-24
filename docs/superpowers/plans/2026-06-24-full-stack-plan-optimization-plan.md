# 全栈学习计划优化实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 根据设计文档优化 `full-stack-plan.md` 的宏观阶段安排，并更新 `/daily` skill 的生成策略，使每日任务在每天 2 小时约束下具备连贯性、自适应复习机制和 AI 辅助提示。

**Architecture:** 保持 52 周总框架，压缩前端熟练与面试冲刺时间，把节省的 6 周转为弹性缓冲；daily skill 从「按 7 天拆分」改为「基于前一天状态和掌握度连续生成」，并自动附加 AI 辅助提示与累计产出说明。

**Tech Stack:** Markdown、Claude Code Skill 系统

---

## 文件结构

| 文件 | 类型 | 责任 |
|------|------|------|
| `full-stack-plan.md` | 修改 | 全年学习路线图的宏观阶段与时间安排 |
| `.claude/skills/daily/SKILL.md` | 修改 | `/daily` skill 的生成逻辑、默认时长、连贯性、自适应复习、AI 辅助提示 |
| `daily/week-01/day-01/` ~ `day-07/` | 可选覆盖 | 第 1 周示例任务，展示优化后的结构与连贯性 |

---

### Task 1: 备份当前关键文件

**Files:**
- 读取：`full-stack-plan.md`
- 读取：`.claude/skills/daily/SKILL.md`

- [ ] **Step 1: 读取 full-stack-plan.md**

使用 `Read` 工具读取 `/home/mingg/github/full-stack-plan/full-stack-plan.md`，确认当前内容。

- [ ] **Step 2: 读取 daily skill**

使用 `Read` 工具读取 `/home/mingg/github/full-stack-plan/.claude/skills/daily/SKILL.md`，确认当前内容。

- [ ] **Step 3: 创建备份分支（可选但推荐）**

Run:
```bash
git checkout -b plan-optimization-2026-06-24
```
Expected: 成功创建并切换到新分支。

---

### Task 2: 更新 full-stack-plan.md 的总时间假设

**Files:**
- 修改：`full-stack-plan.md`

- [ ] **Step 1: 修改文档开头的「时间投入」说明**

将：
```markdown
> 时间投入：工作日 2h/天 + 周末 5h/天，全年约 1040 小时。
```
改为：
```markdown
> 时间投入：严格每天 2h，全年约 728 小时。
```

- [ ] **Step 2: 修改「八、每周时间分配模板」**

将原表格：
```markdown
| 时间 | 时长 | 内容 |
|------|------|------|
| 工作日晚上 | 2h | 看文档/视频 + 写代码 |
| 周六上午 | 2.5h | 攻克本周难点 |
| 周六下午 | 2.5h | 做产出物、写测试 |
| 周日上午 | 2.5h | 复盘、补文档 |
| 周日下午 | 2.5h | 预习下周内容 |
```
改为：
```markdown
| 时间 | 时长 | 内容 |
|------|------|------|
| 每天 | 2h | 理论学习 + 动手实践 + 验证 + 复盘 |
```

- [ ] **Step 3: 验证修改**

使用 `Read` 工具读取修改后的 `full-stack-plan.md` 对应段落，确认文字已更新。

---

### Task 3: 调整 full-stack-plan.md 阶段时间分配

**Files:**
- 修改：`full-stack-plan.md`

- [ ] **Step 1: 修改阶段三时长**

在阶段三标题处：
```markdown
### 阶段三：前端联调与本地完整跑通（第 16-18 周）
```
改为：
```markdown
### 阶段三：前端联调与本地完整跑通（第 16-17 周）
```

- [ ] **Step 2: 修改阶段四时长**

在阶段四标题处：
```markdown
### 阶段四：部署与基础设施（第 19-22 周）
```
改为：
```markdown
### 阶段四：部署与基础设施（第 18-21 周）
```

- [ ] **Step 3: 修改阶段五时长**

在阶段五标题处：
```markdown
### 阶段五：缓存、队列与可观测性（第 23-28 周）
```
改为：
```markdown
### 阶段五：缓存、队列与可观测性（第 22-27 周）
```

- [ ] **Step 4: 修改阶段六标题与内部结构**

将：
```markdown
### 阶段六：进阶功能与项目收尾（第 29-36 周）
```
改为：
```markdown
### 阶段六：进阶功能与项目收尾（第 28-34 周）

**阶段目标：** 补齐高级能力，形成可展示的作品集。

| 周次 | 主题 | 核心任务 | 产出物 |
|------|------|----------|--------|
| 第 28 周 | 对象存储 | 接入 OSS/COS/MinIO；预签名 URL；音频/封面上传 | 文件走对象存储 |
| 第 29 周 | 全文搜索 | PostgreSQL tsvector 或 Meilisearch；搜索建议 | 搜索体验升级 |
| 第 30 周 | WebSocket | Socket.io 实时通知；新节目推送 | 实时通知功能 |
| 第 31 周 | 后台管理 | 管理员权限；节目审核；用户/数据看板 | 运营后台 |
| 第 32 周 | 安全加固 | 密码哈希、CORS、CSRF、Rate Limit、XSS 防护 | 安全基线 |
| 第 33 周 | 网络与并发 | TCP/HTTP/HTTPS；Node 事件循环；PM2 多进程；简单了解 Go/Java 并发 | 能讲清请求生命周期 |
| 第 34 周 | 项目收尾 | README、架构图、演示视频、GitHub 整理 | 完整作品集 |
```

- [ ] **Step 5: 修改阶段七时长**

将：
```markdown
### 阶段七：面试冲刺（第 37-52 周）
```
改为：
```markdown
### 阶段七：面试冲刺（第 35-46 周）

**阶段目标：** 巩固算法、系统设计、八股文，准备跳槽。

| 周次 | 主题 | 核心任务 |
|------|------|----------|
| 第 35-38 周 | 算法基础 | 数组、哈希、双指针、链表、栈、队列、树 |
| 第 39-42 周 | 算法进阶 | 递归、回溯、动态规划、贪心、图论基础 |
| 第 43-44 周 | 系统设计 | 读《DDIA》；设计微博/短链/秒杀/消息系统；整理设计题 |
| 第 45-46 周 | 八股文 + 模拟面试 | HTTP、浏览器、数据库、Redis、Linux、安全；自我介绍、项目介绍、白板算法、系统设计演练 |
```

- [ ] **Step 6: 新增「弹性缓冲」章节**

在「阶段七」之后新增：

```markdown
---

### 弹性缓冲（第 47-52 周）

**用途：** 补足前面阶段未完成的内容，或用于面试前总复习。

- 阶段一末尾预留：1 周
- 阶段二末尾预留：1 周
- 阶段四末尾预留：1 周
- 阶段六末尾预留：1 周
- 阶段七末尾预留：2 周

若某阶段提前完成，缓冲时间自动并入下一阶段或用于复习。
```

- [ ] **Step 7: 更新路线总览**

将：
```markdown
第 1-8 周   后端基础 + 数据库
第 9-15 周  鉴权 + 测试 + 业务闭环
第 16-18 周 前端联调 + 本地完整跑通
第 19-22 周 Docker + Nginx + CI/CD 部署上线
第 23-28 周 缓存 + 队列 + 日志 + 监控
第 29-36 周 对象存储 + 搜索 + WebSocket + 后台 + 安全 + 收尾
第 37-52 周 算法 + 系统设计 + 八股文 + 面试准备
```
改为：
```markdown
第 1-8 周    后端基础 + 数据库
第 9-15 周   鉴权 + 测试 + 业务闭环
第 16-17 周  前端联调 + 本地完整跑通
第 18-21 周  Docker + Nginx + CI/CD 部署上线
第 22-27 周  缓存 + 队列 + 日志 + 监控
第 28-34 周  对象存储 + 搜索 + WebSocket + 后台 + 安全 + 收尾
第 35-46 周  算法 + 系统设计 + 八股文 + 面试准备
第 47-52 周  弹性缓冲
```

- [ ] **Step 8: 验证阶段周数合计**

Run:
```bash
grep -n "^### 阶段" /home/mingg/github/full-stack-plan/full-stack-plan.md
```
Expected: 阶段标题已更新为新的周数范围。

---

### Task 4: 更新 full-stack-plan.md 的算法时间安排

**Files:**
- 修改：`full-stack-plan.md`

- [ ] **Step 1: 调整算法周数描述**

将：
```markdown
- **第 1-20 周**：每周 3 小时，以「理解数据结构」为主，每周 3-4 题。
- **第 21-36 周**：每周 4 小时，按标签刷题，每周 4-5 题。
- **第 37-48 周**：每周 6-7 小时，专项突破 DP、回溯、图论。
- **第 49-52 周**：模拟面试，限时刷题。
```
改为：
```markdown
- **第 1-17 周**：每周 3 小时，以「理解数据结构」为主，每周 2-3 题。
- **第 18-34 周**：每周 4 小时，按标签刷题，每周 3-4 题。
- **第 35-46 周**：每周 6 小时，专项突破 DP、回溯、图论。
- **第 47-52 周**：模拟面试，限时刷题。
```

- [ ] **Step 2: 验证修改**

使用 `Read` 工具读取「六、全年算法学习安排」段落，确认数字已更新。

---

### Task 5: 更新 daily skill 的默认时长规则

**Files:**
- 修改：`.claude/skills/daily/SKILL.md`

- [ ] **Step 1: 修改 hours 默认值规则**

将 `.claude/skills/daily/SKILL.md` 中：
```markdown
`hours` 默认值规则：
- 如果 `day` 在 1-5 之间，默认 `2`。
- 如果 `day` 在 6-7 之间，默认 `5`。
- 如果 `day` 大于 7，默认 `2`。
- 如果用户提供了 `hours` 但 <=0，使用默认值。
```
改为：
```markdown
`hours` 默认值规则：
- 无论 `day` 是多少，默认 `2`。
- 如果用户提供了 `hours` 但 <=0，使用默认值 `2`。
```

- [ ] **Step 2: 同步修改示例**

将示例中的 `/daily 1 6 5` 删除或改为 `/daily 1 6 2`，确保示例与默认规则一致。

---

### Task 6: 在 daily skill 中加入连贯性规则

**Files:**
- 修改：`.claude/skills/daily/SKILL.md`

- [ ] **Step 1: 在「2. 读取 full-stack-plan.md」之后新增步骤**

新增步骤「3. 读取前一天任务与 review」：

```markdown
## 3. 读取前一天任务与 review

如果 `day > 1`，使用 `Read` 工具读取 `daily/week-{ww}/day-{dd-1}/tasks.md` 和 `daily/week-{ww}/day-{dd-1}/review.md`。

提取信息：
- `previousOutput`：前一天任务中描述的「今日结束后项目状态」。
- `mastery`：review.md 中的掌握度标签（`🟢 已掌握`、`🟡 部分理解`、`🔴 不太懂`）。
- `blockers`：review.md 中记录的卡点。

如果前一天 review 不存在或为空，默认按 `🟢 已掌握` 处理。
```

- [ ] **Step 2: 重新编号后续步骤**

将原「3. 计算输出目录」改为「4. 计算输出目录」，后续步骤依次 +1。

- [ ] **Step 3: 在生成文件前加入连贯性约束**

在「5. 生成文件」的「5.2 按天拆分本周任务」之前新增：

```markdown
### 5.1 任务连贯性约束

生成今日任务时必须满足：

1. 今日任务的起点 = 前一天任务描述的 `previousOutput`。
2. 今日任务必须是前一天任务的**自然延续**，不能跳跃到无关主题。
3. 每个任务描述结尾必须包含「今日结束后，项目/demo 的最新状态是什么」。
4. 同一个 `week-XX` 下的所有 day 最终应提交为一个完整的 Git commit（或一组相关 commit），对应本周产出物。
5. 若前一天掌握度为 `🔴 不太懂`，今日不推进新内容，全部时间用于深度复习；
   若为 `🟡 部分理解`，今日 50% 时间复习变式练习，50% 推进新内容；
   若为 `🟢 已掌握`，正常推进。
```

---

### Task 7: 在 daily skill 中实现掌握度驱动的自适应复习

**Files:**
- 修改：`.claude/skills/daily/SKILL.md`

- [ ] **Step 1: 修改「5.2 按天拆分本周任务」**

将原表格：
```markdown
| day | 重点 |
|-----|------|
| 1 | 概念理解 / 环境准备 |
| 2-3 | 核心知识学习 |
| 4-5 | 编码实践 |
| 6 | 产出物整理 / 测试 / 文档 |
| 7 | 复盘 / 预习下周 |
| >7 | 复习深化 / 扩展练习 |
```
改为：
```markdown
| day | 默认重点 | 自适应调整 |
|-----|----------|------------|
| 1 | 概念理解 / 环境准备 | 若前一天 `🔴`：从更简单的变体开始 |
| 2-3 | 核心知识学习 | 若 `🟡`：半天复习变式 + 半天新内容 |
| 4-5 | 编码实践 | 若 `🔴`：停止新内容，做深度复习 |
| 6 | 产出物整理 / 测试 / 文档 | 若本周未跑通 demo：继续补完 |
| 7 | 复盘 / 预习下周 | 若本周未完：延续到 day-08 |
| >7 | 复习深化 / 扩展练习 | 按掌握度和未完成任务动态生成 |
```

- [ ] **Step 2: 新增复习任务设计规则**

在「5.2」之后新增：

```markdown
### 5.2.1 复习任务设计规则

当需要复习时，不重复昨天的同一道题/同一段代码，而是生成**变式练习**：

1. 用更简单的场景切入（例如昨天是「播客列表接口」，今天复习用「单个节目详情接口」）。
2. 要求学习者用自己的话解释概念，并在 `review.md` 写「我现在的理解是……」。
3. AI 辅助点：根据昨天的卡点生成 3 个由浅入深的追问或练习。

示例：
- 昨天学 Event Loop，标记 `🔴 不太懂`。
- 今天任务：
  1. 用手绘/文字描述 Event Loop 一轮执行流程（30min）。
  2. 预测一段含 `setTimeout`、`Promise`、`async/await` 代码的输出（40min）。
  3. 在昨天的 HTTP 服务里加一段异步逻辑，观察请求处理顺序（40min）。
  4. 复盘（10min）。
```

---

### Task 8: 在 daily skill 中加入 AI 辅助提示

**Files:**
- 修改：`.claude/skills/daily/SKILL.md`

- [ ] **Step 1: 修改「5.3 生成 6 个 markdown 文件」中 tasks.md 的要求**

在 `tasks.md` 要求后新增：

```markdown
每个任务条目建议包含：
- 任务描述
- 建议时间段
- 验收标准
- AI 辅助提示（明确 AI 可以节省时间的环节）

AI 辅助提示示例：
- "AI 可以帮你：生成 `tsconfig.json` 骨架，但你需要理解每个字段含义。"
- "AI 可以帮你：解释报错原因，但修复必须亲手完成并验证。"
- "AI 可以帮你：生成 3 道变式练习题，但你要独立作答。"
```

- [ ] **Step 2: 在「5.3」中 review.md 的要求里加入掌握度标签**

将 `review.md` 要求改为：
```markdown
- `review.md`：完成检查清单、复盘问题、明日预习、卡点记录区。必须包含对前一天知识点的掌握度标签：`🟢 已掌握` / `🟡 部分理解` / `🔴 不太懂`。
```

---

### Task 9: 更新 week-01 示例

**Files:**
- 创建/覆盖：`daily/week-01/day-01/` ~ `day-07/` 下的 6 个标准 markdown 文件和 demo 文件

- [ ] **Step 1: 删除现有 week-01/day-01 到 day-07（可选）**

Run:
```bash
rm -rf /home/mingg/github/full-stack-plan/daily/week-01/day-0{1,2,3,4,5,6,7}
```
Expected: 目录被删除。注意：此操作会丢失 day-01 到 day-04 现有内容，如需保留请先备份。

- [ ] **Step 2: 生成 week-01/day-01 任务**

使用 `/daily 1 1 2` 调用 skill，或在 `.claude/skills/daily/SKILL.md` 更新后手动生成 `daily/week-01/day-01/` 的 6 个标准文件和 demo 文件。

要求：
- `tasks.md` 中每个任务附带 AI 辅助提示。
- 任务描述结尾包含「今日结束后项目状态」。
- 主题：Node.js 运行环境 + TS 最小工程。

- [ ] **Step 3: 生成 week-01/day-02 到 day-07**

依次调用 `/daily 1 2 2`、`/daily 1 3 2`……`/daily 1 7 2`。

要求：
- 每天任务必须承接前一天的项目状态。
- 每天任务结尾描述当天结束后的最新状态。
- 最终 day-07 结束时，demo 是一个带路由、错误处理、异步逻辑的迷你 HTTP 服务。

- [ ] **Step 4: 验证连贯性**

Run:
```bash
for d in 01 02 03 04 05 06 07; do echo "=== day-$d ==="; grep -n "今日结束后" /home/mingg/github/full-stack-plan/daily/week-01/day-$d/tasks.md || echo "未找到累计产出说明"; done
```
Expected: 每一天 tasks.md 都包含「今日结束后」的项目状态说明。

---

### Task 10: 验证 full-stack-plan.md 完整性

**Files:**
- 读取：`full-stack-plan.md`

- [ ] **Step 1: 检查所有阶段周数是否连续**

Run:
```bash
grep -E "^### (阶段|弹性)" /home/mingg/github/full-stack-plan/full-stack-plan.md
```
Expected: 输出显示阶段标题，周数范围连续无重叠。

- [ ] **Step 2: 检查总周数**

确认阶段一 8 周 + 阶段二 7 周 + 阶段三 2 周 + 阶段四 4 周 + 阶段五 6 周 + 阶段六 7 周 + 阶段七 12 周 + 缓冲 6 周 = 52 周。

---

### Task 11: 提交所有修改

**Files:**
- 所有修改过的文件

- [ ] **Step 1: 查看变更**

Run:
```bash
git status
```
Expected: 显示 `full-stack-plan.md`、`.claude/skills/daily/SKILL.md`、`daily/week-01/` 等变更。

- [ ] **Step 2: 提交 full-stack-plan.md 调整**

Run:
```bash
git add full-stack-plan.md
git commit -m "docs: adjust full-stack plan to strict 2h/day with buffer weeks

- Update total hours from 1040h to 728h
- Compress stage 3 (frontend) and stage 7 (interview prep)
- Add 6-week buffer for flexibility
- Adjust algorithm study schedule accordingly

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```
Expected: 提交成功。

- [ ] **Step 3: 提交 daily skill 优化**

Run:
```bash
git add .claude/skills/daily/SKILL.md
git commit -m "feat: update daily skill for coherence, mastery-driven review, and AI hints

- Default hours always 2
- Read previous day tasks and review for continuity
- Add adaptive review based on mastery tags
- Include AI assistance hints per task

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```
Expected: 提交成功。

- [ ] **Step 4: 提交 week-01 示例更新**

Run:
```bash
git add daily/week-01/
git commit -m "docs: regenerate week-01 daily plans with coherence and AI hints

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```
Expected: 提交成功。

---

## Self-Review

### Spec Coverage

| 设计文档要求 | 对应任务 |
|-------------|---------|
| 总时间改为 728h | Task 2 |
| 阶段时间重新分配 | Task 3 |
| 算法时间调整 | Task 4 |
| daily 默认时长 2h | Task 5 |
| 任务连贯性 | Task 6 |
| 掌握度驱动的自适应复习 | Task 7 |
| AI 辅助提示 | Task 8 |
| week-01 示例展示 | Task 9 |

### Placeholder Scan

- 无 `TBD`、`TODO`、"implement later"。
- 每个修改步骤包含具体文字替换或命令。
- 代码/命令块完整。

### Type Consistency

- `week` 与 `day` 的格式与现有 skill 一致（整数、可 >7）。
- `hours` 默认值统一为 2。
- 掌握度标签统一为 `🟢 已掌握` / `🟡 部分理解` / `🔴 不太懂`。

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-24-full-stack-plan-optimization-plan.md`.

Two execution options:

**1. Subagent-Driven (recommended)** - Dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
