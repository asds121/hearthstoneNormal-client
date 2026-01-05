import { game } from '../game/index.js';
import { lib } from '../library/index.js';
import { importExtension } from '../init/import.js';

/**
 * 扩展管理器 - 负责扩展的加载、初始化、卸载和生命周期管理
 */
export class ExtensionManager {
  constructor() {
    this.extensions = new Map();
    this.loadedExtensions = new Set();
    this.extensionDependencies = new Map();
    this.extensionEvents = new Map();
  }

  /**
   * 初始化扩展管理器
   */
  async init() {
    // 加载所有已配置的扩展
    const extensions = lib.config.extensions || [];
    await this.loadExtensions(extensions);
  }

  /**
   * 加载多个扩展
   * @param {string[]} extensionNames - 要加载的扩展名列表
   */
  async loadExtensions(extensionNames) {
    for (const name of extensionNames) {
      await this.loadExtension(name);
    }
  }

  /**
   * 加载单个扩展
   * @param {string} name - 要加载的扩展名
   */
  async loadExtension(name) {
    if (this.loadedExtensions.has(name)) {
      return; // 已经加载过
    }

    try {
      // 检查扩展是否被禁止
      if (Reflect.get(window, 'bannedExtensions')?.includes(name)) {
        console.warn(`扩展 ${name} 被禁止加载`);
        return;
      }

      // 检查扩展是否已被缓存
      const extcontent = localStorage.getItem(`${lib.configprefix}extension_${name}`);
      if (extcontent) {
        // 从缓存加载
        await this.loadExtensionFromCache(name, extcontent);
      } else {
        // 从文件加载
        await this.loadExtensionFromFile(name);
      }

      this.loadedExtensions.add(name);
      console.log(`扩展 ${name} 加载成功`);
      
      // 发布扩展加载完成事件
      this.publishEvent(`Extension.Loaded.${name}`, { name });
      this.publishEvent('Extension.Loaded', { name });
    } catch (error) {
      console.error(`扩展 ${name} 加载失败:`, error);
      this.publishEvent(`Extension.Error.${name}`, { name, error });
      this.publishEvent('Extension.Error', { name, error });
    }
  }

  /**
   * 从缓存加载扩展
   * @param {string} name - 扩展名
   * @param {string} content - 扩展内容
   */
  async loadExtensionFromCache(name, content) {
    _status.evaluatingExtension = true;
    try {
      // 使用安全的方式执行扩展代码
      const securityModule = await import('../util/security.js');
      await securityModule.default.eval(content);
    } finally {
      _status.evaluatingExtension = false;
    }
  }

  /**
   * 从文件加载扩展
   * @param {string} name - 扩展名
   */
  async loadExtensionFromFile(name) {
    await importExtension(name);
  }

  /**
   * 卸载扩展
   * @param {string} name - 要卸载的扩展名
   */
  async unloadExtension(name) {
    if (!this.loadedExtensions.has(name)) {
      return;
    }

    try {
      // 发布扩展卸载前事件
      this.publishEvent(`Extension.BeforeUnload.${name}`, { name });
      this.publishEvent('Extension.BeforeUnload', { name });

      // 清理扩展资源
      this.cleanupExtensionResources(name);

      // 从已加载扩展列表中移除
      this.loadedExtensions.delete(name);
      this.extensions.delete(name);

      console.log(`扩展 ${name} 卸载成功`);
      
      // 发布扩展卸载完成事件
      this.publishEvent(`Extension.Unloaded.${name}`, { name });
      this.publishEvent('Extension.Unloaded', { name });
    } catch (error) {
      console.error(`扩展 ${name} 卸载失败:`, error);
    }
  }

  /**
   * 清理扩展资源
   * @param {string} name - 扩展名
   */
  cleanupExtensionResources(name) {
    // 清理扩展相关的配置
    game.saveConfig(`extension_${name}_enable`, false);
    
    // 清理扩展相关的事件监听器
    this.extensionEvents.delete(name);
    
    // 清理扩展相关的依赖
    this.extensionDependencies.delete(name);
  }

  /**
   * 重新加载扩展
   * @param {string} name - 要重新加载的扩展名
   */
  async reloadExtension(name) {
    await this.unloadExtension(name);
    await this.loadExtension(name);
  }

  /**
   * 获取已加载的扩展列表
   * @returns {string[]} - 已加载的扩展名列表
   */
  getLoadedExtensions() {
    return Array.from(this.loadedExtensions);
  }

  /**
   * 检查扩展是否已加载
   * @param {string} name - 扩展名
   * @returns {boolean} - 是否已加载
   */
  isExtensionLoaded(name) {
    return this.loadedExtensions.has(name);
  }

  /**
   * 注册扩展依赖关系
   * @param {string} extensionName - 扩展名
   * @param {string[]} dependencies - 依赖的扩展名列表
   */
  registerExtensionDependencies(extensionName, dependencies) {
    this.extensionDependencies.set(extensionName, dependencies);
  }

  /**
   * 获取扩展依赖关系
   * @param {string} extensionName - 扩展名
   * @returns {string[]} - 依赖的扩展名列表
   */
  getExtensionDependencies(extensionName) {
    return this.extensionDependencies.get(extensionName) || [];
  }

  /**
   * 注册扩展事件监听器
   * @param {string} eventName - 事件名称
   * @param {Function} callback - 事件回调函数
   */
  on(eventName, callback) {
    if (!this.extensionEvents.has(eventName)) {
      this.extensionEvents.set(eventName, []);
    }
    this.extensionEvents.get(eventName).push(callback);
  }

  /**
   * 发布扩展事件
   * @param {string} eventName - 事件名称
   * @param {Object} data - 事件数据
   */
  publishEvent(eventName, data) {
    if (this.extensionEvents.has(eventName)) {
      const callbacks = this.extensionEvents.get(eventName);
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`扩展事件 ${eventName} 执行失败:`, error);
        }
      });
    }
  }

  /**
   * 移除扩展事件监听器
   * @param {string} eventName - 事件名称
   * @param {Function} callback - 事件回调函数
   */
  off(eventName, callback) {
    if (this.extensionEvents.has(eventName)) {
      const callbacks = this.extensionEvents.get(eventName);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
      if (callbacks.length === 0) {
        this.extensionEvents.delete(eventName);
      }
    }
  }

  /**
   * 重置扩展管理器
   */
  reset() {
    this.extensions.clear();
    this.loadedExtensions.clear();
    this.extensionDependencies.clear();
    this.extensionEvents.clear();
  }
}

// 导出单例实例
export const extensionManager = new ExtensionManager();
