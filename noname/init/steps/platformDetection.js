import { lib } from "../../../noname.js";
import { device } from "../../util/index.js";
import { get } from "../../util/config.js";
import { game } from "../../game/index.js";
import { _status } from "../../status/index.js";

/**
 * 平台检测步骤
 * - 设置服务器索引
 * - 设置背景
 * - 确认手机端平台
 * - 平台特定初始化
 */
export async function platformDetection() {
  // 设置服务器索引
  setServerIndex();

  // 设置背景
  setBackground();

  // 确认手机端平台
  Reflect.set(lib, "device", device);

  // 在dom加载完后执行相应的操作
  const waitDomLoad = new Promise((resolve) => {
    if (document.readyState !== "complete") {
      window.onload = resolve;
    } else {
      resolve(void 0);
    }
  });

  // Electron平台
  if (typeof window.require === "function") {
    const { nodeReady } = await import("../node.js");
    nodeReady();
  } else {
    Reflect.set(lib, "path", (await import("../../library/path.js")).default);
    if (typeof lib.device != "undefined") {
      const script = document.createElement("script");
      script.src = "cordova.js";
      document.body.appendChild(script);
      await new Promise((resolve) => {
        document.addEventListener("deviceready", async () => {
          const { cordovaReady } = await import("../cordova.js");
          await cordovaReady();
          resolve(void 0);
        });
      });
    } else {
      //为其他自定义平台提供文件读写函数赋值的一种方式。
      //但这种方式只允许修改game的文件读写函数。
      if (typeof window.initReadWriteFunction == "function") {
        const g = {};
        const ReadWriteFunctionName = [
          "download",
          "checkFile",
          "checkDir",
          "readFile",
          "readFileAsText",
          "writeFile",
          "removeFile",
          "getFileList",
          "ensureDirectory",
          "createDir",
          "removeDir",
        ];
        ReadWriteFunctionName.forEach((prop) => {
          Object.defineProperty(g, prop, {
            configurable: true,
            get() {
              return undefined;
            },
            set(newValue) {
              if (typeof newValue == "function") {
                delete g[prop];
                g[prop] = game[prop] = newValue;
              }
            },
          });
        });
        // @ts-expect-error ignore
        await window.initReadWriteFunction(g).catch((e) => {
          console.error("文件读写函数初始化失败:", e);
        });
        delete window.initReadWriteFunction; // 后续用不到了喵
      }
      window.onbeforeunload = function () {
        if (get("confirm_exit") && !_status.reloading) {
          return "是否离开游戏？";
        } else {
          return null;
        }
      };
    }
  }

  console.log("平台检测完成");
}

/**
 * 设置服务器索引
 */
function setServerIndex() {
  const index = window.location.href.indexOf("index.html?server=");
  if (index !== -1) {
    Reflect.set(
      window,
      "isNonameServer",
      window.location.href.slice(index + 18)
    );
    Reflect.set(window, "nodb", true);
  } else {
    const savedIndex = localStorage.getItem(lib.configprefix + "asserver");
    if (savedIndex) {
      Reflect.set(window, "isNonameServer", savedIndex);
      Reflect.set(window, "isNonameServerIp", lib.hallURL);
    }
  }
}

/**
 * 设置背景
 */
function setBackground() {
  let htmlbg = localStorage.getItem(lib.configprefix + "background");
  if (htmlbg) {
    if (htmlbg[0] == "[") {
      try {
        htmlbg = JSON.parse(htmlbg);
        if (!htmlbg) {
          throw new Error();
        }
        const get = lib.get;
        htmlbg = htmlbg[get.rand(htmlbg.length)];
        if (htmlbg.startsWith("custom_")) {
          throw "err";
        }
        _status.htmlbg = htmlbg;
      } catch (e) {
        htmlbg = null;
      }
    }
    if (htmlbg) {
      document.documentElement.style.backgroundImage =
        'url("' + lib.assetURL + "image/background/" + htmlbg + '.jpg")';
      document.documentElement.style.backgroundSize = "cover";
      document.documentElement.style.backgroundPosition = "50% 50%";
    }
  }
}
