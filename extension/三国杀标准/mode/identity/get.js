import { lib, game, ui, get, ai, _status } from "../../../../noname.js";

export default {
  rawAttitude: function (from, to) {
    var x = 0,
      num = 0,
      temp,
      i;
    if (_status.ai.customAttitude) {
      for (i = 0; i < _status.ai.customAttitude.length; i++) {
        temp = _status.ai.customAttitude[i](from, to);
        if (temp != undefined) {
          x += temp;
          num++;
        }
      }
    }
    if (num) {
      return x / num;
    }
    if (_status.mode == "purple") {
      var real = get.realAttitude(from, to);
      if (
        from == to ||
        to.identityShown ||
        (from.storage.zhibi && from.storage.zhibi.includes(to)) ||
        (_status.yeconfirm &&
          ["rYe", "bYe"].includes(to.identity) &&
          ["rYe", "bYe"].includes(to.identity))
      ) {
        return real * 1.1;
      }
      return (
        (to.ai.shown + 0.1) * real +
        (from.identity.slice(0, 1) == to.identity.slice(0, 1) ? 3 : -3) *
          (1 - to.ai.shown)
      );
    } else if (_status.mode == "stratagem") {
      var x = 0,
        num = 0,
        temp,
        i;
      if (_status.ai.customAttitude) {
        for (i = 0; i < _status.ai.customAttitude.length; i++) {
          temp = _status.ai.customAttitude[i](from, to);
          if (temp != undefined) {
            x += temp;
            num++;
          }
        }
      }
      if (num) {
        return x / num;
      }
      var real = get.realAttitude(from, to),
        zhibi = from.storage.zhibi,
        stratagem_expose = from.storage.stratagem_expose,
        followCamouflage = true;
      if (to.ai.shown) {
        return (
          to.ai.shown *
          (real +
            (from.identity == to.identity ||
            (from.identity == "zhu" && to.identity == "zhong") ||
            (from.identity == "zhong" && to.identity == "zhu") ||
            (from.identity == "nei" &&
              to.identity == "zhu" &&
              get.situation() <= 1) ||
            (to.identity == "nei" &&
              get.situation() <= 0 &&
              ["zhu", "zhong"].includes(from.identity)) ||
            (get.situation() >= 3 && from.identity == "fan")
              ? 2.9
              : -2.9))
        );
      }
      if (
        from == to ||
        to.identityShown ||
        (((stratagem_expose && stratagem_expose.includes(to)) ||
          (zhibi && zhibi.includes(to))) &&
          !to.ai.stratagemCamouflage)
      ) {
        return real * 1.1;
      }
      if (from.identity == "nei" && to.ai.stratagemCamouflage) {
        return real * 1.1;
      }
      if (to.identity == "nei") {
        if (from.identity == "fan") {
          if (get.population("zhong") == 0) {
            if (zhibi) {
              var dead = game.dead.slice();
              for (var current of dead) {
                if (
                  from.storage.zhibi.includes(current) &&
                  current.ai.stratagemCamouflage
                ) {
                  if (
                    from.storage.stratagem_expose &&
                    from.storage.stratagem_expose.includes(to)
                  ) {
                    return -7;
                  }
                }
              }
              if (zhibi.includes(to)) {
                return 3;
              }
            }
          }
        }
      }
      if (
        to.identity == "fan" &&
        from.identity == "nei" &&
        zhibi.includes(game.zhu) &&
        game.players
          .filter((i) => i != from && !zhibi.includes(i))
          .map((i) => i.identity)
          .reduce((p, c) => (!p.includes(c) ? p.push(c) && p : p), []).length ==
          1
      ) {
        return real;
      }
      for (var fan of game.dead) {
        if (fan.identity != "fan" || !fan.storage.stratagem_revitalization) {
          continue;
        }
        for (var current of fan.storage.stratagem_expose) {
          if (to == current) {
            return real;
          }
        }
      }
      if (from.identity == "fan" && to.identity == "fan") {
        if (from.ai.stratagemCamouflage) {
          var zhu =
            game.zhu && game.zhu.isZhu && game.zhu.identityShown
              ? game.zhu
              : undefined;
          if (zhu) {
            if (
              zhu.storage.stratagem_expose &&
              zhu.storage.stratagem_expose.includes(to)
            ) {
              return 0;
            }
          }
          if (zhibi && zhibi.includes(to)) {
            return -7;
          }
        }
        if (to.ai.stratagemCamouflage) {
          var zhu =
            game.zhu && game.zhu.isZhu && game.zhu.identityShown
              ? game.zhu
              : undefined;
          if (zhu) {
            if (
              zhu.storage.stratagem_expose &&
              zhu.storage.stratagem_expose.includes(to)
            ) {
              return 0;
            }
          }
          if (zhibi && zhibi.includes(to)) {
            return -7;
          }
        }
      }
      if (
        from.identity != "nei" &&
        zhibi &&
        zhibi.includes(to) &&
        !to.identityShown &&
        followCamouflage &&
        to.ai.stratagemCamouflage
      ) {
        return -5;
      }
      if (
        from.identity != "nei" &&
        stratagem_expose &&
        stratagem_expose.includes(to) &&
        !to.identityShown
      ) {
        return -5;
      }
      if (zhibi) {
        for (var to2 of zhibi) {
          if (to2.storage.stratagem_expose) {
            if (to2.ai.stratagemCamouflage) {
              for (var to3 of to2.storage.stratagem_expose) {
                if (zhibi.slice().addArray(stratagem_expose).includes(to3)) {
                  if (to == to2) {
                    return real;
                  }
                } else if (to == to3) {
                  return Math.abs(real + 10) / 10;
                }
              }
            } else {
              for (var to3 of to2.storage.stratagem_expose) {
                if (
                  !zhibi.slice().addArray(stratagem_expose).includes(to3) &&
                  to == to3
                ) {
                  return get.rawAttitude(to3, to) * Math.sign(real);
                }
              }
            }
          }
        }
      }
      return Math.max(
        -1,
        Math.min(
          -0.1,
          (-Math.min(5, to.countCards("hes") / 2 + 1) / 5 -
            Math.max(0, 5 - to.hp) / 4) /
            2
        )
      );
    }
    //正常身份模式态度
    var difficulty = 0;
    if (to == game.me) {
      difficulty = 2 - get.difficulty();
    }
    if (
      from == to ||
      to.identityShown ||
      from.storage.dongcha == to ||
      to.identityShown ||
      (from.storage.zhibi && from.storage.zhibi.includes(to))
    ) {
      return get.realAttitude(from, to) + difficulty * 1.5;
    } else {
      if (
        from.identity == "zhong" &&
        to.ai.shown == 0 &&
        from.ai.tempIgnore &&
        !from.ai.tempIgnore.includes(to)
      ) {
        for (var i = 0; i < game.players.length; i++) {
          if (
            game.players[i].ai.shown == 0 &&
            game.players[i].identity == "fan"
          ) {
            return -0.1 + difficulty * 1.5;
          }
        }
      }
      var aishown = to.ai.shown;
      if (
        (to.identity == "nei" || to.identity == "commoner") &&
        to.ai.shown < 1 &&
        (to.ai.identity_mark == "fan" || to.ai.identity_mark == "zhong")
      ) {
        aishown = 0.5;
      } else if (aishown == 0 && to.identity != "fan" && to.identity != "zhu") {
        var fanshown = true;
        for (var i = 0; i < game.players.length; i++) {
          if (
            game.players[i].identity == "fan" &&
            game.players[i].ai.shown == 0 &&
            game.players[i] != from
          ) {
            fanshown = false;
            break;
          }
        }
        if (fanshown) {
          aishown = 0.3;
        }
      }
      return get.realAttitude(from, to) * aishown + difficulty * 1.5;
    }
  },
  realAttitude: function (from, to) {
    //正常身份模式态度
    if (!game.zhu) {
      if (from.identity == to.identity) {
        return 6;
      }
      return -6;
    }
    var situation = get.situation();
    var identity = from.identity;
    var identity2 = to.identity;
    if (identity2 == "zhu" && !to.isZhu) {
      identity2 = "zhong";
      if (from == to) {
        return 10;
      }
    }
    var zhongmode = false;
    if (!game.zhu.isZhu) {
      zhongmode = true;
    }
    switch (identity) {
      case "zhu":
        switch (identity2) {
          case "zhu":
            return 10;
          case "zhong":
            return 6;
            if (game.players.length == 2) {
              return -10;
            }
            if (to.identity == "zhong") {
              return 0;
            }
            if (get.population("fan") == 0) {
              if (to.ai.identity_mark == "zhong" && to.ai.shown < 1) {
                return 0;
              }
              return -0.5;
            }
            if (zhongmode && to.ai.sizhong && to.ai.shown < 1) {
              return 6;
            }
            if (
              get.population("fan") == 1 &&
              get.population("nei") == 1 &&
              game.players.length == 3
            ) {
              var fan;
              for (var i = 0; i < game.players.length; i++) {
                if (game.players[i].identity == "fan") {
                  fan = game.players[i];
                  break;
                }
              }
              if (fan) {
                if (
                  to.hp > 1 &&
                  to.hp > fan.hp &&
                  to.countCards("he") > fan.countCards("he")
                ) {
                  return -3;
                }
              }
              return 0;
            }
            if (situation > 1) {
              return 0;
            }
            return Math.min(3, get.population("fan"));
          case "fan":
            return -4;
            if (to.identity == "zhong") {
              return 0;
            }
            if (get.population("fan") == 0) {
              if (to.ai.identity_mark == "zhong" && to.ai.shown < 1) {
                return 0;
              }
              return -0.5;
            }
            if (zhongmode && to.ai.sizhong && to.ai.shown < 1) {
              return 6;
            }
            if (game.players.length == 3) {
              var fan;
              for (var i = 0; i < game.players.length; i++) {
                if (game.players[i].identity == "fan") {
                  fan = game.players[i];
                  break;
                }
              }
              if (fan) {
                if (
                  to.hp > 1 &&
                  to.hp > fan.hp &&
                  to.countCards("he") > fan.countCards("he")
                ) {
                  return -3;
                }
              }
              return 3;
            }
            if (situation < 0 && game.zhu && game.zhu.hp <= 2) {
              return -3.8;
            }
            return Math.max(-4, 2 - get.population("fan"));
        }
        break;
      case "zhong":
        switch (identity2) {
          case "zhu":
            return 10;
          case "zhong":
            return 4;
            if (get.population("fan") == 0) {
              return -2;
            }
            if (zhongmode && to.ai.sizhong && to.ai.shown < 1) {
              return 6;
            }
            return Math.min(3, -situation);
          case "fan":
            return -8;
            return Math.min(3, Math.max(-3, situation - 0.2));
        }
        break;
        if (identity2 == "zhu" && game.players.length == 2) {
          return -10;
        }
        if (
          from != to &&
          identity2 != "zhu" &&
          identity2 != "commoner" &&
          game.players.length == 3
        ) {
          return -8;
        }
        var strategy = get.aiStrategy();
        if (strategy == 4) {
          if (from == to) {
            return 10;
          }
          return 0;
        }
        var num;
        switch (identity2) {
          case "zhu":
            if (strategy == 6) {
              return -1;
            }
            if (strategy == 5) {
              return 10;
            }
            if (to.hp <= 0) {
              return 10;
            }
            if (get.population("fan") == 1) {
              var fan;
              for (var i = 0; i < game.players.length; i++) {
                if (game.players[i].identity == "fan") {
                  fan = game.players[i];
                  break;
                }
              }
              if (fan) {
                if (
                  to.hp > 1 &&
                  to.hp > fan.hp &&
                  to.countCards("he") > fan.countCards("he")
                ) {
                  return -1.7;
                }
              }
              return 0;
            } else {
              if (situation > 1 || get.population("fan") == 0) {
                num = 0;
              } else {
                num = get.population("fan") + Math.max(0, 3 - game.zhu.hp);
              }
            }
            if (strategy == 2) {
              num--;
            }
            if (strategy == 3) {
              num++;
            }
            return num;
          case "zhong":
            if (strategy == 5) {
              return Math.min(0, -situation);
            }
            if (strategy == 6) {
              return Math.max(-1, -situation);
            }
            if (get.population("fan") == 0) {
              num = -5;
            } else if (situation <= 0) {
              num = 0;
            } else if (game.zhu && game.zhu.hp < 2) {
              num = 0;
            } else if (game.zhu && game.zhu.hp == 2) {
              num = -1;
            } else if (game.zhu && game.zhu.hp <= 2 && situation > 1) {
              num = -1;
            } else {
              num = -2;
            }
            if (zhongmode && situation < 2) {
              num = 4;
            }
            if (strategy == 2) {
              num--;
            }
            if (strategy == 3) {
              num++;
            }
            return num;
          case "mingzhong":
            if (zhongmode) {
              if (from.ai.sizhong == undefined) {
                from.ai.sizhong = Math.random() < 0.5;
              }
              if (from.ai.sizhong) {
                return 6;
              }
            }
            if (strategy == 5) {
              return Math.min(0, -situation);
            }
            if (strategy == 6) {
              return Math.max(-1, -situation);
            }
            if (get.population("fan") == 0) {
              num = -5;
            } else if (situation <= 0) {
              num = 0;
            } else {
              num = -3;
            }
            if (strategy == 2) {
              num--;
            }
            if (strategy == 3) {
              num++;
            }
            return num;
          case "nei":
            if (from == to) {
              return 10;
            }
            if (from.ai.friend.includes(to)) {
              return 5;
            }
            if (get.population("fan") + get.population("zhong") > 0) {
              return 0;
            }
            return -5;
          case "fan":
            if (strategy == 5) {
              return Math.max(-1, situation);
            }
            if (strategy == 6) {
              return Math.min(0, situation);
            }
            if (
              (game.zhu && game.zhu.hp <= 2 && situation < 0) ||
              situation < -1
            ) {
              num = -3;
            } else if (
              situation < 0 ||
              get.population("zhong") + get.population("mingzhong") == 0
            ) {
              num = -2;
            } else if (
              (game.zhu && game.zhu.hp >= 4 && situation > 0) ||
              situation > 1
            ) {
              num = 1;
            } else {
              num = 0;
            }
            if (strategy == 2) {
              num++;
            }
            if (strategy == 3) {
              num--;
            }
            return num;
          case "commoner":
            if (game.players.length <= 4) {
              return 5;
            }
            return Math.min(Math.max(-situation, -2), 2);
        }
        break;
      case "fan":
        switch (identity2) {
          case "zhu":
            if (get.population("nei") > 0) {
              if (situation == 1) {
                return -6;
              }
              if (situation > 1) {
                return -5;
              }
            }
            return -8;
          case "zhong":
            if (!zhongmode && game.zhu.hp >= 3 && to.hp == 1) {
              return -10;
            }
            return -7;
            if (zhongmode && to.ai.sizhong) {
              return -7;
            }
            if (get.population("fan") == 1) {
              return 0;
            }
            if (get.population("zhong") + get.population("mingzhong") == 0) {
              return -7;
            }
            if (game.zhu && game.zhu.hp <= 2) {
              return -1;
            }
            return Math.min(3, situation);
          case "fan":
            return 5;
            return 2 * get.population("fan") - 3;
        }
        break;
        switch (identity2) {
          case "zhu":
            if (situation > 0) {
              return 2 * Math.min(4, to.hp + to.countCards("h") / 4 - 2);
            }
            if (situation >= -3 && game.zhu) {
              return to.hp - 2 + to.countCards("h") / 4;
            } //return Math.min(-0.1,5-game.zhu.hp);
            return to.hp + to.countCards("h") / 3 - 4;
          case "zhong":
            if (situation > 0) {
              if (to.hp >= 2) {
                return Math.min(
                  3,
                  Math.max(1, to.hp + to.countCards("h") / 4 - 4)
                );
              } else {
                return 0;
              }
            }
            return -2;
          case "nei":
            if (game.players.length == 3 && get.population("nei") == 1) {
              return (
                Math.min(3.5, to.hp - 1.5 + to.countCards("h") / 3) -
                (to.hp < (game.zhu ? game.zhu.hp : 0) ? 4 : 0)
              );
            }
            if (game.players.length <= 4 && get.population("nei") == 1) {
              return Math.min(5, to.hp - 1.5 + to.countCards("h") / 3);
            }
            if (situation > 0) {
              return -3;
            }
            return 0;
          case "fan":
            if (situation < 0) {
              return (
                to.hp + to.countCards("h") / 4 - 1.7 * get.population("fan") + 2
              );
            } else if (situation == 0) {
              return 0;
            }
            return 0.55 * get.population("fan") - 2.1;
          case "commoner":
            return from == to ? 10 : to.hp <= 2 ? -2 : 0;
        }
        break;
    }
  },
  situation: function (absolute) {
    var i, j, player;
    var zhuzhong = 0,
      total = 0,
      zhu,
      fan = 0;
    for (i = 0; i < game.players.length; i++) {
      player = game.players[i];
      var php = player.hp;
      if (player.hasSkill("benghuai") && php > 4) {
        php = 4;
      } else if (php > 6) {
        php = 6;
      }
      j = player.countCards("h") + player.countCards("e") * 1.5 + php * 2;
      if (player.identity == "zhu") {
        zhuzhong += j * 1.2 + 5;
        total += j * 1.2 + 5;
        zhu = j;
      } else if (player.identity == "zhong" || player.identity == "mingzhong") {
        zhuzhong += j * 0.8 + 3;
        total += j * 0.8 + 3;
      } else if (player.identity == "fan") {
        zhuzhong -= j + 4;
        total += j + 4;
        fan += j + 4;
      }
    }
    if (absolute) {
      return zhuzhong;
    }
    var result = parseInt(10 * Math.abs(zhuzhong / total));
    if (zhuzhong < 0) {
      result = -result;
    }
    if (!game.zhong) {
      if (zhu < 12 && fan > 30) {
        result--;
      }
      if (zhu < 6 && fan > 15) {
        result--;
      }
      if (zhu < 4) {
        result--;
      }
    }
    return result;
  },
};
