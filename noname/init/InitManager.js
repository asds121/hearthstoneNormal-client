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

    // 预定义初始化步骤配置
    this.stepConfigs = [
      { name: "environmentSetup", priority: 10 },
      { name: "polyfillLoad", priority: 20 },
      { name: "coreModuleInit", priority: 30 },
      { name: "platformDetection", priority: 40 },
      { name: "windowListenerSetup", priority: 50 },
      { name: "configLoad", priority: 60 },
      { name: "cssLoad", priority: 70 },
      { name: "sandboxInit", priority: 80 },
      { name: "securityInit", priority: 90 },
      { name: "extensionManagerInit", priority: 100 },
      { name: "touchDeviceDetection", priority: 110 },
      { name: "layoutSetup", priority: 120 },
      { name: "extensionLoad", priority: 130 },
      { name: "gameModeInit", priority: 140 },
      { name: "gameDataLoad", priority: 150 },
    ];
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
   * 批量注册初始化步骤
   * @param {Object} stepFunctions - 步骤名称到函数的映射
   */
  registerInitSteps(stepFunctions) {
    for (const [name, initFunction] of Object.entries(stepFunctions)) {
      const config = this.stepConfigs.find((config) => config.name === name);
      const priority = config ? config.priority : 0;
      this.registerInitStep(name, initFunction, priority);
    }
  }

  /**
   * 加载并注册所有初始化步骤
   */
  async loadInitSteps() {
    // 加载所有初始化步骤
    const steps = {
      environmentSetup: (await import("./steps/environmentSetup.js"))
        .environmentSetup,
      polyfillLoad: (await import("./steps/polyfillLoad.js")).polyfillLoad,
      coreModuleInit: (await import("./steps/coreModuleInit.js"))
        .coreModuleInit,
      platformDetection: (await import("./steps/platformDetection.js"))
        .platformDetection,
      windowListenerSetup: (await import("./steps/windowListenerSetup.js"))
        .windowListenerSetup,
      configLoad: (await import("./steps/configLoad.js")).configLoad,
      cssLoad: (await import("./steps/cssLoad.js")).cssLoad,
      sandboxInit: (await import("./steps/sandboxInit.js")).sandboxInit,
      securityInit: (await import("./steps/securityInit.js")).securityInit,
      extensionManagerInit: (await import("./steps/extensionManagerInit.js"))
        .extensionManagerInit,
      touchDeviceDetection: (await import("./steps/touchDeviceDetection.js"))
        .touchDeviceDetection,
      layoutSetup: (await import("./steps/layoutSetup.js")).layoutSetup,
      extensionLoad: (await import("./steps/extensionLoad.js")).extensionLoad,
      gameModeInit: (await import("./steps/gameModeInit.js")).gameModeInit,
      gameDataLoad: (await import("./steps/gameDataLoad.js")).gameDataLoad,
    };

    // 注册所有步骤
    this.registerInitSteps(steps);
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
}

// 导出单例实例
export const initManager = new InitManager();
