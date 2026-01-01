import { lib, game, ui, get, ai, _status } from "../../../../../../noname.js";

// @TODO 快两年前的东西了，这里都应该重新写
// 暂时有点懒
export const AV = {
	name: "奥特兰克的决裂",
	en: "AV",
	minor: {
		info: {
			"Humongous Owl": ["巨型猫头鹰", "ordinary", "亡语：随机对一个敌人造成8点伤害", ["HS_effect", "7", "", "wildbeast", "8", "4"]],
			"Dread Imp": ["恐惧小鬼", "essential", "", ["HS_normal", "3", "hs_warlock", "demon", "3", "3"],
				["token"]
			],
			"Icehoof Protector": ["冰蹄护卫", "ordinary", "嘲讽，冻结任何受到该随从伤害的角色。", ["HS_effect", "6", "", "none", "2", "10"]],
			"shadow": ["影子", "essential", "潜行", ["HS_effect", "3", "hs_rogue", "none", "4", "2"],
				["token"]
			],
			"Urzul Giant": ["乌祖尔巨人", "epic", "在本局对战中每有一个友方随从死亡，该牌的法力值消耗便减少（1）点。", ["HS_effect", "13", "hs_demonhunter", "demon", "8", "8"],
				["changecost:return 0"]
			],

		},
		skill: {},
	},
	spell: {
		info: {
			hs_ValleyRoot: ["山谷根植", "essential", "draw:1", 2, "hs_druid", "none", ["token"]],
			hs_IceBlossom: ["冰雪绽放", "essential", "获得一个法力水晶", 2, "hs_druid", "none", ["token"]],
			hs_FelRift: ["邪能裂隙", "essential", "抽到时施放，召唤一个3/3的小鬼。", 3, "hs_warlock", "fel", ["token", "hsdraw:player.SSfellow('hs_DreadImp_monster');"]],
			hs_SeedsofDestruction: ["毁灭之种", "ordinary", "将四张裂隙洗入你的牌库，抽到时召唤一个3/3的小鬼", 2, "hs_warlock", "fel", []],
		},
		skill: {
			hs_SeedsofDestruction: {
				async content(event, trigger, player) {
					player.HSF("addtodeck", [["邪能裂隙", 4]]);
				},
			},
			hs_IceBlossom: {
				async content(event, trigger, player) {
					player.HSF("gainmana", [1]);
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
			hs_TheUnstoppableForce: ["无坚不摧之力", "essential", "在你攻击一个随从后，将其撞向敌方英雄！", 7, "hs_warrior", 5, 2, ["legend", "token"]],
			hs_TheImmovableObject: ["无法撼动之物", "essential", "不会失去耐久度。你的英雄受到的伤害减半，向上取整。", 7, "hs_paladin", 2, 5, ["legend", "token"]],
		},
		skill: {
			hs_TheUnstoppableForce: {
				weaponeffect: {
					attackEnd: {
						direct: true,
						filter(evt, p, f) {
							return evt.player == p && evt.target.isMin();
						},
						async effect(event, trigger, player) {
							// 怎么样让被攻击的随从撞向自己的主人呢
						},
					},
				}
			},
			hs_TheImmovableObject: {
				weaponeffect: {
					attackBegin: {
						direct: true,
						async effect(event, trigger, player) {
							const obj = player.data_weapon.addgjzbuff("wpmianyi");
							obj.temptri = "attack";
							get.HSF("checkfellow");
						},
					},
					hsdmgBegin1: {
						self: true,
						later: 1,
						async effect(event, trigger, player) {
							event.orievt.num = Math.ceil(event.orievt.num / 2);
						},
					},
				}
			}
		},
	},
	// 重写了一点点
	hero: {
		info: {
			hs_BrukanoftheElements: ["元素使者布鲁坎", "legend", "战吼：唤起两种元素之力", 8, "hs_shaman", ["legend"]],
			hs_LightforgedCariel: ["光铸凯瑞尔", "legend", "战吼：对所有敌人造成2点伤害。装备一块2/5的无法撼动之物。", 8, "hs_paladin", ["legend"]],
			hs_MagisterDawngrasp: ["魔导师晨拥", "legend", "战吼：再次施放你在本局对战中施放过的每个法术派系的一个法术。", 7, "hs_mage", ["legend"]],
			hs_BeaststalkerTavish: ["野兽追猎者塔维什", "legend", "战吼：发现并施放两张强化的奥秘牌。", 6, "hs_hunter", ["legend"]],
			hs_XyrellatheDevout: ["虔诚祭司泽瑞拉", "legend", "战吼：触发本局对战中每个阵亡的友方随从的亡语", 8, "hs_priest", ["legend"]],
			hs_ShadowcrafterScabbs: ["迅影匠师斯卡布斯", "legend", "战吼：将所有随从移回双方拥有者的手牌，召唤两个4/2并具有潜行的影子", 8, "hs_rogue", ["legend"]],
			hs_WildheartGuff: ["野性之心古夫", "legend", "战吼：将你的法力值上限变为20、获得一个法力水晶、抽一张牌", 5, "hs_druid", ["legend"]],
			hs_DreadlichTamsin: ["恐惧巫妖塔姆辛", "legend", "战吼：对所有随从造成三点伤害，抽三张牌，将三张裂隙洗入你的牌库", 6, "hs_warlock", ["legend"]],
			hs_TRokaratheValorous: ["勇气战将洛卡拉", "legend", "战吼：装备一把无坚不摧之力", 7, "hs_warrior", ["legend"]],
			hs_KurtrusDemonRender: ["裂魔者库尔特鲁斯", "legend", "战吼：召唤两个1/4并具有突袭的恶魔", 6, "hs_demonhunter", ["legend"]],
		},
		skill: {
			"hs_XyrellatheDevout": {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_XyrellatheDevout");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					// player.classList.remove("minskin");
					player.rkind = "";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ['神圣之触']);
					player.changeHujia(5);
				},
			},
			// 库尔特鲁斯
			"hs_KurtrusDemonRender": {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_KurtrusDemonRender");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					// player.classList.remove("minskin");
					player.rkind = "";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ['陨烬之怒']);
					player.changeHujia(5);
					player.SSfellow(["魔蝠尖啸者", 2]);
				},
			},
			"hs_ShadowcrafterScabbs": {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_ShadowcrafterScabbs");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					// player.classList.remove("minskin");
					player.rkind = "";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ['手法娴熟']);
					player.changeHujia(5);
					player.sctp("mns").sort(lib.sort.attendseq).forEach(fl => {
						fl.HSF("backtohand");
					});
					player.SSfellow(["影子", 2]);
				},
			},
			// 勇气战将洛卡拉
			"hs_TRokaratheValorous": {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_RokaratheValorous");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					// player.classList.remove("minskin");
					player.rkind = "";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ['巨力猛击']);
					player.changeHujia(10);
					player.hs_weapon("无坚不摧之力");
				},
			},
			"hs_LightforgedCariel": {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_LightforgedCariel");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					// player.classList.remove("minskin");
					player.rkind = "";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ['女王的祝福']);
					player.changeHujia(5);
					await get.HSF("bladeeffect", ['opposide', 2, player]);
					player.hs_weapon("无法撼动之物");
				},
			},
			// 古夫
			"hs_WildheartGuff": {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_WildheartGuff");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					// player.classList.remove("minskin");
					player.rkind = "none";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ['培育！']);
					player.changeHujia(5);
					player.HSF('gainmana', [1]);
					await player.hs_drawDeck();
					player.storage.hs_mana_limit = 20;
				},
			},

			"hs_DreadlichTamsin": {
				async content(event, trigger, player) {
					const hp = player.hp;
					const hj = player.hujia;
					player.init("hero_DreadlichTamsin");
					player.hp = hp;
					player.hujia = hj;
					player.clearSkills(true);
					// player.classList.remove("minskin");
					player.rkind = "none";
					player.updatehsfl();
					await player.HSF('changeHeroskill', ['恐惧之链']);
					player.changeHujia(5);
					await get.HSF('bladeeffect', ['damage', 3]);
					player.HSF("addtodeck", [["邪能裂隙", 3]]);
					await player.hs_drawDeck(3);
				},
			},
		},
	},
	location: {
		info: {},
		skill: {},
	},
	cdan: {},
};
