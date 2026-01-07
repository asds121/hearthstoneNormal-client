export type IdentityType = 'zhu' | 'zhong' | 'fan' | 'cai' | 'nei';

export interface IdentityGameConfig {
  canReplaceViewpoint: () => boolean;
  getState: () => {
    [playerId: string]: {
      identity: IdentityType;
      zhu?: boolean;
      zhong?: boolean;
      isZhu?: boolean;
      special_identity?: string;
      shown: number;
    };
  };
  updateState: (state: ReturnType<IdentityGameConfig['getState']>) => void;
  getRoomInfo: (uiintro: any) => void;
  getIdentityList: (player: any) => {
    fan: string;
    zhong: string;
    zhu: string;
    cai: string;
  } | undefined;
  getIdentityList2: (list: { [key: string]: string }) => void;
  getVideoName: () => string[];
  addRecord: (bool: boolean) => void;
  showIdentity: (me?: any) => void;
  checkResult: () => void;
  checkOnlineResult: (player: any) => boolean | null;
  chooseCharacter: () => void;
}

export interface IdentityTranslateConfig {
  zhu: string;
  zhong: string;
  fan: string;
  cai: string;
  zhu2: string;
  zhong2: string;
  fan2: string;
  random2: string;
  ai_strategy_1: string;
  ai_strategy_2: string;
  ai_strategy_3: string;
  ai_strategy_4: string;
  ai_strategy_5: string;
  ai_strategy_6: string;
  [key: string]: string;
}

export interface IdentityElementPlayerConfig {
  $dieAfter: () => void;
  dieAfter2: (source: any) => void;
  dieAfter: (source: any) => void;
  logAi: (targets: any | any[], card?: any) => void;
  showIdentity: () => void;
}

export interface IdentityElementGetConfig {
  identityList: (num: number) => IdentityType[];
  rawAttitude: (from: any, to: any) => number;
  situation: (absolute?: boolean) => number;
}

export interface IdentityElementConfig {
  player: IdentityElementPlayerConfig;
  content: { [key: string]: any };
  get: IdentityElementGetConfig;
  skill: { [key: string]: any };
  help: { [key: string]: string };
}

export interface IdentityGetConfig {
  identityList: (num: number) => IdentityType[];
  rawAttitude: (from: any, to: any) => number;
  situation: (absolute?: boolean) => number;
}

export interface IdentityConfig {
  name: string;
  start: () => void;
  game: IdentityGameConfig;
  translate: IdentityTranslateConfig;
  element: IdentityElementConfig;
  get: IdentityGetConfig;
  skill: { [key: string]: any };
  help: { [key: string]: string };
}

export interface PlayerIdentityInfo {
  identity: IdentityType;
  identityShown: boolean;
  special_identity?: string;
  isZhu?: boolean;
  ai: {
    shown: number;
    identity_mark?: 'finished' | 'fan' | 'zhong';
  };
}

export default () => IdentityConfig;
