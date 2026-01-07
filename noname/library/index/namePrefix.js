import { ai } from "../../ai/index.js";
import { get } from "../../get/index.js";
import { game } from "../../game/index.js";
import { _status } from "../../status/index.js";
import { ui } from "../../ui/index.js";

import dedent from "../../../game/dedent.js";
const html = dedent;

//todo：变成循环依赖了喵
import { lib } from "../index.js";

export default new Map([
  [
    "界",
    {
      color: "#fdd559",
      nature: "soilmm",
    },
  ],
  [
    "谋",
    {
      color: "#def7ca",
      nature: "woodmm",
    },
  ],
  [
    "武",
    {
      color: "#fd8359",
      nature: "soilmm",
    },
  ],
  [
    "乐",
    {
      color: "#f7f4fc",
      nature: "keymm",
    },
  ],
  [
    "神",
    {
      color: "#faecd1",
      nature: "orangemm",
    },
  ],
  [
    "族",
    {
      color: "#ee9ac7",
      nature: "firemm",
    },
  ],
  [
    "晋",
    {
      color: "#f3c5ff",
      nature: "blackmm",
    },
  ],
  [
    "侠",
    {
      color: "#eeeeee",
      nature: "qunmm",
    },
  ],
  [
    "起",
    {
      color: "#c3f9ff",
      nature: "thundermm",
    },
  ],
  [
    "承",
    {
      color: "#c3f9ff",
      nature: "thundermm",
    },
  ],
  [
    "转",
    {
      color: "#c3f9ff",
      nature: "thundermm",
    },
  ],
  [
    "合",
    {
      color: "#c3f9ff",
      nature: "thundermm",
    },
  ],
  [
    "衰",
    {
      color: "#c3f9ff",
      nature: "thundermm",
    },
  ],
  [
    "兴",
    {
      color: "#c3f9ff",
      nature: "thundermm",
    },
  ],
  [
    "梦",
    {
      color: "#6affe2",
      nature: "watermm",
    },
  ],
  [
    "疑",
    {
      color: "#5a6968",
      nature: "graymm",
    },
  ],
  [
    "用间",
    {
      color: "#c3f9ff",
      nature: "thundermm",
    },
  ],
  [
    "战役篇",
    {
      color: "#c3f9ff",
      nature: "thundermm",
      showName: "战",
    },
  ],
  [
    "武将传",
    {
      color: "#c3f9ff",
      nature: "thundermm",
      showName: "传",
    },
  ],
  [
    "将",
    {
      nature: "firemm",
    },
  ],
  [
    "新杀",
    {
      color: "#fefedc",
      nature: "metalmm",
      showName: "新",
    },
  ],
  [
    "旧",
    {
      color: "#a4a4a4",
      nature: "blackmm",
    },
  ],
  [
    "旧界",
    {
      color: "#a4a4a4",
      nature: "blackmm",
    },
  ],
  [
    "节钺",
    {
      color: "#a4a4a4",
      nature: "blackmm",
    },
  ],
  [
    "毅重",
    {
      color: "#a4a4a4",
      nature: "blackmm",
    },
  ],
  [
    "★SP",
    {
      /**
       * @returns {string}
       */
      getSpan: () => `${get.prefixSpan("SP")}`,
    },
  ],
  [
    "☆SP",
    {
      /**
       * @returns {string}
       */
      getSpan: () => `${get.prefixSpan("SP")}`,
    },
  ],
  [
    "J.SP",
    {
      /**
       * @returns {string}
       */
      getSpan: () => `${get.prefixSpan("SP")}`,
    },
  ],
  [
    "K系列",
    {
      showName: "Ｋ",
    },
  ],
  [
    "经典",
    {
      showName: "典",
    },
  ],
  [
    "君",
    {
      color: "#fefedc",
      nature: "shenmm",
    },
  ],
  [
    "骰子",
    {
      getSpan: () => {
        const span = document.createElement("span");
        span.style.fontFamily = "NonameSuits";
        span.textContent = "🎲";
        return span.outerHTML;
      },
    },
  ],
  [
    "蛇",
    {
      getSpan: () => {
        const span = document.createElement("span");
        span.style.fontFamily = "NonameSuits";
        span.textContent = "🐍";
        return span.outerHTML;
      },
    },
  ],
  [
    "SP",
    {
      getSpan: () => {
        const span = document.createElement("span"),
          style = span.style;
        style.writingMode = style.webkitWritingMode = "horizontal-tb";
        style.fontFamily = "MotoyaLMaru";
        style.transform = "scaleY(0.85)";
        span.textContent = "SP";
        return span.outerHTML;
      },
    },
  ],
  [
    "OL",
    {
      getSpan: () => {
        const span = document.createElement("span"),
          style = span.style;
        style.writingMode = style.webkitWritingMode = "horizontal-tb";
        style.fontFamily = "MotoyaLMaru";
        style.transform = "scaleY(0.85)";
        span.textContent = "OL";
        return span.outerHTML;
      },
    },
  ],
  [
    "RE",
    {
      getSpan: () => {
        const span = document.createElement("span"),
          style = span.style;
        style.writingMode = style.webkitWritingMode = "horizontal-tb";
        style.fontFamily = "MotoyaLMaru";
        style.transform = "scaleY(0.85)";
        span.textContent = "RE";
        return span.outerHTML;
      },
    },
  ],
  [
    "手杀",
    {
      getSpan: (prefix, name) => {
        const simple = lib.config.buttoncharacter_prefix == "simple",
          span = document.createElement("span");
        if (lib.characterPack.shiji && name in lib.characterPack.shiji) {
          for (const entry of Object.entries(lib.characterSort.shiji)) {
            if (!entry[1].includes(name)) {
              continue;
            }
            prefix = get.translation(entry[0]).slice(-1);
            break;
          }
          if (!simple) {
            span.style.color = "#def7ca";
            span.dataset.nature = "watermm";
          }
          span.innerHTML = prefix;
        } else if (simple) {
          span.textContent = "手杀";
        } else {
          span.style.fontFamily = "NonameSuits";
          span.textContent = "📱";
        }
        return span.outerHTML;
      },
    },
  ],
  [
    "TW",
    {
      getSpan: () => {
        const span = document.createElement("span"),
          style = span.style;
        style.writingMode = style.webkitWritingMode = "horizontal-tb";
        style.fontFamily = "MotoyaLMaru";
        style.transform = "scaleY(0.85)";
        span.textContent = "TW";
        return span.outerHTML;
      },
    },
  ],
  [
    "汉末",
    {
      showName: "汉",
      color: "#fefedc",
      nature: "shenmm",
    },
  ],
  [
    "汉末神",
    {
      /**
       * @returns {string}
       */
      getSpan: () => `${get.prefixSpan("汉末")}${get.prefixSpan("神")}`,
    },
  ],
  [
    "长安",
    {
      showName: "镐",
      color: "#40e0d0",
      nature: "shenmm",
    },
  ],
  [
    "长安神",
    {
      /**
       * @returns {string}
       */
      getSpan: () => `${get.prefixSpan("长安")}${get.prefixSpan("神")}`,
    },
  ],
  [
    "渭南",
    {
      showName: "渭",
      color: "#2a17d5",
      nature: "shenmm",
    },
  ],
  [
    "渭南神",
    {
      /**
       * @returns {string}
       */
      getSpan: () => `${get.prefixSpan("渭南")}${get.prefixSpan("神")}`,
    },
  ],
  [
    "TW神",
    {
      /**
       * @returns {string}
       */
      getSpan: () => `${get.prefixSpan("TW")}${get.prefixSpan("神")}`,
    },
  ],
  [
    "TW将",
    {
      /**
       * @returns {string}
       */
      getSpan: () => `${get.prefixSpan("TW")}${get.prefixSpan("将")}`,
    },
  ],
  [
    "OL神",
    {
      /**
       * @returns {string}
       */
      getSpan: () => `${get.prefixSpan("OL")}${get.prefixSpan("神")}`,
    },
  ],
  [
    "旧神",
    {
      /**
       * @returns {string}
       */
      getSpan: () => `${get.prefixSpan("旧")}${get.prefixSpan("神")}`,
    },
  ],
  [
    "旧晋",
    {
      /**
       * @returns {string}
       */
      getSpan: () => `${get.prefixSpan("旧")}${get.prefixSpan("晋")}`,
    },
  ],
  [
    "新杀SP",
    {
      /**
       * @returns {string}
       */
      getSpan: () => `${get.prefixSpan("新杀")}${get.prefixSpan("SP")}`,
    },
  ],
  [
    "界SP",
    {
      /**
       * @returns {string}
       */
      getSpan: () => `${get.prefixSpan("界")}${get.prefixSpan("SP")}`,
    },
  ],
  [
    "S特神",
    {
      /**
       * @returns {string}
       */
      getSpan: () => `${get.prefixSpan("★")}${get.prefixSpan("神")}`,
    },
  ],
  [
    "手杀界",
    {
      /**
       * @returns {string}
       */
      getSpan: () => `${get.prefixSpan("手杀")}${get.prefixSpan("界")}`,
    },
  ],
  [
    "手杀SP",
    {
      /**
       * @returns {string}
       */
      getSpan: () => `${get.prefixSpan("手杀")}${get.prefixSpan("SP")}`,
    },
  ],
  [
    "战役篇神",
    {
      /**
       * @returns {string}
       */
      getSpan: () => `${get.prefixSpan("战役篇")}${get.prefixSpan("神")}`,
    },
  ],
  [
    "星",
    {
      color: "#ffd700",
      nature: "glodenmm",
    },
  ],
  [
    "OL界",
    {
      /**
       * @returns {string}
       */
      getSpan: () => `${get.prefixSpan("OL")}${get.prefixSpan("界")}`,
    },
  ],
  [
    "OL谋",
    {
      /**
       * @returns {string}
       */
      getSpan: () => `${get.prefixSpan("OL")}${get.prefixSpan("谋")}`,
    },
  ],
  [
    "新杀谋",
    {
      /**
       * @returns {string}
       */
      getSpan: () => `${get.prefixSpan("新杀")}${get.prefixSpan("谋")}`,
    },
  ],
  [
    "经典神",
    {
      /**
       * @returns {string}
       */
      getSpan: () => `${get.prefixSpan("经典")}${get.prefixSpan("神")}`,
    },
  ],
  [
    "旧谋",
    {
      /**
       * @returns {string}
       */
      getSpan: () => `${get.prefixSpan("旧")}${get.prefixSpan("谋")}`,
    },
  ],
  [
    "手杀神",
    {
      /**
       * @returns {string}
       */
      getSpan: () => `${get.prefixSpan("手杀")}${get.prefixSpan("神")}`,
    },
  ],
  [
    "龙",
    {
      color: "#ff0000",
      nature: "firemm",
    },
  ],
  [
    "桃",
    {
      color: "#FFC0CB",
      nature: "firemm",
    },
  ],
  [
    "桃神",
    {
      /**
       * @returns {string}
       */
      getSpan: () => `${get.prefixSpan("桃")}${get.prefixSpan("神")}`,
    },
  ],
  [
    "玄",
    {
      color: "#000000",
      nature: "metalmm",
    },
  ],
  [
    "荆",
    {
      color: "#00ff00",
      nature: "firemm",
    },
  ],
  [
    "荆神",
    {
      /**
       * @returns {string}
       */
      getSpan: () => `${get.prefixSpan("荆")}${get.prefixSpan("神")}`,
    },
  ],
  [
    "魂",
    {
      color: "#ffff99",
      nature: "firemm",
    },
  ],
  [
    "韩氏",
    {
      color: "#ffff99",
      nature: "firemm",
    },
  ],
  [
    "幻",
    {
      color: "#ffff99",
      nature: "firemm",
    },
  ],
  [
    "标",
    {
      color: "#912cee",
      nature: "metalmm",
    },
  ],
  [
    "牢",
    {
      color: "#EEEE00",
      nature: "blackmm",
    },
  ],
  [
    "牢神",
    {
      /**
       * @returns {string}
       */
      getSpan: () => `${get.prefixSpan("牢")}${get.prefixSpan("神")}`,
    },
  ],
  [
    "友",
    {
      color: "#AAABFF",
      nature: "blackmm",
    },
  ],
  [
    "九鼎",
    {
      showName: "鼎",
      color: "#ffccff",
      nature: "blackmm",
    },
  ],
  [
    "SCL",
    {
      showName: "競",
      color: "#fefedc",
      nature: "soilmm",
    },
  ],
  [
    "忠",
    {
      color: "#ffd700",
      nature: "metalmm",
    },
  ],
  [
    "烈",
    {
      color: "#8B0000",
      nature: "firemm",
    },
  ],
  [
    "燕幽",
    {
      showName: "幽",
      color: "#ff6a6a",
      nature: "redmm",
    },
  ],
  [
    "威",
    {
      color: "#ff9966",
      nature: "glodenmm",
    },
  ],
  [
    "势",
    {
      color: "#7d26cd",
      nature: "purplemm",
    },
  ],
  [
    "TW谋",
    {
      /**
       * @returns {string}
       */
      getSpan: () => `${get.prefixSpan("TW")}${get.prefixSpan("谋")}`,
    },
  ],
  [
    "闪",
    {
      color: "#00bfff",
      nature: "watermm",
    },
  ],
  [
    "ddd",
    {
      showName: "3D",
      color: "#edb5b5",
      nature: "watermm",
    },
  ],
  [
    "荆扬",
    {
      showName: "扬",
      color: "#ffcc99",
      nature: "thundermm",
    },
  ],
  [
    "魔",
    {
      color: "#2e002e",
      nature: "firemm",
    },
  ],
  [
    "青史",
    {
      getSpan: () => {
        const span = document.createElement("span");
        span.style.fontFamily = "NonameSuits";
        span.textContent = "📚";
        return span.outerHTML;
      },
    },
  ],
  [
    "风云",
    {
      getSpan: () => {
        const span = document.createElement("span");
        span.style.fontFamily = "NonameSuits";
        span.textContent = "☁️";
        return span.outerHTML;
      },
    },
  ],
  [
    "忍",
    {
      color: "#180a29",
      nature: "thundermm",
    },
  ],
]);
