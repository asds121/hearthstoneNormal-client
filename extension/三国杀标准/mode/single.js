import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export const type = "mode";

export default () => {
  return {
    name: "single",
    startBefore() {},
    start() {
      "step 0";
      _status.mode = get.config("single_mode");
      var playback = localStorage.getItem(lib.configprefix + "playback");
      if (playback) {
        ui.create.me();
        ui.arena.style.display = "none";
        ui.system.style.display = "none";
        _status.playback = playback;
        localStorage.removeItem(lib.configprefix + "playback");
        var store = lib.db
          .transaction(["video"], "readwrite")
          .objectStore("video");
        store.get(parseInt(playback)).onsuccess = function (e) {
          if (e.target.result) {
            game.playVideoContent(e.target.result.video);
          } else {
            alert("播放失败：找不到录像");
            game.reload();
          }
        };
        event.finish();
      } else game.prepareArena(2);
      ("step 1");
      ("step 2");
      for (var i = 0; i < game.players.length; i++) {
        game.players[i].getId();
      }
      game.chooseCharacter();
      ("step 3");
      game.syncState();
      event.trigger("gameStart");

      var players = get.players(lib.sort.position);
      var info = [];
      for (var i = 0; i < players.length; i++) {
        info.push({
          name: players[i].name1,
          name2: players[i].name2,
          identity: players[i].identity,
          nickname: players[i].node.nameol.innerHTML,
        });
      }
      _status.videoInited = true;
      game.addVideo("init", null, info);

      game.gameDraw(game.zhu, function (player) {
        return 4;
      });
      ("step 4");
      game.phaseLoop(game.zhu);
      game.countPlayer((current) => current.showGiveup(), true);
    },
    game: {
      canReplaceViewpoint: () => true,
      addRecord: function (bool) {
        if (typeof bool == "boolean") {
          var mode = _status.mode;
          var data = lib.config.gameRecord.single.data;
          if (!get.is.object(data[mode])) {
            data[mode] = {};
          }
          var data2 = data[mode];
          var identity = game.me.identity;
          if (!data2[identity]) {
            data2[identity] = [0, 0];
          }
          if (bool) {
            data2[identity][0]++;
          } else {
            data2[identity][1]++;
          }
          var list = ["zhu", "fan"];
          var str = "";
          for (var j in data) {
            str += get.translation(j + 2) + "：<br>";
            for (var i = 0; i < list.length; i++) {
              if (data[j][list[i]]) {
                str +=
                  lib.translate[list[i] + "2"] +
                  "：" +
                  data[j][list[i]][0] +
                  "胜" +
                  " " +
                  data[j][list[i]][1] +
                  "负<br>";
              }
            }
          }
          lib.config.gameRecord.single.str = str;
          game.saveConfig("gameRecord", lib.config.gameRecord);
        }
      },
      getState: function () {
        var state = {};
        for (var i in lib.playerOL) {
          var player = lib.playerOL[i];
          state[i] = { identity: player.identity };
        }
        return state;
      },
      updateState: function (state) {
        for (var i in state) {
          var player = lib.playerOL[i];
          if (player) {
            player.identity = state[i].identity;
          }
        }
      },
      getVideoName: function () {
        var str = get.translation(game.me.name);
        if (game.me.name2) {
          str += "/" + get.translation(game.me.name2);
        }
        var name = [
          str,
          get.translation(_status.mode + 2) +
            " - " +
            lib.translate[game.me.identity + "2"],
        ];
        return name;
      },
      showIdentity: function () {},
      checkResult: function () {
        game.over((game.me._trueMe || game.me).isAlive());
      },
      chooseCharacterDianjiang: function () {
        var next = game.createEvent("chooseCharacter");
        next.showConfig = true;
        next.setContent(function () {
          "step 0";
          ui.arena.classList.add("choose-character");
          lib.init.onfree();
          ("step 1");
          game.me.chooseControl("先手", "后手").prompt = "请选择自己的行动顺序";
          ("step 2");
          var map = result.control == "先手" ? ["zhu", "fan"] : ["fan", "zhu"];
          game.me.identity = map[0];
          game.me.next.identity = map[1];
          game.me.showIdentity();
          game.me.next.showIdentity();
          ("step 3");
          event.flipassign = true;
          event.videoId = lib.status.videoId++;
          var list = [];
          for (var i in lib.character) {
            if (lib.filter.characterDisabled2(i, "ignoreForibidden")) {
              continue;
            }
            list.push(i);
          }
          _status.characterlist = list;
          var filter = function (name) {
            return !_status.characterlist.includes(name);
          };
          var dialog = ui.create.characterDialog("heightset", filter).open();
          dialog.videoId = event.videoId;

          game.me
            .chooseButton(true)
            .set("ai", function (button) {
              return Math.random();
            })
            .set(
              "selectButton",
              (function (choice) {
                if (choice == "singble") {
                  return [1, 2];
                }
                if (choice == "double") {
                  return 2;
                }
                return 1;
              })(get.config("double_character"))
            )
            .set("dialog", event.videoId);
          ("step 4");
          game.addRecentCharacter(result.links[0]);
          _status.characterlist.removeArray(result.links);
          if (result.links.length == 2) {
            game.me.init(result.links[0], result.links[1]);
            game.addRecentCharacter(result.links[1]);
          } else {
            game.me.init(result.links[0]);
          }
          game.me
            .chooseButton(true)
            .set("ai", function (button) {
              return Math.random();
            })
            .set(
              "selectButton",
              (function (choice) {
                if (choice == "singble") {
                  return [1, 2];
                }
                if (choice == "double") {
                  return 2;
                }
                return 1;
              })(get.config("double_character"))
            )
            .set("dialog", event.videoId);
          ("step 5");
          game.broadcastAll("closeDialog", event.videoId);
          game.addRecentCharacter(result.links[0]);
          _status.characterlist.removeArray(result.links);
          if (result.links.length == 2) {
            game.me.next.init(result.links[0], result.links[1]);
            game.addRecentCharacter(result.links[1]);
          } else {
            game.me.next.init(result.links[0]);
          }
          setTimeout(function () {
            ui.arena.classList.remove("choose-character");
          }, 500);
          if (get.config("single_control")) {
            game.addGlobalSkill("autoswap");
            game.me.next._trueMe = game.me;
          }
        });
      },
      chooseCharacter: function () {
        game.chooseCharacterDianjiang();
      },
    },
    element: {
      player: {
        dieAfter: function () {
          game.checkResult();
        },
        showIdentity: function () {
          game.broadcastAll(
            function (player, identity) {
              player.identity = identity;
              game[identity] = player;
              player.side = identity == "zhu";
              player.node.identity.classList.remove("guessing");
              player.identityShown = true;
              player.ai.shown = 1;
              player.setIdentity();
              if (player.identity == "zhu") {
                player.isZhu = true;
              }
              if (_status.clickingidentity) {
                for (var i = 0; i < _status.clickingidentity[1].length; i++) {
                  _status.clickingidentity[1][i].delete();
                  _status.clickingidentity[1][i].style.transform = "";
                }
                delete _status.clickingidentity;
              }
            },
            this,
            this.identity
          );
        },
      },
    },
    get: {
      attitude: function (from, to) {
        if (!from || !to) {
          return 0;
        }
        if (from.identity == to.identity) {
          return 10;
        }
        return -10;
      },
    },
    translate: {
      zhu: "先",
      fan: "后",
      zhu2: "先手",
      fan2: "后手",
      dianjiang2: "点将单挑",
    },
  };
};
