import { lib, game, ui, get, ai, _status } from "../../../../../../noname.js";


export const LOOT = {
	name: "狗头人与地下世界",
	en: "LOOT",
	minor: {
		info: {
			"Voidlord": ["虚空领主", "epic", "嘲讽，亡语：召唤三个1/3并具有嘲讽的恶魔", ["HS_effect", "9", "hs_warlock", "demon", "3", "9"],
				["deathRattle:['虚空行者',3]"]
			],
			"Violet Wurm": ["紫色岩虫", "rare", "亡语：召唤7条肉虫。", ["HS_effect", "8", "hs_neutral", "wildbeast", "7", "7"],
				["deathRattle:['触手', 7]"]
			],
			"King Togwaggle": ["托瓦格尔国王", "legend", "战吼：与你的对手交换牌库，你的对手获得一张“国王的赎金”法术牌，可以将牌库交换回来。", ["HS_effect", "8", "hs_neutral", "none", "5", "5"],
				["legend"]
			],
			"Sleepy Dragon": ["贪睡巨龙", "ordinary", "嘲讽。", ["HS_effect", "9", "hs_neutral", "dragon", "4", "12"]],
			"Wax Elemental": ["蜡油元素", "ordinary", "嘲讽，圣盾", ["HS_effect", "1", "hs_neutral", "elemental", "0", "2"]],
			"Stoneskin Basilisk": ["石皮蜥蜴", "ordinary", "圣盾，剧毒", ["HS_effect", "3", "hs_neutral", "wildbeast", "1", "1"]],
			"Benevolent Djinn": ["和蔼的灯神", "rare", "在你的回合结束时，为你的英雄恢复3点生命值。", ["HS_effect", "3", "hs_paladin", "none", "2", "4"]],
			"Sneaky Devil": ["鬼祟恶魔", "ordinary", "潜行，你的其他随从获得+1攻击力", ["HS_effect", "4", "hs_neutral", "demon", "2", "2"]],
			"Dragonhatcher": ["驯龙师", "epic", "在你的回合结束时，招募一个龙", ["HS_effect", "9", "hs_neutral", "none", "2", "4"]],
			"Vulgar Homunculus": ["粗俗的矮劣魔", "ordinary", "嘲讽，战吼：对你的英雄造成2点伤害", ["HS_effect", "2", "hs_warlock", "demon", "2", "4"]],
		},
		skill: {
			// 鬼祟小鬼
			"hs_SneakyDevil": {
				inherit: "hs_Leokk",
			},
			"hs_KingTogwaggle": {
				async battleRoal(event, trigger, player) {
					const nng = player.cardPile.getCards("h");
					const mmg = player.getOppo().cardPile.getCards("h");
					player.heroskill.pos.directgain(nng);
					player.heroskill.pos.directgain(mmg);
					player.cardPile.directgain(mmg);
					player.getOppo().cardPile.directgain(nng);
					player.getOppo().hs_gain("国王的赎金");
				},
			},
			"hs_Dragonhatcher": {
				ending: {
					self: true,
					async effect(event, trigger, player) {
						player.hs_join2(c => get.rkind(c) == "dragon");
					},
				},
			},
		},
	},
	spell: {
		info: {
			hs_KingsRansom: ["国王的赎金", "essential", "与你的对手交换牌库。", 5, "hs_neutral", 'none', ["token"]],
			hs_Cataclysm: ["大灾变", "rare", "消灭所有随从，弃掉你的手牌", 4, "hs_warlock", 'none'],
			hs_BranchingPaths: ["分岔路口", "epic", "选择两次 抽一张牌,使你的所有随从获得加一攻击力,或获得6点护甲值", 4, "hs_druid", 'none'],
			hs_ExploretheDarkness: ["探索黑暗", "essential", ["咆哮:1", "使你的所有随从获得+1攻击力"], 0, "hs_druid", 'none', ["token"]],
			hs_LoottheChest: ["打开宝箱", "essential", "获得6点护甲值", 0, "hs_druid", 'none', ["token", "atkhj:[0,6]"]],
			hs_EattheMushroom: ["吃下蘑菇", "essential", ["draw:1", "抽一张牌"], 0, "hs_druid", 'none', ["token"]],
		},
		skill: {
			hs_KingsRansom: {
				async content(event, trigger, player) {
					const nng = player.cardPile.getCards("h");
					const mmg = player.getOppo().cardPile.getCards("h");
					player.heroskill.pos.directgain(nng);
					player.heroskill.pos.directgain(mmg);
					player.cardPile.directgain(mmg);
					player.getOppo().cardPile.directgain(nng);
				},
			},
			hs_Cataclysm: {
				async content(event, trigger, player) {
					get.HSF("lavaeffect", ["cuihui", "minors_", "lava", "fellow"]);
					player.hs_discard("all");
				},
			},
			hs_BranchingPaths: {
				async content(event, trigger, player) {
					player.hs_jueze(["hs_EattheMushroom", "hs_LoottheChest", "hs_ExploretheDarkness"]);
					player.hs_jueze(["hs_EattheMushroom", "hs_LoottheChest", "hs_ExploretheDarkness"]);
				},
			},
		},
	},
	trap: {
		info: {},
		skill: {},
	},
	weapon: {
		info: {
			hs_TwigoftheWorldTree: ["世界之树的嫩枝", "lengend", "亡语：获得十个法力水晶", 4, "hs_druid", 1, 5, ["legend"]],
			hs_SkulloftheManari: ["堕落者之颅", "lengend", "在你的回合开始时，从你的手牌中召唤一个恶魔", 5, "hs_warlock", 0, 3, ["legend"]],
			hs_Aluneth: ["艾露尼斯", "lengend", "在你的回合结束时，抽三张牌。", 6, "hs_mage", 0, 3, ["legend"]],
		},
		skill: {
			hs_Aluneth: {
				weaponeffect: {
					ending: {
						self: true,
						async effect(event, trigger, player) {
							await player.hs_drawDeck(3);
						},
					},
				},
			},
			hs_SkulloftheManari: {
				weaponeffect: {
					beginning: {
						self: true,
						async effect(event, trigger, player) {
							player.hs_join3(c => get.rkind(c) == "demon");
						},
					},
				},
			},
			hs_TwigoftheWorldTree: {
				weaponeffect: {
					deathRattle: {
						async effect(event, trigger, player) {
							player.HSF("gainmana", [10]);
						},
					},
				},
			},

		},
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