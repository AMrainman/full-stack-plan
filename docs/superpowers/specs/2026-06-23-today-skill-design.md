# `/today` Skill 设计文档

> 设计日期：2026-06-23
> 适用仓库：full-stack-plan（播客应用全栈学习计划）
> 设计目标：在 `/daily` skill 基础上，提供一个无需手动指定周/天的快捷命令

---

## 1. 背景

`/daily <week> <day> [hours]` 已经实现，但用户每天使用时仍需手动计算「今天该学第几天」。

`/today` 作为 `/daily` 的快捷入口，自动找到最新生成的计划目录，把 day 加 1，然后调用 `/daily` 完成后续所有工作。

---

## 2. Skill 调用方式

- **全局文件**：`~/.claude/skills/today/SKILL.md`
- **仓库备份**：`.claude/skills/today.md`
- **命令格式**：
  - `/today` — 默认生成下一天计划，时长 2h
  - `/today <hours>` — 生成下一天计划，指定时长

---

## 3. 执行逻辑

1. **扫描 `daily/` 目录**
   - 使用 `Bash` 工具运行：
     ```bash
     find daily -type d -name 'day-*' | sort -V | tail -1
     ```
   - 从输出解析 `week` 和 `day`，例如 `daily/week-01/day-02` → week=1, day=2。
   - 如果没有任何 `day-*` 目录，向用户报错：
     > 未找到任何已有计划，请先使用 `/daily 1 1` 生成第一天计划。

2. **计算下一天**
   - `nextDay = day + 1`
   - `week` 保持不变（只递增 day，不递增 week）。

3. **解析 `hours`**
   - 如果用户没有提供，`hours = 2`。
   - 如果用户提供了但 <=0，也使用默认值 2。

4. **调用 `/daily` skill**
   - 使用 `Skill` 工具调用 `daily`，参数为 `[week, nextDay, hours]`。
   - 示例：
     - `/today` → `Skill daily 1 3 2`
     - `/today 3` → `Skill daily 1 3 3`

5. **输出摘要**
   - 向用户说明：`已为你调用 /daily {week} {nextDay} {hours}`。
   - `/daily` skill 自身的输出会接着展示生成的文件列表。

---

## 4. 边界情况

| 场景 | 处理 |
|------|------|
| `daily/` 不存在 | 报错，提示使用 `/daily 1 1` |
| `daily/` 存在但无 `day-*` 目录 | 同上 |
| `hours` 缺失 | 默认 2 |
| `hours` <= 0 | 默认 2 |
| 最新 day 为 7 | 生成 day 8，不进入下周 |
| 最新 day 为 99 | 生成 day 100，week 不变 |

---

## 5. 与 `/daily` 的关系

- `/today` 不直接生成任何文件。
- 所有文件生成、frontmatter、Git 提交、查缺补漏逻辑全部由 `/daily` 处理。
- `/today` 只是「找最新计划 → day+1 → 调用 /daily」的薄封装。

---

## 6. 实现方案

采用**方案一：`/today` skill 调用 `/daily` skill**。

- 优点：避免重复 `/daily` 的复杂生成逻辑，维护成本低。
- 缺点：依赖 `/daily` skill 已全局安装。

---

## 7. 验收标准

- [ ] `/today` 能在 `daily/week-01/day-02` 之后生成 `daily/week-01/day-03`。
- [ ] `/today 3` 能生成 `daily/week-01/day-03`，且 `hours=3`。
- [ ] `daily/` 为空时，`/today` 报错并提示使用 `/daily 1 1`。
- [ ] 最新 day 为 7 时，`/today` 生成 day 8，不进入下周。
