import { lib, game, ui, get, ai, _status } from "../../../../../../noname.js";

export const DAL = {
	name: "暗影崛起",
	en: "DAL",
	minor: {
		info: {
			"Arch Villain Rafaam": ["至尊盗王拉法姆", "legend", "嘲讽，战吼：将你的手牌和牌库里的卡牌替换成传说随从。", ["HS_effect", "7", "hs_warlock", "none", "7", "8"],
				["legend"]
			],
			"Mana Reservoir": ["法力之池", "essential", "法术伤害+1", ["HS_effect", "2", "", "none", "0", "6"]],
			"EVIL Cable Rat": ["怪盗布缆鼠", "essential", "战吼：将一张跟班牌置入你的手牌", ["HS_effect", "2", "", "wildbeast", "1", "1"],
				["battleRoal:rangain>跟班"]
			],
			"EVIL Conscripter": ["怪盗征募员", "essential", "亡语：将一张跟班牌置入你的手牌", ["HS_effect", "2", "hs_priest", "none", "2", "2"],
				["deathRattle:rangain>跟班"]
			],
			"Hench-Clan Shadequill": ["荆棘帮箭猪", "essential", "亡语：为敌方英雄恢复5点生命值。", ["HS_effect", "4", "hs_priest", "quilboar", "4", "7"]],
			"Ethereal Lackey": ["虚灵跟班", "essential", "战吼：发现一张法术牌。", ["HS_effect", "1", "", "none", "1", "1"],
				["token"]
			],
			"Goblin Lackey": ["地精跟班", "essential", "战吼：使一个友方随从获得+1攻击力和突袭。", ["HS_effect", "1", "", "none", "1", "1"],
				["token", "battleRoal:mebuff>A1,tuxi"]
			],
			"Draconic Lackey": ["龙族跟班", "essential", "战吼：发现一张龙牌。", ["HS_effect", "1", "", "none", "1", "1"],
				["token"]
			],
			"Titanic Lackey": ["泰坦造物跟班", "essential", "战吼：使一个友方随从获得+2生命值和嘲讽。", ["HS_effect", "1", "", "none", "1", "1"],
				["token", "battleRoal:mebuff>H2,chaofeng"]
			],
			"Witchy Lackey": ["女巫跟班", "essential", "战吼：将一个随从随机变形成一个法力值消耗增加（1）点的随从", ["HS_effect", "1", "", "none", "1", "1"],
				["token"]
			],
			"Kobold Lackey": ["狗头人跟班", "essential", "战吼：造成2点伤害", ["HS_effect", "1", "", "none", "1", "1"],
				["token"]
			],
			"Faceless Lackey": ["无面跟班", "essential", "战吼：随机召唤一个法力值消耗为（2）点的随从", ["HS_effect", "1", "", "none", "1", "1"],
				["token"]
			],
			"DAL_760_ZH": ["推土壮汉", "ordinary", "突袭", ["HS_effect", "9", "", "none", "9", "9"]],
			"DAL_553_ZH": ["恶狼大法师", "essential", "在你的回合结束时，随机召唤一个法力值消耗为（6）的随从", ["HS_effect", "10", "", "none", "6", "6"]],
		},
		skill: {
			"hs_ArchVillainRafaam": {
				inherit: "hs_GoldenMonkey",
			},
			"hs_DAL_553_ZH": { //恶狼大法师
				ending: {
					self: true,
					async effect(event, trigger, player) {
						player.SSfellow('range:6');
					},
				},
			},
			"hs_WitchyLackey": {
				inherit: "hs_MasterofEvolution",
			},
			"hs_FacelessLackey": { //无面跟班
				async battleRoal(event, trigger, player) {
					player.SSfellow('range:2');
				},
			},
			"hs_DraconicLackey": {
				async battleRoal(event, trigger, player) {
					player.hs_discover((ca, info) => info.rkind == "dragon", event.fellow.linkCard[0]);
				},
			},
			"hs_EtherealLackey": { //虚灵跟班
				inherit: "hs_EtherealConjurer",
			},
		},
	},
	spell: {
		info: {},
		skill: {},
	},
	trap: {
		info: {},
		skill: {},
	},
	weapon: {
		info: {},
		skill: {},
	},
	hero: {
		info: {},
		skill: {},
	},
	location: {
		info: {},
		skill: {},
	},
	cdan: {},
};