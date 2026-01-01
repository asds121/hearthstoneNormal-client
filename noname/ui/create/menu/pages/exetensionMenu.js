import {
  menuContainer,
  popupContainer,
  updateActive,
  setUpdateActive,
  updateActiveCard,
  setUpdateActiveCard,
  menux,
  menuxpages,
  menuUpdates,
  openMenu,
  clickToggle,
  clickSwitcher,
  clickContainer,
  clickMenuItem,
  createMenu,
  createConfig,
} from "../index.js";
import { ui, game, get, ai, lib, _status } from "../../../../../noname.js";
import { nonameInitialized } from "../../../../util/index.js";
import security from "../../../../util/security.js";
import { Character } from "../../../../library/element/character.js";

export const extensionMenu = function (connectMenu) {
  if (connectMenu) {
    return;
  }
  /**
   * 由于联机模式会创建第二个菜单，所以需要缓存一下可变的变量
   */
  // const cacheMenuContainer = menuContainer;
  // const cachePopupContainer = popupContainer;
  // const cacheMenux = menux;
  const cacheMenuxpages = menuxpages;
  /** @type { HTMLDivElement } */
  // @ts-expect-error ignore
  var start = cacheMenuxpages.shift();
  var rightPane = start.lastChild;

  var clickMode = function () {
    if (this.mode == "get") {
      this.update();
    }
    var active = this.parentNode.querySelector(".active");
    if (active === this) {
      return;
    }
    active.classList.remove("active");
    active.link.remove();
    active = this;
    this.classList.add("active");
    if (this.link) {
      rightPane.appendChild(this.link);
    } else {
      this._initLink();
      rightPane.appendChild(this.link);
    }
    updateNodes();
  };
  ui.click.extensionTab = function (name) {
    ui.click.menuTab("扩展");
    for (var i = 0; i < start.firstChild.childElementCount; i++) {
      if (start.firstChild.childNodes[i].innerHTML == name) {
        clickMode.call(start.firstChild.childNodes[i]);
        break;
      }
    }
  };
  var updateNodes = function () {
    for (var i = 0; i < start.firstChild.childNodes.length; i++) {
      var node = start.firstChild.childNodes[i];
      if (node.mode == "get") {
        continue;
      }
      if (node.mode == "create") {
        continue;
      }
      if (node.mode && node.mode.startsWith("extension_")) {
        if (lib.config[node.mode + "_enable"]) {
          node.classList.remove("off");
          if (node.link) {
            node.link.firstChild.classList.add("on");
          }
        } else {
          node.classList.add("off");
          if (node.link) {
            node.link.firstChild.classList.remove("on");
          }
        }
      } else {
        if (lib.config.plays.includes(node.mode)) {
          node.classList.remove("off");
          if (node.link) {
            node.link.firstChild.classList.add("on");
          }
        } else {
          node.classList.add("off");
          if (node.link) {
            node.link.firstChild.classList.remove("on");
          }
        }
      }
    }
  };
  var togglePack = function (bool) {
    var name = this._link.config._name;
    if (name.startsWith("extension_")) {
      if (bool) {
        game.saveConfig(name, true);
      } else {
        game.saveConfig(name, false);
      }
    } else {
      name = name.slice(0, name.indexOf("_enable_playpackconfig"));
      if (bool) {
        lib.config.plays.add(name);
      } else {
        lib.config.plays.remove(name);
      }
      game.saveConfig("plays", lib.config.plays);
    }
    if (this.onswitch) {
      this.onswitch(bool);
    }
    updateNodes();
  };

  var createModeConfig = function (mode, position) {
    var page = ui.create.div("");
    page.style.paddingBottom = "10px";
    var node;
    if (mode.startsWith("extension_")) {
      node = ui.create.div(
        ".menubutton.large",
        mode.slice(10),
        position,
        clickMode
      );
    } else {
      node = ui.create.div(
        ".menubutton.large",
        lib.translate[mode + "_play_config"],
        position,
        clickMode
      );
    }
    if (node.innerHTML.length >= 5) {
      node.classList.add("smallfont");
    }
    node.mode = mode;
    // node._initLink=function(){
    node.link = page;
    for (var i in lib.extensionMenu[mode]) {
      if (i == "game") {
        continue;
      }
      var cfg = get.copy(lib.extensionMenu[mode][i]);
      var j;
      if (mode.startsWith("extension_")) {
        j = mode + "_" + i;
      } else {
        j = mode + "_" + i + "_playpackconfig";
      }
      cfg._name = j;
      if (j in lib.config) {
        cfg.init = lib.config[j];
      } else {
        game.saveConfig(j, cfg.init);
      }

      if (i == "enable") {
        cfg.onclick = togglePack;
      } else if (!lib.extensionMenu[mode][i].onclick) {
        cfg.onclick = function (result) {
          var cfg = this._link.config;
          game.saveConfig(cfg._name, result);
        };
      }
      var cfgnode = createConfig(cfg);
      if (cfg.onswitch) {
        cfgnode.onswitch = cfg.onswitch;
      }
      page.appendChild(cfgnode);
    }
    // };
    // if(!get.config('menu_loadondemand')) node._initLink();
    return node;
  };
  let extensionsInMenu = Object.keys(lib.extensionMenu);
  if (lib.config.extensionSort && Array.isArray(lib.config.extensionSort)) {
    extensionsInMenu.sort((a, b) => {
      return (
        lib.config.extensionSort.indexOf(a) -
        lib.config.extensionSort.indexOf(b)
      );
    });
  }
  for (let i of extensionsInMenu) {
    if (
      lib.config.all.stockextension.includes(i) &&
      !lib.config.all.plays.includes(i)
    ) {
      continue;
    }
    if (lib.config.hiddenPlayPack.includes(i)) {
      continue;
    }
    createModeConfig(i, start.firstChild);
  }
  // 移除制作扩展功能
  /* (function () {
		if (!lib.device && !lib.db) {
			return;
		}
		if (lib.config.show_extensionmaker == false) {
			return;
		}
		var page = ui.create.div("#create-extension");
		var node = ui.create.div(".menubutton.large", "制作扩展", start.firstChild, clickMode);
		node.mode = "create";
		game.editExtension = function (name) {
			node._initLink();
			game.editExtension(name);
		};
		node._initLink = function () {
			node.link = page;
			var pageboard = ui.create.div(page);
			var inputExtLine = ui.create.div(pageboard);
			inputExtLine.style.transition = "all 0s";
			inputExtLine.style.padding = "10px";
			inputExtLine.style.height = "22px";
			inputExtLine.style.lineHeight = "22px";
			inputExtLine.style.whiteSpace = "nowrap";
			inputExtLine.style.overflow = "visible";
			var inputExtSpan = document.createElement("span");
			inputExtSpan.innerHTML = "扩展名：";
			inputExtLine.appendChild(inputExtSpan);
			var inputExtName = document.createElement("input");
			inputExtName.type = "text";
			inputExtName.value = "无名扩展";
			inputExtName.style.width = "80px";
			inputExtName.style.textAlign = "center";
			inputExtLine.appendChild(inputExtName);

			var buttonConfirmOnclick = function () {
				buttonConfirm.style.display = "none";
				inputExtSpan.style.display = "none";
				inputExtName.style.display = "none";
				authorExtLine.style.display = "none";
				introExtLine.style.display = "none";
				forumExtLine.style.display = "none";
				diskExtLine.style.display = "none";
				versionExtLine.style.display = "none";
				okExtLine.style.display = "none";
				inputExtLine.style.padding = "10px";
				buttonRename.style.display = "";
				buttonSave.style.display = "";
				buttonReset.style.display = "";
				buttonExport.style.display = "";
				inputExtSpan.innerHTML = "扩展名称：";
				inputExtName.style.width = "100px";
				inputExtName.style.textAlign = "";

				dashboard.style.display = "";
			};
			var createExtLine = function (str, str2) {
				var infoExtLine = ui.create.div(pageboard);
				infoExtLine.style.display = "none";
				infoExtLine.style.padding = "0 10px 10px 10px";
				infoExtLine.style.height = "22px";
				infoExtLine.style.lineHeight = "22px";
				infoExtLine.style.whiteSpace = "nowrap";
				infoExtLine.style.overflow = "visible";
				if (typeof str == "boolean") {
					var inputConfirm = document.createElement("button");
					inputConfirm.innerHTML = "确定";
					inputConfirm.onclick = buttonConfirmOnclick;
					infoExtLine.appendChild(inputConfirm);
					return infoExtLine;
				}
				var infoExtSpan = document.createElement("span");
				infoExtSpan.innerHTML = str + "：";
				infoExtLine.appendChild(infoExtSpan);
				var infoExtName = document.createElement("input");
				infoExtName.type = "text";
				infoExtName.style.width = "100px";
				infoExtName.value = str2 || "";
				infoExtLine.appendChild(infoExtName);
				return infoExtLine;
			};
			var authorExtLine = createExtLine("扩展作者", get.connectNickname());
			var introExtLine = createExtLine("扩展描述");
			var versionExtLine = createExtLine("扩展版本", "1.0");
			var diskExtLine = createExtLine("网盘地址");
			var forumExtLine = createExtLine("讨论地址");
			var okExtLine = createExtLine(true);

			game.editExtension = function (name) {
				page.currentExtension = name || "无名扩展";
				inputExtName.value = page.currentExtension;
				if (name && lib.extensionPack[name]) {
					authorExtLine.querySelector("input").value = lib.extensionPack[name].author || "";
					introExtLine.querySelector("input").value = lib.extensionPack[name].intro || "";
					diskExtLine.querySelector("input").value = lib.extensionPack[name].diskURL || "";
					forumExtLine.querySelector("input").value = lib.extensionPack[name].forumURL || "";
					versionExtLine.querySelector("input").value = lib.extensionPack[name].version || "";
				} else {
					authorExtLine.querySelector("input").value = get.connectNickname() || "";
					introExtLine.querySelector("input").value = "";
					diskExtLine.querySelector("input").value = "";
					forumExtLine.querySelector("input").value = "";
					versionExtLine.querySelector("input").value = "1.0";
				}
				if (name) {
					inputExtName.disabled = true;
					buttonConfirm.style.display = "none";
					inputExtSpan.style.display = "none";
					inputExtName.style.display = "none";
					buttonRename.style.display = "";
					buttonSave.style.display = "";
					buttonReset.style.display = "";
					buttonExport.style.display = "";
				} else {
					inputExtName.disabled = false;
					buttonConfirm.style.display = "";
					inputExtSpan.innerHTML = "扩展名：";
					inputExtName.style.width = "80px";
					inputExtName.style.textAlign = "center";
					inputExtSpan.style.display = "";
					inputExtName.style.display = "";
					buttonRename.style.display = "none";
					buttonSave.style.display = "none";
					buttonReset.style.display = "none";
					buttonExport.style.display = "none";
				}

				dashboard.style.display = "";

				exportExtLine.style.display = "none";
				shareExtLine.style.display = "none";
				authorExtLine.style.display = "none";
				introExtLine.style.display = "none";
				forumExtLine.style.display = "none";
				diskExtLine.style.display = "none";
				versionExtLine.style.display = "none";
				okExtLine.style.display = "none";
				inputExtLine.style.padding = "10px";
				dash1.reset(name);
				dash2.reset(name);
				dash3.reset(name);
				dash4.reset(name);
				dash1.link.classList.remove("active");
				dash2.link.classList.remove("active");
				dash3.link.classList.remove("active");
				dash4.link.classList.remove("active");
				var active = node.parentNode.querySelector(".active");
				if (active === node) {
					return;
				}
				active.classList.remove("active");
				active.link.remove();
				node.classList.add("active");
				rightPane.appendChild(node.link);
			};
			var processExtension = function (exportext) {
				if (page.currentExtension) {
					if (page.currentExtension != inputExtName.value && !exportext) {
						game.removeExtension(page.currentExtension);
					}
				}
				inputExtName.disabled = true;
				setTimeout(function () {
					var ext = {};
					for (var i in dash4.content) {
						try {
							if (["arenaReady", "content", "prepare", "precontent"].includes(i)) {
								ext[i] = security.exec2(`return (${dash4.content[i]});`).return;
								if (typeof ext[i] != "function") {
									throw "err";
								} else {
									ext[i] = ext[i].toString();
								}
							} else {
								ext[i] = security.exec2(dash4.content[i])[i];
								if (ext[i] == null || typeof ext[i] != "object") {
									throw "err";
								} else {
									ext[i] = JSON.stringify(ext[i]);
								}
							}
						} catch (e) {
							console.log(e);
							delete ext[i];
						}
					}
					page.currentExtension = inputExtName.value || "无名扩展";
					var str = '{name:"' + page.currentExtension + '"';
					for (var i in ext) {
						str += "," + i + ":" + ext[i];
					}
					dash2.content.pack.list = [];
					for (var i = 0; i < dash2.pile.childNodes.length; i++) {
						dash2.content.pack.list.push(dash2.pile.childNodes[i].link);
					}
					str +=
						",package:" +
						get.stringify({
							//替换die audio，加上扩展名
							//TODO: 创建扩展这部分更是重量级
							character: (pack => {
								const { character } = pack;
								for (const [key, info] of Object.entries(character)) {
									if (Array.isArray(info)) {
										const tag = info[4]?.find(tag => /^die:.+$/.test(tag));
										if (tag) {
											info[4].remove(tag);
											const audio = `die:${typeof game.readFile == "function" ? "ext:" : "db:extension-"}${page.currentExtension}/audio/die/${tag.slice(tag.lastIndexOf("/") + 1)}`;
											info[4].push(audio);
										}
									} else if (Array.isArray(info.dieAudios)) {
										const { dieAudios } = info;
										const tag = dieAudios.find(tag => /^ext:.+$/.test(tag));
										if (tag) {
											dieAudios.remove(tag);
											const audio = `${typeof game.readFile == "function" ? "ext:" : "db:extension-"}${page.currentExtension}/audio/die/${tag.slice(tag.lastIndexOf("/") + 1)}`;
											dieAudios.push(audio);
										}
									}
								}
								return pack;
							})(dash1.content.pack),
							card: dash2.content.pack,
							skill: dash3.content.pack,
							intro: introExtLine.querySelector("input").value ?? "",
							author: authorExtLine.querySelector("input").value ?? "",
							diskURL: diskExtLine.querySelector("input").value ?? "",
							forumURL: forumExtLine.querySelector("input").value ?? "",
							version: versionExtLine.querySelector("input").value ?? "",
						});
					var files = { character: [], card: [], skill: [], audio: [] };
					for (const i in dash1.content.image) {
						files.character.push(i);
					}
					for (const i in dash1.content.audio) {
						files.audio.push("audio/die/" + i);
					}
					for (const i in dash2.content.image) {
						files.card.push(i);
					}
					for (const i in dash3.content.audio) {
						files.skill.push(i);
					}
					str += ",files:" + JSON.stringify(files);
					str += ",connect:false"; //不写的话，这里会变成undefined喵，所以默认是不能联机的哦
					str += "}";
					const extension = {
						"extension.js": `import { lib, game, ui, get, ai, _status } from "../../noname.js";\nexport const type = "extension";\nexport default function(){\n\treturn ${str} \n};`,
						"info.json": JSON.stringify({
							intro: introExtLine.querySelector("input").value ?? "",
							name: page.currentExtension,
							author: authorExtLine.querySelector("input").value ?? "",
							diskURL: diskExtLine.querySelector("input").value ?? "",
							forumURL: forumExtLine.querySelector("input").value ?? "",
							version: versionExtLine.querySelector("input").value ?? "",
						}),
						"README.md": "",
					};
					for (var i in dash1.content.image) {
						extension[i] = dash1.content.image[i];
					}
					for (var i in dash1.content.audio) {
						extension["audio/die/" + i] = dash1.content.audio[i];
					}
					for (var i in dash2.content.image) {
						extension[i] = dash2.content.image[i];
					}
					var callback = () => {
						if (exportext) {
							var proexport = function () {
								game.importExtension(extension, null, page.currentExtension, {
									intro: introExtLine.querySelector("input").value || "",
									author: authorExtLine.querySelector("input").value || "",
									netdisk: diskExtLine.querySelector("input").value || "",
									forum: forumExtLine.querySelector("input").value || "",
									version: versionExtLine.querySelector("input").value || "",
								});
							};
							if (game.getFileList) {
								game.getFileList("extension/" + page.currentExtension, function (folders, files) {
									extension._filelist = files;
									proexport();
								});
							} else {
								proexport();
							}
						} else {
							game.importExtension(extension, function () {
								exportExtLine.style.display = "";
							});
						}
					};
					//兼容网页版情况
					if (typeof game.readFile == "function") {
						game.readFile(
							"LICENSE",
							function (data) {
								extension["LICENSE"] = data;
								game.writeFile(data, "extension/" + page.currentExtension, "LICENSE", function () {});
								callback();
							},
							function () {
								alert("许可证文件丢失，无法导出扩展");
							}
						);
					} else {
						callback();
					}
				}, 500);
			};
			var buttonConfirm = document.createElement("button");
			buttonConfirm.innerHTML = "确定";
			buttonConfirm.style.marginLeft = "5px";
			buttonConfirm.onclick = buttonConfirmOnclick;
			inputExtLine.appendChild(buttonConfirm);
			var buttonRename = document.createElement("button");
			buttonRename.innerHTML = "选项";
			buttonRename.style.marginLeft = "2px";
			buttonRename.style.marginRight = "2px";
			buttonRename.style.display = "none";
			buttonRename.onclick = function () {
				inputExtSpan.style.display = "";
				inputExtName.style.display = "";
				authorExtLine.style.display = "";
				introExtLine.style.display = "";
				forumExtLine.style.display = "";
				diskExtLine.style.display = "";
				versionExtLine.style.display = "";
				okExtLine.style.display = "block";
				inputExtLine.style.padding = "20px 10px 10px 10px";
				inputExtName.disabled = false;
				buttonRename.style.display = "none";
				buttonSave.style.display = "none";
				buttonReset.style.display = "none";
				buttonExport.style.display = "none";
				inputExtSpan.innerHTML = "扩展名称：";
				inputExtName.style.width = "100px";
				inputExtName.style.textAlign = "";

				dashboard.style.display = "none";
			};
			inputExtLine.appendChild(buttonRename);
			var buttonReset = document.createElement("button");
			buttonReset.innerHTML = "重置";
			buttonReset.style.marginLeft = "2px";
			buttonReset.style.marginRight = "2px";
			buttonReset.style.display = "none";
			buttonReset.onclick = function () {
				if (confirm("当前扩展将被清除，是否确定？")) {
					game.editExtension();
				}
			};
			inputExtLine.appendChild(buttonReset);
			var buttonSave = document.createElement("button");
			buttonSave.innerHTML = "保存";
			buttonSave.style.marginLeft = "2px";
			buttonSave.style.marginRight = "2px";
			buttonSave.style.display = "none";
			buttonSave.onclick = function () {
				dash1.link.classList.remove("active");
				dash2.link.classList.remove("active");
				dash3.link.classList.remove("active");
				dash4.link.classList.remove("active");
				processExtension();
			};
			inputExtLine.appendChild(buttonSave);
			var buttonExport = document.createElement("button");
			buttonExport.innerHTML = "导出";
			buttonExport.style.marginLeft = "2px";
			buttonExport.style.marginRight = "2px";
			buttonExport.style.display = "none";
			buttonExport.onclick = function () {
				function oldExport() {
					processExtension(true);
					if (lib.config.show_extensionshare) {
						shareExtLine.style.display = "";
					}
				}
				if (typeof game.readFile == "function" && window.noname_shijianInterfaces && typeof window.noname_shijianInterfaces.shareExtensionWithPassWordAsync == "function" && confirm("是否使用诗笺版自带的导出功能来导出扩展？")) {
					const extName = inputExtName.value;
					if (!extName) {
						alert("未检测到扩展名，将使用无名杀自带的导出功能");
						oldExport();
						return;
					}
					game.readFile(
						`extension/${extName}/extension.js`,
						() => {
							const pwd = prompt("请输入压缩包密码，不设密码直接点确定");
							let result;
							if (pwd === "" || pwd === null) {
								window.noname_shijianInterfaces.shareExtensionAsync(extName);
							} else {
								window.noname_shijianInterfaces.shareExtensionWithPassWordAsync(extName, pwd);
							}
						},
						() => {
							alert("未检测到扩展文件，将使用无名杀自带的导出功能");
							oldExport();
						}
					);
				} else {
					oldExport();
				}
			};
			inputExtLine.appendChild(buttonExport);
			var exportExtLine = ui.create.div(pageboard);
			exportExtLine.style.display = "none";
			exportExtLine.style.width = "calc(100% - 40px)";
			exportExtLine.style.textAlign = "left";
			exportExtLine.style.marginBottom = "5px";
			if (lib.device == "ios") {
				exportExtLine.innerHTML = '已保存。退出游戏并重新打开后生效<span class="closenode">×</span>';
				exportExtLine.querySelectorAll("span")[0].onclick = function () {
					exportExtLine.style.display = "none";
				};
			} else {
				exportExtLine.innerHTML = '重启后生效。<span class="hrefnode">立即重启</span><span class="closenode">×</span>';
				exportExtLine.querySelectorAll("span")[0].onclick = game.reload;
				exportExtLine.querySelectorAll("span")[1].onclick = function () {
					exportExtLine.style.display = "none";
				};
			}

			var shareExtLine = ui.create.div(pageboard);
			shareExtLine.style.display = "none";
			shareExtLine.style.width = "calc(100% - 40px)";
			shareExtLine.style.textAlign = "left";
			shareExtLine.style.marginBottom = "5px";
			shareExtLine.innerHTML = '已导出扩展。<span class="hrefnode">分享扩展</span><span class="closenode">×</span>';
			shareExtLine.querySelectorAll("span")[0].onclick = function () {
				//这个链接404了
				//game.open('https://tieba.baidu.com/p/5439380222');
				//无名杀贴吧首页
				game.open("https://tieba.baidu.com/f?ie=utf-8&kw=%E6%97%A0%E5%90%8D%E6%9D%80");
			};
			shareExtLine.querySelectorAll("span")[1].onclick = function () {
				shareExtLine.style.display = "none";
			};

			var dashboard = ui.create.div(pageboard);
			var clickDash = function () {
				ui.create.templayer();
				pageboard.hide();
				this.link.show();
				if (this.link.init) {
					this.link.init();
				}
			};
			var createDash = function (str1, str2, node) {
				var dash = ui.create.div(".menubutton.large.dashboard");
				dashboard.appendChild(dash);
				page.appendChild(node);
				dash.link = node;
				node.link = dash;
				dash.listen(clickDash);
				lib.setScroll(node);
				ui.create.div("", str1, dash);
				ui.create.div("", str2, dash);
			};
			var dash1 = (function () {
				var page = ui.create.div(".hidden.menu-buttons");
				var currentButton = null;
				page.init = function () {
					if (!page.querySelector(".button.character")) {
						toggle.classList.add("on");
						newCharacter.style.display = "";
					}
				};
				var updateButton = function () {
					var name = page.querySelector("input.new_name").value;
					if (!name) {
						editnode.classList.add("disabled");
						return;
					}
					name = name.split("|");
					name = name[0];
					if (currentButton) {
						if (currentButton.link != name) {
							if (lib.character[name] || page.content.pack.character[name]) {
								editnode.classList.add("disabled");
								return;
							}
						}
					} else {
						if (lib.character[name] || page.content.pack.character[name]) {
							editnode.classList.add("disabled");
							return;
						}
					}
					if (!fakeme.image) {
						if (!page.content.image[name + ".jpg"]) {
							editnode.classList.add("disabled");
							return;
						}
					}
					editnode.classList.remove("disabled");
				};
				var clickButton = async function () {
					if (currentButton == this) {
						resetEditor();
						return;
					}
					resetEditor();
					currentButton = this;
					toggle.classList.add("on");
					newCharacter.style.display = "";
					fakeme.classList.add("inited");
					fakeme.style.backgroundImage = this.style.backgroundImage;
					if (page.content.pack.translate[this.link] != this.link) {
						newCharacter.querySelector(".new_name").value = this.link + "|" + page.content.pack.translate[this.link];
					} else {
						newCharacter.querySelector(".new_name").value = this.link;
					}
					var info = page.content.pack.character[this.link];
					newCharacter.querySelector(".new_hp").value = get.character(this.link, 2);
					sexes.value = get.character(this.link, 0);
					groups.value = get.character(this.link, 1);
					if (Array.isArray(info[4])) {
						for (var i = 0; i < options.childNodes.length - 1; i++) {
							const option = options.childNodes[i].lastChild;
							if (info[4].includes(option?.name)) {
								option.checked = true;
							} else if (option) {
								option.checked = false;
							}
						}
						for (var i = 0; i < info[4].length; i++) {
							if (info[4][i].startsWith("des:")) {
								newCharacter.querySelector(".new_des").value = info[4][i].slice(4);
							}
							if (info[4][i].startsWith("die:")) {
								var dieaudionode = newCharacter.querySelector(".die_audio");
								dieaudionode.file = {
									name: info[4][i].slice(info[4][i].lastIndexOf("/") + 1),
								};
								await new Promise(resolve => {
									if (typeof game.readFile == "function") {
										game.readFile(
											info[4][i].slice(4).replace("ext:", "extension/"),
											arraybuffer => {
												dieaudionode.arrayBuffer = arraybuffer;
												resolve();
											},
											() => {
												console.warn(`未找到${info[4][i].slice(4).replace("ext:", "extension/")}阵亡配音`);
												resolve();
											}
										);
									} else {
										game.getDB("image", info[4][i].slice(7)).then(
											octetStream => {
												dieaudionode.arrayBuffer = octetStream;
												resolve();
											},
											() => {
												console.warn(`未找到${info[4][i].slice(4)}阵亡配音`);
												resolve();
											}
										);
									}
								});
							}
						}
					} else {
						const optionMap = new Map([
							["zhu", "isZhugong"],
							["boss", "isBoss"],
							["forbidai", "isAiForbidden"],
							["hiddenSkill", "hasHiddenSkill"],
						]);
						for (var i = 0; i < options.childNodes.length - 1; i++) {
							const option = options.childNodes[i].lastChild;
							if (optionMap.has(option?.name) && info[optionMap.get(option.name)]) {
								option.checked = true;
							} else if (option) {
								option.checked = false;
							}
						}
						const description = info.trashBin?.find(item => item.startsWith("des:"));
						if (description) {
							newCharacter.querySelector(".new_des").value = description.slice(4);
						}
						const dieAudios = info.dieAudios || [];
						for (var i = 0; i < dieAudios.length; i++) {
							var dieaudionode = newCharacter.querySelector(".die_audio");
							dieaudionode.file = {
								name: dieAudios[i].slice(dieAudios[i].lastIndexOf("/") + 1),
							};
							await new Promise(resolve => {
								if (typeof game.readFile == "function") {
									game.readFile(
										dieAudios[i].replace("ext:", "extension/"),
										arraybuffer => {
											dieaudionode.arrayBuffer = arraybuffer;
											resolve();
										},
										() => {
											console.warn(`未找到${dieAudios[i].replace("ext:", "extension/")}阵亡配音`);
											resolve();
										}
									);
								} else {
									game.getDB("image", dieAudios[i].slice(3)).then(
										octetStream => {
											dieaudionode.arrayBuffer = octetStream;
											resolve();
										},
										() => {
											console.warn(`未找到${dieAudios[i]}阵亡配音`);
											resolve();
										}
									);
								}
							});
						}
					}

					var skills = get.character(this.link, 3);
					for (var i = 0; i < skills.length; i++) {
						var node = document.createElement("button");
						node.skill = skills[i];
						node.onclick = deletenode;
						node.innerHTML = lib.translate[skills[i]];
						skillList.firstChild.appendChild(node);
					}

					toggle.innerHTML = "编辑武将 <div>&gt;</div>";
					editnode.innerHTML = "编辑武将";
					editnode.classList.remove("disabled");
					delnode.innerHTML = "删除";
					delnode.button = this;
				};
				var createButton = function (name, image) {
					var button = ui.create.div(".button.character");
					button.link = name;
					button.image = image;
					button.setBackground(name, "character");
					button.style.backgroundSize = "cover";
					button.listen(clickButton);
					button.classList.add("noclick");
					button.nodename = ui.create.div(button, ".name", get.verticalStr(page.content.pack.translate[name]));
					button.nodename.style.top = "8px";
					page.insertBefore(button, page.childNodes[1]);
				};
				page.reset = function (name) {
					resetEditor();
					var buttons = page.querySelectorAll(".button.character");
					var list = [];
					for (var i = 0; i < buttons.length; i++) {
						list.push(buttons[i]);
					}
					for (var i = 0; i < list.length; i++) {
						list[i].remove();
					}
					if (lib.extensionPack[name]) {
						page.content.pack = lib.extensionPack[name].character || {
							character: {},
							translate: {},
						};
						page.content.image = {};
						for (var i in page.content.pack.character) {
							var file = i + ".jpg";
							var loadImage = function (file, data) {
								var img = new Image();
								img.crossOrigin = "Anonymous";
								img.onload = function () {
									var canvas = document.createElement("CANVAS");
									var ctx = canvas.getContext("2d");
									var dataURL;
									canvas.height = this.height;
									canvas.width = this.width;
									ctx.drawImage(this, 0, 0);
									canvas.toBlob(function (blob) {
										var fileReader = new FileReader();
										fileReader.onload = function (e) {
											page.content.image[file] = e.target.result;
										};
										fileReader.readAsArrayBuffer(blob, "UTF-8");
									});
								};
								img.src = data;
							};
							if (game.readFile) {
								var url = lib.assetURL + "extension/" + name + "/" + file;
								createButton(i, url);
								if (lib.device == "ios" || lib.device == "android") {
									window.resolveLocalFileSystemURL(nonameInitialized + "extension/" + name, function (entry) {
										entry.getFile(file, {}, function (fileEntry) {
											fileEntry.file(function (fileToLoad) {
												var fileReader = new FileReader();
												fileReader.onload = function (e) {
													page.content.image[file] = e.target.result;
												};
												fileReader.readAsArrayBuffer(fileToLoad, "UTF-8");
											});
										});
									});
								} else {
									loadImage(file, url);
								}
							} else {
								game.getDB("image", `extension-${name}:${file}`).then(value => {
									createButton(i, value);
									loadImage(file, value);
								});
							}
						}
					} else {
						page.content = {
							pack: {
								character: {},
								translate: {},
							},
							image: {},
							audio: {},
						};
						toggle.classList.add("on");
						newCharacter.style.display = "";
					}
				};
				ui.create.div(".config.more", '<div style="transform:none;margin-right:3px">←</div>返回', page, function () {
					ui.create.templayer();
					page.hide();
					pageboard.show();
				});
				page.content = {
					pack: {
						character: {},
						translate: {},
					},
					image: {},
					audio: {},
				};
				var newCharacter;
				var toggle = ui.create.div(".config.more.on", "创建武将 <div>&gt;</div>", page, function () {
					this.classList.toggle("on");
					if (this.classList.contains("on")) {
						newCharacter.style.display = "";
					} else {
						newCharacter.style.display = "none";
					}
				});
				var resetEditor = function () {
					currentButton = null;
					toggle.classList.remove("on");
					newCharacter.style.display = "none";
					fakeme.classList.remove("inited");
					delete fakeme.image;
					delete fakeme.image64;
					fakeme.style.backgroundImage = "";
					var inputs = newCharacter.querySelectorAll("input");
					for (var i = 0; i < inputs.length; i++) {
						inputs[i].value = "";
					}
					inputs = newCharacter.querySelectorAll("textarea");
					for (var i = 0; i < inputs.length; i++) {
						inputs[i].value = "";
					}
					skillList.firstChild.innerHTML = "";
					toggle.innerHTML = "创建武将 <div>&gt;</div>";
					editnode.innerHTML = "创建武将";
					editnode.classList.add("disabled");
					delnode.innerHTML = "取消";
					delete delnode.button;
				};

				newCharacter = ui.create.div(".new_character", page);
				var fakeme = ui.create.div(".avatar", newCharacter);

				var input = document.createElement("input");
				input.type = "file";
				input.accept = "image/*";
				input.className = "fileinput";
				input.onchange = function () {
					var fileToLoad = input.files[0];
					if (fileToLoad) {
						var fileReader = new FileReader();
						fileReader.onload = function (fileLoadedEvent) {
							var data = fileLoadedEvent.target.result;
							fakeme.style.backgroundImage = "url(" + data + ")";
							fakeme.image64 = data;
							fakeme.classList.add("inited");
							var fileReader = new FileReader();
							fileReader.onload = function (fileLoadedEvent) {
								fakeme.image = fileLoadedEvent.target.result;
								updateButton();
							};
							fileReader.readAsArrayBuffer(fileToLoad, "UTF-8");
						};
						fileReader.readAsDataURL(fileToLoad, "UTF-8");
					}
				};
				fakeme.appendChild(input);

				ui.create.div(".select_avatar", "选择头像", fakeme);

				ui.create.div(".indent", '姓名：<input class="new_name" type="text">', newCharacter).style.paddingTop = "8px";
				ui.create.div(".indent", '介绍：<input class="new_des" type="text">', newCharacter).style.paddingTop = "8px";
				ui.create.div(".indent", '体力：<input class="new_hp" type="text" placeholder="体/限/甲">', newCharacter).style.paddingTop = "8px";
				newCharacter.querySelector("input.new_name").onblur = updateButton;
				var sexes = ui.create.selectlist(
					[
						["male", "男"],
						["female", "女"],
						["double", "双性"],
						["none", "无"],
					],
					null,
					ui.create.div(".indent", "性别：", newCharacter)
				);
				var grouplist = lib.group.map((group, i) => [lib.group[i], get.translation(lib.group[i])]);
				var groups = ui.create.selectlist(grouplist, null, ui.create.div(".indent", "势力：", newCharacter));
				var dieaudio = ui.create.div(".die_audio", newCharacter, { textAlign: "left" });
				var dieaudiolabel = ui.create.node("label", "阵亡配音:", dieaudio);
				var dieaudioUpload = dieaudio.appendChild(document.createElement("input"));
				dieaudioUpload.type = "file";
				dieaudioUpload.accept = "audio/*";
				dieaudioUpload.style.width = "calc(100% - 100px)";
				dieaudioUpload.onchange = function () {
					var fileToLoad = dieaudioUpload.files[0];
					if (fileToLoad) {
						console.log(fileToLoad);
						var fileReader = new FileReader();
						fileReader.onload = function (fileLoadedEvent) {
							var data = fileLoadedEvent.target.result;
							var blob = new Blob([data]);
							dieaudio.file = fileToLoad;
							dieaudio.arrayBuffer = data;
							dieaudio.blob = blob;
							var new_name = newCharacter.querySelector("input.new_name");
							dieaudioUpload.style.display = "none";
							dieaudiopreview.style.display = dieaudiocancel.style.display = "";
							dieaudiotag.src = window.URL.createObjectURL(blob);
						};
						fileReader.readAsArrayBuffer(fileToLoad);
					}
				};
				var dieaudiotag = ui.create.node("audio", dieaudio);
				var dieaudiopreview = ui.create.node("button", dieaudio, () => {
					if (dieaudiotag.error) {
						alert("您使用的客户端不支持预览此音频！");
					} else {
						dieaudiotag.play();
					}
				});
				dieaudiopreview.innerHTML = "播放";
				dieaudiopreview.style.display = "none";
				var dieaudiocancel = ui.create.node("button", dieaudio, () => {
					dieaudiopreview.style.display = "none";
					dieaudiocancel.style.display = "none";
					if (dieaudio.blob) {
						window.URL.revokeObjectURL(dieaudio.blob);
						dieaudiotag.src = null;
						delete dieaudio.file;
						delete dieaudio.arrayBuffer;
						delete dieaudio.blob;
					}
					dieaudioUpload.value = "";
					dieaudioUpload.style.display = "";
				});
				dieaudiocancel.innerHTML = "取消";
				dieaudiocancel.style.display = "none";
				var options = ui.create.div(".add_skill.options", '<span>主公<input type="checkbox" name="zhu"></span><span>BOSS<input type="checkbox" name="boss"></span><span>仅点将可用<input type="checkbox" name="forbidai"></span><br><span>隐匿技<input type="checkbox" name="hiddenSkill"></span><br>', newCharacter);
				var addSkill = ui.create.div(".add_skill", "添加技能<br>", newCharacter);
				var list = [];
				for (var i in lib.character) {
					if (lib.character[i][3].length) {
						list.push([i, lib.translate[i]]);
					}
				}
				if (!list.length) {
					if (!lib.character["noname_sunce"]) {
						lib.character["noname_sunce"] = new Character({
							sex: "male",
							group: "wu",
							hp: 4,
							skills: ["jiang"],
							isUnseen: true,
						});
					}
					if (!lib.translate["noname_sunce"]) {
						lib.translate["noname_sunce"] = "孙策";
					}
					list.push(["noname_sunce", lib.translate["noname_sunce"]]);
				}
				list.sort(function (a, b) {
					a = a[0];
					b = b[0];
					var aa = a,
						bb = b;
					if (aa.includes("_")) {
						aa = aa.slice(aa.lastIndexOf("_") + 1);
					}
					if (bb.includes("_")) {
						bb = bb.slice(bb.lastIndexOf("_") + 1);
					}
					if (aa != bb) {
						return aa > bb ? 1 : -1;
					}
					return a > b ? 1 : -1;
				});
				var list2 = [];
				var skills = lib.character[list[0][0]].skills.slice();
				for (const skill of skills) {
					if (lib.skill[skill]?.derivation) {
						const derivation = lib.skill[skill]?.derivation;
						skills[Array.isArray(derivation) ? "addArray" : "add"](derivation);
					}
				}
				for (var i = 0; i < skills.length; i++) {
					if (lib.skill[skills[i]] && !lib.skill[skills[i]].sub && lib.translate[skills[i]]) {
						list2.push([skills[i], lib.translate[skills[i]]]);
					}
				}
				list.unshift(["current_extension", "此扩展"]);

				var selectname = ui.create.selectlist(list, list[1], addSkill);
				page.selectname = selectname;
				selectname.onchange = function () {
					skillopt.innerHTML = "";
					if (this.value == "current_extension") {
						for (var i in dash3.content.pack.skill) {
							var option = document.createElement("option");
							option.value = i;
							option.innerHTML = dash3.content.pack.translate[i];
							skillopt.appendChild(option);
						}
					} else {
						var skills = lib.character[this.value].skills.slice();
						for (const skill of skills) {
							if (lib.skill[skill]?.derivation) {
								const derivation = lib.skill[skill]?.derivation;
								skills[Array.isArray(derivation) ? "addArray" : "add"](derivation);
							}
						}
						for (var i = 0; i < skills.length; i++) {
							if (lib.skill[skills[i]] && !lib.skill[skills[i]].sub && lib.translate[skills[i]]) {
								var option = document.createElement("option");
								option.value = skills[i];
								option.innerHTML = lib.translate[skills[i]];
								skillopt.appendChild(option);
							}
						}
					}
				};
				selectname.style.maxWidth = "85px";
				var skillopt = ui.create.selectlist(list2, list2[0], addSkill);
				skillopt.style.maxWidth = "60px";
				page.skillopt = skillopt;
				var addSkillButton = document.createElement("button");
				addSkillButton.innerHTML = "添加";
				addSkill.appendChild(addSkillButton);
				page.addSkillButton = addSkillButton;
				var deletenode = function () {
					this.remove();
				};
				addSkillButton.onclick = function () {
					for (var i = 0; i < skillList.firstChild.childNodes.length; i++) {
						if (skillList.firstChild.childNodes[i].skill == skillopt.value) {
							return alert(selectname.value == "current_extension" ? "此扩展还未添加技能" : "此武将没有技能可添加");
						}
					}
					//无技能时
					if (!skillopt.value || skillopt.childElementCount == 0) {
						return;
					}
					var node = document.createElement("button");
					node.skill = skillopt.value;
					node.onclick = deletenode;
					for (var i = 0; i < skillopt.childElementCount; i++) {
						if (skillopt.childNodes[i].value == skillopt.value) {
							node.innerHTML = skillopt.childNodes[i].innerHTML;
							break;
						}
					}
					skillList.firstChild.appendChild(node);
				};
				var createSkillButton = document.createElement("button");
				createSkillButton.innerHTML = "创建";
				createSkillButton.style.marginLeft = "3px";
				addSkill.appendChild(createSkillButton);
				createSkillButton.onclick = function () {
					ui.create.templayer();
					page.hide();
					dash3.show();
					dash3.fromchar = "add";
					dash3.toggle.classList.add("on");
					dash3.newSkill.style.display = "";
				};
				page.updateSkill = function () {
					for (var i = 0; i < skillList.firstChild.childNodes.length; i++) {
						var node = skillList.firstChild.childNodes[i];
						var skill = skillList.firstChild.childNodes[i].skill;
						if (dash3.content.pack.skill[skill]) {
							node.innerHTML = dash3.content.pack.translate[skill];
						} else if (lib.skill[skill]) {
							node.innerHTML = lib.translate[skill];
						} else {
							node.remove();
							i--;
						}
					}
				};
				var skillList = ui.create.div(".skill_list", newCharacter);
				ui.create.div(skillList);
				var editnode = ui.create.div(".menubutton.large.disabled", "创建武将", ui.create.div(skillList), function () {
					let name = page.querySelector("input.new_name").value;
					if (!name) {
						alert("请填写武将名\n提示：武将名格式为id+|+中文名，其中id必须惟一");
						return;
					}
					name = name.split("|");
					let translate = name[1] || name[0];
					name = name[0];
					if (currentButton) {
						if (currentButton.link != name) {
							if (lib.character[name] || page.content.pack.character[name]) {
								alert("武将名与现有武将重复，请更改\n提示：武将名格式为id+|+中文名，其中id必须惟一");
								return;
							}
							page.content.image[name + ".jpg"] = page.content.image[currentButton.link + ".jpg"];
							delete page.content.image[currentButton.link + ".jpg"];
							delete page.content.pack.character[currentButton.link];
							delete page.content.pack.translate[currentButton.link];
							currentButton.link = name;
						}
					} else {
						if (lib.character[name] || page.content.pack.character[name]) {
							alert("武将名与现有武将重复，请更改\n提示：武将名格式为id+|+中文名，其中id必须惟一");
							return;
						}
					}
					if (fakeme.image) {
						page.content.image[name + ".jpg"] = fakeme.image;
					} else {
						if (!page.content.image[name + ".jpg"]) {
							alert("请选择武将头像");
							return;
						}
					}
					let hp = page.querySelector("input.new_hp").value;
					//体力支持‘Infinity,∞,无限’表示无限
					if (["Infinity", "∞", "无限"].includes(hp)) {
						hp = Infinity;
					} else if (hp.indexOf("/") == -1) {
						hp = parseInt(hp) || 1;
					}
					const skills = Array.from(skillList.firstChild.childNodes).map(item => item.skill);
					const oldCharacter = page.content.pack.character[name] || {};
					const bool = !Array.isArray(oldCharacter);
					const newCharacter = {
						sex: sexes.value,
						group: groups.value,
						hp: get.infoHp(hp),
						maxHp: get.infoMaxHp(hp),
						hujia: get.infoHujia(hp),
						skills,
					};
					const tags = Array.from(options.childNodes)
						.slice(0, -1)
						.reduce((list, node) => {
							const child = node.lastChild;
							if (child?.checked) {
								list.push(child.name);
							}
							return list;
						}, []);
					const des = page.querySelector("input.new_des").value;
					if (des) {
						tags.add(`des:${des}`);
						if (bool) {
							oldCharacter.trashBin ??= [];
							oldCharacter.trashBin = oldCharacter.trashBin.filter(tag => !tag.startsWith("des:"));
							oldCharacter.trashBin.add(`des:${des}`);
						}
					} else if (bool && Array.isArray(oldCharacter.trashBin)) {
						oldCharacter.trashBin = oldCharacter.trashBin.filter(tag => !tag.startsWith("des:"));
						if (!oldCharacter.trashBin.length) {
							delete oldCharacter.trashBin;
						}
					}
					if (tags.includes("zhu")) {
						newCharacter.isZhugong = true;
					} else if (bool && "isZhugong" in oldCharacter) {
						delete oldCharacter.isZhugong;
					}
					if (tags.includes("boss")) {
						tags.add("bossallowed");
						newCharacter.isBoss = true;
						newCharacter.isBossAllowed = true;
					} else if (bool) {
						if ("isBoss" in oldCharacter) {
							delete oldCharacter.isBoss;
						}
						if ("isBossAllowed" in oldCharacter) {
							delete oldCharacter.isBossAllowed;
						}
					}
					if (tags.includes("forbidai")) {
						newCharacter.isAiForbidden = true;
					} else if (bool && "isAiForbidden" in oldCharacter) {
						delete oldCharacter.isAiForbidden;
					}
					if (tags.includes("hiddenSkill")) {
						newCharacter.hasHiddenSkill = true;
					} else if (bool && "hasHiddenSkill" in oldCharacter) {
						delete oldCharacter.hasHiddenSkill;
					}
					//阵亡配音
					if (dieaudio.file && dieaudio.arrayBuffer) {
						var audioname = name + dieaudio.file.name.slice(dieaudio.file.name.indexOf("."));
						const dieAudio = `${typeof game.readFile == "function" ? "ext" : "db"}:audio/die/${audioname}`;
						tags.add(`die:${dieAudio}`);
						newCharacter.dieAudios = [];
						newCharacter.dieAudios.add(dieAudio);
						page.content.audio[audioname] = dieaudio.arrayBuffer;
					} else if (bool && Array.isArray(oldCharacter.dieAudios)) {
						delete oldCharacter.dieAudios;
					}
					page.content.pack.translate[name] = translate;
					if (!page.content.pack.character[name]) {
						page.content.pack.character[name] = newCharacter;
					} else if (Array.isArray(page.content.pack.character[name])) {
						page.content.pack.character[name] = [sexes.value, groups.value, hp, skills, tags];
					} else {
						Object.assign(page.content.pack.character[name], newCharacter);
					}
					if (this.innerHTML == "创建武将") {
						createButton(name, fakeme.image64);
					} else if (currentButton) {
						if (fakeme.image64) {
							currentButton.image = fakeme.image64;
							currentButton.style.backgroundImage = "url(" + fakeme.image64 + ")";
						}
						currentButton.nodename.innerHTML = get.verticalStr(translate);
					}
					resetEditor();
					dash1.link.classList.add("active");
				});
				var delnode = ui.create.div(".menubutton.large", "取消", editnode.parentNode, function () {
					if (this.innerHTML == "删除") {
						this.button.remove();
						var name = this.button.link;
						delete dash1.content.pack.character[name];
						delete dash1.content.pack.translate[name];
						delete dash1.content.image[name];
						delete dash1.content.audio[name];
						dash1.link.classList.add("active");
					}
					resetEditor();
				});
				delnode.style.marginLeft = "13px";

				return page;
			})();
			var dash2 = (function () {
				var page = ui.create.div(".hidden.menu-buttons");
				var currentButton = null;
				page.init = function () {
					if (!page.querySelector(".button.card")) {
						toggle.classList.add("on");
						newCard.style.display = "";
					}
				};
				var updateButton = function () {
					var name = page.querySelector("input.new_name").value;
					if (!name) {
						editnode.classList.add("disabled");
						return;
					}
					name = name.split("|");
					name = name[0];
					if (currentButton) {
						if (currentButton.link != name) {
							if (lib.card[name] || page.content.pack.card[name]) {
								editnode.classList.add("disabled");
								return;
							}
						}
					} else {
						if (lib.card[name] || page.content.pack.card[name]) {
							editnode.classList.add("disabled");
							return;
						}
					}
					if (!fakeme.image && !fakeme.classList.contains("inited")) {
						editnode.classList.add("disabled");
						return;
					}
					editnode.classList.remove("disabled");
				};
				var clickButton = function () {
					if (currentButton == this) {
						resetEditor();
						return;
					}
					resetEditor();
					currentButton = this;
					toggle.classList.add("on");
					newCard.style.display = "";
					fakeme.classList.add("inited");
					delete fakeme.image;
					delete fakeme.image64;
					if (this.classList.contains("fullskin")) {
						fakeme.imagenode.style.backgroundImage = this.imagenode.style.backgroundImage;
						fakeme.classList.add("fullskin");
					} else {
						fakeme.style.backgroundImage = this.style.backgroundImage;
						fakeme.classList.remove("fullskin");
					}
					if (page.content.pack.translate[this.link] != this.link) {
						newCard.querySelector(".new_name").value = this.link + "|" + page.content.pack.translate[this.link];
					} else {
						newCard.querySelector(".new_name").value = this.link;
					}
					newCard.querySelector(".new_description").value = page.content.pack.translate[this.link + "_info"];
					var info = page.content.pack.card[this.link];
					container.code = "card=" + get.stringify(info);

					toggle.innerHTML = "编辑卡牌 <div>&gt;</div>";
					editnode.innerHTML = "编辑卡牌";
					editnode.classList.remove("disabled");
					delnode.innerHTML = "删除";
					delnode.button = this;
				};
				var createButton = function (name, image, fullskin) {
					var button = ui.create.div(".button.card");
					button.link = name;
					button.image = image;
					button.imagenode = ui.create.div(".image", button);
					if (image) {
						if (fullskin) {
							button.imagenode.style.backgroundImage = "url(" + image + ")";
							button.style.backgroundImage = "";
							button.style.backgroundSize = "";
							button.classList.add("fullskin");
						} else {
							button.style.color = "white";
							button.style.textShadow = "black 0 0 2px";
							button.imagenode.style.backgroundImage = "";
							button.style.backgroundImage = "url(" + image + ")";
							button.style.backgroundSize = "cover";
						}
					}
					button.listen(clickButton);
					button.classList.add("noclick");
					button.nodename = ui.create.div(button, ".name", get.verticalStr(page.content.pack.translate[name]));
					page.insertBefore(button, page.childNodes[1]);
				};
				page.reset = function (name) {
					resetEditor();
					var buttons = page.querySelectorAll(".button.card");
					var list = [];
					for (var i = 0; i < buttons.length; i++) {
						list.push(buttons[i]);
					}
					for (var i = 0; i < list.length; i++) {
						list[i].remove();
					}
					if (lib.extensionPack[name]) {
						page.content.pack = lib.extensionPack[name].card || {
							card: {},
							translate: {},
						};
						page.content.image = {};
						if (Array.isArray(page.content.pack.list)) {
							for (var i = 0; i < page.content.pack.list.length; i++) {
								var card = page.content.pack.list[i];
								var node = document.createElement("button");
								node.innerHTML = page.content.pack.translate[card[2]] + " " + lib.translate[card[0]] + card[1];
								node.name = card[2];
								node.link = card;
								pile.appendChild(node);
								node.onclick = function () {
									this.remove();
								};
							}
						}
						for (var i in page.content.pack.card) {
							var file;
							var fullskin = page.content.pack.card[i].fullskin ? true : false;
							if (fullskin) {
								file = i + ".png";
							} else {
								file = i + ".jpg";
							}
							var loadImage = function (file, data) {
								var img = new Image();
								img.crossOrigin = "Anonymous";
								img.onload = function () {
									var canvas = document.createElement("CANVAS");
									var ctx = canvas.getContext("2d");
									var dataURL;
									canvas.height = this.height;
									canvas.width = this.width;
									ctx.drawImage(this, 0, 0);
									canvas.toBlob(function (blob) {
										var fileReader = new FileReader();
										fileReader.onload = function (e) {
											page.content.image[file] = e.target.result;
										};
										fileReader.readAsArrayBuffer(blob, "UTF-8");
									});
								};
								img.src = data;
							};
							if (game.readFile) {
								var url = lib.assetURL + "extension/" + name + "/" + file;
								createButton(i, url, fullskin);
								if (lib.device == "ios" || lib.device == "android") {
									window.resolveLocalFileSystemURL(nonameInitialized + "extension/" + name, function (entry) {
										entry.getFile(file, {}, function (fileEntry) {
											fileEntry.file(function (fileToLoad) {
												var fileReader = new FileReader();
												fileReader.onload = function (e) {
													page.content.image[file] = e.target.result;
												};
												fileReader.readAsArrayBuffer(fileToLoad, "UTF-8");
											});
										});
									});
								} else {
									loadImage(file, url);
								}
							} else {
								game.getDB("image", `extension-${name}:${file}`).then(value => {
									createButton(i, value, fullskin);
									loadImage(file, value);
								});
							}
						}
					} else {
						page.content = {
							pack: {
								card: {},
								translate: {},
							},
							image: {},
						};
						toggle.classList.add("on");
						newCard.style.display = "";
					}
					updatePile();
				};
				ui.create.div(".config.more.margin-bottom", '<div style="transform:none;margin-right:3px">←</div>返回', page, function () {
					ui.create.templayer();
					page.hide();
					pageboard.show();
				});
				page.content = {
					pack: {
						card: {},
						translate: {},
						list: [],
					},
					image: {},
				};
				var newCard;
				var toggle = ui.create.div(".config.more.on", "创建卡牌 <div>&gt;</div>", page, function () {
					this.classList.toggle("on");
					if (this.classList.contains("on")) {
						newCard.style.display = "";
					} else {
						newCard.style.display = "none";
					}
				});
				var resetEditor = function () {
					currentButton = null;
					toggle.classList.remove("on");
					newCard.style.display = "none";
					fakeme.classList.remove("inited");
					fakeme.classList.add("fullskin");
					delete fakeme.image;
					delete fakeme.image64;
					fakeme.style.backgroundImage = "";
					fakeme.imagenode.style.backgroundImage = "";
					var inputs = newCard.querySelectorAll("input");
					for (var i = 0; i < inputs.length; i++) {
						inputs[i].value = "";
					}
					toggle.innerHTML = "创建卡牌 <div>&gt;</div>";
					editnode.innerHTML = "创建卡牌";
					editnode.classList.add("disabled");
					delnode.innerHTML = "取消";
					delete delnode.button;
					container.code = 'card={\n    \n}\n\n/*\n示例：\ncard={\n    type:"basic",\n    enable:true,\n    filterTarget:true,\n    content:function(){\n        target.draw()\n    },\n    ai:{\n        order:1,\n        result:{\n            target:1\n        }\n    }\n}\n此例的效果为目标摸一张牌\n导出时本段代码中的换行、缩进以及注释将被清除\n*/
  /* 移除获取扩展功能
	(function () {
		var page = ui.create.div("");
		var node = ui.create.div(".menubutton.large", "获取扩展", start.firstChild, clickMode);
		node.mode = "get";
		var _thisUpdate = false;
		node.update = function () {
			_thisUpdate = true;
		};
		node._initLink = function () {
			node.link = page;
			page.listen(function () {
				if (!page.currenttimeout) {
					var active = page.querySelector(".videonode.current");
					if (active) {
						active.classList.remove("current");
					}
				}
			});
			var importextensionexpanded = false;
			page.style.paddingBottom = "10px";
			var importExtension;
			var extensionNode = ui.create.div(".config.more", "导入扩展 <div>&gt;</div>", page, function () {
				if (importextensionexpanded) {
					this.classList.remove("on");
					importExtension.style.display = "none";
				} else {
					this.classList.add("on");
					importExtension.style.display = "";
				}
				importextensionexpanded = !importextensionexpanded;
			});
			importExtension = ui.create.div(".new_character.export.import", page);
			importExtension.style.marginLeft = "5px";
			importExtension.style.marginTop = "5px";
			importExtension.style.marginBottom = "5px";
			importExtension.style.display = "none";
			importExtension.style.width = "100%";
			importExtension.style.textAlign = "left";
			ui.create.div("", '<input type="file" accept="application/zip" style="width:153px"><button>确定</button>', importExtension);
			ui.create.div(".config", "修改下载地址", page, function () {
				alert("您可以在“设置→通用→获取扩展地址”中，修改下载扩展时所采用的地址。");
			});

			var extensionURL;
			var source = lib.config.extension_sources,
				index = lib.config.extension_source;
			if (source && source[index]) {
				extensionURL = source[index];
			} else {
				extensionURL = lib.updateURL.replace(/noname/g, "noname-extension") + "/master/";
			}

			var reloadnode = ui.create.div(".config.toggle.pointerdiv", "重新启动", page, game.reload);
			reloadnode.style.display = "none";
			var placeholder = ui.create.div(".config.toggle", page);
			placeholder.style.height = 0;
			placeholder.style.marginTop = "5px";

			importExtension.firstChild.lastChild.onclick = function () {
				const fileToLoad = this.previousSibling.files[0];
				if (!fileToLoad) {
					return;
				}
				new Promise((resolve, reject) => {
					const fileReader = new FileReader();
					fileReader.onerror = reject;
					fileReader.onload = resolve;
					fileReader.readAsArrayBuffer(fileToLoad, "UTF-8");
				}).then(async progressEvent => {
					if (
						(await game.importExtension(progressEvent.target.result, () => {
							extensionNode.innerHTML = "导入成功，3秒后将重启";
							new Promise(resolve => setTimeout(resolve, 1000))
								.then(() => {
									extensionNode.innerHTML = "导入成功，2秒后将重启";
									return new Promise(resolve => setTimeout(resolve, 1000));
								})
								.then(() => {
									extensionNode.innerHTML = "导入成功，1秒后将重启";
									return new Promise(resolve => setTimeout(resolve, 1000));
								})
								.then(game.reload);
						})) !== false
					) {
						importExtension.style.display = "none";
					}
				});
			};

			var clickExtension = function () {
				var active = this.parentNode.querySelector(".videonode.current");
				if (active && active != this) {
					active.classList.remove("current");
				}
				this.classList.add("current");
				clearTimeout(page.currenttimeout);
				page.currenttimeout = setTimeout(function () {
					delete page.currenttimeout;
				}, 200);
			};
			var downloadExtension = function (e) {
				if ((this.innerHTML != "下载扩展" && this.innerHTML != "更新扩展") || !window.JSZip) {
					return;
				}
				this.classList.remove("update");
				if (e) {
					e.stopPropagation();
				}
				node.updated = true;
				var that = this;
				var list = [];
				var size = parseFloat(this.info.size) || 0;
				if (size) {
					if (this.info.size.includes("MB")) {
						size *= 1024 * 1024;
					} else if (this.info.size.includes("KB")) {
						size *= 1024;
					}
				}

				this.innerHTML = "<span>正在下载</span><div>正在下载</div>";
				this.classList.add("nopointer");
				this.classList.add("button-downloading");
				var progress = ui.create.div(".button-progress", this);
				ui.create.div(progress);
				var url = extensionURL + this.info.name + ".zip";
				var onprogress = function (byte, total) {
					if (total) {
						size = total;
					}
					if (byte == -1) {
						byte = size;
					}
					progress.firstChild.style.width = Math.round((100 * byte) / size) + "%";
				};
				var files = this.info.files || [];
				for (var i = 0; i < files.length; i++) {
					files[i] = "extension/" + that.info.name + "/" + files[i];
				}
				game.checkFileList(files, function () {
					files.unshift("extension/" + that.info.name + "/extension.js");
					for (var i = 0; i < files.length; i++) {
						files[i] = extensionURL + that.info.name + "/" + files[i].slice(10 + that.info.name.length + 1);
					}
					var n1 = 0,
						n2 = files.length;
					game.multiDownload(
						files,
						function () {
							n1++;
							onprogress(n1, n2);
						},
						function (e) {
							game.print("下载失败：" + e.source);
						},
						function () {
							onprogress(-1);
							_status.importingExtension = true;
							window.game = game;
							lib.init.js(
								lib.assetURL + "extension/" + that.info.name,
								"extension",
								function () {
									if (!lib.config.dev) {
										delete window.game;
									}
									if (game.importedPack) {
										var extname = game.importedPack.name;
										if (lib.config.extensions.includes(extname)) {
											game.removeExtension(extname, true);
										}
										lib.config.extensions.add(extname);
										game.saveConfig("extensions", lib.config.extensions);
										game.saveConfig("extension_" + extname + "_enable", true);
										game.saveConfig("extension_" + extname + "_version", that.info.version);
										for (var i in game.importedPack.config) {
											if (game.importedPack.config[i] && "init" in game.importedPack.config[i]) {
												game.saveConfig("extension_" + extname + "_" + i, game.importedPack.config[i].init);
											}
										}
										reloadnode.style.display = "";
										that.childNodes[0].innerHTML = "安装成功";
										that.childNodes[1].innerHTML = "安装成功";
										that.classList.remove("active");
										that.classList.remove("highlight");
										delete game.importedPack;
									} else {
										that.innerHTML = "安装失败";
										that.classList.add("nopointer");
									}
									_status.importingExtension = false;
								},
								function () {
									that.innerHTML = "下载失败";
									that.classList.add("nopointer");
									_status.importingExtension = false;
								}
							);
						},
						function (current) {
							return "extension/" + current.slice(extensionURL.length);
						}
					);
				});
			};

			node.update = function () {
				if (this.updated) {
					return;
				}
				if (!window.JSZip) {
					lib.init.js(lib.assetURL + "game", "jszip");
				}
				var toremove = [];
				for (var i = 0; i < page.childElementCount; i++) {
					if (page.childNodes[i].classList.contains("menubutton") || page.childNodes[i].classList.contains("loading")) {
						toremove.push(page.childNodes[i]);
					}
				}
				for (var i = 0; i < toremove.length; i++) {
					toremove[i].remove();
				}

				var loading = ui.create.div(".loading.config.toggle", "载入中...", page);
				var loaded = function () {
					var list = [];
					var extension = window.extension;
					for (var i in extension) {
						extension[i].name = i;
						list.push(extension[i]);
					}
					list.randomSort();
					delete window.extension;
					loading.style.display = "none";
					for (var i = 0; i < list.length; i++) {
						var node = ui.create.div(".videonode.menubutton.extension.large", page, clickExtension);
						ui.create.div(".caption", list[i].name, node);
						ui.create.div(".text.author", "作者：" + list[i].author + "<span>(" + list[i].size + ")</span>", node);
						ui.create.div(".text", "更新日期：" + list[i].date, node);
						ui.create.div(".text", list[i].intro, node);
						var download = ui.create.div(".menubutton.text.active", "下载扩展", node.firstChild, {
							zIndex: "5",
						});
						if (game.download) {
							if (list[i].netdisk) {
								var linknode = ui.create.div(".text", node);
								ui.create.node(
									"span.hrefnode",
									"网盘链接",
									function () {
										game.open(this.link);
									},
									linknode
								).link = list[i].netdisk;
								if (list[i].forum) {
									ui.create.node("span", linknode).style.marginRight = "10px";
									ui.create.node(
										"span.hrefnode",
										"参与讨论",
										function () {
											game.open(this.link);
										},
										linknode
									).link = list[i].forum;
								}
							} else if (list[i].forum) {
								var linknode = ui.create.div(".text", node);
								ui.create.node(
									"span.hrefnode",
									"参与讨论",
									function () {
										game.open(this.link);
									},
									linknode
								).link = list[i].forum;
							}
							download.listen(downloadExtension);
							if (lib.config.extensions.includes(list[i].name)) {
								download.classList.remove("active");
								if (lib.extensionPack[list[i].name] && lib.extensionPack[list[i].name].version == list[i].version) {
									download.classList.add("transparent2");
									download.classList.remove("active");
									download.innerHTML = "已安装";
								} else if (lib.config["extension_" + list[i].name + "_version"] != list[i].version) {
									download.innerHTML = "更新扩展";
									download.classList.add("highlight");
									download.classList.add("update");
								} else {
									download.classList.add("transparent2");
									download.classList.remove("active");
									download.innerHTML = "已安装";
								}
							}
							download.info = list[i];
						} else {
							if (list[i].forum) {
								var linknode = ui.create.div(".text", node);
								ui.create.node("span", linknode);
								ui.create.node(
									"span.hrefnode",
									"参与讨论",
									function () {
										game.open(this.link);
									},
									linknode
								).link = list[i].forum;
							}
							download.listen(function () {
								game.open(this.link);
							});
							download.link = list[i].netdisk;
						}
					}
				};
				window.extension = {};
				fetch(`${extensionURL}catalog.js`, {
					referrerPolicy: "no-referrer",
				})
					.then(response => response.text())
					.then(security.eval) // 返回的是HTML?
					.then(loaded)
					.catch(reason => {
						console.log(reason);
						delete window.extension;
						loading.innerHTML = "连接失败:" + (reason instanceof Error ? reason.message : String(reason));
					});
			};
			if (_thisUpdate) {
				node.update();
			}
		};
		if (!get.config("menu_loadondemand")) {
			node._initLink();
		}
	})(); */
  var active = start.firstChild.querySelector(".active");
  if (!active) {
    active = start.firstChild.firstChild;
    active.classList.add("active");
  }
  if (!active.link) {
    active._initLink();
  }
  rightPane.appendChild(active.link);
  updateNodes();
};
