import { lib } from "../../../noname.js";
import { ui } from "../../ui/index.js";

/**
 * CSS加载步骤
 * - 加载menu样式
 * - 加载newmenu样式
 * - 加载default样式
 */
export async function cssLoad() {
  // 加载CSS样式
  await loadCss();
  
  console.log("CSS加载完成");
}

/**
 * 加载CSS样式
 */
async function loadCss() {
  Reflect.set(ui, "css", {
    menu: await lib.init.promises.css(lib.assetURL + "layout/default", "menu"),
    newmenu: await lib.init.promises.css(
      lib.assetURL + "layout/default",
      "newmenu"
    ),
    default: await lib.init.promises.css(
      lib.assetURL + "layout/default",
      "layout"
    ),
  });
}