import { lib, game, ui, get, ai, _status } from "../../../../../../noname.js";

export const UNG = {
	name: "勇闯安戈洛",
	en: "UNG",
	minor: {
		info: {
			"Tyrantus": ["泰拉图斯", "legend", "嘲讽。无法成为法术或英雄技能的目标", ["HS_effect", "9", "hs_druid", "wildbeast", "14", "14"],
				["legend"]
			],
			"Plant": ["植物", "essential", "", ["HS_normal", "1", "hs_neutral", "none", "1", "1"],
				["token"]
			],
			"Primalfin": ["蛮鱼战士", "essential", "", ["HS_normal", "1", "hs_neutral", "murloc", "1", "1"],
				["token"]
			],
			"Primalfin Totem": ["蛮鱼图腾", "essential", "在你的回合结束时，召唤一个1/1的鱼人", ["HS_effect", "2", "hs_shaman", "totem", "0", "3"],
				["ending:['蛮鱼战士']"]
			],
			"Primordial Drake": ["始生幼龙", "ordinary", "嘲讽，战吼：对所有其他角色造成2点伤害", ["HS_effect", "8", "hs_neutral", "dragon", "4", "8"]],
			"Biteweed": ["食人草", "epic", "连击：在本回合中，你每使用一张其他牌，便获得+1/+1。", ["HS_effect", "2", "hs_rogue", "none", "1", "2"],
				["lianji:let num = player.hs_state.useCard;event.fellow.addvaluebuff([num, num]);"]
			],
			"Jeweled Macaw": ["宝石鹦鹉", "essential", "战吼：随机将一张野兽牌置入你的手牌。", ["HS_effect", "1", "hs_hunter", "wildbeast", "1", "1"],
				["battleRoal:rangain>野兽"]
			],
			"Ultrasaur": ["摩天龙", "ordinary", "", ["HS_normal", "10", "hs_neutral", "wildbeast", "7", "14"]],
		},
		skill: {},
	},
	spell: {
		info: {
			/** ---关键词，进化选项---*/
			hs_VolcanicMight: ["火山之力", "essential", "+1+1", 0, "hs_neutral", "none", ["token"]],
			hs_PoisonSpit: ["毒液喷吐", "essential", "剧毒", 0, "hs_neutral", "none", ["token"]],
			hs_LightningSpeed: ["闪电之速", "essential", "风怒", 0, "hs_neutral", "none", ["token"]],
			hs_CracklingShield: ["爆裂护盾", "essential", "圣盾", 0, "hs_neutral", "none", ["token"]],
			hs_Massive: ["巨型体态", "essential", "嘲讽", 0, "hs_neutral", "none", ["token"]],
			hs_LiquidMembrane: ["液态外膜", "essential", "无法成为法术或英雄技能的目标", 0, "hs_neutral", "none", ["token"]],
			hs_RockyCarapace: ["岩质甲壳", "essential", "+3生命值", 0, "hs_neutral", "none", ["token"]],
			hs_FlamingClaws: ["烈焰利爪", "essential", "+3攻击力", 0, "hs_neutral", "none", ["token"]],
			hs_ShroudingMist: ["氤氲迷雾", "essential", "获得潜行直到你的下个回合", 0, "hs_neutral", "none", ["token"]],
			hs_LivingSpores: ["活性孢子", "essential", "亡语：召唤两个1/1的植物", 0, "hs_neutral", "none", ["token"]],
		},
		skill: {
			// 进化选项
			// 攻击力+3
			hs_FlamingClaws: {
				async content(event, trigger, player) {
					event.fellow.addvaluebuff(3);
				},
			},
			// 生命+3
			hs_RockyCarapace: {
				async content(event, trigger, player) {
					event.fellow.addvaluebuff([0, 3]);
				},
			},
			// 魔免
			hs_LiquidMembrane: {
				async content(event, trigger, player) {
					event.fellow.addgjzbuff("momian");
				},
			},
			// 圣盾
			hs_CracklingShield: {
				async content(event, trigger, player) {
					event.fellow.addgjzbuff("shendun");
				},
			},
			// 剧毒
			hs_PoisonSpit: {
				async content(event, trigger, player) {
					event.fellow.addgjzbuff("jvdu");
				},
			},
			// 风怒
			hs_LightningSpeed: {
				async content(event, trigger, player) {
					event.fellow.addgjzbuff("fengnu");
				},
			},
			// 嘲讽
			hs_Massive: {
				async content(event, trigger, player) {
					event.fellow.addgjzbuff("chaofeng");
				},
			},
			// 潜行
			hs_ShroudingMist: {
				async content(event, trigger, player) {
					event.fellow.addgjzbuff("qianxing", 1.1).countphase = player.getOppo();
				},
			},
			// 各+1
			hs_VolcanicMight: {
				async content(event, trigger, player) {
					event.fellow.addvaluebuff([1, 1]);
				},
			},
			// 亡语：召唤两个植物
			hs_LivingSpores: {
				async content(event, trigger, player) {
					event.fellow.addtriggerbuff({
						info: {
							async deathRattle(event, trigger, player) {
								event.fellow.SSfellow("植物", 2);
							},
						},
					});
				},
			},

		},
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