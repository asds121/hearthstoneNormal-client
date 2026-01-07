import { lib, game, ui, get, ai, _status } from "../../noname.js";
export const type = "mode";
import gameConfig from "./game.js";
import translateConfig from "./translate.js";
import elementConfig from "./element.js";
import getConfig from "./get.js";

export default () => {
  return {
    name: "identity",
    start() {
      "step 0";
      if (!lib.config.new_tutorial) {
        ui.arena.classList.add("only_dialog");
      }
      _status.mode = get.config("identity_mode");
      if (_status.brawl && _status.brawl.submode) {
        _status.mode = _status.brawl.submode;
      }
      ("step 1");
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
      } else if (!_status.connectMode) {
        game.prepareArena();
        if (!lib.config.new_tutorial) {
          game.delay();
        }
      }
      ("step 2");
      if (!_status.connectMode) {
        game.showChangeLog();
      }
      ("step 3");
      if (typeof _status.new_tutorial == "function") {
        _status.new_tutorial();
      }
      delete _status.new_tutorial;
      if (_status.connectMode) {
        game.waitForPlayer(function () {
          lib.configOL.number = Math.min(Math.max(lib.configOL.number, 2), 4);
        });
      }
      ("step 4");
      if (_status.connectMode) {
        _status.mode = lib.configOL.identity_mode;
        lib.configOL.number = Math.min(Math.max(lib.configOL.number, 2), 4);
        game.randomMapOL();
      } else {
        for (var i = 0; i < game.players.length; i++) {
          game.players[i].getId();
        }
        if (_status.brawl && _status.brawl.chooseCharacterBefore) {
          _status.brawl.chooseCharacterBefore();
        }
        game.chooseCharacter();
      }
      ("step 5");
      if (ui.coin) {
        _status.coinCoeff = get.coinCoeff([game.me.name]);
      }
      if (game.players.length == 2) {
        game.showIdentity(true);
        var map = {};
        for (var i in lib.playerOL) {
          map[i] = lib.playerOL[i].identity;
        }
        game.broadcast(function (map) {
          for (var i in map) {
            lib.playerOL[i].identity = map[i];
            lib.playerOL[i].setIdentity();
            lib.playerOL[i].ai.shown = 1;
          }
        }, map);
      } else {
        for (var i = 0; i < game.players.length; i++) {
          game.players[i].ai.shown = 0;
        }
      }

      if (
        game.zhu == game.me &&
        game.zhu.identity != "zhu" &&
        _status.brawl &&
        _status.brawl.identityShown
      ) {
        delete game.zhu;
      } else {
        game.zhu.ai.shown = 1;
        let enhance_zhu = _status.mode == "normal",
          skill;
        if (enhance_zhu) {
          if (_status.connectMode) {
            enhance_zhu = lib.configOL.enhance_zhu;
          } else {
            enhance_zhu = get.config("enhance_zhu");
          }
        }
        if (enhance_zhu === "sixiang") {
          skill =
            "sixiang_" + ["zhuque", "xuanwu", "qinglong", "baihu"].randomGet();
        } else if (enhance_zhu === "specific" && get.population("fan") >= 3) {
          switch (game.zhu.name) {
            case "key_yuri":
              skill = "buqu";
              break;
            case "liubei":
              skill = "jizhen";
              break;
            case "dongzhuo":
              skill = "hengzheng";
              break;
            case "sunquan":
              skill = "batu";
              break;
            case "sp_zhangjiao":
              skill = "tiangong";
              break;
            case "liushan":
              skill = "shengxi";
              break;
            case "sunce":
              skill = "ciqiu";
              break;
            case "re_sunben":
              skill = "ciqiu";
              break;
            case "yuanshao":
              skill = "geju";
              break;
            case "re_caocao":
              skill = "dangping";
              break;
            case "caopi":
              skill = "junxing";
              break;
            case "liuxie":
              skill = "moukui";
              break;
            default:
              skill = "tianming";
              break;
          }
        }
        if (skill) {
          game.broadcastAll(
            function (player, skill) {
              player.addSkill(skill);
              player.storage.enhance_zhu = skill;
            },
            game.zhu,
            skill
          );
        }
        let enable_mingcha;
        if (_status.connectMode) {
          enable_mingcha = lib.configOL.enable_mingcha;
        } else {
          enable_mingcha = get.config("enable_mingcha");
        }
        if (enable_mingcha) {
          game.broadcastAll((player) => {
            player.addSkill("identity_mingcha");
          }, game.zhu);
        }
      }
      game.syncState();
      event.trigger("gameStart");

      var players = get.players(lib.sort.position);
      var info = [];
      for (var i = 0; i < players.length; i++) {
        var ifo = {
          name: players[i].name1,
          name2: players[i].name2,
          identity: players[i].identity,
          nickname: players[i].node.nameol.innerHTML,
        };
        info.push(ifo);
      }
      _status.videoInited = true;
      game.addVideo("init", null, info);

      ("step 6");
      event.beginner =
        _status.firstAct2 ||
        game.zhong ||
        game.zhu ||
        _status.firstAct ||
        game.me;
      game.gameDraw(event.beginner, function (player) {
        return 4;
      });
      if (_status.connectMode && lib.configOL.change_card) {
        game.replaceHandcards(game.players.slice(0));
      }
      ("step 7");
      game.phaseLoop(event.beginner);
    },
    game: gameConfig,
    translate: translateConfig,
    element: elementConfig,
    get: getConfig,
    skill: {},
    help: {
      身份模式:
        '<div style="margin:10px">选项</div><ul style="margin-top:0"><li>加强主公<br>反贼人数多于2时主公会额外增加一个技能（每个主公的额外技能固定，非常备主公增加天命）',
    },
  };
};
