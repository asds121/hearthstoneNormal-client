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
  nature: function (a, b) {
    return (lib.nature.get(b) || 0) - (lib.nature.get(a) || 0);
  },
  group: function (a, b) {
    const groupSort = function (group) {
      let base = 0;
      if (group == "wei") {
        return base;
      }
      if (group == "shu") {
        return base + 1;
      }
      if (group == "wu") {
        return base + 2;
      }
      if (group == "qun") {
        return base + 3;
      }
      if (group == "jin") {
        return base + 4;
      }
      if (group == "key") {
        return base + 5;
      }
      if (group == "western") {
        return base + 6;
      }
      if (group == "shen") {
        return base + 7;
      }
      if (group == "devil") {
        return base + 7;
      }
      if (group == "double") {
        return base + 8;
      }
      return base + 9;
    };
    return groupSort(a) - groupSort(b);
  },
  character: function (a, b) {
    const groupSort = function (name) {
      const info = get.character(name);
      if (!info) {
        return 7;
      }
      let base = 0;
      const group = info[1];
      if (group == "shen" || group == "devil") {
        return base - 1;
      }
      if (group == "wei") {
        return base;
      }
      if (group == "shu") {
        return base + 1;
      }
      if (group == "wu") {
        return base + 2;
      }
      if (group == "qun") {
        return base + 3;
      }
      if (group == "jin") {
        return base + 4;
      }
      if (group == "key") {
        return base + 5;
      }
      if (group == "western") {
        return base + 6;
      }
      return base + 7;
    };
    const del = groupSort(a) - groupSort(b);
    if (del != 0) {
      return del;
    }
    var aa = a,
      bb = b;
    var firstUnderscoreIndexA = a.indexOf("_");
    var firstUnderscoreIndexB = b.indexOf("_");
    var secondUnderscoreIndexA =
      firstUnderscoreIndexA != -1
        ? a.indexOf("_", firstUnderscoreIndexA + 1)
        : -1;
    var secondUnderscoreIndexB =
      firstUnderscoreIndexB != -1
        ? b.indexOf("_", firstUnderscoreIndexB + 1)
        : -1;

    if (secondUnderscoreIndexA != -1) {
      a = a.slice(secondUnderscoreIndexA + 1);
    } else if (firstUnderscoreIndexA != -1) {
      a = a.slice(firstUnderscoreIndexA + 1);
    }

    if (secondUnderscoreIndexB != -1) {
      b = b.slice(secondUnderscoreIndexB + 1);
    } else if (firstUnderscoreIndexB != -1) {
      b = b.slice(firstUnderscoreIndexB + 1);
    }

    if (a != b) {
      return a > b ? 1 : -1;
    }
    return aa > bb ? 1 : -1;
  },
  card: function (a, b) {
    var typeSort = function (name) {
      var type = get.type(name);
      if (!type) {
        return 10;
      }
      if (type == "basic") {
        return -1;
      }
      if (type == "trick") {
        return 0;
      }
      if (type == "delay") {
        return 1;
      }
      if (type == "equip") {
        var type2 = get.subtype(name, false);
        if (type2 && type2.slice) {
          return 1 + parseInt(type2.slice(5) || 7);
        }
        return 8.5;
      }
      return 9;
    };
    var del = typeSort(a) - typeSort(b);
    if (del != 0) {
      return del;
    }
    var aa = a,
      bb = b;
    var firstUnderscoreIndexA = a.indexOf("_");
    var firstUnderscoreIndexB = b.indexOf("_");
    var secondUnderscoreIndexA =
      firstUnderscoreIndexA != -1
        ? a.indexOf("_", firstUnderscoreIndexA + 1)
        : -1;
    var secondUnderscoreIndexB =
      firstUnderscoreIndexB != -1
        ? b.indexOf("_", firstUnderscoreIndexB + 1)
        : -1;

    if (secondUnderscoreIndexA != -1) {
      a = a.slice(secondUnderscoreIndexA + 1);
    } else if (firstUnderscoreIndexA != -1) {
      a = a.slice(firstUnderscoreIndexA + 1);
    }

    if (secondUnderscoreIndexB != -1) {
      b = b.slice(secondUnderscoreIndexB + 1);
    } else if (firstUnderscoreIndexB != -1) {
      b = b.slice(firstUnderscoreIndexB + 1);
    }

    if (a != b) {
      return a > b ? 1 : -1;
    }
    return aa > bb ? 1 : -1;
  },
  random: function () {
    return Math.random() - 0.5;
  },
  seat: function (a, b) {
    var player =
      lib.tempSortSeat || _status.event.player || game.me || game.players[0];
    var delta =
      get.distance(player, a, "absolute") - get.distance(player, b, "absolute");
    if (delta) {
      return delta;
    }
    delta = parseInt(a.dataset.position) - parseInt(b.dataset.position);
    if (player.side == game.me.side) {
      return delta;
    }
    return -delta;
  },
  position: function (a, b) {
    return parseInt(a.dataset.position) - parseInt(b.dataset.position);
  },
  priority: function (a, b) {
    var i1 = get.info(a[0]),
      i2 = get.info(b[0]);
    if (i1.priority == undefined) {
      i1.priority = 0;
    }
    if (i2.priority == undefined) {
      i2.priority = 0;
    }
    if (i1.priority == i2.priority) {
      if (i1.forced == undefined && i2.forced == undefined) {
        return 0;
      }
      if (i1.forced && i2.forced) {
        return 0;
      }
      if (i1.forced) {
        return 1;
      }
      if (i2.forced) {
        return -1;
      }
    }
    return i2.priority - i1.priority;
  },
  number: function (a, b) {
    return get.number(a) - get.number(b);
  },
  number2: function (a, b) {
    return get.number(b) - get.number(a);
  },
  capt: function (a, b) {
    var aa = a,
      bb = b;
    var firstUnderscoreIndexAA = aa.indexOf("_");
    var firstUnderscoreIndexBB = bb.indexOf("_");
    var secondUnderscoreIndexAA =
      firstUnderscoreIndexAA != -1
        ? aa.indexOf("_", firstUnderscoreIndexAA + 1)
        : -1;
    var secondUnderscoreIndexBB =
      firstUnderscoreIndexBB != -1
        ? bb.indexOf("_", firstUnderscoreIndexBB + 1)
        : -1;

    if (secondUnderscoreIndexAA != -1) {
      aa = aa.slice(secondUnderscoreIndexAA + 1);
    } else if (firstUnderscoreIndexAA != -1) {
      aa = aa.slice(firstUnderscoreIndexAA + 1);
    }

    if (secondUnderscoreIndexBB != -1) {
      bb = bb.slice(secondUnderscoreIndexBB + 1);
    } else if (firstUnderscoreIndexBB != -1) {
      bb = bb.slice(firstUnderscoreIndexBB + 1);
    }

    if (aa != bb) {
      return aa > bb ? 1 : -1;
    }
    return a > b ? 1 : -1;
  },
  name: function (a, b) {
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    return 0;
  },
};
