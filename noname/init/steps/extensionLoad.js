import { lib } from "../../../noname.js";
import { game } from "../../game/index.js";
import { _status } from "../../status/index.js";
import { importExtension } from "../import.js";
import AssetManager from "../../library/AssetManager.js";
import { get } from "../../util/config.js";

/**
 * 扩展加载步骤
 * - 处理扩展列表
 * - 加载扩展
 * - 处理扩展加载错误
 * - 发布扩展加载完成事件
 */
export async function extensionLoad(extensionlist, promiseErrorHandler) {
  // 从配置中获取所有扩展
  const allExtensions = get("extensions") || [];

  // 使用Set确保每个扩展只处理一次
  const extensionsToProcess = [...new Set(allExtensions)];

  // 如果没有扩展，直接返回
  if (!extensionsToProcess.length) {
    console.log("没有需要处理的扩展");
    return;
  }

  // 只加载扩展的 assets.json 配置，因为扩展本身已经在 extensionManager 中加载
  for (const name of extensionsToProcess) {
    try {
      // 加载扩展的 assets.json 配置
      await AssetManager.load(name);
      console.log(`[AssetManager] Loaded assets.json for extension "${name}"`);

      // 发布扩展加载完成事件
      lib.announce.publish("Noname.Init.Extension.onLoad", name);
      // @ts-expect-error ignore
      lib.announce.publish(`Noname.Init.Extension.${name}.onLoad`, void 0);
    } catch (error) {
      console.warn(
        `[AssetManager] Failed to load assets.json for extension "${name}":`,
        error
      );
    }
  }

  console.log("扩展assets配置加载完成");
}
