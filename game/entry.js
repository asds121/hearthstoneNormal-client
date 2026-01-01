import { game, get, lib, boot, onload } from "../noname.js";

// 直接导入炉石普通扩展的核心模块
import { Application as HSApplication } from "../extension/炉石普通/experiment/application.js";

let [core, version] = get.coreInfo();

/**
 * @type {Promise<unknown>}
 */
let waitUpdate = Promise.resolve();
if (core === "chrome" && !isNaN(version) && version < 91) {
  /*
	const tip = "检测到您的浏览器内核版本小于91，请及时升级浏览器或手机webview内核！";
	console.warn(tip);
	game.print(tip);
	const redirect_tip = `您使用的浏览器或无名杀客户端内核版本过低，将在未来的版本被废弃！\n目前使用的浏览器UA信息为：\n${userAgent}\n点击“确认”以前往GitHub下载最新版无名杀客户端（可能需要科学上网）。`;
	if (confirm(redirect_tip)) {
		window.open("https://github.com/libnoname/noname/releases/tag/chromium91-client");
	}
	*/
  waitUpdate = game.tryUpdateClient(/** UpdateReason.UNDERSUPPORT **/ 4);
}

// 初始化炉石普通扩展
window.hsApplication = HSApplication;

waitUpdate.then(boot).then(onload);
