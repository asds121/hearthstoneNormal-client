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
import { nonameInitialized } from "../../../../util/index.js";
import security from "../../../../util/security.js";
import { Character } from "../../../../library/element/character.js";

export const extensionMenu = function (connectMenu) {
  if (connectMenu) {
    return;
  }
  /**
   * 由于联机模式会创建第二个菜单，所以需要缓存一下可变的变量
   */
  // const cacheMenuContainer = menuContainer;
  // const cachePopupContainer = popupContainer;
  // const cacheMenux = menux;
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

  var clickMode = function () {
    if (this.mode == "get") {
      this.update();
    }
    var active = this.parentNode.querySelector(".active");
    if (active === this) {
      return;
    }
    active.classList.remove("active");
    active.link.remove();
    active = this;
    this.classList.add("active");
    if (this.link) {
      rightPane.appendChild(this.link);
    } else {
      this._initLink();
      rightPane.appendChild(this.link);
    }
    updateNodes();
  };
  ui.click.extensionTab = function (name) {
    ui.click.menuTab("扩展");
    for (var i = 0; i < start.firstChild.childElementCount; i++) {
      if (start.firstChild.childNodes[i].innerHTML == name) {
        clickMode.call(start.firstChild.childNodes[i]);
        break;
      }
    }
  };
  var updateNodes = function () {
    for (var i = 0; i < start.firstChild.childNodes.length; i++) {
      var node = start.firstChild.childNodes[i];
      if (node.mode == "get") {
        continue;
      }
      if (node.mode == "create") {
        continue;
      }
      if (node.mode && node.mode.startsWith("extension_")) {
        if (lib.config[node.mode + "_enable"]) {
          node.classList.remove("off");
          if (node.link) {
            node.link.firstChild.classList.add("on");
          }
        } else {
          node.classList.add("off");
          if (node.link) {
            node.link.firstChild.classList.remove("on");
          }
        }
      } else {
        if (lib.config.plays.includes(node.mode)) {
          node.classList.remove("off");
          if (node.link) {
            node.link.firstChild.classList.add("on");
          }
        } else {
          node.classList.add("off");
          if (node.link) {
            node.link.firstChild.classList.remove("on");
          }
        }
      }
    }
  };
  var togglePack = function (bool) {
    var name = this._link.config._name;
    if (name.startsWith("extension_")) {
      if (bool) {
        game.saveConfig(name, true);
      } else {
        game.saveConfig(name, false);
      }
    } else {
      name = name.slice(0, name.indexOf("_enable_playpackconfig"));
      if (bool) {
        lib.config.plays.add(name);
      } else {
        lib.config.plays.remove(name);
      }
      game.saveConfig("plays", lib.config.plays);
    }
    if (this.onswitch) {
      this.onswitch(bool);
    }
    updateNodes();
  };

  var createModeConfig = function (mode, position) {
    var page = ui.create.div("");
    page.style.paddingBottom = "10px";
    var node;
    if (mode.startsWith("extension_")) {
      node = ui.create.div(
        ".menubutton.large",
        mode.slice(10),
        position,
        clickMode
      );
    } else {
      node = ui.create.div(
        ".menubutton.large",
        lib.translate[mode + "_play_config"],
        position,
        clickMode
      );
    }
    if (node.innerHTML.length >= 5) {
      node.classList.add("smallfont");
    }
    node.mode = mode;
    // node._initLink=function(){
    node.link = page;
    for (var i in lib.extensionMenu[mode]) {
      if (i == "game") {
        continue;
      }
      var cfg = get.copy(lib.extensionMenu[mode][i]);
      var j;
      if (mode.startsWith("extension_")) {
        j = mode + "_" + i;
      } else {
        j = mode + "_" + i + "_playpackconfig";
      }
      cfg._name = j;
      if (j in lib.config) {
        cfg.init = lib.config[j];
      } else {
        game.saveConfig(j, cfg.init);
      }

      if (i == "enable") {
        cfg.onclick = togglePack;
      } else if (!lib.extensionMenu[mode][i].onclick) {
        cfg.onclick = function (result) {
          var cfg = this._link.config;
          game.saveConfig(cfg._name, result);
        };
      }
      var cfgnode = createConfig(cfg);
      if (cfg.onswitch) {
        cfgnode.onswitch = cfg.onswitch;
      }
      page.appendChild(cfgnode);
    }
    // };
    // if(!get.config('menu_loadondemand')) node._initLink();
    return node;
  };
  let extensionsInMenu = Object.keys(lib.extensionMenu);
  if (lib.config.extensionSort && Array.isArray(lib.config.extensionSort)) {
    extensionsInMenu.sort((a, b) => {
      return (
        lib.config.extensionSort.indexOf(a) -
        lib.config.extensionSort.indexOf(b)
      );
    });
  }
  for (let i of extensionsInMenu) {
    if (
      lib.config.all.stockextension.includes(i) &&
      !lib.config.all.plays.includes(i)
    ) {
      continue;
    }
    if (lib.config.hiddenPlayPack.includes(i)) {
      continue;
    }
    createModeConfig(i, start.firstChild);
  }
  // 移除制作扩展功能
  var active = start.firstChild.querySelector(".active");
  if (!active) {
    active = start.firstChild.firstChild;
    active.classList.add("active");
  }
  if (!active.link) {
    active._initLink();
  }
  rightPane.appendChild(active.link);
  updateNodes();
};
