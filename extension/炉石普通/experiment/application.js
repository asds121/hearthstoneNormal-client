import { lib, game, ui, get, ai, _status } from "../../../noname.js";
import { type, utility } from "./utility.js";

class Application {
  static {
    Reflect.deleteProperty(HTMLDivElement.prototype, "setBackground");
    new Set(["contains", "containsSome", "containsAll"]).forEach((i) => {
      Reflect.deleteProperty(Array.prototype, i);
    });
    new Set([
      "contains",
      "includes",
      "add",
      "push",
      "remove",
      "addArray",
    ]).forEach((j) => {
      Reflect.deleteProperty(Map.prototype, j);
    });
  }

  static {
    Reflect.defineProperty(HTMLDivElement.prototype, "setBackground", {
      configurable: true,
      enumerable: false,
      writable: true,
      value(name, type, ext = ".jpg", subfolder = "default") {
        if (!name) {
          return this;
        }
        if (ext === "noskin") {
          ext = ".jpg";
        }
        let src;
        if (type) {
          let dbimage = null;
          let extimage = null;
          let modeimage = null;
          let gzbool = false;
          let nameinfo;
          const mode = get.mode();
          if (type === "character") {
            nameinfo = get.character(name);
            if (lib.characterPack[`mode_${mode}`]?.[name]) {
              if (mode === "guozhan") {
                if (name.startsWith("gz_shibing")) {
                  name = name.slice(3, 11);
                } else {
                  if (
                    lib.config.mode_config.guozhan.guozhanSkin &&
                    nameinfo?.hasSkinInGuozhan
                  ) {
                    gzbool = true;
                  }
                  name = name.slice(3);
                }
              } else {
                modeimage = mode;
              }
            } else if (name.includes("::")) {
              // @ts-expect-error ignore
              [modeimage, name] = name.split("::");
            }
          }
          let imgPrefixUrl;
          if (!modeimage && nameinfo) {
            if (nameinfo.img) {
              imgPrefixUrl = nameinfo.img;
            } else if (nameinfo.trashBin) {
              for (const value of nameinfo.trashBin) {
                if (value.startsWith("img:")) {
                  imgPrefixUrl = value.slice(4);
                  break;
                } else if (value.startsWith("ext:")) {
                  extimage = value;
                  break;
                } else if (value.startsWith("db:")) {
                  dbimage = value;
                  break;
                } else if (value.startsWith("mode:")) {
                  modeimage = value.slice(5);
                  break;
                } else if (value.startsWith("character:")) {
                  name = value.slice(10);
                  break;
                }
              }
            }
          }
          if (imgPrefixUrl) {
            src = imgPrefixUrl;
          } else if (extimage) {
            src = extimage.replace(/^ext:/, "extension/");
          } else if (dbimage) {
            this.setBackgroundDB(dbimage.slice(3)).then(lib.filter.none);
            return this;
          } else if (modeimage) {
            src = `image/mode/${modeimage}/character/${name}${ext}`;
          } else if (
            type === "character" &&
            lib.config.skin[name] &&
            ext !== "noskin"
          ) {
            src = `image/skin/${name}/${lib.config.skin[name]}${ext}`;
          } else if (type === "character") {
            src = `image/character/${gzbool ? "gz_" : ""}${name}${ext}`;
          } else {
            src = `image/${type}/${subfolder}/${name}${ext}`;
          }
        } else {
          src = `image/${name}${ext}`;
        }
        this.style.backgroundPositionX = "center";
        this.style.backgroundSize = "cover";
        if (type === "character") {
          const nameinfo = get.character(name);
          const hasNoDefaultPicture =
            nameinfo?.[4]?.includes("noDefaultPicture");
          const sex =
            nameinfo && ["male", "female"].includes(nameinfo[0])
              ? nameinfo[0]
              : "male";
          const backgrounds = hasNoDefaultPicture
            ? src
            : [src, `${lib.characterDefaultPicturePath}${sex}${ext}`];
          this.setBackgroundImage(backgrounds);
        } else {
          this.setBackgroundImage(src);
        }
        return this;
      },
    });
  }

  static filter() {
    const [, coreVersion] = get.coreInfo();
    if (coreVersion < 128) {
      console.warn(
        "检测到您的webview版本低于128，请您升级系统webview（推荐135+）"
      );
      return false;
    }
    return true;
  }

  constructor({
    name,
    editable,
    connect,
    config,
    help,
    mixin,
    package: packages,
  }) {
    this.name = name;
    this.editable = editable;
    this.connect = connect;
    this.config = config;
    this.help = help;
    this.mixin = mixin;
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

      const [configRes, helpRes, mixinRes, characterRes, cardRes] =
        await Promise.allSettled([
          import("./package/config.js"),
          import("./package/help.js"),
          import("./package/mixin.js"),
          import("./package/character/index.js"),
          import("./package/card/index.js"),
        ]);

      const getModuleExport = (result, exportName) => {
        if (result.status === "fulfilled" && result.value) {
          if (exportName === "characterModule" || exportName === "cardModule") {
            return result.value[exportName]();
          }
          return result.value[exportName];
        }
        return {};
      };

      const configModule = getModuleExport(configRes, "configModule");
      const helpModule = getModuleExport(helpRes, "helpModule");
      const mixinModule = getModuleExport(mixinRes, "mixinModule");
      const characterModule = getModuleExport(characterRes, "characterModule");
      const cardModule = getModuleExport(cardRes, "cardModule");

      return new this({
        name,
        editable: false,
        connect: true,
        config: configModule,
        help: helpModule,
        mixin: mixinModule,
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
      const {
        modeName,
        modeModule,
        default: modeConfig,
      } = await import("./package/mode/index.js");
      game.addMode(modeName, modeModule, modeConfig);
    }
  }

  onremove() {}

  onover(result) {}

  arenaReady(...args) {}

  content(config, pack) {}

  prepare(...args) {}

  async precontent(config) {
    // @TODO
  }
}

export { type, Application };
