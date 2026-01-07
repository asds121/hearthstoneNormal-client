import { ai } from "../../ai/index.js";
import { get } from "../../get/index.js";
import { game } from "../../game/index.js";
import { _status } from "../../status/index.js";
import { ui } from "../../ui/index.js";

import dedent from "../../../game/dedent.js";
const html = dedent;

//todo：变成循环依赖了喵
import { lib } from "../index.js";

export default {
  general: {
    name: "通用",
    config: {
      low_performance: {
        name: "流畅模式",
        init: false,
        intro: "减少部分游戏特效，提高游戏速度",
        onclick(bool) {
          game.saveConfig("low_performance", bool);
          if (bool) {
            ui.window.classList.add("low_performance");
          } else {
            ui.window.classList.remove("low_performance");
          }
        },
      },
      compatiblemode: {
        name: "兼容模式",
        init: false,
        intro:
          "开启兼容模式可防止扩展使游戏卡死并提高对旧扩展的兼容性，但对游戏速度有一定影响，若无不稳定或不兼容的扩展建议关闭",
        onclick(bool) {
          game.saveConfig("compatiblemode", bool);
          if (bool) {
            ui.window.classList.add("compatiblemode");
          } else {
            ui.window.classList.remove("compatiblemode");
          }
        },
      },
      confirm_exit: {
        name: "确认退出",
        init: false,
        unfrequent: true,
        intro: "离开游戏前弹出确认对话框",
      },
      keep_awake: {
        name: "屏幕常亮",
        init: false,
        unfrequent: true,
        intro:
          "防止屏幕自动关闭<br>注：旧版本通过NoSleep.js实现的屏幕常亮可能会影响外置音频的音量",
        onclick(bool) {
          game.saveConfig("keep_awake", bool);
          if (bool) {
            if (window.plugins && window.plugins.insomnia) {
              window.plugins.insomnia.keepAwake();
            } else if (window.noSleep) {
              document.addEventListener(
                lib.config.touchscreen ? "touchend" : "click",
                function enableNoSleepX() {
                  document.removeEventListener(
                    lib.config.touchscreen ? "touchend" : "click",
                    enableNoSleepX,
                    false
                  );
                  window.noSleep.enable();
                },
                false
              );
            }
          } else {
            if (window.plugins && window.plugins.insomnia) {
              window.plugins.insomnia.allowSleepAgain();
            } else if (window.noSleep) {
              window.noSleep.disable();
            }
          }
        },
      },
      auto_confirm: {
        name: "自动确认",
        init: true,
        unfrequent: true,
        intro: "当候选目标只有1个时，点击目标后无需再点击确认",
      },
      enable_drag: {
        name: "启用拖拽",
        init: true,
        intro: "按住卡牌后可将卡牌拖至目标",
        unfrequent: true,
      },
      enable_dragline: {
        name: "拖拽指示线",
        init: true,
        unfrequent: true,
        intro: "拖拽时显示虚线，可能降低游戏速度",
      },
      enable_touchdragline: {
        name: "拖拽指示线",
        init: false,
        unfrequent: true,
        intro: "拖拽时显示虚线，可能降低游戏速度",
      },
      touchscreen: {
        name: "触屏模式",
        init: false,
        restart: true,
        unfrequent: true,
        intro: "开启后可使触屏设备反应更快，但无法使用鼠标操作",
        onclick(bool) {
          if (get.is.nomenu("touchscreen", bool)) {
            return false;
          }
          game.saveConfig("touchscreen", bool);
        },
      },
      swipe: {
        name: "滑动手势",
        init: true,
        unfrequent: true,
        intro: "在非滚动区域向四个方向滑动可执行对应操作",
      },
      swipe_down: {
        name: "下划操作",
        init: "menu",
        unfrequent: true,
        intro: "向下滑动时执行的操作",
        item: {
          system: "显示按钮",
          menu: "打开菜单",
          pause: "切换暂停",
          auto: "切换托管",
          chat: "显示聊天",
          off: "关闭",
        },
        onclick(item) {
          if (get.is.nomenu("swipe_down", item)) {
            return false;
          }
          game.saveConfig("swipe_down", item);
        },
      },
      swipe_up: {
        name: "上划操作",
        intro: "向上滑动时执行的操作",
        init: "auto",
        unfrequent: true,
        item: {
          system: "显示按钮",
          menu: "打开菜单",
          pause: "切换暂停",
          auto: "切换托管",
          chat: "显示聊天",
          off: "关闭",
        },
        onclick(item) {
          if (get.is.nomenu("swipe_up", item)) {
            return false;
          }
          game.saveConfig("swipe_up", item);
        },
      },
      swipe_left: {
        name: "左划操作",
        intro: "向左滑动时执行的操作",
        init: "system",
        unfrequent: true,
        item: {
          system: "显示按钮",
          menu: "打开菜单",
          pause: "切换暂停",
          auto: "切换托管",
          chat: "显示聊天",
          off: "关闭",
        },
        onclick(item) {
          if (get.is.nomenu("swipe_left", item)) {
            return false;
          }
          game.saveConfig("swipe_left", item);
        },
      },
      swipe_right: {
        name: "右划操作",
        intro: "向右滑动时执行的操作",
        init: "system",
        unfrequent: true,
        item: {
          system: "显示按钮",
          menu: "打开菜单",
          pause: "切换暂停",
          auto: "切换托管",
          chat: "显示聊天",
          off: "关闭",
        },
        onclick(item) {
          if (get.is.nomenu("swipe_right", item)) {
            return false;
          }
          game.saveConfig("swipe_right", item);
        },
      },
      round_menu_func: {
        name: "触屏按钮操作",
        intro: "点击屏幕中圆形按钮时执行的操作",
        init: "system",
        unfrequent: true,
        item: {
          system: "显示按钮",
          menu: "打开菜单",
          pause: "切换暂停",
          auto: "切换托管",
        },
        onclick(item) {
          if (get.is.nomenu("round_menu_func", item)) {
            return false;
          }
          game.saveConfig("round_menu_func", item);
        },
      },
      show_splash: {
        name: "显示开始界面",
        intro: "游戏开始前进入模式选择画面",
        init: "off",
        item: {
          off: "关闭",
          init: "首次启动",
          always: "保持开启",
        },
      },
      game_speed: {
        name: "游戏速度",
        init: "mid",
        item: {
          vslow: "慢",
          slow: "较慢",
          mid: "中",
          fast: "较快",
          vfast: "快",
          vvfast: "很快",
        },
        intro: "设置不同游戏操作间的时间间隔",
      },
      sync_speed: {
        name: "限制结算速度",
        intro:
          "在动画结算完成前不执行下一步操作，开启后游戏操作的间隔更长但画面更流畅，在游戏较卡时建议开启",
        init: true,
      },
      enable_vibrate: {
        name: "开启震动",
        intro: "回合开始时使手机震动",
        init: false,
      },
      right_click: {
        name: "右键操作",
        init: "pause",
        intro: "在空白区域点击右键时的操作",
        unfrequent: true,
        item: {
          pause: "暂停",
          shortcut: "工具",
          config: "选项",
          auto: "托管",
        },
        onclick(item) {
          if (get.is.nomenu("right_click", item)) {
            return false;
          }
          game.saveConfig("right_click", item);
        },
      },
      longpress_info: {
        name: "长按显示信息",
        init: true,
        unfrequent: true,
        restart: true,
        intro: "长按后弹出菜单",
      },
      right_info: {
        name: "右键显示信息",
        init: true,
        unfrequent: true,
        restart: true,
        intro: "右键点击后弹出菜单",
      },
      hover_all: {
        name: "悬停显示信息",
        init: true,
        unfrequent: true,
        restart: true,
        intro: "悬停后弹出菜单",
      },
      hover_handcard: {
        name: "悬停手牌显示信息",
        init: true,
        unfrequent: true,
        intro: "悬停手牌后弹出菜单",
      },
      hoveration: {
        name: "悬停菜单弹出时间",
        unfrequent: true,
        intro: "鼠标移至目标到弹出菜单的时间间隔",
        init: "1000",
        item: {
          500: "0.5秒",
          700: "0.7秒",
          1000: "1秒",
          1500: "1.5秒",
          2500: "2.5秒",
        },
      },

      video: {
        name: "保存录像",
        init: "20",
        intro:
          "游戏结束后保存录像在最大条数，超过后将从最早的录像开始删除（已收藏的录像不计入条数）",
        item: {
          0: "关闭",
          5: "五局",
          10: "十局",
          20: "二十局",
          50: "五十局",
          10000: "无限",
        },
        unfrequent: true,
      },
      video_default_play_speed: {
        name: "默认录像播放速度",
        init: "1x",
        intro: "设置播放游戏录像时默认的播放速度",
        item: {
          "0.25x": "0.25倍速",
          "0.5x": "0.5倍速",
          "1x": "原速",
          "1.5x": "1.5倍速",
          "2x": "2倍速",
          "4x": "4倍速",
        },
        unfrequent: true,
      },
      max_loadtime: {
        name: "最长载入时间",
        intro:
          "设置游戏从启动到完成载入所需的最长时间，超过此时间未完成载入会报错，若设备较慢或安装了较多扩展可适当延长此时间",
        init: "5000",
        unfrequent: true,
        item: {
          5000: "5秒",
          10000: "10秒",
          20000: "20秒",
          60000: "60秒",
        },
        onclick(item) {
          game.saveConfig("max_loadtime", item);
          if (item === "5000") {
            localStorage.removeItem(lib.configprefix + "loadtime");
          } else {
            localStorage.setItem(lib.configprefix + "loadtime", item);
          }
        },
      },
      mousewheel: {
        name: "滚轮控制手牌",
        init: true,
        unfrequent: true,
        intro: "开启后滚轮可使手牌横向滚动，在mac等可横向滚动的设备上建议关闭",
        onclick(bool) {
          game.saveConfig("mousewheel", bool);
          if (lib.config.touchscreen) {
            return;
          }
          if (lib.config.mousewheel) {
            ui.handcards1Container.onmousewheel = ui.click.mousewheel;
            ui.handcards2Container.onmousewheel = ui.click.mousewheel;
          } else {
            ui.handcards1Container.onmousewheel = null;
            ui.handcards2Container.onmousewheel = null;
          }
        },
      },

      lucky_star: {
        name: "幸运星模式",
        intro:
          "在涉及随机数等的技能中，必定得到效果最好的结果。（联机模式无效）",
        init: false,
        unfrequent: true,
      },
      dev: {
        name: "开发者模式",
        intro: "开启后可使用浏览器控制台控制游戏",
        init: false,
        onclick(bool) {
          game.saveConfig("dev", bool);
          if (_status.connectMode) {
            return;
          }
          if (bool) {
            window.noname_shijianInterfaces?.showDebugButton?.();
            lib.cheat.i();
          } else {
            window.noname_shijianInterfaces?.hideDebugButton?.();
            delete window.cheat;
            delete window.game;
            delete window.ui;
            delete window.get;
            delete window.nonameAI;
            delete window.lib;
            delete window._status;
          }
        },
        unfrequent: true,
      },
      extension_auto_import: {
        name: "自动导入扩展",
        intro: dedent`
						开启后无名杀会自动导入扩展目录下的扩展（以此法导入的扩展默认关闭）
						<br />
						※ 如果你的运行环境不支持文件操作，则该选项无效
						<br />
						※ 鉴于不同平台下文件操作的性能区别，开启后可能会降低加载速度
					`,
        init: false,
        async onclick(bool) {
          await game.promises.saveConfig("extension_auto_import", bool);
        },
        unfrequent: true,
      },
      experimental_enable: {
        name: "启用实验性功能",
        init: false,
        intro: html`
          开启后将启用部分仍处于实验性质的功能，将改变无名杀现有的部分逻辑（重启后生效）
          <br />
          ※ 实验性功能无法保证API稳定，如需使用请及时跟进本体进展
          <br />
          ※ 以API为主的功能不提供具体实现，如需使用请自行实现
          <br />
          ※ 部分功能将会作用于联机模式
        `,
        /**
         * @param {boolean} bool
         */
        async onclick(bool) {
          await game.promises.saveConfig("experimental_enable", bool);
        },
        unfrequent: true,
      },
      extension_alert: {
        name: "无视扩展报错",
        init: false,
        unfrequent: true,
      },
      fuck_sojson: {
        name: "检测加密扩展",
        init: false,
        unfrequent: true,
      },

      update: function (config, map) {
        if ("ontouchstart" in document) {
          map.touchscreen.show();
        } else {
          map.touchscreen.hide();
        }

        if (lib.device) {
          map.enable_vibrate.show();
          map.keep_awake.show();
        } else {
          map.enable_vibrate.hide();
          map.keep_awake.hide();
        }
        // if(config.enable_pressure){
        // 	map.pressure_click.show();
        // 	if(lib.device){
        // 		map.pressure_taptic.show();
        // 	}
        // 	else{
        // 		map.pressure_taptic.hide();
        // 	}
        // }
        // else{
        // 	map.pressure_click.hide();
        // 	map.pressure_taptic.hide();
        // }
        if (lib.config.touchscreen) {
          map.mousewheel.hide();
          map.hover_all.hide();
          map.hover_handcard.hide();
          map.hoveration.hide();
          map.right_info.hide();
          map.right_click.hide();
          map.longpress_info.show();
          map.swipe.show();
          if (lib.config.swipe) {
            map.swipe_up.show();
            map.swipe_down.show();
            map.swipe_left.show();
            map.swipe_right.show();
          } else {
            map.swipe_up.hide();
            map.swipe_down.hide();
            map.swipe_left.hide();
            map.swipe_right.hide();
          }
        } else {
          map.mousewheel.show();
          map.hover_all.show();
          map.right_info.show();
          map.right_click.show();
          map.longpress_info.hide();
          if (!config.hover_all) {
            map.hover_handcard.hide();
            map.hoveration.hide();
          } else {
            map.hover_handcard.show();
            map.hoveration.show();
          }
          map.swipe.hide();
          map.swipe_up.hide();
          map.swipe_down.hide();
          map.swipe_left.hide();
          map.swipe_right.hide();
        }
        if (lib.config.enable_drag) {
          if (lib.config.touchscreen) {
            map.enable_dragline.hide();
            map.enable_touchdragline.show();
          } else {
            map.enable_dragline.show();
            map.enable_touchdragline.hide();
          }
        } else {
          map.enable_dragline.hide();
          map.enable_touchdragline.hide();
        }
        if (!get.is.phoneLayout()) {
          map.round_menu_func.hide();
        } else {
          map.round_menu_func.show();
        }
        if (!lib.node && lib.device != "ios") {
          map.confirm_exit.show();
        } else {
          map.confirm_exit.hide();
        }
      },
    },
  },
  appearence: {
    name: "外观",
    config: {
      theme: {
        name: "主题",
        init: "woodden",
        item: {},
        visualMenu: function (node, link) {
          if (!node.menu) {
            node.className = "button character themebutton " + link;
            node.menu = ui.create.div(
              node,
              "",
              "<div></div><div></div><div></div><div></div>"
            );
          }
        },
        onclick: async (theme) => {
          game.saveConfig("theme", theme);
          ui.arena.hide();
          lib.init.background();
          if (lib.config.autostyle) {
            if (theme === "simple") {
              lib.configMenu.appearence.config.player_border.onclick("slim");
            } else {
              lib.configMenu.appearence.config.player_border.onclick("normal");
            }
          }
          lib.announce.publish("Noname.Apperaence.Theme.onChanging", theme);
          await new Promise((resolve) => setTimeout(resolve, 500));

          const deletingTheme = ui.css.theme;
          ui.css.theme = lib.init.css(
            lib.assetURL + "theme/" + lib.config.theme,
            "style"
          );
          deletingTheme.remove();
          lib.announce.publish("Noname.Apperaence.Theme.onChanged", theme);
          await new Promise((resolve) => setTimeout(resolve, 100));

          ui.arena.show();
          lib.announce.publish(
            "Noname.Apperaence.Theme.onChangeFinished",
            theme
          );
        },
      },
      layout: {
        name: "布局",
        init: "mobile",
        item: {
          //default:'旧版',
          newlayout: "对称",
          mobile: "默认",
          long: "宽屏",
          long2: "手杀",
          nova: "新版",
        },
        visualMenu: function (node, link) {
          node.className = "button character themebutton " + lib.config.theme;
          if (!node.created) {
            node.created = true;
            node.style.overflow = "hidden";
            node.firstChild.style.display = "none";
            // node.firstChild.classList.add('shadowed');
            // node.firstChild.style.width='16px';
            // node.firstChild.style.height='auto';
            // node.firstChild.style.padding='2px';
            // node.firstChild.style.textAlign='center';
            var me = ui.create.div(node);
            me.style.top = "auto";
            if (link == "default" || link == "newlayout") {
              me.style.width = "calc(100% - 6px)";
              me.style.left = "3px";
              me.style.bottom = "3px";
              me.style.height = "25px";
              if (link == "newlayout") {
                me.style.height = "23px";
                me.style.bottom = "4px";
              }
            } else if (link == "long2" || link == "nova") {
              me.style.display = "none";
            } else {
              me.style.width = "120%";
              me.style.left = "-10%";
              me.style.bottom = "0";
              me.style.height = "22px";
            }
            me.style.borderRadius = "2px";
            var list = ["re_caocao", "re_liubei", "sp_zhangjiao", "sunquan"];
            for (var i = 0; i < 4; i++) {
              var player = ui.create.div(".fakeplayer", node);
              ui.create
                .div(".avatar", player)
                .setBackground(list.randomRemove(), "character");
              player.style.borderRadius = "2px";
              if (i != 3) {
                player.style.top = "auto";
              }
              if (link == "default") {
                player.style.height = "19px";
                player.style.width = "38px";
                player.classList.add("oldlayout");
              } else if (link == "mobile" || link == "newlayout") {
                player.style.width = "24px";
                player.style.height = "29px";
              } else if (link == "nova") {
                player.style.width = "20px";
                player.style.height = "24px";
              } else {
                player.style.width = "20px";
                player.style.height = "34px";
              }
              if (i == 1) {
                player.style.left = "3px";
              }
              if (i == 2) {
                player.style.left = "auto";
                player.style.right = "3px";
              }
              if (i == 3) {
                player.style.top = "3px";
              }
              if (link == "default") {
                if (i == 0) {
                  player.style.bottom = "6px";
                }
                if (i == 0 || i == 3) {
                  player.style.left = "calc(50% - 18px)";
                }
                if (i == 1 || i == 2) {
                  player.style.bottom = "36px";
                }
              } else if (link == "newlayout") {
                if (i == 0) {
                  player.style.bottom = "1px";
                }
                if (i == 0 || i == 3) {
                  player.style.left = "calc(50% - 12px)";
                }
                if (i == 1 || i == 2) {
                  player.style.bottom = "32px";
                }
              } else if (link == "mobile") {
                if (i == 0 || i == 3) {
                  player.style.left = "calc(50% - 12px)";
                }
                if (i == 1 || i == 2) {
                  player.style.bottom = "30px";
                }
              } else if (link == "long") {
                if (i == 0 || i == 3) {
                  player.style.left = "calc(50% - 10px)";
                }
                if (i == 1 || i == 2) {
                  player.style.bottom = "45px";
                }
              } else if (link == "long2") {
                if (i == 0) {
                  player.style.bottom = "2px";
                  player.style.left = "3px";
                }
                if (i == 3) {
                  player.style.left = "calc(50% - 10px)";
                }
                if (i == 1 || i == 2) {
                  player.style.bottom = "45px";
                }
              } else if (link == "nova") {
                if (i == 0) {
                  player.style.bottom = "2px";
                  player.style.left = "3px";
                }
                if (i == 3) {
                  player.style.left = "calc(50% - 10px)";
                }
                if (i == 1 || i == 2) {
                  player.style.left = "3px";
                  player.style.bottom = i * 30 + "px";
                }
              }

              if (i == 0 && (link == "mobile" || link == "long")) {
                player.classList.add("me");
                player.style.borderRadius = "0px";
                player.style.width = "25px";
                player.style.height = "25px";
                player.style.bottom = "-3px";
                player.style.left = "-3px";
              }
            }
          }
        },
        onclick(layout) {
          if (lib.layoutfixed.includes(lib.config.mode)) {
            game.saveConfig("layout", layout);
          } else {
            lib.init.layout(layout);
          }
        },
      },
      splash_style: {
        name: "启动页",
        init: "style1",
        item: {
          style1: "样式一",
          style2: "样式二",
        },
        visualMenu: async (node, link) => {
          let splash = lib.onloadSplashes.find((item) => item.id == link);
          if (splash) {
            await splash.preview(node);
          }
        },
      },
      // fewplayer:{
      //     name:'启用人数',
      // 	intro:'设置启用新版布局的最小人数（不足时切换至默认布局）',
      //     init:'3',
      //     // unfrequent:true,
      //     item:{
      //      			'2':'两人',
      //      			'3':'三人',
      //      			'4':'四人',
      //      			'5':'五人',
      //      			'6':'六人',
      //      			'7':'七人',
      //      			'8':'八人',
      //     },
      //     onclick(item){
      //      			game.saveConfig('fewplayer',item);
      //      			if(ui.arena) ui.arena.setNumber(ui.arena.dataset.number);
      //     }
      // },
      player_height: {
        name: "角色高度",
        init: "default",
        // unfrequent:true,
        item: {
          short: "矮",
          default: "中",
          long: "高",
        },
        onclick(item) {
          game.saveConfig("player_height", item);
          ui.arena.dataset.player_height = item;
        },
      },
      player_height_nova: {
        name: "角色高度",
        init: "short",
        item: {
          // auto:'自动',
          short: "矮",
          default: "中",
          long: "高",
        },
        onclick(item) {
          game.saveConfig("player_height_nova", item);
          // if(item=='auto'){
          // 	if(parseInt(ui.arena.dataset.number)>=7){
          // 		ui.arena.dataset.player_height_nova='short';
          // 	}
          // 	else{
          // 		ui.arena.dataset.player_height_nova='default';
          // 	}
          // }
          // else{
          ui.arena.dataset.player_height_nova = item;
          // }
        },
      },
      // background_color_music:{
      // 	name:'背景色',
      // 	init:'black',
      // 	item:{
      // 		blue:'蓝色',
      // 		black:'黑色',
      // 	},
      // 	onclick(color){
      // 		game.saveConfig('background_color_music',color);
      // 		document.body.dataset.background_color_music=color;
      // 	}
      // },
      // background_color_wood:{
      // 	name:'背景色',
      // 	init:'blue',
      // 	item:{
      // 		blue:'蓝色',
      // 		black:'黑色',
      // 	},
      // 	onclick(color){
      // 		game.saveConfig('background_color_wood',color);
      // 		document.body.dataset.background_color_wood=color;
      // 	}
      // },
      // theme_color_music:{
      // 	name:'主题色',
      // 	init:'black',
      // 	item:{
      // 		blue:'蓝色',
      // 		black:'黑色',
      // 	},
      // 	onclick(color){
      // 		game.saveConfig('theme_color_music',color);
      // 		document.body.dataset.theme_color_music=color;
      // 	}
      // },
      ui_zoom: {
        name: "界面缩放",
        intro:
          "填入50~300以内的整数作为界面缩放比例（系统会转换为对应缩放百分比）",
        init: "100%",
        input: true,
        restart: true,
        onblur(e) {
          const text = e.target;
          let zoom = Number.parseInt(text.innerText);
          const originalValue = lib.config.ui_zoom;

          if (isNaN(zoom)) {
            alert("请填写数值！");
          }
          if (zoom < 50 || zoom > 300) {
            alert("请填入50~300以内的整数！");
            text.innerText = originalValue;
            return;
          }

          const zoomText = `${zoom}%`;

          const confirmed = confirm(
            `确定要将界面缩放比例修改为 ${zoomText} 吗？`
          );
          if (!confirmed) {
            text.innerText = originalValue;
            return;
          }

          text.innerText = zoomText;
          game.saveConfig("ui_zoom", zoomText);
          game.documentZoom = (game.deviceZoom * zoom) / 100;

          ui.updatez();
          if (Array.isArray(lib.onresize)) {
            lib.onresize.forEach((fun) => {
              if (typeof fun === "function") {
                fun();
              }
            });
          }
        },
      },
      image_background: {
        name: "游戏背景",
        init: "default",
        item: {},
        visualBar: function (node, item, create) {
          if (node.created) {
            node.lastChild.classList.remove("active");
            return;
          }
          node.created = true;
          ui.create.filediv(".menubutton", "添加背景", node, function (file) {
            if (file) {
              var name = file.name;
              if (name.includes(".")) {
                name = name.slice(0, name.indexOf("."));
              }
              var link = (game.writeFile ? "cdv_" : "custom_") + name;
              if (item[link]) {
                for (var i = 1; i < 1000; i++) {
                  if (!item[link + "_" + i]) {
                    link = link + "_" + i;
                    break;
                  }
                }
              }
              item[link] = name;
              var callback = function () {
                create(link, node.parentNode.defaultNode);
                node.parentNode.updateBr();
                lib.config.customBackgroundPack.add(link);
                game.saveConfig(
                  "customBackgroundPack",
                  lib.config.customBackgroundPack
                );
              };
              if (game.writeFile) {
                game.writeFile(
                  file,
                  "image/background",
                  link + ".jpg",
                  callback
                );
              } else {
                game.putDB("image", link, file, callback);
              }
              if (node.lastChild.classList.contains("active")) {
                editbg.call(node.lastChild);
              }
            }
          });
        },
      },
      buttoncharacter_style: {
        name: "选将样式",
        init: "default",
        item: {
          default: "默认",
          simple: "精简",
          old: "旧版",
        },
        unfrequent: true,
      },
      buttoncharacter_prefix: {
        name: "武将前缀",
        init: "default",
        item: {
          default: "默认",
          simple: "不显示颜色",
          off: "不显示前缀",
        },
        unfrequent: true,
      },
      cursor_style: {
        name: "鼠标指针",
        init: "auto",
        intro: "设置为固定后鼠标指针将不随移动到的区域而变化",
        unfrequent: true,
        item: {
          auto: "自动",
          pointer: "固定",
        },
        onclick(item) {
          game.saveConfig("cursor_style", item);
          if (item == "pointer") {
            ui.window.classList.add("nopointer");
          } else {
            ui.window.classList.remove("nopointer");
          }
        },
      },
      name_font: {
        name: "人名字体",
        init: "xingkai",
        unfrequent: true,
        item: {},
        textMenu: function (node, link) {
          if (link != "default") {
            node.style.fontFamily = link;
          }
          node.style.fontSize = "20px";
        },
        onclick(font) {
          game.saveConfig("name_font", font);
          lib.init.cssstyles();
        },
      },

      cardtext_font: {
        name: "卡牌字体",
        init: "default",
        unfrequent: true,
        item: {},
        textMenu: function (node, link) {
          if (link != "default") {
            node.style.fontFamily = link;
          }
          node.style.fontSize = "20px";
        },
        onclick(font) {
          game.saveConfig("cardtext_font", font);
          lib.init.cssstyles();
        },
      },
      global_font: {
        name: "界面字体",
        init: "default",
        unfrequent: true,
        item: {},
        textMenu: function (node, link) {
          if (link != "default") {
            node.style.fontFamily = link;
          } else {
            node.style.fontFamily =
              "'STHeiti','SimHei','Microsoft JhengHei','Microsoft YaHei','WenQuanYi Micro Hei','Suits',Helvetica,Arial,sans-serif";
          }
          node.style.fontSize = "20px";
        },
        onclick(font) {
          game.saveConfig("global_font", font);
          lib.init.cssstyles();
        },
      },
      suits_font: {
        name: "替换花色字体",
        init: true,
        unfrequent: true,
        intro: "使用全角字符的花色替代系统自带的花色（重启游戏后生效）",
        onclick(bool) {
          game.saveConfig("suits_font", bool);
        },
      },
      update: function (config, map) {
        // 安全调用show/hide方法的辅助函数
        const safeShow = (elem) =>
          elem && typeof elem.show === "function" && elem.show();
        const safeHide = (elem) =>
          elem && typeof elem.hide === "function" && elem.hide();

        if (lib.config.custom_button) {
          safeShow(map.custom_button_system_top);
          safeShow(map.custom_button_system_bottom);
          safeShow(map.custom_button_control_top);
          safeShow(map.custom_button_control_bottom);
        } else {
          safeHide(map.custom_button_system_top);
          safeHide(map.custom_button_system_bottom);
          safeHide(map.custom_button_control_top);
          safeHide(map.custom_button_control_bottom);
        }
        if (lib.config.change_skin) {
          safeShow(map.change_skin_auto);
        } else {
          safeHide(map.change_skin_auto);
        }
        if (lib.config.image_background_random) {
          safeShow(map.image_background_blur);
          safeHide(map.image_background);
          // safeHide(map.import_background);
        } else {
          safeShow(map.image_background);
          if (lib.config.image_background == "default") {
            safeHide(map.image_background_blur);
          } else {
            safeShow(map.image_background_blur);
          }
          // if(lib.config.image_background=='custom'&&lib.db){
          // 	map.import_background.show();
          // }
          // else{
          // 	map.import_background.hide();
          // }
        }
        if (lib.config.layout == "long" || lib.config.layout == "mobile") {
          //safeShow(map.textequip);
          safeShow(map.cardshape);
          safeShow(map.phonelayout);
        } else {
          //safeHide(map.textequip);
          if (lib.config.layout == "long2" || lib.config.layout == "nova") {
            safeShow(map.phonelayout);
            safeShow(map.cardshape);
          } else {
            safeHide(map.phonelayout);
            safeHide(map.cardshape);
          }
        }
        if (lib.config.layout == "long") {
          // safeShow(map.fewplayer);
          safeShow(map.player_height);
        } else {
          // safeHide(map.fewplayer);
          if (lib.config.layout == "long2") {
            safeShow(map.player_height);
          } else {
            safeHide(map.player_height);
          }
        }
        if (lib.config.layout == "nova") {
          safeShow(map.player_height_nova);
        } else {
          safeHide(map.player_height_nova);
        }
        if (lib.config.touchscreen) {
          safeHide(map.cursor_style);
        } else {
          safeShow(map.cursor_style);
        }
        if (lib.config.border_style == "auto") {
          safeShow(map.autoborder_count);
          safeShow(map.autoborder_start);
        } else {
          safeHide(map.autoborder_count);
          safeHide(map.autoborder_start);
        }
      },
    },
  },
  view: {
    name: "显示",
    config: {
      update: function (config, map) {
        // 安全调用show/hide方法的辅助函数
        const safeShow = (elem) =>
          elem && typeof elem.show === "function" && elem.show();
        const safeHide = (elem) =>
          elem && typeof elem.hide === "function" && elem.hide();

        if (
          lib.config.mode == "versus" ||
          lib.config.mode == "chess" ||
          lib.config.mode == "tafang" ||
          lib.config.mode == "boss"
        ) {
          safeShow(map.show_handcardbutton);
        } else {
          safeHide(map.show_handcardbutton);
        }
        if (lib.config.touchscreen) {
          safeHide(map.pop_logv);
        } else {
          safeShow(map.pop_logv);
        }
        if (lib.device) {
          if (lib.device == "android") {
            safeShow(map.show_statusbar_android);
            safeHide(map.show_statusbar_ios);
          } else if (lib.device == "ios") {
            safeShow(map.show_statusbar_ios);
            safeHide(map.show_statusbar_android);
          }
          if (!game.download) {
            setTimeout(function () {
              if (!window.StatusBar) {
                safeHide(map.show_statusbar);
              }
            }, 5000);
          }
        } else {
          safeHide(map.show_statusbar_ios);
          safeHide(map.show_statusbar_android);
        }
        if (get.is.phoneLayout()) {
          safeShow(map.remember_round_button);
          safeShow(map.popequip);
          safeShow(map.filternode_button);
          safeHide(map.show_pause);
          safeHide(map.show_auto);
          safeHide(map.show_replay);
          safeShow(map.show_round_menu);
        } else {
          safeShow(map.show_pause);
          safeShow(map.show_auto);
          safeShow(map.show_replay);
          safeHide(map.show_round_menu);
          safeHide(map.remember_round_button);
          safeHide(map.popequip);
          safeHide(map.filternode_button);
        }
        if (lib.config.show_card_prompt) {
          safeShow(map.hide_card_prompt_basic);
          safeShow(map.hide_card_prompt_equip);
        } else {
          safeHide(map.hide_card_prompt_basic);
          safeHide(map.hide_card_prompt_equip);
        }
        if (lib.config.show_log != "off") {
          safeShow(map.clear_log);
        } else {
          safeHide(map.clear_log);
        }
        if (get.is.phoneLayout()) {
          safeShow(map.show_time2);
          safeHide(map.show_time);
          if (lib.config.show_time2) {
            safeShow(map.watchface);
          } else {
            safeHide(map.watchface);
          }
        } else {
          safeHide(map.show_time2);
          safeShow(map.show_time);
          safeHide(map.watchface);
        }
        if (lib.config.show_deckMonitor) {
          safeShow(map.show_deckMonitor_online);
        } else {
          safeHide(map.show_deckMonitor_online);
        }
        if (lib.config.show_extensionmaker) {
          safeShow(map.show_extensionshare);
        } else {
          safeHide(map.show_extensionshare);
        }
      },
      show_history: {
        name: "出牌记录栏",
        init: "off",
        intro: "在屏幕左侧或右侧显示出牌记录",
        unfrequent: true,
        item: {
          off: "关闭",
          left: "靠左",
          right: "靠右",
        },
        onclick(bool) {
          if (lib.config.show_history == "right") {
            ui.window.addTempClass("rightbar2");
          }
          game.saveConfig("show_history", bool);
          if (_status.video || !_status.prepareArena) {
            return;
          }
          if (bool == "left") {
            ui.window.classList.add("leftbar");
            ui.window.classList.remove("rightbar");
          } else if (bool == "right") {
            ui.window.classList.remove("leftbar");
            ui.window.classList.add("rightbar");
          } else {
            ui.window.classList.remove("leftbar");
            ui.window.classList.remove("rightbar");
          }
        },
      },
      pop_logv: {
        name: "自动弹出记录",
        init: false,
        unfrequent: true,
      },
      show_log: {
        name: "历史记录栏",
        init: "off",
        intro: "在屏幕中部显示出牌文字记录",
        unfrequent: true,
        item: {
          off: "关闭",
          left: "靠左",
          center: "居中",
          right: "靠右",
        },
        onclick(bool) {
          game.saveConfig("show_log", bool);
          if (lib.config.show_log != "off") {
            ui.arenalog.style.display = "";
            ui.arenalog.dataset.position = bool;
          } else {
            ui.arenalog.style.display = "none";
            ui.arenalog.innerHTML = "";
          }
        },
      },
      clear_log: {
        name: "自动清除历史记录",
        init: false,
        unfrequent: true,
        intro: "开启后将定时清除历史记录栏的条目（而不是等记录栏满后再清除）",
      },
      log_highlight: {
        name: "历史记录高亮",
        init: true,
        unfrequent: true,
        intro: "开启后历史记录不同类别的信息将以不同颜色显示",
      },
      show_time: {
        name: "显示时间",
        intro: "在屏幕顶部显示当前时间",
        init: false,
        unfrequent: true,
        onclick(bool) {
          game.saveConfig("show_time", bool);
          if (bool) {
            ui.time.style.display = "";
          } else {
            ui.time.style.display = "none";
          }
        },
      },
      show_time2: {
        name: "显示时间",
        intro: "在触屏按钮处显示当前时间",
        init: false,
        unfrequent: true,
        onclick(bool) {
          game.saveConfig("show_time2", bool);
          if (bool) {
            ui.roundmenu.classList.add("clock");
          } else {
            ui.roundmenu.classList.remove("clock");
          }
        },
      },
      watchface: {
        name: "表盘样式",
        init: "none",
        unfrequent: true,
        item: {
          none: "默认",
          simple: "简约",
        },
        onclick(item) {
          game.saveConfig("watchface", item);
          ui.roundmenu.dataset.watchface = item;
        },
      },
      show_time3: {
        name: "显示游戏时间",
        init: false,
        unfrequent: true,
      },
      show_statusbar_android: {
        name: "显示状态栏",
        init: false,
        unfrequent: true,
        onclick(bool) {
          game.saveConfig("show_statusbar_android", bool);
          if (window.StatusBar && lib.device == "android") {
            if (bool) {
              window.StatusBar.overlaysWebView(false);
              window.StatusBar.backgroundColorByName("black");
              window.StatusBar.show();
            } else {
              window.StatusBar.hide();
            }
          }
        },
      },
      show_statusbar_ios: {
        name: "显示状态栏",
        init: "off",
        unfrequent: true,
        item: {
          default: "默认",
          overlay: "嵌入",
          auto: "自动",
          off: "关闭",
        },
        onclick(bool) {
          game.saveConfig("show_statusbar_ios", bool);
          if (window.StatusBar && lib.device == "ios") {
            if (bool != "off" && bool != "auto") {
              if (lib.config.show_statusbar_ios == "default") {
                window.StatusBar.overlaysWebView(false);
                document.body.classList.remove("statusbar");
              } else {
                window.StatusBar.overlaysWebView(true);
                document.body.classList.add("statusbar");
              }
              window.StatusBar.backgroundColorByName("black");
              window.StatusBar.show();
            } else {
              document.body.classList.remove("statusbar");
              window.StatusBar.hide();
            }
          }
        },
      },
      show_card_prompt: {
        name: "显示出牌信息",
        intro: "出牌时在使用者上显示卡牌名称",
        init: true,
        unfrequent: true,
      },
      hide_card_prompt_basic: {
        name: "隐藏基本牌信息",
        intro: "不显示基本牌名称",
        init: false,
        unfrequent: true,
      },
      hide_card_prompt_equip: {
        name: "隐藏装备牌信息",
        intro: "不显示装备牌名称",
        init: false,
        unfrequent: true,
      },
      show_phase_prompt: {
        name: "显示阶段信息",
        intro: "在当前回合不同阶段开始时显示阶段名称",
        init: true,
        unfrequent: true,
      },
      show_phaseuse_prompt: {
        name: "出牌阶段提示",
        intro: "在你出牌时显示提示文字",
        init: true,
        unfrequent: true,
      },
      auto_popped_config: {
        name: "自动弹出选项",
        intro: "鼠标移至选项按钮时弹出模式选择菜单",
        init: true,
        unfrequent: true,
      },
      auto_popped_history: {
        name: "自动弹出历史",
        intro: "鼠标移至暂停按钮时弹出历史记录菜单",
        init: false,
        unfrequent: true,
      },
      show_round_menu: {
        name: "显示触屏按钮",
        init: true,
        unfrequent: true,
        onclick(bool) {
          if (get.is.nomenu("show_round_menu", bool)) {
            return false;
          }
          game.saveConfig("show_round_menu", bool);
          if (bool && ui.roundmenu) {
            ui.roundmenu.style.display = "";
          } else {
            ui.roundmenu.style.display = "none";
            alert("关闭触屏按钮后可通过手势打开菜单（默认为下划）");
          }
        },
      },
      remember_round_button: {
        name: "记住按钮位置",
        intro: "重新开始后触屏按钮将保存的上一局的位置",
        init: false,
        unfrequent: true,
        onclick(bool) {
          game.saveConfig("remember_round_button", bool);
          if (!bool) {
            ui.click.resetround();
          }
        },
      },
      remember_dialog: {
        name: "记住对话框位置",
        intro: "移动对话框后新的对话框也将在移动后的位置显示",
        init: false,
        unfrequent: true,
        onclick(bool) {
          game.saveConfig("remember_dialog", bool);
          if (!bool) {
            if (ui.dialog) {
              var dialog = ui.dialog;
              dialog.style.transform = "";
              dialog._dragtransform = [0, 0];
              dialog.style.transition = "all 0.3s";
              dialog._dragtouches;
              dialog._dragorigin;
              dialog._dragorigintransform;
              setTimeout(function () {
                dialog.style.transition = "";
              }, 500);
            }
            game.saveConfig("dialog_transform", [0, 0]);
          }
        },
      },
      transparent_dialog: {
        name: "堆叠对话框虚化",
        init: false,
        intro:
          "当具有static属性的对话框堆叠（如五谷丰登对话框中提示无懈可击）时，将后方的对话框变为半透明",
        onclick(bool) {
          game.saveConfig("transparent_dialog", bool);
          if (bool) {
            for (var i = 0; i < ui.dialogs.length; i++) {
              if (ui.dialogs[i] != ui.dialog && ui.dialogs[i].static) {
                ui.dialogs[i].unfocus();
              }
            }
          } else {
            for (var i = 0; i < ui.dialogs.length; i++) {
              if (ui.dialogs[i] != ui.dialog && ui.dialogs[i].static) {
                ui.dialogs[i].refocus();
              }
            }
          }
        },
      },
      show_rarity: {
        name: "显示武将评级",
        init: false,
        intro: "仅供娱乐，重启后生效",
        unfrequent: true,
        onclick(bool) {
          game.saveConfig("show_rarity", bool);
        },
      },
      character_dialog_tool: {
        name: "自由选将显示",
        intro: "点击自由选将时默认显示的条目",
        init: "最近",
        item: {
          最近: "最近",
          all: "全部",
        },
        unfrequent: true,
      },
      recent_character_number: {
        name: "最近使用武将",
        intro: "自由选将对话框中最近使用武将的数量",
        init: "12",
        item: {
          5: "5",
          6: "6",
          10: "10",
          12: "12",
          20: "20",
          30: "30",
        },
        unfrequent: true,
      },
      showMax_character_number: {
        name: "最大武将数显示",
        intro:
          "设置自由选将对话框一页显示的最大武将数<br><span class=firetext>注意事项：<br><li>更改此选项后，需要重启游戏以使用新选项配置<br><li>推荐将此选项设置为偏小数值，可降低加载过多武将时导致的性能损耗</span>",
        init: "10",
        item: {
          5: "5",
          6: "6",
          10: "10",
          12: "12",
          20: "20",
          24: "24",
          0: "∞",
        },
        unfrequent: true,
      },
      popequip: {
        name: "触屏装备选择",
        intro: "设置触屏布局中选择装备的方式",
        init: true,
        unfrequent: true,
      },
      filternode_button: {
        name: "触屏筛选按钮",
        intro: "设置自由选将对话框中筛选按钮的样式",
        init: true,
        unfrequent: true,
      },
      show_charactercard: {
        name: "显示武将资料",
        intro: "在武将界面单击时弹出武将资料卡",
        init: true,
        unfrequent: true,
      },
      show_ban_menu: {
        name: "显示禁将菜单",
        intro: "在选项-武将中显示禁将一栏",
        init: false,
        unfrequent: true,
      },
      right_range: {
        name: "显示距离信息",
        intro: "在角色的右键菜单中显示距离等信息",
        init: true,
        unfrequent: true,
      },
      hide_card_image: {
        name: "隐藏卡牌背景",
        intro: "所有卡牌将使用文字作为背景",
        init: false,
        unfrequent: true,
        restart: true,
      },
      show_name: {
        name: "显示角色名称",
        init: false,
        unfrequent: true,
        onclick(bool) {
          game.saveConfig("show_name", bool);
          if (bool) {
            ui.arena.classList.remove("hide_name");
          } else {
            ui.arena.classList.add("hide_name");
          }
        },
      },
      show_sex: {
        name: "显示角色性别",
        intro: "在角色的右键菜单中显示角色性别",
        init: true,
        unfrequent: true,
      },
      show_replay: {
        name: "显示重来按钮",
        init: false,
        unfrequent: true,
        onclick(bool) {
          game.saveConfig("show_replay", bool);
          if (lib.config.show_replay) {
            ui.replay.style.display = "";
          } else {
            ui.replay.style.display = "none";
          }
        },
      },
      show_sortcard: {
        name: "显示整理手牌按钮",
        init: true,
        unfrequent: true,
        onclick(bool) {
          game.saveConfig("show_sortcard", bool);
          if (lib.config.show_sortcard) {
            ui.sortCard.style.display = "";
          } else {
            ui.sortCard.style.display = "none";
          }
        },
      },
      show_pause: {
        name: "显示暂停按钮",
        init: true,
        unfrequent: true,
        onclick(bool) {
          game.saveConfig("show_pause", bool);
          if (lib.config.show_pause) {
            ui.pause.style.display = "";
          } else {
            ui.pause.style.display = "none";
          }
        },
      },
      show_auto: {
        name: "显示托管按钮",
        init: true,
        unfrequent: true,
        onclick(bool) {
          game.saveConfig("show_auto", bool);
          if (lib.config.show_auto) {
            ui.auto.style.display = "";
          } else {
            ui.auto.style.display = "none";
          }
        },
      },
      show_volumn: {
        name: "显示音量按钮",
        init: true,
        unfrequent: true,
        onclick(bool) {
          game.saveConfig("show_volumn", bool);
          if (lib.config.show_volumn) {
            ui.volumn.style.display = "";
          } else {
            ui.volumn.style.display = "none";
          }
        },
      },
      show_cardpile: {
        name: "显示牌堆按钮",
        init: true,
        unfrequent: true,
        onclick(bool) {
          game.saveConfig("show_cardpile", bool);
          if (bool) {
            ui.cardPileButton.style.display = "";
          } else {
            ui.cardPileButton.style.display = "none";
          }
        },
      },
      show_cardpile_number: {
        name: "显示剩余牌数",
        init: true,
        unfrequent: true,
        onclick(bool) {
          game.saveConfig("show_cardpile_number", bool);
          if (bool) {
            ui.cardPileNumber.style.display = "";
          } else {
            ui.cardPileNumber.style.display = "none";
          }
        },
      },
      show_handcardbutton: {
        name: "显示手牌按钮",
        init: true,
        unfrequent: true,
        onclick(bool) {
          game.saveConfig("show_handcardbutton", bool);
        },
      },
      show_giveup: {
        name: "显示投降按钮",
        init: true,
        unfrequent: true,
        onclick(bool) {
          game.saveConfig("show_giveup", bool);
        },
      },
      show_tip: {
        name: "显示tip标记",
        init: false,
        unfrequent: true,
        onclick(bool) {
          game.saveConfig("show_tip", bool);
          document.documentElement.style.setProperty(
            "--tip-display",
            bool ? "flex" : "none"
          );
        },
      },
      show_deckMonitor: {
        name: "显示记牌器",
        init: true,
        unfrequent: true,
        onclick(bool) {
          if (_status.connectMode) {
            if (confirm("当前为联机模式，修改此设置需重启，是否重启？")) {
              game.saveConfig("show_deckMonitor", bool);
              game.reload();
            } else {
              this.classList.toggle("on");
            }
          } else {
            game.saveConfig("show_deckMonitor", bool);
            if (lib.config.show_deckMonitor) {
              ui.deckMonitor.style.display = "";
            } else {
              ui.deckMonitor.style.display = "none";
            }
          }
        },
      },
      show_deckMonitor_online: {
        name: "联机显示记牌器",
        intro: "如果你是房主，此设置对所有人生效",
        init: false,
        unfrequent: true,
        onclick(bool) {
          if (_status.connectMode) {
            if (confirm("当前为联机模式，修改此设置须重启，是否重启？")) {
              game.saveConfig("show_deckMonitor_online", bool);
              game.reload();
            } else {
              this.classList.toggle("on");
            }
          } else {
            game.saveConfig("show_deckMonitor_online", bool);
          }
        },
      },
      show_wuxie: {
        name: "显示无懈按钮",
        intro: "在右上角显示不询问无懈",
        init: false,
        unfrequent: true,
        onclick(bool) {
          game.saveConfig("show_wuxie", bool);
          if (lib.config.show_wuxie) {
            ui.wuxie.style.display = "";
          } else {
            ui.wuxie.style.display = "none";
          }
        },
      },
      wuxie_right: {
        name: "无懈按钮靠左",
        init: true,
        unfrequent: true,
      },
      show_discardpile: {
        name: "暂停时显示弃牌堆",
        init: false,
        unfrequent: true,
      },
      show_extensionmaker: {
        name: "显示制作扩展",
        init: true,
        unfrequent: true,
      },
      show_extensionshare: {
        name: "显示分享扩展",
        init: true,
        unfrequent: true,
      },
      show_characternamepinyin: {
        name: "显示武将名注解",
        intro: "在武将资料卡显示武将名及其注解、性别、势力、体力等信息",
        init: "showCodeIdentifier",
        unfrequent: true,
        item: {
          doNotShow: "不显示",
          showPinyin: "拼音(样式一)",
          showCodeIdentifier: "代码ID(样式一)",
          showPinyin2: "拼音(样式二)",
          showCodeIdentifier2: "代码ID(样式二)",
        },
        visualMenu: (node, link, name) => {
          node.classList.add("button", "character");
          const style = node.style;
          style.alignItems = "center";
          style.animation =
            "background-position-left-center-right-center-left-center 15s ease infinite";
          style.background =
            "linear-gradient(-45deg, #EE7752, #E73C7E, #23A6D5, #23D5AB)";
          style.backgroundSize = "400% 400%";
          style.display = "flex";
          style.height = "60px";
          style.justifyContent = "center";
          style.width = "180px";
          const firstChild = node.firstChild;
          firstChild.removeAttribute("class");
          firstChild.style.position = "initial";
          if (link == "doNotShow") {
            return;
          }
          const ruby = document.createElement("ruby");
          ruby.textContent = name;
          const rt = document.createElement("rt");
          rt.style.fontSize = "smaller";
          if (link == "showPinyin2" || link == "showCodeIdentifier2") {
            rt.textContent =
              link == "showCodeIdentifier2"
                ? "[" + link + "]"
                : "[" + get.pinyin(name) + "]";
            ruby.appendChild(rt);
          } else {
            const leftParenthesisRP = document.createElement("rp");
            leftParenthesisRP.textContent = "（";
            ruby.appendChild(leftParenthesisRP);
            rt.textContent =
              link == "showCodeIdentifier" ? link : get.pinyin(name).join(" ");
            ruby.appendChild(rt);
            const rightParenthesisRP = document.createElement("rp");
            rightParenthesisRP.textContent = "）";
            ruby.appendChild(rightParenthesisRP);
          }
          firstChild.innerHTML = ruby.outerHTML;
        },
      },
      show_skillnamepinyin: {
        name: "显示技能名注解",
        intro: "在武将资料卡显示技能名注解",
        get init() {
          return lib.configMenu.view.config.show_characternamepinyin.init;
        },
        set init(newVal) {
          lib.configMenu.view.config.show_characternamepinyin.init = newVal;
        },
        get unfrequent() {
          return lib.configMenu.view.config.show_characternamepinyin.unfrequent;
        },
        set unfrequent(newVal) {
          lib.configMenu.view.config.show_characternamepinyin.unfrequent =
            newVal;
        },
        get item() {
          return lib.configMenu.view.config.show_characternamepinyin.item;
        },
        set item(newVal) {
          lib.configMenu.view.config.show_characternamepinyin.item = newVal;
        },
        get visualMenu() {
          return lib.configMenu.view.config.show_characternamepinyin.visualMenu;
        },
        set visualMenu(newVal) {
          lib.configMenu.view.config.show_characternamepinyin.visualMenu =
            newVal;
        },
      },
    },
  },
  audio: {
    name: "音效",
    config: {
      update: function (config, map) {
        if (
          lib.config.background_music == "music_custom" &&
          (lib.device || lib.node)
        ) {
          map.import_music.show();
        } else {
          map.import_music.hide();
        }
        map.clear_background_music[
          get.is.object(lib.config.customBackgroundMusic) ? "show" : "hide"
        ]();
        ui.background_music_setting = map.background_music;
        map.background_music._link.config.updatex.call(
          map.background_music,
          []
        );
      },
      background_music: {
        updatex: function () {
          this.lastChild.innerHTML =
            this._link.config.item[lib.config.background_music];
          var menu = this._link.menu;
          for (var i = 0; i < menu.childElementCount; i++) {
            if (
              !["music_off", "music_custom", "music_random"]
                .concat(lib.config.all.background_music)
                .includes(menu.childNodes[i]._link)
            ) {
              menu.childNodes[i].delete();
            }
          }
        },
        name: "背景音乐",
        init: true,
        item: {
          music_default: "默认",
        },
        onclick(item) {
          game.saveConfig("background_music", item);
          game.playBackgroundMusic();
        },
      },
      import_music: {
        name:
          '<div style="white-space:nowrap;width:calc(100% - 5px)">' +
          '<input type="file" style="width:calc(100% - 40px)" accept="audio/*">' +
          '<button style="width:40px">确定</button></div>',
        clear: true,
      },
      background_audio: {
        name: "游戏音效",
        init: true,
      },
      background_speak: {
        name: "人物配音",
        init: true,
      },
      equip_audio: {
        name: "装备配音",
        init: false,
      },
      repeat_audio: {
        name: "播放重复语音",
        init: false,
      },
      volumn_audio: {
        name: "音效音量",
        init: 8,
        item: {
          0: "〇",
          1: "一",
          2: "二",
          3: "三",
          4: "四",
          5: "五",
          6: "六",
          7: "七",
          8: "八",
        },
        onclick(volume) {
          game.saveConfig("volumn_audio", parseInt(volume));
        },
      },
      volumn_background: {
        name: "音乐音量",
        init: 8,
        item: {
          0: "〇",
          1: "一",
          2: "二",
          3: "三",
          4: "四",
          5: "五",
          6: "六",
          7: "七",
          8: "八",
        },
        onclick(volume) {
          game.saveConfig("volumn_background", parseInt(volume));
          ui.backgroundMusic.volume = volume / 8;
        },
      },
      clear_background_music: {
        name: "清除自定义背景音乐",
        clear: true,
        onclick() {
          if (
            confirm("是否清除已导入的所有自定义背景音乐？（该操作不可撤销！）")
          ) {
            for (var i in lib.config.customBackgroundMusic) {
              lib.config.all.background_music.remove(i);
              if (i.startsWith("cdv_")) {
                game.removeFile("audio/background/" + i + ".mp3");
              } else {
                game.deleteDB("audio", i);
              }
            }
            lib.config.customBackgroundMusic = null;
            game.saveConfig("customBackgroundMusic", null);
            game.saveConfig("background_music", "music_off");
            if (!_status._aozhan) {
              game.playBackgroundMusic();
            }
          }
        },
      },
    },
  },
  skill: {
    name: "技能",
    config: {
      update: function (config, map) {
        for (var i in map) {
          if (map[i]._link.config.type == "autoskill") {
            if (!lib.config.autoskilllist.includes(i)) {
              map[i].classList.add("on");
            } else {
              map[i].classList.remove("on");
            }
          } else if (map[i]._link.config.type == "banskill") {
            if (!lib.config.forbidlist.includes(i)) {
              map[i].classList.add("on");
            } else {
              map[i].classList.remove("on");
            }
          }
        }
      },
    },
  },
  others: {
    name: "其它",
    config: {
      reset_game: {
        name: "重置游戏设置",
        onclick() {
          var node = this;
          if (node._clearing) {
            var noname_inited = localStorage.getItem("noname_inited");
            var onlineKey = localStorage.getItem(lib.configprefix + "key");
            localStorage.clear();
            if (noname_inited) {
              localStorage.setItem("noname_inited", noname_inited);
            }
            if (onlineKey) {
              localStorage.setItem(lib.configprefix + "key", onlineKey);
            }
            game.deleteDB("config");
            game.deleteDB("data");
            game.reload();
            return;
          }
          node._clearing = true;
          node.firstChild.innerHTML = "单击以确认 (3)";
          setTimeout(function () {
            node.firstChild.innerHTML = "单击以确认 (2)";
            setTimeout(function () {
              node.firstChild.innerHTML = "单击以确认 (1)";
              setTimeout(function () {
                node.firstChild.innerHTML = "重置游戏设置";
                delete node._clearing;
              }, 1000);
            }, 1000);
          }, 1000);
        },
        clear: true,
      },
      reset_hiddenpack: {
        name: "重置隐藏内容",
        onclick() {
          if (this.firstChild.innerHTML != "已重置") {
            this.firstChild.innerHTML = "已重置";
            game.saveConfig("hiddenModePack", []);
            game.saveConfig("hiddenCharacterPack", []);
            game.saveConfig("hiddenCardPack", []);
            game.saveConfig("hiddenPlayPack", []);
            game.saveConfig("hiddenBackgroundPack", []);
            var that = this;
            setTimeout(function () {
              that.firstChild.innerHTML = "重置隐藏内容";
              setTimeout(function () {
                if (confirm("是否重新启动使改变生效？")) {
                  game.reload();
                }
              });
            }, 500);
          }
        },
        clear: true,
      },
      import_data: {
        name: "导入游戏设置",
        onclick() {
          ui.import_data_button.classList.toggle("hidden");
        },
        clear: true,
      },
      import_data_button: {
        name:
          '<div style="white-space:nowrap;width:calc(100% - 10px)">' +
          '<input type="file" accept="*/*" style="width:calc(100% - 40px)">' +
          '<button style="width:40px">确定</button></div>',
        clear: true,
      },
      export_data: {
        name: "导出游戏设置",
        onclick() {
          var data;
          var export_data = function (data) {
            game.export(
              lib.init.encode(JSON.stringify(data)),
              "无名杀 - 数据 - " + new Date().toLocaleString()
            );
          };
          if (!lib.db) {
            data = {};
            for (var i in localStorage) {
              if (i.startsWith(lib.configprefix)) {
                data[i] = localStorage[i];
              }
            }
            export_data(data);
          } else {
            game.getDB("config", null, function (data1) {
              game.getDB("data", null, function (data2) {
                export_data({
                  config: data1,
                  data: data2,
                });
              });
            });
          }
        },
        clear: true,
      },
      remove_extension_onfig: {
        name: "重置无效扩展",
        clear: true,
        async onclick() {
          if (this.firstChild.innerHTML != "已重置") {
            let config = lib.config;
            if (get.is.object(config)) {
              let extensionList = config.extensions;
              for (let name of extensionList) {
                let num = await game.promises.checkDir(`extension/${name}`);
                if (num !== 1) {
                  game.removeExtension(name);
                } else {
                  let all = await game.promises.getFileList(
                    `extension/${name}`
                  );
                  if (all?.[1].length) {
                    const hasExtensionJs = all[1].includes("extension.js");
                    const hasInfoJson = all[1].includes("info.json");

                    if (!hasExtensionJs) {
                      const message = hasInfoJson
                        ? `扩展${name}有 info.json 但缺少 extension.js 文件`
                        : `扩展${name}缺少必须的 extension.js 文件`;
                      console.error(message);
                      game.removeExtension(name);
                    }
                  }
                }
              }
            }
            this.firstChild.innerHTML = "已重置";
            const that = this;
            setTimeout(function () {
              that.firstChild.innerHTML = "重置无效扩展";
              setTimeout(function () {
                let ret = confirm(`检测完成，已为你清除无效配置，是否重启？`);
                if (ret) {
                  game.reload();
                }
              });
            }, 500);
          }
        },
      },
      redownload_game: {
        name: "重新下载游戏",
        onclick() {
          var node = this;
          if (node._clearing) {
            localStorage.removeItem("noname_inited");
            game.reload();
            return;
          }
          node._clearing = true;
          node.firstChild.innerHTML = "单击以确认 (3)";
          setTimeout(function () {
            node.firstChild.innerHTML = "单击以确认 (2)";
            setTimeout(function () {
              node.firstChild.innerHTML = "单击以确认 (1)";
              setTimeout(function () {
                node.firstChild.innerHTML = "重新下载游戏";
                delete node._clearing;
              }, 1000);
            }, 1000);
          }, 1000);
        },
        clear: true,
      },
      update: function (config, map) {
        if (lib.device || lib.node) {
          map.redownload_game.show();
        } else {
          map.redownload_game.hide();
        }
      },
    },
  },
};
