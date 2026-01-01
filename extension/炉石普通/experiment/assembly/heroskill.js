import { lib, game, ui, get, ai, _status } from "../../../../noname.js";

// 基础英雄技能
const heroskill = {
	emzz: ["恶魔之爪", "本回合+1攻击力", "hs_demonhunter", 1, "player.hs_atkhj([1,0],1);"],
	sgcf: ["食尸鬼冲锋", "召唤一个1/1并具有冲锋的食尸鬼。它会在回合结束时死亡。", "hs_deathknight", 2, "player.SSfellow('脆弱的食尸鬼');"],
	diej: ["全副武装", "获得2点护甲", "hs_warrior", 2, "player.changeHujia(2);"],
	huoc: ["火焰冲击", "造成1点伤害", "hs_mage", 2, "target.hs_dmgrcv('damage',player,'fire').hs_heroskill=true;", ["F:all", "return get.dmgEffect(target, player, player,1) + 0.1;"], {
		order: 6,
		result: {
			player(player) {
				return game.hasPlayer(target => get.dmgEffect(target, player, player, 1) + 0.1 > 0) ? 1 : 0;
			},
		},
	}],
	shej: ["稳固射击", "对敌方英雄造成2点伤害", "hs_hunter", 2, "target.hs_dmgrcv('damage',2, player).hs_heroskill=true;", "R:function(player){return player.getOppo();}"],
	zhil: ["次级治疗术", "恢复2点生命值", "hs_priest", 2, "target.hs_dmgrcv('recover',2,player).hs_heroskill=true;", ["F:all", "return get.rcvEffect(target, player, player,1) + 0.1;"], {
		order: 1,
		result: {
			player(player) {
				return Math.max.apply(Math, player.sctp().map(i => get.rcvEffect(i, player, player) + 1));
			},
		},
	}],
	fenl: ["生命分流", "抽一张牌并受到2点伤害", "hs_warlock", 2, ["player.hs_dmgrcv('damage',2, player).hs_heroskill=true;", "player.hs_drawDeck().hs_heroskill=true;"], "", {
		order: 6,
		result: {
			player(player) {
				return (player.hp > 2 && player.cardPile.countCards("h") && player.countCards("h") < 10) ? 1 : 0;
			},
		},
	}],
	biax: ["变形", "本回合+1攻击力。+1护甲值。", "hs_druid", 2, "player.hs_atkhj([1,1],1);"],
	yuaj: ["援军", "召唤一个1/1的白银之手新兵。", "hs_paladin", 2, "player.SSfellow('白银之手新兵');"],
	ttzh: ["图腾召唤", "随机召唤一个图腾。", "hs_shaman", 2, "player.SSfellow('cdset:图腾,norepeat');", "f:return player.sctp('mine',fl=>get.HSA('collect')['图腾'].includes(get.translation(fl.name)),true).length<4;"],
	shad: ["匕首精通", "装备一把1/2的匕首", "hs_rogue", 2, "player.hs_weapon('邪恶短刀').hs_heroskill=true;", "", {
		order: 6,
		result: {
			player(player) {
				return player.data_weapon ? 0 : 1;
			},
		},
	}],
	qins: ["侵蚀", "召唤一只白斑蜘蛛", "hs_corruptor", 1, "player.SSfellow('白斑蜘蛛');"],
};

// 升级后的技能，如图哈特，奇数
const exheroskill = {
	emzz: ["恶魔之咬", "本回合+2攻击力", "hs_demonhunter", 1, "player.hs_atkhj([2,0],1);"],
	sgcf: ["食尸鬼狂暴", "召唤一个2/1并具有冲锋的食尸鬼，在回合结束后消灭它。", "hs_deathknight", 2, "player.SSfellow('疯狂的食尸鬼');"],
	diej: ["坚壁", "获得4点护甲", "hs_warrior", 2, "player.changeHujia(4);"],
	huoc: ["二级火焰冲击", "造成2点伤害", "hs_mage", 2, "target.hs_dmgrcv('damage',2,player,'fire').hs_heroskill=true;", ["F:all", "return get.dmgEffect(target, player, player,2) + 0.1;"], {
		order: 6,
		result: {
			player(player) {
				if (game.hasPlayer(function(target) {
						return get.dmgEffect(target, player, player, 2) + 0.1 > 0;
					})) return 1;
				return 0;
			},
		},
	}],
	shej: ["弩炮射击", "对敌方英雄造成3点伤害", "hs_hunter", 2, "target.hs_dmgrcv('damage',3, player).hs_heroskill=true;", "R:function(player){return player.getOppo();}"],
	zhil: ["治疗术", "恢复4点生命值", "hs_priest", 2, "target.hs_dmgrcv('recover',4,player).hs_heroskill=true;", ["F:all", "return get.rcvEffect(target, player, player,1) + 0.1;"], {
		order: 1,
		result: {
			player(player) {
				return Math.max.apply(Math, player.sctp().map(i => get.rcvEffect(i, player, player) + 1));
			},
		},
	}],
	fenl: ["灵魂分流", "抽一张牌", "hs_warlock", 2, "player.hs_drawDeck();", "", {
		order: 6,
		result: {
			player(player) {
				return (player.cardPile.countCards("h")) ? 1 : 0;
			},
		},
	}],
	biax: ["恐怖变形", "本回合+2攻击力。+2护甲值。", "hs_druid", 2, "player.hs_atkhj([2,2]);"],
	yuaj: ["白银之手", "召唤两个1/1的白银之手新兵。", "hs_paladin", 2, "player.SSfellow(['白银之手新兵',2]);"],
	ttzh: ["图腾崇拜", "召唤一个你想要的图腾。", "hs_shaman", 2, [`const list = get.HSA("collect").图腾.map(i=>get.chscard(i));
			const dialog = ui.create.dialog("图腾崇拜：召唤一个你想要的图腾", 'hidden');
			dialog.classList.add("faxian4");
			dialog.addAuto(list);
			player.chooseButton(dialog, true).set("ai",b=>Math.random());`, "player.SSfellow(result.links[0].name);"]],
	shad: ["浸毒匕首", "装备一把2/2的匕首。", "hs_rogue", 2, "player.hs_weapon('浸毒匕首').hs_heroskill=true;", "", {
		order: 6,
		result: {
			player(player) {
				return player.data_weapon ? 0 : 1;
			},
		},
	}],
};

// 其他卡牌
const powerfulHeroskill = {
	// 冠军的试炼
	ltngjlt: ["雷霆震击", "造成2点伤害。", "hs_shaman", 2, "target.hs_dmgrcv('damage',2,player,'thunder').hs_heroskill=true;", ["F:all", "return get.dmgEffect(target, player, player,2) + 0.1;"], {
		order: 6,
		result: {
			player(player) {
				if (game.hasPlayer(function(target) {
						return get.dmgEffect(target, player, player, 2) + 0.1 > 0;
					})) return 1;
				return 0;
			},
		},
	}],
	// 标准包
	xljcam: ["心灵尖刺", "造成2点伤害。", "hs_priest", 2, "target.hs_dmgrcv('damage',2,player).hs_heroskill=true;", ["F:all", "return get.dmgEffect(target, player, player,2) + 0.1;"], {
		order: 6,
		result: {
			player(player) {
				if (game.hasPlayer(function(target) {
						return get.dmgEffect(target, player, player, 2) + 0.1 > 0;
					})) return 1;
				return 0;
			},
		},
	}],
	xlslam: ["心灵碎裂", "造成3点伤害。", "hs_priest", 2, "target.hs_dmgrcv('damage',3,player).hs_heroskill=true;", ["F:all", "return get.dmgEffect(target, player, player,3) + 0.1;"], {
		order: 6,
		result: {
			player(player) {
				if (game.hasPlayer(function(target) {
						return get.dmgEffect(target, player, player, 3) + 0.1 > 0;
					})) return 1;
				return 0;
			},
		},
	}],
	dyh: ["地狱火！", "召唤一个6/6的地狱火。", "hs_warlock", 2, "player.SSfellow('地狱火');"],
	// 黑石山的火焰
	sbcz: ["死吧，虫子！", "随机对一个敌人造成8点伤害。", "hs_neutral", 2, "target.hs_dmgrcv('damage',8, player).hs_heroskill=true;", "R:function(player){return player.HSF('randmgfil', ['opposide']);}"],
	// 上古之神的低语
	TheTidalHand: ["潮汐之力", "召唤一个1/1的白银之手鱼人。", "hs_paladin", 2, "player.SSfellow('白银之手鱼人');"],
	// 冰封王座九大dk
	smhx: ["生命虹吸！", "吸血，造成3点伤害。", "hs_warlock", 2, "target.hs_dmgrcv('damage',3,player,'thunder').hs_heroskill=true; player.hs_dmgrcv('recover', 3,player).hs_heroskill=true;", ["F:all", "return get.dmgEffect(target, player, player, 3) + 0.1;"], {
		order: 6,
		result: {
			player(player) {
				if (game.hasPlayer(function(target) {
						return get.dmgEffect(target, player, player, 3) + 0.1 > 0;
					})) return 1;
				return 0;
			},
		},
	}],
	paod: ["瘟疫领主", "抉择：在本回合中获得+3攻击力；或者获得3点护甲值。", "hs_druid", 2, "player.hs_jueze(['hs_ScarabShell', 'hs_SpiderFangs']);"],
	jrfb: ["剑刃风暴", "对所有随从造成一点伤害", "hs_warrior", 2, "get.HSF('bladeeffect',['damage',1]);"],
	lcyt: ["冰冷触摸", "造成1点伤害。如果该英雄技能消灭了一个随从，则召|唤一个水元素", "hs_mage", 2, ["target.hs_dmgrcv('damage',1,player,'ice').hs_heroskill=true;", "if (!target.HSF('alive')) player.SSfellow(['水元素']);"],
		["F:all", "return get.dmgEffect(target, player, player,2) + 0.1;"]
	],
	four: ["天启四骑士", "召唤一个2/2的天启骑士，如果你控制所有四个天启骑士，消灭敌方英雄", "hs_paladin", 2, "player.SSfellow('cdset:天启骑士,norepeat');", "f:return player.sctp('mine',fl=>get.HSA('collect')['天启骑士'].includes(get.translation(fl.name)),true).length<4;"],
	ltzh: ["灵体转化", "将你的一个随从随机变形成法力值消耗增加一点的随从。", "hs_sanman", 2, `
			const cost = event.target.linkCard[0].cost() +1 ;
			const name = get.hskachi("HS_minor", (c, info) => info.cost == cost).randomGet() || event.target.linkCard[0].name;
			event.target.HSF("convert", [name]);`, "F:mine"],
	Voidform: ["虚空形态", "造成2点伤害。", "hs_priest", 2, "target.hs_dmgrcv('damage',2,player).hs_heroskill=true;", ["F:all", "return get.dmgEffect(target, player, player,2) + 0.1;"], {
		order: 6,
		result: {
			player(player) {
				if (game.hasPlayer(function(target) {
						return get.dmgEffect(target, player, player, 2) + 0.1 > 0;
					})) return 1;
				return 0;
			},
		},
	}],
	lexxer: ["合成僵尸兽", "抉择：在本回合中获得+3攻击力；或者获得3点护甲值。", "hs_hunter", 2, "player.hs_jueze(['hs_ScarabShell', 'hs_SpiderFangs']);"],

	// 奥特兰克的决裂十位英雄
	BlessingofQueens: ["女王的祝福", "随机使你手牌中的一张随从牌获得+4/+4。", "hs_paladin", 2, "console.warn('相关机制尚未实现！')"],
	peiy: ["培育！", "抉择：抽一张牌；或者获得一个法力水晶", "hs_druid", 2, "player.hs_jueze(['hs_IceBlossom', 'hs_ValleyRoot']);"],
	kjzl: ["恐惧之链", "将一张裂隙冼入你的牌库，抽一张牌", "hs_warlock", 2, "player.HSF('addtodeck', [['邪能裂隙']]);player.draw();"],
	sofh: ["手法娴熟", "在本回合中，你的下一张牌法力值消耗减少(2)点", "hs_rogue", 0, "player.addcostbuff(2);"],
	yjzz: ["陨烬之怒", "在本回合中+2攻击力，友方随从每攻击一次都会复原此技能", "hs_demonhunter", 1, "player.hs_atkhj([2,0],1);"],
	jlmg: ["巨力猛击", "造成2点伤害。荣誉消灭：获得4点护甲。", "hs_warrior", 2, ["target.hs_dmgrcv('damage',2,player,'thunder').hs_heroskill=true;", "if (!target.HSF('alive')) player.changeHujia(4);"],
		["F:all", "return get.dmgEffect(target, player, player,2) + 0.1;"]
	],
	// 巨龙降临
	eryi: ["迦拉克隆的恶意", "召唤两个1/1的龙裔小鬼。", "hs_warlock", 2, "player.SSfellow(['龙裔小鬼',2]);"],
	guile: ["迦拉克隆的诡计", "将一张跟班牌置入你的手上", "hs_rogue", 2, `const f = get.hsflt("跟班", "all"); player.hs_gain(get.hskachi("all", f, true).randomGet());`],
	might: ["迦拉克隆的巨力", "在本回合中，使你的英雄获得+3攻击力", "hs_warrior", 2, "player.hs_atkhj([3,0];"],
	wit: ["迦拉克隆的智识", "将一张牧师职业牌置入你的手上", "hs_priest", 2, "player.hs_gain(get.hskachi('all', (c, info) => info.rnature == 'hs_priest').randomGets());"],
	fury: ["迦拉克隆的愤怒", "召唤1个2/1并具有突袭的风暴。", "hs_sanman", 2, "player.SSfellow(['啸风元素']);"],
};

export { heroskill, exheroskill, powerfulHeroskill };
