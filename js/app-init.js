import {
  mockLib,
  mockGet,
  mockUI,
  mockStatus,
  mockGame,
  addLog,
  updateStatus,
} from "./game-logic.js";
import { GameEvent, EventManager, HookManager } from "./game-event.js";
import { TriggerSystem, integrateTriggerSystem } from "./trigger.js";

// 初始化游戏
async function loadExtension() {
  try {
    const loadingDiv = document.getElementById("loading");
    const gameArea = document.getElementById("game-area");

    updateStatus("加载扩展中...");

    // 更新mockLib，添加hook机制支持
    mockLib.hook = {
      add: HookManager.addHook.bind(HookManager),
      remove: HookManager.removeHook.bind(HookManager),
      call: HookManager.callHook.bind(HookManager),
    };

    // 更新mockGame，使用新的EventManager
    mockGame.eventManager = new EventManager();
    mockGame.event = {
      on: mockGame.eventManager.on.bind(mockGame.eventManager),
      off: mockGame.eventManager.off.bind(mockGame.eventManager),
      emit: mockGame.eventManager.emitEvent.bind(mockGame.eventManager),
    };

    // 将模拟对象添加到window对象中
    window.lib = mockLib;
    window.game = mockGame;
    window.ui = mockUI;
    window.get = mockGet;
    window.ai = {};
    window._status = mockStatus;
    window.GameEvent = GameEvent;
    window.EventManager = EventManager;
    window.HookManager = HookManager;

    // 初始化玩家对象
    window.game.me = new window.lib.element.Player();
    window.game.me.name = "我";
    window.game.enemy = new window.lib.element.Player();
    window.game.enemy.name = "对手";
    window.game.me.next = window.game.enemy;
    window.game.zhu = window.game.enemy;
    // 初始化玩家数组，确保hs_start技能的触发条件被满足
    window.game.players = [window.game.me, window.game.enemy];
    console.log("初始化玩家数组，玩家数量:", window.game.players.length);

    // 设置background元素
    window.ui.background.id = "background";
    window.ui.background.classList.add("hscss");
    window.ui.background.classList.add("background");
    window.ui.background.style.position = "absolute";
    window.ui.background.style.top = "0";
    window.ui.background.style.left = "0";
    window.ui.background.style.width = "100%";
    window.ui.background.style.height = "100%";
    window.ui.background.style.zIndex = "5";

    // 初始化DOM结构
    window.ui.arena.id = "arena";
    window.ui.arena.classList.add("nova");
    window.ui.arena.classList.add("hscss");
    window.ui.arena.style.position = "relative";
    window.ui.arena.style.zIndex = "10";
    window.ui.arena.style.width = "100%";
    window.ui.arena.style.height = "100%";
    window.ui.arena.dataset.player_border = "wide";
    window.ui.arena.dataset.player_height_nova = "short";
    window.ui.arena.style.overflow = "hidden";

    // 设置window元素
    window.ui.window.id = "window";
    window.ui.window.classList.add("nova");
    window.ui.window.classList.add("hscss");
    window.ui.window.dataset.player_border = "wide";
    window.ui.window.style.position = "absolute";
    window.ui.window.style.top = "0";
    window.ui.window.style.left = "0";
    window.ui.window.style.width = "100%";
    window.ui.window.style.height = "100%";
    window.ui.window.style.zIndex = "20";

    // 设置arenalog元素
    window.ui.arenalog.id = "arenalog";
    window.ui.arenalog.classList.add("hscss");
    window.ui.arenalog.style.position = "absolute";
    window.ui.arenalog.style.bottom = "10px";
    window.ui.arenalog.style.left = "10px";
    window.ui.arenalog.style.zIndex = "100";

    // 设置monsterzone元素 - 怪物区域
    window.ui.monsterzone.classList.add("monsterzone");
    window.ui.monsterzone.classList.add("hscss");
    window.ui.monsterzone.style.position = "absolute";
    window.ui.monsterzone.style.left = "calc(100% - 1300px)";
    window.ui.monsterzone.style.top = "calc(100% - 769px)";
    window.ui.monsterzone.style.width = "1404px";
    window.ui.monsterzone.style.height = "892px";
    window.ui.monsterzone.style.zIndex = "2";
    window.ui.monsterzone.style.pointerEvents = "none";

    // 设置zonearena元素 - 特效区域
    window.ui.zonearena.classList.add("zonearena");
    window.ui.zonearena.classList.add("hscss");
    window.ui.zonearena.style.position = "absolute";
    window.ui.zonearena.style.left = "calc(100% - 1000px)";
    window.ui.zonearena.style.top = "calc(100% - 480px)";
    window.ui.zonearena.style.width = "760px";
    window.ui.zonearena.style.height = "300px";
    window.ui.zonearena.style.borderRadius = "50px";
    window.ui.zonearena.style.zIndex = "2";
    window.ui.zonearena.style.opacity = "0";

    // 设置手牌容器
    window.ui.handcards1Container.id = "handcards1-container";
    window.ui.handcards1Container.classList.add("hscss");
    window.ui.handcards1Container.style.position = "absolute";
    window.ui.handcards1Container.style.bottom = "0";
    window.ui.handcards1Container.style.left = "0";
    window.ui.handcards1Container.style.width = "100%";
    window.ui.handcards1Container.style.zIndex = "30";

    window.ui.handcards2Container.id = "handcards2-container";
    window.ui.handcards2Container.classList.add("hscss");
    window.ui.handcards2Container.style.position = "absolute";
    window.ui.handcards2Container.style.top = "0";
    window.ui.handcards2Container.style.left = "0";
    window.ui.handcards2Container.style.width = "100%";
    window.ui.handcards2Container.style.zIndex = "30";

    // 设置其他炉石元素
    window.ui.hs_endbtn.className = "hs_endbtn";
    window.ui.hs_endbtn.style.position = "absolute";
    window.ui.hs_endbtn.style.bottom = "10px";
    window.ui.hs_endbtn.style.right = "10px";
    window.ui.hs_endbtn.style.zIndex = "40";

    window.ui.hs_enemycount.className = "hs_enemycount";
    window.ui.hs_enemycount.style.position = "absolute";
    window.ui.hs_enemycount.style.top = "10px";
    window.ui.hs_enemycount.style.left = "10px";
    window.ui.hs_enemycount.style.zIndex = "40";

    window.ui.hs_medeckcontainer.className = "hs_medeckcontainer";
    window.ui.hs_medeckcontainer.style.position = "absolute";
    window.ui.hs_medeckcontainer.style.bottom = "10px";
    window.ui.hs_medeckcontainer.style.left = "10px";
    window.ui.hs_medeckcontainer.style.zIndex = "30";

    window.ui.hs_enemydeckcontainer.className = "hs_enemydeckcontainer";
    window.ui.hs_enemydeckcontainer.style.position = "absolute";
    window.ui.hs_enemydeckcontainer.style.top = "10px";
    window.ui.hs_enemydeckcontainer.style.right = "10px";
    window.ui.hs_enemydeckcontainer.style.zIndex = "30";

    window.ui.hs_medeckbox.className = "hs_medeckbox";
    window.ui.hs_medeckbox.style.position = "absolute";
    window.ui.hs_medeckbox.style.bottom = "10px";
    window.ui.hs_medeckbox.style.left = "100px";
    window.ui.hs_medeckbox.style.zIndex = "30";

    window.ui.hs_enemydeckbox.className = "hs_enemydeckbox";
    window.ui.hs_enemydeckbox.style.position = "absolute";
    window.ui.hs_enemydeckbox.style.top = "10px";
    window.ui.hs_enemydeckbox.style.right = "100px";
    window.ui.hs_enemydeckbox.style.zIndex = "30";

    // 动态元素容器
    window.ui.dynamicElements.classList.add("hscss");
    window.ui.dynamicElements.style.position = "absolute";
    window.ui.dynamicElements.style.top = "0";
    window.ui.dynamicElements.style.left = "0";
    window.ui.dynamicElements.style.width = "100%";
    window.ui.dynamicElements.style.height = "100%";
    window.ui.dynamicElements.style.zIndex = "50";

    console.log("添加hscss类到arena元素，当前类名:", window.ui.arena.className);
    console.log(
      "添加hscss类到window元素，当前类名:",
      window.ui.window.className
    );
    console.log(
      "添加hscss类到background元素，当前类名:",
      window.ui.background.className
    );
    console.log("初始化完成，准备添加player元素到arena");

    // 添加必要的DOM方法
    if (!HTMLDivElement.prototype.setBackground) {
      HTMLDivElement.prototype.setBackground = function (
        name,
        type,
        ext = ".jpg",
        subfolder = "default"
      ) {
        return this;
      };
    }

    // 添加数组扩展方法
    if (!Array.prototype.add) {
      Array.prototype.add = function (item) {
        this.push(item);
        return this;
      };
    }
    if (!Array.prototype.addArray) {
      Array.prototype.addArray = function (items) {
        if (Array.isArray(items)) {
          this.push(...items);
        }
        return this;
      };
    }

    // 添加游戏UI到页面，建立正确的父子关系
    // 1. 添加background到gameArea最底层
    gameArea.appendChild(window.ui.background);

    // 2. 添加arena到gameArea
    gameArea.appendChild(window.ui.arena);

    // 3. 将游戏场地元素添加到arena中
    window.ui.arena.appendChild(window.ui.monsterzone);
    window.ui.arena.appendChild(window.ui.zonearena);

    // 4. 将手牌容器直接添加到arena中（与原始项目结构一致）
    window.ui.arena.appendChild(window.ui.handcards1);
    window.ui.arena.appendChild(window.ui.handcards2);
    window.ui.arena.appendChild(window.ui.handcards1Container);
    window.ui.arena.appendChild(window.ui.handcards2Container);

    // 5. 添加动态元素容器
    window.ui.arena.appendChild(window.ui.dynamicElements);

    // 6. 添加其他顶层元素到gameArea
    gameArea.appendChild(window.ui.window);
    gameArea.appendChild(window.ui.arenalog);
    gameArea.appendChild(window.ui.hs_endbtn);
    gameArea.appendChild(window.ui.hs_enemycount);
    gameArea.appendChild(window.ui.hs_medeckcontainer);
    gameArea.appendChild(window.ui.hs_enemydeckcontainer);
    gameArea.appendChild(window.ui.hs_medeckbox);
    gameArea.appendChild(window.ui.hs_enemydeckbox);

    // 7. 确保player元素能够被正确添加到arena中（由游戏逻辑动态添加）
    // 为arena添加data-number属性，用于common.css中的选择器
    window.ui.arena.dataset.number = "2";

    console.log(
      "DOM元素添加完成，arena的classList:",
      window.ui.arena.className
    );
    console.log("arena的dataset:", window.ui.arena.dataset);

    // 设置龙纹背景
    window.game.updateBackground();

    // 初始化trigger系统
    window.triggerSystem = new TriggerSystem();
    integrateTriggerSystem();
    console.log("Trigger system initialized successfully");

    // 加载扩展主模块
    const extensionPath = "../extension/炉石普通/extension.js";
    console.log("正在加载扩展模块:", extensionPath);

    const module = await import(extensionPath);
    console.log("扩展模块加载成功，导出内容:", Object.keys(module));

    const Application = module.default;
    console.log("获取Application类成功:", typeof Application);

    if (typeof Application !== "function") {
      throw new Error(`Application不是一个函数，而是: ${typeof Application}`);
    }

    updateStatus("初始化扩展中...");

    // 初始化扩展
    const app = await Application.init();
    console.log("扩展初始化成功:", app);

    // 显示游戏界面
    loadingDiv.style.display = "none";
    updateStatus("游戏已准备就绪");

    // 检查是否有模式被添加
    setTimeout(() => {
      console.log("检查当前模式数量:", window.game.modes.all.size);
      console.log("当前模式列表:", Array.from(window.game.modes.all.keys()));

      if (window.game.modes.all.size > 0) {
        const firstMode = window.game.modes.all.keys().next().value;
        console.log("自动进入第一个可用模式:", firstMode);
        window.game.startMode(firstMode);
      } else {
        console.error("未找到可用模式，尝试手动添加");

        // 如果没有找到模式，手动创建一个简单的模式对象
        const manualModeName = "hearthstone";
        const manualModeModule = {
          name: manualModeName,
          init: () => {
            console.log("手动初始化模式:", manualModeName);
            if (window.ui && window.ui.create && window.ui.create.toast) {
              window.ui.create.toast("欢迎来到艾泽拉斯的魔法世界");
            }
          },
          startBefore: () => {
            console.log("手动调用startBefore方法");
          },
          start: (event) => {
            console.log("手动调用start方法");
          },
        };

        window.game.addMode(manualModeName, manualModeModule, {});
        window.game.startMode(manualModeName);
      }
    }, 1000);
  } catch (error) {
    console.error("=== 扩展加载失败 ===");
    console.error("错误类型:", error.name);
    console.error("错误消息:", error.message);
    console.error("错误堆栈:", error.stack);
    console.error("错误原因:", error.cause);

    updateStatus("加载失败");

    // 在页面上显示错误
    const errorDiv = document.createElement("div");
    errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 5px;
            z-index: 1001;
            font-family: monospace;
            white-space: pre-wrap;
            max-width: 80%;
            max-height: 80%;
            overflow: auto;
        `;

    errorDiv.innerHTML = `
            <h2 style="margin-top: 0;">炉石普通扩展加载失败</h2>
            <p><strong>错误信息:</strong> ${error.message}</p>
            <p><strong>错误堆栈:</strong></p>
            <pre style="background: rgba(0, 0, 0, 0.5); padding: 10px; border-radius: 3px; overflow: auto;">${error.stack || "无堆栈信息"}</pre>
        `;

    document.body.appendChild(errorDiv);
  }
}

// 启动加载流程
loadExtension();
