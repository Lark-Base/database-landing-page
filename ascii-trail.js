// 时间以毫秒输入，流体积分使用秒；保留原有效果参数。
const MS_PER_SECOND = 1000;
const MAX_FLUID_STEP_SECONDS = 0.1;
const MAX_DEVICE_PIXEL_RATIO = 2;
const FALLBACK_CHAR_WIDTH = 14;
const FONT_PROBE_SIZE = 100;
const FONT_FALLBACK_ASCENT_RATIO = 0.8;
const FONT_FALLBACK_DESCENT_RATIO = 0.2;
const FONT_FALLBACK_WIDTH_RATIO = 0.6;
const GLYPH_WIDTH_FILL_RATIO = 0.92;
const SPLASH_BASE_SPEED = 240;
const SPLASH_FORCE_MULTIPLIER = 20;
const REFERENCE_FRAME_MS = 16.67;
const MIN_FRAME_SCALE = 0.5;
const MAX_FRAME_SCALE = 2;
const MIN_POINTER_STEP_SECONDS = 0.001;
const MAX_POINTER_STEP_SECONDS = 0.05;
const DEFAULT_POINTER_STEP_SECONDS = 0.016;
const SPLASH_SEED_RANGE = 1000;
const MIN_SPLASH_THICKNESS_PX = 8;
const MAX_SPLASH_THICKNESS_PX = 80;
const SPLASH_THICKNESS_RADIUS_RATIO = 0.08;

/**
 * ASCII trail overlay
 * ------------------------------------------------------------------
 * 把一张位图实时降采样成字符画，并叠加一层 2D 不可压缩流体（Navier-Stokes）
 * 作为交互层：指针移动注入速度与密度，点击产生环形喷溅，流体密度再反过来
 * 调制每个字符的亮度，形成"字符被搅动"的拖尾效果。
 *
 * 算法与默认参数从原页面构建产物中还原，保持一致。
 */

/* ---------- 基础数学工具 ---------- */

const saturate = (v) => Math.min(1, Math.max(0, v));
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const idx = (x, y, w) => x + y * w;
const smoothstep = (v) => {
  const t = v < 0 ? 0 : v > 1 ? 1 : v;
  return t * t * (3 - 2 * t);
};

/** 双线性采样 */
function sampleBilinear(field, x, y, w, h) {
  const px = clamp(x, 0, w - 1);
  const py = clamp(y, 0, h - 1);
  const x0 = Math.floor(px);
  const y0 = Math.floor(py);
  const x1 = Math.min(w - 1, x0 + 1);
  const y1 = Math.min(h - 1, y0 + 1);
  const fx = px - x0;
  const fy = py - y0;
  const a = field[idx(x0, y0, w)];
  const b = field[idx(x1, y0, w)];
  const c = field[idx(x0, y1, w)];
  const d = field[idx(x1, y1, w)];
  const top = a + (b - a) * fx;
  const bottom = c + (d - c) * fx;
  return top + (bottom - top) * fy;
}

/* ---------- 流体求解器 ---------- */

/** 半拉格朗日平流 */
function advect(dst, src, velX, velY, dt, w, h) {
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const i = idx(x, y, w);
      dst[i] = sampleBilinear(src, x - velX[i] * dt, y - velY[i] * dt, w, h);
    }
  }
}

/** Gauss-Seidel 扩散 */
function diffuse(dst, src, amount, iterations, w, h) {
  if (iterations <= 0 || amount <= 0) {
    dst.set(src);
    return;
  }
  dst.set(src);
  const inv = 1 / (1 + 4 * amount);
  for (let k = 0; k < iterations; k += 1) {
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        const i = idx(x, y, w);
        const l = dst[idx(Math.max(0, x - 1), y, w)];
        const r = dst[idx(Math.min(w - 1, x + 1), y, w)];
        const u = dst[idx(x, Math.max(0, y - 1), w)];
        const d = dst[idx(x, Math.min(h - 1, y + 1), w)];
        dst[i] = (src[i] + amount * (l + r + u + d)) * inv;
      }
    }
  }
}

/** 投影：扣掉压力梯度，使速度场无散度 */
function project(velX, velY, pressure, divergence, iterations, w, h) {
  if (iterations <= 0) {
    return;
  }

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const i = idx(x, y, w);
      const l = velX[idx(Math.max(0, x - 1), y, w)];
      const r = velX[idx(Math.min(w - 1, x + 1), y, w)];
      const u = velY[idx(x, Math.max(0, y - 1), w)];
      const d = velY[idx(x, Math.min(h - 1, y + 1), w)];
      divergence[i] = -0.5 * (r - l + d - u);
      pressure[i] = 0;
    }
  }

  for (let k = 0; k < iterations; k += 1) {
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        const i = idx(x, y, w);
        const l = pressure[idx(Math.max(0, x - 1), y, w)];
        const r = pressure[idx(Math.min(w - 1, x + 1), y, w)];
        const u = pressure[idx(x, Math.max(0, y - 1), w)];
        const d = pressure[idx(x, Math.min(h - 1, y + 1), w)];
        pressure[i] = (divergence[i] + l + r + u + d) / 4;
      }
    }
  }

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const i = idx(x, y, w);
      const l = pressure[idx(Math.max(0, x - 1), y, w)];
      const r = pressure[idx(Math.min(w - 1, x + 1), y, w)];
      const u = pressure[idx(x, Math.max(0, y - 1), w)];
      const d = pressure[idx(x, Math.min(h - 1, y + 1), w)];
      velX[i] -= 0.5 * (r - l);
      velY[i] -= 0.5 * (d - u);
    }
  }
}

/** 推进一步流体 */
function stepFluid(sim, dt, cfg) {
  if (dt <= 0) {
    return;
  }
  const step = Math.min(dt, MAX_FLUID_STEP_SECONDS);
  const {
    velX,
    velY,
    velX0,
    velY0,
    density,
    density0,
    pressure,
    divergence,
    width: w,
    height: h,
    size,
  } = sim;

  velX0.set(velX);
  velY0.set(velY);
  diffuse(velX, velX0, cfg.diffusion, cfg.iterations, w, h);
  diffuse(velY, velY0, cfg.diffusion, cfg.iterations, w, h);
  if (cfg.project) {
    project(velX, velY, pressure, divergence, cfg.projectIterations, w, h);
  }

  velX0.set(velX);
  velY0.set(velY);
  advect(velX, velX0, velX0, velY0, step, w, h);
  advect(velY, velY0, velX0, velY0, step, w, h);
  if (cfg.project) {
    project(velX, velY, pressure, divergence, cfg.projectIterations, w, h);
  }

  density0.set(density);
  advect(density, density0, velX, velY, step, w, h);

  if (cfg.velocityDissipation > 0) {
    const decay = Math.exp(-cfg.velocityDissipation * step);
    for (let i = 0; i < size; i += 1) {
      velX[i] *= decay;
      velY[i] *= decay;
    }
  }
  if (cfg.densityDissipation > 0) {
    const decay = Math.exp(-cfg.densityDissipation * step);
    for (let i = 0; i < size; i += 1) {
      density[i] *= decay;
    }
  }
}

/** 指针移动：在半径内注入速度与密度 */
function splatPointer(sim, x, y, forceX, forceY, densityAmount, radius) {
  if (radius <= 0 || densityAmount <= 0) {
    return;
  }
  const { width: w, height: h, velX, velY, density } = sim;
  const r2 = radius * radius;
  const x0 = Math.max(0, Math.floor(x - radius));
  const x1 = Math.min(w - 1, Math.ceil(x + radius));
  const y0 = Math.max(0, Math.floor(y - radius));
  const y1 = Math.min(h - 1, Math.ceil(y + radius));

  for (let py = y0; py <= y1; py += 1) {
    const dy = py - y;
    const dy2 = dy * dy;
    if (dy2 > r2) {
      continue;
    }
    for (let px = x0; px <= x1; px += 1) {
      const dx = px - x;
      const dist2 = dx * dx + dy2;
      if (dist2 > r2) {
        continue;
      }
      const falloff = smoothstep(1 - Math.sqrt(dist2) / radius);
      const i = idx(px, py, w);
      velX[i] += forceX * falloff;
      velY[i] += forceY * falloff;
      density[i] = saturate(density[i] + densityAmount * falloff);
    }
  }
}

/** 点击喷溅：沿环形波面注入径向力，环半径随时间外扩 */
function splatRing(sim, cx, cy, force, densityAmount, radius, thickness, randomness, seed, scaleX, scaleY) {
  if (radius <= 0 || thickness <= 0) {
    return;
  }
  if (force <= 0 && densityAmount <= 0) {
    return;
  }
  if (scaleX <= 0 || scaleY <= 0) {
    return;
  }

  const { width: w, height: h, velX, velY, density } = sim;
  const reach = radius + thickness;
  const spanX = reach / scaleX;
  const spanY = reach / scaleY;
  const x0 = Math.max(0, Math.floor(cx - spanX));
  const x1 = Math.min(w - 1, Math.ceil(cx + spanX));
  const y0 = Math.max(0, Math.floor(cy - spanY));
  const y1 = Math.min(h - 1, Math.ceil(cy + spanY));
  const rand = clamp(randomness, 0, 1);

  for (let py = y0; py <= y1; py += 1) {
    const dy = (py - cy) * scaleY;
    for (let px = x0; px <= x1; px += 1) {
      const dx = (px - cx) * scaleX;
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      // 角向噪声：让波面不是完美圆形
      const wobble =
        0.5 * Math.sin(6 * angle + seed) + 0.25 * Math.sin(3 * angle + 0.05 * dist + 0.3 * seed) + 0.5;
      const wobbleAmount = 0.35 + 0.65 * randomness;
      const ringDist = Math.abs(dist - radius * clamp(1 + rand * (2 * wobble - 1) * wobbleAmount, 0.6, 1.6));
      if (ringDist > thickness) {
        continue;
      }

      const falloff = smoothstep(1 - ringDist / thickness);
      const i = idx(px, py, w);
      const modulation = clamp(1 + rand * (2 * wobble - 1) * wobbleAmount, 0.4, 2.2);
      const f = force * modulation;
      const dens = densityAmount * modulation;

      if (f !== 0 && dist > 0) {
        const invDist = 1 / dist;
        velX[i] += dx * invDist * f * falloff;
        velY[i] += dy * invDist * f * falloff;
      }
      if (dens > 0) {
        density[i] = saturate(density[i] + dens * falloff);
      }
    }
  }
}

/* ---------- 字符图集 ---------- */

const MONO_FONT = 'SF Mono, Consolas, Liberation Mono, ui-monospace, monospace';
const DEFAULT_ASPECT = 5 / 3;

function measureGlyph(metrics, fontSize) {
  const hasLeft = Number.isFinite(metrics.actualBoundingBoxLeft);
  const hasRight = Number.isFinite(metrics.actualBoundingBoxRight);
  const left = hasLeft ? metrics.actualBoundingBoxLeft : 0;
  const right = hasRight ? metrics.actualBoundingBoxRight : metrics.width;
  let width = hasLeft && hasRight ? left + right : metrics.width || right;
  if (width === 0 && metrics.width) {
    width = metrics.width;
  }
  return {
    width,
    left,
    ascent: Number.isFinite(metrics.actualBoundingBoxAscent)
      ? metrics.actualBoundingBoxAscent
      : fontSize * FONT_FALLBACK_ASCENT_RATIO,
    descent: Number.isFinite(metrics.actualBoundingBoxDescent)
      ? metrics.actualBoundingBoxDescent
      : fontSize * FONT_FALLBACK_DESCENT_RATIO,
  };
}

/** 把字符集预渲染成一张横向排列的图集，绘制时按 index 取图块 */
function buildAtlas(atlasCanvas, atlasCtx, layout, charset, fill) {
  if (!layout.tileW || !layout.tileH || charset.length === 0) {
    return false;
  }

  atlasCanvas.width = layout.tileW * charset.length;
  atlasCanvas.height = layout.tileH;
  atlasCtx.clearRect(0, 0, atlasCanvas.width, atlasCanvas.height);
  atlasCtx.imageSmoothingEnabled = false;

  const base = layout.tileH;
  atlasCtx.font = `${base}px ${MONO_FONT}`;

  const pad = Math.min(1, Math.floor(Math.min(layout.tileW, layout.tileH) / 2));
  const innerW = Math.max(1, layout.tileW - 2 * pad);
  const innerH = Math.max(1, layout.tileH - 2 * pad);

  // 先按 base 字号量一遍，求出需要的缩放
  let maxW = 0;
  let maxAscent = 0;
  let maxDescent = 0;
  for (let i = 0; i < charset.length; i += 1) {
    const g = measureGlyph(atlasCtx.measureText(charset[i]), base);
    if (g.width > maxW) {
      maxW = g.width;
    }
    if (g.ascent > maxAscent) {
      maxAscent = g.ascent;
    }
    if (g.descent > maxDescent) {
      maxDescent = g.descent;
    }
  }
  const totalH = maxAscent + maxDescent;
  const scaleW = maxW > 0 ? (GLYPH_WIDTH_FILL_RATIO * innerW) / maxW : 1;
  const scaleH = totalH > 0 ? innerH / totalH : 1;
  const scale = Number.isFinite(scaleW) && Number.isFinite(scaleH) ? Math.min(scaleW, scaleH) : 1;
  const fontSize = Number.isFinite(scale) && scale > 0 ? base * scale : base;

  atlasCtx.font = `${fontSize}px ${MONO_FONT}`;
  atlasCtx.fillStyle = fill;
  atlasCtx.textAlign = 'left';
  atlasCtx.textBaseline = 'alphabetic';

  const glyphs = new Array(charset.length);
  let ascent = 0;
  let descent = 0;
  for (let i = 0; i < charset.length; i += 1) {
    const g = measureGlyph(atlasCtx.measureText(charset[i]), fontSize);
    glyphs[i] = g;
    if (g.ascent > ascent) {
      ascent = g.ascent;
    }
    if (g.descent > descent) {
      descent = g.descent;
    }
  }

  const baseline = Math.max(pad, Math.floor(pad + innerH - descent));
  for (let i = 0; i < charset.length; i += 1) {
    const g = glyphs[i];
    const x = Math.round(i * layout.tileW + pad + (innerW - g.width) / 2 + g.left);
    atlasCtx.fillText(charset[i], x, baseline);
  }
  return true;
}

/* ---------- 单元格尺寸 ---------- */

function computeCellMetrics({ fontSize, charWidth, cellAspectRatio = DEFAULT_ASPECT, cellPadding }) {
  const size = Number.isFinite(fontSize)
    ? fontSize
    : Number.isFinite(charWidth)
      ? charWidth * cellAspectRatio
      : FALLBACK_CHAR_WIDTH * cellAspectRatio;
  const glyphH = Math.max(1, size);
  const glyphW = Math.max(
    1,
    Number.isFinite(size / cellAspectRatio) ? size / cellAspectRatio : FALLBACK_CHAR_WIDTH,
  );

  let padX = 0;
  let padY = 0;
  if (typeof cellPadding === 'number') {
    padX = padY = Math.max(0, Number.isFinite(cellPadding) ? cellPadding : 0);
  } else if (cellPadding) {
    padX = Math.max(0, Number.isFinite(cellPadding.x) ? cellPadding.x : 0);
    padY = Math.max(0, Number.isFinite(cellPadding.y) ? cellPadding.y : 0);
  }

  return {
    glyphWidth: glyphW,
    glyphHeight: glyphH,
    cellWidth: Math.max(1, glyphW + 2 * padX),
    cellHeight: Math.max(1, glyphH + 2 * padY),
    drawCellWidth: glyphW,
    drawCellHeight: glyphH,
    padX,
    padY,
  };
}

/** object-fit / object-position 换算成 drawImage 的源与目标矩形 */
function computeFitRect({ sourceWidth, sourceHeight, destWidth, destHeight, fit, position }) {
  if (!sourceWidth || !sourceHeight || !destWidth || !destHeight) {
    return null;
  }
  const mode = fit || 'cover';
  const px = saturate(position.x);
  const py = saturate(position.y);

  if (mode === 'contain') {
    const s = Math.min(destWidth / sourceWidth, destHeight / sourceHeight);
    const dw = sourceWidth * s;
    const dh = sourceHeight * s;
    return {
      sx: 0,
      sy: 0,
      sw: sourceWidth,
      sh: sourceHeight,
      dx: (destWidth - dw) * px,
      dy: (destHeight - dh) * py,
      dw,
      dh,
    };
  }
  if (mode === 'fill') {
    return { sx: 0, sy: 0, sw: sourceWidth, sh: sourceHeight, dx: 0, dy: 0, dw: destWidth, dh: destHeight };
  }
  if (mode === 'none') {
    return {
      sx: 0,
      sy: 0,
      sw: sourceWidth,
      sh: sourceHeight,
      dx: (destWidth - sourceWidth) * px,
      dy: (destHeight - sourceHeight) * py,
      dw: sourceWidth,
      dh: sourceHeight,
    };
  }
  // cover
  const s = Math.max(destWidth / sourceWidth, destHeight / sourceHeight);
  const sw = destWidth / s;
  const sh = destHeight / s;
  return {
    sx: (sourceWidth - sw) * px,
    sy: (sourceHeight - sh) * py,
    sw,
    sh,
    dx: 0,
    dy: 0,
    dw: destWidth,
    dh: destHeight,
  };
}

function parseObjectPosition(value) {
  const parts = value ? value.split(/\s+/).filter(Boolean) : [];
  const [rawX, rawY] = parts.length === 1 ? [parts[0], '50%'] : [parts[0], parts[1]];
  const toRatio = (raw, axis) => {
    if (!raw) {
      return 0.5;
    }
    const v = raw.toLowerCase();
    if (v.endsWith('%')) {
      const n = Number.parseFloat(v);
      return Number.isFinite(n) ? saturate(n / 100) : 0.5;
    }
    if (axis === 'x') {
      if (v === 'left') {
        return 0;
      }
      if (v === 'center') {
        return 0.5;
      }
      if (v === 'right') {
        return 1;
      }
    } else {
      if (v === 'top') {
        return 0;
      }
      if (v === 'center') {
        return 0.5;
      }
      if (v === 'bottom') {
        return 1;
      }
    }
    return 0.5;
  };
  return { x: toRatio(rawX, 'x'), y: toRatio(rawY, 'y') };
}

/* ---------- 默认配置（与原页面一致） ---------- */

const FLUID_DEFAULTS = {
  enabled: true,
  resolutionScale: 0.8,
  forceScale: 0.5,
  hoverRadiusPx: 28,
  splashRangePx: 184,
  splashVelocityScale: 3,
  splashForceScale: 2,
  splashDensity: 0.12,
  splashRandomness: 0.14,
  splashThicknessPx: 100,
  splashTravelEasePower: 2.5,
  splashForceDecayPower: 1.2,
  splashDensityDecayPower: 2,
  dragBoostScale: 0.03,
  dragBoostMaxPx: 60,
  dragThresholdPx: 6,
  diffusion: 1.5,
  iterations: 5,
  velocityDissipation: 0.1,
  densityDissipation: 0.1,
  strength: 0.9,
  project: true,
  projectIterations: 10,
};

const ASCII_DEFAULTS = {
  charset: '○>_ ',
  contrast: 2,
  gamma: 0.5,
  invertLuma: true,
  fontSize: 9,
  cellPadding: { x: 1, y: 2 },
  fps: 30,
  lumaSmoothingMs: 1000,
};

/**
 * 在一个 [data-hover-effect="ascii-trail"] 容器上启动效果。
 * 容器内需要有 img[data-ascii-source] 作为取样源，和一个 canvas 作为输出。
 */
export function createAsciiTrail(container, options = {}) {
  const cfg = { ...ASCII_DEFAULTS, ...options };
  const fluid = { ...FLUID_DEFAULTS, ...(options.fluid || {}) };

  const canvas = container.querySelector('canvas');
  const source = container.querySelector('img[data-ascii-source], video');
  if (!canvas || !source) {
    return () => {
      // 初始化未成功，没有已注册的资源需要清理。
    };
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return () => {
      // 初始化未成功，没有已注册的资源需要清理。
    };
  }
  ctx.imageSmoothingEnabled = false;

  const charset = cfg.charset.length > 0 ? cfg.charset : ' ';
  const spaceIndex = charset.indexOf(' ');
  const frameInterval = cfg.fps > 0 ? MS_PER_SECOND / cfg.fps : 0;

  // 离屏画布：sampleCanvas 取源图亮度，atlasCanvas 存字符图集
  const sampleCanvas = document.createElement('canvas');
  const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
  const atlasCanvas = document.createElement('canvas');
  const atlasCtx = atlasCanvas.getContext('2d');
  if (!sampleCtx || !atlasCtx) {
    return () => {
      // 初始化未成功，没有已注册的资源需要清理。
    };
  }

  // 字符宽高比取自实际字体度量
  const prevFont = ctx.font;
  ctx.font = `${FONT_PROBE_SIZE}px ${MONO_FONT}`;
  const probe = ctx.measureText('M');
  ctx.font = prevFont;
  const probeAscent = Number.isFinite(probe.actualBoundingBoxAscent)
    ? probe.actualBoundingBoxAscent
    : FONT_PROBE_SIZE * FONT_FALLBACK_ASCENT_RATIO;
  const probeDescent = Number.isFinite(probe.actualBoundingBoxDescent)
    ? probe.actualBoundingBoxDescent
    : FONT_PROBE_SIZE * FONT_FALLBACK_DESCENT_RATIO;
  const measuredAspect =
    (probeAscent + probeDescent) / (probe.width || FONT_PROBE_SIZE * FONT_FALLBACK_WIDTH_RATIO);
  const cellAspectRatio =
    Number.isFinite(measuredAspect) && measuredAspect > 0 ? measuredAspect : DEFAULT_ASPECT;

  const base = computeCellMetrics({
    fontSize: cfg.fontSize,
    charWidth: cfg.charWidth ?? FALLBACK_CHAR_WIDTH,
    cellPadding: cfg.cellPadding,
    cellAspectRatio,
  });

  // 亮度 -> 字符索引
  const mapLuma = (() => {
    const maxIndex = Math.max(0, charset.length - 1);
    return (luma) => {
      let v = luma;
      if (cfg.contrast !== 1) {
        v = (v - 0.5) * cfg.contrast + 0.5;
      }
      v = saturate(v);
      if (cfg.gamma !== 1) {
        v = v ** cfg.gamma;
      }
      v = saturate(v);
      const t = cfg.invertLuma ? 1 - v : v;
      return Math.max(0, Math.min(maxIndex, Math.floor(t * (maxIndex + 1))));
    };
  })();

  let layout = {
    widthCss: 0,
    heightCss: 0,
    drawWidth: 0,
    drawHeight: 0,
    offsetX: 0,
    offsetY: 0,
    cols: 0,
    rows: 0,
    dpr: 1,
    tileW: 0,
    tileH: 0,
    cellWidth: base.cellWidth,
    cellHeight: base.cellHeight,
    drawCellWidth: base.drawCellWidth,
    drawCellHeight: base.drawCellHeight,
    padX: base.padX,
    padY: base.padY,
  };

  let sim = null;
  let lumaBuf = null; // 当前帧原始亮度
  let lumaSmoothBuf = null; // 时间平滑后的亮度
  let fluidBuf = null; // 采样到字符网格的流体密度
  let cellCount = 0;
  let firstLumaFrame = true;
  let needsFluidClear = true;

  let rafId = null;
  let lastFrameTime = 0;
  let prevTimestamp = null;
  let atlasColor = null;
  let tainted = false;
  let running = false;

  const splashes = [];
  let pointerPrev = null;
  let activePointerId = null;
  let pointerDownAt = null;
  let dragging = false;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let fluidEnabled = fluid.enabled && !reduceMotion.matches;

  const setState = (state) => {
    if (canvas.dataset.asciiOverlayState !== state) {
      canvas.dataset.asciiOverlayState = state;
    }
  };

  const refreshAtlas = (color) => {
    const fill = color ?? window.getComputedStyle(canvas).color;
    if (buildAtlas(atlasCanvas, atlasCtx, layout, charset, fill)) {
      atlasColor = fill;
    }
  };

  /** 容器尺寸变化时重算网格 */
  const resize = () => {
    const rect = container.getBoundingClientRect();
    const wCss = Math.max(0, rect.width);
    const hCss = Math.max(0, rect.height);
    const hasSize = wCss > 0 && hCss > 0;
    if (!hasSize) {
      setState('no-size');
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
    const snap = (v, min = 0) => (Number.isFinite(v) ? Math.max(min, Math.round(v * dpr) / dpr) : v);
    const unit = 1 / dpr;
    const drawCellWidth = snap(base.drawCellWidth, unit);
    const drawCellHeight = snap(base.drawCellHeight, unit);
    const padX = snap(base.padX, 0);
    const padY = snap(base.padY, 0);
    const cellWidth = Math.max(unit, drawCellWidth + 2 * padX);
    const cellHeight = Math.max(unit, drawCellHeight + 2 * padY);
    const cols = Math.max(1, Math.floor(wCss / cellWidth));
    const rows = Math.max(1, Math.floor(hCss / cellHeight));

    const changed =
      layout.widthCss !== wCss ||
      layout.heightCss !== hCss ||
      layout.dpr !== dpr ||
      layout.cols !== cols ||
      layout.rows !== rows;

    layout = {
      ...layout,
      widthCss: wCss,
      heightCss: hCss,
      drawWidth: wCss,
      drawHeight: hCss,
      offsetX: 0,
      offsetY: 0,
      cols,
      rows,
      dpr,
      tileW: Math.max(1, Math.round(drawCellWidth * dpr)),
      tileH: Math.max(1, Math.round(drawCellHeight * dpr)),
      cellWidth,
      cellHeight,
      drawCellWidth,
      drawCellHeight,
      padX,
      padY,
    };

    if (!changed) {
      return;
    }

    canvas.width = Math.max(1, Math.round(wCss * dpr));
    canvas.height = Math.max(1, Math.round(hCss * dpr));
    canvas.style.width = `${wCss}px`;
    canvas.style.height = `${hCss}px`;
    ctx.setTransform(canvas.width / wCss, 0, 0, canvas.height / hCss, 0, 0);
    ctx.imageSmoothingEnabled = false;

    sampleCanvas.width = cols;
    sampleCanvas.height = rows;
    refreshAtlas();
    setState('ready');
  };

  /** 按需分配流体网格 */
  const ensureSim = () => {
    if (!fluidEnabled || !layout.cols || !layout.rows) {
      return null;
    }
    const w = Math.max(1, Math.round(layout.cols * fluid.resolutionScale));
    const h = Math.max(1, Math.round(layout.rows * fluid.resolutionScale));
    if (!sim || sim.width !== w || sim.height !== h) {
      const size = w * h;
      sim = {
        width: w,
        height: h,
        size,
        density: new Float32Array(size),
        density0: new Float32Array(size),
        velX: new Float32Array(size),
        velY: new Float32Array(size),
        velX0: new Float32Array(size),
        velY0: new Float32Array(size),
        pressure: new Float32Array(size),
        divergence: new Float32Array(size),
      };
      needsFluidClear = false;
    } else if (needsFluidClear) {
      sim.density.fill(0);
      sim.density0.fill(0);
      sim.velX.fill(0);
      sim.velY.fill(0);
      sim.velX0.fill(0);
      sim.velY0.fill(0);
      sim.pressure.fill(0);
      sim.divergence.fill(0);
      needsFluidClear = false;
    }
    return sim;
  };

  /** 推进所有进行中的点击喷溅 */
  const advanceSplashes = (s, now, dtMs) => {
    if (!splashes.length || !layout.drawWidth || !layout.drawHeight) {
      return;
    }
    const scaleX = s.width > 1 ? layout.drawWidth / (s.width - 1) : 0;
    const scaleY = s.height > 1 ? layout.drawHeight / (s.height - 1) : 0;
    if (scaleX <= 0 || scaleY <= 0) {
      return;
    }

    const speed = SPLASH_BASE_SPEED * fluid.splashVelocityScale;
    if (speed <= 0) {
      return;
    }
    const dtScale = clamp(dtMs / REFERENCE_FRAME_MS, MIN_FRAME_SCALE, MAX_FRAME_SCALE);

    for (let i = splashes.length - 1; i >= 0; i -= 1) {
      const sp = splashes[i];
      const elapsed = now - sp.start;
      if (elapsed < 0) {
        continue;
      }

      const maxRadius = Math.max(1, sp.maxRadiusPx);
      const lifeMs = (maxRadius / speed) * MS_PER_SECOND;
      if (elapsed > lifeMs) {
        splashes.splice(i, 1);
        continue;
      }

      const t = Math.min(1, elapsed / lifeMs);
      const eased = 1 - (1 - t) ** fluid.splashTravelEasePower;
      const radius = Math.max(0, eased * maxRadius);
      const remain = Math.max(0, 1 - t);
      const forceDecay = remain ** fluid.splashForceDecayPower;
      const densityAmount = fluid.splashDensity * remain ** fluid.splashDensityDecayPower * dtScale;
      const force =
        fluid.forceScale *
        fluid.splashForceScale *
        fluid.splashVelocityScale *
        forceDecay *
        SPLASH_FORCE_MULTIPLIER;

      if (force > 0 || densityAmount > 0) {
        splatRing(
          s,
          sp.normX * (s.width - 1),
          sp.normY * (s.height - 1),
          force,
          densityAmount,
          radius,
          sp.thicknessPx,
          fluid.splashRandomness,
          sp.seed,
          scaleX,
          scaleY,
        );
      }
    }
  };

  /** 渲染一帧 */
  const render = (now) => {
    if (tainted) {
      return;
    }
    if (!layout.cols || !layout.rows) {
      setState('no-size');
      return;
    }
    const ready =
      source instanceof HTMLVideoElement
        ? source.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
        : source.complete && source.naturalWidth;
    if (!ready) {
      setState('waiting');
      return;
    }

    try {
      const color = window.getComputedStyle(canvas).color;
      if (color !== atlasColor) {
        refreshAtlas(color);
      }

      const style = window.getComputedStyle(source);
      const fitRect = computeFitRect({
        sourceWidth: source.videoWidth || source.naturalWidth,
        sourceHeight: source.videoHeight || source.naturalHeight,
        destWidth: layout.widthCss,
        destHeight: layout.heightCss,
        fit: style.objectFit || 'cover',
        position: parseObjectPosition(style.objectPosition),
      });
      if (!fitRect) {
        setState('waiting');
        return;
      }

      const cols = Math.max(1, Math.floor(fitRect.dw / layout.cellWidth));
      const rows = Math.max(1, Math.floor(fitRect.dh / layout.cellHeight));
      if (cols !== layout.cols || rows !== layout.rows) {
        layout = {
          ...layout,
          cols,
          rows,
          drawWidth: fitRect.dw,
          drawHeight: fitRect.dh,
          offsetX: fitRect.dx,
          offsetY: fitRect.dy,
        };
        sampleCanvas.width = cols;
        sampleCanvas.height = rows;
      } else {
        layout.drawWidth = fitRect.dw;
        layout.drawHeight = fitRect.dh;
        layout.offsetX = fitRect.dx;
        layout.offsetY = fitRect.dy;
      }

      const total = cols * rows;
      if (cellCount !== total) {
        cellCount = total;
        lumaBuf = new Float32Array(total);
        lumaSmoothBuf = new Float32Array(total);
        fluidBuf = new Float32Array(total);
        firstLumaFrame = true;
        needsFluidClear = true;
      }
      if (!lumaBuf || !atlasCanvas.width || !atlasCanvas.height) {
        return;
      }

      // 取样源图
      sampleCtx.drawImage(source, fitRect.sx, fitRect.sy, fitRect.sw, fitRect.sh, 0, 0, cols, rows);
      const pixels = sampleCtx.getImageData(0, 0, cols, rows).data;

      ctx.clearRect(0, 0, layout.widthCss, layout.heightCss);
      ctx.globalAlpha = 1;

      const dtMs = prevTimestamp ? now - prevTimestamp : 0;
      const smoothing = cfg.lumaSmoothingMs > 0;
      const smoothFactor = smoothing
        ? !Number.isFinite(dtMs) || dtMs <= 0
          ? 0
          : saturate(1 - Math.exp(-dtMs / cfg.lumaSmoothingMs))
        : 0;
      const snapLuma = smoothing && (firstLumaFrame || prevTimestamp === null);

      // 推进流体，并把密度重采样到字符网格
      if (fluidEnabled && fluidBuf) {
        const s = ensureSim();
        if (s) {
          advanceSplashes(s, now, dtMs);
          stepFluid(s, dtMs / MS_PER_SECOND, fluid);
          const sx = cols > 1 ? (s.width - 1) / (cols - 1) : 0;
          const sy = rows > 1 ? (s.height - 1) / (rows - 1) : 0;
          for (let y = 0; y < rows; y += 1) {
            const fy = y * sy;
            const rowOff = y * cols;
            for (let x = 0; x < cols; x += 1) {
              fluidBuf[rowOff + x] = saturate(sampleBilinear(s.density, x * sx, fy, s.width, s.height));
            }
          }
        } else if (needsFluidClear) {
          fluidBuf.fill(0);
          needsFluidClear = false;
        }
      }

      const {
        cellWidth,
        cellHeight,
        drawCellWidth,
        drawCellHeight,
        padX,
        padY,
        tileW,
        tileH,
        offsetX,
        offsetY,
      } = layout;

      for (let y = 0; y < rows; y += 1) {
        const rowOff = y * cols;
        for (let x = 0; x < cols; x += 1) {
          const i = rowOff + x;
          const p = 4 * i;
          // Rec.709 亮度
          let luma = (0.2126 * pixels[p] + 0.7152 * pixels[p + 1] + 0.0722 * pixels[p + 2]) / 255;
          lumaBuf[i] = luma;

          if (smoothing && lumaSmoothBuf) {
            if (snapLuma) {
              lumaSmoothBuf[i] = luma;
            } else {
              lumaSmoothBuf[i] += (luma - lumaSmoothBuf[i]) * smoothFactor;
            }
            luma = lumaSmoothBuf[i];
          }

          // 流体密度压暗字符（invertLuma 下等价于"推亮"）
          const f = fluidEnabled && fluidBuf ? fluidBuf[i] : 1;
          if (f <= 0) {
            continue;
          }
          if (f < 1) {
            luma = cfg.invertLuma ? luma * f : luma * f + (1 - f);
          }

          const glyph = mapLuma(luma);
          if (glyph === spaceIndex && spaceIndex !== -1) {
            continue;
          }

          ctx.drawImage(
            atlasCanvas,
            glyph * tileW,
            0,
            tileW,
            tileH,
            offsetX + x * cellWidth + padX,
            offsetY + y * cellHeight + padY,
            drawCellWidth,
            drawCellHeight,
          );
        }
      }

      ctx.globalAlpha = 1;
      firstLumaFrame = false;
      prevTimestamp = now;
      setState('running');
    } catch {
      // 跨域图片会污染画布，getImageData 抛错后停掉
      tainted = true;
      ctx.clearRect(0, 0, layout.widthCss, layout.heightCss);
      setState('tainted');
      stop();
    }
  };

  const loop = (now) => {
    if (frameInterval <= 0 || now - lastFrameTime >= frameInterval) {
      lastFrameTime = now;
      render(now);
    }
    rafId = requestAnimationFrame(loop);
  };

  function start() {
    if (running || tainted) {
      return;
    }
    running = true;
    rafId = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  /* ---------- 指针交互 ---------- */

  const onPointerMove = (e) => {
    if (!fluidEnabled || fluid.strength <= 0) {
      return;
    }
    const rect = container.getBoundingClientRect();
    const lx = e.clientX - rect.left;
    const ly = e.clientY - rect.top;
    if (lx < 0 || ly < 0 || lx > rect.width || ly > rect.height) {
      pointerPrev = null;
      return;
    }
    const gx = lx - layout.offsetX;
    const gy = ly - layout.offsetY;
    if (gx < 0 || gy < 0 || gx > layout.drawWidth || gy > layout.drawHeight) {
      pointerPrev = null;
      return;
    }
    const s = ensureSim();
    if (!s) {
      return;
    }

    const now = e.timeStamp;
    const dx = pointerPrev ? e.clientX - pointerPrev.x : e.movementX || 0;
    const dy = pointerPrev ? e.clientY - pointerPrev.y : e.movementY || 0;
    const dist = Math.hypot(dx, dy);
    const dt = pointerPrev
      ? clamp((now - pointerPrev.time) / MS_PER_SECOND, MIN_POINTER_STEP_SECONDS, MAX_POINTER_STEP_SECONDS)
      : DEFAULT_POINTER_STEP_SECONDS;

    if (activePointerId !== null && pointerDownAt && !dragging) {
      if (Math.hypot(e.clientX - pointerDownAt.x, e.clientY - pointerDownAt.y) >= fluid.dragThresholdPx) {
        dragging = true;
      }
    }

    if (dist > 0) {
      const scaleX = s.width / layout.drawWidth;
      const scaleY = s.height / layout.drawHeight;
      const px = (gx / layout.drawWidth) * (s.width - 1);
      const py = (gy / layout.drawHeight) * (s.height - 1);
      // 拖拽时加大作用半径
      let boost = 0;
      if (dragging && fluid.dragBoostScale > 0 && fluid.dragBoostMaxPx > 0) {
        boost = Math.min(fluid.dragBoostMaxPx, (dist / dt) * fluid.dragBoostScale);
      }
      const radius = (fluid.hoverRadiusPx + boost) * Math.min(scaleX, scaleY);
      splatPointer(
        s,
        px,
        py,
        (dx / dt) * scaleX * fluid.forceScale,
        (dy / dt) * scaleY * fluid.forceScale,
        fluid.strength,
        radius,
      );
    }
    pointerPrev = { x: e.clientX, y: e.clientY, time: now };
  };

  const onPointerDown = (e) => {
    if (e.isPrimary === false || !fluidEnabled) {
      return;
    }
    const rect = container.getBoundingClientRect();
    const lx = e.clientX - rect.left;
    const ly = e.clientY - rect.top;
    if (lx < 0 || ly < 0 || lx > rect.width || ly > rect.height) {
      return;
    }
    activePointerId = e.pointerId;
    pointerDownAt = { x: e.clientX, y: e.clientY, time: e.timeStamp };
    dragging = false;
    pointerPrev = { x: e.clientX, y: e.clientY, time: e.timeStamp };
  };

  const onPointerUp = (e) => {
    if (e.isPrimary === false || activePointerId !== e.pointerId) {
      return;
    }
    const wasClick = !dragging;
    activePointerId = null;
    pointerDownAt = null;
    dragging = false;
    if (!wasClick || !fluidEnabled || fluid.splashRangePx <= 0) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const lx = e.clientX - rect.left;
    const ly = e.clientY - rect.top;
    if (lx < 0 || ly < 0 || lx > rect.width || ly > rect.height) {
      return;
    }
    const gx = lx - layout.offsetX;
    const gy = ly - layout.offsetY;
    if (gx < 0 || gy < 0 || gx > layout.drawWidth || gy > layout.drawHeight) {
      return;
    }

    const s = ensureSim();
    if (!s) {
      return;
    }

    const maxX = Math.max(1, s.width - 1);
    const maxY = Math.max(1, s.height - 1);
    // 喷溅半径取到最远的那个角
    const rx = layout.drawWidth - gx;
    const ry = layout.drawHeight - gy;
    const corner = Math.max(Math.hypot(gx, gy), Math.hypot(gx, ry), Math.hypot(rx, gy), Math.hypot(rx, ry));
    const maxRadiusPx = Math.min(fluid.splashRangePx, corner);
    if (maxRadiusPx <= 0) {
      return;
    }

    splashes.push({
      normX: ((gx / layout.drawWidth) * maxX) / maxX,
      normY: ((gy / layout.drawHeight) * maxY) / maxY,
      start: e.timeStamp,
      seed: SPLASH_SEED_RANGE * Math.random(),
      maxRadiusPx,
      thicknessPx:
        fluid.splashThicknessPx > 0
          ? fluid.splashThicknessPx
          : Math.max(
              MIN_SPLASH_THICKNESS_PX,
              Math.min(MAX_SPLASH_THICKNESS_PX, SPLASH_THICKNESS_RADIUS_RATIO * maxRadiusPx),
            ),
    });
  };

  /* ---------- 生命周期 ---------- */

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  // 只在进入视口时跑
  const visibility = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      start();
    } else {
      stop();
      setState('paused');
    }
  });
  visibility.observe(container);

  const onMotionChange = () => {
    fluidEnabled = fluid.enabled && !reduceMotion.matches;
    needsFluidClear = true;
  };
  reduceMotion.addEventListener('change', onMotionChange);

  const onVisibilityChange = () => {
    if (document.hidden) {
      stop();
    } else if (!tainted) {
      start();
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });
  window.addEventListener('pointercancel', onPointerUp, { passive: true });

  resize();
  refreshAtlas();
  if (!source.complete) {
    source.addEventListener('load', resize, { once: true });
  }

  return () => {
    stop();
    resizeObserver.disconnect();
    visibility.disconnect();
    reduceMotion.removeEventListener('change', onMotionChange);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);
  };
}
