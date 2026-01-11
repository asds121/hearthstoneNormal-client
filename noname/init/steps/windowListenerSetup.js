import { lib } from "../../../noname.js";
import { ui } from "../../ui/index.js";
import { get } from "../../get/index.js";
import { game } from "../../game/index.js";
import { _status } from "../../status/index.js";
import { gnc } from "../../gnc/index.js";
import { promiseErrorHandlerMap } from "../../util/browser.js";
import { ErrorManager } from "../../util/error.js";
import { ErrorReporter } from "../../util/error.js";

/**
 * 窗口监听器设置步骤
 * - 设置窗口监听器
 * - 设置错误处理
 */
export async function windowListenerSetup() {
  // 设置窗口监听器
  setWindowListener();

  // 设置错误处理
  await setOnError();

  console.log("窗口监听器设置完成");
}

/**
 * `window.onload`触发时执行的函数
 */
function setWindowListener() {
  window.onkeydown = function (e) {
    if (
      typeof ui.menuContainer == "undefined" ||
      !ui.menuContainer.classList.contains("hidden")
    ) {
      if (e.keyCode == 116 || ((e.ctrlKey || e.metaKey) && e.keyCode == 82)) {
        if (e.shiftKey) {
          if (confirm("是否重置游戏？")) {
            var noname_inited = localStorage.getItem("noname_inited");
            var onlineKey = localStorage.getItem(lib.configprefix + "key");
            localStorage.clear();
            if (noname_inited) {
              localStorage.setItem("noname_inited", noname_inited);
            }
            if (onlineKey) {
              localStorage.setItem(lib.configprefix + "key", onlineKey);
            }
            if (indexedDB) {
              indexedDB.deleteDatabase(lib.configprefix + "data");
            }
            game.reload();
            return;
          }
        } else {
          game.reload();
        }
      } else if (e.keyCode == 83 && (e.ctrlKey || e.metaKey)) {
        if (typeof window.saveNonameInput == "function") {
          window.saveNonameInput();
        }
        e.preventDefault();
        e.stopPropagation();
        return false;
      } else if (
        e.keyCode == 74 &&
        (e.ctrlKey || e.metaKey) &&
        typeof lib.node != "undefined"
      ) {
        lib.node.debug();
      }
    } else {
      game.closePopped();
      var dialogs = document.querySelectorAll(
        "#window>.dialog.popped:not(.static)"
      );
      for (var i = 0; i < dialogs.length; i++) {
        // @ts-expect-error ignore
        dialogs[i].delete();
      }
      if (e.keyCode == 32) {
        var node = ui.window.querySelector("pausedbg");
        if (node) {
          node.click();
        } else {
          ui.click.pause();
        }
      } else if (e.keyCode == 65) {
        if (typeof ui.auto != "undefined") {
          ui.auto.click();
        }
      } else if (e.keyCode == 87) {
        if (
          typeof ui.wuxie != "undefined" &&
          ui.wuxie.style.display != "none"
        ) {
          ui.wuxie.classList.toggle("glow");
        } else if (typeof ui.tempnowuxie != "undefined") {
          ui.tempnowuxie.classList.toggle("glow");
        }
      } else if (
        e.keyCode == 116 ||
        ((e.ctrlKey || e.metaKey) && e.keyCode == 82)
      ) {
        if (e.shiftKey) {
          if (confirm("是否重置游戏？")) {
            var noname_inited = localStorage.getItem("noname_inited");
            var onlineKey = localStorage.getItem(lib.configprefix + "key");
            localStorage.clear();
            if (noname_inited) {
              localStorage.setItem("noname_inited", noname_inited);
            }
            if (onlineKey) {
              localStorage.setItem(lib.configprefix + "key", onlineKey);
            }
            if (indexedDB) {
              indexedDB.deleteDatabase(lib.configprefix + "data");
            }
            game.reload();
            return;
          }
        } else {
          game.reload();
        }
      } else if (e.keyCode == 83 && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      } else if (
        e.keyCode == 74 &&
        (e.ctrlKey || e.metaKey) &&
        typeof lib.node != "undefined"
      ) {
        lib.node.debug();
      }
      // else if(e.keyCode==27){
      // 	if(!ui.arena.classList.contains('paused')) ui.click.config();
      // }
    }
  };
}

/**
 * 设置错误处理
 */
async function setOnError() {
  const [core] = get.coreInfo();

  const promiseErrorHandler = new (
    core in promiseErrorHandlerMap
      ? promiseErrorHandlerMap[core]
      : promiseErrorHandlerMap.other
  )();

  if (promiseErrorHandler.onLoad) {
    await promiseErrorHandler.onLoad();
  }

  window.onunhandledrejection = async (event) => {
    if (promiseErrorHandler.onHandle) {
      await promiseErrorHandler.onHandle(event);
    }
  };

  window.onerror = function (msg, src, line, column, err) {
    // 过滤404错误
    if (
      typeof msg === "string" &&
      (msg.includes("404") || msg.includes("Not Found"))
    ) {
      return true;
    }

    if (promiseErrorHandler.onErrorPrepare) {
      promiseErrorHandler.onErrorPrepare();
    }
    const winPath = window.__dirname
      ? "file:///" + (__dirname.replace(new RegExp("\\\\", "g"), "/") + "/")
      : "";
    let str = `错误文件: ${typeof src == "string" ? decodeURI(src).replace(lib.assetURL, "").replace(winPath, "") : "未知文件"}`;
    str += `\n错误信息: ${msg}`;
    const tip = lib.getErrorTip(msg);
    if (tip) {
      str += `\n错误提示: ${tip}`;
    }
    str += `\n行号: ${line}`;
    str += `\n列号: ${column}`;
    const version = typeof lib.version != "undefined" ? lib.version : "";
    const reg = /[^\d.]/;
    const match = version.match(reg) != null;
    str += "\n" + `${match ? "游戏" : "无名杀"}版本: ${version || "未知版本"}`;
    if (match) {
      str +=
        "\n⚠️您使用的游戏代码不是源于libnoname/noname无名杀官方仓库，请自行寻找您所使用的游戏版本开发者反馈！";
    }
    if (_status && _status.event) {
      let evt = _status.event;
      str += `\nevent.name: ${evt.name}\nevent.step: ${evt.step}`;
      // @ts-expect-error ignore
      if (evt.parent) {
        str += `\nevent.parent.name: ${evt.parent.name}\nevent.parent.step: ${evt.parent.step}`;
      }
      // @ts-expect-error ignore
      if (evt.parent && evt.parent.parent) {
        str += `\nevent.parent.parent.name: ${evt.parent.parent.name}\nevent.parent.parent.step: ${evt.parent.parent.step}`;
      }
      if (evt.player || evt.target || evt.source || evt.skill || evt.card) {
        str += "\n-------------";
      }
      if (evt.player) {
        if (lib.translate[evt.player.name]) {
          str += `\nplayer: ${lib.translate[evt.player.name]}[${evt.player.name}]`;
        } else {
          str += "\nplayer: " + evt.player.name;
        }
        let distance = get.distance(_status.roundStart, evt.player, "absolute");
        if (distance != Infinity) {
          str += `\n座位号: ${distance + 1}`;
        }
      }
      if (evt.target) {
        if (lib.translate[evt.target.name]) {
          str += `\ntarget: ${lib.translate[evt.target.name]}[${evt.target.name}]`;
        } else {
          str += "\ntarget: " + evt.target.name;
        }
      }
      if (evt.source) {
        if (lib.translate[evt.source.name]) {
          str += `\nsource: ${lib.translate[evt.source.name]}[${evt.source.name}]`;
        } else {
          str += "\nsource: " + evt.source.name;
        }
      }
      if (evt.skill) {
        if (lib.translate[evt.skill]) {
          str += `\nskill: ${lib.translate[evt.skill]}[${evt.skill}]`;
        } else {
          str += "\nskill: " + evt.skill;
        }
      }
      if (evt.card) {
        if (lib.translate[evt.card.name]) {
          str += `\ncard: ${lib.translate[evt.card.name]}[${evt.card.name}]`;
        } else {
          str += "\ncard: " + evt.card.name;
        }
      }
    }
    str += "\n-------------";
    const errorReporter = ErrorManager.getErrorReporter(err);
    if (errorReporter) {
      game.print(errorReporter.report(str + "\n代码出现错误"));
    } else {
      if (
        typeof line == "number" &&
        (typeof Reflect.get(game, "readFile") == "function" ||
          location.origin != "file://")
      ) {
        /**
         * @param { string[] } lines 代码分割行数
         * @param { number } lines 代码报错行数
         */
        const createShowCode = function (lines, line) {
          let showCode = "";
          if (lines.length >= 10) {
            if (line > 4) {
              for (let i = line - 5; i < line + 6 && i < lines.length; i++) {
                showCode += `${i + 1}| ${line == i + 1 ? "⚠️" : ""}${lines[i]}\n`;
              }
            } else {
              for (let i = 0; i < line + 6 && i < lines.length; i++) {
                showCode += `${i + 1}| ${line == i + 1 ? "⚠️" : ""}${lines[i]}\n`;
              }
            }
          } else {
            showCode = lines
              .map(
                (_line, i) => `${i + 1}| ${line == i + 1 ? "⚠️" : ""}${_line}\n`
              )
              .toString();
          }
          return showCode;
        };
        // 解析step content的错误
        if (
          err &&
          err.stack &&
          [
            "at GameEvent.eval (eval at packStep",
            "at StepParser.eval (eval at packStep",
          ].some((str) => {
            let stackSplit1 = err.stack.split("\n")[1];
            if (stackSplit1) {
              return stackSplit1.trim().startsWith(str);
            }
            return false;
          })
        ) {
          // @ts-expect-error ignore
          const codes = _status.event.content.originals[_status.event.step];
          if (typeof codes == "function") {
            const regex = /<anonymous>:(\d+):\d+/;
            const match = err.stack.split("\n")[1].match(regex);
            if (match) {
              const lines = codes.toString().split("\n");
              str += "\n" + createShowCode(lines, Number(match[1]));
              str += "\n-------------";
            }
          }
        }
        // 协议名须和html一致(网页端防跨域)，且文件是js
        else if (
          typeof src == "string" &&
          src.startsWith(location.protocol) &&
          src.endsWith(".js")
        ) {
          //获取代码
          const codes = lib.init.reqSync(
            "local:" +
              decodeURI(src).replace(lib.assetURL, "").replace(winPath, "")
          );
          if (codes) {
            const lines = codes.split("\n");
            str += "\n" + createShowCode(lines, line);
            str += "\n-------------";
          }
        }
      }
      if (err && err.stack) {
        str +=
          "\n" +
          decodeURI(err.stack)
            .replace(new RegExp(lib.assetURL, "g"), "")
            .replace(new RegExp(winPath, "g"), "");
      }
      // 创建错误对象并报告，确保发送到后端
      const error = new Error(msg);
      error.stack = err
        ? err.stack
        : `Error: ${msg}\n    at ${src}:${line}:${column}`;
      const reporter = new ErrorReporter(error);
      game.print(reporter.report(str + "\n代码出现错误"));
    }
    Reflect.set(window, "ea", Array.from(arguments));
    Reflect.set(window, "em", msg);
    Reflect.set(window, "el", line);
    Reflect.set(window, "ec", column);
    Reflect.set(window, "eo", err);
    if (promiseErrorHandler.onErrorFinish) {
      promiseErrorHandler.onErrorFinish();
    }
  };

  return promiseErrorHandler;
}
