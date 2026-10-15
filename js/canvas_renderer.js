/**
 * Bộ Dựng Hình Đồ Họa Đảo Rồng Siêu Cấp (AAA Web Canvas Engine)
 * Tái hiện đồ họa sống động: Tộc Rồng Xương Vàng, Rồng Xương Bạc, Rồng 3 Đầu, Rồng Phượng Hoàng
 * Hiệu ứng thác nước, bão tuyết, tàn lửa núi lửa, hào quang thần thoại 60 FPS
 */

class DragonCanvasRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.width = 1200;
    this.height = 750;
    this.particles = [];
    this.weatherParticles = [];
    this.floatingTexts = [];
    this.clouds = [];
    this.animTime = 0;
    this.interactiveEntities = [];
    this.hoveredEntity = null;
    this.onEntityClick = null;

    this.initClouds();
    this.initWeather();
    this.setupEvents();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = rect.height * window.devicePixelRatio;
    this.width = rect.width;
    this.height = rect.height;
    if (this.ctx) {
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
  }

  initClouds() {
    this.clouds = [
      { x: 50, y: 70, speed: 0.22, scale: 1.2, opacity: 0.45 },
      { x: 380, y: 130, speed: 0.16, scale: 0.9, opacity: 0.35 },
      { x: 750, y: 55, speed: 0.28, scale: 1.35, opacity: 0.48 },
      { x: 1050, y: 100, speed: 0.19, scale: 0.85, opacity: 0.3 }
    ];
  }

  initWeather() {
    this.weatherParticles = [];
    for (let i = 0; i < 45; i++) {
      this.weatherParticles.push({
        x: Math.random() * 1200,
        y: Math.random() * 750,
        vy: 0.5 + Math.random() * 1.5,
        vx: (Math.random() - 0.5) * 0.8,
        size: 1.5 + Math.random() * 2.5,
        alpha: 0.3 + Math.random() * 0.5
      });
    }
  }

  setupEvents() {
    if (!this.canvas) return;

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      let found = null;
      for (let i = this.interactiveEntities.length - 1; i >= 0; i--) {
        const ent = this.interactiveEntities[i];
        if (mx >= ent.x && mx <= ent.x + ent.w && my >= ent.y && my <= ent.y + ent.h) {
          found = ent;
          break;
        }
      }
      this.hoveredEntity = found;
      this.canvas.style.cursor = found ? 'pointer' : 'default';
    });

    this.canvas.addEventListener('click', () => {
      if (this.hoveredEntity && this.onEntityClick) {
        this.onEntityClick(this.hoveredEntity);
      }
    });
  }

  addFloatingText(text, x, y, color = '#fbbf24') {
    this.floatingTexts.push({
      text,
      x,
      y,
      vy: -1.5,
      alpha: 1.0,
      color,
      life: 60
    });
  }

  addParticleBurst(x, y, color, count = 18) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.0;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        radius: 2 + Math.random() * 3.5,
        color,
        alpha: 1.0,
        gravity: 0.08,
        life: 45 + Math.random() * 20
      });
    }
  }

  // --- Main Render Loop ---
  render(gameState) {
    if (!this.ctx) return;
    this.animTime += 0.03;
    const ctx = this.ctx;
    this.interactiveEntities = [];

    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Sky & Sun rays
    this.drawSkyBackground(gameState.currentIslandId);

    // 2. Drifting Clouds
    this.drawClouds();

    // 3. Floating Island with Cascading Waterfall
    this.drawIslandLandmass(gameState.currentIslandId);

    // 4. Weather Ambient Particles (Flames / Snow / Sparks / Holy Petals)
    this.drawWeatherEffects(gameState.currentIslandId);

    // 5. Core Structures
    this.drawBreedingCave(gameState.breedingCave);
    this.drawHatchery(gameState.hatchery);

    // 6. Farm Plots
    this.drawFarms(gameState.farms);

    // 7. Habitats & Ultra-detail Dragons
    this.drawHabitats(gameState.habitats);

    // 8. Dynamic Particles & Numbers
    this.updateAndDrawParticles();
    this.updateAndDrawFloatingTexts();
  }

  drawSkyBackground(islandId) {
    const ctx = this.ctx;
    let topColor = '#0f172a';
    let midColor = '#1e3a8a';
    let bottomColor = '#38bdf8';

    if (islandId === 'island_2') {
      topColor = '#450a0a';
      midColor = '#991b1b';
      bottomColor = '#ea580c';
    } else if (islandId === 'island_4') {
      topColor = '#1e1b4b';
      midColor = '#431407';
      bottomColor = '#ca8a04';
    } else if (islandId === 'island_5') {
      topColor = '#082f49';
      midColor = '#0369a1';
      bottomColor = '#bae6fd';
    } else if (islandId === 'island_6') {
      topColor = '#2e1065';
      midColor = '#78350f';
      bottomColor = '#fde047';
    }

    const grad = ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, topColor);
    grad.addColorStop(0.55, midColor);
    grad.addColorStop(1, bottomColor);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Subtle sunbeam rays
    ctx.save();
    ctx.globalAlpha = 0.07;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(this.width * 0.5, 0);
    ctx.lineTo(this.width * 0.2, this.height);
    ctx.lineTo(this.width * 0.35, this.height);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(this.width * 0.5, 0);
    ctx.lineTo(this.width * 0.65, this.height);
    ctx.lineTo(this.width * 0.8, this.height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawClouds() {
    const ctx = this.ctx;
    ctx.save();
    this.clouds.forEach(c => {
      c.x += c.speed;
      if (c.x > this.width + 150) c.x = -180;

      ctx.fillStyle = `rgba(255, 255, 255, ${c.opacity})`;
      ctx.beginPath();
      ctx.arc(c.x, c.y, 38 * c.scale, 0, Math.PI * 2);
      ctx.arc(c.x + 35 * c.scale, c.y - 14 * c.scale, 44 * c.scale, 0, Math.PI * 2);
      ctx.arc(c.x + 75 * c.scale, c.y, 36 * c.scale, 0, Math.PI * 2);
      ctx.arc(c.x + 40 * c.scale, c.y + 12 * c.scale, 32 * c.scale, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  drawIslandLandmass(islandId) {
    const ctx = this.ctx;
    const cx = this.width / 2;
    const cy = this.height * 0.62;
    const rx = Math.min(540, this.width * 0.47);
    const ry = 220;
    const bob = Math.sin(this.animTime * 0.8) * 5;

    ctx.save();
    ctx.translate(0, bob);

    // 1. Cascading Waterfall flowing off island edge
    ctx.save();
    const waterFlow = (this.animTime * 60) % 40;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
    ctx.beginPath();
    ctx.moveTo(cx - rx * 0.65, cy + 20);
    ctx.lineTo(cx - rx * 0.65 - 12, cy + ry * 1.6 + 50);
    ctx.lineTo(cx - rx * 0.65 + 16, cy + ry * 1.6 + 50);
    ctx.lineTo(cx - rx * 0.65 + 10, cy + 20);
    ctx.closePath();
    ctx.fill();

    // Waterfall foam splash
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx - rx * 0.65, cy + ry * 1.6 + 48, 14 + Math.sin(this.animTime * 5) * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Underground Cliff Bedrock & Roots
    ctx.beginPath();
    ctx.moveTo(cx - rx * 0.88, cy);
    ctx.bezierCurveTo(cx - rx * 0.55, cy + ry * 1.55, cx + rx * 0.55, cy + ry * 1.55, cx + rx * 0.88, cy);
    ctx.closePath();

    let bedTop = '#78350f', bedMid = '#451a03', bedBottom = '#291002';
    if (islandId === 'island_2') {
      bedTop = '#7f1d1d'; bedMid = '#450a0a'; bedBottom = '#1c1917';
    } else if (islandId === 'island_5') {
      bedTop = '#0c4a6e'; bedMid = '#082f49'; bedBottom = '#021f30';
    } else if (islandId === 'island_6') {
      bedTop = '#854d0e'; bedMid = '#581c87'; bedBottom = '#3b0764';
    }

    const bedGrad = ctx.createLinearGradient(0, cy, 0, cy + ry * 1.6);
    bedGrad.addColorStop(0, bedTop);
    bedGrad.addColorStop(0.5, bedMid);
    bedGrad.addColorStop(1, bedBottom);
    ctx.fillStyle = bedGrad;
    ctx.fill();

    // Floating Giant Mana Crystal under the island
    ctx.beginPath();
    ctx.moveTo(cx, cy + ry * 1.6 + 45);
    ctx.lineTo(cx - 20, cy + ry * 1.45);
    ctx.lineTo(cx + 20, cy + ry * 1.45);
    ctx.closePath();
    const crystalColor = (islandId === 'island_2') ? '#ef4444' : (islandId === 'island_6' ? '#fbbf24' : '#38bdf8');
    ctx.fillStyle = crystalColor;
    ctx.shadowColor = crystalColor;
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.shadowBlur = 0;

    // 3. Top Island Plateau
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry * 0.65, 0, 0, Math.PI * 2);

    let plate1 = '#4ade80', plate2 = '#22c55e', plate3 = '#15803d', strokeColor = '#86efac';
    if (islandId === 'island_2') {
      plate1 = '#f97316'; plate2 = '#c2410c'; plate3 = '#7c2d12'; strokeColor = '#fdba74';
    } else if (islandId === 'island_3') {
      plate1 = '#38bdf8'; plate2 = '#0284c7'; plate3 = '#0369a1'; strokeColor = '#bae6fd';
    } else if (islandId === 'island_4') {
      plate1 = '#eab308'; plate2 = '#ca8a04'; plate3 = '#854d0e'; strokeColor = '#fef08a';
    } else if (islandId === 'island_5') {
      plate1 = '#e0f2fe'; plate2 = '#7dd3fc'; plate3 = '#38bdf8'; strokeColor = '#fff';
    } else if (islandId === 'island_6') {
      plate1 = '#fef08a'; plate2 = '#f59e0b'; plate3 = '#b45309'; strokeColor = '#fffbeb';
    }

    const topGrad = ctx.createLinearGradient(0, cy - ry * 0.65, 0, cy + ry * 0.65);
    topGrad.addColorStop(0, plate1);
    topGrad.addColorStop(0.5, plate2);
    topGrad.addColorStop(1, plate3);
    ctx.fillStyle = topGrad;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();

    ctx.restore();
  }

  drawWeatherEffects(islandId) {
    const ctx = this.ctx;
    ctx.save();

    let pColor = 'rgba(255, 255, 255, 0.4)';
    if (islandId === 'island_2') pColor = 'rgba(249, 115, 22, 0.7)'; // Ember
    if (islandId === 'island_4') pColor = 'rgba(234, 179, 8, 0.8)';  // Lightning spark
    if (islandId === 'island_6') pColor = 'rgba(251, 191, 36, 0.8)'; // Golden star

    this.weatherParticles.forEach(p => {
      p.y += (islandId === 'island_2') ? -p.vy : p.vy;
      p.x += p.vx;

      if (p.y > this.height + 10) p.y = -10;
      if (p.y < -10) p.y = this.height + 10;
      if (p.x > this.width + 10) p.x = -10;
      if (p.x < -10) p.x = this.width + 10;

      ctx.fillStyle = pColor;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  // --- Core Structures ---
  drawBreedingCave(cave) {
    const ctx = this.ctx;
    const x = this.width * 0.18;
    const y = this.height * 0.42;
    const w = 110;
    const h = 95;

    this.interactiveEntities.push({
      type: 'BREEDING_CAVE',
      x: x - w / 2,
      y: y - h / 2,
      w,
      h,
      data: cave
    });

    ctx.save();
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(x, y + 10, 50, Math.PI, 0);
    ctx.lineTo(x + 50, y + 42);
    ctx.lineTo(x - 50, y + 42);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.arc(x, y + 15, 36, Math.PI, 0);
    ctx.lineTo(x + 36, y + 42);
    ctx.lineTo(x - 36, y + 42);
    ctx.closePath();
    ctx.fill();

    const pulse = Math.sin(this.animTime * 3) * 3;
    ctx.fillStyle = '#f43f5e';
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 12 + pulse;
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('💖', x, y - 36);
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Động Lai Giống', x, y + 58);

    if (cave.isReady) {
      this.drawSpeechBubble(x, y - 55, 'Trứng Xong! 🥚', '#10b981');
    } else if (cave.startTime) {
      const remaining = Math.max(0, Math.ceil((cave.readyTime - Date.now()) / 1000));
      this.drawSpeechBubble(x, y - 55, `Đang Lai: ${remaining}s`, '#f59e0b');
    }
    ctx.restore();
  }

  drawHatchery(hatchery) {
    const ctx = this.ctx;
    const x = this.width * 0.82;
    const y = this.height * 0.42;
    const w = 110;
    const h = 95;

    this.interactiveEntities.push({
      type: 'HATCHERY',
      x: x - w / 2,
      y: y - h / 2,
      w,
      h,
      data: hatchery
    });

    ctx.save();
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.ellipse(x, y + 25, 50, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#a16207';
    ctx.stroke();

    if (hatchery.length === 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '12px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText('(Trống)', x, y + 25);
    } else {
      hatchery.slice(0, 3).forEach((egg, idx) => {
        const offX = (idx - 1) * 22;
        const eggConfig = DRAGONS_DB[egg.dragonId] || DRAGONS_DB.dragon_fire;
        const color = eggConfig.appearance.primaryColor;
        const rock = egg.isReady ? Math.sin(this.animTime * 6 + idx) * 0.15 : 0;

        ctx.save();
        ctx.translate(x + offX, y + 10);
        ctx.rotate(rock);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(0, 0, 11, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Bone pattern on egg if Bone Dragon
        if (eggConfig.elements && eggConfig.elements.includes('BONE')) {
          ctx.fillStyle = '#fff';
          ctx.font = '9px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('💀', 0, 3);
        }
        ctx.restore();
      });
    }

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Ổ Ấp Trứng', x, y + 58);

    if (hatchery.some(e => e.isReady)) {
      this.drawSpeechBubble(x, y - 40, 'Ấp Nở! 🐣', '#ec4899');
    }
    ctx.restore();
  }

  drawFarms(farms) {
    const ctx = this.ctx;
    const startX = this.width * 0.32;
    const startY = this.height * 0.36;
    const gap = 85;

    farms.forEach((farm, idx) => {
      const x = startX + idx * gap;
      const y = startY;
      const w = 70;
      const h = 55;

      this.interactiveEntities.push({
        type: 'FARM',
        x: x - w / 2,
        y: y - h / 2,
        w,
        h,
        data: farm
      });

      ctx.save();
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.ellipse(x, y + 10, 34, 19, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#451a03';
      ctx.stroke();

      if (farm.cropId) {
        const crop = CROPS_DB.find(c => c.id === farm.cropId);
        if (farm.isReady) {
          ctx.font = '26px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(crop.icon, x, y + 5);
          this.drawSpeechBubble(x, y - 24, 'Thu Hoạch!', '#10b981');
        } else {
          ctx.font = '16px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('🌱', x, y + 8);
          const remaining = Math.max(0, Math.ceil((farm.readyTime - Date.now()) / 1000));
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 10px Plus Jakarta Sans';
          ctx.fillText(`${remaining}s`, x, y - 10);
        }
      } else {
        ctx.fillStyle = '#fbbf24';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('➕', x, y + 14);
      }
      ctx.restore();
    });
  }

  drawHabitats(habitats) {
    const ctx = this.ctx;
    const positions = [
      { x: this.width * 0.28, y: this.height * 0.58 },
      { x: this.width * 0.50, y: this.height * 0.56 },
      { x: this.width * 0.72, y: this.height * 0.58 },
      { x: this.width * 0.38, y: this.height * 0.73 },
      { x: this.width * 0.62, y: this.height * 0.73 }
    ];

    habitats.forEach((hab, idx) => {
      const pos = positions[idx % positions.length];
      const w = 150;
      const h = 110;

      this.interactiveEntities.push({
        type: 'HABITAT',
        x: pos.x - w / 2,
        y: pos.y - h / 2,
        w,
        h,
        data: hab
      });

      ctx.save();
      const habConfig = HABITATS_DB[hab.type] || HABITATS_DB.habitat_fire;
      const elemConfig = ELEMENTS[habConfig.element] || ELEMENTS.FIRE;

      // Habitat Ground Circle
      ctx.fillStyle = elemConfig.color;
      ctx.beginPath();
      ctx.ellipse(pos.x, pos.y + 18, 68, 38, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#fff';
      ctx.stroke();

      // Special Bone Habitat Altar spikes
      if (hab.type === 'habitat_bone') {
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(pos.x - 55, pos.y + 15);
        ctx.lineTo(pos.x - 62, pos.y - 10);
        ctx.lineTo(pos.x - 48, pos.y + 15);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(pos.x + 55, pos.y + 15);
        ctx.lineTo(pos.x + 62, pos.y - 10);
        ctx.lineTo(pos.x + 48, pos.y + 15);
        ctx.closePath();
        ctx.fill();
      }

      ctx.font = '22px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(habConfig.icon, pos.x - 44, pos.y);

      // Render Dragons inside Habitat
      hab.dragons.forEach((dragon, dIdx) => {
        const dConfig = DRAGONS_DB[dragon.id] || DRAGONS_DB.dragon_fire;
        const dOffX = (dIdx - 0.5) * 46;
        const dOffY = -8 + (dIdx % 2) * 10;
        this.drawMasterDragon(pos.x + dOffX, pos.y + dOffY, dConfig, dragon.level, dIdx);
      });

      // Gold Bubble
      if (hab.currentGold >= 10) {
        this.drawGoldBubble(pos.x, pos.y - 45, Math.floor(hab.currentGold));
      }

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px Plus Jakarta Sans, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(`${habConfig.name} (Lv.${hab.level})`, pos.x, pos.y + 44);
      ctx.shadowBlur = 0;

      ctx.restore();
    });
  }

  // --- Dragon Master Renderer ---
  drawMasterDragon(x, y, dConfig, level, indexOffset = 0) {
    const ctx = this.ctx;
    const stage = getEvolutionStage(level);
    const scale = stage.scale;
    const bob = Math.sin(this.animTime * 4 + indexOffset * 1.5) * 3;
    const wingFlap = Math.sin(this.animTime * 8 + indexOffset) * 0.28;

    ctx.save();
    ctx.translate(x, y + bob);
    ctx.scale(scale, scale);

    const app = dConfig.appearance;

    if (app.isBone) {
      // 1. Render Tộc Rồng Xương (Golden Bone, Silver Bone, Dark Bone)
      this.drawSkeletalDragon(ctx, app, level, wingFlap, dConfig);
    } else if (app.isHydra) {
      // 2. Render Rồng Ba Đầu
      this.drawHydraDragon(ctx, app, level, wingFlap, dConfig);
    } else if (app.isPhoenix) {
      // 3. Render Rồng Phượng Hoàng
      this.drawPhoenixDragon(ctx, app, level, wingFlap, dConfig);
    } else {
      // 4. Render Rồng Tiêu Chuẩn Nâng Cao
      this.drawEnhancedStandardDragon(ctx, app, level, wingFlap, dConfig);
    }

    // Level Badge Pill
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.beginPath();
    ctx.roundRect(-16, 20, 32, 14, 6);
    ctx.fill();
    ctx.fillStyle = (dConfig.rarity >= 5) ? '#fbbf24' : '#fff';
    ctx.font = 'bold 9px Plus Jakarta Sans';
    ctx.textAlign = 'center';
    ctx.fillText(`Lv.${level}`, 0, 30);

    ctx.restore();
  }

  // A. Skeletal Bone Dragon (Rồng Xương Vàng & Bạc)
  drawSkeletalDragon(ctx, app, level, wingFlap, dConfig) {
    const isGold = (app.boneType === 'GOLD');
    const isSilver = (app.boneType === 'SILVER');

    // 1. Skeletal Wings Back
    ctx.save();
    ctx.rotate(-wingFlap);
    ctx.strokeStyle = app.primaryColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(8, -10);
    ctx.lineTo(28, -28);
    ctx.lineTo(36, -12);
    ctx.lineTo(16, -2);
    ctx.stroke();

    // Ethereal soul membrane between bones
    ctx.fillStyle = isGold ? 'rgba(251, 191, 36, 0.35)' : 'rgba(56, 189, 248, 0.35)';
    ctx.fill();
    ctx.restore();

    // 2. Skeletal Vertebrae Tail
    ctx.strokeStyle = app.primaryColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 14);
    ctx.quadraticCurveTo(18, 22, 28, 16);
    ctx.stroke();

    // Tail bone scythe blade
    ctx.fillStyle = isGold ? '#f59e0b' : '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(28, 16);
    ctx.lineTo(36, 12);
    ctx.lineTo(32, 22);
    ctx.closePath();
    ctx.fill();

    // 3. Exposed Skeletal Ribcage
    ctx.fillStyle = '#0f172a'; // dark chest cavity
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Inner Soul Heart Core
    const heartPulse = Math.sin(this.animTime * 6) * 2;
    ctx.fillStyle = isGold ? '#ef4444' : '#06b6d4';
    ctx.shadowColor = isGold ? '#ef4444' : '#06b6d4';
    ctx.shadowBlur = 10 + heartPulse;
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Rib bones
    ctx.strokeStyle = app.primaryColor;
    ctx.lineWidth = 2.5;
    for (let r = -8; r <= 8; r += 4) {
      ctx.beginPath();
      ctx.moveTo(-11, r);
      ctx.quadraticCurveTo(0, r + 2, 11, r);
      ctx.stroke();
    }

    // 4. Skeletal Wings Front
    ctx.save();
    ctx.rotate(wingFlap);
    ctx.strokeStyle = app.primaryColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-6, -6);
    ctx.lineTo(-28, -26);
    ctx.lineTo(-32, -10);
    ctx.lineTo(-12, 0);
    ctx.stroke();
    ctx.fillStyle = isGold ? 'rgba(251, 191, 36, 0.4)' : 'rgba(56, 189, 248, 0.4)';
    ctx.fill();
    ctx.restore();

    // 5. Skull Head
    ctx.fillStyle = app.primaryColor;
    ctx.beginPath();
    ctx.ellipse(0, -22, 12, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sharp Snout & Fangs
    ctx.beginPath();
    ctx.moveTo(-4, -17);
    ctx.lineTo(-1, -12);
    ctx.lineTo(2, -17);
    ctx.fillStyle = '#fff';
    ctx.fill();

    // Bone Horns (Golden Crown if Golden Bone Dragon)
    if (isGold) {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(-10, -28);
      ctx.lineTo(-16, -44);
      ctx.lineTo(-6, -32);
      ctx.lineTo(0, -48); // Crown center spire
      ctx.lineTo(6, -32);
      ctx.lineTo(16, -44);
      ctx.lineTo(10, -28);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.strokeStyle = app.hornColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-5, -30);
      ctx.lineTo(-15, -42);
      ctx.moveTo(5, -30);
      ctx.lineTo(15, -42);
      ctx.stroke();
    }

    // Glowing Eye Sockets
    ctx.fillStyle = app.eyeColor;
    ctx.shadowColor = app.eyeColor;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(-4, -22, 3, 0, Math.PI * 2);
    ctx.arc(4, -22, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // B. Hydra Three-Headed Dragon
  drawHydraDragon(ctx, app, level, wingFlap, dConfig) {
    // Body & Wings
    ctx.fillStyle = app.primaryColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3 Heads
    const headOffsets = [
      { x: -14, y: -24, rot: -0.25 },
      { x: 0, y: -28, rot: 0 },
      { x: 14, y: -24, rot: 0.25 }
    ];

    headOffsets.forEach((h, idx) => {
      ctx.save();
      ctx.translate(h.x, h.y);
      ctx.rotate(h.rot);

      ctx.fillStyle = app.secondaryColor;
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = app.eyeColor;
      ctx.beginPath();
      ctx.arc(-2, -2, 2, 0, Math.PI * 2);
      ctx.arc(3, -2, 2, 0, Math.PI * 2);
      ctx.fill();

      // Sharp Horn
      ctx.fillStyle = app.hornColor;
      ctx.beginPath();
      ctx.moveTo(-3, -8);
      ctx.lineTo(0, -17);
      ctx.lineTo(3, -8);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
  }

  // C. Phoenix Dragon
  drawPhoenixDragon(ctx, app, level, wingFlap, dConfig) {
    // Flaming Wings
    ctx.save();
    ctx.rotate(-wingFlap * 1.3);
    const flameGrad = ctx.createLinearGradient(0, 0, 35, -35);
    flameGrad.addColorStop(0, '#f97316');
    flameGrad.addColorStop(0.5, '#ef4444');
    flameGrad.addColorStop(1, '#fde047');
    ctx.fillStyle = flameGrad;
    ctx.beginPath();
    ctx.moveTo(8, -8);
    ctx.lineTo(35, -35);
    ctx.lineTo(24, -10);
    ctx.lineTo(40, -14);
    ctx.lineTo(16, 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Body
    ctx.fillStyle = app.primaryColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Golden Belly
    ctx.fillStyle = app.bellyColor;
    ctx.beginPath();
    ctx.ellipse(-2, 3, 9, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // Phoenix Head & Crest Feathers
    ctx.fillStyle = app.primaryColor;
    ctx.beginPath();
    ctx.arc(0, -22, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(-4, -30);
    ctx.lineTo(0, -48);
    ctx.lineTo(4, -30);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-3, -22, 3.5, 0, Math.PI * 2);
    ctx.arc(4, -22, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(-3, -22, 2, 0, Math.PI * 2);
    ctx.arc(4, -22, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // D. Standard Enhanced Dragon
  drawEnhancedStandardDragon(ctx, app, level, wingFlap, dConfig) {
    // Wing Back
    ctx.save();
    ctx.rotate(-wingFlap);
    ctx.fillStyle = app.secondaryColor;
    ctx.beginPath();
    ctx.moveTo(8, -12);
    ctx.lineTo(28, -32);
    ctx.lineTo(36, -14);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Body
    ctx.fillStyle = app.primaryColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly
    ctx.fillStyle = app.bellyColor;
    ctx.beginPath();
    ctx.ellipse(-2, 3, 9, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wing Front
    ctx.save();
    ctx.rotate(wingFlap);
    ctx.fillStyle = app.secondaryColor;
    ctx.beginPath();
    ctx.moveTo(-6, -6);
    ctx.lineTo(-28, -28);
    ctx.lineTo(-14, -4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Head
    ctx.fillStyle = app.primaryColor;
    ctx.beginPath();
    ctx.arc(0, -22, 13, 0, Math.PI * 2);
    ctx.fill();

    // Horns
    ctx.fillStyle = app.hornColor;
    ctx.beginPath();
    ctx.moveTo(-5, -32);
    ctx.lineTo(-12, -45);
    ctx.lineTo(-2, -34);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(5, -32);
    ctx.lineTo(12, -45);
    ctx.lineTo(2, -34);
    ctx.closePath();
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-4, -23, 4, 0, Math.PI * 2);
    ctx.arc(4, -23, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = app.eyeColor;
    ctx.beginPath();
    ctx.arc(-3, -23, 2.5, 0, Math.PI * 2);
    ctx.arc(5, -23, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  drawGoldBubble(x, y, goldAmount) {
    const ctx = this.ctx;
    const bob = Math.sin(this.animTime * 4) * 4;
    ctx.save();
    ctx.translate(x, y + bob);

    ctx.fillStyle = 'rgba(251, 191, 36, 0.95)';
    ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.roundRect(-30, -14, 60, 26, 13);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#1e1b4b';
    ctx.font = 'bold 11px Plus Jakarta Sans';
    ctx.textAlign = 'center';
    ctx.fillText(`💰 ${goldAmount}`, 0, 4);
    ctx.restore();
  }

  drawSpeechBubble(x, y, text, bgColor = '#10b981') {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect(x - 45, y - 12, 90, 24, 8);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px Plus Jakarta Sans';
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y + 4);
    ctx.restore();
  }

  updateAndDrawParticles() {
    const ctx = this.ctx;
    ctx.save();
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.life--;
      p.alpha = Math.max(0, p.life / 50);

      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
    ctx.restore();
  }

  updateAndDrawFloatingTexts() {
    const ctx = this.ctx;
    ctx.save();
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy;
      ft.life--;
      ft.alpha = Math.max(0, ft.life / 50);

      ctx.fillStyle = ft.color;
      ctx.globalAlpha = ft.alpha;
      ctx.font = 'bold 16px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(ft.text, ft.x, ft.y);

      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
    ctx.restore();
  }
}

window.DragonCanvasRenderer = DragonCanvasRenderer;
