import { lib } from "../../../noname.js";
import { game } from "../../game/index.js";
import { get, set } from "../../util/config.js";
import { get as getModule } from "../../get/index.js";

/**
 * 配置加载步骤
 * - 从window对象获取config
 * - 从localStorage或IndexedDB加载配置
 * - 处理存储导入
 */
export async function configLoad() {
  // 加载配置
  const config2 = await loadConfig();

  // 读取模式
  if (config2.mode) {
    set("mode", config2.mode);
  }
  if (get("mode_config")[get("mode")] === undefined) {
    get("mode_config")[get("mode")] = {};
  }

  // 复制共有模式设置
  for (const name in get("mode_config").global) {
    if (get("mode_config")[get("mode")][name] === undefined) {
      get("mode_config")[get("mode")][name] = get("mode_config").global[name];
    }
  }

  if (get("characters")) {
    set("defaultcharacters", get("characters").slice(0));
  }
  if (get("cards")) {
    set("defaultcards", get("cards").slice(0));
  }

  for (const name in config2) {
    if (name.includes("_mode_config")) {
      var thismode = name.substr(name.indexOf("_mode_config") + 13);
      if (!get("mode_config")[thismode]) {
        get("mode_config")[thismode] = {};
      }
      get("mode_config")[thismode][
        name.substr(0, name.indexOf("_mode_config"))
      ] = config2[name];
    } else {
      set(name, config2[name]);
    }
  }

  for (const name in getModule.config("translate")) {
    lib.translate[name] = getModule.config("translate")[name];
  }

  get("all").characters = [];
  get("all").cards = [];
  get("all").plays = [];
  get("all").mode = [];

  if (get("compatiblemode")) {
    lib.status.withError = true;
  }
  if (get("debug")) {
    await lib.init.promises.js(`${lib.assetURL}game`, "asset");
    if (window.noname_skin_list) {
      lib.skin = window.noname_skin_list;
      delete window.noname_skin_list;
      delete window.noname_asset_list;
    }
  }

  console.log("配置加载完成");
}

/**
 * 加载配置文件
 */
async function loadConfig() {
  Reflect.set(lib, "config", Reflect.get(window, "config"));
  Reflect.set(lib, "configOL", {});
  Reflect.deleteProperty(window, "config");

  let result;
  if (localStorage.getItem(`${lib.configprefix}nodb`)) {
    Reflect.set(window, "nodb", true);
  }
  if (window.indexedDB && !Reflect.get(window, "nodb")) {
    const event = await new Promise((resolve, reject) => {
      const idbOpenDBRequest = window.indexedDB.open(
        `${lib.configprefix}data`,
        4
      );
      idbOpenDBRequest.onerror = reject;
      idbOpenDBRequest.onsuccess = resolve;
      idbOpenDBRequest.onupgradeneeded = (idbVersionChangeEvent) => {
        // @ts-expect-error MaybeHave
        const idbDatabase = idbVersionChangeEvent.target.result;
        if (!idbDatabase.objectStoreNames.contains("video")) {
          idbDatabase.createObjectStore("video", {
            keyPath: "time",
          });
        }
        if (!idbDatabase.objectStoreNames.contains("image")) {
          idbDatabase.createObjectStore("image");
        }
        if (!idbDatabase.objectStoreNames.contains("audio")) {
          idbDatabase.createObjectStore("audio");
        }
        if (!idbDatabase.objectStoreNames.contains("config")) {
          idbDatabase.createObjectStore("config");
        }
        if (!idbDatabase.objectStoreNames.contains("data")) {
          idbDatabase.createObjectStore("data");
        }
      };
    });
    Reflect.set(lib, "db", event.target.result);

    const object = await game.getDB("config");

    if (!object.storageImported) {
      try {
        const item = localStorage.getItem(`${lib.configprefix}config`);
        if (!item) {
          throw "err";
        }
        result = JSON.parse(item);
        if (!result || typeof result != "object") {
          throw "err";
        }
      } catch (err) {
        result = {};
      }
      Object.keys(result).forEach((key) => game.saveConfig(key, result[key]));
      Object.keys(lib.mode).forEach((key) => {
        try {
          const item = localStorage.getItem(`${lib.configprefix}${key}`);
          if (!item) {
            throw "err";
          }
          result = JSON.parse(item);
          if (!result || typeof result != "object" || get.is.empty(result)) {
            throw "err";
          }
        } catch (err) {
          result = false;
        }
        localStorage.removeItem(`${lib.configprefix}${key}`);
        if (result) {
          game.putDB("data", key, result);
        }
      });
      game.saveConfig("storageImported", true);
      lib.init.background();
      localStorage.removeItem(`${lib.configprefix}config`);
    } else {
      result = object;
    }
  } else {
    try {
      const item = localStorage.getItem(lib.configprefix + "config");
      if (!item) {
        throw "err";
      }
      result = JSON.parse(item);
      if (!result || typeof result != "object") {
        throw "err";
      }
    } catch (err) {
      result = {};
      localStorage.setItem(lib.configprefix + "config", JSON.stringify({}));
    }
  }

  return result;
}
