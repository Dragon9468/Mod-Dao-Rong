/**
 * Game Controller Chính - Mod Đảo Rồng (Zing Me Remake)
 * Điều phối toàn bộ sự kiện giao diện, tương tác người chơi, đấu trường & P2P
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Canvas Renderer
  const renderer = new DragonCanvasRenderer('world-canvas');
  window.RendererInstance = renderer;

  // Window resize handling
  window.addEventListener('resize', () => {
    renderer.resize();
  });
  renderer.resize();

  // 2. Initialize Game State
  const game = window.GameInstance;
  game.init();

  // 3. Audio & Click Interaction
  const audio = window.DragonAudio;
  document.body.addEventListener('click', () => {
    audio.ensureContext();
  }, { once: true });

  // 4. Bind State Changes to UI
  game.subscribe((state) => {
    updateTopHUD(state);
    updateIslandNav(state);
  });
  updateTopHUD(game.state);
  updateIslandNav(game.state);

  // 5. Start Render Animation Loop
  function animationLoop() {
    renderer.render(game.state);
    requestAnimationFrame(animationLoop);
  }
  requestAnimationFrame(animationLoop);

  // Start peaceful island BGM
  setTimeout(() => {
    audio.startBGM('island');
  }, 1000);

  // 6. Handle Entity Clicks on Canvas (Habitats, Farms, Cave, Hatchery)
  renderer.onEntityClick = (entity) => {
    audio.playClick();
    switch (entity.type) {
      case 'HABITAT':
        openHabitatModal(entity.data);
        break;
      case 'FARM':
        openFarmModal(entity.data);
        break;
      case 'BREEDING_CAVE':
        openBreedingModal();
        break;
      case 'HATCHERY':
        openHatcheryModal();
        break;
    }
  };

  // 7. Setup UI Button Listeners & Modals
  setupDockButtons();
  setupQuickTools();
  checkUrlParamsForMultiplayer();
});

// --- Top HUD Updates ---
function updateTopHUD(state) {
  document.getElementById('hud-player-name').innerText = state.playerName;
  document.getElementById('hud-player-level').innerText = `Cấp ${state.level}`;
  document.getElementById('hud-gold').innerText = state.gold.toLocaleString('vi-VN');
  document.getElementById('hud-gems').innerText = state.gems.toLocaleString('vi-VN');
  document.getElementById('hud-food').innerText = state.food.toLocaleString('vi-VN');

  const expNeeded = state.level * 100;
  const expPercent = Math.min(100, Math.round((state.exp / expNeeded) * 100));
  const fill = document.getElementById('hud-exp-fill');
  if (fill) fill.style.width = `${expPercent}%`;
}

function updateIslandNav(state) {
  const currentIsland = ISLANDS_DB.find(i => i.id === state.currentIslandId) || ISLANDS_DB[0];
  const titleEl = document.getElementById('current-island-name');
  if (titleEl) titleEl.innerText = currentIsland.name;
}

// --- Notification Banner ---
window.showBannerNotification = function(text, type = 'gold') {
  const banner = document.getElementById('banner-notification');
  if (!banner) return;
  banner.innerHTML = `<i class="fa-solid fa-crown"></i> <span>${text}</span>`;
  banner.classList.add('show');
  setTimeout(() => {
    banner.classList.remove('show');
  }, 3500);
};

// --- Quick Tools: Sound & Fullscreen ---
function setupQuickTools() {
  const soundBtn = document.getElementById('btn-toggle-sound');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isMuted = window.DragonAudio.toggleMute();
      soundBtn.innerHTML = isMuted 
        ? '<i class="fa-solid fa-volume-xmark" style="color: #ef4444;"></i>' 
        : '<i class="fa-solid fa-volume-high"></i>';
    });
  }

  const fsBtn = document.getElementById('btn-toggle-fullscreen');
  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(e => alert(e.message));
      } else {
        document.exitFullscreen();
      }
    });
  }
}

// --- Island Navigation ---
window.prevIsland = function() {
  const game = window.GameInstance;
  const currentIndex = ISLANDS_DB.findIndex(i => i.id === game.state.currentIslandId);
  if (currentIndex > 0) {
    game.state.currentIslandId = ISLANDS_DB[currentIndex - 1].id;
    game.save();
    game.notify();
    window.DragonAudio.playClick();
  }
};

window.nextIsland = function() {
  const game = window.GameInstance;
  const currentIndex = ISLANDS_DB.findIndex(i => i.id === game.state.currentIslandId);
  if (currentIndex < ISLANDS_DB.length - 1) {
    const nextIslandConfig = ISLANDS_DB[currentIndex + 1];
    if (game.state.unlockedIslands.includes(nextIslandConfig.id)) {
      game.state.currentIslandId = nextIslandConfig.id;
      game.save();
      game.notify();
      window.DragonAudio.playClick();
    } else {
      // Prompt to unlock
      if (confirm(`Bạn có muốn khai phá '${nextIslandConfig.name}' với giá ${nextIslandConfig.costGold} Vàng không?`)) {
        const res = game.unlockIsland(nextIslandConfig.id);
        if (res.success) {
          game.state.currentIslandId = nextIslandConfig.id;
          game.save();
          game.notify();
          window.showBannerNotification(`Đã khai phá thành công ${nextIslandConfig.name}! 🎉`, 'gold');
        } else {
          alert(res.msg);
        }
      }
    }
  }
};

// --- Bottom Dock Setup ---
function setupDockButtons() {
  document.getElementById('dock-shop').addEventListener('click', () => openShopModal());
  document.getElementById('dock-farm').addEventListener('click', () => openAllFarmsModal());
  document.getElementById('dock-breed').addEventListener('click', () => openBreedingModal());
  document.getElementById('dock-hatch').addEventListener('click', () => openHatcheryModal());
  document.getElementById('dock-battle').addEventListener('click', () => openCampaignModal());
  document.getElementById('dock-multi').addEventListener('click', () => openMultiplayerModal());
  document.getElementById('dock-save').addEventListener('click', () => openSaveModal());
}

// Close any open modal
window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
  window.DragonAudio.playClick();
};

// --- 1. SHOP MODAL ---
window.openShopModal = function(activeTab = 'dragons') {
  const modal = document.getElementById('shop-modal');
  renderShopTab(activeTab);
  modal.classList.add('active');
  window.DragonAudio.playClick();
};

window.renderShopTab = function(tab) {
  document.querySelectorAll('#shop-tabs .tab-pill').forEach(p => p.classList.remove('active'));
  const activePill = document.querySelector(`#shop-tabs .tab-pill[data-tab="${tab}"]`);
  if (activePill) activePill.classList.add('active');

  const container = document.getElementById('shop-content');
  const game = window.GameInstance;

  if (tab === 'dragons') {
    // Buy Dragon Eggs
    const list = Object.values(DRAGONS_DB).filter(d => d.shopPriceGold > 0);
    container.innerHTML = `
      <div class="shop-grid">
        ${list.map(d => `
          <div class="item-card">
            <div class="item-preview" style="background: ${d.appearance.primaryColor}; color: #fff;">
              🥚
            </div>
            <div class="item-name">${d.name}</div>
            <div class="item-meta">${d.rarityLabel} • Ấp: ${d.hatchTime}s</div>
            <button class="btn-buy" onclick="buyDragonEgg('${d.id}')">
              💰 ${d.shopPriceGold} Vàng ${d.shopPriceGems > 0 ? `+ 💎 ${d.shopPriceGems}` : ''}
            </button>
          </div>
        `).join('')}
      </div>
    `;
  } else if (tab === 'habitats') {
    // Buy Habitats
    const list = Object.values(HABITATS_DB);
    container.innerHTML = `
      <div class="shop-grid">
        ${list.map(h => `
          <div class="item-card">
            <div class="item-preview" style="background: ${ELEMENTS[h.element]?.color || '#f59e0b'}; color: #fff;">
              ${h.icon}
            </div>
            <div class="item-name">${h.name}</div>
            <div class="item-meta">Yêu cầu Cấp ${h.reqLevel} • Tối đa ${h.levels[0].maxDragons} Rồng</div>
            <button class="btn-buy" onclick="buyHabitat('${h.id}')">
              💰 ${h.costGold} Vàng ${h.costGems > 0 ? `+ 💎 ${h.costGems}` : ''}
            </button>
          </div>
        `).join('')}
      </div>
    `;
  } else if (tab === 'islands') {
    // Buy Islands
    const list = ISLANDS_DB;
    container.innerHTML = `
      <div class="shop-grid">
        ${list.map(i => {
          const unlocked = game.state.unlockedIslands.includes(i.id);
          return `
            <div class="item-card" style="${unlocked ? 'opacity: 0.6;' : ''}">
              <div class="item-preview" style="background: linear-gradient(135deg, #10b981, #0284c7); color: #fff;">
                🏝️
              </div>
              <div class="item-name">${i.name}</div>
              <div class="item-meta">Yêu cầu Cấp ${i.reqLevel} • ${i.maxHabitats} Chuồng</div>
              ${unlocked ? `
                <button class="btn-buy" disabled style="background: #64748b; cursor: default;">ĐÃ MỞ KHÓA</button>
              ` : `
                <button class="btn-buy" onclick="buyIsland('${i.id}')">
                  💰 ${i.costGold} Vàng ${i.costGems > 0 ? `+ 💎 ${i.costGems}` : ''}
                </button>
              `}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
};

window.buyDragonEgg = function(dragonId) {
  const game = window.GameInstance;
  const d = DRAGONS_DB[dragonId];
  if (!d) return;

  if (game.state.gold < d.shopPriceGold || game.state.gems < d.shopPriceGems) {
    alert('Không đủ tài nguyên để mua trứng rồng này!');
    return;
  }

  if (game.state.hatchery.length >= 4) {
    alert('Ổ ấp trứng đã đầy (Tối đa 4 trứng)! Hãy ấp nở bớt trứng.');
    return;
  }

  game.addGold(-d.shopPriceGold);
  game.addGems(-d.shopPriceGems);

  game.state.hatchery.push({
    id: 'egg_' + Date.now(),
    dragonId: d.id,
    startTime: Date.now(),
    readyTime: Date.now() + d.hatchTime * 1000,
    isReady: false
  });

  window.DragonAudio.playHatch();
  game.save();
  game.notify();
  window.showBannerNotification(`Đã mua thành công Trứng ${d.name}! Trứng đã được chuyển vào Ổ Ấp.`, 'gold');
  closeModal('shop-modal');
};

window.buyHabitat = function(habId) {
  const game = window.GameInstance;
  const res = game.buyHabitat(habId, game.state.currentIslandId);
  if (res.success) {
    window.showBannerNotification('Xây dựng chuồng mới thành công! 🏗️', 'gold');
    closeModal('shop-modal');
  } else {
    alert(res.msg);
  }
};

window.buyIsland = function(islandId) {
  const game = window.GameInstance;
  const res = game.unlockIsland(islandId);
  if (res.success) {
    window.showBannerNotification('Khai phá đảo mới thành công! 🎉', 'gold');
    renderShopTab('islands');
  } else {
    alert(res.msg);
  }
};

// --- 2. HABITAT INSPECTION & FEEDING MODAL ---
window.openHabitatModal = function(habitat) {
  const habConfig = HABITATS_DB[habitat.type];
  const modal = document.getElementById('habitat-modal');
  const body = document.getElementById('habitat-modal-body');

  const dragonsHtml = habitat.dragons.map(d => {
    const config = DRAGONS_DB[d.id];
    const foodCost = getFoodToNextLevel(d.level);
    const stage = getEvolutionStage(d.level);

    return `
      <div class="item-card" style="align-items: stretch; text-align: left;">
        <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 10px;">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: ${config.appearance.primaryColor}; display: flex; align-items: center; justify-content: center; font-size: 26px;">
            🐲
          </div>
          <div>
            <h4 style="font-size: 15px; font-weight: 800;">${d.name}</h4>
            <div style="font-size: 11px; color: var(--primary); font-weight: 700;">Cấp ${d.level} • ${stage.name}</div>
          </div>
        </div>

        <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
          <div>❤️ Máu: <b>${d.stats.hp}</b></div>
          <div>⚔️ Công: <b>${d.stats.atk}</b></div>
          <div>🛡️ Thủ: <b>${d.stats.def}</b></div>
          <div>⚡ Tốc: <b>${d.stats.spd}</b></div>
        </div>

        <button class="btn-buy" style="background: linear-gradient(135deg, #ef4444, #f59e0b); color: #fff;" onclick="feedDragon('${d.instanceId}', '${habitat.id}')">
          🍓 Cho Ăn (${foodCost} Thức Ăn)
        </button>
      </div>
    `;
  }).join('');

  body.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; background: rgba(255,255,255,0.05); padding: 12px 18px; border-radius: var(--radius-md);">
      <div>
        <h4 style="font-size: 16px; font-weight: 800;">${habConfig.name} (Cấp ${habitat.level})</h4>
        <div style="font-size: 12px; color: var(--text-muted);">Đang chứa ${habitat.dragons.length} chú rồng</div>
      </div>
      <div>
        <button class="btn-buy" onclick="collectGold('${habitat.id}')">
          💰 Thu Vàng (+${Math.floor(habitat.currentGold)})
        </button>
      </div>
    </div>

    <h5 style="font-size: 14px; margin-bottom: 10px; font-weight: 700;"><i class="fa-solid fa-dragon"></i> Danh Sách Rồng Trong Chuồng</h5>
    <div class="shop-grid">
      ${dragonsHtml || '<p style="color: var(--text-muted);">Chuồng này hiện đang trống. Hãy ấp nở trứng rồng để đưa vào đây!</p>'}
    </div>
  `;

  modal.classList.add('active');
  window.DragonAudio.playClick();
};

window.collectGold = function(habitatId) {
  const gold = window.GameInstance.collectHabitatGold(habitatId);
  if (gold > 0) {
    window.showBannerNotification(`Đã thu hoạch +${gold} Vàng! 💰`, 'gold');
    closeModal('habitat-modal');
  }
};

window.feedDragon = function(instanceId, habitatId) {
  const res = window.GameInstance.feedDragon(instanceId);
  if (res.success) {
    const hab = window.GameInstance.state.habitats.find(h => h.id === habitatId);
    if (hab) openHabitatModal(hab);
  } else {
    alert(res.msg);
  }
};

// --- 3. FARM & CROPS MODAL ---
window.openFarmModal = function(farm) {
  if (farm.isReady) {
    const res = window.GameInstance.harvestCrop(farm.id);
    if (res.success) {
      window.showBannerNotification(`Đã thu hoạch +${res.yield} Thức Ăn! 🍓`, 'gold');
    }
    return;
  }

  const modal = document.getElementById('farm-modal');
  const container = document.getElementById('farm-crops-list');

  container.innerHTML = `
    <div class="shop-grid">
      ${CROPS_DB.map(c => `
        <div class="item-card">
          <div style="font-size: 40px; margin-bottom: 8px;">${c.icon}</div>
          <div class="item-name">${c.name}</div>
          <div class="item-meta">Thời gian: ${c.growTime}s • Thu: +${c.foodYield} 🍓</div>
          <button class="btn-buy" onclick="plantCrop('${farm.id}', '${c.id}')">
            💰 Gieo Hạt (${c.costGold} Vàng)
          </button>
        </div>
      `).join('')}
    </div>
  `;

  modal.classList.add('active');
  window.DragonAudio.playClick();
};

window.openAllFarmsModal = function() {
  const farms = window.GameInstance.state.farms;
  if (farms.length > 0) {
    openFarmModal(farms[0]);
  }
};

window.plantCrop = function(farmId, cropId) {
  const res = window.GameInstance.plantCrop(farmId, cropId);
  if (res.success) {
    window.showBannerNotification('Đã gieo trồng thành công! Hãy đợi cây chín để thu hoạch.', 'gold');
    closeModal('farm-modal');
  } else {
    alert(res.msg);
  }
};

// --- 4. BREEDING CAVE MODAL ---
let selectedBreedParent1 = null;
let selectedBreedParent2 = null;

window.openBreedingModal = function() {
  const modal = document.getElementById('breeding-modal');
  const cave = window.GameInstance.state.breedingCave;
  const container = document.getElementById('breeding-modal-body');

  if (cave.isReady) {
    const resultConfig = DRAGONS_DB[cave.resultDragonId] || DRAGONS_DB.dragon_fire;
    container.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 64px; animation: bounce 1s infinite;">🥚</div>
        <h3 style="font-size: 20px; font-weight: 800; margin: 12px 0;">Lai Giống Thành Công!</h3>
        <p style="color: var(--text-muted); margin-bottom: 20px;">Bạn đã tạo ra Trứng của <b>${resultConfig.name}</b>!</p>
        <button class="btn-buy" style="max-width: 250px; margin: 0 auto;" onclick="claimBreedEgg()">
          🐣 Chuyển Vào Ổ Ấp Trứng
        </button>
      </div>
    `;
  } else if (cave.startTime) {
    const remaining = Math.max(0, Math.ceil((cave.readyTime - Date.now()) / 1000));
    container.innerHTML = `
      <div style="text-align: center; padding: 30px;">
        <div style="font-size: 48px; margin-bottom: 12px;">💖</div>
        <h3 style="font-size: 18px; font-weight: 800;">Đang Tiến Hành Lai Giống...</h3>
        <p style="color: var(--text-muted); margin-top: 6px;">Thời gian còn lại: <b style="color: var(--primary);">${remaining} giây</b></p>
      </div>
    `;
  } else {
    // Select 2 dragons to breed
    const allDragons = window.GameInstance.getAllDragons().filter(d => d.level >= 4);
    selectedBreedParent1 = null;
    selectedBreedParent2 = null;

    container.innerHTML = `
      <div style="margin-bottom: 16px; background: rgba(255,255,255,0.04); padding: 14px; border-radius: var(--radius-md); text-align: center;">
        <p style="font-size: 13px; color: var(--text-muted);">Chọn 2 chú rồng đạt Cấp 4 trở lên để lai tạo giống rồng mới!</p>
        <div style="display: flex; justify-content: center; gap: 20px; margin-top: 10px;">
          <div id="breed-slot-1" style="width: 120px; padding: 10px; border: 1px dashed var(--primary); border-radius: 12px; font-size: 12px;">Rồng Bố (Trống)</div>
          <div style="font-size: 24px; align-self: center;">➕</div>
          <div id="breed-slot-2" style="width: 120px; padding: 10px; border: 1px dashed var(--primary); border-radius: 12px; font-size: 12px;">Rồng Mẹ (Trống)</div>
        </div>
        <button id="btn-start-breed" class="btn-buy" style="margin: 16px auto 0 auto; max-width: 200px; display: none;" onclick="startBreedingAction()">
          💖 Bắt Đầu Lai Giống
        </button>
      </div>

      <h5 style="font-size: 14px; font-weight: 700; margin-bottom: 10px;">Chọn Rồng Trưởng Thành (Cấp >= 4):</h5>
      <div class="shop-grid">
        ${allDragons.map(d => {
          const config = DRAGONS_DB[d.id];
          return `
            <div class="item-card" onclick="selectDragonForBreeding('${d.instanceId}', this)">
              <div style="font-size: 32px; margin-bottom: 6px;">🐲</div>
              <div class="item-name">${d.name}</div>
              <div class="item-meta">Cấp ${d.level} • Hệ: ${config.elements.map(e => ELEMENTS[e]?.name || e).join('+')}</div>
            </div>
          `;
        }).join('')}
      </div>
      ${allDragons.length === 0 ? '<p style="color: #ef4444; text-align: center; padding: 20px;">Bạn chưa có chú rồng nào đạt Cấp 4. Hãy cho rồng ăn để nâng cấp!</p>' : ''}
    `;
  }

  modal.classList.add('active');
  window.DragonAudio.playClick();
};

window.selectDragonForBreeding = function(instanceId, el) {
  if (!selectedBreedParent1) {
    selectedBreedParent1 = instanceId;
    el.style.borderColor = '#10b981';
    document.getElementById('breed-slot-1').innerText = 'Đã Chọn Bố ✅';
  } else if (!selectedBreedParent2 && selectedBreedParent1 !== instanceId) {
    selectedBreedParent2 = instanceId;
    el.style.borderColor = '#ec4899';
    document.getElementById('breed-slot-2').innerText = 'Đã Chọn Mẹ ✅';
    document.getElementById('btn-start-breed').style.display = 'flex';
  }
};

window.startBreedingAction = function() {
  if (!selectedBreedParent1 || !selectedBreedParent2) return;
  const res = window.GameInstance.startBreeding(selectedBreedParent1, selectedBreedParent2);
  if (res.success) {
    window.showBannerNotification('Đã bắt đầu lai giống! Hãy chờ đợi quả trứng nở.', 'gold');
    openBreedingModal();
  } else {
    alert(res.msg);
  }
};

window.claimBreedEgg = function() {
  const res = window.GameInstance.claimBreedingEgg();
  if (res.success) {
    window.showBannerNotification('Trứng đã được chuyển sang Ổ Ấp Trứng! 🥚', 'gold');
    closeModal('breeding-modal');
  } else {
    alert(res.msg);
  }
};

// --- 5. HATCHERY MODAL ---
window.openHatcheryModal = function() {
  const modal = document.getElementById('hatchery-modal');
  const hatchery = window.GameInstance.state.hatchery;
  const container = document.getElementById('hatchery-modal-body');

  container.innerHTML = `
    <div class="shop-grid">
      ${hatchery.map(egg => {
        const config = DRAGONS_DB[egg.dragonId] || DRAGONS_DB.dragon_fire;
        const remaining = Math.max(0, Math.ceil((egg.readyTime - Date.now()) / 1000));

        return `
          <div class="item-card">
            <div style="font-size: 44px; margin-bottom: 8px; ${egg.isReady ? 'animation: bounce 0.8s infinite;' : ''}">🥚</div>
            <div class="item-name">${config.name}</div>
            <div class="item-meta">${egg.isReady ? '<b style="color: #10b981;">Sẵn Sàng Nở!</b>' : `Đang ấp: ${remaining}s`}</div>
            ${egg.isReady ? `
              <button class="btn-buy" style="background: linear-gradient(135deg, #10b981, #059669); color: #fff;" onclick="selectHabitatToHatch('${egg.id}')">
                🐣 Gõ Vỏ Nở Rồng!
              </button>
            ` : `
              <button class="btn-buy" disabled style="background: #475569; cursor: not-allowed;">Đang Ấp...</button>
            `}
          </div>
        `;
      }).join('')}
    </div>
    ${hatchery.length === 0 ? '<p style="text-align: center; color: var(--text-muted); padding: 30px;">Ổ ấp đang trống. Hãy vào Cửa Hàng mua trứng hoặc Lai Giống rồng!</p>' : ''}
  `;

  modal.classList.add('active');
  window.DragonAudio.playClick();
};

window.selectHabitatToHatch = function(eggId) {
  const egg = window.GameInstance.state.hatchery.find(e => e.id === eggId);
  if (!egg) return;

  const dragonConfig = DRAGONS_DB[egg.dragonId];
  const habitats = window.GameInstance.state.habitats;
  const eligibleHabitats = habitats.filter(h => {
    const config = HABITATS_DB[h.type];
    const levelConfig = config.levels[h.level - 1];
    const spaceOk = h.dragons.length < levelConfig.maxDragons;
    const elementOk = (config.element === 'ALL' || (dragonConfig && dragonConfig.elements.includes(config.element)));
    return spaceOk && elementOk;
  });

  if (eligibleHabitats.length === 0) {
    const neededElemName = dragonConfig ? dragonConfig.elements.map(e => ELEMENTS[e]?.name || e).join('/') : 'phù hợp';
    alert(`Không tìm thấy chuồng rồng hệ [${neededElemName}] còn chỗ trống! Hãy mua thêm chuồng hệ ${neededElemName} hoặc Thiên Cung Ngũ Hành.`);
    return;
  }

  // Auto hatch into first eligible habitat
  const targetHab = eligibleHabitats[0];
  const res = window.GameInstance.hatchEgg(eggId, targetHab.id);
  if (res.success) {
    window.showBannerNotification(`Chúc mừng! Chú rồng ${res.dragon.name} đã chào đời và chuyển vào ${HABITATS_DB[targetHab.type].name}! 🎉`, 'gold');
    closeModal('hatchery-modal');
  } else {
    alert(res.msg);
  }
};

// --- 6. CAMPAIGN BATTLE & ARENA MODAL ---
let activeStage = null;
let selectedBattleTeam = [];

window.openCampaignModal = function() {
  const modal = document.getElementById('campaign-modal');
  const container = document.getElementById('campaign-chapters-list');

  container.innerHTML = CAMPAIGN_CHAPTERS.map(ch => `
    <div style="margin-bottom: 20px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 16px;">
      <h4 style="font-size: 16px; font-weight: 800; color: var(--primary); margin-bottom: 4px;">${ch.title}</h4>
      <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">${ch.desc}</p>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px;">
        ${ch.stages.map(st => `
          <button class="btn-buy" style="font-size: 12px; padding: 8px;" onclick="selectCampaignStage(${st.id})">
            ⚔️ ${st.name}
          </button>
        `).join('')}
      </div>
    </div>
  `).join('');

  modal.classList.add('active');
  window.DragonAudio.playClick();
};

window.selectCampaignStage = function(stageId) {
  let found = null;
  for (const ch of CAMPAIGN_CHAPTERS) {
    found = ch.stages.find(s => s.id === stageId);
    if (found) break;
  }
  if (!found) return;

  activeStage = found;
  closeModal('campaign-modal');
  openTeamSelectModal();
};

function openTeamSelectModal() {
  const modal = document.getElementById('team-select-modal');
  const allDragons = window.GameInstance.getAllDragons();
  selectedBattleTeam = [];

  const container = document.getElementById('team-select-grid');
  container.innerHTML = `
    <div class="shop-grid">
      ${allDragons.map(d => `
        <div class="item-card" onclick="toggleSelectFighter('${d.instanceId}', this)">
          <div style="font-size: 32px; margin-bottom: 4px;">🐲</div>
          <div class="item-name">${d.name}</div>
          <div class="item-meta">Cấp ${d.level} • Máu: ${d.stats.hp} • Công: ${d.stats.atk}</div>
        </div>
      `).join('')}
    </div>
  `;

  document.getElementById('team-count-text').innerText = 'Đã chọn: 0 / 3';
  modal.classList.add('active');
}

window.toggleSelectFighter = function(instanceId, el) {
  const allDragons = window.GameInstance.getAllDragons();
  const d = allDragons.find(x => x.instanceId === instanceId);
  if (!d) return;

  const idx = selectedBattleTeam.findIndex(x => x.instanceId === instanceId);
  if (idx !== -1) {
    selectedBattleTeam.splice(idx, 1);
    el.style.borderColor = 'var(--border)';
  } else {
    if (selectedBattleTeam.length >= 3) {
      alert('Tối đa 3 chú rồng ra trận!');
      return;
    }
    selectedBattleTeam.push(d);
    el.style.borderColor = '#10b981';
  }

  document.getElementById('team-count-text').innerText = `Đã chọn: ${selectedBattleTeam.length} / 3`;
};

window.startBattleWithSelectedTeam = function() {
  if (selectedBattleTeam.length === 0) {
    alert('Vui lòng chọn ít nhất 1 chú rồng để xuất trận!');
    return;
  }

  closeModal('team-select-modal');
  startPVECombat(activeStage, selectedBattleTeam);
};

function startPVECombat(stage, myTeam) {
  const modal = document.getElementById('battle-screen-modal');
  modal.classList.add('active');

  window.DragonAudio.startBGM('battle');
  const battle = window.BattleInstance;

  battle.onStateChange = (state) => {
    renderBattleArena(state);
  };

  battle.onActionEffect = (effectData) => {
    showCombatFloatingDamage(effectData);
  };

  battle.onBattleEnd = (result) => {
    setTimeout(() => {
      handleBattleFinish(result);
    }, 1500);
  };

  battle.initPVE(stage, myTeam);
}

function renderBattleArena(state) {
  // Render Enemies
  const enemyContainer = document.getElementById('battle-enemies-row');
  enemyContainer.innerHTML = state.enemyTeam.map(e => `
    <div class="fighter-card ${e.isDead ? 'dead' : ''} ${state.currentFighter?.uid === e.uid ? 'active-turn' : ''} targetable" onclick="chooseBattleTarget('${e.uid}')" style="${e.isDead ? 'opacity: 0.2; pointer-events: none;' : ''}">
      <div style="font-size: 38px; filter: drop-shadow(0 0 8px ${e.config.appearance.glow});">🐲</div>
      <div style="font-size: 11px; font-weight: 800; color: #fff;">${e.name} (Lv.${e.level})</div>
      <div class="fighter-hp-bar">
        <div class="fighter-hp-fill" style="width: ${Math.round((e.hp / e.maxHp) * 100)}%;"></div>
      </div>
      <div class="fighter-rage-bar">
        <div class="fighter-rage-fill" style="width: ${e.rage}%;"></div>
      </div>
      <div style="font-size: 9px; color: #94a3b8;">${e.hp} / ${e.maxHp} HP</div>
    </div>
  `).join('');

  // Render Player Team
  const playerContainer = document.getElementById('battle-player-row');
  playerContainer.innerHTML = state.playerTeam.map(p => `
    <div class="fighter-card ${p.isDead ? 'dead' : ''} ${state.currentFighter?.uid === p.uid ? 'active-turn' : ''}" style="${p.isDead ? 'opacity: 0.2;' : ''}">
      <div style="font-size: 38px; filter: drop-shadow(0 0 8px ${p.config.appearance.glow});">🐲</div>
      <div style="font-size: 11px; font-weight: 800; color: #fff;">${p.name} (Lv.${p.level})</div>
      <div class="fighter-hp-bar">
        <div class="fighter-hp-fill" style="width: ${Math.round((p.hp / p.maxHp) * 100)}%;"></div>
      </div>
      <div class="fighter-rage-bar">
        <div class="fighter-rage-fill" style="width: ${p.rage}%;"></div>
      </div>
      <div style="font-size: 9px; color: #94a3b8;">${p.hp} / ${p.maxHp} HP</div>
    </div>
  `).join('');

  // Update Action Buttons for Player Turn
  const isPlayerTurn = state.isMyTurn;
  const currentFighter = state.currentFighter;

  const btnNormal = document.getElementById('btn-skill-normal');
  const btnElem = document.getElementById('btn-skill-elem');
  const btnUlt = document.getElementById('btn-skill-ult');

  if (isPlayerTurn && currentFighter) {
    btnNormal.disabled = false;
    btnElem.disabled = currentFighter.rage < 25;
    btnUlt.disabled = currentFighter.rage < 100;

    btnNormal.innerHTML = `<b>${currentFighter.config.skills.normal.name}</b><span>Cơ Bản</span>`;
    btnElem.innerHTML = `<b>${currentFighter.config.skills.elemental.name}</b><span>25 Nộ</span>`;
    btnUlt.innerHTML = `<b>${currentFighter.config.skills.ultimate.name}</b><span>100 Nộ MAX 🔥</span>`;
  } else {
    btnNormal.disabled = true;
    btnElem.disabled = true;
    btnUlt.disabled = true;
  }
}

let chosenActionType = 'normal';
window.selectSkillAction = function(actionType) {
  chosenActionType = actionType;
  window.DragonAudio.playClick();
};

window.chooseBattleTarget = function(targetUid) {
  const battle = window.BattleInstance;
  if (!battle.isMyTurn) return;

  const currentFighter = battle.getCurrentFighter();
  const target = battle.enemyTeam.find(e => e.uid === targetUid);
  if (!currentFighter || !target || target.isDead) return;

  battle.executeAction(currentFighter, target, chosenActionType);
};

function showCombatFloatingDamage(data) {
  const banner = document.getElementById('battle-status-text');
  if (banner) {
    banner.innerText = `${data.attacker.name} tung chiêu '${data.skill.name}' gây -${data.damage} sát thương! ${data.advantageText}`;
  }
}

function handleBattleFinish(result) {
  closeModal('battle-screen-modal');
  window.DragonAudio.startBGM('island');

  if (result.victory) {
    const st = result.stage;
    const game = window.GameInstance;
    game.addGold(st.rewardGold);
    game.addFood(st.rewardFood);
    game.addExp(st.rewardExp);
    if (st.rewardGems) game.addGems(st.rewardGems);

    alert(`CHIẾN THẮNG HOANH TRÁNG! 🎉\nPhần thưởng: +${st.rewardGold} Vàng, +${st.rewardFood} Thức Ăn, +${st.rewardExp} EXP${st.rewardGems ? `, +${st.rewardGems} Kim Cương` : ''}!`);
  } else {
    alert('Thất bại! Đội hình rồng đã kiệt sức. Hãy cho rồng ăn nâng cấp chỉ số và quay lại báo thù!');
  }
}

// --- 7. MULTIPLAYER P2P (PLAY WITH FRIENDS) ---
window.openMultiplayerModal = function() {
  const modal = document.getElementById('multiplayer-modal');
  modal.classList.add('active');
  window.DragonAudio.playClick();
};

window.createP2PRoom = async function() {
  const net = window.NetworkInstance;
  try {
    document.getElementById('room-status-text').innerText = 'Đang khởi tạo phòng thi đấu P2P...';
    const code = await net.createRoom();
    document.getElementById('my-room-code-display').innerText = code;
    document.getElementById('room-share-box').style.display = 'block';

    const shareUrl = `${window.location.origin}${window.location.pathname}?room=${code}`;
    document.getElementById('share-link-input').value = shareUrl;

    net.onConnected = () => {
      window.showBannerNotification('BẠN BÈ ĐÃ KẾT NỐI VÀO PHÒNG! 🎉', 'gold');
      document.getElementById('room-status-text').innerText = 'Đã kết nối cùng bạn bè! Bạn có thể mời bạn Thăm Đảo hoặc Thi Đấu Lôi Đài!';
    };
  } catch (e) {
    alert("Không thể tạo phòng: " + e);
  }
};

window.joinP2PRoom = async function() {
  const input = document.getElementById('join-code-input').value.trim();
  if (!input) {
    alert('Vui lòng nhập mã phòng của bạn bè!');
    return;
  }
  const net = window.NetworkInstance;
  try {
    document.getElementById('join-status-text').innerText = 'Đang kết nối tới phòng...';
    await net.joinRoom(input);
    window.showBannerNotification('KẾT NỐI VÀO PHÒNG BẠN BÈ THÀNH CÔNG! 🎉', 'gold');
    document.getElementById('join-status-text').innerText = 'Đã kết nối! Đang tải dữ liệu đảo bạn bè...';
  } catch (e) {
    alert("Không thể kết nối phòng: " + e);
  }
};

window.copyShareLink = function() {
  const input = document.getElementById('share-link-input');
  input.select();
  navigator.clipboard.writeText(input.value);
  window.showBannerNotification('Đã sao chép link chia sẻ phòng!', 'gold');
};

function checkUrlParamsForMultiplayer() {
  const urlParams = new URLSearchParams(window.location.search);
  const roomParam = urlParams.get('room');
  if (roomParam) {
    setTimeout(() => {
      openMultiplayerModal();
      document.getElementById('join-code-input').value = roomParam;
      window.joinP2PRoom();
    }, 1200);
  }
}

// --- 8. SAVE BACKUP MODAL ---
window.openSaveModal = function() {
  const modal = document.getElementById('save-modal');
  modal.classList.add('active');
  window.DragonAudio.playClick();
};

window.exportSaveData = function() {
  const code = window.GameInstance.exportSaveCode();
  const box = document.getElementById('save-code-box');
  box.value = code;
  box.select();
  navigator.clipboard.writeText(code);
  window.showBannerNotification('Đã xuất và sao chép mã lưu game thành công!', 'gold');
};

window.importSaveData = function() {
  const box = document.getElementById('save-code-box');
  const code = box.value.trim();
  if (!code) {
    alert('Vui lòng dán mã sao lưu vào khung!');
    return;
  }
  if (window.GameInstance.importSaveCode(code)) {
    window.showBannerNotification('Khôi phục dữ liệu save game thành công! 🎉', 'gold');
    closeModal('save-modal');
  } else {
    alert('Mã sao lưu không hợp lệ!');
  }
};
