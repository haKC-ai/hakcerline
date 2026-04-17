Run a hakcerline control command. The user's argument is passed directly to the hakcerline CLI.

Commands:
- `t [name]` or `theme [name]` — get/set theme (cyan_blue, purple_pink, green_cyan, fire, ocean, synthwave, matrix, mono, ember, frost, steel, amber, dusk, random)
- `e [name]` or `effect [name]` — get/set effect (wave, rain, decrypt, sparkle, beams, glow, nfo, hack, clean, solid, auto)
- `p` or `pause` — toggle animation on/off
- `h` or `hide` — hide/show scene row
- `status` — show current config
- `duration [seconds]` — set scene duration
- `test` — static effect preview
- `test live [palette]` — animated effect preview

Run the command and report the result:

```bash
hakcerline $ARGUMENTS
```

If no arguments provided, run `hakcerline status`.
