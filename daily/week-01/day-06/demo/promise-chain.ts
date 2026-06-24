// 演示 Promise 链式调用与异步执行顺序
// 为什么用链式调用：避免回调地狱，让异步逻辑像同步代码一样线性阅读

interface User {
  id: number;
  name: string;
}

interface Order {
  userId: number;
  items: string[];
}

// 模拟异步获取用户
function fetchUser(id: number): Promise<User> {
  return new Promise((resolve) => {
    // 为什么用 setTimeout：模拟网络延迟，让异步特性更明显
    setTimeout(() => {
      resolve({ id, name: 'Alice' });
    }, 100);
  });
}

// 模拟异步获取订单
function fetchOrders(userId: number): Promise<Order> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ userId, items: ['book', 'pen'] });
    }, 100);
  });
}

// 链式调用：先取用户，再取订单
console.log('开始读取用户...');
fetchUser(1)
  .then((user) => {
    console.log(`用户: ${user.name}`);
    return fetchOrders(user.id); // 返回新的 Promise，继续链式调用
  })
  .then((order) => {
    console.log(`订单: ${order.items}`);
  })
  .catch((err) => {
    // 统一捕获链中任何环节的异常
    console.error('链式调用出错:', err);
  });
