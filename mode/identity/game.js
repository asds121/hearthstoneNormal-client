import { lib, game, ui, get, ai, _status } from "../../noname.js";

export default {
  canReplaceViewpoint: () => true,
  getState: function () {
    var state = {};
    for (var i in lib.playerOL) {
      var player = lib.playerOL[i];
      state[i] = { identity: player.identity };
      if (player == game.zhu) {
        state[i].zhu = true;
      }
      if (player == game.zhong) {
        state[i].zhong = true;
      }
      if (player.isZhu) {
        state[i].isZhu = true;
      }
      if (player.special_identity) {
        state[i].special_identity = player.special_identity;
      }
      state[i].shown = player.ai.shown;
    }
    return state;
  },
  updateState: function (state) {
    for (var i in state) {
      var player = lib.playerOL[i];
      if (player) {
        player.identity = state[i].identity;
        if (state[i].special_identity) {
          player.special_identity = state[i].special_identity;
          if (player.node.dieidentity) {
            player.node.dieidentity.innerHTML = get.translation(
              state[i].special_identity
            );
            player.node.identity.firstChild.innerHTML = get.translation(
              state[i].special_identity + "_bg"
            );
          }
        }
        if (state[i].zhu) {
          game.zhu = player;
        }
        if (state[i].isZhu) {
          player.isZhu = true;
        }
        if (state[i].zhong) {
          game.zhong = player;
        }
        player.ai.shown = state[i].shown;
      }
    }
  },
  getRoomInfo: function (uiintro) {
    uiintro.add('<div class="text chat">游戏模式：标准');
    uiintro.add(
      '<div class="text chat">双将模式：' +
        (lib.configOL.double_character ? "开启" : "关闭")
    );
    uiintro.add(
      '<div class="text chat">出牌时限：' + lib.configOL.choose_timeout + "秒"
    );
    if (lib.configOL.banned.length) {
      uiintro.add(
        '<div class="text chat">禁用武将：' +
          get.translation(lib.configOL.banned)
      );
    }
    if (lib.configOL.bannedcards.length) {
      uiintro.add(
        '<div class="text chat">禁用卡牌：' +
          get.translation(lib.configOL.bannedcards)
      );
    }
    var last = uiintro.add(
      '<div class="text chat">出牌时限：' + lib.configOL.choose_timeout + "秒"
    );
    last.style.paddingBottom = "8px";
  },
  getIdentityList: function (player) {
    if (player.identityShown) {
      return;
    }
    if (player == game.me) {
      return;
    }
    return {
      fan: "反",
      zhong: "忠",
      zhu: "主",
      cai: "猜",
    };
  },
  getIdentityList2: function (list) {
    for (var i in list) {
      switch (i) {
        case "fan":
          list[i] = "反贼";
          break;
        case "zhong":
          list[i] = "忠臣";
          break;
        case "zhu":
          list[i] = "主公";
          break;
        case "cai":
          list[i] = "未知";
          break;
      }
    }
  },
  getVideoName: function () {
    var str = get.translation(game.me.name);
    if (game.me.name2) {
      str += "/" + get.translation(game.me.name2);
    }
    var str2;
    str2 =
      get.cnNumber(get.playerNumber()) +
      "人身份 - " +
      lib.translate[game.me.identity + "2"];
    var name = [str, str2];
    return name;
  },
  addRecord: function (bool) {
    if (typeof bool == "boolean") {
      var data = lib.config.gameRecord.identity.data;
      var identity = game.me.identity;
      if (!data[identity]) {
        data[identity] = [0, 0];
      }
      if (bool) {
        data[identity][0]++;
      } else {
        data[identity][1]++;
      }
      var list = ["zhu", "zhong", "fan"];
      var str = "";
      for (var i = 0; i < list.length; i++) {
        if (data[list[i]]) {
          str +=
            lib.translate[list[i] + "2"] +
            "：" +
            data[list[i]][0] +
            "胜" +
            " " +
            data[list[i]][1] +
            "负<br>";
        }
      }
      lib.config.gameRecord.identity.str = str;
      game.saveConfig("gameRecord", lib.config.gameRecord);
    }
  },
  showIdentity: function (me) {
    for (var i = 0; i < game.players.length; i++) {
      game.players[i].node.identity.classList.remove("guessing");
      game.players[i].identityShown = true;
      game.players[i].ai.shown = 1;
      game.players[i].setIdentity(game.players[i].identity);
      if (game.players[i].special_identity) {
        game.players[i].node.identity.firstChild.innerHTML = get.translation(
          game.players[i].special_identity + "_bg"
        );
      }
      if (game.players[i].identity == "zhu") {
        game.players[i].isZhu = true;
      }
    }
    if (_status.clickingidentity) {
      for (var i = 0; i < _status.clickingidentity[1].length; i++) {
        _status.clickingidentity[1][i].delete();
        _status.clickingidentity[1][i].style.transform = "";
      }
      delete _status.clickingidentity;
    }
  },
  checkResult: function () {
    var me = game.me._trueMe || game.me;
    if (_status.brawl && _status.brawl.checkResult) {
      _status.brawl.checkResult();
      return;
    }
    if (!game.zhu) {
      if (get.population("fan") == 0) {
        switch (me.identity) {
          case "fan":
            game.over(false);
            break;
          case "zhong":
            game.over(true);
            break;
          default:
            game.over();
            break;
        }
      } else if (get.population("zhong") == 0) {
        switch (me.identity) {
          case "fan":
            game.over(true);
            break;
          case "zhong":
            game.over(false);
            break;
          default:
            game.over();
            break;
        }
      }
      return;
    }
    if (game.zhu.isAlive() && get.population("fan") > 0) {
      return;
    }
    if (game.zhong) {
      game.zhong.identity = "zhong";
    }
    game.showIdentity();
    if (me.identity == "zhu" || me.identity == "zhong") {
      if (game.zhu.classList.contains("dead")) {
        game.over(false);
      } else {
        game.over(true);
      }
    } else if (me.identity == "fan") {
      if (
        get.population("fan") + get.population("zhong") > 0 &&
        game.zhu.classList.contains("dead")
      ) {
        game.over(true);
      } else {
        game.over(false);
      }
    }
  },
  checkOnlineResult: function (player) {
    if (_status.winner && _status.loser) {
      if (_status.loser.length == game.players.length) {
        return null;
      }
      if (_status.loser.includes(player)) {
        return false;
      }
      if (_status.winner.includes(player)) {
        return true;
      }
    }
    if (game.zhu.isAlive()) {
      return player.identity == "zhu" || player.identity == "zhong";
    } else {
      return player.identity == "fan";
    }
  },
  chooseCharacter: function () {
    var next = game.createEvent("chooseCharacter");
    next.showConfig = true;
    next.addPlayer = function (player) {
      var list = get.identityList(game.players.length - 1);
      var list2 = get.identityList(game.players.length);
      for (var i = 0; i < list.length; i++) {
        list2.remove(list[i]);
      }
      player.identity = list2[0];
      player.setIdentity("cai");
    };
    next.removePlayer = function () {
      return game.players.randomGet(game.me, game.zhu);
    };
    next.ai = function (player, list, list2, back) {
      if (_status.brawl && _status.brawl.chooseCharacterAi) {
        if (
          _status.brawl.chooseCharacterAi(player, list, list2, back) !== false
        ) {
          return;
        }
      }
      if (player.identity == "zhu") {
        list2.randomSort();
        var choice, choice2;
        if (
          !_status.event.zhongmode &&
          Math.random() - 0.8 < 0 &&
          list2.length
        ) {
          choice = list2[0];
          choice2 = list[0];
          if (choice2 == choice) {
            choice2 = list[1];
          }
        } else {
          choice = list[0];
          choice2 = list[1];
        }
        if (
          lib.characterReplace[choice] &&
          lib.characterReplace[choice].length
        ) {
          choice = lib.characterReplace[choice].randomGet();
        }
        if (
          lib.characterReplace[choice2] &&
          lib.characterReplace[choice2].length
        ) {
          choice2 = lib.characterReplace[choice2].randomGet();
        }
        if (get.config("double_character")) {
          player.init(choice, choice2);
        } else {
          player.init(choice);
        }
        if (game.players.length > 4) {
          if (!player.isInitFilter("noZhuHp")) {
            player.hp++;
            player.maxHp++;
            player.update();
          }
        }
      } else {
        var listc = list.slice(0, 2);
        for (var i = 0; i < listc.length; i++) {
          var listx = lib.characterReplace[listc[i]];
          if (listx && listx.length) {
            listc[i] = listx.randomGet();
          }
        }
        if (get.config("double_character")) {
          player.init(listc[0], listc[1]);
        } else {
          player.init(listc[0]);
        }
      }
      if (back) {
        list.remove(get.sourceCharacter(player.name1));
        list.remove(get.sourceCharacter(player.name2));
        for (var i = 0; i < list.length; i++) {
          back.push(list[i]);
        }
      }
      if (typeof lib.config.test_game == "string" && player == game.me.next) {
        if (lib.config.test_game != "_") {
          player.init(lib.config.test_game);
        }
      }
      if (get.is.double(player.name1)) {
        player._groupChosen = "double";
        player.group = get.is.double(player.name1, true).randomGet();
        player.node.name.dataset.nature = get.groupnature(player.group);
      } else if (
        get.config("choose_group") &&
        lib.selectGroup.includes(player.group) &&
        !player.isUnseen(0)
      ) {
        player._groupChosen = "kami";
        var list = lib.group.slice(0);
        list.remove("shen");
        if (list.length) {
          player.group = (function () {
            if (_status.mode != "zhong" && game.zhu && game.zhu.group) {
              if (
                [
                  "re_zhangjiao",
                  "liubei",
                  "re_liubei",
                  "caocao",
                  "re_caocao",
                  "sunquan",
                  "re_sunquan",
                  "zhangjiao",
                  "sp_zhangjiao",
                  "caopi",
                  "re_caopi",
                  "liuchen",
                  "caorui",
                  "sunliang",
                  "sunxiu",
                  "sunce",
                  "re_sunben",
                  "ol_liushan",
                  "re_liushan",
                  "key_akane",
                  "dongzhuo",
                  "re_dongzhuo",
                  "ol_dongzhuo",
                  "jin_simashi",
                  "caomao",
                ].includes(game.zhu.name)
              ) {
                return game.zhu.group;
              }
              if (game.zhu.name == "yl_yuanshu") {
                if (player.identity == "zhong") {
                  list.remove("qun");
                } else {
                  return "qun";
                }
              }
              if (
                [
                  "sunhao",
                  "xin_yuanshao",
                  "re_yuanshao",
                  "re_sunce",
                  "ol_yuanshao",
                  "yuanshu",
                  "jin_simazhao",
                  "liubian",
                ].includes(game.zhu.name)
              ) {
                if (player.identity != "zhong") {
                  list.remove(game.zhu.group);
                } else {
                  return game.zhu.group;
                }
              }
            }
            return list.randomGet();
          })();
        }
      }
      player.node.name.dataset.nature = get.groupnature(player.group);
    };
    next.setContent(function () {
      "step 0";
      ui.arena.classList.add("choose-character");
      var i;
      var list;
      var list2 = [];
      var list3 = [];
      var list4 = [];
      var identityList;
      var chosen = lib.config.continue_name || [];
      game.saveConfig("continue_name");
      event.chosen = chosen;
      identityList = get.identityList(game.players.length);
      var addSetting = function (dialog) {
        dialog.add("选择身份").classList.add("add-setting");
        var table = document.createElement("div");
        table.classList.add("add-setting");
        table.style.margin = "0";
        table.style.width = "100%";
        table.style.position = "relative";
        var listi = ["random", "zhu", "zhong", "fan"];

        for (var i = 0; i < listi.length; i++) {
          var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
          td.link = listi[i];
          if (td.link === game.me.identity) {
            td.classList.add("bluebg");
          }
          table.appendChild(td);
          td.innerHTML = "<span>" + get.translation(listi[i] + "2") + "</span>";
          td.addEventListener(
            lib.config.touchscreen ? "touchend" : "click",
            function () {
              if (_status.dragged) {
                return;
              }
              if (_status.justdragged) {
                return;
              }
              _status.tempNoButton = true;
              setTimeout(function () {
                _status.tempNoButton = false;
              }, 500);
              var link = this.link;
              if (game.zhu) {
                if (link != "random") {
                  _status.event.parent.fixedseat = get.distance(
                    game.me,
                    game.zhu,
                    "absolute"
                  );
                }
                if (game.zhu.name) {
                  game.zhu.uninit();
                }
                delete game.zhu.isZhu;
                delete game.zhu.identityShown;
              }
              var current = this.parentNode.querySelector(".bluebg");
              if (current) {
                current.classList.remove("bluebg");
              }
              current = _status.cheat_seat || seats.querySelector(".bluebg");
              if (current) {
                current.classList.remove("bluebg");
              }
              if (link == "random") {
                var listi = ["zhu", "zhong", "fan"];
                link = listi.randomGet();
                for (var i = 0; i < this.parentNode.childElementCount; i++) {
                  if (this.parentNode.childNodes[i].link == link) {
                    this.parentNode.childNodes[i].classList.add("bluebg");
                  }
                }
              } else {
                this.classList.add("bluebg");
              }
              num = get.config("choice_" + link);
              _status.event.parent.swapnodialog = function (dialog, list) {
                var buttons = ui.create.div(".buttons");
                var node = dialog.buttons[0].parentNode;
                dialog.buttons = ui.create.buttons(list, "characterx", buttons);
                dialog.content.insertBefore(buttons, node);
                buttons.addTempClass("start");
                node.remove();
                game.uncheck();
                game.check();
                for (var i = 0; i < seats.childElementCount; i++) {
                  if (
                    get.distance(game.zhu, game.me, "absolute") ===
                    seats.childNodes[i].link
                  ) {
                    seats.childNodes[i].classList.add("bluebg");
                  }
                }
              };
              _status.event = _status.event.parent;
              _status.event.step = 0;
              _status.event.identity = link;
              if (ui.selected.buttons.length > 0) {
                ui.selected.buttons.forEach(function (button) {
                  if (button && button.parentNode) {
                    button.classList.remove("selected");
                  }
                });
                ui.selected.buttons.length = 0;
              }
              if (link != "zhu") {
                seats.previousSibling.style.display = "";
                seats.style.display = "";
              } else {
                seats.previousSibling.style.display = "none";
                seats.style.display = "none";
              }
              game.resume();
            }
          );
        }
        dialog.content.appendChild(table);

        dialog.add("选择座位").classList.add("add-setting");
        var seats = document.createElement("div");
        seats.classList.add("add-setting");
        seats.style.margin = "0";
        seats.style.width = "100%";
        seats.style.position = "relative";
        for (var i = 2; i <= game.players.length; i++) {
          var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
          td.innerHTML = get.cnNumber(i, true);
          td.link = i - 1;
          seats.appendChild(td);
          if (get.distance(game.zhu, game.me, "absolute") === i - 1) {
            td.classList.add("bluebg");
          }
          td.addEventListener(
            lib.config.touchscreen ? "touchend" : "click",
            function () {
              if (_status.dragged) {
                return;
              }
              if (_status.justdragged) {
                return;
              }
              if (_status.cheat_seat) {
                _status.cheat_seat.classList.remove("bluebg");
                if (_status.cheat_seat == this) {
                  delete _status.cheat_seat;
                  return;
                }
              }
              if (get.distance(game.zhu, game.me, "absolute") == this.link) {
                return;
              }
              var current = this.parentNode.querySelector(".bluebg");
              if (current) {
                current.classList.remove("bluebg");
              }
              this.classList.add("bluebg");
              for (var i = 0; i < game.players.length; i++) {
                if (
                  get.distance(game.players[i], game.me, "absolute") ==
                  this.link
                ) {
                  game.swapSeat(game.zhu, game.players[i], false);
                  return;
                }
              }
            }
          );
        }
        dialog.content.appendChild(seats);
        if (game.me == game.zhu) {
          seats.previousSibling.style.display = "none";
          seats.style.display = "none";
        }

        dialog.add(ui.create.div(".placeholder.add-setting"));
        dialog.add(ui.create.div(".placeholder.add-setting"));
        if (get.is.phoneLayout()) {
          dialog.add(ui.create.div(".placeholder.add-setting"));
        }
      };
      var removeSetting = function () {
        var dialog = _status.event.dialog;
        if (dialog) {
          dialog.style.height = "";
          delete dialog._scrollset;
          var list = Array.from(dialog.querySelectorAll(".add-setting"));
          while (list.length) {
            list.shift().remove();
          }
          ui.update();
        }
      };
      event.addSetting = addSetting;
      event.removeSetting = removeSetting;
      event.list = [];
      identityList.randomSort();
      if (event.identity) {
        identityList.remove(event.identity);
        identityList.unshift(event.identity);
        if (event.fixedseat) {
          var zhuIdentity = "zhu";
          if (zhuIdentity != event.identity) {
            identityList.remove(zhuIdentity);
            identityList.splice(event.fixedseat, 0, zhuIdentity);
          }
          delete event.fixedseat;
        }
        delete event.identity;
      } else if (
        _status.mode == "normal" &&
        (!_status.brawl || !_status.brawl.identityShown)
      ) {
        var ban_identity = [];
        ban_identity.push(get.config("ban_identity") || "off");
        if (ban_identity[0] != "off") {
          ban_identity.push(get.config("ban_identity2") || "off");
          if (ban_identity[1] != "off") {
            ban_identity.push(get.config("ban_identity3") || "off");
          }
        }
        ban_identity.remove("off");
        if (ban_identity.length) {
          var identityList2 = identityList.slice(0);
          for (var i = 0; i < ban_identity.length; i++) {
            while (identityList2.includes(ban_identity[i])) {
              identityList2.remove(ban_identity[i]);
            }
          }
          ban_identity = identityList2.randomGet();
          identityList.remove(ban_identity);
          identityList.splice(game.players.indexOf(game.me), 0, ban_identity);
        }
      }
      for (var i = 0; i < game.players.length; i++) {
        if (_status.brawl && _status.brawl.identityShown) {
          if (game.players[i].identity == "zhu") {
            game.zhu = game.players[i];
            game.players[i].isZhu = true;
            game.players[i].identityShown = true;
          }
        } else {
          game.players[i].identity = identityList[i];
          game.players[i].setIdentity("cai");
          game.players[i].node.identity.classList.add("guessing");
          if (identityList[i] == "zhu") {
            game.zhu = game.players[i];
          }
        }
        game.players[i].identityShown = false;
      }

      game.zhu.setIdentity();
      game.zhu.identityShown = true;
      game.zhu.isZhu = game.zhu.identity == "zhu";
      game.zhu.node.identity.classList.remove("guessing");
      game.me.setIdentity();
      game.me.node.identity.classList.remove("guessing");

      for (var i = 0; i < game.players.length; i++) {
        game.players[i].send(
          function (zhu, zhuid, me, identity) {
            for (var i in lib.playerOL) {
              lib.playerOL[i].setIdentity("cai");
              lib.playerOL[i].node.identity.classList.add("guessing");
            }
            zhu.identityShown = true;
            zhu.identity = zhuid;
            if (zhuid == "zhu") {
              zhu.isZhu = true;
            }
            zhu.setIdentity();
            zhu.node.identity.classList.remove("guessing");
            me.setIdentity(identity);
            me.node.identity.classList.remove("guessing");
            ui.arena.classList.add("choose-character");
          },
          game.zhu,
          game.zhu.identity,
          game.players[i],
          game.players[i].identity
        );
      }

      var list;
      var list2 = [];
      var list3 = [];
      var list4 = [];
      event.list = [];
      event.list2 = [];

      var libCharacter = {};
      for (var i = 0; i < lib.configOL.characterPack.length; i++) {
        var pack = lib.characterPack[lib.configOL.characterPack[i]];
        for (var j in pack) {
          if (lib.character[j]) {
            libCharacter[j] = pack[j];
          }
        }
      }
      for (i in lib.characterReplace) {
        var ix = lib.characterReplace[i];
        for (var j = 0; j < ix.length; j++) {
          if (!libCharacter[ix[j]] || lib.filter.characterDisabled(ix[j])) {
            ix.splice(j--, 1);
          }
        }
        if (ix.length) {
          event.list.push(i);
          event.list2.push(i);
          list4.addArray(ix);
          var bool = false;
          for (var j of ix) {
            if (libCharacter[j].isZhugong) {
              bool = true;
              break;
            }
          }
          (bool ? list2 : list3).push(i);
        }
      }
      game.broadcast(function (list) {
        for (var i in lib.characterReplace) {
          var ix = lib.characterReplace[i];
          for (var j = 0; j < ix.length; j++) {
            if (!list.includes(ix[j])) {
              ix.splice(j--, 1);
            }
          }
        }
      }, list4);
      for (i in libCharacter) {
        if (list4.includes(i)) {
          continue;
        }
        if (lib.filter.characterDisabled(i, libCharacter)) {
          continue;
        }
        event.list.push(i);
        event.list2.push(i);
        list4.push(i);
        if (libCharacter[i].isZhugong) {
          list2.push(i);
        } else {
          list3.push(i);
        }
      }
      _status.characterlist = list4.slice(0);
      var getZhuList = function (list2) {
        var limit_zhu = lib.configOL.limit_zhu;
        if (!limit_zhu || limit_zhu == "off") {
          return list2.slice(0).sort(lib.sort.character);
        }
        if (limit_zhu != "group") {
          var num = parseInt(limit_zhu) || 6;
          return list2.randomGets(num).sort(lib.sort.character);
        }
        var getGroup = function (name) {
          if (lib.characterReplace[name]) {
            return lib.character[lib.characterReplace[name][0]][1];
          }
          return lib.character[name][1];
        };
        var list2x = list2.slice(0);
        list2x.randomSort();
        for (var i = 0; i < list2x.length; i++) {
          for (var j = i + 1; j < list2x.length; j++) {
            if (getGroup(list2x[i]) == getGroup(list2x[j])) {
              list2x.splice(j--, 1);
            }
          }
        }
        list2x.sort(lib.sort.character);
        return list2x;
      };
      list = getZhuList(list2).concat(
        list3.randomGets(lib.configOL.choice_zhu)
      );
      var next = game.zhu.chooseButton(true);
      next.set("selectButton", lib.configOL.double_character ? 2 : 1);
      next.set("createDialog", ["选择角色", [list, "characterx"]]);
      next.set("ai", function (button) {
        return Math.random();
      });
      ("step 1");
      if (!game.zhu.name) {
        game.zhu.init(result.links[0], result.links[1]);
      }
      event.list.remove(get.sourceCharacter(game.zhu.name1));
      event.list.remove(get.sourceCharacter(game.zhu.name2));
      event.list2.remove(get.sourceCharacter(game.zhu.name1));
      event.list2.remove(get.sourceCharacter(game.zhu.name2));

      if (game.players.length > 4) {
        if (!game.zhu.isInitFilter("noZhuHp")) {
          game.zhu.maxHp++;
          game.zhu.hp++;
          game.zhu.update();
        }
      }
      game.broadcast(
        function (zhu, name, name2, addMaxHp) {
          if (!zhu.name) {
            zhu.init(name, name2);
          }
          if (addMaxHp) {
            if (!zhu.isInitFilter("noZhuHp")) {
              zhu.maxHp++;
              zhu.hp++;
              zhu.update();
            }
          }
        },
        game.zhu,
        result.links[0],
        result.links[1],
        game.players.length > 4
      );

      if (lib.selectGroup.includes(game.zhu.group) && !game.zhu.isUnseen(0)) {
        game.zhu._groupChosen = "kami";
        var list = ["wei", "shu", "wu", "qun", "jin", "key"];
        for (var i = 0; i < list.length; i++) {
          if (!lib.group.includes(list[i])) {
            list.splice(i--, 1);
          } else {
            list[i] = ["", "", "group_" + list[i]];
          }
        }
        game.zhu
          .chooseButton(["请选择你的势力", [list, "vcard"]], true)
          .set("ai", function () {
            return Math.random();
          });
      } else if (get.is.double(game.zhu.name1)) {
        game.zhu._groupChosen = "double";
        var list = get.is.double(game.zhu.name1, true);
        for (var i = 0; i < list.length; i++) {
          if (!lib.group.includes(list[i])) {
            list.splice(i--, 1);
          } else {
            list[i] = ["", "", "group_" + list[i]];
          }
        }
        game.zhu
          .chooseButton(["请选择你的势力", [list, "vcard"]], true)
          .set("ai", function () {
            return Math.random();
          });
      } else {
        event.goto(3);
      }
      ("step 2");
      var name = result.links[0][2].slice(6);
      game.zhu.changeGroup(name);
      ("step 3");
      var list = [];
      var selectButton = lib.configOL.double_character ? 2 : 1;

      var num = Math.floor(event.list.length / (game.players.length - 1));
      for (let i = 0; i < game.players.length; i++) {
        if (game.players[i] != game.zhu) {
          const identity = game.players[i].identity;
          let num2 = lib.configOL["choice_" + identity];
          let str = "选择角色";
          list.push([
            game.players[i],
            [str, [event.list.randomRemove(Math.min(num, num2)), "characterx"]],
            selectButton,
            true,
          ]);
        }
      }
      game.me.chooseButtonOL(list, function (player, result) {
        if (game.online || player == game.me) {
          player.init(result.links[0], result.links[1]);
        }
      });
      ("step 4");
      var shen = [];
      for (var i in result) {
        if (result[i] && result[i].links) {
          for (var j = 0; j < result[i].links.length; j++) {
            event.list2.remove(get.sourceCharacter(result[i].links[j]));
          }
        }
      }
      for (var i in result) {
        if (result[i] == "ai") {
          result[i] = event.list2.randomRemove(
            lib.configOL.double_character ? 2 : 1
          );
          for (var j = 0; j < result[i].length; j++) {
            var listx = lib.characterReplace[result[i][j]];
            if (listx && listx.length) {
              result[i][j] = listx.randomGet();
            }
          }
        } else {
          result[i] = result[i].links;
        }
        if (
          get.is.double(result[i][0]) ||
          (lib.character[result[i][0]] &&
            lib.selectGroup.includes(lib.character[result[i][0]].group) &&
            !lib.character[result[i][0]].hasHiddenSkill)
        ) {
          shen.push(lib.playerOL[i]);
        }
      }
      event.result2 = result;
      if (shen.length) {
        var list = ["wei", "shu", "wu", "qun", "jin", "key"];
        for (var i = 0; i < list.length; i++) {
          if (!lib.group.includes(list[i])) {
            list.splice(i--, 1);
          } else {
            list[i] = ["", "", "group_" + list[i]];
          }
        }
        for (var i = 0; i < shen.length; i++) {
          if (get.is.double(result[shen[i].playerid][0])) {
            shen[i]._groupChosen = "double";
            shen[i] = [
              shen[i],
              [
                "请选择你的势力",
                [
                  get.is
                    .double(result[shen[i].playerid][0], true)
                    .map(function (i) {
                      return ["", "", "group_" + i];
                    }),
                  "vcard",
                ],
              ],
              1,
              true,
            ];
          } else {
            shen[i]._groupChosen = "kami";
            shen[i] = [shen[i], ["请选择你的势力", [list, "vcard"]], 1, true];
          }
        }
        game.me
          .chooseButtonOL(shen, function (player, result) {
            if (player == game.me) {
              player.changeGroup(result.links[0][2].slice(6), false, false);
            }
          })
          .set("switchToAuto", function () {
            _status.event.result = "ai";
          })
          .set("processAI", function () {
            return {
              bool: true,
              links: [_status.event.dialog.buttons.randomGet().link],
            };
          });
      } else {
        event._result = {};
      }
      ("step 5");
      if (!result) {
        result = {};
      }
      for (var i in result) {
        if (result[i] && result[i].links) {
          result[i] = result[i].links[0][2].slice(6);
        } else if (result[i] == "ai") {
          result[i] = (function () {
            var player = lib.playerOL[i];
            var list = ["wei", "shu", "wu", "qun", "jin", "key"];
            for (var ix = 0; ix < list.length; ix++) {
              if (!lib.group.includes(list[ix])) {
                list.splice(ix--, 1);
              }
            }
            if (_status.mode != "zhong" && game.zhu && game.zhu.group) {
              if (
                [
                  "re_zhangjiao",
                  "liubei",
                  "re_liubei",
                  "caocao",
                  "re_caocao",
                  "sunquan",
                  "re_sunquan",
                  "zhangjiao",
                  "sp_zhangjiao",
                  "caopi",
                  "re_caopi",
                  "liuchen",
                  "caorui",
                  "sunliang",
                  "sunxiu",
                  "sunce",
                  "re_sunben",
                  "ol_liushan",
                  "re_liushan",
                  "key_akane",
                  "dongzhuo",
                  "re_dongzhuo",
                  "ol_dongzhuo",
                  "jin_simashi",
                  "caomao",
                ].includes(game.zhu.name)
              ) {
                return game.zhu.group;
              }
              if (game.zhu.name == "yl_yuanshu") {
                if (player.identity == "zhong") {
                  list.remove("qun");
                } else {
                  return "qun";
                }
              }
              if (
                [
                  "sunhao",
                  "xin_yuanshao",
                  "re_yuanshao",
                  "re_sunce",
                  "ol_yuanshao",
                  "yuanshu",
                  "jin_simazhao",
                  "liubian",
                ].includes(game.zhu.name)
              ) {
                if (player.identity != "zhong") {
                  list.remove(game.zhu.group);
                } else {
                  return game.zhu.group;
                }
              }
            }
            return list.randomGet();
          })();
        }
      }
      var result2 = event.result2;
      game.broadcast(
        function (result, result2) {
          for (var i in result) {
            if (!lib.playerOL[i].name) {
              lib.playerOL[i].init(result[i][0], result[i][1]);
            }
            if (result2[i] && result2[i].length) {
              lib.playerOL[i].changeGroup(result2[i], false, false);
            }
          }
          setTimeout(function () {
            ui.arena.classList.remove("choose-character");
          }, 500);
        },
        result2,
        result
      );

      for (var i in result2) {
        if (!lib.playerOL[i].name) {
          lib.playerOL[i].init(result2[i][0], result2[i][1]);
        }
        if (result[i] && result[i].length) {
          lib.playerOL[i].changeGroup(result[i], false, false);
        }
      }

      for (var i = 0; i < game.players.length; i++) {
        _status.characterlist.remove(game.players[i].name);
        _status.characterlist.remove(game.players[i].name1);
        _status.characterlist.remove(game.players[i].name2);
      }
      setTimeout(function () {
        ui.arena.classList.remove("choose-character");
      }, 500);
    });
  },
};
