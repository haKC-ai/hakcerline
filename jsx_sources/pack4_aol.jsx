import { useState, useEffect, useRef } from "react";

const WIDTH = 100;
const pad = (s, w = WIDTH) => {
  if (s.length < w) return s + " ".repeat(w - s.length);
  return s.slice(0, w);
};

// ── SCENE 28: AOHell ──
// The legendary AOL hacking tool
function aohell() {
  const actions = [
    { phase: "PHISHER",   detail: "Sending IM as 'TOSAdvisor': Your account needs verification..." },
    { phase: "PUNTER",    detail: "OLH $IM_IN <%n> {GoTo 8} ── target: SurfDude99 ── PUNTED" },
    { phase: "MAIL BOMB", detail: "Queuing 200 emails to AOL TOS... subj: 'i didnt do anything'" },
    { phase: "CC GEN",    detail: "Algo: Luhn mod10 │ Prefix: 4024 │ Generated: 4024-XXXX-XXXX-XXXX" },
    { phase: "SCROLLR",   detail: "lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll" },
    { phase: "ROOM INV",  detail: "Mass invite ▸ 'Free AOL 4 Life' ▸ chat://room/FREE%20AOHELL" },
    { phase: "OVERHEAD",  detail: "$im_in('Welcome to AOL!') // intercepting login creds" },
    { phase: "PUNT WAR",  detail: "Counter-punt detected from xXDarkAngelXx ── deploying shield" },
  ];
  let actionIdx = 0;

  return (frame) => {
    const a = actions[actionIdx % actions.length];
    const cycle = frame % 8;

    if (cycle < 2) {
      const spinner = ["|", "/", "-", "\\"][frame % 4];
      return pad(` AOHell v3.0 │ ${spinner} Loading ${a.phase} module...`);
    } else if (cycle < 6) {
      return pad(` AOHell v3.0 │ [${a.phase}] ${a.detail}`);
    } else {
      actionIdx++;
      const s = Math.floor(actionIdx * 1.5);
      return pad(` AOHell v3.0 │ Screennames harvested: ${s * 12} │ Punts: ${s} │ Keyword: AOL secret room`);
    }
  };
}

// ── SCENE 29: AOL Chat Room ──
// Classic chatroom with A/S/L, punters, TOS
function aolChat() {
  const messages = [
    ["OnlineHost",     "*** You are in 'Town Square - 14' ***"],
    ["SurfDude99",     "14/m/cali a/s/l?"],
    ["xXAngelXx",      "16/f/tx hiii"],
    ["H4CK3RKING",     "DOES ANYONE HAVE AOHELL 3.0"],
    ["OnlineHost",     "*** TOSAdvisor has entered the room ***"],
    ["TOSAdvisor",     "Reminder: Please do not share personal information."],
    ["SurfDude99",     "lol thats a phisher dont give ur pw"],
    ["DarkShadow",     "!punter xXAngelXx"],
    ["OnlineHost",     "*** xXAngelXx has left the room ***"],
    ["H4CK3RKING",     "LOL PUNTED"],
    ["BillyTheKid",    "keyword: warez"],
    ["OnlineHost",     "*** H4CK3RKING's connection has been terminated ***"],
    ["SurfDude99",     "LMAOOO HE GOT TOSSED"],
    ["DarkShadow",     "anyone got a new s/n generator? my 47th acct lol"],
    ["OnlineHost",     "*** You have been in this room for 2 hours ***"],
  ];
  let msgIdx = 0;
  let charPos = 0;

  return (frame) => {
    const m = messages[msgIdx % messages.length];
    const isHost = m[0] === "OnlineHost";
    const full = isHost ? ` ${m[1]}` : ` ${m[0]}: ${m[1]}`;

    charPos += 2 + Math.floor(Math.random() * 3);
    if (charPos >= full.length + 8) {
      msgIdx++;
      charPos = 0;
    }
    const visible = full.slice(0, Math.min(charPos, full.length));
    return pad(visible);
  };
}

// ── SCENE 30: Legend of the Red Dragon (LORD) ──
// Classic BBS door game
function lordGame() {
  const events = [
    { line: " The Daily Happenings of the Land..." },
    { line: " Seth Able the Bard attacked a small Thief for 12 hitpoints!" },
    { line: " Violet murdered Barak the Wizard in cold blood!" },
    { line: " Gandalf was killed by the Red Dragon today!" },
    { line: " haKCer found the Gem in the Dark Cloak Forest." },
    { line: " haKCer flirted with Violet at the Inn. She blushed." },
    { line: " Turgon cheated death and was resurrected by the Healer!" },
    { line: " ──────────────────────────────────────────────────────" },
    { line: " [L.O.R.D.] Forest ▸ You encounter a Huge Ugly Ogre! (HP: 45)" },
    { line: " [FIGHT] Your hit! 18 damage! Ogre swings... miss!" },
    { line: " [FIGHT] Critical strike!! 34 damage! The Ogre falls!" },
    { line: " [LOOT] You found 126 gold and a Huge Axe!" },
    { line: " [INN] Bartender says: 'What'll it be, haKCer?'" },
    { line: " [INN] You flirt with Violet. She giggles. (Charm +1)" },
    { line: " [FOREST] 8 forest fights remaining today." },
  ];
  let eventIdx = 0;
  let charPos = 0;

  return (frame) => {
    const e = events[eventIdx % events.length];
    charPos += 2 + Math.floor(Math.random() * 2);
    if (charPos >= e.line.length + 12) {
      eventIdx++;
      charPos = 0;
    }
    const visible = e.line.slice(0, Math.min(charPos, e.line.length));
    const cursor = frame % 3 < 2 ? "█" : " ";
    return pad(`${visible}${cursor}`);
  };
}

// ── SCENE 31: TradeWars 2002 ──
// BBS door game - space trading
function tradewars() {
  const events = [
    " TradeWars 2002 v3.09 │ Sector: 1 │ Turns left: 847",
    " ▸ Scanning sector... Port: Sol │ Trading: Fuel Ore, Organics, Equipment",
    " ▸ BUY 50 Fuel Ore @ 21cr │ SELL 50 Equipment @ 88cr │ Profit: 3,350cr",
    " ▸ Warping to Sector 47... │ Avoid: Sector 13 (Ferrengi territory)",
    " ▸ ALERT: Proximity mine detected! Evasion... SUCCESS",
    " ▸ Corp msg from [NDF]: 'meet at stardock, planning raid on sector 13'",
    " ▸ Docking at StarDock │ Credits: 45,221 │ Ship: Imperial StarShip │ Fighters: 200",
    " ▸ Planet haKCer's Haven │ Pop: 12,441 │ Citadel Level 3 │ Quasar Cannon ARMED",
    " ▸ Deploying 50 fighters in sector 47 │ Mode: TOLL",
    " ▸ INCOMING: The Ferrengi are attacking sector 47! │ 200 fighters vs 180 fighters",
    " ▸ VICTORY │ Enemy lost 180 fighters │ You lost 34 │ Remaining: 166",
    " ▸ End of day │ Rank: #3 │ Alignment: EVIL (-412) │ Turns used: 153",
  ];
  let eventIdx = 0;

  return (frame) => {
    const cycle = frame % 6;
    if (cycle === 0) eventIdx++;
    const e = events[eventIdx % events.length];
    const charPos = Math.min((cycle + 1) * 18, e.length);
    const cursor = frame % 2 === 0 ? "█" : " ";
    return pad(`${e.slice(0, charPos)}${cursor}`);
  };
}

// ── SCENE 32: MUD Session ──
// Text adventure / MUD gameplay
function mudSession() {
  const lines = [
    " [Midgaard] The Temple Square ── Exits: N S E W │ Players: 14",
    " A large fountain dominates the square. Acolytes tend the eternal flame.",
    " > look sword",
    " A gleaming longsword of elvish make. Dam: 4d6+2 │ MAGIC │ +2 HIT",
    " > north",
    " [Midgaard] The Dark Alley ── Exits: S │ A RAT scurries past.",
    " > kill rat",
    " You slice the rat! [14 dmg] The rat bites you! [3 dmg] HP: 247/250",
    " The rat is DEAD! You gain 12 exp. You find 3 gold coins.",
    " > cast 'magic missile' troll",
    " Your magic missile strikes the cave troll! [28 dmg] CRITICAL!",
    " The cave troll CRUSHES you! [19 dmg] HP: 228/250",
    " > quaff heal",
    " You quaff a potion of healing. HP: 250/250. The cave troll is STUNNED.",
    " > who",
    " [14 players] Gandalf(Wiz) haKCer(War) Drizzt(Thf) Elminster(Mag) ...",
    " > tell hakcer nice kill dude",
    " You tell haKCer 'nice kill dude'",
    " haKCer tells you 'thx, that troll drops a +3 shield sometimes'",
  ];
  let lineIdx = 0;
  let charPos = 0;

  return (frame) => {
    const line = lines[lineIdx % lines.length];
    const isCommand = line.trimStart().startsWith(">");
    const speed = isCommand ? 3 : 4;

    charPos += speed;
    if (charPos >= line.length + 10) {
      lineIdx++;
      charPos = 0;
    }
    const visible = line.slice(0, Math.min(charPos, line.length));
    const cursor = frame % 3 < 2 ? "█" : " ";
    return pad(`${visible}${cursor}`);
  };
}

// ── SCENE 33: ICQ ──
// Uh-oh! message notifications
function icqChat() {
  const contacts = [
    { uin: "13371337", nick: "DarkLord",    status: "Online" },
    { uin: "42069420", nick: "PhreakGirl",  status: "Away" },
    { uin: "99887766", nick: "z3r0c00l",    status: "Online" },
    { uin: "11223344", nick: "CyberPunk",   status: "N/A" },
    { uin: "55667788", nick: "SysOp_Steve", status: "Online" },
  ];
  const messages = [
    "yo u got the new sub7?",
    "check dcc on efnet",
    "my mom picked up the phone, lost carrier lol",
    "i got 3 new aol screennames",
    "brb gotta defrag c:",
    "anyone got a working keygen for photoshop?",
    "just cracked the school proxy lmao",
    "trade ya warez for mp3s",
  ];
  let msgIdx = 0;

  return (frame) => {
    const cycle = frame % 10;
    const contact = contacts[msgIdx % contacts.length];
    const msg = messages[msgIdx % messages.length];

    if (cycle < 2) {
      return pad(` ICQ 99b │ UH OH! ▸▸▸ Message from ${contact.nick} (${contact.uin})`);
    } else if (cycle < 6) {
      return pad(` ICQ 99b │ ${contact.nick}: ${msg}`);
    } else if (cycle < 8) {
      const online = contacts.filter(c => c.status === "Online").length;
      return pad(` ICQ 99b │ Contact List │ Online: ${online}/${contacts.length} │ System msg: 0 │ Flower: Authorized`);
    } else {
      msgIdx++;
      return pad(` ICQ 99b │ ▸ Sending file: totally_not_a_virus.exe (247KB) ▸ Transfer: ${Math.floor(Math.random() * 14.4)}KB/s`);
    }
  };
}

// ── SCENE 34: AIM / Buddy List ──
// Away messages, buddy info, chat
function aimBuddy() {
  const buddies = [
    { sn: "xXDrkAnglXx",   away: "~*~if u cant handle me at my worst u dont deserve me at my best~*~" },
    { sn: "sk8ordie2001",   away: "blink 182 concert brb!!!1" },
    { sn: "SmarterChild",   away: null },
    { sn: "h4x0r_elite",   away: "hacking the gibson" },
    { sn: "LiLpRiNcEsS04",away: "doin hw... im on tho lol" },
    { sn: "CoolDude1337",  away: null },
  ];
  const chats = [
    { from: "h4x0r_elite",  msg: "dude did u see the new matrix trailer" },
    { from: "CoolDude1337", msg: "a/s/l" },
    { from: "SmarterChild", msg: "I'm SmarterChild! Ask me anything! Type HELP to begin." },
    { from: "sk8ordie2001", msg: "broooo linkin park is so sick" },
    { from: "h4x0r_elite",  msg: "type /LInvisiblE to go invisible lol (jk its a punt)" },
  ];
  let chatIdx = 0;

  return (frame) => {
    const cycle = frame % 12;

    if (cycle < 2) {
      // door open/close sound
      const onCount = buddies.filter(b => !b.away).length;
      const awayCount = buddies.filter(b => b.away).length;
      return pad(` AIM 5.2 │ Buddies: ${onCount} Online, ${awayCount} Away │ *** door open sound ***`);
    } else if (cycle < 5) {
      // away message
      const b = buddies[(frame + chatIdx) % buddies.length];
      if (b.away) {
        return pad(` AIM 5.2 │ ${b.sn} is away: ${b.away.slice(0, 65)}`);
      } else {
        return pad(` AIM 5.2 │ ${b.sn} is Available │ Idle: ${Math.floor(Math.random() * 45)}m │ Warning: ${Math.floor(Math.random() * 20)}%`);
      }
    } else if (cycle < 9) {
      const c = chats[chatIdx % chats.length];
      return pad(` AIM 5.2 │ ${c.from}: ${c.msg}`);
    } else {
      chatIdx++;
      return pad(` AIM 5.2 │ *** ${buddies[chatIdx % buddies.length].sn} has signed ${Math.random() > 0.5 ? "on" : "off"} ***`);
    }
  };
}

// ── SCENE 35: Napster ──
// Downloading MP3s at 3KB/s
function napster() {
  const songs = [
    { artist: "Metallica", title: "Enter Sandman", size: "4.2MB", bitrate: "128k", user: "mp3_lord_99" },
    { artist: "Limp Bizkit", title: "Nookie", size: "3.8MB", bitrate: "128k", user: "nu_metal_4eva" },
    { artist: "Offspring", title: "Pretty Fly", size: "3.1MB", bitrate: "96k", user: "punkrawk2001" },
    { artist: "Eminem", title: "My Name Is", size: "4.5MB", bitrate: "192k", user: "slim_shady_lp" },
    { artist: "Smash Mouth", title: "All Star", size: "3.6MB", bitrate: "128k", user: "somebody_420" },
    { artist: "Blink 182", title: "All The Small Things", size: "3.3MB", bitrate: "128k", user: "enema_of_state" },
    { artist: "System of a Down", title: "Chop Suey", size: "3.4MB", bitrate: "160k", user: "toxicity_fan" },
    { artist: "Linkin Park", title: "In The End", size: "3.7MB", bitrate: "128k", user: "hybrid_theory00" },
  ];
  let songIdx = 0;
  let dlProgress = 0;

  return (frame) => {
    const s = songs[songIdx % songs.length];
    const cycle = frame % 12;

    if (cycle < 2) {
      return pad(` Napster ▸ Search: "${s.artist}" │ Results: ${147 + songIdx * 23} │ Users Online: 1,247,891`);
    } else if (cycle < 10) {
      dlProgress += Math.random() * 8;
      const pct = Math.min(dlProgress, 100).toFixed(0);
      const speed = (2.8 + Math.random() * 1.5).toFixed(1);
      const bar = "█".repeat(Math.floor(dlProgress / 5)) + "░".repeat(20 - Math.floor(dlProgress / 5));
      const eta = dlProgress < 100 ? `${Math.floor((100 - dlProgress) / 3)}m` : "DONE";
      return pad(` Napster ▸ DL: ${s.artist} - ${s.title}.mp3 │ ${bar} ${pct}% │ ${speed}KB/s │ ETA: ${eta}`);
    } else {
      songIdx++;
      dlProgress = 0;
      return pad(` Napster ▸ Complete! │ ${s.title}.mp3 │ ${s.size} │ ${s.bitrate} │ from: ${s.user} │ Library: ${songIdx * 47} songs`);
    }
  };
}

// ── SCENE 36: mIRC / xDCC ──
// Channel ops, xdcc bots, warez trading on IRC
function mircXdcc() {
  const events = [
    " [#warez] -XDCC|BOT- Packs: 847 │ Trigger: /msg XDCC|BOT xdcc send #pack",
    " [#warez] -XDCC|BOT- #001 47x [3.2MB] Photoshop_6_keygen.exe",
    " [#warez] -XDCC|BOT- #047 12x [647MB] Half-Life.PROPER-RAZOR1911.iso",
    " [#warez] -XDCC|BOT- #133 3x  [4.7GB] The.Matrix.1999.DVDRip.DivX.iso",
    " [#warez] *** DCC SEND from XDCC|BOT (Half-Life.PROPER-RAZOR1911.iso)",
    " [#warez] DCC GET ▸ 12.4MB/647MB │ 14.2KB/s │ ETA: 12h 23m │ ███░░░░░░░░░░░░",
    " [#warez] <@ChanOp> !voice h4x0r │ *** ChanOp sets mode +v h4x0r",
    " [#warez] <h4x0r> anyone got a fserve running? /ctcp h4x0r fserve",
    " [#warez] *** l4m3r was kicked by ChanOp (ratio: 0:14 - LEECH DETECTED)",
    " [#mp3] -ServBot- Now playing: Limp Bizkit - Break Stuff (320kbps)",
    " [#mp3] <sk8rboi> !find linkin park in the end",
    " [#mp3] -ServBot- Found: 23 results │ /msg ServBot xdcc send #1337",
    " [Status] *** NickServ: You are now identified for haKCer",
    " [Status] *** ChanServ: Opped in #seckc │ Users: 47 │ Topic: 'thursday meetup'",
  ];
  let eventIdx = 0;

  return (frame) => {
    const cycle = frame % 5;
    if (cycle === 0) eventIdx++;
    const e = events[eventIdx % events.length];
    const charPos = Math.min((cycle + 1) * 22, e.length);
    const cursor = frame % 3 < 2 ? "█" : " ";
    return pad(`${e.slice(0, charPos)}${cursor}`);
  };
}

// ── SCENE 37: WinNuke / OOB Attack ──
// Classic Windows crash exploit
function winnuke() {
  const targets = [
    { ip: "24.28.145.67",  result: "BSOD", os: "Win95" },
    { ip: "68.42.117.203", result: "BSOD", os: "Win95 OSR2" },
    { ip: "12.174.89.55",  result: "FAILED", os: "WinNT (patched)" },
    { ip: "209.68.14.91",  result: "BSOD", os: "Win98" },
    { ip: "64.233.167.11", result: "BSOD", os: "Win95" },
  ];
  let targetIdx = 0;
  let nukeCount = 0;

  return (frame) => {
    const t = targets[targetIdx % targets.length];
    const cycle = frame % 8;

    if (cycle < 2) {
      return pad(` WinNuke v2 │ Target: ${t.ip} │ Port 139 (NetBIOS) │ Sending OOB data...`);
    } else if (cycle < 4) {
      const spinner = ["sending", "SENDING", "sending", "SENDING"][frame % 4];
      return pad(` WinNuke v2 │ ${t.ip}:139 │ MSG_OOB ▸ ${spinner} URG pointer overflow...`);
    } else if (cycle < 6) {
      const icon = t.result === "BSOD" ? "☠" : "✗";
      if (t.result === "BSOD") nukeCount++;
      return pad(` WinNuke v2 │ ${icon} ${t.ip} (${t.os}) ── ${t.result} │ "A fatal exception 0E has occurred"`);
    } else {
      targetIdx++;
      return pad(` WinNuke v2 │ Nuked: ${nukeCount} │ Failed: ${targetIdx - nukeCount} │ "It is now safe to turn off your computer"`);
    }
  };
}

const SCENES = [
  { key: "aohell",    name: "AOHell",         init: aohell,     color: "#0078d4" },
  { key: "aolchat",   name: "AOL Chat Room",  init: aolChat,    color: "#ffd700" },
  { key: "lord",      name: "L.O.R.D.",       init: lordGame,   color: "#ff6b35" },
  { key: "tradewars", name: "TradeWars 2002", init: tradewars,  color: "#9ece6a" },
  { key: "mud",       name: "MUD Session",    init: mudSession, color: "#bb9af7" },
  { key: "icq",       name: "ICQ 99b",        init: icqChat,    color: "#00ff41" },
  { key: "aim",       name: "AIM Buddy List", init: aimBuddy,   color: "#e0af68" },
  { key: "napster",   name: "Napster",        init: napster,    color: "#e040fb" },
  { key: "mirc",      name: "mIRC / xDCC",    init: mircXdcc,   color: "#7aa2f7" },
  { key: "winnuke",   name: "WinNuke",        init: winnuke,    color: "#f7768e" },
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
          hakcer statusline // pack 4 - aol era / muds / early internet
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
            { name: "AOHell", desc: "The prog that launched a thousand script kiddies. Phisher module, punter, mail bomb, CC generator, chat room scroller. Cycles through all the classics." },
            { name: "AOL Chat Room", desc: "Town Square chat with A/S/L, phisher warnings, punting, TOS kicks. OnlineHost announcements. '14/m/cali a/s/l?' energy. 47th screenname." },
            { name: "L.O.R.D.", desc: "Legend of the Red Dragon door game. Daily happenings, forest fights, flirting with Violet at the Inn. Your handle's in the game. 8 forest fights remaining." },
            { name: "TradeWars 2002", desc: "Sector trading, Ferrengi raids, StarDock docking, planet defense. Corp messages from NDF. Quasar Cannon ARMED. Alignment: EVIL (-412)." },
            { name: "MUD Session", desc: "Midgaard temple square. kill rat, cast magic missile, quaff heal potions. WHO list shows haKCer as a Warrior. Tell messages between players." },
            { name: "ICQ 99b", desc: "UH OH! Message notifications. UIN numbers, contact status, file transfers of totally_not_a_virus.exe at 14.4KB/s. 'my mom picked up the phone, lost carrier'" },
            { name: "AIM Buddy List", desc: "Away messages with ~*~tildes~*~, SmarterChild bot, door open/close sounds, warning percentages. The invisible punt trick. Linkin Park references." },
            { name: "Napster", desc: "Searching, downloading at 3KB/s, 12-hour ETAs. 128kbps MP3s from users like hybrid_theory00. 1.2M users online. Metallica is coming for you." },
            { name: "mIRC / xDCC", desc: "XDCC bot pack lists, DCC transfers, channel ops, fserve triggers. Leechers getting kicked for bad ratios. NickServ identification. #seckc opped." },
            { name: "WinNuke", desc: "Port 139 OOB data attack. BSoD confirmations on Win95/98 targets. 'A fatal exception 0E has occurred.' 'It is now safe to turn off your computer.'" },
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
          <span style={{ color: "#e0af68" }}>Running total:</span> 37 scenes across 4 packs.
          Pack 1 (7): Matrix Rain, War Games, Nmap, BBS Login, Packet Race, JP Fence, Hacker Typer.
          Pack 2 (10): Traceroute, Wardialer, Sine Scroller, IRC, Hexdump, SSH Brute, DNS Exfil, Enigma, DEFCON, Metasploit.
          Pack 3 (10): Blue Box, Warez NFO, L0phtCrack, Morris Worm, cDc/BO, Phrack, Red Box, Sub7, Manifesto, Mitnick.
          Pack 4 (10): AOHell, AOL Chat, L.O.R.D., TradeWars, MUD, ICQ, AIM, Napster, mIRC/xDCC, WinNuke.
        </div>
      </div>
    </div>
  );
}
