// WebSocket连接管理
let ws = null;
let wsReconnectTimer = null;
let errorQueue = [];

// 连接WebSocket
function connectWebSocket() {
  if (typeof window === "undefined" || !window.location) return;

  // 处理about:blank协议，直接返回
  if (window.location.protocol === "about:") {
    return;
  }

  try {
    // 检查是否为http或https协议
    const isHttpProtocol = window.location.protocol.startsWith("http");
    // 检查hostname是否有效
    const hasValidHost =
      window.location.hostname && window.location.hostname !== "";

    // 只有在条件满足时才尝试连接
    if (isHttpProtocol && hasValidHost) {
      // 正确处理WebSocket URL，根据协议和端口生成
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const hostname = window.location.hostname;
      const port = window.location.port;

      // 构建WebSocket URL，处理默认端口情况
      let wsUrl;
      if (port) {
        wsUrl = `${protocol}//${hostname}:${port}`;
      } else {
        // 使用默认端口时，不需要显式指定端口
        wsUrl = `${protocol}//${hostname}`;
      }

      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("✅ WebSocket连接已建立");
        if (wsReconnectTimer) {
          clearTimeout(wsReconnectTimer);
          wsReconnectTimer = null;
        }

        // 发送队列中的错误信息
        if (errorQueue.length > 0) {
          errorQueue.forEach((errorInfo) => {
            ws.send(
              JSON.stringify({
                type: "error",
                error: errorInfo,
              })
            );
          });
          errorQueue = [];
        }
      };

      ws.onclose = () => {
        console.log("❌ WebSocket连接已关闭，3秒后尝试重连...");
        wsReconnectTimer = setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = (error) => {
        console.error("❌ WebSocket错误:", error);
      };
    } else {
      // 跳过连接，记录日志
      let logMessage = "跳过WebSocket连接: ";
      if (!isHttpProtocol) {
        logMessage += "非HTTP协议 ";
      }
      if (!hasValidHost) {
        logMessage += "无效的hostname ";
      }

      console.error(logMessage.trim());
      // 10秒后再次检查
      wsReconnectTimer = setTimeout(connectWebSocket, 10000);
    }
  } catch (error) {
    console.error("❌ WebSocket连接失败:", error);
    // 延长重连时间
    wsReconnectTimer = setTimeout(connectWebSocket, 10000);
  }
}

// 发送错误信息到WebSocket
function sendErrorToServer(errorInfo) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({
        type: "error",
        error: errorInfo,
      })
    );
  } else {
    // 如果WebSocket未连接，将错误信息加入队列
    errorQueue.push(errorInfo);
    // 限制队列长度，防止内存溢出
    if (errorQueue.length > 100) {
      errorQueue.shift();
    }
  }
}

// 初始化WebSocket连接
if (typeof window !== "undefined") {
  connectWebSocket(); // 立即建立WebSocket连接，不延迟
}

class CodeSnippet {
  /** @type {Array<CodeSnippet>} */
  static #snippetStack = [];

  /** @type {string} */
  #code;
  /** @type {number} */
  #erroff;

  /**
   * ```plain
   * 构造一个代码片段对象
   *
   * 通过 `erroff` 指定在发生错误时，错误信息指出的行与实际代码行的偏移量
   * ```
   * @param {string} code
   * @param {number} erroff
   */
  constructor(code, erroff = 0) {
    this.#code = String(code);
    this.#erroff = parseInt(String(erroff)) || 0;
  }

  /** @type {string} */
  get code() {
    return this.#code;
  }

  /** @type {Array<string>} */
  get lines() {
    return this.code.split(/\r?\n/);
  }

  /**
   * ```plain
   * 给定错误行号来获取错误代码片段
   * ```
   *
   * @param {number} lineno
   * @returns {string}
   */
  viewCode(lineno) {
    const range = 5;

    if (!Number.isInteger(lineno)) {
      throw new TypeError("错误行号必须是一个整数");
    }

    const index = lineno - this.#erroff;
    const lines = this.lines;
    const width = String(index + range).length;

    let codeView = "";

    for (let i = index - range; i < index + range + 1; i++) {
      if (i < 0 || i >= lines.length) {
        continue;
      }

      codeView += String(i + 1).padStart(width, "0");
      codeView += `|${i == index ? "⚠️" : "    "}${lines[i]}\n`;
    }

    return codeView;
  }

  /**
   * ```plain
   * 获取当前代码片段
   * ```
   *
   * @type {CodeSnippet?}
   */
  static get currentSnippet() {
    if (!this.#snippetStack.length) {
      return null;
    }

    return this.#snippetStack[this.#snippetStack.length - 1];
  }

  /**
   * ```plain
   * 压入一个代码片段作为当前代码片段
   * ```
   *
   * @param {CodeSnippet} snippet
   */
  static pushSnippet(snippet) {
    if (!(snippet instanceof CodeSnippet)) {
      throw new TypeError("参数必须是一个代码片段对象");
    }

    this.#snippetStack.push(snippet);
  }

  /**
   * ```plain
   * 弹出当前代码片段
   * ```
   *
   * @returns {CodeSnippet}
   */
  static popSnippet() {
    if (!this.#snippetStack.length) {
      throw new Error("代码片段栈为空");
    }

    // @ts-expect-error Already checked
    return this.#snippetStack.pop();
  }
}

class ErrorReporter {
  static #topAlert = window.alert.bind(null);
  static #errorLineNoPatterns = [
    /<anonymous>:(\d+):\d+\)/,
    /at <anonymous>:(\d+):\d+/,
    /eval:(\d+):\d+/,
    /Function:(\d+):\d+/,
    /:(\d+):\d+/,
  ];

  /** @type {CodeSnippet?} */
  #snippet;
  /** @type {string} */
  #message;
  /** @type {string} */
  #stack;

  /**
   * ```plain
   * 构造一个错误报告对象
   * 以此来保存错误相关信息
   * ```
   *
   * @param {Error} error
   * @param {CodeSnippet?} snippet
   */
  constructor(error, snippet = CodeSnippet.currentSnippet) {
    if (!("stack" in error)) {
      throw new TypeError("传入的对象不是一个错误对象");
    }

    this.#snippet = snippet;
    this.#message = String(error);
    this.#stack = String(error.stack);
  }

  get message() {
    return this.#message;
  }

  get stack() {
    return this.#stack;
  }

  static #findLineNo = function (line) {
    for (const pattern of ErrorReporter.#errorLineNoPatterns) {
      const match = pattern.exec(line);

      if (match) {
        return parseInt(match[1]);
      }
    }

    return NaN;
  };

  viewCode() {
    if (!this.#snippet) {
      return null;
    }

    const stack = this.#stack;
    const line = stack.split("\n")[1];
    const lineno = ErrorReporter.#findLineNo(line);

    if (!isNaN(lineno)) {
      return this.#snippet.viewCode(lineno);
    }

    return null;
  }

  /**
   * ```plain
   * 向用户报告错误信息，并发送到后端
   * ```
   *
   * @param {string} title
   * @returns {string}
   */
  report(title) {
    const codeView = this.viewCode() || "#没有代码预览#";
    let errorInfo = `${title}:\n\t${this.#message}\n`;
    errorInfo += `-------------\n${codeView.trim()}\n`;
    errorInfo += `-------------\n调用堆栈:\n${this.#stack}`;

    // 发送错误信息到WebSocket服务器
    sendErrorToServer(errorInfo);

    // 发送错误信息到后端
    if (typeof game !== "undefined" && typeof game.send === "function") {
      game.send("error", {
        title: title,
        message: this.#message,
        stack: this.#stack,
        codeView: codeView,
        errorInfo: errorInfo,
      });
    }

    // 记录到控制台
    console.error(errorInfo);

    return errorInfo;
  }

  /**
   * ```plain
   * 向用户报告错误信息
   * ```
   *
   * @param {Error} error
   * @param {string} title
   */
  static reportError(error, title = "发生错误") {
    new ErrorReporter(error).report(title);
  }
}

class ErrorManager {
  /** @type {WeakMap<Function, CodeSnippet>} */
  static #codeSnippets = new WeakMap();
  /** @type {WeakMap<Object, ErrorReporter>} */
  static #errorReporters = new WeakMap();

  /**
   * ```plain
   * 获取函数对应的代码片段
   * ```
   *
   * @param {Function} func
   * @returns {CodeSnippet?}
   */
  static getCodeSnippet(func) {
    if (typeof func !== "function") {
      throw new TypeError("参数func必须是一个function");
    }

    return this.#codeSnippets.get(func) || null;
  }

  /**
   * ```plain
   * 设置函数对应的代码片段
   * ```
   *
   * @param {Function} func
   * @param {CodeSnippet} snippet
   */
  static setCodeSnippet(func, snippet) {
    if (typeof func !== "function") {
      throw new TypeError("参数func必须是一个function");
    }
    if (!(snippet instanceof CodeSnippet)) {
      throw new TypeError("参数snippet必须是一个CodeSnippet");
    }

    return this.#codeSnippets.set(func, snippet);
  }

  /**
   * ```plain
   * 获取错误堆栈中与行列无关的错误信息
   * ```
   *
   * @param {Error} error
   * @returns {string[]?}
   */
  static #getFramesHead = function (error) {
    return error.stack
      ? error.stack
          .slice(String(error).length + 1)
          .split("\n")
          .map((line) => {
            line = line.trim();
            const match = /^\s*(.+?):\d+:\d+/.exec(line);
            return match ? match[1] : line;
          })
      : null;
  };

  /**
   * ```plain
   * 计算错误A比错误B多的堆栈层数
   * ```
   *
   * @param {Error} errorA
   * @param {Error} errorB
   * @returns {number?}
   */
  static #compareStackLevel = function (errorA, errorB) {
    const stackA = ErrorManager.#getFramesHead(errorA);
    const stackB = ErrorManager.#getFramesHead(errorB);

    if (!stackA || !stackB || stackA.length < stackB.length) {
      return null;
    }

    const lastFrameA = stackA[stackA.length - 1];
    const indexInB = stackB.lastIndexOf(lastFrameA);

    if (indexInB === -1) {
      return stackA.length - stackB.length;
    }

    return stackA.length - indexInB - 1;
  };

  /**
   * ```plain
   * 封装被设定了代码片段函数的错误捕获调用
   *
   * 当 `body` 函数在它这一层调用栈中出现错误时
   * 此函数将自动记录此次错误信息并整理相关代码片段
   * ```
   * @example
   * ```javascript
   * ErrorManager.errorHandle(() => {
   *     event.content(...);
   * }, event.content);
   * ```
   *
   * @param {Function} action 调用函数的闭包
   * @param {Function} body 实际被调用的函数，同时也是持有代码片段的函数
   * @param {number} extraLevel action调用到body的间隔调用栈层数
   */
  static errorHandle(action, body, extraLevel = 0) {
    const snippet = ErrorManager.getCodeSnippet(body);

    try {
      action();
    } catch (e) {
      if (!(e instanceof Error)) {
        throw e;
      }

      if (snippet) {
        const diff = ErrorManager.#compareStackLevel(e, new Error());

        if (diff && diff == 2 + extraLevel) {
          ErrorManager.setErrorReporter(e, snippet);
        }
      }

      throw e;
    }
  }

  /**
   * ```plain
   * 设置错误报告器
   *
   * 在报告错误时可以从此处获取错误报告器来直接报告错误
   * ```
   *
   * @param {Object} obj
   * @param {ErrorReporter|CodeSnippet|null} reporter
   *
   * @overload
   * @param {Object} obj
   *
   * @overload
   * @param {Object} obj
   * @param {ErrorReporter?} reporter
   *
   * @overload
   * @param {Object} obj
   * @param {CodeSnippet?} codeSnippet
   */
  static setErrorReporter(obj, reporter = null) {
    if (obj !== Object(obj)) {
      throw new TypeError("参数必须是一个对象");
    }

    if (!(reporter instanceof ErrorReporter)) {
      if (reporter instanceof CodeSnippet) {
        reporter = new ErrorReporter(obj, reporter);
      } else {
        reporter = new ErrorReporter(obj);
      }
    }

    ErrorManager.#errorReporters.set(obj, reporter);
  }

  /**
   * ```plain
   * 获取设置的错误报告器
   * ```
   *
   * @param {Object} obj
   * @returns {ErrorReporter?}
   */
  static getErrorReporter(obj) {
    return ErrorManager.#errorReporters.get(obj) || null;
  }
}

// 全局错误捕获
if (typeof window !== "undefined") {
  // 捕获同步错误
  window.onerror = (message, source, lineno, colno, error) => {
    const errorInfo = `${message}\n    at ${source}:${lineno}:${colno}\n${error?.stack || ""}`;
    sendErrorToServer(errorInfo);
    return false; // 允许浏览器继续处理错误
  };

  // 捕获异步错误和模块加载错误
  window.onunhandledrejection = (event) => {
    const error = event.reason;
    let errorInfo;

    // 检查是否是模块加载错误
    if (
      error?.name === "TypeError" &&
      error?.message?.includes("Failed to fetch")
    ) {
      // 尝试从错误信息中提取模块URL
      const urlMatch = error?.message?.match(/'([^']+)'/);
      const moduleUrl = urlMatch ? urlMatch[1] : "未知模块";
      errorInfo = `js资源加载失败: ${moduleUrl}\n状态码: 404 Not Found\n错误信息: ${error.message}`;
    } else {
      // 普通异步错误
      errorInfo = `${error?.message || error}\n${error?.stack || ""}`;
    }

    sendErrorToServer(errorInfo);
  };

  // 捕获资源加载错误（如404、403等）
  window.addEventListener(
    "error",
    (event) => {
      // 检查是否是资源加载错误
      if (event.target) {
        let resourceUrl = "未知资源";
        let resourceType = "unknown";

        // 处理HTMLElement资源
        if (event.target instanceof HTMLElement) {
          resourceUrl = event.target.src || event.target.href || resourceUrl;
          resourceType = event.target.tagName.toLowerCase();

          // 特殊处理LINK标签
          if (resourceType === "link") {
            if (event.target.rel && event.target.rel.includes("stylesheet")) {
              resourceType = "css";
            }
          }
          // 特殊处理SCRIPT标签
          else if (resourceType === "script") {
            resourceType = "js";
          }
        }
        // 处理FontFaceSetLoadEvent（字体加载错误）
        else if (event.target instanceof FontFace) {
          resourceUrl = event.target.src || resourceUrl;
          resourceType = "font";
        }
        // 处理其他资源类型（包括script标签加载失败）
        else if (event.target.src) {
          resourceUrl = event.target.src;
          // 尝试从URL推断资源类型
          const urlParts = resourceUrl.split(".");
          const ext = urlParts[urlParts.length - 1].toLowerCase();
          resourceType = ext;

          // 特殊处理JavaScript文件
          if (ext === "js") {
            resourceType = "js";
          }
        }

        // 只有当resourceUrl有效且不是空字符串时才发送错误
        if (resourceUrl && resourceUrl !== "未知资源") {
          // 发送资源加载错误到终端
          const errorMessage = `${resourceType}资源加载失败: ${resourceUrl}\n状态码: 404 Not Found\n错误信息: ${event.message || "资源加载失败"}`;
          sendErrorToServer(errorMessage);
        }
      }
    },
    true
  ); // useCapture=true，捕获阶段处理

  // 捕获字体加载错误（FontFaceSet）
  window.addEventListener(
    "fontfaceerror",
    (event) => {
      const fontFace = event.fontface;
      const resourceUrl = fontFace.src || "未知字体资源";
      const errorMessage = `font资源加载失败: ${resourceUrl}\n状态码: 未知错误`;

      // 发送字体加载错误到终端
      sendErrorToServer(errorMessage);
    },
    true
  ); // useCapture=true，捕获阶段处理

  // 捕获FontFaceSet加载错误（针对CSS @font-face加载）
  if (typeof document !== "undefined" && document.fonts) {
    document.fonts.addEventListener("loadingerror", (event) => {
      // event.fontfaces 包含所有加载失败的字体
      for (const fontFace of event.fontfaces) {
        const resourceUrl = fontFace.src || "未知字体资源";
        const errorMessage = `font资源加载失败: ${resourceUrl}\n状态码: 加载错误`;
        sendErrorToServer(errorMessage);
      }
    });
  }
}

export { CodeSnippet, ErrorReporter, ErrorManager };
