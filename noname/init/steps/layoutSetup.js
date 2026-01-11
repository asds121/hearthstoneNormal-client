import { lib } from "../../../noname.js";
import { game } from "../../game/index.js";
import { get, has } from "../../util/config.js";
import { _status } from "../../status/index.js";
import { ui } from "../../ui/index.js";

/**
 * 布局设置步骤
 * - 处理show_splash配置
 * - 设置默认扩展（炉石普通）
 * - 生成扩展列表
 * - 处理布局配置
 * - 处理随机背景
 * - 处理更新日志
 * - 暴露game对象到window
 */
export async function layoutSetup() {
  // 处理show_splash配置
  let show_splash = get("show_splash");
  if (show_splash == "off") {
    show_splash = false;
  } else if (show_splash == "init") {
    if (localStorage.getItem("show_splash_off")) {
      show_splash = false;
    }
  }
  localStorage.removeItem("show_splash_off");

  // 设置默认扩展
  const extensionlist = [];
  const defaultExtensionName = "炉石普通";

  // 将炉石普通扩展设为默认高优先级扩展
  if (!get("extensions").includes(defaultExtensionName)) {
    // 插入到扩展列表首位，保证高优先级
    get("extensions").unshift(defaultExtensionName);
  } else {
    // 如果已存在，移到首位
    const index = get("extensions").indexOf(defaultExtensionName);
    if (index > 0) {
      get("extensions").splice(index, 1);
      get("extensions").unshift(defaultExtensionName);
    }
  }

  // 生成扩展列表用于后续处理
  if (!localStorage.getItem(lib.configprefix + "disable_extension")) {
    if (has("extensions") && get("extensions").length) {
      Reflect.set(window, "resetExtension", () => {
        for (var i = 0; i < get("extensions").length; i++) {
          game.saveConfig(
            "extension_" + get("extensions")[i] + "_enable",
            false
          );
        }
        // @ts-expect-error ignore
        localStorage.setItem(lib.configprefix + "disable_extension", true);
      });
    }
    for (var name = 0; name < get("plays").length; name++) {
      if (get("all").plays.includes(get("plays")[name])) {
        extensionlist.push(get("plays")[name]);
      }
    }
  }

  // 处理布局配置
  let layout = get("layout");
  if (layout == "default" || lib.layoutfixed.indexOf(get("mode")) !== -1) {
    layout = "mobile";
  }
  if (layout == "phone") {
    layout = "mobile";
    game.saveConfig("layout", "mobile");
    game.saveConfig("phonelayout", true);
  }
  Reflect.set(game, "layout", layout);

  // 处理随机背景
  if (get("image_background_random")) {
    if (_status.htmlbg) {
      game.saveConfig("image_background", _status.htmlbg);
    } else {
      const list = [];
      for (const name in lib.configMenu.appearence.config.image_background
        .item) {
        if (name == "default") {
          continue;
        }
        list.push(name);
      }
      // @ts-expect-error ignore
      game.saveConfig(
        "image_background",
        list.randomGet(lib.config.image_background)
      );
    }
    lib.init.background();
  }
  delete _status.htmlbg;

  // 处理更新日志
  if (window.noname_update) {
    Reflect.set(lib, "version", window.noname_update.version);
    // 更全面的更新内容
    if (get(`version_description_v${window.noname_update.version}`)) {
      try {
        const description = get(
          `version_description_v${window.noname_update.version}`
        );
        const html = String.raw;
        // 匹配[xx](url)的格式
        const regex = /\[([^\]]*)\]\(([^)]+)\)/g;
        lib.changeLog.push(
          html`
            <div
              style="position: relative;width:50px;height:50px;border-radius:50px;background-image:url('${description
                .author
                .avatar_url}');background-size:cover;vertical-align:middle;"
            ></div>
            ${description.author.login}于${description.published_at}发布
          `.trim(),
          description.body
            .replaceAll("\n", "<br/>")
            .replace(regex, function (match, p1, p2) {
              // p1 是链接文本，p2 是链接地址
              return `<a href="${p2}">${p1}</a>`;
            })
        );
      } catch (e) {
        console.error(e);
        lib.changeLog.push(...window.noname_update.changeLog);
      }
    }
    // 原更新内容
    else {
      lib.changeLog.push(...window.noname_update.changeLog);
    }
    if (window.noname_update.players) {
      lib.changeLog.push(
        "players://" + JSON.stringify(window.noname_update.players)
      );
    }
    if (window.noname_update.cards) {
      lib.changeLog.push(
        "cards://" + JSON.stringify(window.noname_update.cards)
      );
    }
    delete window.noname_update;
  }

  // 暴露game对象到window
  Reflect.set(window, "game", {
    import: game.import.bind(null),
  });

  console.log("布局设置完成");
}
