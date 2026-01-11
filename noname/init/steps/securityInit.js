import { lib } from "../../../noname.js";
import { game } from "../../game/index.js";
import { ui } from "../../ui/index.js";
import { get } from "../../get/index.js";
import { ai } from "../../ai/index.js";
import { _status } from "../../status/index.js";
import { gnc } from "../../gnc/index.js";

/**
 * 安全初始化步骤
 * - 初始化安全模块
 * - 传入核心模块对象
 */
export async function securityInit() {
  // 初始化security
  const securityModule = await import("../../util/security.js");
  const security = securityModule.default;
  await security.initSecurity({
    lib,
    game,
    ui,
    get,
    ai,
    _status,
    gnc,
  });
  
  console.log("安全初始化完成");
}