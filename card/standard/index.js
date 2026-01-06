import { lib, game, ui, get, ai, _status } from "../../noname.js";
import card from "./card.js";
import skill from "./skill.js";
import translate from "./translate.js";
import list from "./list.js";

export function aaa() {
  return { name: "standard", connect: true, card, skill, translate, list };
}

game.import("card", aaa);
