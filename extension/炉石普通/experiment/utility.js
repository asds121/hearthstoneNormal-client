import { lib, game, ui, get, ai, _status } from "../../../noname.js";

// 封装的乱七八糟的，有时间再推倒重写了
class Utility {
	static type = "extension";

	static #instance = null;

	static getInstance() {
		if (!this.#instance) {
			this.#instance = new this();
		}
		return this.#instance;
	}

	#basicPath = lib.init.getCurrentFileLocation(import.meta.url);
	constructor() {
		if (Utility.#instance) {
			throw new Error("Cannot create another instance of Utility");
		}

		const componentPath = "/experiment/utility.js";
		const rootPath = this.#basicPath.slice(0, this.#basicPath.lastIndexOf(componentPath));

		this.extensionName = rootPath.slice(rootPath.lastIndexOf("/") + 1);
		this.extensionDirectoryPath = `${rootPath}/`;
	}

	getExtensionName() {
		return this.extensionName;
	}

	getExtensionRelativePath(path = "") {
		const PATH_CONSTANTS = {
			CODE: {
				key: "code",
				segment: "experiment/"
			},
			RESOURCE: {
				key: "resource",
				segment: "extension/炉石普通/resource/"
			},
			RESOURCE_ASSET: {
				key: "rst",
				segment: "extension/炉石普通/resource/asset/"
			},
			RESOURCE_IMAGE: {
				key: "resImg",
				segment: "extension/炉石普通/resource/image/"
			},
		};
		const matchedPath = Object.values(PATH_CONSTANTS).find(p => p.key === path);
		return matchedPath ? `${matchedPath.segment}` : "extension/炉石普通/";
	}

	// 扩展用到的中文名
	getExtensionNameSpace(noun = "") {
		const CONSTANT = {
			CARD: {
				key: "card",
				segment: "炉石传说"
			},
			CHARACTER: {
				key: "character",
				segment: "炉石传说"
			},
			MODE: {
				key: "mode",
				segment: "炉石传说"
			},
			SPLASH: {
				key: "splash",
				segment: "如真似幻"
			},
			OTHER: {
				key: "unknown",
				segment: "UNKNOWN"
			},
		};
		const matchedNoun = Object.values(CONSTANT).find(p => p.key === noun);
		return matchedNoun ? matchedNoun.segment : "炉石传说";
	}

	// 扩展用到的英文名
	getExtensionNoun(noun = "") {
		const CONSTANT = {
			CARD: {
				key: "mode",
				segment: "hs_hearthstone"
			},
			CHARACTER: {
				key: "character",
				segment: "HearthStone"
			},
			MODE: {
				key: "card",
				segment: "HearthStone"
			},
			OTHER: {
				key: "unknown",
				segment: "UNKNOWN"
			},
		};
		const matchedNoun = Object.values(CONSTANT).find(p => p.key === noun);
		return matchedNoun ? matchedNoun.segment : "HearthStone";
	}
}

const type = Utility.type;
const utility = Utility.getInstance();
export { type, utility }
