import { get } from '../get/index.js';
import { lib } from '../library/index.js';
import { _status } from '../status/index.js';
import { gameState } from './GameState.js';

/**
 * 游戏事件管理器 - 负责处理游戏中的各种事件
 */
export class GameEventManager {
  constructor() {
    this.eventListeners = new Map();
    this.globalEvents = new Map();
    this.eventHistory = [];
    this.currentEvent = null;
    this.eventQueue = [];
  }

  /**
   * 初始化事件管理器
   */
  init() {
    this.reset();
  }

  /**
   * 重置事件管理器
   */
  reset() {
    this.eventListeners.clear();
    this.globalEvents.clear();
    this.eventHistory = [];
    this.currentEvent = null;
    this.eventQueue = [];
  }

  /**
   * 注册事件监听器
   * @param {string} eventName - 事件名称
   * @param {Function} callback - 事件回调函数
   * @param {Object} [options] - 事件选项
   * @returns {Function} - 取消监听的函数
   */
  on(eventName, callback, options = {}) {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, []);
    }
    
    const listener = {
      callback,
      options
    };
    
    this.eventListeners.get(eventName).push(listener);
    
    // 返回取消监听的函数
    return () => {
      this.off(eventName, callback);
    };
  }

  /**
   * 移除事件监听器
   * @param {string} eventName - 事件名称
   * @param {Function} callback - 事件回调函数
   */
  off(eventName, callback) {
    if (!this.eventListeners.has(eventName)) {
      return;
    }
    
    const listeners = this.eventListeners.get(eventName);
    const index = listeners.findIndex(listener => listener.callback === callback);
    
    if (index > -1) {
      listeners.splice(index, 1);
    }
    
    // 如果没有更多监听器，移除事件
    if (listeners.length === 0) {
      this.eventListeners.delete(eventName);
    }
  }

  /**
   * 触发事件
   * @param {string} eventName - 事件名称
   * @param {Object} [data] - 事件数据
   * @returns {Promise<any[]>} - 事件处理结果
   */
  async emit(eventName, data = {}) {
    const event = {
      name: eventName,
      data,
      timestamp: Date.now(),
      phase: gameState.getPhase(),
      round: gameState.getRoundNumber()
    };
    
    // 保存当前事件
    const previousEvent = this.currentEvent;
    this.currentEvent = event;
    
    // 添加到事件历史
    this.eventHistory.push(event);
    
    try {
      // 获取所有监听器
      const listeners = this.eventListeners.get(eventName) || [];
      const results = [];
      
      // 执行所有监听器
      for (const listener of listeners) {
        try {
          const result = await listener.callback(event);
          results.push(result);
        } catch (error) {
          console.error(`事件 ${eventName} 监听器执行失败:`, error);
        }
      }
      
      // 执行全局监听器
      const globalListeners = this.eventListeners.get('*') || [];
      for (const listener of globalListeners) {
        try {
          const result = await listener.callback(event);
          results.push(result);
        } catch (error) {
          console.error(`全局事件监听器执行失败:`, error);
        }
      }
      
      return results;
    } finally {
      // 恢复之前的事件
      this.currentEvent = previousEvent;
    }
  }

  /**
   * 注册全局事件
   * @param {string} eventName - 事件名称
   * @param {Object} eventConfig - 事件配置
   */
  registerGlobalEvent(eventName, eventConfig) {
    this.globalEvents.set(eventName, eventConfig);
  }

  /**
   * 获取全局事件配置
   * @param {string} eventName - 事件名称
   * @returns {Object|null} - 事件配置
   */
  getGlobalEvent(eventName) {
    return this.globalEvents.get(eventName) || null;
  }

  /**
   * 获取当前事件
   * @returns {Object|null} - 当前事件
   */
  getCurrentEvent() {
    return this.currentEvent;
  }

  /**
   * 获取事件历史
   * @param {number} [limit] - 返回的事件数量限制
   * @returns {Object[]} - 事件历史
   */
  getEventHistory(limit = 100) {
    if (limit <= 0) {
      return this.eventHistory;
    }
    return this.eventHistory.slice(-limit);
  }

  /**
   * 清空事件历史
   */
  clearEventHistory() {
    this.eventHistory = [];
  }

  /**
   * 检查事件是否存在
   * @param {string} eventName - 事件名称
   * @returns {boolean} - 事件是否存在
   */
  hasEvent(eventName) {
    return this.eventListeners.has(eventName);
  }

  /**
   * 获取事件监听器数量
   * @param {string} eventName - 事件名称
   * @returns {number} - 监听器数量
   */
  getListenerCount(eventName) {
    const listeners = this.eventListeners.get(eventName);
    return listeners ? listeners.length : 0;
  }

  /**
   * 批量注册事件监听器
   * @param {Object} listeners - 事件监听器映射
   * @returns {Function} - 批量取消监听的函数
   */
  registerListeners(listeners) {
    const removeListeners = [];
    
    for (const [eventName, callback] of Object.entries(listeners)) {
      const removeListener = this.on(eventName, callback);
      removeListeners.push(removeListener);
    }
    
    return () => {
      removeListeners.forEach(remove => remove());
    };
  }

  /**
   * 延迟触发事件
   * @param {string} eventName - 事件名称
   * @param {Object} [data] - 事件数据
   * @param {number} [delay] - 延迟时间（毫秒）
   * @returns {Promise<void>} - 延迟触发的Promise
   */
  delayEmit(eventName, data = {}, delay = 1000) {
    return new Promise(resolve => {
      setTimeout(async () => {
        await this.emit(eventName, data);
        resolve();
      }, delay);
    });
  }

  /**
   * 创建事件链
   * @param {Array<{name: string, data?: Object, delay?: number}>} events - 事件链配置
   * @returns {Promise<void>} - 事件链执行完成的Promise
   */
  async createEventChain(events) {
    for (const event of events) {
      if (event.delay) {
        await this.delayEmit(event.name, event.data || {}, event.delay);
      } else {
        await this.emit(event.name, event.data || {});
      }
    }
  }

  /**
   * 过滤事件历史
   * @param {Function} filter - 过滤函数
   * @returns {Object[]} - 过滤后的事件历史
   */
  filterEventHistory(filter) {
    return this.eventHistory.filter(filter);
  }

  /**
   * 查找最近的事件
   * @param {string} eventName - 事件名称
   * @returns {Object|null} - 最近的事件
   */
  findRecentEvent(eventName) {
    return this.eventHistory.reverse().find(event => event.name === eventName) || null;
  }
}

// 导出单例实例
export const gameEventManager = new GameEventManager();
