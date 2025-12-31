// GameEvent类实现，支持异步事件处理和链式调用
export class GameEvent {
    constructor(name, trigger, eventManager) {
        this.name = name;
        this.trigger = trigger;
        this.eventManager = eventManager;
        this.next = [];
        this.childEvents = [];
        this.parent = null;
        this.content = null;
        this.result = null;
        this.status = "created";
        this.phase = null;
        this.skill = null;
        this.data = {};
        
        // Promise相关属性
        this._resolve = null;
        this._reject = null;
        this._promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    // PromiseLike接口
    then(onFulfilled, onRejected) {
        return this._promise.then(onFulfilled, onRejected);
    }

    catch(onRejected) {
        return this._promise.catch(onRejected);
    }

    finally(onFinally) {
        return this._promise.finally(onFinally);
    }

    // 触发事件
    async trigger() {
        if (this.status === "running") {
            throw new Error(`Event ${this.name} is already running`);
        }

        this.status = "running";
        
        try {
            // 处理事件内容
            if (typeof this.content === "function") {
                this.result = await this.content(this);
            } else if (this.content) {
                this.result = this.content;
            }
            
            this.status = "completed";
            this._resolve(this.result);
            
            // 触发后续事件
            for (const nextEvent of this.next) {
                await nextEvent.trigger();
            }
        } catch (error) {
            this.status = "failed";
            this._reject(error);
            throw error;
        }
    }

    // 完成事件
    finish(result = null) {
        this.result = result;
        this.status = "completed";
        this._resolve(result);
    }

    // 取消事件
    cancel(all = false, player = null, notrigger = false) {
        this.status = "cancelled";
        this._resolve(null);
        
        if (all) {
            for (const child of this.childEvents) {
                child.cancel(true, player, notrigger);
            }
        }
    }

    // 设置事件内容
    setContent(content) {
        this.content = content;
        return this;
    }

    // 设置事件数据
    set(key, value) {
        this.data[key] = value;
        return this;
    }

    // 添加后续事件
    addNext(event) {
        if (event instanceof GameEvent) {
            event.parent = this;
            this.next.push(event);
        }
        return this;
    }

    // 添加子事件
    addChild(event) {
        if (event instanceof GameEvent) {
            event.parent = this;
            this.childEvents.push(event);
        }
        return this;
    }

    // 获取父事件
    getParent(level = 1) {
        let parent = this.parent;
        for (let i = 1; i < level && parent; i++) {
            parent = parent.parent;
        }
        return parent;
    }

    // 插入内容
    insert(content, data) {
        this.content = content;
        this.data = { ...this.data, ...data };
        return this;
    }

    // 检查事件状态
    isCompleted() {
        return this.status === "completed";
    }

    isFailed() {
        return this.status === "failed";
    }

    isCancelled() {
        return this.status === "cancelled";
    }

    isRunning() {
        return this.status === "running";
    }

    // 克隆事件
    clone() {
        const newEvent = new GameEvent(this.name, this.trigger, this.eventManager);
        newEvent.content = this.content;
        newEvent.data = { ...this.data };
        return newEvent;
    }
}

// 事件管理器类
export class EventManager {
    constructor() {
        this.events = new Map();
        this.listeners = new Map();
    }

    // 注册事件
    registerEvent(event) {
        if (event instanceof GameEvent) {
            this.events.set(event.name, event);
        }
    }

    // 获取事件
    getEvent(name) {
        return this.events.get(name);
    }

    // 触发全局事件
    async emitEvent(name, data = {}) {
        const event = this.getEvent(name);
        if (event) {
            event.data = { ...event.data, ...data };
            await event.trigger();
        }
        
        // 触发监听器
        const listeners = this.listeners.get(name) || [];
        for (const listener of listeners) {
            try {
                await listener(data);
            } catch (error) {
                console.error(`Error in listener for event ${name}:`, error);
            }
        }
    }

    // 添加事件监听器
    on(name, listener) {
        if (!this.listeners.has(name)) {
            this.listeners.set(name, []);
        }
        this.listeners.get(name).push(listener);
    }

    // 移除事件监听器
    off(name, listener) {
        if (this.listeners.has(name)) {
            const listeners = this.listeners.get(name);
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }
}

// lib.hook机制实现
export const HookManager = {
    hooks: new Map(),
    
    // 添加钩子
    addHook(type, name, callback) {
        if (!this.hooks.has(type)) {
            this.hooks.set(type, new Map());
        }
        if (!this.hooks.get(type).has(name)) {
            this.hooks.get(type).set(name, []);
        }
        this.hooks.get(type).get(name).push(callback);
    },
    
    // 移除钩子
    removeHook(type, name, callback) {
        if (this.hooks.has(type) && this.hooks.get(type).has(name)) {
            const callbacks = this.hooks.get(type).get(name);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    },
    
    // 触发钩子
    async callHook(type, name, ...args) {
        if (this.hooks.has(type) && this.hooks.get(type).has(name)) {
            const callbacks = this.hooks.get(type).get(name);
            for (const callback of callbacks) {
                try {
                    await callback(...args);
                } catch (error) {
                    console.error(`Error in hook ${type}.${name}:`, error);
                }
            }
        }
    }
};

// 初始化全局事件管理器
if (!window.eventManager) {
    window.eventManager = new EventManager();
}

// 将GameEvent和HookManager添加到全局对象
window.GameEvent = GameEvent;
window.HookManager = HookManager;