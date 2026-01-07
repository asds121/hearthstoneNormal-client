export interface CardBasicAIConfig {
  useful?: number | number[] | ((card: any, index?: number) => number);
  value?: number | number[] | ((card: any, player?: any) => number);
  order?: number | ((card: any, player?: any) => number);
  equipValue?: number | ((card: any, player?: any) => number);
}

export interface CardAIResultConfig {
  player?: number | ((player: any, target: any, card?: any) => number);
  target?: number | ((player: any, target: any, card?: any, isLink?: any) => number);
  target_use?: ((player: any, target: any, card?: any) => number);
}

export interface CardAITagConfig {
  [key: string]: number | ((card: any, nature?: string) => number | undefined);
}

export interface CardAIConfig {
  basic?: CardBasicAIConfig;
  result?: CardAIResultConfig;
  tag?: CardAITagConfig;
  order?: number | ((card: any, player?: any) => number);
  wuxie?: ((target: any, card: any, player: any, viewer: any, status: number) => number);
}

export interface CardConfig {
  [cardName: string]: {
    audio?: boolean;
    fullskin?: boolean;
    type: 'basic' | 'trick' | 'equip' | 'subtype' | string;
    subtype?: string;
    cardcolor?: string;
    notarget?: boolean;
    nodelay?: boolean;
    enable?: boolean | ((card: any, player: any) => boolean);
    usable?: number;
    updateUsable?: string;
    range?: ((card: any, player: any, target: any) => boolean);
    selectTarget?: number;
    cardPrompt?: ((card: any) => string);
    filterTarget?: ((card: any, player: any, target: any) => boolean);
    modTarget?: ((card: any, player: any, target: any) => boolean);
    reverseOrder?: boolean;
    defaultYingbianEffect?: string;
    skills?: string[];
    bingzhu?: string[];
    distance?: {
      attackFrom?: number;
      [key: string]: any;
    };
    content?: ((event: any, trigger?: any, player?: any) => void) | ((event: any, trigger?: any, player?: any) => Promise<void>);
    ai?: CardAIConfig;
    [key: string]: any;
  };
}

export interface SkillConfig {
  [skillName: string]: {
    [key: string]: any;
  };
}

export interface TranslateConfig {
  [key: string]: string;
}

export interface ListConfig {
  [key: string]: any;
}

export interface CardPackConfig {
  name: string;
  connect: boolean;
  card: CardConfig;
  skill: SkillConfig;
  translate: TranslateConfig;
  list: ListConfig;
}

export default () => CardPackConfig;
