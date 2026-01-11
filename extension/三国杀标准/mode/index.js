import { lib, game, ui, get, ai, _status } from "../../../noname.js";
import { modeModule as identity } from "./identity/index.js";
import single from "./single.js";
import doudizhu from "./doudizhu.js";

// 统一导出所有模式
export const type = "mode";

// 主模式模块
export const modeModule = {
  name: "sgs",
  // 使用ES模块导入
  identity: identity,
  single: single,
  doudizhu: doudizhu,
};
