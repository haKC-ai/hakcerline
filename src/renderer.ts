import { basename } from 'path';
import type { ClaudeInput, ThemeName } from './types.js';

const RESET = '\x1b[0m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';

const THEMES: Record<ThemeName, string> = {
  matrix: '\x1b[38;5;46m',
  amber: '\x1b[38;5;214m',
  green: '\x1b[38;5;48m',
  ice: '\x1b[38;5;39m',
  kali: '\x1b[38;5;141m',
  seckc: '\x1b[38;5;208m',
};

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

export function colorizeScene(frame: string, theme: ThemeName): string {
  return `${THEMES[theme] ?? THEMES.matrix}${frame}${RESET}`;
}

export function getSceneAndFrame(numScenes: number, duration: number, fps = 12.5): [number, number] {
  const now = Date.now() / 1000;
  const sceneIdx = Math.floor(now / duration) % numScenes;
  const sceneStart = Math.floor(now / duration) * duration;
  const elapsed = now - sceneStart;
  const frameNum = Math.floor(elapsed * fps);
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

export function buildInfoRow(input: ClaudeInput): string {
  const parts: string[] = [];
  const sep = `${SEG.sep} | ${RESET}`;

  const model = input.model?.display_name ?? input.model?.id ?? 'Claude';
  parts.push(`${SEG.model}${BOLD}${model}${RESET}`);

  const cost = input.cost?.total_cost_usd;
  if (typeof cost === 'number') parts.push(`${SEG.cost}$${cost.toFixed(2)}${RESET}`);

  const ctxPct = input.context_window?.used_percentage;
  if (typeof ctxPct === 'number') {
    parts.push(`${SEG.ctx}${contextBar(ctxPct)} ${Math.round(ctxPct)}%${RESET}`);
  }

  const durMs = input.cost?.total_duration_ms;
  if (typeof durMs === 'number') parts.push(`${SEG.elapsed}${formatDuration(durMs)}${RESET}`);

  const cwd = input.workspace?.current_dir;
  if (cwd) parts.push(`${SEG.cwd}${homify(cwd)}${RESET}`);

  const wt = input.workspace?.git_worktree;
  if (wt) parts.push(`${SEG.git}⎇ ${wt}${RESET}`);

  const five = input.rate_limits?.five_hour?.used_percentage;
  if (typeof five === 'number') parts.push(`${SEG.rate}5h:${Math.round(five)}%${RESET}`);

  return parts.join(sep);
}

export function buildPromptRow(input: ClaudeInput): string {
  const name = input.session_name?.trim() || 'hakcerline';
  const id = input.session_id ? `${DIM}[${input.session_id.slice(0, 8)}]${RESET} ` : '';
  return `${id}${SEG.cwd}${BOLD}${name}${RESET}${SEG.sep} ▸${RESET}`;
}

export function sceneLineFor(frames: string[], frameNum: number, width: number, theme: ThemeName): string {
  const frame = frames[frameNum % frames.length];
  const fitted = fitToWidth(frame, width);
  return colorizeScene(fitted, theme);
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
