import { lib, game } from "../../../noname.js";
import { ui } from "../../ui/index.js";
import { get as get$1 } from "../../get/index.js";
import { get } from "../../util/config.js";

/**
 * CSS加载步骤
 * - 加载menu样式
 * - 加载newmenu样式
 * - 加载default样式
 * - 初始化ui.css.styles
 */
export async function cssLoad() {
  // 初始化ui.css对象
  if (!ui.css) {
    ui.css = {};
  }
  
  // 加载CSS样式
  await loadCss();

  console.log("CSS加载完成");
}

/**
 * 加载CSS样式
 */
async function loadCss() {
  // 加载基础样式
  const menuCss = await lib.init.promises.css(lib.assetURL + "layout/default", "menu");
  const newmenuCss = await lib.init.promises.css(lib.assetURL + "layout/default", "newmenu");
  const defaultCss = await lib.init.promises.css(lib.assetURL + "layout/default", "layout");
  
  // 初始化ui.css对象
  Reflect.set(ui, "css", {
    menu: menuCss,
    newmenu: newmenuCss,
    default: defaultCss,
    _others: await lib.init.promises.css(lib.assetURL + "layout/others", "dialog", void 0, true),
    _skill: await lib.init.promises.css(lib.assetURL + "layout/others", "skill", void 0, true),
    // 初始化styles属性，避免后续访问时出现undefined错误
    styles: lib.init.sheet()
  });
}
