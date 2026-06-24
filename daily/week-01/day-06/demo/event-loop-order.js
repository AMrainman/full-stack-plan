// 这个文件用来验证 Event Loop 的执行顺序：
// 同步代码 > Promise 微任务 > setTimeout 宏任务

console.log('同步 1');

// Promise 的 .then 回调属于微任务，会在当前同步代码执行完后立即执行
Promise.resolve().then(() => {
  console.log('Promise 1');
});

console.log('同步 2');

// setTimeout 属于宏任务，会进入 timers 队列，等待下一轮 Event Loop
setTimeout(() => {
  console.log('setTimeout 1');

  // setTimeout 内部的 Promise.then 又属于微任务，会在当前宏任务结束后执行
  Promise.resolve().then(() => {
    console.log('Promise 2');
  });
}, 0);

// 最终输出顺序：
// 同步 1
// 同步 2
// Promise 1
// setTimeout 1
// Promise 2
