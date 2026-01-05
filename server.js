import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";
import { spawn } from "child_process";

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

      // 记录404和500错误
      if (res.statusCode === 404) {
        // 只记录JS文件的404错误，屏蔽其他资源的404错误
        const isJsFile = req.url.endsWith(".js") || req.url.endsWith(".ts");
        if (isJsFile) {
          // 404错误去重
          const errorKey = req.url;
          if (!errorCache.http404.has(errorKey)) {
            errorCache.http404.add(errorKey);
            console.error(`🔴 404 Not Found: ${req.url}`);
            console.error(
              `   Request from: ${req.headers.referer || "直接访问"}`
            );
          }
        }
      } else {
        console.error(`🔴 Server Error (${res.statusCode}): ${req.url}`);
        console.error(`   Error: ${err.message}`);
      }
    } else {
      res.statusCode = 200;
      res.end(data);
    }
  });
});

// 创建WebSocket服务器
const wss = new WebSocketServer({ server });

// 错误日志去重缓存
const errorCache = {
  http404: new Set(),
  fontError: 0,
  audioError: 0,
};

// 定期清理缓存
setInterval(() => {
  errorCache.http404.clear();
  errorCache.fontError = 0;
  errorCache.audioError = 0;
}, 30000); // 每30秒清理一次

let connectionCount = 0;

wss.on("connection", (ws) => {
  connectionCount++;
  console.log(
    `✅ 前端已连接，开始接收错误信息... (连接数: ${connectionCount})`
  );

  ws.on("message", (message) => {
        try {
          const data = JSON.parse(message);
          if (data.type === "error") {
            const errorMsg = data.error;

            // 屏蔽字体资源错误和音频资源错误
            if (errorMsg.includes("font资源加载失败") || errorMsg.includes("audio资源加载失败")) {
              // 不输出任何日志，直接屏蔽
            }
            // 其他错误正常记录
            else {
              console.error("\n🔴 前端错误:");
              console.error("=".repeat(50));
              console.error(errorMsg);
              console.error("=".repeat(50));
            }
          }
        } catch (e) {
          console.error("❌ 消息解析失败:", message);
        }
      });

  ws.on("close", () => {
    connectionCount--;
    console.log(`❌ 前端已断开连接 (剩余连接数: ${connectionCount})`);
  });

  ws.on("error", (error) => {
    console.error("❌ WebSocket错误:", error);
  });
});

// 启动服务器
server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`🚀 服务器已启动，访问地址: ${url}`);
  console.log("📝 前端错误将显示在终端中\n");

  // 自动打开网页
  const opn = (url) => {
    const platform = process.platform;
    let cmd = "";
    let args = [];

    if (platform === "win32") {
      cmd = "cmd";
      args = ["/c", "start", url];
    } else if (platform === "darwin") {
      cmd = "open";
      args = [url];
    } else {
      cmd = "xdg-open";
      args = [url];
    }

    spawn(cmd, args, { stdio: "ignore", detached: true });
  };

  opn(url);
});
