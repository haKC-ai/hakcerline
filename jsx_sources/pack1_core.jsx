import { useState, useEffect, useCallback, useRef } from "react";

const WIDTH = 100;

const pad = (s, w = WIDTH) => {
  if (s.length < w) return s + " ".repeat(w - s.length);
  return s.slice(0, w);
};

// ── Matrix Rain ──
function matrixRain() {
  const chars = "ｦｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ".split("");
  const cols = WIDTH;
  const drops = Array.from({ length: cols }, () => Math.floor(Math.random() * 20));
  const speeds = Array.from({ length: cols }, () => [1, 1, 2, 3][Math.floor(Math.random() * 4)]);

  return (frame) => {
    let line = "";
    for (let c = 0; c < cols; c++) {
      if (drops[c] % speeds[c] === 0) {
        line += chars[Math.floor(Math.random() * chars.length)];
      } else {
        line += " ";
      }
      drops[c]++;
      if (drops[c] > 15 + Math.floor(Math.random() * 10)) drops[c] = 0;
    }
    return line;
  };
}

// ── War Games ──
function wargames() {
  const boards = [
    [" │ │ ", "─┼─┼─", " │ │ "],
    ["X│ │ ", "─┼─┼─", " │ │ "],
    ["X│O│ ", "─┼─┼─", " │ │ "],
    ["X│O│ ", "─┼─┼─", "X│ │ "],
    ["X│O│O", "─┼─┼─", "X│ │ "],
    ["X│O│O", "─┼─┼─", "X│X│ "],
    ["X│O│O", "─┼─┼─", "X│X│X"],
  ];
  const messages = [
    "GREETINGS PROFESSOR FALKEN",
    "SHALL WE PLAY A GAME?",
    "GLOBAL THERMONUCLEAR WAR",
    "A STRANGE GAME.",
    "THE ONLY WINNING MOVE IS",
    "NOT TO PLAY.",
    "HOW ABOUT A NICE GAME OF CHESS?",
  ];

  let msgIdx = 0;
  let boardIdx = 0;
  let lastMsgSwitch = 0;

  return (frame) => {
    const bi = Math.min(boardIdx, boards.length - 1);
    const b = boards[bi];
    const boardStr = `  ${b[0]}  `;

    const mi = msgIdx % messages.length;
    const msg = messages[mi];
    const charPos = ((frame - lastMsgSwitch) * 2) % (msg.length + 20);
    const visibleMsg = msg.slice(0, charPos);

    const pct = Math.min(frame / 40, 1.0);
    const barW = 30;
    const filled = Math.floor(pct * barW);
    const bar = "█".repeat(filled) + "░".repeat(barW - filled);

    if (charPos > msg.length + 10) {
      msgIdx++;
      lastMsgSwitch = frame;
    }
    if (frame % 6 === 0 && boardIdx < boards.length - 1) boardIdx++;

    return pad(` ${boardStr} │ ${visibleMsg.padEnd(40)} │ ${bar} `);
  };
}

// ── Nmap Sweep ──
function nmapSweep() {
  const ports = [
    ["22/tcp", "open", "ssh"],
    ["80/tcp", "open", "http"],
    ["443/tcp", "open", "https"],
    ["3306/tcp", "filtered", "mysql"],
    ["8080/tcp", "open", "http-proxy"],
    ["21/tcp", "closed", "ftp"],
    ["25/tcp", "filtered", "smtp"],
    ["53/tcp", "open", "domain"],
    ["6667/tcp", "closed", "irc"],
    ["1337/tcp", "open", "waste"],
    ["31337/tcp", "open", "Elite"],
    ["8443/tcp", "filtered", "https-alt"],
    ["9090/tcp", "open", "zeus-admin"],
  ];
  const spinners = ["◐", "◓", "◑", "◒"];
  let scanLine = "";
  let portIdx = 0;

  return (frame) => {
    if (frame % 3 === 0) {
      const p = ports[portIdx % ports.length];
      scanLine += ` ${p[0]} ${p[1]} ${p[2]} ▏`;
      portIdx++;
    }
    const visible = scanLine.slice(-(WIDTH - 20));
    const prefix = " nmap ▸ ";
    const spinner = spinners[frame % 4];
    const suffix = ` ${spinner} scanning`;
    let display = `${prefix}${visible}`;
    display = display.slice(0, WIDTH - suffix.length) + suffix;
    return pad(display);
  };
}

// ── BBS Login ──
function bbsLogin() {
  const bbses = [
    ["THE DARK SIDE BBS", "PhreakMaster", "4", "14.4k"],
    ["RAZOR 1911 WHQ", "Sector9", "8", "28.8k"],
    ["FAIRLIGHT FTP", "Strider", "2", "T1"],
    ["PIRATES COVE", "CaptHook", "6", "9600"],
    ["HACKER'S HAVEN", "z3r0c00l", "3", "56.6k"],
    ["UNDERGROUND eXPRESS", "DarkLord", "12", "T3"],
    ["ACiD ARTPACKS", "RaD Man", "4", "33.6k"],
    ["iCE WHQ", "Phluid", "6", "ISDN"],
  ];
  let bbsIdx = 0;

  return (frame) => {
    const b = bbses[bbsIdx % bbses.length];
    const cycle = frame % 12;
    let line;

    if (cycle < 2) {
      const dots = ".".repeat(cycle + 1);
      const num = Math.floor(Math.random() * 9000) + 1000;
      line = ` ☎ ATDT 1-900-555-${num}${dots}`;
    } else if (cycle < 4) {
      line = ` ☎ CONNECT ${b[3]} ▏ CARRIER DETECT ▏ 8N1`;
    } else if (cycle < 10) {
      const node = Math.floor(Math.random() * parseInt(b[2])) + 1;
      line = ` ☎ ${b[0]} │ SysOp: ${b[1]} │ Node ${node} of ${b[2]} │ ${b[3]}`;
    } else {
      line = ` ☎ NO CARRIER`;
      if (cycle === 11) bbsIdx++;
    }
    return pad(line);
  };
}

// ── Packet Race ──
function packetRace() {
  const packets = [
    { pos: 0, speed: 1.8, char: "▄▀", trail: "·" },
    { pos: 20, speed: 2.3, char: "▀▄", trail: "·" },
    { pos: 40, speed: 1.2, char: "▄▀", trail: "·" },
  ];

  return (frame) => {
    const line = Array(WIDTH).fill(" ");
    for (const p of packets) {
      const pos = Math.floor(p.pos) % (WIDTH - 4);
      for (let t = 1; t < 7; t++) {
        const tp = pos - t;
        if (tp >= 0 && tp < WIDTH) line[tp] = p.trail;
      }
      if (pos < WIDTH - 2) {
        line[pos] = p.char[0];
        line[pos + 1] = p.char[1];
      }
      p.pos += p.speed;
      if (p.pos >= WIDTH - 2) {
        p.pos = 0;
        p.speed = 1.0 + Math.random() * 2.0;
      }
    }
    return line.join("");
  };
}

// ── JP Fence ──
function jpFence() {
  const zones = [
    "Sector 1: T-Rex Paddock",
    "Sector 4: Raptor Pen",
    "Sector 7: Dilophosaurus",
    "Sector 9: Triceratops",
    "Sector 11: Gallimimus",
    "Sector 12: Perimeter",
  ];

  return (frame) => {
    const zone = zones[frame % zones.length];
    const voltage = frame % 13 !== 0 ? 9800 + Math.floor(Math.random() * 400) : 0;
    let status, fence, warn;
    if (voltage > 0) {
      status = "ARMED";
      fence = "╠═══╬═══╬═══╬═══╬═══╣";
      warn = "";
    } else {
      status = "OFFLINE";
      fence = "╠═x═╬═x═╬═x═╬═x═╬═x═╣";
      warn = " ⚠ BREACH";
    }
    return pad(
      ` ${fence} │ ${zone.padEnd(28)} │ ${String(voltage).padStart(5)}V │ ${status}${warn}`
    );
  };
}

// ── Hacker Typer ──
function hackerTyper() {
  const codeLines = [
    'int main() { exploit_t *x = alloc_payload(0xDEAD);',
    "if (check_aslr(pid)) { bypass_nx(x->shellcode);",
    "memcpy(ret_addr, &jmp_esp, sizeof(void*));",
    "for(int i=0; i<buf_sz; i++) stack[i] ^= 0x41;",
    "connect(sock, (struct sockaddr*)&srv, sizeof(srv));",
    "send(sock, payload, payload_len, MSG_NOSIGNAL);",
    'recv(sock, response, 4096, 0); // await shell',
    'printf("[+] root shell obtained on %s\\n", target);',
    'execve("/bin/sh", args, envp); // game over',
    "free(x); close(sock); return 0xCAFEBABE; }",
  ];

  let scrollBuf = "";
  let lineIdx = 0;
  let charIdx = 0;

  return (frame) => {
    const currentLine = codeLines[lineIdx % codeLines.length];
    const charsToAdd = 2 + Math.floor(Math.random() * 4);
    for (let i = 0; i < charsToAdd; i++) {
      if (charIdx < currentLine.length) {
        scrollBuf += currentLine[charIdx];
        charIdx++;
      } else {
        scrollBuf += " ▏ ";
        lineIdx++;
        charIdx = 0;
        break;
      }
    }
    const visible = scrollBuf.slice(-(WIDTH - 4));
    const cursor = frame % 2 === 0 ? "█" : " ";
    return pad(` ${visible}${cursor}`);
  };
}

const SCENES = [
  { key: "matrix", name: "Matrix Rain", init: matrixRain, color: "#00ff41" },
  { key: "wargames", name: "War Games WOPR", init: wargames, color: "#ff6b35" },
  { key: "nmap", name: "Nmap Sweep", init: nmapSweep, color: "#00bcd4" },
  { key: "bbs", name: "BBS Login", init: bbsLogin, color: "#ffeb3b" },
  { key: "packets", name: "Packet Race", init: packetRace, color: "#e040fb" },
  { key: "jpfence", name: "JP Fence Monitor", init: jpFence, color: "#ff1744" },
  { key: "htyper", name: "Hacker Typer", init: hackerTyper, color: "#76ff03" },
];

// ── Statusline Component ──
function StatusLine({ animLine, sceneColor }) {
  return (
    <div
      style={{
        fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
        fontSize: "12px",
        lineHeight: "1.6",
        background: "#1a1b26",
        borderRadius: "8px",
        padding: "8px 12px",
        border: "1px solid #2a2b3d",
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Animation row - full width */}
      <div
        style={{
          color: sceneColor,
          whiteSpace: "pre",
          overflow: "hidden",
          textOverflow: "clip",
          minHeight: "19px",
          opacity: 0.95,
          textShadow: `0 0 8px ${sceneColor}40`,
        }}
      >
        {animLine}
      </div>

      {/* Merged info row */}
      <div style={{ whiteSpace: "pre", color: "#a9b1d6", minHeight: "19px" }}>
        <span style={{ color: "#7aa2f7" }}>🔋</span>
        <span style={{ color: "#bb9af7" }}> Opus 4.6</span>
        <span style={{ color: "#565f89" }}> │ </span>
        <span style={{ color: "#9ece6a" }}>$0.47</span>
        <span style={{ color: "#565f89" }}> │ </span>
        <span style={{ color: "#e0af68" }}>
          {"██████░░░░"}
        </span>
        <span style={{ color: "#e0af68" }}> 27%</span>
        <span style={{ color: "#565f89" }}> │ </span>
        <span style={{ color: "#c0caf5" }}>1m31s</span>
        <span style={{ color: "#565f89" }}> │ </span>
        <span style={{ color: "#ff9e64" }}>📁 home/hakcer</span>
        <span style={{ color: "#565f89" }}> │ </span>
        <span style={{ color: "#7dcfff" }}>≡1↓ 1.3k↑</span>
        <span style={{ color: "#565f89" }}> │ </span>
        <span style={{ color: "#f7768e" }}>⌂aaca946e</span>
      </div>

      {/* Prompt row */}
      <div style={{ whiteSpace: "pre", color: "#a9b1d6", minHeight: "19px" }}>
        <span style={{ color: "#9ece6a" }}>▸▸</span>
        <span> don't ask on </span>
        <span style={{ color: "#565f89" }}>(shift+tab to cycle)</span>
      </div>
    </div>
  );
}

export default function App() {
  const [activeScene, setActiveScene] = useState(0);
  const [animLine, setAnimLine] = useState("");
  const [frame, setFrame] = useState(0);
  const genRef = useRef(null);

  useEffect(() => {
    genRef.current = SCENES[activeScene].init();
    setFrame(0);
  }, [activeScene]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (genRef.current) {
        const line = genRef.current(frame);
        setAnimLine(line);
        setFrame((f) => f + 1);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [frame]);

  const scene = SCENES[activeScene];

  return (
    <div
      style={{
        background: "#0f0f1a",
        minHeight: "100vh",
        padding: "24px",
        fontFamily: '"JetBrains Mono", monospace',
        color: "#c0caf5",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div
          style={{
            marginBottom: "20px",
            fontSize: "11px",
            color: "#565f89",
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
        >
          hakcer statusline // scene preview
        </div>

        {/* Scene selector */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            marginBottom: "20px",
          }}
        >
          {SCENES.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setActiveScene(i)}
              style={{
                background: i === activeScene ? s.color + "20" : "#1a1b26",
                border: `1px solid ${i === activeScene ? s.color : "#2a2b3d"}`,
                color: i === activeScene ? s.color : "#565f89",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "11px",
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Live preview */}
        <StatusLine animLine={animLine} sceneColor={scene.color} />

        {/* Layout comparison */}
        <div
          style={{
            marginTop: "32px",
            fontSize: "11px",
            color: "#565f89",
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: "12px",
          }}
        >
          layout comparison
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <div
              style={{
                fontSize: "10px",
                color: "#f7768e",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              before (4 rows)
            </div>
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "10px",
                lineHeight: "1.6",
                background: "#1a1b26",
                borderRadius: "6px",
                padding: "8px 10px",
                border: "1px solid #2a2b3d",
                whiteSpace: "pre",
                color: "#a9b1d6",
              }}
            >
              {`🐟 ~~~~ <°))))>  ><(((°> ~~~~
🔋 Opus 4.6 │ $0.47 │ ██░░ 27% │ 1m31s
📁 home/hakcer > ≡1↓ 1.3k↑ > ⌂aaca946e
▸▸ don't ask on (shift+tab)`}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "10px",
                color: "#9ece6a",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              after (3 rows, wide anim)
            </div>
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "10px",
                lineHeight: "1.6",
                background: "#1a1b26",
                borderRadius: "6px",
                padding: "8px 10px",
                border: "1px solid #2a2b3d",
                whiteSpace: "pre",
                color: "#a9b1d6",
              }}
            >
              {`🐟 ~~~~ <°))))>  ><(((°> ~~~~ <°))))>  ><(((°> ~~~~
🔋 Opus 4.6│$0.47│██░░ 27%│1m31s│📁hakcer│≡1↓ 1.3k↑│⌂aaca946e
▸▸ don't ask on (shift+tab to cycle)`}
            </div>
          </div>
        </div>

        {/* Scene descriptions */}
        <div
          style={{
            marginTop: "32px",
            fontSize: "11px",
            color: "#565f89",
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: "12px",
          }}
        >
          scene notes
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          {[
            { name: "Matrix Rain", desc: "Halfwidth katakana falling at variable speeds per column. Density shifts create a corridor effect at full width." },
            { name: "War Games", desc: "Tic-tac-toe endgame plays out left side while WOPR dialogue typewriters on the right. Progress bar fills across the sequence." },
            { name: "Nmap Sweep", desc: "Port scan results scroll right-to-left with spinner. Mix of open/closed/filtered for visual texture." },
            { name: "BBS Login", desc: "ATDT dial sequence, carrier detect, BBS info display, NO CARRIER. Cycles through 8 classic boards." },
            { name: "Packet Race", desc: "Three block-character packets race across the width at randomized speeds with dot trails. Minimal, hypnotic." },
            { name: "JP Fence", desc: "Jurassic Park fence monitoring - voltage readings cycle zones with intermittent OFFLINE/BREACH events." },
            { name: "Hacker Typer", desc: "Fake C exploit code typewriters across the line with blinking cursor. Scrolls left as buffer fills." },
          ].map((s) => (
            <div
              key={s.name}
              style={{
                background: "#1a1b26",
                border: "1px solid #2a2b3d",
                borderRadius: "6px",
                padding: "10px 12px",
              }}
            >
              <div style={{ color: "#7aa2f7", fontSize: "12px", marginBottom: "4px" }}>
                {s.name}
              </div>
              <div style={{ color: "#565f89", fontSize: "11px", lineHeight: "1.5" }}>
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
