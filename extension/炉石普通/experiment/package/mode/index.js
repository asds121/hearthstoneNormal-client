import { lib, game, ui, get, ai, _status } from "../../../../../noname.js";
import * as config from "../../../../../noname/util/config.js";
import { utility } from "../../utility.js";

import { contentDivision } from "../../assembly/content.js";
import { getDivision } from "../../assembly/get.js";
import { playerDivision } from "../../assembly/player.js";

const musicItem = {
  follow: "跟随无名杀",
  random: "随机",
  "pull up a chair": "欢迎来到酒馆",
  亡き王女の为のセプテット: "亡き王女の为のセプテット",
  "エミヤ_UBW Extended": "エミヤ_UBW Extended",
  巫妖王之怒: "巫妖王之怒",
  letzteMohikaner: "最后的莫西干人",
};

export const modeName = utility.getExtensionNoun("mode");
export const modeModule = {
  name: modeName,
  splash: `${utility.extensionDirectoryPath}resource/image/${modeName}.jpg`,
  init() {
    ui.create.toast("欢迎来到艾泽拉斯的魔法世界");
  },
  startBefore() {
    if (!lib.config.hs_AlreadyPrompt) {
      console.warn(
        "如果你觉得界面很奇怪，请在菜单中点击'检验设置'按钮，然后重启！"
      );
      game.saveConfig("hs_AlreadyPrompt", true);
    } else {
      ui.create.toast("请选择你的英雄");
    }
    // console.log(get.config("HS_cardPackage"));
  },
  async start(event) {
    game.prepareArena(2);
    game.zhu = game.me.next;
    await game.countPlayer((current) => {
      current.getId();
    });
    game.me.init("hs_comp");
    game.zhu.init("hs_player");
    await game.gameDraw(game.me);
    game.phaseLoop(game.zhu);
  },
  skill: {
    // @TODO -#英雄技能模板-#被动触发
    hs_triggermb: {
      trigger: {
        player: "phaseZhunbeiBegin",
      },
      direct: true,
      nobracket: true,
      async content(event, trigger, player) {
        player.hs_use_heroskill();
      },
      ai: {
        order: 1,
        result: {
          player: 1,
        },
      },
    },
    // 英雄技能模板
    hs_mb: {
      enable: "phaseUse",
      direct: true,
      nobracket: true,
      async content(event, trigger, player) {
        player.hs_use_heroskill();
      },
      ai: {
        order: 1,
        result: {
          player: 1,
        },
      },
    },
    // 左右互搏的自动换人
    hs_autoswap: {
      trigger: {
        player: "phaseBegin",
      },
      filter(event, player) {
        var mode = get.HSF("cfg", ["HS_duelMode"]);
        if (mode == "single") {
          if (event.player != game.me) return true;
        }
      },
      silent: true,
      async content(event, trigger, player) {
        game.swapPlayer(player);
        player.addTempSkill("hs_autoswap_msk");
      },
    },
    // 移除技能时换回去
    hs_autoswap_msk: {
      onremove(player) {
        game.swapPlayer(player.getOppo());
      },
    },
    hs_surrender: {
      enable: "phaseUse",
      async content(event, trigger, player) {
        if (confirm("是否真的要投降？")) {
          // 代码修改：不直接死，等胜负判定
          game.me.istouxiang = true;
          if (event.getParent(2).name == "chooseToUse") {
            get.HSF("checkwin", [event]);
          }
        }
      },
    },
  },
  game: {
    checkResult() {
      game.over(game.me.isAlive());
    },
    hs_Music() {
      const bgm = get.HSF("cfg", ["HS_bgm"]);
      if (bgm === "follow") {
        return;
      }
      _status.tempMusic =
        bgm !== "random"
          ? `ext:${utility.getExtensionName()}/resource/audio/bgm/${bgm}.mp3`
          : Object.keys(musicItem)
              .filter((item) => item != "random" && item != "follow")
              .map(
                (item) =>
                  `ext:${utility.getExtensionName()}/resource/audio/bgm/${item}.mp3`
              );
      game.playBackgroundMusic();
    },
    swapPlayer(player, player2) {
      // 换人函数
      var swap2 = function (a, arr) {
        // 交换me和enemy的类名
        if (Array.isArray(arr)) {
          arr.forEach((name) => swap2(a, name));
        } else {
          if (Array.isArray(a)) {
            a.forEach((div) => swap2(div, arr));
          } else {
            if (a.classList.contains("me" + arr)) {
              a.classList.remove("me" + arr);
              a.classList.add("enemy" + arr);
            } else {
              a.classList.remove("enemy" + arr);
              a.classList.add("me" + arr);
            }
          }
        }
      };
      if (player2) {
        if (player == game.me) game.swapPlayer(player2);
        else if (player2 == game.me) game.swapPlayer(player);
      } else {
        if (player == game.me) return;
        if (player.isMin()) {
          get.hs_alt("game.swapPlayer:不能和随从交换控制权");
          return;
        }
        var players = game.players;
        for (let i = 0; i < players.length; i++) {
          players[i].style.transition = "all 0s";
        }
        game.addVideo(
          "swapPlayer",
          player,
          get.cardsInfo(player.getCards("h"))
        );

        _status.hsbo = !_status.hsbo;
        var num = 7;
        // 交换英雄技能、水晶、武器
        players.forEach((p) => {
          if (p.isMin()) {
            if (p.dataset.enemy == "0") p.dataset.enemy = "1";
            else p.dataset.enemy = "0";
            if (parseInt(p.dataset.position) > num)
              p.dataset.position = parseInt(p.dataset.position) - num + "";
            else p.dataset.position = parseInt(p.dataset.position) + num + "";
          } else {
            if (p == game.me) {
              p.dataset.position = "1";
            } else {
              p.dataset.position = "0";
            }
            p.heroskill.style.transition = "all 0s";
            p.mana.style.transition = "all 0s";
            if (p.data_weapon) {
              p.data_weapon.style.transition = "all 0s";
              swap2(p.data_weapon, ["wp"]);
            }
            swap2(p.heroskill, ["heroskill"]);
            swap2(p.mana, ["mana"]);
          }
        });
        get.HSF("arrange");
        // 交换敌人的手牌数显示
        var c1 = lib.hearthstone.mecard;
        lib.hearthstone.mecard = lib.hearthstone.enemycard;
        lib.hearthstone.enemycard = c1;
        var c2 = ui.hs_enemycount.querySelector(".card");
        var c3 = c2 == c1 ? lib.hearthstone.mecard : lib.hearthstone.enemycard;
        ui.hs_enemycount.removeChild(c2);
        ui.hs_enemycount.appendChild(c3);
        player.appendChild(player.node.count);
        player.node.count.className = "count";
        ui.hs_enemycount.appendChild(game.me.node.count);
        game.me.node.count.className = "ec";
        ui.hs_medeckcontainer.style.transition = "all 0s";
        ui.hs_enemydeckcontainer.style.transition = "all 0s";
        ui.hs_medeckbox.style.transition = "all 0s";
        ui.hs_enemydeckbox.style.transition = "all 0s";
        swap2(
          [ui.hs_medeckcontainer, ui.hs_enemydeckcontainer],
          "deckcontainer"
        );
        swap2([ui.hs_medeckbox, ui.hs_enemydeckbox], "deckbox");
        swap2([game.me.heroskill.pos, player.heroskill.pos], "heroskillpos");
        game.me.discardPile.classList.remove("hs_me");
        game.me.discardPile.classList.add("hs_enemy");
        player.discardPile.classList.remove("hs_enemy");
        player.discardPile.classList.add("hs_me");
        // 交换奥秘区
        game.me.secretbd.classList.remove("secretmebd");
        game.me.secretbd.classList.add("secretenemybd");
        player.secretbd.classList.remove("secretenemybd");
        player.secretbd.classList.add("secretmebd");
        if (_status.currentPhase == game.enemy) {
          ui.hs_endbtn.innerHTML = "回合结束";
          ui.hs_endbtn.classList.remove("hs_oppo");
        } else {
          ui.hs_endbtn.innerHTML = "对手回合";
          ui.hs_endbtn.classList.add("hs_oppo");
        }
        get.HSF("clickmana", [false]);
        get.HSF("arrange");

        game.me.node.handcards1.remove();
        game.me.node.handcards2.remove();
        game.enemy = game.me;
        game.me = player;
        ui.handcards1 = player.node.handcards1.addTempClass("start").fix();
        ui.handcards2 = player.node.handcards2.addTempClass("start").fix();
        ui.handcards1Container.appendChild(ui.handcards1);
        ui.handcards2Container.appendChild(ui.handcards2);

        var ele = document.querySelector("#handcards1>div");
        ele.style.transition = "all 0.5s";
        ele.towork = true;

        ui.updatehl();
      }
      if (game.me.isAlive()) {
        if (ui.auto) ui.auto.show();
        // 将transition都还原
        setTimeout(function () {
          for (let i = 0; i < players.length; i++) {
            players[i].style.transition = "";
            if (!players[i].isMin()) {
              players[i].heroskill.style.transition = "";
              players[i].mana.style.transition = "";
              if (players[i].data_weapon)
                players[i].data_weapon.style.transition = "";
            }
          }
          ui.hs_medeckcontainer.style.transition = "";
          ui.hs_enemydeckcontainer.style.transition = "";
          ui.hs_medeckbox.style.transition = "";
          ui.hs_enemydeckbox.style.transition = "";
        }, 100);
      }
    },
  },
  element: {
    card: {
      cost() {
        // 获取牌的费用
        const that = this;
        var info = get.info({
          name: that.name,
        });
        if (!info) get.hs_alt(that.name + "找不到cost");
        var cost = info.cost;
        if (cost === undefined) return 0;
        var player = get.hs_owner(that);
        if (!player) return cost;
        var buffs = that.buff
          .filter((i) => i.iswork() && i.name == "hs_cost")
          .concat(
            player
              .sctp("field")
              .reduce(
                (x, y) =>
                  x.concat(
                    y.buff.filter((i) =>
                      i.ghwork("hs_cost", null, [that, y, player])
                    )
                  ),
                []
              )
          );
        buffs.sort(lib.sort.attendseq);
        buffs.forEach((i) => {
          if (i.subtype == "final") cost = i.value;
          else {
            var vl = i.value;
            if (typeof vl == "function") vl = vl(that, cost);
            cost -= vl;
          }
        });
        if (info.changecost) cost -= info.changecost(player);
        cost = Math.max(0, cost);
        return cost;
      },
    },
    event: {
      炸服(func) {
        if (func(this)) {
          get.hs_alt("炉石普通：怀疑你在炸服，游戏强制终止");
          get.HSF("checkwin", [this, true]);
          this.finish();
          return true;
        }
      },
    },
    player: playerDivision,
    content: contentDivision,
  },
  ui: {},
  get: getDivision,
  translate: {},
  help: {},
};



_status.hsextra = [
  "经典卡背",
  "萨尔",
  "炎魔之王",
  "万圣节",
  "炫丽彩虹",
  "守望先锋",
  "虚空之遗",
  "源生法杖",
  "电竞之星",
  "冠军试炼",
  "麦迪文",
  "麦格尼",
  "奥蕾莉亚",
  "风暴英雄",
  "奈法利安",
  "黄金挑战",
  "潘达利亚",
  "新年吉祥",
  "舞狮",
  "染柒推荐",
  "甜蜜胜利",
  "神秘图纸",
  "冬幕花冠",
  "我是传说",
  "熔火之心",
  "雷霆崖",
  "炉边好友",
  "爱如空气",
  "NAXX",
  "暴雪2014",
  "暴雪2015",
  "太阳之井",
].reduce((accumulator, currentValue) => {
  accumulator[currentValue] = currentValue;
  return accumulator;
}, {});

_status.hsCardPack = [
  "怀旧经典",
  "纳克萨玛斯的诅咒",
  "黑石山的火焰",
  "地精大战侏儒",
  "冠军的试炼",
  "探险者协会",
].reduce((accumulator, currentValue) => {
  accumulator[currentValue] = currentValue;
  return accumulator;
}, {});

export default {
  extension: utility.extensionName,
  translate: utility.getExtensionNameSpace("mode"),
  connect: {},
  config: {
    HS_bgm: {
      name: "对局音乐",
      intro: "可以更改对局音乐。",
      item: musicItem,
      init: "random",
      onclick(item) {
        game.saveConfig("HS_bgm", item, modeName);
        switch (item) {
          case "follow":
            delete _status.tempMusic;
            game.playBackgroundMusic();
            break;
          case "random":
            _status.tempMusic = Object.keys(musicItem)
              .filter((key) => key !== "random" && key !== "follow")
              .map(
                (key) =>
                  `ext:${utility.extensionName}/resource/audio/bgm/${key}.mp3`
              );
            game.playBackgroundMusic();
            break;
          default:
            _status.tempMusic = `ext:${utility.extensionName}/resource/audio/bgm/${item}.mp3`;
            game.playBackgroundMusic();
            break;
        }
      },
    },
    HS_audioEffect: {
      name: "音效",
      init: true,
      intro: "设置游戏的音效",
    },
    HS_DIY: {
      name: "DIY模式",
      init: false,
      intro: "设置游戏的diy",
    },
    HS_bigImg: {
      name: "大图样式",
      init: true,
      intro: "还是看不清？试试这个！",
    },
    HS_duelMode: {
      name: "游戏模式",
      init: "legend",
      intro: "选择游戏模式",
      item: {
        testing: "测试卡效",
        legend: "炉石传说",
        single: "左右互搏",
        brawl: "乱斗模式",
        challenge: "挑战首领",
        watching: "鉴赏卡牌",
      },
      onclick(item) {
        game.saveConfig("HS_duelMode", item, modeName);
      },
    },
    HS_nobuilder: {
      name: "跳过组卡步骤",
      init: false,
      intro: "选英雄后不进入组卡界面，直接进入游戏",
    },
    HS_cardPackage: {
      name: "卡牌包",
      init: "怀旧经典",
      intro: "设置卡牌",
      item: _status.hsCardPack,
      onclick(item) {
        game.saveConfig("HS_cardPackage", item, modeName);
      },
      visualMenu(node, link, name) {
        node.style.height = `${node.offsetWidth * 1.3}px`;
        node.style.backgroundSize = "100% 100%";
        if (link === "default") {
          link = "怀旧经典";
        }
        node.classList.add("button");
        // node.setBackgroundImage(`${utility.getExtensionRelativePath("resource")}asset/cardtitle/${link}.jpg`);
      },
    },
    HS_cardback: {
      name: "卡背",
      init: "经典卡背",
      intro: "设置卡背",
      item: _status.hsextra,
      onclick(item) {
        game.saveConfig("HS_cardback", item, modeName);
      },
      visualMenu(node, link, name) {
        node.style.height = `${node.offsetWidth * 1.3}px`;
        node.style.backgroundSize = "100% 100%";
        if (link === "default") {
          link = "经典卡背";
        }
        node.className = "button character incardback";
        node.setBackgroundImage(
          `${utility.getExtensionRelativePath("resource")}asset/cardback/${link}.jpg`
        );
      },
    },
    HS_enemyCardback: {
      name: "ai卡背",
      init: "same",
      item: {
        same: "和你相同",
        random: "随机",
      },
      onclick(item) {
        game.saveConfig("HS_enemyCardback", item, modeName);
      },
    },
    HS_aichosen: {
      name: "ai选人",
      init: "random",
      intro: "ai选决斗者的倾向",
      item: {
        random: "随机",
        player: "你来选",
      },
      onclick(item) {
        game.saveConfig("HS_aichosen", item, modeName);
      },
    },
    HS_aideck: {
      name: "ai卡组",
      init: "default",
      intro: "设置ai卡组内容",
      item: {
        default: "默认卡组",
        yourdeck: "你组的卡组",
      },
      onclick(item) {
        game.saveConfig("HS_aideck", item, modeName);
      },
    },
    HS_first: {
      name: "先后攻",
      init: "random",
      intro: "决定先后攻的方法",
      item: {
        random: "随机",
        first: "先攻",
        second: "后攻",
      },
      onclick(item) {
        game.saveConfig("HS_first", item, modeName);
      },
    },
    HS_think: {
      name: "思考时间",
      init: "long",
      item: {
        fastest: "0.1秒",
        fast: "0.5秒",
        medium: "1秒",
        long: "2秒",
        slow: "3秒",
      },
      onclick(item) {
        game.saveConfig("HS_think", item, modeName);
      },
    },
    // @TODO
    HS_verifySettings: {
      name: "<button>检验设置</button>",
      clear: true,
      intro: "使游戏的设置，符合扩展的要求",
      onclick() {
        if (!lib.storage.hs_deck) {
          console.warn("检查失败，存档已清理或未进入游戏！");
          return;
        }
        // 关闭伤害抖动
        lib.config.damage_shake = false;
        // 关闭历史记录栏
        if (lib.config.show_log != "off") {
          game.saveConfig("show_log", "off");
          ui.arenalog.style.display = "none";
          ui.arenalog.innerHTML = "";
        }
        // 布局改成新版
        if (lib.config.layout != "nova") {
          game.saveConfig("layout", "nova");
          game.reload();
          return;
        }
        // 手牌显示改成默认
        ui.arena.classList.remove("oblongcard");
        ui.window.classList.remove("oblongcard");
        // 边框改成宽
        if (lib.config.player_border != "wide") {
          lib.config.player_border = "wide";
          ui.window.dataset.player_border = "wide";
        }
        // 高度改成矮
        if (lib.config.player_height != "short") {
          ui.arena.dataset.player_height_nova = "short";
          ui.arena.classList.remove("uslim_player");
          ui.arena.classList.remove("lslim_player");
          ui.arena.classList.remove("slim_player");
        }
        console.warn("设置已纠正，可以重启游戏后再进入！");
      },
    },
    HS_reset: {
      name: "<button>重置存档</button>",
      intro: "清空所有卡组数据",
      clear: true,
      onclick() {
        if (!lib.storage.hs_deck) {
          console.warn("重置失败，存档已清理或未进入游戏");
          return;
        }
        if (confirm("此操作不可逆，是否要清空所有卡组数据？")) {
          for (const i in lib.storage.hs_deck) {
            if (i.indexOf("_ai") < 0) {
              delete lib.storage.hs_deck[i];
            }
          }
          delete lib.storage.hs_deckname;
          game.save("hs_deck", lib.storage.hs_deck);
          game.save("hs_deckname", {});
          console.warn("清理成功！");
        }
      },
    },
  },
};
