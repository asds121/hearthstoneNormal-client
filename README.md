# 无名杀多游戏扩展客户端

## 项目简介

无名杀多游戏扩展客户端是基于无名杀游戏框架开发的卡牌游戏客户端，支持运行多种游戏扩展包，默认优先加载"炉石普通"扩展，并具备完整的多扩展支持能力。客户端采用了渐进式修改策略，便于后续扩展支持更多游戏类型。

### 主要特性

- 支持多扩展加载，默认优先加载"炉石普通"扩展
- 纯离线运行，不依赖任何外部更新源
- 基于无名杀游戏框架，具备完整的卡牌游戏功能
- 支持多种游戏模式和扩展包
- 可通过配置灵活调整游戏设置
- 已移除所有与外部仓库相关的代码，确保纯离线运行
- 支持炉石普通、影之诗、游戏王等多种游戏扩展

## 运行方式

### 使用本地服务器运行

1. 进入项目目录
2. 安装依赖：`npm install`
3. 启动服务器：`npm start` 或 `npm run serve`
4. 浏览器会自动打开 `http://localhost:8080`

## 项目结构

```
├── character/             # 角色相关文件
├── extension/             # 扩展包目录
│   └── 炉石普通/          # 炉石普通扩展包
├── game/                  # 游戏核心逻辑
├── layout/                # 布局相关文件
├── noname/                # 无名杀游戏框架（模块化重构后的核心）
│   ├── ai/                # AI 相关逻辑
│   ├── extension/         # 扩展管理
│   ├── game/              # 游戏核心状态和事件管理
│   ├── get/               # 工具函数集合
│   ├── init/              # 初始化管理
│   ├── library/           # 核心库
│   ├── status/            # 状态管理
│   ├── ui/                # UI 相关
│   └── util/              # 工具函数
├── theme/                 # 主题相关文件
├── .gitignore
├── LICENSE
├── README.md
├── extension-development-guide.md  # 扩展开发指南
├── index.html
├── noname.js
└── package.json           # 项目配置
```

## 许可证

GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007

详见 LICENSE 文件。

## 致谢

本项目基于无名杀游戏框架开发，感谢无名杀项目的贡献和开源精神。

- 无名杀项目主页：https://github.com/libnoname/noname
- 本项目仓库地址：https://github.com/asds121/hearthstoneNormal-client
