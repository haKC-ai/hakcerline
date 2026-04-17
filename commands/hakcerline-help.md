Show hakcerline statusline help. Run `hakcerline help` and `hakcerline status`, then display a formatted guide.

```bash
hakcerline status
echo "---"
hakcerline help
```

After running, also display this reference:

## hakcerline — statusline controls

**Change from Claude Code prompt:**
- `/hakcerline t <theme>` — set theme
- `/hakcerline e <effect>` — set effect
- `/hakcerline p` — pause/resume animation
- `/hakcerline h` — hide/show scene row
- `/hakcerline status` — show current config
- `/hakcerline duration 60` — set scene rotation (seconds)

**Themes:** `random` `cyan_blue` `purple_pink` `green_cyan` `fire` `ocean` `synthwave` `matrix`

**Effects:** `auto` `wave` `rain` `decrypt` `sparkle` `beams`

**Config file:** `~/.config/hakcerline/config.json` — all settings persist here, read every tick.

**Install/uninstall:**
- `npm install -g hakcerline && hakcerline install` — set up statusline
- `hakcerline uninstall` — remove from settings.json

**Scene packs:** run `/hakcerline list` to see all 47 loaded scenes and their packs.
