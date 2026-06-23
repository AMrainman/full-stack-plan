---
name: today
description: Use when working in a repository with daily/ study plans and you want to generate the next day's plan without specifying week and day
---

# `/today` Skill

当用户调用 `/today [hours]` 时，按本 prompt 执行。

## 1. 解析 `hours`

- 如果用户没有提供，`hours = 2`。
- 如果用户提供了但 <=0，`hours = 2`。

## 2. 查找最新计划目录

使用 `Bash` 工具运行：

```bash
find daily -type d -name 'day-*' | sort -V | tail -1
```

预期输出形如 `daily/week-01/day-02`。

- 如果命令返回空（没有任何 `day-*` 目录），向用户报错并停止：
  > 未找到任何已有计划，请先使用 `/daily 1 1` 生成第一天计划。

## 3. 解析 `week` 和 `day`

从最新目录路径中提取：

- `week`：路径中 `week-XX` 的整数部分。
- `day`：路径中 `day-YY` 的整数部分。

例如 `daily/week-01/day-02` -> `week=1`, `day=2`。

## 4. 计算下一天

- `nextDay = day + 1`
- `week` 保持不变。

## 5. 调用 `/daily` skill

使用 `Skill` 工具调用 `daily`，参数为 `[week, nextDay, hours]`。

示例：
- `/today` 且最新为 `day-02` -> `Skill daily 1 3 2`
- `/today 3` 且最新为 `day-02` -> `Skill daily 1 3 3`

## 6. 输出摘要

向用户说明：

```text
已为你调用 /daily {week} {nextDay} {hours}
```

然后 `/daily` skill 会输出生成的文件列表。
