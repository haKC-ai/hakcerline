import { basename } from 'path';
import type { ClaudeInput, ThemeName } from './types.js';

const RESET = '\x1b[0m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';

const PALETTES: Record<string, number[]> = {
  cyan_blue:   [51, 50, 49, 48, 47, 45, 39, 38, 37, 33, 32, 31, 27, 26, 25],
  purple_pink: [57, 93, 129, 165, 201, 200, 199, 198, 197, 196, 163, 127, 91, 55],
  green_cyan:  [22, 28, 34, 40, 46, 47, 48, 49, 50, 51, 45, 39, 33, 27],
  fire:        [196, 202, 208, 214, 220, 226, 227, 228, 229, 230, 229, 228, 214, 208],
  ocean:       [17, 18, 19, 20, 21, 27, 33, 39, 45, 51, 50, 49, 48, 47, 46],
  synthwave:   [201, 200, 199, 163, 127, 91, 55, 56, 57, 93, 129, 165, 201],
  matrix:      [22, 28, 34, 40, 46, 82, 118, 154, 190, 226, 190, 154, 118, 82, 46],
};
const PALETTE_NAMES = Object.keys(PALETTES);

const SEG = {
  model: '\x1b[38;5;141m',
  cost: '\x1b[38;5;48m',
  ctx: '\x1b[38;5;220m',
  elapsed: '\x1b[38;5;255m',
  cwd: '\x1b[38;5;208m',
  git: '\x1b[38;5;51m',
  rate: '\x1b[38;5;203m',
  sep: '\x1b[38;5;240m',
};

export function terminalWidth(): number {
  const w = process.stdout.columns;
  if (typeof w === 'number' && w > 0) return w;
  const env = parseInt(process.env.COLUMNS ?? '', 10);
  if (Number.isFinite(env) && env > 0) return env;
  return 120;
}

export function fitToWidth(frame: string, width: number): string {
  if (frame.length >= width) return frame.slice(0, width);
  return frame + ' '.repeat(width - frame.length);
}

function resolvePalette(theme: ThemeName, sceneIdx: number): number[] {
  if (theme === 'random') {
    return PALETTES[PALETTE_NAMES[sceneIdx % PALETTE_NAMES.length]];
  }
  return PALETTES[theme] ?? PALETTES.matrix;
}

type ColorSpec = { code: string; ch: string };
type EffectFn = (chars: string[], palette: number[], frameNum: number) => ColorSpec[];

function palIdx(i: number, len: number, palette: number[], offset = 0): number {
  const base = Math.floor((i / len) * palette.length);
  return palette[((base + offset) % palette.length + palette.length) % palette.length];
}

const EFFECTS: Record<string, EffectFn> = {
  wave(chars, palette, frame) {
    return chars.map((ch, i) => ({
      code: `38;5;${palIdx(i, chars.length, palette, frame)}`,
      ch,
    }));
  },

  rain(chars, palette, frame) {
    const seed = frame * 7;
    return chars.map((ch, i) => {
      const hash = ((i * 31 + seed) >>> 0) % 100;
      if (hash < 8) return { code: '1;38;5;255', ch };
      if (hash < 20) return { code: `38;5;${palette[palette.length - 1]}`, ch };
      const c = palette[Math.floor((i / chars.length) * (palette.length - 1))];
      return { code: hash < 40 ? `2;38;5;${c}` : `38;5;${c}`, ch };
    });
  },

  decrypt(chars, palette, frame) {
    const progress = Math.min(1, frame / 50);
    const S = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEF';
    return chars.map((ch, i) => {
      if (ch === ' ') return { code: '', ch };
      const threshold = (i / chars.length) * 1.3;
      if (progress >= threshold) {
        return { code: `38;5;${palette[Math.floor((i / chars.length) * (palette.length - 1))]}`, ch };
      }
      return { code: '38;5;51', ch: S[((i * 17 + frame * 13) >>> 0) % S.length] };
    });
  },

  sparkle(chars, palette, frame) {
    const seed = frame * 11;
    return chars.map((ch, i) => {
      const hash = ((i * 37 + seed) >>> 0) % 100;
      const c = palIdx(i, chars.length, palette, Math.floor(frame / 3));
      if (hash < 5) return { code: '1;38;5;255', ch };
      if (hash < 12) return { code: `2;38;5;${palette[0]}`, ch };
      return { code: `38;5;${c}`, ch };
    });
  },

  beams(chars, palette, frame) {
    const beamPos = (frame * 2) % (chars.length + 20) - 10;
    return chars.map((ch, i) => {
      const dist = Math.abs(i - beamPos);
      if (dist < 8) {
        const intensity = 1 - dist / 8;
        if (intensity > 0.6) return { code: '1;38;5;255', ch };
        if (intensity > 0.3) return { code: `38;5;${palette[palette.length - 1]}`, ch };
      }
      return { code: `2;38;5;${palette[Math.floor((i / chars.length) * (palette.length - 1))]}`, ch };
    });
  },
};

const EFFECT_NAMES = Object.keys(EFFECTS);

function batchRender(specs: ColorSpec[]): string {
  let out = '';
  let lastCode = '';
  for (const s of specs) {
    if (s.ch === ' ' && !s.code) { out += ' '; continue; }
    if (s.code !== lastCode) {
      if (lastCode) out += RESET;
      out += `\x1b[${s.code}m`;
      lastCode = s.code;
    }
    out += s.ch;
  }
  if (lastCode) out += RESET;
  return out;
}

export function colorizeScene(frame: string, theme: ThemeName, sceneIdx: number, frameNum: number, forcedEffect?: string | null): string {
  const palette = resolvePalette(theme, sceneIdx);
  const chars = Array.from(frame);
  if (chars.length === 0) return frame;
  const effect = (forcedEffect && EFFECTS[forcedEffect])
    ? EFFECTS[forcedEffect]
    : EFFECTS[EFFECT_NAMES[sceneIdx % EFFECT_NAMES.length]];
  const specs = effect(chars, palette, frameNum);
  return batchRender(specs);
}

const C = {
  cyan: 51, teal: 43, aqua: 49, sky: 45, steel: 38, dark: 37,
  blue: 44, dim: 240, bardim: 238, green: 48, warn: 214, crit: 203,
};

function ctxColor(pct: number): number {
  if (pct >= 80) return C.crit;
  if (pct >= 60) return C.warn;
  return C.blue;
}

function rateColor(pct: number): number {
  if (pct >= 80) return C.crit;
  if (pct >= 50) return C.warn;
  return C.steel;
}

function shortDir(p: string): string {
  const h = process.env.HOME;
  if (h && p.startsWith(h)) p = '~' + p.slice(h.length);
  const segs = p.split('/').filter(Boolean);
  if (segs.length <= 2) return p;
  return segs.slice(-2).join('/');
}

export interface InfoContext {
  effectName: string;
  sceneName: string;
  themeName: string;
}

const S = `\x1b[38;5;240m \u2733 \x1b[0m`; // ✳ separator

// Representative color per theme — used for the [t] label
const THEME_ACCENT: Record<string, number> = {
  cyan_blue: 51, purple_pink: 201, green_cyan: 46, fire: 208,
  ocean: 39, synthwave: 165, matrix: 46, random: 51,
};

function themeColor(name: string): number {
  return THEME_ACCENT[name] ?? 51;
}

export function buildInfoRowStyled(input: ClaudeInput, ctx?: InfoContext): string {
  const parts: string[] = [];

  // rate
  const five = input.rate_limits?.five_hour?.used_percentage ?? 0;
  parts.push(`\x1b[38;5;${rateColor(five)}m\uf0e4 ${Math.round(five)}%\x1b[0m`);

  // elapsed
  const durMs = input.cost?.total_duration_ms ?? 0;
  parts.push(`\x1b[38;5;${C.dark}m\uf017 ${formatDuration(durMs)}\x1b[0m`);

  // model
  const model = input.model?.display_name ?? input.model?.id ?? 'Claude';
  parts.push(`\x1b[1;38;5;${C.cyan}m${model}\x1b[0m`);

  // context bar
  const ctxPct = input.context_window?.used_percentage ?? 0;
  const w = 8;
  const filled = Math.max(0, Math.min(w, Math.round((ctxPct / 100) * w)));
  const cc = ctxColor(ctxPct);
  parts.push(`\x1b[38;5;${cc}m${'█'.repeat(filled)}\x1b[38;5;${C.bardim}m${'░'.repeat(w - filled)}\x1b[0m \x1b[38;5;${cc}m${Math.round(ctxPct)}%\x1b[0m`);

  // cost
  const cost = input.cost?.total_cost_usd ?? 0;
  const fmt = cost >= 10 ? cost.toFixed(1) : cost.toFixed(2);
  parts.push(`\x1b[38;5;${C.teal}m\uf155${fmt}\x1b[0m`);

  let left = parts.join(S);

  // right side: cwd, lines, controls
  const rparts: string[] = [];

  const cwd = input.workspace?.current_dir ?? '';
  rparts.push(`\x1b[38;5;${C.aqua}m\uf07c ${cwd ? shortDir(cwd) : '~'}\x1b[0m`);

  const a = input.cost?.total_lines_added ?? 0;
  const r = input.cost?.total_lines_removed ?? 0;
  rparts.push(`\x1b[38;5;${C.green}m+${a}\x1b[38;5;${C.dim}m/\x1b[38;5;${C.crit}m-${r}\x1b[0m`);

  if (ctx) {
    const tc = themeColor(ctx.themeName);
    const scene = `\x1b[38;5;240m[\x1b[38;5;228me\x1b[38;5;240m]\x1b[38;5;213m${ctx.sceneName}\x1b[0m`;
    const effect = `\x1b[38;5;240m[\x1b[38;5;228mt\x1b[38;5;240m]\x1b[38;5;${tc}m${ctx.effectName}\x1b[0m`;
    const hint = `\x1b[38;5;${C.dim}m/hakcerline\x1b[0m`;
    rparts.push(`${scene} ${effect} ${hint}`);
  }

  return left + S + rparts.join(S);
}

export function getSceneAndFrame(numScenes: number, duration: number, totalFrames = 400): [number, number] {
  const now = Date.now() / 1000;
  const sceneIdx = Math.floor(now / duration) % numScenes;
  const sceneStart = Math.floor(now / duration) * duration;
  const elapsed = now - sceneStart;
  const frameNum = Math.floor((elapsed / duration) * totalFrames) % totalFrames;
  return [sceneIdx, frameNum];
}

function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  if (m < 60) return `${m}m${rem.toString().padStart(2, '0')}s`;
  const h = Math.floor(m / 60);
  return `${h}h${(m % 60).toString().padStart(2, '0')}m`;
}

function contextBar(pct: number, width = 10): string {
  const filled = Math.max(0, Math.min(width, Math.round((pct / 100) * width)));
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

function homify(p: string): string {
  const home = process.env.HOME;
  if (home && p.startsWith(home)) return '~' + p.slice(home.length);
  return p;
}

export function buildInfoRowPlain(input: ClaudeInput): string {
  const parts: string[] = [];

  const model = input.model?.display_name ?? input.model?.id ?? 'Claude';
  parts.push(model);

  const cost = input.cost?.total_cost_usd;
  if (typeof cost === 'number') parts.push(`$${cost.toFixed(2)}`);

  const ctxPct = input.context_window?.used_percentage;
  if (typeof ctxPct === 'number') {
    parts.push(`${contextBar(ctxPct)} ${Math.round(ctxPct)}%`);
  }

  const durMs = input.cost?.total_duration_ms;
  if (typeof durMs === 'number') parts.push(formatDuration(durMs));

  const cwd = input.workspace?.current_dir;
  if (cwd) parts.push(homify(cwd));

  const wt = input.workspace?.git_worktree;
  if (wt) parts.push(`⎇ ${wt}`);

  const five = input.rate_limits?.five_hour?.used_percentage;
  if (typeof five === 'number') parts.push(`5h:${Math.round(five)}%`);

  return parts.join(' | ');
}

export function buildPromptRow(input: ClaudeInput): string {
  const name = input.session_name?.trim() || 'hakcerline';
  return `${SEG.cwd}${BOLD}${name}${RESET}${SEG.sep} ▸${RESET}`;
}

export function sceneLineFor(frames: string[], frameNum: number, width: number, theme: ThemeName, sceneIdx: number, forcedEffect?: string | null): string {
  const frame = frames[frameNum % frames.length];
  const fitted = fitToWidth(frame, width);
  return colorizeScene(fitted, theme, sceneIdx, frameNum, forcedEffect);
}

export function stripAnsiLen(s: string): number {
  return s.replace(/\x1b\[[0-9;]*m/g, '').length;
}

export function padVisible(s: string, width: number): string {
  const len = stripAnsiLen(s);
  if (len >= width) return s;
  return s + ' '.repeat(width - len);
}

export function shortCwd(input: ClaudeInput): string {
  return basename(input.workspace?.current_dir ?? '') || 'hakcerline';
}
