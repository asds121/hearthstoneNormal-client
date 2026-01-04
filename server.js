import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";

// 配置
const PORT = 8080;
// 获取当前目录（ES模块方式）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = __dirname;

// MIME类型映射
const MIME_TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  // 处理请求路径，添加URL解码
  const requestPath = req.url === "/" ? "/index.html" : req.url;
  // 解码URL路径，处理中文和特殊字符
  const decodedPath = decodeURI(requestPath);
  const fullPath = path.join(PUBLIC_DIR, decodedPath);
  const ext = path.extname(fullPath).toLowerCase();

  // 设置响应头
  res.setHeader("Content-Type", MIME_TYPES[ext] || "application/octet-stream");

  // 读取并返回文件
  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.statusCode = err.code === "ENOENT" ? 404 : 500;
      res.end(err.message);
    } else {
      res.statusCode = 200;
      res.end(data);
    }
  });
});

// 创建WebSocket服务器
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("✅ 前端已连接，开始接收错误信息...");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === "error") {
        console.error("\n🔴 前端错误:");
        console.error("=".repeat(50));
        console.error(data.error);
        console.error("=".repeat(50));
      }
    } catch (e) {
      console.error("❌ 消息解析失败:", message);
    }
  });

  ws.on("close", () => {
    console.log("❌ 前端已断开连接");
  });

  ws.on("error", (error) => {
    console.error("❌ WebSocket错误:", error);
  });
});

// 启动服务器
server.listen(PORT, () => {
  console.log(`🚀 服务器已启动，访问地址: http://localhost:${PORT}`);
  console.log("📝 前端错误将显示在终端中\n");
});
