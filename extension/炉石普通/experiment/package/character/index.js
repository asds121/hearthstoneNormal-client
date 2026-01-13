import { lib, game, ui, get, ai, _status } from "../../../../../noname.js";
import { utility } from "../../utility.js";

import characters from "./character.js";
import cards from "./card.js";
import pinyins from "./pinyin.js";
import skills from "./skill.js";
import translates from "./translate.js";
import characterIntros from "./intro.js";
import characterTitles from "./characterTitles.js";
import characterFilters from "./characterFilter.js";
import dynamicTranslates from "./dynamicTranslate.js";
import voices from "./voices.js";
import { characterSort, characterSortTranslate } from "./sort.js";

export function characterModule() {
  const characterPack = {
    name: utility.extensionName,
    connect: true,
    connectBanned: [],
    character: {
      ...characters,
    },
    characterSort: {
      [utility.extensionName]: characterSort,
    },
    characterFilter: {
      ...characterFilters,
    },
    characterTitle: {
      ...characterTitles,
    },
    dynamicTranslate: {
      ...dynamicTranslates,
    },
    characterIntro: {
      ...characterIntros,
    },
    characterSubstitute: {},
    characterAppend: {},
    card: {
      ...cards,
    },
    skill: {
      ...skills,
    },

    translate: {
      ...voices,
      ...translates,
      ...characterSortTranslate,
      [utility.extensionName]: utility.getExtensionNameSpace("character"),
      [`${utility.extensionName}_charactersInfo`]: "",
    },
    pinyins: {
      ...pinyins,
    },
  };
  for (const i in characterPack.character) {
    if (i === "hs_player" || i === "hs_comp") {
      continue;
    }
    characterPack.character[i].img =
      `${utility.extensionDirectoryPath}resource/asset/duelist/${i}.jpg`;
    characterPack.character[i].dieAudios = [];
    characterPack.character[i].dieAudios.push(
      `${utility.extensionDirectoryPath}resource/audio/duelist/${i}/死亡.ogg`
    );
  }
  return characterPack;
}
