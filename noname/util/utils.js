import { device } from './index.js';

/**
 * 工具函数集合 - 提供常用的工具函数
 */
export const utils = {
  // 设备相关工具
  device: {
    isAndroid: device === 'android',
    isIOS: device === 'ios',
    isMobile: device === 'android' || device === 'ios',
    isDesktop: !device,
    getDeviceType: () => device || 'desktop'
  },

  // 数组工具
  array: {
    /**
     * 随机获取数组中的一个元素
     * @param {Array} arr - 源数组
     * @returns {*} - 随机获取的元素
     */
    randomGet(arr) {
      if (!Array.isArray(arr) || arr.length === 0) return undefined;
      return arr[Math.floor(Math.random() * arr.length)];
    },

    /**
     * 随机打乱数组
     * @param {Array} arr - 源数组
     * @returns {Array} - 打乱后的数组
     */
    randomSort(arr) {
      if (!Array.isArray(arr)) return arr;
      const newArr = [...arr];
      for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr;
    },

    /**
     * 合并数组，去重
     * @param {Array} arr1 - 第一个数组
     * @param {Array} arr2 - 第二个数组
     * @returns {Array} - 合并后的数组
     */
    merge(arr1, arr2) {
      if (!Array.isArray(arr1)) arr1 = [];
      if (!Array.isArray(arr2)) arr2 = [];
      return [...new Set([...arr1, ...arr2])];
    },

    /**
     * 从数组中移除指定元素
     * @param {Array} arr - 源数组
     * @param {*} item - 要移除的元素
     * @returns {Array} - 移除元素后的数组
     */
    remove(arr, item) {
      if (!Array.isArray(arr)) return arr;
      const index = arr.indexOf(item);
      if (index > -1) {
        arr.splice(index, 1);
      }
      return arr;
    },

    /**
     * 从数组中随机移除一个元素
     * @param {Array} arr - 源数组
     * @returns {*} - 移除的元素
     */
    randomRemove(arr) {
      if (!Array.isArray(arr) || arr.length === 0) return undefined;
      const index = Math.floor(Math.random() * arr.length);
      return arr.splice(index, 1)[0];
    }
  },

  // 对象工具
  object: {
    /**
     * 深拷贝对象
     * @param {Object} obj - 源对象
     * @returns {Object} - 拷贝后的对象
     */
    deepClone(obj) {
      if (obj === null || typeof obj !== 'object') return obj;
      if (obj instanceof Date) return new Date(obj.getTime());
      if (obj instanceof Array) return obj.map(item => this.deepClone(item));
      if (typeof obj === 'object') {
        const clonedObj = {};
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            clonedObj[key] = this.deepClone(obj[key]);
          }
        }
        return clonedObj;
      }
    },

    /**
     * 合并对象
     * @param {Object} target - 目标对象
     * @param {...Object} sources - 源对象
     * @returns {Object} - 合并后的对象
     */
    merge(target, ...sources) {
      if (!sources.length) return target;
      const source = sources.shift();

      if (this.isObject(target) && this.isObject(source)) {
        for (const key in source) {
          if (this.isObject(source[key])) {
            if (!target[key]) Object.assign(target, { [key]: {} });
            this.merge(target[key], source[key]);
          } else {
            Object.assign(target, { [key]: source[key] });
          }
        }
      }

      return this.merge(target, ...sources);
    },

    /**
     * 检查是否是对象
     * @param {*} obj - 要检查的值
     * @returns {boolean} - 是否是对象
     */
    isObject(obj) {
      return obj !== null && typeof obj === 'object' && obj.constructor === Object;
    },

    /**
     * 获取对象的键值对数组
     * @param {Object} obj - 源对象
     * @returns {Array<[string, *]>} - 键值对数组
     */
    entries(obj) {
      return Object.entries(obj);
    },

    /**
     * 从键值对数组创建对象
     * @param {Array<[string, *]>} entries - 键值对数组
     * @returns {Object} - 创建的对象
     */
    fromEntries(entries) {
      return Object.fromEntries(entries);
    }
  },

  // 字符串工具
  string: {
    /**
     * 首字母大写
     * @param {string} str - 源字符串
     * @returns {string} - 首字母大写的字符串
     */
    capitalize(str) {
      if (typeof str !== 'string' || str.length === 0) return str;
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * 驼峰命名转下划线命名
     * @param {string} str - 源字符串
     * @returns {string} - 下划线命名的字符串
     */
    camelToSnake(str) {
      if (typeof str !== 'string') return str;
      return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    },

    /**
     * 下划线命名转驼峰命名
     * @param {string} str - 源字符串
     * @returns {string} - 驼峰命名的字符串
     */
    snakeToCamel(str) {
      if (typeof str !== 'string') return str;
      return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    },

    /**
     * 生成随机字符串
     * @param {number} length - 字符串长度
     * @returns {string} - 随机字符串
     */
    random(length = 8) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }
  },

  // 函数工具
  func: {
    /**
     * 防抖函数
     * @param {Function} func - 要防抖的函数
     * @param {number} wait - 等待时间（毫秒）
     * @param {boolean} immediate - 是否立即执行
     * @returns {Function} - 防抖后的函数
     */
    debounce(func, wait, immediate = false) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          timeout = null;
          if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
      };
    },

    /**
     * 节流函数
     * @param {Function} func - 要节流的函数
     * @param {number} limit - 时间限制（毫秒）
     * @returns {Function} - 节流后的函数
     */
    throttle(func, limit) {
      let inThrottle;
      return function(...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },

    /**
     * 延迟执行函数
     * @param {Function} func - 要执行的函数
     * @param {number} delay - 延迟时间（毫秒）
     * @returns {Function} - 延迟执行的函数
     */
    delay(func, delay) {
      return setTimeout(func, delay);
    },

    /**
     * 检查是否是函数
     * @param {*} func - 要检查的值
     * @returns {boolean} - 是否是函数
     */
    isFunction(func) {
      return typeof func === 'function';
    }
  },

  // 时间工具
  time: {
    /**
     * 格式化时间
     * @param {Date} date - 日期对象
     * @param {string} format - 格式字符串
     * @returns {string} - 格式化后的时间字符串
     */
    format(date, format = 'YYYY-MM-DD HH:mm:ss') {
      if (!(date instanceof Date)) date = new Date(date);
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
    },

    /**
     * 获取当前时间戳
     * @returns {number} - 当前时间戳
     */
    timestamp() {
      return Date.now();
    },

    /**
     * 计算两个日期之间的差值
     * @param {Date} date1 - 第一个日期
     * @param {Date} date2 - 第二个日期
     * @param {string} unit - 时间单位（ms, s, m, h, d）
     * @returns {number} - 时间差值
     */
    diff(date1, date2, unit = 'ms') {
      if (!(date1 instanceof Date)) date1 = new Date(date1);
      if (!(date2 instanceof Date)) date2 = new Date(date2);
      
      const diffMs = Math.abs(date1.getTime() - date2.getTime());
      
      switch (unit) {
        case 's': return Math.floor(diffMs / 1000);
        case 'm': return Math.floor(diffMs / (1000 * 60));
        case 'h': return Math.floor(diffMs / (1000 * 60 * 60));
        case 'd': return Math.floor(diffMs / (1000 * 60 * 60 * 24));
        default: return diffMs;
      }
    }
  },

  // 异步工具
  async: {
    /**
     * 等待指定时间
     * @param {number} ms - 等待时间（毫秒）
     * @returns {Promise<void>} - 等待完成的Promise
     */
    wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * 并行执行异步函数，限制并发数量
     * @param {Array<Function>} tasks - 异步函数数组
     * @param {number} limit - 并发限制
     * @returns {Promise<Array<any>>} - 执行结果数组
     */
    async parallelLimit(tasks, limit) {
      const results = [];
      const executing = [];
      
      for (const task of tasks) {
        const p = Promise.resolve().then(() => task());
        results.push(p);
        
        if (limit <= tasks.length) {
          const e = p.then(() => executing.splice(executing.indexOf(e), 1));
          executing.push(e);
          
          if (executing.length >= limit) {
            await Promise.race(executing);
          }
        }
      }
      
      return Promise.all(results);
    }
  },

  // DOM工具
  dom: {
    /**
     * 创建DOM元素
     * @param {string} tag - 标签名
     * @param {Object} attributes - 属性对象
     * @param {string|Node} content - 内容
     * @returns {HTMLElement} - 创建的DOM元素
     */
    createElement(tag, attributes = {}, content = '') {
      const element = document.createElement(tag);
      
      for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
      }
      
      if (typeof content === 'string') {
        element.textContent = content;
      } else if (content instanceof Node) {
        element.appendChild(content);
      }
      
      return element;
    },

    /**
     * 获取DOM元素
     * @param {string} selector - CSS选择器
     * @param {HTMLElement} parent - 父元素
     * @returns {HTMLElement|null} - 获取的DOM元素
     */
    getElement(selector, parent = document) {
      return parent.querySelector(selector);
    },

    /**
     * 获取多个DOM元素
     * @param {string} selector - CSS选择器
     * @param {HTMLElement} parent - 父元素
     * @returns {NodeList} - 获取的DOM元素列表
     */
    getElements(selector, parent = document) {
      return parent.querySelectorAll(selector);
    }
  },

  // 类型检查工具
  type: {
    /**
     * 检查是否是数组
     * @param {*} value - 要检查的值
     * @returns {boolean} - 是否是数组
     */
    isArray(value) {
      return Array.isArray(value);
    },

    /**
     * 检查是否是字符串
     * @param {*} value - 要检查的值
     * @returns {boolean} - 是否是字符串
     */
    isString(value) {
      return typeof value === 'string';
    },

    /**
     * 检查是否是数字
     * @param {*} value - 要检查的值
     * @returns {boolean} - 是否是数字
     */
    isNumber(value) {
      return typeof value === 'number' && isFinite(value);
    },

    /**
     * 检查是否是布尔值
     * @param {*} value - 要检查的值
     * @returns {boolean} - 是否是布尔值
     */
    isBoolean(value) {
      return typeof value === 'boolean';
    },

    /**
     * 检查是否是对象
     * @param {*} value - 要检查的值
     * @returns {boolean} - 是否是对象
     */
    isObject(value) {
      return value !== null && typeof value === 'object' && value.constructor === Object;
    },

    /**
     * 检查是否是函数
     * @param {*} value - 要检查的值
     * @returns {boolean} - 是否是函数
     */
    isFunction(value) {
      return typeof value === 'function';
    },

    /**
     * 检查是否是null
     * @param {*} value - 要检查的值
     * @returns {boolean} - 是否是null
     */
    isNull(value) {
      return value === null;
    },

    /**
     * 检查是否是undefined
     * @param {*} value - 要检查的值
     * @returns {boolean} - 是否是undefined
     */
    isUndefined(value) {
      return typeof value === 'undefined';
    },

    /**
     * 检查是否是空值
     * @param {*} value - 要检查的值
     * @returns {boolean} - 是否是空值
     */
    isEmpty(value) {
      if (value === null || value === undefined) return true;
      if (Array.isArray(value) || typeof value === 'string') return value.length === 0;
      if (typeof value === 'object') return Object.keys(value).length === 0;
      return false;
    }
  }
};

// 导出常用工具函数
export const { array, object, string, func, time, async: asyncUtils, dom, type } = utils;

// 导出设备信息
export const { isAndroid, isIOS, isMobile, isDesktop, getDeviceType } = utils.device;

// 导出常用的数组方法
export const { randomGet, randomSort, merge, remove, randomRemove } = utils.array;

// 导出常用的对象方法
export const { deepClone, merge: mergeObjects, isObject, entries, fromEntries } = utils.object;

// 导出常用的字符串方法
export const { capitalize, camelToSnake, snakeToCamel, random: randomString } = utils.string;

// 导出常用的函数方法
export const { debounce, throttle, delay: delayFunc, isFunction } = utils.func;

// 导出常用的时间方法
export const { format: formatTime, timestamp, diff: timeDiff } = utils.time;

// 导出常用的异步方法
export const { wait, parallelLimit } = utils.async;

// 导出常用的DOM方法
export const { createElement, getElement, getElements } = utils.dom;

// 导出常用的类型检查方法
export const { isArray, isString, isNumber, isBoolean, isNull, isUndefined, isEmpty } = utils.type;
