import { lib, game, ui, get, ai, _status } from "../../../../noname.js";
import { utility } from "../utility.js";

// 以下是自定义的事件内容
export const contentDivision = {
	phaseDraw() {
		"step 0"
		get.HSF("checkwin", [event]);
		"step 1"
		if (_status.hs_specialPhaseDraw) {
			_status.hs_specialPhaseDraw(player);
		} else if (!(_status.hs_testing_obj || _status.brawlnophasedraw && player.name == _status.brawlboss)) {
			player.draw();
		}
		"step 2"
		get.HSF("checkdeath");
		"step 3"
		/*修改代码：增加checkhand，修复了托管时手牌不重新调整间距的bug*/
		if (game.me.countCards("h", ca => {
			return lib.filter.filterCard(ca);
		}) && player == game.me) {
			ui.arena.classList.add("hs_view");
			get.HSF("checkhand");
		}
		"step 4"
		get.HSF("think");
		"step 5"
	},
	hs_exchange() { //开局调度
		"step 0"
		game.zhu.next.hs_drawDeck("notrigger");
		"step 1"
		if (!get.HSF("cfg", ["developerMode"])) {
			game.delay(1.5);
		}
		"step 2"
		ui.arena.querySelector(".hs_coin:not(.second)")?.delete();
		if (get.HSF("cfg", ["HS_duelMode"]) != "testing") {
			game.me.hs_exchange2();
		}
	},
	greeting() { //开局
		"step 0"
		// 操作元素
		[".hs_vs", ".hs_mefull", ".hs_enemyfull", ".hs_mejob", ".hs_enemyjob"].forEach(selector => {
			ui.arena.querySelector(selector)?.delete();
		});
		game.me.style.transition = "all 0.5s";
		game.enemy.style.transition = "all 0.5s";
		ui.arena.classList.remove("hs_kaichang2");
		var zhu = game.zhu;
		var oppo = zhu.getOppo();
		var mode = get.HSF("cfg", ["HS_duelMode"]);
		if (mode == "testing") {
			event.hs_testing = true;
		}
		setTimeout(function() {
			ui.arena.classList.remove("hs_kaichang");
			/*代码修改：新增*/
			if (event.hs_testing) {
				get.HSF("first");
				get.HSF("eee", ["hs_exchange"]);
			} else {
				var ty = function(p, b) {
					var tm = p.HSFT("开局", b);
					setTimeout(function() {
						p.classList.remove("bright");
					}, 1600);
					return tm;
				};
				var ddsj = ty(oppo);
				setTimeout(function() {
					setTimeout(function() {
						var coin = ui.create.div(".bright.hs_coin", ui.arena);
						ui.create.div(".img", coin)
						ui.create.div(".comet1", coin);
						ui.create.div(".comet2", coin);
						event.coin = coin;
						setTimeout(function() {
							get.HSF("first");
							var coin = event.coin;
							coin.classList.add("result");
							var bang = ui.create.div(".bright.arrowbang", ui.arena);
							bang.addTempClass("start");
							var bo = game.zhu == game.me;
							bang.innerHTML = bo ? "你抢到了先攻" : "你可以多抽一张牌";
							setTimeout(function() {
								bang.delete();
							}, 1500);
							if (!bo) coin.classList.add("second");
							get.HSF("eee", ["hs_exchange"]);
						}, 1000);
					}, 200);
					setTimeout(function() {
						ty(zhu, true);
					}, ddsj * 1000);
				}, 500);
			}
		}, 500);
		"step 1"
		if (event.hs_testing) {
			game.zhu.cardPile.give(game.zhu.cardPile.getCards("h").slice(0, 3), game.zhu);
			game.zhu.next.cardPile.give(game.zhu.next.cardPile.getCards("h").slice(0, 3), game.zhu.next);
		} else {
			game.zhu.cardPile.give(game.zhu.cardPile.getCards("h").randomGets(3), game.zhu);
			game.zhu.next.cardPile.give(game.zhu.next.cardPile.getCards("h").randomGets(3), game.zhu.next);
		}
		"step 2"
		if (!event.hs_testing) game.delay(2);
		"step 3"
		var ele = document.querySelector("#handcards1>div");
		ele.style.transition = "all 0.5s";
		ele.towork = true;
		"step 4"
		if (!event.hs_testing) game.delay();
		"step 5"
		game.me.mana.listen(function() {
			if (this.classList.contains("memana")) lib.hearthstone.funcs.clickmana();
		});
		game.enemy.mana.listen(function() {
			if (this.classList.contains("memana")) lib.hearthstone.funcs.clickmana();
		});
		"step 6"
		ui.arena.classList.remove("hs_exchange");
		get.HSF("checkhand");
		lib.hearthstone.hs_absl = ui.hs_testfl.getBoundingClientRect().left;
		if (!event.hs_testing) game.delay(2);
		"step 7"
		var coin = ui.arena.querySelector(".hs_coin.second");
		if (coin) {
			coin.classList.add("gain");
			coin.delete();
		}
		game.zhu.next.hs_gain("幸运币", null, false);
		"step 8"
		game.delay(0.5);
		game.me.hs_drawDeck2(i => get.translation(i.name) == "克罗诺姆"); //对战开始时：从牌库里抽到这张牌 ZZADAN
		"step 9"
		ui.arena.classList.add("recovering");
		ui.background.style.transition = "all 3s";
		ui.background.style.filter = "brightness(100%)";
		var i = 0;
		var inte = setInterval(function() {
			game.me.style.filter = "brightness(" + (25 + i * 0.25) + "%)";
			game.enemy.style.filter = "brightness(" + (25 + i * 0.25) + "%)";
			i++;
		}, 10);
		game.pause();
		setTimeout(function() {
			clearInterval(inte);
			game.me.style.filter = "";
			game.enemy.style.filter = "";
			ui.arena.classList.remove("hs_exchange2");
			ui.arena.classList.remove("recovering");
			game.resume();
			setTimeout(function() {
				ui.background.style.transition = "";
			}, 1000);
		}, 3000);
		"step 10"
		/*代码修改：增加时机：游戏开始时*/
		event.trigger("gameStart");
		"step 11"
		/*代码修改：开局后执行作弊代码*/
		if (_status.hs_zuobi_list) {
			const next = game.createEvent("hs_zuobi_list", false);
			next.setContent(function() {
				for (const args of _status.hs_zuobi_list) {
					get.HSF("作弊", args);
				}
				delete _status.hs_zuobi_list;
			});
		}
		"step 12"
		/*代码修改：现在第一个回合也能触发回合开始时扳机了*/
		_status.event.player = game.zhu;
		event.trigger("phaseBegin");
		"step 13"
	},
	emptyHSevent() { //无阶段事件
		"step 0"
		get.HSF("event", [event.name.slice(0, -2), {
			player
		}]);
		"step 1"
		get.HSF("checkdeath");
	},
	emptyHSwait() { //什么都不发生
		"step 0"
		game.delay();
		"step 1"
	},
	checkwin() { //胜负判定
		"step 0"
		/*代码修改：如果是投降，血没扣完也死*/
		if (game.me.hp <= 0 || game.me.istouxiang) game.me.hs_losing = true;
		if (game.enemy.hp <= 0) game.enemy.hs_losing = true;
		if (game.me.hs_losing || game.enemy.hs_losing) get.HSF("think");
		else event.finish();
		"step 1"
		var df = function(p) {
			if (p.hs_losing) {
				p.removegjz("dongjied");
				//代码修改，增加投降语音
				if (p.istouxiang) {
					p.HSFT("投降");
				} else {
					p.HSF("Aud3", ["死亡"]);
				}
			}
		};
		df(game.me);
		df(game.enemy);
		get.HSF("checkfellow");
		if (game.me.hs_losing && game.enemy.hs_losing) {
			game.me.$die();
			game.enemy.$die();
			game.players.removeArray([game.me, game.enemy]);
			game.dead.addArray([game.me, game.enemy]);
			game.over("平局");
		} else if (game.me.hs_losing) game.me.die();
		else game.enemy.die();
		"step 2"
	},
	hs_use_minor() { //使用随从
		"step 0"
		//扣费阶段
		event.usingcost = cards[0].cost();
		player.HSF("usemana", [event.usingcost]);
		player.sctp("field", t => {
			t.buff.forEach(o => {
				if (o.used === false && o.countphase == player && o.name == "hs_cost" && o.type2 == "cost" && o.fil(card, player)) o.used = true;
			});
		});
		//检测是否能触发战吼和连击
		var name = get.HSF("tr", [card.name]);
		game.log(player, "使用了", card);
		if (get.subtype(card) == "HS_effect") {
			var info = lib.skill[name];
			if (info.active?.(player)) event.active = true;
			event.onc = {
				type: "lianji",
				can: true,
				needtarget: false,
				tgs: [],
				will: true,
			};
			if (info.battleRoal) {
				event.onc.type = "battleRoal";
				if (info.battleRoal.filter) {
					var nf = get.HSF("strfil", [info.battleRoal.filter]);
					info.battleRoal.filter = nf;
					if (!nf(player, cards[0])) event.onc.can = false;
				}
			}
			var tp = event.onc.type;
			if (!info[tp]) event.onc.can = false;
			if (tp == "lianji" && !event.active) event.onc.can = false;
			if (event.onc.can) {
				if (info[tp].filterTarget) {
					event.onc.needtarget = true;
					event.onc.tgs = game.filterPlayer(function(target) {
						return player.HSF("canbetarget", [null, target, "battleroal"]) && info[tp].filterTarget(card, player, target);
					});
					if (event.onc.tgs.length == 0) event.onc.can = false;
				}
			}
			event.info = info;
		}
		"step 1"
		//扔牌动画
		get.HSF("checkfellow");
		game.me.HSF("hs_testfl");
		player.lose(cards, ui.special);
		event.node = player.$throw(cards, 500);
		//game.delay(0.5);
		"step 2"
		get.HSF("checkhand");
		"step 3"
		//创建随从
		var pos = player.settlehsFL();
		const fellow = lib.element.HSfellow.create(player, pos, cards);
		//播放入场动画
		var rcdhs = fellow.hs_rcdh(pos, null, null, null, "落地");
		event.rcdh = rcdhs[0];
		event.rctm = rcdhs[1];
		player.actcharacterlist.add(fellow).sort(lib.sort.position);
		//扔牌动画结束
		if (event.node) event.node.moveDelete(fellow);
		event.link = fellow;
		"step 4"
		//等待入场动画完成
		var plp = function() {
			get.HSF("Aud", [card, "play", player]);
		};
		setTimeout(plp, event.rctm);
		player.HSF("hsdouble");
		game.log(player, "召唤了", event.link);
		get.HSF("morefocus", event.link.linkCard);
		get.HSF("arrange");
		"step 5"
		//选目标
		if (event.onc?.can && event.onc?.needtarget) {
			var info = event.info;
			var tgs = event.onc.tgs;
			var tp = event.onc.type;
			if (tgs.includes(game.me)) get.HSF("clickmana", [false]);
			var next = player.chooseTarget((info.prompt || get.HSF("prompt", [card])), function(card, player, target) {
				return tgs.includes(target);
			}, true);
			next.set("pl", player);
			var ai = () => 1;
			if (info[tp].aifamily) {
				switch (info[tp].aifamily) {
					case "damage":
						ai = function(target) {
							var player = _status.event.pl;
							return get.dmgEffect(target, player, player) + 0.1;
						};
						break;
					case "recover":
						ai = function(target) {
							var player = _status.event.pl;
							return get.rcvEffect(target, player, player);
						};
						break;
					case "atk":
						ai = function(target) {
							var player = _status.event.pl;
							if (target.summoned && !target.hasgjz("chongfeng")) return 0;
							if (target.getLeader() != player) return 0;
							return target.ATK == 0 ? 3 : target.ATK;
						};
					case "hp":
						ai = function(target) {
							var player = _status.event.pl;
							if (target.getLeader() != player) return 0;
							return target.hp;
						};
					default:
				}
			}
			next.set("ai", ai);
		} else {
			game.delay(event.rctm / 1000);
			event.goto(7);
		}
		"step 6"
		event.target = result.targets[0];
		"step 7"
		//随从进场，效果可以触发
		event.link.hs_yin(event.rctm);
		_status.hsAttendSeq.ad(event.link);
		event.link.HSF("uptris");
		game.delay(get.hslegend(event.link) ? 2.4 : 1.9);
		"step 8"
		/*代码修改：手动光环刷新*/
		get.HSF("updateauras", [true]);
		//反制阶段
		get.HSF("event", ["useCardBefore", {
			player,
			card,
			cards,
			target,
			targets,
		}]);
		"step 9"
		player.actionHistory[player.actionHistory.length - 1].useCard.push(event);
		if (!game.getGlobalHistory().useCard) game.getGlobalHistory().useCard = [];
		game.getGlobalHistory().useCard.push(event);
		if (player.stat[player.stat.length - 1].card[card.name] == undefined) {
			player.stat[player.stat.length - 1].card[card.name] = 1;
		} else {
			player.stat[player.stat.length - 1].card[card.name]++;
		}
		//抉择变形
		event.link.hs_juezetrans(card);
		"step 10"
		//增加"预召唤"的时机
		get.HSF("event", ["summonBefore", {
			player,
			card: cards[0],
			link: event.link
		}]);
		"step 11"
		//使用时事件
		get.HSF("event", ["useCard", {
			player,
			card,
			cards,
			target,
			targets,
			link: event.link
		}]);
		"step 12"
		//增加"召唤时"的时机
		get.HSF("event", ["summonSucc", {
			player,
			card: cards[0],
			link: event.link
		}]);
		"step 13"
		//过载
		var info = get.info(card);
		if (info.hs_gz) {
			var num = info.hs_gz;
			player.addMark("hs_mana_owed", num, false);
			game.log(player, "过载了", num, "个法力水晶");
			player.HSF("updatemana");
			get.HSF("event", ["overload", {
				player,
				card,
				cards,
				num,
			}]);
		}
		"step 14"
		//死亡阶段
		get.HSF("checkdeath");
		if (!event.onc) event.goto(21);
		"step 15"
		//战吼次数
		if (event.onc.can && event.link.triggers.battleRoal) {
			event.zh_num = 1;
			event.zhed = 0;
			if (player.hasAuras("doublebattleroal")) event.zh_num = 2;
			if (event.link.triggers.battleRoal.bonus) event.zh_num += event.link.triggers.battleRoal.bonus(player, event.link);
			event.battleRoal_con = event.link.triggers.battleRoal;
		} else {
			if (event.onc.type == "battleRoal") event.link.addTempClass("zhanhou");
			event.goto(19);
		}
		"step 16"
		//重选目标
		if (target) get.HSF("event", ["battleRoalTo", {
			player,
			card,
			cards,
			target,
			targets,
		}]);
		"step 17"
		//战吼
		event.link.addTempClass("zhanhou");
		if (!target || target.HSF("alive", [true])) {
			var cancel = false;
			var recheck = event.info.battleRoal.recheck;
			if (["机械", "存活", "龙牌", "空手"].includes(event.info.battleRoal.filter)) recheck = "filter";
			if (recheck) {
				if (typeof recheck == "string") {
					if (recheck == "filter" && event.info.battleRoal.filter) {
						var fs = event.info.battleRoal.filter;
						var ff = function(e, p, f) {
							return fs(p);
						};
						recheck = ff;
					} else {
						var arr = recheck.split(",");
						if (arr.length == 1) {
							var f = get.HSA("funcs")[arr[0]];
							if (f) recheck = f;
							else get.hs_alt("战吼recheck:", recheck);
						} else {
							var fs = arr.map(i => get.HSA("funcs")[i]);
							var ff = function(e, p, f) {
								return ff.fs.every(i => i(e, p, f));
							};
							ff.fs = fs;
							recheck = ff;
						}
					}

				}
				if (!recheck(null, player, event.link, event.info.battleRoal)) cancel = true;
			}
			if (!cancel) event.toRun = event.link.hs_battleRoal(event.target, event.battleRoal_con, event.active);
		}
		"step 18"
		event.zhed++;
		if (event.zhed < event.zh_num) {
			get.HSF("updateauras", [true]);
			game.delay();
			event.goto(17);
		}
		"step 19"
		if (event.onc?.type == "lianji" && event.onc?.can) {
			event.link.addTempClass("zhanhou");
			if (target) event.link.HSline(target, "green");
			event.insert(event.info.lianji.effect, {
				fellow: event.link,
				player,
				target,
			});
		}
		"step 20"
		//抉择
		if (event.info.jueze) event.link.hs_jueze(event.info.jueze);
		"step 21"
		//死亡阶段
		get.HSF("checkdeath");
		"step 22"
		//交换顺序
		//使用后事件
		player.hs_state.useCard++;
		get.HSF("event", ["useCardAfter", {
			player,
			card,
			cards,
			target,
			targets,
			link: event.link
		}]);
		"step 23";
		//交换顺序
		//增加"召唤后"的时机
		if (event.link.HSF("alive")) get.HSF("event", ["summonAfter", {
			player,
			card: cards[0],
			link: event.link
		}]);
		"step 24"
		//死亡阶段
		get.HSF("checkdeath");
		"step 25"
		get.HSF("think");
	},
	hs_use_spell() { //使用法术
		"step 0"
		var info = get.info(card);
		event.info = info;
		if (info.active?.(player)) {
			event.active = true;
		}
		if (player.HSF("manamax") == 10 && ["hs_WildGrowth", "hs_AstralCommunion"].includes(card.name)) {
			event.hs_guosheng = true;
		}
		event.usingcost = cards[0].cost();
		player.HSF("usemana", [event.usingcost]);
		player.lose(cards, ui.special);
		/*代码修改：如果是奥秘，就不显示扔牌动画，改为*/
		if (get.subtype(card) != "HS_secret") {
			event.node = player.$throw(cards, 1000);
			game.delay(0.5);
		}
		"step 1"
		get.HSF("checkhand");
		if (event.node) {
			event.node.delete();
		}
		"step 2"
		//法术进场
		/*代码修改：如果是奥秘，不显示详情*/
		if (get.subtype(card) == "HS_secret") {
			get.HSF("morefocus", [event.info.rnature]);
		} else {
			get.HSF("morefocus", cards);
		}
		get.HSF("updateauras", [true]);
		_status.hsAttendSeq.ad(cards[0]);
		"step 3"
		//反制阶段
		get.HSF("event", ["useCardBefore", {
			player,
			card,
			cards,
			target,
			targets,
			active: event.active,
			usingcost: event.usingcost
		}]);
		"step 4"
		if (event.hs_fanzhied) {
			player.discardPile.directgain(cards);
			_status.hsAttendSeq.cl(cards);
			game.delay();
		} else {
			player.actionHistory[player.actionHistory.length - 1].useCard.push(event);
			if (!game.getGlobalHistory().useCard) {
				game.getGlobalHistory().useCard = [];
			}
			game.getGlobalHistory().useCard.push(event);
			if (player.stat[player.stat.length - 1].card[card.name] == undefined) {
				player.stat[player.stat.length - 1].card[card.name] = 1;
			} else {
				player.stat[player.stat.length - 1].card[card.name]++;
			}
			//更换牌
			get.HSF("event", ["useCardBegin", {
				player,
				card,
				cards,
				target,
				targets,
				active: event.active,
				usingcost: event.usingcost
			}]);
		}
		"step 5"
		player.sctp("field", t => {
			t.buff.forEach(o => {
				if (o.used === false && o.countphase == player && o.name == "hs_cost" && o.type2 == "cost" && o.fil(card, player)) {
					o.used = true;
				}
			});
		});
		if (event.hs_fanzhied) {
			event.goto(12);
		} else {
			//使用时事件
			get.HSF("event", ["useCard", {
				player,
				card,
				cards,
				target,
				targets,
				active: event.active,
				usingcost: event.usingcost
			}]);
		}
		"step 6"
		//过载
		if (event.info.hs_gz) {
			var num = event.info.hs_gz;
			player.addMark("hs_mana_owed", num, false);
			game.log(player, "过载了", num, "个法力水晶");
			player.HSF("updatemana");
			get.HSF("event", ["overload", {
				player,
				card,
				cards,
				num,
			}]);
		}
		"step 7"
		//死亡阶段
		get.HSF("checkdeath");
		"step 8"
		//计算次数
		"step 9"
		//重选目标
		if (targets) {
			get.HSF("event", ["useCardTo", {
				player,
				card,
				cards,
				target,
				targets,
				active: event.active,
				usingcost: event.usingcost
			}]);
		}
		"step 10"
		//结算效果
		if (get.subtype(card) == "HS_secret") {
			if (player.use_secret) {
				player.use_secret(cards[0]);
			}
		} else {
			event.toRun = player.hs_spellEffect(cards[0], target, event.active);
		}
		"step 11"
		//送墓
		game.delay(0.5);
		get.HSF("updateauras", [true]);
		if (get.subtype(card) != "HS_secret") {
			if (cards[0].hs_temp || get.info(card).hs_token) {
				player.heroskill.pos.directgain(cards);
			} else {
				player.discardPile.directgain(cards);
			}
			_status.hsAttendSeq.cl(cards);
		}
		get.HSF("checkfellow");
		"step 12"
		//死亡阶段
		get.HSF("checkdeath");
		"step 13"
		//使用后事件
		ui.clear();
		player.hs_state.useCard++;
		if (!event.hs_fanzhied) {
			get.HSF("event", ["useCardAfter", {
				player,
				card,
				cards,
				target,
				targets,
				active: event.active,
				usingcost: event.usingcost
			}]);
		}
		"step 14"
		//死亡阶段
		get.HSF("checkdeath");
		"step 15"
		if (!event.hs_fanzhied && event.hs_guosheng) {
			player.hs_gain("法力过剩");
		}
		"step 16"
		get.HSF("think");
	},
	hs_use_weapon() { //使用武器
		"step 0"
		get.HSF("clickmana", [false]);
		event.usingcost = cards[0].cost();
		player.HSF("usemana", [event.usingcost]);
		game.log(player, "使用了", card);
		var info = get.info(card);
		var info2 = info.weaponeffect;
		var name = card.name;
		if (info2?.battleRoal) {
			event.hasbattleroal = true;
			event.canzh = true;
			if (info2.battleRoal.filter) {
				var nf = get.HSF("strfil", [info2.battleRoal.filter]);
				info2.battleRoal.filter = nf;
				if (!nf(player, cards[0])) event.canzh = false;
			}
			if (info2.battleRoal.filterTarget) {
				event.needtarget = true;
				event.canzhtg = game.filterPlayer(function(target) {
					return player.HSF("canbetarget", [null, target, "battleroal"]) && (info2.battleRoal.filterTarget === true || info2.battleRoal.filterTarget(card, player, target));
				});
				if (event.canzhtg.length == 0) event.canzh = false;
			}
		}
		event.cinfo = info;
		event.info2 = info2;
		if (info2.active?.(player)) event.active = true;
		player.lose(cards, ui.special);
		event.node = player.$throw(cards, 1000);
		game.delay(0.5);
		"step 1"
		get.HSF("checkhand");
		if (event.node) event.node.delete();
		"step 2"
		//武器进场
		get.HSF("morefocus", cards);
		var c = cards[0];
		event.div = player.addweapon(c);
		player.predata_weapon = event.div;
		_status.hsAttendSeq.ad(c);
		"step 3"
		game.delay();
		"step 4"
		player.actionHistory[player.actionHistory.length - 1].useCard.push(event);
		if (!game.getGlobalHistory().useCard) game.getGlobalHistory().useCard = [];
		game.getGlobalHistory().useCard.push(event);
		if (player.stat[player.stat.length - 1].card[card.name] == undefined) {
			player.stat[player.stat.length - 1].card[card.name] = 1;
		} else {
			player.stat[player.stat.length - 1].card[card.name]++;
		}
		event.div.hs_yin();
		"step 5"
		//战吼选目标
		if (event.div.triggers.battleRoal) {
			if (event.needtarget && event.canzh) {
				var info = event.info2;
				var tgs = event.canzhtg;
				if (tgs.includes(game.me)) get.HSF("clickmana", [false]);
				var next = player.chooseTarget((info.prompt || get.HSF("prompt", [card])), function(card, player, target) {
					return tgs.includes(target);
				}, true);
				next.set("pl", player);
				var ai = () => 1;
				if (info.battleRoal.aifamily) {
					switch (info.battleRoal.aifamily) {
						case "damage":
							ai = function(target) {
								var player = _status.event.pl;
								return get.dmgEffect(target, player, player) + 0.1;
							};
							break;
						case "recover":
							ai = function(target) {
								var player = _status.event.pl;
								return get.rcvEffect(target, player, player);
							};
							break;
						case "atk":
							ai = function(target) {
								var player = _status.event.pl;
								if (target.summoned && !target.hasgjz("chongfeng")) return 0;
								if (target.getLeader() != player) return 0;
								return target.ATK == 0 ? 3 : target.ATK;
							};
						case "hp":
							ai = function(target) {
								var player = _status.event.pl;
								if (target.getLeader() != player) return 0;
								return target.hp;
							};
						default:
					}
				}
				next.set("ai", ai);
			}
		} else event.goto(7);
		"step 6"
		if (event.hasbattleroal) {
			if (event.canzh) {
				if (event.needtarget) {
					if (result.bool) {
						event.willzh = true;
						event.target = result.targets[0];
					} else event.willzh = false;
				} else event.willzh = true;
			} else event.willzh = false;
		}
		"step 7"
		//使用时事件
		get.HSF("event", ["useCard", {
			player,
			card,
			cards,
			target,
			targets,
		}]);
		"step 8"
		//过载
		if (event.cinfo.hs_gz) {
			var num = event.cinfo.hs_gz;
			player.addMark("hs_mana_owed", num, false);
			game.log(player, "过载了", num, "个法力水晶");
			player.HSF("updatemana");
			get.HSF("event", ["overload", {
				player,
				card,
				cards,
				num,
			}]);
		}
		"step 9"
		//死亡阶段
		get.HSF("checkdeath");
		"step 10"
		//战吼次数
		if (event.div.triggers.battleRoal) {
			event.zh_num = player.hasAuras("doublebattleroal") ? 2 : 1;
			if (event.div.triggers.battleRoal.bonus) event.zh_num += event.div.triggers.battleRoal.bonus(player, event.div);
			event.zhed = 0;
		} else event.goto(14);
		"step 11"
		//重选目标
		if (targets) get.HSF("event", ["useCardTo", {
			player,
			card,
			cards,
			target,
			targets,
		}]);
		"step 12"
		//战吼
		event.div.addTempClass("zhanhou");
		if (event.willzh && (!target || target.HSF("alive", [true]))) {
			var cancel = false;
			var recheck = event.info2.battleRoal.recheck;
			if (recheck) {
				if (typeof recheck == "string") {
					var arr = recheck.split(",");
					if (arr.length == 1) {
						var f = get.HSA("funcs")[arr[0]];
						if (f) recheck = f;
						else get.hs_alt("战吼recheck:", recheck);
					} else {
						var fs = arr.map(i => get.HSA("funcs")[i]);
						var ff = function(e, p, f) {
							return ff.fs.every(i => i(e, p, f));
						};
						ff.fs = fs;
						recheck = ff;
					}

				}
				if (!recheck(null, player, event.link, event.info.battleRoal)) cancel = true;
			}
			if (!cancel) event.toRun = event.div.hs_battleRoal(event.target, event.div.triggers.battleRoal, event.active);
		}
		"step 13"
		event.zhed++;
		if (event.zhed < event.zh_num) {
			get.HSF("updateauras", [true]);
			game.delay();
			event.goto(12);
		}
		"step 14"
		//摧毁旧武器
		if (player.data_weapon) player.data_weapon.HSF("cuihui");
		delete player.predata_weapon;
		player.data_weapon = event.div;
		game.log(player, "装备了", card);
		get.HSF("event", ["equipAfter", {
			player,
			div: event.div,
			card: cards[0],
		}]);
		"step 15"
		//死亡阶段
		get.HSF("checkdeath");
		"step 16"
		//使用后事件
		player.hs_state.useCard++;
		get.HSF("event", ["useCardAfter", {
			player,
			card,
			cards,
			target,
			targets,
		}]);
		"step 17"
		//死亡阶段
		get.HSF("checkdeath");
		"step 18"
		get.HSF("think");
	},
	hs_use_hero() { //使用英雄
		"step 0"
		var info = get.info(card);
		event.info = info;
		if (info.active?.(player)) {
			event.active = true;
		}



		event.usingcost = cards[0].cost();
		player.HSF("usemana", [event.usingcost]);
		player.lose(cards, ui.special);

		event.node = player.$throw(cards, 1000);
		game.delay(0.5);
		"step 1"
		get.HSF("checkhand");
		if (event.node) {
			event.node.delete();
		}
		"step 2"
		//英雄进场
		get.HSF("morefocus", cards);

		get.HSF("updateauras", [true]);
		_status.hsAttendSeq.ad(cards[0]);
		"step 3"
		//反制阶段
		get.HSF("event", ["useCardBefore", {
			player,
			card,
			cards,
			target,
			targets,
			active: event.active,
			usingcost: event.usingcost
		}]);
		"step 4"
		if (event.hs_fanzhied) {
			player.discardPile.directgain(cards);
			_status.hsAttendSeq.cl(cards);
			game.delay();
		} else {
			player.actionHistory[player.actionHistory.length - 1].useCard.push(event);
			if (!game.getGlobalHistory().useCard) {
				game.getGlobalHistory().useCard = [];
			}
			game.getGlobalHistory().useCard.push(event);
			if (player.stat[player.stat.length - 1].card[card.name] == undefined) {
				player.stat[player.stat.length - 1].card[card.name] = 1;
			} else {
				player.stat[player.stat.length - 1].card[card.name]++;
			}
			//更换牌
			get.HSF("event", ["useCardBegin", {
				player,
				card,
				cards,
				target,
				targets,
				active: event.active,
				usingcost: event.usingcost
			}]);
		}
		"step 5"
		player.sctp("field", t => {
			t.buff.forEach(o => {
				if (o.used === false && o.countphase == player && o.name == "hs_cost" && o.type2 == "cost" && o.fil(card, player)) {
					o.used = true;
				}
			});
		});
		if (event.hs_fanzhied) {
			event.goto(12);
		} else {
			//使用时事件
			get.HSF("event", ["useCard", {
				player,
				card,
				cards,
				target,
				targets,
				active: event.active,
				usingcost: event.usingcost
			}]);
		}
		"step 6"
		//过载
		if (event.info.hs_gz) {
			var num = event.info.hs_gz;
			player.addMark("hs_mana_owed", num, false);
			game.log(player, "过载了", num, "个法力水晶");
			player.HSF("updatemana");
			get.HSF("event", ["overload", {
				player,
				card,
				cards,
				num,
			}]);
		}
		"step 7"
		//死亡阶段
		get.HSF("checkdeath");
		"step 8"
		//计算次数
		"step 9"
		//重选目标
		if (targets) {
			get.HSF("event", ["useCardTo", {
				player,
				card,
				cards,
				target,
				targets,
				active: event.active,
				usingcost: event.usingcost
			}]);
		}
		"step 10"
		//结算效果
		event.toRun = player.hs_spellEffect(cards[0], target, event.active);
		"step 11"
		//送墓
		game.delay(0.5);
		get.HSF("updateauras", [true]);

		if (cards[0].hs_temp || get.info(card).hs_token) {
			player.heroskill.pos.directgain(cards);
		} else {
			player.discardPile.directgain(cards);
		}
		_status.hsAttendSeq.cl(cards);

		get.HSF("checkfellow");
		"step 12"
		//死亡阶段
		get.HSF("checkdeath");
		"step 13"
		//使用后事件
		ui.clear();
		player.hs_state.useCard++;
		if (!event.hs_fanzhied) {
			get.HSF("event", ["useCardAfter", {
				player,
				card,
				cards,
				target,
				targets,
				active: event.active,
				usingcost: event.usingcost
			}]);
		}
		"step 14"
		//死亡阶段
		get.HSF("checkdeath");
		"step 15"
		get.HSF("think");
	},
	//@TODO
	hs_use_location() { //使用地标
		"step 0"
		get.HSF("clickmana", [false]);
		event.usingcost = cards[0].cost();
		player.HSF("usemana", [event.usingcost]);
		game.log(player, "使用了", card);
		var info = get.info(card);
		var info2 = info.weaponeffect;
		var name = card.name;
		if (info2?.battleRoal) {
			event.hasbattleroal = true;
			event.canzh = true;
			if (info2.battleRoal.filter) {
				var nf = get.HSF("strfil", [info2.battleRoal.filter]);
				info2.battleRoal.filter = nf;
				if (!nf(player, cards[0])) event.canzh = false;
			}
			if (info2.battleRoal.filterTarget) {
				event.needtarget = true;
				event.canzhtg = game.filterPlayer(function(target) {
					return player.HSF("canbetarget", [null, target, "battleroal"]) && (info2.battleRoal.filterTarget === true || info2.battleRoal.filterTarget(card, player, target));
				});
				if (event.canzhtg.length == 0) event.canzh = false;
			}
		}
		event.cinfo = info;
		event.info2 = info2;
		if (info2.active?.(player)) event.active = true;
		player.lose(cards, ui.special);
		event.node = player.$throw(cards, 1000);
		game.delay(0.5);
		"step 1"
		get.HSF("checkhand");
		if (event.node) event.node.delete();
		"step 2"
		//武器进场
		get.HSF("morefocus", cards);
		var c = cards[0];
		event.div = player.addweapon(c);
		player.predata_weapon = event.div;
		_status.hsAttendSeq.ad(c);
		"step 3"
		game.delay();
		"step 4"
		player.actionHistory[player.actionHistory.length - 1].useCard.push(event);
		if (!game.getGlobalHistory().useCard) game.getGlobalHistory().useCard = [];
		game.getGlobalHistory().useCard.push(event);
		if (player.stat[player.stat.length - 1].card[card.name] == undefined) {
			player.stat[player.stat.length - 1].card[card.name] = 1;
		} else {
			player.stat[player.stat.length - 1].card[card.name]++;
		}
		event.div.hs_yin();
		"step 5"
		//战吼选目标
		if (event.div.triggers.battleRoal) {
			if (event.needtarget && event.canzh) {
				var info = event.info2;
				var tgs = event.canzhtg;
				if (tgs.includes(game.me)) get.HSF("clickmana", [false]);
				var next = player.chooseTarget((info.prompt || get.HSF("prompt", [card])), function(card, player, target) {
					return tgs.includes(target);
				}, true);
				next.set("pl", player);
				var ai = () => 1;
				if (info.battleRoal.aifamily) {
					switch (info.battleRoal.aifamily) {
						case "damage":
							ai = function(target) {
								var player = _status.event.pl;
								return get.dmgEffect(target, player, player) + 0.1;
							};
							break;
						case "recover":
							ai = function(target) {
								var player = _status.event.pl;
								return get.rcvEffect(target, player, player);
							};
							break;
						case "atk":
							ai = function(target) {
								var player = _status.event.pl;
								if (target.summoned && !target.hasgjz("chongfeng")) return 0;
								if (target.getLeader() != player) return 0;
								return target.ATK == 0 ? 3 : target.ATK;
							};
						case "hp":
							ai = function(target) {
								var player = _status.event.pl;
								if (target.getLeader() != player) return 0;
								return target.hp;
							};
						default:
					}
				}
				next.set("ai", ai);
			}
		} else event.goto(7);
		"step 6"
		if (event.hasbattleroal) {
			if (event.canzh) {
				if (event.needtarget) {
					if (result.bool) {
						event.willzh = true;
						event.target = result.targets[0];
					} else event.willzh = false;
				} else event.willzh = true;
			} else event.willzh = false;
		}
		"step 7"
		//使用时事件
		get.HSF("event", ["useCard", {
			player,
			card,
			cards,
			target,
			targets,
		}]);
		"step 8"
		//过载
		if (event.cinfo.hs_gz) {
			var num = event.cinfo.hs_gz;
			player.addMark("hs_mana_owed", num, false);
			game.log(player, "过载了", num, "个法力水晶");
			player.HSF("updatemana");
			get.HSF("event", ["overload", {
				player,
				card,
				cards,
				num,
			}]);
		}
		"step 9"
		//死亡阶段
		get.HSF("checkdeath");
		"step 10"
		//战吼次数
		if (event.div.triggers.battleRoal) {
			event.zh_num = player.hasAuras("doublebattleroal") ? 2 : 1;
			if (event.div.triggers.battleRoal.bonus) event.zh_num += event.div.triggers.battleRoal.bonus(player, event.div);
			event.zhed = 0;
		} else event.goto(14);
		"step 11"
		//重选目标
		if (targets) get.HSF("event", ["useCardTo", {
			player,
			card,
			cards,
			target,
			targets,
		}]);
		"step 12"
		//战吼
		event.div.addTempClass("zhanhou");
		if (event.willzh && (!target || target.HSF("alive", [true]))) {
			var cancel = false;
			var recheck = event.info2.battleRoal.recheck;
			if (recheck) {
				if (typeof recheck == "string") {
					var arr = recheck.split(",");
					if (arr.length == 1) {
						var f = get.HSA("funcs")[arr[0]];
						if (f) recheck = f;
						else get.hs_alt("战吼recheck:", recheck);
					} else {
						var fs = arr.map(i => get.HSA("funcs")[i]);
						var ff = function(e, p, f) {
							return ff.fs.every(i => i(e, p, f));
						};
						ff.fs = fs;
						recheck = ff;
					}

				}
				if (!recheck(null, player, event.link, event.info.battleRoal)) cancel = true;
			}
			if (!cancel) event.toRun = event.div.hs_battleRoal(event.target, event.div.triggers.battleRoal, event.active);
		}
		"step 13"
		event.zhed++;
		if (event.zhed < event.zh_num) {
			get.HSF("updateauras", [true]);
			game.delay();
			event.goto(12);
		}
		"step 14"
		//摧毁旧武器
		if (player.data_weapon) player.data_weapon.HSF("cuihui");
		delete player.predata_weapon;
		player.data_weapon = event.div;
		game.log(player, "装备了", card);
		get.HSF("event", ["equipAfter", {
			player,
			div: event.div,
			card: cards[0],
		}]);
		"step 15"
		//死亡阶段
		get.HSF("checkdeath");
		"step 16"
		//使用后事件
		player.hs_state.useCard++;
		get.HSF("event", ["useCardAfter", {
			player,
			card,
			cards,
			target,
			targets,
		}]);
		"step 17"
		//死亡阶段
		get.HSF("checkdeath");
		"step 18"
		get.HSF("think");
	},

	hs_use_heroskill() { //使用英雄技能
		"step 0"
		if (!event.filterTarget) event.goto(3);
		if (event.randomHT) {
			var t = event.randomHT(player);
			event.target = t;
			if (!event.target) event.finish();
		}
		"step 1"
		//英雄技能选目标
		var fil = event.filterTarget;
		player.chooseTarget(get.prompt2(event.skill), function(c, p, t) {
			return p.HSF('canbetarget', [null, t, 'heroskill']) && fil(null, p, t);
		}).set('ai', event.ai);
		"step 2"
		if (result.bool && result.targets[0]) event.target = result.targets[0];
		else event.finish();
		"step 3"
		player.hs_state.hrsk++;
		get.HSF("morefocus", [player.heroskill]);
		player.HSF("usemana", [event.cost]);
		player.sctp("field", t => {
			t.buff.forEach(o => {
				if (o.used === false && o.countphase == player && o.name == "hrskcost" && o.type2 == "cost" && o.fil(null, player)) o.used = true;
			});
		});
		"step 4"
		//重选目标
		get.HSF("event", ["useHeroskillTo", {
			player,
			target,
		}]);
		"step 5"
		//英雄技能结算
		player.heroskill.using = true;
		player.heroskill.used++;
		"step 6"
		player.heroskill.available = false;
		player.logSkill(event.skill, target, false);
		player.heroskill.pos.HSline(target, "green");
		player.hs_heroskillEffect(target, get.info(event.skill).effect);
		"step 7"
		delete player.heroskill.using;
		player.heroskill.classList.add("used");
		"step 8"
		game.delay();
		"step 9"
		/*代码修改：插入死亡阶段*/
		//死亡阶段
		get.HSF("checkdeath");
		"step 10"
		//激励
		get.HSF("jilievent", [{
			player,
			target,
		}]);
		"step 11"
		//死亡阶段
		get.HSF("checkdeath");
		"step 12"
		get.HSF("think");
	},
	hs_dmgrcvbt() { //战斗伤害
		"step 0"
		event.i = 0;
		event.evnum = event.evts.length;
		game.delay(2);
		"step 1"
		event.cur = event.evts[event.i];
		event.source = event.cur.source;
		event.player = event.cur.player;
		event.num = event.cur.num;
		if (event.num <= 0) event.goto(11);
		"step 2"
		_status.hs_noupdate = true;
		"step 3"
		//伤害步骤开始
		if (player.hasgjz("mianyi")) {
			game.log(player, "的免疫抵消了", event.num, "点伤害");
			event.num = 0;
		}
		if (event.num <= 0) event.goto(11);
		else {
			//预伤害扳机1(改变目标)
			get.HSF("event", ["hsdmgBefore", {
				player,
				source: event.source,
				num: event.num,
			}]);
		}
		"step 4"
		if (player.hasgjz("mianyi")) {
			game.log(player, "的免疫抵消了", event.num, "点伤害");
			event.num = 0;
			event.goto(11);
		} else {
			if (event.source?.hasgjz("qianxing")) event.source.removegjz("qianxing");
			//预伤害扳机2(改变伤害量)
			get.HSF("event", ["hsdmgBegin1", {
				player,
				source: event.source,
				num: event.num,
			}]);
		}
		"step 5"
		if (event.num <= 0) event.goto(11);
		else {
			//预伤害扳机3(防止伤害)
			get.HSF("event", ["hsdmgBegin2", {
				player,
				source: event.source,
				num: event.num,
			}]);
		}
		"step 6"
		if (event.num <= 0) event.goto(11);
		"step 7"
		if (player.hasgjz("shengdun")) {
			player.removegjz("shengdun");
			game.log(player, "的圣盾抵消了", event.num, "点伤害");
			event.num = 0;
			event.goto(11);
		}
		event.cur.num = event.num;
		"step 8"
		//伤害结算
		event.change = (function(e, p) {
			var n = -1 * e.num;
			var max = p.maxHp;
			var hp = p.hp;
			var hj = p.hujia;
			var zz = Math.min(0, hj + n);
			if (p.aurasEffed("hs_mlnh")) {
				if (zz + hj + hp < 1) {
					var cg = 1 - hj - hp - zz;
					e.num -= cg;
					zz = 1 - hj - hp;
				}
			}
			return zz;
		})(event, player);
		var obj = {
			num: event.num,
			type: "damage",
			player,
			source: event.source,
		};
		obj.player[obj.type](obj.source, obj.num).hs_dmgrcv = true;
		"step 9"
		//伤害抖动
		_status.hs_noupdate = false;
		player.updatehsfl(event.change);
		"step 10"
		"step 11"
		event.i++;
		if (event.i < event.evnum) event.goto(1);
		"step 12"
		event.evts = event.evts.filter(i => i.num > 0);
		if (event.evts.length) {
			//结算伤害事件
			get.HSF("evts", ["hsdmg", event.evts]);
		}
		"step 13"
		//清除状态
		_status.hs_noupdate = false;
		get.HSF("checkfellow");
	},
	hs_dmgrcvaoe() { //aoe伤害&&回复
		"step 0"
		event.i = 0;
		event.evts = [];
		event.targets = event.targets.filter(fl => !fl.hs_losing);
		event.evnum = event.targets.length;
		event.orinum = event.num;
		//nosort:特殊顺序aoe
		if (!event.nosort) event.targets.sort(lib.sort.attendseq);
		_status.hs_noupdate = true;
		if (event.nodelay) game.delay(0.5);
		else game.delay(2);
		"step 1"
		event.target = event.targets[event.i];
		event.num = event.orinum;
		event.cur = {
			card: event.card,
			type: event.type,
			source: event.source,
			player: event.target,
			num: event.orinum,
			nature: event.nature,
		};
		if (event.expo?.[0] == event.target) {
			event.num = event.expo[1];
			event.cur.expo = true;
			delete event.expo;
		}
		event.player = event.cur.player;
		event.evts.add(event.cur);
		"step 2"
		//奥金尼
		if (event.type == "recover" && event.source?.getLeader().hasAuras("auchenai")) event.cur.type = "damage";
		"step 3"
		//伤害增减阶段(光环，法强)
		if (event.cur.type == "damage" && event.source) {
			if (card && get.type(card) == "HS_spell") {
				var res = event.source.countFq();
				if (get.info(card).doubleD) res *= 2;
				event.num += res;
			}
			const auras = event.source.sctp("field").reduce((x, y) => x.concat(y.buff.filter(i => i.ghwork("damage", event.source, [y.getLeader(), y, event.source, event]))), []);
			auras.sort(lib.sort.attendseq);
			auras.forEach(i => {
				let val = i.value;
				if (typeof val == "function") val = val(event.source, event.num, event);
				event.num += val;
			});
		}
		"step 4"
		//伤害翻倍阶段(维纶光环)
		if ((event.card && get.type(event.card) == "HS_spell" || event.hs_heroskill) && event.source?.hasAuras("velen")) {
			event.num *= event.source.HSF("countvelen");
		}
		"step 5"
		//伤害步骤开始
		if (event.cur.type == "recover") event.goto(10);
		else {
			if (event.cur.num > 0 && player.hasgjz("mianyi")) {
				game.log(player, "的免疫抵消了", event.cur.num, "点伤害");
				event.num = 0;
			}
			if (event.num <= 0) event.goto(12);
			else {
				//预伤害扳机1(改变目标)
				get.HSF("event", ["hsdmgBefore", {
					player,
					source: event.source,
					num: event.num,
				}]);
			}
		}
		"step 6"
		if (event.cur.num > 0 && player.hasgjz("mianyi")) {
			game.log(player, "的免疫抵消了", event.num, "点伤害");
			event.num = 0;
			event.goto(12);
		} else {
			if (event.source?.hasgjz("qianxing")) event.source.removegjz("qianxing");
			//预伤害扳机2(改变伤害量)
			get.HSF("event", ["hsdmgBegin1", {
				player,
				source: event.source,
				num: event.num,
			}]);
		}
		"step 7"
		if (event.num <= 0) event.goto(12);
		else {
			//预伤害扳机3(防止伤害)
			get.HSF("event", ["hsdmgBegin2", {
				player,
				source: event.source,
				num: event.num,
			}]);
		}
		"step 8"
		if (event.num <= 0) event.goto(12);
		"step 9"
		if (player.hasgjz("shengdun")) {
			player.removegjz("shengdun");
			game.log(player, "的圣盾抵消了", event.num, "点伤害");
			event.num = 0;
			event.goto(12);
		}
		"step 10"
		event.cur.num = event.num;
		//伤害结算
		event.cur.change = (function(e, p) {
			var bo = e.cur.type == "recover";
			var n = (bo ? 1 : -1) * e.cur.num;
			var max = p.maxHp;
			var hp = p.hp;
			var hj = p.hujia;
			if (bo) return Math.min(n, max - hp);
			else {
				var zz = Math.min(0, hj + n);
				if (p.aurasEffed("hs_mlnh")) {
					if (zz + hj + hp < 1) {
						var cg = 1 - hj - hp - zz;
						e.num -= cg;
						zz = 1 - hj - hp;
					}
				}
				return zz;
			}
		})(event, player);
		if (event.num != 0 && (event.cur.change != 0 || event.type == "damage")) event.cur.cantri = true;
		"step 11"
		"step 12"
		event.i++;
		if (event.i < event.evnum) event.goto(1);
		"step 13"
		event.evts = event.evts.filter(i => i.cantri);
		if (event.evts.length) get.HSF("dmgrcvdh", [event.evts]);
		"step 14"
		if (event.evts.length) {
			//结算伤害事件
			var n = "hs" + (event.evts[0].type == "damage" ? "dmg" : "rcv");
			get.HSF("evts", [n, event.evts]);
		}
		"step 15"
		//清除状态
		_status.hs_noupdate = false;
		get.HSF("checkfellow");
	},
	hs_dmgrcv() { //伤害&&回复
		"step 0"
		if (player.hs_losing) return;
		_status.hs_noupdate = true;
		//奥金尼
		if (event.type == "recover" && event.source?.getLeader().hasAuras("auchenai")) event.type = "damage";
		"step 1"
		//伤害增减阶段(光环，法强)
		if (event.type == "damage" && event.source) {
			if (card && get.type(card) == "HS_spell") {
				var res = event.source.countFq();
				if (get.info(card).doubleD) res *= 2;
				event.num += res;
			}
			const auras = event.source.sctp("field").reduce((x, y) => x.concat(y.buff.filter(i => i.ghwork("damage", event.source, [y.getLeader(), y, event.source, event]))), []);
			auras.sort(lib.sort.attendseq);
			auras.forEach(i => {
				let val = i.value;
				if (typeof val == "function") val = val(event.source, event.num, event);
				event.num += val;
			});
		}
		"step 2"
		//伤害翻倍阶段(维纶光环)
		if ((card && get.type(card) == "HS_spell" || event.hs_heroskill) && event.source?.hasAuras("velen")) {
			event.num *= event.source.HSF("countvelen");
		}
		"step 3"
		//伤害步骤开始
		if (event.type == "recover") event.goto(9);
		else {
			if (player.hasgjz("mianyi")) {
				game.log(player, "的免疫抵消了", event.num, "点伤害");
				event.num = 0;
			}
			if (event.num <= 0) event.goto(13);
			else {
				//预伤害扳机1(改变目标)
				get.HSF("event", ["hsdmgBefore", {
					player,
					source: event.source,
					num: event.num,
				}]);
			}
		}
		"step 4"
		if (player.hasgjz("mianyi")) {
			game.log(player, "的免疫抵消了", event.num, "点伤害");
			event.num = 0;
			event.goto(13);
		} else {
			if (event.source?.hasgjz("qianxing")) event.source.removegjz("qianxing");
			//预伤害扳机2(改变伤害量)
			get.HSF("event", ["hsdmgBegin1", {
				player,
				source: event.source,
				num: event.num,
			}]);
		}
		"step 5"
		if (event.num <= 0) event.goto(13);
		else {
			//预伤害扳机3(防止伤害)
			get.HSF("event", ["hsdmgBegin2", {
				player,
				source: event.source,
				num: event.num,
			}]);
		}
		"step 6"
		if (event.num <= 0) event.goto(13);
		"step 7"
		game.delay(0.7);
		"step 8"
		if (player.hasgjz("shengdun")) {
			player.removegjz("shengdun");
			game.log(player, "的圣盾抵消了", event.num, "点伤害");
			event.num = 0;
			event.goto(11);
		}
		"step 9"
		//伤害结算
		if (event.num == 0) event.goto(11);
		else {
			event.change = (function(e, p) {
				var bo = e.type == "recover";
				var n = (bo ? 1 : -1) * e.num;
				var max = p.maxHp;
				var hp = p.hp;
				var hj = p.hujia;
				if (bo) return Math.min(n, max - hp);
				else {
					var zz = Math.min(0, hj + n);
					if (p.aurasEffed("hs_mlnh")) {
						if (zz + hj + hp < 1) {
							var cg = 1 - hj - hp - zz;
							e.num -= cg;
							zz = 1 - hj - hp;
						}
					}
					return zz;
				}
			})(event, player);
			var obj = {
				num: event.num,
				type: event.type,
				player: event.player,
				source: event.nosource ? undefined : event.source,
				nature: event.nature,
			};
			obj.player[obj.type](obj.source, obj.num, obj.nature).hs_dmgrcv = true;
		}
		"step 10"
		//伤害抖动
		_status.hs_noupdate = false;
		if (event.num != 0 && (event.change != 0 || event.type == "damage")) event.cantri = true;
		player.updatehsfl(event.change);
		"step 11"
		if (event.炸服(evt => evt.player.hp < -40)) return;
		"step 12"
		//伤害事件
		if (event.cantri) get.HSF("event", ["hs" + (event.type == "damage" ? "dmg" : "rcv"), {
			card: event.card,
			player,
			source: event.source,
			num: event.num,
		}]);
		"step 13"
		//清除状态
		_status.hs_noupdate = false;
		get.HSF("checkfellow");
	},
	/*代码修改：新增*/
	hs_dmgrcvNotaoe() { //非aoe的群体伤害
		"step 0"
		event.tgs = event.targets.filter(f => event.tgfilter(player, f));
		if (!event.nosort) event.tgs.sort(lib.sort.attendseq);
		event.i = 0;
		event.xhcs = event.tgs.length;
		if (event.xhcs == 0) {
			game.delay();
			return;
		}
		"step 1"
		event.cur = event.tgs[event.i];
		if (event.tgfilter(player, event.cur)) {
			var sz = event.num;
			if (typeof sz == "function") sz = sz(player, event.cur);
			if (event.line) event.source.HSline(event.cur, "green");
			event.cur.hs_dmgrcv(sz, event.source, event.type, event.nature, event.card, event.cards);
		}
		"step 2"
		event.i++;
		if (event.i < event.xhcs) event.goto(1);
	},
};