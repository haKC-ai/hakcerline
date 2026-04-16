import { useState, useEffect, useRef } from "react";

const WIDTH = 100;
const pad = (s, w = WIDTH) => {
  if (s.length < w) return s + " ".repeat(w - s.length);
  return s.slice(0, w);
};

// ── SCENE 8: Traceroute ──
// Fake traceroute with hops, latency jitter, AS numbers
function traceroute() {
  const hops = [
    ["1", "gateway.local", "0.4ms", "AS---"],
    ["2", "10.0.0.1", "2.1ms", "AS7922"],
    ["3", "ae-2.r01.denvco01.us.bb.gin.ntt.net", "8.3ms", "AS2914"],
    ["4", "* * *", "", ""],
    ["5", "72.14.215.85", "12.7ms", "AS15169"],
    ["6", "108.170.248.33", "14.2ms", "AS15169"],
    ["7", "* * *", "", ""],
    ["8", "216.239.49.107", "18.9ms", "AS15169"],
    ["9", "lax17s55-in-f14.1e100.net", "19.1ms", "AS15169"],
    ["10", "poisontap.local", "0.1ms", "AS31337"],
    ["11", "* * *", "", ""],
    ["12", "darkcode.ai", "22.4ms", "AS13335"],
  ];
  let hopIdx = 0;
  let scrollBuf = "";

  return (frame) => {
    if (frame % 4 === 0) {
      const h = hops[hopIdx % hops.length];
      const jitter = h[2] ? (parseFloat(h[2]) + (Math.random() * 4 - 2)).toFixed(1) + "ms" : "";
      const entry = h[1] === "* * *"
        ? ` ${h[0].padStart(2)}  * * *`
        : ` ${h[0].padStart(2)}  ${h[1]} (${jitter}) [${h[3]}]`;
      scrollBuf += entry + "  ▏";
      hopIdx++;
    }
    const visible = scrollBuf.slice(-(WIDTH - 16));
    const prefix = " traceroute ▸ ";
    return pad(`${prefix}${visible}`);
  };
}

// ── SCENE 9: Wardialer ──
// ToneLoc/THC-SCAN style phone number scanning
function wardialer() {
  const results = ["CARRIER", "VOICE", "NO ANSWER", "BUSY", "TONE", "VMB", "CARRIER", "BUSY", "NO ANSWER", "VOICE"];
  const prefixes = ["913", "816", "785", "303", "720"];
  let numIdx = 0;
  let phase = 0;

  return (frame) => {
    const prefix = prefixes[numIdx % prefixes.length];
    const suffix = String(1000 + (numIdx * 137) % 9000).padStart(4, "0");
    const number = `(${prefix}) 555-${suffix}`;
    const cycle = frame % 8;
    let line;

    if (cycle < 3) {
      const dots = ".".repeat(cycle + 1);
      const spinner = ["\\", "|", "/", "-"][frame % 4];
      line = ` ToneLoc v1.10 │ SCANNING: ${number}${dots} ${spinner}`;
    } else if (cycle < 6) {
      const result = results[numIdx % results.length];
      const marker = result === "CARRIER" ? ">>>" : "   ";
      line = ` ToneLoc v1.10 │ ${number} ── ${result} ${marker}`;
    } else {
      numIdx++;
      const found = Math.floor(numIdx * 0.2);
      const scanned = numIdx;
      line = ` ToneLoc v1.10 │ Scanned: ${scanned} │ Carriers: ${found} │ Elapsed: ${Math.floor(frame * 0.08)}m`;
    }
    return pad(line);
  };
}

// ── SCENE 10: Demoscene Sine Scroller ──
// Classic demo text with sine wave offset (simulated in single line)
function sineScroller() {
  const text = "     GREETINGS TO ALL SCENERS ... FAIRLIGHT - RAZOR 1911 - PARADOX - SKID ROW - DEVIANCE ... REMEMBER THE AMIGA DAYS ... HACK THE PLANET ... ";
  const textDouble = text + text;
  let offset = 0;

  return (frame) => {
    let line = "";
    const viewWidth = WIDTH;
    for (let i = 0; i < viewWidth; i++) {
      const charIdx = (offset + i) % textDouble.length;
      const ch = textDouble[charIdx];
      // Sine wave affects character selection - uppercase when "high"
      const wave = Math.sin((frame * 0.15) + (i * 0.12));
      if (wave > 0.5) {
        line += ch.toUpperCase();
      } else if (wave > 0) {
        line += ch.toLowerCase();
      } else if (wave > -0.5) {
        line += ch === " " ? " " : "·";
      } else {
        line += " ";
      }
    }
    offset++;
    return line;
  };
}

// ── SCENE 11: IRC Channel ──
// Scrolling IRC messages from classic channels
function ircScroll() {
  const messages = [
    ["#2600", "phreaker", "anyone got the latest phrack?"],
    ["#2600", "acidburn", "check ftp.fc.net/pub/phrack"],
    ["#hack", "z3r0c00l", "pool on the roof must have a leak"],
    ["#hack", "cerealkiller", "hack the planet!"],
    ["#defcon", "darktan", "badge firmware is up on github"],
    ["#defcon", "lost", "goons kicked me out of skytalks again"],
    ["#securit", "tbird", "new openssh 0day on oss-sec"],
    ["#securit", "mudge", "we knew about this one lol"],
    ["#seckc", "hakcer", "who's bringing the lockpicks thursday"],
    ["#seckc", "ndf", "i got the southord set"],
    ["#bbs", "sysop", "new warez drop on node 3"],
    ["#bbs", "elite", "ratio is 1:3 or gtfo"],
  ];
  let msgIdx = 0;
  let charPos = 0;

  return (frame) => {
    const m = messages[msgIdx % messages.length];
    const full = ` ${m[0]} <${m[1]}> ${m[2]}`;

    if (charPos < full.length) {
      charPos += 2 + Math.floor(Math.random() * 3);
    } else {
      msgIdx++;
      charPos = 0;
    }

    const visible = full.slice(0, charPos);
    const cursor = frame % 3 === 0 ? "█" : "";
    return pad(`${visible}${cursor}`);
  };
}

// ── SCENE 12: Hexdump ──
// Scrolling memory hexdump with ASCII sidebar
function hexdump() {
  let addr = 0xDEAD0000;

  return (frame) => {
    const bytes = [];
    const ascii = [];
    for (let i = 0; i < 16; i++) {
      const b = Math.floor(Math.random() * 256);
      bytes.push(b.toString(16).padStart(2, "0"));
      ascii.push(b >= 32 && b < 127 ? String.fromCharCode(b) : ".");
    }
    const hexStr = bytes.slice(0, 8).join(" ") + "  " + bytes.slice(8).join(" ");
    const asciiStr = ascii.join("");
    const currentAddr = (addr + frame * 16).toString(16).padStart(8, "0");
    return pad(` 0x${currentAddr}  ${hexStr}  |${asciiStr}|`);
  };
}

// ── SCENE 13: SSH Brute Force (Defender POV) ──
// Watching auth.log - failed attempts then a catch
function sshBrute() {
  const users = ["root", "admin", "ubuntu", "pi", "test", "deploy", "git", "oracle", "postgres", "nobody", "ftpuser", "www-data"];
  const ips = ["45.33.32.156", "185.220.101.34", "194.165.16.10", "103.224.182.250", "91.240.118.172", "80.82.77.139"];
  let attemptIdx = 0;

  return (frame) => {
    const user = users[attemptIdx % users.length];
    const ip = ips[attemptIdx % ips.length];
    const port = 40000 + Math.floor(Math.random() * 25000);
    const cycle = frame % 6;

    let line;
    if (frame > 0 && frame % 37 === 0) {
      // honeypot catch
      line = ` sshd: HONEYPOT TRIGGERED │ ${ip}:${port} │ user=${user} │ session captured ▸▸▸`;
    } else if (cycle < 4) {
      line = ` sshd: Failed password for ${user} from ${ip} port ${port} ssh2`;
      if (cycle === 3) attemptIdx++;
    } else {
      const count = attemptIdx + 1;
      line = ` sshd: ${count} failed attempts │ ${ips.length} unique IPs │ rate: ${Math.floor(count / Math.max(1, frame * 0.08))}/min`;
    }
    return pad(line);
  };
}

// ── SCENE 14: DNS Exfil ──
// Watching suspicious DNS queries with encoded subdomain data
function dnsExfil() {
  const domains = [".data.evil.ru", ".c2.darkops.cc", ".ex.sketchy.io", ".dns.tunnel.net"];
  const hexChunks = () => {
    let s = "";
    const len = 12 + Math.floor(Math.random() * 20);
    for (let i = 0; i < len; i++) s += "0123456789abcdef"[Math.floor(Math.random() * 16)];
    return s;
  };
  let queryIdx = 0;

  return (frame) => {
    const domain = domains[queryIdx % domains.length];
    const chunk = hexChunks();
    const cycle = frame % 5;
    let line;

    if (cycle < 3) {
      const qtype = Math.random() > 0.5 ? "TXT" : "A";
      line = ` dns ▸ ${qtype} ${chunk}${domain} ── 0.${Math.floor(Math.random() * 9)}ms`;
    } else {
      queryIdx++;
      const bytes = queryIdx * 47;
      const rate = (bytes / Math.max(1, frame * 0.08)).toFixed(0);
      line = ` dns ▸ ⚠ ANOMALY: ${queryIdx} encoded queries │ ~${bytes}B exfiltrated │ ${rate} B/min`;
    }
    return pad(line);
  };
}

// ── SCENE 15: Enigma Machine ──
// Rotor positions cycling with plaintext -> ciphertext
function enigma() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const plaintext = "HACK THE PLANET BEFORE THEY HACK YOU FIRST";
  let charIdx = 0;
  let rotors = [0, 0, 0];

  return (frame) => {
    // advance rotors
    rotors[2] = (rotors[2] + 1) % 26;
    if (rotors[2] === 0) rotors[1] = (rotors[1] + 1) % 26;
    if (rotors[1] === 0 && rotors[2] === 0) rotors[0] = (rotors[0] + 1) % 26;

    const r1 = alphabet[rotors[0]];
    const r2 = alphabet[rotors[1]];
    const r3 = alphabet[rotors[2]];

    // "encrypt" by shifting
    const ptChar = plaintext[charIdx % plaintext.length];
    let ctChar;
    if (ptChar === " ") {
      ctChar = " ";
    } else {
      const shift = rotors[0] + rotors[1] + rotors[2];
      ctChar = alphabet[(alphabet.indexOf(ptChar) + shift) % 26];
    }

    const ptVisible = plaintext.slice(Math.max(0, charIdx - 30), charIdx + 1);
    let ctBuf = "";
    for (let i = Math.max(0, charIdx - 30); i <= charIdx; i++) {
      const c = plaintext[i % plaintext.length];
      if (c === " ") { ctBuf += " "; continue; }
      const s = ((i * 7 + 3) % 26) + rotors[0] + rotors[1];
      ctBuf += alphabet[(alphabet.indexOf(c) + s) % 26];
    }

    charIdx++;
    const rotorDisplay = `[${r1}][${r2}][${r3}]`;
    const lampboard = `█${ctChar}█`;
    return pad(` ENIGMA ${rotorDisplay} │ PT: ${ptVisible.padEnd(32)} │ CT: ${ctBuf.padEnd(32)} │ ${lampboard}`);
  };
}

// ── SCENE 16: DEFCON Level ──
// Threat board cycling through DEFCON levels with indicators
function defconLevel() {
  const levels = [
    { level: 5, name: "FADE OUT", color: "blue", threat: "LOW", events: "Normal readiness" },
    { level: 4, name: "DOUBLE TAKE", color: "green", threat: "GUARDED", events: "Intel gathering increased" },
    { level: 3, name: "ROUND HOUSE", color: "yellow", threat: "ELEVATED", events: "Air Force ready in 15 min" },
    { level: 2, name: "FAST PACE", color: "red", threat: "HIGH", events: "Armed forces ready to deploy in 6h" },
    { level: 1, name: "COCKED PISTOL", color: "white", threat: "SEVERE", events: "Maximum force readiness" },
  ];

  return (frame) => {
    const idx = Math.floor(frame / 8) % levels.length;
    const d = levels[idx];
    const blink = frame % 4 < 2;
    const alert = d.level <= 2 && blink ? " ⚠⚠⚠" : "";
    const bar = "█".repeat(6 - d.level) + "░".repeat(d.level - 1);
    return pad(` DEFCON ${d.level} │ ${d.name.padEnd(14)} │ THREAT: ${d.threat.padEnd(8)} │ ${bar} │ ${d.events}${alert}`);
  };
}

// ── SCENE 17: Metasploit Console ──
// Fake msfconsole session cycling through exploits
function metasploit() {
  const exploits = [
    ["exploit/multi/handler", "reverse_tcp", "LHOST=10.0.0.5 LPORT=4444"],
    ["exploit/windows/smb/ms17_010", "eternalblue", "RHOSTS=192.168.1.0/24"],
    ["auxiliary/scanner/portscan/tcp", "scanner", "RHOSTS=10.10.10.0/24 PORTS=1-1024"],
    ["exploit/unix/ftp/vsftpd_234", "backdoor", "RHOST=192.168.1.10"],
    ["post/multi/manage/shell_to_meterpreter", "upgrade", "SESSION=1"],
    ["exploit/linux/ssh/ceragon_fibeair", "ssh_key", "RHOST=172.16.0.1"],
  ];
  let expIdx = 0;

  return (frame) => {
    const e = exploits[expIdx % exploits.length];
    const cycle = frame % 10;
    let line;

    if (cycle < 2) {
      line = ` msf6 > use ${e[0]}`;
    } else if (cycle < 4) {
      line = ` msf6 exploit(${e[1]}) > set ${e[2]}`;
    } else if (cycle < 6) {
      const spinner = ["-", "\\", "|", "/"][frame % 4];
      line = ` msf6 exploit(${e[1]}) > exploit ${spinner}`;
    } else if (cycle < 8) {
      const success = Math.random() > 0.3;
      if (success) {
        line = ` [*] Meterpreter session ${expIdx + 1} opened │ ${e[2].split("=")[1]?.split(" ")[0]} ▸▸▸`;
      } else {
        line = ` [-] Exploit failed: Connection refused`;
      }
    } else {
      expIdx++;
      const sessions = Math.floor(expIdx * 0.7);
      line = ` msf6 > sessions -l │ Active: ${sessions} │ Jobs: ${expIdx}`;
    }
    return pad(line);
  };
}

const SCENES = [
  { key: "traceroute", name: "Traceroute", init: traceroute, color: "#7aa2f7" },
  { key: "wardialer", name: "Wardialer", init: wardialer, color: "#e0af68" },
  { key: "sinescroll", name: "Sine Scroller", init: sineScroller, color: "#bb9af7" },
  { key: "irc", name: "IRC Channel", init: ircScroll, color: "#9ece6a" },
  { key: "hexdump", name: "Hexdump", init: hexdump, color: "#ff9e64" },
  { key: "sshbrute", name: "SSH Brute (auth.log)", init: sshBrute, color: "#f7768e" },
  { key: "dnsexfil", name: "DNS Exfil", init: dnsExfil, color: "#ff6b35" },
  { key: "enigma", name: "Enigma Machine", init: enigma, color: "#c0caf5" },
  { key: "defcon", name: "DEFCON Level", init: defconLevel, color: "#e040fb" },
  { key: "metasploit", name: "Metasploit", init: metasploit, color: "#00bcd4" },
];

function StatusLine({ animLine, sceneColor }) {
  return (
    <div style={{
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
    }}>
      <div style={{
        color: sceneColor,
        whiteSpace: "pre",
        overflow: "hidden",
        textOverflow: "clip",
        minHeight: "19px",
        opacity: 0.95,
        textShadow: `0 0 8px ${sceneColor}40`,
      }}>
        {animLine}
      </div>
      <div style={{ whiteSpace: "pre", color: "#a9b1d6", minHeight: "19px" }}>
        <span style={{ color: "#7aa2f7" }}>&#x1f50b;</span>
        <span style={{ color: "#bb9af7" }}> Opus 4.6</span>
        <span style={{ color: "#565f89" }}> │ </span>
        <span style={{ color: "#9ece6a" }}>$0.47</span>
        <span style={{ color: "#565f89" }}> │ </span>
        <span style={{ color: "#e0af68" }}>{"██████░░░░"}</span>
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
        setAnimLine(genRef.current(frame));
        setFrame((f) => f + 1);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [frame]);

  const scene = SCENES[activeScene];

  return (
    <div style={{
      background: "#0f0f1a",
      minHeight: "100vh",
      padding: "24px",
      fontFamily: '"JetBrains Mono", monospace',
      color: "#c0caf5",
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{
          marginBottom: "20px",
          fontSize: "11px",
          color: "#565f89",
          textTransform: "uppercase",
          letterSpacing: "2px",
        }}>
          hakcer statusline // pack 2
        </div>

        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          marginBottom: "20px",
        }}>
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

        <StatusLine animLine={animLine} sceneColor={scene.color} />

        <div style={{
          marginTop: "32px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
        }}>
          {[
            { name: "Traceroute", desc: "Hops scroll with AS numbers, latency jitter, and the occasional * * * timeout. Fake but plausible routes through real-looking infrastructure." },
            { name: "Wardialer", desc: "ToneLoc-style phone scanning. ATDT dial, result classification (CARRIER/VOICE/BUSY), running stats. Peak 90s phreaker energy." },
            { name: "Sine Scroller", desc: "Amiga demoscene text scroller. Characters shift between upper/lower/dot/space on a sine wave. Greetz to classic groups." },
            { name: "IRC Channel", desc: "Messages typewriter in from classic channels - #2600, #hack, #defcon, #seckc. Your handle shows up." },
            { name: "Hexdump", desc: "Scrolling memory dump with hex + ASCII sidebar. Addresses increment from 0xDEAD0000. Pure terminal hypnosis." },
            { name: "SSH Brute (auth.log)", desc: "Failed auth attempts scrolling by with IPs and usernames. Every ~37 frames a honeypot triggers - the payoff moment." },
            { name: "DNS Exfil", desc: "Encoded hex subdomains queried against suspicious TLDs. Anomaly alerts count exfiltrated bytes. Blue team vibes." },
            { name: "Enigma Machine", desc: "Rotor positions advance, plaintext scrolls alongside ciphertext. 'HACK THE PLANET' gets scrambled in real time." },
            { name: "DEFCON Level", desc: "Threat board cycling 5 through 1. Bar fills, status escalates, warning symbols blink at levels 1-2." },
            { name: "Metasploit", desc: "msfconsole session cycling through exploits - use, set, exploit, session opened. Meterpreter sessions accumulate." },
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

        <div style={{
          marginTop: "32px",
          padding: "12px",
          background: "#1a1b26",
          border: "1px solid #2a2b3d",
          borderRadius: "6px",
          fontSize: "11px",
          color: "#565f89",
          lineHeight: "1.6",
        }}>
          <span style={{ color: "#e0af68" }}>Total scene count:</span> 17 scenes across 2 packs.
          Pack 1: Matrix Rain, War Games, Nmap, BBS Login, Packet Race, JP Fence, Hacker Typer.
          Pack 2: Traceroute, Wardialer, Sine Scroller, IRC, Hexdump, SSH Brute, DNS Exfil, Enigma, DEFCON, Metasploit.
          All generators follow the same init() → frameGen(n) pattern for drop-in compatibility with hakcer scene registry.
        </div>
      </div>
    </div>
  );
}
