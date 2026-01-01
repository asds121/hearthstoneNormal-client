// trigger技能触发系统实现
export class TriggerSystem {
    constructor() {
        this.triggers = new Map();
        this.eventListeners = [];
        this.skills = new Map();
    }

    // 注册技能
    registerSkill(skillName, skillData) {
        if (skillData.trigger) {
            this.skills.set(skillName, skillData);
            
            // 为技能添加事件监听器
            this.setupSkillTriggers(skillName, skillData);
        }
    }

    // 为技能设置触发器
    setupSkillTriggers(skillName, skillData) {
        const trigger = skillData.trigger;
        
        // 处理全局触发器
        if (trigger.global && Array.isArray(trigger.global)) {
            for (const eventName of trigger.global) {
                this.addTrigger(eventName, skillName, skillData);
            }
        }
        
        // 处理玩家特定触发器
        if (trigger.player && Array.isArray(trigger.player)) {
            for (const eventName of trigger.player) {
                this.addTrigger(`player.${eventName}`, skillName, skillData);
            }
        }
        
        // 处理技能特定触发器
        if (trigger.skill && Array.isArray(trigger.skill)) {
            for (const eventName of trigger.skill) {
                this.addTrigger(`skill.${eventName}`, skillName, skillData);
            }
        }
    }

    // 添加触发器
    addTrigger(eventName, skillName, skillData) {
        if (!this.triggers.has(eventName)) {
            this.triggers.set(eventName, []);
        }
        
        this.triggers.get(eventName).push({
            skillName,
            skillData,
            filter: skillData.filter || (() => true),
            content: skillData.content || (() => {}),
            silent: skillData.silent || false,
            unique: skillData.unique || false,
            charlotte: skillData.charlotte || false
        });
        
        // 添加事件监听器
        this.addEventListener(eventName);
    }

    // 添加事件监听器
    addEventListener(eventName) {
        // 检查是否已经添加过监听器
        const existing = this.eventListeners.find(listener => listener.eventName === eventName);
        if (existing) {
            return;
        }
        
        const listener = (eventData) => {
            this.handleEvent(eventName, eventData);
        };
        
        window.game.event.on(eventName, listener);
        this.eventListeners.push({
            eventName,
            listener
        });
    }

    // 处理事件，触发相应的技能
    async handleEvent(eventName, eventData) {
        if (!this.triggers.has(eventName)) {
            return;
        }
        
        const triggerList = this.triggers.get(eventName);
        
        for (const trigger of triggerList) {
            try {
                // 检查技能触发条件
                if (await this.checkSkillConditions(trigger, eventData)) {
                    // 创建并触发GameEvent
                    await this.triggerSkillEvent(trigger, eventData);
                }
            } catch (error) {
                console.error(`Error handling trigger ${eventName} for skill ${trigger.skillName}:`, error);
            }
        }
    }

    // 检查技能触发条件
    async checkSkillConditions(trigger, eventData) {
        const { filter, skillData } = trigger;
        
        // 检查技能是否可用
        if (skillData.disabled) {
            return false;
        }
        
        // 执行过滤器
        if (typeof filter === "function") {
            return await filter(eventData, window.game.me);
        }
        
        return true;
    }

    // 触发技能事件
    async triggerSkillEvent(trigger, eventData) {
        const { skillName, skillData, content } = trigger;
        
        console.log(`触发技能: ${skillName}, 事件: ${eventData.name || eventData}`);
        
        // 创建GameEvent对象
        const gameEvent = new window.GameEvent(
            `skill.${skillName}`,
            skillData,
            window.game.eventManager
        );
        
        gameEvent.skill = skillData;
        gameEvent.data = eventData;
        gameEvent.content = content;
        
        // 设置技能事件的上下文
        if (eventData.player) {
            gameEvent.player = eventData.player;
        }
        
        if (eventData.target) {
            gameEvent.target = eventData.target;
        }
        
        // 触发技能事件
        try {
            await gameEvent.trigger();
            
            // 处理技能完成后的逻辑
            if (skillData.unique) {
                // 对于唯一技能，可以考虑禁用或移除
                skillData.disabled = true;
            }
        } catch (error) {
            console.error(`技能 ${skillName} 执行失败:`, error);
        }
    }

    // 移除技能触发器
    removeSkill(skillName) {
        this.skills.delete(skillName);
        
        // 移除相关的触发器
        for (const [eventName, triggerList] of this.triggers.entries()) {
            const newTriggers = triggerList.filter(trigger => trigger.skillName !== skillName);
            if (newTriggers.length > 0) {
                this.triggers.set(eventName, newTriggers);
            } else {
                this.triggers.delete(eventName);
                
                // 移除对应的事件监听器
                this.removeEventListener(eventName);
            }
        }
    }

    // 移除事件监听器
    removeEventListener(eventName) {
        const listenerIndex = this.eventListeners.findIndex(listener => listener.eventName === eventName);
        if (listenerIndex > -1) {
            const listener = this.eventListeners[listenerIndex];
            window.game.event.off(eventName, listener.listener);
            this.eventListeners.splice(listenerIndex, 1);
        }
    }

    // 检查技能是否可以触发
    canTrigger(skillName, eventData) {
        const skill = this.skills.get(skillName);
        if (!skill) {
            return false;
        }
        
        // 检查触发条件
        if (skill.filter) {
            return skill.filter(eventData, window.game.me);
        }
        
        return true;
    }

    // 手动触发技能
    async triggerSkill(skillName, eventData = {}) {
        const skill = this.skills.get(skillName);
        if (!skill) {
            throw new Error(`Skill ${skillName} not found`);
        }
        
        // 创建触发数据
        const triggerData = {
            name: `manual.${skillName}`,
            skill: skill,
            ...eventData
        };
        
        // 检查触发条件
        if (await this.checkSkillConditions({ skillName, skillData: skill, filter: skill.filter }, triggerData)) {
            await this.triggerSkillEvent({ skillName, skillData: skill, content: skill.content }, triggerData);
        }
    }
}

// 初始化trigger系统
if (!window.triggerSystem) {
    window.triggerSystem = new TriggerSystem();
    
    // 注册全局技能
    if (window.lib && window.lib.skill) {
        for (const [skillName, skillData] of Object.entries(window.lib.skill)) {
            if (skillData.trigger) {
                window.triggerSystem.registerSkill(skillName, skillData);
            }
        }
    }
}

// 将trigger系统集成到游戏中
export function integrateTriggerSystem() {
    // 确保游戏对象存在
    if (!window.game) {
        throw new Error("Game object not found");
    }
    
    // 添加trigger方法到game对象
    window.game.trigger = {
        registerSkill: window.triggerSystem.registerSkill.bind(window.triggerSystem),
        removeSkill: window.triggerSystem.removeSkill.bind(window.triggerSystem),
        triggerSkill: window.triggerSystem.triggerSkill.bind(window.triggerSystem),
        canTrigger: window.triggerSystem.canTrigger.bind(window.triggerSystem)
    };
    
    console.log("Trigger system integrated successfully");
}