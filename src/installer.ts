import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync, rmSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { homedir } from 'os';
import type { ThemeName } from './types.js';

const ESC = '\x1b[';
const RESET = `${ESC}0m`;
const BOLD = `${ESC}1m`;
const DIM = `${ESC}2m`;
const CLEAR = `${ESC}2J${ESC}H`;
const HIDE_CURSOR = `${ESC}?25l`;
const SHOW_CURSOR = `${ESC}?25h`;

const C = {
  orange: `${ESC}38;5;208m`,
  green: `${ESC}38;5;46m`,
  amber: `${ESC}38;5;214m`,
  ice: `${ESC}38;5;39m`,
  kali: `${ESC}38;5;141m`,
  seckc: `${ESC}38;5;208m`,
  red: `${ESC}38;5;203m`,
  gray: `${ESC}38;5;240m`,
  white: `${ESC}38;5;255m`,
};

interface PackChoice {
  id: string;
  packValue: string;
  label: string;
  detail: string;
  count: string;
}

const CHOICES: PackChoice[] = [
  { id: 'all', packValue: 'all', label: 'all packs',  detail: 'every scene, every pack',                      count: '47' },
  { id: 'core', packValue: 'core', label: 'core',     detail: 'matrix rain, wargames, nmap, hacker typer',    count: '7' },
  { id: 'infosec', packValue: 'infosec', label: 'infosec', detail: 'traceroute, metasploit, enigma, ssh brute', count: '10' },
  { id: 'oldschool', packValue: 'oldschool', label: 'oldschool', detail: 'blue box, warez nfo, l0phtcrack, mitnick', count: '10' },
  { id: 'aol', packValue: 'aol', label: 'aol',        detail: 'aohell, LORD, napster, sub7, winnuke',          count: '10' },
  { id: 'seckc', packValue: 'seckc', label: 'seckc',  detail: 'meetup, badge pirates, cyberraid0, rexkc',      count: '10' },
  { id: 'custom', packValue: 'custom', label: 'custom', detail: 'load from ~/.config/hakcerline/scenes/',      count: '?' },
];

const THEMES: ThemeName[] = ['random', 'cyan_blue', 'purple_pink', 'green_cyan', 'fire', 'ocean', 'synthwave', 'matrix'];

interface InstallerResult {
  packs: string[];
  theme: ThemeName;
  duration: number;
  confirmed: boolean;
}

const GRADIENTS: Record<string, number[]> = {
  cyan_blue:   [51, 50, 49, 48, 47, 45, 39, 38, 37, 33, 32, 31, 27, 26, 25],
  purple_pink: [57, 93, 129, 165, 201, 200, 199, 198, 197, 196, 163, 127, 91, 55],
  green_cyan:  [22, 28, 34, 40, 46, 47, 48, 49, 50, 51, 45, 39, 33, 27],
  fire:        [196, 202, 208, 214, 220, 226, 227, 228, 229, 230, 229, 228, 214, 208],
  ocean:       [17, 18, 19, 20, 21, 27, 33, 39, 45, 51, 50, 49, 48, 47, 46],
  synthwave:   [201, 200, 199, 163, 127, 91, 55, 56, 57, 93, 129, 165, 201],
  matrix:      [22, 28, 34, 40, 46, 82, 118, 154, 190, 226, 190, 154, 118, 82, 46],
};

function readBanner(bundledRoot: string): string[] {
  const p = join(bundledRoot, 'assets', 'banner.txt');
  if (!existsSync(p)) return [];
  try {
    const raw = readFileSync(p, 'utf8');
    const lines = raw.split('\n');
    while (lines.length > 0 && lines[lines.length - 1].trim().length === 0) lines.pop();
    while (lines.length > 0 && lines[0].trim().length === 0) lines.shift();
    return lines;
  } catch {
    return [];
  }
}

function loadSceneFrames(bundledRoot: string): { name: string; frames: string[] } | null {
  const dir = join(bundledRoot, 'scenes', 'core');
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
  if (files.length === 0) return null;
  const pick = files[Math.floor(Math.random() * files.length)];
  try {
    const data = JSON.parse(readFileSync(join(dir, pick), 'utf8'));
    if (Array.isArray(data.frames) && data.frames.length > 0) {
      return { name: data.name ?? pick, frames: data.frames };
    }
  } catch {
    return null;
  }
  return null;
}

function line(s = '', color = C.gray): string {
  return `${color}${s}${RESET}`;
}

function hr(width = 100): string {
  return line('…'.repeat(width));
}

function gradientColor(idx: number, total: number, palette: number[]): number {
  if (total <= 1) return palette[0];
  const i = Math.floor((idx / total) * (palette.length - 1));
  return palette[Math.min(i, palette.length - 1)];
}

const SKULL_ICON = '█▄███▄█';
const SKULL_TOP = '█████';
const SKULL_COLOR = 208;

function findSkullLines(lines: string[]): Set<number> {
  const result = new Set<number>();
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(SKULL_ICON)) {
      result.add(i);      // line with █▄███▄█
      if (i > 0) result.add(i - 1); // line above = skull top █████
    }
  }
  return result;
}

function findSkullRangesInLine(line: string, isSkullLine: boolean): [number, number][] {
  if (!isSkullLine) return [];
  const ranges: [number, number][] = [];
  const iconIdx = line.indexOf(SKULL_ICON);
  if (iconIdx !== -1) {
    ranges.push([iconIdx, iconIdx + SKULL_ICON.length]);
    return ranges;
  }
  // This is the line above — find the █████ that aligns with the skull
  // It's the standalone one surrounded by spaces
  let searchFrom = 0;
  let idx: number;
  while ((idx = line.indexOf(SKULL_TOP, searchFrom)) !== -1) {
    const before = idx > 0 ? line[idx - 1] : ' ';
    const after = idx + SKULL_TOP.length < line.length ? line[idx + SKULL_TOP.length] : ' ';
    if (before === ' ' && after === ' ') {
      ranges.push([idx, idx + SKULL_TOP.length]);
      break; // only the first standalone match on this line
    }
    searchFrom = idx + 1;
  }
  return ranges;
}

function colorLineWithSkull(line: string, lineColor: number, ranges: [number, number][]): string {
  if (line.trim().length === 0) return line;
  if (ranges.length === 0) return `\x1b[38;5;${lineColor}m${line}${RESET}`;

  ranges.sort((a, b) => a[0] - b[0]);
  let result = '';
  let pos = 0;
  for (const [start, end] of ranges) {
    if (pos < start) {
      result += `\x1b[38;5;${lineColor}m${line.slice(pos, start)}${RESET}`;
    }
    result += `\x1b[38;5;${SKULL_COLOR}m${line.slice(start, end)}${RESET}`;
    pos = end;
  }
  if (pos < line.length) {
    result += `\x1b[38;5;${lineColor}m${line.slice(pos)}${RESET}`;
  }
  return result;
}

function renderBannerLines(lines: string[], palette: number[]): string {
  const skullLines = findSkullLines(lines);
  return lines
    .map((l, i) => {
      if (l.trim().length === 0) return l;
      const color = gradientColor(i, lines.length, palette);
      if (skullLines.has(i)) {
        return colorLineWithSkull(l, color, findSkullRangesInLine(l, true));
      }
      return `\x1b[38;5;${color}m${l}${RESET}`;
    })
    .join('\n');
}

const SCRAMBLE_POOL = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const DECRYPT_TICKS = 28;
const SCENE_FRAME_DIV = 5;

interface DecryptCell { target: string; settleAt: number; }

function buildDecryptGrid(lines: string[]): DecryptCell[][] {
  return lines.map((l) =>
    Array.from(l).map((ch) => ({
      target: ch,
      settleAt: ch === ' ' ? 0 : Math.floor(Math.random() * (DECRYPT_TICKS - 6)) + 6,
    })),
  );
}

function randomScrambleChar(): string {
  return SCRAMBLE_POOL[Math.floor(Math.random() * SCRAMBLE_POOL.length)];
}

const SCRAMBLE_COLOR = 51;

function isSkullCharInGrid(grid: DecryptCell[][], rowIdx: number, colIdx: number): boolean {
  const lines = grid.map((r) => r.map((c) => c.target).join(''));
  const skullLines = findSkullLines(lines);
  if (!skullLines.has(rowIdx)) return false;
  const ranges = findSkullRangesInLine(lines[rowIdx], true);
  return ranges.some(([start, end]) => colIdx >= start && colIdx < end);
}

function renderDecryptFrame(grid: DecryptCell[][], tick: number, palette: number[]): string {
  const lines = grid.map((r) => r.map((c) => c.target).join(''));
  const skullLines = findSkullLines(lines);
  return grid
    .map((row, i) => {
      if (row.length === 0) return '';
      const finalColor = gradientColor(i, grid.length, palette);
      const isSkull = skullLines.has(i);
      const ranges = isSkull ? findSkullRangesInLine(lines[i], true) : [];
      return row
        .map((c, j) => {
          const inSkull = ranges.some(([s, e]) => j >= s && j < e);
          const color = inSkull ? SKULL_COLOR : finalColor;
          if (tick >= c.settleAt) return `\x1b[38;5;${color}m${c.target}${RESET}`;
          if (c.target === ' ') return ' ';
          return `\x1b[38;5;${SCRAMBLE_COLOR}m${randomScrambleChar()}${RESET}`;
        })
        .join('');
    })
    .join('\n');
}

function decryptDone(grid: DecryptCell[][], tick: number): boolean {
  return tick >= DECRYPT_TICKS;
}

function pickPalette(name?: string): number[] {
  const palettes = Object.keys(GRADIENTS);
  const pick = (name && GRADIENTS[name]) ? name : palettes[Math.floor(Math.random() * palettes.length)];
  return GRADIENTS[pick] ?? GRADIENTS.matrix;
}

const PREVIEW_INDENT = '                  ';
const PREVIEW_INNER = 70;

function padVisible(s: string, width: number): string {
  const visible = s.replace(/\x1b\[[0-9;]*m/g, '');
  const len = Array.from(visible).length;
  if (len >= width) {
    const arr = Array.from(visible);
    return arr.slice(0, width).join('');
  }
  return s + ' '.repeat(width - len);
}

function renderPreview(sceneFrame?: string, sceneName?: string): string {
  const title = sceneName ? `[ ${C.orange}${BOLD}hakcerline${RESET}${C.gray} · ${DIM}${sceneName}${RESET}${C.gray} ]` : `[ ${C.orange}${BOLD}hakcerline${RESET}${C.gray} ]`;
  const titleVisible = sceneName ? `[ hakcerline · ${sceneName} ]` : `[ hakcerline ]`;
  const dashes = '─'.repeat(Math.max(0, PREVIEW_INNER - titleVisible.length - 1));
  const top = `${C.gray}${PREVIEW_INDENT}┌─${title}${dashes}┐${RESET}`;

  const rawScene = sceneFrame ?? 'ｦｱｲｳ  ｴ ｵｶｷ ｸｹｺ ｻｼｽ  ｾｿﾀ  ﾁﾂﾃ ﾄﾅﾆ ﾇﾈ ﾉﾊﾋ  ﾌﾍ  ﾎﾏ ﾐﾑﾒ ﾓﾔ';
  const sceneText = Array.from(rawScene).slice(0, PREVIEW_INNER - 2).join('');
  const sceneLine = `${C.gray}${PREVIEW_INDENT}│ ${C.green}${padVisible(sceneText, PREVIEW_INNER - 2)}${RESET}${C.gray} │${RESET}`;

  const infoText = `${C.kali}Opus 4.6${RESET} ${C.gray}│${RESET} ${C.green}$0.00${RESET} ${C.gray}│${RESET} ${C.amber}░░░░░░░░░░ 0%${RESET} ${C.gray}│${RESET} ${C.white}0s${RESET} ${C.gray}│${RESET} ${C.orange}~/hakcerline${RESET}`;
  const info = `${C.gray}${PREVIEW_INDENT}│ ${padVisible(infoText, PREVIEW_INNER - 2)}${C.gray} │${RESET}`;

  const promptText = `${C.orange}▸▸ sample statusline preview${RESET}`;
  const prompt = `${C.gray}${PREVIEW_INDENT}│ ${padVisible(promptText, PREVIEW_INNER - 2)}${C.gray} │${RESET}`;

  const bottom = `${C.gray}${PREVIEW_INDENT}└${'─'.repeat(PREVIEW_INNER)}┘${RESET}`;
  return [top, sceneLine, info, prompt, bottom].join('\n');
}

function renderMenu(state: State): string {
  const lines: string[] = [];
  lines.push(` ${C.white}Pick your scene packs. Edit later in ${C.amber}~/.config/hakcerline/config.json${RESET}`);
  lines.push(` ${DIM}[space]${RESET} select · ${DIM}[a]${RESET} all/none · ${DIM}[t]${RESET} theme · ${DIM}[d]${RESET} duration · ${DIM}[enter]${RESET} confirm · ${DIM}[q]${RESET} quit`);
  for (let i = 0; i < CHOICES.length; i++) {
    const c = CHOICES[i];
    const cursor = i === state.cursor ? `${C.orange}❯${RESET}` : ' ';
    const selected = state.selected.has(c.id);
    const check = selected ? `${C.green}●${RESET}` : `${C.gray}○${RESET}`;
    const num = `${DIM}${i + 1}.${RESET}`;
    const label = selected ? `${C.orange}${BOLD}${c.label}${RESET}` : `${C.white}${c.label}${RESET}`;
    const pad = ' '.repeat(Math.max(0, 12 - c.label.length));
    const detail = `${C.gray}──${RESET}  ${DIM}${c.detail}${RESET}`;
    const count = `${C.amber}(${c.count})${RESET}`;
    const defMark = c.id === 'all' && state.selected.size === 0 ? ` ${DIM}[ default ]${RESET}` : '';
    lines.push(` ${cursor} ${num} ${check} ${label}${pad} ${detail.padEnd(60)} ${count}${defMark}`);
  }
  lines.push(` ${C.gray}theme:${RESET} ${themeSwatches(state.theme)}   ${C.gray}duration:${RESET} ${C.amber}${state.duration}s${RESET}`);
  return lines.join('\n');
}

function themeSwatches(current: ThemeName): string {
  const themeColor: Record<string, string> = {
    random: C.orange,
    cyan_blue: C.ice,
    purple_pink: C.kali,
    green_cyan: C.green,
    fire: C.red,
    ocean: C.ice,
    synthwave: C.kali,
    matrix: C.green,
  };
  return THEMES.map((t) => {
    const c = themeColor[t] ?? C.gray;
    return t === current ? `${c}${BOLD}[${t}]${RESET}` : `${DIM}${t}${RESET}`;
  }).join(' ');
}

interface State {
  cursor: number;
  selected: Set<string>;
  theme: ThemeName;
  duration: number;
  durationPrompt: boolean;
  durationBuffer: string;
}

function applySelection(state: State, id: string): void {
  if (id === 'all') {
    if (state.selected.has('all')) state.selected.clear();
    else {
      state.selected.clear();
      state.selected.add('all');
    }
    return;
  }
  state.selected.delete('all');
  if (state.selected.has(id)) state.selected.delete(id);
  else state.selected.add(id);
}

function toggleAll(state: State): void {
  if (state.selected.has('all') || state.selected.size === CHOICES.length - 1) {
    state.selected.clear();
  } else {
    state.selected.clear();
    state.selected.add('all');
  }
}

function cycleTheme(state: State, dir: 1 | -1): void {
  const i = THEMES.indexOf(state.theme);
  const next = (i + dir + THEMES.length) % THEMES.length;
  state.theme = THEMES[next];
}

export async function runInstaller(bundledRoot: string): Promise<InstallerResult> {
  const stdin = process.stdin;
  const stdout = process.stdout;
  const isTTY = stdin.isTTY && stdout.isTTY;

  const state: State = {
    cursor: 0,
    selected: new Set<string>(),
    theme: 'random',
    duration: 30,
    durationPrompt: false,
    durationBuffer: '',
  };

  if (!isTTY) {
    return { packs: ['all'], theme: 'random', duration: 30, confirmed: true };
  }

  const bannerLines = readBanner(bundledRoot);
  const palette = pickPalette();
  const scene = loadSceneFrames(bundledRoot);
  const decryptGrid = buildDecryptGrid(bannerLines);
  let tick = 0;

  return new Promise<InstallerResult>((resolvePromise) => {
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    stdout.write(HIDE_CURSOR);

    const draw = () => {
      stdout.write(CLEAR);
      stdout.write('\n');
      if (bannerLines.length > 0) {
        const bannerOut = decryptDone(decryptGrid, tick)
          ? renderBannerLines(bannerLines, palette)
          : renderDecryptFrame(decryptGrid, tick, palette);
        stdout.write(bannerOut + '\n');
      }
      const frameIdx = Math.floor(tick / SCENE_FRAME_DIV);
      const frame = scene ? scene.frames[frameIdx % scene.frames.length] : undefined;
      stdout.write(renderPreview(frame, scene?.name) + '\n');
      stdout.write(renderMenu(state) + '\n');
      if (state.durationPrompt) {
        stdout.write(`\n ${C.amber}duration seconds:${RESET} ${state.durationBuffer}${BOLD}_${RESET}\n`);
      }
    };

    const animTimer = setInterval(() => {
      tick++;
      draw();
    }, 60);

    const cleanup = () => {
      clearInterval(animTimer);
      stdout.write(SHOW_CURSOR);
      stdin.setRawMode(false);
      stdin.pause();
      stdin.removeListener('data', onData);
    };

    const finish = (confirmed: boolean) => {
      cleanup();
      const packs = state.selected.size === 0 ? ['all'] : Array.from(state.selected);
      resolvePromise({ packs, theme: state.theme, duration: state.duration, confirmed });
    };

    const onData = (key: string) => {
      if (state.durationPrompt) {
        if (key === '\r' || key === '\n') {
          const n = parseInt(state.durationBuffer, 10);
          if (Number.isFinite(n) && n > 0) state.duration = n;
          state.durationPrompt = false;
          state.durationBuffer = '';
          draw();
          return;
        }
        if (key === '\x1b') {
          state.durationPrompt = false;
          state.durationBuffer = '';
          draw();
          return;
        }
        if (key === '\x7f') {
          state.durationBuffer = state.durationBuffer.slice(0, -1);
          draw();
          return;
        }
        if (/^\d$/.test(key) && state.durationBuffer.length < 4) {
          state.durationBuffer += key;
          draw();
          return;
        }
        return;
      }

      if (key === '\x03' || key === 'q' || key === 'Q') { finish(false); return; }
      if (key === '\r' || key === '\n') { finish(true); return; }
      if (key === ' ') { applySelection(state, CHOICES[state.cursor].id); draw(); return; }
      if (key === 'a' || key === 'A') { toggleAll(state); draw(); return; }
      if (key === 't') { cycleTheme(state, 1); draw(); return; }
      if (key === 'T') { cycleTheme(state, -1); draw(); return; }
      if (key === 'd' || key === 'D') { state.durationPrompt = true; state.durationBuffer = ''; draw(); return; }
      if (key === '\x1b[A' || key === 'k') {
        state.cursor = (state.cursor - 1 + CHOICES.length) % CHOICES.length;
        draw();
        return;
      }
      if (key === '\x1b[B' || key === 'j') {
        state.cursor = (state.cursor + 1) % CHOICES.length;
        draw();
        return;
      }
      const n = parseInt(key, 10);
      if (Number.isFinite(n) && n >= 1 && n <= CHOICES.length) {
        state.cursor = n - 1;
        applySelection(state, CHOICES[state.cursor].id);
        draw();
        return;
      }
    };

    stdin.on('data', onData);
    draw();
  });
}

export function writeHakcerlineConfig(result: InstallerResult): string {
  const dir = join(homedir(), '.config', 'hakcerline');
  mkdirSync(dir, { recursive: true });
  const path = join(dir, 'config.json');
  const cfg = {
    packs: result.packs,
    duration: result.duration,
    theme: result.theme,
    customScenesDir: join(dir, 'scenes'),
    exclude: [],
    only: null,
  };
  writeFileSync(path, JSON.stringify(cfg, null, 2) + '\n');
  mkdirSync(join(dir, 'scenes'), { recursive: true });
  return path;
}

function resolveStatuslineCommand(indexFile: string): string {
  const abs = resolve(indexFile);
  const ephemeral = abs.includes('/_npx/') || abs.startsWith('/tmp/');
  if (!ephemeral && existsSync(abs)) return abs;
  return 'npx -y hakcerline@latest';
}

export function writeClaudeSettings(indexFile: string): string {
  const settingsPath = join(homedir(), '.claude', 'settings.json');
  let settings: Record<string, unknown> = {};
  if (existsSync(settingsPath)) {
    try {
      settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
    } catch {
      throw new Error(`could not parse ${settingsPath}`);
    }
  } else {
    mkdirSync(dirname(settingsPath), { recursive: true });
  }
  settings.statusLine = {
    type: 'command',
    command: resolveStatuslineCommand(indexFile),
    padding: 0,
    refreshInterval: 1,
  };
  writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
  return settingsPath;
}

export function hakcerlineConfigDir(): string {
  return join(homedir(), '.config', 'hakcerline');
}

export function removeHakcerlineConfig(): string | null {
  const dir = hakcerlineConfigDir();
  if (!existsSync(dir)) return null;
  rmSync(dir, { recursive: true, force: true });
  return dir;
}

export function removeClaudeSettings(): string | null {
  const settingsPath = join(homedir(), '.claude', 'settings.json');
  if (!existsSync(settingsPath)) return null;
  let settings: Record<string, unknown>;
  try {
    settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
  } catch {
    throw new Error(`could not parse ${settingsPath}`);
  }
  if ('statusLine' in settings) {
    delete settings.statusLine;
    writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
    return settingsPath;
  }
  return null;
}

export function installerRootFromFile(indexFile: string): string {
  return resolve(indexFile, '..', '..');
}

export function printMenuStatic(bundledRoot: string, paletteName?: string): void {
  const stdout = process.stdout;
  const stdin = process.stdin;
  const bannerLines = readBanner(bundledRoot);
  const palette = pickPalette(paletteName);
  const scene = loadSceneFrames(bundledRoot);
  const state: State = {
    cursor: 0,
    selected: new Set<string>(),
    theme: 'random',
    duration: 30,
    durationPrompt: false,
    durationBuffer: '',
  };

  if (!stdout.isTTY) {
    if (bannerLines.length > 0) stdout.write(renderBannerLines(bannerLines, palette) + '\n');
    stdout.write(renderPreview(scene?.frames[0], scene?.name) + '\n');
    stdout.write(renderMenu(state) + '\n');
    return;
  }

  stdout.write(HIDE_CURSOR);
  let tick = 0;
  const decryptGrid = buildDecryptGrid(bannerLines);
  const draw = () => {
    stdout.write(CLEAR);
    stdout.write('\n');
    if (bannerLines.length > 0) {
      const bannerOut = decryptDone(decryptGrid, tick)
        ? renderBannerLines(bannerLines, palette)
        : renderDecryptFrame(decryptGrid, tick, palette);
      stdout.write(bannerOut + '\n');
    }
    const frameIdx = Math.floor(tick / SCENE_FRAME_DIV);
    const frame = scene ? scene.frames[frameIdx % scene.frames.length] : undefined;
    stdout.write(renderPreview(frame, scene?.name) + '\n');
    stdout.write(renderMenu(state) + '\n');
    stdout.write(`\n ${DIM}preview · press q or Ctrl-C to exit${RESET}\n`);
  };

  const timer = setInterval(() => { tick++; draw(); }, 60);

  const cleanup = () => {
    clearInterval(timer);
    stdout.write(SHOW_CURSOR);
    if (stdin.isTTY) {
      stdin.setRawMode(false);
      stdin.pause();
    }
    process.exit(0);
  };

  if (stdin.isTTY) {
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data', (k: string) => {
      if (k === 'q' || k === 'Q' || k === '\x03' || k === '\r' || k === '\n') cleanup();
    });
  }
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  draw();
}
