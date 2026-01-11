import { lib, game, ui, get, ai, _status } from "../../../../noname.js";

export default {
  zhuge_skill: {
    equipSkill: true,
    audio: true,
    firstDo: true,
    trigger: {
      player: "useCard1",
    },
    forced: true,
    filter: function (event, player) {
      return (
        !event.audioed &&
        event.card.name === "sha" &&
        player.countUsed("sha", true) > 1 &&
        event.getParent().type === "phase"
      );
    },
    content: function () {
      trigger.audioed = true;
    },
    mod: {
      cardUsable: function (card, player, num) {
        var cards = player.getCards("e", (card) => get.name(card) == "zhuge");
        if (card.name === "sha") {
          if (
            !cards.length ||
            player.hasSkill("zhuge_skill", null, false) ||
            cards.some(
              (card) =>
                card !== _status.zhuge_temp && !ui.selected.cards.includes(card)
            )
          ) {
            if (get.mode() === "versus" || get.is.changban()) {
              return num + 3;
            }
            return Infinity;
          }
        }
      },
      cardEnabled2: function (card, player) {
        if (
          !_status.event.addCount_extra ||
          player.hasSkill("zhuge_skill", null, false)
        ) {
          return;
        }
        var cards = player.getCards("e", (card) => get.name(card) == "zhuge");
        if (card && cards.includes(card)) {
          try {
            var cardz = get.card();
          } catch (e) {
            return;
          }
          if (!cardz || cardz.name !== "sha") {
            return;
          }
          _status.zhuge_temp = card;
          var bool = lib.filter.cardUsable(
            get.autoViewAs(cardz, ui.selected.cards.concat([card])),
            player
          );
          delete _status.zhuge_temp;
          if (!bool) {
            return false;
          }
        }
      },
    },
  },
  qinggang_skill: {
    equipSkill: true,
    audio: true,
    trigger: {
      player: "useCardToPlayered",
    },
    filter: function (event) {
      return event.card.name === "sha";
    },
    forced: true,
    logTarget: "target",
    content: function () {
      trigger.target.addTempSkill("qinggang2");
      trigger.target.storage.qinggang2.add(trigger.card);
      trigger.target.markSkill("qinggang2");
    },
    ai: {
      unequip_ai: true,
      skillTagFilter: function (player, tag, arg) {
        if (arg && arg.name === "sha") {
          return true;
        }
        return false;
      },
    },
  },
  qinggang2: {
    firstDo: true,
    ai: {
      unequip2: true,
    },
    init: function (player, skill) {
      if (!player.storage[skill]) {
        player.storage[skill] = [];
      }
    },
    onremove: true,
    trigger: {
      player: ["damage", "damageCancelled", "damageZero"],
      source: ["damage", "damageCancelled", "damageZero"],
      target: [
        "shaMiss",
        "useCardToExcluded",
        "useCardToEnd",
        "eventNeutralized",
      ],
      global: ["useCardEnd"],
    },
    charlotte: true,
    filter: function (event, player) {
      const evt = event.getParent("useCard", true, true);
      if (evt && evt.effectedCount < evt.effectCount) {
        return false;
      }
      return (
        player.storage.qinggang2 &&
        event.card &&
        player.storage.qinggang2.includes(event.card) &&
        (event.name !== "damage" || event.notLink())
      );
    },
    silent: true,
    forced: true,
    popup: false,
    priority: 12,
    content: function () {
      player.storage.qinggang2.remove(trigger.card);
      if (!player.storage.qinggang2.length) {
        player.removeSkill("qinggang2");
      }
    },
    marktext: "※",
    intro: {
      content: "当前防具技能已失效",
    },
  },
  qinglong_skill: {
    audio: true,
    equipSkill: true,
    trigger: {
      player: ["shaMiss", "eventNeutralized"],
    },
    direct: true,
    filter: function (event, player) {
      if (!event.card || event.card.name !== "sha") {
        return false;
      }
      return (
        event.target.isIn() &&
        player.canUse("sha", event.target, false) &&
        (player.hasSha() || (_status.connectMode && player.countCards("hs")))
      );
    },
    content: function () {
      "step 0";
      player
        .chooseToUse(
          get.prompt("qinglong", trigger.target),
          function (card, player, event) {
            if (get.name(card) !== "sha") {
              return false;
            }
            if (!player.hasSkill("qinglong_skill", null, false)) {
              var cards = player.getCards(
                "e",
                (card) => get.name(card) == "qinglong"
              );
              if (
                !cards.some(
                  (card2) =>
                    card2 !== card && !ui.selected.cards.includes(card2)
                )
              ) {
                return false;
              }
            }
            return lib.filter.filterCard.apply(this, arguments);
          },
          trigger.target,
          -1
        )
        .set("addCount", false).logSkill = "qinglong_skill";
    },
  },
  zhangba_skill: {
    audio: true,
    equipSkill: true,
    enable: ["chooseToUse", "chooseToRespond"],
    filterCard: true,
    selectCard: 2,
    position: "hs",
    viewAs: {
      name: "sha",
    },
    complexCard: true,
    filter: function (event, player) {
      return player.countCards("hs") >= 2;
    },
    prompt: "将两张手牌当杀使用或打出",
    check: function (card) {
      let player = _status.event.player;
      if (
        player.hasCard(function (card) {
          return get.name(card) === "sha";
        })
      ) {
        return 0;
      }
      if (
        _status.event &&
        _status.event.name === "chooseToRespond" &&
        player.hp < 3 &&
        !player.countCards("hs", function (card) {
          return get.name(card) !== "tao" && get.name(card) !== "jiu";
        })
      ) {
        return (player.hp > 1 ? 10 : 8) - get.value(card);
      }
      return Math.max(5, 8 - 0.7 * player.hp) - get.value(card);
    },
    ai: {
      respondSha: true,
      skillTagFilter: function (player) {
        return player.countCards("hs") >= 2;
      },
    },
  },
  guanshi_skill: {
    equipSkill: true,
    trigger: {
      player: ["shaMiss", "eventNeutralized"],
    },
    direct: true,
    audio: true,
    filter: function (event, player) {
      if (
        event.type !== "card" ||
        event.card.name !== "sha" ||
        !event.target.isIn()
      ) {
        return false;
      }
      var min = 2;
      if (!player.hasSkill("guanshi_skill", null, false)) {
        min += get.sgn(
          player.getCards("e", (card) => get.name(card) == "guanshi").length
        );
      }
      return player.countCards("he") >= min;
    },
    content: function () {
      "step 0";
      //装备区内可能有多个贯石斧 或者玩家可能通过其他渠道获得贯石斧技能 只要留一张贯石斧不扔掉即可
      var next = player
        .chooseToDiscard(
          get.prompt("guanshi"),
          2,
          "he",
          function (card, player) {
            if (_status.event.ignoreCard) {
              return true;
            }
            var cards = player.getCards(
              "e",
              (card) => get.name(card) == "guanshi"
            );
            if (!cards.includes(card)) {
              return true;
            }
            return cards.some(
              (cardx) => cardx !== card && !ui.selected.cards.includes(cardx)
            );
          }
        )
        .set("ignoreCard", player.hasSkill("guanshi_skill", null, false))
        .set("complexCard", true);
      next.logSkill = "guanshi_skill";
      next.set("ai", function (card) {
        var evt = _status.event.getTrigger();
        if (get.attitude(evt.player, evt.target) < 0) {
          if (evt.player.needsToDiscard()) {
            return 15 - get.value(card);
          }
          if (evt.baseDamage + evt.extraDamage >= Math.min(2, evt.target.hp)) {
            return 8 - get.value(card);
          }
          return 5 - get.value(card);
        }
        return -1;
      });
      ("step 1");
      if (result.bool) {
        if (event.triggername === "shaMiss") {
          trigger.untrigger();
          trigger.trigger("shaHit");
          trigger._result.bool = false;
          trigger._result.result = null;
        } else {
          trigger.unneutralize();
        }
      }
    },
    ai: {
      directHit_ai: true,
      skillTagFilter: function (player, tag, arg) {
        if (player._guanshi_temp) {
          return;
        }
        player._guanshi_temp = true;
        var bool =
          get.attitude(player, arg.target) < 0 &&
          arg.card &&
          arg.card.name === "sha" &&
          player.countCards("he", function (card) {
            return (
              card !== player.getEquip("guanshi") &&
              card !== arg.card &&
              (!arg.card.cards || !arg.card.cards.includes(card)) &&
              get.value(card) < 5
            );
          }) > 1;
        delete player._guanshi_temp;
        return bool;
      },
    },
  },
  fangtian_skill: {
    equipSkill: true,
    audio: true,
    trigger: {
      player: "useCard1",
    },
    forced: true,
    firstDo: true,
    filter: function (event, player) {
      if (event.card.name !== "sha") {
        return false;
      }
      var card = event.card;
      var range;
      var select = get.copy(get.info(card).selectTarget);
      if (select === undefined) {
        if (get.info(card).filterTarget === undefined) {
          return false;
        }
        range = [1, 1];
      } else if (typeof select === "number") {
        range = [select, select];
      } else if (get.itemtype(select) === "select") {
        range = select;
      } else if (typeof select === "function") {
        range = select(card, player);
        if (typeof range == "number") {
          range = [range, range];
        }
      }
      game.checkMod(card, player, range, "selectTarget", player);
      return range[1] !== -1 && event.targets.length > range[1];
    },
    content: function () {},
    mod: {
      selectTarget: function (card, player, range) {
        if (card.name !== "sha") {
          return;
        }

        if (range[1] === -1) {
          return;
        }
        var cards = player.getCards("h");
        if (!cards.length) {
          return;
        }
        for (var i = 0; i < cards.length; i++) {
          if (cards[i].classList.contains("selected") === false) {
            return;
          }
        }
        range[1] += 2;
      },
    },
  },
  bagua_skill: {
    equipSkill: true,
    trigger: {
      player: ["chooseToRespondBegin", "chooseToUseBegin"],
    },
    filter: function (event, player) {
      if (event.responded) {
        return false;
      }
      if (event.bagua_skill) {
        return false;
      }
      if (
        !event.filterCard ||
        !event.filterCard({ name: "shan" }, player, event)
      ) {
        return false;
      }
      if (
        event.name === "chooseToRespond" &&
        !lib.filter.cardRespondable({ name: "shan" }, player, event)
      ) {
        return false;
      }
      if (player.hasSkillTag("unequip2")) {
        return false;
      }
      var evt = event.getParent();
      if (
        evt.player &&
        evt.player.hasSkillTag("unequip", false, {
          name: evt.card ? evt.card.name : null,
          target: player,
          card: evt.card,
        })
      ) {
        return false;
      }
      return true;
    },
    audio: true,
    check: function (event, player) {
      if (!event) {
        return true;
      }
      if (event.ai) {
        var ai = event.ai;
        var tmp = _status.event;
        _status.event = event;
        var result = ai({ name: "shan" }, _status.event.player, event);
        _status.event = tmp;
        return result > 0;
      }
      const type = event.name === "chooseToRespond" ? "respond" : "use";
      let evt = event.getParent();
      if (player.hasSkillTag("noShan", null, type)) {
        return false;
      }
      if (
        !evt ||
        !evt.card ||
        !evt.player ||
        player.hasSkillTag("useShan", null, type)
      ) {
        return true;
      }
      if (
        evt.card &&
        evt.player &&
        player.isLinked() &&
        game.hasNature(evt.card) &&
        get.attitude(player, evt.player._trueMe || evt.player) > 0
      ) {
        return false;
      }
      return true;
    },
    content: function () {
      "step 0";
      trigger.bagua_skill = true;
      player.judge("bagua", function (card) {
        return get.color(card) === "red" ? 1.5 : -0.5;
      }).judge2 = function (result) {
        return result.bool;
      };
      ("step 1");
      if (result.judge > 0) {
        trigger.untrigger();
        trigger.set("responded", true);
        trigger.result = {
          bool: true,
          card: { name: "shan", isCard: true },
        };
      }
    },
    ai: {
      respondShan: true,
      freeShan: true,
      skillTagFilter: function (player, tag, arg) {
        if (tag !== "respondShan" && tag !== "freeShan") {
          return;
        }
        if (player.hasSkillTag("unequip2")) {
          return false;
        }
        if (!arg || !arg.player) {
          return true;
        }
        if (
          arg.player.hasSkillTag("unequip", false, {
            target: player,
          })
        ) {
          return false;
        }
        return true;
      },
      effect: {
        target: function (card, player, target, effect) {
          if (target.hasSkillTag("unequip2")) {
            return;
          }
          if (
            player.hasSkillTag("unequip", false, {
              name: card ? card.name : null,
              target: target,
              card: card,
            }) ||
            player.hasSkillTag("unequip_ai", false, {
              name: card ? card.name : null,
              target: target,
              card: card,
            })
          ) {
            return;
          }
          if (get.tag(card, "respondShan")) {
            return 0.5;
          }
        },
      },
    },
  },
};
