import { leaveCompatibleEnvironment } from "../../util/index.js";
import { lib } from "../../../noname.js";

/**
 * 环境准备步骤
 * - 离开兼容环境
 * - 设置configprefix
 */
export async function environmentSetup() {
  leaveCompatibleEnvironment();
  
  // 设置configprefix
  if (typeof __dirname === "string" && __dirname.length) {
    const dirsplit = __dirname.split("/");
    for (let i = 0; i < dirsplit.length; i++) {
      if (dirsplit[i]) {
        var c = dirsplit[i][0];
        lib.configprefix += /[A-Z]|[a-z]/.test(c) ? c : "_";
      }
    }
    lib.configprefix += "_";
  }
  
  console.log("环境准备完成");
}