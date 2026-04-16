#!/usr/bin/env node
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadConfig, loadScenes, resolveBundledScenesDir } from './config.js';
import {
  buildInfoRow,
  buildPromptRow,
  getSceneAndFrame,
  sceneLineFor,
  terminalWidth,
} from './renderer.js';
import {
  installerRootFromFile,
  printMenuStatic,
  removeClaudeSettings,
  runInstaller,
  writeClaudeSettings,
  writeHakcerlineConfig,
} from './installer.js';
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
  const settingsPath = writeClaudeSettings();
  console.log('');
  console.log(`\x1b[38;5;46m✓\x1b[0m hakcerline config   → ${configPath}`);
  console.log(`\x1b[38;5;46m✓\x1b[0m claude statusLine   → ${settingsPath}`);
  console.log(`\x1b[38;5;208m  packs:\x1b[0m ${result.packs.join(', ')}`);
  console.log(`\x1b[38;5;208m  theme:\x1b[0m ${result.theme}`);
  console.log(`\x1b[38;5;208m  duration:\x1b[0m ${result.duration}s`);
  console.log('\nrestart Claude Code to see the statusline light up.');
}

function cmdUninstall(): void {
  try {
    const removed = removeClaudeSettings();
    if (removed) console.log(`hakcerline: removed statusLine from ${removed}`);
    else console.log('hakcerline: no statusLine set, nothing to remove');
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

function cmdHelp(): void {
  console.log(`hakcerline — animated statusline for Claude Code

usage:
  hakcerline install      write statusLine to ~/.claude/settings.json
  hakcerline uninstall    remove statusLine from settings.json
  hakcerline list         list loaded scenes
  hakcerline menu         render the installer menu (non-interactive preview)
  hakcerline version      print version
  hakcerline help         show this

normal mode (called by Claude Code):
  echo '{...}' | hakcerline
`);
}

function renderStatusline(): void {
  const config = loadConfig();
  const scenes = loadScenes(config, BUNDLED_SCENES);
  const input = parseInput(readStdinSync());
  const width = terminalWidth();

  let sceneLine: string;
  if (scenes.length === 0) {
    sceneLine = ''.padEnd(width);
  } else {
    const [idx, frameNum] = getSceneAndFrame(scenes.length, config.duration);
    sceneLine = sceneLineFor(scenes[idx].frames, frameNum, width, config.theme);
  }

  const infoLine = buildInfoRow(input);
  const promptLine = buildPromptRow(input);

  process.stdout.write(sceneLine + '\n' + infoLine + '\n' + promptLine + '\n');
}

async function main(): Promise<void> {
  const arg = process.argv[2];
  switch (arg) {
    case 'install':
      await cmdInstall();
      return;
    case 'uninstall':
      cmdUninstall();
      return;
    case 'list':
      cmdList();
      return;
    case 'menu':
    case 'preview':
      printMenuStatic(BUNDLED_ROOT);
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
