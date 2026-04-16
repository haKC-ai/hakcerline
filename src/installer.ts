import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
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

const THEMES: ThemeName[] = ['matrix', 'amber', 'green', 'ice', 'kali', 'seckc'];

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

function readBanner(bundledRoot: string): string {
  const p = join(bundledRoot, 'assets', 'banner.txt');
  if (!existsSync(p)) return '';
  try {
    return readFileSync(p, 'utf8');
  } catch {
    return '';
  }
}

function line(s = '', color = C.gray): string {
  return `${color}${s}${RESET}`;
}

function hr(width = 100): string {
  return line('…'.repeat(width));
}

function gradientColor(idx: number, total: number, palette: number[]): number {
  if (total <= 1) return palette[0];
  const pos = Math.min(palette.length - 1, Math.floor((idx / total) * (palette.length - 1)));
  return palette[pos];
}

function renderBanner(bundledRoot: string, paletteName?: keyof typeof GRADIENTS): string {
  const raw = readBanner(bundledRoot);
  if (!raw) return '';
  const palettes = Object.keys(GRADIENTS);
  const pick = paletteName ?? (palettes[Math.floor(Math.random() * palettes.length)] as keyof typeof GRADIENTS);
  const palette = GRADIENTS[pick] ?? GRADIENTS.matrix;

  const lines = raw.replace(/\n+$/s, '').split('\n');
  return lines
    .map((l, i) => {
      if (l.trim().length === 0) return l;
      const color = gradientColor(i, lines.length, palette);
      return `\x1b[38;5;${color}m${l}${RESET}`;
    })
    .join('\n');
}

function renderPreview(): string {
  const top    = `${C.gray}                  ┌─[ ${C.orange}${BOLD}hakcerline${RESET}${C.gray} ]────────────────────────────────────────────┐${RESET}`;
  const scene  = `${C.gray}                  │ ${C.green}ｦｱｲｳ  ｴ ｵｶｷ ｸｹｺ ｻｼｽ  ｾｿﾀ  ﾁﾂﾃ ﾄﾅﾆ ﾇﾈ ﾉﾊﾋ  ﾌﾍ  ﾎﾏ ﾐﾑﾒ ﾓﾔ${RESET}${C.gray} │${RESET}`;
  const info   = `${C.gray}                  │ ${C.kali}Opus 4.6${RESET} ${C.gray}│${RESET} ${C.green}$0.00${RESET} ${C.gray}│${RESET} ${C.amber}░░░░░░░░░░ 0%${RESET} ${C.gray}│${RESET} ${C.white}0s${RESET} ${C.gray}│${RESET} ${C.orange}~/hakcerline${RESET}${C.gray}      │${RESET}`;
  const prompt = `${C.gray}                  │ ${C.orange}▸▸ sample statusline preview${RESET}${C.gray}                              │${RESET}`;
  const bottom = `${C.gray}                  └──────────────────────────────────────────────────────────┘${RESET}`;
  return [top, scene, info, prompt, bottom].join('\n');
}

function renderMenu(state: State): string {
  const lines: string[] = [];
  lines.push(hr());
  lines.push(` ${C.white}Pick your scene packs. You can change these later in ${C.amber}~/.config/hakcerline/config.json${RESET}`);
  lines.push(` ${DIM}[space]${RESET} multi-select · ${DIM}[a]${RESET} all/none · ${DIM}[t]${RESET} cycle theme · ${DIM}[d]${RESET} duration · ${DIM}[enter]${RESET} confirm · ${DIM}[q]${RESET} quit`);
  lines.push('');
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
  lines.push('');
  lines.push(` ${C.gray}theme:${RESET}    ${themeSwatches(state.theme)}`);
  lines.push(` ${C.gray}duration:${RESET} ${C.amber}${state.duration}s${RESET} ${DIM}per scene${RESET}`);
  lines.push('');
  lines.push(hr());
  lines.push(` ${DIM}GREETZ:${RESET} SecKC • Badge Pirates • 2600Hz crew • the hakcer pypi module • nano`);
  lines.push(` ${DIM}SHOUTZ:${RESET} #seckc on discord • seckc.org • darkcode.ai`);
  lines.push(`                           ${C.gray}───── ▓ signed, /dev/haKCØRY.23: ▓ ─────${RESET}`);
  lines.push(`                                ${DIM}"nano > vim. come fite me."${RESET}`);
  lines.push(hr());
  return lines.join('\n');
}

function themeSwatches(current: ThemeName): string {
  const themeColor: Record<ThemeName, string> = {
    matrix: C.green,
    amber: C.amber,
    green: `${ESC}38;5;48m`,
    ice: C.ice,
    kali: C.kali,
    seckc: C.seckc,
  };
  return THEMES.map((t) => {
    const marker = t === current ? `${themeColor[t]}${BOLD}[${t}]${RESET}` : `${DIM}${t}${RESET}`;
    return marker;
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
    theme: 'matrix',
    duration: 30,
    durationPrompt: false,
    durationBuffer: '',
  };

  if (!isTTY) {
    return { packs: ['all'], theme: 'matrix', duration: 30, confirmed: true };
  }

  const banner = renderBanner(bundledRoot);
  const preview = renderPreview();

  return new Promise<InstallerResult>((resolvePromise) => {
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    stdout.write(HIDE_CURSOR);

    const draw = () => {
      stdout.write(CLEAR);
      stdout.write('\n');
      if (banner) stdout.write(banner + '\n\n');
      stdout.write(preview + '\n\n');
      stdout.write(renderMenu(state) + '\n');
      if (state.durationPrompt) {
        stdout.write(`\n ${C.amber}duration seconds:${RESET} ${state.durationBuffer}${BOLD}_${RESET}\n`);
      }
    };

    const cleanup = () => {
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

export function writeClaudeSettings(): string {
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
    command: 'npx -y hakcerline@latest',
    padding: 0,
  };
  writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
  return settingsPath;
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

export function printMenuStatic(bundledRoot: string, palette?: string): void {
  const banner = renderBanner(bundledRoot, palette as keyof typeof GRADIENTS | undefined);
  process.stdout.write('\n');
  if (banner) process.stdout.write(banner + '\n\n');
  process.stdout.write(renderPreview() + '\n\n');
  const state: State = {
    cursor: 0,
    selected: new Set<string>(),
    theme: 'matrix',
    duration: 30,
    durationPrompt: false,
    durationBuffer: '',
  };
  process.stdout.write(renderMenu(state) + '\n');
}
