import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import WebSocketServer from "./ws-server.js";

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");

// MIME类型映射
const mimeTypes = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".gif": "image/gif",
  ".wav": "audio/wav",
  ".mp4": "video/mp4",
  ".woff": "application/font-woff",
  ".ttf": "application/font-ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".otf": "application/font-otf",
  ".svg": "application/image/svg+xml",
  ".mjs": "application/javascript",
};

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  let filePath = req.url;

  // 处理根路径
  if (filePath === "/") {
    filePath = "/hearthstone-app.html";
  }

  // 转换为文件系统路径
  let fullPath;

  // 处理URL编码的路径
  const decodedPath = decodeURIComponent(filePath);

  if (
    decodedPath.startsWith("/hearthstone-app.html") ||
    decodedPath.startsWith("/test.html") ||
    decodedPath.startsWith("/detailed-test.html") ||
    decodedPath.startsWith("/styles/") ||
    decodedPath.startsWith("/js/") ||
    decodedPath.startsWith("/image/")
  ) {
    // 特殊处理主页面、测试页面和详细测试页面，以及styles、js、image目录下的资源，它们位于newclient目录下
    fullPath = path.join(__dirname, decodedPath.replace("/", ""));
  } else {
    // 其他资源从根目录查找
    fullPath = path.join(rootDir, decodedPath);
  }

  // 调试路径
  console.log(`请求路径: ${filePath}`);
  console.log(`解码路径: ${decodedPath}`);
  console.log(`文件路径: ${fullPath}`);
  const extname = String(path.extname(fullPath)).toLowerCase();
  const contentType = mimeTypes[extname] || "application/octet-stream";

  // 特殊处理noname.js文件，返回我们的模拟实现
  if (decodedPath.endsWith("/noname.js") || decodedPath === "/noname.js") {
    // 返回自定义的noname.js，使用我们的模拟对象
    const mockNonameJs = `
      // 模拟noname.js - 仅用于炉石普通扩展
      
      // 模拟game对象
      const mockGame = {
        // 确保modes属性存在
        modes: {
          all: new Map(),
          current: null,
          list: []
        },
        
        addMode: (name, module, config) => {
          console.log("添加模式: " + name, module, config);
          window.currentMode = { name, module, config };
          
          // 确保window.game.modes存在
          if (!window.game.modes) {
            window.game.modes = {
              all: new Map(),
              current: null,
              list: []
            };
          }
          
          // 更新window.game.modes，而不是mockGame.modes
          window.game.modes.all.set(name, {
            module,
            config,
            name
          });
          
          window.game.modes.list.push(name);
          
          // 自动设置为当前模式
          window.game.modes.current = name;
          
          return true;
        },
        // 添加saveConfig方法，用于保存配置
        saveConfig: () => {
          console.log("调用saveConfig方法");
          // 模拟保存配置的行为
          // 因为在炉石模式中会调用game.saveConfig()
          return Promise.resolve();
        },
        // 添加startMode方法，用于进入游戏模式
        startMode: (modeName) => {
          console.log("开始模式: " + modeName);
          // 使用window.game.modes.all，而不是mockGame.modes.all
          const mode = window.game.modes.all.get(modeName);
          if (mode) {
            // 更新window.game.modes.current，而不是mockGame.modes.current
            window.game.modes.current = modeName;
            console.log("已进入模式: " + modeName);
            
            // 添加验证机制
            const verificationPoints = {
              initCalled: false,
              startBeforeCalled: false,
              startCalled: false,
              saveConfigCalled: false
            };
            
            // 重写console.log，捕获验证点
            const originalConsoleLog = console.log;
            console.log = (...args) => {
              originalConsoleLog.apply(console, args);
              const message = args.join(' ');
              
              // 检查自定义验证日志
              if (message.includes("[验证点] 炉石模式init方法被调用")) {
                verificationPoints.initCalled = true;
              } else if (message.includes("[验证点] 炉石模式startBefore方法被调用")) {
                verificationPoints.startBeforeCalled = true;
              } else if (message.includes("[验证点] 炉石模式start方法被调用")) {
                verificationPoints.startCalled = true;
              } else if (message.includes("[验证点] saveConfig方法调用完成")) {
                verificationPoints.saveConfigCalled = true;
              }
            };
            
            // 执行完整的游戏流程
            try {
              // 1. 调用init()方法
              if (mode.module && mode.module.init) {
                console.log("调用模式init()方法...");
                mode.module.init(mode.config);
                console.log("模式init()完成");
              }
              
              // 2. 调用startBefore()方法
              if (mode.module && mode.module.startBefore) {
                console.log("调用模式startBefore()方法...");
                mode.module.startBefore();
                console.log("模式startBefore()完成");
              }
              
              // 3. 调用start()方法
              if (mode.module && mode.module.start) {
                console.log("调用模式start()方法...");
                // 创建一个模拟event对象
                const mockEvent = {
                  getParent: (level) => {
                    return { name: "chooseToUse" };
                  }
                };
                mode.module.start(mockEvent);
                console.log("模式start()完成");
              }
              
              // 恢复原始console.log
              console.log = originalConsoleLog;
              
              // 验证所有关键方法是否被调用
              console.log("=== 模式验证结果 ===");
              console.log("init()方法被调用: " + (verificationPoints.initCalled ? "✅" : "❌"));
              console.log("startBefore()方法被调用: " + (verificationPoints.startBeforeCalled ? "✅" : "❌"));
              console.log("start()方法被调用: " + (verificationPoints.startCalled ? "✅" : "❌"));
              console.log("saveConfig()方法被调用: " + (verificationPoints.saveConfigCalled ? "✅" : "❌"));
              
              // 检查是否通过所有验证
              const allPassed = Object.values(verificationPoints).every(Boolean);
              if (allPassed) {
                console.log("所有验证点都已通过！炉石普通扩展正常运行");
              } else {
                console.warn("部分验证点未通过，可能存在问题");
              }
              
              console.log("模式初始化和启动完成");
            } catch (error) {
              // 恢复原始console.log
              console.log = originalConsoleLog;
              console.error("模式执行过程中出错:", error);
            }
            
            return true;
          } else {
            console.error("未找到模式: " + modeName);
            return false;
          }
        },
        print: (msg) => console.log("Game print:", msg),
        tryUpdateClient: () => Promise.resolve(),
        modes: {
          all: new Map(),
          current: null,
          list: []
        },
        get: (key) => null,
        set: (key, value) => {},
        event: {
          on: () => {},
          off: () => {},
          emit: () => {}
        }
      };
      
      // 模拟其他必要的对象
        const mockLib = {
            characterPack: {},
            config: {
                skin: {},
                mode_config: {
                    guozhan: {
                        guozhanSkin: false
                    }
                }
            },
            characterDefaultPicturePath: 'image/character/default/',
            // 添加init对象和getCurrentFileLocation方法
            init: {
                getCurrentFileLocation: (importMetaUrl) => {
                    // 简单实现，返回基于URL的路径
                    try {
                        const url = new URL(importMetaUrl);
                        return url.pathname;
                    } catch (error) {
                        // 降级处理
                        return '/extension/炉石普通/experiment/utility.js';
                    }
                }
            },
            // 添加element对象和Player类，解决继承问题
            element: {
                Player: class {
                    // 模拟Player类的基本实现
                    constructor() {
                        this.baseATK = 0;
                        this.baseHP = 0;
                        this.buff = [];
                        this.hs_dm = {};
                        this.next = null;
                    }
                    
                    // 添加必要的方法
                    sctp() {
                        return [];
                    }
                }
            },
            // 添加sort对象，解决lib.sort.attendseq问题
            sort: {
                attendseq: () => 0
            }
        };
        
        const mockGet = {
            coreInfo: () => ['chrome', 135],
            mode: () => 'hearthstone',
            character: (name) => null
        };
        
        // 导出所有必要的对象
        // 确保所有类都返回正确的对象
        // 导出全局window.game对象，这样扩展就能使用我们在页面中创建的game对象
        // 导出全局对象，这样扩展就能使用我们在页面中创建的带有正确方法的对象
        export const game = window.game;
        export const Game = class {
            constructor() {
                return window.game;
            }
        };
        export const setGame = () => {};
        
        export const lib = window.lib;
        export const Library = class {
            constructor() {
                return window.lib;
            }
        };
        export const setLibrary = () => {};
        
        export const get = window.get;
        export const Get = class {
            constructor() {
                return window.get;
            }
        };
        export const setGet = () => {};
        
        export const ui = window.ui;
        export const UI = class {
            constructor() {
                return window.ui;
            }
        };
        export const setUI = () => {};
        
        export const ai = window.ai;
        export const AI = class {
            constructor() {
                return window.ai;
            }
        };
        export const setAI = () => {};
        
        export const _status = window._status;
        export const status = window.status;
        export const setStatus = () => {};
        
        export const gnc = window.gnc || {};
        export const GNC = class {
            constructor() {
                return window.gnc || {};
            }
        };
        export const setGNC = () => {};
        
        export const boot = () => Promise.resolve();
        export const onload = () => Promise.resolve();
        
        export const rootURL = new URL('./', import.meta.url);
    `;

    res.writeHead(200, { "Content-Type": "application/javascript" });
    res.end(mockNonameJs, "utf-8");
    return;
  }

  // 读取文件
  fs.readFile(fullPath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        // 文件不存在
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(
          `<h1>404 Not Found</h1><p>The requested file ${filePath} was not found.</p>`,
          "utf-8"
        );
      } else {
        // 服务器错误
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`, "utf-8");
      }
    } else {
      // 文件存在，返回内容，添加缓存控制头
      res.writeHead(200, {
        "Content-Type": contentType,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      });
      res.end(content, "utf-8");
    }
  });
});

// 启动服务器
const PORT = 8089;
server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`炉石普通专用客户端已启动！`);
  console.log(`服务器运行在: ${url}`);
  console.log(`正在打开浏览器...`);

  // 启动WebSocket服务器
  new WebSocketServer(server);

  // 自动打开浏览器
  try {
    // 根据操作系统选择打开方式
    let command, args;
    if (process.platform === "win32") {
      command = "cmd.exe";
      args = ["/c", "start", url];
    } else if (process.platform === "darwin") {
      command = "open";
      args = [url];
    } else {
      command = "xdg-open";
      args = [url];
    }

    spawn(command, args, { detached: true, stdio: "ignore" });
  } catch (error) {
    console.error("无法自动打开浏览器:", error.message);
    console.log(`请手动访问: ${url}`);
  }
});

console.log("炉石普通专用客户端正在启动...");
console.log(
  "这是一个模拟noname-server.exe的专用客户端，只用于运行炉石普通扩展。"
);
