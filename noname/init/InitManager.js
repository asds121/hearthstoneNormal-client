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

      { name: "sandboxInit", priority: 70 },
      { name: "securityInit", priority: 80 },
      { name: "extensionManagerInit", priority: 90 },
      { name: "touchDeviceDetection", priority: 100 },
      { name: "layoutSetup", priority: 110 },
      { name: "cssLoad", priority: 120 },
      //导入默认背景图片、音乐、字体、主题，suitsFont
      { name: "extensionLoad", priority: 150 },
      { name: "gameModeInit", priority: 160 },
      { name: "gameDataLoad", priority: 170 },
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
      // 存储步骤结果，用于后续步骤
      const stepResults = {};
      let extensionlist = [];
      let promiseErrorHandler = null;

      // 执行所有初始化步骤
      for (let i = 0; i < this.initSteps.length; i++) {
        const step = this.initSteps[i];
        this.initStatus.currentStep = step.name;
        this.initStatus.progress = (i / this.initSteps.length) * 100;

        try {
          let result;
          
          // 特殊处理需要参数的步骤
          if (step.name === "gameModeInit") {
            // gameModeInit 需要 show_splash 参数
            result = await step.initFunction(true);
          } else if (step.name === "windowListenerSetup") {
            // windowListenerSetup 返回 promiseErrorHandler
            promiseErrorHandler = await step.initFunction();
          } else if (step.name === "layoutSetup") {
            // layoutSetup 返回 extensionlist
            extensionlist = await step.initFunction();
          } else if (step.name === "extensionLoad") {
            // extensionLoad 需要 extensionlist 和 promiseErrorHandler 参数
            await step.initFunction(extensionlist, promiseErrorHandler);
          } else {
            result = await step.initFunction();
          }

          // 存储步骤结果
          stepResults[step.name] = result;
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
