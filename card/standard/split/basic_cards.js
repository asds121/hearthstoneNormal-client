import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export default {
  sha: {
    audio: true,
    fullskin: true,
    type: "basic",
    enable: true,
    usable: 1,
    updateUsable: "phaseUse",
    range: function (card, player, target) {
      return player.inRange(target);
    },
    selectTarget: 1,
    cardPrompt: function (card) {
      var natures = get.natureList(Array.isArray(card) ? card[3] : card);
      if (lib.translate["sha_nature_" + natures[0] + "_info"]) {
        return lib.translate["sha_nature_" + natures[0] + "_info"];
      }
      var str = "出牌阶段，对你攻击范围内的一名角色使用。其须使用一张【闪】，";
      str += "否则你对其造成1点";
      str += "伤害。";
      return str;
    },
    filterTarget: function (card, player, target) {
      return player !== target;
    },
    content: function () {
      "step 0";
      if (
        typeof event.shanRequired !== "number" ||
        !event.shanRequired ||
        event.shanRequired < 0
      ) {
        event.shanRequired = 1;
      }
      if (typeof event.baseDamage !== "number") {
        event.baseDamage = 1;
      }
      if (typeof event.extraDamage !== "number") {
        event.extraDamage = 0;
      }
      ("step 1");
      if (
        event.directHit ||
        event.directHit2 ||
        (!_status.connectMode && lib.config.skip_shan && !target.hasShan())
      ) {
        event._result = { bool: false };
      } else if (event.skipShan) {
        event._result = { bool: true, result: "shaned" };
      } else {
        var next = target.chooseToUse("请使用一张闪响应杀");
        next.set("type", "respondShan");
        next.set("filterCard", function (card, player) {
          if (get.name(card) !== "shan") {
            return false;
          }
          return lib.filter.cardEnabled(card, player, "forceEnable");
        });
        if (event.shanRequired > 1) {
          next.set("prompt2", "（共需使用" + event.shanRequired + "张闪）");
        }
        next
          .set("ai1", function (card) {
            if (get.event().toUse) {
              return get.order(card);
            }
            return 0;
          })
          .set("shanRequired", event.shanRequired);
        next.set("respondTo", [player, card]);
        next.set(
          "toUse",
          (() => {
            if (target.hasSkillTag("noShan", null, "use")) {
              return false;
            }
            if (target.hasSkillTag("useShan", null, "use")) {
              return true;
            }
            if (
              target.isLinked() &&
              game.hasNature(event.card) &&
              game.hasPlayer((cur) => {
                if (cur === target || !cur.isLinked()) {
                  return false;
                }
                return true; //return get.attitude(target, cur) <= 0;
              })
            ) {
              if (get.attitude(target, player._trueMe || player) > 0) {
                return false;
              }
            }
            if (
              event.baseDamage + event.extraDamage <= 0 &&
              !game.hasNature(event.card, "ice")
            ) {
              return false;
            }
            if (
              get.damageEffect(
                target,
                player,
                target,
                get.nature(event.card)
              ) >= 0
            ) {
              return false;
            }
            if (
              event.baseDamage + event.extraDamage >=
              target.hp + target.hujia
            ) {
              return true;
            }
            if (
              event.shanRequired > 1 &&
              !target.hasSkillTag("freeShan", null, {
                player: player,
                card: event.card,
                type: "use",
              }) &&
              target.mayHaveShan(target, "use", true, "count") <
                event.shanRequired - (event.shanIgnored || 0)
            ) {
              return false;
            }
            return true;
          })()
        );
        //next.autochoose=lib.filter.autoRespondShan;
      }
      ("step 2");
      if (
        !result ||
        !result.bool ||
        !result.result ||
        result.result !== "shaned"
      ) {
        event.trigger("shaHit");
      } else {
        event.shanRequired--;
        if (event.shanRequired > 0) {
          event.goto(1);
        } else {
          event.trigger("shaMiss");
          event.responded = result;
        }
      }
      ("step 3");
      if (
        (!result ||
          !result.bool ||
          !result.result ||
          result.result !== "shaned") &&
        !event.unhurt
      ) {
        if (
          !event.directHit &&
          !event.directHit2 &&
          lib.filter.cardEnabled(
            new lib.element.VCard({ name: "shan" }),
            target,
            "forceEnable"
          ) &&
          target.countCards("hs") > 0 &&
          get.damageEffect(target, player, target) < 0
        ) {
          target.addGaintag(target.getCards("hs"), "sha_notshan");
        }
        target.damage(get.nature(event.card));
        event.result = { bool: true };
        event.trigger("shaDamage");
      } else {
        event.result = { bool: false };
        event.trigger("shaUnhirt");
      }
      event.finish();
      ("step 4");
      target
        .chooseToDiscard("刺杀：请弃置一张牌，否则此【杀】依然造成伤害")
        .set("ai", function (card) {
          var target = _status.event.player;
          var evt = _status.event.getParent();
          var bool = true;
          if (
            get.damageEffect(target, evt.player, target, evt.card.nature) >= 0
          ) {
            bool = false;
          }
          if (bool) {
            return 8 - get.useful(card);
          }
          return 0;
        });
      ("step 5");
      if ((!result || !result.bool) && !event.unhurt) {
        target.damage(get.nature(event.card));
        event.result = { bool: true };
        event.trigger("shaDamage");
        event.finish();
      } else {
        event.trigger("shaMiss");
      }
      ("step 6");
      if ((!result || !result.bool) && !event.unhurt) {
        target.damage(get.nature(event.card));
        event.result = { bool: true };
        event.trigger("shaDamage");
        event.finish();
      } else {
        event.result = { bool: false };
        event.trigger("shaUnhirt");
      }
    },
    ai: {
      basic: {
        useful: [5, 3, 1],
        value: [5, 3, 1],
      },
      order: function (item, player) {
        let res = 3.2;
        if (player.hasSkillTag("presha", true, null, true)) {
          res = 10;
        }
        if (
          typeof item !== "object" ||
          !game.hasNature(item, "linked") ||
          game.countPlayer((cur) => cur.isLinked()) < 2
        ) {
          return res;
        }
        //let used = player.getCardUsable('sha') - 1.5, natures = ['thunder', 'fire', 'ice', 'kami'];
        let uv = player.getUseValue(item, true);
        if (uv <= 0) {
          return res;
        }
        let temp = player.getUseValue("sha", true) - uv;
        if (temp < 0) {
          return res + 0.15;
        }
        if (temp > 0) {
          return res - 0.15;
        }
        return res;
      },
      result: {
        target: function (player, target, card, isLink) {
          let eff = -1.5,
            odds = 1.35,
            num = 1;
          if (isLink) {
            eff = isLink.eff || -2;
            odds = isLink.odds || 0.65;
            num = isLink.num || 1;
            if (
              num > 1 &&
              target.hasSkillTag("filterDamage", null, {
                player: player,
                card: card,
                jiu: player.hasSkill("jiu"),
              })
            ) {
              num = 1;
            }
            return odds * eff * num;
          }
          if (
            player.hasSkill("jiu") ||
            player.hasSkillTag("damageBonus", true, {
              target: target,
              card: card,
            })
          ) {
            if (
              target.hasSkillTag("filterDamage", null, {
                player: player,
                card: card,
                jiu: player.hasSkill("jiu"),
              })
            ) {
              eff = -0.5;
            } else {
              num = 2;
              if (get.attitude(player, target) > 0) {
                eff = -7;
              } else {
                eff = -4;
              }
            }
          }
          if (
            !player.hasSkillTag(
              "directHit_ai",
              true,
              {
                target: target,
                card: card,
              },
              true
            )
          ) {
            odds -= 0.7 * target.mayHaveShan(player, "use", true, "odds");
          }
          _status.event.putTempCache("sha_result", "eff", {
            bool: target.hp > num && get.attitude(player, target) > 0,
            card: ai.getCacheKey(card, true),
            eff: eff,
            odds: odds,
          });
          return odds * eff;
        },
      },
      tag: {
        respond: 1,
        respondShan: 1,
        damage: function (card) {
          if (game.hasNature(card, "poison")) {
            return;
          }
          return 1;
        },
        natureDamage: function (card) {
          if (game.hasNature(card, "linked")) {
            return 1;
          }
        },
        fireDamage: function (card, nature) {
          if (game.hasNature(card, "fire")) {
            return 1;
          }
        },
        thunderDamage: function (card, nature) {
          if (game.hasNature(card, "thunder")) {
            return 1;
          }
        },
        poisonDamage: function (card, nature) {
          if (game.hasNature(card, "poison")) {
            return 1;
          }
        },
      },
    },
  },
  shacopy: {
    ai: {
      basic: {
        useful: [5, 3, 1],
        value: [5, 3, 1],
      },
      order: 3,
      result: {
        target: -1.5,
      },
      tag: {
        respond: 1,
        respondShan: 1,
        damage: function (card) {
          if (game.hasNature(card, "poison")) {
            return;
          }
          return 1;
        },
      },
    },
  },
  shan: {
    audio: true,
    fullskin: true,
    type: "basic",
    cardcolor: "red",
    notarget: true,
    nodelay: true,
    defaultYingbianEffect: "draw",
    content: function () {
      event.result = "shaned";
      event.getParent().delayx = false;
      game.delay(0.5);
    },
    ai: {
      order: 3,
      basic: {
        useful: (card, i) => {
          let player = _status.event.player,
            basic = [7, 5.1, 2],
            num = basic[Math.min(2, i)];
          if (player.hp > 2 && player.hasSkillTag("maixie")) {
            num *= 0.57;
          }
          if (
            player.hasSkillTag("freeShan", false, null, true) ||
            player.getEquip("rewrite_renwang")
          ) {
            num *= 0.8;
          }
          return num;
        },
        value: [7, 5.1, 2],
      },
      result: {
        player: 1,
      },
    },
  },
  tao: {
    fullskin: true,
    type: "basic",
    cardcolor: "red",
    toself: true,
    enable: function (card, player) {
      return player.isDamaged();
    },
    savable: true,
    selectTarget: -1,
    filterTarget: function (card, player, target) {
      return target === player && target.isDamaged();
    },
    modTarget: function (card, player, target) {
      return target.isDamaged();
    },
    content: function () {
      target.recover();
    },
    ai: {
      basic: {
        order: (card, player) => {
          if (player.hasSkillTag("pretao")) {
            return 9;
          }
          return 2;
        },
        useful: (card, i) => {
          let player = _status.event.player;
          if (
            !game.checkMod(card, player, "unchanged", "cardEnabled2", player)
          ) {
            return 2 / (1 + i);
          }
          let fs = game.filterPlayer((current) => {
              return get.attitude(player, current) > 0 && current.hp <= 2;
            }),
            damaged = 0,
            needs = 0;
          fs.forEach((f) => {
            if (f.hp > 3 || !lib.filter.cardSavable(card, player, f)) {
              return;
            }
            if (f.hp > 1) {
              damaged++;
            } else {
              needs++;
            }
          });
          if (needs && damaged) {
            return 5 * needs + 3 * damaged;
          }
          if (needs + damaged > 1 || player.hasSkillTag("maixie")) {
            return 8;
          }
          if (player.hp / player.maxHp < 0.7) {
            return 7 + Math.abs(player.hp / player.maxHp - 0.5);
          }
          if (needs) {
            return 7;
          }
          if (damaged) {
            return Math.max(3, 7.8 - i);
          }
          return Math.max(1, 7.2 - i);
        },
        value: (card, player) => {
          let fs = game.filterPlayer((current) => {
              return get.attitude(_status.event.player, current) > 0;
            }),
            damaged = 0,
            needs = 0;
          fs.forEach((f) => {
            if (!player.canUse("tao", f)) {
              return;
            }
            if (f.hp <= 1) {
              needs++;
            } else if (f.hp === 2) {
              damaged++;
            }
          });
          if ((needs && damaged) || player.hasSkillTag("maixie")) {
            return Math.max(9, 5 * needs + 3 * damaged);
          }
          if (needs || damaged > 1) {
            return 8;
          }
          if (damaged) {
            return 7.5;
          }
          return Math.max(5, 9.2 - player.hp);
        },
      },
      result: {
        target: (player, target) => {
          if (target.hasSkillTag("maixie")) {
            return 3;
          }
          return 2;
        },
        target_use: (player, target, card) => {
          let mode = get.mode(),
            taos = player.getCards(
              "hs",
              (i) =>
                get.name(i) === "tao" &&
                lib.filter.cardEnabled(i, target, "forceEnable")
            );
          if (target !== _status.event.dying) {
            if (
              !player.isPhaseUsing() ||
              player.needsToDiscard(0, (i, player) => {
                return !player.canIgnoreHandcard(i) && taos.includes(i);
              }) ||
              player.hasSkillTag(
                "nokeep",
                true,
                {
                  card: card,
                  target: target,
                },
                true
              )
            ) {
              return 2;
            }
            let min = 8.1 - (4.5 * player.hp) / player.maxHp,
              nd = player.needsToDiscard(0, (i, player) => {
                return (
                  !player.canIgnoreHandcard(i) &&
                  (taos.includes(i) || get.value(i) >= min)
                );
              }),
              keep = nd ? 0 : 2;
            if (
              nd > 2 ||
              (taos.length > 1 &&
                (nd > 1 || (nd && player.hp < 1 + taos.length))) ||
              (target.identity === "zhu" &&
                (nd || target.hp < 3) &&
                (mode === "identity" ||
                  mode === "versus" ||
                  mode === "chess")) ||
              !player.hasFriend()
            ) {
              return 2;
            }
            if (
              game.hasPlayer((current) => {
                return (
                  player !== current &&
                  current.identity === "zhu" &&
                  current.hp < 3 &&
                  (mode === "identity" ||
                    mode === "versus" ||
                    mode === "chess") &&
                  get.attitude(player, current) > 0
                );
              })
            ) {
              keep = 3;
            } else if (nd === 2 || player.hp < 2) {
              return 2;
            }
            if (nd === 2 && player.hp <= 1) {
              return 2;
            }
            if (keep === 3) {
              return 0;
            }
            if (taos.length <= player.hp / 2) {
              keep = 1;
            }
            if (
              keep &&
              game.countPlayer((current) => {
                if (
                  player !== current &&
                  current.hp < 3 &&
                  player.hp > current.hp &&
                  get.attitude(player, current) > 2
                ) {
                  keep += player.hp - current.hp;
                  return true;
                }
                return false;
              })
            ) {
              if (keep > 2) {
                return 0;
              }
            }
            return 2;
          }
          if (target.isZhu2() || target === game.boss) {
            return 2;
          }
          if (player !== target) {
            if (target.hp < 0 && taos.length + target.hp <= 0) {
              return 0;
            }
            if (Math.abs(get.attitude(player, target)) < 1) {
              return 0;
            }
          }
          if (!player.getFriends().length) {
            return 2;
          }
          let tri = _status.event.getTrigger(),
            num = game.countPlayer((current) => {
              if (get.attitude(current, target) > 0) {
                return current.countCards(
                  "hs",
                  (i) =>
                    get.name(i) === "tao" &&
                    lib.filter.cardEnabled(i, target, "forceEnable")
                );
              }
            }),
            dis = 1,
            t = _status.currentPhase || game.me;
          while (t !== target) {
            let att = get.attitude(player, t);
            if (att < -2) {
              dis++;
            } else if (att < 1) {
              dis += 0.45;
            }
            t = t.next;
          }
          if (mode === "identity") {
            if (tri && tri.name === "dying") {
              if (target.identity === "fan") {
                if (
                  (!tri.source && player !== target) ||
                  (tri.source &&
                    tri.source !== target &&
                    player.getFriends().includes(tri.source.identity))
                ) {
                  if (
                    num > dis ||
                    (player === target &&
                      player.countCards("hs", { type: "basic" }) > 1.6 * dis)
                  ) {
                    return 2;
                  }
                  return 0;
                }
              } else if (
                tri.source &&
                tri.source.isZhu &&
                (target.identity === "zhong" ||
                  target.identity === "mingzhong") &&
                (tri.source.countCards("he") > 2 ||
                  (player === tri.source &&
                    player.hasCard((i) => i.name !== "tao", "he")))
              ) {
                return 2;
              }
              //if(player!==target&&!target.isZhu&&target.countCards('hs')<dis) return 0;
            }
            if (player.identity === "zhu") {
              if (
                player.hp <= 1 &&
                player !== target &&
                taos + player.countCards("hs", "jiu") <=
                  Math.min(
                    dis,
                    game.countPlayer((current) => {
                      return current.identity === "fan";
                    })
                  )
              ) {
                return 0;
              }
            }
          } else if (
            mode === "stone" &&
            target.isMin() &&
            player !== target &&
            tri &&
            tri.name === "dying" &&
            player.side === target.side &&
            tri.source !== target.getEnemy()
          ) {
            return 0;
          }
          return 2;
        },
      },
      tag: {
        recover: 1,
        save: 1,
      },
    },
  },
};
