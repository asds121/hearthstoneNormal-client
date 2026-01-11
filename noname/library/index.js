import {
  nonameInitialized,
  assetURL,
  userAgentLowerCase,
  GeneratorFunction,
  AsyncFunction,
  characterDefaultPicturePath,
} from "../util/index.js";
import { ai } from "../ai/index.js";
import { get } from "../get/index.js";
import { game } from "../game/index.js";
import { _status } from "../status/index.js";
import { ui } from "../ui/index.js";
import { gnc } from "../gnc/index.js";
import { LibInit } from "./init/index.js";
import { Announce } from "./announce/index.js";
import { Channel } from "./channel/index.js";
import { experimental } from "./experimental/index.js";
import * as Element from "./element/index.js";
//todo：我拆分的
import configMenu from "./index/configMenu.js";
import skill from "./index/skill.js";
import cheat from "./index/skill.js";
import filter from "./index/filter.js";
import message from "./index/message.js";
import namePrefix from "./index/namePrefix.js";
import sort from "./index/sort.js";

import { defaultHooks } from "./hooks/index.js";
import { freezeButExtensible } from "../util/index.js";
import security from "../util/security.js";
import { ErrorManager } from "../util/error.js";
import { Concurrent } from "./concurrent/index.js";
import {
  CONFIG_PREFIX,
  VERSION_OL,
  LAYOUT_FIXED,
  PINYIN_METADATA,
  ACTUAL_CARD_NAME,
  RESPOND_MAP,
  EMOTION_LIST,
  TRANSLATE_MAP,
  PACK_SORT,
  CHARACTER_GUOZHAN_FILTER,
  SUIT,
  SUITS,
  COLOR_GROUP,
  GROUP,
  LINKED,
  SELECT_GROUP,
  GROUP_NATURE,
  LINE_COLOR,
  PHASE_NAME,
  QUICK_VOICE,
  INIT_FILTER,
} from "./constant.js";

import { defaultSplashs } from "../init/onload/index.js";
import dedent from "../../game/dedent.js";

const html = dedent;

export class Library {
  configprefix = CONFIG_PREFIX;
  versionOL = VERSION_OL;

  hallURL = "";
  assetURL = assetURL;
  userAgent = userAgentLowerCase;
  characterDefaultPicturePath = characterDefaultPicturePath;
  compatibleEdition = Boolean(
    typeof nonameInitialized == "string" &&
      nonameInitialized.match(/\/(?:com\.widget|yuri\.nakamura)\.noname\//)
  );
  changeLog = [];
  updates = [];
  canvasUpdates = [];
  /**
   * @type { Video[] }
   */
  video = [];
  skilllist = [];
  connectBanned = [];
  characterIntro = {};
  characterTitle = {};
  characterPack = new Proxy(
    {},
    {
      get(target, prop, receiver) {
        if (typeof prop == "string" && prop.startsWith("mode_extension_")) {
          prop = prop.slice("mode_extension_".length);
        }
        return Reflect.get(target, prop, receiver);
      },
      set(target, prop, newValue) {
        if (typeof prop == "string") {
          // 新增武将包，且不是“收藏”和“禁用”
          if (
            !["mode_favourite", "mode_banned"].includes(prop) &&
            !Reflect.has(target, prop)
          ) {
            Promise.resolve().then(() => {
              ui.updateCharacterPackMenu.forEach((fun) => fun(prop));
            });
          }

          if (prop.startsWith("mode_extension_")) {
            prop = prop.slice("mode_extension_".length);
          }
        }
        const newPack = new Proxy(
          {},
          {
            set(target, prop, newValue) {
              return Reflect.set(
                target,
                prop,
                get.convertedCharacter(newValue)
              );
            },
          }
        );
        Object.assign(newPack, newValue);
        return Reflect.set(target, prop, newPack);
      },
      defineProperty(target, prop, descriptor) {
        if (typeof prop == "string" && prop.startsWith("mode_extension_")) {
          prop = prop.slice("mode_extension_".length);
        }
        return Reflect.defineProperty(target, prop, descriptor);
      },
    }
  );
  characterFilter = {};
  characterSort = new Proxy(
    {},
    {
      get(target, prop, receiver) {
        if (typeof prop == "string" && prop.startsWith("mode_extension_")) {
          prop = prop.slice("mode_extension_".length);
        }
        return Reflect.get(target, prop, receiver);
      },
      set(target, prop, value, receiver) {
        if (typeof prop == "string" && prop.startsWith("mode_extension_")) {
          prop = prop.slice("mode_extension_".length);
        }
        return Reflect.set(target, prop, value, receiver);
      },
      defineProperty(target, prop, descriptor) {
        if (typeof prop == "string" && prop.startsWith("mode_extension_")) {
          prop = prop.slice("mode_extension_".length);
        }
        return Reflect.defineProperty(target, prop, descriptor);
      },
    }
  );
  characterReplace = {};
  characterSubstitute = {};
  characterAppend = {};
  characterInitFilter = {};
  characterGuozhanFilter = CHARACTER_GUOZHAN_FILTER;
  dynamicTranslate = {};
  cardPack = new Proxy(
    {},
    {
      get(target, prop, receiver) {
        if (typeof prop == "string" && prop.startsWith("mode_extension_")) {
          prop = prop.slice("mode_extension_".length);
        }
        return Reflect.get(target, prop, receiver);
      },
      set(target, prop, newValue) {
        if (typeof prop == "string") {
          if (!Reflect.has(target, prop)) {
            Promise.resolve().then(() => {
              ui.updateCardPackMenu.forEach((fun) => fun(prop));
            });
          }
        }
        if (prop.startsWith("mode_extension_")) {
          prop = prop.slice("mode_extension_".length);
        }
        return Reflect.set(target, prop, newValue);
      },
      defineProperty(target, prop, descriptor) {
        if (typeof prop == "string" && prop.startsWith("mode_extension_")) {
          prop = prop.slice("mode_extension_".length);
        }
        return Reflect.defineProperty(target, prop, descriptor);
      },
    }
  );
  cardPackInfo = {};
  /**
   * @type { SMap<number> }
   */
  skin = {};
  onresize = [];
  onphase = [];
  onwash = [];
  onround = [
    function roundSkillCheck(event) {
      return !event.skill;
    },
  ];
  onover = [];
  ondb = [];
  ondb2 = [];
  chatHistory = [];
  emotionList = EMOTION_LIST;
  animate = {
    skill: {},
    card: {},
  };
  onload = [];
  onload2 = [];
  onprepare = [];
  /**
   * @type { Function[] | undefined }
   */
  arenaReady = [
    //预处理技能拥有者
    function () {
      _status.skillOwner = {};
      //武将包排序
      let packSort = [...PACK_SORT];
      packSort = packSort.reverse();
      const packs = Object.keys(lib.characterPack).sort((a, b) => {
        return packSort.indexOf(b) - packSort.indexOf(a);
      });
      const map = new Map();
      for (let i of packs) {
        for (let j in lib.characterPack[i]) {
          const info = get.character(j);
          if (!info || info[4]?.includes("unseen")) {
            continue;
          }
          if (info[3]?.length > 0) {
            let skills = info[3].slice(0);
            for (const skill of skills) {
              const skillInfo = lib.skill[skill];
              if (!skillInfo) {
                continue;
              }
              if (!_status.skillOwner[skill]) {
                _status.skillOwner[skill] = j;
              }
              if (skillInfo.derivation) {
                const der = skillInfo.derivation.slice(0);
                for (const skillx of Array.isArray(der) ? der : [der]) {
                  if (!_status.skillOwner[skillx]) {
                    if (!map.has(skillx)) {
                      map.set(skillx, []);
                    }
                    map.get(skillx).add(j);
                  }
                }
              }
            }
          }
        }
      }
      for (const skill of map.keys()) {
        if (!_status.skillOwner[skill]) {
          _status.skillOwner[skill] = map.get(skill)[0];
        }
      }
    },
  ];
  onfree = [];
  inpile = [];
  inpile_nature = [];
  extensions = [];
  extensionPack = {};

  /**
   * @type { IOnloadSplash[] }
   */
  onloadSplashes = [...defaultSplashs];

  cardType = {};
  hook = { globalskill: {} };
  /**
   *  @type { Player | undefined }
   */
  tempSortSeat;
  /**
   * @type { 'android' | 'ios' | undefined }
   */
  device;
  /**
   * @type { string }
   */
  version;
  /**
   * @type { Videos[] }
   */
  videos;
  /**
   * @type { {
   * 	fs: typeof import("fs"),
   *  path: typeof import("path"),
   *  debug: () => void,
   *  clients: Element.Client[],
   *  banned:[],
   *  observing:[],
   *  torespond:{},
   *  torespondtimeout:{},
   *  waitForResult: Record<number | string, ((result: any) => void)[]>,
   * } }
   */
  node;
  // 谁写的值类型是string，这也太离谱了喵
  /**
   * @type { { [key: string]: Player } }
   */
  playerOL;
  /**
   * @type { IDBRequest<IDBDatabase> }
   */
  db;
  //函数钩子
  /**
   * 你可以往这里加入{钩子名:函数数组}，并在数组里增加你的自定义函数
   *
   * 这样当某个地方调用game.callHook(钩子名,[...函数参数])时，就会按顺序将对应数组中的每个函数运行一遍（传参为callHook的第二个参数）。
   *
   * 你可以将hook机制类比为event.trigger()，但是这里只能放同步代码
   */
  hooks = freezeButExtensible({ ...defaultHooks });

  /**
   * **无名杀频道推送机制**
   *
   * 鉴于`Javascript`的特性及自身对所需功能的思考，这是一个参考`Golang`的`channel`设计的、完全和`go channel`不一样的异步消息传递对象
   *
   * 当且仅当接收方和发送方均存在时进行消息传递，完全保证信息传递的单一性（发送方/接收方一旦确定则无法更改）和准确性（发送方必然将消息发送给接收方）
   *
   * 若存在发送方/接收方时调用`send`/`receive`，将报错
   *
   * 若需要异步/不报错发送信息，请等待`lib.actor`
   *
   * @example
   * // 创建一个频道
   * const channel = new lib.channel();
   *
   * // 从某个角落接收channel发出的消息，若无消息则等待
   * const message = await channel.receive();
   *
   * // 从某个角落向channel发消息，若无消息接收则等待
   * await channel.send(item);
   */
  channel = Channel;

  /**
   * **无名杀消息推送库**
   *
   * 通过`EventTarget`机制，实现消息推送和接收的解耦，
   * 从而使消息接收方无需依赖发布方，发布方也无需考虑接收方
   *
   * > `lib.announce`不是`actor`模型，若不存在订阅者，则消息发送将无意义
   *
   * @example
   * // 甲扩展（如《千幻聆音》）在角色皮肤切换后，调用：
   * lib.announce.publish("skinChange", {
   * 	player,
   * 	playerName: "zhangfei",
   * 	originSkin: "image/xxx.jpg",
   * 	currentSkin: "image/yyy.jpg"
   * });
   *
   * // 乙扩展监听此`skinChange`事件，并修改自己扩展相关界面的图片：
   * const method = lib.announce.subscribe("skinChange", (e) => {
   * 	div.setBackgroundImage(e.currentSkin);
   * });
   *
   * // 若此时乙扩展不想继续订阅`skinChange`事件，可以通过`unsubscribe`解除订阅
   * lib.announce.unsubscribe("skinChange", method);
   */
  announce = new Announce(new EventTarget(), new WeakMap());

  /**
   * 提供一组用于并发异步操作的静态工具方法
   */
  concurrent = Concurrent;

  objectURL = new Map();
  hookmap = {};
  /**
   * @type { { character?: SMap<importCharacterConfig>, card?: SMap<importCardConfig>, mode?: SMap<importModeConfig>, player?: SMap<importPlayerConfig>, extension?: SMap<importExtensionConfig>, play?: SMap<importPlayConfig> } }
   */
  imported = {};
  layoutfixed = LAYOUT_FIXED;
  pinyins = {
    _metadata: PINYIN_METADATA,
  };
  /**
   * The actual card name
   *
   * 实际的卡牌名称
   */
  actualCardName = ACTUAL_CARD_NAME;
  /**
   * the cards which can respond card
   *
   * 卡牌的可被响应牌（主要是用于player.canRespond函数）
   * 例如可响应杀的主要就是闪，或者本体的草船借箭，以此类推；
   * 类似劝酒这种复杂条件的，可以放函数，但仅检测实体牌
   */
  respondMap = RESPOND_MAP;
  characterDialogGroup = {
    最近: function (name, capt) {
      var list = get.config("recentCharacter") || [];
      return list.includes(name) ? capt : null;
    },
  };
  listenEnd(node) {
    if (!node._listeningEnd) {
      node._listeningEnd = true;
      node.listenTransition(function () {
        delete node._listeningEnd;
        if (node._onEndMoveDelete) {
          node.moveDelete(node._onEndMoveDelete);
        } else if (node._onEndDelete) {
          node.delete();
        }
        node._transitionEnded = true;
      });
    }
  }
  configMenu = configMenu;
  extensionMenu = {};
  mode = {};
  status = {
    running: false,
    canvas: false,
    time: 0,
    reload: 0,
    delayed: 0,
    frameId: 0,
    videoId: 0,
    globalId: 0,
  };
  help = {
    关于游戏:
      '<div style="margin:10px">关于炉石普通专用客户端</div><ul style="margin-top:0"><li>炉石普通专用客户端发布地址：<br><a href="https://github.com/asds121/hearthstoneNormal-client">点击前往Github仓库</a></li><li>本项目基于无名杀游戏框架开发，遵循 GPLv3 开源协议。<br><a href="https://www.gnu.org/licenses/gpl-3.0.html">点击查看GPLv3协议</a></li></ul>',
    游戏操作:
      "<ul><li>长按/鼠标悬停/右键单击显示信息。<li>触屏模式中，双指点击切换暂停；下划显示菜单，上划切换托管。<li>键盘快捷键<br>" +
      "<table><tr><td>A<td>切换托管<tr><td>W<td>切换不询问无懈<tr><td>空格<td>暂停</table><li>编辑牌堆<br>在卡牌包中修改牌堆后，将自动创建一个临时牌堆，在所有模式中共用，当保存当前牌堆后，临时牌堆被清除。每个模式可设置不同的已保存牌堆，设置的牌堆优先级大于临时牌堆。</ul>",
    游戏命令:
      '<div style="margin:10px">变量名</div><ul style="margin-top:0"><li>场上角色<br>game.players<li>阵亡角色<br>game.dead' +
      "<li>玩家<br>game.me<li>玩家的上/下家<br>game.me.previous/next" +
      "<li>玩家的上/下家（含阵亡）<br>game.me.previousSeat/<br>nextSeat" +
      "<li>牌堆<br>ui.cardPile<li>弃牌堆<br>ui.discardPile</ul>" +
      '<div style="margin:10px">角色属性</div><ul style="margin-top:0"><li>体力值<br>player.hp' +
      '<li>体力上限<br>player.maxHp<li>身份<br>player.identity<li>手牌<br>player.getCards("h")<li>装备牌<br>player.getCards("e")<li>判定牌<br>player.getCards("j")' +
      "<li>是否存活/横置/翻面<br>player.isAlive()/<br>isLinked()/<br>isTurnedOver()</ul>" +
      '<div style="margin:10px">角色操作</div><ul style="margin-top:0"><li>受到伤害<br>player.damage(source,<br>num)' +
      "<li>回复体力<br>player.recover(num)<li>摸牌<br>player.draw(num)<li>获得牌<br>player.gain(cards)<li>弃牌<br>player.discard(cards)" +
      "<li>使用卡牌<br>player.useCard(card,<br>targets)<li>死亡<br>player.die()<li>复活<br>player.revive(hp)</ul>" +
      '<div style="margin:10px">游戏操作</div><ul style="margin-top:0"><li>在命令框中输出结果<br>game.print(str)<li>清除命令框中的内容<br>cls<li>上一条/下一条输入的内容<br>up/down<li>游戏结束<br>game.over(bool)' +
      "<li>角色资料<br>lib.character<li>卡牌资料<br>lib.card</ul>",
  };
  /**
   * @type {import('path')}
   */
  // @ts-expect-error ignore
  path = {};
  getErrorTip(msg) {
    if (typeof msg != "string") {
      try {
        msg = msg.toString();
        if (typeof msg != "string") {
          throw "err";
        }
      } catch (_) {
        throw "传参错误:" + msg;
      }
    }
    if (msg.startsWith("Uncaught ")) {
      msg = msg.slice(9);
    }
    let newMessage = msg;
    if (/RangeError/.test(newMessage)) {
      if (newMessage.includes("Maximum call stack size exceeded")) {
        newMessage = "堆栈溢出";
      } else if (/argument must be between 0 and 20/.test(newMessage)) {
        let funName = newMessage.slice(
          newMessage.indexOf("RangeError: ") + 12,
          newMessage.indexOf(")") + 1
        );
        newMessage = funName + "参数必须在0和20之间";
      } else {
        newMessage = "传递错误值到数值计算方法";
      }
    } else if (/ReferenceError/.test(newMessage)) {
      let messageName;
      if (newMessage.includes("is not defined")) {
        messageName = newMessage
          .replace("ReferenceError: ", "")
          .replace(" is not defined", "");
        newMessage = "引用了一个未定义的变量：" + messageName;
      } else if (newMessage.includes("invalid assignment left-hand side")) {
        newMessage = "赋值运算符或比较运算符不匹配";
      } else if (
        newMessage.includes("Octal literals are not allowed in strict mode")
      ) {
        newMessage = "八进制字面量与八进制转义序列语法已经被废弃";
      } else if (
        newMessage.includes(
          "Illegal 'use strict' directive in function with non-simple parameter list"
        )
      ) {
        newMessage = "'use strict'指令不能使用在带有‘非简单参数’列表的函数";
      } else if (newMessage.includes("Invalid left-hand side in assignment")) {
        newMessage = "赋值中的左侧无效，即number，string等不可赋值的非变量数据";
      }
    } else if (/SyntaxError/.test(newMessage)) {
      let messageName;
      if (newMessage.includes("Unexpected token ")) {
        messageName = newMessage.replace("SyntaxError: Unexpected token ", "");
        newMessage = "使用了未定义或错误的语法 : (" + messageName + ")";
      } else if (
        newMessage.includes(
          "Block-scoped declarations (let, const, function, class) not yet supported outside strict mode"
        )
      ) {
        newMessage = "请在严格模式下运行let，const，class";
      } else if (
        newMessage.includes(
          "for-of loop variable declaration may not have an initializer."
        )
      ) {
        newMessage = "for...of 循环的头部包含有初始化表达式";
      } else if (
        newMessage.includes(
          "for-in loop variable declaration may not have an initializer."
        )
      ) {
        newMessage = "for...in 循环的头部包含有初始化表达式";
      } else if (
        newMessage.includes(
          "Delete of an unqualified identifier in strict mode."
        )
      ) {
        newMessage = "普通变量不能通过 delete 操作符来删除";
      } else if (newMessage.includes("Unexpected identifier")) {
        newMessage = "不合法的标识符或错误的语法";
      } else if (newMessage.includes("Invalid or unexpected token")) {
        newMessage = "非法的或者不期望出现的标记符号出现在不该出现的位置";
      } else if (newMessage.includes("Invalid regular expression flags")) {
        newMessage = "无效的正则表达式的标记";
      } else if (newMessage.includes("missing ) after argument list")) {
        newMessage = "参数列表后面缺少 ')' (丢失运算符或者转义字符等)";
      } else if (
        newMessage.includes("Invalid shorthand property initializer")
      ) {
        newMessage = "在定义一个{}对象时，应该使用':'而不是'='";
      } else if (
        newMessage.includes("Missing initializer in const declaration")
      ) {
        newMessage = "在使用const定义一个对象时，必须指定初始值";
      } else if (
        newMessage.includes("Unexpected number") ||
        newMessage.includes("Unexpected string")
      ) {
        newMessage = "在定义函数时，函数参数必须为合法标记符";
      } else if (newMessage.includes("Unexpected end of input")) {
        newMessage = "遗漏了符号或符号顺序不对(小括号，花括号等)";
      } else if (newMessage.includes("has already been declared")) {
        messageName = newMessage
          .replace("SyntaxError: Identifier ", "")
          .replace(" has already been declared", "");
        newMessage = messageName + "变量已经被声明过，不能被重新声明";
      } else if (
        newMessage.includes(
          "Duplicate parameter name not allowed in this context"
        )
      ) {
        newMessage = "参数名不允许重复";
      } else if (
        newMessage.includes("Unexpected reserved word") ||
        newMessage.includes("Unexpected strict mode reserved word")
      ) {
        newMessage = "保留字被用作标记符";
      }
    } else if (/TypeError/.test(newMessage)) {
      let messageName;
      if (newMessage.includes(" is not a function")) {
        messageName = newMessage
          .replace("TypeError: ", "")
          .replace(" is not a function", "");
        newMessage = messageName + "不是一个函数";
      } else if (newMessage.includes(" is not a constructor")) {
        messageName = newMessage
          .replace("TypeError: ", "")
          .replace(" is not a constructor", "");
        newMessage = messageName + "不是一个构造函数";
      } else if (newMessage.includes("Cannot read property")) {
        messageName = newMessage
          .replace("TypeError: Cannot read property ", "")
          .replace(" of null", "")
          .replace(" of undefined", "");
        let ofName = newMessage.slice(newMessage.indexOf(" of ") + 4);
        newMessage = "无法读取'" + ofName + "'的属性值" + messageName;
      } else if (newMessage.includes("Cannot read properties")) {
        messageName = newMessage.slice(newMessage.indexOf("reading '") + 9, -2);
        let ofName = newMessage.slice(
          newMessage.indexOf(" of ") + 4,
          newMessage.indexOf("(") - 1
        );
        newMessage = "无法读取'" + ofName + "'的属性值" + messageName;
      } else if (
        newMessage.includes("Property description must be an object")
      ) {
        messageName = newMessage.replace(
          "TypeError: Property description must be an object: ",
          ""
        );
        newMessage = messageName + "是非对象类型的值";
      } else if (newMessage.includes("Cannot assign to read only property ")) {
        messageName = newMessage.slice(47, newMessage.lastIndexOf(" of ") + 1);
        newMessage = messageName + "属性禁止写入";
      } else if (
        newMessage.includes("Object prototype may only be an Object or null")
      ) {
        newMessage = messageName + "对象原型只能是对象或null";
      } else if (newMessage.includes("Cannot create property")) {
        messageName = newMessage.slice(newMessage.indexOf("'") + 1);
        messageName = messageName.slice(0, messageName.indexOf("'"));
        let obj = newMessage.slice(newMessage.indexOf(messageName) + 16);
        newMessage =
          obj +
          "不能添加或修改'" +
          messageName +
          "'属性，任何 Primitive 值都不允许有property";
      } else if (
        newMessage.includes("Can't add property") &&
        newMessage.includes("is not extensible")
      ) {
        newMessage = "对象不可添加属性（不可扩展）";
      } else if (newMessage.includes("Cannot redefine property")) {
        messageName = newMessage.slice(37);
        newMessage = messageName + "不可配置";
      } else if (newMessage.includes("Converting circular structure to JSON")) {
        messageName = newMessage.slice(37);
        newMessage = "JSON.stringify() 方法处理循环引用结构的JSON会失败";
      } else if (
        newMessage.includes("Cannot use 'in' operator to search for ")
      ) {
        newMessage = "in不能用来在字符串、数字或者其他基本类型的数据中进行检索";
      } else if (
        newMessage.includes("Right-hand side of 'instanceof' is not an object")
      ) {
        newMessage =
          "instanceof 操作符 希望右边的操作数为一个构造对象，即一个有 prototype 属性且可以调用的对象";
      } else if (newMessage.includes("Assignment to constant variable")) {
        newMessage = "const定义的变量不可修改";
      } else if (newMessage.includes("Cannot delete property")) {
        newMessage = "不可配置的属性不能删除";
      } else if (newMessage.includes("which has only a getter")) {
        newMessage = "仅设置了getter特性的属性不可被赋值";
      } else if (
        newMessage.includes("called on incompatible receiver undefined")
      ) {
        newMessage = "this提供的绑定对象与预期的不匹配";
      }
    } else if (/URIError/.test(newMessage)) {
      newMessage = "一个不合法的URI";
    } else if (/EvalError/.test(newMessage)) {
      newMessage = "非法调用 eval()";
    } else if (/InternalError/.test(newMessage)) {
      if (newMessage.includes("too many switch cases")) {
        newMessage = "过多case子句";
      } else if (
        newMessage.includes("too many parentheses in regular expression")
      ) {
        newMessage = "正则表达式中括号过多";
      } else if (newMessage.includes("array initializer too large")) {
        newMessage = "超出数组大小的限制";
      } else if (newMessage.includes("too much recursion")) {
        newMessage = "递归过深";
      }
    }
    if (newMessage != msg) {
      return newMessage;
    }
  }
  setIntro(node, func, left) {
    if (lib.config.touchscreen) {
      if (left) {
        node.listen(ui.click.touchintro);
      } else {
        lib.setLongPress(node, ui.click.intro);
      }
    } else {
      if (left) {
        node.listen(ui.click.intro);
      }
      if (lib.config.hover_all && !lib.device) {
        lib.setHover(node, ui.click.hoverplayer);
      }
      if (lib.config.right_info) {
        node.oncontextmenu = ui.click.rightplayer;
      }
    }
    // if(!left){
    // 	lib.setPressure(node,ui.click.rightpressure);
    // }
    if (func) {
      node._customintro = func;
    }
  }
  setPopped(node, func, width, height, forceclick, paused2) {
    node._poppedfunc = func;
    node._poppedwidth = width;
    node._poppedheight = height;
    if (forceclick) {
      node.forceclick = true;
    }
    if (lib.config.touchscreen || forceclick) {
      node.listen(ui.click.hoverpopped);
    } else {
      node.addEventListener("mouseenter", ui.click.hoverpopped);
      // node.addEventListener('mouseleave',ui.click.hoverpopped_leave);
    }
    if (paused2) {
      node._paused2 = true;
    }
  }
  placePoppedDialog(dialog, e) {
    if (dialog._place_text) {
      if (
        dialog._place_text.firstChild.offsetWidth >= 190 ||
        dialog._place_text.firstChild.offsetHeight >= 30
      ) {
        dialog._place_text.style.marginLeft = "14px";
        dialog._place_text.style.marginRight = "14px";
        dialog._place_text.style.textAlign = "left";
        dialog._place_text.style.width = "calc(100% - 28px)";
      }
    }
    if (e.touches && e.touches[0]) {
      e = e.touches[0];
    }
    var height = Math.min(
      ui.window.offsetHeight - 20,
      dialog.content.scrollHeight
    );
    if (dialog._mod_height) {
      height += dialog._mod_height;
    }
    dialog.style.height = height + "px";
    if (e.clientX / game.documentZoom < ui.window.offsetWidth / 2) {
      dialog.style.left = e.clientX / game.documentZoom + 10 + "px";
    } else {
      dialog.style.left =
        e.clientX / game.documentZoom - dialog.offsetWidth - 10 + "px";
    }
    var idealtop =
      (e.clientY || 0) / game.documentZoom - dialog.offsetHeight / 2;
    if (typeof idealtop != "number" || isNaN(idealtop) || idealtop <= 5) {
      idealtop = 5;
    } else if (idealtop + dialog.offsetHeight + 10 > ui.window.offsetHeight) {
      idealtop = ui.window.offsetHeight - 10 - dialog.offsetHeight;
    }
    dialog.style.top = idealtop + "px";
  }
  setHover(node, func, hoveration, width) {
    node._hoverfunc = func;
    if (typeof hoveration == "number") {
      node._hoveration = hoveration;
    }
    if (typeof width == "number") {
      node._hoverwidth = width;
    }
    node.addEventListener("mouseenter", ui.click.mouseenter);
    node.addEventListener("mouseleave", ui.click.mouseleave);
    node.addEventListener("mousedown", ui.click.mousedown);
    node.addEventListener("mousemove", ui.click.mousemove);
    return node;
  }
  setScroll(node) {
    node.ontouchstart = ui.click.touchStart;
    node.ontouchmove = ui.click.touchScroll;
    node.style.webkitOverflowScrolling = "touch";
    return node;
  }
  setMousewheel(node) {
    if (lib.config.mousewheel) {
      node.onmousewheel = ui.click.mousewheel;
    }
  }
  setLongPress(node, func) {
    node.addEventListener("touchstart", ui.click.longpressdown);
    node.addEventListener("touchend", ui.click.longpresscancel);
    node._longpresscallback = func;
    return node;
  }
  updateCanvas(time) {
    if (lib.canvasUpdates.length === 0) {
      lib.status.canvas = false;
      return false;
    }
    ui.canvas.width = ui.arena.offsetWidth;
    ui.canvas.height = ui.arena.offsetHeight;
    var ctx = ui.ctx;
    ctx.shadowBlur = 5;
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.strokeStyle = "white";
    // ctx.lineCap='round';
    ctx.lineWidth = 3;
    ctx.save();
    for (var i = 0; i < lib.canvasUpdates.length; i++) {
      ctx.restore();
      ctx.save();
      var update = lib.canvasUpdates[i];
      if (!update.starttime) {
        update.starttime = time;
      }
      if (update(time - update.starttime, ctx) === false) {
        lib.canvasUpdates.splice(i--, 1);
      }
    }
  }
  run(time) {
    lib.status.time = time;
    for (var i = 0; i < lib.updates.length; i++) {
      if (!("_time" in lib.updates[i])) {
        lib.updates[i]._time = time;
      }
      if (
        lib.updates[i](time - lib.updates[i]._time - lib.status.delayed) ===
        false
      ) {
        lib.updates.splice(i--, 1);
      }
    }
    if (lib.updates.length) {
      lib.status.frameId = requestAnimationFrame(lib.run);
    } else {
      lib.status.time = 0;
      lib.status.delayed = 0;
    }
  }
  getUTC(date) {
    return date.getTime();
  }
  saveVideo() {
    if (_status.videoToSave) {
      game.export(
        lib.init.encode(JSON.stringify(_status.videoToSave)),
        "无名杀 - 录像 - " +
          _status.videoToSave.name[0] +
          " - " +
          _status.videoToSave.name[1]
      );
    }
  }
  /**
   * @param {Function} fn
   */
  genAsync(fn) {
    return gnc.of(fn);
  }
  genAwait(item) {
    return gnc.is.generator(item)
      ? gnc.of(function* () {
          for (const content of item) {
            yield content;
          }
        })()
      : Promise.resolve(item);
  }
  gnc = {
    of: (fn) => gnc.of(fn),
    is: {
      coroutine: (item) => gnc.is.coroutine(item),
      generatorFunc: (item) => gnc.is.generatorFunc(item),
      generator: (item) => gnc.is.generator(item),
    },
  };
  comparator = {
    equals: function () {
      if (arguments.length == 0) {
        return false;
      }
      if (arguments.length == 1) {
        return true;
      }
      for (let i = 1; i < arguments.length; ++i) {
        if (arguments[i] !== arguments[0]) {
          return false;
        }
      }
      return true;
    },
    equalAny: function () {
      if (arguments.length == 0) {
        return false;
      }
      if (arguments.length == 1) {
        return true;
      }
      for (let i = 1; i < arguments.length; ++i) {
        if (arguments[i] === arguments[0]) {
          return true;
        }
      }
      return false;
    },
    notEquals: function () {
      if (arguments.length == 0) {
        return false;
      }
      if (arguments.length == 1) {
        return true;
      }
      for (let i = 1; i < arguments.length; ++i) {
        if (arguments[i] === arguments[0]) {
          return false;
        }
      }
      return true;
    },
    notEqualAny: function () {
      if (arguments.length == 0) {
        return false;
      }
      if (arguments.length == 1) {
        return true;
      }
      for (let i = 1; i < arguments.length; ++i) {
        if (arguments[i] !== arguments[0]) {
          return true;
        }
      }
      return false;
    },
    typeEquals: function () {
      if (arguments.length == 0) {
        return false;
      }
      if (arguments.length == 1) {
        return arguments[0] !== null;
      }
      const type = typeof arguments[0];
      for (let i = 1; i < arguments.length; ++i) {
        if (type !== arguments[i]) {
          return false;
        }
      }
      return true;
    },
  };
  creation = {
    get array() {
      return [];
    },
    get object() {
      return {};
    },
    get nullObject() {
      return Object.create(null);
    },
    get string() {
      return "";
    },
  };
  linq = {
    cselector: {
      hasAttr: (name) => `[${name}]`,
      isAttr: (name, item) => `[${name}=${item}]`,
      inAttr: (name, item) => `[${name}~=${item}]`,
      conAttr: (name, item) => `[${name}*=${item}]`,
      onAttr: (name, item) => `[${name}|=${item}]`,
      bgnAttr: (name, item) => `[${name}^=${item}]`,
      endAttr: (name, item) => `[${name}^=${item}]`,
      merge: function () {
        return Array.from(arguments).join(" ");
      },
      of: function () {
        return Array.from(arguments).join("");
      },
      class: function () {
        return `.${Array.from(arguments).join(".")}`;
      },
      group: function () {
        return Array.from(arguments).join(",");
      },
      media: (type) => `@media ${type}`,
    },
    dom: {
      attributes: {
        style(name, value) {
          return {
            _type: "style",
            name: name,
            value: value,
          };
        },
      },
      inject(element, options) {
        //处理id和class
        if (options.identity) {
          for (const item of options.identity) {
            if (item.startsWith("#")) {
              element.id = item.slice(1);
            } else {
              element.classList.add(item);
            }
          }
        }
        //处理属性
        if (options.attributes) {
          for (const item in options.attributes) {
            element.setAttribute(item, options.attributes[item]);
          }
        }
        //处理样式
        if (options.style) {
          for (const item in options.style) {
            element.style[item] = options.style[item];
          }
        }
        //处理内容
        if (options.content) {
          element.innerHTML = options.content;
        }
        //处理子元素
        if (options.childs) {
          for (const item of options.childs) {
            element.appendChild(item);
          }
        }
        return element;
      },
      generate() {
        let result = lib.creation.nullObject;
        const args = Array.from(arguments);
        for (const item of args) {
          switch (typeof item) {
            case "object":
              switch (item.constructor) {
                case Object:
                case null:
                  if ("_type" in item) {
                    const type = item["_type"];
                    if (!(type in result)) {
                      result[type] = lib.creation.nullObject;
                    }
                    result[type][item.name] = item.value;
                  } else {
                    if (!("style" in result)) {
                      result.style = lib.creation.nullObject;
                    }
                    for (const name in item) {
                      result.style[name] = item[name];
                    }
                  }
                  break;
                default:
                  if (!("childs" in result)) {
                    result.childs = lib.creation.array;
                  }
                  result.childs.add(item);
                  break;
              }
              break;
            case "string":
              if (/^\.|#/.test(item)) {
                if (!("identity" in result)) {
                  result.identity = lib.creation.array;
                }
                const identities = item.split(".").filter(Boolean);
                for (const item of identities) {
                  result.identity.add(item);
                }
              } else {
                result.content = item;
              }
              break;
          }
        }
        return result;
      },
      attribute(name, value) {
        return {
          _type: "attributes",
          name: name,
          value: value,
        };
      },
      div() {
        const dom = lib.linq.dom;
        return dom.inject(
          document.createElement("div"),
          dom.generate(...arguments)
        );
      },
    },
  };
  init = new LibInit();
  cheat = cheat;
  translate = TRANSLATE_MAP;

  experimental = experimental;

  element = {
    content: Element.Content,
    Player: Element.Player,
    Card: Element.Card,
    VCard: Element.VCard,
    Button: Element.Button,
    GameEvent: Element.GameEvent,
    GameEventPromise: Element.GameEventPromise,
    Dialog: Element.Dialog,
    Control: Element.Control,
    Client: Element.Client,
    NodeWS: Element.NodeWS,
    Character: Element.Character,
    ws: {
      onopen: function () {
        if (_status.connectCallback) {
          _status.connectCallback(true);
          delete _status.connectCallback;
        }
      },
      onmessage: function (messageevent) {
        if (messageevent.data == "heartbeat") {
          this.send("heartbeat");
          return;
        }
        var message;
        try {
          message = JSON.parse(messageevent.data);
          if (
            !Array.isArray(message) ||
            typeof lib.message.client[message[0]] !== "function"
          ) {
            throw "err";
          }
          if (game.sandbox) {
            security.enterSandbox(game.sandbox);
          }
          try {
            for (var i = 1; i < message.length; i++) {
              message[i] = get.parsedResult(message[i]);
            }
          } finally {
            if (game.sandbox) {
              security.exitSandbox();
            }
          }
        } catch (e) {
          console.log(e);
          console.log("invalid message: " + messageevent.data);
          return;
        }
        lib.message.client[message.shift()].apply(null, message);
      },
      onerror: function (e) {
        if (this._nocallback) {
          return;
        }
        if (_status.connectCallback) {
          _status.connectCallback(false);
          delete _status.connectCallback;
        } else {
          alert("连接失败");
        }
      },
      onclose: function () {
        if (this._nocallback) {
          return;
        }
        if (_status.connectCallback) {
          _status.connectCallback(false);
          delete _status.connectCallback;
        }
        if (game.online || game.onlineroom) {
          if ((game.servermode || game.onlinehall) && _status.over) {
            void 0;
          } else {
            localStorage.setItem(lib.configprefix + "directstart", true);
            game.reload();
          }
        } else {
          // game.saveConfig('reconnect_info');
        }
        game.online = false;
        game.ws = null;
        game.sandbox = null;
      },
    },
    /**
     * @legacy Use {@link lib.element.Player.prototype} instead.
     */
    get player() {
      return this.Player.prototype;
    },
    /**
     * @legacy Use {@link lib.element.Card.prototype} instead.
     */
    get card() {
      return this.Card.prototype;
    },
    /**
     * @legacy Use {@link lib.element.Button.prototype} instead.
     */
    get button() {
      return this.Button.prototype;
    },
    /**
     * @legacy Use {@link lib.element.GameEvent.prototype} instead.
     */
    get event() {
      return this.GameEvent.prototype;
    },
    /**
     * @legacy Use {@link lib.element.Dialog.prototype} instead.
     */
    get dialog() {
      return this.Dialog.prototype;
    },
    /**
     * @legacy Use {@link lib.element.Control.prototype} instead.
     */
    get control() {
      return this.Control.prototype;
    },
    /**
     * @legacy Use {@link lib.element.Client.prototype} instead.
     */
    get client() {
      return this.Client.prototype;
    },
    /**
     * @legacy Use {@link lib.element.NodeWS.prototype} instead.
     */
    get nodews() {
      return this.NodeWS.prototype;
    },
    /**
     * @legacy Use {@link lib.element.Character.prototype} instead.
     */
    get character() {
      return this.Character.prototype;
    },
  };
  card = {
    /**
     * @type { [CardBaseUIData['suit'], CardBaseUIData['number'], string][] }
     */
    list: [],
    cooperation_damage: {
      fullskin: true,
    },
    cooperation_draw: {
      fullskin: true,
      cardimage: "cooperation_damage",
    },
    cooperation_discard: {
      fullskin: true,
      cardimage: "cooperation_damage",
    },
    cooperation_use: {
      fullskin: true,
      cardimage: "cooperation_damage",
    },
    pss_paper: {
      type: "pss",
      fullskin: true,
    },
    pss_scissor: {
      type: "pss",
      fullskin: true,
    },
    pss_stone: {
      type: "pss",
      fullskin: true,
    },
    feichu_equip1: {
      type: "equip",
      subtype: "equip1",
    },
    feichu_equip2: {
      type: "equip",
      subtype: "equip2",
    },
    feichu_equip3: {
      type: "equip",
      subtype: "equip3",
    },
    feichu_equip4: {
      type: "equip",
      subtype: "equip4",
    },
    feichu_equip5: {
      type: "equip",
      subtype: "equip5",
    },
    feichu_equip6: {
      type: "equip",
      subtype: "equip6",
    },
    empty_equip1: {
      type: "equip",
      subtype: "equip1",
    },
    empty_equip2: {
      type: "equip",
      subtype: "equip2",
    },
    empty_equip3: {
      type: "equip",
      subtype: "equip3",
    },
    empty_equip4: {
      type: "equip",
      subtype: "equip4",
    },
    empty_equip5: {
      type: "equip",
      subtype: "equip5",
    },
    empty_equip6: {
      type: "equip",
      subtype: "equip6",
    },
    zhengsu_leijin: {},
    zhengsu_mingzhi: {},
    zhengsu_bianzhen: {},
    disable_judge: {},
    group_wei: { fullskin: true },
    group_shu: { fullskin: true },
    group_wu: { fullskin: true },
    group_qun: { fullskin: true },
    group_key: { fullskin: true },
    group_jin: { fullskin: true },

    db_atk1: {
      type: "db_atk",
      fullimage: true,
    },
    db_atk2: {
      type: "db_atk",
      fullimage: true,
    },
    db_def1: {
      type: "db_def",
      fullimage: true,
    },
    db_def2: {
      type: "db_def",
      fullimage: true,
    },
  };
  filter = filter;
  sort = sort;
  /**
   * @type {{
   * 	global: string[];
   * 	globalmap: SMap<Player[]>;
   * 	storage: SMap<any>;
   * 	undist: SMap<any>;
   * 	thers: SMap<any>;
   * 	zhu: SMap<any>;
   * 	zhuSkill: SMap<any>;
   * 	land_used: SMap<any>;
   * 	[key: string]: Skill;
   * }}
   */
  skill = skill;
  /** @type {Object<string, import("./element/character.js").Character>} */
  character = new Proxy(
    {},
    {
      set(target, prop, newValue) {
        return Reflect.set(target, prop, get.convertedCharacter(newValue));
      },
    }
  );
  cardPile = {};
  message = message;
  //为lib.numstrList属性set数字对应花色，即可在get.strNumber和get.numString中获取使用
  numstrList = new Map([
    [1, "A"],
    [11, "J"],
    [12, "Q"],
    [13, "K"],
  ]);
  suit = SUIT;
  suits = SUITS;

  color = COLOR_GROUP;

  group = GROUP;
  //数值代表各元素在名称中排列的先后顺序
  nature = new Map([
    ["fire", 20],
    ["thunder", 30],
    ["kami", 60],
    ["ice", 40],
    ["stab", 10],
    ["poison", 50],
  ]);
  natureAudio = {
    damage: {
      fire: "default", //默认，即语音放置在audio/effect下，以damage_fire.mp3 damage_fire2.mp3命名。
      thunder: "default",
      ice: "default",
      stab: "normal", //正常，即与普通伤害音效相同。
      /*
			'example':{
				1:'../extension/XXX/damage_example.mp3',//1点伤害。
				2:'../extension/XXX/damage_example2.mp3',//2点及以上伤害
			}
			*/
    },
    hujia_damage: {
      fire: "default", //默认，即语音放置在audio/effect下，以hujia_damage_fire.mp3 hujia_damage_fire2.mp3命名。
      thunder: "default",
      ice: "normal", //正常，即与普通伤害音效相同。
      /*
			'example':{
				1:'../extension/XXX/damage_example.mp3',//1点伤害。
				2:'../extension/XXX/damage_example2.mp3',//2点及以上伤害
			}
			*/
    },
    sha: {
      fire: "default", //默认，即语音放置在audio/card/male与audio/card/female下，命名为sha_fire.mp3
      thunder: "default",
      ice: "default",
      stab: "default",
      poison: "normal", //正常，即播放“杀”的音效。
      kami: "normal",
      /*
			'example':{
				'male':'../extension/XXXX/sha_example_male.mp3',
				'female':'../extension/XXXX/sha_example_female.mp3'
			}
			*/
    },
  };
  linked = LINKED;
  natureBg = new Map([["stab", "image/card/cisha.png"]]);
  natureSeparator = "|";
  namePrefix = namePrefix;
  groupnature = GROUP_NATURE;
  lineColor = LINE_COLOR;
  selectGroup = SELECT_GROUP;
  phaseName = PHASE_NAME;
  quickVoice = QUICK_VOICE;
  other = {
    ignore: () => void 0,
  };
  InitFilter = INIT_FILTER;
}

/**
 * @typedef {Object} Config
 * @property {"hs_hearthstone"|"identity"|undefined} mode - 游戏模式
 */

/**
 * @type {Config}
 */
Library.prototype.config = undefined;
Library.prototype.configOL = undefined;

export let lib = new Library();

/**
 * @param { InstanceType<typeof Library> } [instance]
 */
export let setLibrary = (instance) => {
  lib = instance || new Library();
  if (lib.config.dev) {
    window.lib = lib;
  }
};

/**
 * @template T
 * @param {T} object
 */
const setAllPropertiesEnumerable = (object) => {
  Object.getOwnPropertyNames(object).forEach((propertyKey) => {
    if (propertyKey == "constructor") {
      return;
    }
    const propertyDescriptor = Object.getOwnPropertyDescriptor(
      object,
      propertyKey
    );
    if (!propertyDescriptor.enumerable) {
      propertyDescriptor.enumerable = true;
    }
    Object.defineProperty(object, propertyKey, propertyDescriptor);
  }, {});
  return object;
};
setAllPropertiesEnumerable(lib.element.Player.prototype);
const cardPrototype = setAllPropertiesEnumerable(lib.element.Card.prototype),
  vCardPrototype = setAllPropertiesEnumerable(lib.element.VCard.prototype);
Object.keys(vCardPrototype).forEach((key) => {
  Object.defineProperty(
    cardPrototype,
    key,
    Object.getOwnPropertyDescriptor(vCardPrototype, key)
  );
});
setAllPropertiesEnumerable(lib.element.Button.prototype);
setAllPropertiesEnumerable(lib.element.GameEvent.prototype);
setAllPropertiesEnumerable(lib.element.Dialog.prototype);
setAllPropertiesEnumerable(lib.element.Control.prototype);
setAllPropertiesEnumerable(lib.element.Client.prototype);
setAllPropertiesEnumerable(lib.element.NodeWS.prototype);
