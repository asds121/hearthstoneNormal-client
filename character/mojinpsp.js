'use strict';
game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'mojinpsp',
		connect:true,
		characterSort:{},
		character:{
			"dmrw_misakamikoto": ["female", "qun", 3, ["dmrw_dianjia", "dmrw_shabian", "dmrw_chaopao"]],
			"dmrw_kamijoutouma": ["male", "qun", 4, ["dmrw_huanxiang", "dmrw_shashou", "dmrw_buxing"]],
			"dmrw_misakaimouto": ["female", "qun", 3, ["dmrw_saoshe", "dmrw_zhuangtian", "dmrw_zengyuan"]],
			"dmrw_stiylmagnus": ["male", "qun", 3, ["dmrw_sanfu", "dmrw_yanjian", "dmrw_yanmo"]],
			"dmrw_AquaoftheBack": ["male", "shen", 5, ["dmrw_jujian", "dmrw_lianzhan", "dmrw_bushu", "dmrw_qiangzhan"]],
			"dmrw_sasha": ["female", "qun", 3, ["dmrw_chuiju", "dmrw_mopu", "dmrw_jianglin"]],
			"dmrw_muginoshizuri": ["female", "qun", 3, ["dmrw_kuangao", "dmrw_kuosan", "dmrw_lipao"]],
			"dmrw_shiraikuroko": ["female", "qun", 3, ["dmrw_gangshi", "dmrw_shunti", "dmrw_fanji"]],
			"dmrw_accelerator": ["none", "qun", 3, ["dmrw_fanshe", "dmrw_shikong", "dmrw_heiyi"]],
			"dmrw_kanzakikaori": ["female", "shen", 4, ["dmrw_qidao", "dmrw_qiaoji", "dmrw_qishan", "dmrw_weishan"]],
			"dmrw_itsuwa": ["female", "qun", 3, ["dmrw_qijiao", "dmrw_fuqiang", "dmrw_qiren"]],
		},
		characterIntro:{
			dmrw_misakamikoto:'《魔法禁书目录》中的人物及《科学超电磁炮》的主人公。学园都市中仅有的七名超能力者中排名第三位，学园都市最强“电击使”，代号“超电磁炮”。贵族女校常盘台中学二年级学生，有“常盘台的王牌”和“最强无敌的电击公主”之称。性格好胜、正义感强，有着男孩子般的爽朗性格，但是却没有耐心，非常不坦率。',
			dmrw_kamijoutouma:'《魔法禁书目录》中的主人公。就读于学园都市某高中，刺猬头发型的高中生。都市传说中“拥有能将任何能力无效化的能力的男人”的真身，其寄宿“幻想杀手”的右手有着不论善恶，让一切超能力消失的特异能力。有着但凡遇到有烦恼的人都会伸出援手的性格。爱华斯评价他是“未受过任何人指导，仅遵循自己内心涌现的感情勇往直前之人”。',
			dmrw_misakaimouto:'轻小说《魔法禁书目录》及其外传漫画《科学超电磁炮》中人物。学园都市排名第三的超能力者御坂美琴的克隆体，借由美琴的DNA图谱诞生，超过20000名。原用于“量产型能力者计划”，后在“绝对能力者进化计划”实验中作为一方通行的杀戮对象，被杀死超过1万名。通过相同脑电波（AIM力场）与其他妹妹们的大脑相连接构筑“御坂网络”，达到信息共享。拥有和素体御坂美琴同样的外貌，两者的区别是头上是否戴着军用夜视镜。瞳孔暗淡无光，表情变化少，有着不经心和不用心的性格。',
			dmrw_stiylmagnus:'《魔法禁书目录》中的人物。英国清教特殊部队“必要之恶教会”所属的符文魔法师。完全解析现存的24个符文文字、更开发了6个具有新力量的符文文字的天才魔法师，其中最擅长火焰魔法。年纪只有14岁，身高却超过2米。染成红色的及肩长发、右眼下条形码一样的刺青是其特征。非常爱抽烟，断言“没有尼古丁和焦油的世界是地狱”的重度烟枪。',
			dmrw_AquaoftheBack:'后方之水，本名威廉·奥维尔，《魔法禁书目录》中的人物。罗马正教最暗部“神之右席”成员，具有“神之力”加百列的性质。世界上不到二十名的“圣人”之一，而且是兼具“神子”和“圣母”双重性质的“特殊圣人”，拥有极为恐怖的力量。有别于普通的“神之右席”，他能随心所欲地施行一般魔法。魔法名为“Flere210（改变眼泪理由的人）”，以佣兵的身份一边游走战场，一边挥舞巨剑即灵装“阿斯卡隆”，把许多人从不可理喻的悲剧中拯救出来。',
			dmrw_sasha:'轻小说《魔法禁书目录》中的人物。俄罗斯成教特殊部队“歼灭白书”所属的战斗修女。负责消灭人类之外的“不应该存在的东西”。身材娇小、金色长发、被紧身拘束衣包裹着娇美身材的少女。容貌虽然可爱，但是性格冷漠，刘海盖住了大部分的脸孔，唯一露出的是她的樱唇。对话时总以“问题N”、“解答N”开头，偶尔会有“补充N”、“私人看法N”的开头。“天使坠落”事件中身体曾被替换予大天使“神之力”加百列，其身体内被注入大天使的力量。事件后，虽然已恢复但似乎身体产生了特殊变化，一旦靠近他人的魔力和灵装，她就会感到胸口有种压迫感。',
			dmrw_muginoshizuri:'《魔法禁书目录》及其外传《科学超电磁炮》中人物。拥有高挑修长的身材，蓬松的茶色头发的少女，统帅暗部组织“道具”的女王，学园都市排名第四位的超能力者。能力名为“原子崩坏”，能随意释放出连同遮蔽物和对方身体一起贯穿的炮击，但同时具有“能力规模很庞大，但是却很难控制”的特点。',
			dmrw_shiraikuroko:'白井黑子，《魔法禁书目录》及其外传《某科学的超电磁炮》主要人物。学园都市中名校常盘台中学的一年级生，御坂美琴的学妹兼室友，能力为Level 4的空间移动，双马尾茶色头发的少女。平常举止都很“淑女”，句尾有“~ですの（是哦）”的独特大小姐腔调。非常仰慕御坂美琴，甚至到近乎变态的程度，称呼美琴为“姐姐大人”。喜欢冲击力极强、布料很少的泳衣和内衣裤。身为风纪委员，具有很强的责任感和正义感。',
			dmrw_accelerator:'一方通行，日本轻小说《魔法禁书目录》及其衍生作品中的主角，学园都市仅有的七名超能力者（Level 5）排名第一位，性别不明，能力为“矢量操作”，代号“一方通行”。能够操控能量方向，只要经过皮肤碰触，就可以自由操纵动能、热能、电能等所有能量的方向，可以反射一切物理攻击。为了从“最强”成为“无敌”，曾经参加了“绝对能力者进化计划”的实验。因为在8月31日的事件中头部受伤，现在只能靠项圈型电极配合御坂网络的运算支援，才能使用超能力。',
			dmrw_kanzakikaori:'《魔法禁书目录》中的人物。英国清教特殊部队“必要之恶教会”所属、伦敦排名前十的魔法师，“天草式十字凄教”前女教皇。世界上不到二十名的“圣人”之一。拥有自由操控其腰间令刀“七天七刀”的卓越剑术、最擅长配合魔法的肉体强化的白兵战。',
			dmrw_itsuwa:'五和，“天草式十字凄教”所属的魔法师。黑发及肩的少女，双眼皮是她的醒目特征。性格腼腆温和。爱慕上条当麻，却因个性保守无法做出大胆行动，经常为此碎碎念。使用“海军用船上枪”作为武器，和神裂一样懂得使用钢丝来布成魔法阵“七教七刃”。',
		},
		perfectPair:{},
		skill:{
			_dmrw_enhance_zhu: {
				trigger: {
					global: "gameStart",
				},
				charlotte: true,
				silent: true,
				firstDo: true,
				filter(event, player) {
					return game.players.length > 4 && player == game.zhu;
				},
				async content(event, trigger, player) {
					game.zhu.changeHujia(3);
				},
			},
			dmrw_dianjia: {
				trigger: {
					global: "damageEnd",
				},
				filter(event, player) {
					return event.hasNature('thunder');
				},
				usable: 2,
				forced: true,
				async content(event, trigger, player) {
					player.chooseDrawRecover(true);
				},
				mod: {
					cardnature(card, player) {
						if (get.name(card) == 'sha' && card.nature) return "thunder";
					},
				},
				ai: {
					thunderAttack: true,
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "thunderDamage")) return 0.1;
						},
					},
				},
			},
			dmrw_shabian: {
				mod: {
					targetInRange(card, player, target) {
						if (get.name(card) == 'sha' && !game.hasNature(card)) {
							if (get.distance(player, target) <= 2) return true;
						}
					},
					cardUsable(card, player, num) {
						if (get.name(card) == 'sha' && !game.hasNature(card)) {
							if (player.getHistory("sourceDamage", evt => {
									return evt.hasNature("thunder");
								}).length > 0) return num + 1;
						}
					},
				},
			},
			dmrw_chaopao: {
				group: ["dmrw_chaopao_a", "dmrw_chaopao_b"],
				subSkill: {
					a: {
						priority: 1,
						silent: true,
						forced: true,
						popup: false,
						firstDo: true,
						charlotte: true,
						trigger: {
							player: "useCard1",
						},
						filter(event, player) {
							return event.card && event.card.storage.dmrw_chaopao;
						},
						async content(event, trigger, player) {
							const num = trigger.cards.length;
							if (num == 3) player.$skill('超炮', 'epic', 'thunder', true);
							trigger.baseDamage = num;
						},
						mod: {
							targetInRange(card, player, target, now) {
								if (card.storage && card.storage.dmrw_chaopao) return true;
							},
						},
					},
					b: {
						priority: 1,
						silent: true,
						forced: true,
						popup: false,
						firstDo: true,
						charlotte: true,
						trigger: {
							player: "useCardToPlayered",
						},
						filter(event, player) {
							return event.card && event.card.storage && event.card.storage.dmrw_chaopao && event.cards && event.cards.length > 1;
						},
						async content(event, trigger, player) {
							const num = trigger.cards.length;
							const tg = trigger.target;
							if (num >= 2) tg.addTempSkill('dmrw_chaopao_c', {
								global: "useCardAfter"
							});
							if (num == 3) tg.addTempSkill('fengyin', {
								global: "useCardAfter"
							});
						},
						ai: {
							ignoreSkill: true,
							skillTagFilter: function(player, tag, arg) {
								if (!arg || arg.isLink || !arg?.card?.name != "sha" || !arg?.card?.storage.dmrw_chaopao || !arg.card?.cards.length < 3) return false;
								if (!arg.target || get.attitude(player, arg.target) >= 0) return false;
								if (!arg.skill || !lib.skill[arg.skill] || lib.skill[arg.skill].charlotte || lib.skill[arg.skill].persevereSkill || !arg.target.getSkills(true, false).includes(arg.skill)) return false;
							},
						},
					},
					c: {
						mark: true,
						marktext: "电",
						charlotte: true,
						intro: {
							name: "麻痹",
							content: "不能使用【闪】",
						},
						mod: {
							cardEnabled2(card) {
								if (get.name(card) == "shan") return false;
							},
						},
					},
				},
				mod: {
					aiValue(player, card, num) {
						if (get.type(card) != "basic" || get.color(card) != "red") return;
						const cards = player.getCards("hs", card => get.type(card) == "basic" && get.color(card) == "red");
						cards.sort((a, b) => ((get.name(a) == 'sha') ? 1 : 2) - (get.name(b) == 'sha' ? 1 : 2));
						const geti = () => {
							if (cards.includes(card)) return cards.indexOf(card);
							return cards.length;
						};
						return Math.max(num, [6.5, 4, 3, 2][Math.min(geti(), 2)]);
					},
					aiUseful() {
						return lib.skill.dmrw_chaopao.mod.aiValue.apply(this, arguments);
					},
				},
				enable: "chooseToUse",
				filter(event, player) {
					return player.countCards('hs', function(card) {
						return get.type(card) == "basic" && get.color(card) == "red";
					}) > 0;
				},
				viewAsFilter(player) {
					return player.countCards('hs', function(card) {
						return get.type(card) == "basic" && get.color(card) == "red";
					}) > 0;
				},
				selectCard: [1, 3],
				position: "hs",
				filterCard(card) {
					return get.type(card) == "basic" && get.color(card) == "red";
				},
				check() {
					return 1;
				},
				viewAs: {
					name: "sha",
					nature: "thunder",
					storage: {
						"dmrw_chaopao": true,
					},
				},
				prompt: "将X张红色基本牌当无视距离且基础伤害为X的雷杀使用",
				ai: {
					threaten: 6,
					order() {
						return get.order({
							name: "sha"
						}) + 0.1;
					},
					respondSha: true,
					skillTagFilter(player, tag, arg) {
						if (arg != 'use') return false;
						return player.countCards('hs', function(card) {
							return get.type(card) == "basic" && get.color(card) == "red";
						}) > 0;
					},
				},
			},
			dmrw_huanxiang: {
				trigger: {
					player: "damageBegin4",
				},
				filter(event, player) {
					return event.hasNature() && event.num <= 2 || !event.card || !['sha', 'juedou'].includes(get.name(event.card));
				},
				forced: true,
				async content(event, trigger, player) {
					trigger.cancel();
				},
				mod: {
					targetEnabled(card, player, target, now) {
						if (!['sha', 'tao', 'juedou'].includes(get.name(card))) return false;
					},
					aiValue(player, card, num) {
						if (get.type(card) != 'equip' && !['wuzhong', 'taoyuan', 'wugu', 'jiedao', 'shandian'].includes(get.name(card))) return;
						return 0;
					},
					aiUseful() {
						return lib.skill.dmrw_huanxiang.mod.aiValue.apply(this, arguments);
					},
				},
				ai: {
					nofire: true,
					nothunder: true,
					nonature: true,
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "fireDamage")) return [0, 0, 0, 0];
							if (get.tag(card, "thunderDamage")) return [0, 0, 0, 0];
							if (get.tag(card, "iceDamage")) return [0, 0, 0, 0];
							if (get.tag(card, "damage") && card.nature) return 0.5;
						},
					},
				},
			},
			dmrw_shashou: {
				group: ["dmrw_shashou_a", "dmrw_shashou_b"],
				subSkill: {
					a: {
						trigger: {
							player: "useCard",
						},
						filter(event, player) {
							return get.name(event.card) == 'sha' && player.num('he');
						},
						async cost(event, trigger, player) {
							let go = true;
							if (trigger.addCount === false) go = false;
							if (!player.hasSkill("paoxiao") && !player.hasSkill("tanlin3") && !player.hasSkill("zhaxiang2") && !player.hasSkill("fengnu") && !player.getEquip("zhuge")) go = player.countCards("h", "sha") > 0 || player.countCards('he', ca => get.value(ca) < 3) > 1;
							else go = false;
							const next = player.chooseToDiscard("弃置一张牌令此【杀】不计入次数限制。", "he", 1);
							next.set("ai", function(card) {
								if (player.num('h') == 1) return 1;
								if (_status.event.go) {
									if (get.name(card) == 'sha') return 0;
									return 8 - get.value(card);
								}
								return 0;
							});
							next.set("go", go);
							event.result = await next.forResult();
						},
						async content(event, trigger, player) {
							if (trigger.addCount !== false) {
								trigger.addCount = false;
								player.getStat().card.sha--;
							}
							if (player.num("h") == 0) {
								trigger.dmrw_shashou = true;
								trigger.effectCount++;
							}
						},
					},
					b: {
						trigger: {
							player: "shaBegin",
						},
						direct: true,
						filter(event, player) {
							return event.getParent("useCard")?.dmrw_shashou && event.getParent("useCard").effectedCount == 2;
						},
						async content(event, trigger, player) {
							player.$skill('杀手', 'epic', 'metal', true);
						},
					},
				},
				trigger: {
					player: "phaseDrawEnd",
				},
				frequent: true,
				async content(event, trigger, player) {
					await player.drawTo(4);
					const result = await player.chooseCard(get.prompt("dmrw_shashou"), "重铸任意张手牌", "h", [1, Infinity], (card, player) => player.canRecast(card))
						.set("ai", card => {
							if (get.type(card) == "equip") return 6;
							if (["jiu", "wuzhong", "shandian"].includes(get.name(card))) return 6;
							return 0;
						})
						.forResult();
					if (result.bool) await player.recast(result.cards);
				},
				mod: {
					globalFrom(from, to, distance) {
						return distance - 1;
					},
				},
			},
			dmrw_buxing: {
				global: "dmrw_buxing_a",
				subSkill: {
					a: {
						enable: "phaseUse",
						usable: 1,
						filter(event, player) {
							return player.num('h') >= 3 && game.hasPlayer(target => {
								return target.hasSkill("dmrw_buxing") && player.canUse({
									name: "sha",
									isCard: true
								}, target);
							});
						},
						selectCard: 3,
						check() {
							return 1;
						},
						filterCard: true,
						filterTarget(card, player, target) {
							return target.hasSkill("dmrw_buxing") && player.canUse({
								name: "sha",
								isCard: true
							}, target);
						},
						prompt: "弃置3张手牌，然后视为对上条当麻使用一张杀",
						async content(event, trigger, player) {
							const tg = event.target;
							player.addTempSkill("baiban");
							player.useCard({
								name: "sha",
								isCard: true
							}, tg);
						},
						ai: {
							order: 1,
							result: {
								player(player, target) {
									if (player.num('h') < 5) return -30;
									else return 0.01 * get.effect(target, {
										name: "sha",
										isCard: true
									}, player, player);
								},
								target(player, target) {
									return get.effect(target, {
										name: "sha",
										isCard: true
									}, player, target);
								},
							},
						},
					},
				},
				ai: {
					neg: true,
				},
			},
			dmrw_saoshe: {
				trigger: {
					player: "phaseJieshuBegin",
				},
				forced: true,
				filter(event, player) {
					return player.countUsed('sha') >= 2 && get.discardPile(function(card) {
						return ['sha', 'shan'].includes(get.name(card));
					});
				},
				async content(event, trigger, player) {
					const num = Math.floor(player.countUsed('sha') / 2);
					const cards = Array.from(ui.discardPile.childNodes).filter(function(card) {
						return ['sha', 'shan'].includes(get.name(card));
					});
					const num2 = Math.min(num, cards.length);
					const {
						result
					} = await player.chooseCardButton('扫射：获得最多' + get.cnNumber(num2) + '张【杀】或【闪】', num2, cards, true);
					await player.gain(result.links, 'gain2');
				},
				mod: {
					targetEnabled(card, player, target, now) {
						if (get.subtype(card) == 'equip1') return false;
					},
					cardnature(card, player) {
						if (get.name(card) == 'sha') return false;
					},
					cardUsable(card, player, num) {
						if (get.name(card) == 'sha') return Infinity;
					},
					targetInRange(card, player, target, now) {
						if (get.name(card) == 'sha') return true;
					},
					playerEnabled(card, player, target) {
						if (get.name(card) == 'sha' && player.getHistory('useCard', function(evt) {
								return evt.card && get.name(evt.card) == 'sha' && evt.targets && evt.targets.includes(target);
							}).length >= 2) return false;
					},
					aiValue(player, card, num) {
						if (get.subtype(card) != 'equip1' && get.name(card) != 'sha') return;
						if (get.subtype(card) == 'equip1') return 0;
						if (player.isPhaseUsing() && get.name(card) == 'sha') return num + 5;
						return;
					},
					aiUseful() {
						return lib.skill.dmrw_saoshe.mod.aiValue.apply(this, arguments);
					},
				},
			},
			dmrw_zhuangtian: {
				enable: "phaseUse",
				usable: 1,
				selectCard: 2,
				position: "he",
				filter(event, player) {
					return player.num('he') >= 2;
				},
				filterCard: true,
				check(card) {
					if (get.name(card) == 'shan') return 0.1;
					return 6 - get.useful(card);
				},
				async content(event, trigger, player) {
					const cards = get.cards(6);
					game.cardsGotoOrdering(cards);
					await player.showCards(cards, get.translation(player) + "发动了装填");
					const gains = cards.filter(card => get.name(card) == 'sha');
					if (gains.length) player.gain(gains, 'gain2');
					else player.draw(2);
				},
				ai: {
					order() {
						return get.order({
							name: "sha"
						}) + 0.1;
					},
					result: {
						player: 1,
					},
				},
			},
			dmrw_zengyuan: {
				derivation: "dmrw_zengyuan_faq",
				mark: true,
				marktext: "援",
				intro: {
					name: "御坂网络",
					content(storage, player) {
						if (player.storage.dmrw_zengyuan_used.length) return '已增援：' + player.storage.dmrw_zengyuan_used.join('、');
						else return '别急，下一波增援还在冷却中！';
					},
				},
				init(player, skill) {
					player.addMark('dmrw_zengyuan', 4, false);
					player.storage.dmrw_zengyuan_used = [];
					player.storage.dmrw_zengyuan_list = [1, 2, 3].randomSort();
				},
				trigger: {
					global: "phaseAfter",
				},
				direct: true,
				async content(event, trigger, player) {
					player.removeMark('dmrw_zengyuan', 1, false);
					if (!player.countMark('dmrw_zengyuan')) {
						player.addMark('dmrw_zengyuan', 4, false);
						const {
							result
						} = await player.chooseTarget('增援：令一名其他角色随机执行一个【偷袭】效果', function(card, player, target) {
							return player != target;
						}).set('ai', function(target) {
							let eff = -get.attitude(player, target);
							if (eff <= 0) return 0;
							else {
								if (player.storage.dmrw_zengyuan_used.length == 2) {
									if (!player.storage.dmrw_zengyuan_used.includes('偷袭1')) {
										if (target.num('h') == 1) eff++;
									} else if (!player.storage.dmrw_zengyuan_used.includes('偷袭2')) {
										if (target.num('e') == 1) eff++;
									} else {
										if (target.num('h') <= 1) eff += 2 - target.num('h');
									}
								}
								return eff;
							}
						});
						if (result.bool) {
							const target = result.targets[0];
							player.logSkill('dmrw_zengyuan', target);
							const num = player.storage.dmrw_zengyuan_used.length;
							const name = '偷袭' + player.storage.dmrw_zengyuan_list[num];
							player.storage.dmrw_zengyuan_used.add(name);
							player.markSkill('dmrw_zengyuan');
							await event.insert(lib.skill.dmrw_zengyuan_faq[name], {
								player,
								target,
							});
							if (num == 2) {
								player.storage.dmrw_zengyuan_used = [];
								player.storage.dmrw_zengyuan_list = [1, 2, 3].randomSort();
								player.$skill('增援', 'epic', 'thunder', true);
								await player.draw(3);
								player.markSkill('dmrw_zengyuan');
							}
						}
					}
				},
			},
			dmrw_zengyuan_faq: {
				async 偷袭1(event, trigger, player) {
					const tg = event.target;
					if (!tg.num('h')) return;
					const bo = tg.num('h') == 1;
					await tg.randomDiscard('h');
					if (bo) tg.damage().set('card', {
						name: "sha",
						isCard: true
					});
				},
				async 偷袭2(event, trigger, player) {
					const tg = event.target;
					if (!tg.num('e')) return;
					const bo = tg.num('e') == 1;
					await tg.randomDiscard('e');
					if (bo) tg.damage().set('card', {
						name: "sha",
						isCard: true
					});
				},
				async 偷袭3(event, trigger, player) {
					const tg = event.target;
					const {
						result
					} = await tg.chooseToRespond('偷袭：请打出一张【杀】或【闪】，否则受到一点【杀】的伤害。', function(card) {
						return ['sha', 'shan'].includes(get.name(card));
					}).set('ai', function(card) {
						if (get.damageEffect(tg, player, tg) >= 0) return 0;
						if (tg.hasSkillTag("noShan")) return -1;
						return get.order(card);
					});
					if (!result.bool) tg.damage().set('card', {
						name: "sha",
						isCard: true
					});
				},
			},
			dmrw_sanfu: {
				group: ["dmrw_sanfu_a", "dmrw_sanfu_b"],
				subSkill: {
					a: {
						trigger: {
							player: "loseAfter",
							global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
						},
						forced: true,
						filter(event, player) {
							if (_status.currentPhase == player) return false;
							const evt = event.getl(player);
							return evt && evt.player == player && evt.hs && evt.hs.length > 0 && player.countMark("dmrw_sanfu") > 0;
						},
						async content(event, trigger, player) {
							await player.removeMark("dmrw_sanfu");
						},
						ai: {
							threaten: 6,
						},
					},
					b: {
						trigger: {
							player: "damageBegin4",
						},
						filter(event, player) {
							return player.countMark("dmrw_sanfu") >= 3;
						},
						forced: true,
						async content(event, trigger, player) {
							player.removeMark("dmrw_sanfu", 3);
							trigger.cancel();
							await player.draw();
							if (trigger.hasNature("fire")) await player.draw();
						},
						ai: {
							effect: {
								target(card, player, target) {
									if (target.countMark("dmrw_sanfu") >= 3) {
										if (get.tag(card, 'damage')) return 0.1;
									}
								},
							},
						},
					},
				},
				mark: true,
				marktext: "符",
				init(player) {
					player.addMark("dmrw_sanfu");
				},
				intro: {
					content: "你现在共设置了#枚“符”",
				},
				trigger: {
					player: "useCard",
					source: "damageSource",
				},
				forced: true,
				usable: 4,
				filter(event, player) {
					if (event.name != "damage") {
						if (get.tag(event.card, "damage")) return false;
					}
					return player.countMark("dmrw_sanfu") < 6;
				},
				async content(event, trigger, player) {
					player.addMark("dmrw_sanfu");
				},
			},
			dmrw_yanjian: {
				trigger: {
					player: "useCard",
				},
				forced: true,
				filter(event, player) {
					return event.card && get.name(event.card) == 'sha' && player.countMark("dmrw_sanfu") >= 4;
				},
				async content(event, trigger, player) {
					const num = player.countMark("dmrw_sanfu");
					trigger.directHit.addArray(game.players);
					if (player.countMark("dmrw_sanfu") >= 5) {
						for (const tg of trigger.targets) {
							tg.link(true);
						}
					}
					if (num == 6) {
						if (typeof trigger.baseDamage != "number") trigger.baseDamage = 1;
						trigger.baseDamage++;
					}
				},
				mod: {
					cardnature(card, player) {
						if (get.name(card) == 'sha' && player.countMark("dmrw_sanfu") >= 1) return 'fire';
					},
					targetInRange(card, player, target, now) {
						if (get.name(card) == 'sha' && player.countMark("dmrw_sanfu") >= 2) return true;
					},
					cardUsable(card, player, num) {
						if (get.name(card) == 'sha' && player.countMark("dmrw_sanfu") >= 3) return num + 1;
					},
				},
				ai: {
					combo: "dmrw_sanfu",
					fireAttack: true,
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						const num = player.countMark("dmrw_sanfu");
						if (tag == 'fireAttack') {
							if (num < 1) return false;
						} else {
							if (get.attitude(player, arg.target) > 0 || arg.card.name != "sha" || num < 4) return false;
						}
					},
				},
			},
			dmrw_yanmo: {
				trigger: {
					player: "phaseUseEnd",
				},
				frequent: true,
				filter(event, player) {
					return player.getHistory('sourceDamage').length > 0 && player.countMark("dmrw_sanfu") >= 5;
				},
				async cost(event, trigger, player) {
					const num = Math.min(3, Math.max(player.getHistory('sourceDamage').length - 1, 1));
					event.result = await player.chooseTarget('对一名其他角色造成' + num + '点火焰伤害', function(card, player, target) {
						return player != target;
					}).set('ai', function(target) {
						return get.damageEffect(target, player, player, 'fire');
					}).forResult();
				},
				async content(event, trigger, player) {
					const num = Math.min(3, Math.max(player.getHistory('sourceDamage').length - 1, 1));
					const tg = event.targets[0];
					player.$skill('猎魔之王', 'epic', 'fire', true);
					game.log(player, '对', tg, '发动了', '#g【炎魔】');
					player.line(tg, 'fire');
					tg.damage(num, 'fire');
				},
				ai: {
					combo: "dmrw_sanfu",
				},
			},
			dmrw_jujian: {
				mod: {
					targetEnabled(card, player, target) {
						if (get.subtype(card) == "equip1") {
							const info = get.info(card);
							if (!(info && info.distance && info.distance.attackFrom == -1)) return false;
						}
					},
					attackRangeBase(player) {
						return 3;
					},
					cardEnabled(card, player) {
						if (get.name(card) == "sha") {
							if (player.getHistory("useCard", function(evt) {
									return evt.isPhaseUsing(player) && get.type(evt.card) == "trick";
								}).length > 0) return false;
						} else if (get.type(card) == "trick") {
							if (player.getHistory("useCard", function(evt) {
									return evt.isPhaseUsing(player) && get.name(evt.card) == "sha";
								}).length > 0) return false;
						}
					},
				},
				ai: {
					effect: {
						player_use(card, player) {
							if (get.name(card) == "wuxie") return;
							if (get.type(card) == "trick" && player.num('h', 'sha')) {
								return [0, -2];
							}
							if (get.name(card) == "jiu" && player.num('h', 'sha') && player.hasValueTarget({
									name: "sha"
								})) return [1, 10];
						},
					},
				},
			},
			dmrw_lianzhan: {
				group: "dmrw_lianzhan_a",
				subSkill: {
					a: {
						trigger: {
							player: "shaMiss",
						},
						filter(event, player) {
							const evt = event.getParent();
							return evt.dmrw_lianzhan && evt.effectCount == 2 && evt.effectedCount == 1 && !event.target.hasSkill("dmrw_lianzhan_b");
						},
						silent: true,
						charlotte: true,
						async content(event, trigger, player) {
							const tg = trigger.target;
							trigger.getParent().excluded.push(tg);
							tg.addTempSkill("dmrw_lianzhan_b");
						},
						mod: {
							playerEnabled(card, player, target) {
								if (get.name(card) == 'sha') {
									if (target.hasSkill("dmrw_lianzhan_b")) return false;
								}
							},
						},
					},
					b: {
						mark: true,
						marktext: "躲",
						intro: {
							name: "躲开",
							content: "你躲开了后方之水的利刃，安全了",
						},
						charlotte: true,
					},
				},
				trigger: {
					player: "useCardToPlayered",
				},
				forced: true,
				priority: 1,
				filter(event, player) {
					return get.name(event.card) == 'sha';
				},
				async content(event, trigger, player) {
					trigger.getParent().dmrw_lianzhan = true;
					trigger.getParent().effectCount++;
					game.log(trigger.card, "额外结算一次");
				},
				mod: {
					cardUsable(card, player, num) {
						if (get.name(card) == 'sha' && num >= 0) return 3;
					},
				},
			},
			dmrw_bushu: {
				group: ["dmrw_bushu_a", "dmrw_bushu_b"],
				subSkill: {
					a: {
						trigger: {
							global: "useCard",
						},
						filter(event, player) {
							if (event.player == player) return false;
							const cards = player.getExpansions("dmrw_bushu");
							return cards.length > 0 && cards.some(ca => {
								return get.suit(ca) == get.suit(event.card);
							});
						},
						logTarget: "player",
						prompt(event, player) {
							return "布术：是否无效" + get.translation(event.player) + "的" + get.translation(event.card) + "？";
						},
						check(event, player) {
							return get.attitude(player, event.player) < 0;
						},
						async content(event, trigger, player) {
							trigger.all_excluded = true;
							const cards = player.getExpansions("dmrw_bushu");
							await player.loseToDiscardpile(cards);
							if (cards.length == 3) trigger.player.damage();
						},
					},
					b: {
						trigger: {
							player: "damageEnd",
						},
						filter(event, player) {
							return player.getExpansions("dmrw_bushu").length > 0;
						},
						forced: true,
						async content(event, trigger, player) {
							await player.loseToDiscardpile(player.getExpansions("dmrw_bushu"));
						},
					},
				},
				marktext: "术",
				intro: {
					content: "expansion",
					markcount: "expansion",
				},
				onremove(player, skill) {
					const cards = player.getExpansions(skill);
					if (cards.length) player.loseToDiscardpile(cards);
				},
				trigger: {
					global: "phaseUseBegin",
				},
				filter(event, player) {
					return player.getExpansions("dmrw_bushu").length < 3 && player.num("he") > 0;
				},
				async cost(event, trigger, player) {
					const num = Math.min(3 - player.getExpansions("dmrw_bushu").length, player.num("he"));
					const go = (trigger.player == player || player.countCards("he", function(card) {
						return 6 - get.value(card);
					}) >= num) && player.num("he") >= 4;
					event.result = await player.chooseCard(get.prompt("dmrw_bushu"), "he", [1, num]).set('ai', function(card) {
						if (get.name(card) == 'jiu') return 0;
						if (get.name(card) == 'sha') {
							if (player.countCards("h", ca => {
									return get.name(ca) == 'sha' && !ui.selected.cards.includes(ca);
								}) > 2) return 1;
							else return 0;
						}
						if (get.type(card) == "equip") {
							if (["equip2", "equip3"].includes(get.subtype(card))) {
								if (get.position(card) == "e") return 0;
								else return 3;
							} else return 4;
						}
						if (get.type(card) == "trick") {
							if (player.countCards("h", ca => {
									return get.name(ca) == 'sha' && !ui.selected.cards.includes(ca);
								}) > 1) return 2;
						}
						if (go && player.num('h', 'sha') && player.hasValueTarget({
								name: "sha"
							})) return 6 - get.value(card);
						else return -1;
					}).forResult();
				},
				async content(event, trigger, player) {
					const evt = player.addToExpansion(event.cards, player, "giveAuto");
					evt.gaintag.add("dmrw_bushu");
					await evt;
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						if (get.attitude(player, arg.target) > 0 || arg.card.name != "sha") return false;
						else if (!player.getExpansions("dmrw_bushu").length) return false;
					},
				},
			},
			dmrw_qiangzhan: {
				mark: true,
				marktext: "斩",
				intro: {
					content(storage, player) {
						if (!storage) return "你还没结算过【杀】哦";
						else return "本回合你结算过" + get.cnNumber(storage) + "次【杀】";
					},
				},
				trigger: {
					player: "shaBegin",
				},
				skillAnimation: true,
				animationColor: "fire",
				direct: true,
				async content(event, trigger, player) {
					if (player.getHistory("useSkill", evt => {
							return evt.skill == "dmrw_qiangzhan";
						}).length > 0) {
						trigger.cancel();
						return;
					}
					player.addMark("dmrw_qiangzhan", 1, false);
					player.when({
						global: "phaseAfter"
					}).then(() => {
						player.clearMark("dmrw_qiangzhan", false);
					});
					if (player.countMark("dmrw_qiangzhan") >= 3) {
						const tg = trigger.target;
						const {
							result
						} = await player.chooseBool(get.prompt("dmrw_qiangzhan")).set('ai', (event, player) => {
							const tg = _status.event.tg;
							const ca = _status.event.ca;
							const evt = _status.event.evt;
							if (get.effect(tg, ca, player, player) <= 0) return false;
							if (!evt || evt.effectCount == 1) return true;
							return evt.effectedCount == evt.effectCount;
						}).set('tg', trigger.target).set('ca', trigger.card).set('evt', trigger.getParent('useCard'));
						if (result.bool) {
							player.logSkill("dmrw_qiangzhan");
							if (typeof trigger.baseDamage != "number") trigger.baseDamage = 1;
							trigger.baseDamage++;
						}
					}
				},
				ai: {
					effect: {
						player(card, player, target) {
							if (get.name(card) == 'sha') {
								if (player.getHistory("useSkill", evt => {
										return evt.skill == "dmrw_qiangzhan";
									}).length > 0) return 'zeroplayertarget';
							}
						},
					},
				},
			},
			dmrw_chuiju: {
				mod: {
					cardUsableTarget(card, player, target) {
						if (get.name(card) == 'sha' && get.distance(player, target) == 1) return Infinity;
					},
					globalFrom(from, to, distance) {
						return distance - to.getAllHistory("damage", evt => {
							return evt.source == from && evt.notLink();
						}).length;
					},
				},
			},
			dmrw_mopu: {
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				direct: true,
				async content(event, trigger, player) {
					await player.chooseUseTarget("###是否发动【魔瀑】？###视为使用一张没有距离限制的冰【杀】", {
						name: "sha",
						nature: "ice",
						storage: {
							dmrw_mopu: true,
						},
						isCard: true,
					}, false, "nodistance").set("logSkill", "dmrw_mopu");
				},
			},
			dmrw_jianglin: {
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					return player.isDamaged() && game.hasPlayer(target => {
						return player != target && get.distance(player, target) == 1;
					});
				},
				filterTarget(card, player, target) {
					return player != target && get.distance(player, target) == 1;
				},
				async content(event, trigger, player) {
					const num = player.getDamagedHp();
					const tg = event.target;
					player.$skill('神加百列', 'epic', 'thunder', true);
					await tg.damage("ice");
					for (let i = 0; i < num - 1 && player.isIn() && tg.isIn() && player.canUse({
							name: "sha",
							nature: "ice",
							isCard: true
						}, tg); i++) {
						await player.useCard({
							name: "sha",
							nature: "ice",
							isCard: true
						}, tg);
					}
				},
				ai: {
					order: 11,
					threaten: function(player, target) {
						return target.getDamagedHp() + 0.5;
					},
					result: {
						player: 1,
						target(player, target) {
							const num = player.getDamagedHp();
							const bo = player.canUse({
								name: "sha",
								nature: "ice",
								isCard: true
							}, target);
							const num1 = get.damageEffect(target, player, target, "ice");
							const num2 = get.effect(target, {
								name: "sha",
								nature: "ice",
								isCard: true
							}, player, target) * (num - 1);
							return num1 + (bo ? 1 : 0) * num2;
						},
					},
				},
			},
			dmrw_kuangao: {
				group: "dmrw_kuangao_b",
				subSkill: {
					a: {
						charlotte: true,
						mark: true,
						marktext: "狂",
						intro: {
							name: "狂傲",
							content(storage, player) {
								const num = get.cnNumber(player.getHistory("sourceDamage").length);
								return "你本回合可额外使用一张【杀】";
							},
						},
						mod: {
							cardEnabled(card, player) {
								if (get.type2(card) == "trick") return false;
							},
							cardUsable(card, player, num) {
								if (get.name(card) == 'sha' && num >= 0) return num + 1;
							},
						},
					},
				},
				trigger: {
					source: "damageSource",
				},
				forced: true,
				usable: 1,
				async content(event, trigger, player) {
					player.draw(2);
					player.addTempSkill("dmrw_kuangao_a");
				},
			},
			dmrw_kuosan: {
				group: "dmrw_kuosan_b",
				subSkill: {
					a: {
						trigger: {
							target: "useCardToTargeted",
						},
						charlotte: true,
						forced: true,
						filter(event, player) {
							return get.name(event.card) == "sha" && game.hasNature(event.card, "thunder");
						},
						async content(event, trigger, player) {
							player.clearMark("dmrw_kuosan");
							player.removeSkill("dmrw_kuosan_a");
							const user = trigger.player;
							const tgs = [player];
							const tgs2 = game.filterPlayer(pl => {
								return pl != user && user.canUse({
									name: "sha",
									isCard: true
								}, pl, false) && (pl == player.previous || pl == player.next);
							});
							if (tgs2.length > 0) tgs.add(tgs2.randomGet());
							await user.useCard({
								name: "sha",
								isCard: true
							}, tgs, false);
						},
						ai: {
							effect: {
								target(card, player, target) {
									if (get.name(card) == "sha" && game.hasNature(card, "thunder") && get.effect(target, {
											name: "sha",
											isCard: true
										}, player, player) > 0) return [0, -5];
								},
							},
						},
					},
					b: {
						trigger: {
							player: "phaseJieshuBegin",
						},
						filter(event, player) {
							return game.countPlayer(pl => {
								return pl.hasMark("dmrw_kuosan");
							}) > 0;
						},
						forced: true,
						async content(event, trigger, player) {
							const num = game.countPlayer(pl => {
								return pl.hasMark("dmrw_kuosan");
							});
							lib.skill.dmrw_kuosan.onremove(player, "dmrw_kuosan");
							player.draw(num);
						},
					},
				},
				intro: {
					content: "mark",
				},
				onremove(player, skill) {
					game.countPlayer(pl => {
						pl.clearMark(skill);
						pl.removeSkill("dmrw_kuosan_a");
					});
				},
				enable: "phaseUse",
				usable: 2,
				filter(event, player) {
					return player.countCards("he", {
						color: "red"
					}) > 0 && game.countPlayer(pl => {
						return pl.hasMark("dmrw_kuosan");
					}) < 2 && game.hasPlayer(pl => {
						return pl != player && !pl.hasMark("dmrw_kuosan");
					});
				},
				position: "he",
				filterCard: {
					color: "red",
				},
				check(card) {
					const player = _status.event.player;
					if (player.num('h') < 4 && get.tag(card, 'damage') && player.countCards("h", c => {
							return get.tag(c, 'damage');
						}) < 2) return 0;
					return 6 - get.value(card);
				},
				filterTarget(card, player, target) {
					return player != target && !target.hasMark("dmrw_kuosan");
				},
				async content(event, trigger, player) {
					const tg = event.target;
					tg.addMark("dmrw_kuosan", 1);
					tg.addSkill("dmrw_kuosan_a");
				},
				ai: {
					order: 7,
					result: {
						target(player, target) {
							return get.effect(target, {
								name: "sha",
								isCard: true
							}, player, target);
						},
					},
				},
			},
			dmrw_lipao: {
				group: "dmrw_lipao_a",
				subSkill: {
					a: {
						priority: 1,
						silent: true,
						forced: true,
						popup: false,
						firstDo: true,
						charlotte: true,
						trigger: {
							player: "useCard1",
						},
						filter(event, player) {
							return event.card && event.card.storage.dmrw_lipao && event.cards && event.cards.length >= 2;
						},
						async content(event, trigger, player) {
							if (trigger.cards.length == 3 || trigger.targets.length == 1) player.$skill('粒炮', 'epic', 'thunder', true);
							if (trigger.targets.length == 1) trigger.baseDamage = trigger.cards.length;
						},
						mod: {
							targetInRange(card, player, target, now) {
								if (card.storage && card.storage.dmrw_lipao) return true;
							},
							selectTarget(card, player, range) {
								if (card.storage && card.storage.dmrw_lipao && ui.selected.cards.length > 0 && range[1] != -1) range[1] += ui.selected.cards.length - 1;
							},
						},
					},
				},
				enable: "chooseToUse",
				filter(event, player) {
					return player.countCards('hs', function(card) {
						return get.type(card) == "basic" && get.color(card) == "black";
					}) > 0;
				},
				viewAsFilter(player) {
					return player.countCards('hs', function(card) {
						return get.type(card) == "basic" && get.color(card) == "black";
					}) > 0;
				},
				selectCard: [1, 3],
				position: "hs",
				filterCard(card) {
					return get.type(card) == "basic" && get.color(card) == "black";
				},
				check() {
					return 1;
				},
				viewAs: {
					name: "sha",
					nature: "thunder",
					storage: {
						"dmrw_lipao": true,
					},
				},
				prompt: "将X张黑色基本牌当无距离限制的雷【杀】使用。以此法使用的雷【杀】可额外指定X个目标。",
				ai: {
					threaten: 2,
					order() {
						return get.order({
							name: "sha"
						}) + 0.1;
					},
					respondSha: true,
					skillTagFilter(player, tag, arg) {
						if (arg != 'use') return false;
						return player.countCards('hs', function(card) {
							return get.type(card) == "basic" && get.color(card) == "black";
						}) > 0;
					},
				},
			},
			dmrw_gangshi: {
				group: "dmrw_gangshi_b",
				subSkill: {
					a: {
						mark: true,
						marktext: "硬",
						intro: {
							name: "硬直",
							content: "你处在硬直中，不能响应下张杀",
						},
						trigger: {
							global: "useCard",
						},
						charlotte: true,
						direct: true,
						filter(event, player) {
							return get.name(event.card) == "sha";
						},
						async content(event, trigger, player) {
							player.removeSkill("dmrw_gangshi_a");
							trigger.directHit.add(player);
						},
					},
					b: {
						trigger: {
							source: "damageSource",
						},
						filter(event, player) {
							return get.name(event.card) == "sha" && event.notLink();
						},
						forced: true,
						async content(event, trigger, player) {
							await player.draw();
							if (trigger.player.isAlive()) trigger.player.addTempSkill("dmrw_gangshi_c");
						},
					},
					c: {
						mark: true,
						marktext: "固定",
						intro: {
							name: "固定",
							content: "你被钉在墙上，不能响应牌",
						},
						trigger: {
							global: "useCard",
						},
						charlotte: true,
						silent: true,
						filter(event, player) {
							return event.player != player;
						},
						async content(event, trigger, player) {
							trigger.directHit.add(player);
						},
					},
				},
				trigger: {
					global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				forced: true,
				filter(event, player) {
					if (_status.currentPhase != player) return false;
					return game.hasPlayer(pl => {
						if (pl == player) return;
						const evt = event.getl(pl);
						if (evt && evt.cards2 && evt.cards2.some(card => get.type(card) != "basic")) {
							if (!pl.hasSkill("dmrw_gangshi_a")) return true;
						}
					});
				},
				logTarget: "player",
				async content(event, trigger, player) {
					game.countPlayer(pl => {
						if (pl == player) return;
						const evt = trigger.getl(pl);
						if (evt && evt.cards2 && evt.cards2.some(card => get.type(card) != "basic")) {
							if (!pl.hasSkill("dmrw_gangshi_a")) pl.addTempSkill("dmrw_gangshi_a");
						}
					});
				},
				mod: {
					targetInRange(card, player, target, now) {
						if (get.distance(player, target) == 2) return true;
					},
				},
				ai: {
					"directHit_ai": true,
					skillTagFilter: function(player, tag, arg) {
						if (!arg.target.hasSkill("dmrw_gangshi_a") && !arg.target.hasSkill("dmrw_gangshi_c")) return false;
						if (arg.target.hasSkill("dmrw_gangshi_a")) {
							if (arg.card.name != "sha") return false;
						}
					},
				},
			},
			dmrw_shunti: {
				group: "dmrw_shunti_a",
				subSkill: {
					a: {
						trigger: {
							player: "compare",
						},
						filter: function(event, player) {
							return event.getParent("dmrw_shunti") && !event.iwhile;
						},
						direct: true,
						content: function() {
							const bo1 = get.type(trigger.card1) != "basic";
							const bo2 = get.type(trigger.card2) != "basic";
							if (bo1 ^ bo2) {
								if (bo1) {
									game.log(player, "拼点牌点数视为", "#y1");
									trigger.num1 = 1;
								} else {
									game.log(trigger.target, "拼点牌点数视为", "#y1");
									trigger.num2 = 1;
								}
							}
						},
					},
					b: {
						mark: true,
						marktext: "瞬",
						intro: {
							name: "瞬移",
							content: "本回合你与$的距离为1",
						},
						mod: {
							globalFrom(from, to, distance) {
								if (to == from.storage.dmrw_shunti_b) return distance - Infinity;
							},
						},
					},
				},
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					return game.hasPlayer(pl => {
						return player.canCompare(pl);
					});
				},
				filterTarget(card, player, target) {
					return player.canCompare(target);
				},
				async content(event, trigger, player) {
					const {
						result
					} = await player.chooseToCompare(event.target);
					if (result.bool) {
						player.storage.dmrw_shunti_b = event.target;
						player.addTempSkill("dmrw_shunti_b");
						if (player.canUse({
								name: "sha",
								isCard: true
							}, event.target, false)) await player.useCard({
							name: "sha",
							isCard: true
						}, event.target, false);
					}
				},
				mod: {
					aiOrder(player, card, num) {
						if (['wuzhong', 'shunshou'].includes(get.name(card))) return num + 10;
					},
				},
				ai: {
					order: 11,
					result: {
						target: -1,
					},
				},
			},
			dmrw_fanji: {
				trigger: {
					player: "damageBegin3",
				},
				filter(event, player) {
					return player.num("h", "shan") > 0;
				},
				check(event, player) {
					const num = player.num("h", "shan")
					if (player.hp <= event.num) return true;
					if (event.source) {
						if (num < event.num) return true;
						if (player.canUse({
								name: "sha",
								isCard: true
							}, event.source, false)) {
							return get.effect(event.source, {
								name: "sha",
								isCard: true
							}, player, player) > 0;
						}
						return num == event.num;
					}
					return num <= event.num;
				},
				async content(event, trigger, player) {
					const cards = player.get("h", "shan");
					await player.discard(cards);
					const num = trigger.num - cards.length;
					trigger.num = num;
					if (num <= 0 && trigger.source) {
						const num2 = num == 0 ? 1 : 3;
						let show = false;
						for (let i = 0; i < num2; i++) {
							if (player.isIn && trigger.source.isIn() && player.canUse({
									name: "sha",
									isCard: true
								}, trigger.source, false)) {
								if (!show) {
									show = true;
									player.$skill('反击', 'epic', 'metal', true);
								}
								await player.useCard({
									name: "sha",
									isCard: true
								}, trigger.source);
							}
						}
					}
				},
				ai: {
					maixie_defend: true,
					noShan: true,
					skillTagFilter(player) {
						return player.num("h", "shan") > 0;
					},
				},
			},
			dmrw_fanshe: {
				group: "dmrw_fanshe_a",
				subSkill: {
					a: {
						trigger: {
							player: "phaseJieshuBegin",
						},
						forced: true,
						filter(event, player) {
							return player.num("h") < 2;
						},
						async content(event, trigger, player) {
							await player.drawTo(2);
						},
						ai: {
							nokeep: true,
						},
					},
				},
				trigger: {
					player: "damageBefore",
				},
				firstDo: true,
				forced: true,
				usable: 1,
				filter(event, player) {
					return player.num("h") > 0;
				},
				async content(event, trigger, player) {
					trigger.cancel();
					player.addTip(event.skill, "已反射", true);
				},
				mod: {
					maxHandcard(player, num) {
						return num - 1;
					},
				},
				ai: {
					maixie: true,
					maixie_defend: true,
					effect: {
						target(card, player, target) {
							if (!target.getHistory("useSkill").filter(evt => {
									return evt.skill == "dmrw_fanshe";
								}).length && target.num("h") > 0) {
								if (get.tag(card, 'damage')) {
									if (game.players.length < 4) return;
									if (!target.hasFriend()) return;
									if (target.hp > 2) return 0;
									else return 0.5;
								}
							}
						},
					},
				},
			},
			dmrw_shikong: {
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					return player.num("he") > 0 && game.hasPlayer(pl => {
						return player.canUse({
							name: "guohe",
							isCard: true
						}, pl);
					});
				},
				selectCard: [1, 3],
				position: "he",
				filterCard: true,
				check(card) {
					const player = _status.event.player;
					if (player.getHistory("useCard", evt => {
							return evt.targets && evt.targets.length == 1;
						}).length == 0) return 0;
					if (get.type(card) == "equip") return 3.8;
					return 6 - get.value(card);
				},
				selectTarget() {
					return [1, ui.selected.cards.length];
				},
				filterTarget(card, player, target) {
					const num = ui.selected.targets.length;
					if (num > 2) return false;
					const name = ["guohe", "shunshou", "juedou"][num];
					if (!player.canUse({
							name,
							isCard: true
						}, target)) return false;
					return player != target;
				},
				complexTarget: true,
				complexSelect: true,
				multitarget: true,
				prompt: "弃置最多三张牌指定最多等量其他角色为目标，视为对第一个目标使用一张【过河拆桥】，第二个目标使用一张【顺手牵羊】，第三个目标使用一张【决斗】。若目标数小于弃牌数，视为最后一个目标额外被选择数次，直至目标数等于弃牌数。",
				async content(event, trigger, player) {
					for (let i = 0; i < event.cards.length; i++) {
						const num = Math.min(event.targets.length - 1, i);
						const tg = event.targets[num];
						const name = ["guohe", "shunshou", "juedou"][i];
						if (player.isIn() && tg.isIn() && player.canUse({
								name,
								isCard: true
							}, tg)) await player.useCard({
							name,
							isCard: true
						}, tg);
					}
				},
				mod: {
					targetInRange(card, player, target, now) {
						return true;
					},
				},
				ai: {
					order: 7,
					result: {
						target(player, target) {
							const num = ui.selected.targets.length;
							if (num > 1) return 0;
							const name = ["guohe", "shunshou", "juedou"][num];
							const num2 = game.players.length < 4 ? 0 : (num + 2) * 2;
							return get.effect(target, {
								name,
								isCard: true,
							}, player, target) - num2;
						},
					},
				},
			},
			dmrw_heiyi: {
				group: "dmrw_heiyi_a",
				subSkill: {
					a: {
						trigger: {
							global: "useCardAfter",
						},
						filter(event, player) {
							return event.card.name == "sha" && game.hasPlayer(pl => {
								return pl.hasSkill("dmrw_heiyi_b") && player.storage.dmrw_heiyi.includes(pl);
							});
						},
						forced: true,
						charlotte: true,
						async content(event, trigger, player) {
							const tgs = [];
							game.countPlayer(pl => {
								if (pl.hasSkill("dmrw_heiyi_b") && player.storage.dmrw_heiyi.includes(pl)) {
									pl.removeSkill("dmrw_heiyi_b");
									player.storage.dmrw_heiyi.remove(pl);
									tgs.add(pl);
								}
							});
							tgs.sortBySeat();
							for (const tg of tgs) {
								if (player.isIn() && tg.isIn() && player.canUse({
										name: "sha",
										nature: "thunder",
										isCard: true
									}, tg, false)) {
									const e = player.useCard({
										name: "sha",
										nature: "thunder",
										isCard: true
									}, tg);
									await e;
									if (player.getHistory("sourceDamage", evt => {
											return evt.getParent(2) == e && evt.notLink();
										}).length > 0 && tg.num("e") > 0) await tg.discard(tg.get('e'), 'bySelf');
								}
							}
						},
					},
					b: {
						charlotte: true,
						mark: true,
						marktext: "危",
						intro: {
							content: "完了，你快被核弹击中了",
						},
					},
				},
				skillAnimation: "epic",
				animationColor: "thunder",
				init(player) {
					player.storage.dmrw_heiyi = [];
				},
				trigger: {
					player: "useCardAfter",
				},
				forced: true,
				priority: 1,
				filter(event, player) {
					return player.getHistory("useCard", evt => {
						return evt.targets && evt.targets.length == 1;
					}).length == 4 && event.targets[0].isIn();
				},
				logTarget(event, player) {
					return event.targets;
				},
				async content(event, trigger, player) {
					const tg = event.targets[0];
					player.storage.dmrw_heiyi.add(tg);
					tg.addTempSkill("dmrw_heiyi_b", {
						player: "dieAfter"
					});
				},
			},
			dmrw_qidao: {
				mod: {
					targetEnabled(card, player, target, now) {
						if (get.type(card) == 'delay' || get.subtype(card) == 'equip1') return false;
					},
					attackRangeBase(player) {
						return 3;
					},
					cardUsable(card, player, num) {
						if (get.name(card) == 'sha' && num >= 0) return 2;
					},
					aiValue(player, card, num) {
						if (get.subtype(card) != 'equip1') return;
						return 0;
					},
					aiUseful() {
						return lib.skill.dmrw_qidao.mod.aiValue.apply(this, arguments);
					},
				},
			},
			dmrw_qiaoji: {
				group: ["dmrw_qiaoji_buff", "dmrw_qiaoji_c"],
				subSkill: {
					buff: {
						trigger: {
							player: "useCardToPlayer",
						},
						silent: true,
						filter(event, player) {
							return event.skill == "dmrw_qiaoji";
						},
						async content(event, trigger, player) {
							const color = get.color(trigger.card);
							if (["red", "black"].includes(color)) {
								if (color == "black") {
									game.log(player, "获得了", "#b水标记");
									player.addTempSkill("dmrw_qiaoji_a");
								} else {
									game.log(player, "获得了", "#r火标记");
									player.addTempSkill("dmrw_qiaoji_b");
								}
							}
							if (get.distance(player, trigger.target) > 1) {
								game.log(player, "的", "#y【杀】", "无效");
								trigger.targets.length = 0;
								trigger.getParent().triggeredTargets1.length = 0;
								await player.draw();
							}
						},
					},
					a: {
						charlotte: true,
						mark: true,
						marktext: "水",
						intro: {
							content: "你因【七闪】使用【杀】时移除此标记，对目标造成一点冰冻伤害。",
						},
					},
					b: {
						charlotte: true,
						mark: true,
						marktext: "火",
						intro: {
							content: "你因【七闪】使用【杀】时移除此标记，对目标造成一点火焰伤害。",
						},
					},
					c: {
						trigger: {
							player: "useCard1",
						},
						charlotte: true,
						silent: true,
						filter(event, player) {
							return event.card?.storage?.dmrw_qishan && event.targets.length == 1 && (player.hasSkill("dmrw_qiaoji_a") || player.hasSkill("dmrw_qiaoji_b"));
						},
						async content(event, trigger, player) {
							const nature = player.hasSkill("dmrw_qiaoji_a") ? "ice" : "fire";
							player.removeSkill("dmrw_qiaoji_a");
							player.removeSkill("dmrw_qiaoji_b");
							trigger.targets[0].damage(nature);
						},
					},
				},
				derivation: "dmrw_qiaoji_faq",
				enable: "chooseToUse",
				filter(event, player) {
					return player.getHistory("useCard", evt => {
						return evt.card.name == "sha";
					}).length == 0;
				},
				viewAsFilter(player) {
					return player.countCards('hes') > 0;
				},
				position: "hes",
				filterCard: true,
				check(card) {
					return 6 - get.value(card);
				},
				viewAs: {
					name: "sha",
				},
				prompt: "将一张牌当杀使用",
				ai: {
					order() {
						return get.order({
							name: "sha"
						}) + 0.1;
					},
					respondSha: true,
					skillTagFilter(player, tag, arg) {
						if (arg != 'use') return false;
						return player.countCards('hes') > 0;
					},
				},
			},
			dmrw_qishan: {
				trigger: {
					player: "useCardAfter",
				},
				filter(event, player) {
					if (event.card.name != "sha" || event.stocktargets.length != 1) return false;
					if (player.getHistory("useCard", evt => {
							return evt.card.name == "sha";
						}).length > 1) return false;
					const tg = event.stocktargets[0];
					return tg.isIn() && player.num("h") > 0 && player.canUse({
						name: "sha",
						isCard: true,
					}, tg);
				},
				logTarget(event, player) {
					return event.stocktargets[0];
				},
				async cost(event, trigger, player) {
					const tg = trigger.stocktargets[0];
					event.result = await player.chooseCard(get.prompt("dmrw_qishan"), "弃置一张手牌，视为对" + get.translation(tg) + "使用一张【杀】", "h").set('ai', card => {
						const eff = get.effect(tg, {
							name: "sha",
							isCard: true
						}, player, player);
						if (eff > 0) return eff + 14 - get.value(card);
						else return 0;
					}).forResult();
				},
				async content(event, trigger, player) {
					await player.discard(event.cards);
					const tg = trigger.stocktargets[0];
					await player.useCard({
						name: "sha",
						isCard: true,
						storage: {
							dmrw_qishan: true,
						}
					}, tg);
					if (tg.isIn() && player.num('h') > 0) {
						const result = await player.chooseCard("【七闪】：弃置一张手牌，弃置" + get.translation(tg) + "手牌中的所有红色牌", "h").set('ai', card => {
							const att = get.attitude(player, tg);
							const num = tg.num('h');
							if (att < 0 && num >= 2) return num + 12 - get.value(card);
							else return 0;
						}).forResult();
						if (result.bool) {
							await player.discard(result.cards);
							if (tg.num("h", {
									color: "red"
								}) > 0) await tg.discard(tg.get("h", {
								color: "red"
							}));
							else game.log(tg, "无牌可弃");
						}
					}
				},
			},
			dmrw_weishan: {
				group: "dmrw_weishan_b",
				subSkill: {
					a: {
						charlotte: true,
						mod: {
							maxHandcard(player, num) {
								return game.getGlobalHistory("everything", evt => {
									if (evt.name != "die" || evt?.source != player) return false;
									return evt.player.identity == "fan";
								}).length * 2;
							},
						},
					},
					b: {
						trigger: {
							player: "useCard",
						},
						forced: true,
						firstDo: true,
						filter(event, player) {
							return event.card.name == "sha" && event.card?.storage?.dmrw_weishan;
						},
						async content(event, trigger, player) {
							if (typeof trigger.baseDamage != "number") trigger.baseDamage = 1;
							trigger.baseDamage = Math.min(game.roundNumber, 3);
						},
					},
				},
				skillAnimation: "epic",
				animationColor: "metal",
				trigger: {
					player: "phaseUseEnd",
				},
				filter(event, player) {
					return player.getHistory("useCard", evt => {
						return evt.card.name == "sha";
					}).length > 0 && game.hasPlayer(pl => {
						return (get.distance(player, pl) == 1 || player.getHistory("sourceDamage", evt => {
							return evt.player == pl;
						}).length >= 2) && player.canUse({
							name: "sha",
							isCard: true,
						}, pl);
					});
				},
				async cost(event, trigger, player) {
					event.result = await player.chooseTarget(get.prompt("dmrw_weishan"), function(card, player, target) {
						return (get.distance(player, target) == 1 || player.getHistory("sourceDamage", evt => {
							return evt.player == target;
						}).length >= 2) && player.canUse({
							name: "sha",
							isCard: true,
						}, target);
					}, target => {
						let go = true;
						const num1 = player.num("h");
						const num2 = target.hp;
						const num3 = Math.min(game.roundNumber, 3);
						const num4 = player.getEnemies().length;
						const num5 = game.getGlobalHistory("everything", evt => {
							if (evt.name != "die" || evt?.source != player) return false;
							return evt.player.identity == "fan";
						}).length * 2;
						if (num1 - num5 > 1) {
							if (num3 < num2) {
								go = num1 - num5 <= num3;
							} else {
								go = num1 - num5 <= 3 && (num4 == 1 || num1 - num3 - num5 <= 1);
							}
						}
						if (!go) return 0;
						return get.effect(target, {
							name: "sha",
							isCard: true,
						}, player, player);
					}).forResult();
				},
				async content(event, trigger, player) {
					player.addTempSkill("dmrw_weishan_a");
					player.useCard({
						name: "sha",
						isCard: true,
						storage: {
							dmrw_weishan: true,
						},
					}, event.targets);
				},
			},
			dmrw_qijiao: {
				mod: {
					targetEnabled(card, player, target, now) {
						if (get.subtype(card) == 'equip1') return false;
					},
					attackRangeBase(player) {
						return 2;
					},
					cardUsable(card, player, num) {
						if (get.name(card) == 'sha' && num >= 0) return 2;
					},
					ignoredHandcard(card, player) {
						if (get.name(card) == "sha") {
							return true;
						}
					},
					cardDiscardable(card, player, name) {
						if (name == "phaseDiscard" && get.name(card) == "sha") return false;
					},
					aiValue(player, card, num) {
						if (get.subtype(card) != 'equip1') return;
						return 0;
					},
					aiUseful() {
						return lib.skill.dmrw_qijiao.mod.aiValue.apply(this, arguments);
					},
				},
			},
			dmrw_fuqiang: {
				group: ["dmrw_fuqiang_buff"],
				subSkill: {
					buff: {
						trigger: {
							player: "useCardAfter",
						},
						filter(event, player) {
							return player.storage.dmrw_fuqiang.includes(get.suit(event.card));
						},
						lastDo: true,
						silent: true,
						async content(event, trigger, player) {
							const suit = get.suit(trigger.card);
							player.unmarkAuto("dmrw_fuqiang", [suit]);
							player.addTempSkill("dmrw_fuqiang_" + suit, {
								player: "dieAfter"
							});
							const obj = {
								spade: "g地",
								heart: "r火",
								club: "b水",
								diamond: "y光",
							};
							game.log(player, "获得了", "#" + obj[suit] + "标记");
						},
					},
					spade: {
						charlotte: true,
						mark: true,
						marktext: "地",
						intro: {
							content: "下张【杀】无距离限制，使用时摸一张牌。",
						},
						trigger: {
							player: "useCard",
						},
						silent: true,
						filter(event, player) {
							return event.card.name == "sha";
						},
						async content(event, trigger, player) {
							await player.draw();
							player.when("useCardAfter").vars({
								remove: event.name
							}).then(() => {
								player.removeSkill(remove)
							});
						},
						mod: {
							targetInRange(card, player, target, now) {
								if (get.name(card) == 'sha') return true;
							},
						},
					},
					heart: {
						charlotte: true,
						mark: true,
						marktext: "火",
						intro: {
							content: "下张【杀】造成伤害后，对目标造成一点火焰伤害。",
						},
						trigger: {
							player: "useCardToPlayered",
							source: "damageSource",
						},
						silent: true,
						filter(event, player) {
							if (event?.card?.name != "sha") return false;
							if (event.name == "damage") return event.notLink();
							else return true;
						},
						async content(event, trigger, player) {
							if (trigger.name == "damage") {
								if (trigger.player.isIn()) await trigger.player.damage("fire");
							} else {
								player.when("useCardAfter").vars({
									remove: event.name
								}).then(() => {
									player.removeSkill(remove)
								});
							}
						},
					},
					club: {
						charlotte: true,
						mark: true,
						marktext: "水",
						intro: {
							content: "下张【杀】无视防具且不可闪避，属性改为冰。",
						},
						trigger: {
							player: "useCardToPlayered",
						},
						silent: true,
						filter(event, player) {
							return event.card.name == "sha";
						},
						async content(event, trigger, player) {
							trigger.target.addTempSkill("qinggang2");
							trigger.target.storage.qinggang2.add(trigger.card);
							trigger.getParent().directHit.add(trigger.target);
							game.log(trigger.card, "无视防具且不可闪避");
							game.setNature(trigger.card, "ice");
							if (get.itemtype(trigger.card) == "card") {
								var next = game.createEvent("dmrw_fuqiang_clear");
								next.card = trigger.card;
								event.next.remove(next);
								trigger.after.push(next);
								next.setContent(function() {
									game.setNature(trigger.card, []);
								});
							}
							player.when("useCardAfter").vars({
								remove: event.name
							}).then(() => {
								player.removeSkill(remove)
							});
						},
						ai: {
							"unequip_ai": true,
							"directHit_ai": true,
							skillTagFilter: function(player, tag, arg) {
								if (tag == "unequip_ai") return arg.name == "sha";
								if (tag == "directHit_ai") return arg.card.name == "sha";
							},
						},
					},
					diamond: {
						charlotte: true,
						mark: true,
						marktext: "光",
						intro: {
							content: "下张【杀】额外结算一次。",
						},
						trigger: {
							player: "useCardToPlayered",
						},
						silent: true,
						filter(event, player) {
							return event.card.name == "sha";
						},
						async content(event, trigger, player) {
							trigger.getParent().effectCount++;
							game.log(trigger.card, "额外结算一次");
							player.when("useCardAfter").vars({
								remove: event.name
							}).then(() => {
								player.removeSkill(remove)
							});
						},
					},
				},
				derivation: "dmrw_fuqiang_faq",
				init(player) {
					player.storage.dmrw_fuqiang = [];
				},
				intro: {
					content: "你的$牌均视为【杀】",
				},
				trigger: {
					global: "roundStart",
				},
				forced: true,
				async content(event, trigger, player) {
					const arr = ["spade", "heart", "club", "diamond"];
					const arr2 = arr.randomGets(2);
					arr2.sort((a, b) => {
						return arr.indexOf(a) - arr.indexOf(b);
					});
					player.storage.dmrw_fuqiang = [];
					player.markAuto("dmrw_fuqiang", arr2);
					game.log(player, "的", get.translation(arr2), "牌均视为【杀】");
				},
				mod: {
					cardname(card, player, name) {
						if (_status.currentPhase == player && player.storage.dmrw_fuqiang.includes(get.suit(card))) return "sha";
					},
				},
				ai: {
					effect: {
						player_use(card, player, target) {
							if (player.storage.dmrw_fuqiang.includes(get.suit(card))) return 1;
						},
					},
				},
			},
			dmrw_qiren: {
				skillAnimation: "epic",
				animationColor: "metal",
				trigger: {
					player: "phaseUseEnd",
				},
				filter(event, player) {
					return game.hasPlayer(pl => {
						return player != pl && player.getHistory("useCard", evt => {
							return evt.targets.includes(pl);
						}).length > 0;
					});
				},
				async cost(event, trigger, player) {
					event.result = await player.chooseTarget(get.prompt("dmrw_qiren"), function(card, player, target) {
						const num = player.getHistory("useCard", evt => {
							return evt.targets.includes(target);
						}).length;
						return player != target && !game.hasPlayer(pl => {
							return player != pl && player.getHistory("useCard", evt => {
								return evt.targets.includes(pl);
							}).length > num;
						}) && player.canUse({
							name: "sha",
							isCard: true,
						}, target);
					}, target => {
						return get.effect(target, {
							name: "sha",
							isCard: true,
						}, player, player);
					}).forResult();
				},
				async content(event, trigger, player) {
					player.useCard({
						name: "sha",
						isCard: true
					}, event.targets);
				},
			},
		},
		characterReplace:{},
		translate:{
			"dmrw_misakamikoto": "御坂美琴",
			"dmrw_kamijoutouma": "上条当麻",
			"dmrw_misakaimouto": "御坂妹妹",
			"dmrw_stiylmagnus": "史提尔",
			"dmrw_AquaoftheBack": "后方之水",
			"dmrw_sasha": "莎夏",
			"dmrw_muginoshizuri": "麦野沉利",
			"dmrw_shiraikuroko": "白井黑子",
			"dmrw_accelerator": "一方通行",
			"dmrw_kanzakikaori": "神裂火织",
			"dmrw_itsuwa": "五和",
			"mojinpsp": "魔禁",
			dmrw_dianjia: "电甲",
			dmrw_dianjia_info: "锁定技，①每回合限两次，一名角色受到雷属性伤害后，你选择回复一点体力或摸一张牌；②你的属性【杀】均视为雷【杀】。",
			dmrw_shabian: "砂鞭",
			dmrw_shabian_info: "锁定技，①你的普【杀】的攻击范围+1；②造成过雷属性伤害的回合，普【杀】次数+1。",
			dmrw_chaopao: "超炮",
			dmrw_chaopao_info: "你可以将X张红色基本牌当无距离限制且基础伤害为X的雷【杀】使用（X至多为3）。根据转化牌的数量直到结算完毕：[2]目标角色不能使用手牌中的【闪】；[3]目标角色非锁定技失效。",
			dmrw_huanxiang: "幻想",
			dmrw_huanxiang_info: "锁定技，①你不是【杀】【桃】【决斗】以外的牌的合法目标；②防止你受到【杀】或【决斗】以外的伤害和2点以下属性伤害。",
			dmrw_shashou: "杀手",
			dmrw_shashou_info: "①摸牌阶段结束时，你可以摸至四张，然后重铸任意张手牌；②你的攻击距离+1；③当你使用【杀】时，可弃置一张牌令此【杀】不计入次数，若以此法弃置最后一张手牌，此【杀】额外结算一次。",
			dmrw_buxing: "不幸",
			dmrw_buxing_info: "其他角色出牌阶段限一次，可以弃置3张手牌，失去所有技能直至本回合结束，然后视为对你使用一张【杀】。",
			dmrw_saoshe: "扫射",
			dmrw_saoshe_info: "锁定技，①你不是武器牌的合法目标；②你的【杀】：1.没有属性；2.无次数和距离限制；3.对同一角色最多使用2张；4.每使用2张，结束阶段从弃牌堆获得一张【杀】或【闪】。",
			dmrw_zhuangtian: "装填",
			dmrw_zhuangtian_info: "出牌阶段限一次，你可以弃置两张牌，亮出牌堆顶六张牌并获得其中的【杀】。若无牌可得，你摸两张牌。",
			dmrw_zengyuan: "增援",
			dmrw_zengyuan_info: "每过4个回合，你可以令一名其他角色随机执行一个【偷袭】效果，任意连续3个效果不会重复，每3次结算完成后你摸三张牌。",
			dmrw_zengyuan_faq: "偷袭",
			dmrw_zengyuan_faq_info: "①目标随机弃置一张手牌，若弃置了最后一张手牌，目标受到一点【杀】的伤害；②目标随机弃置一张装备，若弃置了最后一张装备，目标受到一点【杀】的伤害；③目标需要打出一张【杀】或【闪】，否则受到一点【杀】的伤害。",
			dmrw_sanfu: "散符",
			dmrw_sanfu_info: "锁定技，①游戏开始时获得1枚“符”（最多6枚）；②每回合限4次，当你使用非伤害牌时或造成伤害时，获得1枚“符”；③当你于回合外失去手牌后，移除一枚“符”；④当你受到伤害时，移除3枚“符”防止伤害，摸一张牌。若为火属性，再摸一张牌。",
			dmrw_yanjian: "炎剑",
			dmrw_yanjian_info: "锁定技，根据“符”的数量你的【杀】获得效果：>=1：视为火属性；>=2:攻击范围无限；>=3:次数+1；>=4:不可被响应；>=5:横置所有目标；6:基础伤害+1。",
			dmrw_yanmo: "炎魔",
			dmrw_yanmo_info: "你的出牌阶段结束时，若你本回合造成过伤害且“符”的数量为5以上，可以对一名其他角色造成X点火焰伤害（X为你造成伤害的次数-1，且至少为1至多为3）。",
			dmrw_jujian: "巨剑",
			dmrw_jujian_info: "锁定技，①你不能装备攻击范围不为2的武器牌，你的攻击范围始终为3；②若你于出牌阶段使用过【杀】/普通锦囊牌，你不能使用普通锦囊牌/【杀】。",
			dmrw_lianzhan: "连斩",
			dmrw_lianzhan_info: "锁定技，你的【杀】：①次数限制为3；②对目标结算2次，若第一次结算被抵消，终止第二次结算且本回合不能对其使用【杀】。",
			dmrw_bushu: "布术",
			dmrw_bushu_info: "①一名角色出牌阶段开始时，你可以将至多3张牌置于武将牌上称为“术”（最多放3张）；②其他角色使用与“术”花色相同的牌时，可以移除所有“术”令此牌无效，若移除了3张“术”，对其造成一点伤害；③当你受到伤害后，移除所有“术”。",
			dmrw_qiangzhan: "强斩",
			dmrw_qiangzhan_info: "当回合内第三次以上结算【杀】时，可以令基础伤害+1。若如此做，本回合不能再结算【杀】。",
			dmrw_chuiju: "锤锯",
			dmrw_chuiju_info: "锁定技，①你的【杀】对距离1的角色无次数限制；②每当你对目标造成伤害，计算与其的距离-1。",
			dmrw_mopu: "魔瀑",
			dmrw_mopu_info: "准备阶段，你可以视为使用一张无距离限制的冰【杀】。",
			dmrw_jianglin: "降临",
			dmrw_jianglin_info: "出牌阶段限一次，若你已受伤，你可以选择一名距离1的其他角色，根据已损失体力值：>=1:对其造成一点冰属性伤害；>=2:视为对其使用X-1张冰【杀】。",
			dmrw_kuangao: "狂傲",
			dmrw_kuangao_info: "锁定技，当你首次造成伤害后，摸两张牌，本回合【杀】的次数+1，但不能使用所有锦囊牌。",
			dmrw_kuosan: "扩散",
			dmrw_kuosan_info: "①出牌阶段限两次，你可以弃置一张红色牌，令一名其他角色获得一枚“晶”标记（场上最多存在2枚）；②一名角色使用雷【杀】指定有“晶”的角色为目标时，移除“晶”标记，视为对其和随机一名相邻角色（不包括使用者）使用一张【杀】；③结束阶段移除场上所有“晶”，摸等量张牌。",
			dmrw_lipao: "粒炮",
			dmrw_lipao_info: "你可以将X张黑色基本牌当无距离限制的雷【杀】使用（X最多为3）。以此法使用的雷【杀】可额外指定X-1个目标。若X为2以上且目标数为1，基础伤害为X。",
			dmrw_gangshi: "钢矢",
			dmrw_gangshi_info: "锁定技，①你的牌对距离2的角色无距离限制；②在你的回合失去非基本牌的其他角色不能响应下张【杀】；③当你的【杀】对目标造成伤害后，摸一张牌，其本回合不能响应牌。",
			dmrw_shunti: "瞬踢",
			dmrw_shunti_info: "出牌阶段限一次，你可以和一名其他角色拼点，若你赢，视为对其使用一张【杀】（不计次数），本回合计算与其的距离为1。若其中一方的拼点牌为非基本牌，点数视为1。",
			dmrw_fanji: "反击",
			dmrw_fanji_info: "当你受到伤害时，可以弃置所有【闪】减少等量伤害。若伤害减少至0，视为对伤害来源使用一张【杀】，若伤害减少至负数，改为三张【杀】。",
			dmrw_fanshe: "反射",
			dmrw_fanshe_info: "锁定技，①每回合限一次，若你有手牌，防止即将受到的伤害；②你的结束阶段开始时，将手牌摸至两张；③你的手牌上限-1。",
			dmrw_shikong: "矢控",
			dmrw_shikong_info: "①你使用牌无距离限制；②出牌阶段限一次，弃置最多三张牌指定最多等量其他角色为目标，视为对第一个目标使用一张【过河拆桥】，第二个目标使用一张【顺手牵羊】，第三个目标使用一张【决斗】。若目标数小于弃牌数，视为最后一个目标额外被选择数次，直至目标数等于弃牌数。",
			dmrw_heiyi: "黑翼",
			dmrw_heiyi_info: "锁定技，当你本回合使用第四张目标数为1的牌后，对该牌的目标发动，下张【杀】结算后，视为对其使用一张雷【杀】。若以此法对其造成伤害，其弃置装备区所有牌。",
			dmrw_qidao: "七刀",
			dmrw_qidao_info: "锁定技，①你不是武器牌和延时锦囊的合法目标；②你的攻击范围始终为3；③你使用【杀】的次数限制为2。",
			dmrw_qiaoji: "鞘击",
			dmrw_qiaoji_info: "若你没使用过【杀】，可以将一张牌当【杀】使用，根据颜色获得水/火标记直至本回合结束。若你与目标距离超过1，此【杀】无效，摸一张牌。",
			dmrw_qiaoji_faq: "标记效果",
			dmrw_qiaoji_faq_info: "水标记：你因【七闪】使用【杀】时移除此标记，对目标造成一点冰冻伤害；火标记:你因【七闪】使用【杀】时移除此标记，对目标造成一点火焰伤害。",
			dmrw_qishan: "七闪",
			dmrw_qishan_info: "当你使用首张【杀】后，可以弃置一张手牌视为对其使用一张【杀】。那之后，可以弃置一张手牌，弃置其手牌中的所有红色牌。",
			dmrw_weishan: "唯闪",
			dmrw_weishan_info: "使用过【杀】的出牌阶段结束时，你可以将手牌上限减至X（X为本回合你杀死的反贼数*2），视为对一名距离为1或本回合受到你两次以上伤害的角色使用一张【杀】。该【杀】基础伤害为游戏轮数，且至多为3。",
			dmrw_qijiao: "七教",
			dmrw_qijiao_info: "锁定技，①你不是武器牌的合法目标；②你的攻击范围始终为2；③你使用【杀】的次数限制为2；④你的【杀】不计手牌上限。",
			dmrw_fuqiang: "符枪",
			dmrw_fuqiang_info: "锁定技，一轮开始时，随机选择两种花色，①回合内这些花色的牌均视为【杀】；②使用这些花色的牌后移除相应花色，获得地/火/水/光标记直至你使用下张【杀】后。",
			dmrw_fuqiang_faq: "标记效果",
			dmrw_fuqiang_faq_info: "地：下张【杀】无距离限制，使用时摸一张牌；火：下张【杀】对目标造成伤害后，对目标造成一点火焰伤害；水：下张【杀】无视防具且不可闪避，属性改为冰；光：下张【杀】额外结算一次。",
			dmrw_qiren: "七刃",
			dmrw_qiren_info: "出牌阶段结束时，你可以视为对一名成为过你牌的目标且次数最多的其他角色使用一张【杀】。",
			pileTop:'牌堆顶',
			pileBottom:'牌堆底',
		},
	};
});
