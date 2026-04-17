import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { homedir } from 'os';
import type { Config, Scene, ThemeName } from './types.js';

const DEFAULT_CONFIG: Config = {
  packs: ['all'],
  duration: 30,
  theme: 'random',
  effect: 'glow',
  paused: false,
  customScenesDir: null,
  exclude: [],
  only: null,
};

const VALID_THEMES: ThemeName[] = ['cyan_blue', 'purple_pink', 'green_cyan', 'fire', 'ocean', 'synthwave', 'matrix', 'random'];

function expandHome(p: string): string {
  if (p.startsWith('~')) return join(homedir(), p.slice(1));
  return p;
}

export function loadConfig(): Config {
  const configPath = join(homedir(), '.config', 'hakcerline', 'config.json');
  if (!existsSync(configPath)) return { ...DEFAULT_CONFIG };
  try {
    const raw = JSON.parse(readFileSync(configPath, 'utf8'));
    const cfg: Config = {
      packs: Array.isArray(raw.packs) ? raw.packs : DEFAULT_CONFIG.packs,
      duration: typeof raw.duration === 'number' && raw.duration > 0 ? raw.duration : DEFAULT_CONFIG.duration,
      theme: VALID_THEMES.includes(raw.theme) ? raw.theme : DEFAULT_CONFIG.theme,
      effect: typeof raw.effect === 'string' ? raw.effect : DEFAULT_CONFIG.effect,
      paused: raw.paused === true,
      customScenesDir: typeof raw.customScenesDir === 'string' ? expandHome(raw.customScenesDir) : DEFAULT_CONFIG.customScenesDir,
      exclude: Array.isArray(raw.exclude) ? raw.exclude : DEFAULT_CONFIG.exclude,
      only: Array.isArray(raw.only) && raw.only.length > 0 ? raw.only : null,
    };
    return cfg;
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

function loadSceneFile(path: string): Scene | null {
  try {
    const data = JSON.parse(readFileSync(path, 'utf8'));
    if (!data.id || !Array.isArray(data.frames) || data.frames.length === 0) return null;
    return {
      id: data.id,
      name: data.name ?? data.id,
      pack: data.pack ?? 'custom',
      frames: data.frames,
    };
  } catch {
    return null;
  }
}

function scanDir(dir: string): Scene[] {
  const out: Scene[] = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...scanDir(full));
    else if (entry.endsWith('.json')) {
      const s = loadSceneFile(full);
      if (s) out.push(s);
    }
  }
  return out;
}

export function loadScenes(config: Config, bundledDir: string): Scene[] {
  const all: Scene[] = [];
  all.push(...scanDir(bundledDir));
  if (config.customScenesDir) all.push(...scanDir(config.customScenesDir));

  let filtered = all;
  if (config.only && config.only.length > 0) {
    const want = new Set(config.only);
    filtered = all.filter((s) => want.has(s.id));
  } else {
    const packs = config.packs.includes('all')
      ? null
      : new Set([...config.packs, 'custom']);
    if (packs) filtered = filtered.filter((s) => packs.has(s.pack));
    if (config.exclude.length > 0) {
      const skip = new Set(config.exclude);
      filtered = filtered.filter((s) => !skip.has(s.id));
    }
  }

  filtered.sort((a, b) => a.id.localeCompare(b.id));
  return filtered;
}

export function resolveBundledScenesDir(fromFile: string): string {
  return resolve(fromFile, '..', '..', 'scenes');
}

export const VALID_THEME_LIST = VALID_THEMES;
export const EFFECT_LIST = ['wave', 'rain', 'decrypt', 'sparkle', 'beams', 'glow'];

function configPath(): string {
  return join(homedir(), '.config', 'hakcerline', 'config.json');
}

function readRawConfig(): Record<string, unknown> {
  const p = configPath();
  if (!existsSync(p)) return {};
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return {}; }
}

function writeRawConfig(raw: Record<string, unknown>): string {
  const p = configPath();
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, JSON.stringify(raw, null, 2) + '\n');
  return p;
}

export function setConfigKey(key: string, value: unknown): string {
  const raw = readRawConfig();
  raw[key] = value;
  return writeRawConfig(raw);
}
