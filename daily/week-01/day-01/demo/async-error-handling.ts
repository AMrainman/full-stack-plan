// 演示 async/await 与 try-catch 错误处理
// 为什么用 async/await：比 Promise 链式调用更贴近同步代码的写法，降低心智负担

interface Data {
  content: string;
}

// 模拟可能失败的异步请求
function fetchData(shouldFail: boolean): Promise<Data> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('网络错误'));
      } else {
        resolve({ content: '重要数据' });
      }
    }, 100);
  });
}

async function getDataWithRetry(): Promise<void> {
  console.log('尝试获取数据...');

  try {
    // await 会暂停执行，直到 Promise 完成，但不会影响 Event Loop 中的其他任务
    const data = await fetchData(true); // 先模拟失败场景
    console.log('获取成功:', data.content);
  } catch (err) {
    // 为什么用 try-catch：async/await 的错误需要用 try-catch 捕获，否则会变成未处理的 Promise 拒绝
    console.error('请求失败:', (err as Error).message);
  } finally {
    // 无论成功或失败，都执行清理逻辑
    console.log('清理资源...');
  }
}

getDataWithRetry();
