import { lib, game, ui, get, ai, _status } from "../../noname.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
  jianxiong: {
    audio: 2,
    audioname2: { caoying: "lingren_jianxiong" },
    preHidden: true,
    trigger: { player: "damageEnd" },
    filter(event, player) {
      return (
        get.itemtype(event.cards) == "cards" &&
        get.position(event.cards[0], true) == "o"
      );
    },
    async content(event, trigger, player) {
      player.gain(trigger.cards, "gain2");
    },
    ai: {
      maixie: true,
      maixie_hp: true,
      effect: {
        target(card, player, target) {
          if (player.hasSkillTag("jueqing", false, target)) {
            return [1, -1];
          }
          if (get.tag(card, "damage")) {
            return [1, 0.55];
          }
        },
      },
    },
  },

  ganglie: {
    audio: 2,
    trigger: { player: "damageEnd" },
    filter(event, player) {
      return event.source?.isIn();
    },
    check(event, player) {
      return get.attitude(player, event.source) <= 0;
    },
    logTarget: "source",
    async content(event, trigger, player) {
      const { source } = trigger;
      const judgeEvent = player.judge((card) => {
        if (get.suit(card) == "heart") {
          return -2;
        }
        return 2;
      });
      judgeEvent.judge2 = (result) => result.bool;
      let result;
      result = await judgeEvent.forResult();
      if (!result?.bool) {
        return;
      }
      result =
        source.countCards("h") < 2
          ? { bool: false }
          : await source
              .chooseToDiscard(
                2,
                `弃置两张手牌，否则${get.translation(player)}对你造成1点伤害`
              )
              .set("ai", (card) => {
                if (card.name == "tao") {
                  return -10;
                }
                if (card.name == "jiu" && get.player().hp == 1) {
                  return -10;
                }
                return get.unuseful(card) + 2.5 * (5 - get.owner(card).hp);
              })
              .forResult();
      if (!result?.bool) {
        await source.damage();
      }
    },
    ai: {
      maixie_defend: true,
      effect: {
        target(card, player, target) {
          if (player.hasSkillTag("jueqing", false, target)) {
            return [1, -1];
          }
          return 0.8;
        },
      },
    },
  },

  zhiheng: {
    audio: 2,
    audioname: ["gz_jun_sunquan"],
    mod: {
      aiOrder(player, card, num) {
        if (
          num <= 0 ||
          get.itemtype(card) !== "card" ||
          get.type(card) !== "equip"
        ) {
          return num;
        }
        let eq = player.getEquip(get.subtype(card));
        if (
          eq &&
          get.equipValue(card) - get.equipValue(eq) <
            Math.max(1.2, 6 - player.hp)
        ) {
          return 0;
        }
      },
    },
    locked: false,
    enable: "phaseUse",
    usable: 1,
    position: "he",
    filterCard: true,
    selectCard: [1, Infinity],
    allowChooseAll: true,
    prompt: "弃置任意张牌并摸等量的牌",
    check(card) {
      let player = _status.event.player;
      if (get.position(card) == "e") {
        let subs = get.subtypes(card);
        if (subs.includes("equip2") || subs.includes("equip3")) {
          return player.getHp() - get.value(card);
        }
      }
      return 6 - get.value(card);
    },
    async content(event, trigger, player) {
      player.draw(event.cards.length);
    },
    ai: {
      order: 1,
      result: {
        player: 1,
      },
      threaten: 1.5,
    },
  },

  qixi: {
    audio: 2,
    audioname: ["re_ganning"],
    audioname2: { re_heqi: "duanbing_heqi" },
    enable: "chooseToUse",
    filterCard(card) {
      return get.color(card) == "black";
    },
    position: "hes",
    viewAs: { name: "guohe" },
    viewAsFilter(player) {
      if (!player.countCards("hes", { color: "black" })) {
        return false;
      }
    },
    prompt: "将一张黑色牌当过河拆桥使用",
    check(card) {
      return 4 - get.value(card);
    },
  },

  rende: {
    audio: 2,
    enable: "phaseUse",
    filterCard: true,
    selectCard: [1, Infinity],
    allowChooseAll: true,
    discard: false,
    lose: false,
    delay: 0,
    filterTarget(card, player, target) {
      return player != target;
    },
    check(card) {
      if (ui.selected.cards.length > 1) {
        return 0;
      }
      if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
        return 0;
      }
      if (!ui.selected.cards.length && card.name == "du") {
        return 20;
      }
      const player = get.owner(card);
      let num = 0;
      const evt2 = _status.event.getParent();
      player.getHistory("lose", (evt) => {
        if (evt.getParent().skill == "rende" && evt.getParent(3) == evt2) {
          num += evt.cards.length;
        }
      });
      if (player.hp == player.maxHp || num > 1 || player.countCards("h") <= 1) {
        if (ui.selected.cards.length) {
          return -1;
        }
        const players = game.filterPlayer();
        for (let i = 0; i < players.length; i++) {
          if (
            players[i].hasSkill("haoshi") &&
            !players[i].isTurnedOver() &&
            !players[i].hasJudge("lebu") &&
            get.attitude(player, players[i]) >= 3 &&
            get.attitude(players[i], player) >= 3
          ) {
            return 11 - get.value(card);
          }
        }
        if (player.countCards("h") > player.hp) {
          return 10 - get.value(card);
        }
        if (player.countCards("h") > 2) {
          return 6 - get.value(card);
        }
        return -1;
      }
      return 10 - get.value(card);
    },
    async content(event, trigger, player) {
      const evt2 = event.getParent(3);
      let num = 0;
      player.getHistory("lose", (evt) => {
        if (evt.getParent(2).name == "rende" && evt.getParent(5) == evt2) {
          num += evt.cards.length;
        }
      });
      player.give(event.cards, event.target);
      if (num < 2 && num + event.cards.length > 1) {
        player.recover();
      }
    },
    ai: {
      order(skill, player) {
        if (
          player.hp < player.maxHp &&
          player.storage.rende < 2 &&
          player.countCards("h") > 1
        ) {
          return 10;
        }
        return 1;
      },
      result: {
        target(player, target) {
          if (target.hasSkillTag("nogain")) {
            return 0;
          }
          if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
            return target.hasSkillTag("nodu") ? 0 : -10;
          }
          if (target.hasJudge("lebu")) {
            return 0;
          }
          const nh = target.countCards("h");
          const np = player.countCards("h");
          if (
            player.hp == player.maxHp ||
            player.storage.rende < 0 ||
            player.countCards("h") <= 1
          ) {
            if (nh >= np - 1 && np <= player.hp && !target.hasSkill("haoshi")) {
              return 0;
            }
          }
          return Math.max(1, 5 - nh);
        },
      },
      effect: {
        target_use(card, player, target) {
          if (player == target && get.type(card) == "equip") {
            if (player.countCards("e", { subtype: get.subtype(card) })) {
              const players = game.filterPlayer();
              for (let i = 0; i < players.length; i++) {
                if (
                  players[i] != player &&
                  get.attitude(player, players[i]) > 0
                ) {
                  return 0;
                }
              }
            }
          }
        },
      },
      threaten: 0.8,
    },
  },
  rende1: {
    trigger: { player: "phaseUseBegin" },
    silent: true,
    sourceSkill: "rende",
    async content(event, trigger, player) {
      player.storage.rende = 0;
    },
  },

  wusheng: {
    audio: 2,
    audioname2: {
      old_guanzhang: "wusheng_old_guanzhang",
      old_guanyu: "wusheng_re_guanyu",
      guanzhang: "wusheng_guanzhang",
      guansuo: "wusheng_guansuo",
    },
    audioname: ["re_guanyu", "jsp_guanyu", "re_guanzhang", "dc_jsp_guanyu"],
    enable: ["chooseToRespond", "chooseToUse"],
    filterCard(card, player) {
      if (get.zhu(player, "shouyue")) {
        return true;
      }
      return get.color(card) == "red";
    },
    position: "hes",
    viewAs: { name: "sha" },
    viewAsFilter(player) {
      if (get.zhu(player, "shouyue")) {
        if (!player.countCards("hes")) {
          return false;
        }
      } else {
        if (!player.countCards("hes", { color: "red" })) {
          return false;
        }
      }
    },
    prompt: "将一张红色牌当杀使用或打出",
    check(card) {
      const val = get.value(card);
      if (_status.event.name == "chooseToRespond") {
        return 1 / Math.max(0.1, val);
      }
      return 5 - val;
    },
    ai: {
      skillTagFilter(player) {
        if (get.zhu(player, "shouyue")) {
          if (!player.countCards("hes")) {
            return false;
          }
        } else {
          if (!player.countCards("hes", { color: "red" })) {
            return false;
          }
        }
      },
      respondSha: true,
    },
  },
  wusheng_re_guanyu: { audio: 2 },

  paoxiao: {
    audio: 2,
    firstDo: true,
    audioname: ["re_zhangfei", "xiahouba"],
    audioname2: {
      old_guanzhang: "paoxiao_old_guanzhang",
      guanzhang: "paoxiao_guanzhang",
    },
    trigger: { player: "useCard1" },
    forced: true,
    filter(event, player) {
      return (
        !event.audioed &&
        event.card.name == "sha" &&
        player.countUsed("sha", true) > 1 &&
        event.getParent().type == "phase"
      );
    },
    async content(event, trigger, player) {
      trigger.audioed = true;
    },
    mod: {
      cardUsable(card, player, num) {
        if (card.name == "sha") {
          return Infinity;
        }
      },
    },
    ai: {
      unequip: true,
      skillTagFilter(player, tag, arg) {
        if (!get.zhu(player, "shouyue")) {
          return false;
        }
        if (arg && arg.name == "sha") {
          return true;
        }
        return false;
      },
    },
  },
  paoxiao_xiahouba: { audio: 2 },

  longdan: {
    audio: "longdan_sha",
    audioname: ["re_zhaoyun"],
    audioname2: { old_zhaoyun: "longdan_sha_re_zhaoyun" },
    group: ["longdan_sha", "longdan_shan", "longdan_draw"],
    subSkill: {
      draw: {
        trigger: { player: ["useCard", "respond"] },
        forced: true,
        popup: false,
        filter(event, player) {
          if (!get.zhu(player, "shouyue")) {
            return false;
          }
          return event.skill == "longdan_sha" || event.skill == "longdan_shan";
        },
        async content(event, trigger, player) {
          player.draw();
          player.storage.fanghun2++;
        },
      },
      sha: {
        audio: 2,
        audioname: ["re_zhaoyun"],
        audioname2: { old_zhaoyun: "longdan_sha_re_zhaoyun" },
        enable: ["chooseToRespond", "chooseToUse"],
        filterCard: { name: "shan" },
        viewAs: { name: "sha" },
        viewAsFilter(player) {
          if (!player.countCards("hs", "shan")) {
            return false;
          }
        },
        position: "hs",
        prompt: "将一张闪当杀使用或打出",
        check() {
          return 1;
        },
        ai: {
          effect: {
            target(card, player, target, current) {
              if (get.tag(card, "respondSha") && current < 0) {
                return 0.6;
              }
            },
          },
          respondSha: true,
          skillTagFilter(player) {
            if (!player.countCards("hs", "shan")) {
              return false;
            }
          },
          order() {
            return get.order({ name: "sha" }) + 0.1;
          },
          useful: -1,
          value: -1,
        },
      },
      shan: {
        audio: "longdan_sha",
        audioname: ["re_zhaoyun"],
        audioname2: { old_zhaoyun: "longdan_sha_re_zhaoyun" },
        enable: ["chooseToRespond", "chooseToUse"],
        filterCard: { name: "sha" },
        viewAs: { name: "shan" },
        prompt: "将一张杀当闪使用或打出",
        check() {
          return 1;
        },
        position: "hs",
        viewAsFilter(player) {
          if (!player.countCards("hs", "sha")) {
            return false;
          }
        },
        ai: {
          respondShan: true,
          skillTagFilter(player) {
            if (!player.countCards("hs", "sha")) {
              return false;
            }
          },
          effect: {
            target(card, player, target, current) {
              if (get.tag(card, "respondShan") && current < 0) {
                return 0.6;
              }
            },
          },
          order: 4,
          useful: -1,
          value: -1,
        },
      },
    },
  },
  longdan_sha_re_zhaoyun: { audio: 2 },

  wushuang: {
    audio: 2,
    audioname: ["re_lvbu", "shen_lvbu", "lvlingqi"],
    audioname2: { sb_lvbu: "sbliyu_effect" },
    forced: true,
    locked: true,
    group: ["wushuang1", "wushuang2"],
    preHidden: ["wushuang1", "wushuang2"],
  },
  wushuang1: {
    audio: "wushuang",
    audioname: ["re_lvbu", "shen_lvbu", "lvlingqi"],
    audioname2: {
      sb_lvbu: "sbliyu_effect",
      gz_lvlingqi: "wushuang_lvlingqi",
    },
    trigger: { player: "useCardToPlayered" },
    forced: true,
    sourceSkill: "wushuang",
    filter(event, player) {
      return (
        event.card.name == "sha" &&
        !event.getParent().directHit.includes(event.target)
      );
    },
    logTarget: "target",
    async content(event, trigger, player) {
      const id = trigger.target.playerid;
      const map = trigger.getParent().customArgs;
      if (!map[id]) {
        map[id] = {};
      }
      if (typeof map[id].shanRequired == "number") {
        map[id].shanRequired++;
      } else {
        map[id].shanRequired = 2;
      }
    },
    ai: {
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > 1) {
          return false;
        }
      },
    },
  },
  wushuang2: {
    audio: "wushuang",
    audioname: ["re_lvbu", "shen_lvbu", "lvlingqi"],
    audioname2: {
      sb_lvbu: "sbliyu_effect",
      gz_lvlingqi: "wushuang_lvlingqi",
    },
    trigger: { player: "useCardToPlayered", target: "useCardToTargeted" },
    forced: true,
    sourceSkill: "wushuang",
    logTarget(trigger, player) {
      return player == trigger.player ? trigger.target : trigger.player;
    },
    filter(event, player) {
      return event.card.name == "juedou";
    },
    async content(event, trigger, player) {
      const id = (player == trigger.player ? trigger.target : trigger.player)[
        "playerid"
      ];
      const idt = trigger.target.playerid;
      const map = trigger.getParent().customArgs;
      if (!map[idt]) {
        map[idt] = {};
      }
      if (!map[idt].shaReq) {
        map[idt].shaReq = {};
      }
      if (!map[idt].shaReq[id]) {
        map[idt].shaReq[id] = 1;
      }
      map[idt].shaReq[id]++;
    },
    ai: {
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        if (
          arg.card.name != "juedou" ||
          Math.floor(arg.target.countCards("h", "sha") / 2) >
            player.countCards("h", "sha")
        ) {
          return false;
        }
      },
    },
  },
};

export default skills;