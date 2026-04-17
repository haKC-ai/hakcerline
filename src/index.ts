#!/usr/bin/env node
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadConfig, loadScenes, resolveBundledScenesDir, setConfigKey, VALID_THEME_LIST, EFFECT_LIST } from './config.js';
import {
  buildInfoRowStyled,
  getSceneAndFrame,
  sceneLineFor,
  terminalWidth,
  truncateAnsi,
  fitToWidth,
  EFFECTS,
  EFFECT_NAMES,
  PALETTES,
  PALETTE_NAMES,
  batchRender,
  type InfoContext,
} from './renderer.js';
import {
  hakcerlineConfigDir,
  installerRootFromFile,
  printMenuStatic,
  removeClaudeSettings,
  removeHakcerlineConfig,
  runInstaller,
  writeClaudeSettings,
  writeHakcerlineConfig,
} from './installer.js';
import { existsSync } from 'fs';
import type { ClaudeInput } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const BUNDLED_SCENES = resolveBundledScenesDir(__filename);
const BUNDLED_ROOT = installerRootFromFile(__filename);

function readStdinSync(): string {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function parseInput(raw: string): ClaudeInput {
  if (!raw.trim()) return {};
  try {
    return JSON.parse(raw) as ClaudeInput;
  } catch {
    return {};
  }
}

async function cmdInstall(): Promise<void> {
  const result = await runInstaller(BUNDLED_ROOT);
  if (!result.confirmed) {
    console.log('\nhakcerline: install cancelled');
    return;
  }
  const configPath = writeHakcerlineConfig(result);
  const settingsPath = writeClaudeSettings(__filename);
  console.log('');
  console.log(`\x1b[38;5;46m✓\x1b[0m hakcerline config   → ${configPath}`);
  console.log(`\x1b[38;5;46m✓\x1b[0m claude statusLine   → ${settingsPath}`);
  console.log(`\x1b[38;5;208m  packs:\x1b[0m ${result.packs.join(', ')}`);
  console.log(`\x1b[38;5;208m  theme:\x1b[0m ${result.theme}`);
  console.log(`\x1b[38;5;208m  duration:\x1b[0m ${result.duration}s`);
  console.log('\nrestart Claude Code to see the statusline light up.');
}

function promptYesNo(question: string): Promise<boolean> {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    const stdout = process.stdout;
    stdout.write(question);
    stdin.resume();
    stdin.setEncoding('utf8');
    const onData = (data: string) => {
      stdin.pause();
      stdin.removeListener('data', onData);
      const answer = data.trim().toLowerCase();
      resolve(answer === 'y' || answer === 'yes');
    };
    stdin.on('data', onData);
  });
}

async function cmdUninstall(): Promise<void> {
  try {
    const removed = removeClaudeSettings();
    if (removed) console.log(`\x1b[38;5;46m✓\x1b[0m removed statusLine from ${removed}`);
    else console.log('hakcerline: no statusLine set');

    const cfgDir = hakcerlineConfigDir();
    if (existsSync(cfgDir)) {
      const nuke = await promptYesNo(`\nalso nuke \x1b[38;5;203m${cfgDir}\x1b[0m (config + custom scenes)? [y/N] `);
      if (nuke) {
        const wiped = removeHakcerlineConfig();
        if (wiped) console.log(`\x1b[38;5;46m✓\x1b[0m wiped ${wiped}`);
      } else {
        console.log('  kept config dir');
      }
    }
  } catch (e) {
    console.error(`hakcerline: ${(e as Error).message}`);
    process.exit(1);
  }
}

function cmdList(): void {
  const config = loadConfig();
  const scenes = loadScenes(config, BUNDLED_SCENES);
  if (scenes.length === 0) {
    console.log('hakcerline: no scenes loaded');
    return;
  }
  const byPack = new Map<string, typeof scenes>();
  for (const s of scenes) {
    const arr = byPack.get(s.pack) ?? [];
    arr.push(s);
    byPack.set(s.pack, arr);
  }
  console.log(`hakcerline: ${scenes.length} scenes loaded\n`);
  for (const [pack, list] of byPack) {
    console.log(`  ${pack} (${list.length})`);
    for (const s of list) console.log(`    ${s.id.padEnd(28)} ${s.name.padEnd(24)} ${s.frames.length}f`);
    console.log('');
  }
}

function cmdVersion(): void {
  try {
    const pkgPath = join(dirname(__filename), '..', 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    console.log(`hakcerline ${pkg.version}`);
  } catch {
    console.log('hakcerline (unknown version)');
  }
}

function cmdTheme(name?: string): void {
  if (!name) {
    const cfg = loadConfig();
    console.log(`current: ${cfg.theme}`);
    console.log(`available: ${VALID_THEME_LIST.join(', ')}`);
    return;
  }
  if (!VALID_THEME_LIST.includes(name as any)) {
    console.log(`unknown theme: ${name}`);
    console.log(`available: ${VALID_THEME_LIST.join(', ')}`);
    return;
  }
  setConfigKey('theme', name);
  console.log(`\x1b[38;5;46m✓\x1b[0m theme → ${name}`);
}

function cmdEffect(name?: string): void {
  if (!name) {
    const cfg = loadConfig();
    console.log(`current: ${cfg.effect ?? 'auto (cycles per scene)'}`);
    console.log(`available: ${EFFECT_LIST.join(', ')}, auto`);
    return;
  }
  if (name === 'auto' || name === 'reset') {
    setConfigKey('effect', null);
    console.log(`\x1b[38;5;46m✓\x1b[0m effect → auto`);
    return;
  }
  if (!EFFECT_LIST.includes(name)) {
    console.log(`unknown effect: ${name}`);
    console.log(`available: ${EFFECT_LIST.join(', ')}, auto`);
    return;
  }
  setConfigKey('effect', name);
  console.log(`\x1b[38;5;46m✓\x1b[0m effect → ${name}`);
}

function cmdPause(): void {
  const cfg = loadConfig();
  const next = !cfg.paused;
  setConfigKey('paused', next);
  console.log(`\x1b[38;5;46m✓\x1b[0m animation ${next ? 'paused' : 'resumed'}`);
}

function cmdDuration(val?: string): void {
  if (!val) {
    const cfg = loadConfig();
    console.log(`current: ${cfg.duration}s`);
    return;
  }
  const n = parseInt(val, 10);
  if (!n || n < 5) {
    console.log('duration must be >= 5 seconds');
    return;
  }
  setConfigKey('duration', n);
  console.log(`\x1b[38;5;46m✓\x1b[0m duration → ${n}s`);
}

function cmdStatus(): void {
  const cfg = loadConfig();
  const scenes = loadScenes(cfg, BUNDLED_SCENES);
  console.log(`\x1b[1;38;5;51mhakcerline status\x1b[0m`);
  console.log(`  theme:    ${cfg.theme}`);
  console.log(`  effect:   ${cfg.effect ?? 'auto'}`);
  console.log(`  duration: ${cfg.duration}s`);
  console.log(`  paused:   ${cfg.paused}`);
  console.log(`  scenes:   ${scenes.length}`);
  console.log(`  packs:    ${cfg.packs.join(', ')}`);
}

function cmdHelp(): void {
  console.log(`hakcerline — animated statusline for Claude Code

usage:
  hakcerline install              write statusLine to ~/.claude/settings.json
  hakcerline uninstall            remove statusLine from settings.json
  hakcerline list                 list loaded scenes
  hakcerline menu                 render the installer menu (non-interactive preview)
  hakcerline version              print version
  hakcerline help                 show this

live controls (takes effect next tick):
  hakcerline theme [name]         get/set theme (${VALID_THEME_LIST.join(', ')})
  hakcerline effect [name]        get/set effect (${EFFECT_LIST.join(', ')}, auto)
  hakcerline pause                toggle animation on/off
  hakcerline duration [seconds]   get/set scene duration
  hakcerline status               show current config

normal mode (called by Claude Code):
  echo '{...}' | hakcerline
`);
}

const WAVE = '\u2581\u2582\u2583\u2584\u2585\u2586\u2587\u2588\u2587\u2586\u2585\u2584\u2583\u2582\u2581';

function testSample(width: number, frame: number): string {
  // tile the wave pattern, then rotate by frame offset
  let tile = '';
  while (tile.length < width + WAVE.length) tile += WAVE;
  const offset = frame % WAVE.length;
  return tile.slice(offset, offset + width);
}

const LABEL_W = 8;

function cmdTest(paletteName?: string): void {
  const width = terminalWidth();
  const frameNum = 0;
  const sample = testSample(width - LABEL_W, frameNum);
  const chars = Array.from(sample);

  const palNames = paletteName ? [paletteName] : PALETTE_NAMES;

  console.log(`\x1b[1;38;5;51mhakcerline effect tester\x1b[0m\n`);

  for (const pn of palNames) {
    const palette = PALETTES[pn];
    if (!palette) {
      console.log(`  unknown palette: ${pn}`);
      continue;
    }
    console.log(`\x1b[1;38;5;228m${pn}\x1b[0m`);
    for (const name of EFFECT_NAMES) {
      const effect = EFFECTS[name];
      const specs = effect(chars, palette, frameNum);
      const rendered = batchRender(specs);
      const label = `\x1b[38;5;240m${name.padEnd(LABEL_W)}\x1b[0m`;
      process.stdout.write(label + rendered + '\x1b[0m\n');
    }
    console.log('');
  }

  console.log(`\x1b[38;5;240mhakcerline test live [palette] — animated\x1b[0m`);
  console.log(`\x1b[38;5;240mpalettes: ${PALETTE_NAMES.join(', ')}\x1b[0m`);
}

function cmdTestLive(paletteName?: string): void {
  const width = terminalWidth();
  const palette = PALETTES[paletteName ?? PALETTE_NAMES[0]];
  if (!palette) {
    console.log(`unknown palette: ${paletteName}`);
    console.log(`available: ${PALETTE_NAMES.join(', ')}`);
    return;
  }
  const pn = paletteName ?? PALETTE_NAMES[0];
  const numEffects = EFFECT_NAMES.length;

  process.stdout.write('\x1b[?25l');
  process.stdout.write(`\x1b[1;38;5;51meffect tester\x1b[0m ${pn}  (ctrl+c)\n\n`);
  for (const name of EFFECT_NAMES) {
    process.stdout.write(`\x1b[38;5;240m${name.padEnd(LABEL_W)}\x1b[0m\n`);
  }

  let frameNum = 0;
  const interval = setInterval(() => {
    process.stdout.write(`\x1b[${numEffects}A`);
    const sample = testSample(width - LABEL_W, frameNum);
    const chars = Array.from(sample);
    for (const name of EFFECT_NAMES) {
      const effect = EFFECTS[name];
      const specs = effect(chars, palette, frameNum);
      const rendered = batchRender(specs);
      const label = `\x1b[38;5;240m${name.padEnd(LABEL_W)}\x1b[0m`;
      process.stdout.write(`\r${label}${rendered}\x1b[0m\x1b[K\n`);
    }
    frameNum++;
  }, 100);

  process.on('SIGINT', () => {
    clearInterval(interval);
    process.stdout.write('\x1b[?25h\n');
    process.exit(0);
  });
}

function renderStatusline(): void {
  try {
    const config = loadConfig();
    const scenes = loadScenes(config, BUNDLED_SCENES);
    const rawStdin = readStdinSync();
    const input = parseInput(rawStdin);
    const width = terminalWidth();

    const [idx, frameNum] = scenes.length > 0
      ? getSceneAndFrame(scenes.length, config.duration)
      : [0, 0];

    let sceneLine: string;
    let infoCtx: InfoContext | undefined;

    if (config.paused || scenes.length === 0) {
      sceneLine = ''.padEnd(width);
    } else {
      sceneLine = sceneLineFor(scenes[idx].frames, frameNum, width, config.theme, idx, config.effect);
      const activeEffect = config.effect ?? EFFECT_LIST[idx % EFFECT_LIST.length];
      infoCtx = {
        sceneName: scenes[idx].name,
        effectName: activeEffect,
        themeName: config.theme,
      };
    }

    const infoLine = truncateAnsi(buildInfoRowStyled(input, infoCtx), width);

    process.stdout.write(sceneLine + '\n' + infoLine);
  } catch {
    process.stdout.write('\n');
  }
}

async function main(): Promise<void> {
  const arg = process.argv[2];
  switch (arg) {
    case 'install':
      await cmdInstall();
      return;
    case 'uninstall':
      await cmdUninstall();
      return;
    case 'list':
      cmdList();
      return;
    case 'menu':
    case 'preview':
      printMenuStatic(BUNDLED_ROOT, process.argv[3]);
      return;
    case 'test':
      if (process.argv[3] === 'live') cmdTestLive(process.argv[4]);
      else cmdTest(process.argv[3]);
      return;
    case 'theme':
    case 't':
      cmdTheme(process.argv[3]);
      return;
    case 'effect':
    case 'fx':
    case 'e':
      cmdEffect(process.argv[3]);
      return;
    case 'pause':
    case 'toggle':
    case 'p':
      cmdPause();
      return;
    case 'hide':
    case 'h':
      cmdPause();
      return;
    case 'duration':
      cmdDuration(process.argv[3]);
      return;
    case 'status':
      cmdStatus();
      return;
    case 'version':
    case '-v':
    case '--version':
      cmdVersion();
      return;
    case 'help':
    case '-h':
    case '--help':
      cmdHelp();
      return;
    default:
      renderStatusline();
  }
}

main().catch((e) => {
  console.error('hakcerline:', e);
  process.exit(1);
});
