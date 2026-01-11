import { lib } from "../library/index.js";
import { _status } from "../status/index.js";
import { initManager } from "./InitManager.js";
import {
  nonameInitialized,
  leaveCompatibleEnvironment,
} from "../util/index.js";

// 辅助函数：检查是否已经是http协议
function isHttpProtocol() {
  return location.protocol.startsWith("http");
}

// 辅助函数：检查是否是手机端(Cordova平台)
function isCordovaPlatform() {
  return typeof window.cordova === "object" && window.cordova !== null;
}

// 辅助函数：检查是否是诗笺App
function isShijianApp() {
  return (
    nonameInitialized &&
    nonameInitialized.endsWith("com.noname.shijian/") &&
    window.noname_shijianInterfaces &&
    typeof window.noname_shijianInterfaces.sendUpdate === "function" &&
    typeof window.noname_shijianInterfaces.getApkVersion === "function"
  );
}

// 辅助函数：检查是否是由理版App
function isYouliApp() {
  return (
    window.NonameAndroidBridge &&
    typeof window.NonameAndroidBridge.sendUpdate === "function"
  );
}

// 辅助函数：检查是否是Electron平台
function isElectronPlatform() {
  return (
    typeof window.require === "function" && typeof window.process === "object"
  );
}

// 辅助函数：检查是否是诗笺电脑版
function isShijianDesktop() {
  try {
    const fs = require("fs");
    const path = require("path");
    if (fs.existsSync(path.join(__dirname, "package.json"))) {
      const json = require("./package.json");
      return json && Number(json.installerVersion) >= 1.7;
    }
    return false;
  } catch (e) {
    return false;
  }
}

// 判断是否从file协议切换到http/s协议
export function canUseHttpProtocol() {
  // 如果是http了就不用
  if (isHttpProtocol()) {
    return false;
  }

  // 已移除新手教程，此检查不再需要
  // if (isFirstStartup()) {
  //   return false;
  // }

  if (typeof nonameInitialized === "string") {
    // 手机端
    if (isCordovaPlatform()) {
      // 诗笺App判断
      if (isShijianApp()) {
        // @ts-expect-error - 类型系统未来可期 - 第三方接口类型
        return window.noname_shijianInterfaces.getApkVersion() >= 16000;
      }

      // 由理版App判断
      if (isYouliApp()) {
        return true;
      }
    }
    // 电脑端
    else if (isElectronPlatform()) {
      // 诗笺电脑版判断
      return isShijianDesktop();
    }
    // 浏览器端
    else {
      return isHttpProtocol();
    }
  }

  return false;
}

/**
 * 传递升级完成的信息
 * @returns { string | void } 返回一个网址
 */
export function sendUpdate() {
  // 手机端
  if (window.cordova) {
    // 直接确定包名
    // @ts-expect-error ignore
    if (
      nonameInitialized &&
      nonameInitialized.includes("com.noname.shijian") &&
      window.noname_shijianInterfaces &&
      typeof window.noname_shijianInterfaces.sendUpdate === "function"
    ) {
      // 给诗笺版apk的java层传递升级完成的信息
      // @ts-expect-error ignore
      const url = new URL(window.noname_shijianInterfaces.sendUpdate());
      url.searchParams.set("sendUpdate", "true");
      return url.toString();
    }
    // 由理版判断
    // @ts-expect-error ignore
    if (
      window.NonameAndroidBridge &&
      typeof window.NonameAndroidBridge.sendUpdate === "function"
    ) {
      // 给由理版apk的java层传递升级完成的信息
      // @ts-expect-error ignore
      const url = new URL(window.NonameAndroidBridge.sendUpdate());
      url.searchParams.set("sendUpdate", "true");
      return url.toString();
    }
  }
  // 电脑端
  else if (
    typeof window.require == "function" &&
    typeof window.process == "object"
  ) {
    // 从json判断版本号
    const fs = require("fs");
    const path = require("path");
    if (fs.existsSync(path.join(__dirname, "package.json"))) {
      // @ts-expect-error ignore
      const json = require("./package.json");
      // 诗笺电脑版的判断
      if (json && Number(json.installerVersion) >= 1.7) {
        fs.writeFileSync(path.join(__dirname, "Home", "saveProtocol.txt"), "");
        // 启动http
        const cp = require("child_process");
        cp.exec(
          `start /min ${__dirname}\\noname-server.exe -platform=electron`,
          (err, stdout, stderr) => {}
        );
        return `http://localhost:8089/app.html?sendUpdate=true`;
      }
    }
  }
  // 浏览器端
  else {
    return location.href;
  }
}

// 无名杀，启动！
export async function boot() {
  // 设定游戏加载时间，超过时间未加载就提醒
  const configLoadTime = localStorage.getItem(lib.configprefix + "loadtime");
  // 现在不暴露到全局变量里了，直接传给onload
  const resetGameTimeout = setTimeout(
    lib.init.reset,
    configLoadTime ? parseInt(configLoadTime) : 10000
  );

  if (typeof window.cordovaLoadTimeout != "undefined") {
    clearTimeout(window.cordovaLoadTimeout);
    delete window.cordovaLoadTimeout;
  }

  // 加载并注册所有初始化步骤
  await initManager.loadInitSteps();

  // 执行初始化
  await initManager.init();

  Reflect.set(window, "resetGameTimeout", resetGameTimeout);
}

export { onload } from "./onload.js";
