import { lib } from "../../../noname.js";
import { get, set } from "../../util/config.js";
import { ui } from "../../ui/index.js";

/**
 * Pack数据初始化步骤
 * - 处理pack.mode（游戏模式）
 * - 处理pack.background（背景图片）
 * - 处理pack.music（背景音乐）
 * - 处理pack.theme（主题）
 * - 处理pack.font（字体）
 * - 处理extension_sources
 */
export async function packDataInit() {
  var pack = Reflect.get(window, "noname_package");
  Reflect.deleteProperty(window, "noname_package");

  if (!pack) {
    console.log("没有pack数据需要处理");
    return;
  }

  // 处理游戏模式
  if (pack.mode) {
    if (!get("gameRecord")) {
      set("gameRecord", {});
    }
    for (const name in pack.mode) {
      if (get("hiddenModePack").indexOf(name) == -1) {
        get("all").mode.push(name);
        lib.translate[name] = pack.mode[name];
        if (!get("gameRecord")[name]) {
          get("gameRecord")[name] = { data: {} };
        }
      }
    }
    if (get("all").mode.length == 0) {
      get("all").mode.push("identity");
      lib.translate.identity = "身份";
      if (!get("gameRecord").identity) {
        get("gameRecord").identity = { data: {} };
      }
    }
  }

  // 处理背景图片
  if (pack.background) {
    for (const name in pack.background) {
      if (get("hiddenBackgroundPack").includes(name)) {
        continue;
      }
      lib.configMenu.appearence.config.image_background.item[name] =
        pack.background[name];
    }
    for (let i = 0; i < get("customBackgroundPack").length; i++) {
      var link = get("customBackgroundPack")[i];
      lib.configMenu.appearence.config.image_background.item[link] = link.slice(
        link.indexOf("_") + 1
      );
    }
    lib.configMenu.appearence.config.image_background.item.default = "默认";
  }

  // 处理背景音乐
  if (pack.music) {
    if (
      typeof lib.device != "undefined" ||
      typeof window.require === "function"
    ) {
      lib.configMenu.audio.config.background_music.item.music_custom =
        "自定义音乐";
    }
    get("all").background_music = ["music_default"];
    for (const name in pack.music) {
      get("all").background_music.push(name);
      lib.configMenu.audio.config.background_music.item[name] =
        pack.music[name];
    }
    if (get("customBackgroundMusic")) {
      for (const name in get("customBackgroundMusic")) {
        get("all").background_music.push(name);
        lib.configMenu.audio.config.background_music.item[name] = get(
          "customBackgroundMusic"
        )[name];
      }
    }
    lib.configMenu.audio.config.background_music.item.music_random = "随机播放";
    lib.configMenu.audio.config.background_music.item.music_off = "关闭";
  }

  // 处理主题
  if (pack.theme) {
    for (const name in pack.theme) {
      lib.configMenu.appearence.config.theme.item[name] = pack.theme[name];
    }
  }

  // 处理扩展源
  if (get("extension_sources")) {
    for (const name in get("extension_sources")) {
      lib.configMenu.general.config.extension_source.item[name] = name;
    }
  }

  // 处理字体
  if (pack.font) {
    Reflect.get(ui, "css").fontsheet = lib.init.sheet();
    const appearenceConfig = lib.configMenu.appearence.config,
      fontSheet = Reflect.get(ui, "css").fontsheet.sheet,
      suitsFont = get("suits_font");
    Object.keys(pack.font).forEach((value) => {
      const font = pack.font[value];
      appearenceConfig.name_font.item[value] = font;
      appearenceConfig.identity_font.item[value] = font;
      appearenceConfig.cardtext_font.item[value] = font;
      appearenceConfig.global_font.item[value] = font;
      fontSheet.insertRule(
        `@font-face {font-family: '${value}'; src: local('${font}'), url('${lib.assetURL}font/${value}.woff2');}`,
        0
      );
      if (suitsFont) {
        fontSheet.insertRule(
          `@font-face {font-family: '${value}'; src: local('${font}'), url('${lib.assetURL}font/suits.woff2');}`,
          0
        );
      }
    });
    if (suitsFont) {
      fontSheet.insertRule(
        `@font-face {font-family: 'Suits'; src: url('${lib.assetURL}font/suits.woff2');}`,
        0
      );
    }
    fontSheet.insertRule(
      `@font-face {font-family: 'NonameSuits'; src: url('${lib.assetURL}font/suits.woff2');}`,
      0
    );
    fontSheet.insertRule(
      `@font-face {font-family: 'MotoyaLMaru'; src: url('${lib.assetURL}font/motoyamaru.woff2');}`,
      0
    );
    appearenceConfig.cardtext_font.item.default = "默认";
    appearenceConfig.global_font.item.default = "默认";
  }

  console.log("Pack数据初始化完成");
}
