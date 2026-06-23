// 用 async/await 把异步流程写得更像同步代码，同时演示错误捕获

// 模拟一个可能失败的异步请求
function fetchUser(userId: string, shouldFail = false): Promise<string> {
  return new Promise((resolve, reject) => {
    // 用 setTimeout 模拟网络延迟：异步操作不会阻塞主线程
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('模拟网络错误'));
      } else {
        resolve(`用户: ${userId}`);
      }
    }, 100);
  });
}

// 处理用户数据：把结果转成大写，演示链式异步操作
async function processUser(userId: string, shouldFail = false): Promise<string> {
  const user = await fetchUser(userId, shouldFail);
  // await 让异步结果看起来和同步变量一样，但本质上仍在 Event Loop 中协作
  return user.toUpperCase();
}

async function main(): Promise<void> {
  try {
    console.log('开始请求...');

    // 正常路径
    const result1 = await processUser('alice');
    console.log(result1);

    const result2 = await processUser('alice', true);
    // 如果上面抛出错误，下面的代码不会执行，直接进入 catch
    console.log(result2);
  } catch (error) {
    console.error('捕获错误:', (error as Error).message);
  }
}

main();
