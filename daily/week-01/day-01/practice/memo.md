# 学习笔记

## 对比 npm / yarn / pnpm 的差异

npm 嵌套结构 node_modules，V3后采用扁平化
yarn 扁平化 node_modules，引入 yarn.lock，并行下载提速
pnpm 全局内容寻址存储（content-addressable store）+ 硬链接，node_modules 用符号链接模拟隔离，彻底解决幽灵依赖

幽灵依赖（Phantom Dependency）说明
扁平化结构导致你可以在代码里 require 一个没有在 package.json 里声明的包（它是某个依赖的依赖）。pnpm 的符号链接结构让 Node 的模块解析只能找到你显式声明的包，从根本上杜绝这个问题。

## tsconfig 中的 strict: true 都包含哪些？

strict: true 是以下 8 个选项的总开关：

```md
1. strictNullChecks ⭐ 最重要
null 和 undefined 不能赋给其他类型，必须显式处理：
tslet name: string = null      // ❌ 报错
let name: string | null = null  // ✅

const el = document.getElementById('app')
el.style.color = 'red'       // ❌ el 可能是 null
el?.style.color = 'red'      // ✅

2. noImplicitAny
不允许 TypeScript 悄悄推断为 any，必须明确写类型：
tsfunction greet(name) { }      // ❌ name 隐式是 any
function greet(name: string) { } // ✅

3. strictFunctionTypes
函数参数类型逆变检查，防止不安全的函数赋值：
tstype Handler = (e: MouseEvent) => void
const fn: Handler = (e: Event) => { }  // ❌ Event 比 MouseEvent 宽，不安全
实际项目中较少直接感知，但能拦住一些隐蔽的类型错误。

4. strictBindCallApply
bind / call / apply 的参数也做类型检查：
tsfunction add(a: number, b: number) { return a + b }
add.call(null, 1, 'two')  // ❌ 'two' 不是 number

5. strictPropertyInitialization
类的属性必须在构造函数里初始化：
tsclass User {
  name: string        // ❌ 没有初始化
  name: string = ''   // ✅
  name!: string       // ✅ 用 ! 告诉 TS 你保证会赋值
}

6. noImplicitThis
this 类型不明确时报错：
tsfunction greet() {
  return this.name  // ❌ this 隐式是 any
}

7. alwaysStrict
给每个编译出来的 JS 文件顶部加 "use strict"，启用 JS 严格模式。

8. useUnknownInCatchVariables（TS 4.4 加入）
catch 的错误变量类型从 any 变为 unknown，强制你判断类型再使用：
tstry { } catch (e) {
  console.log(e.message)          // ❌ e 是 unknown
  if (e instanceof Error) {
    console.log(e.message)        // ✅
  }
}

```

## event-loop 中，微任务和宏任务执行顺序

同步代码执行完后，会将微任务队列执行完，才会执行宏任务队列中的第一个任务。如果宏任务执行过程中产生了新的微任务，则会在下个宏任务执行前执行完微任务队列。

## node 的 event loop 执行顺序

```text
nextTick 队列      ← 优先级最高
microtask 队列     ← Promise、queueMicrotask（次之）
────────────────────────────────
事件循环各阶段     ← timers / I/O / poll / check...

先清空 nextTick 队列 → 再清空 microtask 队列 → 才进入下一阶段
```
process.nextTick 是最优先的微任务，且process.nextTick中嵌套process.nextTick，会在当前 nextTick 队列清空后立即执行
