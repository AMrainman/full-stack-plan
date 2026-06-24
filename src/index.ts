import fs from 'fs'

// ============================================================
// Node.js Event Loop 复杂示例
// 目标：理解同步代码、nextTick、Promise 微任务、timers、poll、check 阶段的执行顺序
// 运行方式：npx tsc && node dist/index.js
// ============================================================

// ESM 中没有 __filename，用 new URL(import.meta.url) 获取当前文件 URL
// fs.readFile 支持传入 URL 对象
const intervalId = setInterval(() => {
  console.log('7. setInterval（第一次触发）')
  clearInterval(intervalId)
}, 0)

console.log('1. 同步代码开始')

// timers 阶段：setTimeout 进入 timers 队列
setTimeout(() => {
  console.log('8. setTimeout 0ms（timers 阶段）')

  // 在 timers 回调里继续注册微任务和 setImmediate
  process.nextTick(() => console.log('9. setTimeout 里的 nextTick'))
  Promise.resolve().then(() => console.log('10. setTimeout 里的 Promise.then'))
  setImmediate(() => console.log('14. setTimeout 里的 setImmediate'))
}, 0)

// check 阶段：setImmediate 进入 check 队列
setImmediate(() => {
  console.log('11. setImmediate（check 阶段）')

  process.nextTick(() => console.log('12. setImmediate 里的 nextTick'))
  Promise.resolve().then(() => console.log('13. setImmediate 里的 Promise.then'))
})

// nextTick 属于 microtask，优先级高于 Promise.then
process.nextTick(() => {
  console.log('3. nextTick 1')

  // nextTick 里嵌套 nextTick 会在当前 nextTick 队列清空后再执行
  process.nextTick(() => console.log('4. nextTick 嵌套'))
})

// Promise.then 也属于 microtask，但优先级低于 nextTick
Promise.resolve().then(() => {
  console.log('5. Promise.then 1')

  // Promise.then 里嵌套的 Promise.then 会在当前微任务队列清空后再执行
  Promise.resolve().then(() => console.log('6. Promise.then 嵌套'))
})

// I/O 回调在 poll 阶段执行；这里用 readFile 读取当前文件自身，模拟一次 I/O 操作
fs.readFile(new URL(import.meta.url), () => {
  console.log('15. fs.readFile 回调（poll 阶段）')

  // 在 I/O 回调里：setImmediate 会先于 setTimeout(0) 执行
  setTimeout(() => console.log('18. I/O 回调里的 setTimeout'), 0)
  setImmediate(() => console.log('17. I/O 回调里的 setImmediate'))
  process.nextTick(() => console.log('16. I/O 回调里的 nextTick'))
})

console.log('2. 同步代码结束')

// ============================================================
// 预期输出（Node.js 18+，主线程无额外 I/O 时）：
//
// 1. 同步代码开始
// 2. 同步代码结束
// 3. nextTick 1
// 4. nextTick 嵌套
// 5. Promise.then 1
// 6. Promise.then 嵌套
// （以下三个顺序可能变化，见下方说明）
// 7. setInterval（第一次触发）
// 8. setTimeout 0ms（timers 阶段）
// 11. setImmediate（check 阶段）
// 9. setTimeout 里的 nextTick
// 10. setTimeout 里的 Promise.then
// 12. setImmediate 里的 nextTick
// 13. setImmediate 里的 Promise.then
// 14. setTimeout 里的 setImmediate
// 15. fs.readFile 回调（poll 阶段）
// 16. I/O 回调里的 nextTick
// 17. I/O 回调里的 setImmediate
// 18. I/O 回调里的 setTimeout
//
// 说明：
// 1. setTimeout(0)、setInterval(0) 同处 timers 阶段，通常注册早的先触发；
// 2. setTimeout(0) 与 setImmediate 在主脚本中的相对顺序**不是 100% 确定**，
//    可能 7/8 在 11 前，也可能 11 在 7/8 前，取决于进程启动到 timers 阶段的时间；
// 3. 无论主脚本中顺序如何，微任务总是在每个回调后立即清空：
//    8 后面紧跟 9、10；11 后面紧跟 12、13；
// 4. 在 I/O 回调（如 fs.readFile）内部，setImmediate 一定先于 setTimeout(0)。
// ============================================================
