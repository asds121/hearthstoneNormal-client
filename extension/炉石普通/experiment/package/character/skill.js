import { lib, game, ui, get, ai, _status } from "../../../../../noname.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	// 开局之后重构万物的技能，包括设置样式，重新选人，组卡组，XJBG(瞎xx改)，然后僵硬联动整理手牌扩展
	"hs_start": {
		trigger: {
			global: ["gameDrawBefore", "phaseEnd"],
		},
		silent: true,
		unique: true,
		charlotte: true,
		filter(event, player) {
			if (game.players.length > 2) {
				console.error(`你觉得炉石传说是${get.cnNumber(game.players.length)}个人玩的吗？`);
			}
			return game.players.length == 2 && !_status.hs_entergame;
		},
		// @TODO 改成 async content
		content() {
			"step 0"
			window.hearthstone.shijian.baseinit();
			"step 1"
			if (!lib.hearthstone) {
				game.me.say("加载失败");
				event.finish();
			}
			"step 2"
			lib.hearthstone.shijian.preinit(trigger);
			"step 3"
			lib.hearthstone.shijian.init();
			"step 4"
			lib.hearthstone.shijian.postinit();
			"step 5"
			lib.hearthstone.shijian.entermode();
			"step 6"
			lib.hearthstone.shijian.reach();
			"step 7"
			lib.hearthstone.shijian.XJBG();
			"step 8"
			event.insert(lib.element.content.greeting, {});
		},
	},
	// 自己进行操作的技能
	"hs_summonlimit": {
		trigger: {
			global: ["phaseBefore", "phaseZhunbeiBegin", "chooseToUseBegin"],
		},
		filter(event, player) {
			if (event.name == "chooseToUse") {
				if (player == game.me) {
					game.me.HSF("hs_testfl");
				}
				get.HSF("checkall");
				event.prompt = "";
				return false;
			}
			return event.player.isMin();
		},
		silent: true,
		unique: true,
		fixed: true,
		charlotte: true,
		async content(event, trigger, player) {
			trigger.cancel(null, null, "notrigger");
		},
		mod: {
			cardEnabled2(card, player) {
				const cost = player.HSF("mana");
				if (card.cost && cost < card.cost()) {
					return false;
				}
				const info = get.info(card);
				const cardType = get.type(card.name);
				switch (cardType) {
					case "HS_minor":
					case "HS_location":
						if (player.countFellow() == 7) {
							return false;
						}
						break;
					case "HS_spell":
						if (get.subtype(card) == "HS_secret" && !player.canaddsecret(card)) {
							return false;
						}
						if (info.summoneff && player.hs_full()) {
							return false;
						}
						if (info.buffeff && !player.hasFellow()) {
							return false;
						}
						if (info.randomRT && !info.randomRT(player)) {
							return false;
						}
						if (info.sfilter && !info.sfilter(card, player)) {
							return false;
						}
						break;
					case "HS_hero":
						if (info.randomRT && !info.randomRT(player)) {
							return false;
						}
						if (info.sfilter && !info.sfilter(card, player)) {
							return false;
						}
						break;
				}
			},
			maxHandcardFinal(player, num) {
				return 10;
			},
		},
		global: "hs_summonlimit_a",
		subSkill: {
			a: {
				mod: {
					targetEnabled(card, player, target) {
						if (!player.HSF("canbetarget", [card, target, "card"])) {
							return false;
						}
					},
				},
			},
		},
	},
	/**
	 * 代码修改：重写战斗阶段及ai
	 * "hs_battlephase": 战斗阶段
	 */
	"hs_battlephase": {
		charlotte: true,
		enable: "phaseUse",
		direct: true,
		unique: true,
		fixed: true,
		charlotte: true,
		filter(event, player) {
			if (_status.event.isMine()) {
				return false;
			}
			return player.getFellowN(t => t.HSF("canatk") && game.hasPlayer(tg => {
				if (!t.HSF("canbetarget", [null, tg, "attack"])) return false;
				return tg.side != player.side;
			})).length > 0;
		},
		selectTarget: 2,
		complexTarget: true,
		complexSelect: true,
		multitarget: true,
		line: false,
		filterTarget(card, player, target) {
			if (ui.selected.targets.length === 0) {
				return target.HSF("canatk");
			} else {
				const attacker = ui.selected.targets[0];
				if (!attacker.HSF("canbetarget", [null, target, "attack"])) {
					return false;
				}
				return target.side !== player.side;
			}
		},
		async content(event, trigger, player) {
			_status.hsbattling = true;
			event.attacker = event.targets[0];
			event.victim = event.targets[1];
			var t = event.attacker;
			t.classList.add("hs_atkprepare");
			if (t.isMin()) get.HSF("Aud", [t, "attack"]);
			else t.HSFT("攻击");
			event.predate = new Date().getTime();
			var jg = Math.round((new Date().getTime() - event.predate) / 100) / 10;
			var atk = event.attacker;
			var dl = 0;
			if (event.isMine()) {
				if (atk.isMin()) dl = 0.5;
				else dl = 1;
			} else {
				if (!atk.isMin()) dl = 1.5;
			}
			if (dl - jg > 0) await game.delay(dl - jg);
			await event.attacker.hs_attack(event.victim);
			if (!event.isMine()) get.HSF("think");
			_status.hsbattling = false;
		},
		ai: {
			order: 0.1,
			result: {
				// 给变量名加长一点，适当的换个行，假装已经优化了可读性（逃😜
				target(player, target) {
					const t = target;
					const numberOfSelectedTargets = ui.selected.targets.length;
					if (numberOfSelectedTargets === 0) {
						let baseScore = 4;
						if (t.triggers.deathRattle && t.hp < 3) {
							baseScore += 3;
						}
						if (t.triggers.hsdmg?.fl) {
							baseScore += 3;
						}
						if (t.hasgjz("shengdun")) {
							baseScore += 3;
						}
						if (t.hasgjz("qianxing")) {
							baseScore -= 2;
						}
						if (t.hasgjz("guanghuan")) {
							baseScore -= 3;
						}
						if (t.hasgjz("jvdu")) {
							baseScore += 3;
						}
						return baseScore + t.ATK;
					} else {
						const attacker = ui.selected.targets[0];
						let baseCalculation = 40;
						if (t.triggers.deathRattle) {
							baseCalculation -= 10;
						}
						if (t.triggers.hsdmg?.fl) {
							baseCalculation -= 6;
						}
						if (t.hasgjz("guanghuan")) {
							baseCalculation += 3;
						}
						if (attacker.hasgjz("shengdun") || t.hasgjz("shengdun")) {
							if (attacker.hasgjz("shengdun")) {
								baseCalculation += attacker.ATK + t.ATK;
							}
							if (t.hasgjz("shengdun")) {
								baseCalculation -= attacker.ATK;
							}
						} else if (attacker.hasgjz("jvdu") || t.hasgjz("jvdu")) {
							if (attacker.hasgjz("jvdu")) {
								baseCalculation += t.ATK + t.hp;
							}
							if (t.hasgjz("jvdu")) {
								if (attacker.isMin()) {
									baseCalculation -= attacker.ATK + attacker.hp;
								} else {
									baseCalculation += attacker.ATK + attacker.hp;
								}
							}
						} else {
							const attackerCombatValue = attacker.ATK + attacker.hp;
							const targetCombatValue = t.ATK + t.hp;
							if (attacker.ATK >= t.hp) {
								baseCalculation += targetCombatValue;
							}
							if (attacker.hp <= t.ATK) {
								baseCalculation -= attackerCombatValue;
							} else {
								baseCalculation += Math.min(t.hp, attacker.ATK) - Math.min(attacker.hp, t.ATK);
							}
						}
						if (baseCalculation > 0) {
							if (!t.isMin()) {
								if (attacker.ATK >= t.hp + t.hujia) {
									return -(baseCalculation + 100);
								}
							}
							if (!attacker.isMin()) {
								if (target.ATK >= attacker.hp + attacker.hujia) {
									return 100;
								}
								if (attacker.ATK < target.hp && target.ATK > 2) {
									return 10;
								}
							}
							return -baseCalculation;
						}
						return 1 / (baseCalculation - 1);
					}
				},
			},
		},
	},
	// 伤害计算步骤
	"_hs_damage": {
		silent: true,
		unique: true,
		fixed: true,
		charlotte: true,
		priority: null,
		firstDo: true,
		mode: "hs_hearthstone",
		trigger: {
			player: ["changeHp"],
		},
		filter(event, player, name) {
			return _status.gameStarted;
		},
		async content(event, trigger, player) {
			if (trigger.parent && !trigger.parent.hs_dmgrcv) {
				player.updatehsfl(trigger.num);
			}
		},
	},
	// 回合开始和回合结束时清除状态
	"_hs_ADchange": {
		direct: true,
		unique: true,
		fixed: true,
		charlotte: true,
		priority: 1,
		mode: "hs_hearthstone",
		trigger: {
			player: ["phaseBegin", "phaseZhunbeiBegin", "phaseJieshuBegin", "phaseEnd"],
		},
		filter(event, player, name) {
			return _status.gameStarted && [game.me, game.enemy].includes(event.player);
		},
		async content(event, trigger, player) {
			if (trigger.name !== "phase") {
				_status.hdcsST = null;
				const isPhaseEnd = trigger.name === "phaseJieshu";
				if (isPhaseEnd) {
					get.HSF("clickmana", [false]);
				}
				get.HSF("xvlie", [`${isPhaseEnd ? "ending" : "beginning"}xl`, {
					player
				}, true]);
			} else if (event.triggername === "phaseBegin") {
				_status.hs_state = {
					jobdone: false,
					deadfellow: 0,
				};
				player.hs_state.atks = 0;
				player.hs_state.useCard = 0;
				get.HSF("clickmana", [false]);
				get.HSF("checkcanatk");
				if (player === game.me) {
					ui.arena.hs_myturn.addTempClass("active", 1400);
					get.HSF("Aud2", ["轮到你"]);
				}
				player.mana.locked.hide();
				player.storage.hs_mana_locked = player.storage.hs_mana_owed;
				player.storage.hs_mana_owed = 0;
				player.storage.hs_mana_used = player.storage.hs_mana_locked;
				if (player.storage.hs_mana_locked > 0) {
					player.mana.owed.show();
					player.mana.owed.classList.remove("owe");
					player.mana.owed.classList.add("lock");

					const tempManaLocked = player.mana.locked;
					player.mana.locked = player.mana.owed;
					player.mana.owed = tempManaLocked;
					setTimeout(() => {
						tempManaLocked.classList.remove("lock");
						tempManaLocked.classList.add("owe");
					}, 500);
				}

				const manaToGain = 1;
				player.HSF("gainmana", [manaToGain, true]);
				player.HSF("recovermana", ["all"]);
				player.HSF("updatemana");

				const heroSkill = player.heroskill;
				heroSkill.used = 0;
				get.HSF("checkheroskill");

				if (trigger.player === game.me) {
					ui.hs_endbtn.innerHTML = "回合结束";
					ui.hs_endbtn.classList.remove("hs_oppo");
				} else {
					ui.hs_endbtn.innerHTML = "对手回合";
					ui.hs_endbtn.classList.add("hs_oppo");
				}
				game.countPlayer(p => {
					p.hs_attacked = 0;
				});
				player.sctp("field", minion => {
					const buffsToRemove = [];
					minion.buff.forEach(buff => {
						if (buff.temp > 0 && buff.temp < 1) {
							buffsToRemove.add(buff);
						}
					});
					minion.removehsbuff(buffsToRemove);
				});
				const buffsToFlush = [];
				player.sctp("field", minion => {
					minion.buff.forEach(buff => {
						if (buff.countphase === player && buff.type2 === "cost" && buff.used === true) {
							buffsToFlush.add(buff);
						}
					});
				});

				if (buffsToFlush.length > 0) {
					buffsToFlush.sort(lib.sort.attendseq);
					_status.hsAttendSeq.cl(buffsToFlush);
					buffsToFlush.forEach(buff => {
						buff.used = false;
						_status.hsAttendSeq.ad(buff);
					});
				}
				_status.hs_starttime = new Date();
			} else {
				ui.hs_endbtn.classList.remove("active");
				player.storage.hs_mana_temp = 0;
				if (player.HSF("mana") < 0) {
					player.HSF("recovermana", [-player.HSF("mana"), false]);
				}
				player.HSF("updatemana");
				game.countPlayer(p => {
					if (p.hasgjz("dongjied")) {
						if (player === p.getLeader()) {
							(p.willjiedong || p.HSF("canatk", [null, true])) ? p.removegjz("dongjied"): p.willjiedong = true;
						} else {
							p.willjiedong = true;
						}
					}
					delete p.summoned;
					const buffsToRemove = [];
					for (const buff of p.buff) {
						if (typeof buff.sleep === "number") {
							buff.sleep--;
							if (buff.sleep === 0) {
								buff.type === "auras" ? buff.sleep = true : delete buff.sleep;
							}
						} else if (buff.temp) {
							if (!buff.countphase || buff.countphase === player) {
								buff.temp--;
							}
							if (buff.used === true) {
								buff.limit--;
							}
							if (buff.temp === 0 || buff.limit === 0) {
								buffsToRemove.add(buff);
							}
						}
					}
					p.removehsbuff(buffsToRemove);
					if (!p.isMin()) {
						const heroSkillBuffsToRemove = [];
						for (const buff of p.heroskill.buff) {
							if (buff.temp) {
								if (!buff.countphase || buff.countphase === player) {
									buff.temp--;
								}
								if (buff.temp === 0) {
									heroSkillBuffsToRemove.add(buff);
								}
							}
						}
						heroSkillBuffsToRemove.forEach(buff => {
							p.removehsbuff.call(p.heroskill, buff); // 移除英雄技能的buff
						});
					}
				});

				const myPlayerId = game.me.playerid;
				const enemyPlayerId = game.enemy.playerid;
				_status.hsAttendSeq.cl();
				_status.hs_dead = {};
				_status.hs_dead[myPlayerId] = [];
				_status.hs_dead[enemyPlayerId] = [];
				get.HSF("checkfellow");
			}
		},
	},
};

export default skills;