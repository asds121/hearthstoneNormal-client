import { get, ui, ai, game, _status } from "../../../noname.js";
import { lib } from "../../../noname.js";

/**
 * 核心模块初始化步骤
 * - 注入get、ui、ai、game等核心模块到lib对象
 * - 初始化游戏事件
 */
export async function coreModuleInit() {
  // 注入核心模块
  Reflect.set(lib, "get", get);
  Reflect.set(lib, "ui", ui);
  Reflect.set(lib, "ai", ai);
  Reflect.set(lib, "game", game);
  
  // 初始化游戏事件
  _status.event = lib.element.GameEvent.initialGameEvent();
  
  console.log("核心模块初始化完成");
}