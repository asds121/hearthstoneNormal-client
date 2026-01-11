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
      const { modeModule } = await import("../mode/index.js");

      game.addMode("identity", modeModule.identity, {
        extension: "三国杀标准",
        translate: "身份",
        connect: {},
      });

      // 注册单个模式
      game.addMode("single", modeModule.single(), {
        extension: "三国杀标准",
        translate: "单挑",
        connect: {},
      });

      game.addMode("doudizhu", modeModule.doudizhu(), {
        extension: "三国杀标准",
        translate: "斗地主",
        connect: {},
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
