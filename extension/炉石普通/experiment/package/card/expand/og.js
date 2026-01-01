import { lib, game, ui, get, ai, _status } from "../../../../../../noname.js";


export const OG = {
	name: "上古之神的低语",
	en: "OG",
	minor: {
		info: {
			// 已完成
			"Psych-o-Tron": ["闹闹机器人", "ordinary", "嘲讽，圣盾", ["HS_effect", "5", "hs_neutral", "machine", "3", "4"]],
			"Tentacle of NZoth": ["恩佐斯的触须", "ordinary", "亡语：对所有随从造成1点伤害。", ["HS_effect", "1", "hs_neutral", "none", "1", "1"]],
			"Zealous Initiate": ["狂热的新兵", "ordinary", "亡语：随机使一个友方随从获得加1+1。", ["HS_effect", "1", "hs_neutral", "none", "1", "1"],
				["deathRattle:ranbuff>mine:A1H1"]
			],
			"Bilefin Tidehunter": ["怒鳍猎潮者", "ordinary", "战吼：召唤一个1/1并具有嘲讽的软泥怪。", ["HS_effect", "2", "hs_neutral", "murloc", "2", "1"],
				["battleRoal:软泥怪2"]
			],
			"Corrupted Seer": ["腐化先知", "rare", "战吼：对所有非鱼人随从造成两点伤害。", ["HS_effect", "6", "hs_neutral", "murloc", "2", "3"],
				["rareEff"]
			],
			"Twisted Worgen": ["扭曲的狼人", "ordinary", "潜行", ["HS_effect", "2", "hs_neutral", "none", "3", "1"]],
			// #给克苏恩加buff，不好写
			"Twilight Geomancer": ["暮光地卜师", "ordinary", "嘲讽，战吼：使你的克苏恩获得嘲讽（无论它在哪里）。", ["HS_effect", "2", "hs_neutral", "none", "1", "4"]],
			"Beckoner of Evil": ["邪灵召唤师", "ordinary", "战吼：使你的克苏恩获得+2/+2（无论它在哪里）。", ["HS_effect", "2", "hs_neutral", "none", "2", "3"]],
			"CThuns Chosen": ["克苏恩的侍从", "ordinary", "圣盾。战吼：使你的克苏恩获得+2/+2（无论它在哪里）。", ["HS_effect", "4", "hs_neutral", "none", "4", "2"]],
			"Skeram Cultist": ["斯克拉姆狂热者", "rare", "战吼：使你的克苏恩获得+2/+2（无论它在哪里）。", ["HS_effect", "6", "hs_neutral", "none", "7", "6"]],
			"Doomcaller": ["厄运召唤者", "rare", "战吼：使你的克苏恩获得+2/+2（无论它在哪里）。如果克苏恩死亡，将其洗入你的牌库。", ["HS_effect", "8", "hs_neutral", "none", "7", "9"]],
			"Disciple of CThun": ["克苏恩的信徒", "rare", "战吼：造成2点伤害。使你的克苏恩获得+2/+2（无论它在哪里）。", ["HS_effect", "3", "hs_neutral", "none", "2", "1"]],
			"Twilight Elder": ["暮光尊者", "ordinary", "在你的回合结束时，使你的克苏恩 获得+1/+1（无论它在哪里）。", ["HS_effect", "3", "hs_neutral", "none", "3", "4"]],
			"Usher of Souls": ["渡魂者", "ordinary", "每当一个友方随从死亡，使你的克苏恩 获得+1/+1（无论它在哪里）。", ["HS_effect", "5", "hs_warlock", "none", "5", "6"]],
			"Blade of CThun": ["克苏恩之刃", "epic", "战吼：消灭一个随从。你的克苏恩会获得其攻击力和生命值（无论它在哪里）。", ["HS_effect", "9", "hs_rogue", "none", "4", "4"]],
			"Hooded Acolyte": ["兜帽侍僧", "ordinary", "每当一个角色获得治疗时，使你的克苏恩获得加1+1，无论他在哪里", ["HS_effect", "4", "hs_priest", "none", "3", "6"]],
			"Cult Sorcerer": ["邪教女巫", "rare", "法术伤害+1。在你施放一个法术后，使你的克苏恩获得+1/+1（无论他在哪里）", ["HS_effect", "2", "hs_mage", "none", "3", "2"]],
			"Dark Arakkoa": ["黑暗鸦人", "ordinary", "嘲讽，战吼：使你的克苏恩获得加3+3，无论他在哪里", ["HS_effect", "6", "hs_druid", "none", "5", "7"]],
			"Crazed Worshipper": ["疯狂的信徒", "epic", "嘲讽。每当该随从受到伤害，使你的克苏恩获得+1/+1（无论它在哪里）。", ["HS_effect", "5", "hs_neutral", "none", "3", "6"]],
			////
			"Spawn of NZoth": ["恩佐斯的子嗣", "ordinary", "亡语：使你的所有随从获得+1/+1。", ["HS_effect", "3", "hs_neutral", "none", "2", "2"]],
			"Squirming Tentacle": ["裂地触须", "ordinary", "嘲讽", ["HS_effect", "3", "hs_neutral", "none", "2", "4"]],
			"Bog Creeper": ["毒沼爬行者", "ordinary", "嘲讽", ["HS_effect", "7", "hs_neutral", "none", "6", "8"]],
			"Grotesque Dragonhawk": ["畸变的龙鹰", "ordinary", "风怒", ["HS_effect", "7", "hs_neutral", "wildbeast", "5", "5"]],
			"Infested Tauren": ["被感染的牛头人", "ordinary", "嘲讽。亡语：召唤一个2/2的泥浆怪", ["HS_effect", "4", "hs_neutral", "none", "2", "3"],
				["deathRattle:泥浆怪"]
			],
			"Polluted Hoarder": ["被感染的贮藏者", "ordinary", "亡语：抽一张牌。", ["HS_effect", "4", "hs_neutral", "none", "4", "2"]],
			"Aberrant Berserker": ["畸变狂战士", "ordinary", "激怒：+2攻击力", ["HS_effect", "4", "hs_neutral", "none", "3", "5"]],
			"Duskboar": ["暮色野猪", "ordinary", "", ["HS_normal", "2", "hs_neutral", "wildbeast", "4", "1"]],
			"Amgam Rager": ["浆岩暴怒者", "ordinary", "", ["HS_normal", "3", "hs_neutral", "none", "1", "5"]],
			"Cult Apothecary": ["邪教药剂师", "ordinary", "战吼：每有一个敌方随从，便为你的英雄恢复两点生命值", ["HS_effect", "5", "hs_neutral", "none", "4", "4"]],
			"Nerubian Prophet": ["蛛魔先知", "ordinary", "在你的回合开始时，该随从牌的法力值消耗减少一点", ["HS_effect", "6", "hs_neutral", "none", "4", "4"],
				// ["addhand:;"]
			],
			"Silithid Swarmer": ["异种群居蝎", "rare", "在本回合中，除非你的英雄进行过攻击，否则无法进行攻击。", ["HS_effect", "3", "hs_neutral", "wildbeast", "3", "5"]],
			"Midnight Drake": ["午夜噩龙", "rare", "战吼：你每有一张其他手牌，便获得+1攻击力。", ["HS_effect", "4", "hs_neutral", "dragon", "1", "4"]],
			"Eater of Secrets": ["奥秘吞噬者", "rare", "战吼：摧毁所有敌方奥秘。每摧毁一个，便获得+1/+1。", ["HS_effect", "4", "hs_neutral", "none", "2", "4"]],
			"Blackwater Pirate": ["黑水海盗", "rare", "你的武器法力值消耗减少（2）点。", ["HS_effect", "4", "hs_neutral", "pirate", "2", "5"]],
			"Evolved Kobold": ["异变的狗头人", "ordinary", "法术伤害+2", ["HS_effect", "4", "hs_neutral", "none", "2", "2"]],
			"Corrupted Healbot": ["腐化治疗机器人", "rare", "亡语：为敌方英雄恢复8点生命值。", ["HS_effect", "5", "hs_neutral", "machine", "6", "6"]],
			"Cyclopian Horror": ["巨型独眼怪", "epic", "嘲讽，战吼：每有一个敌方随从，便获得+1生命值。", ["HS_effect", "4", "hs_neutral", "none", "3", "3"]],
			"Faceless Shambler": ["无面蹒跚者", "epic", "嘲讽，战吼：复制一个友方随从的攻击力和生命值。", ["HS_effect", "4", "hs_neutral", "none", "1", "1"]],
			"Twilight Summoner": ["暮光召唤师", "epic", "亡语：召唤一个5/5的无面破坏者。", ["HS_effect", "4", "hs_neutral", "none", "1", "1"],
				["deathRattle:无面破坏者"]
			],
			"Validated Doomsayer": ["末日践行者", "epic", "在你的回合开始时，将该随从的攻击力变为7。", ["HS_effect", "5", "hs_neutral", "none", "0", "7"]],
			"Darkspeaker": ["黑暗低语者", "epic", "战吼：与另外一个友方随从交换属性值", ["HS_effect", "5", "hs_neutral", "none", "3", "6"]],
			"Ancient Harbinger": ["上古之神先驱", "epic", "在你的回合开始时，将一个法力值消耗为（10）的随从从你的牌库置入你的手牌。", ["HS_effect", "6", "hs_neutral", "none", "4", "6"]],
			"Scaled Nightmare": ["梦魇之龙", "epic", "在你的回合开始时，。该随从的攻击力翻倍", ["HS_effect", "6", "hs_neutral", "dragon", "2", "8"]],
			"BloodofTheAncientOne": ["远古造物之血", "epic", "在你的回合结束时，如果你控制两个远古造物之血，则将其融合成远古造物。", ["HS_effect", "9", "hs_neutral", "none", "9", "9"]],
			"Anomalus": ["阿诺玛鲁斯", "legend", "亡语：对所有随从造成8点伤害。", ["HS_effect", "8", "hs_mage", "none", "8", "6"],
				["legend"]
			],
			"MuklaTyrantoftheVale": ["山谷之王穆克拉", "legend", "战吼：将两根香蕉置入你的手牌。", ["HS_effect", "6", "hs_neutral", "wildbeast", "5", "5"],
				["legend"]
			],
			"Shifter Zerus": ["百变泽鲁斯", "legend", "如果这张牌在你的手牌中，每个回合都会随机变成一张随从牌。", ["HS_effect", "1", "hs_neutral", "none", "1", "1"],
				["legend"]
			],
			"Twin Emperor Veklor": ["维克洛尔大帝", "legend", "嘲讽，战吼：如果你的克苏恩至少具有10点攻击力，则召唤另一名双子皇帝。", ["HS_effect", "7", "hs_neutral", "none", "4", "6"],
				["legend", "rareEff"]
			],
			"The Boogeymonster": ["波戈蒙斯塔", "legend", "每当波戈蒙斯塔攻击并消灭一个随从，便获得+2/+2。", ["HS_effect", "8", "hs_neutral", "none", "6", "7"],
				["legend"]
			],
			"Nat the Darkfisher": ["阴暗渔夫那特", "legend", "你的对手在回合开始时，有50%的几率额外抽一张牌。", ["HS_effect", "2", "hs_neutral", "none", "2", "4"],
				["legend"]
			],
			"Carrion Grub": ["腐肉虫", "ordinary", "", ["HS_normal", "3", "hs_hunter", "wildbeast", "2", "5"]],
			"Faceless Behemoth": ["无面巨兽", "ordinary", "", ["HS_normal", "10", "hs_neutral", "none", "10", "10"]],
			"Eldritch Horror": ["惊骇恐魔", "ordinary", "", ["HS_normal", "8", "hs_neutral", "none", "6", "4"]],
			"Soggoth the Slitherer": ["深渊滑行者索苟斯", "legend", "嘲讽，无法成为法术或英雄技能的目标。", ["HS_effect", "9", "hs_neutral", "none", "5", "9"],
				["legend"]
			],
			"Hogger Doom of Elwynn": ["艾尔文灾星霍格", "legend", "每当本随从受到伤害，召唤一个2/2并具有嘲讽的腐化豺狼人。", ["HS_effect", "7", "hs_neutral", "none", "6", "6"],
				["legend", "受伤:腐化豺狼人"]
			],
			"Twin Emperor Veknilash": ["维克尼拉斯大帝", "essential", "嘲讽", ["HS_effect", "7", "hs_neutral", "none", "4", "6"],
				["token", "legend"]
			],
			"Gnoll5": ["腐化豺狼人", "essential", "嘲讽", ["HS_effect", "2", "hs_neutral", "none", "2", "2"],
				["token"]
			],
			"Ooze5": ["软泥怪2", "essential", "嘲讽", ["HS_effect", "1", "hs_neutral", "none", "1", "1"],
				["token"]
			],
			"Twilight Elemental": ["暮光元素", "essential", "", ["HS_normal", "3", "hs_shaman", "elemental", "4", "2"],
				["token"]
			],
			"Shadowbeast": ["暗影兽", "essential", "", ["HS_normal", "1", "hs_warlock", "none", "1", "1"],
				["token"]
			],
			"lcky Tentacle": ["黏滑的触须", "essential", "", ["HS_normal", "1", "hs_warlock", "none", "1", "1"],
				["token"]
			],
			"Slime30": ["泥浆怪", "essential", "", ["HS_normal", "2", "hs_neutral", "none", "2", "2"],
				["token"]
			],
			"Slime20": ["泥浆怪", "essential", "", ["HS_normal", "2", "hs_warrior", "none", "2", "2"],
				["token"]
			],
			"Slime10": ["泥浆怪", "essential", "", ["HS_normal", "2", "hs_druid", "none", "2", "2"],
				["token"]
			],
			"Wisp10": ["小精灵", "essential", "", ["HS_normal", "0", "hs_druid", "none", "1", "1"],
				["token"]
			],
			"Mastiff10": ["獒犬", "essential", "", ["HS_normal", "1", "hs_hunter", "wildbeast", "1", "1"],
				["token"]
			],
			"Spider10": ["蜘蛛", "essential", "", ["HS_normal", "1", "hs_hunter", "wildbeast", "1", "1"],
				["token"]
			],
			"Silver Hand Murloc": ["白银之手鱼人", "essential", "", ["HS_normal", "1", "hs_paladin", "murloc", "1", "1"],
				["token"]
			],
			"The Ancient One": ["远古造物", "essential", "", ["HS_normal", "9", "hs_neutral", "none", "30", "30"],
				["token"]
			],
			"YShaarj Rage Unbound": ["亚煞极", "legend", "在你的回合结束时，将一个随从从你的牌库置入战场", ["HS_effect", "10", "hs_neutral", "none", "10", "10"],
				["legend"]
			],
			"NZoththeCorruptor": ["恩佐斯", "legend", "战吼：召唤所有你在本局对局中死亡的，并具有亡语的随从", ["HS_effect", "10", "hs_neutral", "none", "5", "7"],
				["legend"]
			],
			"CThun": ["克苏恩", "legend", "战吼：造成等同于该随从攻击力的伤害，随机分配到所有敌人身上", ["HS_effect", "10", "hs_neutral", "none", "6", "6"],
				["legend"]
			],
			"Yogg-Saron Hopes End": ["尤格-萨隆", "legend", "战吼：在本局对战中，你每施放过一个法术，便随机施放一个法术（目标随机而定）。", ["HS_effect", "10", "hs_neutral", "none", "7", "5"],
				["legend"]
			],
			"Deathwing Dragonlord": ["黑龙领主死亡之翼", "legend", "亡语：将你手牌中的所有龙牌置入战场", ["HS_effect", "10", "hs_neutral", "dragon", "12", "12"],
				["legend"]
			],
			"Addled Grizzly": ["腐化黑熊", "rare", "在你召唤一个随从后使其获得加1+1", ["HS_effect", "3", "hs_druid", "wildbeast", "2", "2"]],
			"Klaxxi Amber-Weaver": ["卡拉克西织珀者", "rare", "战吼：如果你的克苏恩拥有至少10点攻击力，则获得+5生命值", ["HS_effect", "4", "hs_druid", "none", "4", "5"],
				["rareEff"]
			],
			"Mire Keeper": ["泥潭守护者", "rare", "抉择：召唤一个2/2的泥浆怪；或获得一点空的法力水晶。", ["HS_effect", "4", "hs_druid", "none", "3", "3"]],
			"Forbidden Ancient": ["禁忌古树", "epic", "战吼：消耗你的所有法力值，每消耗一点法力水晶便获得加1+1。", ["HS_effect", "1", "hs_druid", "none", "1", "1"]],
			"Fandral Staghelm": ["范达尔·鹿盔", "legend", "你的抉择牌和英雄技能可以同时获得两种选项", ["HS_effect", "4", "hs_druid", "none", "3", "5"],
				["legend"]
			],
			"Fiery Bat": ["炽炎蝙蝠", "ordinary", "亡语：随机对一个敌人造成1点伤害", ["HS_effect", "1", "hs_hunter", "wildbeast", "2", "1"]],
			"Forlorn Stalker": ["狼人追猎者", "rare", "战吼：使你手牌中的所有亡语随从牌获得+1/+1", ["HS_effect", "3", "hs_hunter", "none", "4", "2"]],
			"Infested Wolf": ["寄生恶狼", "rare", "亡语：召唤两只1/1的蜘蛛", ["HS_effect", "4", "hs_hunter", "wildbeast", "3", "3"],
				["deathRattle:['蜘蛛',2]"]
			],
			"Giant Sand Worm": ["巨型沙虫", "epic", "每当该随从攻击并消灭一个随从，便可再次攻击", ["HS_effect", "8", "hs_hunter", "wildbeast", "8", "8"]],
			"Princess Huhuran": ["哈霍兰公主", "legend", "战吼：触发一个友方随从的亡语", ["HS_effect", "5", "hs_hunter", "wildbeast", "6", "5"],
				["legend"]
			],
			"Twilight Flamecaller": ["暮光烈焰召唤者", "ordinary", "战吼：对所有敌方随从造成一点伤害", ["HS_effect", "3", "hs_mage", "none", "2", "2"]],
			"Faceless Summoner": ["无面召唤者", "ordinary", "战吼：随机召唤一个法力值消耗为（3）点的随从。", ["HS_effect", "6", "hs_mage", "none", "5", "5"]],
			"Demented Frostcaller": ["癫狂的唤冰者", "rare", "在你施放一个法术后，随机冻结一个敌人", ["HS_effect", "4", "hs_mage", "none", "2", "4"]],
			"Servant of Yogg-Saron": ["尤格萨隆的仆从", "rare", "战吼：随机施放一个法力值消耗小于或等于（5）点的法术（目标随机而定）", ["HS_effect", "5", "hs_mage", "none", "5", "4"]],
			"Selfless Hero": ["无私的英雄", "rare", "亡语：随机使一个友方随从获得圣盾", ["HS_effect", "1", "hs_paladin", "none", "2", "1"],
				["deathRattle:ranbuff>mine:shengdun"]
			],
			"Steward of Darkshire": ["夜色镇执法官", "rare", "每当你召唤一个生命值为一的随从便使其获得圣盾", ["HS_effect", "3", "hs_paladin", "none", "3", "3"]],
			"Vilefin Inquisitor": ["邪鳍审判者", "epic", "战吼：你的英雄技能变为“召唤一个1/1的鱼人”", ["HS_effect", "1", "hs_paladin", "murloc", "1", "3"]],
			"Ragnaros Lightlord": ["光耀之主拉格纳罗斯", "legend", "在你的回合结束时，为一个受伤的友方角色恢复 8点生命值。", ["HS_effect", "8", "hs_paladin", "elemental", "8", "8"],
				["legend"]
			],
			"Darkshire Alchemist": ["夜色镇炼金师", "ordinary", "战吼：恢复5点生命值。", ["HS_effect", "5", "hs_priest", "none", "4", "5"]],
			"Shifting Shade": ["变幻之影", "rare", "亡语：复制你对手牌库中的一张牌，并将其置入你的手牌。", ["HS_effect", "4", "hs_priest", "none", "4", "3"]],
			"Twilight Darkmender": ["暮光暗愈者", "rare", "战吼：如果你的克苏恩拥有至少10点攻击力，便为你的英雄恢复10点生命值。", ["HS_effect", "5", "hs_priest", "none", "6", "5"],
				["rareEff"]
			],
			"Herald Volazj": ["传令官沃拉兹", "legend", "战吼：召唤所有其他友方随从的复制，他们均为1/1。", ["HS_effect", "6", "hs_priest", "none", "5", "5"],
				["legend", "rareEff"]
			],
			"Bladed Cultist": ["执刃教徒", "ordinary", "连击：获得加1+1", ["HS_effect", "1", "hs_rogue", "none", "1", "2"],
				["rareEff"]
			],
			"Southsea Squidface": ["南海畸变船长", "ordinary", "亡语：使你的武器获得+2攻击力。", ["HS_effect", "4", "hs_rogue", "pirate", "4", "4"]],
			"NZoths First Mate": ["恩佐斯的副官", "ordinary", "战吼：装备一把1/3的锈蚀铁钩", ["HS_effect", "1", "hs_warrior", "pirate", "1", "1"],
				["battleRoal:weapon>'锈蚀铁钩'"]
			],
			"Bloodsail Cultist": ["血帆教徒", "rare", "战吼：如果你控制其他任何海盗，你的武器便获得+1/+1。", ["HS_effect", "3", "hs_warrior", "pirate", "3", "4"],
				["rareEff"]
			],
			"Ancient Shieldbearer": ["上古之神护卫", "rare", "战吼： 如果你的克苏恩至少具有10点攻击力，则获得10点护甲值。", ["HS_effect", "7", "hs_warrior", "none", "6", "6"],
				["rareEff"]
			],
			"Malkorok": ["马尔考罗克", "legend", "战吼： 随机装备一把武器。", ["HS_effect", "7", "hs_warrior", "none", "6", "5"],
				["legend"]
			],
			"Undercity Huckster": ["幽暗城商贩", "rare", "亡语：随机将一张(你对手职业的)卡牌置入你的手牌", ["HS_effect", "2", "hs_rogue", "none", "2", "2"]],
			"Shadowcaster": ["暗影施法者", "epic", "战吼：选择一个友方随从，将它的一张1/1的复制置入你的手牌，其法力值消耗为（1）点。", ["HS_effect", "5", "hs_rogue", "none", "4", "4"]],
			"Xaril Poisoned Mind": ["毒心者夏克里尔", "legend", "亡语，战吼：随机将一张毒素牌置入你的手牌", ["HS_effect", "4", "hs_rogue", "none", "3", "2"],
				["legend"]
			],
			"Flamewreathed Faceless": ["投火无面者", "ordinary", "过载：（2）", ["HS_effect", "4", "hs_shaman", "none", "7", "7"]],
			"MasterofEvolution": ["异变之主", "rare", "战吼：将一个友方随从随机变成为一个法力值消耗增加一点的随从", ["HS_effect", "4", "hs_shaman", "none", "4", "5"]],
			"Thing from Below": ["深渊魔物", "rare", "嘲讽。在本局对战中，你每召唤一个图腾，该牌的法力值消耗便减少（1）点。", ["HS_effect", "6", "hs_shaman", "none", "5", "5"]],
			"Eternal Sentinel": ["永恒哨卫", "epic", "战吼：将你所有过载的法力水晶解锁。", ["HS_effect", "2", "hs_shaman", "none", "3", "2"]],
			"Hallazeal the Ascende": ["升腾者海纳泽尔", "legend", "每当你的法术造成伤害时，为你的英雄恢复等量的生命值。", ["HS_effect", "5", "hs_shaman", "elemental", "4", "6"],
				["legend"]
			],
			"Possessed Villager": ["着魔村民", "ordinary", "亡语：召唤一个1/1的暗影兽", ["HS_effect", "1", "hs_warlock", "none", "1", "1"],
				["deathRattle:暗影兽"]
			],
			"Darkshire Councilman": ["夜色镇议员", "ordinary", "在你召唤一个随从后，获得+1攻击力。", ["HS_effect", "3", "hs_warlock", "none", "1", "5"]],
			"Darkshire Librarian": ["夜色镇图书管理员", "rare", "战吼： 随机弃一张牌。 亡语： 抽一张牌。", ["HS_effect", "2", "hs_warlock", "none", "3", "2"]],
			"Ravaging Ghoul": ["暴虐食尸鬼", "ordinary", "战吼：对所有其他随从造成1点伤害。", ["HS_effect", "3", "hs_warrior", "none", "3", "3"]],
			"Bloodhoof Brave": ["血蹄勇士", "ordinary", "嘲讽。激怒：+3攻击力", ["HS_effect", "4", "hs_warrior", "none", "2", "6"]],
			"Chogall": ["古加尔", "legend", "战吼：在本回合中，你施放的下一个法术不再消耗法力值，转而消耗生命值。", ["HS_effect", "7", "hs_warlock", "none", "7", "7"],
				["legend"]
			],
		},
		skill: {
			"hs_VilefinInquisitor": {
				battleRoal: {
					async effect(event, trigger, player) {
						player.HSF('changeHeroskill', ["潮汐之力"]);
					},
				},
			},
			"hs_HeraldVolazj": {
				battleRoal: {
					filter(player) {
						return player.sctp("mine").length > 0;
					},
					recheck: "filter",
					async effect(event, trigger, player) {
						player.sctp("mine").filter(k => k.name !== "hs_HeraldVolazj").forEach(i => {
							player.SSfellow(`${i.name}_monster`, undefined, "冒出", ["复制"]);
						})
					},
				},
			},
			"hs_BladedCultist": {
				active(p, c) {
					return p.hs_state.useCard > 0;
				},
				lianji: {
					async effect(event, trigger, player) {
						event.fellow.addvaluebuff([1, 1]);
					},
				},
			},
			"hs_BloodsailCultist": {
				battleRoal: {
					filter(player) {
						return player.sctp("mns", t => t.rkind == "pirate");
					},
					randomRT(p) {
						return p.data_weapon;
					},
					async effect(event, trigger, player) {
						event.target.addvaluebuff([1, 1]);
					},
				},
			},
			"hs_SouthseaSquidface": {
				deathRattle: {
					randomRT(p) {
						return p.data_weapon;
					},
					async effect(event, trigger, player) {
						event.target.addvaluebuff([2, 0]);
					},
				},
			},
			// @TODO
			"hs_BloodofTheAncientOne": {
				ending: {
					self: true,
					filter(evt, player) {
						return player.countFellow(fl => fl.name === "hs_BloodofTheAncientOne") > 1;
					},
					recheck: "filter",
					async effect(event, trigger, player) {
						await get.HSF("cuihui", [player.filterFellow(fl => fl.name === "hs_BloodofTheAncientOne"), true]);
						await event.fellow.SSfellow("远古造物");
					},
				},
			},
			// @TODO
			"hs_RagnarosLightlord": {
				ending: {
					self: true,
					filter(evt, player) {
						return player.sctp('myside').filter(t=>t.isDamaged()).length > 0;
					},
					recheck: "filter",
					async effect(event, trigger, player) {
						await get.HSF("cuihui", [player.filterFellow(fl => fl.name === "hs_BloodofTheAncientOne"), true]);
						await event.fellow.SSfellow("远古造物");
					},
				},
			},
			"hs_GiantSandWorm": {
				attackEnd: {
					// direct: true,
					filter(evt, p, f) {
						return evt.player == p && evt.target.isMin() && !evt.target.HSF("alive");
					},
					async effect(event, trigger, player) {
						event.fellow.hs_ex_atk += 1;
					},
				},
			},
			"hs_BlackwaterPirate": {
				numgh: {
					name: "hs_cost",
					value: 2,
					ghfilter(card, fellow, target) {
						return target == fellow.getLeader() && get.type(card) == "HS_weapon";
					},
				},
			},
			"hs_DarkshireCouncilman": {
				summonAfter: {
					self: true,
					async effect(event, trigger, player) {
						event.fellow.updateSelfBuff(1);
					},
				},
			},
			"hs_CorruptedSeer": {
				battleRoal: {
					filter(player) {
						return player.sctp("mns", f => f.HSF("alive") && f.rkind !== "murloc");
					},
					recheck: "filter",
					async effect(event, trigger, player) {
						event.fellow.hs_dmgrcvNotaoe(event.fellow, player.sctp("mns"), 2, (p, f) => f.HSF("alive") && f.rkind !== "murloc").line = true;
					},
				},
			},
			"hs_FacelessSummoner": {
				async battleRoal(event, trigger, player) {
					player.SSfellow('range:3');
				},
			},
			"hs_DarkshireLibrarian": {
				battleRoal: {
					async effect(event, trigger, player) {
						player.hs_discard(1);
					}
				},
				deathRattle: {
					async effect(event, trigger, player) {
						player.hs_drawDeck(1);
					}
				},
			},
			"hs_ShiftingShade": {
				deathRattle: {
					async effect(event, trigger, player) {
						player.hs_gain(player.getOppo().cardPile.getCards('h').map(i=>i.name).randomGet());
					}
				},
			},
			"hs_XarilPoisonedMind": {
				battleRoal: {
					async effect(event, trigger, player) {
						const f = get.hsflt("毒素", "all");
						player.hs_gain(get.hskachi("all", f, true).randomGet());
					}
				},
				deathRattle: {
					async effect(event, trigger, player) {
						const f = get.hsflt("毒素", "all");
						player.hs_gain(get.hskachi("all", f, true).randomGet());
					}
				},
			},
			"hs_PrincessHuhuran": {
				battleRoal: {
					filterTarget(card, player, target) {
						return player.sctp("mine", target) && target.classList.contains("wangyu") && target.triggers.deathRattle?.length > 0;
					},
					async effect(event, trigger, player) {
						const cost = event.target;
						cost.addTempClass("wywy");
						await game.delay();
						cost.HSF("morefocus");
						await cost.hs_deathRattle(cost.triggers.deathRattle);
					},
				},
			},
			// #异变之主
			"hs_MasterofEvolution": {
				battleRoal: {
					filterTarget(card, player, target) {
						return player.sctp("mine", target);
					},
					async effect(event, trigger, player) {
						const cost = event.target.linkCard[0].cost() + 1;
						const name = get.hskachi("HS_minor", (c, info) => info.cost == cost).randomGet() || event.target.linkCard[0].name;
						event.target.HSF("convert", [name]);
					},
				},
			},
			"hs_MidnightDrake": {
				async battleRoal(event, trigger, player) {
					const num = player.countCards("h");
					if (num > 0) {
						event.fellow.addvaluebuff([num, 0]);
					}
				},
			},
			"hs_EternalSentinel": {
				async battleRoal(event, trigger, player) {
					player.HSF('unlockmana');
				},
			},
			"hs_Malkorok": {
				async battleRoal(event, trigger, player) {
					player.hs_weapon(get.hskachi("HS_weapon").randomGet());
				},
			},
			"hs_UndercityHuckster": {
				async deathRattle(event, trigger, player) {
					let result;
					if (player.getOppo().group === "hs_neutral") {
						result = "幸运币";
					} else {
						result = get.hskachi("all", (c, info) => info.rnature == player.getOppo().group).randomGet();
					}
					player.hs_gain(result);
				}
			},
			"hs_SpawnofNZoth": {
				async deathRattle(event, trigger, player) {
					player.sctp("mine", fl => {
						fl.addvaluebuff([1, 1]);
					})
				}
			},
			// @TODO 死亡之翼
			"hs_DeathwingDragonlord": {
				deathRattle: {},
			},
			"hs_ScaledNightmare": {
				beginning: {
					self: true,
					async effect(event, trigger, player) {
						event.fellow.updateSelfBuff(event.fellow.ATK);
					},
				},
			},
			"hs_YShaarjRageUnbound": {
				ending: {
					self: true,
					async effect(event, trigger, player) {
						player.hs_join2();
					},
				},
			},
			"hs_NZoththeCorruptor": {
				async battleRoal(event, trigger, player) {
					await player.hs_revive(function(p, a, b) {
						const list = a[p.playerid].slice(0).filter(c => get.rGJZ(c, "deathRattle"));
						const list2 = [];
						list.forEach(i => list2.push(list.randomGet()));
						return list2;
					});
				},
			},
			"hs_MuklaTyrantoftheVale": {
				async battleRoal(event, trigger, player) {
					player.hs_gain(["香蕉", 2]);
				},
			},
			// #克苏恩 @TODO
			"hs_CThun": {
				battleRoal: {
					async effect(event, trigger, player) {
						player.hs_Missiles(6, false, "opposide");
					}
				},
			},
		},
	},
	spell: {
		info: {
			hs_MarkofYShaarj: ["亚煞极印记", "ordinary", ["buff:A2H2", "使一个随从获得+2/+2。如果该随从是野兽 抽一张牌。"], 2, "hs_druid", 'none', ["draw1"]],
			hs_FeralRage: ["野性之怒", "ordinary", "抉择：使你的英雄本回合获得+4攻击力；或获得8点护甲值", 3, "hs_druid", 'none', []],
			hs_WispsoftheOldGods: ["上古之神的小精灵", "epic", "抉择：召唤7个1/1的小精灵；或者是你的所有随从获得加2+2", 7, "hs_druid", 'none', []],
			hs_OntheHunt: ["搜寻猎物", "ordinary", ["damage:1", "造成一点伤害，召唤一个1/1的獒犬"], 1, "hs_hunter", 'none', ["other:player.SSfellow('獒犬');"]],
			hs_Infest: ["寄生感染", "rare", "使你的所有随从获得“亡语：随机将一张野兽牌置入你的手牌”。", 3, "hs_hunter", 'none', []],
			hs_CalloftheWild: ["兽群呼唤", "epic", "召唤所有三种动物伙伴。", 8, "hs_hunter", 'none', []],
			hs_Shatter: ["冰爆", "ordinary", "消灭一个被冻结的随从。", 2, "hs_mage", 'none', []],
			hs_CabalistsTome: ["秘法宝典", "epic", "随机将三张法师法术牌置入你的手牌。", 5, "hs_mage", 'none', []],
			hs_ForbiddenFlame: ["禁忌烈焰", "epic", "消耗你所有的法力值，对一个随从造成等同于所消耗法力值数量的伤害。", 0, "hs_mage", 'none', []],
			hs_ForbiddenHealing: ["禁忌治疗", "epic", "消耗你所有的法力值，恢复等同于所消耗法力值数量两倍的生命值。", 0, "hs_paladin", 'none', []],
			hs_ForbiddenShaping: ["禁忌畸变", "epic", "消耗你所有的法力值，随机召唤一个法力值消耗相同的随从。", 0, "hs_priest", 'none', []],
			hs_ForbiddenRitual: ["禁忌仪式", "rare", "消耗你所有的法力值，召唤相同数量的1/1的触须。", 0, "hs_warlock", 'none', []],
			hs_EmbracetheShadow: ["暗影之握", "epic", "在本回合中，你的治疗效果转为造成等量的伤害。", 2, "hs_priest", 'none', []],
			hs_DivineStrength: ["神圣之力", "ordinary", ["buff:A1H2", "使一个随从获得+1/+2。"], 1, "hs_paladin", 'none', []],
			hs_StandAgainstDarkness: ["惩黑除恶", "ordinary", ["summon:['白银之手新兵',5]", "召唤5个1/1的白银之手新兵"], 5, "hs_paladin", 'none', []],
			hs_PowerWordTentacles: ["真言术·触", "ordinary", ["buff:A2H6", "使一个随从获得加2+6"], 5, "hs_priest", 'none', []],
			hs_ShadowWordHorror: ["真言术·骇", "rare", "消灭所有攻击力小于或等于2的随从", 4, "hs_priest", 'none', []],
			hs_ShadowStrike: ["暗影打击", "ordinary", ["damage:5", "对一个未受伤的角色造成5点伤害"], 3, "hs_rogue", 'none', ["only:fellow,healthy"]],
			hs_JourneyBelow: ["深渊探险", "rare", "发现一张亡语牌", 1, "hs_rogue", 'none', []],
			hs_ThistleTea: ["菊花茶", "rare", "抽一张牌，将两张该牌的复制置入你的手牌", 6, "hs_rogue", 'none', []],
			hs_SpreadingMadness: ["狂乱传染", "rare", "造成9点伤害，随机分配到所有其他角色身上", 3, "hs_warlock", 'none', []],
			hs_RenounceDarkness: ["弃暗投明", "epic", "将你的英雄技能和术士卡牌替换成另一职业的。这些牌的法力值消耗减少（1）点。", 2, "hs_warlock", 'none', []],
			hs_DOOM: ["末日降临", "epic", "消灭所有随从。每消灭一个随从，便抽一张牌。", 10, "hs_warlock", 'none', []],
			hs_PrimalFusion: ["原始融合", "ordinary", "你每有一个图腾，就使一个随从获得+1/+1", 1, "hs_shaman", 'none', []],
			hs_Evolve: ["异变", "rare", "将你的所有随从变形成法力值消耗增加一点的随从", 1, "hs_shaman", 'none', []],
			hs_Stormcrack: ["雷暴术", "ordinary", ["damage:4", "对一个随从造成 4点伤害，过载：（1）"], 2, "hs_shaman", 'none', ["only:fellow"]],
			hs_BloodToIchor: ["化血为脓", "rare", ["damage:1", "对一个随从造成 1点伤害，如果它依然存活，则召唤一个2/2的泥浆怪。"], 1, "hs_warrior", 'none', ["des:player.SSfellow('泥浆怪');"]],
			hs_BloodWarriors: ["苦战傀儡", "epic", "复制所有受伤的已方随从，并将其置入你的手牌。", 3, "hs_warrior", 'none', []],
			// 抉择选项
			hs_EvolveSpines: ["脊刺异变", "essential", "在本回合中，使你的英雄获得+4攻击力。", 3, "hs_druid", 'none', ["token"]],
			hs_EvolveScales: ["鳞甲异变", "essential", "使你的英雄获得+8护甲值。", 3, "hs_druid", 'none', ["token"]],
			hs_YShaarjsStrength: ["亚煞极之力", "essential", "召唤一个2/2的泥浆怪。", 4, "hs_druid", 'none', ["token"]],
			hs_YoggSaronsMagic: ["尤格萨隆之赐", "essential", "获得一个空的法力水晶。", 4, "hs_druid", 'none', ["token"]],
			hs_ManyWisps: ["小精灵大军", "essential", "召唤7个1/1的小精灵", 7, "hs_druid", 'none', ["token"]],
			hs_BigWisps: ["小精灵之力", "essential", "使你的所有随从获得+2/+2", 7, "hs_druid", 'none', ["token"]],
			// 毒素牌：已完成
			hs_KingsbloodToxin: ["皇血草毒素", "essential", "draw:1", 1, "hs_rogue", 'none', ["token"]],
			hs_FirebloomToxin: ["火焰花毒素", "essential", "damage:2", 1, "hs_rogue", 'none', ["token"]],
			hs_BloodthistleToxin: ["血蓟毒素", "essential", "将一个友方随从移回你的手牌。 它的法力值消耗减少（2）点。", 1, "hs_rogue", 'none', ["token"]],
			hs_BriarthornToxin: ["石南草毒素", "essential", ["buff:A3", "使一个随从获得+3攻击力"], 1, "hs_rogue", 'none', ["token"]],
			hs_FadeleafToxin: ["枯叶草毒素", "essential", "直到你的下个回合，使一个友方随从获得潜行", 1, "hs_rogue", 'none', ["token"]]
		},
		skill: {
			hs_YoggSaronsMagic: {
				async content(event, trigger, player) {
					player.HSF("gainmana", [1]);
				},
			},
			hs_ShadowWordHorror: {
				async content(event, trigger, player) {
					const lucky = player.sctp('mns').filter(fl => fl.ATK <= 2);
					get.HSF('lavaeffect', ['cuihui', lucky, 'lava']);
				},
			},
			hs_CalloftheWild: {
				async content(event, trigger, player) {
					const f = get.hsflt("动物伙伴", "all");
					get.hskachi("all", f, true).forEach(i => player.SSfellow(i));
				},
			},
			hs_BloodWarriors: {
				buffeff: true,
				async content(event, trigger, player) {
					await player.hs_gain(player.getFellow().filter(f => f.HSF("alive") && !f.isHealthy()).sort(lib.sort.attendseq).map(i => i.linkCard[0].name));
				},
			},
			hs_Infest: {
				async content(event, trigger, player) {
					player.sctp("mine", fl => {
						fl.addtriggerbuff(event.card);
					});
				},
				delayeffect: {
					async deathRattle(event, trigger, player) {
						player.hs_gain(get.hskachi("all", get.hsflt("野兽")).randomGet());
					},
				},
			},
			hs_BloodthistleToxin: {
				filterTarget(card, player, target) {
					return player.sctp("mine", target);
				},
				async content(event, trigger, player) {
					const {
						result
					} = await event.target.HSF("backtohand");
					if (result.cards.length) {
						result.cards[0].addhsbuff({
							name: "hs_cost",
							type: "hs_cost",
							value: 2,
							creator: event.cards[0],
							fellow: player,
						});
					}
				},
			},
			hs_FadeleafToxin: {
				filterTarget(c, p, t) {
					return p.sctp("mine", t);
				},
				async content(event, trigger, player) {
					event.target.addgjzbuff("qianxing", 1.1).countphase = player.getOppo();
				},
			},
			hs_RenounceDarkness: {
				// @TODO
				async content(event, trigger, player) {},
			},
			hs_DOOM: {
				async content(event, trigger, player) {
					const willDead = player.sctp("mns");
					get.HSF("lavaeffect", ["cuihui", willDead, "lava"]);
					await player.hs_drawDeck(willDead.length);
				},
			},
			hs_SpreadingMadness: {
				async content(event, trigger, player) {
					player.hs_Missiles(9, true, "all");
				},
			},
			hs_CabalistsTome: {
				async content(event, trigger, player) {
					const result = get.hskachi("HS_spell", (c, i) => i.rnature === "hs_mage").randomGets(3);
					player.hs_gain(result);
				},
			},
			hs_Evolve: {
				async content(event, trigger, player) {
					player.sctp('mine').forEach(item => {
						const cost = item.linkCard[0].cost() + 1;
						const name = get.hskachi("HS_minor", (c, info) => info.cost == cost).randomGet() || event.target.linkCard[0].name;
						item.HSF("convert", [name]);
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
		info: {
			hs_RallyingBlade: ["集结之刃", "rare", "在你召唤一个随从后，使其获得+1/+1，这把武器失去1点耐久度。", 3, "hs_paladin", 3, 2],
			hs_HammerofTwilight: ["暮光神锤", "epic", "亡语：召唤一个4/2的元素随从。", 5, "hs_shaman", 4, 2],
			hs_TentaclesforArms: ["钢铁触须", "epic", "亡语：将这把武器移回你的手牌。", 5, "hs_warrior", 2, 2],
			hs_RustyHook: ["锈蚀铁钩", "essential", "", 1, "hs_warrior", 1, 3, ["token"]],
		},
		skill: {
			hs_RallyingBlade: {
				weaponeffect: {
					summonAfter: {
						self: true,
						randomRT(p, evt) {
							return evt.link;
						},
						async effect(event, trigger, player) {
							event.target.addvaluebuff([1, 1]);
							await event.fellow.hs_dmgrcv(1);
						},
					},
				},
			},
			hs_HammerofTwilight: {
				weaponeffect: {
					deathRattle: {
						async effect(event, trigger, player) {
							player.SSfellow("暮光元素");
						},
					},
				},
			},
			hs_TentaclesforArms: {
				weaponeffect: {
					deathRattle: {
						async effect(event, trigger, player) {
							player.hs_gain("钢铁触须");
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
	cdan: {
		"导演": "尤格-萨隆",
		"副导演": "尤格萨隆的仆从"
	},
};