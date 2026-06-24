#!/usr/bin/env bash
set -e

# 自动测试脚本：启动服务后测试关键接口，最后关闭服务

cd "$(dirname "$0")"

echo "正在安装依赖..."
pnpm install > /dev/null 2>&1

echo "启动播客服务..."
npx tsx podcast-server.ts > /tmp/podcast-server.log 2>&1 &
echo $! > /tmp/podcast-server.pid
sleep 2

# 服务关闭时清理后台进程
trap 'kill $(cat /tmp/podcast-server.pid) > /dev/null 2>&1 || true; rm -f /tmp/podcast-server.pid /tmp/podcast-server.log' EXIT

echo "测试 GET /health"
curl -s -o /tmp/health.json -w "%{http_code}" http://localhost:3000/health | grep -q "200" && echo "✅ /health 通过" || (echo "❌ /health 失败"; exit 1)
cat /tmp/health.json

echo ""
echo "测试 GET /api/podcasts"
curl -s -o /tmp/podcasts.json -w "%{http_code}" http://localhost:3000/api/podcasts | grep -q "200" && echo "✅ /api/podcasts 通过" || (echo "❌ /api/podcasts 失败"; exit 1)
cat /tmp/podcasts.json

echo ""
echo "测试 GET /api/podcasts?category=tech"
curl -s -o /tmp/podcasts-tech.json -w "%{http_code}" "http://localhost:3000/api/podcasts?category=tech" | grep -q "200" && echo "✅ 查询参数通过" || (echo "❌ 查询参数失败"; exit 1)
cat /tmp/podcasts-tech.json

echo ""
echo "测试 POST /api/podcasts"
curl -s -o /tmp/podcasts-post.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d '{"title":"新播客","category":"tech"}' http://localhost:3000/api/podcasts | grep -q "201" && echo "✅ POST 通过" || (echo "❌ POST 失败"; exit 1)
cat /tmp/podcasts-post.json

echo ""
echo "测试 GET /unknown"
curl -s -o /tmp/unknown.json -w "%{http_code}" http://localhost:3000/unknown | grep -q "404" && echo "✅ 404 通过" || (echo "❌ 404 失败"; exit 1)
cat /tmp/unknown.json

echo ""
echo "全部测试通过 ✅"
