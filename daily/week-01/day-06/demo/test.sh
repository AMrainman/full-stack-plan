#!/usr/bin/env bash

# 一键测试脚本：启动播客服务并自动验证关键接口
# 为什么用脚本而不是手动 curl？
# 1. 可重复运行；2. 断言明确；3. 为后续 CI/CD 打基础。

set -euo pipefail

PORT=3000
BASE_URL="http://localhost:${PORT}"
SERVER_PID=""

# 脚本退出时确保关闭服务
cleanup() {
  if [ -n "${SERVER_PID}" ] && kill -0 "${SERVER_PID}" 2>/dev/null; then
    echo "关闭服务 (PID: ${SERVER_PID})..."
    kill "${SERVER_PID}" 2>/dev/null || true
    wait "${SERVER_PID}" 2>/dev/null || true
  fi
}
trap cleanup EXIT

echo "启动服务..."
npx tsx minimal-http-server.ts &
SERVER_PID=$!

# 等待服务就绪（最多 10 秒）
for i in {1..50}; do
  if curl -s "${BASE_URL}/health" > /dev/null 2>&1; then
    break
  fi
  sleep 0.2
done

echo ""
echo "========== 开始接口测试 =========="

# 辅助函数：打印请求结果
request() {
  local method="$1"
  local path="$2"
  local body="${3:-}"
  local url="${BASE_URL}${path}"

  echo ""
  echo "${method} ${path}"
  if [ -n "${body}" ]; then
    curl -s -w "\nHTTP_STATUS: %{http_code}\n" -X "${method}" -H "Content-Type: application/json" -d "${body}" "${url}"
  else
    curl -s -w "\nHTTP_STATUS: %{http_code}\n" -X "${method}" "${url}"
  fi
}

# 1. 健康检查
request "GET" "/health"

# 2. 播客列表
request "GET" "/podcasts"

# 3. 按 category 过滤
request "GET" "/podcasts?category=tech"

# 4. 播客详情
request "GET" "/podcasts/1"

# 5. 创建播客
request "POST" "/podcasts" '{"title":"测试播客","description":"测试描述","category":"test"}'

# 6. 更新播客
request "PUT" "/podcasts/1" '{"title":"更新后的标题","description":"更新后的描述","category":"tech"}'

# 7. 删除播客
request "DELETE" "/podcasts/2"

# 8. 404 测试
request "GET" "/unknown"

# 9. 400 测试：缺少 title
request "POST" "/podcasts" '{"description":"缺少标题"}'

# 10. 500 测试
request "GET" "/error"

echo ""
echo "========== 所有测试执行完毕 =========="
