import { ai } from "../ai/index.js";
import { get } from "../get/index.js";
import { lib } from "../library/index.js";
import { game } from "../game/index.js";
import { _status } from "../status/index.js";
import { ui } from "../ui/index.js";
import { gnc } from "../gnc/index.js";
import { extensionManager } from "../extension/index.js";
import { gameState } from "../game/GameState.js";
import { gameEventManager } from "../game/GameEventManager.js";

/**
 * 初始化管理器 - 负责协调整个游戏的初始化流程
 */
export class InitManager {
  constructor() {
    this.initSteps = [];
    this.initStatus = {
      started: false,
      completed: false,
      currentStep: null,
      progress: 0,
      errors: [],
    };
  }

  /**
   * 注册初始化步骤
   * @param {string} name - 步骤名称
   * @param {Function} initFunction - 初始化函数
   * @param {number} [priority] - 优先级，数值越小优先级越高
   */
  registerInitStep(name, initFunction, priority = 0) {
    this.initSteps.push({
      name,
      initFunction,
      priority,
    });

    // 按优先级排序
    this.initSteps.sort((a, b) => a.priority - b.priority);
  }

  /**
   * 初始化游戏
   * @returns {Promise<void>} - 初始化完成的Promise
   */
  async init() {
    if (this.initStatus.started) {
      console.warn("初始化已开始，请勿重复调用");
      return;
    }

    this.initStatus.started = true;
    this.initStatus.errors = [];
    this.initStatus.progress = 0;

    try {
      // 执行所有初始化步骤
      for (let i = 0; i < this.initSteps.length; i++) {
        const step = this.initSteps[i];
        this.initStatus.currentStep = step.name;
        this.initStatus.progress = (i / this.initSteps.length) * 100;

        try {
          await step.initFunction();
          console.log(`初始化步骤 ${step.name} 完成`);
        } catch (error) {
          console.error(`初始化步骤 ${step.name} 失败:`, error);
          this.initStatus.errors.push({
            step: step.name,
            error,
          });
        }
      }

      this.initStatus.progress = 100;
      this.initStatus.completed = true;
      this.initStatus.currentStep = null;

      console.log("游戏初始化完成");
    } catch (error) {
      console.error("游戏初始化失败:", error);
      this.initStatus.errors.push({
        step: "unknown",
        error,
      });
    }
  }

  /**
   * 获取初始化状态
   * @returns {Object} - 初始化状态
   */
  getInitStatus() {
    return { ...this.initStatus };
  }

  /**
   * 重置初始化管理器
   */
  reset() {
    this.initStatus = {
      started: false,
      completed: false,
      currentStep: null,
      progress: 0,
      errors: [],
    };
  }

  /**
   * 初始化核心服务
   */
  async initCoreServices() {
    // 初始化游戏状态管理器
    gameState.init();

    // 初始化游戏事件管理器
    gameEventManager.init();

    // 初始化扩展管理器
    await extensionManager.init();

    console.log("核心服务初始化完成");
  }

  /**
   * 初始化游戏对象
   */
  initGameObjects() {
    // 确保核心对象已经初始化
    if (!lib || !game || !ui || !ai || !get || !gnc) {
      throw new Error("核心对象未初始化");
    }

    // 设置全局对象引用
    Reflect.set(lib, "get", get);
    Reflect.set(lib, "ui", ui);
    Reflect.set(lib, "ai", ai);
    Reflect.set(lib, "game", game);
    _status.event = lib.element.GameEvent.initialGameEvent();

    console.log("游戏对象初始化完成");
  }

  /**
   * 初始化游戏配置
   */
  async initConfig() {
    // 初始化全局配置
    if (!lib.config) {
      lib.config = {};
    }

    // 初始化默认配置
    lib.config.debug = lib.config.debug || false;
    lib.config.compatiblemode = lib.config.compatiblemode || false;
    lib.config.confirm_exit = lib.config.confirm_exit || true;

    // 初始化模式配置
    if (!lib.config.mode_config) {
      lib.config.mode_config = {
        global: {},
        single: {},
        multi: {},
        connect: {},
      };
    }

    // 初始化翻译配置
    if (!lib.translate) {
      lib.translate = {};
    }

    console.log("游戏配置初始化完成");
  }

  /**
   * 初始化用户界面
   */
  async initUI() {
    // 初始化UI容器
    if (!ui.arena) {
      ui.arena = document.createElement("div");
      ui.arena.className = "arena";
      document.body.appendChild(ui.arena);
    }

    // 初始化菜单系统
    if (!ui.menu) {
      ui.menu = document.createElement("div");
      ui.menu.className = "menu";
      document.body.appendChild(ui.menu);
    }

    // 初始化提示系统
    if (!ui.toast) {
      ui.toast = document.createElement("div");
      ui.toast.className = "toast";
      document.body.appendChild(ui.toast);
    }

    // 初始化缩放
    if (typeof ui.updatez === "function") {
      ui.updatez();
    }

    console.log("用户界面初始化完成");
  }

  /**
   * 初始化扩展
   */
  async initExtensions() {
    // 扩展初始化已经在initCoreServices中完成
    // 这里可以添加额外的扩展初始化逻辑
    console.log("扩展初始化完成");
  }

  /**
   * 初始化游戏模式
   */
  async initGameModes() {
    // 初始化默认游戏模式
    if (!game.modes) {
      game.modes = {};
    }

    // 初始化默认模式
    if (!game.modes.single) {
      game.modes.single = {
        name: "single",
        translate: "单人模式",
        enabled: true,
      };
    }

    if (!game.modes.multi) {
      game.modes.multi = {
        name: "multi",
        translate: "多人模式",
        enabled: true,
      };
    }

    if (!game.modes.connect) {
      game.modes.connect = {
        name: "connect",
        translate: "联机模式",
        enabled: true,
      };
    }

    // 设置当前模式
    if (!game.currentMode) {
      game.currentMode = lib.config.mode || "single";
    }

    console.log("游戏模式初始化完成");
  }

  /**
   * 初始化游戏数据
   */
  async initGameData() {
    // 初始化全局数据存储
    if (!game.data) {
      game.data = {
        characters: [],
        cards: [],
        skills: [],
        plays: [],
      };
    }

    // 初始化默认角色
    if (game.data.characters.length === 0) {
      game.data.characters.push({
        id: "default_character",
        name: "默认角色",
        hp: 4,
        maxHp: 4,
        skills: [],
      });
    }

    // 初始化默认卡牌
    if (game.data.cards.length === 0) {
      game.data.cards.push({
        id: "default_card",
        name: "默认卡牌",
        type: "basic",
        description: "一张默认卡牌",
      });
    }

    // 初始化游戏状态
    if (!game.state) {
      game.state = {
        turn: 1,
        phase: "start",
        players: [],
        currentPlayer: 0,
      };
    }

    console.log("游戏数据初始化完成");
  }

  /**
   * 初始化游戏事件监听器
   */
  initEventListeners() {
    // 注册游戏事件监听器
    gameEventManager.on("game.init.start", () => {
      console.log("游戏初始化开始");
    });

    gameEventManager.on("game.init.complete", () => {
      console.log("游戏初始化完成");
    });

    gameEventManager.on("game.init.error", (event) => {
      console.error("游戏初始化错误:", event.data.error);
    });

    console.log("游戏事件监听器初始化完成");
  }
}

// 导出单例实例
export const initManager = new InitManager();
