import { lib, game, ui, get, ai, _status } from "../../../noname.js";

const type = "extension";

class Application {
  constructor({ name, editable, connect, package: packages }) {
    this.name = name;
    this.editable = editable;
    this.connect = connect;
    this.package = packages;
    this.files = {
      character: [],
      card: [],
      skill: [],
      audio: [],
    };
  }

  static async init() {
    try {
      const {
        default: { name, ...introduce },
      } = await import("../info.json", { with: { type: "json" } });

      // package.js 内容已合并到 assets.json 中，不再需要单独加载

      const [characterRes, cardRes] = await Promise.allSettled([
        import("../character/standard/index.js"),
        import("../card/standard/index.js"),
      ]);

      const getModuleExport = (result) => {
        if (result.status === "fulfilled" && result.value) {
          // 检查是否有default导出，如果有则执行它
          if (typeof result.value.default === "function") {
            return result.value.default();
          }
          // 如果没有default导出，返回整个value对象
          return result.value;
        }
        return {};
      };

      const characterModule = getModuleExport(characterRes);
      const cardModule = getModuleExport(cardRes);

      return new this({
        name,
        editable: false,
        connect: true,
        package: {
          character: characterModule,
          card: cardModule,
          ...introduce,
        },
      });
    } catch (initError) {
      console.error("Application initialization failed:", initError);
      throw new Error("异步初始化失败！", { cause: initError });
    } finally {
      // 加载并注册所有模式（通过统一入口）
      const { modeModule, modeMenu } = await import("../mode/index.js");

      // 使用modeMenu中的配置注册身份模式
      game.addMode("identity", modeModule.identity, {
        extension: "三国杀标准",
        translate: modeMenu.identity.name,
        connect: {},
        config: modeMenu.identity.config,
      });

      // 注册单挑模式
      game.addMode("single", modeModule.single(), {
        extension: "三国杀标准",
        translate: modeMenu.single.name,
        connect: {},
        config: modeMenu.single.config,
      });

      // 注册斗地主模式
      game.addMode("doudizhu", modeModule.doudizhu(), {
        extension: "三国杀标准",
        translate: modeMenu.doudizhu.name,
        connect: {},
        config: modeMenu.doudizhu.config,
      });
    }
  }

  onremove() {}
  onover(result) {}
  arenaReady(...args) {}
  content(config, pack) {}

  async precontent(config) {
    // 预加载内容
  }
}

export { type, Application };
