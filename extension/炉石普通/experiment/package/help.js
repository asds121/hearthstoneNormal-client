import html from "../../../../game/dedent.js";
import { lib, game, ui, get, ai, _status } from "../../../../noname.js";
import { utility } from "../utility.js";

export const helpModule = {
	[utility.extensionName]: {
		template: html`
			<div :style="hs_titleStyle">关于本扩展</div>
			<ul style="margin-top:0; list-style: disc; padding-left: 20px;">
				<li>
					<strong>运行环境与协议:</strong><br/>
				本扩展需要依靠炉石普通专用客户端运行。炉石普通专用客户端使用 GPLv3 协议，因此本扩展也遵循 GPLv3 协议。
					<br/>
					<a :href="licenseLink" target="_blank" style="color: #4CAF50;">点击查看GPLv3协议详情</a>
					<br/>
				</li>
				<li>
					<strong>启用命令 (控制台):</strong><br/>
					<code style="display: block; background-color: #f0f0f0; padding: 5px; border-radius: 3px; margin-top: 5px;">
						lib.config.extensions.add("${utility.extensionName}");<br/>
						game.saveConfig("extensions",lib.config.extensions);<br/>
						game.saveConfig("extension_${utility.extensionName}_enable",true);
					</code>
					<span style="font-size: 0.9em; color: #666;">(执行后需重启游戏生效)</span>
				</li>
				<li>
					<strong>加入我们的群聊:</strong><br/>
					<img style='width:238px; margin-top: 5px;' src='${utility.getExtensionRelativePath("resImg")}qq.jpg' alt="QQ群二维码"/>
					<br/>
				</li>
				<li>
					<strong>相关资源链接:</strong><br/>
					<ul style="list-style: circle; padding-left: 20px; margin-top: 5px;">
						<li><a href='https://baike.baidu.com/item/炉石传说' target='_blank' style="color: #4CAF50;">炉石传说规则 (百度百科)</a></li>
						<li><a href='http://hs.istudylinux.cn/index.php?title=%E9%A6%96%E9%A1%B5' target='_blank' style="color: #4CAF50;">炉石卡牌资源站点 1</a></li>
						<li><a href='https://hearthstone.huijiwiki.com/wiki/%E9%A6%96%E9%A1%B5' target='_blank' style="color: #4CAF50;">炉石传说中文维基 (灰机wiki)</a></li>
						<li><a href='https://warcraft.huijiwiki.com/wiki/%E9%A6%96%E9%A1%B5' target='_blank' style="color: #4CAF50;">魔兽世界中文维基 (灰机wiki)</a></li>
						<li><a href='https://fbigames.com/' target='_blank' style="color: #4CAF50;">炉石传说卡牌库 (fbigames)</a></li>
					</ul>
				</li>
				<li>
					<strong>代码教程:</strong><br/>
					咸鱼鸽鸽的小课堂暂未开课<br/>
					<a :href="link1" target="_blank" style="color: #4CAF50;">神奇的雷诺，这是什么 (外部链接)</a>
					<br/>
				</li>
			</ul>
		`,
		setup() {
			const licenseLink = "https://www.gnu.org/licenses/gpl-3.0.html";
			const link1 = "http://612223.xyz";
			const hs_titleStyle = {
				"margin": "20px",
				"font-size": "1.3rem",
			}
			return {
				link1,
				licenseLink,
				hs_titleStyle,
			}
		}
	}
}
