import { WebSocketServer as WSServer } from "ws";

class WebSocketServer {
  constructor(server) {
    this.wss = new WSServer({ server });
    this.clients = new Set();

    this.setupEventListeners();
    console.log("WebSocket服务器已启动");
  }

  setupEventListeners() {
    this.wss.on("connection", (ws) => {
      console.log("新的客户端连接");
      this.clients.add(ws);

      // 发送欢迎消息
      ws.send(
        JSON.stringify({
          type: "welcome",
          message: "已连接到炉石普通专用客户端错误日志服务器",
        })
      );

      // 接收客户端消息
      ws.on("message", (message) => {
        try {
          const data = JSON.parse(message);
          this.handleClientMessage(data, ws);
        } catch (error) {
          console.error("解析客户端消息失败:", error);
        }
      });

      // 处理断开连接
      ws.on("close", () => {
        console.log("客户端断开连接");
        this.clients.delete(ws);
      });

      // 处理错误
      ws.on("error", (error) => {
        console.error("WebSocket错误:", error);
        this.clients.delete(ws);
      });
    });
  }

  handleClientMessage(data, ws) {
    switch (data.type) {
      case "error":
        console.error("前端错误:", data.error);
        // 可以将错误保存到文件或数据库
        break;
      case "log":
        console.log("前端日志:", data.message);
        break;
      case "status":
        console.log("前端状态:", data.status);
        break;
      case "ping":
        // 响应pong消息
        this.sendToClient(ws, {
          type: "pong",
          timestamp: new Date().toISOString(),
        });
        break;
      case "pong":
        // 忽略pong响应
        break;
      default:
        console.log("未知消息类型:", data.type);
    }
  }

  broadcast(message) {
    const jsonMessage = JSON.stringify(message);
    for (const client of this.clients) {
      if (client.readyState === client.OPEN) {
        client.send(jsonMessage);
      }
    }
  }

  sendToClient(client, message) {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(message));
    }
  }
}

export default WebSocketServer;
