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
      { name: "extensionLoad", priority: 125 },
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
    // 并行加载所有初始化步骤模块
    const [
      environmentSetupModule,
      polyfillLoadModule,
      coreModuleInitModule,
      platformDetectionModule,
      windowListenerSetupModule,
      configLoadModule,
      cssLoadModule,
      sandboxInitModule,
      securityInitModule,
      extensionManagerInitModule,
      touchDeviceDetectionModule,
      layoutSetupModule,
      extensionLoadModule,
      gameModeInitModule,
      gameDataLoadModule,
    ] = await Promise.all([
      import("./steps/environmentSetup.js"),
      import("./steps/polyfillLoad.js"),
      import("./steps/coreModuleInit.js"),
      import("./steps/platformDetection.js"),
      import("./steps/windowListenerSetup.js"),
      import("./steps/configLoad.js"),
      import("./steps/cssLoad.js"),
      import("./steps/sandboxInit.js"),
      import("./steps/securityInit.js"),
      import("./steps/extensionManagerInit.js"),
      import("./steps/touchDeviceDetection.js"),
      import("./steps/layoutSetup.js"),
      import("./steps/extensionLoad.js"),
      import("./steps/gameModeInit.js"),
      import("./steps/gameDataLoad.js"),
    ]);

    // 构建步骤对象
    const steps = {
      environmentSetup: environmentSetupModule.environmentSetup,
      polyfillLoad: polyfillLoadModule.polyfillLoad,
      coreModuleInit: coreModuleInitModule.coreModuleInit,
      platformDetection: platformDetectionModule.platformDetection,
      windowListenerSetup: windowListenerSetupModule.windowListenerSetup,
      configLoad: configLoadModule.configLoad,
      cssLoad: cssLoadModule.cssLoad,
      sandboxInit: sandboxInitModule.sandboxInit,
      securityInit: securityInitModule.securityInit,
      extensionManagerInit: extensionManagerInitModule.extensionManagerInit,
      touchDeviceDetection: touchDeviceDetectionModule.touchDeviceDetection,
      layoutSetup: layoutSetupModule.layoutSetup,
      extensionLoad: extensionLoadModule.extensionLoad,
      gameModeInit: gameModeInitModule.gameModeInit,
      gameDataLoad: gameDataLoadModule.gameDataLoad,
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

      // 将步骤按名称映射，方便后续调用
      const stepMap = new Map();
      for (const step of this.initSteps) {
        stepMap.set(step.name, step);
      }

      // 更新进度的辅助函数
      const updateProgress = (progress) => {
        this.initStatus.progress = progress;
      };

      // 执行单个步骤的辅助函数
      const executeStep = async (stepName, params = []) => {
        const step = stepMap.get(stepName);
        if (!step) return;

        this.initStatus.currentStep = step.name;
        try {
          let result;
          if (params.length > 0) {
            result = await step.initFunction(...params);
          } else {
            result = await step.initFunction();
          }
          stepResults[step.name] = result;
          return result;
        } catch (error) {
          console.error(`初始化步骤 ${step.name} 失败:`, error);
          this.initStatus.errors.push({
            step: step.name,
            error,
          });
        }
      };

      // 第一阶段：基础环境设置（并行执行）
      updateProgress(5);
      await Promise.all([
        executeStep("environmentSetup"),
        executeStep("polyfillLoad"),
        executeStep("platformDetection"),
        executeStep("touchDeviceDetection"),
      ]);

      // 第二阶段：核心模块初始化（并行执行）
      updateProgress(15);
      await Promise.all([
        executeStep("coreModuleInit"),
        executeStep("sandboxInit"),
        executeStep("securityInit"),
      ]);

      // 第三阶段：配置和监听器设置（并行执行）
      updateProgress(30);
      const [windowListenerResult, configLoadResult] = await Promise.all([
        executeStep("windowListenerSetup"),
        executeStep("configLoad"),
      ]);
      promiseErrorHandler = windowListenerResult;

      // 第四阶段：扩展管理器和布局设置（并行执行）
      updateProgress(45);
      const [extensionManagerResult, layoutResult, cssResult] =
        await Promise.all([
          executeStep("extensionManagerInit"),
          executeStep("layoutSetup"),
          executeStep("cssLoad"),
        ]);
      extensionlist = layoutResult;

      // 第五阶段：扩展加载和数据包初始化
      updateProgress(60);
      await executeStep("extensionLoad", [extensionlist, promiseErrorHandler]);

      // 第六阶段：游戏模式和数据加载（按顺序执行，因为gameDataLoad依赖gameModeInit）
      updateProgress(75);
      await executeStep("gameModeInit", [true]);
      updateProgress(90);
      await executeStep("gameDataLoad");

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
