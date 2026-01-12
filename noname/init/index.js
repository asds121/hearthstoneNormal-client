import { lib } from "../library/index.js";
import { _status } from "../status/index.js";
import { initManager } from "./InitManager.js";

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
