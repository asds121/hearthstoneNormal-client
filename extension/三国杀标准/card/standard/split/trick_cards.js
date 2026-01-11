import { lib, game, ui, get, ai, _status } from "../../../../../noname.js";

export default {
  wuzhong: {
    audio: true,
    fullskin: true,
    type: "trick",
    enable: true,
    selectTarget: -1,
    cardcolor: "red",
    toself: true,
    filterTarget: function (card, player, target) {
      return target === player;
    },
    modTarget: true,
    content: function () {
      if (get.mode() === "versus") {
        if (game.friend.includes(target)) {
          if (game.friend.length < game.enemy.length) {
            target.draw(3);
            return;
          }
        } else {
          if (game.friend.length > game.enemy.length) {
            target.draw(3);
            return;
          }
        }
      }
      target.draw(2);
    },
    ai: {
      wuxie: function (target, card, player, viewer) {
        if (target.countCards("h") * Math.max(target.hp, 5) > 6) {
          return 0;
        }
      },
      basic: {
        order: 7,
        useful: 4.5,
        value: function (card, player) {
          if (player.hp > 2) {
            return 9.2;
          }
          return 9.2 - 0.7 * Math.min(3, player.countCards("hs"));
        },
      },
      result: {
        target: 2,
      },
      tag: {
        draw: 2,
      },
    },
  },
  juedou: {
    audio: true,
    fullskin: true,
    type: "trick",
    enable: true,
    defaultYingbianEffect: "hit",
    filterTarget: function (card, player, target) {
      return target !== player;
    },
    content: async function (event, trigger, player) {
      const target = event.target;
      if (event.turn === undefined) {
        event.turn = target;
      }
      event.source = player;
      if (typeof event.baseDamage !== "number") {
        event.baseDamage = 1;
      }
      if (typeof event.extraDamage !== "number") {
        event.extraDamage = 0;
      }
      if (!event.shaReq) {
        event.shaReq = {};
      }
      if (typeof event.shaReq[player.playerid] !== "number") {
        event.shaReq[player.playerid] = 1;
      }
      if (typeof event.shaReq[target.playerid] !== "number") {
        event.shaReq[target.playerid] = 1;
      }
      event.playerCards = [];
      event.targetCards = [];
      while (true) {
        await event.trigger("juedou");
        event.shaRequired = event.shaReq[event.turn.playerid];
        let damaged = false;
        while (event.shaRequired > 0) {
          let result = { bool: false };
          if (!event.directHit) {
            const next = event.turn.chooseToRespond();
            next.set("filterCard", function (card, player) {
              if (get.name(card) !== "sha") {
                return false;
              }
              return lib.filter.cardRespondable(card, player);
            });
            if (event.shaRequired > 1) {
              next.set("prompt2", "共需打出" + event.shaRequired + "张杀");
            }
            next.set("ai", function (card) {
              if (get.event().toRespond) {
                return get.order(card);
              }
              return -1;
            });
            next.set("shaRequired", event.shaRequired);
            next.set(
              "toRespond",
              (() => {
                const responder = event.turn;
                const opposite = event.source;
                if (responder.hasSkillTag("noSha", null, "respond")) {
                  return false;
                }
                if (responder.hasSkillTag("useSha", null, "respond")) {
                  return true;
                }
                if (
                  event.baseDamage + event.extraDamage <= 0 ||
                  player.hasSkillTag("notricksource", null, event) ||
                  responder.hasSkillTag("notrick", null, event)
                ) {
                  return false;
                }
                if (
                  event.baseDamage + event.extraDamage >=
                  responder.hp +
                    (opposite.hasSkillTag("jueqing", false, target) ||
                    target.hasSkill("gangzhi")
                      ? 0
                      : target.hujia)
                ) {
                  return true;
                }
                const damage = get.damageEffect(responder, opposite, responder);
                if (damage >= 0) {
                  return false;
                }
                if (
                  event.shaRequired > 1 &&
                  !target.hasSkillTag("freeSha", null, {
                    player: player,
                    card: event.card,
                    type: "respond",
                  }) &&
                  event.shaRequired >
                    responder.mayHaveSha(responder, "respond", null, "count")
                ) {
                  return false;
                }
                if (
                  get.attitude(responder, opposite._trueMe || opposite) > 0 &&
                  damage >= get.damageEffect(opposite, responder, responder)
                ) {
                  return false;
                }
                // if (responder.hasSkill("naman")) {
                // 	return true;
                // }
                return true;
              })()
            );
            next.set("respondTo", [player, event.card]);
            next.autochoose = lib.filter.autoRespondSha;
            if (event.turn === target) {
              next.source = player;
            } else {
              next.source = target;
            }
            result = await next.forResult();
          }
          if (result?.bool) {
            event.shaRequired--;
            if (result.cards?.length) {
              if (event.turn === target) {
                event.targetCards.addArray(result.cards);
              } else {
                event.playerCards.addArray(result.cards);
              }
            }
          } else {
            await event.turn.damage(event.source);
            damaged = true;
            break;
          }
        }
        if (damaged) {
          break;
        }
        [event.source, event.turn] = [event.turn, event.source];
      }
    },
    ai: {
      wuxie: function (target, card, player, viewer, status) {
        if (
          player === game.me &&
          get.attitude(viewer, player._trueMe || player) > 0
        ) {
          return 0;
        }
        if (
          status *
            get.attitude(viewer, target) *
            get.effect(target, card, player, target) >=
          0
        ) {
          return 0;
        }
      },
      basic: {
        order: 5,
        useful: 1,
        value: 5.5,
      },
      result: {
        player: function (player, target, card) {
          if (
            player.hasSkillTag(
              "directHit_ai",
              true,
              {
                target: target,
                card: card,
              },
              true
            )
          ) {
            return 0;
          }
          if (get.damageEffect(target, player, target) >= 0) {
            return 0;
          }
          let pd = get.damageEffect(player, target, player),
            att = get.attitude(player, target);
          if (att > 0 && get.damageEffect(target, player, player) > pd) {
            return 0;
          }
          let ts = target.mayHaveSha(player, "respond", null, "count"),
            ps = player.mayHaveSha(
              player,
              "respond",
              player.getCards("h", (i) => {
                return (
                  card === i ||
                  (card.cards && card.cards.includes(i)) ||
                  ui.selected.cards.includes(i)
                );
              }),
              "count"
            );
          if (ts < 1 && ts * 8 < Math.pow(player.hp, 2)) {
            return 0;
          }
          if (att > 0) {
            if (ts < 1) {
              return 0;
            }
            return -2;
          }
          if (pd >= 0) {
            return pd / get.attitude(player, player);
          }
          if (ts - ps + Math.exp(0.8 - player.hp) < 1) {
            return -ts;
          }
          return -2 - ts;
        },
        target: function (player, target, card) {
          if (
            player.hasSkillTag(
              "directHit_ai",
              true,
              {
                target: target,
                card: card,
              },
              true
            )
          ) {
            return -2;
          }
          let td = get.damageEffect(target, player, target);
          if (td >= 0) {
            return td / get.attitude(target, target);
          }
          let pd = get.damageEffect(player, target, player),
            att = get.attitude(player, target);
          if (att > 0 && get.damageEffect(target, player, player) > pd) {
            return -2;
          }
          let ts = target.mayHaveSha(player, "respond", null, "count"),
            ps = player.mayHaveSha(
              player,
              "respond",
              player.getCards("h", (i) => {
                return (
                  card === i ||
                  (card.cards && card.cards.includes(i)) ||
                  ui.selected.cards.includes(i)
                );
              }),
              "count"
            );
          if (ts < 1) {
            return -1.5;
          }
          if (att > 0) {
            return -2;
          }
          if (pd >= 0) {
            return -1;
          }
          if (ts - ps < 1) {
            return -2 - ts;
          }
          return -ts;
        },
      },
      tag: {
        respond: 2,
        respondSha: 2,
        damage: 1,
      },
    },
  },
  shunshou: {
    audio: true,
    fullskin: true,
    type: "trick",
    enable: true,
    range: {
      global: 1,
    },
    selectTarget: 1,
    postAi: function (targets) {
      return targets.length === 1 && targets[0].countCards("j");
    },
    filterTarget: function (card, player, target) {
      if (player === target) {
        return false;
      }
      return target.hasCard(
        (card) => lib.filter.canBeGained(card, player, target),
        get.is.single() ? "he" : "hej"
      );
    },
    content: async function (event, trigger, player) {
      const target = event.target;
      let pos = get.is.single() ? "he" : "hej";
      if (target.countGainableCards(player, pos)) {
        await player
          .gainPlayerCard(pos, target, true)
          .set("target", target)
          .set("complexSelect", false)
          .set("ai", lib.card.shunshou.ai.button);
      }
    },
    ai: {
      wuxie: function (target, card, player, viewer) {
        if (
          !target.countCards("hej") ||
          get.attitude(viewer, player._trueMe || player) > 0
        ) {
          return 0;
        }
      },
      basic: {
        order: 7.5,
        useful: (card, i) => 8 / (3 + i),
        value: (card, player) => {
          let max = 0;
          game.countPlayer((cur) => {
            max = Math.max(
              max,
              lib.card.shunshou.ai.result.target(player, cur) *
                get.attitude(player, cur)
            );
          });
          if (max <= 0) {
            return 2;
          }
          return 0.53 * max;
        },
      },
      button: (button) => {
        let player = _status.event.player,
          target = _status.event.target;
        if (!lib.filter.canBeGained(button.link, player, target)) {
          return 0;
        }
        let att = get.attitude(player, target),
          val = get.value(button.link, player) / 60,
          btv = get.buttonValue(button),
          pos = get.position(button.link),
          name = get.name(button.link);
        if (pos === "j") {
          let viewAs = button.link.viewAs;
          if (viewAs === "lebu") {
            let needs = target.needsToDiscard(2);
            btv *= 1.08 + 0.2 * needs;
          } else if (viewAs === "shandian" || viewAs === "fulei") {
            btv /= 2;
          }
        }
        if (att > 0) {
          btv = -btv;
        }
        if (pos !== "e") {
          if (
            pos === "h" &&
            !player.hasSkillTag("viewHandcard", null, target, true)
          ) {
            return btv + 0.1;
          }
          return btv + val;
        }
        let sub = get.subtype(button.link);
        if (sub === "equip1") {
          return (btv * Math.min(3.6, target.hp)) / 3;
        }
        if (sub === "equip2") {
          if (name === "baiyin" && pos === "e" && target.isDamaged()) {
            let by = 3 - 0.6 * Math.min(5, target.hp);
            return get.sgn(get.recoverEffect(target, player, player)) * by;
          }
          return 1.57 * btv + val;
        }
        if (
          att <= 0 &&
          (sub === "equip3" || sub === "equip4") &&
          (player.hasSkill("shouli") || player.hasSkill("psshouli"))
        ) {
          return 0;
        }
        if (
          sub === "equip3" &&
          !game.hasPlayer(
            (cur) => !cur.inRange(target) && get.attitude(cur, target) < 0
          )
        ) {
          return 0.4 * btv + val;
        }
        if (sub === "equip4") {
          return btv / 2 + val;
        }
        return btv + val;
      },
      result: {
        player: function (player, target) {
          const hs = target.getGainableCards(player, "h");
          const es = target.getGainableCards(player, "e");
          const js = target.getGainableCards(player, "j");
          const att = get.attitude(player, target);
          if (att < 0) {
            if (
              !hs.length &&
              !es.some((card) => {
                return (
                  get.value(card, target) > 0 &&
                  card !== target.getEquip("jinhe")
                );
              }) &&
              !js.some((card) => {
                var cardj = card.viewAs ? { name: card.viewAs } : card;
                if (cardj.name === "xumou_jsrg") {
                  return true;
                }
                return get.effect(target, cardj, target, player) < 0;
              })
            ) {
              return 0;
            }
          } else if (att > 1) {
            return es.some((card) => {
              return get.value(card, target) <= 0;
            }) ||
              js.some((card) => {
                var cardj = card.viewAs ? { name: card.viewAs } : card;
                if (cardj.name === "xumou_jsrg") {
                  return false;
                }
                return get.effect(target, cardj, target, player) < 0;
              })
              ? 1.5
              : 0;
          }
          return 1;
        },
        target: function (player, target) {
          const hs = target.getGainableCards(player, "h");
          const es = target.getGainableCards(player, "e");
          const js = target.getGainableCards(player, "j");

          if (get.attitude(player, target) <= 0) {
            if (hs.length > 0) {
              return -1.5;
            }
            return es.some((card) => {
              return (
                get.value(card, target) > 0 && card !== target.getEquip("jinhe")
              );
            }) ||
              js.some((card) => {
                var cardj = card.viewAs ? { name: card.viewAs } : card;
                if (cardj.name === "xumou_jsrg") {
                  return true;
                }
                return get.effect(target, cardj, target, player) < 0;
              })
              ? -1.5
              : 1.5;
          }
          return es.some((card) => {
            return get.value(card, target) <= 0;
          }) ||
            js.some((card) => {
              var cardj = card.viewAs ? { name: card.viewAs } : card;
              if (cardj.name === "xumou_jsrg") {
                return false;
              }
              return get.effect(target, cardj, target, player) < 0;
            })
            ? 1.5
            : -1.5;
        },
      },
      tag: {
        loseCard: 1,
        gain: 1,
      },
    },
  },
  shunshou_copy: {
    ai: {
      basic: {
        order: 7.5,
        useful: 4,
        value: 9,
      },
      result: {
        target: function (player, target, card) {
          let position = "hej";
          if (card && card.position) {
            position = card.position;
          }
          const hs = position.includes("h")
            ? target.getGainableCards(player, "h")
            : [];
          const es = position.includes("e")
            ? target.getGainableCards(player, "e")
            : [];
          const js = position.includes("j")
            ? target.getGainableCards(player, "j")
            : [];
          if (get.attitude(player, target) <= 0) {
            if (hs.length > 0) {
              return -1.5;
            }
            return es.some((card) => {
              return (
                get.value(card, target) > 0 && card !== target.getEquip("jinhe")
              );
            }) ||
              js.some((card) => {
                var cardj = card.viewAs ? { name: card.viewAs } : card;
                if (cardj.name === "xumou_jsrg") {
                  return true;
                }
                return get.effect(target, cardj, target, player) < 0;
              })
              ? -1.5
              : 1.5;
          }
          return es.some((card) => {
            return get.value(card, target) <= 0;
          }) ||
            js.some((card) => {
              var cardj = card.viewAs ? { name: card.viewAs } : card;
              if (cardj.name === "xumou_jsrg") {
                return false;
              }
              return get.effect(target, cardj, target, player) < 0;
            })
            ? 1.5
            : -1.5;
        },
        player: function (player, target, card) {
          let position = "hej";
          if (card && card.position) {
            position = card.position;
          }
          const hs = position.includes("h")
            ? target.getGainableCards(player, "h")
            : [];
          const es = position.includes("e")
            ? target.getGainableCards(player, "e")
            : [];
          const js = position.includes("j")
            ? target.getGainableCards(player, "j")
            : [];
          const att = get.attitude(player, target);
          if (att < 0) {
            if (
              !hs.length &&
              !es.some((card) => {
                return (
                  get.value(card, target) > 0 &&
                  card !== target.getEquip("jinhe")
                );
              }) &&
              !js.some((card) => {
                var cardj = card.viewAs ? { name: card.viewAs } : card;
                if (cardj.name === "xumou_jsrg") {
                  return true;
                }
                return get.effect(target, cardj, target, player) < 0;
              })
            ) {
              return 0;
            }
          }
          return 1;
        },
      },
    },
  },
  shunshou_copy2: {
    ai: {
      basic: {
        order: 7.5,
        useful: 4,
        value: 9,
      },
      result: {
        target: function (player, target, card, isLink) {
          return lib.card.shunshou_copy.ai.result.target(
            player,
            target,
            {
              name: "shunshou_copy",
              position: "he",
            },
            isLink
          );
        },
        player: function (player, target, card, isLink) {
          return lib.card.shunshou_copy.ai.result.player(
            player,
            target,
            {
              name: "shunshou_copy",
              position: "he",
            },
            isLink
          );
        },
      },
      tag: {
        loseCard: 1,
        gain: 1,
      },
    },
  },
  guohe: {
    audio: true,
    fullskin: true,
    type: "trick",
    enable: true,
    selectTarget: 1,
    postAi: function (targets) {
      return targets.length === 1 && targets[0].countCards("j");
    },
    filterTarget: function (card, player, target) {
      if (player === target) {
        return false;
      }
      return target.hasCard(
        (card) => lib.filter.canBeDiscarded(card, player, target),
        get.is.single() ? "he" : "hej"
      );
    },
    defaultYingbianEffect: "add",
    content: function () {
      "step 0";
      if (get.is.single()) {
        let bool1 = target.countDiscardableCards(player, "h"),
          bool2 = target.countDiscardableCards(player, "e");
        if (bool1 && bool2) {
          player
            .chooseControl("手牌区", "装备区")
            .set("ai", function () {
              return Math.random() < 0.5 ? 1 : 0;
            })
            .set(
              "prompt",
              "弃置" +
                get.translation(target) +
                "装备区的一张牌，或观看其手牌并弃置其中的一张牌。"
            );
        } else {
          event._result = { control: bool1 ? "手牌区" : "装备区" };
        }
      } else {
        event._result = { control: "所有区域" };
      }
      ("step 1");
      let pos,
        vis = "visible";
      if (result.control === "手牌区") {
        pos = "h";
      } else if (result.control === "装备区") {
        pos = "e";
      } else {
        pos = "hej";
        vis = undefined;
      }
      if (target.countDiscardableCards(player, pos)) {
        player
          .discardPlayerCard(pos, target, true, vis)
          .set("target", target)
          .set("complexSelect", false)
          .set("ai", lib.card.guohe.ai.button);
      }
    },
    ai: {
      wuxie: (target, card, player, viewer, status) => {
        if (
          !target.countCards("hej") ||
          status * get.attitude(viewer, player._trueMe || player) > 0 ||
          (target.hp > 2 &&
            !target.hasCard((i) => {
              let val = get.value(i, target),
                subtypes = get.subtypes(i);
              if (
                val < 8 &&
                target.hp < 2 &&
                !subtypes.includes("equip2") &&
                !subtypes.includes("equip5")
              ) {
                return false;
              }
              return val > 3 + Math.min(5, target.hp);
            }, "e") &&
            target.countCards("h") * _status.event.getRand("guohe_wuxie") >
              1.57)
        ) {
          return 0;
        }
      },
      basic: {
        order: 9,
        useful: (card, i) => 10 / (3 + i),
        value: (card, player) => {
          let max = 0;
          game.countPlayer((cur) => {
            max = Math.max(
              max,
              lib.card.guohe.ai.result.target(player, cur) *
                get.attitude(player, cur)
            );
          });
          if (max <= 0) {
            return 5;
          }
          return 0.42 * max;
        },
      },
      yingbian: function (card, player, targets, viewer) {
        if (get.attitude(viewer, player) <= 0) {
          return 0;
        }
        if (
          game.hasPlayer(function (current) {
            return (
              !targets.includes(current) &&
              lib.filter.targetEnabled2(card, player, current) &&
              get.effect(current, card, player, player) > 0
            );
          })
        ) {
          return 6;
        }
        return 0;
      },
      button: (button) => {
        let player = _status.event.player,
          target = _status.event.target;
        if (!lib.filter.canBeDiscarded(button.link, player, target)) {
          return 0;
        }
        let att = get.attitude(player, target),
          val = get.buttonValue(button),
          pos = get.position(button.link),
          name = get.name(button.link);
        if (pos === "j") {
          let viewAs = button.link.viewAs;
          if (viewAs === "lebu") {
            let needs = target.needsToDiscard(2);
            val *= 1.08 + 0.2 * needs;
          } else if (viewAs === "shandian" || viewAs === "fulei") {
            val /= 2;
          }
        }
        if (att > 0) {
          val = -val;
        }
        if (pos !== "e") {
          return val;
        }
        let sub = get.subtypes(button.link);
        if (sub.includes("equip1")) {
          return (val * Math.min(3.6, target.hp)) / 3;
        }
        if (sub.includes("equip2")) {
          if (name === "baiyin" && pos === "e" && target.isDamaged()) {
            let by = 3 - 0.6 * Math.min(5, target.hp);
            return get.sgn(get.recoverEffect(target, player, player)) * by;
          }
          return 1.57 * val;
        }
        if (
          att <= 0 &&
          (sub.includes("equip3") || sub.includes("equip4")) &&
          (player.hasSkill("shouli") || player.hasSkill("psshouli"))
        ) {
          return 0;
        }
        if (sub.includes("equip6")) {
          return val;
        }
        if (sub.includes("equip4")) {
          return val / 2;
        }
        if (
          sub.includes("equip3") &&
          !game.hasPlayer((cur) => {
            return !cur.inRange(target) && get.attitude(cur, target) < 0;
          })
        ) {
          return 0.4 * val;
        }
        return val;
      },
      result: {
        target: function (player, target) {
          const att = get.attitude(player, target);
          const hs = target.getDiscardableCards(player, "h");
          const es = target.getDiscardableCards(player, "e");
          const js = target.getDiscardableCards(player, "j");
          if (!hs.length && !es.length && !js.length) {
            return 0;
          }
          if (att > 0) {
            if (
              js.some((card) => {
                const cardj = card.viewAs ? { name: card.viewAs } : card;
                if (cardj.name === "xumou_jsrg") {
                  return false;
                }
                return get.effect(target, cardj, target, player) < 0;
              })
            ) {
              return 3;
            }
            if (
              target.isDamaged() &&
              es.some((card) => card.name === "baiyin") &&
              get.recoverEffect(target, player, player) > 0
            ) {
              if (target.hp === 1 && !target.hujia) {
                return 1.6;
              }
            }
            if (
              es.some((card) => {
                return get.value(card, target) < 0;
              })
            ) {
              return 1;
            }
            return -1.5;
          } else {
            const noh = hs.length === 0 || target.hasSkillTag("noh");
            const noe = es.length === 0 || target.hasSkillTag("noe");
            const noe2 =
              noe ||
              !es.some((card) => {
                return get.value(card, target) > 0;
              });
            const noj =
              js.length === 0 ||
              !js.some((card) => {
                const cardj = card.viewAs ? { name: card.viewAs } : card;
                if (cardj.name === "xumou_jsrg") {
                  return true;
                }
                return get.effect(target, cardj, target, player) < 0;
              });
            if (noh && noe2 && noj) {
              return 1.5;
            }
            return -1.5;
          }
        },
      },
      tag: {
        loseCard: 1,
        discard: 1,
      },
    },
  },
  guohe_copy: {
    ai: {
      basic: {
        order: 9,
        useful: 5,
        value: 5,
      },
      result: {
        target: function (player, target, card) {
          let position = "hej";
          if (card && card.position) {
            position = card.position;
          }
          const hs = position.includes("h")
            ? target.getDiscardableCards(player, "h")
            : [];
          const es = position.includes("e")
            ? target.getDiscardableCards(player, "e")
            : [];
          const js = position.includes("j")
            ? target.getDiscardableCards(player, "j")
            : [];
          if (!hs.length && !es.length && !js.length) {
            return 0;
          }
          if (get.attitude(player, target) > 0) {
            if (
              js.some((card) => {
                const cardj = card.viewAs ? { name: card.viewAs } : card;
                if (cardj.name === "xumou_jsrg") {
                  return false;
                }
                return get.effect(target, cardj, target, player) < 0;
              })
            ) {
              return 3;
            }
            if (
              target.isDamaged() &&
              es.some((card) => card.name === "baiyin") &&
              get.recoverEffect(target, player, player) > 0
            ) {
              if (target.hp === 1 && !target.hujia) {
                return 1.6;
              }
            }
            if (
              es.some((card) => {
                return get.value(card, target) < 0;
              })
            ) {
              return 1;
            }
            return -1.5;
          } else {
            const noh = hs.length === 0 || target.hasSkillTag("noh");
            const noe = es.length === 0 || target.hasSkillTag("noe");
            const noe2 =
              noe ||
              !es.some((card) => {
                return get.value(card, target) > 0;
              });
            const noj =
              js.length === 0 ||
              !js.some((card) => {
                const cardj = card.viewAs ? { name: card.viewAs } : card;
                if (cardj.name === "xumou_jsrg") {
                  return true;
                }
                return get.effect(target, cardj, target, player) < 0;
              });
            if (noh && noe2 && noj) {
              return 1.5;
            }
            return -1.5;
          }
        },
      },
      tag: {
        loseCard: 1,
        discard: 1,
      },
    },
  },
  guohe_copy2: {
    ai: {
      basic: {
        order: 9,
        useful: 5,
        value: 5,
      },
      result: {
        target: function (player, target, card, isLink) {
          return lib.card.guohe_copy.ai.result.target(
            player,
            target,
            {
              name: "guohe_copy",
              position: "he",
            },
            isLink
          );
        },
      },
      tag: {
        loseCard: 1,
        discard: 1,
      },
    },
  },
};
