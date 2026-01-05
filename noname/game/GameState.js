import { get } from '../get/index.js';
import { lib } from '../library/index.js';
import { _status } from '../status/index.js';

/**
 * 游戏状态管理器 - 负责管理游戏的核心状态
 */
export class GameState {
  constructor() {
    // 游戏基础状态
    this.gameStarted = false;
    this.gameOver = false;
    this.currentPhase = null;
    this.phaseNumber = 0;
    this.roundNumber = 0;
    this.shuffleNumber = 0;
    
    // 玩家相关状态
    this.currentPlayer = null;
    this.players = [];
    this.deadPlayers = [];
    this.playerMap = new Map();
    
    // 游戏模式相关
    this.connectMode = false;
    this.onlineMode = false;
    this.gameMode = null;
    
    // 游戏计数
    this.actionCount = 0;
    this.turnCount = 0;
    
    // 初始化状态
    this.init();
  }

  /**
   * 初始化游戏状态
   */
  init() {
    this.reset();
  }

  /**
   * 重置游戏状态
   */
  reset() {
    this.gameStarted = false;
    this.gameOver = false;
    this.currentPhase = null;
    this.phaseNumber = 0;
    this.roundNumber = 0;
    this.shuffleNumber = 0;
    
    this.currentPlayer = null;
    this.players = [];
    this.deadPlayers = [];
    this.playerMap.clear();
    
    this.connectMode = false;
    this.onlineMode = false;
    this.gameMode = null;
    
    this.actionCount = 0;
    this.turnCount = 0;
    
    // 同步到全局状态
    this.syncToGlobalStatus();
  }

  /**
   * 开始游戏
   */
  startGame() {
    this.gameStarted = true;
    this.gameOver = false;
    this.currentPhase = 'start';
    this.phaseNumber = 0;
    this.roundNumber = 1;
    this.syncToGlobalStatus();
  }

  /**
   * 结束游戏
   */
  endGame() {
    this.gameStarted = false;
    this.gameOver = true;
    this.syncToGlobalStatus();
  }

  /**
   * 设置当前游戏模式
   * @param {string} mode - 游戏模式名称
   */
  setGameMode(mode) {
    this.gameMode = mode;
    _status.mode = mode;
    this.syncToGlobalStatus();
  }

  /**
   * 获取当前游戏模式
   * @returns {string} - 当前游戏模式
   */
  getGameMode() {
    return this.gameMode;
  }

  /**
   * 设置当前阶段
   * @param {string} phase - 阶段名称
   */
  setPhase(phase) {
    this.currentPhase = phase;
    _status.currentPhase = phase;
    this.syncToGlobalStatus();
  }

  /**
   * 获取当前阶段
   * @returns {string} - 当前阶段
   */
  getPhase() {
    return this.currentPhase;
  }

  /**
   * 进入下一阶段
   */
  nextPhase() {
    this.phaseNumber++;
    this.syncToGlobalStatus();
  }

  /**
   * 更新回合数
   */
  updateRoundNumber() {
    this.roundNumber++;
    _status.roundNumber = this.roundNumber;
    this.syncToGlobalStatus();
  }

  /**
   * 获取回合数
   * @returns {number} - 回合数
   */
  getRoundNumber() {
    return this.roundNumber;
  }

  /**
   * 设置当前玩家
   * @param {any} player - 当前玩家对象
   */
  setCurrentPlayer(player) {
    this.currentPlayer = player;
    this.syncToGlobalStatus();
  }

  /**
   * 获取当前玩家
   * @returns {any} - 当前玩家对象
   */
  getCurrentPlayer() {
    return this.currentPlayer;
  }

  /**
   * 添加玩家
   * @param {any} player - 要添加的玩家对象
   */
  addPlayer(player) {
    this.players.push(player);
    this.playerMap.set(player.id || player.name, player);
    this.syncToGlobalStatus();
  }

  /**
   * 移除玩家
   * @param {any} player - 要移除的玩家对象
   */
  removePlayer(player) {
    const index = this.players.indexOf(player);
    if (index > -1) {
      this.players.splice(index, 1);
      this.playerMap.delete(player.id || player.name);
    }
    this.syncToGlobalStatus();
  }

  /**
   * 将玩家标记为死亡
   * @param {any} player - 要标记为死亡的玩家对象
   */
  markPlayerAsDead(player) {
    this.removePlayer(player);
    this.deadPlayers.push(player);
    this.syncToGlobalStatus();
  }

  /**
   * 获取所有玩家
   * @returns {any[]} - 玩家列表
   */
  getAllPlayers() {
    return [...this.players, ...this.deadPlayers];
  }

  /**
   * 获取存活玩家
   * @returns {any[]} - 存活玩家列表
   */
  getAlivePlayers() {
    return this.players.slice();
  }

  /**
   * 获取死亡玩家
   * @returns {any[]} - 死亡玩家列表
   */
  getDeadPlayers() {
    return this.deadPlayers.slice();
  }

  /**
   * 根据ID获取玩家
   * @param {string|number} id - 玩家ID
   * @returns {any|null} - 玩家对象或null
   */
  getPlayerById(id) {
    return this.playerMap.get(id) || null;
  }

  /**
   * 设置连接模式
   * @param {boolean} mode - 是否为连接模式
   */
  setConnectMode(mode) {
    this.connectMode = mode;
    _status.connectMode = mode;
    this.syncToGlobalStatus();
  }

  /**
   * 获取连接模式
   * @returns {boolean} - 是否为连接模式
   */
  getConnectMode() {
    return this.connectMode;
  }

  /**
   * 设置在线模式
   * @param {boolean} mode - 是否为在线模式
   */
  setOnlineMode(mode) {
    this.onlineMode = mode;
    this.syncToGlobalStatus();
  }

  /**
   * 获取在线模式
   * @returns {boolean} - 是否为在线模式
   */
  getOnlineMode() {
    return this.onlineMode;
  }

  /**
   * 增加行动计数
   */
  incrementActionCount() {
    this.actionCount++;
    this.syncToGlobalStatus();
  }

  /**
   * 获取行动计数
   * @returns {number} - 行动计数
   */
  getActionCount() {
    return this.actionCount;
  }

  /**
   * 增加洗牌计数
   */
  incrementShuffleCount() {
    this.shuffleNumber++;
    this.syncToGlobalStatus();
  }

  /**
   * 获取洗牌计数
   * @returns {number} - 洗牌计数
   */
  getShuffleCount() {
    return this.shuffleNumber;
  }

  /**
   * 同步状态到全局状态对象
   */
  syncToGlobalStatus() {
    // 同步核心状态到全局_status对象
    _status.currentPhase = this.currentPhase;
    _status.roundNumber = this.roundNumber;
    _status.mode = this.gameMode;
    _status.connectMode = this.connectMode;
  }

  /**
   * 获取游戏状态快照
   * @returns {Object} - 游戏状态快照
   */
  getStateSnapshot() {
    return {
      gameStarted: this.gameStarted,
      gameOver: this.gameOver,
      currentPhase: this.currentPhase,
      phaseNumber: this.phaseNumber,
      roundNumber: this.roundNumber,
      shuffleNumber: this.shuffleNumber,
      gameMode: this.gameMode,
      connectMode: this.connectMode,
      onlineMode: this.onlineMode,
      actionCount: this.actionCount,
      turnCount: this.turnCount,
      playerCount: this.players.length,
      deadPlayerCount: this.deadPlayers.length
    };
  }

  /**
   * 恢复游戏状态
   * @param {Object} snapshot - 游戏状态快照
   */
  restoreState(snapshot) {
    if (!snapshot) return;
    
    this.gameStarted = snapshot.gameStarted || false;
    this.gameOver = snapshot.gameOver || false;
    this.currentPhase = snapshot.currentPhase || null;
    this.phaseNumber = snapshot.phaseNumber || 0;
    this.roundNumber = snapshot.roundNumber || 0;
    this.shuffleNumber = snapshot.shuffleNumber || 0;
    this.gameMode = snapshot.gameMode || null;
    this.connectMode = snapshot.connectMode || false;
    this.onlineMode = snapshot.onlineMode || false;
    this.actionCount = snapshot.actionCount || 0;
    this.turnCount = snapshot.turnCount || 0;
    
    this.syncToGlobalStatus();
  }
}

// 导出单例实例
export const gameState = new GameState();
