# 炉石普通专用客户端

## 项目简介

炉石普通专用客户端是基于无名杀游戏框架开发的炉石传说卡牌游戏客户端，专门用于运行"炉石普通"扩展包。

## 运行方式

### 使用本地服务器运行

1. 进入项目目录
2. 安装依赖：`npm install`
3. 启动服务器：`npm start`
4. 浏览器会自动打开 `http://localhost:8080`

## 项目结构

```
├── card/                  # 卡牌相关文件
├── character/             # 角色相关文件
├── extension/             # 扩展包目录
│   └── 炉石普通/          # 炉石普通扩展包
├── game/                  # 游戏核心逻辑
├── image/                 # 图片资源
├── layout/                # 布局相关文件
├── noname/                # 无名杀游戏框架
├── .gitignore
├── LICENSE
├── README.md
├── index.html
├── noname-server.js
├── noname.js
└── package.json           # 项目配置
```

## 许可证

GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007

详见 LICENSE 文件。
