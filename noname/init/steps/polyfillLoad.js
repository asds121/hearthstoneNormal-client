/**
 * 加载polyfill步骤
 * - 加载polyfill内容
 */
export async function polyfillLoad() {
  // 加载polyfill内容
  await import("../polyfill.js");
  
  console.log("polyfill加载完成");
}