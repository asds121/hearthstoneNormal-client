import { ai } from "../../ai/index.js";
import { get } from "../../get/index.js";
import { game } from "../../game/index.js";
import { _status } from "../../status/index.js";
import { ui } from "../../ui/index.js";

import dedent from "../../../game/dedent.js";
const html = dedent;

//todo：变成循环依赖了喵
import { lib } from "../index.js";
export default {
  all: () => true,
  none: () => false,
  /**
   * Check if the card does not count toward the player's hand limit
   *
   * 检测此牌是否不计入此角色的手牌上限
   * @param { Card } card
   * @param { Player } player
   * @returns { boolean }
   */
  ignoredHandcard: (card, player) =>
    game.checkMod(card, player, false, "ignoredHandcard", player),
  /**
   * Check if the card is giftable
   *
   * 检测此牌是否可赠予
   * @param { Card } card
   * @param { Player } player
   * @param { Player } target
   * @param { boolean } [strict]
   */
  cardGiftable: (card, player, target, strict) => {
    const mod = game.checkMod(
      card,
      player,
      target,
      "unchanged",
      "cardGiftable",
      player
    );
    if (
      !mod ||
      (strict &&
        ((mod == "unchanged" &&
          (get.position(card) != "h" || !get.cardtag(card, "gifts"))) ||
          player == target))
    ) {
      return false;
    }
    return (
      get.type(card, null, target) != "equip" || target.canEquip(card, true)
    );
  },
  /**
   * Check if the card is recastable
   *
   * 检查此牌是否可重铸
   * @param { Card } card
   * @param { Player } player
   * @param { Player } [source]
   * @param { boolean } [strict]
   */
  cardRecastable: () => false,
  //装备栏相关
  /**
   * @param { Card } card
   * @param { Player } player
   * @returns { boolean }
   */
  canBeReplaced: function (card, player) {
    var mod = game.checkMod(card, player, "unchanged", "canBeReplaced", player);
    if (mod != "unchanged") {
      return mod;
    }
    return true;
  },
  //装备栏 END
  buttonIncluded: function (button) {
    return !(
      _status.event.excludeButton &&
      _status.event.excludeButton.includes(button)
    );
  },
  filterButton: function (button) {
    return true;
  },
  cardSavable: function (card, player, target) {
    if (get.itemtype(card) == "card") {
      var mod2 = game.checkMod(
        card,
        player,
        "unchanged",
        "cardEnabled2",
        player
      );
      if (mod2 != "unchanged") {
        return mod2;
      }
    }
    card = get.autoViewAs(card);
    var mod = game.checkMod(
      card,
      player,
      target,
      "unchanged",
      "cardSavable",
      player
    );
    if (mod != "unchanged") {
      return mod;
    }
    var savable = get.info(card).savable;
    if (typeof savable == "function") {
      savable = savable(card, player, target);
    }
    return savable;
  },
  /**
   *
   * @param {GameEvent} event
   * @param {Player} player
   * @param {string} triggername
   * @param {string} skill
   * @returns {boolean}
   */
  filterTrigger: function (event, player, triggername, skill, indexedData) {
    if (
      player._hookTrigger &&
      player._hookTrigger.some((i) => {
        const info = lib.skill[i].hookTrigger;
        return (
          info && info.block && info.block(event, player, triggername, skill)
        );
      })
    ) {
      return false;
    }
    const info = get.info(skill);
    if (!info) {
      console.error(new ReferenceError("缺少info的技能:", skill));
      return false;
    }
    if (
      !game
        .expandSkills(player.getSkills("invisible").concat(lib.skill.global))
        .includes(skill)
    ) {
      return false;
    }
    if (
      !game
        .expandSkills(player.getSkills(false).concat(lib.skill.global))
        .includes(skill)
    ) {
      //hiddenSkills
      if (get.mode() != "guozhan") {
        return false;
      }
      if (info.noHidden) {
        return false;
      }
    }
    if (!info.forceDie && player.isDead()) {
      return false;
    }
    if (!info.forceOut && (player.isOut() || player.removed)) {
      return false;
    }
    if (!info.trigger) {
      return false;
    }
    if (
      !Object.keys(info.trigger).some((role) => {
        if (role != "global" && player != event[role]) {
          return false;
        }
        if (Array.isArray(info.trigger[role])) {
          return info.trigger[role].includes(triggername);
        }
        return info.trigger[role] == triggername;
      })
    ) {
      return false;
    }
    if (info.filter && !info.filter(event, player, triggername, indexedData)) {
      return false;
    }
    if (
      event._notrigger.includes(player) &&
      !lib.skill.global.includes(skill)
    ) {
      return false;
    }
    if (
      info.usable !== undefined &&
      player.hasSkill("counttrigger") &&
      player.storage.counttrigger
    ) {
      let num = info.usable;
      if (typeof num === "function") {
        num = info.usable(skill, player);
      }
      if (
        typeof num === "number" &&
        player.storage.counttrigger[skill] >= num
      ) {
        return false;
      }
    }
    if (
      info.round &&
      info.round - (game.roundNumber - player.storage[skill + "_roundcount"]) >
        0
    ) {
      return false;
    }
    for (const item in player.storage) {
      if (item.startsWith("temp_ban_")) {
        if (player.storage[item] !== true) {
          continue;
        }
        const skillName = item.slice(9);
        if (lib.skill[skillName]) {
          const skills = game.expandSkills([skillName]);
          if (skills.includes(skill)) {
            return false;
          }
        }
      }
    }
    return true;
  },
  /**
   *
   * @param {GameEvent} event
   * @param {Player} player
   * @param {string} skill
   * @returns {boolean}
   */
  filterEnable: function (event, player, skill) {
    const info = get.info(skill);
    if (!info) {
      console.error(new ReferenceError("缺少info的技能:", skill));
      return false;
    }
    // if (!game.expandSkills(player.getSkills('invisible').concat(lib.skill.global)).includes(skill)) return false;
    if (
      !game
        .expandSkills(player.getSkills(false).concat(lib.skill.global))
        .includes(skill)
    ) {
      //hiddenSkills
      if (player.hasSkillTag("nomingzhi", false, null, true)) {
        return false;
      }
      if (get.mode() !== "guozhan") {
        return false;
      }
      if (info.noHidden) {
        return false;
      }
    }
    const checkEnable = (enable) => {
      if (typeof enable === "function") {
        return enable(event);
      }
      if (Array.isArray(enable)) {
        return enable.some((i) => checkEnable(i));
      }
      if (enable === "phaseUse") {
        return event.type === "phase";
      }
      if (typeof enable === "string") {
        return enable === event.name;
      }
      return false;
    };
    if (!checkEnable(info.enable)) {
      return false;
    }
    if (info.filter && !info.filter(event, player)) {
      return false;
    }
    if (info.viewAs && typeof info.viewAs !== "function") {
      if (info.viewAsFilter && info.viewAsFilter(player) === false) {
        return false;
      }
      if (
        event.filterCard &&
        !event.filterCard(get.autoViewAs(info.viewAs, "unsure"), player, event)
      ) {
        return false;
      }
    }
    if (info.usable !== undefined) {
      let num = info.usable;
      if (typeof num === "function") {
        num = info.usable(skill, player);
      }
      if (typeof num === "number" && get.skillCount(skill, player) >= num) {
        return false;
      }
    }
    if (info.chooseButton && _status.event.noButton) {
      return false;
    }
    if (
      info.round &&
      info.round - (game.roundNumber - player.storage[skill + "_roundcount"]) >
        0
    ) {
      return false;
    }
    for (const item in player.storage) {
      if (!item.startsWith("temp_ban_")) {
        continue;
      }
      if (player.storage[item] !== true) {
        continue;
      }
      const skillName = item.slice(9);
      if (!lib.skill[skillName]) {
        continue;
      }
      const skills = game.expandSkills([skillName]);
      if (skills.includes(skill)) {
        return false;
      }
    }
    return true;
  },
  characterDisabled: function (i, libCharacter) {
    const args = Array.from(arguments).slice(2);
    if (!lib.character[i]) {
      return true;
    }
    if (lib.character[i].isUnseen) {
      return true;
    }
    if (!args.includes("ignoreForibidden")) {
      if (lib.config.forbidai.includes(i) || lib.character[i].isAiForbidden) {
        return true;
      }
    }
    if (lib.characterFilter[i] && !lib.characterFilter[i](get.mode())) {
      return true;
    }
    if (_status.connectMode) {
      if ((lib.configOL.banned || []).includes(i) || lib.connectBanned.includes(i)) {
        return true;
      }
    } else {
      if ((lib.config.banned || []).includes(i)) {
        return true;
      }
      var double_character = false;
      if (get.mode() == "guozhan") {
        double_character = true;
      }
      if (double_character && lib.config.forbiddouble.includes(i)) {
        return true;
      }
    }
  },
  characterDisabled2: function (i) {
    var info = lib.character[i];
    const args = Array.from(arguments).slice(1);
    if (!info) {
      return true;
    }
    if (info[4]) {
      if (info.isBoss || info.isHiddenBoss) {
        return !lib.config?.plays?.includes("boss");
      }
      if (info.isMinskin) {
        return true;
      }
      if (info.isUnseen) {
        return true;
      }
      if (
        !args.includes("ignoreForibidden") &&
        info.isAiForbidden &&
        (!_status.event.isMine || !_status.event.isMine())
      ) {
        return true;
      }
      if (lib.characterFilter[i] && !lib.characterFilter[i](get.mode())) {
        return true;
      }
    }
    return false;
  },
  skillDisabled: function (skill) {
    if (!lib.translate[skill] || !lib.translate[skill + "_info"]) {
      return true;
    }
    var info = lib.skill[skill];
    if (
      info &&
      !info.unique &&
      !info.temp &&
      !info.sub &&
      !info.fixed &&
      !info.vanish
    ) {
      return false;
    }
    return true;
  },
  cardEnabled: function (card, player, event) {
    if (player == undefined) {
      player = _status.event.player;
    }
    if (!player) {
      return false;
    }
    if (get.itemtype(card) == "card") {
      var mod2 = game.checkMod(
        card,
        player,
        event,
        "unchanged",
        "cardEnabled2",
        player
      );
      if (mod2 != "unchanged") {
        return mod2;
      }
    }
    card = get.autoViewAs(card);
    if (event === "forceEnable") {
      var mod = game.checkMod(
        card,
        player,
        event,
        "unchanged",
        "cardEnabled",
        player
      );
      if (mod != "unchanged") {
        return mod;
      }
      return true;
    } else {
      var filter = get.info(card).enable;
      if (!filter) {
        return;
      }
      var mod = game.checkMod(
        card,
        player,
        event,
        "unchanged",
        "cardEnabled",
        player
      );
      if (mod != "unchanged") {
        return mod;
      }
      if (typeof filter == "boolean") {
        return filter;
      }
      if (typeof filter == "function") {
        return filter(card, player, event);
      }
    }
  },
  cardRespondable: function (card, player, event) {
    event = event || _status.event;
    if (event.name != "chooseToRespond") {
      return true;
    }
    if (player == undefined) {
      player = _status.event.player;
    }
    if (!player) {
      return false;
    }
    var source = event.getParent().player;
    if (source && source != player) {
      if (source.hasSkillTag("norespond", false, [card, player, event], true)) {
        return false;
      }
    }
    if (get.itemtype(card) == "card") {
      var mod2 = game.checkMod(
        card,
        player,
        event,
        "unchanged",
        "cardEnabled2",
        player
      );
      if (mod2 != "unchanged") {
        return mod2;
      }
    }
    card = get.autoViewAs(card);
    var mod = game.checkMod(
      card,
      player,
      "unchanged",
      "cardRespondable",
      player
    );
    if (mod != "unchanged") {
      return mod;
    }
    return true;
  },
  cardUsable2: function (card, player, event) {
    card = get.autoViewAs(card);
    var info = get.info(card);
    if (info.updateUsable == "phaseUse") {
      event = event || _status.event;
      if (event.type == "chooseToUse_button") {
        event = event.getParent();
      }
      if (player != _status.event.player) {
        return true;
      }
      if (event.getParent().name != "phaseUse") {
        return true;
      }
      if (event.getParent().player != player) {
        return true;
      }
    }
    var num = info.usable;
    if (typeof num == "function") {
      num = num(card, player);
    }
    num = game.checkMod(card, player, num, "cardUsable", player);
    if (typeof num != "number") {
      return true;
    } else {
      return player.countUsed(card) < num;
    }
  },
  cardUsable(card, player, event) {
    card = get.autoViewAs(card);
    var info = get.info(card);
    event = event || _status.event;
    if (event.type == "chooseToUse_button") {
      event = event.getParent();
    }
    if (player != event.player) {
      return true;
    }
    if (info.updateUsable == "phaseUse") {
      if (event.getParent().name != "phaseUse") {
        return true;
      }
      if (event.getParent().player != player) {
        return true;
      }
    }
    event.addCount_extra = true;
    var num = info.usable;
    if (typeof num == "function") {
      num = num(card, player);
    }
    num = game.checkMod(card, player, num, "cardUsable", player);
    if (typeof num != "number") {
      return typeof num == "boolean" ? num : true;
    }
    if (player.countUsed(card) < num) {
      return true;
    }
    if (
      game.hasPlayer2(function (current) {
        return game.checkMod(
          card,
          player,
          current,
          false,
          "cardUsableTarget",
          player
        );
      }, true)
    ) {
      return true;
    }
    return false;
  },
  /**
   * player的card在event事件中能否被自己弃置
   * @param { Card } card 要被弃置的牌
   * @param { Player } player 执行弃牌的角色
   * @param { string } [event] 弃置牌事件的名称
   * @returns { boolean }
   */
  cardDiscardable: function (card, player, event) {
    event = event || _status.event;
    if (typeof event != "string") {
      event = event.getParent().name;
    }
    var mod = game.checkMod(
      card,
      player,
      event,
      "unchanged",
      "cardDiscardable",
      player
    );
    if (mod != "unchanged") {
      return mod;
    }
    return true;
  },
  /**
   * target的card在event事件中能否被player弃置
   * @param { Card } card 要被弃置的牌
   * @param { Player } player 执行弃牌的角色
   * @param { Player } target 被弃置牌的现持有者
   * @param { string } [event] 弃置牌事件的名称
   * @returns { boolean }
   */
  canBeDiscarded: function (card, player, target, event) {
    event = event || _status.event;
    if (typeof event != "string") {
      event = event.getParent().name;
    }
    var mod = game.checkMod(
      card,
      player,
      target,
      event,
      "unchanged",
      "canBeDiscarded",
      target
    );
    if (mod != "unchanged") {
      return mod;
    }
    return true;
  },
  /**
   * target的card在event事件中能否被player获得
   * @param { Card } card 要被获得的牌
   * @param { Player } player 获得牌的角色
   * @param { Player } target 被获得牌的现持有者
   * @param { string } [event] 获得牌事件的名称
   * @returns { boolean }
   */
  canBeGained: function (card, player, target, event) {
    event = event || _status.event;
    if (typeof event != "string") {
      event = event.getParent().name;
    }
    var mod = game.checkMod(
      card,
      player,
      target,
      event,
      "unchanged",
      "canBeGained",
      target
    );
    if (mod != "unchanged") {
      return mod;
    }
    return true;
  },
  cardAiIncluded: function (card) {
    if (_status.event.isMine()) {
      return true;
    }
    return _status.event._aiexclude.includes(card) == false;
  },
  filterCard(card, player, event) {
    var info = get.info(card);
    //if(info.toself&&!lib.filter.targetEnabled(card,player,player)) return false;
    if (player == undefined) {
      player = _status.event.player;
    }
    if (
      !lib.filter.cardEnabled(card, player, event) ||
      !lib.filter.cardUsable(card, player, event)
    ) {
      return false;
    }
    if (info.notarget) {
      return true;
    }
    var range;
    var select = get.copy(info.selectTarget);
    if (select == undefined) {
      if (info.filterTarget == undefined) {
        return true;
      }
      range = [1, 1];
    } else if (typeof select == "number") {
      range = [select, select];
    } else if (get.itemtype(select) == "select") {
      range = select;
    } else if (typeof select == "function") {
      range = select(card, player);
    }
    game.checkMod(card, player, range, "selectTarget", player);
    if (!range || range[1] != -1) {
      return true;
    }
    var filterTarget =
      event && event.filterTarget
        ? event.filterTarget
        : lib.filter.filterTarget;
    return game.hasPlayer2(function (current) {
      return filterTarget(card, player, current);
    }, true);
  },
  targetEnabledx(card, player, target) {
    if (!card || !target || target.removed) {
      return false;
    }
    const info = get.info(card);
    if (!info?.deadTarget && target.isDead()) {
      return false;
    }
    if (!info?.includeOut && target.isOut()) {
      return false;
    }
    let event = _status.event,
      evt = event.getParent("chooseToUse");
    if (get.itemtype(evt) !== "event") {
      evt = event;
    }
    if (
      event._backup &&
      event._backup.filterCard == lib.filter.filterCard &&
      (!lib.filter.cardEnabled(card, player, event) ||
        !lib.filter.cardUsable(card, player, evt))
    ) {
      return false;
    }
    if (event.addCount_extra) {
      if (
        !lib.filter.cardUsable2(card, player) &&
        !game.checkMod(card, player, target, false, "cardUsableTarget", player)
      ) {
        return false;
      }
    }
    if (
      info.singleCard &&
      info.filterAddedTarget &&
      ui.selected.targets.length
    ) {
      return Boolean(
        info.filterAddedTarget(
          card,
          player,
          target,
          ui.selected.targets[ui.selected.targets.length - 1]
        )
      );
    }
    return lib.filter.targetEnabled.apply(this, arguments);
  },
  targetEnabled(card, player, target) {
    if (!card || !target || target.removed) {
      return false;
    }
    const info = get.info(card);
    if (!info?.deadTarget && target.isDead()) {
      return false;
    }
    if (!info?.includeOut && target.isOut()) {
      return false;
    }
    const filter = info.filterTarget;
    if (!info.singleCard || ui.selected.targets.length == 0) {
      let mod = game.checkMod(
        card,
        player,
        target,
        "unchanged",
        "playerEnabled",
        player
      );
      if (mod != "unchanged") {
        return mod;
      }
      mod = game.checkMod(
        card,
        player,
        target,
        "unchanged",
        "targetEnabled",
        target
      );
      if (mod != "unchanged") {
        return mod;
      }
    }
    if (typeof filter == "boolean") {
      return filter;
    }
    if (typeof filter == "function") {
      return Boolean(filter(card, player, target));
    }
  },
  targetEnabled2(card, player, target) {
    if (!card || !target || target.removed) {
      return false;
    }
    const info = get.info(card);
    if (!info?.deadTarget && target.isDead()) {
      return false;
    }
    if (!info?.includeOut && target.isOut()) {
      return false;
    }
    if (lib.filter.targetEnabled(card, player, target)) {
      return true;
    }

    if (
      game.checkMod(
        card,
        player,
        target,
        "unchanged",
        "playerEnabled",
        player
      ) == false
    ) {
      return false;
    }
    if (
      game.checkMod(
        card,
        player,
        target,
        "unchanged",
        "targetEnabled",
        target
      ) == false
    ) {
      return false;
    }

    const filter = get.info(card).modTarget;
    if (typeof filter == "boolean") {
      return filter;
    }
    if (typeof filter == "function") {
      return Boolean(filter(card, player, target));
    }
    return false;
  },
  targetEnabled3(card, player, target) {
    if (!card || !target || target.removed) {
      return false;
    }
    const info = get.info(card);
    if (!info?.deadTarget && target.isDead()) {
      return false;
    }
    if (!info?.includeOut && target.isOut()) {
      return false;
    }

    if (info.filterTarget == true) {
      return true;
    }
    if (
      typeof info.filterTarget == "function" &&
      info.filterTarget(card, player, target)
    ) {
      return true;
    }

    if (info.modTarget == true) {
      return true;
    }
    if (
      typeof info.modTarget == "function" &&
      info.modTarget(card, player, target)
    ) {
      return true;
    }
    return false;
  },
  targetInRange: function (card, player, target) {
    var info = get.info(card);
    var range = info.range;
    var outrange = info.outrange;
    if (range == undefined && outrange == undefined) {
      return true;
    }

    var mod = game.checkMod(
      card,
      player,
      target,
      "unchanged",
      "targetInRange",
      player
    );
    var extra = 0;
    if (mod != "unchanged") {
      if (typeof mod == "boolean") {
        return mod;
      }
      if (typeof mod == "number") {
        extra = mod;
      }
    }
    if (typeof info.range == "function") {
      return info.range(card, player, target);
    }

    if (player.hasSkill("undist") || target.hasSkill("undist")) {
      return false;
    }
    for (var i in range) {
      if (i == "attack") {
        var range2 = player.getAttackRange();
        if (range2 <= 0) {
          return false;
        }
        var distance = get.distance(player, target) + extra;
        if (range[i] <= distance - range2) {
          return false;
        }
      } else {
        var distance = get.distance(player, target, i) + extra;
        if (range[i] < distance) {
          return false;
        }
      }
    }
    for (var i in outrange) {
      if (i == "attack") {
        var range2 = player.getAttackRange();
        if (range2 <= 0) {
          return false;
        }
        var distance = get.distance(player, target) + extra;
        if (outrange[i] > distance - range2 + 1) {
          return false;
        }
      } else {
        var distance = get.distance(player, target, i) + extra;
        if (outrange[i] > distance) {
          return false;
        }
      }
    }
    return true;
  },
  filterTarget: function (card, player, target) {
    return (
      lib.filter.targetEnabledx(card, player, target) &&
      lib.filter.targetInRange(card, player, target)
    );
  },
  filterTarget2: function (card, player, target) {
    return (
      lib.filter.targetEnabled2(card, player, target) &&
      lib.filter.targetInRange(card, player, target)
    );
  },
  notMe: function (card, player, target) {
    return player != target;
  },
  isMe: function (card, player, target) {
    return player == target;
  },
  attackFrom: function (card, player, target) {
    return get.distance(player, target, "attack") <= 1;
  },
  globalFrom: function (card, player, target) {
    return get.distance(player, target) <= 1;
  },
  selectCard: function () {
    return [1, 1];
  },
  selectTarget: function (card, player) {
    if (!card) {
      card = get.card();
    }
    if (!player) {
      player = get.player();
    }
    if (card == undefined) {
      return;
    }
    var range,
      info = get.info(card);
    var select = get.copy(info.selectTarget);
    if (select == undefined) {
      if (info.filterTarget == undefined) {
        return [0, 0];
      }
      range = [1, 1];
    } else if (typeof select == "number") {
      range = [select, select];
    } else if (get.itemtype(select) == "select") {
      range = select;
    } else if (typeof select == "function") {
      range = select(card, player);
    }
    game.checkMod(card, player, range, "selectTarget", player);
    if (info.singleCard && info.filterAddedTarget) {
      return [range[0] * 2, range[1] * 2];
    }
    return range;
  },
  judge: function (card, player, target) {
    return target.canAddJudge(card);
  },
  autoRespondSha: function () {
    return !this.player.hasSha("respond");
  },
  autoRespondShan: function () {
    return !this.player.hasShan("respond");
  },
  wuxieSwap: function (event) {
    if (event.type == "wuxie") {
      if (ui.wuxie && ui.wuxie.classList.contains("glow")) {
        return true;
      }
      if (
        ui.tempnowuxie &&
        ui.tempnowuxie.classList.contains("glow") &&
        event.state > 0
      ) {
        var triggerevent = event.getTrigger();
        if (triggerevent) {
          if (ui.tempnowuxie._origin == triggerevent.parent.id) {
            return true;
          }
        } else if (ui.tempnowuxie._origin == _status.event.id2) {
          return true;
        }
      }
      if (lib.config.wuxie_self) {
        var tw = event.info_map;
        if (
          tw.player &&
          tw.player.isUnderControl(true) &&
          !tw.player.hasSkillTag("noautowuxie") &&
          (!tw.targets || tw.targets.length <= 1) &&
          !tw.noai
        ) {
          return true;
        }
      }
    }
  },
};
