import { lib, game, ui, get, ai, _status } from "../../../../../../noname.js";

export const KAR = {
	name: "卡拉赞之夜",
	en: "KAR",
	// hover: "../../../resource/image/hover/xxx.png",
	minor: {
		info: {
			"Enchanted Raven": ["魔法乌鸦", "ordinary", "", ["HS_normal", "1", "hs_druid", "wildbeast", "2", "2"]],
			"Big Bad Wolf": ["大灰狼", "essential", "", ["HS_normal", "3", "hs_hunter", "wildbeast", "3", "2"],
				["token"]
			],
			"Cat in a Hat": ["绅士豹", "essential", "潜行", ["HS_effect", "3", "hs_hunter", "wildbeast", "4", "2"],
				["token"]
			],
			"Candle": ["蜡烛", "essential", "", ["HS_normal", "1", "hs_warlock", "none", "1", "1"],
				["token"]
			],
			"Steward": ["家仆", "essential", "", ["HS_normal", "1", "hs_neutral", "none", "1", "1"],
				["token"]
			],
			"Teapot": ["茶壶", "essential", "", ["HS_normal", "3", "hs_warlock", "none", "3", "3"],
				["token"]
			],
			"Cellar Spider": ["地窖蜘蛛", "essential", "", ["HS_normal", "3", "hs_neutral", "wildbeast", "1", "3"],
				["token"]
			],
			"Broom": ["扫帚", "essential", "", ["HS_normal", "2", "hs_warlock", "none", "2", "2"],
				["token"]
			],
			"Whelp3": ["雏龙", "essential", "", ["HS_normal", "1", "hs_paladin", "dragon", "1", "1"],
				["token"]
			],
			"Pawn": ["禁卫", "essential", "嘲讽", ["HS_effect", "1", "hs_warrior", "none", "1", "1"],
				["token"]
			],
			"Animated Shield": ["复活的盾牌", "essential", "嘲讽", ["HS_effect", "2", "hs_neutral", "none", "0", "5"],
				["token"]
			],
			"Pompous Thespian": ["自负的演员", "ordinary", "嘲讽", ["HS_effect", "2", "hs_neutral", "none", "3", "2"]],
			"Netherspite Historian": ["虚空幽龙史学家", "ordinary", "战吼：如果你的手牌中有龙牌，便发现一张龙牌", ["HS_effect", "2", "hs_neutral", "none", "1", "3"],
				["rareEff"]
			],
			"Pantry Spider": ["橱柜蜘蛛", "ordinary", "战吼：召唤一个1/3的蜘蛛", ["HS_effect", "3", "hs_neutral", "wildbeast", "1", "3"],
				["battleRoal:地窖蜘蛛"]
			],
			"Arcane Anomaly": ["奥术畸体", "ordinary", "每当你施放一个法术，该随从便获得+1生命值", ["HS_effect", "1", "hs_neutral", "elemental", "2", "1"]],
			"Runic Egg": ["符文蛋", "ordinary", "亡语：抽一张牌。", ["HS_effect", "1", "hs_neutral", "none", "0", "2"]],
			"Violet Illusionist": ["紫罗兰法师", "ordinary", "在你的回合时，你的英雄会获得免疫", ["HS_effect", "3", "hs_neutral", "none", "4", "3"]],
			"Zoobot": ["机械动物管理员", "ordinary", "战吼：随机使一个友方野兽，龙和鱼人获得+1/+1", ["HS_effect", "3", "hs_neutral", "machine", "3", "3"]],
			"Menagerie Magician": ["展览馆法师", "ordinary", "战吼：随即使一个友方野兽，龙和鱼人获得+2/+2", ["HS_effect", "5", "hs_neutral", "none", "4", "4"]],
			"Arcanosmith": ["奥能铁匠", "ordinary", "战吼：召唤一个0/5并具有嘲讽的随从", ["HS_effect", "4", "hs_neutral", "none", "3", "2"],
				["battleRoal:复活的盾牌"]
			],
			"Avian Watcher": ["鸟禽守护者", "rare", "战吼：如果你控制着一个奥秘，则获得+1/+1和嘲讽", ["HS_effect", "5", "hs_neutral", "none", "3", "6"],
				["rareEff"]
			],
			"Book Wyrm": ["书卷之龙", "rare", "战吼：如果你的手牌中有龙牌，消灭一个攻击力小于等于三的敌方随从", ["HS_effect", "6", "hs_neutral", "dragon", "3", "6"],
				["rareEff"]
			],
			"Moat Lurker": ["沟渠潜伏者", "rare", "战吼：消灭一个敌方随从。亡语：重新召唤被消灭的随从", ["HS_effect", "6", "hs_neutral", "none", "3", "3"]],
			"Arcane Giant": ["奥术巨人", "epic", "在本局对战中，你每释放一个法术都会使本随从的法力值消耗减少一点", ["HS_effect", "12", "hs_neutral", "none", "8", "8"]],
			"Moroes": ["莫罗斯", "legend", "潜行。在你的回合结束时，召唤一个1/1的家仆", ["HS_effect", "3", "hs_neutral", "none", "1", "1"],
				["legend", "ending:家仆"]
			],
			"Barnes": ["巴内斯", "legend", "战吼：随机从你的牌库中挑选一个随从，召唤一个1/1的复制。", ["HS_effect", "5", "hs_neutral", "none", "3", "4"],
				["legend"]
			],
			"Prince Malchezaar": ["马克扎尔王子", "legend", "对战开始时：随机将5张传说随从牌置入你的牌库。", ["HS_effect", "5", "hs_neutral", "demon", "5", "6"],
				["legend"]
			],
			"The Curator": ["馆长", "legend", "嘲讽。战吼：从你的牌库中抽一张野兽牌，鱼人牌和龙牌", ["HS_effect", "7", "hs_neutral", "machine", "4", "6"],
				["legend"]
			],
			"Medivh the Guardian": ["麦迪文", "legend", "战吼：装备埃提耶什，守护者的传说之杖。", ["HS_effect", "8", "hs_neutral", "none", "7", "7"],
				["legend", "battleRoal:weapon>'埃提耶什'"]
			],
			"Menagerie Warden": ["展览馆守卫", "ordinary", "战吼：选择一个友方野兽，召唤一个他的复制", ["HS_effect", "6", "hs_druid", "none", "5", "5"]],
			"Kindly Grandmother": ["慈祥的外婆", "ordinary", "亡语：召唤一只3/2的大灰狼", ["HS_effect", "2", "hs_hunter", "wildbeast", "1", "1"],
				["deathRattle:大灰狼"]
			],
			"Cloaked Huntress": ["神秘女猎手", "ordinary", "你的奥秘的法力值消耗为（0）点", ["HS_effect", "3", "hs_hunter", "none", "3", "4"]],
			"Wicked Witchdoctor": ["邪恶的巫医", "ordinary", "每当你释放一个法术，随机召唤一个基础图腾", ["HS_effect", "4", "hs_shaman", "none", "4", "3"]],
			"Priest of the Feast": ["宴会牧师", "ordinary", "每当你释放一个法术，为你的英雄恢复三点生命值", ["HS_effect", "4", "hs_priest", "none", "3", "6"]],
			"Onyx Bishop": ["玛瑙主教", "rare", "战吼：召唤一个本局对战中死亡的随从", ["HS_effect", "5", "hs_priest", "none", "3", "4"]],
			"Medivhs Valet": ["麦迪文的男仆", "ordinary", "战吼：如果你控制着一个奥秘，则造成三点伤害", ["HS_effect", "2", "hs_mage", "none", "2", "3"],
				["rareEff"]
			],
			"Babbling Book": ["呓语魔典", "rare", "战吼：随机将一张法师法术牌置入你的手牌", ["HS_effect", "1", "hs_mage", "none", "1", "1"]],
			"Swashburglar": ["吹嘘海盗", "ordinary", "战吼：随机将一张另一职业牌置入你的手牌", ["HS_effect", "1", "hs_rogue", "none", "1", "1"]],
			"Deadly Fork": ["致命餐叉", "ordinary", "亡语：将一张武器牌置入你的手牌", ["HS_effect", "3", "hs_rogue", "none", "3", "2"]],
			"Ethereal Peddler": ["虚灵商人", "rare", "战吼：如果你的手牌中有其他职业的卡牌，则其法律值消耗减少两点", ["HS_effect", "5", "hs_rogue", "none", "5", "6"],
				["rareEff"]
			],
			"Ivory Knight": ["象牙骑士", "rare", "战吼：发现一张法术牌，为你的英雄恢复等同于其法力值消耗的生命值", ["HS_effect", "6", "hs_paladin", "none", "4", "4"]],
			"Nightbane Templar": ["夜魔骑士", "rare", "战吼：如果你的手牌中有龙牌，则召唤两条1/1的幼龙", ["HS_effect", "3", "hs_paladin", "none", "2", "3"],
				["rareEff"]
			],
			"Malchezaars Imp": ["马克扎尔的小鬼", "ordinary", "每当你弃掉一张牌时，抽一张牌", ["HS_effect", "1", "hs_warlock", "demon", "1", "3"]],
			"Silverware Golem": ["镀银魔像", "rare", "如果你弃掉了这张随从牌，则会召唤他", ["HS_effect", "3", "hs_warlock", "none", "3", "3"]],
		},
		skill: {
			hs_ArcaneAnomaly: {
				useCard: {
					self: true,
					filter: "法术",
					async effect(event, trigger, player) {
						event.fellow.updateSelfBuff([0, 1]);
					},
				},
			},
			hs_WickedWitchdoctor: {
				useCard: {
					self: true,
					filter: "法术",
					async effect(event, trigger, player) {
						player.SSfellow('cdset:图腾');
					},
				},
			},
			hs_PriestoftheFeast: {
				useCard: {
					self: true,
					filter: "法术",
					async effect(event, trigger, player) {
						await player.hs_dmgrcv("recover", 3);
					},
				},
			},
			hs_AvianWatcher: {
				battleRoal: {
					filter(player, card) {
						return player.secrets.length;
					},
					recheck: "filter",
					async effect(event, trigger, player) {
						event.fellow.updateSelfBuff([1, 1]);
						event.fellow.addgjzbuff("chaofeng");
					},
				},
			},
			"hs_MedivhsValet": {
				prompt: "战吼：造成3点伤害。",
				battleRoal: {
					filter(player, card) {
						return player.secrets.length;
					},
					recheck: "filter",
					aifamily: "damage",
					filterTarget: lib.filter.all,
					async effect(event, trigger, player) {
						await target.hs_dmgrcv('damage', event.fellow, 3);
					},
				},
			},
			"hs_BookWyrm": {
				battleRoal: {
					filter: "龙牌",
					randomRT(p) {
						return p.HSF("ranxmfil", [null, t => t.ATK < 4]);
					},
					async effect(event, trigger, player) {
						event.target.HSF("cuihui");
					},
				},
			},
			"hs_NetherspiteHistorian": {
				battleRoal: {
					filter: "龙牌",
					async effect(event, trigger, player) {
						player.hs_discover((ca, info) => info.rkind == "dragon", event.fellow.linkCard[0]);
					},
				},
			},
			"hs_NightbaneTemplar": {
				battleRoal: {
					filter: "龙牌",
					async effect(event, trigger, player) {
						event.fellow.SSfellow("雏龙");
					},
				},
			},
			"hs_CloakedHuntress": {
				numgh: {
					name: "hs_cost",
					value: 0,
					subtype: "final",
					ghfilter(card, fellow, target) {
						return target == fellow.getLeader() && get.subtype(card) == "HS_secret";
					},
				},
			},
			"hs_DeadlyFork": {
				async deathRattle(event, trigger, player) {
					await player.hs_gain(["锋利餐叉"]);
				},
			},
			"hs_BabblingBook": {
				async battleRoal(event, trigger, player) {
					const result = get.hskachi("HS_spell", (c, i) => i.rnature == "hs_mage").randomGet();
					player.hs_gain(result);
				},
			},
			"hs_Swashburglar": {
				async battleRoal(event, trigger, player) {
					const result = get.hskachi("all", (c, i) => i.rnature !== player).randomGet();
					player.hs_gain(result);
				},
			},
			"hs_Barnes": {
				async battleRoal(event, trigger, player) {
					const cs = player.cardPile.getCards("h", {
						type: "HS_minor"
					}).map(i => i.name);
					player.SSfellow(cs.randomGet(), undefined, "冒出", ["复制"]);
				},
			},
			"hs_TheCurator": {
				async battleRoal(event, trigger, player) {
					["wildbeast", "murloc", "dragon"].forEach(item => player.hs_drawDeck2(c => get.rkind(c) === item));
				},
			},
			"hs_OnyxBishop": {
				async battleRoal(event, trigger, player) {
					player.hs_revive();
				},
			},
			"hs_MalchezaarsImp": {
				discard: {
					self: true,
					async effect(event, trigger, player) {
						await player.hs_drawDeck();
					}
				}
			},

		},
	},
	spell: {
		info: {
			hs_MoongladePortal: ["月光林地传送门", "rare", "恢复6点生命值，随机召唤一个法力值消耗为（6）的随从", 6, "hs_druid", 'none', []],
			hs_FirelandsPortal: ["火焰之地传送门", "ordinary", "造成5点伤害，随机召唤一个法力值消耗为（5）的随从", 7, "hs_mage", 'none', []],
			hs_SilvermoonPortal: ["银月城传送门", "ordinary", "使一个随从获得加2+2，随机召唤一个法力值消耗为（2）的随从", 4, "hs_paladin", 'none', []],
			hs_IronforgePortal: ["铁炉堡传送门", "ordinary", "获得4点护甲，随机召唤一个法力值消耗为（4）的随从", 5, "hs_warrior", 'none', []],
			hs_MaelstromPortal: ["大漩涡传送门", "ordinary", "对所有敌方随从造成一点伤害，随机召唤一个法力值消耗为（1）的随从", 2, "hs_shaman", 'none', []],
			hs_Purify: ["净化", "ordinary", ["buff:chengmo", "沉默一个友方随从,抽一张牌"], 2, "hs_priest", 'none', ["draw:1", "sctp:mine"]],
			hs_ProtecttheKing: ["保卫国王", "rare", ["summon:['禁卫',player.sctp('notmine').length]", "战场上每有一个敌方随从，召唤一个1/1并具有嘲讽的近卫"], 3, "hs_warrior", 'none', ["fg"]],
			hs_KaraKazham: ["附灵术", "ordinary", "召唤一个1/1的蜡烛，2/2的扫帚和3/3的茶壶。", 5, "hs_warlock", 'none', []]
		},
		skill: {
			// 月光林地传送门
			hs_MoongladePortal: {
				filterTarget: true,
				selectTarget: 1,
				spellrecover: 6,
				async content(event, trigger, player) {
					await event.target.hs_dmgrcv("recover", 6);
					player.SSfellow("range:6");
				},
			},
			hs_FirelandsPortal: {
				filterTarget: true,
				selectTarget: 1,
				spelldamage: 5,
				async content(event, trigger, player) {
					await event.target.hs_dmgrcv("damage", 5);
					player.SSfellow("range:5");
				},
			},
			hs_SilvermoonPortal: {
				filterTarget(c, p, t) {
					return p.sctp("mns", t);
				},
				async content(event, trigger, player) {
					await event.target.addvaluebuff([2, 2]);
					player.SSfellow("range:2");
				},
			},
			hs_IronforgePortal: {
				async content(event, trigger, player) {
					player.hs_atkhj([0, 4]);
					player.SSfellow("range:4");
				},
			},
			hs_MaelstromPortal: {
				spelldamage: 1,
				async content(event, trigger, player) {
					player.hs_dmgrcv(1, player, event.card, player.sctp("notmine"));
					player.SSfellow("range:1");
				},
			},
			"hs_KaraKazham": {
				async content(event, trigger, player) {
					["蜡烛", "茶壶", "扫帚"].forEach(i => player.SSfellow(i));
				},
			},
		},
	},
	trap: {
		info: {
			hs_CatTrick: ["豹子戏法", "rare", "奥秘：在你的对手释放一个法术后，召唤一个4/2并具有潜行的猎豹", 2, "hs_hunter"],
		},
		skill: {
			hs_CatTrick: {
				secret: {
					useCard: {
						notlink: true,
						filter: "对方回合",
						filter2(evt, p, f) {
							return evt.player == p.getOppo() && get.type(evt.card) == "HS_spell";
						},
						async effect(event, trigger, player) {
							event.obj.blink();
							event.obj.tuichang();
							player.SSfellow("绅士豹");
						},
					},
				},
			},
		},
	},
	weapon: {
		info: {
			hs_FoolsBane: ["愚者之灾", "ordinary", "每个回合攻击次数不限，但不能攻击英雄", 5, "hs_warrior", 3, 4],
			hs_SpiritClaws: ["幽灵之爪", "ordinary", "当你拥有法术伤害时，获得+2攻击力", 1, "hs_shaman", 1, 3],
			hs_SharpFork: ["锋利餐叉", "essential", "", 3, "hs_rogue", 3, 2, ["token"]],
			hs_Atiesh: ["埃提耶什", "essential", "在你施放一个法术后，随机召唤一个法力值消耗相同的随从。 失去1点耐久度。", 3, "hs_neutral", 1, 3, ["token", "legend"]],
		},
		skill: {
			hs_FoolsBane: {
				weaponeffect: {},
			},
			hs_SpiritClaws: {
				weaponeffect: {
					numgh: {
						name: "value",
						value: [2, 0],
						wpal: true,
						range(f, tg) {
							return tg.swt && f.getLeader() == tg.getLeader();
						},
						ghfilter(card, fellow, target) {
							return fellow.sctp("mine").filter(fl => fl.countFq() > 0);
						},
					},
				},
			},
			hs_Atiesh: {
				weaponeffect: {
					useCard: {
						self: true,
						filter: "法术",
						async effect(event, trigger, player) {
							const num = event.evt.usingcost;
							event.fellow.SSfellow(`range:${num}`);
							await event.fellow.hs_dmgrcv(1);
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