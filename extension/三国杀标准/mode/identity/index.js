import { lib, game, ui, get, ai, _status } from "../../../../noname.js";

import gameConfig from "./game.js";
import translate from "./translate.js";
import element from "./element.js";
import getConfig from "./get.js";

export const type = "mode";

export const modeName = "identity";

// 创建模式对象
export const modeModule = {
  name: "identity",
  start() {
    "step 0";
    lib.config.new_tutorial = true;
    get.is.double = () => false;
    get.is.versus = () => false;
    _status.mode = get.config("identity_mode");
    event.replacePile = function () {};
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
    } else game.prepareArena();
    ("step 2");
    ("step 3");
    ("step 4");
    for (var i = 0; i < game.players.length; i++) {
      game.players[i].getId();
    }
    game.chooseCharacter();
    ("step 5");
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
    game.zhu.ai.shown = 1;
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
    ("step 7");
    game.phaseLoop(event.beginner);
  },
  game: gameConfig,
  translate,
  element,
  get: getConfig,
  skill: {},
  help: {},
};
