import { lib, game, ui, get, ai, _status } from "../../../../../noname.js";

export default {
  damage: {
    ai: {
      result: {
        target: -1.5,
      },
      tag: {
        damage: 1,
      },
    },
  },
  draw: {
    ai: {
      result: {
        target: 1,
      },
      tag: {
        draw: 1,
      },
    },
  },
  losehp: {
    ai: {
      result: {
        target: -1.5,
      },
      tag: {
        loseHp: 1,
      },
    },
  },
  recover: {
    ai: {
      result: {
        target: 1.5,
      },
      tag: {
        recover: 1,
      },
    },
  },
  respondShan: {
    ai: {
      result: {
        target: -1.5,
      },
      tag: {
        respond: 1,
        respondShan: 1,
        damage: 1,
      },
    },
  },
};
