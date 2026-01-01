import { lib, game, ui, get, ai, _status } from "../../../../../../noname.js";

export const GIL = {
	name: "女巫森林",
	en: "GIL",
	minor: {
		info: {
			"Azalina Soulthief": ["窃魂者阿扎莉娜", "legend", "战吼：将你的手牌替换成对手手牌的复制。", ["HS_effect", "7", "", "none", "3", "3"],
				["legend"]
			],
			"Unpowered Steambot": ["破铜烂铁机器人", "ordinary", "嘲讽", ["HS_effect", "4", "", "machine", "0", "9"]],
			"Swamp Dragon Egg": ["沼泽龙蛋", "ordinary", "亡语：随机将一张龙牌置入你的手牌。", ["HS_effect", "1", "", "none", "0", "3"],
				["deathRattle:rangain>龙"]
			],
			"Blood Witch": ["鲜血女巫", "ordinary", "在你的回合开始时，对你的英雄造成1点伤害。", ["HS_effect", "4", "hs_warlock", "none", "3", "6"]],
			"Rotten Applebaum": ["腐烂的苹果树", "ordinary", "嘲讽，亡语：为你的英雄恢复4点生命值。", ["HS_effect", "5", "", "undead", "4", "5"]],
			"Darkmire Moonkin": ["黑沼枭兽", "ordinary", "法术伤害+2", ["HS_effect", "7", "", "none", "2", "8"]],
			"Deranged Doctor": ["癫狂的医生", "ordinary", "亡语：为你的英雄恢复8点生命值。", ["HS_effect", "8", "", "none", "8", "8"]],
		},
		skill: {
			"hs_AzalinaSoulthief": {
				async battleRoal(event, trigger, player) {
					const bb = player.getOppo().countCards("h");
					const hhs = player.countCards("h");
					if (hhs > 0) {
						player.heroskill.pos.directgain(player.getCards("h"));
					}
					if (bb > 0) {
						player.hs_gain(player.getOppo().getCards("h").map(i => i.name));
					}
				},
			},
		},
	},
	spell: {
		info: {
			hs_FiendishCircle: ["恶魔法阵", "ordinary", ["summon:['hs_Imp_monster',4]", "召唤四个1/1的小鬼"], 3, "hs_warlock", "none"],
		},
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