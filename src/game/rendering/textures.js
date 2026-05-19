import * as THREE from "three";

function makeCanvasTexture(canvas, { repeat = [1, 1], colorSpace = THREE.SRGBColorSpace } = {}) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat[0], repeat[1]);
  if (colorSpace) texture.colorSpace = colorSpace;
  return texture;
}

function createCanvas(size = 256, fillStyle = null) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fillRect(0, 0, size, size);
  }
  return { canvas, ctx, size };
}

export function makeGroundTexture() {
  const { canvas, ctx } = createCanvas(512, "#173d25");
  for (let i = 0; i < 1600; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? "rgba(120,230,130,0.12)" : "rgba(18,65,34,0.24)";
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 1 + Math.random() * 4, 1 + Math.random() * 4);
  }
  return makeCanvasTexture(canvas, { repeat: [3, 42] });
}

export function makePathTexture() {
  const { canvas, ctx } = createCanvas(256, "#b87938");
  for (let i = 0; i < 700; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? "rgba(255,218,145,0.16)" : "rgba(72,42,22,0.12)";
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 1 + Math.random() * 3, 1 + Math.random() * 3);
  }
  return makeCanvasTexture(canvas, { repeat: [1.15, 1.8] });
}

export function makePathCrackTexture() {
  const { canvas, ctx, size } = createCanvas(256, "#b87938");
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, "rgba(255,213,137,0.16)");
  gradient.addColorStop(0.55, "rgba(147,84,41,0.12)");
  gradient.addColorStop(1, "rgba(63,37,20,0.16)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 520; i += 1) {
    ctx.fillStyle = i % 2 === 0 ? "rgba(255,224,161,0.14)" : "rgba(76,43,22,0.18)";
    ctx.fillRect((i * 37) % size, (i * 61) % size, 1 + (i % 4), 1 + ((i * 3) % 3));
  }

  for (let i = 0; i < 18; i += 1) {
    const startX = (i * 47 + 19) % size;
    const startY = (i * 83 + 11) % size;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    for (let step = 0; step < 5; step += 1) {
      const x = startX + (step + 1) * (9 + (i % 5)) * (i % 2 === 0 ? 1 : -1) + Math.sin(i + step) * 8;
      const y = startY + (step + 1) * (6 + ((i + step) % 4)) + Math.cos(i * 0.7 + step) * 7;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(51,29,16,0.36)";
    ctx.lineWidth = 1.2 + (i % 3) * 0.5;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,222,157,0.12)";
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }

  return makeCanvasTexture(canvas, { repeat: [1.3, 2.1] });
}

export function makeStoneBlockTexture() {
  const { canvas, ctx, size } = createCanvas(256, "#787965");
  const block = 64;
  for (let y = 0; y < size; y += block) {
    for (let x = 0; x < size; x += block) {
      const offset = (y / block) % 2 === 0 ? 0 : block * 0.45;
      const shade = 92 + ((x + y) / block) % 4 * 10;
      ctx.fillStyle = `rgb(${shade}, ${shade + 5}, ${shade - 6})`;
      ctx.fillRect((x + offset) % size, y, block - 3, block - 3);
      ctx.fillStyle = "rgba(255,238,180,0.11)";
      ctx.fillRect((x + offset + 4) % size, y + 4, block - 14, 3);
      ctx.fillStyle = "rgba(34,34,28,0.24)";
      ctx.fillRect((x + offset) % size, y + block - 5, block - 4, 2);
    }
  }
  ctx.strokeStyle = "rgba(43,46,38,0.42)";
  ctx.lineWidth = 2;
  for (let y = 0; y <= size; y += block) {
    ctx.beginPath();
    ctx.moveTo(0, y + Math.sin(y) * 2);
    ctx.lineTo(size, y + Math.cos(y) * 2);
    ctx.stroke();
  }
  for (let x = 0; x <= size; x += block) {
    ctx.beginPath();
    ctx.moveTo(x + Math.sin(x) * 2, 0);
    ctx.lineTo(x + Math.cos(x) * 2, size);
    ctx.stroke();
  }
  for (let i = 0; i < 360; i += 1) {
    ctx.fillStyle = i % 3 === 0 ? "rgba(31,34,29,0.18)" : "rgba(218,207,159,0.12)";
    ctx.fillRect((i * 41) % size, (i * 67) % size, 1 + (i % 4), 1 + ((i + 2) % 4));
  }
  return makeCanvasTexture(canvas, { repeat: [1.2, 1.2] });
}

export function makePathCrackNormalMap() {
  const { canvas, ctx, size } = createCanvas(256, "#8080ff");

  for (let i = 0; i < 420; i += 1) {
    const x = (i * 37) % size;
    const y = (i * 61) % size;
    ctx.fillStyle = i % 2 === 0 ? "rgba(150,155,255,0.16)" : "rgba(91,86,210,0.12)";
    ctx.fillRect(x, y, 1 + (i % 3), 1 + ((i * 3) % 3));
  }

  for (let i = 0; i < 18; i += 1) {
    const startX = (i * 47 + 19) % size;
    const startY = (i * 83 + 11) % size;
    const points = [[startX, startY]];
    for (let step = 0; step < 5; step += 1) {
      points.push([
        startX + (step + 1) * (9 + (i % 5)) * (i % 2 === 0 ? 1 : -1) + Math.sin(i + step) * 8,
        startY + (step + 1) * (6 + ((i + step) % 4)) + Math.cos(i * 0.7 + step) * 7,
      ]);
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    points.forEach(([x, y], index) => (index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    ctx.strokeStyle = "rgba(58,48,184,0.5)";
    ctx.lineWidth = 1.4 + (i % 3) * 0.45;
    ctx.stroke();

    ctx.beginPath();
    points.forEach(([x, y], index) => {
      const lift = index % 2 === 0 ? -1.4 : 1.4;
      return index === 0 ? ctx.moveTo(x + lift, y - lift) : ctx.lineTo(x + lift, y - lift);
    });
    ctx.strokeStyle = "rgba(178,185,255,0.24)";
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  return makeCanvasTexture(canvas, { repeat: [1.3, 2.1], colorSpace: null });
}

export function makeStoneBlockNormalMap() {
  const { canvas, ctx, size } = createCanvas(256, "#8080ff");
  const block = 64;

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (let y = 0; y <= size; y += block) {
    ctx.beginPath();
    ctx.moveTo(0, y + Math.sin(y) * 2);
    ctx.lineTo(size, y + Math.cos(y) * 2);
    ctx.strokeStyle = "rgba(57,50,181,0.42)";
    ctx.lineWidth = 2.1;
    ctx.stroke();
    ctx.strokeStyle = "rgba(174,181,255,0.22)";
    ctx.lineWidth = 0.9;
    ctx.stroke();
  }

  for (let x = 0; x <= size; x += block) {
    ctx.beginPath();
    ctx.moveTo(x + Math.sin(x) * 2, 0);
    ctx.lineTo(x + Math.cos(x) * 2, size);
    ctx.strokeStyle = "rgba(61,52,186,0.36)";
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.strokeStyle = "rgba(166,174,255,0.2)";
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  for (let i = 0; i < 300; i += 1) {
    const x = (i * 41) % size;
    const y = (i * 67) % size;
    ctx.fillStyle = i % 3 === 0 ? "rgba(68,58,190,0.16)" : "rgba(162,169,255,0.14)";
    ctx.fillRect(x, y, 1 + (i % 3), 1 + ((i + 2) % 3));
  }

  return makeCanvasTexture(canvas, { repeat: [1.2, 1.2], colorSpace: null });
}

export function makeMossTexture() {
  const { canvas, ctx, size } = createCanvas(256, "#2e6f31");
  const gradient = ctx.createRadialGradient(size * 0.36, size * 0.32, 12, size * 0.5, size * 0.5, size * 0.75);
  gradient.addColorStop(0, "#78d85d");
  gradient.addColorStop(0.52, "#3f8d35");
  gradient.addColorStop(1, "#1c4d25");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 1200; i += 1) {
    const x = (i * 53) % size;
    const y = (i * 97) % size;
    ctx.fillStyle = i % 4 === 0 ? "rgba(189,255,126,0.24)" : "rgba(13,55,24,0.22)";
    ctx.beginPath();
    ctx.ellipse(x, y, 0.8 + (i % 5) * 0.35, 1.2 + (i % 7) * 0.42, i * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  return makeCanvasTexture(canvas, { repeat: [1.6, 1.6] });
}

export function makeLeafVeinTexture() {
  const { canvas, ctx, size } = createCanvas(256, "#2aa653");
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, "#52d267");
  gradient.addColorStop(0.55, "#258f49");
  gradient.addColorStop(1, "#125b32");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = "rgba(202,255,157,0.5)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(size * 0.5, size * 0.02);
  ctx.bezierCurveTo(size * 0.56, size * 0.28, size * 0.44, size * 0.68, size * 0.5, size * 0.98);
  ctx.stroke();

  for (let i = 0; i < 15; i += 1) {
    const y = 22 + i * 15;
    const side = i % 2 === 0 ? -1 : 1;
    [-1, 1].forEach((branchSide) => {
      ctx.beginPath();
      ctx.moveTo(size * 0.5, y);
      ctx.bezierCurveTo(size * 0.5 + branchSide * 20, y + 8, size * 0.5 + branchSide * (52 + i), y + side * 4 + 16, size * 0.5 + branchSide * (98 - i * 2), y + 30);
      ctx.strokeStyle = "rgba(218,255,170,0.28)";
      ctx.lineWidth = 1.6;
      ctx.stroke();
    });
  }

  for (let i = 0; i < 300; i += 1) {
    ctx.fillStyle = i % 3 === 0 ? "rgba(177,255,131,0.12)" : "rgba(12,72,35,0.14)";
    ctx.fillRect((i * 71) % size, (i * 43) % size, 1 + (i % 3), 1 + ((i + 1) % 3));
  }
  return makeCanvasTexture(canvas, { repeat: [1, 1] });
}

export function makeElephantSkinHighlightTexture() {
  const { canvas, ctx, size } = createCanvas(256, "#ff60bd");
  const gradient = ctx.createRadialGradient(size * 0.36, size * 0.18, 10, size * 0.48, size * 0.44, size * 0.78);
  gradient.addColorStop(0, "#ffc2e7");
  gradient.addColorStop(0.35, "#ff7acb");
  gradient.addColorStop(1, "#d33b91");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 48; i += 1) {
    ctx.beginPath();
    const y = (i * 23) % size;
    ctx.moveTo(-12, y);
    ctx.bezierCurveTo(size * 0.22, y + Math.sin(i) * 12, size * 0.72, y - Math.cos(i) * 14, size + 12, y + Math.sin(i * 0.4) * 9);
    ctx.strokeStyle = i % 3 === 0 ? "rgba(255,240,252,0.18)" : "rgba(129,16,78,0.13)";
    ctx.lineWidth = 1.1;
    ctx.stroke();
  }
  return makeCanvasTexture(canvas, { repeat: [1.4, 1.4] });
}

export function makeCollectibleGlowTexture() {
  const { canvas, ctx, size } = createCanvas(256);
  ctx.clearRect(0, 0, size, size);
  const gradient = ctx.createRadialGradient(size * 0.5, size * 0.5, 4, size * 0.5, size * 0.5, size * 0.48);
  gradient.addColorStop(0, "rgba(255,255,210,1)");
  gradient.addColorStop(0.28, "rgba(255,213,74,0.86)");
  gradient.addColorStop(0.62, "rgba(255,137,36,0.34)");
  gradient.addColorStop(1, "rgba(255,137,36,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 12; i += 1) {
    ctx.save();
    ctx.translate(size * 0.5, size * 0.5);
    ctx.rotate((Math.PI * 2 * i) / 12);
    ctx.fillStyle = "rgba(255,245,157,0.16)";
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.28, 5, size * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  return makeCanvasTexture(canvas, { repeat: [1, 1] });
}

export function makeWaterRippleTexture() {
  const { canvas, ctx } = createCanvas(512);
  const gradient = ctx.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0, "#0f5f91");
  gradient.addColorStop(0.45, "#1a91c8");
  gradient.addColorStop(1, "#0b4d78");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  for (let y = -32; y < 560; y += 24) {
    const waveOffset = Math.sin(y * 0.035) * 32;
    ctx.beginPath();
    for (let x = -24; x <= 536; x += 16) {
      const py = y + Math.sin((x + y) * 0.045) * 7;
      if (x === -24) ctx.moveTo(x, py);
      else ctx.lineTo(x + waveOffset, py);
    }
    ctx.strokeStyle = "rgba(181,241,255,0.28)";
    ctx.lineWidth = 2 + ((y / 24) % 3);
    ctx.stroke();
  }

  for (let i = 0; i < 120; i++) {
    const x = (i * 73) % 512;
    const y = (i * 131) % 512;
    const radius = 10 + (i % 9) * 2.5;
    ctx.beginPath();
    ctx.ellipse(x, y, radius, 2.5 + (i % 4), (i % 7) * 0.26, 0, Math.PI * 2);
    ctx.strokeStyle = i % 3 === 0 ? "rgba(255,255,255,0.24)" : "rgba(80,205,235,0.20)";
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  return makeCanvasTexture(canvas, { repeat: [1.8, 2.8] });
}

export function makeFoamStreakTexture() {
  const { canvas, ctx } = createCanvas(256);
  ctx.clearRect(0, 0, 256, 256);

  for (let i = 0; i < 54; i++) {
    const x = -32 + ((i * 47) % 320);
    const y = 10 + ((i * 29) % 236);
    const length = 28 + (i % 6) * 11;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + length * 0.35, y - 5 - (i % 4), x + length * 0.65, y + 6 + (i % 5), x + length, y + Math.sin(i) * 5);
    ctx.strokeStyle = i % 4 === 0 ? "rgba(255,255,255,0.72)" : "rgba(221,250,255,0.48)";
    ctx.lineWidth = 1.5 + (i % 3) * 0.7;
    ctx.lineCap = "round";
    ctx.stroke();
  }

  for (let i = 0; i < 90; i++) {
    ctx.fillStyle = i % 3 === 0 ? "rgba(255,255,255,0.55)" : "rgba(217,249,255,0.35)";
    ctx.beginPath();
    ctx.arc((i * 61) % 256, (i * 97) % 256, 0.7 + (i % 4) * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  return makeCanvasTexture(canvas, { repeat: [2.2, 1] });
}

export function createSceneTextures() {
  return {
    ground: makeGroundTexture(),
    pathCracks: makePathCrackTexture(),
    pathCrackNormal: makePathCrackNormalMap(),
    stoneBlocks: makeStoneBlockTexture(),
    stoneBlockNormal: makeStoneBlockNormalMap(),
    moss: makeMossTexture(),
    leafVeins: makeLeafVeinTexture(),
    elephantSkin: makeElephantSkinHighlightTexture(),
    collectibleGlow: makeCollectibleGlowTexture(),
    waterRipples: makeWaterRippleTexture(),
    foam: makeFoamStreakTexture(),
  };
}
