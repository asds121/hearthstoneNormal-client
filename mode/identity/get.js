import { lib, game, ui, get, ai, _status } from "../../noname.js";

export default {
  identityList: function (num) {
    if (num == 2) {
      return ["zhu", "fan"];
    } else if (num == 4) {
      return ["zhu", "zhong", "fan", "fan"];
    }
    return ["zhu", "zhong", "fan"];
  },
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
    if (!game.zhu) {
      if (from.identity == "nei" || to.identity == "nei") {
        return -1;
      }
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
          case "fan":
            return -4;
        }
        break;
      case "zhong":
        switch (identity2) {
          case "zhu":
            return 10;
          case "zhong":
            if (from == to) {
              return 5;
            }
            if (get.population("zhong") > 1) {
              return 3;
            }
            return 4;
          case "fan":
            return -8;
        }
        break;
      case "fan":
        switch (identity2) {
          case "zhu":
            return -8;
          case "zhong":
            return -7;
          case "fan":
            return 5;
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
      } else if (player.identity == "zhong") {
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
