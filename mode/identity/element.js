import { lib, game, ui, get, ai, _status } from "../../noname.js";

export default {
  player: {
    addExpose: function (num) {
      if (!game.zhu || !game.zhu.isZhu || !game.zhu.identityShown) {
        return;
      }
      if (
        typeof this.ai.shown == "number" &&
        !this.identityShown &&
        this.ai.shown < 1
      ) {
        this.ai.shown += num;
        if (this.ai.shown > 0.95) {
          this.ai.shown = 0.95;
        }
      }
      return this;
    },
    $dieAfter: function () {
      if (_status.video) {
        return;
      }
      if (!this.node.dieidentity) {
        var str = get.translation(this.identity + "2");
        var node = ui.create.div(".damage.dieidentity", str, this);
        ui.refresh(node);
        node.style.opacity = 1;
        this.node.dieidentity = node;
      }
      var trans = this.style.transform;
      if (trans) {
        if (trans.indexOf("rotateY") != -1) {
          this.node.dieidentity.style.transform = "rotateY(180deg)";
        } else if (trans.indexOf("rotateX") != -1) {
          this.node.dieidentity.style.transform = "rotateX(180deg)";
        } else {
          this.node.dieidentity.style.transform = "";
        }
      } else {
        this.node.dieidentity.style.transform = "";
      }
    },
    dieAfter2: function (source) {
      if (this.identity == "fan" && source) {
        source.draw(3);
      } else if (
        this.identity == "zhong" &&
        source &&
        source.identity == "zhu" &&
        source.isZhu
      ) {
        source.discard(source.getCards("he"));
      }
    },
    dieAfter: function (source) {
      if (!this.identityShown) {
        game.broadcastAll(
          function (player, identity, identity2) {
            player.setIdentity(player.identity);
            player.identityShown = true;
            player.node.identity.classList.remove("guessing");
            if (identity) {
              player.node.identity.firstChild.innerHTML = get.translation(
                identity + "_bg"
              );
              game.log(player, "的身份是", "#g" + get.translation(identity));
            } else {
              game.log(
                player,
                "的身份是",
                "#g" + get.translation(identity2 + "2")
              );
            }
          },
          this,
          this.special_identity,
          this.identity
        );
      }
      game.checkResult();
      if (game.zhu && game.zhu.isZhu) {
        if (
          (get.population("zhong") == 0 ||
            get.population("zhong") + get.population("fan") == 0) &&
          get.population("commoner") == 0
        ) {
          game.broadcastAll(function () {
            if (game.showIdentity) {
              game.showIdentity();
            }
          });
        }
      }
      if (this == game.zhong) {
        game.broadcastAll(function (player) {
          game.zhu = player;
          game.zhu.identityShown = true;
          game.zhu.ai.shown = 1;
          game.zhu.setIdentity();
          game.zhu.isZhu = true;
          var skills = player.getStockSkills(true, true).filter((skill) => {
            if (player.hasSkill(skill)) {
              return false;
            }
            var info = get.info(skill);
            return info && info.zhuSkill;
          });
          if (skills.length) {
            player.addSkills(skills);
          }
          game.zhu.node.identity.classList.remove("guessing");
          if (lib.config.animation && !lib.config.low_performance) {
            game.zhu.$legend();
          }
          delete game.zhong;
          if (
            _status.clickingidentity &&
            _status.clickingidentity[0] == game.zhu
          ) {
            for (var i = 0; i < _status.clickingidentity[1].length; i++) {
              _status.clickingidentity[1][i].delete();
              _status.clickingidentity[1][i].style.transform = "";
            }
            delete _status.clickingidentity;
          }
        }, game.zhu);
        game.delay(2);
        game.zhu.playerfocus(1000);
      }

      if (!_status.over) {
        var giveup;
        if (get.population("fan") + get.population("nei") == 1) {
          for (var i = 0; i < game.players.length; i++) {
            if (
              game.players[i].identity == "fan" ||
              game.players[i].identity == "nei"
            ) {
              giveup = game.players[i];
              break;
            }
          }
        } else if (
          get.population("zhong") +
            get.population("mingzhong") +
            get.population("nei") ==
          0
        ) {
          giveup = game.zhu;
        }
        if (giveup) {
          giveup.showGiveup();
        }
      }
    },
    logAi: function (targets, card) {
      if (this.ai.shown == 1 || this.isMad()) {
        return;
      }
      var stratagemMode =
        get.mode() == "identity" && _status.mode == "stratagem";
      if (
        stratagemMode &&
        (!game.zhu || !game.zhu.isZhu || !game.zhu.identityShown)
      ) {
        return;
      }
      if (typeof targets == "number") {
        this.ai.shown += targets;
      } else {
        var effect = 0,
          c,
          shown;
        var info = get.info(card);
        if (info.ai && info.ai.expose) {
          if (_status.event.name == "_wuxie" && card.name == "wuxie") {
            const infomap = _status.event._info_map;
            if (infomap) {
              if (
                this != infomap.target &&
                infomap.player &&
                infomap.player.ai.shown
              ) {
                this.ai.shown += 0.2;
              }
            }
          } else {
            this.ai.shown += info.ai.expose;
          }
        }
        if (targets.length > 0) {
          for (var i = 0; i < targets.length; i++) {
            shown = Math.abs(targets[i].ai.shown);
            if (shown < 0.2 || targets[i].identity == "nei") {
              c = 0;
            } else if (shown < 0.4) {
              c = 0.5;
            } else if (shown < 0.6) {
              c = 0.8;
            } else {
              c = 1;
            }
            var eff = get.effect(targets[i], card, this);
            effect += eff * c;
            if (
              eff == 0 &&
              shown == 0 &&
              ["zhong", "rZhong", "bZhong"].includes(this.identity) &&
              targets[i] != this
            ) {
              effect += 0.1;
            }
          }
        }
        if (effect > 0) {
          if (effect < 1) {
            c = 0.5;
          } else {
            c = 1;
          }
          if (targets.length != 1 || targets[0] != this) {
            if (targets.length == 1) {
              this.ai.shown += 0.2 * c;
            } else {
              this.ai.shown += 0.1 * c;
            }
          }
        } else if (
          effect < 0 &&
          this == game.me &&
          ["nei", "commoner", "rYe", "bYe"].includes(game.me.identity)
        ) {
          if (targets.length != 1 || targets[0] != this) {
            if (targets.length == 1) {
              this.ai.shown -= 0.2;
            } else {
              this.ai.shown -= 0.1;
            }
          }
        }
      }
      if (!stratagemMode && this != game.me) {
        this.ai.shown *= 2;
      }
      if (this.ai.shown > 0.95) {
        this.ai.shown = 0.95;
      }
      if (this.ai.shown < -0.5) {
        this.ai.shown = -0.5;
      }
      if (_status.mode == "purple") {
        return;
      }
      if (stratagemMode) {
        return;
      }

      var marknow =
        !_status.connectMode &&
        this != game.me &&
        get.config("auto_mark_identity") &&
        this.ai.identity_mark != "finished";
      // if(true){
      if (
        marknow &&
        _status.clickingidentity &&
        _status.clickingidentity[0] == this
      ) {
        for (var i = 0; i < _status.clickingidentity[1].length; i++) {
          _status.clickingidentity[1][i].delete();
          _status.clickingidentity[1][i].style.transform = "";
        }
        delete _status.clickingidentity;
      }
      if (!Array.isArray(targets)) {
        targets = [];
      }
      var effect = 0,
        c,
        shown;
      var zhu = game.zhu;
      if (_status.mode == "zhong" && !game.zhu.isZhu) {
        zhu = game.zhong;
      }
      if (targets.length == 1 && targets[0] == this) {
        effect = 0;
      } else if (this.identity != "nei" && this.identity != "commoner") {
        if (this.ai.shown > 0) {
          if (this.identity == "fan") {
            effect = -1;
          } else {
            effect = 1;
          }
        }
      } else if (targets.length > 0) {
        for (var i = 0; i < targets.length; i++) {
          shown = Math.abs(targets[i].ai.shown);
          if (shown < 0.2 || targets[i].identity == "nei") {
            c = 0;
          } else if (shown < 0.4) {
            c = 0.5;
          } else if (shown < 0.6) {
            c = 0.8;
          } else {
            c = 1;
          }
          effect += get.effect(targets[i], card, this, zhu) * c;
        }
      }
      if (this.identity == "nei" || this.identity == "commoner") {
        if (effect > 0) {
          if (this.ai.identity_mark == "fan") {
            if (marknow) {
              this.setIdentity();
            }
            this.ai.identity_mark = "finished";
          } else {
            if (marknow) {
              this.setIdentity("zhong");
            }
            this.ai.identity_mark = "zhong";
          }
        } else if (effect < 0 && get.population("fan") > 0) {
          if (this.ai.identity_mark == "zhong") {
            if (marknow) {
              this.setIdentity();
            }
            this.ai.identity_mark = "finished";
          } else {
            if (marknow) {
              this.setIdentity("fan");
            }
            this.ai.identity_mark = "fan";
          }
        }
      } else if (marknow) {
        if (effect > 0 && this.identity != "fan") {
          this.setIdentity("zhong");
          this.ai.identity_mark = "finished";
        } else if (effect < 0 && this.identity == "fan") {
          this.setIdentity("fan");
          this.ai.identity_mark = "finished";
        }
      }
      // }
    },
    showIdentity: function () {
      this.node.identity.classList.remove("guessing");
      this.identityShown = true;
      this.ai.shown = 1;
      this.setIdentity();
      if (this.special_identity) {
        this.node.identity.firstChild.innerHTML = get.translation(
          this.special_identity + "_bg"
        );
      }
      if (this.identity == "zhu") {
        this.isZhu = true;
      } else {
        delete this.isZhu;
      }
      if (_status.clickingidentity) {
        for (var i = 0; i < _status.clickingidentity[1].length; i++) {
          _status.clickingidentity[1][i].delete();
          _status.clickingidentity[1][i].style.transform = "";
        }
        delete _status.clickingidentity;
      }
    },
  },
  content: {},
};
