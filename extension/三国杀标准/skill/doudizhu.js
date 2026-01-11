import { lib, game, ui, get, ai, _status } from "../../../noname.js";

const skills = {
  doudizhu_viewHandcard: {
    ai: {
      viewHandcard: true,
      skillTagFilter(player, tag, target) {
        if (
          player == target ||
          player.identity != "fan" ||
          target.identity != "fan"
        ) {
          return false;
        }
      },
    },
  },
  //跋扈
  bahu: {
    charlotte: true,
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return (
        _status.mode != "online" &&
        _status.mode != "binglin" &&
        player == game.zhu
      );
    },
    forced: true,
    content() {
      player.draw();
    },
    mod: {
      cardUsable(card, player, num) {
        if (
          _status.mode != "online" &&
          _status.mode != "binglin" &&
          player == game.zhu &&
          card.name == "sha"
        ) {
          return num + 1;
        }
      },
    },
  },
};

export default skills;
