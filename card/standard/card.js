import { lib, game, ui, get, ai, _status } from "../../noname.js";

export default {
  damage: {
    ai: {
      result: {
        target: -1.5,
      },
      tag: {
        damage: 1,
      },
    },
  },
  draw: {
    ai: {
      result: {
        target: 1,
      },
      tag: {
        draw: 1,
      },
    },
  },
  losehp: {
    ai: {
      result: {
        target: -1.5,
      },
      tag: {
        loseHp: 1,
      },
    },
  },
  recover: {
    ai: {
      result: {
        target: 1.5,
      },
      tag: {
        recover: 1,
      },
    },
  },
  respondShan: {
    ai: {
      result: {
        target: -1.5,
      },
      tag: {
        respond: 1,
        respondShan: 1,
        damage: 1,
      },
    },
  },
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
  bagua: {
    fullskin: true,
    type: "equip",
    subtype: "equip2",
    bingzhu: ["诸葛亮", "黄月英", "黄承彦"],
    ai: {
      basic: {
        equipValue: 7.5,
      },
    },
    skills: ["bagua_skill"],
  },
  zhuge: {
    fullskin: true,
    type: "equip",
    subtype: "equip1",
    bingzhu: ["诸葛亮", "马钧"],
    ai: {
      order: function () {
        return get.order({ name: "sha" }) - 0.1;
      },
      equipValue: function (card, player) {
        if (player._zhuge_temp) {
          return 1;
        }
        player._zhuge_temp = true;
        var result = (function () {
          if (
            !game.hasPlayer(function (current) {
              return (
                get.distance(player, current) <= 1 &&
                player.canUse("sha", current) &&
                get.effect(current, { name: "sha" }, player, player) > 0
              );
            })
          ) {
            return 1;
          }
          if (player.hasSha() && _status.currentPhase === player) {
            if (
              (player.getEquip("zhuge") && player.countUsed("sha")) ||
              player.getCardUsable("sha") === 0
            ) {
              return 10;
            }
          }
          var num = player.countCards("h", "sha");
          if (num > 1) {
            return 6 + num;
          }
          return 3 + num;
        })();
        delete player._zhuge_temp;
        return result;
      },
      basic: {
        equipValue: 5,
      },
      tag: {
        valueswap: 1,
      },
    },
    skills: ["zhuge_skill"],
  },
  qinggang: {
    fullskin: true,
    type: "equip",
    subtype: "equip1",
    bingzhu: ["赵云", "曹操"],
    distance: {
      attackFrom: -1,
    },
    ai: {
      basic: {
        equipValue: 2,
      },
    },
    skills: ["qinggang_skill"],
  },
  qinglong: {
    fullskin: true,
    type: "equip",
    subtype: "equip1",
    bingzhu: ["关羽", "关兴", "张苞", "关银屏"],
    distance: {
      attackFrom: -2,
    },
    ai: {
      equipValue: function (card, player) {
        return Math.min(2.5 + player.countCards("h", "sha"), 4);
      },
      basic: {
        equipValue: 3.5,
      },
    },
    skills: ["qinglong_skill"],
  },
  zhangba: {
    fullskin: true,
    type: "equip",
    subtype: "equip1",
    bingzhu: ["张飞", "关兴", "张苞", "张星彩"],
    distance: {
      attackFrom: -2,
    },
    ai: {
      equipValue: function (card, player) {
        var num = 2.5 + player.countCards("h") / 3;
        return Math.min(num, 4);
      },
      basic: {
        equipValue: 3.5,
      },
    },
    skills: ["zhangba_skill"],
  },
  guanshi: {
    fullskin: true,
    type: "equip",
    subtype: "equip1",
    bingzhu: ["徐晃"],
    distance: {
      attackFrom: -2,
    },
    ai: {
      equipValue: function (card, player) {
        var num = 2.5 + (player.countCards("h") + player.countCards("e")) / 2.5;
        return Math.min(num, 5);
      },
      basic: {
        equipValue: 4.5,
      },
    },
    skills: ["guanshi_skill"],
  },
  fangtian: {
    fullskin: true,
    type: "equip",
    subtype: "equip1",
    bingzhu: ["吕布"],
    distance: {
      attackFrom: -3,
    },
    ai: {
      basic: {
        equipValue: 2.5,
      },
    },
    skills: ["fangtian_skill"],
  },
  nanman: {
    audio: true,
    fullskin: true,
    type: "trick",
    enable: true,
    selectTarget: -1,
    defaultYingbianEffect: "remove",
    filterTarget: function (card, player, target) {
      return target !== player;
    },
    reverseOrder: true,
    content: async function (event, trigger, player) {
      const target = event.target;
      if (
        typeof event.shaRequired !== "number" ||
        !event.shaRequired ||
        event.shaRequired < 0
      ) {
        event.shaRequired = 1;
      }
      if (typeof event.baseDamage !== "number") {
        event.baseDamage = 1;
      }
      while (event.shaRequired > 0) {
        let result = { bool: false };
        if (!event.directHit) {
          const next = target.chooseToRespond();
          next.set("filterCard", function (card, player) {
            if (get.name(card) !== "sha") {
              return false;
            }
            return lib.filter.cardRespondable(card, player);
          });
          if (event.shaRequired > 1) {
            next.set("prompt2", "共需打出" + event.shaRequired + "张【杀】");
          }
          next.set("ai", function (card) {
            if (get.event().toRespond) {
              return get.order(card);
            }
            return -1;
          });
          next.set(
            "toRespond",
            (() => {
              if (target.hasSkillTag("noSha", null, "respond")) {
                return false;
              }
              if (target.hasSkillTag("useSha", null, "respond")) {
                return true;
              }
              if (
                event.baseDamage <= 0 ||
                player.hasSkillTag("notricksource", null, event) ||
                target.hasSkillTag("notrick", null, event)
              ) {
                return false;
              }
              if (
                event.baseDamage >=
                target.hp +
                  (player.hasSkillTag("jueqing", false, target) ||
                  target.hasSkill("gangzhi")
                    ? 0
                    : target.hujia)
              ) {
                return true;
              }
              const damage = get.damageEffect(target, player, target);
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
                  target.mayHaveSha(target, "respond", null, "count")
              ) {
                return false;
              }
              // if (target.hasSkill("naman")) {
              // 	return true;
              // }
              return true;
            })()
          );
          next.set("respondTo", [player, event.card]);
          next.autochoose = lib.filter.autoRespondSha;
          result = await next.forResult();
        }
        if (!result?.bool) {
          await target.damage();
          break;
        } else {
          event.shaRequired--;
        }
      }
    },
    ai: {
      wuxie: function (target, card, player, viewer, status) {
        let att = get.attitude(viewer, target),
          eff = get.effect(target, card, player, target);
        if (Math.abs(att) < 1 || status * eff * att >= 0) {
          return 0;
        }
        let evt = _status.event.getParent("useCard"),
          pri = 1,
          bonus = player.hasSkillTag("damageBonus", true, {
            target: target,
            card: card,
          }),
          damage = 1,
          isZhu = function (tar) {
            return (
              tar.isZhu ||
              tar === game.boss ||
              tar === game.trueZhu ||
              tar === game.falseZhu
            );
          },
          canSha = function (tar, blur) {
            let known = tar.getKnownCards(viewer);
            if (!blur) {
              return known.some((card) => {
                let name = get.name(card, tar);
                return (
                  (name === "sha" ||
                    name === "hufu" ||
                    name === "yuchanqian") &&
                  lib.filter.cardRespondable(card, tar)
                );
              });
            }
            if (
              tar.countCards("hs", (i) => !known.includes(i)) >
              4.67 - (2 * tar.hp) / tar.maxHp
            ) {
              return true;
            }
            if (!tar.hasSkillTag("respondSha", true, "respond", true)) {
              return false;
            }
            if (tar.hp <= damage) {
              return false;
            }
            if (tar.hp <= damage + 1) {
              return isZhu(tar);
            }
            return true;
          },
          self = false;
        if (canSha(target)) {
          return 0;
        }
        if (
          bonus &&
          !viewer.hasSkillTag("filterDamage", null, {
            player: player,
            card: card,
          })
        ) {
          damage = 2;
        }
        if (
          (viewer.hp <= damage || (viewer.hp <= damage + 1 && isZhu(viewer))) &&
          !canSha(viewer)
        ) {
          if (viewer === target) {
            return status;
          }
          let fv = true;
          if (evt && evt.targets) {
            for (let i of evt.targets) {
              if (fv) {
                if (target === i) {
                  fv = false;
                }
                continue;
              }
              if (viewer === i) {
                if (isZhu(viewer)) {
                  return 0;
                }
                self = true;
                break;
              }
            }
          }
        }
        let maySha = canSha(target, true);
        if (
          bonus &&
          !target.hasSkillTag("filterDamage", null, {
            player: player,
            card: card,
          })
        ) {
          damage = 2;
        } else {
          damage = 1;
        }
        if (isZhu(target)) {
          if (eff < 0) {
            if (
              target.hp <= damage + 1 ||
              (!maySha && target.hp <= damage + 2)
            ) {
              return 1;
            }
            if (maySha && target.hp > damage + 2) {
              return 0;
            } else if (maySha || target.hp > damage + 2) {
              pri = 3;
            } else {
              pri = 4;
            }
          } else if (target.hp > damage + 1) {
            pri = 2;
          } else {
            return 0;
          }
        } else if (self) {
          return 0;
        } else if (eff < 0) {
          if (!maySha && target.hp <= damage) {
            pri = 5;
          } else if (maySha) {
            return 0;
          } else if (target.hp > damage + 1) {
            pri = 2;
          } else if (target.hp === damage + 1) {
            pri = 3;
          } else {
            pri = 4;
          }
        } else if (target.hp <= damage) {
          return 0;
        }
        let find = false;
        if (evt && evt.targets) {
          for (let i = 0; i < evt.targets.length; i++) {
            if (!find) {
              if (evt.targets[i] === target) {
                find = true;
              }
              continue;
            }
            let att1 = get.attitude(viewer, evt.targets[i]),
              eff1 = get.effect(evt.targets[i], card, player, evt.targets[i]),
              temp = 1;
            if (
              Math.abs(att1) < 1 ||
              att1 * eff1 >= 0 ||
              canSha(evt.targets[i])
            ) {
              continue;
            }
            maySha = canSha(evt.targets[i], true);
            if (
              bonus &&
              !evt.targets[i].hasSkillTag("filterDamage", null, {
                player: player,
                card: card,
              })
            ) {
              damage = 2;
            } else {
              damage = 1;
            }
            if (isZhu(evt.targets[i])) {
              if (eff1 < 0) {
                if (
                  evt.targets[i].hp <= damage + 1 ||
                  (!maySha && evt.targets[i].hp <= damage + 2)
                ) {
                  return 0;
                }
                if (maySha && evt.targets[i].hp > damage + 2) {
                  continue;
                }
                if (maySha || evt.targets[i].hp > damage + 2) {
                  temp = 3;
                } else {
                  temp = 4;
                }
              } else if (evt.targets[i].hp > damage + 1) {
                temp = 2;
              } else {
                continue;
              }
            } else if (eff1 < 0) {
              if (!maySha && evt.targets[i].hp <= damage) {
                temp = 5;
              } else if (maySha) {
                continue;
              } else if (evt.targets[i].hp > damage + 1) {
                temp = 2;
              } else if (evt.targets[i].hp === damage + 1) {
                temp = 3;
              } else {
                temp = 4;
              }
            } else if (evt.targets[i].hp > damage + 1) {
              temp = 2;
            }
            if (temp > pri) {
              return 0;
            }
          }
        }
        return 1;
      },
      basic: {
        order: 7.2,
        useful: [5, 1],
        value: 5,
      },
      result: {
        player: function (player, target) {
          if (
            player._nanman_temp ||
            player.hasSkillTag("jueqing", false, target)
          ) {
            return 0;
          }
          if (
            target.hp > 2 ||
            (target.hp > 1 &&
              !target.isZhu &&
              target !== game.boss &&
              target !== game.trueZhu &&
              target !== game.falseZhu)
          ) {
            return 0;
          }
          player._nanman_temp = true;
          let eff = get.effect(
            target,
            new lib.element.VCard({ name: "nanman" }),
            player,
            target
          );
          delete player._nanman_temp;
          if (eff >= 0) {
            return 0;
          }
          if (
            target.hp > 1 &&
            target.hasSkillTag("respondSha", true, "respond", true)
          ) {
            return 0;
          }
          let known = target.getKnownCards(player);
          if (
            known.some((card) => {
              let name = get.name(card, target);
              if (name === "sha" || name === "hufu" || name === "yuchanqian") {
                return lib.filter.cardRespondable(card, target);
              }
              if (name === "wuxie") {
                return lib.filter.cardEnabled(card, target, "forceEnable");
              }
            })
          ) {
            return 0;
          }
          if (
            target.hp > 1 ||
            target.countCards("hs", (i) => !known.includes(i)) >
              4.67 - (2 * target.hp) / target.maxHp
          ) {
            return 0;
          }
          let res = 0,
            att = get.sgnAttitude(player, target);
          res -=
            att *
            (0.8 * target.countCards("hs") +
              0.6 * target.countCards("e") +
              3.6);
          if (get.mode() === "identity" && target.identity === "fan") {
            res += 2.4;
          }
          if (
            get.mode() === "identity" &&
            player.identity === "zhu" &&
            (target.identity === "zhong" || target.identity === "mingzhong")
          ) {
            res -= 0.8 * player.countCards("he");
          }
          return res;
        },
        target: function (player, target) {
          let zhu =
            (get.mode() === "identity" && target.isZhu) ||
            target.identity === "zhu";
          if (!lib.filter.cardRespondable({ name: "sha" }, target)) {
            if (zhu) {
              if (target.hp < 2) {
                return -99;
              }
              if (target.hp === 2) {
                return -3.6;
              }
            }
            return -2;
          }
          let known = target.getKnownCards(player);
          if (
            known.some((card) => {
              let name = get.name(card, target);
              if (name === "sha" || name === "hufu" || name === "yuchanqian") {
                return lib.filter.cardRespondable(card, target);
              }
              if (name === "wuxie") {
                return lib.filter.cardEnabled(card, target, "forceEnable");
              }
            })
          ) {
            return -1.2;
          }
          let nh = target.countCards("hs", (i) => !known.includes(i));
          if (zhu && target.hp <= 1) {
            if (nh === 0) {
              return -99;
            }
            if (nh === 1) {
              return -60;
            }
            if (nh === 2) {
              return -36;
            }
            if (nh === 3) {
              return -12;
            }
            if (nh === 4) {
              return -8;
            }
            return -5;
          }
          if (target.hasSkillTag("respondSha", true, "respond", true)) {
            return -1.35;
          }
          if (!nh) {
            return -2;
          }
          if (nh === 1) {
            return -1.8;
          }
          return -1.5;
        },
      },
      tag: {
        respond: 1,
        respondSha: 1,
        damage: 1,
        multitarget: 1,
        multineg: 1,
      },
    },
  },
  wanjian: {
    audio: true,
    fullskin: true,
    type: "trick",
    enable: true,
    selectTarget: -1,
    reverseOrder: true,
    defaultYingbianEffect: "remove",
    filterTarget: function (card, player, target) {
      return target !== player;
    },
    content: async function (event, trigger, player) {
      const target = event.target;
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
      while (event.shanRequired > 0) {
        let result = { bool: false };
        if (!event.directHit) {
          const next = target.chooseToRespond();
          next.set("filterCard", function (card, player) {
            if (get.name(card) !== "shan") {
              return false;
            }
            return lib.filter.cardRespondable(card, player);
          });
          if (event.shanRequired > 1) {
            next.set("prompt2", "共需打出" + event.shanRequired + "张闪");
          }
          next.set("ai", function (card) {
            if (get.event().toRespond) {
              return get.order(card);
            }
            return -1;
          });
          next.set(
            "toRespond",
            (() => {
              if (target.hasSkillTag("noShan", null, "respond")) {
                return false;
              }
              if (target.hasSkillTag("useShan", null, "respond")) {
                return true;
              }
              if (
                event.baseDamage <= 0 ||
                player.hasSkillTag("notricksource", null, event) ||
                target.hasSkillTag("notrick", null, event)
              ) {
                return false;
              }
              if (
                event.baseDamage >=
                target.hp +
                  (player.hasSkillTag("jueqing", false, target) ||
                  target.hasSkill("gangzhi")
                    ? 0
                    : target.hujia)
              ) {
                return true;
              }
              const damage = get.damageEffect(target, player, target);
              if (damage >= 0) {
                return false;
              }
              if (
                event.shanRequired > 1 &&
                !target.hasSkillTag("freeShan", null, {
                  player: player,
                  card: event.card,
                  type: "respond",
                }) &&
                event.shanRequired >
                  target.mayHaveShan(target, "respond", null, "count")
              ) {
                return false;
              }
              return true;
            })()
          );
          next.set("respondTo", [player, event.card]);
          next.autochoose = lib.filter.autoRespondShan;
          result = await next.forResult();
        }
        if (!result?.bool) {
          await target.damage();
          break;
        } else {
          event.shanRequired--;
        }
      }
    },
    ai: {
      wuxie: function (target, card, player, viewer, status) {
        let att = get.attitude(viewer, target),
          eff = get.effect(target, card, player, target);
        if (Math.abs(att) < 1 || status * eff * att >= 0) {
          return 0;
        }
        let evt = _status.event.getParent("useCard"),
          pri = 1,
          bonus = player.hasSkillTag("damageBonus", true, {
            target: target,
            card: card,
          }),
          damage = 1,
          isZhu = function (tar) {
            return (
              tar.isZhu ||
              tar === game.boss ||
              tar === game.trueZhu ||
              tar === game.falseZhu
            );
          },
          canShan = function (tar, blur) {
            let known = tar.getKnownCards(viewer);
            if (!blur) {
              return known.some((card) => {
                let name = get.name(card, tar);
                return (
                  (name === "shan" || name === "hufu") &&
                  lib.filter.cardRespondable(card, tar)
                );
              });
            }
            if (
              tar.countCards("hs", (i) => !known.includes(i)) >
              3.67 - (2 * tar.hp) / tar.maxHp
            ) {
              return true;
            }
            if (!tar.hasSkillTag("respondShan", true, "respond", true)) {
              return false;
            }
            if (tar.hp <= damage) {
              return false;
            }
            if (tar.hp <= damage + 1) {
              return isZhu(tar);
            }
            return true;
          },
          self = false;
        if (canShan(target)) {
          return 0;
        }
        if (
          bonus &&
          !viewer.hasSkillTag("filterDamage", null, {
            player: player,
            card: card,
          })
        ) {
          damage = 2;
        }
        if (
          (viewer.hp <= damage || (viewer.hp <= damage + 1 && isZhu(viewer))) &&
          !canShan(viewer)
        ) {
          if (viewer === target) {
            return status;
          }
          let fv = true;
          if (evt && evt.targets) {
            for (let i of evt.targets) {
              if (fv) {
                if (target === i) {
                  fv = false;
                }
                continue;
              }
              if (viewer === i) {
                if (isZhu(viewer)) {
                  return 0;
                }
                self = true;
                break;
              }
            }
          }
        }
        let mayShan = canShan(target, true);
        if (
          bonus &&
          !target.hasSkillTag("filterDamage", null, {
            player: player,
            card: card,
          })
        ) {
          damage = 2;
        } else {
          damage = 1;
        }
        if (isZhu(target)) {
          if (eff < 0) {
            if (
              target.hp <= damage + 1 ||
              (!mayShan && target.hp <= damage + 2)
            ) {
              return 1;
            }
            if (mayShan && target.hp > damage + 2) {
              return 0;
            } else if (mayShan || target.hp > damage + 2) {
              pri = 3;
            } else {
              pri = 4;
            }
          } else if (target.hp > damage + 1) {
            pri = 2;
          } else {
            return 0;
          }
        } else if (self) {
          return 0;
        } else if (eff < 0) {
          if (!mayShan && target.hp <= damage) {
            pri = 5;
          } else if (mayShan) {
            return 0;
          } else if (target.hp > damage + 1) {
            pri = 2;
          } else if (target.hp === damage + 1) {
            pri = 3;
          } else {
            pri = 4;
          }
        } else if (target.hp <= damage) {
          return 0;
        }
        let find = false;
        if (evt && evt.targets) {
          for (let i = 0; i < evt.targets.length; i++) {
            if (!find) {
              if (evt.targets[i] === target) {
                find = true;
              }
              continue;
            }
            let att1 = get.attitude(viewer, evt.targets[i]),
              eff1 = get.effect(evt.targets[i], card, player, evt.targets[i]),
              temp = 1;
            if (
              Math.abs(att1) < 1 ||
              att1 * eff1 >= 0 ||
              canShan(evt.targets[i])
            ) {
              continue;
            }
            mayShan = canShan(evt.targets[i], true);
            if (
              bonus &&
              !evt.targets[i].hasSkillTag("filterDamage", null, {
                player: player,
                card: card,
              })
            ) {
              damage = 2;
            } else {
              damage = 1;
            }
            if (isZhu(evt.targets[i])) {
              if (eff1 < 0) {
                if (
                  evt.targets[i].hp <= damage + 1 ||
                  (!mayShan && evt.targets[i].hp <= damage + 2)
                ) {
                  return 0;
                }
                if (mayShan && evt.targets[i].hp > damage + 2) {
                  continue;
                }
                if (mayShan || evt.targets[i].hp > damage + 2) {
                  temp = 3;
                } else {
                  temp = 4;
                }
              } else if (evt.targets[i].hp > damage + 1) {
                temp = 2;
              } else {
                continue;
              }
            } else if (eff1 < 0) {
              if (!mayShan && evt.targets[i].hp <= damage) {
                temp = 5;
              } else if (mayShan) {
                continue;
              } else if (evt.targets[i].hp > damage + 1) {
                temp = 2;
              } else if (evt.targets[i].hp === damage + 1) {
                temp = 3;
              } else {
                temp = 4;
              }
            } else if (evt.targets[i].hp > damage + 1) {
              temp = 2;
            }
            if (temp > pri) {
              return 0;
            }
          }
        }
        return 1;
      },
      basic: {
        order: 7.2,
        useful: 1,
        value: 5,
      },
      result: {
        player: function (player, target) {
          if (
            player._wanjian_temp ||
            player.hasSkillTag("jueqing", false, target)
          ) {
            return 0;
          }
          if (
            target.hp > 2 ||
            (target.hp > 1 &&
              !target.isZhu &&
              target !== game.boss &&
              target !== game.trueZhu &&
              target !== game.falseZhu)
          ) {
            return 0;
          }
          player._wanjian_temp = true;
          let eff = get.effect(
            target,
            new lib.element.VCard({ name: "wanjian" }),
            player,
            target
          );
          delete player._wanjian_temp;
          if (eff >= 0) {
            return 0;
          }
          if (
            target.hp > 1 &&
            target.hasSkillTag("respondShan", true, "respond", true)
          ) {
            return 0;
          }
          let known = target.getKnownCards(player);
          if (
            known.some((card) => {
              let name = get.name(card, target);
              if (name === "shan" || name === "hufu") {
                return lib.filter.cardRespondable(card, target);
              }
              if (name === "wuxie") {
                return lib.filter.cardEnabled(card, target, "forceEnable");
              }
            })
          ) {
            return 0;
          }
          if (
            target.hp > 1 ||
            target.countCards("hs", (i) => !known.includes(i)) >
              3.67 - (2 * target.hp) / target.maxHp
          ) {
            return 0;
          }
          let res = 0,
            att = get.sgnAttitude(player, target);
          res -=
            att *
            (0.8 * target.countCards("hs") +
              0.6 * target.countCards("e") +
              3.6);
          if (get.mode() === "identity" && target.identity === "fan") {
            res += 2.4;
          }
          if (
            get.mode() === "identity" &&
            player.identity === "zhu" &&
            (target.identity === "zhong" || target.identity === "mingzhong")
          ) {
            res -= 0.8 * player.countCards("he");
          }
          return res;
        },
        target: function (player, target) {
          let zhu =
            (get.mode() === "identity" && target.isZhu) ||
            target.identity === "zhu";
          if (!lib.filter.cardRespondable({ name: "shan" }, target)) {
            if (zhu) {
              if (target.hp < 2) {
                return -99;
              }
              if (target.hp === 2) {
                return -3.6;
              }
            }
            return -2;
          }
          let known = target.getKnownCards(player);
          if (
            known.some((card) => {
              let name = get.name(card, target);
              if (name === "shan" || name === "hufu") {
                return lib.filter.cardRespondable(card, target);
              }
              if (name === "wuxie") {
                return lib.filter.cardEnabled(card, target, "forceEnable");
              }
            })
          ) {
            return -1.2;
          }
          let nh = target.countCards("hs", (i) => !known.includes(i));
          if (zhu && target.hp <= 1) {
            if (nh === 0) {
              return -99;
            }
            if (nh === 1) {
              return -60;
            }
            if (nh === 2) {
              return -36;
            }
            if (nh === 3) {
              return -8;
            }
            return -5;
          }
          if (target.hasSkillTag("respondShan", true, "respond", true)) {
            return -1.35;
          }
          if (!nh) {
            return -2;
          }
          if (nh === 1) {
            return -1.65;
          }
          return -1.5;
        },
      },
      tag: {
        respond: 1,
        respondShan: 1,
        damage: 1,
        multitarget: 1,
        multineg: 1,
      },
    },
  },
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
      if (get.is.versus()) {
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
      },
      tag: {
        loseCard: 1,
        gain: 1,
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
          const att = get.attitude(player, target);
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
