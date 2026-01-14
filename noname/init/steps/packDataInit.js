import { lib, _status } from "../../../noname.js";
import { get, set } from "../../util/config.js";
import { ui } from "../../ui/index.js";
import AssetManager from "../../library/AssetManager.js";

/**
 * Pack数据初始化步骤
 * - 处理pack.mode（游戏模式）
 * - 处理pack.background（背景图片）
 * - 处理pack.music（背景音乐）
 * - 处理pack.theme（主题）
 * - 处理pack.font（字体）
 */
export async function packDataInit() {
  // 从AssetManager获取当前扩展的配置，从中提取noname_package数据
  var pack = null;
  try {
    const currentExtension = AssetManager.getCurrentExtension();
    if (currentExtension) {
      const config = AssetManager.getConfig(currentExtension);
      if (config && config.noname_package) {
        pack = config.noname_package;
      }
    }
  } catch (error) {
    console.error("获取pack数据失败:", error);
  }

  if (!pack) {
    console.log("没有pack数据需要处理");
    return;
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

  // 处理字体
  if (pack.font) {
    Reflect.get(ui, "css").fontsheet = lib.init.sheet();
    const appearenceConfig = lib.configMenu.appearence.config,
      fontSheet = Reflect.get(ui, "css").fontsheet.sheet,
      suitsFont = get("suits_font");
    // 扩展已经在 extensionLoad 步骤中加载，这里只需要设置当前扩展
    const extensionName = "三国杀标准";

    try {
      // 设置当前扩展
      AssetManager.setExtension(extensionName);
    } catch (error) {
      console.error(`Failed to set extension ${extensionName}:`, error);
      // 如果设置失败，尝试加载扩展
      try {
        await AssetManager.load(extensionName);
        AssetManager.setExtension(extensionName);
      } catch (retryError) {
        console.error(
          `Failed to load extension ${extensionName} on retry:`,
          retryError
        );
      }
    }

    Object.keys(pack.font).forEach((value) => {
      const font = pack.font[value];
      appearenceConfig.name_font.item[value] = font;
      appearenceConfig.identity_font.item[value] = font;
      appearenceConfig.cardtext_font.item[value] = font;
      appearenceConfig.global_font.item[value] = font;

      try {
        const fontPath = AssetManager.getPath("font", value, ".woff2");
        fontSheet.insertRule(
          `@font-face {font-family: '${value}'; src: local('${font}'), url('${fontPath}');}`,
          0
        );
      } catch (e) {
        console.error(`Failed to get font path for ${value}:`, e);
      }

      if (suitsFont) {
        try {
          const suitsFontPath = AssetManager.getPath("font", "suits", ".woff2");
          fontSheet.insertRule(
            `@font-face {font-family: '${value}'; src: local('${font}'), url('${suitsFontPath}');}`,
            0
          );
        } catch (e) {
          console.error(`Failed to get suits font path:`, e);
        }
      }
    });

    if (suitsFont) {
      try {
        const suitsFontPath = AssetManager.getPath("font", "suits", ".woff2");
        fontSheet.insertRule(
          `@font-face {font-family: 'Suits'; src: url('${suitsFontPath}');}`,
          0
        );
      } catch (e) {
        console.error(`Failed to get Suits font path:`, e);
      }
    }

    try {
      const suitsFontPath = AssetManager.getPath("font", "suits", ".woff2");
      fontSheet.insertRule(
        `@font-face {font-family: 'NonameSuits'; src: url('${suitsFontPath}');}`,
        0
      );
    } catch (e) {
      console.error(`Failed to get NonameSuits font path:`, e);
    }

    try {
      const motoyamaruFontPath = AssetManager.getPath(
        "font",
        "motoyamaru",
        ".woff2"
      );
      fontSheet.insertRule(
        `@font-face {font-family: 'MotoyaLMaru'; src: url('${motoyamaruFontPath}');}`,
        0
      );
    } catch (e) {
      console.error(`Failed to get MotoyaLMaru font path:`, e);
    }
    appearenceConfig.cardtext_font.item.default = "默认";
    appearenceConfig.global_font.item.default = "默认";
  }

  console.log("Pack数据初始化完成");
}
