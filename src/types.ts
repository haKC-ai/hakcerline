export interface Scene {
  id: string;
  name: string;
  pack: string;
  frames: string[];
}

export interface Config {
  packs: string[];
  duration: number;
  theme: ThemeName;
  effect: string | null;
  paused: boolean;
  customScenesDir: string | null;
  exclude: string[];
  only: string[] | null;
}

export type ThemeName = 'cyan_blue' | 'purple_pink' | 'green_cyan' | 'fire' | 'ocean' | 'synthwave' | 'matrix' | 'random';

export interface ClaudeModel {
  id?: string;
  display_name?: string;
}

export interface ClaudeCost {
  total_cost_usd?: number;
  total_duration_ms?: number;
  total_lines_added?: number;
  total_lines_removed?: number;
}

export interface ClaudeContext {
  used_percentage?: number;
  remaining_percentage?: number;
  context_window_size?: number;
}

export interface ClaudeWorkspace {
  current_dir?: string;
  project_dir?: string;
  git_worktree?: string;
}

export interface ClaudeRateWindow {
  used_percentage?: number;
  resets_at?: number;
}

export interface ClaudeRateLimits {
  five_hour?: ClaudeRateWindow;
  seven_day?: ClaudeRateWindow;
}

export interface ClaudeInput {
  model?: ClaudeModel;
  cost?: ClaudeCost;
  context_window?: ClaudeContext;
  workspace?: ClaudeWorkspace;
  session_id?: string;
  session_name?: string;
  rate_limits?: ClaudeRateLimits;
}
