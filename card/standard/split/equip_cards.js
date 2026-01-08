import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export default {
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
};
