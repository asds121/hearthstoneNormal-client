import { ai } from "../../ai/index.js";
import { get } from "../../get/index.js";
import { game } from "../../game/index.js";
import { _status } from "../../status/index.js";
import { ui } from "../../ui/index.js";

import dedent from "../../../game/dedent.js";
const html = dedent;

//todo：变成循环依赖了喵
import { lib } from "../index.js";

export default {
  /**
   * 将游戏内部的对象暴露到全局中
   *
   * lib.cheat, game, ui, get, ai, lib, _status
   */
  i() {
    window.cheat = lib.cheat;
    window.game = game;
    window.ui = ui;
    window.get = get;
    window.nonameAI = ai;
    window.lib = lib;
    window._status = _status;
  },
  /**
   * 自己的下家(如果下家是主公身份则是下家的下家)立即死亡
   */
  dy() {
    let next = game.me.next;
    for (let i = 0; i < 10; i++) {
      if (next.identity != "zhu") {
        break;
      }
      next = next.next;
    }
    next.die();
  },
  /**
   * 在控制台输出每个扩展文件夹内的所有文件
   *
   * 需要node环境
   *
   * @param  { ...string } args 只需要显示的文件夹首字符
   */
  x(...args) {
    /**
     * @param { string } dir
     * @param { (folders: string[], files: string[]) => any } callback
     */
    const gl = function (dir, callback) {
      const files = [],
        folders = [];
      // dir = '/Users/widget/Documents/extension/' + dir;
      dir = lib.node.path.join(__dirname, "extension", dir);
      lib.node.fs.promises
        .readdir(dir)
        .then((filelist) => {
          for (let i = 0; i < filelist.length; i++) {
            if (filelist[i][0] != "." && filelist[i][0] != "_") {
              if (lib.node.fs.statSync(dir + "/" + filelist[i]).isDirectory()) {
                folders.push(filelist[i]);
              } else {
                files.push(filelist[i]);
              }
            }
          }
          callback(folders, files);
        })
        .catch((e) => {
          throw e;
        });
    };
    for (let i = 0; i < args.length; i++) {
      args[i] = args[i][0];
    }
    gl("", function (list) {
      if (args.length) {
        for (let i = 0; i < list.length; i++) {
          if (!args.includes(list[i][0])) {
            list.splice(i--, 1);
          }
        }
      }
      if (list.length) {
        for (let i = 0; i < list.length; i++) {
          let str = list[i];
          gl(str, function (folders, files) {
            if (files.length > 1) {
              for (let j = 0; j < files.length; j++) {
                if (
                  typeof files[i] == "string" &&
                  files[i].includes("extension.js")
                ) {
                  files.splice(j--, 1);
                } else {
                  if (j % 5 == 0) {
                    str += "\n\t\t\t";
                  }
                  str += '"' + files[j] + '",';
                }
              }
              console.log(str.slice(0, str.length - 1));
              game.print(str.slice(0, str.length - 1));
            }
          });
        }
      }
    });
  },
  /**
   * 游戏设置变更为固定数据(不更改扩展设置)
   */
  cfg() {
    const mode = lib.config.all.mode.slice(0);
    mode.remove("connect");
    mode.remove("brawl");
    const banned = [
      "shen_guanyu",
      "shen_caocao",
      "caopi",
      "re_daqiao",
      "caorui",
      "daqiao",
      "lingcao",
      "liuzan",
      "lusu",
      "luxun",
      "yanwen",
      "zhouyu",
      "ns_wangyue",
      "gw_yenaifa",
      "old_caozhen",
      "swd_jiangziya",
      "xuhuang",
      "maliang",
      "guojia",
      "simayi",
      "swd_kangnalishi",
      "hs_siwangzhiyi",
      "hs_nozdormu",
      "old_zhuzhi",
    ];
    const bannedcards = ["zengbin"];
    const favs = [
      "hs_tuoqi",
      "hs_siwangxianzhi",
      "hs_xukongzhiying",
      "hs_hsjiasha",
      "gjqt_xieyi",
      "gjqt_yunwuyue",
      "gjqt_beiluo",
      "gjqt_cenying",
      "shen_lvmeng",
      "shen_zhaoyun",
      "shen_zhugeliang",
      "ow_ana",
      "chenlin",
      "ns_guanlu",
      "hs_guldan",
      "swd_guyue",
      "pal_jiangyunfan",
      "mtg_jiesi",
      "swd_lanyin",
      "pal_liumengli",
      "swd_muyun",
      "pal_nangonghuang",
      "swd_muyue",
      "pal_murongziying",
      "swd_qiner",
      "pal_shenqishuang",
      "hs_taisi",
      "wangji",
      "pal_xingxuan",
      "xunyou",
      "hs_yelise",
      "pal_yuejinzhao",
      "pal_yueqi",
      "gjqt_yuewuyi",
      "swd_yuxiaoxue",
      "ow_zhaliya",
      "zhangchunhua",
      "hs_zhihuanhua",
      "swd_zhiyin",
      "old_zhonghui",
      "gjqt_bailitusu",
      "hs_barnes",
      "ow_dva",
      "swd_hengai",
      "pal_jushifang",
      "hs_kazhakusi",
      "hs_lafamu",
      "ow_liekong",
      "hs_lreno",
      "pal_mingxiu",
      "swd_murongshi",
      "gw_oudimu",
      "gjqt_ouyangshaogong",
      "hs_pyros",
      "qinmi",
      "gw_sanhanya",
      "hs_selajin",
      "swd_shuwaner",
      "swd_situqiang",
      "hs_xialikeer",
      "pal_xuejian",
      "swd_yuchiyanhong",
      "swd_yuwentuo",
      "swd_zhaoyun",
      "zhugeliang",
      "gw_aigeleisi",
      "gw_aimin",
      "gjqt_aruan",
      "hs_aya",
      "swd_cheyun",
      "swd_chenjingchou",
      "gw_diandian",
      "swd_huzhongxian",
      "hs_jinglinglong",
      "hs_kaituozhe",
      "hs_kalimosi",
      "gw_linjing",
      "ow_luxiao",
      "re_luxun",
      "hs_morgl",
      "swd_sikongyu",
      "hs_sthrall",
      "sunquan",
      "sunshangxiang",
      "gw_yioufeisisp",
      "gw_yisilinni",
      "hs_yogg",
      "hs_ysera",
      "pal_yuntianhe",
      "zhugejin",
      "zhugeke",
      "gw_zhuoertan",
      "hs_anduin",
      "swd_anka",
      "ow_banzang",
      "ow_chanyata",
      "diaochan",
      "swd_duguningke",
      "sp_diaochan",
      "hetaihou",
      "ns_huamulan",
      "swd_huanglei",
      "swd_huanyuanzhi",
      "re_huatuo",
      "gw_huoge",
      "pal_jiangcheng",
      "yj_jushou",
      "swd_kendi",
      "yxs_libai",
      "mtg_lilianna",
      "xin_liru",
      "liuxie",
      "pal_lixiaoyao",
      "pal_longkui",
      "ns_nanhua",
      "swd_qi",
      "swd_septem",
      "gw_shasixiwusi",
      "ow_tianshi",
      "swd_weida",
      "gjqt_xiayize",
      "swd_xiyan",
      "hs_xsylvanas",
      "hs_yelinlonghou",
      "ow_yuanshi",
      "zuoci",
    ];
    const vintage = [
      "tianjian",
      "shuiyun",
      "zhuyue",
      "zhimeng",
      "poyun",
      "qianfang",
      "xfenxin",
      "danqing",
      "ywuhun",
      "tianwu",
      "xuelu",
      "shahun",
      "yuling",
      "duhun",
      "liaoyuan",
      "touxi",
      "wangchen",
      "poyue",
      "kunlunjing",
      "huanhun",
      "yunchou",
      "tuzhen",
      "cyqiaoxie",
      "mufeng",
      "duanyi",
      "guozao",
      "yaotong",
      "pozhen",
      "tanlin",
      "susheng",
      "jikong",
      "shouyin",
      "jilve",
      "hxunzhi",
      "huodan",
      "shanxian",
      "ziyu",
      "kuoyin",
      "feiren",
      "zihui",
      "jidong",
      "baoxue",
      "aqianghua",
      "maoding",
      "bfengshi",
      "zhongdun",
      "pingzhang",
      "maichong",
      "guozai",
      "jingxiang",
      "yuelu",
      "liechao",
      "fengnu",
      "hanshuang",
      "enze",
      "malymowang",
      "xshixin",
      "qingzun",
    ];
    const favmodes = [
      "versus|three",
      "versus|four",
      "versus|two",
      "chess|combat",
    ];
    for (let i = 0; i < mode.length; i++) {
      game.saveConfig(mode[i] + "_banned", banned);
      game.saveConfig(mode[i] + "_bannedcards", bannedcards);
    }
    const characters = lib.config.all.characters.slice(0);
    characters.remove("standard");
    characters.remove("old");
    game.saveConfig("theme", "simple");
    game.saveConfig("player_border", "slim");
    game.saveConfig("cards", lib.config.all.cards);
    game.saveConfig("characters", characters);
    game.saveConfig("change_skin", false);
    game.saveConfig("show_splash", "off");
    game.saveConfig("animation", false);
    game.saveConfig("hover_all", false);
    game.saveConfig("asset_version", "v1.9");
    // game.saveConfig('characters',lib.config.all.characters);
    // game.saveConfig('cards',lib.config.all.cards);
    game.saveConfig("plays", ["cardpile"]);
    game.saveConfig("skip_shan", false);
    game.saveConfig("tao_enemy", true);
    game.saveConfig("layout", "long2");
    game.saveConfig("hp_style", "ol");
    game.saveConfig("background_music", "music_off");
    game.saveConfig("background_audio", false);
    game.saveConfig("background_speak", false);
    game.saveConfig("show_volumn", false);
    game.saveConfig("show_replay", true);
    game.saveConfig("autostyle", true);
    game.saveConfig("debug", true);
    game.saveConfig("dev", true);
    if (!lib.device) {
      game.saveConfig("sync_speed", false);
    }
    game.reload();
  },
  /**
   * 移除旁观时的手牌暗置效果
   */
  o() {
    ui.arena.classList.remove("observe");
  },
  /**
   * 向牌堆顶添加牌(即创建一些卡牌添加到牌堆里)
   * @param  { ...string } list 卡牌名称数字
   */
  pt(...list) {
    while (list.length) {
      const card = lib.cheat.gn(list.pop());
      if (card) {
        ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
      }
    }
  },
  /**
   * 将卡牌的样式在simple和default之间切换
   *
   * 有参数时改为获得指定的牌
   *
   * @param { ...string } args
   */
  q(...args) {
    // if(lib.config.layout!='mobile') lib.init.layout('mobile');
    if (args.length == 0) {
      if (ui.css.card_style) {
        ui.css.card_style.remove();
      }
      if (lib.config.card_style != "simple") {
        lib.config.card_style = "simple";
        ui.css.card_style = lib.init.css(
          lib.assetURL + "theme/style/card",
          "simple"
        );
      } else {
        lib.config.card_style = "default";
        ui.css.card_style = lib.init.css(
          lib.assetURL + "theme/style/card",
          "default"
        );
      }
    } else {
      for (let i = 0; i < args.length; i++) {
        lib.cheat.g(args[i]);
      }
    }
    ui.arena.classList.remove("selecting");
    ui.arena.classList.remove("tempnoe");
  },
  /**
   * 替换皮肤
   * @param { string } name 武将名称
   * @param { number | true } [i] 指定game.players的第几个元素，不填指定为自己的下家。为true时切换玩家布局
   * @param { string } [skin] 皮肤id
   */
  p(name, i, skin) {
    const list = ["swd", "hs", "pal", "gjqt", "ow", "gw"];
    if (!lib.character[name]) {
      for (let j = 0; j < list.length; j++) {
        if (lib.character[list[j] + "_" + name]) {
          name = list[j] + "_" + name;
          break;
        }
      }
    }
    let target;
    if (typeof i == "number") {
      target = game.players[i];
    } else {
      target = game.me.next;
    }
    if (!lib.character[name]) {
      target.node.avatar.setBackground(name, "character");
      target.node.avatar.show();
    } else {
      target.init(name);
    }
    if (skin) {
      lib.config.skin[name] = skin - 1;
      // 换肤时skin - 1变成skin
      ui.click.skin(target.node.avatar, name);
    }
    if (i === true) {
      if (lib.config.layout == "long2") {
        lib.init.layout("mobile");
      } else {
        lib.init.layout("long2");
      }
    }
  },
  /**
   * @overload
   * @description 不传参数默认装备麒麟弓，八卦阵，的卢，赤兔，木牛
   * @returns { void }
   */
  /**
   * @overload
   * @description 指定的玩家或自己装备指定的牌
   * @param  {...Player | string} args 玩家或卡牌名
   * @returns { void }
   */
  e(...args) {
    /**
     * @type { Card[] }
     */
    let cards = [];
    /**
     * @type { Player }
     */
    let target;
    for (let i = 0; i < arguments.length; i++) {
      if (get.itemtype(arguments[i]) == "player") {
        target = arguments[i];
      } else {
        cards.push(game.createCard(arguments[i]));
      }
    }
    if (!cards.length) {
      cards.push(game.createCard("qilin"));
      cards.push(game.createCard("bagua"));
      cards.push(game.createCard("dilu"));
      cards.push(game.createCard("chitu"));
      cards.push(game.createCard("muniu"));
    }
    target = target || game.me;
    for (let i = 0; i < cards.length; i++) {
      const card = target.getEquip(cards[i]);
      if (card) {
        card.discard();
        target.removeEquipTrigger(card);
      }
      target.$equip(cards[i]);
    }
  },
  /**
   * 检测当前游戏开启的武将数，卡堆的数量分布情况
   */
  c() {
    const log = function (...args) {
      console.log(...args);
      game.print(...args);
    };
    (function () {
      let a = 0,
        b = 0,
        c = 0,
        d = 0,
        e = 0,
        f = 0,
        g = 0;
      let sa = 0,
        sb = 0,
        sc = 0,
        sd = 0,
        se = 0,
        sf = 0,
        sg = 0;
      for (let i in lib.character) {
        switch (lib.character[i][1]) {
          case "wei":
            a++;
            if (lib.config.banned.includes(i)) {
              sa++;
            }
            break;
          case "shu":
            b++;
            if (lib.config.banned.includes(i)) {
              sb++;
            }
            break;
          case "wu":
            c++;
            if (lib.config.banned.includes(i)) {
              sc++;
            }
            break;
          case "qun":
            d++;
            if (lib.config.banned.includes(i)) {
              sd++;
            }
            break;
          case "jin":
            g++;
            if (lib.config.banned.includes(i)) {
              sg++;
            }
            break;
          case "western":
            e++;
            if (lib.config.banned.includes(i)) {
              se++;
            }
            break;
          case "key":
            f++;
            if (lib.config.banned.includes(i)) {
              sf++;
            }
            break;
        }
      }
      log("魏：" + (a - sa) + "/" + a);
      log("蜀：" + (b - sb) + "/" + b);
      log("吴：" + (c - sc) + "/" + c);
      log("群：" + (d - sd) + "/" + d);
      log("晋：" + (g - sg) + "/" + g);
      log("西：" + (e - se) + "/" + e);
      log("键：" + (f - sf) + "/" + f);
      log(
        "已启用：" +
          (a + b + c + d + e + f - (sa + sb + sc + sd + se + sf)) +
          "/" +
          (a + b + c + d + e + f)
      );
    })();
    (function () {
      let a = 0,
        b = 0,
        c = 0,
        d = 0;
      let aa = 0,
        bb = 0,
        cc = 0,
        dd = 0;
      let sa = 0,
        sb = 0,
        sc = 0,
        sd = 0;
      let sha = 0,
        shan = 0,
        tao = 0,
        jiu = 0,
        wuxie = 0,
        heisha = 0,
        hongsha = 0;
      let num = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
        13: 0,
      };
      for (let i in lib.card) {
        if (
          get.objtype(lib.card[i]) == "object" &&
          lib.translate[i + "_info"]
        ) {
          switch (lib.card[i].type) {
            case "basic":
              a++;
              break;
            case "trick":
              b++;
              break;
            case "equip":
              c++;
              break;
            default:
              d++;
              break;
          }
        }
      }
      for (let i = 0; i < lib.card.list.length; i++) {
        if (typeof lib.card[lib.card.list[i][2]] == "object") {
          switch (lib.card[lib.card.list[i][2]].type) {
            case "basic":
              aa++;
              break;
            case "trick":
            case "delay":
              bb++;
              break;
            case "equip":
              cc++;
              break;
            default:
              dd++;
              break;
          }
          switch (lib.card.list[i][0]) {
            case "heart":
              sa++;
              break;
            case "diamond":
              sb++;
              break;
            case "club":
              sc++;
              break;
            case "spade":
              sd++;
              break;
          }
          if (lib.card.list[i][2] == "sha") {
            sha++;
            if (
              lib.card.list[i][0] == "club" ||
              lib.card.list[i][0] == "spade"
            ) {
              heisha++;
            } else {
              hongsha++;
            }
          }
          if (lib.card.list[i][2] == "shan") {
            shan++;
          }
          if (lib.card.list[i][2] == "tao") {
            tao++;
          }
          if (lib.card.list[i][2] == "jiu") {
            jiu++;
          }
          if (lib.card.list[i][2] == "wuxie") {
            wuxie++;
          }
          num[lib.card.list[i][1]]++;
        }
      }
      let str =
        "基本牌" +
        aa +
        "； " +
        "锦囊牌" +
        bb +
        "； " +
        "装备牌" +
        cc +
        "； " +
        "其它牌" +
        dd;
      log(str);
      str =
        "红桃牌" +
        sa +
        "； " +
        "方片牌" +
        sb +
        "； " +
        "梅花牌" +
        sc +
        "； " +
        "黑桃牌" +
        sd;
      log(str);
      str =
        "杀" +
        sha +
        "； " +
        "黑杀" +
        heisha +
        "； " +
        "红杀" +
        hongsha +
        "； " +
        "闪" +
        shan +
        "； " +
        "桃" +
        tao +
        "； " +
        "酒" +
        jiu +
        "； " +
        "无懈" +
        wuxie;
      log(str);
      if (arguments[1]) {
        for (let i = 1; i <= 13; i++) {
          if (i < 10) {
            log(i + " ", num[i]);
          } else {
            log(i, num[i]);
          }
        }
      }
      let arr = [];
      for (let i = 1; i <= 13; i++) {
        arr.push(num[i]);
      }
      log(a + b + c + d + "/" + (aa + bb + cc + dd), ...arr);
    })();
  },
  /**
   * 显示场上所有的角色的身份
   */
  id() {
    game.showIdentity();
  },
  /**
   * 替换dialog中待选择的卡牌(或其他东西)对应的真实卡牌(或其他东西)
   * ```js
   * // 在神吕蒙涉猎时使用:
   * // 涉猎如果选择l第一张牌，那你获得的是你创造的这张杀
   * lib.cheat.b(game.createCard('sha'));
   * ```
   */
  b(...args) {
    if (!ui.dialog || !ui.dialog.buttons) {
      return;
    }
    for (let i = 0; i < Math.min(args.length, ui.dialog.buttons.length); i++) {
      ui.dialog.buttons[i].link = args[i];
    }
  },
  /**
   * 炉石模式可用，使用'spell_yexinglanghun'卡牌
   * @param { boolean } [me] 决定是自己还是对手使用'spell_yexinglanghun'卡牌
   */
  uy(me) {
    if (me) {
      game.me.useCard({ name: "spell_yexinglanghun" }, game.me);
    } else {
      // player.getEnemy是炉石模式的函数
      const enemy = game.me.getEnemy();
      enemy.useCard({ name: "spell_yexinglanghun" }, enemy);
    }
  },
  /**
   * 炉石模式可用，使用`spell_${name}`卡牌
   * @param { string } [name]
   * @param { boolean } [act]
   */
  gs(name = "yexinglanghun", act) {
    const card = game.createCard("spell_" + name);
    game.me.node.handcards1.appendChild(card);
    if (!act) {
      game.me.actused = -99;
    }
    ui.updatehl();
    delete _status.event._buttonChoice;
    delete _status.event._cardChoice;
    delete _status.event._targetChoice;
    delete _status.event._skillChoice;
    setTimeout(game.check, 300);
  },
  /**
   * 炉石模式可用，获得`stone_${name}_stonecharacter`卡牌
   * @param { string } [name]
   * @param { boolean } [act]
   */
  gc(name = "falifulong", act) {
    var card = game.createCard("stone_" + name + "_stonecharacter");
    game.me.node.handcards1.appendChild(card);
    if (!act) {
      game.me.actused = -99;
    }
    ui.updatehl();
    delete _status.event._buttonChoice;
    delete _status.event._cardChoice;
    delete _status.event._targetChoice;
    delete _status.event._skillChoice;
    setTimeout(game.check, 300);
  },
  /**
   * 进入/关闭快速自动测试模式(游戏速度最快)，只有游戏记录界面
   * @param { boolean | string } [bool]
   */
  a(bool) {
    if (lib.config.test_game) {
      game.saveConfig("test_game");
    } else {
      if (bool) {
        if (typeof bool === "string") {
          game.saveConfig("test_game", bool);
        } else {
          game.saveConfig("test_game", "_");
        }
      } else {
        game.saveConfig("test_game", true);
      }
    }
    game.reload();
  },
  /**
   * 临时去掉“自动测试模式”带来的css效果，
   *
   * 如果要彻底关闭，需要再执行一次lib.cheat.a
   */
  as() {
    ui.window.classList.remove("testing");
    const bg = ui.window.querySelector(".pausedbg");
    if (bg) {
      bg.remove();
    }
  },
  /**
   * 装备麒麟弓，并且下家玩家对你发动借刀杀人,杀你的上家
   */
  uj() {
    lib.cheat.e("qilin");
    game.me.next.useCard({ name: "jiedao" }, [game.me, game.me.previous]);
  },
  /**
   * 下家对你使用一张牌
   * @param  {...Player | Player[] | string | VCard } args
   *
   * @example
   * ```js
   * // 传入player是卡牌的使用者
   * // 传入player数组是卡牌的目标(没有则目标是game.me)
   * // 传入字符串设置卡牌名称
   * // 传入Vcard对象设置卡牌更具体的卡牌信息
   * lib.cheat.u(player1, 'sha', [player2, player3]);
   * ```
   */
  u(...args) {
    let card = new lib.element.VCard({ name: "sha" }),
      source = game.me.next,
      targets = [];
    for (let i = 0; i < args.length; i++) {
      if (get.itemtype(args[i]) == "player") {
        source = args[i];
      } else if (Array.isArray(args[i])) {
        targets = args[i];
      } else if (args instanceof lib.element.VCard) {
        card = args[i];
      } else if (
        typeof args[i] == "object" &&
        args[i] != null &&
        args[i].name
      ) {
        console.warn("lib.cheat.u: 以普通obj形式传入的类卡牌形式已经废弃");
        card = new lib.element.VCard(args[i]);
      } else if (typeof args[i] == "string") {
        card = new lib.element.VCard({ name: args[i] });
      }
    }
    if (!targets.length) {
      targets.push(game.me);
    }
    source.useCard(
      game.createCard(card.name, card.suit, card.number, card.nature),
      targets
    );
  },
  /**
   * 输出每个强度的武将数量、每个武将包的每个强度的武将数量、每个武将对应的id和翻译
   * @param { boolean } [bool] 为false不输出无名杀自带的武将id和翻译
   */
  r(bool) {
    const log = function (...args) {
      console.log(...args);
      game.print(...args);
    };
    let list = ["s", "ap", "a", "am", "bp", "b", "bm", "c", "d"];
    let str = "";
    log(str);
    for (let i in lib.characterPack) {
      if (!bool && lib.config.all.sgscharacters.includes(i)) {
        continue;
      }
      let map = {};
      let str = "";
      for (let j in lib.characterPack[i]) {
        let rank = get.rank(j);
        if (!map[rank]) {
          map[rank] = 1;
        } else {
          map[rank]++;
        }
      }
      for (let j = 0; j < list.length; j++) {
        if (map[list[j]]) {
          if (str) {
            str += " 、 ";
          }
          str += list[j] + "-" + map[list[j]];
        }
      }
      if (str) {
        log(lib.translate[i + "_character_config"] + "：" + str);
      }
    }

    Object.keys(lib.character).forEach((key) => {
      if (
        !lib.config.forbidai.includes(key) &&
        !key.startsWith("boss_") &&
        !key.startsWith("tafang_")
      ) {
        log(get.translation(key), key);
      }
    });
  },
  /**
   * 打印目标玩家的手牌
   * @param { Player } player
   */
  h(player) {
    console.log(get.translation(player.getCards("h")));
  },
  /**
   * 给自己立刻添加手牌
   *
   * @example
   * ```js
   * // 获得3张杀和1张闪
   * lib.cheat.g('sha', 3, 'shan', 1)
   * ```
   */
  g(...args) {
    for (let i = 0; i < args.length; i++) {
      if (i > 0 && typeof args[i] == "number") {
        for (let j = 0; j < args[i] - 1; j++) {
          lib.cheat.gx(args[i - 1]);
        }
      } else {
        lib.cheat.gx(args[i]);
      }
    }
  },
  /**
   * 立即获得指定类型的牌各一张
   *
   * 会添加到不属于当前模式的牌和某些角色专属牌
   *
   * @param { string } type
   */
  ga(type) {
    for (let i in lib.card) {
      if (lib.card[i].type == type || lib.card[i].subtype == type) {
        lib.cheat.g(i);
      }
    }
  },
  /**
   *  给所有玩家立刻添加一张或多张指定的牌
   * @param  {...string} args
   * @example
   * ```js
   * // 给所有玩家立刻添加一张杀和一张闪
   * lib.cheat.gg('sha', 'shan');
   * ```
   */
  gg(...args) {
    game.players.forEach((player) => {
      args.forEach((cardName) => {
        lib.cheat.gx(cardName, player);
      });
    });
  },
  /**
   * 给目标立即添加一张手牌
   * @param { string } name
   * @param { Player } target
   */
  gx(name, target = game.me) {
    const card = lib.cheat.gn(name);
    if (!card) {
      return;
    }
    target.node.handcards1.appendChild(card);
    delete _status.event._buttonChoice;
    delete _status.event._cardChoice;
    delete _status.event._targetChoice;
    delete _status.event._skillChoice;
    game.check();
    target.update();
    ui.updatehl();
  },
  /**
   * 创建卡牌
   *
   * 如果lib.card里没有对应卡牌名返回null
   *
   * @param { string } name
   * @returns { Card }
   * @example
   * ```js
   * // 创建一个梅花杀
   * lib.cheat.gn('clubsha');
   * // 创建一个红色杀
   * lib.cheat.gn('redsha');
   * // 创建一个黑色杀
   * lib.cheat.gn('blacksha');
   * // 创建一个火杀
   * lib.cheat.gn('huosha');
   * // 创建一个雷杀
   * lib.cheat.gn('leisha');
   * // 冰杀神杀刺杀没有
   * ```
   */
  gn(name) {
    let nature = null;
    let suit = null;
    let suits = ["club", "spade", "diamond", "heart"];
    for (let i = 0; i < suits.length; i++) {
      if (name.startsWith(suits[i])) {
        suit = suits[i];
        name = name.slice(suits[i].length);
        break;
      }
    }
    if (name.startsWith("red")) {
      name = name.slice(3);
      suit = ["diamond", "heart"].randomGet();
    }
    if (name.startsWith("black")) {
      name = name.slice(5);
      suit = ["spade", "club"].randomGet();
    }

    if (name == "huosha") {
      name = "sha";
      nature = "fire";
    } else if (name == "leisha") {
      name = "sha";
      nature = "thunder";
    }
    if (!lib.card[name]) {
      return null;
    }
    return game.createCard(name, suit, null, nature);
  },
  /**
   * 指定的玩家或自己立即获得诸葛连弩，青龙刀，八卦阵，的卢，赤兔，木牛
   * @param { Player } [target]
   */
  ge(target) {
    if (target) {
      lib.cheat.gx("zhuge", target);
      lib.cheat.gx("qinglong", target);
      lib.cheat.gx("bagua", target);
      lib.cheat.gx("dilu", target);
      lib.cheat.gx("chitu", target);
      lib.cheat.gx("muniu", target);
    } else {
      lib.cheat.g("zhuge");
      lib.cheat.g("qinglong");
      lib.cheat.g("bagua");
      lib.cheat.g("dilu");
      lib.cheat.g("chitu");
      lib.cheat.g("muniu");
    }
  },
  /**
   * 自己立即获得闪电，火山，洪水，乐不思蜀，鬼幽结
   */
  gj() {
    lib.cheat.g("shandian");
    lib.cheat.g("huoshan");
    lib.cheat.g("hongshui");
    lib.cheat.g("lebu");
    lib.cheat.g("bingliang");
    lib.cheat.g("guiyoujie");
  },
  /**
   * 自己立即获得所有食物牌各一张
   */
  gf() {
    for (let i in lib.card) {
      if (lib.card[i].type == "food") {
        lib.cheat.g(i);
      }
    }
  },
  /**
   * 自己立刻获取牌堆顶num张牌
   * @param { number } [num]
   * @param { Player } [target]
   */
  d(num = 1, target) {
    const cards = get.cards(num);
    for (let i = 0; i < num; i++) {
      const card = cards[i];
      game.me.node.handcards1.appendChild(card);
      delete _status.event._buttonChoice;
      delete _status.event._cardChoice;
      delete _status.event._targetChoice;
      delete _status.event._skillChoice;
      game.check();
      game.me.update();
      ui.updatehl();
    }
  },
  /**
   * 给自己立刻添加一个或多个技能
   * @param {...string} args 技能名
   */
  s(...args) {
    for (var i = 0; i < args.length; i++) {
      game.me.addSkill(args[i], true);
    }
    delete _status.event._buttonChoice;
    delete _status.event._cardChoice;
    delete _status.event._targetChoice;
    delete _status.event._skillChoice;
    game.check();
  },
  /**
   * 弃置指定位置玩家的所有牌
   *
   * 不传入num默认为弃置所有玩家的所有牌
   *
   * @param { number | Player } [num]
   */
  t(num) {
    if (game.players.includes(num)) {
      num = game.players.indexOf(num);
    }
    if (num == undefined) {
      for (let i = 0; i < game.players.length; i++) {
        lib.cheat.t(i);
      }
      return;
    }
    const player = game.players[num];
    const cards = player.getCards("hej");
    for (let i = 0; i < cards.length; i++) {
      cards[i].discard();
    }
    player.removeEquipTrigger();
    player.update();
  },
  /**
   *  自己以外的其他玩家弃置所有牌
   */
  to() {
    game.players
      .filter((player) => player != game.me)
      .forEach((_, i) => {
        lib.cheat.t(i);
      });
  },
  /**
   * 弃置自己所有牌
   */
  tm() {
    lib.cheat.t(game.me);
  },
  /**
   * 指定一个目标，弃置所有牌，血量变1，并且自己获得一张"juedou"
   * @param i 从自己开始算起，自己为0，不填默认1，即自己下家
   */
  k(i = 1) {
    game.players[i].hp = 1;
    lib.cheat.t(i);
    lib.cheat.g("juedou");
  },
  /**
   * 重新设置当前的主公的武将牌，且血量上限+1(不论当局人数是否大于3)
   * @param { string } name
   */
  z(name) {
    switch (name) {
      case "cc":
        name = "re_caocao";
        break;
      case "lb":
        name = "re_liubei";
        break;
      case "sq":
        name = "sunquan";
        break;
      case "dz":
        name = "dongzhuo";
        break;
      case "ys":
        name = "re_yuanshao";
        break;
      case "zj":
        name = "sp_zhangjiao";
        break;
      case "ls":
        name = "liushan";
        break;
      case "sc":
        name = "sunce";
        break;
      case "cp":
        name = "caopi";
        break;
      case "cr":
        name = "caorui";
        break;
      case "sx":
        name = "sunxiu";
        break;
      case "lc":
        name = "liuchen";
        break;
      case "sh":
        name = "sunhao";
        break;
    }
    game.zhu.init(name);
    game.zhu.maxHp++;
    game.zhu.hp++;
    game.zhu.update();
  },
};
