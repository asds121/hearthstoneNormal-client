import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export default {
  identity: {
    name: "身份",
    config: {
      identity_mode: {
        name: "游戏模式",
        init: "normal",
        item: {
          normal: "标准",
        },
        restart: true,
        frequent: true,
      },
      player_number: {
        name: "游戏人数",
        init: 4,
        item: {
          2: "两人",
          4: "四人",
        },
        frequent: true,
        restart: true,
      },
      choose_group: {
        name: "神武将选择势力",
        init: true,
        restart: true,
        frequent: true,
        intro:
          "若开启此选项，选择神武将的玩家需在亮出自己的武将牌之前为自己选择一个势力。",
      },
      auto_identity: {
        name: "自动显示身份",
        item: {
          off: "关闭",
          one: "一轮",
          two: "两轮",
          three: "三轮",
          always: "始终",
        },
        init: "off",
        onclick(bool) {
          game.saveConfig("auto_identity", bool, this._link.config.mode);
          if (get.config("identity_mode") == "zhong") {
            return;
          }
          var num;
          switch (bool) {
            case "一轮":
              num = 1;
              break;
            case "两轮":
              num = 2;
              break;
            case "三轮":
              num = 3;
              break;
            default:
              num = 0;
              break;
          }
          if (
            num & !_status.identityShown &&
            game.phaseNumber > game.players.length * num &&
            game.showIdentity
          ) {
            _status.identityShown = true;
            game.showIdentity(false);
          }
        },
        intro: "游戏进行若干轮将自动显示所有角色的身份",
      },
      auto_mark_identity: {
        name: "自动标记身份",
        init: false,
        intro: "根据角色的出牌行为自动标记可能的身份",
      },
      free_choose: {
        name: "自由选将",
        init: true,
        onclick(bool) {
          game.saveConfig("free_choose", bool, this._link.config.mode);
          if (
            get.mode() != this._link.config.mode ||
            (!_status.event.getParent().showConfig && !_status.event.showConfig)
          ) {
            return;
          }
          if (!ui.cheat2 && get.config("free_choose")) {
            ui.create.cheat2();
          } else if (ui.cheat2 && !get.config("free_choose")) {
            ui.cheat2.close();
            delete ui.cheat2;
          }
        },
      },
      change_identity: {
        name: "自由选择身份和座位",
        init: true,
        onclick(bool) {
          game.saveConfig("change_identity", bool, this._link.config.mode);
          if (
            get.mode() != "identity" ||
            (!_status.event.getParent().showConfig && !_status.event.showConfig)
          ) {
            return;
          }
          var dialog;
          if (ui.cheat2 && ui.cheat2.backup) {
            dialog = ui.cheat2.backup;
          } else {
            dialog = _status.event.dialog;
          }
          if (!_status.brawl || !_status.brawl.noAddSetting) {
            if (
              !dialog.querySelector("table") &&
              get.config("change_identity")
            ) {
              _status.event.getParent().addSetting(dialog);
            } else {
              _status.event.getParent().removeSetting(dialog);
            }
          }
          ui.update();
        },
      },
      change_choice: {
        name: "开启换将卡",
        init: true,
        onclick(bool) {
          game.saveConfig("change_choice", bool, this._link.config.mode);
          if (
            get.mode() != "identity" ||
            (!_status.event.getParent().showConfig && !_status.event.showConfig)
          ) {
            return;
          }
          if (!ui.cheat && get.config("change_choice")) {
            ui.create.cheat();
          } else if (ui.cheat && !get.config("change_choice")) {
            ui.cheat.close();
            delete ui.cheat;
          }
        },
      },
      change_card: {
        name: "开启手气卡",
        init: "disabled",
        item: {
          disabled: "禁用",
          once: "一次",
          twice: "两次",
          unlimited: "无限",
        },
      },
      continue_game: {
        name: "显示再战",
        init: false,
        onclick(bool) {
          game.saveConfig("continue_game", bool, this._link.config.mode);
          if (get.config("continue_game") && get.mode() == "identity") {
            if (
              !ui.continue_game &&
              _status.over &&
              !_status.brawl &&
              !game.no_continue_game
            ) {
              ui.continue_game = ui.create.control("再战", game.reloadCurrent);
            }
          } else if (ui.continue_game) {
            ui.continue_game.close();
            delete ui.continue_game;
          }
        },
        intro: "游戏结束后可选择用相同的武将再进行一局游戏",
      },
      dierestart: {
        name: "死亡后显示重来",
        init: true,
        onclick(bool) {
          game.saveConfig("dierestart", bool, this._link.config.mode);
          if (get.config("dierestart") && get.mode() == "identity") {
            if (!ui.restart && game.me.isDead() && !_status.connectMode) {
              ui.restart = ui.create.control("restart", game.reload);
            }
          } else if (ui.restart) {
            ui.restart.close();
            delete ui.restart;
          }
        },
      },
      ban_identity: {
        name: "屏蔽身份",
        init: "off",
        item: {
          off: "关闭",
          zhu: "主公",
          zhong: "忠臣",
          fan: "反贼",
        },
      },
      difficulty: {
        name: "AI对人类态度",
        init: "normal",
        item: {
          easy: "友好",
          normal: "一般",
          hard: "仇视",
        },
      },
    },
  },
  single: {
    name: "单挑",
    config: {
      single_mode: {
        name: "游戏模式",
        init: "dianjiang",
        item: {
          dianjiang: "点将单挑",
        },
        restart: true,
        frequent: true,
      },
      single_control: {
        name: "单人控制",
        intro: "由玩家操作点将单挑的两名游戏角色",
        init: false,
        restart: true,
      },
      free_choose: {
        name: "自由选将",
        init: true,
        onclick(bool) {
          game.saveConfig("free_choose", bool, this._link.config.mode);
          if (
            get.mode() != this._link.config.mode ||
            (!_status.event.getParent().showConfig && !_status.event.showConfig)
          ) {
            return;
          }
          if (!ui.cheat2 && get.config("free_choose")) {
            ui.create.cheat2();
          } else if (ui.cheat2 && !get.config("free_choose")) {
            ui.cheat2.close();
            delete ui.cheat2;
          }
        },
      },
      update: function (config, map) {
        map.single_control.show();
        map.free_choose.show();
      },
    },
  },
  doudizhu: {
    name: "斗地主",
    config: {
      update: function (config, map) {
        map.change_card.show();
        if (config.doudizhu_mode !== "normal") {
          if (config.doudizhu_mode === "kaihei") {
            map.choice_zhu.show();
            map.choice_fan.show();
          } else {
            map.choice_zhu.hide();
            map.choice_fan.hide();
          }
          map.free_choose.hide();
          map.change_identity.hide();
          map.change_choice.hide();
          map.continue_game.hide();
          map.dierestart.hide();
          map.feiyang_version.hide();
        } else {
          map.choice_zhu.show();
          map.choice_fan.show();
          map.free_choose.show();
          map.change_identity.show();
          map.change_choice.show();
          map.continue_game.show();
          map.dierestart.show();
          map.feiyang_version.show();
        }
      },
      doudizhu_mode: {
        name: "游戏模式",
        init: "normal",
        item: {
          normal: "休闲",
          kaihei: "开黑",
          huanle: "欢乐",
        },
        restart: true,
        frequent: true,
      },
      choice_zhu: {
        name: "地主候选武将数",
        init: 5,
        input: true,
        restart: true,
        onblur(e) {
          let text = e.target,
            num = Number(text.innerText);
          if (isNaN(num) || num < 2) {
            num = 5;
          } else if (!Number.isInteger(num)) {
            num = Math.round(num);
          }
          text.innerText = num;
          game.saveConfig("choice_zhu", num, "doudizhu");
        },
      },
      choice_fan: {
        name: "农民候选武将数",
        init: 3,
        input: true,
        restart: true,
        onblur(e) {
          let text = e.target,
            num = Number(text.innerText);
          if (isNaN(num) || num < 2) {
            num = 3;
          } else if (!Number.isInteger(num)) {
            num = Math.round(num);
          }
          text.innerText = num;
          game.saveConfig("choice_fan", num, "doudizhu");
        },
      },
      free_choose: {
        name: "自由选将",
        init: true,
        onclick(bool) {
          game.saveConfig("free_choose", bool, this._link.config.mode);
          if (
            get.mode() != this._link.config.mode ||
            (!_status.event.getParent().showConfig && !_status.event.showConfig)
          ) {
            return;
          }
          if (!ui.cheat2 && get.config("free_choose")) {
            ui.create.cheat2();
          } else if (ui.cheat2 && !get.config("free_choose")) {
            ui.cheat2.close();
            delete ui.cheat2;
          }
        },
      },
      change_identity: {
        name: "自由选择身份和座位",
        init: true,
        onclick(bool) {
          game.saveConfig("change_identity", bool, this._link.config.mode);
          if (
            !_status.event.getParent().showConfig &&
            !_status.event.showConfig
          ) {
            return;
          }
          var dialog;
          if (ui.cheat2 && ui.cheat2.backup) {
            dialog = ui.cheat2.backup;
          } else {
            dialog = _status.event.dialog;
          }
          if (!_status.brawl || !_status.brawl.noAddSetting) {
            if (
              !dialog.querySelector("table") &&
              get.config("change_identity")
            ) {
              _status.event.getParent().addSetting(dialog);
            } else {
              _status.event.getParent().removeSetting(dialog);
            }
          }
          ui.update();
        },
      },
      change_choice: {
        name: "开启换将卡",
        init: true,
        onclick(bool) {
          game.saveConfig("change_choice", bool, this._link.config.mode);
          if (
            !_status.event.getParent().showConfig &&
            !_status.event.showConfig
          ) {
            return;
          }
          if (!ui.cheat && get.config("change_choice")) {
            ui.create.cheat();
          } else if (ui.cheat && !get.config("change_choice")) {
            ui.cheat.close();
            delete ui.cheat;
          }
        },
      },
      change_card: {
        name: "开启手气卡",
        init: "disabled",
        item: {
          disabled: "禁用",
          once: "一次",
          twice: "两次",
          unlimited: "无限",
        },
      },
      continue_game: {
        name: "显示再战",
        init: false,
        onclick(bool) {
          game.saveConfig("continue_game", bool, this._link.config.mode);
          if (get.config("continue_game")) {
            if (
              !ui.continue_game &&
              _status.over &&
              !_status.brawl &&
              !game.no_continue_game
            ) {
              ui.continue_game = ui.create.control("再战", game.reloadCurrent);
            }
          } else if (ui.continue_game) {
            ui.continue_game.close();
            delete ui.continue_game;
          }
        },
        intro: "游戏结束后可选择用相同的武将再进行一局游戏",
      },
      dierestart: {
        name: "死亡后显示重来",
        init: true,
        onclick(bool) {
          game.saveConfig("dierestart", bool, this._link.config.mode);
          if (get.config("dierestart")) {
            if (!ui.restart && game.me.isDead() && !_status.connectMode) {
              ui.restart = ui.create.control("restart", game.reload);
            }
          } else if (ui.restart) {
            ui.restart.close();
            delete ui.restart;
          }
        },
      },
      feiyang_version: {
        name: "〖飞扬〗版本",
        init: "online",
        restart: true,
        item: {
          online: "OL版本",
          mobile: "手杀版本",
          decade: "十周年版本",
        },
      },
    },
  },
};
