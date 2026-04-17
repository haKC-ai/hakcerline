Generate a hakcerline scene from a prompt. The user describes what they want and you create the scene JSON.

## Scene format

Each scene is a JSON file with this structure:
```json
{
  "id": "scene_id",
  "name": "Display Name",
  "pack": "custom",
  "frames": ["frame0", "frame1", "frame2", ...]
}
```

## Rules for generating frames

**CRITICAL**: The statusline renderer shows text STATICALLY with slow updates (~1 frame change every 2 seconds). Only the COLOR gradient animates across the text. So:

1. **30-60 frames** per scene. Not 400. Not 10.
2. **Small incremental changes** between consecutive frames:
   - Spinner rotation: `◐` → `◓` → `◑` → `◒`
   - Counter tick: `47` → `48`
   - Cursor blink: `█` → ` `
   - New data point appearing at the end
   - Status field changing: `SCANNING` → `COMPLETE`
3. **No scrolling/marquee**. Text stays in place.
4. **No pipes** `|` `│` `▏` as separators. Use instead:
   - `  ` (two spaces) for simple separation
   - ` · ` for light separation
   - ` ▸ ` for flow/direction
   - ` — ` for descriptions
   - ` ── ` for visual breaks
5. **Pad every frame to exactly 120 characters** with trailing spaces.
6. **Use wave chars** `▁▂▃▄▅▆▇█` for any visualizer/meter/waveform sections. These look great with the color effects.
7. **Keep it authentic** to the theme. Research the actual tool/system if needed.

## Separator examples

Bad:  `nmap | 22/tcp open ssh | 80/tcp open http | scanning...`
Good: `nmap ▸ 22/tcp open ssh  80/tcp open http  443/tcp open https ── scanning...`

Bad:  `ToneLoc v1.10 | SCANNING: (913) 555-1234... | Carriers: 3`
Good: `ToneLoc v1.10 ▸ SCANNING: (913) 555-1234...  Carriers: 3  Elapsed: 12m`

## What makes a great scene

- Evokes a specific tool, era, or hacker culture moment
- Has recognizable text that hackers will smile at
- Wave chars (`▁▂▃▄▅▆▇█`) for any audio/signal/meter visualization
- Spinners and blinking cursors for "alive" feeling
- Real-looking data (IPs, ports, hashes, filenames, hostnames)

## Process

1. Read the user's prompt: `$ARGUMENTS`
2. Generate the scene JSON following all rules above
3. Pick an `id` (snake_case, short) and `name` (display name)
4. Set `pack` to `"custom"`
5. Write the file to the user's custom scenes directory:

```bash
# Get custom scenes dir from config, default to ~/.config/hakcerline/scenes
CUSTOM_DIR=$(node -e "try{const c=JSON.parse(require('fs').readFileSync(require('os').homedir()+'/.config/hakcerline/config.json','utf8'));console.log(c.customScenesDir||require('os').homedir()+'/.config/hakcerline/scenes')}catch{console.log(require('os').homedir()+'/.config/hakcerline/scenes')}")
mkdir -p "$CUSTOM_DIR"
```

6. Write the JSON file to `$CUSTOM_DIR/<id>.json`
7. Verify it loads: `hakcerline list`
8. Tell the user the scene is live — it will appear in rotation automatically.

If no prompt provided, ask the user what kind of scene they want.
