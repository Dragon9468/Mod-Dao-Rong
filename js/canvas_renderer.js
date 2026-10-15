/**
 * Bộ Dựng Hình Đồ Họa Đảo Rồng - Canvas Rendering & Particle Engine
 * Tái hiện thế giới Đảo Rồng Zing Me rực rỡ sắc màu, mượt mà 60 FPS
 */

class DragonCanvasRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.width = 1200;
    this.height = 750;
    this.particles = [];
    this.floatingTexts = [];
    this.clouds = [];
    this.animTime = 0;
    this.interactiveEntities = []; // Clickable bounds: habitats, farms, cave, hatchery
    this.hoveredEntity = null;
    this.onEntityClick = null;

    this.initClouds();
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
      { x: 50, y: 80, speed: 0.25, scale: 1.2, opacity: 0.45 },
      { x: 450, y: 140, speed: 0.18, scale: 0.9, opacity: 0.35 },
      { x: 850, y: 60, speed: 0.32, scale: 1.4, opacity: 0.5 },
      { x: 1100, y: 110, speed: 0.2, scale: 0.8, opacity: 0.3 }
    ];
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

    this.canvas.addEventListener('click', (e) => {
      if (this.hoveredEntity && this.onEntityClick) {
        this.onEntityClick(this.hoveredEntity);
      }
    });
  }

  // Add floating gold/food number effect
  addFloatingText(text, x, y, color = '#fbbf24') {
    this.floatingTexts.push({
      text,
      x,
      y,
      vy: -1.4,
      alpha: 1.0,
      color,
      life: 60
    });
  }

  // Add particle burst
  addParticleBurst(x, y, color, count = 15) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.0,
        radius: 2 + Math.random() * 3.5,
        color,
        alpha: 1.0,
        gravity: 0.08,
        life: 40 + Math.random() * 20
      });
    }
  }

  // Main Render Loop
  render(gameState) {
    if (!this.ctx) return;
    this.animTime += 0.03;
    const ctx = this.ctx;
    this.interactiveEntities = [];

    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Sky Background Gradient
    this.drawSkyBackground(gameState.currentIslandId);

    // 2. Draw Drifting Clouds
    this.drawClouds();

    // 3. Draw Floating Island Base
    this.drawIslandLandmass(gameState.currentIslandId);

    // 4. Draw Core Structures: Breeding Cave, Hatchery
    this.drawBreedingCave(gameState.breedingCave);
    this.drawHatchery(gameState.hatchery);

    // 5. Draw Farm Plots
    this.drawFarms(gameState.farms);

    // 6. Draw Habitats & Dragons
    this.drawHabitats(gameState.habitats);

    // 7. Update & Draw Particles
    this.updateAndDrawParticles();

    // 8. Update & Draw Floating Texts
    this.updateAndDrawFloatingTexts();
  }

  drawSkyBackground(islandId) {
    const ctx = this.ctx;
    let topColor = '#1e3a8a';
    let bottomColor = '#38bdf8';

    if (islandId === 'island_2') {
      topColor = '#450a0a';
      bottomColor = '#ea580c';
    } else if (islandId === 'island_4') {
      topColor = '#2e1065';
      bottomColor = '#ca8a04';
    } else if (islandId === 'island_5') {
      topColor = '#082f49';
      bottomColor = '#bae6fd';
    } else if (islandId === 'island_6') {
      topColor = '#451a03';
      bottomColor = '#fbbf24';
    }

    const grad = ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, topColor);
    grad.addColorStop(0.65, bottomColor);
    grad.addColorStop(1, '#ecfeff');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);
  }

  drawClouds() {
    const ctx = this.ctx;
    ctx.save();
    this.clouds.forEach(c => {
      c.x += c.speed;
      if (c.x > this.width + 120) c.x = -150;

      ctx.fillStyle = `rgba(255, 255, 255, ${c.opacity})`;
      ctx.beginPath();
      ctx.arc(c.x, c.y, 35 * c.scale, 0, Math.PI * 2);
      ctx.arc(c.x + 30 * c.scale, c.y - 12 * c.scale, 40 * c.scale, 0, Math.PI * 2);
      ctx.arc(c.x + 65 * c.scale, c.y, 32 * c.scale, 0, Math.PI * 2);
      ctx.arc(c.x + 35 * c.scale, c.y + 10 * c.scale, 30 * c.scale, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  drawIslandLandmass(islandId) {
    const ctx = this.ctx;
    const cx = this.width / 2;
    const cy = this.height * 0.62;
    const rx = Math.min(520, this.width * 0.46);
    const ry = 220;

    // Island bobbing motion
    const bob = Math.sin(this.animTime * 0.8) * 5;

    ctx.save();
    ctx.translate(0, bob);

    // Underground bedrock & roots
    ctx.beginPath();
    ctx.moveTo(cx - rx * 0.85, cy);
    ctx.bezierCurveTo(cx - rx * 0.5, cy + ry * 1.5, cx + rx * 0.5, cy + ry * 1.5, cx + rx * 0.85, cy);
    ctx.closePath();
    const bedGrad = ctx.createLinearGradient(0, cy, 0, cy + ry * 1.5);
    bedGrad.addColorStop(0, '#78350f');
    bedGrad.addColorStop(0.5, '#451a03');
    bedGrad.addColorStop(1, '#291002');
    ctx.fillStyle = bedGrad;
    ctx.fill();

    // Floating crystal hanging underneath
    ctx.beginPath();
    ctx.moveTo(cx, cy + ry * 1.5 + 40);
    ctx.lineTo(cx - 16, cy + ry * 1.4);
    ctx.lineTo(cx + 16, cy + ry * 1.4);
    ctx.closePath();
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Top Island Surface (Lush Greenery or Elemental Plate)
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry * 0.65, 0, 0, Math.PI * 2);
    const topGrad = ctx.createLinearGradient(0, cy - ry * 0.65, 0, cy + ry * 0.65);
    topGrad.addColorStop(0, '#4ade80');
    topGrad.addColorStop(0.5, '#22c55e');
    topGrad.addColorStop(1, '#15803d');
    ctx.fillStyle = topGrad;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#86efac';
    ctx.stroke();

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
    // Cave stone arch
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(x, y + 10, 48, Math.PI, 0);
    ctx.lineTo(x + 48, y + 42);
    ctx.lineTo(x - 48, y + 42);
    ctx.closePath();
    ctx.fill();

    // Cave dark opening
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(x, y + 15, 34, Math.PI, 0);
    ctx.lineTo(x + 34, y + 42);
    ctx.lineTo(x - 34, y + 42);
    ctx.closePath();
    ctx.fill();

    // Magic pink heart crystal on top
    const pulse = Math.sin(this.animTime * 3) * 3;
    ctx.fillStyle = '#f43f5e';
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 10 + pulse;
    ctx.font = '22px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('💖', x, y - 36);
    ctx.shadowBlur = 0;

    // Label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Động Lai Giống', x, y + 58);

    // Status bubble
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
    // Nest Straw Base
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.ellipse(x, y + 25, 48, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#a16207';
    ctx.stroke();

    // Eggs in nest
    const eggCount = hatchery.length;
    if (eggCount === 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '12px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText('(Trống)', x, y + 25);
    } else {
      hatchery.slice(0, 3).forEach((egg, idx) => {
        const offX = (idx - 1) * 22;
        const eggConfig = DRAGONS_DB[egg.dragonId] || DRAGONS_DB.dragon_fire;
        const color = eggConfig.appearance.primaryColor;

        // Egg gentle rocking if ready
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
        ctx.restore();
      });
    }

    // Label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Ổ Ấp Trứng', x, y + 58);

    // If any egg ready
    const hasReady = hatchery.some(e => e.isReady);
    if (hasReady) {
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
      // Soil plot
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.ellipse(x, y + 10, 32, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#451a03';
      ctx.stroke();

      if (farm.cropId) {
        const crop = CROPS_DB.find(c => c.id === farm.cropId);
        if (farm.isReady) {
          ctx.font = '24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(crop.icon, x, y + 5);
          this.drawSpeechBubble(x, y - 24, 'Thu Hoạch!', '#10b981');
        } else {
          // Growing sprout
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

      // Habitat Base Circle / Arena
      const habConfig = HABITATS_DB[hab.type] || HABITATS_DB.habitat_fire;
      const elemConfig = ELEMENTS[habConfig.element] || ELEMENTS.FIRE;

      ctx.fillStyle = elemConfig.color;
      ctx.beginPath();
      ctx.ellipse(pos.x, pos.y + 18, 65, 36, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#fff';
      ctx.stroke();

      // Habitat Decor: Element icon or mini volcano/pond
      ctx.font = '22px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(habConfig.icon, pos.x - 42, pos.y);

      // Render Dragons inside Habitat
      hab.dragons.forEach((dragon, dIdx) => {
        const dConfig = DRAGONS_DB[dragon.id] || DRAGONS_DB.dragon_fire;
        const dOffX = (dIdx - 0.5) * 44;
        const dOffY = -8 + (dIdx % 2) * 10;
        this.drawAnimatedDragon(pos.x + dOffX, pos.y + dOffY, dConfig, dragon.level, dIdx);
      });

      // Gold Bubble if gold > 10
      if (hab.currentGold >= 10) {
        this.drawGoldBubble(pos.x, pos.y - 45, Math.floor(hab.currentGold));
      }

      // Habitat Name
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px Plus Jakarta Sans, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(`${habConfig.name} (Lv.${hab.level})`, pos.x, pos.y + 44);
      ctx.shadowBlur = 0;

      ctx.restore();
    });
  }

  // Draw Cute Animated Dragon inside habitat or battle
  drawAnimatedDragon(x, y, dConfig, level, indexOffset = 0) {
    const ctx = this.ctx;
    const stage = getEvolutionStage(level);
    const scale = stage.scale;
    const bob = Math.sin(this.animTime * 4 + indexOffset * 1.5) * 3;
    const wingFlap = Math.sin(this.animTime * 8 + indexOffset) * 0.25;

    ctx.save();
    ctx.translate(x, y + bob);
    ctx.scale(scale, scale);

    const app = dConfig.appearance;

    // Wing Back
    ctx.save();
    ctx.rotate(-wingFlap);
    ctx.fillStyle = app.secondaryColor;
    ctx.beginPath();
    ctx.moveTo(8, -12);
    ctx.lineTo(26, -30);
    ctx.lineTo(34, -14);
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
    ctx.lineTo(-26, -26);
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

    // Level Badge Pill
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.roundRect(-16, 18, 32, 14, 6);
    ctx.fill();
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 9px Plus Jakarta Sans';
    ctx.textAlign = 'center';
    ctx.fillText(`Lv.${level}`, 0, 28);

    ctx.restore();
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
