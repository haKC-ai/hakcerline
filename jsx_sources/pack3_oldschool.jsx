import { useState, useEffect, useRef } from "react";

const WIDTH = 100;
const pad = (s, w = WIDTH) => {
  if (s.length < w) return s + " ".repeat(w - s.length);
  return s.slice(0, w);
};

// ── SCENE 18: Blue Box / Phreaking ──
// Cap'n Crunch 2600Hz tone + MF dialing visualization
function blueBox() {
  const mfTones = [
    { digit: "KP", freq: "1100+1700" },
    { digit: "1",  freq: "700+900" },
    { digit: "8",  freq: "900+1500" },
    { digit: "0",  freq: "1300+1500" },
    { digit: "0",  freq: "1300+1500" },
    { digit: "5",  freq: "900+1100" },
    { digit: "5",  freq: "900+1100" },
    { digit: "1",  freq: "700+900" },
    { digit: "2",  freq: "700+1100" },
    { digit: "1",  freq: "700+900" },
    { digit: "2",  freq: "700+1100" },
    { digit: "ST", freq: "1500+1700" },
  ];
  const waveChars = "▁▂▃▄▅▆▇█▇▆▅▄▃▂▁";
  let toneIdx = 0;
  let phase = 0; // 0=seize, 1=dial, 2=route

  return (frame) => {
    const cycle = frame % 60;

    if (cycle < 8) {
      // 2600Hz trunk seize
      const wavePos = frame % waveChars.length;
      let wave = "";
      for (let i = 0; i < 30; i++) {
        wave += waveChars[(wavePos + i * 2) % waveChars.length];
      }
      return pad(` ☎ 2600Hz ████ TRUNK SEIZE ████ ${wave} │ Cap'n Crunch whistle detected`);
    } else if (cycle < 40) {
      // MF tone dialing
      const ti = Math.floor((cycle - 8) / 3) % mfTones.length;
      const tone = mfTones[ti];
      const wavePos = frame % waveChars.length;
      let wave = "";
      for (let i = 0; i < 16; i++) {
        wave += waveChars[(wavePos + i * 3) % waveChars.length];
      }
      const dialed = mfTones.slice(0, ti + 1).map(t => t.digit).join(" ");
      return pad(` ☎ MF TONE: ${tone.digit.padEnd(2)} (${tone.freq}Hz) │ ${wave} │ DIALED: ${dialed}`);
    } else {
      // routed
      const blink = frame % 4 < 2;
      const status = blink ? "CONNECTED" : "C0NNECTED";
      return pad(` ☎ BLUE BOX │ ${status} ── TOLL FREE ── OPERATOR TRUNK #${37 + (frame % 12)} │ duration: ${Math.floor(frame * 0.08)}m`);
    }
  };
}

// ── SCENE 19: Warez NFO Scroller ──
// Classic NFO file with group greetz, release info
function warezNfo() {
  const lines = [
    "═══════════════════════════════════════════════════════════════════════════",
    "      ▄▄▄   ▄▄▄   ▄▄▄   ▄▄▄   ▄▄▄       RAZOR 1911       ▄▄▄   ▄▄▄    ",
    "═══════════════════════════════════════════════════════════════════════════",
    " Release: Microsoft.Office.97.Pro-RAZOR                                  ",
    " Date...: 1997/03/15        Size: 47x1.44MB                              ",
    " Cracker: The Renegade      Type: Application                            ",
    " Supplier: Dark Avenger     Protection: Serial                           ",
    "───────────────────────────────────────────────────────────────────────────",
    " GREETZ: PARADOX - FAIRLIGHT - CLASS - MYTH - DRINK OR DIE - HYBRID      ",
    " SHOUTZ: #razor on EFnet - all our couriers - the scene lives            ",
    " NFO BY: RaD Man / ACiD                                                  ",
    "───────────────────────────────────────────────────────────────────────────",
    " IF YOU LIKE THIS SOFTWARE, BUY IT. (lol)                                ",
    "═══════════════════════════════════════════════════════════════════════════",
  ];
  const allText = lines.join("  ▏  ");
  let offset = 0;

  return (frame) => {
    const visible = allText.slice(offset, offset + WIDTH);
    offset = (offset + 1) % allText.length;
    return pad(visible || allText.slice(0, WIDTH));
  };
}

// ── SCENE 20: L0phtCrack ──
// Password hash cracking with progress
function l0phtcrack() {
  const hashes = [
    { user: "Administrator", hash: "aad3b435b51404ee", status: "CRACKED", pass: "P@ssw0rd" },
    { user: "jsmith",        hash: "e52cac67419a9a22", status: "CRACKED", pass: "summer99" },
    { user: "backup_svc",    hash: "31d6cfe0d16ae931", status: "CRACKED", pass: "(empty)" },
    { user: "dbadmin",       hash: "a87f32deed765026", status: "WORKING", pass: "????????" },
    { user: "ceo_mwilson",   hash: "0cb6948805f797bf", status: "CRACKED", pass: "golf1234" },
    { user: "root",          hash: "7f2592ec69894a18", status: "WORKING", pass: "????????" },
    { user: "guest",         hash: "31d6cfe0d16ae931", status: "CRACKED", pass: "(empty)" },
    { user: "sysadmin",      hash: "f9e37e83b83c4720", status: "CRACKED", pass: "changeme!" },
  ];
  let hashIdx = 0;
  let dictPos = 0;

  return (frame) => {
    const h = hashes[hashIdx % hashes.length];
    const cycle = frame % 8;

    if (cycle < 5) {
      // cracking animation
      dictPos += Math.floor(Math.random() * 50000);
      const attempts = ["dictionary", "hybrid", "brute"][frame % 3];
      const speed = (12000 + Math.floor(Math.random() * 8000)).toLocaleString();
      const spinner = ["\\", "|", "/", "-"][frame % 4];
      return pad(` L0phtCrack 2.5 │ ${h.user}:${h.hash} │ ${attempts} ${spinner} │ ${speed} h/s │ dict pos: ${dictPos}`);
    } else {
      if (h.status === "CRACKED") {
        hashIdx++;
        return pad(` L0phtCrack 2.5 │ *** CRACKED *** ${h.user} ── ${h.pass} │ ${(hashIdx)} of ${hashes.length} recovered`);
      } else {
        hashIdx++;
        return pad(` L0phtCrack 2.5 │ ${h.user} ── still working... │ switching to brute force mode`);
      }
    }
  };
}

// ── SCENE 21: Morris Worm Spread ──
// Watching the 1988 worm propagate across hosts
function morrisWorm() {
  const hosts = [
    "prep.ai.mit.edu", "ucbvax.berkeley.edu", "purdue.edu", "cs.utah.edu",
    "rand.org", "rice.edu", "ames.arc.nasa.gov", "think.com",
    "harvard.edu", "cmu.edu", "rutgers.edu", "stanford.edu",
    "ll.mit.edu", "sri.com", "uunet.uu.net", "bbn.com",
  ];
  let infected = [];
  let hostIdx = 0;

  return (frame) => {
    const cycle = frame % 6;

    if (cycle < 2) {
      // fingerd exploit attempt
      const target = hosts[hostIdx % hosts.length];
      return pad(` rtm_worm │ fingerd overflow ▸ ${target} │ sending 536-byte payload...`);
    } else if (cycle < 4) {
      // sendmail exploit
      const target = hosts[hostIdx % hosts.length];
      const success = Math.random() > 0.2;
      if (success && !infected.includes(target)) {
        infected.push(target);
      }
      const status = success ? "INFECTED" : "PATCHED";
      hostIdx++;
      return pad(` rtm_worm │ sendmail DEBUG ▸ ${target} │ ${status} │ total: ${infected.length}/${hosts.length}`);
    } else {
      // propagation map
      const bar = hosts.map(h => infected.includes(h) ? "█" : "░").join("");
      return pad(` rtm_worm │ NOV 2 1988 │ ${bar} │ ${infected.length} hosts │ load avg: ${(1 + infected.length * 0.8).toFixed(1)}`);
    }
  };
}

// ── SCENE 22: Cult of the Dead Cow ──
// cDc text file header + Back Orifice connection
function cdcBO() {
  const phases = [
    " cDc communications │ est. 1984 │ CULT OF THE DEAD COW │ Lubbock, TX",
    " cDc #337 │ 'Hacking for Rights' │ by Omega │ 12/29/98",
    " Back Orifice 2000 │ Remote Administration Suite │ v1.0.0",
    " BO2K ▸ Scanning subnet 192.168.1.0/24 for open servers...",
  ];
  const targets = [
    { ip: "192.168.1.14", os: "Win98 SE", name: "FRONTDESK" },
    { ip: "192.168.1.23", os: "Win95 OSR2", name: "ACCOUNTING" },
    { ip: "192.168.1.45", os: "WinNT 4.0", name: "FILESERV01" },
    { ip: "192.168.1.67", os: "Win98", name: "RECEPTION" },
    { ip: "192.168.1.89", os: "Win2000 RC2", name: "DEVBOX" },
  ];
  let targetIdx = 0;

  return (frame) => {
    const bigCycle = Math.floor(frame / 10);

    if (bigCycle < phases.length) {
      // scroll through cDc headers
      const charPos = (frame % 10) * 12;
      const line = phases[bigCycle];
      return pad(line.slice(0, Math.min(charPos, line.length)));
    } else {
      // BO2K active connections
      const t = targets[targetIdx % targets.length];
      const cycle = frame % 8;

      if (cycle < 2) {
        return pad(` BO2K ▸ PING ${t.ip} │ ${t.name} │ ${t.os} │ server responding on 31337`);
      } else if (cycle < 5) {
        const cmds = ["dir C:\\", "net view", "ipconfig /all", "type passwords.txt", "net user"][frame % 5];
        return pad(` BO2K ▸ ${t.ip} │ CMD> ${cmds}`);
      } else {
        targetIdx++;
        const connected = Math.min(targetIdx, targets.length);
        return pad(` BO2K ▸ Active: ${connected}/${targets.length} │ Stealth: ENABLED │ Plugin: bo2k_srv.dll │ Port: 31337`);
      }
    }
  };
}

// ── SCENE 23: Phrack Ezine ──
// Scrolling Phrack article titles from classic issues
function phrackScroll() {
  const articles = [
    "Phrack 7/3  │ The Conscience of a Hacker (The Mentor)",
    "Phrack 49/14 │ Smashing the Stack for Fun and Profit (Aleph1)",
    "Phrack 49/6  │ A Brief History of Hacking (Datastream Cowboy)",
    "Phrack 55/8  │ Raising The Bar For Win32 Exploits (dark spyrit)",
    "Phrack 56/5  │ Once Upon a free() (anonymous)",
    "Phrack 57/9  │ Advances in Format String Exploitation (riq, gera)",
    "Phrack 58/4  │ Bypassing PaX ASLR Protection (Tyler Durden)",
    "Phrack 60/7  │ Defeating Forensic Analysis on Unix (the grugq)",
    "Phrack 61/11 │ Raw Nasties: BSM and You (B-r00t)",
    "Phrack 63/3  │ Hacking the Advanced Keylogger (lcamtuf)",
    "Phrack 66/6  │ Attacking the Core: Kernel Exploiting Notes (twiz)",
    "Phrack 68/2  │ Pseudo-random Number Generation (noptrix)",
    "Phrack 71/1  │ Phrack is not dead. │ 2024",
  ];
  let articleIdx = 0;
  let charPos = 0;

  return (frame) => {
    const art = articles[articleIdx % articles.length];
    const full = ` ──[ ${art} ]──`;

    charPos += 1 + Math.floor(Math.random() * 2);
    if (charPos >= full.length + 15) {
      articleIdx++;
      charPos = 0;
    }

    const visible = full.slice(0, Math.min(charPos, full.length));
    const cursor = frame % 3 < 2 ? "█" : " ";
    return pad(` ${visible}${cursor}`);
  };
}

// ── SCENE 24: Red Box ──
// Payphone coin tone simulation
function redBox() {
  const tones = [
    { coin: "NICKEL",   freq: "1700Hz", pulses: 1, dur: "66ms" },
    { coin: "DIME",     freq: "1700Hz", pulses: 2, dur: "66ms x2" },
    { coin: "QUARTER",  freq: "1700+2200Hz", pulses: 5, dur: "33ms x5" },
  ];
  const waveChars = "░▒▓█▓▒░";
  let coinCount = 0;
  let totalCents = 0;

  return (frame) => {
    const cycle = frame % 10;
    const tone = tones[frame % tones.length];

    if (cycle < 3) {
      // generating tone
      let wave = "";
      for (let i = 0; i < 20; i++) {
        wave += waveChars[(frame * 3 + i * 2) % waveChars.length];
      }
      return pad(` RED BOX │ ${tone.coin} TONE │ ${tone.freq} │ ${tone.pulses} pulse(s) │ ${wave}`);
    } else if (cycle < 6) {
      // depositing
      const cents = tone.coin === "NICKEL" ? 5 : tone.coin === "DIME" ? 10 : 25;
      totalCents += cents;
      coinCount++;
      const dollars = (totalCents / 100).toFixed(2);
      return pad(` RED BOX │ ACTS detected: ${tone.coin} deposited │ Balance: $${dollars} │ Coins: ${coinCount}`);
    } else if (cycle < 8) {
      const target = totalCents >= 50 ? "READY" : `need $${((50 - totalCents) / 100).toFixed(2)} more`;
      return pad(` RED BOX │ Call status: ${target} │ Radio Shack tone dialer mod │ 6.5536MHz crystal`);
    } else {
      return pad(` RED BOX │ ☎ Courtesy of Cap'n Crunch, Joybubbles, and a 6.5MHz crystal from Radio Shack`);
    }
  };
}

// ── SCENE 25: Sub7 RAT ──
// Classic trojan connection manager
function sub7() {
  const victims = [
    { ip: "24.28.145.67",  port: "27374", nick: "d00d_2001", os: "Win98", city: "Houston" },
    { ip: "68.42.117.203", port: "27374", nick: "sk8rboi",   os: "WinME", city: "Phoenix" },
    { ip: "12.174.89.55",  port: "1243",  nick: "coolcat99", os: "Win95", city: "Chicago" },
    { ip: "209.68.14.91",  port: "27374", nick: "gamer_xxx", os: "Win2K", city: "Miami" },
    { ip: "64.233.167.11", port: "6711",  nick: "newbie123", os: "WinXP", city: "Seattle" },
  ];
  let victimIdx = 0;

  return (frame) => {
    const v = victims[victimIdx % victims.length];
    const cycle = frame % 10;

    if (cycle < 2) {
      return pad(` Sub7 2.2 │ Scanning... │ Found server on ${v.ip}:${v.port}`);
    } else if (cycle < 4) {
      return pad(` Sub7 2.2 │ CONNECTED │ ${v.ip} │ ${v.nick} │ ${v.os} │ ${v.city} │ port ${v.port}`);
    } else if (cycle < 7) {
      const actions = [
        "FUN MANAGER ▸ Open CD-ROM",
        "FUN MANAGER ▸ Flip Screen",
        "FUN MANAGER ▸ Hide Taskbar",
        "KEYS ▸ Logging keystrokes",
        "CHAT ▸ 'I see you'",
      ];
      const action = actions[frame % actions.length];
      return pad(` Sub7 2.2 │ ${v.ip} │ ${action} │ ☠`);
    } else {
      victimIdx++;
      return pad(` Sub7 2.2 │ Connections: ${Math.min(victimIdx, victims.length)} │ Notify: IRC #sub7 │ ICQ: 13371337`);
    }
  };
}

// ── SCENE 26: The Mentor's Manifesto ──
// Hacker's Manifesto scrolling text
function manifesto() {
  const text = "This is our world now... the world of the electron and the switch, " +
    "the beauty of the baud. We make use of a service already existing without paying for " +
    "what could be dirt-cheap if it wasn't run by profiteering gluttons, and you call us " +
    "criminals. We explore... and you call us criminals. We seek after knowledge... and you " +
    "call us criminals. We exist without skin color, without nationality, without religious " +
    "bias... and you call us criminals. Yes, I am a criminal. My crime is that of curiosity. " +
    "My crime is that of judging people by what they say and think, not what they look like. " +
    "My crime is that of outsmarting you, something that you will never forgive me for. " +
    "I am a hacker, and this is my manifesto.     ///The Mentor///  January 8, 1986  " +
    "     Phrack Inc. Volume One, Issue 7, Phile 3     ";
  let offset = 0;

  return (frame) => {
    const visible = text.slice(offset, offset + WIDTH - 4);
    offset = (offset + 1) % text.length;
    const prefix = frame % 40 < 20 ? ">" : "│";
    return pad(`${prefix} ${visible}`);
  };
}

// ── SCENE 27: Kevin Mitnick Terminal ──
// Simulated Mitnick-era intrusion - Shimomura's machine
function mitnick() {
  const phases = [
    { cmd: "finger @ariel.sdsc.edu", out: "tsutomu shimomura - not logged in" },
    { cmd: "rsh -l root toad.com", out: "IP sequence prediction... forging SYN" },
    { cmd: "SYN flood -> x-terminal", out: "server.login -> x-terminal: S 1382726990:138272" },
    { cmd: "spoofed ACK accepted", out: "connection ESTABLISHED from forged 130.92.6.97" },
    { cmd: "echo '+ +' >> /.rhosts", out: "trust relationship injected" },
    { cmd: "rsh x-terminal /bin/csh", out: "# root shell obtained" },
    { cmd: "tar cf - /usr/strstrstr/strstrstrstr", out: "retrieving SunOS source..." },
    { cmd: "// Christmas Day, 1994", out: "Shimomura on ski trip in Tahoe" },
  ];
  let phaseIdx = 0;

  return (frame) => {
    const p = phases[phaseIdx % phases.length];
    const cycle = frame % 8;

    if (cycle < 3) {
      const charPos = Math.min((cycle + 1) * 15, p.cmd.length);
      const cursor = frame % 2 === 0 ? "█" : " ";
      return pad(` mitnick@freedom │ $ ${p.cmd.slice(0, charPos)}${cursor}`);
    } else if (cycle < 6) {
      return pad(` mitnick@freedom │ ${p.out}`);
    } else {
      phaseIdx++;
      return pad(` mitnick@freedom │ ──────────────────────────────────────────────────────────────────`);
    }
  };
}

const SCENES = [
  { key: "bluebox",   name: "Blue Box",          init: blueBox,     color: "#00bfff" },
  { key: "wareznfo",  name: "Warez NFO",         init: warezNfo,    color: "#ff6b35" },
  { key: "l0pht",     name: "L0phtCrack",        init: l0phtcrack,  color: "#e040fb" },
  { key: "morris",    name: "Morris Worm",       init: morrisWorm,  color: "#9ece6a" },
  { key: "cdc",       name: "cDc / Back Orifice", init: cdcBO,      color: "#f7768e" },
  { key: "phrack",    name: "Phrack Ezine",      init: phrackScroll, color: "#c0caf5" },
  { key: "redbox",    name: "Red Box",           init: redBox,      color: "#ff1744" },
  { key: "sub7",      name: "Sub7 RAT",          init: sub7,        color: "#e0af68" },
  { key: "manifesto", name: "The Manifesto",     init: manifesto,   color: "#7aa2f7" },
  { key: "mitnick",   name: "Mitnick Terminal",  init: mitnick,     color: "#00ff41" },
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
          hakcer statusline // pack 3 - old school
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
            { name: "Blue Box", desc: "2600Hz trunk seize with waveform visualization, then MF tone dialing sequence. Cap'n Crunch whistle reference. The wave characters pulse in time." },
            { name: "Warez NFO", desc: "Classic NFO file scroller - RAZOR 1911 release info, greetz to scene groups, 'IF YOU LIKE THIS SOFTWARE BUY IT (lol)'. RaD Man / ACiD credit." },
            { name: "L0phtCrack", desc: "NTLM hash cracking with dictionary/hybrid/brute modes. Passwords crack in real time - Administrator:P@ssw0rd, ceo_mwilson:golf1234. Hash rate counter." },
            { name: "Morris Worm", desc: "Nov 2 1988. fingerd overflow and sendmail DEBUG exploit attempts against real-era hosts. Infection map fills as hosts fall. Load average climbs." },
            { name: "cDc / Back Orifice", desc: "Cult of the Dead Cow text file header scrolls into BO2K connection manager. Port 31337. Win98/95/NT targets. FUN MANAGER commands." },
            { name: "Phrack Ezine", desc: "Article titles from classic issues typewriter in - Smashing the Stack (Aleph1), Conscience of a Hacker (The Mentor), through to Phrack 71 (2024)." },
            { name: "Red Box", desc: "Payphone coin tone simulation. NICKEL/DIME/QUARTER frequencies with pulse counts. ACTS detection. Radio Shack tone dialer mod with 6.5MHz crystal." },
            { name: "Sub7 RAT", desc: "Sub7 2.2 connection manager cycling victims. FUN MANAGER actions (Open CD-ROM, Flip Screen). ICQ notify. The golden age of script kiddies." },
            { name: "The Manifesto", desc: "The Mentor's Hacker Manifesto scrolling - 'My crime is that of curiosity.' Phrack Vol 1, Issue 7, January 8 1986. The text that defined a generation." },
            { name: "Mitnick Terminal", desc: "Christmas 1994 Shimomura attack recreation. IP sequence prediction, SYN flood, spoofed ACK, .rhosts injection. Step by step as it happened." },
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
          <span style={{ color: "#e0af68" }}>Running total:</span> 27 scenes across 3 packs.
          Pack 1 (7): Matrix Rain, War Games, Nmap, BBS Login, Packet Race, JP Fence, Hacker Typer.
          Pack 2 (10): Traceroute, Wardialer, Sine Scroller, IRC, Hexdump, SSH Brute, DNS Exfil, Enigma, DEFCON, Metasploit.
          Pack 3 (10): Blue Box, Warez NFO, L0phtCrack, Morris Worm, cDc/BO, Phrack, Red Box, Sub7, Manifesto, Mitnick.
        </div>
      </div>
    </div>
  );
}
