import { lib } from "../../../noname.js";
import { gnc } from "../../gnc/index.js";
import { get } from "../../util/config.js";
import { _status } from "../../status/index.js";
import { importMode, importCardPack, importCharacterPack } from "../import.js";

/**
 * 游戏模式初始化步骤
 * - 处理lib.onprepare
 * - 加载游戏模式
 * - 加载卡牌包
 * - 加载角色包
 * - 加载replace.js
 * - 加载JavaScript扩展
 */
export async function gameModeInit(show_splash) {
  // 处理lib.onprepare
  const isArray = Array.isArray;
  if (isArray(lib.onprepare) && lib.onprepare.length) {
    _status.onprepare = Object.freeze(
      lib.onprepare.map((fn) => {
        if (typeof fn !== "function") {
          return;
        }
        return (gnc.is.generatorFunc(fn) ? gnc.of(fn) : fn)();
      })
    );
  }

  // 准备加载的内容
  const toLoad = [];

  // 加载游戏模式
  if (localStorage.getItem(`${lib.configprefix}playback`)) {
    toLoad.push(importMode(get("mode")));
  } else if (
    (localStorage.getItem(`${lib.configprefix}directstart`) || !show_splash) &&
    get("all").mode.includes(get("mode"))
  ) {
    toLoad.push(importMode(get("mode")));
  }

  // 加载卡牌包
  for (const cardPack of get("all").cards) {
    toLoad.push(importCardPack(cardPack));
  }

  // 加载角色包
  for (const characterPack of get("all").characters) {
    toLoad.push(importCharacterPack(characterPack));
  }

  // 导入 replace.js (ES6 模块)
  toLoad.push(
    (async () => {
      try {
        const replaceModule = await import(`../../../character/replace.js`);
        if (
          replaceModule.default &&
          typeof replaceModule.default === "object"
        ) {
          Object.assign(lib.characterReplace, replaceModule.default);
        }
      } catch (error) {
        console.error("加载 replace.js 失败:", error);
      }
    })()
  );

  // 加载JavaScript扩展
  if (_status.javaScriptExtensions) {
    const loadJavaScriptExtension = async (
      javaScriptExtension,
      pathArray,
      fileArray,
      onLoadArray,
      onErrorArray,
      index
    ) => {
      if (!pathArray && !fileArray && !onLoadArray && !onErrorArray) {
        try {
          await lib.init.promises.js(
            javaScriptExtension.path,
            javaScriptExtension.file
          );
          if (typeof javaScriptExtension.onload == "function") {
            javaScriptExtension.onload();
          }
        } catch {
          if (typeof javaScriptExtension.onerror == "function") {
            javaScriptExtension.onerror();
          }
        }
        return;
      }
      if (typeof index != "number") {
        index = 0;
      }
      if (pathArray && index >= javaScriptExtension.path.length) {
        return;
      }
      if (fileArray && index >= javaScriptExtension.file.length) {
        return;
      }
      if (onLoadArray && index >= javaScriptExtension.onload.length) {
        return;
      }
      if (onErrorArray && index >= javaScriptExtension.onerror.length) {
        return;
      }
      const path = pathArray
        ? javaScriptExtension.path[index]
        : javaScriptExtension.path;
      const file = fileArray
        ? javaScriptExtension.file[index]
        : javaScriptExtension.file;
      const onLoad = onLoadArray
        ? javaScriptExtension.onload[index]
        : javaScriptExtension.onload;
      const onError = onErrorArray
        ? javaScriptExtension.onerror[index]
        : javaScriptExtension.onerror;
      try {
        await lib.init.promises.js(path, file);
        if (typeof onLoad == "function") {
          onLoad();
        }
      } catch {
        if (typeof onError == "function") {
          onError();
        }
      }
      await loadJavaScriptExtension(
        javaScriptExtension,
        pathArray,
        fileArray,
        onLoadArray,
        onErrorArray,
        index + 1
      );
    };

    _status.javaScriptExtensions.forEach((javaScriptExtension) => {
      const pathArray = isArray(javaScriptExtension.path);
      const fileArray = isArray(javaScriptExtension.file);
      const onLoadArray = isArray(javaScriptExtension.onLoad);
      const onErrorArray = isArray(javaScriptExtension.onError);
      toLoad.push(
        loadJavaScriptExtension(
          javaScriptExtension,
          pathArray,
          fileArray,
          onLoadArray,
          onErrorArray
        )
      );
    });
  }

  // 执行加载
  await Promise.allSettled(toLoad);

  // 处理_status.importing
  if (_status.importing) {
    /**
     * @type {Promise[]}
     */
    let promises = lib.creation.array;
    for (const type in _status.importing) {
      // @ts-expect-error ignore
      promises.addArray(_status.importing[type]);
    }
    await Promise.allSettled(promises);
    delete _status.importing;
  }

  console.log("游戏模式初始化完成");
}
