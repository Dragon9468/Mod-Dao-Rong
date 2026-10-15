/**
 * Đấu Trường Rồng & Vượt Ải Cốt Truyện - Battle Engine Đảo Rồng
 * Hỗ trợ cả PVE Vượt Ải và PVP Trực Tuyến Thời Gian Thực với Bạn Bè
 */

class DragonBattleEngine {
  constructor() {
    this.playerTeam = []; // 1-3 dragons
    this.enemyTeam = [];  // 1-3 dragons
    this.turnOrder = [];
    this.currentTurnIndex = 0;
    this.isPVP = false;
    this.isMyTurn = true;
    this.battleActive = false;
    this.onStateChange = null;
    this.onBattleEnd = null;
    this.onActionEffect = null;
    this.stageConfig = null;
  }

  initPVE(stageConfig, selectedPlayerDragons) {
    this.stageConfig = stageConfig;
    this.isPVP = false;
    this.isMyTurn = true;
    this.battleActive = true;

    // Build player team
    this.playerTeam = selectedPlayerDragons.map((d, idx) => {
      const config = DRAGONS_DB[d.id];
      const stats = calculateDragonStats(config.baseStats, d.level);
      return {
        uid: `p_${idx}`,
        isEnemy: false,
        id: d.id,
        name: d.name || config.name,
        level: d.level,
        config: config,
        hp: stats.hp,
        maxHp: stats.hp,
        atk: stats.atk,
        def: stats.def,
        spd: stats.spd,
        rage: 0,
        maxRage: 100,
        isDead: false
      };
    });

    // Build enemy team
    this.enemyTeam = stageConfig.enemies.map((enemyId, idx) => {
      const config = DRAGONS_DB[enemyId] || DRAGONS_DB.dragon_fire;
      const stats = calculateDragonStats(config.baseStats, stageConfig.level);
      const isBoss = (idx === stageConfig.enemies.length - 1 && stageConfig.enemies.length >= 3);
      const bossMultiplier = isBoss ? 1.4 : 1.0;

      return {
        uid: `e_${idx}`,
        isEnemy: true,
        id: enemyId,
        name: isBoss ? `[BOSS] ${config.name}` : config.name,
        level: stageConfig.level,
        config: config,
        hp: Math.round(stats.hp * bossMultiplier),
        maxHp: Math.round(stats.hp * bossMultiplier),
        atk: Math.round(stats.atk * bossMultiplier),
        def: Math.round(stats.def * bossMultiplier),
        spd: stats.spd,
        rage: 0,
        maxRage: 100,
        isDead: false
      };
    });

    this.calculateTurnOrder();
    this.startNextTurn();
  }

  initPVP(myDragons, opponentDragons, isHost) {
    this.isPVP = true;
    this.battleActive = true;

    this.playerTeam = myDragons.map((d, idx) => {
      const config = DRAGONS_DB[d.id];
      const stats = calculateDragonStats(config.baseStats, d.level);
      return {
        uid: `p_${idx}`,
        isEnemy: false,
        id: d.id,
        name: d.name || config.name,
        level: d.level,
        config: config,
        hp: stats.hp,
        maxHp: stats.hp,
        atk: stats.atk,
        def: stats.def,
        spd: stats.spd,
        rage: 0,
        maxRage: 100,
        isDead: false
      };
    });

    this.enemyTeam = opponentDragons.map((d, idx) => {
      const config = DRAGONS_DB[d.id];
      const stats = calculateDragonStats(config.baseStats, d.level);
      return {
        uid: `e_${idx}`,
        isEnemy: true,
        id: d.id,
        name: d.name || config.name,
        level: d.level,
        config: config,
        hp: stats.hp,
        maxHp: stats.hp,
        atk: stats.atk,
        def: stats.def,
        spd: stats.spd,
        rage: 0,
        maxRage: 100,
        isDead: false
      };
    });

    this.calculateTurnOrder();
    this.isMyTurn = isHost;
    this.startNextTurn();
  }

  calculateTurnOrder() {
    const all = [...this.playerTeam, ...this.enemyTeam].filter(d => !d.isDead);
    // Sort by Speed descending
    all.sort((a, b) => b.spd - a.spd);
    this.turnOrder = all;
    this.currentTurnIndex = 0;
  }

  getCurrentFighter() {
    if (!this.battleActive) return null;
    return this.turnOrder[this.currentTurnIndex] || null;
  }

  startNextTurn() {
    // Check win/loss
    const playerAlive = this.playerTeam.some(d => !d.isDead);
    const enemyAlive = this.enemyTeam.some(d => !d.isDead);

    if (!playerAlive) {
      this.battleActive = false;
      if (window.DragonAudio) window.DragonAudio.playDefeat();
      if (this.onBattleEnd) this.onBattleEnd({ victory: false, stage: this.stageConfig });
      return;
    }

    if (!enemyAlive) {
      this.battleActive = false;
      if (window.DragonAudio) window.DragonAudio.playVictory();
      if (this.onBattleEnd) this.onBattleEnd({ victory: true, stage: this.stageConfig });
      return;
    }

    // Filter alive fighters
    this.turnOrder = this.turnOrder.filter(d => !d.isDead);
    if (this.currentTurnIndex >= this.turnOrder.length) {
      this.currentTurnIndex = 0;
    }

    const currentFighter = this.getCurrentFighter();
    if (!currentFighter) {
      this.calculateTurnOrder();
      return this.startNextTurn();
    }

    this.isMyTurn = !currentFighter.isEnemy;

    if (this.onStateChange) {
      this.onStateChange({
        currentFighter,
        isMyTurn: this.isMyTurn,
        playerTeam: this.playerTeam,
        enemyTeam: this.enemyTeam
      });
    }

    // If it's enemy AI turn in PVE
    if (!this.isPVP && currentFighter.isEnemy) {
      setTimeout(() => {
        this.executeAITurn();
      }, 1000);
    }
  }

  executeAITurn() {
    if (!this.battleActive) return;
    const attacker = this.getCurrentFighter();
    if (!attacker || !attacker.isEnemy) return;

    // Pick a random alive player dragon
    const targets = this.playerTeam.filter(d => !d.isDead);
    if (targets.length === 0) return;
    const target = targets[Math.floor(Math.random() * targets.length)];

    // Decide skill
    let actionType = 'normal';
    if (attacker.rage >= 100) {
      actionType = 'ultimate';
    } else if (attacker.rage >= 30 && Math.random() > 0.4) {
      actionType = 'elemental';
    }

    this.executeAction(attacker, target, actionType);
  }

  executeAction(attacker, target, actionType) {
    if (!attacker || !target || target.isDead) return;

    let skill = attacker.config.skills.normal;
    let rageCost = 0;
    let isUltimate = false;

    if (actionType === 'elemental') {
      skill = attacker.config.skills.elemental;
      rageCost = 25;
    } else if (actionType === 'ultimate') {
      skill = attacker.config.skills.ultimate;
      rageCost = 100;
      isUltimate = true;
    }

    attacker.rage = Math.max(0, attacker.rage - rageCost);

    // Calculate Elemental Advantage Multiplier
    let elementMultiplier = 1.0;
    let advantageText = '';
    const skillElement = skill.element || attacker.config.elements[0];
    const targetElements = target.config.elements;

    const elemConfig = ELEMENTS[skillElement];
    if (elemConfig) {
      if (elemConfig.advantage === 'ALL' || targetElements.includes(elemConfig.advantage)) {
        elementMultiplier = 1.5;
        advantageText = 'Khắc Chế! 🔥';
      } else if (targetElements.includes(elemConfig.disadvantage)) {
        elementMultiplier = 0.75;
        advantageText = 'Bị Giảm Sát Thương';
      }
    }

    // Critical hit chance
    const isCrit = Math.random() <= 0.18;
    const critMultiplier = isCrit ? 1.6 : 1.0;

    // Damage Formula
    const rawDmg = (attacker.atk * skill.power / 28) * (120 / (120 + target.def));
    const damage = Math.max(10, Math.round(rawDmg * elementMultiplier * critMultiplier));

    // Apply Damage
    target.hp = Math.max(0, target.hp - damage);
    if (target.hp === 0) {
      target.isDead = true;
    }

    // Gain rage on hit
    attacker.rage = Math.min(100, attacker.rage + 15);
    target.rage = Math.min(100, target.rage + 25);

    // Audio SFX
    if (window.DragonAudio) {
      if (isUltimate) {
        window.DragonAudio.playUltimate();
      } else {
        window.DragonAudio.playAttack(skillElement);
      }
    }

    // Visual effect callback
    if (this.onActionEffect) {
      this.onActionEffect({
        attacker,
        target,
        skill,
        damage,
        isCrit,
        advantageText,
        skillElement,
        isUltimate
      });
    }

    // Move to next turn after animation delay
    setTimeout(() => {
      this.currentTurnIndex++;
      this.startNextTurn();
    }, 1200);
  }

  // Handle incoming action from network in PVP
  applyRemoteAction(actionData) {
    const attacker = [...this.playerTeam, ...this.enemyTeam].find(d => d.uid === actionData.attackerUid);
    const target = [...this.playerTeam, ...this.enemyTeam].find(d => d.uid === actionData.targetUid);

    if (attacker && target) {
      this.executeAction(attacker, target, actionData.actionType);
    }
  }
}

window.DragonBattleEngine = DragonBattleEngine;
window.BattleInstance = new DragonBattleEngine();
