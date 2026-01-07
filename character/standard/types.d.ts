export type CharacterSex = 'male' | 'female';
export type CharacterGroup = 'wei' | 'wu' | 'shu' | 'qun' | string;

export interface CharacterConfig {
  [characterName: string]: {
    sex: CharacterSex;
    group: CharacterGroup;
    hp: number;
    skills: string[];
    names?: string;
  };
}

export interface CharacterSortConfig {
  [sortKey: string]: ((a: any, b: any) => number);
}

export interface CharacterFilterConfig {
  [filterKey: string]: {
    [key: string]: any;
  };
}

export interface CharacterTitleConfig {
  [characterName: string]: string;
}

export interface DynamicTranslateConfig {
  [key: string]: string;
}

export interface CharacterIntroConfig {
  [characterName: string]: string;
}

export interface CardConfig {
  [cardName: string]: {
    [key: string]: any;
  };
}

export interface SkillAIEffectConfig {
  target?: (card: any, player: any, target: any, current?: any) => number | [number, number];
  target_use?: (card: any, player: any, target: any) => void;
}

export interface SkillAIResultConfig {
  target?: (player: any, target: any) => number;
}

export interface SkillAIConfig {
  maixie?: boolean;
  maixie_defend?: boolean;
  maixie_hp?: boolean;
  effect?: SkillAIEffectConfig;
  threaten?: number;
  order?: number | ((skill: any, player: any) => number);
  result?: SkillAIResultConfig;
  unequip?: boolean;
  skillTagFilter?: (player: any, tag?: any, arg?: any) => boolean;
  respondSha?: boolean;
  directHit_ai?: boolean;
}

export interface SkillConfig {
  [skillName: string]: {
    audio?: number | string;
    audioname?: string[];
    audioname2?: { [key: string]: string };
    preHidden?: boolean | string[];
    trigger?: {
      player: string | string[];
      target?: string | string[];
    };
    filter?: (event: any, player: any) => boolean;
    check?: ((event: any, player: any) => boolean) | ((card: any) => number);
    logTarget?: string | ((trigger: any, player: any) => any);
    content?: (event: any, trigger: any, player: any) => Promise<void> | void;
    mod?: {
      [key: string]: Function;
    };
    locked?: boolean;
    enable?: string | string[];
    usable?: number;
    position?: string;
    filterCard?: boolean | Function | { name: string };
    selectCard?: [number, number] | [number, string];
    allowChooseAll?: boolean;
    prompt?: string;
    viewAs?: { name: string };
    viewAsFilter?: (player: any) => boolean;
    discard?: boolean;
    lose?: boolean;
    delay?: number;
    filterTarget?: (card: any, player: any, target: any) => boolean;
    subSkill?: { [key: string]: any };
    forced?: boolean;
    popup?: boolean;
    group?: string[];
    sourceSkill?: string;
    ai?: SkillAIConfig;
  };
}

export interface PerfectPairConfig {
  [characterName: string]: string[];
}

export interface TranslateConfig {
  [key: string]: string;
}

export interface PinyinConfig {
  [characterName: string]: string;
}

export interface CharacterPackConfig {
  name: string;
  connect: boolean;
  character: CharacterConfig;
  characterSort: {
    standard: CharacterSortConfig;
  };
  characterFilter: CharacterFilterConfig;
  characterTitle: CharacterTitleConfig;
  dynamicTranslate: DynamicTranslateConfig;
  characterIntro: CharacterIntroConfig;
  card: CardConfig;
  skill: SkillConfig;
  perfectPair: PerfectPairConfig;
  translate: TranslateConfig;
  pinyins: PinyinConfig;
}

export interface CharacterModule {
  (): CharacterPackConfig;
}

export default () => CharacterPackConfig