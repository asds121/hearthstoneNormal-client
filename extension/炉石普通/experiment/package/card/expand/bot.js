import { lib, game, ui, get, ai, _status } from "../../../../../../noname.js";

// @TODO 老东西要翻新
export const BOT = {
	name: "砰砰计划",
	en: "BOT",
	minor: {
		info: {
			"Mecharoo": ["机械袋鼠", "essential", "亡语：召唤一个1/1的机械袋鼠宝宝。", ["HS_effect", "1", "", "machine", "1", "1"],
				["deathRattle:机械袋鼠宝宝"]
			],
			"Jo-E Bot": ["机械袋鼠宝宝", "essential", "", ["HS_normal", "1", "", "machine", "1", "1"],
				["token"]
			],
			"Faithful Lumi": ["可靠的灯泡", "essential", "战吼：使一个友方机械获得+1/+1。", ["HS_effect", "1", "", "machine", "1", "1"],
				["battleRoal:fltbuff>mine_,machine：11"]
			],
			"Spring Rocket": ["弹簧火箭犬", "essential", "战吼：造成2点伤害。", ["HS_effect", "3", "", "machine", "2", "1"]],
			"Goblin Bomb": ["地精炸弹", "essential", "亡语：对敌方英雄造成2点伤害。", ["HS_effect", "1", "", "machine", "0", "2"]],
			"Cosmic Anomaly": ["宇宙异象", "essential", "法术伤害+2", ["HS_effect", "4", "hs_mage", "none", "4", "3"]],
			"Boommaster Flark": ["爆破大师弗拉克", "essential", "战吼：召唤四个0/2的地精炸弹。", ["HS_effect", "7", "hs_hunter", "none", "5", "5"],
				["legend", "battleRoal:['地精炸弹',4]"]
			],
			"Bull Dozer": ["机械推土牛", "essential", "圣盾", ["HS_effect", "9", "", "machine", "9", "7"]],
		},
		skill: {},
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
		info: {
			hs_DrBoomMadGenius: ["“科学狂人”砰砰博士", "legend", "战吼：在本局对战的剩余时间内，你的所有机械获得 突袭。", 7, "hs_warrior", ["legend"]],
		},
		skill: {
			hs_DrBoomMadGenius: {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_DrBoomMadGenius");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					// player.classList.remove("minskin");
					player.rkind = "";
					player.updatehsfl();
					// await player.HSF('changeHeroskill', ['红色按钮']);
					player.changeHujia(7);
				},
			},
		},
	},
	location: {
		info: {},
		skill: {},
	},
	cdan: { //缩写
	},
};