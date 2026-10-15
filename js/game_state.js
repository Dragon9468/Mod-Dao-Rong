/**
 * Quản Lý Trạng Thái Game, Lưu Trữ & Tiến Trình Người Chơi - Đảo Rồng Zing Me
 */

class DragonGameState {
  constructor() {
    this.SAVE_KEY = 'DAO_RONG_MOD_SAVE_V1';
    this.state = this.getDefaultState();
    this.subscribers = [];
  }

  getDefaultState() {
    return {
      playerName: 'Luyện Rồng Sư',
      playerAvatar: '🔥',
      level: 1,
      exp: 0,
      gold: 600,
      gems: 25,
      food: 200,
      currentIslandId: 'island_1',
      unlockedIslands: ['island_1'],
      habitats: [
        {
          id: 'hab_start_1',
          islandId: 'island_1',
          type: 'habitat_fire',
          level: 1,
          currentGold: 50,
          lastUpdated: Date.now(),
          dragons: [
            {
              instanceId: 'd_start_1',
              id: 'dragon_fire',
              name: 'Hỏa Long Khởi Nguyên',
              level: 1,
              currentFood: 0,
              stats: calculateDragonStats(DRAGONS_DB.dragon_fire.baseStats, 1)
            }
          ]
        },
        {
          id: 'hab_start_2',
          islandId: 'island_1',
          type: 'habitat_water',
          level: 1,
          currentGold: 30,
          lastUpdated: Date.now(),
          dragons: [
            {
              instanceId: 'd_start_2',
              id: 'dragon_water',
              name: 'Thủy Nhi',
              level: 1,
              currentFood: 0,
              stats: calculateDragonStats(DRAGONS_DB.dragon_water.baseStats, 1)
            }
          ]
        }
      ],
      farms: [
        { id: 'farm_1', islandId: 'island_1', cropId: null, startTime: null, readyTime: null },
        { id: 'farm_2', islandId: 'island_1', cropId: null, startTime: null, readyTime: null }
      ],
      breedingCave: {
        parent1: null,
        parent2: null,
        startTime: null,
        readyTime: null,
        resultDragonId: null,
        isReady: false
      },
      hatchery: [
        {
          id: 'egg_init_1',
          dragonId: 'dragon_leaf',
          startTime: Date.now() - 10000,
          readyTime: Date.now() + 5000,
          isReady: false
        }
      ],
      campaignClearedStages: [],
      statsRecord: {
        eggsHatched: 1,
        dragonsBred: 0,
        battlesWon: 0,
        cropsHarvested: 0,
        goldEarnedTotal: 600
      },
      lastSaved: Date.now()
    };
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  notify() {
    this.subscribers.forEach(cb => cb(this.state));
  }

  init() {
    this.load();
    // Start game tick: update gold, farm, breeding, hatchery
    setInterval(() => {
      this.tick();
    }, 1000);
  }

  save() {
    try {
      this.state.lastSaved = Date.now();
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  }

  load() {
    try {
      const raw = localStorage.getItem(this.SAVE_KEY);
      if (raw) {
        const loaded = JSON.parse(raw);
        // Merge with defaults to ensure schema updates
        this.state = Object.assign(this.getDefaultState(), loaded);
      }
    } catch (e) {
      console.error("Error loading save data:", e);
      this.state = this.getDefaultState();
    }
  }

  reset() {
    this.state = this.getDefaultState();
    this.save();
    this.notify();
  }

  exportSaveCode() {
    const json = JSON.stringify(this.state);
    return btoa(encodeURIComponent(json));
  }

  importSaveCode(code) {
    try {
      const decoded = decodeURIComponent(atob(code.trim()));
      const parsed = JSON.parse(decoded);
      if (parsed && parsed.gold !== undefined && parsed.habitats) {
        this.state = parsed;
        this.save();
        this.notify();
        return true;
      }
    } catch (e) {
      console.error("Import error:", e);
    }
    return false;
  }

  // --- Currencies & Progression ---
  addGold(amount) {
    this.state.gold = Math.max(0, this.state.gold + amount);
    if (amount > 0) {
      this.state.statsRecord.goldEarnedTotal += amount;
    }
    this.save();
    this.notify();
  }

  addGems(amount) {
    this.state.gems = Math.max(0, this.state.gems + amount);
    this.save();
    this.notify();
  }

  addFood(amount) {
    this.state.food = Math.max(0, this.state.food + amount);
    this.save();
    this.notify();
  }

  addExp(amount) {
    this.state.exp += amount;
    const expNeeded = this.state.level * 100;
    if (this.state.exp >= expNeeded) {
      this.state.exp -= expNeeded;
      this.state.level++;
      this.addGems(2);
      this.addGold(this.state.level * 100);
      if (window.DragonAudio) window.DragonAudio.playLevelUp();
      if (window.showBannerNotification) {
        window.showBannerNotification(`CHÚC MỪNG! BẠN ĐÃ ĐẠT CẤP ĐỘ ${this.state.level}! 🎉 (+2 Kim Cương)`, 'gold');
      }
    }
    this.save();
    this.notify();
  }

  // --- Realtime Tick Engine ---
  tick() {
    const now = Date.now();
    let hasChanges = false;

    // 1. Update Habitats Gold Generation
    this.state.habitats.forEach(hab => {
      const habConfig = HABITATS_DB[hab.type];
      if (!habConfig) return;
      const levelConfig = habConfig.levels[hab.level - 1] || habConfig.levels[0];

      // Sum gold rate of all dragons in habitat
      let goldRatePerMin = 0;
      hab.dragons.forEach(d => {
        const dConfig = DRAGONS_DB[d.id];
        if (dConfig) {
          goldRatePerMin += dConfig.baseGoldRate * (1 + (d.level - 1) * 0.4);
        }
      });

      if (goldRatePerMin > 0 && hab.currentGold < levelConfig.maxGold) {
        const secondsPassed = (now - (hab.lastUpdated || now)) / 1000;
        const goldToAdd = (goldRatePerMin / 60) * secondsPassed;
        if (goldToAdd > 0) {
          hab.currentGold = Math.min(levelConfig.maxGold, hab.currentGold + goldToAdd);
          hab.lastUpdated = now;
          hasChanges = true;
        }
      } else {
        hab.lastUpdated = now;
      }
    });

    // 2. Update Farm Crops
    this.state.farms.forEach(farm => {
      if (farm.cropId && farm.readyTime && now >= farm.readyTime && !farm.isReady) {
        farm.isReady = true;
        hasChanges = true;
      }
    });

    // 3. Update Breeding Cave
    const cave = this.state.breedingCave;
    if (cave.startTime && cave.readyTime && now >= cave.readyTime && !cave.isReady) {
      cave.isReady = true;
      hasChanges = true;
    }

    // 4. Update Hatchery Eggs
    this.state.hatchery.forEach(egg => {
      if (egg.readyTime && now >= egg.readyTime && !egg.isReady) {
        egg.isReady = true;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      this.notify();
    }
  }

  // --- Actions ---

  collectHabitatGold(habitatId) {
    const hab = this.state.habitats.find(h => h.id === habitatId);
    if (!hab || hab.currentGold < 1) return 0;

    const goldEarned = Math.floor(hab.currentGold);
    hab.currentGold = 0;
    hab.lastUpdated = Date.now();
    this.addGold(goldEarned);
    this.addExp(Math.max(1, Math.floor(goldEarned / 20)));

    if (window.DragonAudio) window.DragonAudio.playGold();
    return goldEarned;
  }

  feedDragon(dragonInstanceId) {
    let targetDragon = null;
    for (const hab of this.state.habitats) {
      targetDragon = hab.dragons.find(d => d.instanceId === dragonInstanceId);
      if (targetDragon) break;
    }

    if (!targetDragon) return { success: false, msg: 'Không tìm thấy rồng!' };

    const foodCost = getFoodToNextLevel(targetDragon.level);
    if (this.state.food < foodCost) {
      return { success: false, msg: `Cần ${foodCost} thức ăn (bạn có ${this.state.food})!` };
    }

    this.addFood(-foodCost);
    targetDragon.level++;
    const dConfig = DRAGONS_DB[targetDragon.id];
    targetDragon.stats = calculateDragonStats(dConfig.baseStats, targetDragon.level);
    this.addExp(foodCost);

    if (window.DragonAudio) {
      window.DragonAudio.playFeed();
      if (targetDragon.level === 4 || targetDragon.level === 7 || targetDragon.level === 10) {
        setTimeout(() => window.DragonAudio.playLevelUp(), 200);
      }
    }

    this.save();
    this.notify();
    return { success: true, newLevel: targetDragon.level };
  }

  // Plant crop
  plantCrop(farmId, cropId) {
    const farm = this.state.farms.find(f => f.id === farmId);
    const crop = CROPS_DB.find(c => c.id === cropId);
    if (!farm || !crop) return false;

    if (this.state.gold < crop.costGold) {
      return { success: false, msg: 'Không đủ vàng để gieo hạt!' };
    }

    this.addGold(-crop.costGold);
    farm.cropId = crop.id;
    farm.startTime = Date.now();
    farm.readyTime = Date.now() + crop.growTime * 1000;
    farm.isReady = false;

    if (window.DragonAudio) window.DragonAudio.playClick();
    this.save();
    this.notify();
    return { success: true };
  }

  harvestCrop(farmId) {
    const farm = this.state.farms.find(f => f.id === farmId);
    if (!farm || !farm.isReady || !farm.cropId) return false;

    const crop = CROPS_DB.find(c => c.id === farm.cropId);
    if (!crop) return false;

    this.addFood(crop.foodYield);
    this.addExp(crop.expYield);
    this.state.statsRecord.cropsHarvested++;

    farm.cropId = null;
    farm.startTime = null;
    farm.readyTime = null;
    farm.isReady = false;

    if (window.DragonAudio) window.DragonAudio.playHarvest();
    this.save();
    this.notify();
    return { success: true, yield: crop.foodYield };
  }

  // Start Breeding
  startBreeding(parent1InstanceId, parent2InstanceId) {
    const cave = this.state.breedingCave;
    if (cave.startTime) {
      return { success: false, msg: 'Động lai đang bận lai tạo!' };
    }

    let p1 = null, p2 = null;
    for (const hab of this.state.habitats) {
      for (const d of hab.dragons) {
        if (d.instanceId === parent1InstanceId) p1 = d;
        if (d.instanceId === parent2InstanceId) p2 = d;
      }
    }

    if (!p1 || !p2) return { success: false, msg: 'Không tìm thấy rồng cha mẹ!' };
    if (p1.level < 4 || p2.level < 4) {
      return { success: false, msg: 'Rồng phải đạt cấp 4 trở lên mới có thể giao phối!' };
    }

    const config1 = DRAGONS_DB[p1.id];
    const config2 = DRAGONS_DB[p2.id];
    const resultId = calculateBreedingResult(config1, config2);
    const resultConfig = DRAGONS_DB[resultId];

    const breedDurationSec = Math.round(resultConfig.hatchTime * 0.8);

    cave.parent1 = p1;
    cave.parent2 = p2;
    cave.resultDragonId = resultId;
    cave.startTime = Date.now();
    cave.readyTime = Date.now() + breedDurationSec * 1000;
    cave.isReady = false;

    this.state.statsRecord.dragonsBred++;
    if (window.DragonAudio) window.DragonAudio.playClick();

    this.save();
    this.notify();
    return { success: true, resultDragon: resultConfig };
  }

  claimBreedingEgg() {
    const cave = this.state.breedingCave;
    if (!cave.isReady || !cave.resultDragonId) {
      return { success: false, msg: 'Chưa lai tạo xong!' };
    }

    if (this.state.hatchery.length >= 4) {
      return { success: false, msg: 'Ổ ấp trứng đã đầy (Tối đa 4 trứng)!' };
    }

    const dragonConfig = DRAGONS_DB[cave.resultDragonId];
    const newEgg = {
      id: 'egg_' + Date.now(),
      dragonId: cave.resultDragonId,
      startTime: Date.now(),
      readyTime: Date.now() + dragonConfig.hatchTime * 1000,
      isReady: false
    };

    this.state.hatchery.push(newEgg);

    // Reset cave
    cave.parent1 = null;
    cave.parent2 = null;
    cave.startTime = null;
    cave.readyTime = null;
    cave.resultDragonId = null;
    cave.isReady = false;

    if (window.DragonAudio) window.DragonAudio.playHatch();
    this.save();
    this.notify();
    return { success: true, egg: newEgg };
  }

  // Hatch Egg
  hatchEgg(eggId, targetHabitatId) {
    const eggIdx = this.state.hatchery.findIndex(e => e.id === eggId);
    if (eggIdx === -1) return { success: false, msg: 'Không tìm thấy trứng!' };

    const egg = this.state.hatchery[eggIdx];
    if (!egg.isReady) return { success: false, msg: 'Trứng chưa sẵn sàng nở!' };

    const targetHab = this.state.habitats.find(h => h.id === targetHabitatId);
    if (!targetHab) return { success: false, msg: 'Vui lòng chọn chuồng thích hợp!' };

    const habConfig = HABITATS_DB[targetHab.type];
    const levelConfig = habConfig.levels[targetHab.level - 1];
    if (targetHab.dragons.length >= levelConfig.maxDragons) {
      return { success: false, msg: 'Chuồng đã đầy số lượng rồng!' };
    }

    const dragonConfig = DRAGONS_DB[egg.dragonId];
    // Check element compatibility (unless Rainbow VIP)
    if (habConfig.element !== 'ALL' && !dragonConfig.elements.includes(habConfig.element)) {
      return { success: false, msg: `Chuồng này chỉ nhận rồng hệ ${ELEMENTS[habConfig.element]?.name || habConfig.element}!` };
    }

    const newDragon = {
      instanceId: 'd_' + Date.now(),
      id: dragonConfig.id,
      name: dragonConfig.name,
      level: 1,
      currentFood: 0,
      stats: calculateDragonStats(dragonConfig.baseStats, 1)
    };

    targetHab.dragons.push(newDragon);
    this.state.hatchery.splice(eggIdx, 1);
    this.state.statsRecord.eggsHatched++;
    this.addExp(dragonConfig.rarity * 40);

    if (window.DragonAudio) {
      window.DragonAudio.playEggCrack();
      setTimeout(() => window.DragonAudio.playHatch(), 150);
    }

    this.save();
    this.notify();
    return { success: true, dragon: newDragon };
  }

  buyHabitat(habType, islandId) {
    const habConfig = HABITATS_DB[habType];
    if (!habConfig) return { success: false, msg: 'Không tồn tại loại chuồng này!' };

    if (this.state.level < habConfig.reqLevel) {
      return { success: false, msg: `Cần đạt cấp ${habConfig.reqLevel} để mở khóa!` };
    }

    if (this.state.gold < habConfig.costGold || this.state.gems < habConfig.costGems) {
      return { success: false, msg: 'Không đủ tài nguyên để xây dựng!' };
    }

    const island = ISLANDS_DB.find(i => i.id === islandId);
    const existingCount = this.state.habitats.filter(h => h.islandId === islandId).length;
    if (existingCount >= island.maxHabitats) {
      return { success: false, msg: `Đảo này đã đạt giới hạn tối đa ${island.maxHabitats} chuồng!` };
    }

    this.addGold(-habConfig.costGold);
    this.addGems(-habConfig.costGems);

    const newHab = {
      id: 'hab_' + Date.now(),
      islandId: islandId,
      type: habType,
      level: 1,
      currentGold: 0,
      lastUpdated: Date.now(),
      dragons: []
    };

    this.state.habitats.push(newHab);
    this.addExp(50);

    if (window.DragonAudio) window.DragonAudio.playClick();
    this.save();
    this.notify();
    return { success: true, habitat: newHab };
  }

  buyFarm(islandId) {
    const existingCount = this.state.farms.filter(f => f.islandId === islandId).length;
    const island = ISLANDS_DB.find(i => i.id === islandId);
    if (existingCount >= island.maxFarms) {
      return { success: false, msg: `Đảo đã đạt giới hạn ${island.maxFarms} nông trại!` };
    }

    const cost = 300 * (existingCount + 1);
    if (this.state.gold < cost) {
      return { success: false, msg: `Cần ${cost} vàng để mua thêm ô nông trại!` };
    }

    this.addGold(-cost);
    const newFarm = {
      id: 'farm_' + Date.now(),
      islandId: islandId,
      cropId: null,
      startTime: null,
      readyTime: null
    };

    this.state.farms.push(newFarm);
    this.addExp(40);

    if (window.DragonAudio) window.DragonAudio.playClick();
    this.save();
    this.notify();
    return { success: true };
  }

  unlockIsland(islandId) {
    const island = ISLANDS_DB.find(i => i.id === islandId);
    if (!island) return { success: false, msg: 'Không tìm thấy đảo!' };

    if (this.state.unlockedIslands.includes(islandId)) {
      return { success: false, msg: 'Đảo đã mở khóa!' };
    }

    if (this.state.level < island.reqLevel) {
      return { success: false, msg: `Cần đạt cấp ${island.reqLevel} để khai phá đảo!` };
    }

    if (this.state.gold < island.costGold || this.state.gems < island.costGems) {
      return { success: false, msg: 'Không đủ tài nguyên mua đảo!' };
    }

    this.addGold(-island.costGold);
    this.addGems(-island.costGems);
    this.state.unlockedIslands.push(islandId);
    this.addExp(250);

    if (window.DragonAudio) window.DragonAudio.playLevelUp();
    this.save();
    this.notify();
    return { success: true };
  }

  // Get all player dragons across habitats
  getAllDragons() {
    const dragons = [];
    this.state.habitats.forEach(h => {
      h.dragons.forEach(d => {
        dragons.push({
          ...d,
          habitatId: h.id,
          habitatType: h.type
        });
      });
    });
    return dragons;
  }

  // Nhập Mã Quà Tặng VIP (Rồng Xương Vàng, Rồng Xương Bạc, Tài Nguyên VIP)
  redeemGiftCode(code) {
    if (!code) return { success: false, msg: 'Vui lòng nhập mã quà tặng!' };
    const cleanCode = code.trim().toUpperCase();
    this.state.redeemedCodes = this.state.redeemedCodes || [];

    if (this.state.redeemedCodes.includes(cleanCode)) {
      return { success: false, msg: `Mã '${cleanCode}' đã được sử dụng trước đó!` };
    }

    if (cleanCode === 'RONGXUONG' || cleanCode === 'VIPZINGME' || cleanCode === 'ZINGME') {
      // 1. Tạo chuồng Long Cốt Đài nếu chưa có
      let boneHab = this.state.habitats.find(h => h.type === 'habitat_bone');
      if (!boneHab) {
        boneHab = {
          id: 'hab_bone_' + Date.now(),
          islandId: this.state.currentIslandId,
          type: 'habitat_bone',
          level: 2,
          currentGold: 500,
          lastUpdated: Date.now(),
          dragons: []
        };
        this.state.habitats.push(boneHab);
      }

      // 2. Thêm Rồng Xương Vàng Cấp 10
      const goldenBone = {
        instanceId: 'd_golden_bone_' + Date.now(),
        id: 'dragon_golden_bone',
        name: 'Hoàng Kim Cốt Long VIP',
        level: 10,
        currentFood: 0,
        stats: calculateDragonStats(DRAGONS_DB.dragon_golden_bone.baseStats, 10)
      };
      boneHab.dragons.push(goldenBone);

      // 3. Thêm Rồng Xương Bạc Cấp 10
      const silverBone = {
        instanceId: 'd_silver_bone_' + (Date.now() + 1),
        id: 'dragon_silver_bone',
        name: 'Ngân Cốt Long VIP',
        level: 10,
        currentFood: 0,
        stats: calculateDragonStats(DRAGONS_DB.dragon_silver_bone.baseStats, 10)
      };
      boneHab.dragons.push(silverBone);

      // 4. Tặng tài nguyên khủng
      this.addGold(50000);
      this.addGems(500);
      this.addFood(3000);
      this.addExp(500);

      this.state.redeemedCodes.push(cleanCode);
      if (window.DragonAudio) window.DragonAudio.playLevelUp();
      this.save();
      this.notify();

      return {
        success: true,
        msg: `KÍCH HOẠT VIP THÀNH CÔNG! 🎉\nBạn đã nhận được:\n✨ 1x Rồng Xương Vàng (Hoàng Kim Cốt Long Lv.10)\n✨ 1x Rồng Xương Bạc (Ngân Cốt Long Lv.10)\n💀 1x Chuồng Long Cốt Đài\n💰 +50.000 Vàng, 💎 +500 Kim Cương, 🍓 +3.000 Thức Ăn!`
      };
    } else if (cleanCode === 'DRAGON9468' || cleanCode === 'FULLRONG') {
      // Tặng toàn bộ các dòng rồng huyền thoại mới
      let rainbowHab = this.state.habitats.find(h => h.type === 'habitat_rainbow');
      if (!rainbowHab) {
        rainbowHab = {
          id: 'hab_rainbow_' + Date.now(),
          islandId: this.state.currentIslandId,
          type: 'habitat_rainbow',
          level: 3,
          currentGold: 1000,
          lastUpdated: Date.now(),
          dragons: []
        };
        this.state.habitats.push(rainbowHab);
      }

      const newLegendaries = ['dragon_blood_bone', 'dragon_cosmic', 'dragon_phoenix'];
      newLegendaries.forEach((dragId, idx) => {
        const cfg = DRAGONS_DB[dragId];
        rainbowHab.dragons.push({
          instanceId: `d_legend_${idx}_${Date.now()}`,
          id: dragId,
          name: cfg.name,
          level: 10,
          currentFood: 0,
          stats: calculateDragonStats(cfg.baseStats, 10)
        });
      });

      this.addGold(100000);
      this.addGems(1000);
      this.addFood(8000);
      this.addExp(1000);

      this.state.redeemedCodes.push(cleanCode);
      if (window.DragonAudio) window.DragonAudio.playLevelUp();
      this.save();
      this.notify();

      return {
        success: true,
        msg: `KÍCH HOẠT CODE ĐẶC QUYỀN THÀNH CÔNG! 👑\nĐã nhận Rồng Huyết Cốt, Rồng Tinh Tú Ngân Hà, Rồng Phượng Hoàng, Chuồng Thiên Cung + 100.000 Vàng & 1.000 Kim Cương!`
      };
    }

    return { success: false, msg: `Mã quà tặng '${code}' không hợp lệ hoặc đã hết hạn!` };
  }
}

window.DragonGameState = DragonGameState;
window.GameInstance = new DragonGameState();
