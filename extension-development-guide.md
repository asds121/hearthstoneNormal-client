# 扩展开发指南

## 1. 扩展概述

本项目是基于 noname 框架的多游戏扩展客户端，支持动态加载不同游戏扩展。扩展可以添加新的卡牌、角色、规则和游戏模式。

## 2. 模块化架构

本项目采用了现代模块化设计，将核心功能拆分为独立的模块，便于维护和扩展。以下是主要的模块化组件：

### 2.1 核心模块

| 模块名称         | 职责                                   | 文件位置                             |
| ---------------- | -------------------------------------- | ------------------------------------ |
| ExtensionManager | 扩展的加载、初始化、卸载和生命周期管理 | noname/extension/ExtensionManager.js |
| GameState        | 游戏核心状态管理                       | noname/game/GameState.js             |
| GameEventManager | 游戏事件处理和管理                     | noname/game/GameEventManager.js      |
| InitManager      | 游戏初始化流程协调                     | noname/init/InitManager.js           |
| utils            | 常用工具函数集合                       | noname/util/utils.js                 |

### 2.2 模块化优势

1. **职责清晰**：每个模块只负责特定的功能，便于理解和维护
2. **低耦合**：模块之间通过明确的接口通信，减少依赖关系
3. **可扩展**：新功能可以通过添加新模块实现，不影响现有代码
4. **便于测试**：每个模块可以独立测试，提高测试效率
5. **代码复用**：工具函数和通用组件可以在多个模块间复用

### 2.3 模块间关系

```
+------------------+     +------------------+
| ExtensionManager |     |   GameState      |
+---------+--------+     +---------+--------+
          |                        |
          |                        |
+---------v--------+     +---------v--------+
|   GameEventManager |<--->|   InitManager    |
+---------+--------+     +---------+--------+
          |                        |
          |                        |
          +--------->+-------------+
                     |    utils    |
                     +-------------+
```

### 2.4 扩展与核心模块的交互

扩展通过以下方式与核心模块交互：

1. **事件机制**：通过 GameEventManager 注册和触发事件
2. **状态访问**：通过 GameState 获取和修改游戏状态
3. **扩展生命周期管理**：通过 ExtensionManager 管理扩展的加载和卸载
4. **工具函数**：使用 utils 模块提供的常用工具函数

### 2.5 模块化开发最佳实践

1. **单一职责原则**：每个模块只负责一个功能领域
2. **接口明确**：模块之间通过清晰的接口通信
3. **依赖倒置**：高层模块不依赖低层模块，而是依赖抽象
4. **可测试性**：模块设计便于单元测试
5. **文档完善**：为每个模块编写详细的文档

## 2. 扩展结构

一个标准的扩展应该包含以下文件和目录：

```
扩展名称/
├── assets.json          # 扩展资源配置
├── extension.js         # 扩展主入口文件
├── info.json            # 扩展元信息
├── LICENSE              # 扩展许可证
├── package.js           # 扩展包配置
├── README.md            # 扩展说明文档
├── assembly/            # 应用程序组装代码
├── audio/               # 音频资源
├── card/                # 卡牌定义
├── character/           # 角色定义
├── image/               # 图片资源
├── mode/                # 游戏模式定义
├── skill/               # 技能定义
└── experiment/          # 实验性功能（可选）
```

**或使用实验性功能目录结构：**

```
扩展名称/
├── assets.json          # 扩展资源配置
├── extension.js         # 扩展主入口文件
├── info.json            # 扩展元信息
├── LICENSE              # 扩展许可证
├── README.md            # 扩展说明文档
└── experiment/          # 实验性功能
    ├── assembly/        # 应用程序组装代码
    ├── package/         # 核心游戏内容
    │   ├── card/        # 卡牌定义
    │   ├── character/   # 角色定义
    │   └── mode/        # 游戏模式定义
    └── style/           # 扩展样式文件
```

## 3. 扩展元信息 (info.json)

info.json 文件包含扩展的基本信息，示例如下：

```json
{
  "name": "三国杀标准",
  "author": "无名杀移植",
  "intro": "三国杀标准模式扩展",
  "diskURL": "",
  "forumURL": "",
  "version": "1.0",
  "priority": 98
}
```

**字段说明**：

- `name`：扩展名称
- `author`：扩展作者
- `intro`：扩展介绍
- `diskURL`：磁盘URL（可选）
- `forumURL`：论坛URL（可选）
- `version`：扩展版本号
- `priority`：扩展优先级，决定加载顺序

**注意**：由于本项目采用 GPL 3.0 协议，所有扩展必须遵守 GPL 3.0 协议。虽然 info.json 中可以不包含 license 字段，但扩展的 LICENSE 文件必须使用 GPL 3.0 协议。

## 4. 扩展主入口 (extension.js)

extension.js 是扩展的主入口文件，负责导出扩展的 Application 类。示例结构：

```javascript
// 导出 Application 类
export { type, Application as default } from "./assembly/application.js";
```

**或使用实验性功能目录结构：**

```javascript
// 导出实验性 Application 类
export { type, Application as default } from "./experiment/application.js";
```

## 5. 核心游戏内容

### 5.1 卡牌定义

卡牌定义位于 `card/` 目录下（或实验性功能结构中的 `experiment/package/card/` 目录），示例：

```javascript
export const cards = {
  card1: {
    name: "卡牌名称",
    type: "法术",
    cost: 1,
    text: "卡牌效果描述",
    skill: "skill1",
  },
};
```

### 5.2 角色定义

角色定义位于 `character/` 目录下（或实验性功能结构中的 `experiment/package/character/` 目录），示例：

```javascript
export const characters = {
  character1: {
    name: "角色名称",
    hp: 30,
    skills: ["skill1", "skill2"],
    cards: ["card1", "card2"],
  },
};
```

### 5.3 游戏模式定义

游戏模式定义位于 `mode/` 目录下（或实验性功能结构中的 `experiment/package/mode/` 目录），示例：

```javascript
export const modes = {
  mode1: {
    name: "模式名称",
    description: "模式描述",
    players: 2,
    rules: ["rule1", "rule2"],
  },
};
```

### 5.4 技能定义

技能定义位于 `skill/` 目录下，示例：

```javascript
export const skills = {
  skill1: {
    name: "技能名称",
    description: "技能描述",
    effect: function () {
      // 技能效果实现
    },
  },
};
```

## 6. 扩展加载机制

扩展加载流程：

1. 系统读取 `config.extensions` 配置
2. 按照优先级顺序加载扩展
3. 执行扩展的 `init()` 函数
4. 注册扩展内容到游戏系统

## 7. 扩展优先级

扩展优先级决定了加载顺序，优先级越高的扩展越先加载。可以在 `info.json` 中设置 `priority` 字段，默认优先级为 0。

## 8. 扩展开发最佳实践

1. **模块化设计**：将功能拆分为独立模块，便于维护和扩展
2. **低耦合**：减少对其他扩展的依赖
3. **清晰的命名规范**：使用一致的命名规则
4. **完善的文档**：为扩展添加详细的说明文档
5. **兼容性考虑**：考虑与其他扩展的兼容性
6. **性能优化**：避免不必要的计算和资源消耗

## 9. 扩展测试

扩展开发完成后，建议进行以下测试：

1. **功能测试**：测试扩展的各项功能是否正常工作
2. **兼容性测试**：测试与其他扩展的兼容性
3. **性能测试**：测试扩展对游戏性能的影响
4. **稳定性测试**：测试扩展在长时间运行下的稳定性

## 10. 扩展发布

扩展开发完成后，可以按照以下步骤发布：

1. 确保扩展包含所有必要文件
2. 编写详细的 README.md 文档
3. 选择合适的许可证
4. 打包扩展为 ZIP 文件
5. 发布到扩展仓库或分享给其他用户

## 11. 常见问题

### 11.1 扩展加载失败

- 检查扩展目录结构是否正确
- 检查扩展文件是否存在语法错误
- 检查扩展依赖是否已安装

### 11.2 扩展冲突

- 检查扩展之间的命名冲突
- 检查扩展之间的依赖冲突
- 调整扩展加载顺序

### 11.3 性能问题

- 优化扩展代码，减少不必要的计算
- 避免在高频事件中执行复杂操作
- 合理使用缓存机制

## 12. 示例扩展

可以参考以下示例扩展，了解完整的扩展结构和实现方式：

- `extension/三国杀标准/`：三国杀标准模式扩展
- `extension/炉石普通/`：炉石传说普通模式扩展

## 13. 扩展 API 参考

### 13.1 核心对象

- `lib`：框架核心对象
- `game`：游戏逻辑对象
- `ui`：UI 渲染对象
- `get`：工具函数对象
- `ai`：AI 逻辑对象
- `_status`：游戏状态对象

### 13.2 注册函数

- `lib.announce.publish(event, data)`：发布事件
- `lib.announce.subscribe(event, callback)`：订阅事件
- `game.saveConfig(key, value)`：保存配置
- `game.getConfig(key)`：获取配置

## 14. 版本控制

建议使用 Git 进行扩展的版本控制，遵循以下规范：

- 使用语义化版本号（MAJOR.MINOR.PATCH）
- 提交信息清晰明了
- 定期发布稳定版本

## 15. 许可证

本项目采用 GPL 3.0 协议，所有扩展必须使用相同的 GPL 3.0 协议。

---

## 附录：扩展开发工具

1. **开发服务器**：使用 `npm start` 或 `npm run serve` 启动本地开发服务器
2. **调试工具**：使用浏览器开发者工具进行调试
3. **代码编辑器**：推荐使用 VS Code 或其他现代代码编辑器
4. **版本控制**：Git

## 附录：扩展示例代码

### 简单扩展示例

```javascript
// extension.js
// 简单扩展示例，导出 Application 类
export { type, Application as default } from "./assembly/application.js";
```

```javascript
// assembly/application.js
// 应用程序类定义
export class Application {
  constructor() {
    this.name = "测试扩展";
    this.version = "1.0.0";
  }

  // 初始化扩展
  init() {
    console.log("扩展加载成功");
    // 注册卡牌、角色、游戏模式等
  }

  // 卸载扩展
  unload() {
    console.log("扩展卸载成功");
    // 清理资源
  }
}

export const type = "extension";
```

```json
// info.json
{
  "name": "测试扩展",
  "author": "测试开发者",
  "intro": "一个简单的测试扩展",
  "diskURL": "",
  "forumURL": "",
  "version": "1.0.0",
  "priority": 0
}
```

---

扩展开发指南 v1.1.0
