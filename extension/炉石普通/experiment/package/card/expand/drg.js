import { lib, game, ui, get, ai, _status } from "../../../../../../noname.js";

export const DRG = {
	name: "巨龙降临",
	en: "DRG",
	minor: {
		info: {
			"Shrubadier": ["盆栽投手", "essential", "战吼：召唤一个2/2的树人。", ["HS_effect", "2", "hs_druid", "none", "1", "1"],
				["battleRoal:树人"]
			],
			"Bloodsail Flybooter": ["血帆飞贼", "essential", "战吼：将两张1/1的海盗牌置入你的手牌。", ["HS_effect", "1", "hs_rogue", "pirate", "1", "1"],
				["battleRoal:gain>['空中海盗',2]"]
			],
			"Sky Pirate": ["空中海盗", "essential", "", ["HS_normal", "1", "hs_rogue", "pirate", "1", "1"],
				["token"]
			],
			"Frizz Kindleroost": ["弗瑞兹·光巢", "legend", "战吼：使你牌库中龙牌的法力值消耗减少（2）点。", ["HS_effect", "4", "hs_neutral", "none", "5", "4"],
				["legend"]
			],
			"Sky Raider": ["空中悍匪", "essential", "战吼：随机将一张海盗牌置入你的手牌。", ["HS_effect", "1", "hs_warrior", "pirate", "1", "2"],
				["battleRoal:rangain>海盗"]
			],
			"Skybarge": ["空中炮艇", "essential", "在你召唤一个海盗后，随机对一个敌人造成2点伤害。", ["HS_effect", "3", "hs_warrior", "machine", "2", "5"]],
			"Hot Air Balloon": ["热气球", "essential", "在你的回合开始时，获得+1生命值。", ["HS_effect", "1", "hs_neutral", "machine", "1", "2"]],
			"Shuma": ["舒玛", "legend", "在你的回合结束时，召唤数条1/1的触手，直到你的随从数量达到上限。", ["HS_effect", "7", "hs_neutral", "none", "1", "7"],
				["legend", "ending:['触手', 7]"]
			],
			"Nether Drake": ["虚空幼龙", "rare", "", ["HS_normal", "6", "hs_warlock", "dragon", "6", "6"],
				["token"]
			],
			"Tentacle": ["触手", "essential", "", ["HS_normal", "1", "hs_neutral", "none", "1", "1"],
				["token"]
			],
			"Evasive Wyrm": ["辟法巨龙", "ordinary", "突袭，圣盾，无法成为法术或英雄技能的目标。", ["HS_effect", "6", "hs_neutral", "dragon", "5", "3"]],
			"Evasive Drakonid": ["辟法龙人", "ordinary", "嘲讽，无法成为法术或英雄技能的目标。", ["HS_effect", "7", "hs_neutral", "dragon", "7", "7"]],
			"ZzerakutheWarped": ["扭曲巨龙泽拉库", "legend", "每当你的英雄受到伤害，召唤一条6/6的虚空幼龙", ["HS_effect", "8", "hs_warlock", "dragon", "4", "12"],
				["legend"]
			],
			"Valdris Felgorge": ["瓦迪瑞斯·邪噬", "legend", "战吼：将你的手牌上限变为12，抽四张牌。", ["HS_effect", "7", "hs_warlock", "none", "4", "4"],
				["legend"]
			],
			"Living Storm": ["活化风暴", "essential", "突袭", ["HS_effect", "4", "hs_shaman", "elemental", "4", "4"],
				["token"]
			],
			"Brewing Storm": ["成型风暴", "essential", "突袭", ["HS_effect", "2", "hs_shaman", "elemental", "2", "2"],
				["token"]
			],
			"Raging Storm": ["狂怒风暴", "essential", "突袭", ["HS_effect", "8", "hs_shaman", "elemental", "8", "8"],
				["token"]
			],
			"Windswept Elemental": ["啸风元素", "essential", "突袭", ["HS_effect", "2", "hs_shaman", "elemental", "2", "1"],
				["token"]
			],
			"DraconicImp": ["龙裔小鬼", "essential", "", ["HS_normal", "1", "hs_warlock", "demon", "1", "1"],
				["token"]
			],
			"Squallhunter": ["猎风巨龙", "ordinary", "法术伤害+2，过载：（2）", ["HS_effect", "4", "hs_shaman", "dragon", "5", "7"]],
		},
		skill: {
			"hs_Skybarge": {
				summonAfter: {
					self: true,
					notlink: true,
					filter(evt, player, fellow) {
						return get.rall(evt.card, 'rkind') == 'pirate';
					},
					randomRT(player) {
						return player.sctp("opposide").filter(fl => fl.canhsdmg()).randomGet();
					},
					async effect(event, trigger, player) {
						event.target.hs_dmgrcv("damage", 2, event.fellow);
					},
				},
			},
			"hs_FrizzKindleroost": {
				battleRoal: {
					async effect(event, trigger, player) {
						var obj = player.addcostbuff(2, c => get.rkind(c) == "dragon", Infinity);
						obj.label = "lwpo";
						player.addtriggerbuff({
							info: {
								useCard: {
									direct: true,
									self: true,
									notlink: true,
									filter(evt, p, f) {
										return get.rkind(evt.card) == "dragon";
									},
									effect() {
										player.removehsbuff(player.buff.filter(i => i.label == "lwpo")[0]);
										player.removehsbuff(event.obj.relabuff);
									},
								},
							}
						});
					},
				},
			},
			"hs_ValdrisFelgorge": {
				async battleRoal(event, trigger, player) {
					lib.skill.hs_summonlimit.mod.maxHandcardFinal = () => 12;
					await player.hs_drawDeck(4);
				},
			},
			"hs_ZzerakutheWarped": {
				hsdmg: {
					self: true,
					async effect(event, trigger, player) {
						player.SSfellow(['虚空幼龙']);
					},
				},
			},
		},
	},
	spell: {
		info: {
			hs_RainofFire: ["火焰之雨", "ordinary", ["damage:1", "对所有角色造成1点伤害"], 1, "hs_warlock", "fire", ["fire", "lava:all"]],
		},
		skill: {},
	},
	trap: {
		info: {},
		skill: {},
	},
	weapon: {
		info: {
			hs_DragonClaw: ["巨龙之爪", "essential", "", 5, "hs_neutral", 5, 2, ["token"]],
		},
		skill: {},
	},
	hero: {
		info: {
			// 加拉克隆
			hs_GalakrondtheWretched: ["邪火巨龙迦拉克隆", "legend", "战吼：随机召唤一个恶魔(被祈求两次后升级)", 7, "hs_warlock", ["legend"]],
			hs_GalakrondtheTempest: ["风暴巨龙迦拉克隆", "legend", "战吼：召唤两个2/2并具有突袭的随从(被祈求两次后升级)", 7, "hs_shaman", ["legend"]],
			hs_GalakrondtheUnspeakable: ["讳言巨龙迦拉克隆", "legend", "战吼：随机消灭一个敌方随从(被祈求两次后升级)", 7, "hs_priest", ["legend"]],
			hs_GalakrondtheNightmare: ["梦魇巨龙迦拉克隆", "legend", "战吼：抽一张牌，其法力值消耗为（0）(被祈求两次后升级)", 7, "hs_rogue", ["legend"]],
			hs_GalakrondtheUnbreakable: ["无敌巨龙迦拉克隆", "legend", "战吼：抽一张随从牌，使其获得加4+4(被祈求两次后升级)", 7, "hs_warrior", ["legend"]],
			// 2级加拉克隆。
			hs_GalakrondtheWretchedApocalypse: ["天降浩劫迦拉克隆1", "legend", "战吼：随机召唤两个恶魔(被祈求两次后升级)", 7, "hs_warlock", ["legend", "token"]],
			hs_GalakrondtheTempestApocalypse: ["天降浩劫迦拉克隆2", "legend", "战吼：召唤两个4/4并具有突袭的随从(被祈求两次后升级)", 7, "hs_shaman", ["legend", "token"]],
			hs_GalakrondtheUnspeakableApocalypse: ["天降浩劫迦拉克隆3", "legend", "战吼：随机消灭两个敌方随从(被祈求两次后升级)", 7, "hs_priest", ["legend", "token"]],
			hs_GalakrondtheNightmareApocalypse: ["天降浩劫迦拉克隆4", "legend", "战吼：抽两张牌，其法力值消耗为（0）(被祈求两次后升级)", 7, "hs_rogue", ["legend", "token"]],
			hs_GalakrondtheUnbreakableApocalypse: ["天降浩劫迦拉克隆5", "legend", "战吼：抽两张随从牌，使其获得加4+4(被祈求两次后升级)", 7, "hs_warrior", ["legend", "token"]],
			// 终级加拉克隆。
			hs_WretchedGalakrondAzerothsEnd: ["世界末日迦拉克隆1", "legend", "战吼：随机召唤四个恶魔，装备一把5/2的巨龙之爪", 7, "hs_warlock", ["legend", "token"]],
			hs_TempestGalakrondAzerothsEnd: ["世界末日迦拉克隆2", "legend", "战吼：召唤两个8/8并具有突袭的随从，装备一把5/2的巨龙之爪", 7, "hs_shaman", ["legend", "token"]],
			hs_UnspeakableGalakrondAzerothsEnd: ["世界末日迦拉克隆3", "legend", "战吼：随机消灭四个敌方随从，装备一把5/2的巨龙之爪", 7, "hs_priest", ["legend", "token"]],
			hs_NightmareGalakrondAzerothsEnd: ["世界末日迦拉克隆4", "legend", "战吼：抽四张牌，其法力值消耗为（0），装备一把5/2的巨龙之爪", 7, "hs_rogue", ["legend", "token"]],
			hs_UnbreakableGalakrondAzerothsEnd: ["世界末日迦拉克隆5", "legend", "战吼：抽四张随从牌，使其获得加4+4，装备一把5/2的巨龙之爪", 7, "hs_warrior", ["legend", "token"]],
		},
		skill: {
			/** 最终形态*/
			//术士迦拉克隆
			"hs_WretchedGalakrondAzerothsEnd": {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_GalakrondtheWretched");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					player.rkind = "dragon";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ["迦拉克隆的恶意"]);
					player.changeHujia(5);
					player.hs_weapon("巨龙之爪");
					for (let i = 0; i < 4; i++) {
						await player.SSfellow(['range:恶魔']);
					}
				},
			},
			// 萨满迦拉克隆
			"hs_TempestGalakrondAzerothsEnd": {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_GalakrondtheTempest");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					player.rkind = "dragon";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ["迦拉克隆的愤怒"]);
					player.changeHujia(5);
					await player.hs_weapon("巨龙之爪");
					player.SSfellow(["狂怒风暴", 2]);
				},
			},
			// 牧师迦拉克隆
			"hs_UnspeakableGalakrondAzerothsEnd": {
				randomRT(p) {
					var fls = p.sctp("notmine").filter(t => t.canhsdmg());
					if (fls.length == 0) return false;
					return fls.randomGets(4);
				},
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_GalakrondtheUnspeakable");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					player.rkind = "dragon";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ["迦拉克隆的智识"]);
					player.changeHujia(5);
					await player.hs_weapon("巨龙之爪");
					event.target.HSF('cuihui');
				},
			},
			// 盗贼迦拉克隆
			"hs_NightmareGalakrondAzerothsEnd": {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_GalakrondtheNightmare");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					player.rkind = "dragon";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ["迦拉克隆的诡计"]);
					player.changeHujia(5);
					await player.hs_weapon("巨龙之爪");
				},
			},
			// 战士迦拉克隆
			"hs_NightmareGalakrondAzerothsEnd": {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_GalakrondtheUnbreakable");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					player.rkind = "dragon";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ["迦拉克隆的巨力"]);
					player.changeHujia(5);
					await player.hs_weapon("巨龙之爪");
				},
			},
			/** 第二阶段*/
			// 术士迦拉克隆2阶段
			"hs_GalakrondtheWretchedApocalypse": {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_GalakrondtheWretched");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					player.rkind = "dragon";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ["迦拉克隆的恶意"]);
					player.changeHujia(5);
					for (let i = 0; i < 2; i++) {
						await player.SSfellow(['range:恶魔']);
					}
				},
			},
			// 萨满迦拉克隆
			"hs_GalakrondtheTempestApocalypse": {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_GalakrondtheTempest");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					player.rkind = "dragon";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ["迦拉克隆的愤怒"]);
					player.changeHujia(5);
					await player.SSfellow(['狂怒风暴', 2]);
				},
			},
			// 牧师迦拉克隆
			"hs_GalakrondtheUnspeakableApocalypse": {
				randomRT(p) {
					var fls = p.sctp("notmine").filter(t => t.canhsdmg());
					if (fls.length == 0) return false;
					return fls.randomGets(2);
				},
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_GalakrondtheUnspeakable");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					player.rkind = "dragon";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ["迦拉克隆的智识"]);
					player.changeHujia(5);
					event.target.HSF('cuihui');
				},
			},
			// 盗贼迦拉克隆
			"hs_GalakrondtheNightmareApocalypse": {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_GalakrondtheNightmare");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					player.rkind = "dragon";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ["迦拉克隆的诡计"]);
					player.changeHujia(5);
				},
			},
			// 战士迦拉克隆
			"hs_GalakrondtheUnbreakableApocalypse": {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_GalakrondtheUnbreakable");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					player.rkind = "dragon";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ["迦拉克隆的巨力"]);
					player.changeHujia(5);
				},
			},
			/** 第一阶段*/
			// 术士迦拉克隆
			"hs_GalakrondtheWretched": {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_GalakrondtheWretched");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					player.rkind = "dragon";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ["迦拉克隆的恶意"]);
					player.changeHujia(5);
					await player.SSfellow(['range:恶魔']);
				},
			},
			// 萨满祭司迦拉克隆
			"hs_GalakrondtheTempest": {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_GalakrondtheTempest");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					player.rkind = "dragon";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ["迦拉克隆的愤怒"]);
					player.changeHujia(5);
					await player.SSfellow(['狂怒风暴', 2]);
				},
			},
			// 牧师迦拉克隆
			"hs_GalakrondtheUnspeakable": {
				randomRT(player) {
					return player.HSF("ranxmfil");
				},
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_GalakrondtheUnbreakable");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					player.rkind = "dragon";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ["迦拉克隆的智识"]);
					player.changeHujia(5);
					await event.target.HSF('cuihui');;
				},
			},
			// 盗贼迦拉克隆
			"hs_GalakrondtheNightmare": {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_GalakrondtheNightmare");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					player.rkind = "dragon";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ["迦拉克隆的诡计"]);
					player.changeHujia(5);
				},
			},
			// 战士迦拉克隆
			"hs_GalakrondtheUnbreakable": {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_GalakrondtheUnbreakable");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					player.rkind = "dragon";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ["迦拉克隆的巨力"]);
					player.changeHujia(5);
				},
			},
		},
	},
	location: {
		info: {},
		skill: {},
	},
	cdan: {},
};