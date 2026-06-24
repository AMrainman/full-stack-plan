// 演示 Event Loop 执行顺序：同步代码 → 微任务 → 宏任务
// 为什么重要：Node.js 是单线程事件驱动，理解执行顺序是排查异步 bug 的基础

console.log('1');

// setTimeout 属于宏任务（macrotask），会被放入 timers 队列
// 即使延迟为 0，也要等当前同步代码和微任务全部执行完才会执行
setTimeout(() => {
  console.log('2');
}, 0);

// Promise.then 属于微任务（microtask），优先级高于宏任务
Promise.resolve().then(() => {
  console.log('3');
});

console.log('4');

// 预期输出顺序：1 → 4 → 3 → 2
// 1 和 4 是同步代码，最先执行
// 3 是微任务，在同步代码之后执行
// 2 是宏任务，在最后执行
