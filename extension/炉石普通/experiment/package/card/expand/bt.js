import { lib, game, ui, get, ai, _status } from "../../../../../../noname.js";

// @两年前极度偷懒的作品

export const BT = {
	name: "外域的灰烬",
	en: "BT",
	minor: {
		info: {
			"Ysiel Windsinger": ["伊谢尔·风歌", "legend", "你的法术牌的法力值消耗为(1)点", ["HS_effect", "9", "hs_druid", "none", "5", "5"],
				["legend"]
			],
		},
		skill: {
			"hs_YsielWindsinger": {
				numgh: {
					name: "hs_cost",
					value: 1,
					subtype: "final",
					ghfilter(card, fellow, target) {
						return target == fellow.getLeader() && get.type(card) == "HS_spell";
					},
				},
			},

		},
	},
	spell: {
		info: {

		},
		skill: {

		},
	},
	trap: {
		info: {},
		skill: {},
	},
	weapon: {
		info: {

		},
		skill: {

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
	cdan: {}
}