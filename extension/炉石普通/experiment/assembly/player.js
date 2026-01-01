import { lib, game, ui, get, ai, _status } from "../../../../noname.js";
import { HSarray } from "./class.js";

// 随从相关函数
export const playerDivision = {
	dieAfter() {
		if (_status.mode != "normal" || _status.characterChoice[this.identity].length <= 3) {
			game.checkResult();
		}
	},
	filterFellow(func, bool) { //筛选符合条件的怪兽
		const list = [];
		if (!func) func = () => true;
		var fs = this.getFellow(bool);
		for (let i = 0; i < fs.length; i++) {
			if (func(fs[i])) list.push(fs[i]);
		}
		return list;
	},
	filterFellowX(func) { //兼容旧版filter
		var list = [];
		const that = this;
		if (!func) func = () => true;
		var fs = that.getFellow();
		for (let i = 0; i < fs.length; i++) {
			if (func(null, that, fs[i])) list.push(fs[i]);
		}
		return list;
	},
	hasFellow(fellow, bool) { //是否有符合条件的怪兽
		if (!this.actcharacterlist) return false;
		if (get.hstype(fellow) == 'player') return this.countFellow(function(fl) {
			return fl == fellow;
		}, bool) > 0;
		if (!fellow) fellow = () => true;
		return this.countFellow(fellow, bool) > 0;
	},
	countFellow(func, bool) { //数符合条件的怪兽
		if (!func) func = () => true;
		var fs = this.getFellow(bool);
		var count = 0;
		for (let i = 0; i < fs.length; i++) {
			if (func(fs[i])) count++;
		}
		return count;
	},
	getFellow() { //获取怪兽(没有筛选条件)
		const fs = [];
		if (!this.actcharacterlist) return fs;
		for (let i = 0; i < this.actcharacterlist.length; i++) {
			if (this.actcharacterlist[i]) {
				var fl = this.actcharacterlist[i];
				fs.push(fl);
			}
		}
		return fs;
	},
	getFellowN(func) { //获取怪兽(包括自己)
		if (!func) func = () => true;
		var p = this.getLeader()
		return p.getFellow().add(p).filter(func);
	},
	getLeader() { //怪兽的控制者
		return this.side == game.me.side ? game.me : game.enemy;
	},
	getOppo() { //获取敌人
		return this == game.me ? game.enemy : game.me;
	},
	getOppo2() { //获取敌人，随从也行
		return this.getLeader().getOppo();
	},
	//死亡
	HS_die() {},
	//新增
	countHShistory(key, filter = lib.filter.all, all) { //获取计数
		const func = all ? "All" : "";
		return this["get" + func + "History"]("custom", evt => {
			return evt.name == key && filter(evt);
		}).length;
	},
	hs_copy(tocopy) { //获得一个随从的所有buff
		const target = this;
		const c = tocopy;
		for (let i of c.buff) { //i为buff
			get.HSF("copybuff", [i, target]);
		}
		const o = c.hs_calcv(true);
		if (o[0] < 0) target.baseATK = 0;
	},
	canaddsecret(card) { //可以加奥秘
		var player = this;
		if (typeof card == "string") card = {
			name: card
		};
		if (!player.secrets) return false;
		if (player.secrets.length == 5) return false;
		return !player.secrets.filter(c => c.name == card.name).length
	},
	toNTRed(pre, tmp) { //控制权转移
		if (!this.isMin()) return;
		if (!this.HSF("alive")) return;
		this.summoned = true;
		var player = this.getLeader();
		if (player == pre) return;
		const next = game.createEvent("toNTRed");
		next.fellow = this;
		next.player = player;
		next.tmp = tmp;
		next.setContent(function() {
			"step 0"
			game.delay(0.5);
			"step 1"
			var pre = player.getOppo();
			if (pre.hs_full()) {
				event.fellow.HSF("cuihui");
				event.fellow.hide();
				game.players.remove(event.fellow);
				game.dead.add(event.fellow);
				player.actcharacterlist.remove(event.fellow);
				get.HSF("arrange");
				get.HSF("updateauras", [true]);
				return;
			}
			var m = pre.countFellow();
			var n = pre == game.me ? 0 : 7;
			var pos = m + n + 2;
			pre.hs_place(pos);
			event.fellow.dataset.position = pos + "";
			event.fellow.dataset.enemy = pre.dataset.enemy;
			event.fellow.side = pre.side;

			player.actcharacterlist.remove(event.fellow);
			pre.actcharacterlist.add(event.fellow);

			get.HSF("arrange");
			if (event.tmp) {
				var obj = event.fellow.addgjzbuff("chongfeng", 1);
				obj.name = "aykl";
				obj.onremove = function(p) {
					p.toNTRed();
				};
				event.fellow.addtriggerbuff({
					info: {
						ending: {
							effect() {
								event.fellow.removehsbuff(event.fellow.findhsbuff("aykl"));
								event.fellow.removehsbuff(event.obj.relabuff);
							},
						},
					}
				});
			}
		});
		return next;
	},
	hs_discover(func = lib.filter.all, card, nogain) { //发现
		const next = game.createEvent("hs_discover", false);
		next.fellow = this;
		next.player = this.getLeader();
		next.func = func;
		next.card = card;
		next.nogain = nogain;
		next.setContent(function() {
			"step 0"
			var cds = event.fixedres;
			if (!event.fixedres) {
				var job1 = player.group;
				var job2 = card ? get.rnature(card) : job1;
				var job;
				if (job1 != "hs_neutural") job = job1;
				else if (job2 != "hs_neutural") job = job2;
				else job = Object.keys(get.HSA("easy")).slice(0, -3).randomGet();
				var jobcards = get.hskachi("all", (ca, info) => info.rnature == job && event.func(ca, info));
				var neutral = get.hskachi("all", (ca, info) => ((!info.rnature || info.rnature == "hs_neutral") && event.func(ca, info)));
				if (card) {
					jobcards.remove(card.name);
					neutral.remove(card.name);
				}
				var len1 = jobcards.length;
				var len2 = neutral.length;
				var patio = len1 * 4 / (len1 * 4 + len2);
				var arr = [Math.random(), Math.random(), Math.random()];
				var an = arr.filter(i => i < patio).length;
				var cd1 = jobcards.randomGets(an);
				var cd2 = neutral.randomGets(3 - cd1.length);
				cds = cd1.concat(cd2);
			}
			if (get.hstype(cds) != "cards") cds = cds.map(c => get.chscard(c));
			event.cds = cds;
			var dialog = ui.create.dialog("发现：请选择一张牌获得", 'hidden');
			dialog.classList.add("faxian");
			dialog.addAuto(cds);
			player.chooseButton(dialog, true);
			"step 1"
			player.heroskill.pos.directgain(event.cds);
			if (event.nogain) event.result = result;
			else player.hs_gain(result.links);
		});
		return next;
	},
	hs_juezetrans(card) { //抉择变形
		const next = game.createEvent("hs_juezetrans", false);
		next.fellow = this;
		next.player = this.getLeader();
		next.card = card;
		next.setContent(function() {
			"step 0"
			var info = lib.skill[card.name.slice(0, -8)];
			if (!info || !info.juezetrans) event.finish();
			"step 1"
			var name1 = card.name.replace("_monster", "1jz");
			var name2 = card.name.replace("_monster", "2jz");
			var cds = [name1, name2].map(c => get.chscard(c));
			event.cds = cds;
			var dialog = ui.create.dialog("抉择：请选择一项变形", 'hidden');
			dialog.classList.add("faxian");
			dialog.addAuto(cds);
			player.chooseButton(dialog, true);
			"step 2"
			player.heroskill.pos.directgain(event.cds);
			event.fellow.HSF("convert", [result.links[0].name.slice(0, -2) + "_monster"]).noaudio = true;
		});
		return next;
	},
	hs_jueze(list, card) { //抉择机制
		const next = game.createEvent("hs_jueze", false);
		next.fellow = this;
		next.player = this.getLeader();
		next.list = list;
		next.card = card;
		next.setContent(function() {
			"step 0"
			var cds = event.list.map(c => get.chscard(c));
			event.cds = cds;
			var dialog = ui.create.dialog("抉择：请选择一项发动", 'hidden');
			dialog.classList.add("faxian");
			dialog.addAuto(cds);
			player.chooseButton(dialog, true);
			"step 1"
			player.heroskill.pos.directgain(event.cds);
			event.cd = result.links[0];
			var name = result.links[0].name;
			event.cho = name;
			event.info = lib.card[name];
			"step 2"
			if (event.info.filterTarget) {
				var fil = lib.filter.all;
				if (typeof event.info.filterTarget == "function") fil = event.info.filterTarget;
				player.chooseTarget(lib.translate[event.cho + "_info"], fil, true);
			} else event.goto(4);
			"step 3"
			event.target = result.targets[0];
			event.fellow.HSline(event.target, "green");
			"step 4"
			/*代码修改：不显示选了哪一项*/
			//get.HSF("morefocus", [event.cd]);
			event.insert(event.info.content, {
				card,
				fellow: event.fellow,
				player,
				target: event.target
			});
		});
		return next;
	},
	hs_join2(func = lib.filter.all) { //牌库置入战场
		const next = game.createEvent("hs_join2", false);
		next.player = this;
		next.func = func;
		next.setContent(function() {
			"step 0"
			if (player.hs_full()) event.finish();
			"step 1"
			if (get.hstype(event.func) == "cards") event.cd = event.func;
			else {
				var cs = player.cardPile.getCards("h", c => get.type(c) == "HS_minor" && event.func(c, get.info(c)));
				if (cs.length) {
					event.cd = [cs.randomGet()];
				} else event.finish();
			}
			"step 2"
			player.cardPile.lose(event.cd, ui.special);
			player.SSfellow(event.cd[0].name, undefined, "落地", ["复活"]);
			"step 3"
			result.target.linkCard = event.cd;
		});
		return next;
	},
	hs_join3(func = lib.filter.all) { //手牌置入战场
		const next = game.createEvent("hs_join3", false);
		next.player = this;
		next.func = func;
		next.setContent(function() {
			"step 0"
			if (player.hs_full()) event.finish();
			"step 1"
			var cs = player.getCards("h", c => get.type(c) == "HS_minor" && event.func(c, get.info(c)));
			if (cs.length) {
				event.cd = [cs.randomGet()];
			} else event.finish();
			"step 2"
			player.lose(event.cd, ui.special);
			player.SSfellow(event.cd[0].name, undefined, "落地", ["复活"]);
			"step 3"
			result.target.linkCard = event.cd;
		});
		return next;
	},
	hs_revive(cards, rvhp) { //复活随从
		const next = game.createEvent("hs_revive", false);
		next.fellow = this;
		next.player = this.getLeader();
		next.cards = cards;
		/*代码修改：可指定复活血量*/
		if (typeof rvhp == "number") next.rvhp = rvhp;
		next.setContent(function() {
			if (!cards) cards = function(p, a) {
				return a[p.playerid].randomGet();
			}
			if (typeof cards == "function") {
				cards = cards(player, _status.hs_dead_All, _status.hs_dead[player.playerid]);
			}
			if (!cards || !cards.length) {
				event.finish();
				return;
			}
			const rvhp = event.rvhp || "";
			event.fellow.SSfellow(cards, undefined, "落地", ["复活" + rvhp]);
		});
		return next;
	},
	hs_compare(callback) { //拼点
		const next = game.createEvent("hs_compare", false);
		next.player = this;
		next.target = this.getOppo();
		next.callback = callback;
		next.setContent(function() {
			"step 0"
			event.cs1 = player.cardPile.getCards("h", {
				type: "HS_minor"
			});
			event.cs2 = target.cardPile.getCards("h", {
				type: "HS_minor"
			});
			event.result = {
				bool: false
			};
			if (!event.cs1.length) event.goto(3);
			else if (!event.cs2.length) event.goto(2);
			else {
				event.c1 = event.cs1.randomGet();
				event.n1 = event.c1.cost();
				event.c2 = event.cs2.randomGet();
				event.n2 = event.c2.cost();
				player.$compare(event.c1, target, event.c2);
				setTimeout(function() {
					ui.clear();
				}, 3000);
				game.delay(2);
			}
			"step 1"
			if (event.n1 <= event.n2) event.goto(3);
			"step 2"
			event.result.bool = true;
			if (event.cs1.length) {
				get.HSF("morefocus", [event.c1]);
				if (event.callback) event.callback(player, event);
			}
			"step 3"
			player.hs_sort();
			target.hs_sort();
		});
		return next;
	},
	hs_cuihuisecret(secrets) { //摧毁奥秘
		if (!this.secrets.length) return;
		const next = game.createEvent("hs_cuihuisecret", false);
		next.player = this;
		next.secrets = secrets || this.secrets;
		next.setContent(function() {
			"step 0"
			event.inum = event.secrets.length;
			event.i = 0;
			"step 1"
			event.div = event.secrets.shift();
			event.div.relabuff.tuichang();
			event.cards = event.div.linkCard;
			player.$throw(event.cards);
			"step 2"
			game.log(player, "的", event.cards, "被摧毁了！");
			player.heroskill.pos.directgain(event.cards);
			game.delay();
			"step 3"
			event.i++;
			if (event.i < event.inum && event.secrets.length) event.goto(1);
			"step 4"
			ui.clear();
		});
		return next;
	},
	hs_ntrsecret(secrets) { //夺取奥秘
		const next = game.createEvent("hs_ntrsecret", false);
		next.player = this;
		next.secrets = secrets || this.getOppo().secrets;
		next.setContent(function() {
			"step 0"
			event.inum = event.secrets.length;
			event.i = 0;
			"step 1"
			event.div = event.secrets.shift();
			if (!player.secrets.includes(event.div)) {
				if (player.getOppo().secrets.includes(event.div)) {
					if (player.canaddsecret(event.div)) {
						player.getOppo().secrets.remove(event.div);
						player.secrets.add(event.div);
						get.HSF("checksecret");
					} else {
						player.getOppo().hs_cuihuisecret([event.div]);
						event.goto(3);
					}
				} else event.goto(3);
			} else event.goto(3);
			"step 2"
			if (!player.secretbd.classList.contains("active")) {
				player.secretbd.addTempClass("active", 3000);
			}
			game.delay();
			"step 3"
			event.i++;
			if (event.i < event.inum && event.secrets.length) event.goto(1);
			"step 4"
			ui.clear();
		});
		return next;
	},
	hs_shaohui(num = 1) { //烧毁牌库
		num = Math.max(0, num);
		if (num == 0) return;
		const that = this;
		var deck = that.cardPile;
		if (deck.countCards("h")) {
			const next = game.createEvent("hs_shaohui", false);
			next.player = that;
			next.deck = deck;
			next.deck2 = that.discardPile;
			next.num = num;
			next.setContent(function() {
				"step 0"
				event.i = 0;
				"step 1"
				event.cards = event.deck.getCards("h").slice(0, 1);
				event.deck2.$throw(event.cards);
				"step 2"
				game.log(player, "的", event.cards, "被摧毁了！");
				player.heroskill.pos.directgain(event.cards);
				game.delay(0.5);
				"step 3"
				event.i++;
				if (event.i < event.num && event.deck.countCards("h")) event.goto(1);
				"step 4"
				ui.clear();
			});
			return next;
		}
	},
	hs_rcdh(pos, left, dh, anm2, dft) { //入场动画
		var fellow = this;
		var p = fellow.getLeader();
		var anm = dh;
		fellow.hide();
		var dcfs = { //
			飞入: (function() {
				var init = 653; //中间随从的左边
				var width = 108; //随从间距
				var m = p.countFellow();
				var n = p == game.me ? 0 : 7;
				return "translateY(-450px) translateX(" + (800 + (m - (pos - n - 1)) * width) + "px)";
			})(),
			降落: "translateY(-450px)",
			报告: "translateX(700px)",
			火车王: "translateX(700px)",
			冒出: ["perspective(10px) translateZ(-100px)", "perspective(100px) translateZ(10px)"],
			呼出: (function() {
				return "translateX(" + (left ? "" : "-") + "100px) scale(0.4)";
			})(),
			落地: "perspective(100px) translateY(-20px) translateZ(50px)",
			旋落: "perspective(100px) translateZ(40px) rotate(270deg)",
		};
		if (!dh) {
			if (anm2) anm = anm2;
			else {
				var ca = null;
				var al = get.HSA("anms");
				for (let i in al) {
					if (al[i].includes(get.translation(fellow.name))) {
						ca = i;
						break;
					}
				}
				if (ca) anm = ca;
				else anm = dft;
			}
		}
		var tm = get.HSA("anmstm")[anm] || 700;
		var str = dcfs[anm];
		if (typeof str == "string") str = [str, ""];
		fellow.style.transform = str[0];
		setTimeout(function() {
			fellow.show();
			fellow.style.transform = str[1];
			setTimeout(function() {
				fellow.style.transform = "";
			}, 300)
		}, get.hslegend(fellow) ? 1200 : tm);
		return [anm, tm];
	},
	hs_sort() { //牌堆洗牌
		const mode = get.HSF("cfg", ["HS_duelMode"]);
		if (mode == "testing") return;
		let that = this;
		if (that.parentNode == ui.arena) {
			that = that.getLeader();
			that.cardPile.hs_sort();
		} else {
			const ms = that.getCards("h");
			if (ms.length) {
				ms.randomSort();
				ms.forEach(i => {
					that.node.handcards1.insertBefore(i, that.node.handcards1.firstChild);
				});
			}
		}
	},
	//随机条件
	canhsdmg(ignore) { //能成为随机伤害目标
		const pre = this.HSF("alive", [ignore]);
		return pre && !(this.hp == 1 && this.aurasEffed("hs_mlnh"));
	},
	addweapon(card) { //武器显示
		return lib.element.HSweapon.create(this, card);
	},
	hs_weapon2(card) { //直接装武器
		const player = this;
		if (typeof card == "string") card = get.chscard(card);
		const div = player.addweapon(card);
		_status.hsAttendSeq.ad(card);
		div.hs_yin();
		player.data_weapon = div;
		div.classList.add("bright");
		get.HSF("checkfellow");
		div.swt(true);
		div.node.atk.show();
		player.updatehsfl();
	},
	hs_weapon(card) { //装武器
		const next = game.createEvent("hs_weapon", false);
		next.player = this;
		if (typeof card == "string") card = get.chscard(card);
		next.card = card;
		next.setContent(function() {
			"step 0"
			//摧毁旧武器
			if (player.data_weapon) get.HSF("event", ["equipBefore", {
				heroskill: event.hs_heroskill,
				player,
				div: player.data_weapon,
				card: player.data_weapon.linkCard[0],
			}]);
			"step 1"
			game.log(player, "装备了", card);
			if (player.data_weapon) player.data_weapon.HSF("cuihui");
			"step 2"
			event.div = player.addweapon(card);
			_status.hsAttendSeq.ad(card);
			event.div.hs_yin();
			//武器进场
			"step 3"
			game.delay();
			"step 4"
			get.HSF("event", ["equipAfter", {
				player,
				div: event.div,
				card,
			}]);
			"step 5"
			player.data_weapon = event.div;
		});
		return next;
	},
	hs_atkhj(val) { //攻击和护甲不分家
		const next = game.createEvent("hs_atkhj", false);
		next.player = this;
		if (!val) {
			get.hs_alt("hs_atkhj:参数val不能为空");
			return;
		}
		if (typeof val == "number") val = [val, 0];
		if (val.length == 1) val.push(0);
		next.val = val;
		next.setContent(function() {
			if (event.val[0] > 0) {
				var num = event.val[0];
				player.addvaluebuff(num, 1);
			}
			var num = event.val[1];
			if (num > 0) player.changeHujia(num);
		});
		return next;
	},
	hs_full() { //自己的随从满了
		return this.countFellow() >= 7;
	},
	hs_exchange2() {
		const next = game.createEvent("hs_exchange2", false);
		next.player = this;
		next.setContent(function() {
			"step 0"
			event.band2 = ui.create.div(".bright.hs_band2", ui.arena);
			event.daith2 = player.getCards("h");
			player.countCards("h", function(c) {
				ui.create.div(".hs_tih", c);
				ui.create.div(".hs_tihwz", c, "替换");
			});
			player.chooseCard("h", true, [0, Infinity], " ");
			var enemy = player.next;
			setTimeout(function() {
				var cs = enemy.getCards("h", c => c.cost() > 2);
				if (cs.length) {
					var cg = enemy.cardPile.getCards("h").randomGets(cs.length);
					enemy.cardPile.directgain(cs);
					enemy.update();
					setTimeout(function() {
						enemy.hs_sort();
						enemy.$give(get.HSF("repeat", [lib.hearthstone.enemycard, cs.length]), enemy.discardPile, false);
						setTimeout(function() {
							enemy.update();
							enemy.directgain(cg);
							enemy.discardPile.$give(get.HSF("repeat", [lib.hearthstone.enemycard, cs.length]), enemy, false);
							setTimeout(function() {
								enemy.update();
							}, 1000);
						}, 2000);
					}, 1000);
				}
			}, 2000);
			"step 1"
			if (result.bool && result.cards.length) {
				event.cs = result.cards;
				event.num = result.cards.length;
				event.i = 0;
				if (player.cardPile.getCards("h").length < event.num) {
					event.willcg = event.cs.concat(player.cardPile.getCards("h")).randomGets(event.num);
				} else event.willcg = player.cardPile.getCards("h").randomGets(event.num);
				event.daith = event.cs.map(i => event.daith2.indexOf(i)).sort();
			} else event.goto(6);
			event.band2.delete();
			"step 2"
			player.cardPile.directgain([event.cs[event.i]]);
			player.$give(event.cs[event.i], player.discardPile, false);
			event.i++;
			game.delay();
			if (event.i < event.num) event.redo();
			"step 3"
			player.hs_sort();
			event.i = 0;
			event.hs_res = event.daith2.slice(0);
			for (let i = 0; i < event.num; i++) {
				var c = game.createCard();
				c.style.display = "none";
				event.hs_res[event.daith[i]] = c;
			}
			player.node.handcards1.innerHTML = "";
			event.hs_res.forEach((i, j) => {
				player.node.handcards1.appendChild(i);
				if (event.daith.includes(j)) event.hs_res[j] = event.willcg.pop();
			});
			game.delay(2);
			"step 4"
			var pos = event.daith[event.i];
			var cs = event.hs_res[pos];
			player.cardPile.node.handcards1.removeChild(cs);
			player.node.handcards1.removeChild(player.node.handcards1.childNodes[pos]);
			player.node.handcards1.appendChild(cs);
			player.node.handcards1.insertBefore(cs, player.node.handcards1.childNodes[pos]);
			ui.updatehl();
			if (pos == 0) cs.addTempClass("start");
			player.discardPile.$give([cs], player, false);
			event.i++;
			game.delay();
			if (event.i < event.num) event.redo();
			"step 5"
			game.delay(1.5);
			"step 6"
			game.delay(1.5);
		});
		return next;
	},
	hs_place(num) { //其他随从给新增随从腾出位置
		var m = this.countFellow();
		var n = 7;
		if (m == 0 || m == n) return;
		var fls = this.getFellow().sort(lib.sort.position);
		if (!this.hasFellow(fl => parseInt(fl.dataset.position) == num)) {
			fls.forEach((i, j) => i.dataset.position = 2 + j + (this == game.me ? 0 : n) + "");
		}
		this.countFellow(fl => {
			var i = parseInt(fl.dataset.position);
			if (i >= num) {
				fl.dataset.position = i + 1 + "";
				if (fl.truepos) fl.truepos++;
			}
		});
	},
	//from extension.js
	hs_drawDeck2(cards, num = 1, dft) { //定向检索
		const that = this;
		if (typeof cards == "function") {
			var f = cards;
			cards = that.cardPile.getCards("h", f);
			if (cards.length < num && dft) {
				var cha = num - cards.length;
				for (let i = 0; i < cha; i++) {
					cards.add(get.chscard(dft));
				}
			} else cards = cards.randomGets(num);
		}
		if (!cards.length) return;
		const cs = cards.map(i => [i]);
		cs.forEach(i => {
			that.hs_drawDeck(i);
		});
	},
	hs_drawDeck(...args) { //抽牌
		if (this.isMin()) return;
		const next = game.createEvent('hs_drawDeck', false);
		next.player = this;
		for (let i = 0; i < args.length; i++) {
			var g = args[i];
			if (typeof g == "number") {
				if (g > 0) next.num = g;
				else {
					_status.event.next.remove(next);
					return;
				}
			} else if (typeof g == "boolean") next.log = g;
			else if (get.hstype(args[i]) == "cards") next.cards = args[i];
			else if (typeof g == "string") {
				if (g == "notrigger") next.notrigger = true;
			}
		}
		next.num ??= 1;
		next.log ??= true;
		next._args = args;
		next.setContent(function() { //抽卡
			"step 0"
			event.i = 0;
			event.a = 0;
			event.remv = [];
			"step 1"
			if (event.炸服(evt => evt.i >= 40)) return;
			var deck = player.cardPile;
			var deck2 = player.discardPile;
			if (!event.cards) {
				event.cards = [];
				if (deck.countCards("h")) event.cards = deck.getCards("h").slice(0, 1);
			}
			event.i++;
			event.deck = deck;
			event.deck2 = deck2;
			if (event.cards.length && !event.notrigger) {
				var card = event.cards[0];
				var info = get.info(card);
				if (info.onhsdraw) {
					if (event.log) game.log(player, "从", event.deck, "获得了", card);
					event.remv.add(card);
					card.HSF("morefocus");
					event.insert(info.onhsdraw, {
						player,
						card,
					});
					game.delay();
					player.heroskill.pos.directgain(event.cards);
					player.hs_drawDeck();
				}
			}
			"step 2"
			get.HSF("checkdeck");
			if (!player.HSF("alive") && event.i >= event.num) event.finish();
			else {
				event.pre = event.a;
				if (event.cards.length) {
					if (!event.remv.includes(event.cards[0])) {
						if (player.countCards('h') < player.getHandcardLimit()) {
							if (event.log) game.log(player, "从", event.deck, "获得了一张牌");
							event.a++;
							player.directgain(event.cards);
							event.deck2.$give(player == game.me ? lib.hearthstone.mecard : lib.hearthstone.enemycard, player, false);
						} else {
							event.deck2.$throw(event.cards);
							setTimeout(function() {
								ui.clear()
							}, 500);
						}
						get.HSF("checkhand");
					} else event.a++;
				} else {
					game.log(player, "#g疲劳", "！");
					player.addMark("hs_pilao", 1, false);
					player.hs_dmgrcv("damage", player.countMark("hs_pilao"), "nosource", "nocard");
					event.goto(6);
				}
			}
			"step 3"
			if (event.pre == event.a && player.countCards('h') >= player.getHandcardLimit()) {
				game.log(player, "的", event.cards, "被摧毁了！");
				player.heroskill.pos.directgain(event.cards);
				player.HSFT("手牌十张");
				game.delay(0.5);
				event.goto(6);
			}
			if (event.deck.countCards("h") <= 1) {
				if (event.deck.countCards("h") == 1) player.HSFT("牌库快空");
				else {
					player.HSFT("牌库空");
					event.deck.classList.add("hs_nocard");
				}
			}
			"step 4"
			if (event.cards.length) {
				if (player.getStat().gain == undefined) player.getStat().gain = 1;
				else player.getStat().gain++;
				event.result = {
					cards: event.cards
				};
				if (!event.notrigger) {
					var card = event.cards[0];
					var info = get.info(card);
					if (info.addhand) {
						if (event.log) game.log(player, "从", event.deck, "获得了", card);
						card.HSF("morefocus");
						get.HSF("Aud", [card, "trigger"]);
						event.insert(info.addhand, {
							player,
							card: card
						});
					}
					get.HSF("event", ["drawAfter", {
						player,
						card,
						hs_heroskill: event.hs_heroskill,
					}]);
				}
			}
			"step 5"
			game.delay();
			"step 6"
			if (event.onbuff && event.cards?.length > 0) event.onbuff(event.cards);
			event.result = {
				cards
			};
			if (event.i < event.num) {
				delete event.cards;
				event.goto(1);
			} else event.finish();
		});
		return next;
	},
	settlehsFL() { //给即将上场的随从安排位置
		var m = this.countFellow();
		var pos;
		if (this == game.me) {
			if (ui.hs_testfl.num <= m + 2 && !game.me.hasFellow(fl => parseInt(fl.dataset.position) == ui.hs_testfl.num)) {
				pos = ui.hs_testfl.num;
				ui.hs_testfl.num = 2;
			} else pos = get.rand(2, m + 2);
		} else {
			var n = 7;
			pos = get.rand(2, m + 2) + n;
		}
		return pos;
	},
	//攻击
	hs_attack(target) {
		var next = get.HSF("xvlie", ["hs_attackxl", {
			attacker: this,
			victim: target,
		}]);
		next.setContent(function() {
			"step 0"
			game.log(event.attacker, "对", event.victim, "发动了攻击");
			event.victim;
			event.triedeff = [];
			"step 1"
			event.curvictim = event.victim;
			"step 2"
			//攻击前事件
			get.HSF("event", ["attackBefore", {
				player: event.attacker,
				target: event.victim,
			}]);
			"step 3"
			if (event.curvictim != event.victim) {
				game.log("攻击目标改为了", event.victim);
				event.goto(1);
			} else {
				delete event.triedeff;
				game.delay(0.5);
			}
			"step 4"
			//攻击时事件
			get.HSF("event", ["attackBegin", {
				player: event.attacker,
				target: event.victim,
			}]);
			"step 5"
			/*代码修改：插入死亡阶段*/
			//get.HSF("checkdeath");
			"step 6"
			/*代码修改：插入胜负裁定*/
			get.HSF("checkwin", [event, true]);
			"step 7"
			if (!event.attacker.HSF("alive") || !event.victim.HSF("alive")) {
				event.attackCancelled = true;
				event.attacker.classList.remove("hs_atkprepare");
				if (!event.attacker.HSF("alive")) event.goto(13);
				else event.goto(11);
			}
			"step 8"
			if (!event.quick) game.delay(0.5);
			"step 9"
			//进攻动画
			var atk = event.attacker;
			var def = event.victim;
			var res = get.HSF("attackact", [event.attacker, event.victim]);
			var a = atk.style.transform;
			var z = atk.style.zIndex;
			atk.hs_attackAct = true;
			if (atk.isMin()) atk.style.transition = "all 0.08s";
			else atk.style.transition = "all 0.14s";
			atk.style.zIndex = 99;
			atk.classList.remove("hs_atkprepare");
			var begin = 'translateY(' + res[0] + 'px) translateX(' + res[1] + 'px)';
			var end = (function(o) {
				if (o.isMin()) {
					if (game.me.hasFellow(o)) return "perspective(100px) translateY(8px) translateZ(10px) scale(0.9)";
					else return "perspective(100px) translateY(-8px) translateZ(10px) scale(0.9)";
				} else {
					if (o == game.me) return "perspective(100px) rotateX(2deg) translateY(17px) translateZ(10px)";
					else return "perspective(100px) translateY(-18px) translateZ(10px)";
				}
			})(atk);

			if (event.attacker.hasgjz("sheji")) { //射击关键词ZZADAN
				event.attacker.HSline(event.victim, "green");
				event.victim.hs_dmgrcv(event.attacker, "damage", event.attacker.ATK);
				setTimeout(function() {
					delete atk.hs_attackAct;
					atk.style.zIndex = z;
				});
				event.goto(11);
				return;
			} //射击关键词结束
			atk.style.transform = begin;
			setTimeout(function() {
				atk.style.transition = "all 0.5s";
				atk.style.transform = end;
				setTimeout(function() {
					atk.style.transform = a;
				}, 500);
			}, (atk.isMin() ? 80 : 140));
			setTimeout(function() {
				delete atk.hs_attackAct;
				atk.style.zIndex = z;
			}, 1550);
			"step 10"
			//伤害步骤
			event.attacker.hs_dmgrcvbt(event.victim);
			"step 11"
			event.attacker.hs_attacked++;
			if (!event.attacker.isMin()) event.attacker.hs_state.atks++;
			get.HSF("checkcanatk");
			"step 12"
			//攻击后事件
			if (!event.attackCancelled) get.HSF("event", ["attackEnd", {
				player: event.attacker,
				target: event.victim,
			}]);
			"step 13"
			if (!event.attacker.isMin() && event.attacker.data_weapon) {
				event.attacker.data_weapon.buff.forEach(i => {
					if (i.temptri == "attack") event.attacker.data_weapon.removehsbuff(i);
				});
				event.attacker.buff.forEach(i => {
					if (i.temptri == "attack") event.attacker.removehsbuff(i);
				});
			}
			"step 14"
			get.HSF("checkdeath");
			"step 15"
			if (event.attacker == game.me) game.delay(0.5);
		});
		return next;
	},
	//使用英雄技能
	hs_use_heroskill() { //使用英雄技能
		var h = this.heroskill;
		var next = get.HSF("xvlie", ["hs_use_heroskillxl", {
			player: this,
			skill: h.skill,
			needTarget: true,
			filterTarget: h.filterTarget,
			randomHT: h.randomHT,
			ai: h.hrskai,
			cost: h.cost,
		}]);
		if (!next.filterTarget && !next.randomHT) next.needTarget = false;
		next.setContent("hs_use_heroskill");
		return next;
	},
	hs_heroskillEffect(t, con) { //结算英雄技能
		const next = game.createEvent("hs_heroskillEffect", false);
		next.player = this;
		next.target = t;
		next.setContent(con);
		return next;
	},
	hs_yin(tm, nobuff) { //入场
		const that = this;
		var info = that.HSF("info");
		if (info && !nobuff) {
			var f = function() {
				that.subtype = "HS_effect";
				if (get.hstype(that) == "player") that.addtriggerbuff(that, undefined, that.HSF("recheck"));
				else that.addtriggerbuff(that.linkCard[0], undefined, that.HSF("recheck"));
				if (info.hs_fq) that.addFqbuff("hs_power", info.hs_fq);
				if (info.skillgh) {
					for (let i in info.skillgh) {
						that.addaurasbuff(i).subtype = "skillgh";
					}
				}
				if (info.numgh) {
					if (info.numgh.auras) {
						info.numgh.auras.forEach(i => {
							that.addaurasbuff(i);
						});
					} else that.addaurasbuff(info.numgh);
				}
				if (info.onadd) info.onadd(that);
				if (info.noattack) that.addztbuff("noattack");
				if (info.jinu) {
					that.addjinubuff(info.jinu);
				}
				var yin = get.HSAT("yineng");
				for (let i in yin) {
					if (info[i]) that.addgjzbuff(i);
				}
			};
			f();
			if (info.chongfeng) setTimeout(function() {
				if (that.HSF("alive")) that.addTempClass("chongfeng2");
			}, (tm || 0) + 600) + (get.hslegend(that) ? 500 : 0);
		}
		if (that.buff.length > 0) that.hs_judge();
		get.HSF("updateauras", [that.swt]);
	},
	hasAuras(name) { //己方单位有光环
		const that = this;
		if (that.isMin()) return that.hasAuras2(name);
		return that.sctp("myside", i => i.hasAuras2(name));
	},
	hasAuras2(name) { //计算一个单位是否有光环
		const that = this;
		return that.buff.some(m => {
			if (m.iswork() && m.name == name && m.type == "auras") {
				if (that.HSF("alive")) return true;
				else return m.subtype != "skillgh";
			}
		});
	},
	aurasEffed(name, args) { //受到光环影响
		const that = this;
		var auras = [];
		if (!args) {
			auras = that.sctp("field").reduce((x, y) => x.concat(y.buff.filter(i => i.ghwork(name, that, [null, y, that]))), []);
		} else auras = that.sctp("field").reduce((x, y) => x.concat(y.buff.filter(i => i.ghwork(name, that, args))), []);
		return auras.length;
	},
	countFq() { //获取法强
		const that = this;
		var cost = 0;
		var buffs = that.sctp("myside").reduce((x, y) => x.concat(y.buff.filter(i => i.iswork() && i.type == "hs_power")), []).concat(that.sctp("field").reduce((x, y) => x.concat(y.buff.filter(i => i.ghwork("hs_power", null, [null, y, that]))), []));
		buffs.sort(lib.sort.attendseq);
		buffs.forEach(i => {
			cost += i.value;
		});
		return cost;
	},
	hs_silence() { //沉默
		const that = this;
		that.buff.forEach(i => {
			if (i.onremove) i.onremove(that);
		});
		that.buff = [];
		var num = that.maxHp - that.baseHP;
		that.maxHp = that.baseHP;
		that.hs_dm -= num;
		that.hs_dm = Math.max(0, that.hs_dm);
		that.triggers = {};
		that.addgjzbuff("chenmo");
	},
	hs_reverse() { //交换攻击力和血量
		var arr = [this.hp, this.ATK];
		this.addvaluefinal(arr, true);
	},
	//buff相关
	addhsbuff(obj) { //加buff
		if (!obj) return null;
		const that = this;
		if (Array.isArray(obj)) this.buff.addArray(obj);
		else {
			if (obj.uniquebuff && this.buff.some(b => b.uniquename == obj.uniquename)) return;
			obj.creator ||= that;
			obj.fellow ||= that;
			obj.iswork = function() {
				if (this.countphase) {
					if (this.temp % 1 == 0) {
						if (this.countphase != _status.currentPhase) return false;
					}
				}
				if (this.type == "trigger") return true;
				var f = this.fellow;
				return !this.sleep && (!this.filter || this.filter(f.getLeader(), f));
			};
			obj.inrange = function(tg) {
				var f = this.fellow;
				if (tg?.swt) {
					if (!this.wpal) return false;
				}
				return !this.range || this.range(f, tg);
			};
			obj.ghwork = function(name, target, args) {
				return this.type == "auras" && this.name == name && this.iswork() && this.inrange(target) && (!this.ghfilter || this.ghfilter.apply(this, args));
			};
			obj.stid = get.id();
			_status.hsAttendSeq.ad(obj);
			this.buff.add(obj);
		}
	},
	addturnbuff(name, value, fil = lib.filter.all, num = 1, limit = 1) { //你的下一张xx法力值消耗减少（y）点
		const that = this;
		if (name == "hs_cost") return that.addcostbuff(value, fil, num);
		if (value !== 0) value ||= 1;
		var obj = {
			name,
			type: "auras",
			type2: "cost",
			value,
			fil,
			used: false,
			limit,
			temp: num,
			countphase: that,
			ghfilter(card, fellow, target) {
				return this.used === false && target == fellow.getLeader() && this.fil(card, target);
			},
		};
		that.addhsbuff(obj);
		return obj;
	},
	addcostbuff(value, fil = lib.filter.all, num = 1, limit = 1) { //添加次数减费光环
		const that = this;
		if (value !== 0) value ||= 1;
		var obj = {
			name: "hs_cost",
			type: "auras",
			type2: "cost",
			value,
			fil,
			used: false,
			limit,
			temp: num,
			countphase: that,
			ghfilter(card, fellow, target) {
				return this.used === false && target == fellow.getLeader() && this.fil(card, target);
			},
		};
		that.addhsbuff(obj);
		return obj;
	},
	addautovaluebuff(value, tg) { //加自动取名的身材buff
		const that = this;
		if (typeof value == "number") value = [value, 0];
		var obj = {
			type: "value",
			value: value,
		};
		if (typeof tg == "string") obj.uniquename = tg;
		else obj.uniquename = tg.name;
		that.addhsbuff(obj);
		setTimeout(function() {
			if (obj.iswork() && value[0] > 0 && value[1] == 0 && !that.classList.contains("jinu")) that.addTempClass("kuangbao", 700);
		}, 100);
		return obj;
	},
	addvaluefinal(value, bo) { //身材变成固定值
		const that = this;
		if (typeof value == "number") value = [value, 0];
		var obj = {
			type: "value",
			subtype: "final",
			subtype2: bo ? "reverse" : "",
			value: value,
		};
		that.addhsbuff(obj);
		if (bo || value[1] != 0) that.hs_dm = 0;
		that.updatehsfl();
		return obj;
	},
	addvaluebuff(value, num, name, uniquename) { //加身材buff
		const that = this;
		if (typeof value == "number") value = [value, 0];
		var obj = {
			type: "value",
			value: value,
			temp: num,
		};
		obj.name = name;
		if (uniquename) obj.uniquename = uniquename;
		else if (obj.name) obj.uniquename = obj.name;
		that.addhsbuff(obj);
		setTimeout(function() {
			if (obj.iswork() && value[0] > 0 && value[1] == 0 && !that.classList.contains("jinu")) that.addTempClass("kuangbao", 700);
		}, 100);
		return obj;
	},
	addgjzbuff(word, num) { //加关键字buff
		const that = this;
		let obj = {};
		if (typeof word == "string") {
			if (["dongjie", "jvdu", "xixie"].includes(word)) {
				obj = ({
					sc: true,
				});
				if (word != "xixie") obj.alias = get.HSAT("yineng")[word];
				if (word == "jvdu") {
					obj.filter = function(evt) {
						return evt.player.isMin();
					};
					obj.effect = function() {
						get.HSF("cuihui", [event.evt.player]);
					};
				} else if (word == "xixie") {
					obj.later = 1;
					obj.filter = function(evt) {
						return !evt.card;
					};
					obj.effect = function() {
						player.hs_dmgrcv("recover", event.evt.num, event.fellow);
					};
				} else {
					obj.effect = function() {
						event.evt.player.addgjzbuff("dongjied");
					};
				}
				that.addtriggerbuff({
					info: {
						hsdmg: obj
					}
				});
			} else if (word == "kuangfu") {
				obj = ({
					fl: true,
					filter(evt, p, f) {
						return evt.target.isMin();
					},
					effect() {
						var tgs = event.evt.target.sctp("neighbor_");
						if (tgs.length) player.hs_dmgrcvaoe("damage", event.fellow, tgs, event.fellow.ATK);
					},
				});
				that.addtriggerbuff({
					info: {
						attackEnd: obj
					}
				});
			} else if (word == "jianwang") {
				obj = ({
					half: true,
					fl: true,
					filter(evt, p, f) {
						return evt.player.sctp("opposide").length >= 2;
					},
					async effect() {
						const ntg = event.evt.player.sctp("opposide").filter(i => i != event.evt.target).randomGet();
						event.orievt.victim = ntg;
						event.orievt.triedeff.add(event.obj);
					},
				});
				that.addtriggerbuff({
					info: {
						attackBefore: obj
					}
				});
			}
			word = [word];
		}
		const bo = that.smtp == "S";
		const obj2 = {
			type: "ability",
			value: word,
			temp: num,
		};
		that.addhsbuff(obj2);
		setTimeout(function() {
			if (that.smtp == "S" && that.HSF("alive")) {
				that.updatehsfl();
				delete that.smtp;
			}
		}, bo ? 1800 : 1000);
		return obj2;
	},
	addztbuff(zt, num) { //加状态buff
		const that = this;
		if (typeof zt == "string") zt = [zt];
		const obj = {
			type: "status",
			value: zt,
			temp: num,
		};
		that.addhsbuff(obj);
		return obj;
	},
	addtriggerbuff(card, num, recheck) { //加扳机buff
		const that = this;
		var info = null;
		if (card?.info) {
			info = card.info;
			card = card.creator || that;
		}
		var obj = {
			type: "trigger",
			value: [],
			player: get.player(),
			creator: card,
			fellow: that,
			temp: num,
		};
		let origin = false;
		if (!info) {
			if (get.hstype(card) == "card") info = card.HSF("info");
			else if (get.hstype(card) == "player") {
				info = lib.skill[card.name];
				origin = true;
			} else get.hs_alt("addtriggerbuff:info不存在");
		}
		get.HSA("triggers").forEach(i => {
			if (info[i]) {
				var item = typeof info[i] == "function" ? {
					effect: info[i]
				} : get.copy(info[i]);
				item.triname = i;
				if (origin && i == "deathRattle") item.origin = true;
				item.anm = info.anm;
				item.creator = card;
				item.fellow = that;
				item.relabuff = obj;
				if (!["battleRoal", "jili", "deathFL", "discarded"].includes(i)) {
					if (!that.triggers[i]) that.triggers[i] = [];
					that.triggers[i].add(item);
				} else that.triggers[i] = item;
				obj.value.add(item);
				if (item.recheck === undefined && recheck) item.recheck = "filter";
			}
		});
		if (obj.value.length) that.addhsbuff(obj);
		return obj;
	},
	addaurasbuff(name, f, num) { //加光环buff
		const that = this;
		var obj = {};
		if (typeof name == "string") obj.name = name;
		else obj = get.copy(name);
		if (f) obj.value = f;
		if (num) obj.temp = num;
		obj.type = "auras";
		obj.sleep = true;
		obj.creator = that;
		obj.fellow = that;
		obj.leader = that.getLeader();
		if (!obj.range) obj.range = "mine_";
		if (typeof obj.range == "string") obj.range = get.HSA("funcs")[obj.range];
		that.addhsbuff(obj);
		return obj;
	},
	addFqbuff(name, f, num) { //加法强buff(其他buff)
		const that = this;
		var obj = {
			name,
			type: name,
			value: f,
			temp: num,
			creator: that,
			fellow: that,
			leader: that.getLeader(),
		};
		that.addhsbuff(obj);
		return obj;
	},
	addjinubuff(obj) { //加激怒buff
		const that = this;
		var f = function(p, f) {
			return f.isDamaged();
		};
		var o = this.addgjzbuff("jinu");
		o.filter = f;
		if (obj.value) {
			var a = that.addvaluebuff(obj.value);
			a.filter = f;
		}
		if (obj.ability) {
			var b = that.addgjzbuff(obj.ability);
			b.filter = f;
		}
	},
	addwpbuff() { //添加武器buff
		const that = this;
		var wp = that.data_weapon,
			vbuff, gbuff;
		for (let i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "number") vbuff = arguments[i];
			else if (typeof arguments[i] == "string") gbuff = arguments[i];
			else if (Array.isArray(arguments[i])) vbuff = arguments[i];
			else if (arguments[i]?.classList) {
				if (arguments[i].classList.contains("hs_wp")) wp = arguments[i];
			}
		}
		if (vbuff) wp.addvaluebuff(vbuff);
		if (gbuff) wp.addgjzbuff(gbuff);
	},
	findhsbuff(name) { //根据名字寻找buff
		if (!name) return null;
		for (let i = 0; i < this.buff.length; i++) {
			var j = this.buff[i];
			if (j.name == name) return j;
		}
		return null;
	},
	removehsbuff(obj) { //移除buff
		const that = this;
		if (Array.isArray(obj)) {
			obj.forEach(i => that.removehsbuff(i));
			return;
		}
		if (obj.type == "value" && obj.value) {
			if (obj.subtype != "final" && (typeof obj.value != "function") && obj.value[1] > 0) {
				var v = obj.value[1];
				that.hs_dm = Math.max(0, that.hs_dm - v);
			}
		}
		if (obj.name == "value" && obj.type == "auras" && obj.value) {
			if (obj.subtype != "final" && (typeof obj.value != "function") && obj.value[1] > 0) {
				var v = obj.value[1];
				game.filterPlayer(p => obj.range(that, p)).forEach(p => {
					p.hs_dm = Math.max(0, p.hs_dm - v);
				});
			}
		}
		if (obj.type == "trigger") {
			var tris = get.HSA("triggers");
			tris.forEach(i => {
				var tr = that.triggers[i];
				if (tr?.length) {
					tr.removeArray(obj.value);
				}
			});
		}
		if (obj.onremove) obj.onremove(that);
		that.buff.remove(obj);
	},
	updateSelfBuff(value, temp) { //更新随从牌面的buff
		if (typeof value == "number") value = [value, 0];
		var p = this;
		var id = p.playerid;
		var name = p.name + "_" + id;
		var obj = p.buff.findLast(i => i.name == name);
		if (!obj || p.buff.slice(p.buff.indexOf(obj) + 1).filter(i => i.type == "value").length) {
			p.addvaluebuff(value, temp, name);
			get.HSF("checkfellow");
		} else {
			if (obj.tvalue == undefined) obj.tvalue = get.copy(obj.value);
			obj.tvalue[0] += value[0];
			obj.tvalue[1] += value[1];
			setTimeout(function() {
				if (obj.iswork() && value[0] > 0 && value[1] == 0 && !p.classList.contains("jinu")) p.addTempClass("kuangbao", 700);
			}, 100);
		}
	},
	hasgjz(word) { //有关键字
		const that = this;
		if (Array.isArray(word)) return word.some(w => that.hasgjz(w));
		if (that.buff.some(i => i.iswork() && i.type == "ability" && i.value.includes(word))) return true;
		else {
			if (get.hstype(that) != "player") return false;
			else {
				var bo1 = that.predata_weapon?.hasgjz(word);
				var bo2 = that.data_weapon?.hasgjz(word);
				return bo1 || bo2 || that.sctp("all", y => y.buff.some(i => i.name == "ability" && i.type == "auras" && i.value.includes(word) && i.ghwork("ability", that, [null, y, that])));
			}
		}
	},
	removegjz(word) { //失去关键字buff
		const that = this;
		if (Array.isArray(word)) {
			word.forEach(i => {
				that.removegjz(i);
			});
			return;
		}
		if (that.buff) {
			var bin = [];
			for (let i of that.buff) {
				if (i.type == "ability" && i.value.includes(word)) {
					i.value.remove(word);
					if (i.value.length == 0) bin.add(i);
				}
			}
			that.removehsbuff(bin);
		}
		if (get.hstype(that) == "player" && !that.isMin() && that.data_weapon) that.data_weapon.removegjz(word);
	},
	scpl(str) { //根据字符串获取角色
		if (get.hstype(str) == "player") return str;
		var full = ["self", "me", "enemy", "leader", "oppo", "fellow"];
		if (full.includes(str)) str = "SMELOF" [full.indexOf(str)];
		var obj = {
			S: this,
			M: game.me,
			E: game.enemy,
			L: this.getLeader(),
			O: this.getOppo2(),
			F: _status.event.fellow,
		};
		return obj[str] || get.player();
	},
	sctp(str, mr, filter) { //根据字符串获取角色们
		if (get.hstype(str) == "players") return str;
		var notthis;
		if (!str) str = "mr";
		if (typeof str == "string" && str.slice(-1) == "_") {
			str = str.slice(0, -1);
			notthis = true;
		}
		var full = ["minors"];
		if (full.includes(str)) str = ["mns"][full.indexOf(str)];
		var obj = {
			mns: get.HSF("minors"),
			heros: [this.getLeader(), this.getOppo2()],
			main: [get.hs_main(), get.hs_main().getOppo()],
			me: game.me.getFellowN(),
			enemy: game.enemy.getFellowN(),
			myside: this.getLeader().getFellowN(),
			opposide: this.getOppo2().getFellowN(),
			mine: this.getLeader().getFellow(),
			notmine: this.getOppo2().getFellow(),
			neighbor: this.HSF("alive", [true]) ? [this.leftseat, this.rightseat].filter(i => i) : [],
			all: game.filterPlayer(),
			field: (function() {
				var res = [];
				var ar = ["me", "enemy"];
				ar.forEach(i => {
					res.add(game[i].data_weapon);
					res.add(game[i].predata_weapon);
					if (game[i].secrets) res.addArray(game[i].secrets);
				});
				return res.filter(i => i);
			})().concat(game.filterPlayer()),
			mr: (typeof mr == "string" ? this.sctp(mr) : game.filterPlayer())
		};
		var res = obj[str] || [];
		if (notthis) res.remove(this);
		if (typeof mr == "function") {
			if (filter) return res.filter(mr);
			else return HSarray.es(res, mr);
		}
		if (get.hstype(mr) == "player") return res.includes(mr);
		return res;
	},
	//新事件函数
	hs_Missiles(num = 3, bo, range) { //导弹效果
		const next = game.createEvent("hs_Missiles", false);
		next.player = this;
		next.num = num;
		if (bo) {
			next.num += next.player.countFq();
			next.num *= next.player.HSF("countvelen");
		}
		next.ng = range;
		next.setContent(function() {
			"step 0"
			event.i = 0;
			"step 1"
			event.pls = player.sctp(event.ng, "opposide").filter(t => t.canhsdmg());
			if (event.pls.length) {
				var t = event.pls.randomGet();
				player.HSline(t, "green");
				t.hs_dmgrcv("damage", player);
				event.i++;
			} else event.goto(3);
			"step 2"
			game.delay();
			if (event.i < event.num) event.goto(1);
			"step 3"
		});
		return next;
	},
	hs_spellEffect(c, t, eff) { //魔法效果
		const next = game.createEvent("hs_spellEffect", false);
		next.card = c;
		next.cards = [c];
		next.player = this;
		next.target = t;
		next.active = eff;
		var f = get.info(c);
		if (!next.target && f.randomRT) {
			next.target = f.randomRT(this);
			if (Array.isArray(next.target)) {
				next.targets = next.target;
				next.target = next.targets[0];
			}
			next.filterStop = function() {
				if (!this.target) {
					delete this.filterStop;
					this.finish();
					this._triggered = null;
					return true;
				}
			};
		}
		if (next.target && !next.targets) next.targets = [next.target];
		if (next.target) {
			if (typeof next.target !== "boolean") {
				this.HSline(next.targets, "green");
				if (next.targets.length == 1) game.log(this, "对", (next.target == this ? "#b自己" : next.target), "使用了", c);
				else game.log(this, "对", next.targets, "使用了", c);
			}
		} else game.log(this, "使用了", c);
		next.effect = f.content || f.onhsdraw || lib.filter.all;
		next.setContent(function() {
			"step 0"
			game.delay();
			"step 1"
			event.insert(event.effect, {
				player,
				target,
				targets,
				card,
				cards,
				active: event.active,
			});
		});
		return next;
	},
	use_effect(obj) { //施放效果
		const next = game.createEvent("use_effect", false);
		for (var i in obj) {
			next[i] = obj[i];
		}
		next.setContent(function() {
			"step 0"
			event.info = get.info(card);
			if (event.info.hs_gz) {
				const num = event.info.hs_gz;
				player.addMark("hs_mana_owed", num, false);
				game.log(player, "过载了", num, "个法力水晶");
				player.HSF("updatemana");
				get.HSF("event", ["overload", {
					player,
					card,
					cards,
					num,
				}]);
			}
			"step 1"
			event.insert(event.info.content, {
				player,
				target,
				targets,
				card,
				cards,
				active: event.active,
			});
		});
		return next;
	},
	use_secret(card) { //挂奥秘
		const next = game.createEvent("use_secret", false);
		next.player = this;
		if (typeof card == "string") card = get.chscard(card);
		next.card = card;
		next.setContent(function() {
			"step 0"
			const div = lib.element.HSsecret.create(player, card);
			_status.hsAttendSeq.ad(div);
			"step 1"
			if (!player.secretbd.classList.contains("active")) {
				player.secretbd.addTempClass("active", 3000);
			}
			game.delay();
			"step 2"
		});
		return next;
	},
	hs_battleRoal(t, f, eff) { //战吼
		/*代码修改：没写就什么都不发生*/
		if (!f.effect) return;
		let that = this;
		if (get.hstype(that) != "player") that = that.equiping;
		const next = game.createEvent("hs_battleRoal", false);
		next.fellow = this;
		next.player = that.getLeader();
		next.target = t;
		next.active = eff;
		if (!next.target && f.randomRT) {
			if (!next.target && f.randomRT) {
				next.target = f.randomRT(next.player, next);
				if (!next.target) {
					next.setContent(function() {});
					return;
				}
			}
		}
		next.effect = f.effect;
		next.setContent(function() {
			"step 0"
			game.delay(0.5);
			"step 1"
			var ch = function(p) {
				if (get.hstype(p) == "player") return p;
				return p.linkCard[0];
			};
			if (target) {
				event.fellow.HSline(target, "green");
				game.log(ch(event.fellow), "对", (target == event.fellow ? "#b自己" : ch(target)), "发动了战吼效果");
			} else game.log(ch(event.fellow), "发动了战吼效果");
			event.insert(event.effect, {
				player,
				fellow: event.fellow,
				target,
				active: event.active,
			});
		});
		return next;
	},
	hs_trisEffect(obj, evt) { //扳机效果
		/*代码修改：如果没写就什么都不发生*/
		if (!obj.effect) return;
		if (this.swt && !this.HSF("alive")) return;
		const next = game.createEvent("hs_trisEffect", false);
		next.fellow = this;
		next.player = this.getLeader();
		var cancel = false;
		if (obj.secret && (typeof obj.filter2 == "function")) {
			if (!obj.filter2(evt, next.player)) cancel = true;
		}
		if (obj.half) {
			if (Math.random() < 0.5) {
				if (evt.evt.triedeff) evt.evt.triedeff.add(obj);
				cancel = true;
			}
		}
		if (obj.randomRT) {
			next.target = obj.randomRT(next.player, evt, next.fellow);
			if (!next.target) cancel = true;
		}
		if (obj.recheck) {
			if (obj.recheck == "filter") obj.recheck = obj.filter || lib.filter.all;
			if (typeof obj.recheck == "string") {
				var arr = obj.recheck.split(",");
				if (arr.length == 1) {
					var f = get.HSA("funcs")[arr[0]];
					if (f) obj.recheck = f;
					else get.hs_alt("hs_trisEffect:", obj.recheck);
				} else {
					var fs = arr.map(i => get.HSA("funcs")[i]);
					var ff = function(e, p, f) {
						return ff.fs.every(i => i(e, p, f));
					};
					ff.fs = fs;
					obj.recheck = ff;
				}
			}
			if (!obj.recheck(evt, next.player, this, obj)) cancel = true;
		}
		if (cancel || !game.me.sctp("field", this)) {
			next.setContent(function() {});
			return next;
		}
		next.effect = obj.effect;
		next.evt = evt;
		next.anm = obj.anm;
		next.obj = obj;
		if (obj.secret) {
			next.tp = "none";
			next.issecret = true;
		} else if (obj.triname == "jili") next.tp = "hs_jl";
		else if (next.evt.name == "hsdmg") {
			if (obj.alias == "剧毒") next.tp = "hs_jd";
			else if (obj.alias == "冻结") next.tp = "none";
			else next.tp = "hs_bj";
		} else next.tp = "hs_bj";
		next.setContent(function() {
			"step 0"
			if (event.obj.charlotte || event.obj.direct) event.goto(4);
			else {
				if (event.evt.name == "summonSucc") game.delay(1.1);
				else game.delay(0.5);
			}
			"step 1"
			if ([game.me, game.me.data_weapon, game.me.predata_weapon].includes(event.fellow)) get.HSF("clickmana", [false]);
			if (target && [game.me, game.me.data_weapon, game.me.predata_weapon, game.me.heroskill].includes(target)) get.HSF("clickmana", [false]);
			if (event.tp != "none" && (event.fellow.isMin() || get.hstype(event.fellow) == "weapon")) {
				var dom = event.fellow.querySelector('.' + event.tp);
				if (!dom) get.hs_alt("no dom:", event.tp);
				dom.addTempClass('active');
			}
			get.HSF("Aud", [event.fellow, "trigger"]);
			game.delay();
			"step 2"
			var ch = function(p) {
				if (get.hstype(p) == "player") return p;
				return p.linkCard[0];
			};
			if (target) {
				if (event.issecret) {
					player.HSline(target, "green");
					game.log(player, "的奥秘", event.obj._args[1], "对", (target == player ? "#b自己" : ch(target)), "触发了");
				} else {
					event.fellow.HSline(target, "green");
					game.log(player, "的", ch(event.fellow), "对", (target == event.fellow ? "#b自己" : ch(target)), "触发了扳机");
				}
			} else {
				if (event.issecret) game.log(player, "的奥秘", event.obj._args[1], "触发了");
				else {
					if (event.fellow == player) game.log(player, "#b自己", "触发了扳机");
					else game.log(player, "的", ch(event.fellow), "触发了扳机");
				}
			}
			"step 3"
			if (event.evt.name == "summonSucc") game.delay(0.3);
			"step 4"
			const eff = {
				player,
				target,
				fellow: event.fellow,
				obj: event.obj,
				evt: event.evt,
				orievt: event.evt.evt,
				anm: event.anm,
			};
			if (event.issecret && event.obj._args?.[1]) {
				eff.card = event.obj._args[1];
				eff.cards = [eff.card];
			}
			event.insert(event.effect, eff);
			"step 5"
			if (!event.isMine()) game.delay(0.5);
		});
		return next;
	},
	hs_deathRattle(f) { //亡语
		const next = game.createEvent("hs_deathRattle", false);
		next.fellow = this;
		next.player = this.getLeader();
		next.effects = f;
		if (!next.effects) next.effects = next.fellow.triggers.deathRattle;
		if (!next.effects) next.effects = [{
			effect() {}
		}];
		if (next.effects.some(eff => !eff.effect)) {
			next.setContent(lib.filter.all);
			return;
		}
		next.setContent(function() {
			"step 0"
			event.effects = event.effects.filter(obj => {
				if (obj.filter) {
					if (typeof obj.filter == "string") {
						const arr = obj.filter.split(",");
						if (arr.length == 1) {
							var f = get.HSA("funcs")[arr[0]];
							if (f) obj.filter = f;
							else {
								get.hs_alt("hs_deathRattle:", obj.filter);
								return false;
							}
						} else {
							var fs = arr.map(i => get.HSA("funcs")[i]);
							var ff = function(e, p, f) {
								return ff.fs.every(i => i(e, p, f));
							};
							ff.fs = fs;
							obj.filter = ff;
						}
					}
					return obj.filter(event, player, event.fellow, obj);
				} else return true;
			});
			if (!event.effects.length) event.finish();
			"step 1"
			event.wyed = 0; //结算过亡语（全部）次数
			event.i = 0; //从第一个亡语开始结算
			event.num = (get.hstype(event.fellow) == "player" && player.hasAuras("doubledeathrattle")) ? 2 : 1;
			"step 2"
			const obj = event.effects[event.i];
			let cancel = false,
				target = null;
			if (obj.randomRT) {
				target = obj.randomRT(player, event, event.fellow);
				if (!target) cancel = true;
			}
			if (cancel) event.goto(4);
			else {
				event.eff = obj;
				event.target = target;
			}
			"step 3"
			var ch = function(p) {
				if (get.hstype(p) == "player") return p;
				return p.linkCard[0];
			};
			if (event.target) {
				if ([game.me, game.me.data_weapon, game.me.predata_weapon, game.me.heroskill].includes(event.target)) get.HSF("clickmana", [false]);
				if (event.fellow.isMin()) {
					event.fellow.HSline(event.target, "green");
					game.log(ch(event.fellow), "对", ch(event.target), "发动了亡语效果");
				} else {
					event.fellow.HSline(event.target, "green");
					game.log(ch(player), "的", ch(event.fellow), "对", ch(event.target), "发动了亡语效果");
				}
			} else {
				if (event.fellow.isMin()) game.log(ch(event.fellow), "发动了亡语效果");
				else game.log(ch(player), "的", ch(event.fellow), "发动了亡语效果");
			}
			if (event.eff.origin) get.HSF("Aud", [event.fellow, "trigger"]);
			event.insert(event.eff.effect, {
				player,
				fellow: event.fellow,
				target: event.target,
				efftype: "亡语",
			});
			"step 4"
			event.i++;
			get.HSF("updateauras", [true]);
			if (event.i < event.effects.length) {
				game.delay();
				event.goto(2);
			}
			"step 5"
			event.wyed++;
			if (event.wyed < event.num) {
				event.i = 0;
				game.delay();
				event.goto(2);
			}
		});
		return next;
	},
	hs_discard(num = 1) { //弃牌
		const next = game.createEvent("hs_discard", false);
		next.player = this;
		if (num == "all") num = this.countCards("h");
		next.num = num;
		next.setContent(function() {
			"step 0"
			var cs = player.getCards("h");
			if (cs.length) {
				var cards = cs.randomGets(num);
				event.cards = cards;
				game.log(player, "弃置了", cards);
				player.lose(cards, ui.special);
				player.$throw(cards);
				setTimeout(function() {
					ui.clear();
					player.discardPile.directgain(cards);
					get.HSF("checkhand");
				}, 500);
			} else event.finish();
			"step 1"
			game.delay(0.5);
			"step 2"
			var evts = [];
			event.cards.forEach(i => {
				evts.push({
					player,
					card: i,
				});
			});
			get.HSF("evts", ["discard", evts]);
			"step 3"
			get.HSF("updateauras", [true]);
		});
		return next;
	},
	hs_gain(cards, source, visible) { //获得牌
		if (!cards.length) return;
		const next = game.createEvent("hs_gain", false);
		next.player = this;
		next.cards = cards;
		if (typeof cards == "string" || cards.length === undefined) next.cards = [cards];
		if (cards.length == 2 && typeof cards[1] == "number") next.cards = get.HSF("repeat", [cards[0], cards[1]]);
		next.source = source;
		next.visible = visible;
		next.setContent(function() {
			"step 0"
			if (!event.result) event.result = {
				cards: []
			};
			if (player.countCards("h") < player.getHandcardLimit()) {
				var c = cards.shift();
				if (get.hstype(c) != "card") {
					c = get.chscard(c);
					c.hs_temp = true;
				}
				event.result.cards.add(c);
				player.directgain([c]);
				c.hs_creator = _status.event.fellow || player;
				if (event.visible !== false) player.$gain2(player == game.me ? c : lib.hearthstone.enemycard, event.source);
				get.HSF("checkhand");
				if (cards.length) {
					game.delay(0.1);
					event.redo();
				}
			}
		});
		return next;
	},
	hs_dmgrcv() { //伤害&&治疗
		const next = game.createEvent("hs_dmgrcv", false);
		next.player = this;
		for (let i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "number") next.num = arguments[i];
			else if (typeof arguments[i] == "string") {
				if (arguments[i] == "sgs") next.sgs = true;
				else if (arguments[i] == "recover") next.type = "recover";
				else if (arguments[i] == "damage") next.type = "damage";
				else if (arguments[i] == "nocard") next.nocard = true;
				else if (arguments[i] == "nosource") next.nosource = true;
				else if (["ice", "fire", "thunder"].includes(arguments[i])) next.nature = arguments[i];
				else next.sctp = arguments[i];
			} else if (get.hstype(arguments[i]) == "player") next.source = arguments[i];
			else if (get.hstype(arguments[i]) == "card") next.card = arguments[i];
			else if (get.hstype(arguments[i]) == "cards") next.cards = arguments[i];
		}
		if (!next.card) {
			if (next.cards) next.card = next.cards[0];
			else next.card = _status.event.card;
		}
		if (!next.cards && next.card) next.cards = [next.card];
		if (next.nocard) {
			delete next.card;
			delete next.cards;
		}
		if (!next.source) next.source = this.scpl(next.sctp);
		if (!next.source) next.nosource = true;
		if (next.nosource) delete next.source;
		if (!next.type) next.type = "damage";
		if (next.num === undefined) next.num = 1;
		next.num = Math.max(0, next.num);
		if (next.sgs) next.num *= 10;
		next.setContent("hs_dmgrcv");
		return next;
	},
	hs_dmgrcvbt(tg) { //战斗伤害
		var p = this;
		var evts = [];
		if (p.ATK) evts.add({
			source: p,
			player: tg,
			num: p.ATK
		});
		if (tg.ATK) evts.add({
			source: tg,
			player: p,
			num: tg.ATK
		});
		if (evts.length) {
			const next = game.createEvent("hs_dmgrcv", false);
			next.evts = evts;
			next.setContent("hs_dmgrcvbt");
			return next;
		}
	},
	hs_dmgrcvaoe() { //aoe伤害&&治疗
		const next = game.createEvent("hs_dmgrcv", false);
		next.player = this;
		for (let i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "number") next.num = arguments[i];
			else if (typeof arguments[i] == "string") {
				if (arguments[i] == "recover") next.type = "recover";
				else if (arguments[i] == "damage") next.type = "damage";
				else if (arguments[i] == "nocard") next.nocard = true;
				else if (arguments[i] == "nosource") next.nosource = true;
				else if (arguments[i] == "nodelay") next.nodelay = true;
				else if (["ice", "fire", "thunder"].includes(arguments[i])) next.nature = arguments[i];
				else next.sctp = arguments[i];
			} else if (get.hstype(arguments[i]) == "player") next.source = arguments[i];
			else if (get.hstype(arguments[i]) == "players") next.targets = arguments[i];
			else if (get.hstype(arguments[i]) == "card") next.card = arguments[i];
			else if (get.hstype(arguments[i]) == "cards") next.cards = arguments[i];
			else if (Array.isArray(arguments[i]) && arguments[i].length == 2) next.expo = arguments[i];
		}
		if (!next.source && next.sctp) next.source = this.scpl(next.sctp);
		if (!next.source) next.nosource = true;
		if (next.nosource) delete next.source;
		if (!next.type) next.type = "damage";
		if (next.num === undefined) next.num = 1;
		next.num = Math.max(0, next.num);
		if (next.targets && next.targets.length > 0) next.setContent("hs_dmgrcvaoe");
		else next.setContent("emptyHSwait");
		return next;
	},
	/*代码修改：多次伤害或回复*/
	hs_dmgrcvNotaoe() { //不按aoe结算的群体伤害或回复
		//player.hs_dmgrcvNotaoe("damage", card, player, 2, "notmine", (p,f)=>!f.isDamaged());
		const next = game.createEvent("hs_dmgrcvNotaoe", false);
		for (let i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "number") next.num = arguments[i];
			else if (typeof arguments[i] == "function") next.tgfilter = arguments[i];
			else if (typeof arguments[i] == "string") {
				if (arguments[i] == "recover") next.type = "recover";
				else if (arguments[i] == "damage") next.type = "damage";
				else if (arguments[i] == "nocard") next.nocard = true;
				else if (arguments[i] == "nosource") next.nosource = true;
				else if (arguments[i] == "nodelay") next.nodelay = true;
				else if (["ice", "fire", "thunder"].includes(arguments[i])) next.nature = arguments[i];
				else next.sctp = arguments[i];
			} else if (get.hstype(arguments[i]) == "player") next.source = arguments[i];
			else if (get.hstype(arguments[i]) == "players") next.targets = arguments[i];
			else if (get.hstype(arguments[i]) == "card") next.card = arguments[i];
			else if (get.hstype(arguments[i]) == "cards") next.cards = arguments[i];
		}
		if (!next.tgfilter) next.tgfilter = () => true;
		if (!next.source && next.sctp) next.source = this.scpl(next.sctp);
		if (!next.source) next.nosource = true;
		if (next.nosource) delete next.source;
		next.player = next.source || this;
		if (!next.type) next.type = "damage";
		if (next.num === undefined) next.num = 1;
		if (next.targets && next.targets.length > 0) next.setContent("hs_dmgrcvNotaoe");
		else next.setContent("emptyHSwait");
		return next;
	},
	SSfellow(fls, oppo, anm, extra) { //召随从
		var l = this.getLeader();
		if (oppo) l = l.getOppo();
		if (l.hs_full()) return;
		const next = game.createEvent("SSfellow", false);
		next.player = l;
		if (this.isMin()) next.fellow = this;
		next.leader = this.getLeader();
		if (typeof fls == "string") {
			next.fls = [fls];
		} else next.fls = fls;
		if (next.fls.length == 1 && next.fls[0].includes(":")) {
			if (next.fls[0].indexOf("cdset:") == 0) {
				const stori = next.fls[0].slice(6).split(",");
				const st = stori[0];
				const list = get.HSA("collect")[st];
				if (list) {
					if (stori[1]) {
						if (stori[1] == "norepeat") next.player.sctp("mine", fl => {
							list.remove(get.translation(fl.name));
						});
					}
					if (list.length) next.fls = [list.randomGet()];
					else get.hs_alt("SSfellow异常：", st, "为空");
				} else get.hs_alt("SSfellow异常：", st, "不存在");
			} else if (next.fls[0].indexOf("range:") == 0) {
				var st = next.fls[0].slice(6);
				var arr = st.split(",");
				var fil = get.hsflt(arr);
				var kc = get.hskachi("HS_minor", fil);
				if (kc.length > 0) next.fls = [kc.randomGet()];
				else {
					_status.event.next.remove(next);
					return;
				}
			}
		}
		if (next.fls.length == 2) {
			if (typeof next.fls[1] == "number") {
				next.fls = get.HSF("repeat", [next.fls[0], next.fls[1]]);
			}
		}
		if (next.fls[1] != undefined && typeof next.fls[1] != "string") {
			get.hs_alt("SSfellow异常：", next.fls);
		}
		if (next.fls.some(i => !i.includes("_monster") && get.type(get.HSF("getEN", [i])) != "HS_minor")) {
			get.hs_alt(next.fls.join(","), ":包含非随从牌");
		}
		next.oppo = oppo;
		next.anm = anm || _status.event.anm;
		if (extra) next.extra = extra;
		else if (_status.event.efftype) {
			if (_status.event.efftype == "亡语") next.extra = ["亡语"];
		}
		next.setContent(function() {
			"step 0"
			event.num = event.fls.length;
			event.i = 0;
			event.toadd = [];
			"step 1"
			if (player.hs_full()) event.goto(10);
			"step 2"
			var p = player;
			var nam = event.fls[event.i];
			var cards = [get.chscard(nam)];
			var pos = (function(evt) {
				var m = p.countFellow();
				var n = p == game.me ? 0 : 7;
				var fh = evt.extra?.some(i => i.indexOf("复活") == 0);
				var wy = evt.extra?.includes("亡语");
				if (fh) evt.notrigger = true;
				if (fh || evt.oppo || !evt.fellow) return m + n + 2;
				else if (game.dead.includes(evt.fellow)) { //亡语召怪
					var o = Math.ceil(evt.fellow.truepos || evt.fellow.dataset.position);
					return o;
				} else { //战吼召怪
					var o = parseInt(evt.fellow.dataset.position);
					var i = evt.i;
					var dr = Math.pow(-1, i);
					if (wy) dr = 1;
					var j = 1;
					var res = o + dr * j;
					if (dr < 0) res++;
					res = Math.max(n + 2, res);
					return res;
				}
			})(event);
			if (game.dead.filter(fl => fl.getLeader() == p).length && !event.oppo) {
				var dds = game.dead.filter(fl => fl.getLeader() == p);
				var src = event.fellow || p;
				var srcp = game.dead.includes(src) ? src.truepos : parseInt(src.dataset.position);
				dds.forEach(fl => {
					if (srcp < fl.truepos && pos <= Math.ceil(fl.truepos)) fl.truepos++;
				});
			}
			var left = !event.oppo && event.fellow && !game.dead.includes(event.fellow) && parseInt(event.fellow.dataset.position) >= pos;
			const fellow = lib.element.HSfellow.create(p, pos, cards, "S");
			event.cs = cards;
			/*代码修改：现在可以用救赎来1血复活*/
			if (event.extra) {
				for (const ex of event.extra) {
					if (ex.length == 2) {
						if (ex == "复制") fellow.addvaluefinal([1, 1]);
						else if (ex == "分裂") {
							fellow.hs_dm = event.fellow.hs_dm;
							fellow.hs_copy(event.fellow);
						}
					} else if (ex.length > 2) {
						const num = parseInt(ex.slice(2));
						if (!num) continue;
						if (ex.indexOf("复制") == 0) fellow.addvaluefinal([num, num]);
						if (ex.indexOf("复活") == 0) fellow.hs_dm = fellow.hp - num;
					}
				}
			}
			var dft = !event.oppo && event.fellow && !game.dead.includes(event.fellow) && event.num > 1 ? "呼出" : "冒出";
			var rcdhs = fellow.hs_rcdh(pos, left, event.anms, event.anm, dft);
			event.rcdh = rcdhs[0];
			event.rctm = rcdhs[1];
			p.actcharacterlist.add(fellow).sort(lib.sort.position);
			event.link = fellow;
			if (event.oppo) game.log((event.fellow || event.leader), "召唤了", fellow, "到", p, "场上");
			else game.log((event.fellow || event.leader), "召唤了", fellow);
			"step 3"
			var plp = function() {
				get.HSF("Aud", [event.cs[0], "play", player]);
			};
			setTimeout(plp, event.rctm);
			player.HSF("hsdouble");
			event.link.hs_yin(event.rctm, event.extra?.includes("分裂"));
			_status.hsAttendSeq.ad(event.link);
			event.toadd.add(event.link);
			get.HSF("arrange");
			"step 4"
			if (event.notrigger) event.goto(7);
			"step 5"
			//增加"预召唤"的时机
			get.HSF("event", ["summonBefore", {
				player,
				card: event.cs[0],
				link: event.link
			}]);
			"step 6"
			//增加"召唤后"的时机
			if (event.link.HSF("alive")) get.HSF("event", ["summonAfter", {
				player,
				card: event.cs[0],
				link: event.link
			}]);
			"step 7"
			event.i++;
			if (event.i < event.num && !player.hs_full()) {
				event.goto(1);
			}
			"step 8"
			game.delay(get.hslegend(event.link) ? 1 : 0.5);
			if (event.notrigger) event.goto(10);
			event.toadd = event.toadd.filter(i => i.HSF("alive"));
			event.result = {
				bool: event.toadd.length > 0,
				target: event.toadd[0],
				targets: event.toadd.slice(0),
			};
			"step 9"
			event.toadd.forEach(t => {
				if (t.name == "hs_Hound") {
					setTimeout(function() {
						t.addTempClass("kuangbao", 700);
					}, 1000);
				}
			});
			if (event.toadd.length) player.HSF("hs_rever", [event.toadd])
			"step 10"
			if (!event.isMine()) game.delay(0.5);
		});
		return next;
	},
	//简化命令
	HSF(name, args) { //调用get.HSF，第一个参数传入this
		return get.HSF(name, [this].concat(args));
	},
	HSFT(tc, order) { //说台词
		var p = this;
		var key = ["牌库快空", "牌库空"].includes(tc) ? "common" : lib.translate[this.name];
		var words = get.HSA("台词")[key];
		if (!words) {
			p.say("[ERROR]找不到台词！！");
			return;
		}
		if (tc == "开局") {
			if (order && game.me.name == game.enemy.name) tc = "镜像开局";
			else {
				var oppo = get.translation(p.next.name);
				if (words[oppo]) tc = oppo;
			}
		}
		if (!words[tc]) return;
		var tsay = words[tc];
		if (Array.isArray(tsay)) tsay = tsay.randomGet();
		this.say(tsay);
		if (!this.isMin()) {
			var tm = this.HSF("Aud3", [tc]);
			return tm;
		}
	},
	HSline(target, config) {
		get.HSF("HSline", [this, target, config]);
	}
};
