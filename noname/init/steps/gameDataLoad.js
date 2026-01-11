import { lib } from "../../../noname.js";
import { game } from "../../game/index.js";
import { get, set } from "../../util/config.js";
import { ui } from "../../ui/index.js";
import { get as getModule } from "../../get/index.js";

/**
 * 游戏数据加载步骤
 * - 加载样式（layout, theme, card_style, cardback_style, hp_style等）
 * - 处理phoneLayout的特殊情况
 * - 加载additional CSS文件（dialog, skill等）
 * - 初始化initSheet
 * - 设置duration
 * - 添加鼠标或触摸事件监听
 * - 等待DOM加载完成
 * - 应用加载的样式
 */
export async function gameDataLoad() {
  // 确保layout为mobile
  if (get("layout") == "default") {
    set("layout", "mobile");
  }

  const layout = get("layout");

  // 准备加载的样式
  const stylesName = [
    "layout",
    "theme",
    "card_style",
    "cardback_style",
    "hp_style",
  ];
  const stylesLoading = [
    lib.init.promises.css(
      lib.assetURL + "layout/" + layout,
      "layout",
      void 0,
      true
    ),
    lib.init.promises.css(
      lib.assetURL + "theme/" + get("theme"),
      "style",
      void 0,
      true
    ),
    lib.init.promises.css(
      lib.assetURL + "theme/style/card",
      get("card_style"),
      void 0,
      true
    ),
    lib.init.promises.css(
      lib.assetURL + "theme/style/cardback",
      get("cardback_style"),
      void 0,
      true
    ),
    lib.init.promises.css(
      lib.assetURL + "theme/style/hp",
      get("hp_style"),
      void 0,
      true
    ),
  ];

  // 处理phoneLayout的特殊情况
  if (getModule.is.phoneLayout()) {
    stylesName.push("phone");
    stylesLoading.push(
      lib.init.promises.css(lib.assetURL + "layout/default", "phone")
    );
  } else {
    Reflect.get(ui, "css").phone = lib.init.css();
  }

  // 加载additional CSS文件
  ui.css._others = lib.init.css(lib.assetURL + "layout/" + "others", "dialog");
  ui.css._skill = lib.init.css(lib.assetURL + "layout/" + "others", "skill");

  // 初始化initSheet
  initSheet(Reflect.get(lib, "config"));

  // 设置duration
  set("duration", 500);

  // 添加事件监听
  if (!get("touchscreen")) {
    document.addEventListener("mousewheel", ui.click.windowmousewheel, {
      passive: true,
    });
    document.addEventListener("mousemove", ui.click.windowmousemove);
    document.addEventListener("mousedown", ui.click.windowmousedown);
    document.addEventListener("mouseup", ui.click.windowmouseup);
    document.addEventListener("contextmenu", ui.click.right);
  } else {
    document.addEventListener("touchstart", ui.click.touchconfirm);
    document.addEventListener("touchstart", ui.click.windowtouchstart);
    document.addEventListener("touchend", ui.click.windowtouchend);
    document.addEventListener("touchmove", ui.click.windowtouchmove);
  }

  // 等待DOM加载完成
  const waitDomLoad = new Promise((resolve) => {
    if (document.readyState !== "complete") {
      window.onload = resolve;
    } else {
      resolve(void 0);
    }
  });
  await waitDomLoad;

  // 应用加载的样式
  const stylesLoaded = await Promise.all(stylesLoading);
  const stylesLength = Math.min(stylesName.length, stylesLoaded.length);
  for (let i = 0; i < stylesLength; ++i) {
    Reflect.get(ui, "css")[stylesName[i]] = stylesLoaded[i];
  }

  console.log("游戏数据加载完成");
}

/**
 * 初始化样式表
 */
function initSheet(libConfig) {
  if (
    libConfig.player_style &&
    libConfig.player_style != "default" &&
    libConfig.player_style != "custom"
  ) {
    var str = "";
    switch (libConfig.player_style) {
      case "wood":
        str = 'url("' + lib.assetURL + 'theme/woodden/wood.jpg")';
        break;
      case "music":
        str = "linear-gradient(#4b4b4b, #464646)";
        break;
      case "simple":
        str = "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4))";
        break;
    }
    Reflect.get(ui, "css").player_stylesheet = lib.init.sheet(
      "#window .player{background-image:" + str + "}"
    );
  }
  if (
    libConfig.border_style &&
    libConfig.border_style != "default" &&
    libConfig.border_style != "custom" &&
    libConfig.border_style != "auto"
  ) {
    Reflect.get(ui, "css").border_stylesheet = lib.init.sheet();
    var bstyle = libConfig.border_style;
    if (bstyle.startsWith("dragon_")) {
      bstyle = bstyle.slice(7);
    }
    Reflect.get(ui, "css").border_stylesheet.sheet.insertRule(
      '#window .player>.framebg,#window #arena.long.mobile:not(.fewplayer) .player[data-position="0"]>.framebg{display:block;background-image:url("' +
        lib.assetURL +
        "theme/style/player/" +
        bstyle +
        '1.png")}',
      0
    );
    Reflect.get(ui, "css").border_stylesheet.sheet.insertRule(
      '#window #arena.long:not(.fewplayer) .player>.framebg, #arena.oldlayout .player>.framebg{background-image:url("' +
        lib.assetURL +
        "theme/style/player/" +
        bstyle +
        '3.png")}',
      0
    );
    Reflect.get(ui, "css").border_stylesheet.sheet.insertRule(
      ".player>.count{z-index: 3 !important;border-radius: 2px !important;text-align: center !important;}",
      0
    );
  }
  game.zsOriginLineXy = game.linexy;
  if (libConfig.zhishixian && libConfig.zhishixian != "default") {
    var layout = libConfig.zhishixian;
    game.saveConfig("zhishixian", layout);
    if (layout == "default") {
      game.linexy = game.zsOriginLineXy;
    } else {
      game.linexy = game["zs" + layout + "LineXy"];
    }
  }
  if (
    libConfig.control_style &&
    libConfig.control_style != "default" &&
    libConfig.control_style != "custom"
  ) {
    var str = "";
    switch (libConfig.control_style) {
      case "wood":
        str = 'url("' + lib.assetURL + 'theme/woodden/wood.jpg")';
        break;
      case "music":
        str =
          "linear-gradient(#4b4b4b, #464646);color:white;text-shadow:black 0 0 2px";
        break;
      case "simple":
        str =
          "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4));color:white;text-shadow:black 0 0 2px";
        break;
    }
    if (libConfig.control_style == "wood") {
      Reflect.get(ui, "css").control_stylesheet = lib.init.sheet(
        "#window .control,#window .menubutton,#window #system>div>div,#window #system>div>.pressdown2{background-image:" +
          str +
          "}"
      );
    } else {
      Reflect.get(ui, "css").control_stylesheet = lib.init.sheet(
        "#window .control,.menubutton:not(.active):not(.highlight):not(.red):not(.blue),#window #system>div>div{background-image:" +
          str +
          "}"
      );
    }
  }
  if (
    libConfig.menu_style &&
    libConfig.menu_style != "default" &&
    libConfig.menu_style != "custom"
  ) {
    var str = "";
    switch (libConfig.menu_style) {
      case "wood":
        str = 'url("' + lib.assetURL + 'theme/woodden/wood2.png")';
        break;
      case "music":
        str =
          "linear-gradient(#4b4b4b, #464646);color:white;text-shadow:black 0 0 2px";
        break;
      case "simple":
        str =
          "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4));color:white;text-shadow:black 0 0 2px";
        break;
    }
    Reflect.get(ui, "css").menu_stylesheet = lib.init.sheet(
      "html #window>.dialog.popped,html .menu,html .menubg{background-image:" +
        str +
        "}"
    );
  }
}
