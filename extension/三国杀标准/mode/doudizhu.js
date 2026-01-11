import { lib, game, ui, get, ai, _status } from "../../../noname.js";
import doudizhuSkills from "../skill/doudizhu.js";

export const type = "mode";

export default () => {
  return {
    name: "doudizhu",
    start() {
      "step 0";
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
      }
      game.prepareArena(3);
      ("step 1");
      _status.mode = get.config("doudizhu_mode");
      ("step 2");
      for (var i = 0; i < game.players.length; i++) {
        game.players[i].getId();
      }
      game.chooseCharacter();
      ("step 3");
      game.showIdentity(true);
      const list = [];
      list.push("bahu");
      game.zhu.addSkill(list);
      game.addGlobalSkill("doudizhu_viewHandcard");
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

      game.gameDraw(game.zhu || _status.firstAct || game.me);

      game.phaseLoop(game.zhu || _status.firstAct || game.me);
      game.zhu.showGiveup();
    },
    game: {
      canReplaceViewpoint: () => true,
      addRecord(bool) {
        if (typeof bool == "boolean") {
          var data = lib.config.gameRecord.doudizhu.data;
          var identity = game.me.identity;
          if (!data[identity]) {
            data[identity] = [0, 0];
          }
          if (bool) {
            data[identity][0]++;
          } else {
            data[identity][1]++;
          }
          var list = ["zhu", "fan"];
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
          lib.config.gameRecord.doudizhu.str = str;
          game.saveConfig("gameRecord", lib.config.gameRecord);
        }
      },
      getVideoName() {
        var str = get.translation(game.me.name);
        if (game.me.name2) {
          str += "/" + get.translation(game.me.name2);
        }
        var namex = "欢乐斗地主";
        var name = [str, namex + " - " + lib.translate[game.me.identity + "2"]];
        return name;
      },
      showIdentity(me) {
        for (var i = 0; i < game.players.length; i++) {
          // if(me===false&&game.players[i]==game.me) continue;
          game.players[i].node.identity.classList.remove("guessing");
          game.players[i].identityShown = true;
          game.players[i].ai.shown = 1;
          game.players[i].setIdentity(game.players[i].identity);
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
      checkResult() {
        var me = game.me._trueMe || game.me;
        if (game.zhu.isAlive()) {
          if (game.players.length > 1) return;
          if (me == game.zhu) {
            game.over(true);
          } else {
            game.over(false);
          }
        } else {
          if (me == game.zhu) {
            game.over(false);
          } else {
            game.over(true);
          }
        }
      },
      chooseCharacterHuanle() {
        var next = game.createEvent("chooseCharacter");
        next.setContent(function () {
          "step 0";
          ui.arena.classList.add("choose-character");
          game.no_continue_game = true;
          var i;
          event.list = [];
          event.list2 = [];
          var list4 = [];
          if (!event.map) {
            event.map = {};
          }
          for (i in lib.characterReplace) {
            var ix = lib.characterReplace[i];
            for (var j = 0; j < ix.length; j++) {
              if (lib.filter.characterDisabled(ix[j])) {
                ix.splice(j--, 1);
              }
            }
            if (ix.length) {
              var name = ix.randomGet();
              event.list.push(name);
              list4.addArray(ix);
            }
          }
          for (i in lib.character) {
            if (list4.includes(i) || lib.filter.characterDisabled(i)) {
              continue;
            }
            event.list.push(i);
          }
          event.list.randomSort();
          _status.characterlist = event.list.slice(0);
          event.controls = ["不叫", "叫地主"];
          for (var player of game.players) {
            var id = player.playerid;
            if (!event.map[id]) {
              event.map[id] = [];
            }
            event.map[id].addArray(event.list2.randomRemove(1));
            event.list.removeArray(event.map[id]);
            event.map[id].addArray(
              event.list.randomRemove(4 - event.map[id].length)
            );
            event.list2.removeArray(event.map[id]);
          }
          event.dialog = ui.create.dialog("你的选将框", [
            event.map[game.me.playerid],
            "character",
          ]);
          event.start = game.players.randomGet();
          event.current = event.start;
          lib.init.onfree();
          game.delay(2.5);
          ("step 1");
          event.current.chooseControl(event.controls).set("ai", function () {
            return Math.random() > 0.5 ? "不叫" : "叫地主";
          });
          if (event.current == game.me) {
            event.dialog.content.childNodes[0].innerHTML = "是否抢地主？";
          }
          ("step 2");
          event.current.chat(result.control);
          if (result.control == "叫地主" || event.current == event.start.next) {
            game.zhu =
              result.control == "叫地主" ? event.current : event.current.next;
            for (var player of game.players) {
              player.identity = player == game.zhu ? "zhu" : "fan";
              player.showIdentity();
            }
            event.dialog.close();
            event.map[game.zhu.playerid].addArray(event.list.randomRemove(3));
          } else {
            event.current = event.current.next;
            event.goto(1);
            game.delay(1.5);
          }
          ("step 3");
          game.me.chooseButton(
            ["请选择你的武将", [event.map[game.me.playerid], "character"]],
            true
          );
          ("step 4");
          game.me.init(result.links[0]);
          for (var player of game.players) {
            if (player != game.me) {
              player.init(event.map[player.playerid].randomGet());
            }
          }
          if (!game.zhu.isInitFilter("noZhuHp")) {
            game.zhu.maxHp++;
            game.zhu.hp++;
            game.zhu.update();
          }
          for (var i = 0; i < game.players.length; i++) {
            _status.characterlist.remove(game.players[i].name1);
            _status.characterlist.remove(game.players[i].name2);
          }
          setTimeout(function () {
            ui.arena.classList.remove("choose-character");
          }, 500);
        });
      },
      chooseCharacter() {
        game.chooseCharacterHuanle();
      },
    },
    translate: {
      zhu: "主",
      fan: "反",
      zhu2: "地主",
      fan2: "农民",
      random2: "随机",
      doudizhu_viewHandcard: "手牌可见",
      bahu: "跋扈",
      bahu_info:
        "锁定技，准备阶段开始时，你摸一张牌。出牌阶段，你出【杀】次数+1。",
    },
    element: {
      player: {
        $dieAfter() {
          if (_status.video) {
            return;
          }
          if (!this.node.dieidentity) {
            var str = { zhu: "地主", fan: "农民" }[this.identity];
            var node = ui.create.div(".damage.dieidentity", str, this);
            ui.refresh(node);
            node.style.opacity = 1;
            this.node.dieidentity = node;
          }
          var trans = this.style.transform;
          if (trans) {
            if (trans.indexOf("rotateY") != -1) {
              this.node.dieidentity.style.transform = "rotateY(180deg)";
            } else if (trans.indexOf("rotateX") != -1) {
              this.node.dieidentity.style.transform = "rotateX(180deg)";
            } else {
              this.node.dieidentity.style.transform = "";
            }
          } else {
            this.node.dieidentity.style.transform = "";
          }
        },
        dieAfter(source) {
          game.checkResult();
        },
        dieAfter2() {
          if (this.identity != "fan") {
            return;
          }
          var player = this,
            target = game.findPlayer(function (current) {
              return current != player && current.identity == "fan";
            }, true);
          if (target) {
            target.showGiveup();
            const version = get.config("enhance_nongmin");
            if (version !== "decade") {
              target[version === "mobile" ? "chooseDrawRecover" : "draw"](
                version === "mobile" ? 2 : 1
              );
            }
          }
        },
        logAi(targets, card) {},
        showIdentity() {
          game.broadcastAll(
            function (player, identity) {
              player.identity = identity;
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
      rawAttitude(from, to) {
        if (from.identity == to.identity) {
          return 10;
        }
        return -10;
      },
    },
    skill: doudizhuSkills,
    card: {},
    help: {
      斗地主:
        '<div style="margin:10px">游戏规则</div><ul style="margin-top:0"><li>游戏人数<br>游戏人数为3人（地主x1 + 农民x2）。<li>胜利条件<br>农民：地主死亡。<br>地主：所有农民死亡且自己存活。' +
        "<li>死亡奖惩<br>当有农民死亡时，若另一名农民存活，则其可以选择摸两张牌或回复1点体力。<li>地主专属技能<br>地主可以使用专属技能〖跋扈〗。<br>〖跋扈〗锁定技，准备阶段开始时，你摸一张牌。出牌阶段，你可以多使用一张【杀】。</ul>",
    },
  };
};
