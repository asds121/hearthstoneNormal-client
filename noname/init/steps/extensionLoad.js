import { lib } from "../../../noname.js";
import { game } from "../../game/index.js";
import { _status } from "../../status/index.js";
import { importExtension } from "../import.js";
import AssetManager from "../../library/AssetManager.js";

/**
 * 扩展加载步骤
 * - 处理扩展列表
 * - 加载扩展
 * - 处理扩展加载错误
 * - 发布扩展加载完成事件
 */
export async function extensionLoad(extensionlist, promiseErrorHandler) {
  // 如果没有扩展列表，直接返回
  if (!extensionlist || !extensionlist.length) {
    console.log("没有需要加载的扩展");
    return;
  }

  _status.extensionLoading = [];
  _status.extensionLoaded = [];

  const bannedExtensions = Reflect.get(window, "bannedExtensions") || [];

  // 准备加载扩展
  const extensionsLoading = [];
  for (const name of extensionlist) {
    if (bannedExtensions.includes(name)) {
      continue;
    }
    extensionsLoading.push(importExtension(name));
  }

  // 处理扩展加载错误
  const extErrorList = [];
  for (const promise of extensionsLoading) {
    await promise.catch(async (error) => {
      extErrorList.push(error);
      if (!promiseErrorHandler || !promiseErrorHandler.onHandle) {
        return;
      }
      // @ts-expect-error ignore
      await promiseErrorHandler.onHandle({ promise });
    });
  }

  // 处理_status.extensionLoading中的扩展
  for (const promise of _status.extensionLoading) {
    await promise.catch(async (error) => {
      if (extErrorList.includes(error)) {
        return;
      }
      extErrorList.push(error);
      if (!promiseErrorHandler || !promiseErrorHandler.onHandle) {
        return;
      }
      // @ts-expect-error ignore
      await promiseErrorHandler.onHandle({ promise });
    });
  }

  // 处理更新后第一次启动且有扩展加载错误的情况
  const isFirstStartAfterUpdate =
    lib.version && lib.version != lib.config.version;

  if (isFirstStartAfterUpdate && extErrorList.length) {
    const stacktraces = extErrorList
      .map((e) => (e instanceof Error ? e.stack : String(e)))
      .join("\n\n");

    if (
      confirm(
        `扩展加载出错！是否重新载入游戏？\n本次更新可能导致了扩展出现了错误：\n\n${stacktraces}`
      )
    ) {
      game.reload();
      return;
    }
  }

  // 发布扩展加载完成事件
  _status.extensionLoaded
    .filter((name) => game.hasExtension(name))
    .forEach((name) => {
      lib.announce.publish("Noname.Init.Extension.onLoad", name);
      // @ts-expect-error ignore
      lib.announce.publish(`Noname.Init.Extension.${name}.onLoad`, void 0);

      // 加载扩展的 assets.json 配置
      AssetManager.load(name).catch((error) => {
        console.warn(
          `[AssetManager] Failed to load assets.json for extension "${name}":`,
          error
        );
      });
    });

  delete _status.extensionLoading;

  console.log("扩展加载完成");
}
