import { lib, game, ui, get, ai, _status } from "../../../../../../noname.js";

export const CFM = {
	name: "龙争虎斗加基森",
	en: "CFM",
	minor: {
		info: {
			"Jade Swarmer": ["青玉游荡者", "ordinary", "潜行，亡语：召唤一个青玉魔像。", ["HS_effect", "2", "hs_rogue", "none", "1", "1"]],
			"Raza the Chained": ["缚链者拉兹", "legend", "战吼：如果你的牌库里没有相同的牌，则在本局对战中，你的英雄技能的法力值消耗为（0）点。", ["HS_effect", "5", "hs_priest", "none", "5", "5"], ["legend"]],
			"Mana Geode": ["法力晶簇", "epic", "每当该随从获得治疗时，便召唤一颗2/2的水晶。", ["HS_effect", "2", "hs_priest", "elemental", "2", "3"]],
			"Drakonid Operative": ["龙人侦测者", "rare", "战吼： 如果你的手牌中有龙牌，便发现你对手牌库中一张牌的复制。", ["HS_effect", "5", "hs_priest", "dragon", "5", "6"]],
			"Kabal Talonpriest": ["暗金教鸦人祭司", "ordinary", "战吼：使一个友方随从获得+3生命值。", ["HS_effect", "3", "hs_priest", "none", "3", "4"]],
			"Kabal Songstealer": ["暗金教窃歌者", "ordinary", "战吼：沉默一个随从。", ["HS_effect", "5", "hs_priest", "none", "5", "5"]],
			"Grimscale Chum": ["暗鳞劫持者", "ordinary", "战吼：随机使你手牌中的一张鱼人牌获得+1/+1。", ["HS_effect", "1", "hs_paladin", "murloc", "2", "1"]],
			"Meanstreet Marshal": ["海象人执法官", "epic", "亡语：如果该随从的攻击力大于或等于2，抽一张牌。", ["HS_effect", "1", "hs_paladin", "none", "1", "2"]],
			"Grimestreet Outfitter": ["污手街供货商", "ordinary", "战吼：使你手牌中的所有随从牌获得+1/+1。", ["HS_effect", "2", "hs_paladin", "none", "1", "1"]],
			"Grimestreet Enforcer": ["污手街惩罚者", "rare", "在你的回合结束时，使你手牌中的所有随从牌获得+1/+1。", ["HS_effect", "5", "hs_paladin", "none", "4", "4"]],
			"Grimestreet Protector": ["污手街守护者", "epic", "嘲讽，战吼：使相邻的随从获得圣盾。", ["HS_effect", "7", "hs_paladin", "none", "6", "6"]],
			"Wickerflame Burnbristle": ["燃鬃·自走炮", "legend", "圣盾，嘲讽，吸血", ["HS_effect", "3", "hs_paladin", "none", "3", "3"],
				["legend"]
			],
			"Manic Soulcaster": ["狂热铸魂者", "epic", "战吼：选择一个友方随从，将它的一张复制洗入你的牌库。", ["HS_effect", "3", "hs_mage", "none", "3", "4"]],
			"Kabal Crystal Runner": ["暗金教水晶侍女", "rare", "在本局对战中，你每使用一张奥秘牌 就会使法力值消耗减少（2）点。", ["HS_effect", "6", "hs_mage", "none", "5", "5"]],
			"Cryomancer": ["凛风巫师", "ordinary", "战吼：如果有敌人被冻结，便获得+2/+2。", ["HS_effect", "5", "hs_mage", "none", "5", "5"]],
			"Kabal Lackey": ["暗金教侍从", "ordinary", "战吼： 在本回合中，你使用的下一个奥秘的法力值消耗为（0）点。", ["HS_effect", "1", "hs_mage", "none", "2", "1"]],
			"Inkmaster Solia": ["墨水大师索菲斯", "legend", "战吼：在本回合中，如果你的牌库里没有相同的牌，则下一张法术牌释放的费用为零", ["HS_effect", "7", "hs_mage", "none", "5", "5"],
				["legend", "rareEff"]
			],
			"Kabal Trafficker": ["暗金教恶魔商贩", "essential", "在你的回合结束时，将一张恶魔牌置入你的手上", ["HS_effect", "6", "hs_warlock", "none", "6", "6"],
				["ending:rangain>恶魔"]
			],
			"Krul the Unshackled": ["唤魔者克鲁尔", "legend", "战吼：如果你的牌库里没有相同的牌，则召唤你手牌中的所有恶魔", ["HS_effect", "9", "hs_warlock", "demon", "9", "9"],
				["legend", "rareEff"]
			],
			"Alleycat": ["雄斑虎", "ordinary", "战吼：召唤一个1/1的雌斑虎。", ["HS_effect", "1", "hs_hunter", "wildbeast", "1", "1"]],
			"Dispatch Kodo": ["驮运科多兽", "rare", "战吼：造成等同于该随从攻击力的伤害。", ["HS_effect", "4", "hs_hunter", "wildbeast", "2", "4"]],
			"Rat Pack": ["瘟疫鼠群", "epic", "亡语：召唤若干个1/1的老鼠，数量等同于该随从的攻击力。", ["HS_effect", "3", "hs_hunter", "wildbeast", "2", "2"]],
			"Knuckles": ["金手指纳克斯", "legend", "在纳克斯攻击一名随从后，还会命中敌方英雄。", ["HS_effect", "5", "hs_hunter", "wildbeast", "3", "7"], ["legend"]],
			"Shaky Zipgunner": ["豺狼人土枪手", "ordinary", "亡语：随机使你手牌中的一张随从牌获得+2/+2。", ["HS_effect", "3", "hs_hunter", "none", "3", "3"]],
			"Trogg Beastrager": ["穴居人驯兽师", "rare", "战吼：随机使你手牌中的一张野兽牌获得+1/+1。", ["HS_effect", "2", "hs_hunter", "none", "3", "2"]],
			"Virmen Sensei": ["兔妖教头", "rare", "战吼：使一个友方野兽获得+2/+2。", ["HS_effect", "5", "hs_druid", "none", "4", "5"]],
			"Jade Behemoth": ["青玉巨兽", "ordinary", "嘲讽，战吼：召唤一个 的青玉魔像。", ["HS_effect", "6", "hs_druid", "none", "3", "6"]],
			"Celestial Dreamer": ["天神唤梦者", "rare", "战吼：如果你控制一个攻击力大于或等于5的随从，便获得+2/+2。", ["HS_effect", "3", "hs_druid", "none", "3", "3"]],
			"Kun the Forgotten King": ["遗忘之王库恩", "legend", "抉择：获得10点护甲值；或者复原你的法力水晶。", ["HS_effect", "10", "hs_druid", "none", "7", "7"],
				["legend"]
			],
			"Dirty Rat": ["卑劣的脏鼠", "rare", "嘲讽，战吼：你的对手将一个随机随从从其手牌置入战场。", ["HS_effect", "2", "hs_neutral", "none", "2", "6"]],
			"Grook Fu Master": ["功夫大师", "essential", "风怒", ["HS_effect", "5", "hs_neutral", "none", "3", "5"]],
			"Street Trickster": ["杂耍小鬼", "essential", "法术伤害+1", ["HS_effect", "3", "hs_neutral", "demon", "0", "7"]],
			"Backstreet Leper": ["后街男巫", "essential", "亡语：对敌方英雄造成2点伤害。", ["HS_effect", "3", "hs_neutral", "none", "3", "1"]],
			"Friendly Bartender": ["热心的酒保", "essential", "在你的回合结束时，为你的英雄恢复1点生命值。", ["HS_effect", "2", "hs_neutral", "none", "2", "3"]],
			"Red Mana Wyrm": ["猩红法力浮龙", "ordinary", "每当你施放一个法术，便获得+2攻击力。", ["HS_effect", "5", "hs_neutral", "none", "2", "6"]],
			"Abyssal Enforcer": ["狱渊惩击者", "epic", "战吼：对所有其他角色造成3点伤害", ["HS_effect", "7", "hs_warlock", "demon", "6", "6"]],
			"Shadow Rager": ["暗影暴怒者", "ordinary", "潜行", ["HS_effect", "3", "hs_rogue", "none", "5", "1"]],
		},
		skill: {
			"hs_GrimestreetProtector": {
				async battleRoal(event, trigger, player) {
					event.fellow.sctp("neighbor").forEach(i => i.addgjzbuff("shengdun"));
				},
			},
			"hs_DirtyRat": {
				async battleRoal(event, trigger, player) {
					player.getOppo().hs_join3();
				},
			},
			"hs_InkmasterSolia": {
				battleRoal: {
					filter: "宇宙",
					async effect(event, trigger, player) {
						player.addcostbuff(0, c => get.type(c) == "HS_spell").subtype = "final";
					},
				},
			},
			"hs_KrultheUnshackled": {
				battleRoal: {
					filter: "宇宙",
					async effect(event, trigger, player) {
						for (let i = 0; i < 12; i++) {
							player.hs_join3(c => get.rkind(c) == "demon");
						}
					},
				},
			},
		},
	},
	spell: {
		info: {
			hs_DragonfirePotion: ["龙息药水", "epic", "对所有非龙随从造成5点伤害", 6, "hs_priest", 'none', []],
			hs_GreaterHealingPotion: ["强化治疗药水", "rare", "为一个友方角色恢复12点生命值", 4, "hs_priest", 'none', []],
			hs_PotionofMadness: ["疯狂药水", "ordinary", "直到回合结束，获得一个攻击力小于或等于2的敌方随从的控制权。", 1, "hs_priest", 'none', []],
			hs_PintSizePotion: ["缩小药水", "rare", "在本回合中，使所有敌方随从获得-3攻击力。", 1, "hs_priest", 'none', []],
			hs_FreezingPotion: ["冻结药水", "ordinary", "冻结一个敌人", 0, "hs_mage", 'none', []],
			hs_SmugglersRun: ["风驰电掣", "ordinary", "使你手牌中的所有随从牌获得+1/+1。", 1, "hs_paladin", 'none', []],
			hs_SmallTimeRecruits: ["三教九流", "epic", "从你的牌库中抽三张法力值消耗为（1）的随从牌。", 3, "hs_paladin", 'none', []],
			hs_VolcanicPotion: ["火山药水", "rare", ["damage:2", "对所有随从造成2点伤害"], 3, "hs_mage", 'none', ["fire", "lava:mns"]],
			hs_GreaterArcaneMissiles: ["强能奥术飞弹", "epic", "随机对敌人发射三枚飞弹，每枚飞弹造成 3点伤害。", 7, "hs_mage", 'none', []],
			hs_FelfirePotion: ["邪火药水", "ordinary", ["damage:5", "对所有角色造成5点伤害"], 6, "hs_warlock", 'none', ["fire", "lava:all"]],
			hs_SmugglersCrate: ["走私货物", "ordinary", "随机使你手牌中的一张野兽牌获得+2/+2。", 1, "hs_hunter", 'none', []],
			hs_MarkoftheLotus: ["玉莲印记", "ordinary", "使你所有的随从获得+1/+1。", 1, "hs_druid", 'none', []],
			hs_JadeBlossom: ["青玉绽放", "ordinary", "召唤一个 的青玉魔像，获得一个空的法力水晶。", 3, "hs_druid", 'none', []],
			hs_PilferedPower: ["妙手空空", "epic", "每控制一个友方随从，便获得一个空的法力水晶。", 3, "hs_druid", 'none', []],
			hs_LunarVisions: ["新月视界", "epic", "抽两张牌，抽到的随从牌法力值消耗减少（2）点。", 5, "hs_druid", 'none', []],
			hs_JadeIdol: ["青玉护符", "rare", "抉择：召唤一个 的青玉魔像；或者将该牌的三张复制洗入你的牌库。", 1, "hs_druid", 'none', []]
		},
		skill: {},
	},
	trap: {
		info: {
			hs_GetawayKodo: ["战术撤离", "rare", "奥秘：当一个友方随从死亡时，将其移回你的手牌。", 1, "hs_paladin"],
			hs_HiddenCache: ["军备宝箱", "rare", "奥秘：在你的对手使用一张随从牌后，随机使你手牌中的一张随从牌获得+2/+2。", 2, "hs_hunter"],
			hs_PotionofPolymorph: ["变形药水", "rare", "奥秘：在你的对手使用一张随从牌后，将其变形成为1/1的绵羊。", 3, "hs_mage"],
		},
		skill: {},
	},
	weapon: {
		info: {
			hs_PiranhaLauncher: ["食人鱼喷枪", "epic", "在你的英雄攻击后，召唤一个1/1的食人鱼。", 5, "hs_hunter", 2, 4],
		},
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