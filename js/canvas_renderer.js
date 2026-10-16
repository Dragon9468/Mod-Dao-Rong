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
    this.onEntityClick = null;
    this.imageCache = {};

    this.resize();
    this.preloadAssets();
    this.initClouds();
    this.initWeather();
    this.setupEvents();
  }

  preloadAssets() {
    const assets = [
      'assets/backgrounds/dao_rong_island.jpg',
      'assets/backgrounds/dau_truong_rong.jpg',
      'assets/banner.png',
      'assets/logo.png',
      'assets/icon.png',
      'assets/dragons/rong_lua.png',
      'assets/dragons/rong_nuoc.png',
      'assets/dragons/rong_la.png',
      'assets/dragons/rong_dat.png',
      'assets/dragons/rong_sam.png',
      'assets/dragons/rong_bang.png',
      'assets/dragons/rong_dung_nham.png',
      'assets/dragons/rong_bun_lay.png',
      'assets/dragons/rong_hoi_nuoc.png',
      'assets/dragons/rong_san_ho.png',
      'assets/dragons/rong_bao_to.png',
      'assets/dragons/rong_laser.png',
      'assets/dragons/rong_bang_hoa.png',
      'assets/dragons/rong_anh_sang.png',
      'assets/dragons/hac_long.png',
      'assets/dragons/rong_xuong_bac.png',
      'assets/dragons/rong_xuong_vang.png',
      'assets/dragons/than_long_hoang_kim.png',
      'assets/dragons/rong_hac_cot.png',
      'assets/dragons/rong_huyet_xuong.png',
      'assets/dragons/rong_bich_xuong.png',
      'assets/dragons/rong_bang_xuong.png',
      'assets/dragons/rong_ba_dau.png',
      'assets/dragons/rong_phuong_hoang.png',
      'assets/dragons/rong_tinh_tu.png',
      'assets/dragons/rong_bach_quy.png',
      'assets/dragons/rong_bien_sau.png',
      'assets/dragons/rong_co_khi.png',
      'assets/dragons/rong_thiet_giap.png'
    ];
    assets.forEach(src => {
      this.getImage(src);
      if (src.includes('assets/dragons/')) {
        this.getImage(src.replace('assets/dragons/', 'assets/dragons/thumbs/'));
      }
    });
  }

  getImage(src) {
    if (!src) return null;
    const resolved = window.PGAME_CONFIG?.resolveMedia ? window.PGAME_CONFIG.resolveMedia(src) : src;
    if (this.imageCache[src]) return this.imageCache[src];
    if (this.imageCache[resolved]) return this.imageCache[resolved];
    const img = new Image();
    img.src = resolved;
    this.imageCache[src] = img;
    this.imageCache[resolved] = img;
    return img;
  }

  resize() {
    if (!this.canvas) return;
    const dpr = Math.max(window.devicePixelRatio || 1, 1);
    const rect = this.canvas.getBoundingClientRect();
    const cssW = rect.width > 0 ? rect.width : (this.canvas.clientWidth || 1200);
    const cssH = rect.height > 0 ? rect.height : (this.canvas.clientHeight || 750);
    this.canvas.width = Math.round(cssW * dpr);
    this.canvas.height = Math.round(cssH * dpr);
    this.width = cssW;
    this.height = cssH;
    if (this.ctx) {
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
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
    const dpr = Math.max(window.devicePixelRatio || 1, 1);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
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
    const bgImg = this.imageCache['assets/backgrounds/dao_rong_island.jpg'];
    const bob = Math.sin(this.animTime * 0.8) * 5;

    if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
      ctx.save();
      ctx.translate(0, bob);
      ctx.drawImage(bgImg, 0, 0, this.width, this.height);

      // Light ambient cloud fog across bottom
      const mistGrad = ctx.createLinearGradient(0, this.height * 0.75, 0, this.height);
      mistGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      mistGrad.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
      ctx.fillStyle = mistGrad;
      ctx.fillRect(0, this.height * 0.75, this.width, this.height * 0.25);
      ctx.restore();
      return;
    }

    const cx = this.width / 2;
    const cy = this.height * 0.62;
    const rx = Math.min(540, this.width * 0.47);
    const ry = 220;

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
  // --- Core Structures ---
  drawBreedingCave(cave) {
    const ctx = this.ctx;
    const x = this.width * 0.17;
    const y = this.height * 0.40;
    const w = 130;
    const h = 115;

    this.interactiveEntities.push({
      type: 'BREEDING_CAVE',
      x: x - w / 2,
      y: y - h / 2,
      w,
      h,
      data: cave
    });

    ctx.save();
    // 0. Soft Organic Ground Contact Shadow
    const caveGroundShadow = ctx.createRadialGradient(x, y + 44, 15, x, y + 44, 75);
    caveGroundShadow.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
    caveGroundShadow.addColorStop(0.5, 'rgba(0, 0, 0, 0.2)');
    caveGroundShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = caveGroundShadow;
    ctx.beginPath();
    ctx.ellipse(x, y + 44, 75, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // 1. Rocky Cavern Cliff Base
    const rockGrad = ctx.createRadialGradient(x, y + 10, 10, x, y + 10, 65);
    rockGrad.addColorStop(0, '#475569');
    rockGrad.addColorStop(0.7, '#1e293b');
    rockGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = rockGrad;
    ctx.beginPath();
    ctx.moveTo(x - 58, y + 45);
    ctx.quadraticCurveTo(x - 62, y - 15, x - 25, y - 35);
    ctx.quadraticCurveTo(x, y - 48, x + 30, y - 35);
    ctx.quadraticCurveTo(x + 65, y - 10, x + 60, y + 45);
    ctx.closePath();
    ctx.fill();

    // Mossy overlay on top of cave
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.ellipse(x, y - 34, 38, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Cavern Entrance (Deep dark maw with glowing heart magma)
    const caveDark = ctx.createLinearGradient(0, y - 10, 0, y + 45);
    caveDark.addColorStop(0, '#020617');
    caveDark.addColorStop(0.6, '#0f172a');
    caveDark.addColorStop(1, '#e11d48');
    ctx.fillStyle = caveDark;
    ctx.beginPath();
    ctx.moveTo(x - 38, y + 45);
    ctx.quadraticCurveTo(x - 42, y + 5, x, y - 15);
    ctx.quadraticCurveTo(x + 42, y + 5, x + 38, y + 45);
    ctx.closePath();
    ctx.fill();

    // Glowing Runic Carvings on Left and Right Stone Pillars
    const runeGlow = Math.sin(this.animTime * 4) * 0.3 + 0.7;
    ctx.save();
    ctx.fillStyle = `rgba(244, 63, 94, ${runeGlow})`;
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 10;
    ctx.font = 'bold 11px Arial';
    ctx.fillText('ᚠ', x - 46, y + 15);
    ctx.fillText('ᚱ', x - 46, y + 32);
    ctx.fillText('ᛟ', x + 42, y + 15);
    ctx.fillText('ᚾ', x + 42, y + 32);
    ctx.restore();

    // 3. Floating Heart Crystal Hearth
    const pulse = Math.sin(this.animTime * 4) * 4;
    const crystalBob = Math.sin(this.animTime * 2.5) * 4;
    ctx.save();
    ctx.translate(x, y - 42 + crystalBob);
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 18 + pulse;
    // Outer halo
    ctx.fillStyle = 'rgba(244, 63, 94, 0.3)';
    ctx.beginPath();
    ctx.arc(0, 0, 18 + pulse * 0.5, 0, Math.PI * 2);
    ctx.fill();
    // Heart Shape
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.bezierCurveTo(-10, -8, -16, 2, 0, 14);
    ctx.bezierCurveTo(16, 2, 10, -8, 0, 4);
    ctx.fill();
    // Inner crystal highlight
    ctx.fillStyle = '#ffe4e6';
    ctx.beginPath();
    ctx.arc(-3, 3, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 4. Wooden Signboard with Title
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.roundRect(x - 52, y + 48, 104, 20, 6);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 11px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Động Lai Giống', x, y + 62);

    if (cave.isReady) {
      this.drawSpeechBubble(x, y - 65, 'Trứng Xong! 🥚', '#10b981');
    } else if (cave.startTime) {
      const remaining = Math.max(0, Math.ceil((cave.readyTime - Date.now()) / 1000));
      this.drawSpeechBubble(x, y - 65, `Đang Lai: ${remaining}s`, '#f59e0b');
    }
    ctx.restore();
  }

  drawHatchery(hatchery) {
    const ctx = this.ctx;
    const x = this.width * 0.83;
    const y = this.height * 0.40;
    const w = 130;
    const h = 115;

    this.interactiveEntities.push({
      type: 'HATCHERY',
      x: x - w / 2,
      y: y - h / 2,
      w,
      h,
      data: hatchery
    });

    ctx.save();
    // 1. Wooden Arch Pole with Warm Hanging Lantern
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - 45, y + 42);
    ctx.lineTo(x - 45, y - 28);
    ctx.quadraticCurveTo(x - 45, y - 48, x - 26, y - 48);
    ctx.stroke();

    // Lantern
    const lanternFlicker = Math.sin(this.animTime * 8) * 3;
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 14 + lanternFlicker;
    ctx.beginPath();
    ctx.roundRect(x - 30, y - 44, 10, 15, 3);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 0. Soft Ground Contact Shadow
    const nestShadow = ctx.createRadialGradient(x, y + 26, 12, x, y + 26, 68);
    nestShadow.addColorStop(0, 'rgba(0, 0, 0, 0.42)');
    nestShadow.addColorStop(0.6, 'rgba(0, 0, 0, 0.18)');
    nestShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = nestShadow;
    ctx.beginPath();
    ctx.ellipse(x, y + 26, 68, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Straw & Golden Woven Dragon Nest Base
    const nestGrad = ctx.createLinearGradient(x - 55, y, x + 55, y + 40);
    nestGrad.addColorStop(0, '#b45309');
    nestGrad.addColorStop(0.5, '#d97706');
    nestGrad.addColorStop(1, '#92400e');
    ctx.fillStyle = nestGrad;
    ctx.beginPath();
    ctx.ellipse(x, y + 24, 56, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#78350f';
    ctx.stroke();

    // Straw Rim Texture
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;
    for (let angle = 0; angle < Math.PI * 2; angle += 0.35) {
      const rx = Math.cos(angle) * 54 + x;
      const ry = Math.sin(angle) * 25 + (y + 24);
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx + Math.cos(angle) * 8, ry + Math.sin(angle) * 4);
      ctx.stroke();
    }

    // Warm embers inside nest
    ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.beginPath();
    ctx.ellipse(x, y + 20, 38, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Dragon Eggs inside Nest
    if (hatchery.length === 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.font = 'bold 11px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText('(Tổ Ấp Trống)', x, y + 24);
    } else {
      hatchery.slice(0, 3).forEach((egg, idx) => {
        const offX = (idx - 1) * 26;
        const eggConfig = DRAGONS_DB[egg.dragonId] || DRAGONS_DB.dragon_fire;
        const color = eggConfig.appearance.primaryColor;
        const rock = egg.isReady ? Math.sin(this.animTime * 6 + idx * 2) * 0.18 : 0;

        ctx.save();
        ctx.translate(x + offX, y + 10);
        ctx.rotate(rock);

        // Egg Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(0, 14, 10, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // 3D Shaded Egg
        const eggGrad = ctx.createRadialGradient(-3, -4, 2, 0, 0, 16);
        eggGrad.addColorStop(0, '#ffffff');
        eggGrad.addColorStop(0.35, color);
        eggGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = eggGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, 12, 17, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Cracks and rays if ready
        if (egg.isReady) {
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-4, -6);
          ctx.lineTo(2, 0);
          ctx.lineTo(-2, 6);
          ctx.stroke();

          // Golden sparkle
          ctx.fillStyle = '#fbbf24';
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(0, -18, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Bone Dragon Egg special skull emblem
        if (eggConfig.elements && eggConfig.elements.includes('BONE')) {
          ctx.fillStyle = '#fff';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('💀', 0, 4);
        }
        ctx.restore();
      });
    }

    // 4. Wooden Signboard
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.roundRect(x - 48, y + 48, 96, 20, 6);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 11px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Ổ Ấp Trứng', x, y + 62);

    if (hatchery.some(e => e.isReady)) {
      this.drawSpeechBubble(x, y - 55, 'Ấp Nở! 🐣', '#ec4899');
    }
    ctx.restore();
  }

  drawFarms(farms) {
    const ctx = this.ctx;
    const startX = this.width * 0.32;
    const startY = this.height * 0.35;
    const gap = 88;

    farms.forEach((farm, idx) => {
      const x = startX + idx * gap;
      const y = startY;
      const w = 78;
      const h = 60;

      this.interactiveEntities.push({
        type: 'FARM',
        x: x - w / 2,
        y: y - h / 2,
        w,
        h,
        data: farm
      });

      ctx.save();
      // 0. Soft Ground Shadow
      const farmShadow = ctx.createRadialGradient(x, y + 16, 10, x, y + 16, 48);
      farmShadow.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
      farmShadow.addColorStop(0.6, 'rgba(0, 0, 0, 0.16)');
      farmShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = farmShadow;
      ctx.beginPath();
      ctx.ellipse(x, y + 16, 48, 24, 0, 0, Math.PI * 2);
      ctx.fill();

      // 1. Wooden Garden Bed Frame
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.roundRect(x - 38, y - 10, 76, 44, 8);
      ctx.fill();

      // Wooden planks border
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 3;
      ctx.stroke();

      // 2. Rich Dark Fertile Soil with Furrows
      const soilGrad = ctx.createLinearGradient(0, y - 6, 0, y + 30);
      soilGrad.addColorStop(0, '#592c0d');
      soilGrad.addColorStop(1, '#2c1204');
      ctx.fillStyle = soilGrad;
      ctx.beginPath();
      ctx.roundRect(x - 34, y - 6, 68, 36, 5);
      ctx.fill();

      // Soil ridge lines
      ctx.strokeStyle = '#1e0c03';
      ctx.lineWidth = 1.5;
      for (let sy = y; sy <= y + 24; sy += 8) {
        ctx.beginPath();
        ctx.moveTo(x - 30, sy);
        ctx.lineTo(x + 30, sy);
        ctx.stroke();
      }

      // 3. Crops or Empty Plot
      if (farm.cropId) {
        const crop = CROPS_DB.find(c => c.id === farm.cropId);
        if (farm.isReady) {
          // Ready for harvest: Bouncing plant with sparkle
          const bounce = Math.sin(this.animTime * 6) * 3;
          ctx.save();
          ctx.translate(x, y + 8 + bounce);
          ctx.font = '28px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(crop.icon, 0, 4);

          // Golden Harvest Stars
          ctx.fillStyle = '#fbbf24';
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(-18, -12, 2.5, 0, Math.PI * 2);
          ctx.arc(18, -12, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          this.drawSpeechBubble(x, y - 30, 'Thu Hoạch!', '#10b981');
        } else {
          // Growing plant
          const remaining = Math.max(0, Math.ceil((farm.readyTime - Date.now()) / 1000));
          ctx.font = '20px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('🌱', x, y + 10);

          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.beginPath();
          ctx.roundRect(x - 24, y - 26, 48, 16, 6);
          ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 9px Plus Jakarta Sans';
          ctx.textAlign = 'center';
          ctx.fillText(`${remaining}s`, x, y - 14);
        }
      } else {
        // Plus icon for planting
        const pulse = Math.sin(this.animTime * 4) * 0.2 + 0.8;
        ctx.fillStyle = `rgba(251, 191, 36, ${pulse})`;
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('➕', x, y + 16);
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
      const w = 160;
      const h = 120;

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

      // 0. Soft Organic Feathered Ground Shadow blending with terrain
      const habShadow = ctx.createRadialGradient(pos.x, pos.y + 24, 25, pos.x, pos.y + 24, 88);
      habShadow.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
      habShadow.addColorStop(0.5, 'rgba(0, 0, 0, 0.22)');
      habShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = habShadow;
      ctx.beginPath();
      ctx.ellipse(pos.x, pos.y + 24, 88, 48, 0, 0, Math.PI * 2);
      ctx.fill();

      // 1. 3D Stone Altar Platform Base
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.ellipse(pos.x, pos.y + 24, 76, 42, 0, 0, Math.PI * 2);
      ctx.fill();

      // Stone Bevel Rim
      const stoneGrad = ctx.createLinearGradient(pos.x - 70, pos.y, pos.x + 70, pos.y + 36);
      stoneGrad.addColorStop(0, '#475569');
      stoneGrad.addColorStop(0.5, '#334155');
      stoneGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = stoneGrad;
      ctx.beginPath();
      ctx.ellipse(pos.x, pos.y + 20, 72, 38, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#64748b';
      ctx.stroke();

      // 2. Inner Elemental Terrain Pool / Crater
      ctx.save();
      let elemGrad;
      if (hab.type === 'habitat_fire') {
        elemGrad = ctx.createRadialGradient(pos.x, pos.y + 18, 5, pos.x, pos.y + 18, 55);
        elemGrad.addColorStop(0, '#fef08a');
        elemGrad.addColorStop(0.3, '#f97316');
        elemGrad.addColorStop(0.8, '#dc2626');
        elemGrad.addColorStop(1, '#450a0a');
      } else if (hab.type === 'habitat_water') {
        elemGrad = ctx.createRadialGradient(pos.x, pos.y + 18, 5, pos.x, pos.y + 18, 55);
        elemGrad.addColorStop(0, '#bae6fd');
        elemGrad.addColorStop(0.5, '#0284c7');
        elemGrad.addColorStop(1, '#082f49');
      } else if (hab.type === 'habitat_bone') {
        elemGrad = ctx.createRadialGradient(pos.x, pos.y + 18, 5, pos.x, pos.y + 18, 55);
        elemGrad.addColorStop(0, '#f8fafc');
        elemGrad.addColorStop(0.6, '#94a3b8');
        elemGrad.addColorStop(1, '#334155');
      } else {
        elemGrad = ctx.createRadialGradient(pos.x, pos.y + 18, 5, pos.x, pos.y + 18, 55);
        elemGrad.addColorStop(0, '#ffffff');
        elemGrad.addColorStop(0.35, elemConfig.color);
        elemGrad.addColorStop(1, '#0f172a');
      }
      ctx.fillStyle = elemGrad;
      ctx.beginPath();
      ctx.ellipse(pos.x, pos.y + 18, 62, 32, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Standing Runic Stone Totems
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(pos.x - 58, pos.y - 12, 14, 28, 4);
      ctx.roundRect(pos.x + 44, pos.y - 12, 14, 28, 4);
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Totem Elemental Icons
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(elemConfig.icon, pos.x - 51, pos.y + 6);
      ctx.fillText(elemConfig.icon, pos.x + 51, pos.y + 6);

      // Special Bone Habitat Ivory Spikes
      if (hab.type === 'habitat_bone') {
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(pos.x - 56, pos.y + 14);
        ctx.lineTo(pos.x - 66, pos.y - 20);
        ctx.lineTo(pos.x - 48, pos.y + 14);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(pos.x + 56, pos.y + 14);
        ctx.lineTo(pos.x + 66, pos.y - 20);
        ctx.lineTo(pos.x + 48, pos.y + 14);
        ctx.closePath();
        ctx.fill();
      }

      // 4. Render Dragons inside Habitat
      hab.dragons.forEach((dragon, dIdx) => {
        const dConfig = DRAGONS_DB[dragon.id] || DRAGONS_DB.dragon_fire;
        const dOffX = (dIdx - 0.5) * 52;
        const dOffY = 2 + (dIdx % 2) * 6;
        this.drawMasterDragon(pos.x + dOffX, pos.y + dOffY, dConfig, dragon.level, dIdx);
      });

      // 5. 3D Shiny Gold Bubble
      if (hab.currentGold >= 10) {
        this.drawGoldBubble(pos.x, pos.y - 48, Math.floor(hab.currentGold));
      }

      // 6. Habitat Name & Level Badge
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.beginPath();
      ctx.roundRect(pos.x - 55, pos.y + 44, 110, 20, 6);
      ctx.fill();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 10px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${habConfig.name} (Lv.${hab.level})`, pos.x, pos.y + 57);

      ctx.restore();
    });
  }

  drawMasterDragon(x, y, dConfig, level, indexOffset = 0) {
    const ctx = this.ctx;
    const stage = getEvolutionStage(level);
    const scale = stage.scale;
    const bob = Math.sin(this.animTime * 4 + indexOffset * 1.5) * 3;
    const breath = 1.0 + Math.sin(this.animTime * 3 + indexOffset) * 0.04;
    const app = dConfig.appearance;

    ctx.save();
    ctx.translate(x, y + bob);
    ctx.scale(scale * breath, scale * breath);

    const imgPath = dConfig.image;
    const img = imgPath ? this.getImage(imgPath) : null;

    if (img && img.complete && img.naturalWidth > 0) {
      // 1. Multi-layer grounded contact shadow
      ctx.save();
      const shadowGrad = ctx.createRadialGradient(0, 15, 2, 0, 15, 32);
      shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
      shadowGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0.25)');
      shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(0, 15, 32, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Deep contact shadow directly under paws
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.beginPath();
      ctx.ellipse(0, 14, 15, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Subtle ambient ground reflection matching dragon element
      const elemGlow = app.glow || '#f59e0b';
      const glowGrad = ctx.createRadialGradient(0, 14, 2, 0, 14, 24);
      glowGrad.addColorStop(0, elemGlow.includes('rgba') ? elemGlow : 'rgba(251, 191, 36, 0.22)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.ellipse(0, 14, 24, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. Divine Aura for VIP / Bone Dragons
      if (app.isBone || dConfig.rarity >= 5) {
        ctx.save();
        const auraGlow = app.glow || '#fbbf24';
        const pulse = Math.sin(this.animTime * 5 + indexOffset) * 6;
        ctx.shadowColor = auraGlow;
        ctx.shadowBlur = 18 + pulse;
        ctx.strokeStyle = auraGlow;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.ellipse(0, 14, 34 + pulse * 0.5, 11, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 3. Draw Authentic 2D Sprite with High Quality Smoothing
      const dw = 92;
      const dh = 92;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, -dw / 2, -dh + 18, dw, dh);
    } else {
      const wingFlap = Math.sin(this.animTime * 8 + indexOffset) * 0.28;
      if (app.isBone) {
        // 1. Render Tộc Rồng Xương (Golden Bone, Silver Bone, Blood Bone, Emerald Bone, Frost Bone, Dark Bone)
        this.drawSkeletalDragon(ctx, app, level, wingFlap, dConfig);
      } else if (app.isHydra) {
        // 2. Render Rồng Ba Đầu
        this.drawHydraDragon(ctx, app, level, wingFlap, dConfig);
      } else if (app.isPhoenix) {
        // 3. Render Rồng Phượng Hoàng
        this.drawPhoenixDragon(ctx, app, level, wingFlap, dConfig);
      } else if (app.isCosmic) {
      // 4. Render Rồng Tinh Tú Ngân Hà
      this.drawCosmicDragon(ctx, app, level, wingFlap, dConfig);
    } else if (app.isDemon) {
      // 5. Render Rồng Bách Quỷ
      this.drawDemonDragon(ctx, app, level, wingFlap, dConfig);
    } else if (app.isLeviathan) {
      // 6. Render Rồng Biển Sâu Leviathan
      this.drawLeviathanDragon(ctx, app, level, wingFlap, dConfig);
    } else if (app.isCyber || app.isArmored) {
      // 7. Render Rồng Cơ Khí / Thiết Giáp
      this.drawCyberDragon(ctx, app, level, wingFlap, dConfig);
      } else {
        // 8. Render Rồng Tiêu Chuẩn Nâng Cao
        this.drawEnhancedStandardDragon(ctx, app, level, wingFlap, dConfig);
      }
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

  // A. Skeletal Bone Dragon (Toàn bộ các hệ Rồng Xương Zing Me kinh điển)
  drawSkeletalDragon(ctx, app, level, wingFlap, dConfig) {
    const isGold = (app.boneType === 'GOLD');
    const isSilver = (app.boneType === 'SILVER');
    const isBlood = (app.boneType === 'BLOOD');
    const isEmerald = (app.boneType === 'EMERALD');
    const isFrost = (app.boneType === 'FROST');

    // Aura phát sáng bao quanh rồng xương
    ctx.save();
    ctx.shadowColor = app.glow || '#fbbf24';
    ctx.shadowBlur = 14;

    // 1. Skeletal Wings Back
    ctx.save();
    ctx.rotate(-wingFlap);
    ctx.strokeStyle = app.primaryColor;
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(8, -10);
    ctx.lineTo(28, -28);
    ctx.lineTo(38, -14);
    ctx.lineTo(16, -2);
    ctx.stroke();

    // Ethereal soul membrane between bones
    let membraneColor = 'rgba(251, 191, 36, 0.4)';
    if (isSilver) membraneColor = 'rgba(56, 189, 248, 0.35)';
    else if (isBlood) membraneColor = 'rgba(220, 38, 38, 0.45)';
    else if (isEmerald) membraneColor = 'rgba(16, 185, 129, 0.4)';
    else if (isFrost) membraneColor = 'rgba(186, 230, 253, 0.4)';
    else if (app.boneType === 'DARK') membraneColor = 'rgba(147, 51, 234, 0.45)';

    ctx.fillStyle = membraneColor;
    ctx.fill();
    ctx.restore();

    // 2. Skeletal Vertebrae Tail with sharp scythe blade
    ctx.strokeStyle = app.primaryColor;
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(0, 14);
    ctx.quadraticCurveTo(18, 22, 28, 16);
    ctx.stroke();

    // Tail bone scythe blade
    ctx.fillStyle = app.secondaryColor || app.primaryColor;
    ctx.beginPath();
    ctx.moveTo(28, 16);
    ctx.lineTo(38, 11);
    ctx.lineTo(33, 23);
    ctx.closePath();
    ctx.fill();

    // 3. Exposed Skeletal Ribcage
    ctx.fillStyle = '#0b0f19'; // dark chest cavity
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Inner Soul Heart Core
    const heartPulse = Math.sin(this.animTime * 6) * 3;
    let heartColor = isGold ? '#ef4444' : (isSilver ? '#06b6d4' : (isBlood ? '#f43f5e' : (isEmerald ? '#34d399' : '#38bdf8')));
    ctx.fillStyle = heartColor;
    ctx.shadowColor = heartColor;
    ctx.shadowBlur = 12 + heartPulse;
    ctx.beginPath();
    ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Rib bones
    ctx.strokeStyle = app.primaryColor;
    ctx.lineWidth = 2.6;
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
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(-6, -6);
    ctx.lineTo(-28, -26);
    ctx.lineTo(-34, -10);
    ctx.lineTo(-12, 0);
    ctx.stroke();
    ctx.fillStyle = membraneColor;
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

    // Bone Horns / Crown
    if (isGold) {
      // Golden Crown 5 Spikes
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(-10, -28);
      ctx.lineTo(-17, -46);
      ctx.lineTo(-7, -33);
      ctx.lineTo(0, -50); // Crown center spire
      ctx.lineTo(7, -33);
      ctx.lineTo(17, -46);
      ctx.lineTo(10, -28);
      ctx.closePath();
      ctx.fill();
    } else if (isBlood) {
      // Demonic Crimson Blood Spikes
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.moveTo(-5, -28);
      ctx.lineTo(-16, -46);
      ctx.lineTo(-1, -34);
      ctx.lineTo(5, -28);
      ctx.lineTo(16, -46);
      ctx.lineTo(1, -34);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.strokeStyle = app.hornColor || '#64748b';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(-5, -30);
      ctx.lineTo(-15, -44);
      ctx.moveTo(5, -30);
      ctx.lineTo(15, -44);
      ctx.stroke();
    }

    // Glowing Eye Sockets
    ctx.fillStyle = app.eyeColor;
    ctx.shadowColor = app.eyeColor;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(-4, -22, 3, 0, Math.PI * 2);
    ctx.arc(4, -22, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  // B. Hydra Three-Headed Dragon
  drawHydraDragon(ctx, app, level, wingFlap, dConfig) {
    ctx.fillStyle = app.primaryColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    const headOffsets = [
      { x: -14, y: -24, rot: -0.25 },
      { x: 0, y: -28, rot: 0 },
      { x: 14, y: -24, rot: 0.25 }
    ];

    headOffsets.forEach((h) => {
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

    ctx.fillStyle = app.primaryColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = app.bellyColor;
    ctx.beginPath();
    ctx.ellipse(-2, 3, 9, 13, 0, 0, Math.PI * 2);
    ctx.fill();

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

  // D. Cosmic Galaxy Dragon (Rồng Tinh Tú Ngân Hà)
  drawCosmicDragon(ctx, app, level, wingFlap, dConfig) {
    ctx.save();

    // Orbital Celestial Star Rings
    const orbitAngle = this.animTime * 2;
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(0, -5, 34, 14, 0.4, 0, Math.PI * 2);
    ctx.stroke();

    // Orbiting Star Particle
    const starX = Math.cos(orbitAngle) * 34;
    const starY = Math.sin(orbitAngle) * 14 - 5;
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(starX, starY, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Cosmic Wings with Galaxy Gradient
    ctx.save();
    ctx.rotate(-wingFlap);
    const gradW = ctx.createLinearGradient(0, 0, 36, -32);
    gradW.addColorStop(0, '#6366f1');
    gradW.addColorStop(0.5, '#a855f7');
    gradW.addColorStop(1, '#ec4899');
    ctx.fillStyle = gradW;
    ctx.beginPath();
    ctx.moveTo(8, -12);
    ctx.lineTo(34, -32);
    ctx.lineTo(38, -10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Body
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Starlight Belly
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.ellipse(-2, 3, 9, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#312e81';
    ctx.beginPath();
    ctx.arc(0, -22, 13, 0, Math.PI * 2);
    ctx.fill();

    // Crystal Horns
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.moveTo(-5, -32);
    ctx.lineTo(-14, -48);
    ctx.lineTo(-1, -35);
    ctx.lineTo(5, -32);
    ctx.lineTo(14, -48);
    ctx.lineTo(1, -35);
    ctx.closePath();
    ctx.fill();

    // Glowing Cyan Eyes
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(-3, -23, 3, 0, Math.PI * 2);
    ctx.arc(5, -23, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  // E. Demon Dragon (Rồng Bách Quỷ)
  drawDemonDragon(ctx, app, level, wingFlap, dConfig) {
    ctx.save();

    // Spiked Demon Bat Wings
    ctx.save();
    ctx.rotate(-wingFlap * 1.2);
    ctx.fillStyle = '#18181b';
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(8, -10);
    ctx.lineTo(36, -30);
    ctx.lineTo(26, -6);
    ctx.lineTo(38, 2);
    ctx.lineTo(14, 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Demon Body
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.ellipse(0, 0, 17, 21, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hellfire Runes on Belly
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.ellipse(-2, 4, 8, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Skull Head
    ctx.fillStyle = '#27272a';
    ctx.beginPath();
    ctx.arc(0, -22, 13, 0, Math.PI * 2);
    ctx.fill();

    // Huge Curled Hell Horns
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(-4, -30);
    ctx.quadraticCurveTo(-22, -45, -16, -55);
    ctx.moveTo(4, -30);
    ctx.quadraticCurveTo(22, -45, 16, -55);
    ctx.stroke();

    // Yellow Glowing Eyes
    ctx.fillStyle = '#facc15';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(-4, -22, 3, 0, Math.PI * 2);
    ctx.arc(4, -22, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  // F. Leviathan Sea Dragon (Rồng Biển Sâu)
  drawLeviathanDragon(ctx, app, level, wingFlap, dConfig) {
    ctx.save();

    // Oceanic Dorsal Fins
    ctx.save();
    ctx.rotate(-wingFlap * 0.7);
    ctx.fillStyle = 'rgba(6, 182, 212, 0.75)';
    ctx.beginPath();
    ctx.moveTo(8, -8);
    ctx.quadraticCurveTo(34, -28, 26, 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Serpentine Body
    ctx.fillStyle = app.primaryColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Coral Belly
    ctx.fillStyle = app.bellyColor;
    ctx.beginPath();
    ctx.ellipse(-2, 3, 9, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = app.secondaryColor;
    ctx.beginPath();
    ctx.arc(0, -22, 13, 0, Math.PI * 2);
    ctx.fill();

    // Coral Horns
    ctx.fillStyle = app.hornColor;
    ctx.beginPath();
    ctx.moveTo(-5, -32);
    ctx.lineTo(-12, -44);
    ctx.lineTo(-2, -34);
    ctx.lineTo(5, -32);
    ctx.lineTo(12, -44);
    ctx.lineTo(2, -34);
    ctx.closePath();
    ctx.fill();

    // Green Jade Eyes
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.arc(-3, -23, 3, 0, Math.PI * 2);
    ctx.arc(5, -23, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // G. Cyber Mecha Dragon (Rồng Cơ Khí Laser)
  drawCyberDragon(ctx, app, level, wingFlap, dConfig) {
    ctx.save();

    // Titanium Wing Plates
    ctx.save();
    ctx.rotate(-wingFlap);
    ctx.fillStyle = '#334155';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(8, -10);
    ctx.lineTo(34, -30);
    ctx.lineTo(28, -6);
    ctx.lineTo(14, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Armored Angular Body
    ctx.fillStyle = app.primaryColor;
    ctx.beginPath();
    ctx.roundRect(-15, -16, 30, 32, 6);
    ctx.fill();

    // Arc Reactor Core on Chest
    const pulse = Math.sin(this.animTime * 8) * 2;
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10 + pulse;
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Angular Head
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(-11, -32, 22, 18, 4);
    ctx.fill();

    // Laser Visor Slit
    ctx.fillStyle = '#22c55e';
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 8;
    ctx.fillRect(-8, -25, 16, 4);
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  // H. Standard Enhanced Dragon
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
    const bob = Math.sin(this.animTime * 4) * 5;
    ctx.save();
    ctx.translate(x, y + bob);

    // Outer golden glow
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 16;
    // 3D Coin Badge
    const goldGrad = ctx.createLinearGradient(0, -15, 0, 15);
    goldGrad.addColorStop(0, '#fef08a');
    goldGrad.addColorStop(0.4, '#f59e0b');
    goldGrad.addColorStop(1, '#b45309');
    ctx.fillStyle = goldGrad;
    ctx.beginPath();
    ctx.roundRect(-34, -15, 68, 30, 15);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Inner gold coin icon & number
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 12px Plus Jakarta Sans';
    ctx.textAlign = 'center';
    ctx.fillText(`💰 +${goldAmount}`, 0, 5);
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

  // --- Static Universal Dragon Avatar Renderer for UI Modals / Cards / Arena ---
  static renderDragonToCanvas(canvas, dConfig, level = 1, options = {}) {
    if (!canvas || !dConfig) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.max(window.devicePixelRatio || 1, 2);
    const cssW = canvas.clientWidth > 0 ? canvas.clientWidth : (canvas.width || 92);
    const cssH = canvas.clientHeight > 0 ? canvas.clientHeight : (canvas.height || 82);
    const targetW = Math.round(cssW * dpr);
    const targetH = Math.round(cssH * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    const anim = (options && typeof options.animTime === 'number') ? options.animTime : 0;
    const pulse = anim ? Math.sin(anim * 4) * 2.5 : 0;

    // Prefer thumbnail for card previews (<= 160px) to prevent downsampling pixelation
    let imgSrc = dConfig.image;
    if (cssW <= 160 && imgSrc && imgSrc.includes('assets/dragons/')) {
      imgSrc = imgSrc.replace('assets/dragons/', 'assets/dragons/thumbs/');
    }

    if (!DragonCanvasRenderer._staticImgCache) {
      DragonCanvasRenderer._staticImgCache = {};
    }

    const draw = (imageToDraw) => {
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.clearRect(0, 0, cssW, cssH);

      // Multi-layer grounded contact shadow
      const grad = ctx.createRadialGradient(cssW / 2, cssH * 0.84, 2, cssW / 2, cssH * 0.84, cssW * 0.38);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.22)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cssW / 2, cssH * 0.84, cssW * 0.38, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Deep contact shadow directly under paws
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.ellipse(cssW / 2, cssH * 0.84, cssW * 0.20, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Aura for VIP / Bone Dragons
      if (dConfig.rarity >= 5 || dConfig.appearance?.isBone) {
        ctx.save();
        const glow = dConfig.appearance?.glow || '#fbbf24';
        ctx.shadowColor = glow;
        ctx.shadowBlur = 12 + pulse * 1.2;
        ctx.strokeStyle = glow;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.ellipse(cssW / 2, cssH * 0.83, cssW * 0.36 + pulse * 0.4, 8.5, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      if (imageToDraw && imageToDraw.naturalWidth > 0) {
        const pad = 6;
        const size = Math.min(cssW, cssH) - pad * 2 + pulse;
        const ox = (cssW - size) / 2;
        const oy = (cssH - size) / 2 - 2 - pulse * 0.5;
        ctx.drawImage(imageToDraw, ox, oy, size, size);
      }
      ctx.restore();
    };

    if (imgSrc) {
      const resolved = window.PGAME_CONFIG?.resolveMedia ? window.PGAME_CONFIG.resolveMedia(imgSrc) : imgSrc;
      let img = DragonCanvasRenderer._staticImgCache[resolved] || DragonCanvasRenderer._staticImgCache[imgSrc];
      if (!img) {
        img = new Image();
        img.src = resolved;
        DragonCanvasRenderer._staticImgCache[imgSrc] = img;
        DragonCanvasRenderer._staticImgCache[resolved] = img;
      }

      if (img.complete && img.naturalWidth > 0) {
        draw(img);
      } else {
        img.onload = () => draw(img);
      }
    } else {
      draw(null);
    }
  }
}

window.DragonCanvasRenderer = DragonCanvasRenderer;
