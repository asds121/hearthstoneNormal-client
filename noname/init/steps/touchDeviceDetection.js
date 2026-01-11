import { lib } from "../../../noname.js";
import { game } from "../../game/index.js";
import { get } from "../../util/config.js";
import { _status } from "../../status/index.js";
import { userAgentLowerCase } from "../../util/index.js";

/**
 * 触屏设备检测步骤
 * - 检测设备是否支持触屏
 * - 根据设备类型设置相应的配置
 * - 处理用户确认切换到触屏模式的逻辑
 * - 处理Mac设备的特殊情况
 */
export async function touchDeviceDetection() {
  const ua = userAgentLowerCase;

  // 检测触屏设备
  if ("ontouchstart" in document) {
    if (!get("totouched")) {
      game.saveConfig("totouched", true);
      if (typeof lib.device != "undefined") {
        game.saveConfig("low_performance", true);
        game.saveConfig("confirm_exit", true);
        game.saveConfig("touchscreen", true);
        game.saveConfig("fold_mode", false);
        if (ua.indexOf("ipad") == -1) {
          game.saveConfig("phonelayout", true);
        } else if (Reflect.get(lib, "device") === "ios") {
          game.saveConfig("show_statusbar_ios", "overlay");
        }
      } else if (
        confirm(
          "是否切换到触屏模式？（触屏模式可提高触屏设备的响应速度，但无法使用鼠标）"
        )
      ) {
        game.saveConfig("touchscreen", true);
        if (ua.includes("iphone") || ua.includes("android")) {
          game.saveConfig("phonelayout", true);
        }
        game.reload();
      }
    }
  } else if (get("touchscreen")) {
    game.saveConfig("touchscreen", false);
  }

  // 处理Mac设备的特殊情况
  if (!get("toscrolled") && ua.includes("macintosh")) {
    game.saveConfig("toscrolled", true);
    game.saveConfig("mousewheel", false);
  }

  console.log("触屏设备检测完成");
}
