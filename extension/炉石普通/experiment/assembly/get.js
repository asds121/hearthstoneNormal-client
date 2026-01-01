import {
	lib,
	game,
	ui,
	get,
	ai,
	_status
} from "../../../../noname.js";
import {
	utility
} from "../utility.js";
import {
	cons
} from "./constant.js";

export const getDivision = {
	/**
	 * 获取itemtype（武器不是player）
	 */
	hstype(obj) {
		const type = get.itemtype(obj);
		if (undefined == type) {
			return;
		}
		if (!obj) {
			console.warn(type);
		}
		if (type == "players") {
			if (obj.every(i => get.hstype(i) == "weapon")) {
				return "weapons";
			}
			if (!obj.every(i => get.hstype(i) == "player")) {
				return "aliveobjs";
			}
		} else if (type == "player") {
			if (obj instanceof lib.element.HSweapon) {
				return "weapon";
			}
		} else if (obj instanceof lib.element.HSsecret) {
			return "secret";
		} else if (obj.stid && obj.secret) {
			return "secreteffect";
		}
		return type;
	},
	/**
	 * 获取牌的关键字
	 */
	rGJZ(obj, key) {
		if (!obj) {
			return null;
		}
		let str;
		if (obj.name) {
			str = obj.name;
		} else {
			str = obj;
		}
		if (get.type(str) == "HS_spell") {
			return null;
		}
		let sk;
		if (get.type(str) == "HS_minor") {
			sk = lib.skill[str.slice(0, -8)];
		} else if (get.type(str) == "HS_weapon") {
			sk = get.info({
				name: str
			}).weaponeffect;
		}
		if (sk) {
			return sk[key];
		}
		return null;
	},
	/**
	 * 获取随从牌的生命值
	 */
	rHP(obj) {
		if (!obj) {
			return null;
		}
		let str;
		if (get.hstype(obj) == "card") {
			str = obj.name;
		} else {
			str = obj;
		}
		const info = get.info({
			name: str
		});
		if (!info) {
			return null;
		}
		return info.HP;
	},
	/**
	 * 获取随从牌的攻击力
	 */
	rATK(obj) {
		if (!obj) {
			return null;
		}
		let str;
		if (get.hstype(obj) == "card") {
			str = obj.name;
		} else {
			str = obj;
		}
		const info = get.info({
			name: str
		});
		if (!info) {
			return null;
		}
		return info.ATK;
	},
	/**
	 * 获取随从牌的种族
	 */
	rkind(obj) {
		let str;
		if (get.hstype(obj) == "card") {
			str = obj.name;
		} else if (obj.name) {
			str = obj.name;
		} else {
			str = obj;
		}
		const info = get.info({
			name: str
		});
		return info.rkind;
	},
	/**
	 * 获取牌的职业
	 */
	rnature(obj) {
		let str;
		if (obj.rnature) {
			return obj.rnature;
		}
		if (get.hstype(obj) == "card") {
			str = obj.name;
		} else {
			str = obj;
		}
		const info = get.info({
			name: str
		});
		return info.rnature;
	},
	strfunc: (args, str) => {
		const fstr = `var ff=function(${args}){${str}};ff;`;
		_status.strbug = fstr;
		return eval(fstr);
	},
	/**
	 * 生成步骤content
	 */
	hsrfunc(str) {
		const that = window.hearthstone ? hearthstone.get : get;
		const { strfunc } = that;
		const arr = Array.from(arguments);
		let res = "";
		if (arguments.length == 1) {
			if (typeof str == "string") {
				return strfunc("", str);
			}
			return that.hsrfunc.apply(get, str);
		}
		arr.forEach((i, j) => {
			res += `'step ${j}'\n`;
			res += `${i}\n`;
		});
		return strfunc("", res);
	},
	/**
	 * 数组各成员长度之和
	 */
	arraycount(...args) {
		let count = 0;
		for (let i = 0; i < args.length; i++) {
			if (Array.isArray(args[i])) {
				count += args[i].length;
			}
		}
		return count;
	},
	/**
	 * 制作一张卡牌(和createCard类似)
	 */
	chscard(name, cn, multi) {
		let cname;
		const isCN = function(temp) {
			const re = /[\u4e00-\u9fa5]/;
			return re.test(temp);
		}
		if (cn || isCN(name)) {
			cname = get.HSE(name, multi);
		}
		if (multi) {
			if (!cname.length) {
				get.hs_alt(`${name}→在卡池里不存在`);
				return [];
			}
		} else {
			if (cname) {
				name = cname;
			}
			if (!get.info({
					name
				})) {
				get.hs_alt(`${name}→在卡池里不存在`);
				return null;
			}
		}
		const card = get.chscard2(name);
		return card;
	},
	/**
	 * 翻译
	 */
	HS_trans(str) {
		const obj = {
			...get.HSA("easy"),
			...get.HSA("cdan"),
			...get.HSA("rkind"),
			...get.HSA("rarity")
		}
		if (obj[str]) {
			return obj[str];
		}
		if (lib.translate[str]) {
			return lib.translate[str];
		}
		return "";
	},
	/**
	 * 调用funcs里面的自定义函数
	 */
	HSF: (n, a) => lib.hearthstone.funcs[n] ? lib.hearthstone.funcs[n].apply(get, a) : get.hs_alt(`${n}不是一个funcs方法`), 
	/**
	 * 访问在constant里的自定义常量
	 */
	HSA: n => get.copy(lib.hearthstone.constants[n]),
	/**
	 * 反向查找
	 */
	HSAT: n => {
		const obj = get.HSA(n);
		if (!obj) {
			get.hs_alt(`HSAT:${n}不是一个常量列表`);
			return;
		}
		const res = {};
		for (let i in obj) {
			res[obj[i]] = i;
		}
		return res;
	},
	HSE: n => get.HSF("getEN", [n]),
	/**
	 * 检查是否为传说牌
	 */
	hslegend(card) {
		if (get.hstype(card) == "card") {
			return get.rall(obj, 'rarity') == 'legend';
		}
		if (get.hstype(card) == "player") {
			return get.rall(`${card.name}_monster`, 'rarity') == 'legend';
		}
		if (["weapon", "secret"].includes(get.hstype(card))) {
			return get.rall(card.name, 'rarity') == 'legend';
		}
	},
	/**
	 * 获取卡牌的信息
	 */
	rall(obj, key) {
		if (!obj) {
			return null;
		}
		let str;
		if (get.hstype(obj) == "card") {
			str = obj.name;
		} else {
			str = obj;
		}
		const info = get.info({
			name: str
		});
		if (!info) {
			return null;
		}
		if (!key) {
			return info;
		}
		return info[key];
	},
	/**
	 * 获取主玩家
	 */
	hs_main() {
		return _status.hsbo ? game.me : game.enemy;
	},
	/**
	 * 初始化卡牌
	 */
	chsinit(card) {
		// window.alert("in");
		card.cost = lib.element.card.cost;
		["HSF", "addhsbuff", "addvaluebuff", "addtriggerbuff", "addgjzbuff", "hasgjz"].forEach(i => {
			card[i] = game.me[i];
		});
		if (["HS_minor", "HS_spell", "HS_weapon", "HS_hero", "HS_location"].includes(get.type(card))) {
			card._destroy = "true"; //不进入弃牌堆
		}
		card.buff = [];
		card.triggers = {};
		card.classList.add("rdcreated");
		const { name } = card;
		card.mana = ui.create.div(".hs_mana", card);
		card.mana.innerHTML = get.info(card).cost;
		// 进入对局后的卡牌背景
		card.setBackgroundImage(`${utility.getExtensionRelativePath("resource")}asset/card/${name}.jpg`);
		const evt = function(long) {
			const that = this;
			if (long === true) {
				get.HSF("morefocus", [that, true]);
			} else {
				ui.morezone.hide();
			}
			if (get.position(that) == "h" && long !== true && game.me.HSF("phaseUse")) {
				delete _status.hs_viewing;
				if (!lib.filter.filterCard(that)) {
					if (that.cost() > game.me.HSF("mana")) {
						game.me.HSFT("法力值不够");
					} else if (get.type(that) == "HS_minor" && game.me.hs_full()) {
						game.me.HSFT("满场七随从");
					} else {
						game.me.HSFT("不能使用");
					}
				}
			}
		};
		card.listen(evt);
		if (lib.device) {
			card.HSF("longP", [function() {
				this.islong = true;
				if (_status.currentPhase == game.me) {
					_status.hs_viewing = true;
					get.HSF("clickmana", [true]);
				}
				evt.call(this, true);
			}]);
		}
		const df = function(e) {
			const that = _status.hs_mousecard || this;
			if (!that.classList) {
				//console.log(that);
				return;
			}
			if (!lib.config.enable_drag) {
				return;
			}
			if (!that.classList.contains("selectable")) {
				return;
			}
			if (_status.hs_mousedown === false) {
				return;
			}
			get.HSF("hs_stopview");
			if (get.type(that) == "HS_minor") {
				if (_status.currentPhase != game.me || !game.me.HSF("phaseUse")) {
					return;
				}
				_status.hs_fldragging = ui.selected.cards.length == 1;
				if (_status.hs_fldragging) {
					game.me.HSF("hsdouble");
					const dx = (e.touches ? e.touches[0] : e).clientX;
					const num = get.HSF("dragposition", [dx]);
					ui.hs_testfl.num = num;
					ui.hs_testfl.dataset.position = `${num}`;
					get.HSF("arrange");
				} else {
					game.me.HSF("hsdouble");
					ui.hs_testfl.dataset.position = "d0";
					get.HSF("arrange");
				}
			} else if (get.type(that) == "HS_spell") {
				if (ui.arena.classList.contains("hs_view")) {
					get.HSF("clickmana", [false]);
					_status.hs_tempshq = that;
					that.classList.add("selected");
				}
			}
		};
		if (lib.device) {
			card.addEventListener("touchmove", df);
		} else {
			_status.hs_mousedown = false;
			card.addEventListener("mousedown", function() {
				_status.hs_mousedown = true;
				_status.hs_mousecard = this;
			});
			document.addEventListener("mousemove", df);
			document.addEventListener("mouseup", function() {
				_status.hs_mousedown = false;
				delete _status.hs_mousecard;
			});
		}
	},
	/**
	 * 制作一张已经知道英文名字的卡牌
	 */
	chscard2(name) {
		if (!name) {
			get.hs_alt("chscard2:必须传入卡牌名称");
			return;
		}
		if (typeof name != "string") {
			if (Array.isArray(name) && typeof name[0] == "string") {
				const res = [];
				for (let i = 0; i < name.length; i++) {
					const c = get.chscard2(name[i]);
					if (c) {
						res.add(c);
					}
				}
				return res;
			}
			get.hs_alt("chscard2:输入的内容不合法");
			return;
		}
		const isCN = function(temp) {
			const re = /[\u4e00-\u9fa5]/;
			return re.test(temp);
		}
		if (isCN(name)) {
			get.hs_alt("chscard2:必须传入卡牌的英文名称");
			return;
		}
		const card = game.createCard(name, "spade", 1);
		get.chsinit(card);
		return card;
	},
	/**
	 * 获取卡牌所在的区域
	 */
	hs_pos(obj) {
		if (!obj) {
			get.hs_alt("hs_pos:", obj);
		}
		if (game.me.sctp("field", obj)) {
			return "field";
		}
		if (get.hstype(obj) == "player") {
			return get.hs_pos(obj.linkCard[0]);
		}
		if (get.hstype(obj) == "card") {
			if (game.me.getCards("h").concat(game.enemy.getCards("h")).includes(obj)) {
				return "hand";
			}
			if (game.me.cardPile.getCards("h").concat(game.enemy.cardPile.getCards("h")).includes(obj)) {
				return "deck";
			}
			if (game.me.discardPile.getCards("h").concat(game.enemy.discardPile.getCards("h")).includes(obj)) {
				return "grave";
			}
			if (game.me.heroskill.pos.getCards("h").concat(game.enemy.heroskill.pos.getCards("h")).includes(obj)) {
				return "release";
			}
			get.hs_alt("hs_pos:", obj);
		}
	},
	/**
	 * 获取手牌的拥有者
	 */
	hs_owner(obj) {
		if (game.me.getCards("h").includes(obj)) {
			return game.me;
		}
		if (game.enemy.getCards("h").includes(obj)) {
			return game.enemy;
		}
	},
	/**
	 * 内部调试弹窗
	 */
	hs_alt(...args) {
		alert.apply(window, [[""].concat(args).join("")]);
	},
	/**
	 *卡牌编号(作用：连系随从和卡牌，减少内存)
	 */
	hs_id(obj, obj2) {
		if (obj2) {
			return get.hs_id(obj) == get.hs_id(obj2);
		}
		if (obj.length === 0) {
			return;
		}
		const str = get.hstype(obj);
		if (str == "card") {
			return obj.cardid;
		}
		if (str == "player") {
			if (!obj.linkCard) {
				return obj.playerid;
			}
			return obj.linkCard[0].cardid;
		}
		if (obj.stid) {
			return obj.stid;
		}
		if (obj.relabuff) {
			return obj.relabuff.stid;
		}
		if (obj.wpid) {
			return obj.wpid;
		}
		if (obj.id) {
			return obj.id;
		}
		console.log("hs_id:类型不为card或player，也不为实体");
		console.log(obj);
	},
	/**
	 * 获取伤害效果
	 */
	dmgEffect(t, p, v, num = 1) {
		if (v == t) {
			if (t.hasgjz("mianyi")) {
				return 0;
			}
			if (!t.isMin()) {
				if (num > t.hp) {
					return -10000;
				}
				return -num;
			}
			if (t.hasgjz("shengdun")) {
				return -1;
			}
			let base = t.ATK + t.hp;
			if (t.triggers.deathRattle && t.hp <= num) {
				base = 1;
			}
			if (t.triggers.hsdmg?.fl) {
				base = Math.max(1, t.hp - num);
			}
			if (num < t.hp) {
				base -= t.ATK + t.hp - num;
			}
			return -base;
		}
		if (v == p) {
			const n = get.dmgEffect(t, p, t, num);
			if (t.getLeader() == v) {
				return n;
			}
			return -n;
		}
	},
	/**
	 * 获取治疗效果
	 */
	rcvEffect(t, p, v, num = 1) {
		if (p.hasAuras("auchenai")) {
			return get.dmgEffect(t, p, v, num) + 0.1;
		}
		if (v == t) {
			if (!t.isDamaged()) {
				return 0;
			}
			return Math.min(num, t.getDamagedHp()) + 0.1;
		}
		if (v == p) {
			const n = get.rcvEffect(t, p, t, num);
			if (t.getLeader() == v) {
				return n + 0.1;
			}
			return -n;
		}
	},
	/**
	 * 对卡牌的极速筛选并返回筛选函数
	 */
	hsflt(filter, only) {
		if (undefined === filter) {
			return lib.filter.all;
		}
		if (typeof filter == "function") {
			return filter;
		}
		let str = `if(${only != "all"}&&get.type(obj)!='HS_minor')return false;`;
		if (typeof filter == "string") {
			if (filter == "传说") {
				str += `if(get.rall(obj,'rarity')!='legend')return false;`;
			} else if (get.HSA("collect")[filter]) {
				const cdset = get.HSA("collect")[filter];
				str += `if(!${get.HSF("arrstr", [cdset])}.includes(get.translation(obj)))return false;`;
			} else if (get.HSAT("easy")[filter]) {
				const job = get.HSAT("easy")[filter];
				str += `if(get.rall(obj,'rnature')!='${job}')return false;`;
			} else if (get.HSAT("rkind")[filter]) {
				const rkind = get.HSAT("rkind")[filter];
				str += `if(get.rall(obj,'rkind')!='${rkind}')return false;`;
			} else if (get.HSA("yineng")[filter]) {
				const yn = get.HSA("yineng")[filter];
				str += `if(!get.rGJZ(obj,'${yn}'))return false;`;
			}
		} else if (typeof filter.length == "number") {
			for (let i = 0; i < filter.length; i++) {
				const val = filter[i];
				if (typeof val == "number") {
					str += get.hsflt_level(val);
				} else if (Number.parseInt(val) >= 0) {
					str += get.hsflt_level(Number.parseInt(val));
				} else {
					str += get.hsflt(val, true);
				}
			}
		} else if (typeof filter == "object") {
			for (let i in filter) {
				const val = filter[i];
				if (["cost", "ATK", "HP"].includes(i)) {
					str += get.hsflt_level(val, i);
				} else {
					if (Array.isArray(val)) {
						str += `if(!${get.HSF("arrstr", [val])}.includes(get.rall(obj,'${i}')))return false;`;
					} else {
						str += `if(get.rall(obj,'${i}')!='${val}')return false;`;
					}
				}
			}
		}
		if (only && only != "all") {
			return str;
		}
		str += "return true;";
		return get.strfunc("obj", str);
	},
	/**
	 * 筛选函数：数字范围
	 */
	hsflt_level(val, key = "cost") {
		if (val % 1 == 0) {
			return `if(get.rall(obj,'${key}')!=${val})return false;`;
		}
		const lim = Math.round(val);
		const bo = lim > val ? "<" : ">";
		const bo2 = Math.abs(val - lim) < 0.3 ? "=" : "";
		return `if(!get.rall(obj,'${key}')${bo}${bo2}${lim}))return false;`;
	},
	/**
	 * 给角色配卡组
	 */
	hs_deck(player) {
		const str = `${player.name}_ai`;
		let deck = lib.storage.hs_deck[str].slice(0);
		const cfg = get.HSF("cfg", ["HS_aideck"]);
		if ((player == game.me || cfg == "yourdeck") && lib.storage.hs_deck[player.name]) {
			deck = lib.storage.hs_deck[player.name].slice(0);
		}
		player.deckCards = [];
		player.extraCards = [];
		deck.forEach(i => {
			const cs = get.hs_deck2(i);
			player.deckCards.addArray(cs);
		});
		return [player.deckCards, player.extraCards];
	},
	/**
	 * 兼容新旧卡组的格式
	 */
	hs_deck2(old) {
		const put = [];
		if (old.includes("*")) {
			const yh = 0;
			const arr = old.split("*");
			const num = Number.parseInt(arr[1]);
			for (let i = 0; i < num; i++) {
				const card = get.chscard(arr[0], true, yh);
				if (card) {
					put.push(card);
				} else {
					get.hs_alt(`卡牌"${arr[0]}"不存在！`);
				}
			}
		} else {
			put.push(get.chscard(old));
		}
		return put;
	},
	/**
	 * 获取炉石的变量存储
	 */
	HSV(name, def) {
		if (!name) {
			return lib.hearthstone.custom;
		}
		if (def != undefined && lib.hearthstone.custom[name] == undefined) {
			lib.hearthstone.custom[name] = def;
		}
		return lib.hearthstone.custom[name];
	},
	HSVV(name, def) {
		if (!name) {
			return lib.hearthstone.ranvv;
		}
		if (def != undefined && lib.hearthstone.ranvv[name] == undefined) {
			lib.hearthstone.ranvv[name] = def;
		}
		return lib.hearthstone.ranvv[name];
	},
	/**
	 * 获取当前模式卡池
	 */
	hskachi(tp, func, token) {
		if (!func) {
			func = () => true;
		}
		if (!tp) {
			tp = "all";
		}
		let kachi = get.hscardpool();
		if (tp != "all") {
			kachi = kachi.filter(i => get.type(i) == tp || get.subtype(i) == tp);
		}
		kachi = kachi.filter(i => {
			const info = get.info({
				name: i
			});
			if (!token && (info.hs_tokened || info.hs_token)) {
				return false;
			}
			return func(i, info);
		});
		return kachi;
	},
	/**
	 * 获取卡池
	 */
	hscardpool(func) {
		if (!func) {
			func = () => true;
		}
		const kachi = [
			...lib.hearthstone.cardPack.mode_RD,
			...lib.hearthstone.cardPack.spel_RD,
			...lib.hearthstone.cardPack.trap_RD,
			...lib.hearthstone.cardPack.weap_RD,
			...lib.hearthstone.cardPack.hero_RD
		].filter(i => {
			const info = lib.card[i];
			return !lib.card[i].othermode;
		});
		return kachi.filter(func).sort(lib.sort.hs_duel);
	},
	/**
	 * 获取卡背路径
	 */
	hscardback(player) {
		const str = `${utility.extensionName}/resource/asset/cardback/`;
		if ([player.name, player.next.name].includes(_status.brawlboss) && _status.brawlcardback) {
			return `${str}${_status.brawlcardback}.jpg`;
		}
		if (player == game.enemy && get.HSF("cfg", ["HS_enemyCardback"]) == "random") {
			if (!_status.enemycb) {
				_status.enemycb = Object.keys(_status.hsextra).randomGet();
			}
			return `${str}${_status.enemycb}.jpg`;
		}
		const cb = get.HSF("cfg", ["HS_cardback"]);
		const cr = (!cb || cb == "default") ? "经典卡背" : cb;
		return `${str}${cr}.jpg`;
	},
	/**
	 * 添加多种buff
	 */
	hsbuff(arr, type) {
		if (Array.isArray(arr) && !type) { //默认用法，生成效果代码
			const res = [];
			const reg = new RegExp("^[A-Za-z][1-9]$");
			const reg2 = new RegExp("^[0-9]{2}$");
			res.hsai = "recover";
			const hsa = this?.HSA || (k => cons[k]);
			arr.forEach(i => {
				let nl = false;
				let str = "";
				if (reg.test(i)) {
					const key = i[0],
						val = Number.parseInt(i[1]);
					if (key == "A") {
						i = `${val}0`;
					} else if (key == "H") {
						i = `0${val}`;
					} else if (key == "q") {
						str = `target.addFqbuff('hs_power',${val});`;
					} else if (key == "d") {
						nl = true;
						str = `target.hs_dmgrcv('damage',${val},event.fellow);`;
						res.hsai = "damage";
					} else if ("ah".includes(key)) {
						if (key == "a") {
							str = `target.addvaluefinal(${val});`;
						} else if (key == "h") {
							str = `target.addvaluefinal([0,${val}]);`;
						}
						if (val == 1) {
							res.hsai = "destroy";
						} else {
							res.hsai = "damage";
						}
					}
				} else if (i == "cm") {
					nl = true;
					str = `target.hs_silence();`;
					res.hsai = "damage";
				} else if (hsa("canchenmo").includes(i)) {
					str = `target.addgjzbuff('${i}');`;
					if (i == "dongjied" && arr.length == 1) {
						res.hsai = "damage";
					}
				} else if (hsa("canchenmo").includes(i.slice(0, -2))) {
					str = `target.addgjzbuff('${i.slice(0, -2)}',${i.slice(-1)});`;
				}
				if (reg2.test(i)) {
					str = `target.addvaluebuff([${i[0]},${i[1]}]);`;
				}
				if (!res.length) {
					res.push(str);
				} else {
					if (nl) {
						res.push(str);
					} else {
						res[res.length - 1] = res[res.length - 1] + str;
					}
				}
			});
			return res;
		}
	}
}
