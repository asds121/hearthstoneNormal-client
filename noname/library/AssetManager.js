class AssetManager {
  static #configs = new Map();
  static #currentExtension = null;

  static async load(extensionName) {
    try {
      const response = await fetch(`extension/${extensionName}/assets.json`);
      if (!response.ok) {
        throw new Error(`Failed to load assets.json for ${extensionName}: ${response.status}`);
      }
      const config = await response.json();
      this.#configs.set(extensionName, config);
      this.#currentExtension = extensionName;
      return config;
    } catch (error) {
      console.error(`[AssetManager] Failed to load config for ${extensionName}:`, error);
      throw error;
    }
  }

  static setExtension(extensionName) {
    if (!this.#configs.has(extensionName)) {
      throw new Error(`Extension "${extensionName}" not loaded. Call load() first.`);
    }
    this.#currentExtension = extensionName;
  }

  static getPath(category, filename, ext = null) {
    if (!this.#currentExtension) {
      throw new Error('No extension loaded. Call load() first.');
    }

    const config = this.#configs.get(this.#currentExtension);
    if (!config || !config.paths) {
      throw new Error(`Invalid config for extension "${this.#currentExtension}"`);
    }

    const basePath = config.paths[category];
    if (!basePath) {
      throw new Error(`Category "${category}" not found in extension "${this.#currentExtension}"`);
    }

    if (!ext) {
      ext = this.#getDefaultExtension(category, config);
    }

    return basePath + filename + ext;
  }

  static #getDefaultExtension(category, config) {
    const imageCategories = ['card', 'character', 'cardback', 'decoration', 'nature', 'heroskill', 'boss', 'secret'];
    const audioCategories = ['bgm', 'announcer', 'effect', 'skill'];

    let extType = 'image';
    if (imageCategories.includes(category)) {
      extType = 'image';
    } else if (audioCategories.includes(category)) {
      extType = 'audio';
    }

    const exts = config.extensions && config.extensions[extType] ? config.extensions[extType] : [];
    return exts[0] || '';
  }

  static getConfig(extensionName) {
    if (extensionName) {
      return this.#configs.get(extensionName);
    }
    return this.#configs.get(this.#currentExtension);
  }

  static hasExtension(extensionName) {
    return this.#configs.has(extensionName);
  }

  static getCurrentExtension() {
    return this.#currentExtension;
  }

  static clear() {
    this.#configs.clear();
    this.#currentExtension = null;
  }
}

export default AssetManager;
