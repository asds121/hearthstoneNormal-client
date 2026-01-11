import { get as configGet } from "../../util/config.js";
import { get } from "../../get/index.js";
import { initializeSandboxRealms } from "../../util/initRealms.js";

/**
 * 沙盒初始化步骤
 * - 根据配置决定是否启用沙盒
 * - 初始化沙盒的Realms
 */
export async function sandboxInit() {
  // 决定是否启用沙盒
  const sandboxEnabled = !configGet("debug") && !get.is.safari();

  // 初始化沙盒的Realms
  await initializeSandboxRealms(sandboxEnabled);

  console.log("沙盒初始化完成");
}
