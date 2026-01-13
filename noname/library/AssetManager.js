class AssetManager {
  static #configs = new Map();
  static #currentExtension = null;

  static async load(extensionName) {
    try {
      const response = await fetch(`extension/${extensionName}/assets.json`);
      if (!response.ok) {
        throw new Error(
          `Failed to load assets.json for ${extensionName}: ${response.status}`
        );
      }
      const config = await response.json();
      this.#configs.set(extensionName, config);
      this.#currentExtension = extensionName;
      return config;
    } catch (error) {
      console.error(
        `[AssetManager] Failed to load config for ${extensionName}:`,
        error
      );
      throw error;
    }
  }

  static setExtension(extensionName) {
    if (!this.#configs.has(extensionName)) {
      throw new Error(
        `Extension "${extensionName}" not loaded. Call load() first.`
      );
    }
    this.#currentExtension = extensionName;
  }

  static getPath(category, filename, ext = null) {
    if (!this.#currentExtension) {
      throw new Error("No extension loaded. Call load() first.");
    }

    const config = this.#configs.get(this.#currentExtension);
    if (!config || !config.paths) {
      throw new Error(
        `Invalid config for extension "${this.#currentExtension}"`
      );
    }

    const basePath = config.paths[category];
    if (!basePath) {
      throw new Error(
        `Category "${category}" not found in extension "${this.#currentExtension}"`
      );
    }

    let finalFilename = filename;
    let finalExt = ext;

    if (finalExt) {
      // If ext is provided, strip any existing extension from filename
      const lastDotIndex = finalFilename.lastIndexOf(".");
      if (lastDotIndex !== -1) {
        finalFilename = finalFilename.substring(0, lastDotIndex);
      }
    } else {
      // Check if filename already has an extension
      const lastDotIndex = finalFilename.lastIndexOf(".");
      if (lastDotIndex !== -1) {
        // Filename has extension, use it
        finalExt = finalFilename.substring(lastDotIndex);
        finalFilename = finalFilename.substring(0, lastDotIndex);
      } else {
        // No extension, get default
        finalExt = this.#getDefaultExtension(category, config);
      }
    }

    // Handle ext: prefix
    let fullPath = basePath + finalFilename + finalExt;
    if (fullPath.startsWith('ext:')) {
      fullPath = `extension/${this.#currentExtension}/${fullPath.substring(4)}`;
    }
    return fullPath;
  }

  static getPaths(category, filenames, ext = null) {
    if (!Array.isArray(filenames)) {
      throw new Error("filenames must be an array");
    }

    return filenames.map((filename) => this.getPath(category, filename, ext));
  }

  static #getDefaultExtension(category, config) {
    // Check if categoryTypes exists in config and has the category
    if (config.categoryTypes && config.categoryTypes[category]) {
      const extType = config.categoryTypes[category];
      const exts =
        config.extensions && config.extensions[extType]
          ? config.extensions[extType]
          : [];
      return exts[0] || "";
    }

    // Fallback to existing logic with expanded categories
    const imageCategories = [
      "card",
      "character",
      "cardback",
      "decoration",
      "nature",
      "heroskill",
      "boss",
      "secret",
    ];
    const audioCategories = ["bgm", "announcer", "effect", "skill"];
    const fontCategories = ["decoFont", "font", "uiFont"];

    let extType = "image";
    if (imageCategories.includes(category)) {
      extType = "image";
    } else if (audioCategories.includes(category)) {
      extType = "audio";
    } else if (fontCategories.includes(category)) {
      extType = "font";
    }

    const exts =
      config.extensions && config.extensions[extType]
        ? config.extensions[extType]
        : [];
    return exts[0] || "";
  }

  static getConfig(extensionName) {
    if (extensionName) {
      return this.#configs.get(extensionName);
    }
    return this.#configs.get(this.#currentExtension);
  }

  static getConfigValue(keyPath, defaultValue = null) {
    if (!this.#currentExtension) {
      throw new Error("No extension loaded. Call load() first.");
    }

    const config = this.#configs.get(this.#currentExtension);
    if (!config) {
      return defaultValue;
    }

    const keys = keyPath.split(".");
    let value = config;

    for (const key of keys) {
      if (
        value === null ||
        value === undefined ||
        typeof value !== "object" ||
        !(key in value)
      ) {
        return defaultValue;
      }
      value = value[key];
    }

    return value;
  }

  static getBasePath(category) {
    if (!this.#currentExtension) {
      throw new Error("No extension loaded. Call load() first.");
    }

    const config = this.#configs.get(this.#currentExtension);
    if (!config || !config.paths) {
      throw new Error(
        `Invalid config for extension "${this.#currentExtension}"`
      );
    }

    const basePath = config.paths[category];
    if (!basePath) {
      throw new Error(
        `Category "${category}" not found in extension "${this.#currentExtension}"`
      );
    }

    // Handle ext: prefix
    if (basePath.startsWith('ext:')) {
      return `extension/${this.#currentExtension}/${basePath.substring(4)}`;
    }
    return basePath;
  }

  static hasCategory(category) {
    if (!this.#currentExtension) {
      return false;
    }

    const config = this.#configs.get(this.#currentExtension);
    return (
      config &&
      config.paths &&
      Object.prototype.hasOwnProperty.call(config.paths, category)
    );
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
