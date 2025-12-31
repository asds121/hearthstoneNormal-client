# 炉石普通 专用客户端

这是一个简化的客户端，用于运行炉石普通扩展，无需完整的无名杀游戏。

## 核心功能

- **GameEvent机制**：支持异步事件处理和链式调用
- **lib.hook系统**：支持钩子函数的添加、移除和调用
- **技能触发系统**：基于事件监听和条件过滤的技能触发
- **龙纹背景支持**：使用ol_bg.jpg作为游戏背景
- **UI元素管理**：正确的层叠顺序和CSS类名设置

## 项目结构

```
newclient/
├── image/             # 图片资源（龙纹背景等）
├── js/                # 游戏核心逻辑
│   ├── app-init.js    # 应用初始化
│   ├── game-event.js  # GameEvent机制
│   ├── game-logic.js  # 核心游戏逻辑
│   └── trigger.js     # 技能触发系统
├── styles/            # CSS样式
│   └── main.css       # 主样式文件
├── hearthstone-app.html  # 主HTML文件
├── hearthstone-client.js  # 客户端服务器
├── ws-server.js       # WebSocket服务器
├── todo.txt           # 待办事项
└── package.json       # 依赖配置
```

## 使用方法

1. 确保Node.js版本 >= 14.0.0（支持ES模块）

2. 安装依赖：
   ```bash
   npm install
   ```

3. 启动客户端：
   ```bash
   npm start
   # 或直接运行
   node hearthstone-client.js
   ```

4. 打开浏览器访问：
   ```
   http://localhost:8089
   ```

## 扩展支持

当前仅支持炉石普通扩展，位于`../extension/炉石普通/`目录。

扩展加载流程：
1. 加载核心模拟模块
2. 初始化游戏状态
3. 加载炉石普通扩展
4. 执行扩展初始化
5. 进入游戏模式

## 开发注意事项

- 游戏使用8089端口，如果被占用，修改hearthstone-client.js中的PORT变量
- 资源文件（样式、图片等）从newclient目录加载
- 详细日志可通过浏览器控制台查看
- 按F12打开开发者工具调试

## 待办事项

参考todo.txt文件，包含GameEvent、lib.hook和trigger系统的完善计划。