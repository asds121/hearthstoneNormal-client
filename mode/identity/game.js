import { lib, game, ui, get, ai, _status } from "../../noname.js";

export default {
  canReplaceViewpoint: () => true,
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
        case "enemy":
          list[i] = "敌方";
          break;
        case "friend":
          list[i] = "友方";
          break;
        case "cai":
        case "cai2":
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
    if (game.identityVideoName) {
      str2 = game.identityVideoName;
    } else {
      switch (_status.mode) {
        case "purple":
          str2 =
            "3v3v2 - " +
            (game.me.identity.indexOf("r") == 0 ? "暖色" : "冷色") +
            lib.translate[game.me.identity + "2"];
          break;
        case "zhong":
          str2 = "忠胆英杰 - " + lib.translate[game.me.identity + "2"];
          break;
        case "stratagem":
          str2 =
            get.cnNumber(get.playerNumber()) +
            "人谋攻" +
            "-" +
            lib.translate[game.me.identity + "2"];
          break;
        default:
          str2 =
            get.cnNumber(get.playerNumber()) +
            "人" +
            get.translation(lib.config.mode) +
            " - " +
            lib.translate[game.me.identity + "2"];
      }
    }
    var name = [str, str2];
    return name;
  },
  addRecord: function (bool) {
    if (typeof bool == "boolean") {
      var data = lib.config.gameRecord.identity.data;
      var identity = game.me.identity;
      if (identity == "mingzhong") {
        identity = "zhong";
      }
      if (!data[identity]) {
        data[identity] = [0, 0];
      }
      if (bool) {
        data[identity][0]++;
      } else {
        data[identity][1]++;
      }
      var list = ["zhu", "zhong", "fan", "commoner"];
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
      // if(me===false&&game.players[i]==game.me) continue;
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
    } else if (_status.mode == "purple") {
      var winner = [];
      var loser = [];
      var ye = game.filterPlayer(
        function (current) {
          return ["rYe", "bYe"].includes(current.identity);
        },
        null,
        true
      );
      var red = game.filterPlayer(
        function (current) {
          return ["rZhu", "rZhong"].includes(current.identity);
        },
        null,
        true
      );
      var blue = game.filterPlayer(
        function (current) {
          return ["bZhu", "bZhong"].includes(current.identity);
        },
        null,
        true
      );
      game.countPlayer2(function (current) {
        switch (current.identity) {
          case "rZhu":
            if (ye.length == 0 && game.bZhu.isDead()) {
              winner.push(current);
            }
            if (current.isDead()) {
              loser.push(current);
            }
            break;
          case "rZhong":
            if (ye.length == 0 && game.bZhu.isDead()) {
              winner.push(current);
            }
            if (game.rZhu.isDead()) {
              loser.push(current);
            }
            break;
          case "bZhu":
            if (ye.length == 0 && game.rZhu.isDead()) {
              winner.push(current);
            }
            if (current.isDead()) {
              loser.push(current);
            }
            break;
          case "bZhong":
            if (ye.length == 0 && game.rZhu.isDead()) {
              winner.push(current);
            }
            if (game.bZhu.isDead()) {
              loser.push(current);
            }
            break;
          default:
            if (red.length + blue.length == 0) {
              winner.push(current);
            } else if (game.rZhu.isDead() && game.bZhu.isDead()) {
              loser.push(current);
            }
            break;
        }
      }, true);
      var winner2 = winner.slice(0);
      var loser2 = loser.slice(0);
      for (var i = 0; i < winner.length; i++) {
        if (winner[i].isDead()) {
          winner.splice(i--, 1);
        }
      }
      for (var i = 0; i < loser.length; i++) {
        if (loser[i].isDead()) {
          loser.splice(i--, 1);
        }
      }
      if (winner.length > 0 || loser.length == game.players.length) {
        game.broadcastAll(
          function (winner, loser) {
            _status.winner = winner;
            _status.loser = loser;
          },
          winner,
          loser
        );
        if (loser.length == game.players.length) {
          game.showIdentity();
          game.over("游戏平局");
        } else if (winner2.includes(me)) {
          game.showIdentity();
          if (loser2.includes(me)) {
            game.over(false);
          } else {
            game.over(true);
          }
        } else {
          game.showIdentity();
          game.over(false);
        }
      }
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
          case "commoner":
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
          case "commoner":
            game.over(true);
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
    if (
      me.identity == "zhu" ||
      me.identity == "zhong" ||
      me.identity == "mingzhong"
    ) {
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
    } else if (me.identity == "commoner") {
      game.over(true);
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
      if (false) {
      } else if (player.identity == "zhu") {
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
        player.init(choice);
        if (game.players.length > 4) {
          if (!player.isInitFilter("noZhuHp")) {
            player.hp++;
            player.maxHp++;
            player.update();
          }
        }
      } else if (
        player.identity == "zhong" &&
        (Math.random() < 0.5 ||
          ["sunliang", "key_akane"].includes(game.zhu.name)) &&
        true
      ) {
        var listc = list.slice(0);
        for (var i = 0; i < listc.length; i++) {
          var listx = lib.characterReplace[listc[i]];
          if (listx && listx.length) {
            listc[i] = listx.randomGet();
          }
        }
        var choice = 0;
        for (var i = 0; i < listc.length; i++) {
          if (lib.character[listc[i]][1] == game.zhu.group) {
            choice = i;
            break;
          }
        }
        player.init(listc[choice]);
      } else {
        var listc = list.slice(0, 2);
        for (var i = 0; i < listc.length; i++) {
          var listx = lib.characterReplace[listc[i]];
          if (listx && listx.length) {
            listc[i] = listx.randomGet();
          }
        }
        player.init(listc[0]);
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
      if (false) {
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

      var stratagemMode = event.stratagemMode;
      var addSetting = function (dialog) {
        dialog.add("选择身份").classList.add("add-setting");
        var table = document.createElement("div");
        table.classList.add("add-setting");
        table.style.margin = "0";
        table.style.width = "100%";
        table.style.position = "relative";
        var listi;
        listi = ["random", "zhu", "zhong", "fan"];

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
                if (get.config("enable_commoner") && !event.stratagemMode) {
                  listi.push("commoner");
                }
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
              if (!event.stratagemMode) {
                if (link != (event.zhongmode ? "mingzhong" : "zhu")) {
                  seats.previousSibling.style.display = "";
                  seats.style.display = "";
                } else {
                  seats.previousSibling.style.display = "none";
                  seats.style.display = "none";
                }
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
        for (var i = stratagemMode ? 1 : 2; i <= game.players.length; i++) {
          var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
          td.innerHTML = get.cnNumber(i, true);
          td.link = i - 1;
          seats.appendChild(td);
          if (true && get.distance(game.zhu, game.me, "absolute") === i - 1) {
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
        if (true && game.me == game.zhu) {
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
          var zhuIdentity = _status.mode == "zhong" ? "mingzhong" : "zhu";
          if (zhuIdentity != event.identity) {
            identityList.remove(zhuIdentity);
            identityList.splice(event.fixedseat, 0, zhuIdentity);
          }
          delete event.fixedseat;
        }
        delete event.identity;
      } else if (
        _status.mode != "zhong" &&
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
      for (i = 0; i < game.players.length; i++) {
        if (_status.brawl && _status.brawl.identityShown) {
          if (game.players[i].identity == "zhu") {
            game.zhu = game.players[i];
          }
          if (true) {
            game.players[i].identityShown = true;
          }
        } else {
          game.players[i].node.identity.classList.add("guessing");
          game.players[i].identity = identityList[i];
          game.players[i].setIdentity("cai");
          if (false) {
            if (identityList[i] == "mingzhong") {
              game.zhu = game.players[i];
            } else if (identityList[i] == "zhu") {
              game.zhu2 = game.players[i];
            }
          } else {
            if (identityList[i] == "zhu") {
              game.zhu = game.players[i];
            }
          }
          game.players[i].identityShown = false;
        }
      }

      if (!game.zhu) {
        game.zhu = game.me;
      } else {
        if (true) {
          game.zhu.setIdentity();
          game.zhu.isZhu = game.zhu.identity == "zhu";
          game.zhu.identityShown = true;
          game.zhu.node.identity.classList.remove("guessing");
        }
        game.me.setIdentity();
        game.me.node.identity.classList.remove("guessing");
      }
      //选将框分配
      for (i in lib.characterReplace) {
        var ix = lib.characterReplace[i];
        for (var j = 0; j < ix.length; j++) {
          if (chosen.includes(ix[j]) || lib.filter.characterDisabled(ix[j])) {
            ix.splice(j--, 1);
          }
        }
        if (ix.length) {
          event.list.push(i);
          list4.addArray(ix);
          if (stratagemMode) {
            list3.push(i);
          } else {
            var bool = false;
            for (var j of ix) {
              if (lib.character[j].isZhugong) {
                bool = true;
                break;
              }
            }
            (bool ? list2 : list3).push(i);
          }
        }
      }
      for (i in lib.character) {
        if (list4.includes(i)) {
          continue;
        }
        if (chosen.includes(i)) {
          continue;
        }
        if (lib.filter.characterDisabled(i)) {
          continue;
        }
        event.list.push(i);
        list4.push(i);
        if (true && lib.character[i].isZhugong) {
          list2.push(i);
        } else {
          list3.push(i);
        }
      }
      var getZhuList = function () {
        if (stratagemMode) {
          list2.sort(lib.sort.character);
          return list2;
        }
        var limit_zhu = get.config("limit_zhu");
        if (!limit_zhu || limit_zhu == "off") {
          return list2.slice(0).sort(lib.sort.character);
        }
        if (limit_zhu != "group") {
          var num = parseInt(limit_zhu) || 6;
          return list2.randomGets(num).sort(lib.sort.character);
        }
        var getGroup = function (name) {
          var characterReplace = lib.characterReplace[name];
          if (
            characterReplace &&
            characterReplace[0] &&
            lib.character[characterReplace[0]]
          ) {
            return lib.character[characterReplace[0]][1];
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
      event.list.randomSort();
      _status.characterlist = list4.slice(0).randomSort();
      list3.randomSort();
      if (_status.brawl && _status.brawl.chooseCharacterFilter) {
        _status.brawl.chooseCharacterFilter(event.list, getZhuList(), list3);
      }
      var num = get.config("choice_" + game.me.identity);

      if (false) {
        list = event.list.slice(0, num);
      } else if (game.zhu != game.me) {
        event.ai(game.zhu, event.list, getZhuList());
        event.list.remove(get.sourceCharacter(game.zhu.name1));
        event.list.remove(get.sourceCharacter(game.zhu.name2));
        if (_status.brawl && _status.brawl.chooseCharacter) {
          list = _status.brawl.chooseCharacter(event.list, num);
          if (list === false || list === "nozhu") {
            list = event.list.slice(0, num);
          }
        } else {
          list = event.list.slice(0, num);
        }
      } else {
        list = getZhuList().concat(list3.slice(0, num));
      }
      delete event.swapnochoose;
      var dialog;
      if (event.swapnodialog) {
        dialog = ui.dialog;
        event.swapnodialog(dialog, list);
        delete event.swapnodialog;
      } else {
        var str = "选择角色";
        dialog = ui.create.dialog(str, "hidden", [list, "characterx"]);
        if (!_status.brawl || !_status.brawl.noAddSetting) {
          if (get.config("change_identity")) {
            addSetting(dialog);
          }
        }
      }
      dialog.setCaption("选择角色");
      game.me.setIdentity();
      if (!event.chosen.length) {
        game.me.chooseButton(dialog, true).set("onfree", true).selectButton =
          function () {
            return 1;
          };
      } else {
        lib.init.onfree();
      }
      ui.create.cheat = function () {
        _status.createControl = ui.cheat2;
        ui.cheat = ui.create.control("更换", function () {
          if (ui.cheat2 && ui.cheat2.dialog == _status.event.dialog) {
            return;
          }
          if (game.changeCoin) {
            game.changeCoin(-3);
          }
          if (game.zhu != game.me) {
            event.list.randomSort();
            if (_status.brawl && _status.brawl.chooseCharacter) {
              list = _status.brawl.chooseCharacter(event.list, num);
              if (list === false || list === "nozhu") {
                list = event.list.slice(0, num);
              }
            } else {
              list = event.list.slice(0, num);
            }
          } else {
            getZhuList().sort(lib.sort.character);
            list3.randomSort();
            if (_status.brawl && _status.brawl.chooseCharacter) {
              list = _status.brawl.chooseCharacter(getZhuList(), list3, num);
              if (list === false) {
                list = getZhuList().concat(list3.slice(0, num));
              } else if (list === "nozhu") {
                event.list.randomSort();
                list = event.list.slice(0, num);
              }
            } else {
              list = getZhuList().concat(list3.slice(0, num));
            }
          }
          var buttons = ui.create.div(".buttons");
          var node = _status.event.dialog.buttons[0].parentNode;
          _status.event.dialog.buttons = ui.create.buttons(
            list,
            "characterx",
            buttons
          );
          _status.event.dialog.content.insertBefore(buttons, node);
          buttons.addTempClass("start");
          node.remove();
          game.uncheck();
          game.check();
        });
        delete _status.createControl;
      };
      if (lib.onfree) {
        lib.onfree.push(function () {
          event.dialogxx = ui.create.characterDialog("heightset");
          if (ui.cheat2) {
            ui.cheat2.addTempClass("controlpressdownx", 500);
            ui.cheat2.classList.remove("disabled");
          }
        });
      } else {
        event.dialogxx = ui.create.characterDialog("heightset");
      }

      ui.create.cheat2 = function () {
        ui.cheat2 = ui.create.control("自由选将", function () {
          if (this.dialog == _status.event.dialog) {
            if (game.changeCoin) {
              game.changeCoin(10);
            }
            this.dialog.close();
            _status.event.dialog = this.backup;
            this.backup.open();
            delete this.backup;
            game.uncheck();
            game.check();
            if (ui.cheat) {
              ui.cheat.addTempClass("controlpressdownx", 500);
              ui.cheat.classList.remove("disabled");
            }
          } else {
            if (game.changeCoin) {
              game.changeCoin(-10);
            }
            this.backup = _status.event.dialog;
            _status.event.dialog.close();
            _status.event.dialog = _status.event.parent.dialogxx;
            this.dialog = _status.event.dialog;
            this.dialog.open();
            game.uncheck();
            game.check();
            if (ui.cheat) {
              ui.cheat.classList.add("disabled");
            }
          }
        });
        if (lib.onfree) {
          ui.cheat2.classList.add("disabled");
        }
      };
      if (!_status.brawl || !_status.brawl.chooseCharacterFixed) {
        if (!ui.cheat && get.config("change_choice")) {
          ui.create.cheat();
        }
        if (!ui.cheat2 && get.config("free_choose")) {
          ui.create.cheat2();
        }
      }
      ("step 1");
      if (ui.cheat) {
        ui.cheat.close();
        delete ui.cheat;
      }
      if (ui.cheat2) {
        ui.cheat2.close();
        delete ui.cheat2;
      }
      if (event.chosen.length) {
        event.choosed = event.chosen;
      } else if (event.modchosen) {
        if (event.modchosen[0] == "random") {
          event.modchosen[0] = result.buttons[0].link;
        } else {
          event.modchosen[1] = result.buttons[0].link;
        }
        event.choosed = event.modchosen;
      } else if (result.buttons.length == 2) {
        event.choosed = [result.buttons[0].link, result.buttons[1].link];
        game.addRecentCharacter(result.buttons[0].link, result.buttons[1].link);
      } else {
        event.choosed = [result.buttons[0].link];
        game.addRecentCharacter(result.buttons[0].link);
      }
      var name = event.choosed[0];
      if (false) {
        game.me._groupChosen = "double";
        game.me.chooseControl([]).set("prompt", "请选择你的势力");
      } else if (
        lib.selectGroup.includes(lib.character[name].group) &&
        !lib.character[name].hasHiddenSkill &&
        get.config("choose_group")
      ) {
        game.me._groupChosen = "kami";
        var list = lib.group.slice(0);
        list.remove("shen");
        game.me.chooseControl(list).set("prompt", "请选择你的势力");
      }
      ("step 2");
      event.group = result.control || false;
      if (event.choosed.length == 2) {
        game.me.init(event.choosed[0], event.choosed[1]);
      } else {
        game.me.init(event.choosed[0]);
      }
      event.list.remove(get.sourceCharacter(game.me.name1));
      event.list.remove(get.sourceCharacter(game.me.name2));
      if (
        !event.stratagemMode &&
        game.me == game.zhu &&
        game.players.length > 4
      ) {
        if (!game.me.isInitFilter("noZhuHp")) {
          game.me.hp++;
          game.me.maxHp++;
          game.me.update();
        }
      }
      for (var i = 0; i < game.players.length; i++) {
        if (
          (event.stratagemMode || game.players[i] != game.zhu) &&
          game.players[i] != game.me
        ) {
          event.list.randomSort();
          event.ai(
            game.players[i],
            event.list.splice(
              0,
              get.config("choice_" + game.players[i].identity)
            ),
            null,
            event.list
          );
        }
      }
      ("step 3");
      if (event.group) {
        game.me.group = event.group;
        game.me.node.name.dataset.nature = get.groupnature(game.me.group);
        game.me.update();
      }
      for (var i = 0; i < game.players.length; i++) {
        _status.characterlist.remove(game.players[i].name);
        _status.characterlist.remove(game.players[i].name1);
        _status.characterlist.remove(game.players[i].name2);
      }
      ("step 4");
      setTimeout(function () {
        ui.arena.classList.remove("choose-character");
      }, 500);
    });
  },
};
