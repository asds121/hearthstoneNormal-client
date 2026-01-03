import {
  menuContainer,
  popupContainer,
  updateActive,
  setUpdateActive,
  updateActiveCard,
  setUpdateActiveCard,
  menux,
  menuUpdates,
  openMenu,
  clickToggle,
  clickSwitcher,
  clickContainer,
  clickMenuItem,
  createMenu,
  createConfig,
} from "../index.js";
import { ui, game, get, ai, lib, _status } from "../../../../../noname.js";

export const startMenu = function () {
  /**
   * 由于联机模式会创建第二个菜单，所以需要缓存一下可变的变量
   */
  const cacheMenuContainer = menuContainer;
  // 直接使用window.menuxpages，而不是导入的menuxpages，避免循环依赖问题
  const cacheMenuxpages = window.menuxpages || [];
  /** @type { HTMLDivElement } */
  // @ts-expect-error ignore
  var start = cacheMenuxpages.shift();
  if (!start) {
    console.error("Could not get start page from cacheMenuxpages");
    return;
  }
  // 添加更严格的检查，确保start.lastChild存在
  if (!start.lastChild) {
    console.error("Start page has no lastChild element");
    return;
  }
  var rightPane = start.lastChild;

  /** 启动按钮 */
  let startButton = ui.create.div(
    ".menubutton.round.highlight",
    "启",
    start,
    function () {
      if (this.animating || this.classList.contains("dim")) {
        return;
      }
      var active = this.parentNode.querySelector(".active");
      if (active) {
        game.saveConfig("mode", active.mode);
        localStorage.setItem(lib.configprefix + "directstart", true);
        game.reload();
      }
    }
  );

  var clickMode = function () {
    if (this.classList.contains("unselectable")) {
      return;
    }
    var active = this.parentNode.querySelector(".active");
    if (active === this) {
      return;
    }
    if (active) {
      active.classList.remove("active");
      active.link.remove();
    }
    active = this;
    this.classList.add("active");
    if (this.link) {
      rightPane.appendChild(this.link);
    } else {
      this._initLink();
      rightPane.appendChild(this.link);
    }
  };

  var createModeConfig = function (mode, position) {
    var info = lib.mode[mode];
    var page = ui.create.div("");
    var node = ui.create.div(
      ".menubutton.large",
      info.name,
      position,
      clickMode
    );
    node.mode = mode;
    if (mode == lib.config.mode) {
      node.classList.add("active");
    }
    node._initLink = function () {
      node.link = page;
      //“更多”下的内容
      var map = {};
      var infoconfig = info.config;
      if (infoconfig) {
        var hiddenNodes = [];
        var config = lib.config.mode_config[mode] || {};
        for (var j in infoconfig) {
          if (j === "update") {
            continue;
          }
          var cfg = get.copy(infoconfig[j]);
          cfg._name = j;
          cfg.mode = mode;
          if (j in config) {
            cfg.init = config[j];
          } else {
            game.saveConfig(j, cfg.init, mode);
          }
          if (!cfg.onclick) {
            cfg.onclick = function (result) {
              var cfg = this._link.config;
              game.saveConfig(cfg._name, result, mode);
              if (cfg.onsave) {
                cfg.onsave.call(this, result);
              }
              if (typeof cfg.restart == "function") {
                if (cfg.restart()) {
                  startButton.classList.add("glowing");
                }
              }
            };
          }
          if (info.config.update) {
            if (mode == "appearence" || mode == "view") {
              cfg.update = function () {
                if (updateAppearence) {
                  updateAppearence();
                }
                if (updateView) {
                  updateView();
                }
              };
            } else {
              cfg.update = function () {
                info.config.update(config, map);
              };
            }
          }
          var cfgnode = createConfig(cfg);
          if (j == "import_data_button") {
            ui.import_data_button = cfgnode;
            cfgnode.hide();
          }
          map[j] = cfgnode;
          if (!cfg.unfrequent) {
            page.appendChild(cfgnode);
          } else {
            hiddenNodes.push(cfgnode);
          }
        }
        var expanded = false;
        if (hiddenNodes.length) {
          page.classList.add("morenodes");
          for (var k = 0; k < hiddenNodes.length; k++) {
            page.appendChild(hiddenNodes[k]);
          }
        }
        if (info.config.update) {
          info.config.update(config, map);
        }
      }
    };
    if (!get.config("menu_loadondemand")) {
      node._initLink();
    }
    return node;
  };
  var modeorder = lib.config.modeorder || [];
  for (var i in lib.mode) {
    modeorder.add(i);
  }
  for (var i = 0; i < modeorder.length; i++) {
    if (lib.config.all.mode.includes(modeorder[i])) {
      createModeConfig(modeorder[i], start.firstChild);
    }
  }
  var active = start.firstChild.querySelector(".active");
  if (!active) {
    active = start.firstChild.firstChild;
    active.classList.add("active");
  }
  if (!active.link) {
    active._initLink();
  }
  rightPane.appendChild(active.link);
  if (lib.config.fold_mode) {
    rightPane.addEventListener(
      "mousewheel",
      function (e) {
        var morenodes = this.firstChild.morenodes;
        if (morenodes) {
          if (e.wheelDelta < 0) {
            morenodes._onclick.call(morenodes, "expand");
          } else if (this.scrollTop == 0) {
            morenodes._onclick.call(morenodes, "unexpand");
          }
        }
      },
      { passive: true }
    );
  }
}