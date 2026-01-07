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
  identity: {
    name: "身份",
    connect: {
      update: function (config, map) {
        if (config.connect_identity_mode == "stratagem") {
          map.connect_round_one_use_fury.show();
        } else {
          map.connect_round_one_use_fury.hide();
        }
        if (config.connect_identity_mode == "zhong") {
          map.connect_player_number.hide();
          map.connect_choice_zhu.hide();
          map.connect_limit_zhu.hide();
          map.connect_enhance_zhu.hide();
          map.connect_enable_mingcha.hide();
          map.connect_choice_zhong.hide();
          map.connect_choice_fan.hide();
          map.connect_choice_nei.hide();
          map.connect_double_nei.hide();
          map.connect_enable_commoner.hide();
          map.connect_choice_commoner.hide();
          map.connect_enable_year_limit.show();
          map.connect_zhong_card.show();
          map.connect_special_identity.hide();
          map.connect_double_character.show();
        } else if (config.connect_identity_mode == "stratagem") {
          map.connect_double_character.show();
          map.connect_player_number.show();
          map.connect_choice_zhu.show();
          map.connect_limit_zhu.hide();
          map.connect_enhance_zhu.hide();
          map.connect_enable_mingcha.hide();
          map.connect_choice_zhong.show();
          map.connect_choice_fan.show();
          map.connect_choice_nei.show();
          map.connect_double_nei.hide();
          map.connect_enable_commoner.hide();
          map.connect_choice_commoner.hide();
          map.connect_enable_year_limit.show();
          map.connect_zhong_card.hide();
          map.connect_special_identity.hide();
        } else if (config.connect_identity_mode == "purple") {
          map.connect_player_number.hide();
          map.connect_choice_zhu.hide();
          map.connect_limit_zhu.hide();
          map.connect_enhance_zhu.hide();
          map.connect_enable_mingcha.hide();
          map.connect_choice_zhong.hide();
          map.connect_choice_fan.hide();
          map.connect_choice_nei.hide();
          map.connect_double_nei.hide();
          map.connect_enable_commoner.hide();
          map.connect_choice_commoner.hide();
          map.connect_enable_year_limit.hide();
          map.connect_zhong_card.hide();
          map.connect_special_identity.hide();
          map.connect_double_character.hide();
        } else {
          map.connect_double_character.show();
          map.connect_player_number.show();
          map.connect_choice_zhu.show();
          map.connect_limit_zhu.show();
          map.connect_enhance_zhu.show();
          map.connect_enable_mingcha.show();
          map.connect_choice_zhong.show();
          map.connect_choice_fan.show();
          map.connect_choice_nei.show();
          map.connect_double_nei[
            config.connect_player_number != "2" &&
            !config.connect_enable_commoner
              ? "show"
              : "hide"
          ]();
          map.connect_enable_commoner[
            config.connect_player_number != "2" && !config.connect_double_nei
              ? "show"
              : "hide"
          ]();
          map.connect_choice_commoner[
            config.connect_enable_commoner ? "show" : "hide"
          ]();
          map.connect_enable_year_limit.show();
          map.connect_zhong_card.hide();
          if (config.connect_player_number == "8") {
            map.connect_special_identity.show();
          } else {
            map.connect_special_identity.hide();
          }
        }
      },
      connect_identity_mode: {
        name: "游戏模式",
        init: "normal",
        item: {
          normal: "标准",
          zhong: "明忠",
          stratagem: "谋攻",
          purple: "3v3v2",
        },
        restart: true,
        frequent: true,
        intro: "明忠模式和3v3v2模式详见帮助",
      },
      connect_player_number: {
        name: "游戏人数",
        init: "8",
        get item() {
          return lib.mode.identity.config.player_number.item;
        },
        frequent: true,
        restart: true,
      },
      connect_choice_zhu: {
        name: "主公候选武将数",
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
          game.saveConfig("connect_choice_zhu", num, "identity");
        },
      },
      connect_limit_zhu: {
        name: "常备主候选武将数",
        init: "group",
        restart: true,
        item: {
          off: "不限制",
          group: "按势力筛选",
          3: "三",
          4: "四",
          6: "六",
          8: "八",
        },
      },
      connect_choice_zhong: {
        name: "忠臣候选武将数",
        init: 4,
        input: true,
        restart: true,
        onblur(e) {
          let text = e.target,
            num = Number(text.innerText);
          if (isNaN(num) || num < 2) {
            num = 4;
          } else if (!Number.isInteger(num)) {
            num = Math.round(num);
          }
          text.innerText = num;
          game.saveConfig("connect_choice_zhong", num, "identity");
        },
      },
      connect_zhong_card: {
        name: "明忠卡牌替换",
        init: true,
        frequent: true,
        restart: true,
      },
      connect_choice_fan: {
        name: "反贼候选武将数",
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
          game.saveConfig("connect_choice_fan", num, "identity");
        },
      },
      connect_choice_nei: {
        name: "内奸候选武将数",
        init: 6,
        input: true,
        restart: true,
        onblur(e) {
          let text = e.target,
            num = Number(text.innerText);
          if (isNaN(num) || num < 2) {
            num = 6;
          } else if (!Number.isInteger(num)) {
            num = Math.round(num);
          }
          text.innerText = num;
          game.saveConfig("connect_choice_nei", num, "identity");
        },
      },
      connect_double_nei: {
        name: "双内奸",
        init: false,
        restart: true,
        // frequent:true,
        get intro() {
          return lib.mode.identity.config.double_nei.intro;
        },
      },
      connect_enable_commoner: {
        name: "启用平民",
        init: false,
        restart: true,
        frequent: false,
        get intro() {
          return lib.mode.identity.config.enable_commoner.intro;
        },
      },
      connect_choice_commoner: {
        name: "平民候选武将数",
        init: 4,
        input: true,
        restart: true,
        onblur(e) {
          let text = e.target,
            num = Number(text.innerText);
          if (isNaN(num) || num < 2) {
            num = 4;
          } else if (!Number.isInteger(num)) {
            num = Math.round(num);
          }
          text.innerText = num;
          game.saveConfig("connect_choice_commoner", num, "identity");
        },
      },
      connect_double_character: {
        name: "双将模式",
        init: false,
        frequent: true,
        restart: true,
      },
      connect_change_card: {
        name: "启用手气卡",
        init: false,
        frequent: true,
        restart: true,
      },
      connect_special_identity: {
        name: "特殊身份",
        init: false,
        restart: true,
        frequent: true,
        intro: "开启后游戏中将增加军师、大将、贼首三个身份",
      },
      connect_enable_year_limit: {
        name: "启用年机制",
        init: false,
        restart: true,
        frequent: false,
        get intro() {
          return lib.mode.identity.config.enable_year_limit.intro;
        },
      },
      connect_round_one_use_fury: {
        name: "开启首轮强化卡牌",
        init: false,
        frequent: false,
        restart: true,
        intro:
          "谋攻篇规则为第二轮开始才可使用怒气强化卡牌，开启此选项从游戏开始即可强化卡牌。",
      },
      connect_enhance_zhu: {
        name: "加强主公",
        init: "off",
        item: {
          sixiang: "四象标记",
          specific: "专属技能",
          off: "关闭",
        },
        restart: true,
        intro:
          "为主公增加一个额外技能。<br><li>四象标记：主公随机获得一个四象标记（限发动一次）；每个回合结束时，若场上没有反贼，主公失去此标记。<br><li>专属技能：至少三名反贼的身份场，主公获得一个专属技能（无则改为〖天命〗）；一名角色阵亡后，若存活反贼数小于3，主公失去此技能。",
      },
      connect_enable_mingcha: {
        name: "启用明察",
        init: false,
        restart: true,
        frequent: false,
        get intro() {
          return lib.mode.identity.config.enable_mingcha.intro;
        },
      },
    },
    config: {
      update: function (config, map) {
        if (config.identity_mode == "stratagem") {
          map.round_one_use_fury.show();
          map.nei_auto_mark_camouflage.show();
        } else {
          map.round_one_use_fury.hide();
          map.nei_auto_mark_camouflage.hide();
        }
        if (config.identity_mode == "zhong") {
          map.player_number.hide();
          map.enhance_zhu.hide();
          map.enable_mingcha.hide();
          map.double_nei.hide();
          map.auto_identity.hide();
          map.choice_zhu.hide();
          map.limit_zhu.hide();
          map.choice_zhong.hide();
          map.choice_nei.hide();
          map.choice_fan.hide();
          map.enable_commoner.hide();
          map.choice_commoner.hide();
          map.enable_year_limit.show();
          map.ban_identity.hide();
          map.ban_identity2.hide();
          map.ban_identity3.hide();
          map.zhong_card.show();
          map.special_identity.hide();
          map.choose_group.show();
          map.change_choice.show();
          map.auto_mark_identity.show();
          map.double_character.show();
          map.free_choose.show();
          map.change_identity.show();
          if (config.double_character) {
            map.double_hp.show();
          } else {
            map.double_hp.hide();
          }
          map.continue_game.show();
        } else if (config.identity_mode == "stratagem") {
          map.continue_game.show();
          map.player_number.show();
          map.enhance_zhu.hide();
          map.enable_mingcha.hide();
          map.auto_identity.hide();
          if (config.player_number != "2") {
            map.double_nei.show();
          } else {
            map.double_nei.hide();
          }
          map.choice_zhu.show();
          map.limit_zhu.hide();
          map.choice_zhong.show();
          map.choice_nei.show();
          map.choice_fan.show();
          map.enable_commoner.hide();
          map.choice_commoner.hide();
          map.enable_year_limit.show();
          map.ban_identity.show();
          if (config.ban_identity == "off") {
            map.ban_identity2.hide();
          } else {
            map.ban_identity2.show();
          }
          if (config.ban_identity == "off" || config.ban_identity2 == "off") {
            map.ban_identity3.hide();
          } else {
            map.ban_identity3.show();
          }
          map.zhong_card.hide();
          map.choose_group.show();
          map.auto_mark_identity.hide();
          map.change_choice.show();
          map.free_choose.show();
          map.change_identity.show();
          map.special_identity.hide();
          map.double_character.show();
          if (config.double_character) {
            map.double_hp.show();
          } else {
            map.double_hp.hide();
          }
        } else if (config.identity_mode == "purple") {
          map.player_number.hide();
          map.enhance_zhu.hide();
          map.enable_mingcha.hide();
          map.double_nei.hide();
          map.auto_identity.hide();
          map.choice_zhu.hide();
          map.limit_zhu.hide();
          map.choice_zhong.hide();
          map.choice_nei.hide();
          map.choice_fan.hide();
          map.enable_commoner.hide();
          map.choice_commoner.hide();
          map.enable_year_limit.hide();
          map.ban_identity.hide();
          map.ban_identity2.hide();
          map.ban_identity3.hide();
          map.zhong_card.hide();
          map.special_identity.hide();
          map.double_character.hide();
          map.double_hp.hide();
          map.choose_group.hide();
          map.auto_mark_identity.hide();
          map.change_choice.hide();
          map.free_choose.hide();
          map.change_identity.hide();
          map.continue_game.hide();
        } else {
          map.continue_game.show();
          map.player_number.show();
          map.enhance_zhu.show();
          map.enable_mingcha.show();
          map.auto_identity.show();
          map.double_nei[
            config.player_number != "2" && !config.enable_commoner
              ? "show"
              : "hide"
          ]();
          map.choice_zhu.show();
          map.limit_zhu.show();
          map.choice_zhong.show();
          map.choice_nei.show();
          map.choice_fan.show();
          map.enable_commoner[
            config.player_number != "2" && !config.double_nei ? "show" : "hide"
          ]();
          map.choice_commoner[config.enable_commoner ? "show" : "hide"]();
          map.enable_year_limit.show();
          map.ban_identity.show();
          if (config.ban_identity == "off") {
            map.ban_identity2.hide();
          } else {
            map.ban_identity2.show();
          }
          if (config.ban_identity == "off" || config.ban_identity2 == "off") {
            map.ban_identity3.hide();
          } else {
            map.ban_identity3.show();
          }
          map.zhong_card.hide();
          map.choose_group.show();
          map.auto_mark_identity.show();
          map.change_choice.show();
          map.free_choose.show();
          map.change_identity.show();
          if (config.player_number == "8") {
            map.special_identity.show();
          } else {
            map.special_identity.hide();
          }
          map.double_character.show();
          if (config.double_character) {
            map.double_hp.show();
          } else {
            map.double_hp.hide();
          }
        }
      },
      identity_mode: {
        name: "游戏模式",
        init: "normal",
        item: {
          normal: "标准",
          zhong: "明忠",
          stratagem: "谋攻",
          purple: "3v3v2",
        },
        restart: true,
        frequent: true,
        intro: "明忠模式与谋攻模式详见帮助",
      },
      player_number: {
        name: "游戏人数",
        init: "8",
        get item() {
          const minimumNumberOfPlayers = 2,
            maximumNumberOfPlayers = Math.max(
              _status.maximumNumberOfPlayers || 10,
              minimumNumberOfPlayers
            ),
            item = {};
          for (
            let playerNumber = minimumNumberOfPlayers;
            playerNumber <= maximumNumberOfPlayers;
            playerNumber++
          ) {
            item[playerNumber] = `${get.cnNumber(playerNumber)}人`;
          }
          return item;
        },
        frequent: true,
        restart: true,
      },
      double_nei: {
        name: "双内奸",
        init: false,
        restart: true,
        frequent: true,
        intro:
          "若游戏人数不大于9，则开启后游戏中将有两个内奸（内奸胜利条件仍为主内1v1时击杀主公）",
      },
      choose_group: {
        name: "神武将选择势力",
        init: true,
        restart: true,
        frequent: true,
        intro:
          "若开启此选项，选择神武将的玩家需在亮出自己的武将牌之前为自己选择一个势力。",
      },
      nei_fullscreenpop: {
        name: "主内单挑特效",
        intro: "在进入主内单挑时，弹出全屏文字特效",
        init: true,
        unfrequent: true,
      },
      double_character: {
        name: "双将模式",
        init: false,
        frequent: true,
        restart: true,
      },
      special_identity: {
        name: "特殊身份",
        init: false,
        restart: true,
        frequent: true,
        intro: "开启后游戏中将增加军师、大将、贼首三个身份",
      },
      zhong_card: {
        name: "明忠卡牌替换",
        init: true,
        frequent: true,
        restart: true,
      },
      double_hp: {
        name: "双将体力上限",
        init: "pingjun",
        item: {
          hejiansan: "和减三",
          pingjun: "平均值",
          zuidazhi: "最大值",
          zuixiaozhi: "最小值",
          zonghe: "相加",
        },
        restart: true,
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
      enhance_zhu: {
        name: "加强主公",
        init: "off",
        item: {
          off: "关闭",
          sixiang: "四象标记",
          specific: "专属技能",
        },
        restart: true,
        intro:
          "为主公增加一个额外技能。<br><li>四象标记：主公随机获得一个四象标记（限发动一次）；每个回合结束时，若场上没有反贼，主公失去此标记。<br><li>专属技能：至少三名反贼的身份场，主公获得一个专属技能（无则改为〖天命〗）；一名角色阵亡后，若存活反贼数小于3，主公失去此技能。",
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
      round_one_use_fury: {
        name: "开启首轮强化卡牌",
        init: false,
        frequent: false,
        restart: true,
        intro:
          "谋攻篇规则为第二轮开始才可使用怒气强化卡牌，开启此选项从游戏开始即可强化卡牌。",
      },
      nei_auto_mark_camouflage: {
        name: "内奸自动标记伪装反贼",
        intro: "玩家内奸在游戏开始洞察结束后，自动将被洞察角色标记为反贼。",
        init: false,
        unfrequent: true,
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
      revive: {
        name: "死亡后显示复活",
        init: false,
        onclick(bool) {
          game.saveConfig("revive", bool, this._link.config.mode);
          if (get.config("revive") && get.mode() == "identity") {
            if (!ui.revive && game.me.isDead()) {
              ui.revive = ui.create.control("revive", ui.click.dierevive);
            }
          } else if (ui.revive) {
            ui.revive.close();
            delete ui.revive;
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
          nei: "内奸",
          fan: "反贼",
        },
      },
      ban_identity2: {
        name: "屏蔽身份2",
        init: "off",
        item: {
          off: "关闭",
          zhu: "主公",
          zhong: "忠臣",
          nei: "内奸",
          fan: "反贼",
        },
      },
      ban_identity3: {
        name: "屏蔽身份3",
        init: "off",
        item: {
          off: "关闭",
          zhu: "主公",
          zhong: "忠臣",
          nei: "内奸",
          fan: "反贼",
        },
      },
      ai_strategy: {
        name: "内奸策略",
        init: "ai_strategy_1",
        item: {
          ai_strategy_1: "均衡",
          ai_strategy_2: "偏反",
          ai_strategy_3: "偏忠",
          ai_strategy_4: "酱油",
          ai_strategy_5: "天使",
          ai_strategy_6: "仇主",
        },
        intro: "设置内奸对主忠反的态度",
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
      choice_zhu: {
        name: "主公候选武将数",
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
          game.saveConfig("choice_zhu", num, "identity");
        },
      },
      limit_zhu: {
        name: "常备主候选武将数",
        init: "group",
        restart: true,
        item: {
          off: "不限制",
          group: "按势力筛选",
          3: "三",
          4: "四",
          6: "六",
          8: "八",
        },
      },
      choice_zhong: {
        name: "忠臣候选武将数",
        init: 4,
        input: true,
        restart: true,
        onblur(e) {
          let text = e.target,
            num = Number(text.innerText);
          if (isNaN(num) || num < 2) {
            num = 4;
          } else if (!Number.isInteger(num)) {
            num = Math.round(num);
          }
          text.innerText = num;
          game.saveConfig("choice_zhong", num, "identity");
        },
      },
      choice_nei: {
        name: "内奸候选武将数",
        init: 6,
        input: true,
        restart: true,
        onblur(e) {
          let text = e.target,
            num = Number(text.innerText);
          if (isNaN(num) || num < 2) {
            num = 6;
          } else if (!Number.isInteger(num)) {
            num = Math.round(num);
          }
          text.innerText = num;
          game.saveConfig("choice_nei", num, "identity");
        },
      },
      choice_fan: {
        name: "反贼候选武将数",
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
          game.saveConfig("choice_fan", num, "identity");
        },
      },
      enable_commoner: {
        name: "启用平民",
        init: false,
        restart: true,
        frequent: false,
        intro:
          "开启后游戏中将有一个平民（身份）加入游戏。<br>具体规则请查看帮助。",
      },
      choice_commoner: {
        name: "平民候选武将数",
        init: 4,
        input: true,
        restart: true,
        onblur(e) {
          let text = e.target,
            num = Number(text.innerText);
          if (isNaN(num) || num < 2) {
            num = 4;
          } else if (!Number.isInteger(num)) {
            num = Math.round(num);
          }
          text.innerText = num;
          game.saveConfig("choice_commoner", num, "identity");
        },
      },
      enable_year_limit: {
        name: "启用年机制",
        init: false,
        restart: true,
        frequent: false,
        intro: "开启后将会加入年机制。<br>年机制的具体规则请查看帮助。",
      },
      enable_mingcha: {
        name: "启用明察",
        init: false,
        restart: true,
        frequent: false,
        intro: "开启后主公将获得技能〖明察〗。",
      },
    },
  },
  single: {
    name: "单挑",
    connect: {
      connect_single_mode: {
        name: "游戏模式",
        init: "normal",
        item: {
          normal: "新1v1",
          dianjiang: "点将单挑",
          changban: "血战长坂坡",
          wuxianhuoli: "无限火力",
        },
        restart: true,
        frequent: true,
        intro: "血战长坂坡和无限火力模式详见帮助",
      },
      connect_enable_jin: {
        name: "启用晋势力武将",
        init: false,
        restart: true,
        frequent: true,
      },
      connect_change_card: {
        name: "启用手气卡",
        init: false,
        frequent: true,
      },
      connect_double_character: {
        name: "启用双将",
        init: "single",
        item: {
          single: "不启用",
          double: "启用双将",
          singble: "单双任选",
        },
        restart: true,
      },
      connect_double_hp: {
        name: "双将体力上限",
        init: "pingjun",
        item: {
          hejiansan: "和减三",
          pingjun: "平均值",
          zuidazhi: "最大值",
          zuixiaozhi: "最小值",
          zonghe: "相加",
        },
        restart: true,
      },
      update: function (config, map) {
        if (config.connect_single_mode != "normal") {
          map.connect_enable_jin.hide();
        } else {
          map.connect_enable_jin.show();
        }
        if (config.connect_single_mode != "wuxianhuoli") {
          map.connect_change_card.hide();
        } else {
          map.connect_change_card.show();
        }
        if (config.connect_single_mode != "dianjiang") {
          map.connect_double_character.hide();
          map.connect_double_hp.hide();
        } else {
          map.connect_double_character.show();
          if (["double", "singble"].includes(config.connect_double_character)) {
            map.connect_double_hp.show();
          } else {
            map.connect_double_hp.hide();
          }
        }
      },
    },
    config: {
      single_mode: {
        name: "游戏模式",
        init: "normal",
        item: {
          normal: "新1v1",
          dianjiang: "点将单挑",
          changban: "血战长坂坡",
          wuxianhuoli: "无限火力",
        },
        restart: true,
        frequent: true,
        intro: "血战长坂坡和无限火力模式详见帮助",
      },
      enable_jin: {
        name: "启用晋势力武将",
        init: false,
        restart: true,
        frequent: true,
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
      double_character: {
        name: "启用双将",
        init: "single",
        item: {
          single: "不启用",
          double: "启用双将",
          singble: "单双任选",
        },
        restart: true,
      },
      double_hp: {
        name: "双将体力上限",
        init: "pingjun",
        item: {
          hejiansan: "和减三",
          pingjun: "平均值",
          zuidazhi: "最大值",
          zuixiaozhi: "最小值",
          zonghe: "相加",
        },
        restart: true,
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
        if (config.single_mode != "normal") {
          map.enable_jin.hide();
        } else {
          map.enable_jin.show();
        }
        if (config.single_mode != "wuxianhuoli") {
          map.change_card.hide();
        } else {
          map.change_card.show();
        }
        if (config.single_mode != "dianjiang") {
          map.double_character.hide();
          map.double_hp.hide();
          map.single_control.hide();
        } else {
          map.double_character.show();
          map.single_control.show();
          if (["double", "singble"].includes(config.double_character)) {
            map.double_hp.show();
          } else {
            map.double_hp.hide();
          }
        }
        if (
          config.single_mode == "wuxianhuoli" ||
          config.single_mode == "dianjiang"
        ) {
          map.free_choose.show();
        } else {
          map.free_choose.hide();
        }
      },
    },
  },
};
