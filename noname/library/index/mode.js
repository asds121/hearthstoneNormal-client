export default {
  identity: {
    name: "身份",
    config: {
      identity_mode: {
        name: "游戏模式",
        init: "normal",
        item: {
          normal: "标准身份",
          rebel: "野心家",
        },
        restart: true,
        frequent: true,
      },
      player_number: {
        name: "玩家人数",
        init: 8,
        item: {
          4: "4人",
          5: "5人",
          6: "6人",
          7: "7人",
          8: "8人",
        },
        restart: true,
      },
      roles: {
        name: "身份配置",
        init: "default",
        item: {
          default: "默认",
          few: "少主公",
          more: "多主公",
        },
        restart: true,
      },
      free_choose: {
        name: "自由选将",
        init: false,
      },
      change_identity: {
        name: "副将可改身份",
        init: true,
      },
      update: function (config, map) {
        if (map.identity_mode) map.identity_mode.show();
        if (map.player_number) map.player_number.show();
        if (map.roles) map.roles.show();
        if (map.free_choose) map.free_choose.show();
      },
    },
  },
  single: {
    name: "单挑",
    //todo：已删掉属性connect
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
      change_card: {
        name: "开启手气卡",
        init: "unlimited",
        item: {
          disabled: "禁用",
          unlimited: "无限",
        },
      },
      single_control: {
        name: "单人控制",
        intro: "由玩家操作点将单挑的两名游戏角色",
        init: false,
        restart: true,
      },
    },
  },
};
