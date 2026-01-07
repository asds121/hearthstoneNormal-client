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
  server: {
    cardPile() {
      this.send(
        JSON.stringify({
          type: "cardPile",
          data: {
            drawPile: Array.from(ui.cardPile.children),
            discardPile: Array.from(ui.discardPile.children),
          },
        })
      );
    },
    /**
     * @this {import("./element/client.js").Client}
     */
    init(version, config, banned_info) {
      var show_deckMonitor = false;
      if (lib.config.show_deckMonitor && lib.config.show_deckMonitor_online) {
        show_deckMonitor = true;
      }
      this.send(function (show_deckMonitor) {
        if (show_deckMonitor) {
          ui.deckMonitor.style.display = "";
        } else {
          ui.deckMonitor.style.display = "none";
        }
      }, show_deckMonitor);
      this.onlineKey = config.onlineKey;
      var banBlacklist =
        lib.config.banBlacklist === undefined ? [] : lib.config.banBlacklist;
      if (
        lib.node.banned.includes(banned_info) ||
        banBlacklist.includes(config.onlineKey)
      ) {
        this.send("denied", "banned");
      } else if (config.id && lib.playerOL && lib.playerOL[config.id]) {
        var player = lib.playerOL[config.id];
        player.setNickname();
        player.ws = this;
        player.isAuto = false;
        this.id = config.id;
        game.broadcast(function (player) {
          player.setNickname();
        }, player);
        this.send(
          "reinit",
          lib.configOL,
          get.arenaState(),
          game.getState ? game.getState() : {},
          game.ip,
          null,
          _status.onreconnect,
          _status.cardtag,
          _status.postReconnect
        );
      } else if (version != lib.versionOL) {
        this.send("denied", "version");
        lib.node.clients.remove(this);
        this.closed = true;
      } else if (
        get.config("check_versionLocal", "connect") &&
        config.versionLocal != lib.version
      ) {
        this.send("denied", "version");
        lib.node.clients.remove(this);
        this.closed = true;
      } else if (get.config("check_extension", "connect") && config.extension) {
        this.send("denied", "extension");
      } else if (!_status.waitingForPlayer) {
        if (!config.nickname) {
          this.send("denied", "banned");
          lib.node.clients.remove(this);
          this.closed = true;
        } else if (game.phaseNumber && lib.configOL.observe) {
          lib.node.observing.push(this);
          this.send(
            "reinit",
            lib.configOL,
            get.arenaState(),
            game.getState ? game.getState() : {},
            game.ip,
            game.players[0].playerid,
            null,
            _status.cardtag,
            _status.postReconnect
          );
          // 没有系统提示的接口喵？
          game.log(
            "玩家 ",
            `#y${get.plainText(config.nickname)}`,
            " 进入房间观战"
          );
          game.me.chat(
            `玩家 <span style="font-weight: bold; color: rgb(126, 180, 255)">${get.plainText(config.nickname)}</span> 进入房间观战`
          );
          if (!ui.removeObserve) {
            ui.removeObserve = ui.create.system(
              "移除旁观",
              function () {
                lib.configOL.observe = false;
                if (game.onlineroom) {
                  game.send("server", "config", lib.configOL);
                }
                while (lib.node.observing.length) {
                  lib.node.observing.shift().ws.close();
                }
                this.remove();
                delete ui.removeObserve;
              },
              true,
              true
            );
          }
        } else {
          this.send("denied", "gaming");
          lib.node.clients.remove(this);
          this.closed = true;
        }
      } else if (
        lib.node.clients.length - (window.isNonameServer ? 1 : 0) >=
        parseInt(lib.configOL.number)
      ) {
        this.send("denied", "number");
        lib.node.clients.remove(this);
        this.closed = true;
      } else {
        if (config) {
          this.avatar = config.avatar;
          this.nickname = config.nickname;
        }
        for (var i = 0; i < game.connectPlayers.length; i++) {
          if (game.connectPlayers[i].classList.contains("unselectable2")) {
            continue;
          }
          if (
            game.connectPlayers[i] != game.me &&
            !game.connectPlayers[i].playerid
          ) {
            game.connectPlayers[i].playerid = this.id;
            game.connectPlayers[i].initOL(this.nickname, this.avatar);
            game.connectPlayers[i].ws = this;
            break;
          }
        }
        this.send(
          "init",
          this.id,
          lib.configOL,
          game.ip,
          window.isNonameServer,
          game.roomId
        );
      }
    },
    /**
     * @this {import("./element/client.js").Client}
     */
    inited() {
      this.inited = true;
      if (_status.waitingForPlayer) {
        game.updateWaiting();
      }
    },
    /**
     * @this {import("./element/client.js").Client}
     */
    reinited() {
      this.inited = true;
    },
    /**
     * @this {import("./element/client.js").Client}
     */
    result(result) {
      if (lib.node.observing.includes(this)) {
        return;
      }
      var player = lib.playerOL[this.id];
      if (player) {
        player.unwait(result);
      }
    },
    /**
     * @this {import("./element/client.js").Client}
     */
    tempResult(result) {
      if (lib.node.observing.includes(this)) {
        return;
      }
      var player = lib.playerOL[this.id];
      if (player) {
        player.tempUnwait(result);
      }
    },
    /**
     * @this {import("./element/client.js").Client}
     */
    startGame() {
      if (this.id == game.onlinezhu) {
        game.resume();
      }
    },
    /**
     * @this {import("./element/client.js").Client}
     */
    changeRoomConfig(config) {
      if (this.id == game.onlinezhu) {
        game.broadcastAll(function (config) {
          for (var i in config) {
            lib.configOL[i] = config[i];
          }
          if (ui.connectStartBar) {
            ui.connectStartBar.firstChild.innerHTML = get.modetrans(
              lib.configOL,
              true
            );
          }
        }, config);
        if (
          lib.configOL.mode == "identity" &&
          lib.configOL.identity_mode == "zhong" &&
          game.connectPlayers
        ) {
          for (var i = 0; i < game.connectPlayers.length; i++) {
            game.connectPlayers[i].classList.remove("unselectable2");
          }
          lib.configOL.number = 8;
          game.updateWaiting();
        }
        if (game.onlineroom) {
          game.send("server", "config", lib.configOL);
        }
        for (var i = 0; i < game.connectPlayers.length; i++) {
          if (game.connectPlayers[i].playerid == this.id) {
            game.connectPlayers[i].chat("房间设置已更改");
          }
        }
      }
    },
    /**
     * @this {import("./element/client.js").Client}
     */
    changeNumConfig(num, index, bool) {
      if (this.id == game.onlinezhu) {
        lib.configOL.number = num;
        game.send("server", "config", lib.configOL);
        if (game.connectPlayers && game.connectPlayers[index]) {
          if (bool) {
            game.connectPlayers[index].classList.add("unselectable2");
          } else {
            game.connectPlayers[index].classList.remove("unselectable2");
          }
          game.updateWaiting();
        }
      }
    },
    /**
     * @this {import("./element/client.js").Client}
     */
    throwEmotion(target, emotion, rotate) {
      if (lib.node.observing.includes(this)) {
        return;
      }
      var player = lib.playerOL[this.id];
      if (player) {
        player.throwEmotion(target, emotion, rotate);
      }
    },
    /**
     * @this {import("./element/client.js").Client}
     */
    emotion(id, pack, emotion) {
      if (lib.node.observing.includes(this)) {
        return;
      }
      var that = this;
      if (
        !this.id ||
        (!lib.playerOL[this.id] &&
          (!game.connectPlayers ||
            !(function () {
              for (var i = 0; i < game.connectPlayers.length; i++) {
                if (game.connectPlayers[i].playerid == that.id) {
                  return true;
                }
              }
              return false;
            })()))
      ) {
        return;
      }
      var player;
      if (lib.playerOL[id]) {
        player = lib.playerOL[id];
      } else if (game.connectPlayers) {
        for (var i = 0; i < game.connectPlayers.length; i++) {
          if (game.connectPlayers[i].playerid == id) {
            player = game.connectPlayers[i];
            break;
          }
        }
      }
      if (player) {
        player.emotion(pack, emotion);
      }
    },
    /**
     * @this {import("./element/client.js").Client}
     */
    chat(id, str) {
      if (lib.node.observing.includes(this)) {
        return;
      }
      var that = this;
      if (
        !this.id ||
        (!lib.playerOL[this.id] &&
          (!game.connectPlayers ||
            !(function () {
              for (var i = 0; i < game.connectPlayers.length; i++) {
                if (game.connectPlayers[i].playerid == that.id) {
                  return true;
                }
              }
              return false;
            })()))
      ) {
        return;
      }
      var player;
      if (lib.playerOL[id]) {
        player = lib.playerOL[id];
      } else if (game.connectPlayers) {
        for (var i = 0; i < game.connectPlayers.length; i++) {
          if (game.connectPlayers[i].playerid == id) {
            player = game.connectPlayers[i];
            break;
          }
        }
      }
      if (player) {
        player.chat(str);
      }
    },
    /**
     * ```plain
     * 当客机向主机发送投降请求时的回调
     * ```
     *
     * @this {import("./element/client.js").Client}
     * @param {Player} player
     */
    giveup(player) {
      if (lib.node.observing.includes(this) || !player || !player._giveUp) {
        return;
      }
      var self = lib.playerOL[this.id];
      if (self !== player) {
        return;
      } // 禁止让别人投降
      _status.event.next.length = 0;
      game
        .createEvent("giveup", false)
        .set("includeOut", true)
        .setContent(function () {
          game.log(player, "投降");
          player.popup("投降");
          player.die("nosource").includeOut = true;
        }).player = player;
    },
    /**
     * @this {import("./element/client.js").Client}
     */
    auto() {
      if (lib.node.observing.includes(this)) {
        return;
      }
      var player = lib.playerOL[this.id];
      if (player) {
        player.isAuto = true;
        player.setNickname(player.nickname + " - 托管");
        game.broadcast(function (player) {
          player.setNickname(player.nickname + " - 托管");
        }, player);
      }
    },
    /**
     * @this {import("./element/client.js").Client}
     */
    unauto() {
      if (lib.node.observing.includes(this)) {
        return;
      }
      var player = lib.playerOL[this.id];
      if (player) {
        player.isAuto = false;
        player.setNickname(player.nickname);
        game.broadcast(function (player) {
          player.setNickname(player.nickname);
        }, player);
      }
    },
    exec(func) {
      // if(typeof func=='function'){
      //     var args=Array.from(arguments);
      //     args.shift();
      //     func.apply(this,args);
      // }
    },
    /**
     * @this {import("./element/client.js").Client}
     */
    log() {
      var items = [];
      try {
        for (var i = 0; i < arguments.length; i++) {
          items.push(this.sandbox.exec(`return ${arguments[i]}`));
        }
      } catch (e) {
        this.send("log", ["err"]);
        return;
      }
      this.send("log", items);
    },
  },
  client: {
    log: function (arr) {
      if (Array.isArray(arr)) {
        for (var i = 0; i < arr.length; i++) {
          console.log(arr[i]);
        }
      }
    },
    opened: function () {
      game.send(
        "init",
        lib.versionOL,
        {
          id: game.onlineID,
          onlineKey: game.onlineKey,
          avatar: lib.config.connect_avatar,
          nickname: get.connectNickname(),
          versionLocal: lib.version,
          extension: lib.config.extensions.some(
            (ext) => lib.config[`extension_${ext}_enable`]
          ),
        },
        lib.config.banned_info
      );
      if (ui.connecting && !ui.connecting.splashtimeout) {
        ui.connecting.firstChild.innerHTML = "重连成功";
      }
    },
    onconnection: (id) =>
      lib.init.connection((lib.wsOL[id] = new lib.element.NodeWS(id))),
    onmessage: function (id, message) {
      if (lib.wsOL[id]) {
        lib.wsOL[id].onmessage(message);
      }
    },
    onclose: function (id) {
      if (lib.wsOL[id]) {
        lib.wsOL[id].onclose();
      }
    },
    selfclose: function () {
      if (game.online || game.onlineroom) {
        if ((game.servermode || game.onlinehall) && _status.over) {
          // later
        } else {
          game.saveConfig("tmp_user_roomId");
        }
      }
      game.ws.close();
    },
    reloadroom: function (forced) {
      if (window.isNonameServer && (forced || !_status.protectingroom)) {
        game.reload();
      }
    },
    createroom: function (index, config, mode) {
      game.online = false;
      game.onlineroom = true;
      game.roomId = index;
      lib.node = {};
      if (config && mode && window.isNonameServer) {
        if (mode == "auto") {
          mode = lib.configOL.mode;
        }
        game.switchMode(mode, config);
      } else {
        game.switchMode(lib.configOL.mode);
      }
      ui.create.connecting(true);
    },
    enterroomfailed: function () {
      alert("请稍后再试");
      _status.enteringroom = false;
      ui.create.connecting(true);
    },

    reinit: function (
      config,
      state,
      state2,
      ip,
      observe,
      onreconnect,
      cardtag,
      postReconnect
    ) {
      ui.auto.show();
      ui.pause.show();
      game.clearConnect();
      clearTimeout(_status.createNodeTimeout);
      game.online = true;
      game.ip = ip;
      game.servermode = state.servermode;
      game.roomId = state.roomId;
      if (state.over) {
        _status.over = true;
      }
      if (observe) {
        game.observe = true;
        game.onlineID = null;
        game.roomId = null;
      }
      if (game.servermode && !observe) {
        game.saveConfig("reconnect_info", [
          _status.ip,
          game.onlineID,
          game.roomId,
        ]);
      } else {
        game.saveConfig("reconnect_info", [_status.ip, game.onlineID]);
        if (!observe) {
          game.saveConfig("tmp_user_roomId", game.roomId);
        }
      }
      _status.connectMode = true;
      lib.configOL = config;
      lib.playerOL = {};
      lib.cardOL = {};
      lib.vcardOL = {};

      game.loadModeAsync(config.mode, function (mode) {
        for (var i in mode.ai) {
          if (typeof mode.ai[i] == "object") {
            if (ai[i] == undefined) {
              ai[i] = {};
            }
            for (var j in mode.ai[i]) {
              ai[i][j] = mode.ai[i][j];
            }
          } else {
            ai[i] = mode.ai[i];
          }
        }
        for (var i in mode.get) {
          if (typeof mode.get[i] == "object") {
            if (get[i] == undefined) {
              get[i] = {};
            }
            for (var j in mode.get[i]) {
              get[i][j] = mode.get[i][j];
            }
          } else {
            get[i] = mode.get[i];
          }
        }
        for (var i in mode.translate) {
          lib.translate[i] = mode.translate[i];
        }
        if (mode.game) {
          game.getIdentityList = mode.game.getIdentityList;
          game.getIdentityList2 = mode.game.getIdentityList2;
          game.updateState = mode.game.updateState;
          game.showIdentity = mode.game.showIdentity;
        }
        if (mode.element && mode.element.player) {
          Object.defineProperties(
            lib.element.Player.prototype,
            Object.getOwnPropertyDescriptors(mode.element.player)
          );
        }
        if (mode.skill) {
          for (var i in mode.skill) {
            lib.skill[i] = mode.skill[i];
          }
        }
        if (mode.card) {
          for (var i in mode.card) {
            lib.card[i] = mode.card[i];
          }
        }
        game.finishCards();
        if (mode.characterPack) {
          for (var i in mode.characterPack) {
            lib.characterPack[i] = mode.characterPack[i];
          }
        }
        if (mode.onreinit) {
          mode.onreinit();
        }
        _status.cardtag = get.parsedResult(cardtag);
        game.players = [];
        game.dead = [];
        for (var i in lib.characterPack) {
          for (var j in lib.characterPack[i]) {
            lib.character[j] = lib.character[j] || lib.characterPack[i][j];
          }
        }
        game.clearArena();
        game.finishCards();
        if (!observe) {
          ui.create.chat();
          if (ui.exitroom) {
            ui.exitroom.remove();
            delete ui.exitroom;
          }
        } else {
          if (!ui.exitroom) {
            ui.create.system(
              "退出旁观",
              function () {
                game.saveConfig("reconnect_info");
                game.reload();
              },
              true
            );
          }
          if (!lib.configOL.observe_handcard) {
            ui.arena.classList.add("observe");
          }
        }
        postReconnect = get.parsedResult(postReconnect);
        for (var i in postReconnect) {
          if (Array.isArray(postReconnect[i])) {
            postReconnect[i].shift().apply(this, postReconnect[i]);
          }
        }
        state = get.parsedResult(state);
        ui.arena.setNumber(state.number);
        _status.mode = state.mode;
        _status.renku = state.renku;
        lib.inpile = state.inpile;
        lib.inpile_nature = state.inpile_nature;
        var pos = state.players[observe || game.onlineID].position;
        for (var i in state.players) {
          var info = state.players[i];
          var player = ui.create.player(ui.arena).addTempClass("start");
          player.dataset.position =
            info.position < pos
              ? info.position - pos + parseInt(state.number)
              : info.position - pos;
          if (i == observe || i == game.onlineID) {
            game.me = player;
          }
          if (player.setModeState) {
            player.setModeState(info);
          } else {
            player.init(info.name1, info.name2);
            if (info.name && info.name != info.name1) {
              player.name = info.name;
            }
          }
          if (!info.unseen) {
            player.classList.remove("unseen");
          }
          if (!info.unseen2) {
            player.classList.remove("unseen2");
          }
          if (!player.isUnseen(2) && player.storage.nohp) {
            delete player.storage.nohp;
            player.node.hp.show();
          }
          player.playerid = i;
          player.nickname = info.nickname;
          player.group = info.group;
          player.node.name.dataset.nature = get.groupnature(info.group);
          player.identity = info.identity;
          player.identityShown = info.identityShown;
          player.hp = info.hp;
          player.maxHp = info.maxHp;
          player.hujia = info.hujia;
          player.sex = info.sex;
          player.side = info.side;
          player.phaseNumber = info.phaseNumber;
          player.seatNum = info.seatNum;
          player.disabledSlots = info.disabledSlots;
          player.expandedSlots = info.expandedSlots;
          player.setNickname();
          if (info.dead) {
            player.classList.add("dead");
            if (lib.config.die_move) {
              player.$dieflip();
            }
            if (player.$dieAfter) {
              player.$dieAfter();
            }
            game.dead.push(player);
          } else {
            game.players.push(player);
          }
          if (info.linked) {
            player.addLink();
          }
          if (info.turnedover) {
            player.classList.add("turnedover");
          }
          if (info.out) {
            player.classList.add("out");
          }
          if (info.disableJudge) {
            player.$disableJudge();
          }
          player.$syncDisable();

          player.directgain(info.handcards);
          lib.playerOL[i] = player;
          /*if (info.vcardsMap) {
							for (var i = 0; i < info.vcardsMap.equips.length; i++) {
								player.addVirtualEquip(info.vcardsMap.equips[i], info.vcardsMap.equips[i].cards);
							}
							for (var i = 0; i < info.vcardsMap.judges.length; i++) {
								player.addVirtualJudge(info.vcardsMap.judges[i], info.vcardsMap.judges[i].cards);
							}
						}*/
          for (var i = 0; i < info.equips.length; i++) {
            let card = info.equips[i],
              id = card.cardid,
              map = info.equips_map[id];
            card.fix();
            card.style.transform = "";
            card.classList.remove("drawinghidden");
            delete card._transform;
            if (map.isViewAsCard) {
              card.isViewAsCard = true;
              if (map._destroyed_Virtua) {
                card._destroyed_Virtua = map._destroyed_Virtua;
              }
              if (map.destroyed) {
                card.destroyed = map.destroyed;
              }
              card.cards = map?.vcard?.cards || [];
              card.viewAs = map?.vcard?.name || card.name;
              card.classList.add("fakeequip");
            } else {
              card.classList.remove("fakeequip");
              delete card.viewAs;
            }
            if (map.name2) {
              card.node.name2.innerHTML = map.name2;
            }
            if (map.vcard) {
              const cardSymbol = Symbol("card");
              card.cardSymbol = cardSymbol;
              card[cardSymbol] = map.vcard;
              if (map.vcard.subtypes) {
                card.subtypes = map.vcard.subtypes;
              }
              if (map.vcard.cards?.length) {
                for (let j of map.vcard.cards) {
                  j.goto(ui.special);
                  j.destiny = player.node.equips;
                }
              }
              player.addVirtualEquip(map.vcard, map.vcard.cards);
            }
            let equipped = false,
              equipNum = get.equipNum(card);
            if (player.node.equips.childNodes.length) {
              for (let i = 0; i < player.node.equips.childNodes.length; i++) {
                if (
                  get.equipNum(player.node.equips.childNodes[i]) >= equipNum
                ) {
                  equipped = true;
                  player.node.equips.insertBefore(
                    card,
                    player.node.equips.childNodes[i]
                  );
                  break;
                }
              }
            }
            if (equipped === false) {
              player.node.equips.appendChild(card);
            }
          }
          for (var i = 0; i < info.judges.length; i++) {
            let card = info.judges[i],
              id = card.cardid,
              map = info.judges_map[id];
            card.fix();
            card.style.transform = "";
            card.classList.remove("drawinghidden");
            delete card._transform;
            if (map.isViewAsCard) {
              card.isViewAsCard = true;
              if (map._destroyed_Virtua) {
                card._destroyed_Virtua = map._destroyed_Virtua;
              }
              if (map.destroyed) {
                card.destroyed = map.destroyed;
              }
              card.cards = map?.vcard?.cards || [];
              card.viewAs = map?.vcard?.name || card.name;
              card.classList.add("fakejudge");
            } else {
              card.classList.remove("fakejudge");
              delete card.viewAs;
            }
            if (map.name2) {
              card.node.name2.innerHTML = map.name2;
            }
            if (map.vcard) {
              const cardSymbol = Symbol("card");
              card.cardSymbol = cardSymbol;
              card[cardSymbol] = map.vcard;
              if (map.vcard.subtypes) {
                card.subtypes = map.vcard.subtypes;
              }
              if (map.vcard.cards?.length) {
                for (let j of map.vcard.cards) {
                  j.goto(ui.special);
                  j.destiny = player.node.judges;
                }
              }
              player.addVirtualJudge(map.vcard, map.vcard.cards);
            }
            player.node.judges.insertBefore(
              card,
              player.node.judges.firstChild
            );
          }

          for (var i = 0; i < info.handcards.length; i++) {
            info.handcards[i].addGaintag(info.gaintag[i]);
          }
          for (var i = 0; i < info.specials.length; i++) {
            info.specials[i].classList.add("glows");
          }
          if (info.expansions.length) {
            var expansion_gaintag = [];
            player.$addToExpansion(info.expansions);
            for (var i = 0; i < info.expansions.length; i++) {
              info.expansions[i].addGaintag(info.expansion_gaintag[i]);
              expansion_gaintag.addArray(info.expansion_gaintag[i]);
            }
            for (var i of expansion_gaintag) {
              player.markSkill[i];
            }
          }
          for (var i = 0; i < info.judges.length; i++) {
            if (info.views[i] && info.views[i] != info.judges[i]) {
              info.judges[i].classList.add("fakejudge");
              info.judges[i].viewAs = info.views[i];
              info.judges[i].node.background.innerHTML =
                lib.translate[info.views[i] + "_bg"] ||
                get.translation(info.views[i])[0];
            }
            player.node.judges.appendChild(info.judges[i]);
          }
          ui.updatej(player);
          if (!player.setModeState) {
            if (!game.getIdentityList && info.identityNode) {
              player.node.identity.innerHTML = info.identityNode[0];
              player.node.identity.dataset.color = info.identityNode[1];
            } else if (player == game.me || player.identityShown || observe) {
              player.setIdentity();
              player.forceShown = true;
            } else {
              player.setIdentity("cai");
            }
            if (
              !lib.configOL.observe_handcard &&
              (lib.configOL.mode == "identity" ||
                lib.configOL.mode == "guozhan")
            ) {
              if (observe && !player.identityShown) {
                player.setIdentity("cai");
                player.forceShown = false;
              }
            }
          }
          player.update();
        }
        game.arrangePlayers();
        ui.create.me(true);

        _status.event = lib.element.GameEvent.initialGameEvent();
        _status.paused = false;
        _status.dying = get.parsedResult(state.dying) || [];

        if (game.updateState) {
          game.updateState(state2);
        }
        var next = game.createEvent("game", false);
        next.setContent(lib.init.startOnline);
        if (observe) {
          next.custom.replace.target = function (player) {
            if (
              !lib.configOL.observe_handcard &&
              lib.configOL.mode == "guozhan"
            ) {
              return;
            }
            if (player.isAlive()) {
              if (!game.me.identityShown && lib.configOL.mode == "guozhan") {
                game.me.node.identity.firstChild.innerHTML = "猜";
                game.me.node.identity.dataset.color = "unknown";
              }
              game.swapPlayer(player);
              if (!game.me.identityShown && lib.configOL.mode == "guozhan") {
                game.me.node.identity.firstChild.innerHTML = "";
              }
            }
          };
        } else {
          if (Array.isArray(onreconnect)) {
            onreconnect.shift().apply(this, onreconnect);
          }
        }
        game.loop();
        game.send("reinited");
        game.showHistory();
        _status.gameStarted = true;
        if (lib.config.show_cardpile) {
          ui.cardPileButton.style.display = "";
        }
        if (!observe && game.me && (game.me.isDead() || _status.over)) {
          ui.create.exit();
        }
        ui.updatehl();
        ui.create.connecting(true);
      });
    },
    exec: function (func) {
      const key = game.onlineKey;
      if (typeof func == "function") {
        const isMarshalled =
          security.isSandboxRequired() &&
          security.importSandbox().Domain.current.isFrom(func);
        // 被封送的函数额外间隔了四层调用栈
        const level = isMarshalled ? 4 : 0;
        const args = Array.from(arguments).slice(1);
        ErrorManager.errorHandle(
          () => {
            func.apply(this, args);
          },
          func,
          level
        );
      }
      if (key) {
        game.onlineKey = key;
        localStorage.setItem(lib.configprefix + "key", game.onlineKey);
      }
    },
    denied: function (reason) {
      switch (reason) {
        case "version":
          alert("加入失败：版本不匹配，请将游戏更新至最新版");
          game.saveConfig("tmp_owner_roomId");
          game.saveConfig("tmp_user_roomId");
          game.saveConfig("reconnect_info");
          break;
        case "gaming":
          alert("加入失败：游戏已开始");
          break;
        case "number":
          alert("加入失败：房间已满");
          break;
        case "banned":
          alert("加入失败：房间拒绝你加入");
          break;
        case "key":
          alert("您的游戏版本过低，请升级到最新版");
          game.saveConfig("tmp_owner_roomId");
          game.saveConfig("tmp_user_roomId");
          game.saveConfig("reconnect_info");
          break;
        case "offline":
          if (_status.paused && _status.event.name == "game") {
            setTimeout(game.resume, 500);
          }
          break;
        case "extension":
          if (confirm("加入失败：房间禁止使用扩展！是否关闭所有扩展？")) {
            let libexts = lib.config.extensions;
            for (let i = 0; i < libexts.length; i++) {
              game.saveConfig("extension_" + libexts[i] + "_enable", false);
            }
          }
          break;
        default:
          alert(reason); //其它原因直接弹窗显示
      }
      game.ws.close();
      if (_status.connectDenied) {
        _status.connectDenied();
      }
    },
    cancel: function (id) {
      if (_status.event._parent_id == id) {
        ui.click.cancel();
        if (
          _status.event.getParent().name == "chooseToUse" &&
          _status.event.getParent().id == id
        ) {
          _status.event.getParent().cancel(null, null, false);
          if (ui.confirm) {
            ui.confirm.close();
          }
        }
      }
      if (_status.event.id == id) {
        if (_status.event._backup) {
          ui.click.cancel();
        }
        ui.click.cancel();
        if (ui.confirm) {
          ui.confirm.close();
        }
        if (_status.event.result) {
          _status.event.result.id = id;
        }
      }
    },
    closeDialog: function (id) {
      var dialog = get.idDialog(id);
      if (dialog) {
        dialog.close();
      }
    },
    createDialog: function (id) {
      var args = Array.from(arguments);
      args.shift();
      ui.create.dialog.apply(this, args).videoId = id;
    },
    gameStart: function () {
      for (var i = 0; i < game.connectPlayers.length; i++) {
        game.connectPlayers[i].delete();
      }
      delete game.connectPlayers;
      if (ui.connectStartButton) {
        ui.connectStartButton.delete();
        delete ui.connectStartButton;
      }
      if (ui.connectStartBar) {
        ui.connectStartBar.delete();
        delete ui.connectStartBar;
      }
      if (ui.connectShareButton) {
        ui.connectShareButton.delete();
        delete ui.connectShareButton;
      }
      if (ui.roomInfo) {
        ui.roomInfo.remove();
        delete ui.roomInfo;
      }
      if (ui.exitroom) {
        ui.exitroom.remove();
        delete ui.exitroom;
      }
      ui.auto.show();
      ui.pause.show();
      if (lib.config.show_cardpile) {
        ui.cardPileButton.style.display = "";
      }
      _status.gameStarted = true;
      game.showHistory();
    },
    updateWaiting: function (map) {
      if (!game.connectPlayers) {
        return;
      }
      if (!lib.translate.zhu) {
        lib.translate.zhu = "主";
      }
      game.onlinezhu = false;
      _status.waitingForPlayer = true;
      for (var i = 0; i < map.length; i++) {
        if (map[i] == "disabled") {
          game.connectPlayers[i].classList.add("unselectable2");
        } else {
          game.connectPlayers[i].classList.remove("unselectable2");
          if (map[i]) {
            game.connectPlayers[i].initOL(map[i][0], map[i][1]);
            game.connectPlayers[i].playerid = map[i][2];
            if (map[i][3] == "zhu") {
              game.connectPlayers[i].setIdentity("zhu");
              if (map[i][2] == game.onlineID) {
                game.onlinezhu = true;
                if (ui.roomInfo) {
                  ui.roomInfo.innerHTML = "房间设置";
                }
                if (ui.connectStartButton) {
                  ui.connectStartButton.innerHTML = "开始游戏";
                }
              }
            } else {
              game.connectPlayers[i].node.identity.firstChild.innerHTML = "";
            }
          } else {
            game.connectPlayers[i].uninitOL();
            delete game.connectPlayers[i].playerid;
          }
        }
      }
    },
  },
};
