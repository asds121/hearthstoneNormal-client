import { lib, game, ui, get, ai, _status } from "../../../../noname.js";
import card from "./split/index.js";
import skill from "./skill.js";
import translate from "./translate.js";
import list from "./list.js";

export const type = "card";

export default () => {
  return { name: "standard", connect: true, card, skill, translate, list };
};
