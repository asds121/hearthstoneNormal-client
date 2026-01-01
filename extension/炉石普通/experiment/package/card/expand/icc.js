import { lib, game, ui, get, ai, _status } from "../../../../../../noname.js";


export const ICC = {
	name: "冰封王座的骑士",
	en: "ICC",
	minor: {
		info: {
			"Fatespinner": ["命运织网蛛", "epic", "秘密亡语： 抉择：对所有随从造成3点伤害；或者使所有随从获得+2/+2。", ["HS_effect", "5", "hs_druid", "none", "5", "3"]],
			"Strongshell Scavenger": ["硬壳清道夫", "rare", "战吼：使你具有嘲讽的随从获得+2/+2。", ["HS_effect", "4", "hs_druid", "none", "2", "3"]],
			"Druid of the Swarm": ["虫群德鲁伊", "rare", "抉择：将该随从变形成为1/2并具有剧毒；或者将该随从变形成为1/5并具有嘲讽。", ["HS_effect", "2", "hs_druid", "none", "1", "2"]],
			"Crypt Lord": ["地穴领主", "ordinary", "嘲讽。在你召唤一个随从后，获得+1生命值。", ["HS_effect", "3", "hs_druid", "none", "1", "6"]],
			"Hadronox": ["哈多诺克斯", "legend", "亡语：召唤所有你在本局对局中死亡的，并具有嘲讽的随从", ["HS_effect", "9", "hs_druid", "wildbeast", "3", "7"],
				["legend"]
			],
			"Ghoul Infestor": ["食尸鬼感染者", "essential", "", ["HS_normal", "5", "hs_druid", "undead", "5", "5"],
				["token"]
			],
			"Inquisitor Whitemane": ["检察官怀特迈恩", "legend", "", ["HS_normal", "2", "hs_paladin", "undead", "2", "2"],
				["token", "legend"]
			],
			"Deathlord Nazgrim": ["死亡领主纳兹戈林", "legend", "", ["HS_normal", "2", "hs_paladin", "undead", "2", "2"],
				["token", "legend"]
			],
			"Darion Mograine": ["达里安莫格莱尼", "legend", "", ["HS_normal", "2", "hs_paladin", "undead", "2", "2"],
				["token", "legend"]
			],
			"Thoras Trollbane": ["索拉斯托尔贝恩", "legend", "", ["HS_normal", "2", "hs_paladin", "undead", "2", "2"],
				["token", "legend"]
			],
			"Rotface": ["腐面", "legend", "每当该随从受到伤害并没有死亡，随机召唤一个传说随从", ["HS_effect", "8", "hs_warrior", "undead", "4", "6"],
				["legend"]
			],
			"Snowflipper Penguin": ["雪鳍企鹅", "essential", "", ["HS_normal", "0", "hs_neutral", "wildbeast", "1", "1"]],
			"Righteous Protector": ["正义保护者", "essential", "嘲讽，圣盾", ["HS_effect", "1", "hs_paladin", "none", "1", "3"]],
			"Deadscale Knight": ["死鳞骑士", "essential", "吸血", ["HS_effect", "1", "hs_neutral", "murloc", "1", "1"]],
			"Bone Drake": ["白骨幼龙", "essential", "亡语：随机将一张龙牌置入你的手牌。", ["HS_effect", "6", "hs_neutral", "dragon", "6", "5"],
				["deathRattle:rangain>龙"]
			],
			"Scarab Beetle": ["硬壳圣甲虫", "essential", "嘲讽", ["HS_effect", "2", "hs_druid", "wildbeast", "1", "5"],
				["token"]
			],
			"Frost Widow": ["冰霜寡妇蛛", "essential", "剧毒", ["HS_effect", "1", "hs_druid", "wildbeast", "1", "2"],
				["token"]
			],
		},
		skill: {
			"hs_Rotface": {
				hsdmg: {
					fl: true,
					filter: "存活",
					recheck: "filter",
					async effect(event, trigger, player) {
						player.SSfellow(['range:传说']);
					},
				},
			},
			"hs_Hadronox": {
				deathRattle: {
					async effect(event, trigger, player) {
						await player.hs_revive(function(p, a, b) {
							return a[p.playerid].slice(0).filter((ca, info) => get.rGJZ(ca, "chaofeng")).randomSort();
						});
					},
				},
			},
		},
	},
	spell: {
		info: {
			hs_Gnash: ["铁齿铜牙", "ordinary", "使你的英雄获得3点护甲值。并在本回合中获得+3攻击力。", 3, "hs_druid", 'none', ["atkhj:[3,3]"]],
			hs_ScarabShell: ["甲虫硬壳", "essential", "+3护甲值。", 7, "hs_druid", 'none', ["atkhj:[0,3]", "token"]],
			hs_SpiderFangs: ["蜘蛛毒牙", "essential", "+3攻击力。", 7, "hs_druid", 'none', ["atkhj:[3,0]", "token"]],
			hs_UltimateInfestation: ["终极感染", "epic", ["damage:5", "造成5点伤害，抽5张牌，获得5点护甲值，召唤一只5/5的食尸鬼"], 10, "hs_druid", 'none', ["draw:5", "atkhj:[0,5]", "summon:['hs_GhoulInfestor_monster']"]],
			hs_Webweave: ["蛛网", "ordinary", ["summon:['hs_FrostWidow_monster',2]", "召唤两个1/2并具有剧毒的蜘蛛"], 5, "hs_druid", 'none', []],
			hs_SpreadingPlague: ["传播瘟疫", "rare", ["summon:['hs_ScarabBeetle_monster',2]", "召唤一只1/5并具有嘲讽的甲虫，如果你的对手的随从更多，则再次释放该法术"], 6, "hs_druid", 'none', []],
			// 抉择选项
			hs_SpiderPlague: ["蜘蛛瘟疫", "essential", ["summon:['hs_FrostWidow_monster',2]", "召唤两个1/2并具有剧毒的蜘蛛"], 7, "hs_druid", 'none', ["token"]],
			hs_ScarabPlague: ["甲虫瘟疫", "essential", ["summon:['hs_ScarabBeetle_monster',2]", "召唤两个1/5并具有嘲讽的甲虫"], 7, "hs_druid", 'none', ["token"]]
		},
		skill: {},
	},
	trap: {
		info: {},
		skill: {},
	},
	weapon: {
		info: {
			hs_Frostmourne: ["霜之哀伤", "legend", "亡语：召唤被该武器消灭的所有随从", 7, "hs_deathknight", 5, 3, ["legend"]],
			hs_GraveVengeance: ["冰墓裁决", "legend", "吸血", 8, "hs_paladin", 5, 3, ["legend", "token"]],
			hs_Shadowmourne: ["影之哀伤", "lengend", "同时对其攻击目标相邻的随从造成伤害", 8, "hs_warrior", 4, 3, ["legend", "token"]],
		},
		skill: {
			hs_GraveVengeance: {
				weaponeffect: {
					attackBegin: {
						self: true,
						async effect(event, trigger, player) {
							player.hs_dmgrcv("recover", 5);
						},
					},
				},
			},
		},
	},
	hero: {
		info: {
			hs_FrostLichJaina: ["冰霜女巫吉安娜", "legend", "战吼：召唤一个3/6的水元素，在本局对战中，你的所有元素具有吸血", 9, "hs_mage", ["legend"]],
			hs_MalfurionthePestilent: ["污染者玛法里奥", "legend", "战吼：抉择：召唤两只具有剧毒的蜘蛛;或者召唤两只具有嘲讽的甲虫", 7, "hs_druid", ["legend"]],
			hs_BloodreaverGuldan: ["鲜血掠夺者古尔丹", "legend", "战吼：召唤所有在本局对战中死亡的友方恶魔", 10, "hs_warlock", ["legend"]],
			hs_ShadowreaperAnduin: ["暗影收割者安度因", "legend", "战吼：消灭所有攻击力大于五的随从", 8, "hs_priest", ["legend"]],
			hs_ThrallDeathseer: ["死亡先知萨尔", "legend", "战吼：将你的随从变形成法力值消耗增加2点的随从", 5, "hs_shaman", ["legend"]],
			hs_TScourgelordGarrosh: ["天灾领主加尔鲁什", "legend", "战吼：装备一把影之哀伤", 8, "hs_warrior", ["legend"]],
			hs_UtheroftheEbonBlade: ["黑锋骑士乌瑟尔", "legend", "战吼：装备一把冰墓裁决", 9, "hs_paladin", ["legend"]],
			hs_ValeeratheHollow: ["虚空之影瓦莉拉", "legend", "战吼：获得潜行直到你的下个回合", 9, "hs_rogue", ["legend"]],
			hs_DeathstalkerRexxar: ["死亡猎手雷克萨", "legend", "战吼：对所有敌方随从造成两点伤害", 6, "hs_hunter", ["legend"]],
		},
		skill: {
			// 死亡先知萨尔
			"hs_ThrallDeathseer": {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_ThrallDeathseer");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					player.classList.remove("minskin");
					player.rkind = "none";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ["灵体转化"]);
					player.changeHujia(5);
					player.sctp('mine').forEach(item => {
						const cost = item.linkCard[0].cost() + 2;
						const name = get.hskachi("HS_minor", (c, info) => info.cost == cost).randomGet() || event.target.linkCard[0].name;
						item.HSF("convert", [name]);
					});
				},
			},
			// 雷克萨 (合成僵尸兽：发现两次合成一张）
			"hs_DeathstalkerRexxar": {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_DeathstalkerRexxar");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					player.classList.remove("minskin");
					player.rkind = "none";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ['生命虹吸！']);
					player.changeHujia(5);
					await player.hs_dmgrcvaoe(2, player, event.card, player.sctp("notmine"));
				},
			},
			// 瓦莉拉 @TODO
			"hs_ValeeratheHollow": {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_ValeeratheHollow");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					player.classList.remove("minskin");
					player.rkind = "none";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ['生命虹吸！']);
					player.changeHujia(5);
					// 所以该怎么办
				},
			},
			// 加尔鲁什
			"hs_TScourgelordGarrosh": {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_ScourgelordGarrosh");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					player.rkind = "none";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ["剑刃风暴"]);
					player.changeHujia(5);
					await player.hs_weapon("影之哀伤");
				},
			},
			// 冰霜女巫吉安娜 @TODO
			"hs_FrostLichJaina": {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_FrostLichJaina");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					player.rkind = "none";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ["冰冷触摸"]);
					player.changeHujia(5);
					await player.SSfellow("水元素");
					// 救命啊，真不会了
				},
			},
			// 乌瑟尔
			"hs_UtheroftheEbonBlade": {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_UtheroftheEbonBlade");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					player.rkind = "none";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ["天启四骑士"]);
					player.changeHujia(5);
					await player.hs_weapon("冰墓裁决");
				},
			},
			// 暗影安度因 @TODO
			"hs_ShadowreaperAnduin": {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_ShadowreaperAnduin");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					player.rkind = "none";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ["虚空形态"]);
					player.changeHujia(5);
					const lucky = player.sctp('mns').filter(fl => fl.ATK >= 5);
					get.HSF('lavaeffect', ['cuihui', lucky, 'lava']);
				},
			},
			// 古尔丹
			"hs_BloodreaverGuldan": {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_BloodreaverGuldan");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					player.rkind = "none";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ['生命虹吸！']);
					player.changeHujia(5);
					await player.hs_revive(function(p, a, b) {
						const list = a[p.playerid].slice(0).filter(c => get.rkind(c) == "demon");
						const list2 = [];
						list.forEach(i => list2.push(list.randomGet()));
						return list2;
					});
				},
			},
			// 玛法里奥
			"hs_MalfurionthePestilent": {
				async content(event, trigger, player) {
					const hj = player.hujia;
					player.init("hero_MalfurionthePestilent");
					player.hujia = hj;
					player.clearSkills(true);
					player.rkind = "none";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ['瘟疫领主']);
					player.changeHujia(5);
					player.hs_jueze(["hs_SpiderPlague", "hs_ScarabPlague"]);
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