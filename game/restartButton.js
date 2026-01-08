import { game } from "../noname.js";

function initRestartButton() {
  const enableButton =
    !window.config || window.config.enable_restart_button !== false;

  if (enableButton) {
    // 创建重启按钮元素
    const restartButton = document.createElement("div");
    restartButton.id = "restart-button";
    restartButton.innerHTML = "🔄 重启";

    // 设置按钮样式
    restartButton.style.cssText = `
      position: fixed;
      top: 50px;
      right: 50px;
      width: 100px;
      height: 40px;
      background-color: rgba(255, 0, 0, 0.8);
      color: white;
      border: none;
      border-radius: 20px;
      font-size: 16px;
      font-weight: bold;
      cursor: move;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      user-select: none;
      transition: background-color 0.3s;
    `;

    // 添加悬停效果
    restartButton.addEventListener("mouseenter", () => {
      restartButton.style.backgroundColor = "rgba(255, 0, 0, 1)";
    });

    restartButton.addEventListener("mouseleave", () => {
      restartButton.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
    });

    // 拖动功能实现
    let isDragging = false;
    let isClicked = false;
    let offsetX, offsetY;
    let startX, startY;
    const DRAG_THRESHOLD = 5; // 拖动阈值，超过这个距离才认为是拖动

    restartButton.addEventListener("mousedown", (e) => {
      // 左键拖动
      if (e.button === 0) {
        isClicked = true;
        startX = e.clientX;
        startY = e.clientY;
        offsetX = e.clientX - restartButton.getBoundingClientRect().left;
        offsetY = e.clientY - restartButton.getBoundingClientRect().top;
        restartButton.style.cursor = "grabbing";
      }
    });

    document.addEventListener("mousemove", (e) => {
      if (isClicked) {
        // 计算移动距离
        const deltaX = Math.abs(e.clientX - startX);
        const deltaY = Math.abs(e.clientY - startY);

        // 如果移动距离超过阈值，认为是拖动
        if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
          isDragging = true;
          const x = e.clientX - offsetX;
          const y = e.clientY - offsetY;

          // 限制按钮在窗口内
          const maxX = window.innerWidth - restartButton.offsetWidth;
          const maxY = window.innerHeight - restartButton.offsetHeight;

          restartButton.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
          restartButton.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
          restartButton.style.right = "auto";
        }
      }
    });

    document.addEventListener("mouseup", () => {
      if (isClicked) {
        isClicked = false;
        // 延迟重置isDragging，确保click事件能正确判断
        setTimeout(() => {
          isDragging = false;
        }, 0);
        restartButton.style.cursor = "move";
      }
    });

    // 触屏设备支持
    restartButton.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      isClicked = true;
      startX = touch.clientX;
      startY = touch.clientY;
      offsetX = touch.clientX - restartButton.getBoundingClientRect().left;
      offsetY = touch.clientY - restartButton.getBoundingClientRect().top;
    });

    document.addEventListener("touchmove", (e) => {
      if (isClicked) {
        const touch = e.touches[0];
        // 计算移动距离
        const deltaX = Math.abs(touch.clientX - startX);
        const deltaY = Math.abs(touch.clientY - startY);

        // 如果移动距离超过阈值，认为是拖动
        if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
          isDragging = true;
          e.preventDefault();
          const x = touch.clientX - offsetX;
          const y = touch.clientY - offsetY;

          // 限制按钮在窗口内
          const maxX = window.innerWidth - restartButton.offsetWidth;
          const maxY = window.innerHeight - restartButton.offsetHeight;

          restartButton.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
          restartButton.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
          restartButton.style.right = "auto";
        }
      }
    });

    document.addEventListener("touchend", () => {
      if (isClicked) {
        isClicked = false;
        // 延迟重置isDragging，确保click事件能正确判断
        setTimeout(() => {
          isDragging = false;
        }, 0);
      }
    });

    // 重启功能实现 - 完全精确地模仿游戏内置的重置游戏设置逻辑
    restartButton.addEventListener("click", (e) => {
      if (!isDragging) {
        e.stopPropagation();
        if (confirm("确定要重置游戏设置并重启吗？")) {
          const noname_inited = localStorage.getItem("noname_inited");
          let onlineKey = null;
          // 只有当window.lib存在时才获取onlineKey
          if (typeof window.lib !== "undefined" && window.lib) {
            onlineKey = localStorage.getItem(lib.configprefix + "key");
          }
          localStorage.clear();

          // 3. 恢复需要保留的键
          if (noname_inited) {
            localStorage.setItem("noname_inited", noname_inited);
            console.log("恢复noname_inited");
          }
          if (onlineKey) {
            localStorage.setItem(lib.configprefix + "key", onlineKey);
            console.log("恢复onlineKey");
          }
          game.deleteDB("config");
          game.deleteDB("data");
          game.reload();
        }
      }
    });

    // 添加到页面
    document.body.appendChild(restartButton);
  }
}

// 确保DOM加载完成后再执行
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initRestartButton);
} else {
  initRestartButton();
}
