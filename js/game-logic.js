// 简单的日志记录功能
function addLog(message, type = "info") {
  const logs = document.getElementById("logs");
  if (!logs) return;

  const entry = document.createElement("div");
  entry.className = `log-entry log-${type}`;
  entry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
  logs.appendChild(entry);
  logs.scrollTop = logs.scrollHeight;
}

// 更新状态
function updateStatus(status) {
  const statusEl = document.getElementById("status");
  if (statusEl) {
    statusEl.textContent = `状态: ${status}`;
  }
}

// 切换日志显示
document.getElementById("toggle-log").addEventListener("click", () => {
  const logs = document.getElementById("logs");
  if (logs.style.display === "none") {
    logs.style.display = "block";
  } else {
    logs.style.display = "none";
  }
});

// 刷新游戏
document.getElementById("refresh-game").addEventListener("click", () => {
  location.reload();
});

// 模拟完整的noname.js环境
export const mockLib = {
  characterPack: {},
  config: {
    skin: {},
    mode_config: {
      guozhan: {
        guozhanSkin: false,
      },
    },
    damage_shake: false,
    show_log: "off",
    layout: "nova",
    player_border: "wide",
    player_height: "short",
  },
  characterDefaultPicturePath: "image/character/default/",
  init: {
    getCurrentFileLocation: (importMetaUrl) => {
      try {
        const url = new URL(importMetaUrl);
        return url.pathname;
      } catch (error) {
        return "/extension/炉石普通/experiment/utility.js";
      }
    },
  },
  element: {
    Player: class {
      constructor() {
        this.baseATK = 30;
        this.baseHP = 30;
        this.buff = [];
        this.hs_dm = {};
        this.name = "Player";
        this.next = null;
        this.iswork = () => true;
        this.ghwork = () => true;
        this.subtype = "normal";
        this.value = 0;
        this.attendseq = 0;
        this.data_weapon = null;
        this.dataset = {};
        this.style = {
          transition: "all 0s",
        };
        this.sctp = (type) => {
          if (type === "field") {
            return [this];
          }
          return [];
        };
        this.class = "hs_warrior";
        this.ghwork = (skillName, event, params) => {
          return true;
        };

        // 创建英雄技能元素
        this.heroskill = {
          style: {},
          pos: document.createElement("div"),
          className: "hs_hrsk",
        };
        this.heroskill.pos.className = "hs_hrsk meheroskill";
        this.heroskill.pos.style.left = "calc(100% - 530px)";
        this.heroskill.pos.style.top = "calc(100% - 144px)";
        this.heroskill.pos.style.position = "absolute";
        this.heroskill.pos.style.width = "88px";
        this.heroskill.pos.style.height = "88px";

        // 创建法力水晶元素
        this.mana = document.createElement("div");
        this.mana.className = "hs_mana memana";
        this.mana.style.left = "calc(100% - 242px)";
        this.mana.style.top = "calc(100% - 210px)";
        this.mana.style.position = "absolute";
        this.mana.style.width = "80px";
        this.mana.style.height = "80px";
        this.mana.textContent = "1";

        // 创建弃牌堆元素
        this.discardPile = document.createElement("div");
        this.discardPile.className = "hs_me";
        this.discardPile.style.position = "absolute";

        // 创建奥秘区域元素
        this.secretbd = document.createElement("div");
        this.secretbd.className = "secretbd secretmebd";
        this.secretbd.style.left = "calc(100% - 675px)";
        this.secretbd.style.top = "calc(100% - 204px)";
        this.secretbd.style.position = "absolute";

        // 创建节点元素
        this.node = {
          handcards1: document.createElement("div"),
          handcards2: document.createElement("div"),
          count: document.createElement("div"),
        };
        this.node.count.className = "count";
        this.node.count.textContent = "30";
        this.node.count.style.position = "absolute";
        this.node.count.style.fontSize = "24px";
        this.node.count.style.color = "white";

        // 创建英雄技能正面和背面
        const frontface = document.createElement("div");
        frontface.className = "frontface";
        frontface.style.position = "absolute";
        frontface.style.width = "100%";
        frontface.style.height = "100%";
        frontface.style.backgroundSize = "140px 193px";
        frontface.style.backgroundPosition = "-24px -14px";
        frontface.style.backgroundRepeat = "no-repeat";

        const backface = document.createElement("div");
        backface.className = "backface";
        backface.style.position = "absolute";
        backface.style.width = "100%";
        backface.style.height = "100%";
        backface.style.backgroundSize = "116px 116px";
        backface.style.backgroundPosition = "-15px -15px";
        backface.style.backgroundImage =
          "url('../extension/炉石普通/experiment/resource/image/heroskill/hs_hero_used.jpg')";
        backface.style.backgroundRepeat = "no-repeat";

        this.heroskill.pos.appendChild(frontface);
        this.heroskill.pos.appendChild(backface);

        this.say = (msg) => {
          console.log(`${this.name}说: ${msg}`);
          window.ui.create.toast(`${this.name}说: ${msg}`);
        };
      }

      getId() {
        console.log(`获取玩家ID: ${this.name}`);
        return this.name;
      }

      init(type) {
        console.log(`初始化玩家: ${this.name}, 类型: ${type}`);

        // 添加玩家到竞技场
        if (window.ui && window.ui.arena) {
          window.ui.arena.appendChild(this.heroskill.pos);
          window.ui.arena.appendChild(this.mana);
          window.ui.arena.appendChild(this.secretbd);
        }

        // 设置玩家类型
        if (type === "hs_player") {
          this.name = "我";
          this.mana.className = "hs_mana memana";
          this.heroskill.pos.className = "hs_hrsk meheroskill";
          this.secretbd.className = "secretbd secretmebd";
        } else if (type === "hs_comp") {
          this.name = "对手";
          this.mana.className = "hs_mana enemymana";
          this.mana.style.top = "calc(100% - 540px)";
          this.mana.style.left = "calc(100% - 1020px)";
          this.heroskill.pos.className = "hs_hrsk enemyheroskill";
          this.heroskill.pos.style.top = "calc(100% - 576px)";
          this.secretbd.className = "secretbd secretenemybd";
          this.secretbd.style.top = "calc(100% - 644px)";
        }
      }

      isAlive() {
        return true;
      }
      isMin() {
        return false;
      }
      getOppo() {
        return this === window.game.me ? window.game.enemy : window.game.me;
      }
      getCards(type) {
        return [];
      }
      hs_use_heroskill() {
        console.log(`使用英雄技能`);
      }
      addTempSkill(skillName) {
        console.log(`添加临时技能: ${skillName}`);
      }
      appendChild(child) {
        // 模拟DOM appendChild
        console.log(`${this.name}添加子元素: ${child.className || "元素"}`);
      }
      removeChild(child) {
        // 模拟DOM removeChild
        console.log(`${this.name}移除子元素: ${child.className || "元素"}`);
      }
      classList = {
        contains: (className) => {
          return this.className && this.className.includes(className);
        },
        add: (className) => {
          this.className = this.className
            ? `${this.className} ${className}`
            : className;
        },
        remove: (className) => {
          if (this.className) {
            this.className = this.className.replace(className, "").trim();
          }
        },
      };
    },
  },
  sort: {
    attendseq: () => 0,
  },
  filter: {
    none: () => {},
  },
  storage: {},
  hearthstone: {
    mecard: document.createElement("div"),
    enemycard: document.createElement("div"),
    shijian: {
      baseinit: () => {
        console.log("调用lib.hearthstone.shijian.baseinit()");
        // 模拟基本初始化
        window._status.hs_entergame = false;
      },
      preinit: () => {
        console.log("调用lib.hearthstone.shijian.preinit()");
        // 模拟预初始化
      },
      init: () => {
        console.log("调用lib.hearthstone.shijian.init()");
        // 模拟初始化
      },
      postinit: () => {
        console.log("调用lib.hearthstone.shijian.postinit()");
        // 模拟后初始化
      },
      entermode: () => {
        console.log("调用lib.hearthstone.shijian.entermode()");
        // 模拟进入游戏模式
        window._status.hs_entergame = true;
        window.game.phaseLoop(window.game.me);
      },
      reach: () => {
        console.log("调用lib.hearthstone.shijian.reach()");
        // 模拟到达游戏状态
      },
      XJBG: () => {
        console.log("调用lib.hearthstone.shijian.XJBG()");
        // 模拟XJBG操作
      },
    },
  },
  skill: {
    hs_start: {
      trigger: {
        global: ["gameDrawBefore", "phaseEnd"],
      },
      silent: true,
      unique: true,
      charlotte: true,
      filter: (event, player) => {
        console.log(
          "hs_start过滤条件检查 - 玩家数量:",
          window.game.players?.length,
          ", hs_entergame:",
          window._status.hs_entergame
        );
        return window.game.players?.length == 2 && !window._status.hs_entergame;
      },
      content: async (event) => {
        try {
          console.log("调用hs_start技能的content()方法");

          // 实现异步语法糖，每个step都是一个promise
          const step = (name) => {
            console.log(`执行step ${name}`);
            return Promise.resolve();
          };

          await step(0);
          window.lib.hearthstone.shijian.baseinit();

          await step(1);
          if (!window.lib.hearthstone) {
            window.game.me.say("加载失败");
            event.finish();
            return;
          }

          await step(2);
          window.lib.hearthstone.shijian.preinit(event.trigger);

          await step(3);
          window.lib.hearthstone.shijian.init();

          await step(4);
          window.lib.hearthstone.shijian.postinit();

          await step(5);
          console.log("调用lib.hearthstone.shijian.entermode()");
          window.lib.hearthstone.shijian.entermode();

          await step(6);
          window.lib.hearthstone.shijian.reach();

          await step(7);
          window.lib.hearthstone.shijian.XJBG();

          await step(8);
          if (event.insert) {
            console.log("尝试插入内容");
            // 简化处理，不依赖window.lib.element.content.greeting
            try {
              event.insert((contentData) => {
                console.log("内容插入成功:", contentData);
                return document.createElement("div");
              }, {});
            } catch (insertError) {
              console.log(
                "跳过event.insert，因为内容插入失败:",
                insertError.message
              );
            }
          }

          event.finish();
          console.log("hs_start技能执行完成");
        } catch (error) {
          console.error("hs_start技能执行出错:", error);
          console.error("错误堆栈:", error.stack);
          event.finish();
        }
      },
    },
  },
};

export const mockGet = {
  coreInfo: () => ["chrome", 135],
  mode: () => "hearthstone",
  character: (name) => null,
  cnNumber: (num) => {
    const cn = [
      "零",
      "一",
      "二",
      "三",
      "四",
      "五",
      "六",
      "七",
      "八",
      "九",
      "十",
    ];
    return cn[num] || num.toString();
  },
  HSF: (funcName, args) => {
    console.log(`调用HSF函数: ${funcName}`, args);
  },
  config: (key) => {
    return window.lib.storage[key] || null;
  },
  cardsInfo: (cards) => {
    return cards;
  },
  hs_owner: (card) => {
    return window.game.me;
  },
  hs_alt: (message) => {
    console.log(`警告消息: ${message}`);
    window.alert(message);
  },
};

// 模拟UI对象
export const mockUI = {
  create: {
    toast: (message) => {
      console.log(`提示消息: ${message}`);
      addLog(message, "info");

      // 创建一个简单的toast提示
      const toast = document.createElement("div");
      toast.textContent = message;
      toast.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 1001;
                font-family: Arial, sans-serif;
            `;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.remove();
      }, 3000);
    },
  },
  // 核心UI元素，与原始项目结构保持一致
  background: document.createElement("div"),
  arena: document.createElement("div"),
  window: document.createElement("div"),
  arenalog: document.createElement("div"),
  // 手牌相关元素
  handcards1: document.createElement("div"),
  handcards2: document.createElement("div"),
  handcards1Container: document.createElement("div"),
  handcards2Container: document.createElement("div"),
  // 其他炉石元素
  hs_endbtn: document.createElement("button"),
  hs_enemycount: document.createElement("div"),
  hs_medeckcontainer: document.createElement("div"),
  hs_enemydeckcontainer: document.createElement("div"),
  hs_medeckbox: document.createElement("div"),
  hs_enemydeckbox: document.createElement("div"),
  // 游戏场地元素
  monsterzone: document.createElement("div"),
  zonearena: document.createElement("div"),
  // 动态元素容器
  dynamicElements: document.createElement("div"),
  // 控制相关元素
  control: {
    childNodes: [],
    classList: {
      contains: () => false,
    },
  },
  updatehl: () => {
    console.log("更新高亮");
  },
  auto: {
    show: () => {
      console.log("显示自动按钮");
    },
  },
};

// 模拟_status对象
export const mockStatus = {
  hsbo: false,
  tempMusic: null,
  currentPhase: null,
  hs_entergame: false,
  hs_starttime: null,
  tempBackground: "ol_bg", // 设置龙纹背景
};

// 模拟game对象
export const mockGame = {
  // 添加更新背景方法
  updateBackground: () => {
    const background = window._status.tempBackground || "default";
    console.log("更新背景:", background);

    // 移除旧的背景元素
    const oldBackground = document.querySelector(".background");
    if (oldBackground) {
      oldBackground.remove();
    }

    // 创建新的背景元素
    const backgroundEl = document.createElement("div");
    backgroundEl.className = "background";

    // 设置背景图片
    if (background === "default") {
      backgroundEl.classList.add("start");
      backgroundEl.style.backgroundImage = "none";
    } else {
      // 使用龙纹背景
      const bgUrl = `image/background/${background}.jpg`;
      backgroundEl.style.backgroundImage = `url(${bgUrl})`;
      backgroundEl.style.backgroundSize = "cover";
      backgroundEl.style.backgroundPosition = "50% 50%";
      backgroundEl.style.position = "fixed";
      backgroundEl.style.top = "0";
      backgroundEl.style.left = "0";
      backgroundEl.style.width = "100vw";
      backgroundEl.style.height = "100vh";
      backgroundEl.style.zIndex = "-1";
      backgroundEl.style.filter = "brightness(0.7)";
    }

    // 添加到页面
    document.body.insertBefore(backgroundEl, document.body.firstChild);
  },
  addMode: (name, module, config) => {
    console.log(`=== 添加模式: ${name} ===`);
    console.log("模块:", module);
    console.log("配置:", config);

    window.currentMode = { name: name, module, config };

    if (!window.game.modes) {
      window.game.modes = {
        all: new Map(),
        current: null,
        list: [],
      };
    }

    window.game.modes.all.set(name, {
      module,
      config,
      name: name,
    });
    console.log("模式添加成功，当前模式数量:", window.game.modes.all.size);
    console.log("当前模式列表:", Array.from(window.game.modes.all.keys()));

    window.game.modes.list.push(name);
    window.game.modes.current = name;

    return true;
  },
  startMode: (modeName) => {
    console.log("开始模式: " + modeName);
    const mode = window.game.modes.all.get(modeName);
    if (mode) {
      window.game.modes.current = modeName;
      console.log("已进入模式: " + modeName);

      // 执行完整的游戏流程
      try {
        console.log("调用模式init()方法...");
        if (mode.module.init) {
          mode.module.init(mode.config);
          console.log("模式init()完成");
        } else {
          console.log("模式没有init()方法");
        }

        console.log("调用模式startBefore()方法...");
        if (mode.module.startBefore) {
          mode.module.startBefore();
          console.log("模式startBefore()完成");
        } else {
          console.log("模式没有startBefore()方法");
        }

        console.log("调用模式start()方法...");
        if (mode.module.start) {
          // 创建一个模拟event对象
          const mockEvent = {
            getParent: (level) => {
              return { name: "chooseToUse" };
            },
            finish: () => {
              console.log("事件完成");
            },
            insert: (content, data) => {
              console.log("插入内容:", content, data);
            },
          };
          mode.module.start(mockEvent);
          console.log("模式start()完成");
        } else {
          console.log("模式没有start()方法");
        }

        console.log("模式初始化和启动完成");
        return true;
      } catch (error) {
        console.error("模式执行过程中出错:", error);
        return false;
      }
    } else {
      console.error("未找到模式: " + modeName);
      return false;
    }
  },
  prepareArena: (playerCount) => {
    console.log(`准备竞技场，玩家数量: ${playerCount}`);
    // 初始化玩家数组
    window.game.players = [window.game.me, window.game.enemy];
  },
  countPlayer: async (callback) => {
    console.log("遍历玩家");
    if (window.game.me && window.game.enemy) {
      await callback(window.game.me);
      await callback(window.game.enemy);
    }
  },
  gameDraw: async (player) => {
    console.log(`给玩家发牌: ${player.name || "玩家"}`);
    // 触发gameDrawBefore事件，用于触发hs_start技能
    window.game.emitEvent("gameDrawBefore");

    // 直接调用hs_start技能的content方法，确保它能够被执行
    if (window.lib && window.lib.skill && window.lib.skill.hs_start) {
      console.log("直接调用hs_start技能的content方法");
      window.lib.skill.hs_start.content({
        finish: () => console.log("事件完成"),
      });
    }
  },
  phaseLoop: (player) => {
    console.log(`进入回合循环: ${player.name || "玩家"}`);
    // 触发phaseEnd事件，用于触发hs_start技能
    window.game.emitEvent("phaseEnd");
  },
  over: (result) => {
    console.log(`游戏结束，结果: ${result}`);
  },
  playBackgroundMusic: () => {
    console.log("播放背景音乐");
  },
  addVideo: (name, player, cards) => {
    console.log(`添加视频效果: ${name}`);
  },
  save: (key, value) => {
    console.log(`保存数据: ${key}`);
    if (!window.lib.storage) {
      window.lib.storage = {};
    }
    window.lib.storage[key] = value;
  },
  saveConfig: (key, value, mode) => {
    console.log(`保存配置: ${key} = ${value} (模式: ${mode})`);
    if (!window.lib.storage) {
      window.lib.storage = {};
    }
    window.lib.storage[key] = value;
  },
  reload: () => {
    console.log("游戏重新加载");
    window.location.reload();
  },
  modes: {
    all: new Map(),
    current: null,
    list: [],
  },
  print: (msg) => console.log("Game print:", msg),
  tryUpdateClient: () => Promise.resolve(),
  get: (key) => null,
  set: (key, value) => {},
  // 添加事件系统
  event: {
    on: () => {},
    off: () => {},
    emit: () => {},
  },
  // 自定义事件触发方法
  emitEvent: (eventName) => {
    console.log(`触发事件: ${eventName}`);
    // 检查是否有技能需要触发
    if (window.lib.skill && window.lib.skill.hs_start) {
      const skill = window.lib.skill.hs_start;
      // 检查触发条件
      if (skill.trigger.global.includes(eventName)) {
        console.log(`检查hs_start技能的触发条件`);
        // 创建模拟事件对象
        const mockEvent = {
          name: eventName,
          trigger: skill,
          finish: () => {
            console.log("事件完成");
          },
          insert: (content, data) => {
            console.log("插入内容:", content, data);
          },
          getParent: (level) => {
            return { name: "chooseToUse" };
          },
        };
        // 检查过滤条件
        const playersLength = window.game.players
          ? window.game.players.length
          : 0;
        const hsEntergame = window._status.hs_entergame;
        console.log(
          `检查hs_start技能条件 - 玩家数量: ${playersLength}, hs_entergame: ${hsEntergame}`
        );
        if (skill.filter(mockEvent, window.game.me)) {
          console.log("触发hs_start技能");
          // 调用技能内容
          skill.content(mockEvent);
        } else {
          console.log(
            `未满足hs_start技能的触发条件 - 玩家数量: ${playersLength}, hs_entergame: ${hsEntergame}`
          );
        }
      }
    }
  },
};

export { addLog, updateStatus };
