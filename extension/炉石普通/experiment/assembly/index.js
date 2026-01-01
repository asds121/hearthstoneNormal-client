import { lib, game, ui, get, ai, _status } from "../../../../noname.js";
import { utility } from "../utility.js";

import { heroskill } from "./heroskill.js";
import { funcsDivision } from "./main.js";
import { constantDivision } from "./constant.js";
import { getDivision } from "./get.js";
import { HSstring, HSarray, HSleader, HSfellow, HSweapon, HSsecret } from "./class.js";

lib.element.HSstring = HSstring;
lib.element.HSarray = HSarray;
lib.element.HSleader = HSleader;
lib.element.HSfellow = HSfellow;
lib.element.HSweapon = HSweapon;
lib.element.HSsecret = HSsecret;


//将所有新东西，定义在一个JSON对象中
export const hearthstone = {
	monster: { //召唤怪兽的模板
		enable: true,
		notarget: true,
		lose: false,
	},
	cardPack: {
		monsterRD: {},
		mode_RD: [],
		spel_RD: [],
		trap_RD: [],
		weap_RD: [],
		hero_RD: [],
		loca_RD: []
	},
	loadTrans: {
		"HS_minor": "随从",
		"HS_normal": "白板",
		"HS_effect": "效果",
		"HS_special": "特殊随从",
		"HS_spell": "法术",
		"HS_normalS": "普通法术",
		"HS_secret": "奥秘",
		"HS_auras": "光环法术",
		"HS_weapon": "武器",
		"HS_hero": "英雄",
		"HS_location": "地标"
	},
	constants: constantDivision,
	get: getDivision,
	funcs: funcsDivision,
	eval_heroskill(name, obj, p) { //生成英雄技能
		if (!obj) {
			get.hs_alt(`${name}没有详细内容！`);
			return;
		}
		lib.skill[name] = get.copy(lib.skill.hs_mb);
		delete lib.skill[name].eff;
		lib.translate[name] = obj[0];
		lib.translate[`${name}_info`] = obj[1];
		if (obj[1].indexOf("召唤") >= 0) {
			lib.skill[name].summoneff = true;
		}
		lib.skill[name].rnature = obj[2];
		if (get.HSA("diy").includes(obj[2])) {
			lib.skill[name].diy = true;
		}
		lib.skill[name].cost = obj[3];
		let effect = obj[4];
		if (typeof effect == "string") {
			effect = [effect];
		}
		lib.skill[name].effect = get.hsrfunc(effect);
		if (obj[5]) {
			let f = function(str, pp) {
				if (str == "all") {
					lib.skill[name].filterT = lib.filter.all;
				} else if (str.indexOf("function") == 0) {
					eval(`lib.skill[name].filterT=${str}`);
				} else {
					lib.skill[name].filterT = get.strfunc("card,player,target", `return player.sctp('${str}',target);`);
				}
			};
			let g = function(a) {
				const mm = a.split(":")[1];
				if (a.indexOf("F:") == 0) {
					f(mm, (p || game.me));
				} else if (a.indexOf("f:") == 0) {
					lib.skill[name].extrafilter = get.strfunc("player", mm);
				} else if (a.indexOf("R:") == 0) {
					if (mm.indexOf("function") == 0) {
						eval(`lib.skill[name].randomHT=${mm};`);
					} else {
						lib.skill[name].randomHT = get.strfunc("player", `return player.sctp('${mm}').randomGet();`);
					}
				}
			};
			if (typeof obj[5] == "string") {
				g(obj[5]);
			} else {
				g(obj[5][0]);
				const mk = obj[5][1];
				if (mk.indexOf("function") == 0) {
					eval(`lib.skill[name].hrskai=${mk}`); // Note: Changed `str` to `mk` as `str` is not defined here. Assuming it should be `mk`.
				} else {
					lib.skill[name].hrskai = get.strfunc("target", `var player=get.player();${mk}`);
				}
			}
		}
		if (obj[6]) {
			lib.skill[name].ai = obj[6];
		}
		lib.skill[name].filter = function(event, player) {
			if (event.isMine() && !player.presshrskbt) {
				//console.log("情况1");
				return false;
			}
			const skill = player.heroskill;
			if (!skill.available) {
				//console.log("使用过");
				return false;
			}
			if (player.HSF("mana") < skill.cost) {
				//console.log("法力不足");
				return false;
			}
			if (lib.skill[skill.skill].summoneff && player.hs_full()) {
				//console.log("没空召怪");
				return false;
			}
			if (skill.filterTarget && !game.hasPlayer(target => {
					return player.HSF("canbetarget", [null, target, "heroskill"]) && skill.filterTarget(null, player, target);
				})) {
				//console.log("无目标");
				return false;
			}
			if (skill.randomHT && !skill.randomHT(player)) {
				return false;
			}
			if (skill.extrafilter && !skill.extrafilter(player)) {
				return false;
			}
			return true;
		}
	},
	heroskill,
	shijian: {
		//重要事件内容
		baseinit() { //基础初始化
			//卡牌导入游戏
			hearthstone.cardPack.mode_RD = Object.keys(hearthstone.cardPack.monsterRD).map(i => hearthstone.funcs.createrd(i));
			for (const i in hearthstone.loadTrans) {
				lib.translate[i] = hearthstone.loadTrans[i];
			}
			for (const i in hearthstone.rdrd_card.spell) {
				hearthstone.cardPack.spel_RD.push(i);
			}
			for (const i in hearthstone.rdrd_card.trap) {
				hearthstone.cardPack.trap_RD.push(i);
			}
			for (const i in hearthstone.rdrd_card.weapon) {
				hearthstone.cardPack.weap_RD.push(i);
			}
			for (const i in hearthstone.rdrd_card.hero) {
				hearthstone.cardPack.hero_RD.push(i);
			}

			//其他js的内容转入lib，然后删掉
			lib.hearthstone = get.copy(window.hearthstone);
			delete window.hearthstone;
			//导入角色，技能和翻译
			//导入部分不可或缺的自定义函数
			get.HSF("createrd"); //给所有怪兽添加描述、卡图
			get.HSF("qwe"); //新增属性势力
			lib.hearthstone.css_editdeck = lib.init.css(`${utility.extensionDirectoryPath}experiment/style/`, 'editdeck');
			get.HSF("loadHS"); //载入指示线素材
			ui.arena.classList.add("hs_preinit");
		},
		preinit(trigger) { //设置检查
			//如果是开局，跳过，开局不抽牌
			if (trigger.name == "gameDraw") {
				trigger.cancel();
			}
			// 进入开局
			_status.hs_entergame = true;
			// @设置检查
			//玩家添加攻击力的div
			game.countPlayer(function(current) {
				current.node.atk = ui.create.div(".hs_atk", current);
				current.node.atk.hide();
				current.uninit();
			});
			//载入css样式
			ui.arena.classList.add("hscss");
			ui.arena.classList.add("hs1me");
			ui.arena.classList.add("hs1enemy");
			lib.hearthstone.css_common = lib.init.css(`${utility.extensionDirectoryPath}experiment/style/`, "common");
			lib.hearthstone.css_mode = lib.init.css(`${utility.extensionDirectoryPath}experiment/style/`, "HS");
			lib.hearthstone.css_mode.mode = "HS";
			if (get.HSF("cfg", ["HS_bigImg"])) {
				ui.arena.classList.add("hs_big_img");
				_status.big_img = true;
				lib.hearthstone.css_big_img = lib.init.css(`${utility.extensionDirectoryPath}experiment/style/`, "big_img");
			}
		},
		init() { //游戏初始化(给怪随从卡加ai，制作相应的随从，增加排序方式，设置ai默认卡组等)
			//<--感谢群友"三十功名尘与土"提供的自适应缩放代码
			var scalef = () => {
				var scale = Math.min(window.innerWidth / 1070, window.innerHeight / 596) + 0.001;
				game.documentZoom = scale;
				lib.config[`extension_${utility.extensionName}_HS_customzoom`] = scale / game.deviceZoom;
				ui.updatez();
			}
			//如果不是移动端，缩放时自动改变缩放倍数
			if (!lib.device) {
				window.addEventListener('resize', scalef);
			}
			//200ms后更改缩放倍数，然后清除定时器
			var inter = setInterval(function() {
				var scale = Math.min(window.innerWidth / 1070, window.innerHeight / 596) + 0.001;
				if (game.documentZoom != scale) {
					scalef();
					clearInterval(inter);
				}
			}, 200);
			//-->
			//更改背景音乐
			game.hs_Music();
			//记录下directgain函数，暂不做打算
			lib.hearthstone.drgf = lib.element.player.directgain;
			//冰属性伤害不触发弃牌
			if (lib.skill.icesha_skill) {
				lib.skill.icesha_skill.filter = () => false;
			}

			game.addGlobalSkill("hs_autoswap");
			//确定场地
			ui.arena.classList.add("hs_kaichang");
			ui.arena.classList.add("hs_kaichang2");
			//拼装英雄技能
			lib.hearthstone.base_heroskill = {};
			for (let i in lib.hearthstone.heroskill) {
				var obj = lib.hearthstone.heroskill[i];
				var name = "hs_hero_legend_" + i;
				lib.hearthstone.eval_heroskill(name, obj);
				lib.hearthstone.base_heroskill[name] = lib.skill[name];
			}
			//生成缺省的随从技能
			get.HSF("tl2");
			//根据随从卡牌制作随从
			for (let i of lib.hearthstone.cardPack.mode_RD) {
				var name = get.HSF("tr", [i]);
				var info = get.info({
					name: i
				});
				if (!info) {
					get.hs_alt(i + "导入monster失败");
					lib.card[i] = {};
				}
				for (let j in lib.hearthstone.monster) {
					lib.card[i][j] = lib.hearthstone.monster[j];
				}
				get.HSF("setAi", [i]);
				lib.character[name] = ["none", (info.rnature || "hs_neutral"), info.HP, [],
					["noDefaultPicture", "minskin", `ext:${utility.extensionName}/resource/asset/card/${i}.jpg`, "des:" + lib.translate[i + "_info"]]
				];
				lib.translate[name] = lib.translate[i];
			}
			const tempa = [
				...lib.hearthstone.cardPack.spel_RD,
				...lib.hearthstone.cardPack.trap_RD,
				...lib.hearthstone.cardPack.hero_RD
			];
			for (const cd of tempa) {
				get.HSF("setResult", [cd]);
			}

			lib.sort.attendseq = function(a, b) { // 按入场顺序排序
				const seq = _status.hsAttendSeq;
				const p1Early = a.early || 0;
				const p2Early = b.early || 0;
				if (p1Early > p2Early) {
					return -1;
				}
				if (p1Early < p2Early) {
					return 1;
				}

				const p1Later = a.later || 0;
				const p2Later = b.later || 0;
				if (p1Later > p2Later) {
					return 1;
				}
				if (p1Later < p2Later) {
					return -1;
				}
				if (seq.ind(a) > seq.ind(b)) {
					return 1;
				}
				return -1;
			};
			lib.sort.hs_duel = function(m, n) { // 卡片排序
				let a = m;
				let b = n;
				if (typeof a == "string") {
					a = {
						name: m
					};
				}
				if (typeof b == "string") {
					b = {
						name: n
					};
				}

				const info1 = get.info(a);
				const info2 = get.info(b);
				const c1 = info1.cost;
				const c2 = info2.cost;
				if (c1 > c2) {
					return 1;
				}
				if (c1 < c2) {
					return -1;
				}

				const type = ["HS_minor", "HS_spell", "HS_weapon", "HS_hero", "HS_location"];
				const subtype = ["HS_normal", "HS_effect", "HS_normalS", "HS_secret"];
				const typeIndex1 = type.indexOf(get.type(a));
				const typeIndex2 = type.indexOf(get.type(b));
				if (typeIndex1 > typeIndex2) {
					return 1;
				}
				if (typeIndex1 < typeIndex2) {
					return -1;
				}

				const subtypeIndex1 = subtype.indexOf(get.subtype(a));
				const subtypeIndex2 = subtype.indexOf(get.subtype(b));
				if (subtypeIndex1 > subtypeIndex2) {
					return 1;
				}
				if (subtypeIndex1 < subtypeIndex2) {
					return -1;
				}
			
				if (info1.hs_legend && !info2.hs_legend) {
					return 1;
				}
				if (!info1.hs_legend && info2.hs_legend) {
					return -1;
				}

				if (info1.rnature != info2.rnature) {
					if (!info1.rnature || info1.rnature == "hs_neutral") {
						return 1;
					}
					if (!info2.rnature || info2.rnature == "hs_neutral") {
						return -1;
					}
					if (info1.rnature > info2.rnature) {
						return 1;
					}
					if (info1.rnature < info2.rnature) {
						return -1;
					}
				}
				if (a.name > b.name) {
					return 1;
				}
				if (a.name < b.name) {
					return -1;
				}
				if (get.hstype(a) == "card") {
					return Number.parseInt(a.cardid) - Number.parseInt(b.cardid);
				}
				if (a > b) {
					return 1;
				}
				if (a < b) {
					return -1;
				}
			};
			if (!lib.storage.hs_deck) lib.storage.hs_deck = {};
			//以下是各决斗者的默认卡组
			var deck = lib.hearthstone.constants.dftDeck;
			for (let i in deck) {
				lib.storage.hs_deck[i + "_ai"] = deck[i];
			}
			//更改更新手牌函数，用于自动折叠手牌
			const ins = function(str) {
				str = str.replace(new RegExp("112", "g"), "(ui.arena.classList.contains('hs_view')?70:(ui.arena.classList.contains('hs_exchange')?(ui.arena.classList.contains('hs_first')?144:100):Math.max(44,120-10*game.me.countCards('h'))))");
				return str;
			};
			ui.updatehl = lib.element.HSstring.nf(ui.updatehl, ins);
		},
		postinit() { //剩余设置及ui
			lib.hearthstone.css_func = document.createElement("style");
			lib.hearthstone.css_func.innerHTML = get.HSF("css_func");
			document.head.appendChild(lib.hearthstone.css_func);

			if (!_status.connectMode && get.HSF("cfg", ["developerMode"])) {
				ui.brawfo = ui.create.system("调试按钮", function() {
					if (this.inter) {
						clearInterval(this.inter)
						delete this.inter;
						if (_status.customcss_e) {
							document.head.removeChild(_status.customcss_e);
						}
						delete _status.customcss_e;
						delete _status.customcss
					} else {
						this.inter = setInterval(function() {
							if (lib.hearthstone.css_editdeck) {
								lib.hearthstone.css_editdeck.href = `${utility.extensionDirectoryPath}experiment/style/editdeck.css?time=${Math.random()}`;
							}
							if (lib.hearthstone.css_common) {
								lib.hearthstone.css_common.href = `${utility.extensionDirectoryPath}experiment/style/common.css?time=${Math.random()}`;
							}
							if (lib.hearthstone.css_mode) {
								lib.hearthstone.css_mode.href = `${utility.extensionDirectoryPath}experiment/style/${lib.hearthstone.css_mode.mode}.css?time=${Math.random()}`;
							}
							if (lib.hearthstone.css_big_img) {
								lib.hearthstone.css_big_img.href = `${utility.extensionDirectoryPath}experiment/style/big_img.css?time=${Math.random()}`;
							}
							if (_status.customcss) {
								if (!_status.customcss_e) {
									_status.customcss_e = document.createElement("style");
									document.head.appendChild(_status.customcss_e);
								}
								_status.customcss_e.innerHTML = _status.customcss;
							}
						}, 1000);
					}
				});
			}
			//下面的代码加上后，游戏开始编辑卡组时，点卡牌可以看详情
			var cfd = ui.create.dialog;
			ui.create.dialog = function() {
				var res = cfd.apply(ui, arguments);
				if (res?.buttons?.length) {
					res.buttons.forEach(i => i.listen(function() {
						get.HSF("morefocus", [this]);
					}));
				}
				return res;
			};
			document.onclick = function() {
				var items = Array.from(document.querySelectorAll(".card.rdcreated"));
				if (items?.length) {
					items.forEach(i => {
						if (!i.rd_checked) {
							i.listen(function() {
								i.rd_checked = true;
								get.HSF("morefocus", [this]);
							});
						}
					});
				}
			};
			get.HSF("morezone");
			lib.hearthstone.upF = lib.element.player.update;
			lib.hearthstone.chhF = lib.element.player.changeHujia;
			game.zhu = game.me;
			game.enemy = game.me.next;
			game.me.classList.add("bright");
			game.enemy.classList.add("bright");
			game.me.identity = "zhu";
			game.enemy.identity = "fan";
			game.me.side = true;
			game.enemy.side = false;
			var list = [...get.HSA("duelist"), ...get.HSA("skin")].filter(i => {
				if (!get.config("HS_DIY")) {
					return i !== "hero_addiction";
				}
				return true;
			});
			list.forEach(i => {
				let job = lib.character[i][1];
				let heroskill = lib.hearthstone.base_heroskill;
				let tg;
				//添加基础英雄技能
				for (let j in heroskill) {
					if (heroskill[j].rnature == job) {
						tg = j;
						break;
					}
				}
				if (!tg) {
					get.hs_alt("找不到" + job + "对应的英雄技能！");
					return;
				}
				lib.character[i].skills.add(tg);
			});
			_status.characterList = list;
		},
		entermode() {
			const next = game.createEvent('entermode', false);
			next.setContent(async function(event, trigger, player) {
				let mode = get.HSF("cfg", ["HS_duelMode"]);
				if (mode === "testing") {
					_status.fixed_mode = mode;
					lib.hearthstone.shijian.testing();
					return;
				}
				await lib.hearthstone.shijian.chooseCharacter();
				mode = _status.fixed_mode;
				switch (mode) {
					case "watching":
						get.HSF("newdeckbuilder");
						break;
					case "brawl":
						lib.hearthstone.shijian.brawl();
						break;
					case "challenge":
						lib.hearthstone.shijian.challenge();
						break;
					default:
						lib.hearthstone.shijian.deckBuild();
				}
			});
		},
		chooseCharacter() { //选人
			const next = game.createEvent('chooseCharacter', false);
			next.showConfig = true;
			next.setContent(async function(event, trigger, player) {

				var list = _status.characterList;
				event.list = list;
				ui.arena.classList.add('choose-character');

				//到此结束
				get.HSF("Aud2", ["选英雄"]);
				const pro = "请选择要出场的决斗者";
				const dialog = ui.create.dialog(pro, 'hidden');
				dialog.add('0/1');
				dialog.add([list.slice(0), 'character']);
				dialog.open();
				const { result } = await game.me.chooseButton(dialog, true);

				game.me.init(result.links[0]);
				game.me.update();
				game.me.node.hp.innerHTML = game.me.hp;
				event.list.randomSort();
				const cdmode = get.HSF("cfg", ["HS_duelMode"]);
				const cofg = get.HSF("cfg", ["HS_aichosen"]);
				_status.fixed_mode = cdmode;
				let tbo = cofg == "player";
				if (cdmode == "watching") return;

				if (cdmode == "challenge") {
					event.list = get.HSF("hs_preboss");
					tbo = true;
				}
				const p = tbo ? game.me : game.enemy;
				const pro2 = tbo ? "请选择电脑要出场的决斗者" : "请选择要出场的决斗者";
				const dialog2 = ui.create.dialog(pro2, 'hidden');
				dialog2.add('0/1');
				dialog2.add([event.list, 'character']);
				dialog2.open();
				const next = p.chooseButton(dialog2, true).set("ai", () => Math.random());
				const result2 = await next.forResult();

				if (cdmode == "challenge") {
					_status.brawlboss = result2.links[0];
				} else {
					game.enemy.init(result2.links[0]);
					game.enemy.update();
					game.enemy.node.hp.innerHTML = game.enemy.hp;
				}

			});
			return next;
		},
		testing() { //测试卡效
			const next = game.createEvent('testing', false);
			next.setContent(async function(event, trigger, player) {
				const obj = get.HSA("testing")[0];
				_status.hs_testing_obj = obj;
				//选人
				game.me.init(obj.me);
				game.me.update();
				game.me.node.hp.innerHTML = game.me.hp;
				game.enemy.init(obj.enemy);
				game.enemy.update();
				game.enemy.node.hp.innerHTML = game.enemy.hp;
				//设置场景
				const func = function(str) {
					const p = game[str];
					const keyHanders = {
						startmana(player, obj) {
							get.HSF("作弊", ["水晶", obj, player]);
						},
						heroskill_usable(player, obj) {
							get.HSF("作弊", ["code", function(player) {
								player.heroskill.extrausable = obj;
							}, player]);
						},
						zerocost(player, obj) {
							get.HSF("作弊", ["code", function(player) {
								player.addaurasbuff({
									name: "hs_cost",
									value: 0,
									subtype: "final",
									ghfilter(card, fellow, target) {
										return target == fellow.getLeader();
									},
								});
							}, player]);
						},
						deck(player, obj) {
							player.deckCards = [];
							for (const name of obj) {
								player.deckCards.addArray(get.hs_deck2(name));
							}
						},
						hand(player, obj) {
							for (const name of obj) {
								get.HSF("作弊", ["获得", name, player])
							}
						},
						fellow(player, obj) {
							for (const name of obj) {
								get.HSF("作弊", ["特召", name, player]);
							}
						},
						secret(player, obj) {
							for (const name of obj) {
								get.HSF("作弊", ["奥秘", name, player]);
							}
						},
						weapon(player, obj) {
							get.HSF("作弊", ["武器", obj, player]);
						},
					};
					const keys = Object.keys(keyHanders);
					for (const key of keys) {
						const rkey = str + key;
						if (obj[rkey]) {
							keyHanders[key](p, obj[rkey]);
						}
					}
					for (const key of ["startmana", "heroskill_usable", "zerocost"]) {
						if (obj[key]) {
							keyHanders[key](p, obj[key]);
						}
					}
				};
				func("me");
				func("enemy");
				//其他代码
				if (obj.othercode) {
					_status.brawlcommd = [];
					_status.brawlcommd.push(function() {
						obj.othercode();
					});
				}
				//选标题
				get.HSF("作弊", ["code", function(player) {
					game.me.chooseControl("ok", true).set("dialog", [obj.dialog, obj.intro]);
				}, player]);
			});
			// return next;
		},
		brawl() { //乱斗模式
			const next = game.createEvent('brawl', false);
			next.setContent(async function(event, trigger, player) {

				event.list = get.HSA("brawlscene").map(i => i.name);
				let { result } = await game.me.chooseControlList("选一个要玩的乱斗", event.list, true);

				event.det = get.HSA("brawlscene")[result.index];
				event.stage = event.det.name;
				game.me.chooseControl("ok", true).set("dialog", [event.stage, event.det.intro]);

				var deck = event.det.deck;
				var build = function(p, d) {
					p.deckCards = [];
					for (const n in d) {
						switch(n) {
							case "certain":
								for (let i = 0; i < d[n][1]; i++) {
									p.deckCards.add(get.chscard(d[n][0]));
								}
								break;
							case "randomjobcard":
								for (let i = 0; i < d[n]; i++) {
									var job = p.group;
									var kc = get.hskachi("all", (c, info) => info.rnature == job);
									p.deckCards.add(get.chscard(kc.randomGet()));
								}
								break;
							case "randomneutral":
								for (let i = 0; i < d[n]; i++) {
									var kc = get.hskachi("all", (c, info) => !info.rnature);
									p.deckCards.add(get.chscard(kc.randomGet()));
								}
								break;
							case "randomSpell":
								for (let i = 0; i < d[n]; i++) {
									var job = p.group;
									var kc = get.hskachi("HS_spell", (c, info) => info.rnature == job);
									p.deckCards.add(get.chscard(kc.randomGet()));
								}
								break;
							case "random":
								for (let i = 0; i < d[n]; i++) {
									const job = p.group;
									var kc = get.hskachi("all", (c, info) => !info.rnature || info.rnature == job);
									p.deckCards.add(get.chscard(kc.randomGet()));
								}
								break;
							default:
								break;
						}
					}
				};
				build(game.me, deck);
				build(game.enemy, deck);

				const type = event.det.type;
				if (type == "specialrule") {
					for (var i in event.det.rules) {
						if (i == "phaseDraw") {
							_status.hs_specialPhaseDraw = event.det.rules[i];
						}
					}
				}
			});
			return next;
		},
		challenge() { //挑战首领
			const next = game.createEvent('challenge', false);
			next.setContent(async function(event, trigger, player) {
				const zwname = get.translation(_status.brawlboss);
				event.stage = "挑战" + zwname;
				const det = get.HSA("challengescene").find(i => i.name == event.stage);
				const { diy } = det;
				if (diy) game.enemy.classList.add("diyleader");
				get.HSF("hs_boss", [zwname, det.prepare, det.meprepare]);
			});
		},
		deckBuild() { //组卡
			const next = game.createEvent('deckBuild', false);
			next.setContent(async function(event, trigger, player) {
				get.hs_deck(game.me);
				get.hs_deck(game.enemy);
				if (!_status.auto && !get.HSF("cfg", ["HS_nobuilder"])) {
					get.HSF("newdeckbuilder");
				}
			});
		},
		reach() { //开始进入炉石世界
			const next = game.createEvent('reach', false);
			next.setContent(async function(event, trigger, player) {
				game.countPlayer(function(current) {
					lib.element.HSleader.create(current);
				});
				ui.control.style.transitionDuration = '0s';
				ui.refresh(ui.control);
				ui.arena.classList.remove('choose-character');
				setTimeout(function() {
					ui.control.style.transitionDuration = '';
				}, 500);

				//主玩家机制
				_status.hsbo = Math.random() < 0.5;
				var id1 = get.hs_id(game.me);
				var id2 = get.hs_id(game.enemy);
				_status.hsAttendSeq = [id1, id2];
				if (!_status.hsbo) _status.hsAttendSeq.reverse();
				_status.hsAttendSeq.log = {};
				_status.hsAttendSeq.log2 = id => _status.hsAttendSeq.log[id];
				_status.hsAttendSeq.ind = function(o) {
					return this.indexOf(get.hs_id(o));
				};
				_status.hsAttendSeq.ad = function(o) {
					const that = this;
					if (!o || o.length === 0) return;
					if (o.length) {
						o.forEach(i => that.add(i));
					} else {
						var id = get.hs_id(o);
						if (id) {
							that.add(id);
							_status.hsAttendSeq.log[id] = o;
						}
					}
				};
				_status.hsAttendSeq.cl = function(objs) {
					const that = this;
					if (objs) {
						if (objs.length) {
							objs.forEach(j => _status.hsAttendSeq.cl(j));
							return;
						} else {
							var ind = that.ind(objs);
							if (ind >= 0) {
								delete _status.hsAttendSeq.log[that[ind]];
								that[ind] = null;
							}
						}
					}
					var ids = game.me.sctp("field").concat(game.dead).reduce((x, y) => {
						var res = [];
						res.add(get.hs_id(y));
						if (y.buff?.length) {
							res.addArray(y.buff.map(i => get.hs_id(i)));
						}
						x = x.concat(res);
						return x;
					}, []);
					_status.hsAttendSeq.forEach(i => {
						if (i == null) {
							_status.hsAttendSeq.remove(i);
						}
						if (!ids.includes(i)) {
							delete _status.hsAttendSeq.log[i];
							_status.hsAttendSeq.remove(i);
						}
					});
				};
				_status.hs_dead_All = {}; //死者名单
				_status.hs_dead_All[game.me.playerid] = [];
				_status.hs_dead_All[game.enemy.playerid] = [];
				_status.hs_dead = {}; //本回合死亡名单
				_status.hs_dead[game.me.playerid] = [];
				_status.hs_dead[game.enemy.playerid] = [];
				_status.hs_state = {
					deadfellow: 0,
				};
			});
			// return next;
		},
		XJBG() { //瞎xx改(专属技能，场地区域，备份当前背景，添加"查看场上"按钮，角色添加专属技能，系统写入剩下的自定义函数)
			ui.hs_endbtn = ui.create.div(".hs_endbtn", ui.arena);
			ui.hs_endbtn.innerHTML = "回合结束";
			ui.hs_endbtn.listen(function() {
				if (game.me.HSF("phaseUse")) {
					_status.hsbattling = false;
					if (_status.hs_pressatker) {
						_status.hs_pressatker.classList.remove("hs_atkprepare");
					}
					delete _status.hs_pressatker;
					delete _status.hs_pressdef;
					ui.click.cancel();
				}
			});
			//定时任务
			ui.hs_endbtn.inter = setInterval(function() {
				get.HSF("checkui");
				if (_status.hs_starttime && _status.currentPhase?.aurasEffed("hs_Nozdormu")) {
					const now = new Date();
					if (now - _status.hs_starttime >= 15000) {
						const evt = _status.event.getParent("phaseUse");
						if (evt) {
							evt.skipped = true;
						}
					}
				}
			}, 500);
			//创建牌库区、法力水晶、英雄技能
			const createSecret = function(side) { //创建牌库区
				var p = game[side];
				p.secrets = [];
				let secretbd = ui.create.div(`.secretbd.secret${side}bd`, ui.arena);
				let secret1 = ui.create.div(".secret", secretbd);
				let secret2 = ui.create.div(".secret", secretbd);
				let secret3 = ui.create.div(".secret", secretbd);
				let secret4 = ui.create.div(".secret", secretbd);
				/*代码修改：现在pos和挂奥秘的顺序有关*/
				secret1.dataset.pos = "x";
				secret2.dataset.pos = "x";
				secret3.dataset.pos = "x";
				secret4.dataset.pos = "x";
				secret1.dataset.rnature = "hs_mage";
				secret2.dataset.rnature = "hs_hunter";
				secret3.dataset.rnature = "hs_paladin";
				secret4.dataset.rnature = "hs_rogue";
				var f = function() {
					//代码修改：如果点的是敌方奥秘区，无反应
					if (!game.me.secretbd.list.includes(this)) return;
					var job = this.dataset.rnature;
					/*代码修改，将c改成c.linkCard[0]，这样可以显示详情，at(-1)是显示最近的奥秘*/
					var cd = game.me.secrets.filter(c => get.rnature(c.linkCard[0]) == job).at(-1);
					if (cd) get.HSF("morefocus", cd.linkCard);
				}
				secret1.listen(f);
				secret2.listen(f);
				secret3.listen(f);
				secret4.listen(f);
				p.secretbd = secretbd;
				p.secretbd.list = [secret1, secret2, secret3, secret4];
			};
			const createDeck = function(side) { //创建牌库区
				let udeckcontainer = `hs_${side}deckcontainer`;
				let cdeckcontainer = `.${side}deckcontainer`;
				let deckcontainer = ui.create.div(cdeckcontainer, ui.arena);
				let udeckbox = `hs_${side}deckbox`;
				let cdeckbox = `.${side}deckbox`;
				let udeck = `hs_${side}deck`;
				let u = `hs_${side}`;

				ui[udeckbox] = ui.create.div(cdeckbox, ui.arena);
				ui.arena.insertBefore(ui[udeckbox], deckcontainer);
				ui[udeckcontainer] = deckcontainer;
				ui[udeck] = ui.create.player(deckcontainer, true);
				let decklencontainer = ui.create.div(".decklencontainer", ui[udeck]);
				ui[u] = ui.create.player(ui.arena, true);
				ui[u].classList.add(u);
				let bk = get.hscardback(game[side]);
				let path = "url('" + lib.assetURL + "extension/" + bk + "')";
				let cardx = ui.create.card(ui.special, "noclick", true);
				cardx.style.backgroundImage = path;
				cardx.style.backgroundSize = "100% 100%";
				lib.hearthstone[side + "card"] = cardx;

				ui[udeck].node.avatar.show();
				ui[udeck].node.avatar.style.background = path;
				deckcontainer.listen(function() {
					if (ui.arena.classList.contains("hs_exchange2")) return;
					var that = ui.arena;
					if (this == ui.hs_medeckcontainer || this == ui.hs_enemydeckcontainer) that = this;
					else that = this.nextSibling;
					that.classList.add("hs_check");
					var count = that.querySelector(".count");
					count.show();
					if (!that.hs_check) that.hs_check = setTimeout(function() {
						delete that.hs_check;
						that.classList.remove("hs_check");
						count.hide();
					}, 3000);
				});
				ui[udeck].hide();
				ui[udeck].name = "牌库";
				ui[u].style.transition = "all 0s";
				ui[u].name = "墓地";
				game[side].cardPile = ui[udeck];
				game[side].discardPile = ui[u];
			};
			//法力水晶
			const createMana = function(side) {
				let camana = `.hs_mana.${side}mana`;
				let p = game[side];
				p.mana = ui.create.div(camana, ui.arena, "0");
				p.mana.locked = ui.create.div(".manalk.lock", p.mana);
				p.mana.owed = ui.create.div(".manalk.owe", p.mana);
				p.mana.locked.hide();
				p.mana.owed.hide();
			};
			//英雄技能
			const createHeroskill = function(str) {
				var p = game[str];
				p.heroskill = ui.create.div(".hs_hrsk." + str + "heroskill", ui.arena);
				p.heroskill.frontface = ui.create.div(".frontface", p.heroskill);
				p.heroskill.frontface.zhezhao = ui.create.div(".skillzhezhao", p.heroskill.frontface);
				p.heroskill.backface = ui.create.div(".backface", p.heroskill);
				p.heroskill.pos = ui.create.player(ui.arena, true);
				p.heroskill.pos.name = "移除";
				p.heroskill.pos.classList.add(str + "heroskillpos");
				p.heroskill.skill = lib.character[p.name][3][0];
				p.heroskill.divcost = ui.create.div(".hs_hrskct", p.heroskill.frontface, p.HSF("hs_num") + "");
				get.HSF("longP", [p.heroskill, function() {
					get.HSF("morefocus", [this]);
				}]);
				p.heroskill.listen(function(e) {
					if (!this.classList.contains("meheroskill")) return;
					if (game.me.HSF("phaseUse")) {
						if (game.me.HSF("canhrsk")) {
							ui.click.skill(this.skill);
						} else {
							if (!game.me.heroskill.available) {
								game.me.HSFT("普通错误");
							} else if (game.me.heroskill.cost > game.me.HSF("mana")) {
								game.me.HSFT("法力值不够");
							} else if (lib.skill[game.me.heroskill.skill].summoneff && game.me.hs_full()) {
								game.me.HSFT("满场七随从");
							} else {
								game.me.HSFT("普通错误");
							}
						}
					}
					e.stopPropagation();
				});
				p.update();
				p.heroskill.init = function(pp, skill) { //初始化英雄技能
					var dire = "heroskill",
						name = skill.replace("_legend", "");
					if (skill.indexOf("hs_leader") == 0) dire = "boss";
					this.frontface.style.backgroundImage = `url('${utility.extensionDirectoryPath}resource/image/${dire}/${name}.jpg')`;
					var info = get.info(skill);
					if (info.diy || skill.indexOf("hs_leader_hs_") == 0) this.classList.add("hs_diyhrsk");
					else this.classList.remove("hs_diyhrsk");
					this.buff = [];
					this.skill = skill;
					this.usable = 1;
					this.used = 0;
					this.hrskai = info.hrskai || function() {
						return 1;
					};
					this.extrafilter = info.extrafilter;
					this.filterT = info.filterT;
					this.filterTarget = info.filterT;
					this.ranHT = info.randomHT;
					this.randomHT = info.randomHT;
					this.baseCost = pp.HSF("hs_num", [skill]);
					this.cost = this.baseCost;
					this.name = get.translation(skill);
					this.content = info.effect;
				};
				p.heroskill.init(p, p.heroskill.skill);
			};
			for (let str of ["me", "enemy"]) {
				createSecret(str);
				createDeck(str);
				createMana(str);
				createHeroskill(str);
			}
			get.HSF("checkall", ["hand", "heroskill"]);
			//手牌区缩回原因
			_status.hdcsST = null;
			ui.hs_testfl = ui.create.div(".player.minskin", ui.arena);
			ui.hs_testfl.name = "占位";
			ui.hs_testfl.dataset.position = "d0";
			ui.hs_testfl.num = 2;
			ui.hs_testfl.dataset.enemy = "0";
			ui.hs_testfl.classList.add("testfl");
			ui.hs_surrender = ui.create.div(".surrender", ui.arena);
			ui.hs_surrender.listen(function() {
				var func = get.HSF("surrender");
				if (game.me.HSF("phaseUse")) {
					ui.click.skill("hs_surrender");
				} else {
					const next = game.createEvent("hs_surrender", false);
					next.setContent(func);
				}
			});
			lib.onover.push(get.HSF("nextduel"));
			lib.onover.push(function(bo) {
				const result = bo === true ? "胜利" : "失败";
				get.HSF("Aud2", [result]);
			});
			for (let i in lib.hearthstone.constants.ski) {
				lib.skill["rdrd_" + i] = {};
				var ar = lib.hearthstone.constants.ski[i];
				lib.translate["rdrd_" + i] = ar[0];
				lib.translate["rdrd_" + i + "_info"] = ar[1];
			}
			ui.monsterzone = ui.create.div(".monsterzone", ui.arena);
			ui.zonearena = ui.create.div(".zonearena", ui.arena);
			ui.hs_enemycount = ui.create.div(".hs_enemycount", ui.arena);
			ui.hs_enemycount.appendChild(lib.hearthstone.enemycard);
			ui.hs_enemycount.appendChild(game.enemy.node.count);
			game.enemy.node.count.className = "ec";
			var ski = get.HSA("ski");
			for (let i in ski) {
				lib.skill["hshs_" + i] = {};
				var ar = ski[i];
				lib.translate["hshs_" + i] = ar[0];
				lib.translate["hshs_" + i + "_info"] = ar[1];
			}

			get.attitude = function(a, b) {
				return a.side == b.side ? 10 : -10;
			};
			_status.hs_willbug = true;
			var nodeintroF = get.nodeintro;
			get.nodeintro = function(node, simple, evt) {
				var resnode = nodeintroF(node, simple, evt);
				if (ui.arena.classList.contains("hscss") && get.hstype(node) == "player" && game.players.includes(node)) {
					var cost = 0;
					if (node.isMin()) {
						var buffs = node.buff.filter(i => i.iswork() && i.type == "hs_power");
						buffs.forEach(i => {
							cost += i.value;
						});
					} else {
						cost = node.countFq();
					}
					if (cost > 0) {
						resnode.add("法强：<span class='bluetext'>" + cost + "</span>");
					}
				}
				return resnode;
			};
			const next = game.createEvent("XJBG", false);
			next.setContent(async function(event, trigger, player) {

				if (_status.brawlcommd?.length) {
					_status.brawlcommd.forEach(i => i());
				}
				ui.arena.hs_myturn = ui.create.div(".hs_myturn", ui.arena);
				ui.arena.hs_myturn.rune = ui.create.div(".hs_rune", ui.arena.hs_myturn);
				ui.arena.hs_myturn.img = ui.create.div(".hs_img", ui.arena.hs_myturn);
				ui.arena.hs_myturn.img.text = ui.create.div(".hs_img_text", ui.arena.hs_myturn.img, "你的回合");
				ui.arena.classList.remove("hs_preinit");
				ui.morezone.hide();
				ui.background.style.transition = "all 1s";
				document.body.style.transition = "all 1s";
				ui.background.style.filter = "brightness(0%)";
				document.body.style.filter = "brightness(0%)";
				ui.arena.classList.add("hs_black");


				ui.create.div(".bright.hs_vs", ui.arena);
				var n1 = ui.create.div(".bright.hs_mefull", ui.arena);
				var n2 = ui.create.div(".bright.hs_enemyfull", ui.arena);
				game.me.appendChild(n1);
				game.enemy.appendChild(n2);
				n1.innerHTML = get.HSA("fullname")[game.me.name.split("_")[1]] || get.translation(game.me.name);
				n2.innerHTML = get.HSA("fullname")[game.enemy.name.split("_")[1]] || get.translation(game.enemy.name);
				n1 = ui.create.div(".bright.hs_mejob", ui.arena);
				n2 = ui.create.div(".bright.hs_enemyjob", ui.arena);
				n1.innerHTML = get.HS_trans(game.me.group);
				n2.innerHTML = get.HS_trans(game.enemy.group);
				game.me.appendChild(n1);
				game.enemy.appendChild(n2);
				await game.delay(2);

				setTimeout(function() {
					document.body.style.filter = "brightness(100%)";
				}, 400);
				ui.arena.classList.remove("hs_black");
				ui.background.style.filter = "brightness(25%)";
				ui.arena.classList.add("hs_exchange");
				ui.arena.classList.add("hs_exchange2");

				if (game.me.deckCards) {
					ui.hs_medeck.directgain(game.me.deckCards);
					ui.hs_medeck.hs_sort();
				}
				if (game.enemy.deckCards) {
					ui.hs_enemydeck.directgain(game.enemy.deckCards);
					ui.hs_enemydeck.hs_sort();
				}
				delete game.me.deckCards;
				delete game.enemy.deckCards;
				get.HSF("checkdeck");
				if (get.HSF("cfg", ["developerMode"])) {
					window.lib = lib;
					window.ui = ui;
					window.game = game;
					window.get = get;
					window.ai = ai;
					window._status = _status;
				}

				ui.hs_medeck.show();
				ui.hs_enemydeck.show();
				delete ui.hs_medeck.forcecount;
				delete ui.hs_enemydeck.forcecount;
				if (_status.hs_testing_obj || get.HSF("cfg", ["developerMode"])) {
					await game.delayx(2);
				} else {
					await game.delayx(get.HSF("Aud4"));
				}
			});
			// return next;
		},
	},
	//编辑卡组自定义变量
	custom: {},
	//自定义变量
	ranvv: {},
	imported: []
};