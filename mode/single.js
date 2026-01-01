import { lib, game, ui, get, ai, _status } from "../noname.js";
export const type = "mode";
/**
 * @type { () => importModeConfig }
 */
export default () => {
	return {
		name: "single",
		singlePile: [
			["spade", 5, "sha"],
			["spade", 7, "sha"],
			["spade", 8, "sha"],
			["spade", 10, "sha"],
			["heart", 10, "sha"],
			["heart", 11, "sha"],
			["club", 4, "sha"],
			["club", 5, "sha"],
			["club", 6, "sha"],
			["club", 8, "sha"],
			["club", 9, "sha"],
			["club", 10, "sha"],
			["club", 11, "sha"],
			["diamond", 6, "sha"],
			["diamond", 9, "sha"],
			["diamond", 11, "sha"],
			["heart", 2, "shan"],
			["heart", 5, "shan"],
			["diamond", 2, "shan"],
			["diamond", 3, "shan"],
			["diamond", 7, "shan"],
			["diamond", 8, "shan"],
			["diamond", 10, "shan"],
			["diamond", 11, "shan"],
			["heart", 3, "tao"],
			["heart", 4, "tao"],
			["heart", 9, "tao"],
			["diamond", 12, "tao"],
			["club", 12, "bingliang"],
			["spade", 3, "guohe"],
			["diamond", 12, "guohe"],
			["club", 3, "guohe"],
			["club", 1, "juedou"],
			["spade", 1, "juedou"],
			["heart", 6, "lebu"],
			["spade", 1, "nanman"],
			["club", 7, "shuiyanqijunx"],
			["spade", 4, "shunshou"],
			["spade", 11, "shunshou"],
			["diamond", 4, "shunshou"],
			["heart", 1, "wanjian"],
			["heart", 5, "wuxie"],
			["club", 5, "wuxie"],
			["heart", 7, "wuzhong"],
			["heart", 8, "wuzhong"],
			["diamond", 5, "guanshi"],
			["spade", 9, "hanbing"],
			["spade", 6, "qinggang"],
			["spade", 12, "zhangba"],
			["diamond", 1, "zhuge"],
			["spade", 2, "bagua"],
			["club", 2, "renwang"],
		],
		startBefore() {},
		start() {
			"step 0";
			_status.mode = _status.connectMode ? lib.configOL.single_mode : get.config("single_mode");
			var playback = localStorage.getItem(lib.configprefix + "playback");
			if (playback) {
				ui.create.me();
				ui.arena.style.display = "none";
				ui.system.style.display = "none";
				_status.playback = playback;
				localStorage.removeItem(lib.configprefix + "playback");
				var store = lib.db.transaction(["video"], "readwrite").objectStore("video");
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
				game.prepareArena(2);
			}
			"step 1";
			if (_status.connectMode) {
				game.waitForPlayer(function () {
					lib.configOL.number = 2;
				});
			}
			"step 2";
			if (_status.connectMode) {
				lib.configOL.number = 2;
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
			"step 3";
			if (ui.coin) {
				_status.coinCoeff = get.coinCoeff([game.me.name]);
			}

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
			if (_status.connectMode && lib.configOL.change_card) {
				game.replaceHandcards(game.players.slice(0));
			}
			"step 4";
			game.phaseLoop(game.zhu);
			game.countPlayer(current => current.showGiveup(), true);
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
								str += lib.translate[list[i] + "2"] + "：" + data[j][list[i]][0] + "胜" + " " + data[j][list[i]][1] + "负<br>";
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
			getRoomInfo: function (uiintro) {
				if (lib.configOL.single_mode == "normal") {
					uiintro.add('<div class="text chat">晋势力武将：' + (lib.configOL.enable_jin ? "开启" : "关闭"));
				}
				if (lib.configOL.bannedcards.length) {
					uiintro.add('<div class="text chat">禁用卡牌：' + get.translation(lib.configOL.bannedcards));
				}
				uiintro.style.paddingBottom = "8px";
			},
			getVideoName: function () {
				var str = get.translation(game.me.name);
				if (game.me.name2) {
					str += "/" + get.translation(game.me.name2);
				}
				var name = [str, get.translation(_status.mode + 2) + " - " + lib.translate[game.me.identity + "2"]];
				return name;
			},
			showIdentity: function () {},
			checkResult: function () {
				game.over((game.me._trueMe || game.me).isAlive());
			},
			checkOnlineResult: function (player) {
				return player.isAlive();
			},
			chooseCharacterDianjiang: function () {
				var next = game.createEvent("chooseCharacter");
				next.showConfig = true;
				next.setContent(function () {
					"step 0";
					ui.arena.classList.add("choose-character");
					lib.init.onfree();
					"step 1";
					game.me.chooseControl("先手", "后手").prompt = "请选择自己的行动顺序";
					"step 2";
					var map = result.control == "先手" ? ["zhu", "fan"] : ["fan", "zhu"];
					game.me.identity = map[0];
					game.me.next.identity = map[1];
					game.me.showIdentity();
					game.me.next.showIdentity();
					"step 3";
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
					"step 4";
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
					"step 5";
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
				if (_status.mode == "dianjiang") {
					game.chooseCharacterDianjiang();
					return;
				}
			},
			chooseCharacterDianjiangOL: function () {
				var next = game.createEvent("chooseCharacter");
				next.showConfig = true;
				next.setContent(function () {
					"step 0";
					var map = Math.random() < 0.5 ? ["zhu", "fan"] : ["fan", "zhu"];
					game.me.identity = map[0];
					game.me.next.identity = map[1];
					game.me.showIdentity();
					game.me.next.showIdentity();
					"step 1";
					//event.flipassign=true;
					event.videoId = lib.status.videoId++;
					var list = [];
					var libCharacter = {};
					for (var i = 0; i < lib.configOL.characterPack.length; i++) {
						var pack = lib.characterPack[lib.configOL.characterPack[i]];
						for (var j in pack) {
							if (lib.character[j]) {
								libCharacter[j] = pack[j];
							}
						}
					}
					for (i in libCharacter) {
						if (lib.filter.characterDisabled(i, libCharacter)) {
							continue;
						}
						list.push(i);
					}
					game.broadcastAll(
						function (list, id) {
							_status.characterlist = list;
							var filter = function (name) {
								return !_status.characterlist.includes(name);
							};
							var dialog = ui.create.characterDialog("heightset", filter).open();
							dialog.videoId = id;
							ui.arena.classList.add("choose-character");
						},
						list,
						event.videoId
					);
					game.zhu
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
							})(lib.configOL.double_character)
						)
						.set("dialog", event.videoId);
					"step 2";
					game.broadcastAll(
						function (player, character, id) {
							if (player == game.me) {
								game.addRecentCharacter(character[0]);
							}
							if (character.length !== 2) {
								player.init(character[0]);
							} else {
								player.init(character[0], character[1]);
								if (player == game.me) {
									game.addRecentCharacter(character[1]);
								}
							}
							_status.characterlist.removeArray(character);
						},
						game.zhu,
						result.links
					);
					game.fan
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
							})(lib.configOL.double_character)
						)
						.set("dialog", event.videoId);
					"step 3";
					game.broadcastAll("closeDialog", event.videoId);
					game.broadcastAll(
						function (player, character, id) {
							var dialog = get.idDialog(id);
							if (dialog) {
								dialog.close();
							}
							if (player == game.me) {
								game.addRecentCharacter(character[0]);
							}
							if (character.length !== 2) {
								player.init(character[0]);
							} else {
								player.init(character[0], character[1]);
								if (player == game.me) {
									game.addRecentCharacter(character[1]);
								}
							}
							_status.characterlist.removeArray(character);
							setTimeout(function () {
								ui.arena.classList.remove("choose-character");
							}, 500);
						},
						game.fan,
						result.links,
						event.videoId
					);
				});
			},
			chooseCharacterOL: function () {
				if (_status.mode == "dianjiang") {
					game.chooseCharacterDianjiangOL();
					return;
				}
			},
		},
		element: {
			player: {
				dieAfter: function () {
					if (_status.mode != "normal" || _status.characterChoice[this.identity].length <= 3) {
						game.checkResult();
					}
				},
				logAi: function (targets, card) {},
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
		skill: {},
		translate: {
			zhu: "先",
			fan: "后",
			zhu2: "先手",
			fan2: "后手",
			dianjiang2: "点将单挑",
		},
		help: {},
	};
};
