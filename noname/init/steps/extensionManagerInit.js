/**
 * 扩展管理器初始化步骤
 * - 初始化扩展管理器
 */
export async function extensionManagerInit() {
  // 初始化扩展管理器
  const { extensionManager } = await import("../../extension/index.js");
  await extensionManager.init();
  
  console.log("扩展管理器初始化完成");
}