// @TODO 整个模块都应该重写
import { lib, game, ui, get, ai, _status } from "../../../../../noname.js";
import { utility } from "../../utility.js";

import { hearthstone } from "../../assembly/index.js";
import { cons } from "../../assembly/constant.js";

import {
  DEFAULT,
  NAXX,
  BRM,
  GVG,
  TGT,
  LOE,
  OG,
  KAR,
  CFM,
  ICC,
  LOOT,
  UNG,
  BOT,
  DRG,
  DAL,
  GIL,
  BT,
  AV,
  DIY,
} from "./expand/index.js";

const { extensionName: cardName } = utility;

// 注意：所有残留的var基本都有它的函数作用域的用处，不可轻易改动为let/const(降为块级作用域会导致声明失效)
export function cardModule() {
  if (typeof globalThis.hearthstone === "undefined") {
    globalThis.hearthstone = hearthstone;
  }

  // @TODO 优化卡牌导入
  new Array(
    DEFAULT,
    NAXX,
    BRM,
    GVG,
    TGT,
    LOE,
    OG,
    KAR,
    CFM,
    ICC,
    LOOT,
    UNG,
    BOT,
    DRG,
    DAL,
    GIL,
    BT,
    AV,
    DIY
  )
    .filter((i) => {
      if (!get.config("HS_DIY")) {
        return i.en !== "DIY";
      }
      return true;
    })
    .forEach((k) => {
      globalThis.hearthstone.imported.push(k);
    });

  // 简化常见分类
  const { strfunc, hsrfunc, hsbuff } = hearthstone.get;
  const simplify = {
    publicKeys: {
      con: {
        // 限定条件
        fg(obj) {
          // 对面有随从
          obj.sfilter = function (card, player) {
            return player.sctp("notmine").length;
          };
        },
        // 固定效果
        bh: "player.sctp('notmine',t=>t.addgjzbuff('dongjied'));",
        draw1: "player.hs_drawDeck();",
        draw3: "player.hs_drawDeck(3);",
        frost: "target.addgjzbuff('dongjied');",
        discard1: "player.hs_discard();",
        shrink2: "target.addvaluebuff(-2);",
        gift2: "player.getOppo().hs_gain(get.hskachi('HS_minor').randomGet());",
        fx: "player.hs_dmgrcvaoe(2,player,card,player.sctp('opposide'));", // 奉献
        // 可调节条件
        bq(rg) {
          // 标签
          obj[`spell${rg}`] = true;
        },
        only(rg) {
          // 目标限定
          switch (rg) {
            case "fellow":
              obj.filterTarget = (c, p, t) => p.sctp("mns", t);
              break;
            case "fellow,healthy":
              obj.filterTarget = (c, p, t) => t.isHealthy() && p.sctp("mns", t);
              break;
            case "notmine,healthy":
              obj.filterTarget = (c, p, t) =>
                t.isHealthy() && p.sctp("notmine", t);
              break;
            case "enemy":
              Reflect.deleteProperty(obj, "filterTarget");
              obj.randomRT = (p) => p.getOppo();
              break;
            case "me":
              Reflect.deleteProperty(obj, "filterTarget");
              obj.randomRT = (p) => p;
              break;
            case "opposide":
              obj.filterTarget = (c, p, t) => p.sctp("opposide", t);
              break;
            case "randmgfl":
              Reflect.deleteProperty(obj, "filterTarget");
              obj.randomRT = (p) => p.HSF("randmgfil", ["notmine"]);
              break;
            case "randmgfl2":
              Reflect.deleteProperty(obj, "filterTarget");
              obj.randomRT = (p) => {
                const fls = p.sctp("notmine").filter((t) => t.canhsdmg());
                if (fls.length === 0) {
                  return false;
                }
                return fls.randomGets(2);
              };
              obj.tgs = true;
              break;
            case "ranxmfl":
              Reflect.deleteProperty(obj, "filterTarget");
              obj.randomRT = (p) => p.HSF("ranxmfil");
              break;
            case "self":
              obj.filterTarget = (c, p, t) => p.sctp("mine", t);
              break;
            case "undead":
              obj.filterTarget = (c, p, t) => t.rkind === "undead";
              break;
            case "demon":
              obj.filterTarget = (c, p, t) => t.rkind === "demon";
              break;
            case "灭":
              obj.filterTarget = (c, p, t) => t.isMin() && t.ATK >= 5;
              break;
            case "痛":
              obj.filterTarget = (c, p, t) => t.isMin() && t.ATK <= 3;
              break;
            case "enm":
              obj.filterTarget = (c, p, t) => p.sctp("notmine", t);
              break;
            case "伤":
              obj.filterTarget = (c, p, t) => p.sctp("mns", t) && t.isDamaged();
              break;
            case "enm,伤":
              obj.filterTarget = (c, p, t) =>
                p.sctp("notmine", t) && t.isDamaged();
              break;
            case "enm,未伤":
              obj.filterTarget = (c, p, t) =>
                p.sctp("notmine", t) && t.isHealthy();
              break;
          }
        },
        activecon(ac, obj) {
          // 金框条件
          switch (ac) {
            case "ys":
              obj.active = (player) =>
                player.hasFellow((fl) => fl.rkind === "wildbeast");
              break;
            case "dmg":
              obj.active = (player) => player.hp <= 12;
              break;
            case "yh":
              obj.active = (player) => player.countCards("h") === 1;
              break;
            case "moreh":
              obj.active = (player) =>
                player.countCards("h") > player.getOppo().countCards("h");
              break;
            case "lianji":
              obj.active = (player) => player.hs_state.useCard > 0;
              break;
          }
        },
        activeeff(ac) {
          // 金框效果
          const con = "if(event.active)";
          if (simplify.publicKeys.con[ac]) {
            arr.push(`${con}${simplify.publicKeys.con[ac]}`);
          }
        },
        // 可调节效果
        gain(v1) {
          // 置于手牌
          return `player.hs_gain(${v1});`;
        },
        weapon(v1) {
          // 装备武器
          return `player.hs_weapon(${v1});`;
        },
        gift(v1) {
          // 疲劳
          return `player.getOppo().hs_drawDeck(${v1});`;
        },
        damage(v1) {
          // 伤害
          return `target.hs_dmgrcv('damage',${v1});`;
        },
        recover(v1) {
          // 回复
          return `target.hs_dmgrcv('recover',${v1});`;
        },
        xx(v1) {
          // 吸血
          return `player.hs_dmgrcv('recover',${v1});`;
        },
        summon(v1) {
          // 召怪
          return `player.SSfellow(${v1});`;
        },
        buff(v1) {
          // buff
          const ar = hsbuff(v1.split(","));
          arr.addArray(ar);
        },
        atkhj(v1) {
          // 攻击力和护甲
          return `player.hs_atkhj(${v1});`;
        },
        other(v1) {
          // 没活了，自己写
          return v1;
        },
        // 条件调节效果
        des(v1) {
          // 目标死亡
          const com = "if(!target.HSF('alive'))";
          return v1.length > 8
            ? `${com}${v1}`
            : `${com}${simplify.publicKeys.con[v1]}`;
        },
        nodes(v1) {
          // 目标存活
          const com = "if(target.HSF('alive'))";
          return v1.length > 8
            ? `${com}${v1}`
            : `${com}${simplify.publicKeys.con[v1]}`;
        },
      },
    },
    飞弹: {
      init() {
        // 获取初始化数据
        const num = Number.parseInt(ms.slice(3));
        obj.spelldamage = num;
        obj.content = strfunc("", `player.hs_Missiles(${num}, true);`);
        return {
          base: num,
        };
      },
      dftrans: "造成#点伤害，随机分配到所有敌方角色身上。",
      norecon: true,
    },
    damage: {
      init() {
        // 获取初始化数据
        let num = ms.slice(7);
        const num2 = Number.parseInt(num) || 1;
        obj.spelldamage = num2;
        obj.filterTarget = true;
        return {
          base: num,
        };
      },
      dftcode(items, obj) {
        const energy = obj.energy ? `, '${obj.energy}'` : "";
        const code = obj.tgs
          ? `player.hs_dmgrcvaoe('damage', player, card, targets, ${items.base}${energy});`
          : `target.hs_dmgrcv('damage', ${items.base}${energy});`;
        return code;
      },
      dftrans: "造成#点伤害。",
      solve(s, obj, arr, items, k1, v1) {
        const num = items.base;
        switch (s) {
          case "doubleD":
            obj.doubleD = true;
            break;
          case "lavaeff":
            arr.new0 = `get.HSF('lavaeffect',['damage',${num},'lava',player]);`;
            Reflect.deleteProperty(obj, "filterTarget");
            break;
          case "xxx":
            arr.add(`player.hs_dmgrcv('recover',${num});`);
            break;
          case "blade":
            arr.new0 = `get.HSF('bladeeffect',['damage',${num},player]);`;
            Reflect.deleteProperty(obj, "filterTarget");
            break;
        }
        switch (k1) {
          case "lava":
            arr.new0 = `get.HSF('lavaeffect',['${v1}',${num},'lava',player]);`;
            Reflect.deleteProperty(obj, "filterTarget");
            break;
          case "aoe":
            const energy = obj.energy ? `,'${obj.energy}'` : "";
            arr.new0 = `player.hs_dmgrcvaoe(${num},player,card,player.sctp('${v1}')${energy});`;
            Reflect.deleteProperty(obj, "filterTarget");
            break;
          case "rcvmyside":
            arr.add(
              `player.hs_dmgrcvaoe(${v1},'recover',player,card,player.sctp('myside'));`
            );
            break;
          case "activenum":
            items.base = `(event.active?${v1}:${num})`;
            break;
        }
      },
    },
    recover: {
      init() {
        const num = ms.slice(8);
        const num2 = Number.parseInt(num) || 1;
        obj.filterTarget = true;
        obj.spellrecover = num2;
        return {
          base: num,
        };
      },
      dftcode(items, obj) {
        return `target.hs_dmgrcv('recover',${items.base});`;
      },
      dftrans: "恢复#点生命值。",
    },
    summon: {
      init() {
        const tg = ms.slice(7);
        obj.summoneff = true;
        return {
          base: tg,
        };
      },
      dftcode(items, obj) {
        return `player.SSfellow(${items.base});`;
      },
      dftrans: "",
    },
    咆哮: {
      init() {
        const num = Number.parseInt(ms.slice(3));
        return {
          rg: "mine",
          base: num,
        };
      },
      dftcode(items, obj) {
        if (items.temp) {
          return `player.sctp('${items.rg}',t=>t.addvaluebuff(${items.base},1));`;
        }
        return `player.sctp('${items.rg}',t=>t.addvaluebuff([${items.base},${items.base}]));`;
      },
      dftrans: "使你的所有随从获得+#/+#。",
      solve(s, obj, arr, items, k1, v1) {
        if (s === "temp") {
          items.temp = true;
        }
      },
    },
    bxs: {
      init() {
        const tg = ms.slice(4);
        obj.filterTarget = function (c, p, t) {
          return t.isMin();
        };
        obj.spelldestroy = true;
        return {
          base: tg,
        };
      },
      dftcode(items, obj) {
        return `target.HSF('convert',['${items.base}']);`;
      },
      dftrans: "",
    },
    draw: {
      init() {
        let num = ms.slice(5);
        const n = Number.parseInt(num);
        obj.spelldraw = n || true;
        if (num.indexOf("p=>") >= 0) {
          num = `(${num})(player)`;
        }
        return {
          base: n || num,
        };
      },
      dftcode(items, obj) {
        return `player.hs_drawDeck(${items.base});`;
      },
      dftrans: "抽$张牌。",
    },
    kill: {
      init(arr) {
        const num = ms.slice(5);
        if (num != "1") {
          const sj = num === "all" ? "mns" : num;
          arr.new0 = `get.HSF('lavaeffect', ['cuihui',player.sctp('${sj}'), 'lava']);`;
        } else {
          obj.filterTarget = function (c, p, t) {
            return t.isMin();
          };
        }
        obj.spelldestroy = true;
        return {
          base: num,
        };
      },
      dftcode(items, obj) {
        return "target.HSF('cuihui');";
      },
      dftrans: "消灭一个随从。",
      solve(s, obj, arr, items, k1, v1) {
        if (k1 === "onlianji") {
          arr.add(`if(event.active){${v1}}`);
        }
      },
    },
    buff: {
      init(arr) {
        const ar = hsbuff(ms.slice(5).split(","));
        if (ar.hsai === "damage") {
          obj.spelldamage = true;
        } else if (ar.hsai === "destroy") {
          obj.spelldestroy = true;
        } else {
          obj.spellbuff = true;
        }
        obj.filterTarget = strfunc("c,p,t", "return p.sctp('mns',t)");
        return {
          ar,
          rg: "mns",
          random: false,
        };
      },
      dftrans: "",
      solve(s, obj, arr, items, k1, v1) {
        if (k1 === "onlianji") {
          const ar = hsbuff(v1.split(","));
          arr.addArray(ar);
          if (arr.length === 2) {
            arr[0] = `if(!event.active)${arr[0]}`;
            arr[1] = `if(event.active)${arr[1]}`;
          }
          return;
        }

        if (s === "random") {
          items.random = true;
        } else if (s === "neg") {
          obj.spelldamage = true;
          delete obj.spellbuff;
        } else if (k1 === "sctp") {
          items.rg = v1;
        }

        if (items.random) {
          delete obj.filterTarget;
          obj.randomRT = strfunc(
            "p",
            `return p.sctp('${items.rg}').randomGet()`
          );
        } else {
          obj.filterTarget = strfunc("c,p,t", `return p.sctp('${items.rg}',t)`);
        }
      },
    },
  };

  // 检查缩写称号重复
  hearthstone.imported.forEach((i) => {
    for (const j in i.cdan) {
      if (Object.keys(hearthstone.constants.cdan).includes(j)) {
        console.warn(`扩展包《${i.name}》的${j}重复了`);
      } else {
        hearthstone.constants.cdan[j] = i.cdan[j];
      }
    }
  });

  // 检查重复的怪兽
  let keys = Object.keys(hearthstone.cardPack.monsterRD);
  hearthstone.imported.forEach((i) => {
    for (const j in i.minor.info) {
      if (keys.includes(j)) {
        console.warn(`喵喵！扩展包《${i.name}》的${j}重复了哦！`);
      } else {
        hearthstone.cardPack.monsterRD[j] = i.minor.info[j];
      }
    }
  });

  // 怪物们的技能
  const effects = {};
  keys = Object.keys(effects);
  hearthstone.imported.forEach((i) => {
    for (const j in i.minor.skill) {
      if (keys.includes(j)) {
        console.warn(`喵喵！扩展包《${i.name}》的${j}重复了哦！`);
      } else {
        effects[j] = i.minor.skill[j];
      }
    }
  });
  for (const i in effects) {
    lib.skill[i] = effects[i];
  }

  const minispell = {};
  keys = Object.keys(minispell);
  hearthstone.imported.forEach((i) => {
    for (const j in i.spell.info) {
      if (keys.includes(j)) {
        console.warn(`喵喵！扩展包《${i.name}》的${j}重复了哦！`);
      } else {
        minispell[j] = i.spell.info[j];
      }
    }
  });

  for (const i in minispell) {
    lib.translate[i] = minispell[i][0];
    // 这里用到了var的特性
    var ms = minispell[i][2];
    let tms = ms;
    if (!lib.translate[`${i}_info`]) {
      if (ms.length == 2) {
        tms = ms[1];
        lib.translate[`${i}_info`] = tms;
        ms = ms[0];
      }
    }

    const coff = ms.indexOf(":") > 0; // 常见简化效果
    if (!lib.translate[`${i}_info`] && !coff) {
      lib.translate[`${i}_info`] = ms;
    }

    // 这里也用到了var的特性
    var obj = {
      rarity: minispell[i][1],
      cost: minispell[i][3],
      rnature: minispell[i][4],
      // 虽然这里用type这个单词更合适
      category: minispell[i][5],
      type: "HS_spell",
      subtype: "HS_normalS",
      // image: `ext:${cardName}/resource/asset/card/${minispell[i]}.jpg`,
      fullimage: true,
    };

    const gz = new RegExp("过载：（[1-9]）");
    if (typeof tms === "string" && gz.test(tms)) {
      const match = tms.match(gz);
      if (match && match[0]) {
        const num = Number.parseInt(match[0].slice(4, -1));
        obj.hs_gz = num;
      }
    }

    if (ms.indexOf("@") == 0) {
      // 暂时还没想好
    } else {
      const xsf = minispell[i][6] || []; // 修饰符
      let tool = null;
      let items = null;
      var arr = [];

      if (coff) {
        xsf.push("coff");
        if (["ice", "fire", "thunder"].includes(xsf[0])) {
          obj.energy = xsf[0];
        }

        const key = ms.slice(0, ms.indexOf(":"));
        tool = simplify[key];
        if (tool) {
          items = tool.init(arr) || {};
          if (items.ar) {
            arr = items.ar;
          }
        }
      }

      xsf.forEach((s) => {
        // publicKeys部分
        const aa = s.split(":");
        const k1 = aa[0];
        const v1 = s.slice(k1.length + 1);

        if (s.indexOf("cgct:") === 0) {
          eval(`obj.changecost = function(p) {${s.slice(5)}}`);
        } else if (s.indexOf("hsdraw:") === 0) {
          eval(`obj.onhsdraw = function() {${s.slice(7)}}`);
        } else if (s === "token") {
          obj.hs_token = true;
        } else if (s === "legend") {
          obj.hs_legend = true;
        } else if (s === "nosearch") {
          obj.nosearch = true;
        } else if (simplify.publicKeys.con[s]) {
          if (typeof simplify.publicKeys.con[s] === "function") {
            simplify.publicKeys.con[s](obj);
          } else {
            arr.push(simplify.publicKeys.con[s]);
          }
        } else if (v1 && simplify.publicKeys.con[k1]) {
          // 如果是带冒号的标签
          const str = simplify.publicKeys.con[k1](v1, obj);
          if (typeof str === "string") {
            arr.push(str);
          }
        } else if (s != "coff" && xsf.includes("coff")) {
          // 特色
          if (tool && tool.solve) {
            const str = tool.solve(s, obj, arr, items, k1, v1);
            if (typeof str === "string") {
              arr.push(str);
            }
          }
        }
      });

      if (tool) {
        if (tool.dftcode) {
          if (arr.new0) {
            arr.unshift(arr.new0);
          } else {
            arr.unshift(tool.dftcode(items, obj));
          }
        }
        if (!lib.translate[`${i}_info`]) {
          lib.translate[`${i}_info`] = tool.dftrans
            .replace("#", items.base)
            .replace("$", get.cnNumber(items.base));
        }
      }
      if (arr.length && !(tool && tool.norecon)) {
        obj.content = hsrfunc(arr);
      }
    }
    minispell[i] = obj;
  }

  const full = {};
  keys = Object.keys(full);
  hearthstone.imported.forEach((i) => {
    for (const j in i.spell.skill) {
      if (keys.includes(j)) {
        console.warn(`喵喵！扩展包《${i.name}》的${j}重复了哦！`);
      } else {
        full[j] = i.spell.skill[j];
      }
    }
  });

  for (const i in full) {
    if (minispell[i]) {
      full[i] = Object.assign({}, minispell[i], full[i]);
    }
  }

  const minitrap = {};
  keys = Object.keys(minitrap);
  hearthstone.imported.forEach((i) => {
    for (const j in i.trap.info) {
      if (keys.includes(j)) {
        console.warn(`喵喵！扩展包《${i.name}》的${j}重复了哦！`);
      } else {
        minitrap[j] = i.trap.info[j];
      }
    }
  });

  for (const i in minitrap) {
    lib.translate[i] = minitrap[i][0];
    let ms = minitrap[i][2];
    let tms = ms;
    if (!lib.translate[`${i}_info`]) {
      if (ms.length == 2) {
        tms = ms[1];
        lib.translate[`${i}_info`] = tms;
        ms = ms[0];
      }
    }

    const coff = ms.indexOf(":") > 0; // 常见简化效果
    if (!lib.translate[`${i}_info`] && !coff) {
      lib.translate[`${i}_info`] = ms;
    }

    var obj = {
      rarity: minitrap[i][1],
      cost: minitrap[i][3],
      rnature: minitrap[i][4],
      type: "HS_spell",
      subtype: "HS_secret",
      // image: `ext:${cardName}/resource/asset/card/${minitrap[i]}.jpg`,
      fullimage: true,
    };
    minitrap[i] = obj;
  }

  const full2 = {};
  keys = Object.keys(full2);
  hearthstone.imported.forEach((i) => {
    for (const j in i.trap.skill) {
      if (keys.includes(j)) {
        console.warn(`喵喵！扩展包《${i.name}》的${j}重复了哦！`);
      } else {
        full2[j] = i.trap.skill[j];
      }
    }
  });

  for (const i in full2) {
    if (minitrap[i]) {
      full2[i] = Object.assign({}, minitrap[i], full2[i]);
    }
  }

  const weaponfull = {};
  keys = Object.keys(weaponfull);
  hearthstone.imported.forEach((i) => {
    for (const j in i.weapon.skill) {
      if (keys.includes(j)) {
        console.warn(`喵喵！扩展包《${i.name}》的${j}重复了哦！`);
      } else {
        weaponfull[j] = i.weapon.skill[j];
      }
    }
  });

  const miniweapon = {};
  keys = Object.keys(miniweapon);
  hearthstone.imported.forEach((i) => {
    for (const j in i.weapon.info) {
      if (keys.includes(j)) {
        console.warn(`喵喵！扩展包《${i.name}》的${j}重复了哦！`);
      } else {
        miniweapon[j] = i.weapon.info[j];
      }
    }
  });

  for (const i in miniweapon) {
    const wp = miniweapon[i];
    lib.translate[i] = wp[0];
    lib.translate[`${i}_info`] = wp[2];

    var obj = {
      rarity: wp[1],
      enable: true,
      notarget: true,
      fullimage: true,
      type: "HS_weapon",
      ai: {
        order: 9,
        result: {
          player: 1,
        },
      },
    };

    obj.weaponeffect = weaponfull[i] ? weaponfull[i].weaponeffect : {};
    obj.cost = wp[3];
    obj.rnature = wp[4];
    obj.ATK = wp[5];
    obj.HP = wp[6];

    if (wp[2].length > 0) {
      // 必须为var
      var arr = wp[2].split(new RegExp("，|。")); // 描述根据逗号分割
      let gjz = true;
      for (const p of arr) {
        let yc = cons.yincang[p];
        const gz = new RegExp("^过载：（[1-9]）");
        if (typeof p === "string" && gjz && p.length == 2) {
          // 关键字效果
          const fy = cons.yineng[p];
          if (fy && !obj.weaponeffect[fy]) {
            obj.weaponeffect[fy] = true;
          }
        } else if (typeof yc === "string" && yc) {
          // 隐藏关键字
          gjz = false;
          yc = cons.yineng[yc];
          obj.weaponeffect[yc] = true;
        } else if (typeof p === "string" && gz.test(p)) {
          const match = p.match(new RegExp("(?<=(过载：（))."));
          if (match && match[0]) {
            const num = Number.parseInt(match[0]);
            obj.hs_gz = num;
          }
        } else if (p.indexOf("：") == 2) {
          const pr = p.split("：");
          const sj = pr[0];
          const xg = pr[1];
          const sjs = {
            战吼: "battleRoal",
            亡语: "deathRattle",
          };

          if (sjs[sj] && !obj.weaponeffect[sjs[sj]]) {
            const tri = {};
            const regs = {
              blade: "对所有随从造成[1-9]点伤害",
              gain: "将一张.{1,9}置入你的手牌",
            };
            const reg = function (b) {
              return new RegExp(b);
            };
            const mth = function (a, b) {
              return typeof a === "string" ? a.match(reg(b)) : null;
            };

            const bladeMatch = mth(xg, regs.blade);
            if (bladeMatch && bladeMatch[0]) {
              const num = Number.parseInt(bladeMatch[0].slice(7, 8));
              tri.effect = strfunc(
                "",
                `get.HSF('bladeeffect', ['damage', ${num}, player]);`
              );
            } else {
              const gainMatch = mth(xg, regs.gain);
              const 置入_match = mth(xg, "一张.+置入");
              if (gainMatch && 置入_match && 置入_match[0]) {
                const str = 置入_match[0].slice(2, -2);
                tri.effect = strfunc("", `player.hs_gain('${str}');`);
              }
            }

            obj.weaponeffect[sjs[sj]] = tri;
          }
        }
      }
    }

    wp[7]?.forEach((s) => {
      if (s == "token") {
        obj.hs_token = true;
      } else if (s == "legend") {
        obj.hs_legend = true;
      } else if (s == "rareEff") {
        obj.weaponeffect.active = function (p, c) {
          const that = this;
          if (that.battleRoal) {
            if (that.battleRoal.filter) {
              const nf = get.HSF("strfil", [that.battleRoal.filter]);
              that.battleRoal.filter = nf;
              if (!nf(p, c)) {
                return false;
              }
            }
            if (
              that.battleRoal.filterTarget &&
              !p.sctp("all", (t) => that.battleRoal.filterTarget(null, p, t))
            ) {
              return false;
            }
            if (that.battleRoal.randomRT && !that.battleRoal.randomRT(p)) {
              return false;
            }
            return true;
          }
          return false;
        };
      } else if (s.indexOf(":") > 0) {
        const sr = s.split(":");
        const sj = sr[0];
        const xg = sr[1];
        const tri = {};

        if (xg.includes("fltbuff>")) {
          var arr = xg.slice(8).split("：");
          const rg = arr[0].split(",");
          let arr2 = arr[1].split(",");
          arr2 = hsbuff(arr2);
          if (sj == "battleRoal") {
            tri.filterTarget = strfunc(
              "c,p,t",
              `return p.sctp('${rg[0]}',t)&&t.rkind=='${rg[1]}';`
            );
          } else {
            tri.randomRT = strfunc(
              "p",
              `return p.sctp('${rg[0]}').filter(t=>t.rkind=='${rg[1]}').randomGet()`
            );
          }
          tri.aifamily = arr2.hsai;
          tri.effect = hsrfunc(arr2);
        } else if (xg.includes("ranbuff>")) {
          var arr = xg.slice(8).split("：");
          const rg = arr[0];
          let arr2 = arr[1].split(",");
          arr2 = hsbuff(arr2);
          tri.randomRT = strfunc("p", `return p.sctp('${rg}').randomGet()`);
          tri.effect = hsrfunc(arr2);
        } else if (xg.includes("cghrsk>")) {
          const c = xg.slice(7);
          tri.effect = strfunc("", `player.HSF('changeHeroskill',['${c}']);`);
        }

        obj.weaponeffect[sj] = tri;
      }
    });

    miniweapon[i] = obj;
  }

  for (const i in weaponfull) {
    if (miniweapon[i]) {
      weaponfull[i] = Object.assign({}, weaponfull[i], miniweapon[i]);
    }
  }

  // 英雄
  const minihero = {};
  keys = Object.keys(minihero);
  globalThis.hearthstone.imported.forEach((i) => {
    for (const j in i.hero.info) {
      if (keys.includes(j)) {
        console.warn(`扩展包《${i.name}》的${j}重复了`);
      } else {
        minihero[j] = i.hero.info[j];
      }
    }
  });

  for (const i in minihero) {
    lib.translate[i] = minihero[i][0];
    let ms = minihero[i][2];
    let tms = ms;
    if (!lib.translate[`${i}_info`]) {
      if (ms.length == 2) {
        tms = ms[1];
        lib.translate[`${i}_info`] = tms;
        ms = ms[0];
      }
    }

    const coff = ms.indexOf(":") > 0; // 常见简化效果
    if (!lib.translate[`${i}_info`] && !coff) {
      lib.translate[`${i}_info`] = ms;
    }

    var obj = {
      rarity: minihero[i][1],
      cost: minihero[i][3],
      rnature: minihero[i][4],
      type: "HS_hero",
      // image: `ext:${cardName}/resource/asset/card/${minihero[i]}.jpg`,
      fullimage: true,
    };

    const gz = new RegExp("过载：（[1-9]）");
    if (typeof tms === "string" && gz.test(tms)) {
      const match = tms.match(gz);
      if (match && match[0]) {
        const num = Number.parseInt(match[0].slice(4, -1));
        obj.hs_gz = num;
      }
    }

    const yx = minihero[i][5] || []; // 修饰符
    let tool = null;
    let items = null;
    var arr = [];

    if (coff) {
      yx.push("coff");
      if (["ice", "fire", "thunder"].includes(yx[0])) {
        obj.energy = yx[0];
      }
      const key = ms.slice(0, ms.indexOf(":"));
      tool = simplify[key];
      if (tool) {
        items = tool.init(arr) || {};
        if (items.ar) {
          arr = items.ar;
        }
      }
    }

    yx.forEach((s) => {
      // 公共部分
      const aa = s.split(":");
      const k1 = aa[0];
      const v1 = s.slice(k1.length + 1);

      if (s.indexOf("cgct:") === 0) {
        eval(`obj.changecost=function(p){${s.slice(5)}}`);
      } else if (s === "token") {
        obj.hs_token = true;
      } else if (s === "diy") {
        obj.hs_diy = true;
      } else if (s === "legend") {
        obj.hs_legend = true;
      } else if (s === "nosearch") {
        obj.nosearch = true;
      } else if (s != "coff" && yx.includes("coff")) {
        // 特色
        if (tool && tool.solve) {
          const str = tool.solve(s, obj, arr, items, k1, v1);
          if (typeof str == "string") {
            arr.push(str);
          }
        }
      }
    });

    if (tool) {
      if (tool.dftcode) {
        if (arr.new0) {
          arr.unshift(arr.new0);
        } else {
          arr.unshift(tool.dftcode(items, obj));
        }
      }
      if (!lib.translate[`${i}_info`]) {
        lib.translate[`${i}_info`] = tool.dftrans
          .replace("#", items.base)
          .replace("$", get.cnNumber(items.base));
      }
    }
    if (arr.length && !(tool && tool.norecon)) {
      obj.content = hsrfunc(arr);
    }

    minihero[i] = obj;
  }

  const herofull = {};
  keys = Object.keys(herofull);
  globalThis.hearthstone.imported.forEach((i) => {
    for (const j in i.hero.skill) {
      if (keys.includes(j)) {
        console.warn(`扩展包《${i.name}》的${j}重复了`);
      } else {
        herofull[j] = i.hero.skill[j];
      }
    }
  });

  for (const i in herofull) {
    if (minihero[i]) {
      herofull[i] = Object.assign({}, minihero[i], herofull[i]);
    }
  }

  hearthstone.rdrd_card = {
    spell: { ...minispell, ...full },
    trap: { ...minitrap, ...full2 },
    weapon: { ...miniweapon, ...weaponfull },
    hero: { ...minihero, ...herofull },
    // location: { ...minilocation, ...localfull }
  };

  for (const i in hearthstone.loadTrans) {
    if (
      i.startsWith("hs") &&
      !i.includes("_info") &&
      !hearthstone.rdrd_card.spell[i] &&
      !hearthstone.rdrd_card.trap[i]
    ) {
      hearthstone.rdrd_card.spell[i] = {
        able() {
          return false;
        },
      };
    }
  }

  return {
    name: cardName,
    connect: true,
    card: {
      ...hearthstone.rdrd_card.spell,
      ...hearthstone.rdrd_card.trap,
      ...hearthstone.rdrd_card.weapon,
      ...hearthstone.rdrd_card.hero,
      // ...hearthstone.rdrd_card.location
    },
    skill: {},
    cardType: {},
    translate: {
      [cardName]: utility.getExtensionNameSpace("card"),
      [`${cardName}_cardsInfo`]: "",
    },
    list: [],
    help: {},
  };
}
