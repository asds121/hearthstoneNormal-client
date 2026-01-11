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

export const optionsMenu = function () {
  /**
   * 由于联机模式会创建第二个菜单，所以需要缓存一下可变的变量
   */
  // const cacheMenuContainer = menuContainer;
  const cachePopupContainer = popupContainer;
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

  var clickAutoSkill = function (bool) {
    var name = this._link.config._name;
    var list = lib.config.autoskilllist;
    if (bool) {
      list.remove(name);
    } else {
      list.add(name);
    }
    game.saveConfig("autoskilllist", list);
  };
  var skilllistexpanded = game.expandSkills(lib.skilllist);
  for (var i in lib.skill) {
    if (!skilllistexpanded.includes(i)) {
      continue;
    }
    if (lib.skill[i].frequent && lib.translate[i]) {
      lib.configMenu.skill.config[i] = {
        name: lib.translate[i + "_noconf"] || lib.translate[i],
        init: true,
        type: "autoskill",
        onclick: clickAutoSkill,
        intro: lib.translate[i + "_info"],
      };
    }
  }
  var clickBanSkill = function (bool) {
    var name = this._link.config._name;
    var list = lib.config.forbidlist;
    if (bool) {
      list.remove(name);
    } else {
      list.add(name);
    }
    game.saveConfig("forbidlist", list);
  };
  var forbid = lib.config.forbid;
  if (!lib.config.forbidlist) {
    game.saveConfig("forbidlist", []);
  }
  for (var i = 0; i < forbid.length; i++) {
    var skip = false;
    var str = "";
    var str2 = "";
    var str3 = "";
    for (var j = 0; j < forbid[i].length; j++) {
      if (!lib.skilllist.includes(forbid[i][j])) {
        skip = true;
        break;
      }
    }
    if (skip) {
      continue;
    }
    for (var j = 0; j < forbid[i].length; j++) {
      str +=
        lib.translate[forbid[i][j] + "_noconf"] || lib.translate[forbid[i][j]];
      if (j != forbid[i].length - 1) {
        str += "/";
      }
    }
    for (var j = 0; j < forbid[i].length; j++) {
      str2 += lib.translate[forbid[i][j]];
      if (j != forbid[i].length - 1) {
        str2 += "/";
      }
    }
    str3 = lib.translate[forbid[i][0] + "_info"] || "";
    lib.configMenu.skill.config[forbid[i][0]] = {
      name: str,
      init: true,
      type: "banskill",
      onclick: clickBanSkill,
      intro: str3,
    };
  }

  for (var i in lib.configMenu) {
    // 跳过没有name属性的配置项，避免出现空白按钮
    if (!lib.configMenu[i] || !lib.configMenu[i].name) {
      continue;
    }
    // 跳过"技能"配置项，避免创建不需要的按钮
    if (i === "skill") {
      continue;
    }
    var nodexx = ui.create.div(
      ".menubutton.large",
      lib.configMenu[i].name,
      start.firstChild,
      clickMode
    );
    var page = ui.create.div("");
    nodexx.link = page;
    page.classList.add("menu-sym");
    var map = {};
    var config = {
      ...lib.config,
    };
    var info = lib.configMenu[i];
    var hiddenNodes = [];
    var autoskillNodes = [];
    var banskillNodes = [];

    for (var j in info.config) {
      if (j === "update") {
        continue;
      }
      var cfg = get.copy(info.config[j]);
      cfg._name = j;
      if (j in config) {
        cfg.init = config[j];
      } else {
        game.saveConfig(j, cfg.init);
      }
      if (!cfg.onclick) {
        cfg.onclick = function (result) {
          var cfg = this._link.config;
          game.saveConfig(cfg._name, result);
          if (cfg.onsave) {
            cfg.onsave.call(this, result);
          }
          if (typeof cfg.update === "function") {
            try {
              cfg.update(map);
            } catch (error) {
              console.error("调用update函数失败:", error);
            }
          }
        };
      }
      if (typeof info.config.update === "function") {
        // 保存当前的update函数引用，避免闭包问题
        const updateFunc = info.config.update;
        cfg.update = function () {
          try {
            // 检查map是否存在，并且包含需要的属性
            if (map && map.touchscreen && typeof map.touchscreen.hide === "function") {
              updateFunc(config, map);
            } else {
              console.warn("map或map.touchscreen未定义，跳过update函数调用");
            }
          } catch (error) {
            console.error("调用update函数失败:", error);
            console.error("错误原因:", error.message);
            console.error("info.config.update类型:", typeof info.config.update);
            console.error("updateFunc类型:", typeof updateFunc);
          }
        };
      }
      var cfgnode = createConfig(cfg);
      if (cfg.type == "autoskill") {
        autoskillNodes.push(cfgnode);
        cfgnode.classList.add("indent");
        cfgnode.style.display = "none";
      } else if (cfg.type == "banskill") {
        banskillNodes.push(cfgnode);
        cfgnode.classList.add("indent");
        cfgnode.style.display = "none";
      }
      if (j == "import_data_button") {
        ui.import_data_button = cfgnode;
        cfgnode.hide();
      }
      map[j] = cfgnode;
      if (!cfg.unfrequent) {
        if (cfg.type == "autoskill") {
          page.insertBefore(cfgnode, banskill);
        } else {
          page.appendChild(cfgnode);
        }
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
};
