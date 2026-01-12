import { lib, game, ui, get, ai, _status } from "../../../../noname.js";
import { utility } from "../utility.js";

export const configModule = {
  developerMode: {
    name: "开发者模式",
    init: lib.config.developerMode ?? false,
    intro:
      "新手勿开。开启后，左上会出现调试按钮，点击会开启/停止css样式的自动更新。减少开局动画的延迟时间，点击卡牌收藏显示卡牌代码。",
    onclick: (item) => {
      game.saveConfig(`extension_${utility.extensionName}_developerMode`, item);
      game.saveConfig("developerMode", item);
    },
  },
};
