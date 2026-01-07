import { lib, game, ui, get, ai, _status } from "../../noname.js";

export default {
  player: {
    $dieAfter: function () {
      if (_status.video) {
        return;
      }
      if (!this.node.dieidentity) {
        var str;
        if (this.special_identity) {
          str = get.translation(this.special_identity);
        } else {
          str = get.translation(this.identity + "2");
        }
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
      if (this.special_identity) {
        game.broadcastAll(
          function (zhu, identity) {
            zhu.removeSkill(identity);
          },
          game.zhu,
          this.special_identity
        );
      }
      game.checkResult();
      if (
        game.zhu &&
        game.zhu.storage.enhance_zhu &&
        !game.zhu.storage.enhance_zhu.startsWith("sixiang_") &&
        get.population("fan") < 3
      ) {
        game.zhu.removeSkill(game.zhu.storage.enhance_zhu);
        delete game.zhu.storage.enhance_zhu;
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
        if (get.population("fan") == 1) {
          for (var i = 0; i < game.players.length; i++) {
            if (game.players[i].identity == "fan") {
              giveup = game.players[i];
              break;
            }
          }
        } else if (get.population("zhong") == 0) {
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
              this.identity == "zhong" &&
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
        }
      }
      if (this != game.me) {
        this.ai.shown *= 2;
      }
      if (this.ai.shown > 0.95) {
        this.ai.shown = 0.95;
      }
      if (this.ai.shown < -0.5) {
        this.ai.shown = -0.5;
      }

      var marknow =
        !_status.connectMode &&
        this != game.me &&
        get.config("auto_mark_identity") &&
        this.ai.identity_mark != "finished";
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
      if (targets.length == 1 && targets[0] == this) {
        effect = 0;
      } else if (this.identity != "nei") {
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
      if (this.identity == "nei") {
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
};
