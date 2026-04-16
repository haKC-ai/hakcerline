import { useState, useEffect, useRef } from "react";

const WIDTH = 100;
const pad = (s, w = WIDTH) => {
  if (s.length < w) return s + " ".repeat(w - s.length);
  return s.slice(0, w);
};

// ── SCENE: SecKC Meetup Night ──
// Arrivals, badge scan, talk announcements, lockpick village, beats
function seckc_meetup() {
  const events = [
    " SecKC │ 2nd Tuesday │ Knuckleheads Garage │ 701 N Montgall Ave │ KC MO 64120 │ 5-9PM",
    " SecKC │ *** DOORS OPEN *** │ Beats spinning │ Pizza incoming │ Locksport table is SET",
    " SecKC │ Badge scan: haKCer │ Welcome back │ Attendance: 47... 48... 49...",
    " SecKC │ TOOOL KC lockpicking table ── 3 stations open │ 'who brought the dimple picks?'",
    " SecKC │ HAM Radio testing ── bring your photo ID │ hamstudy.org │ 4 examinees tonight",
    " SecKC │ TALK 1 starting ── everyone grab a seat │ or don't, standing room works too",
    " SecKC │ CTF scoreboard ── haKCer: 450pts │ ndf: 380pts │ triw0lf: 350pts │ 22 players",
    " SecKC │ No Dumb Questions round ── 'how do I get into security?' (drink)",
    " SecKC │ Swag table ── hoodies, stickers, challenge coins │ SecKCoin accepted",
    " SecKC │ HaKCer Jeopardy ── 'I'll take Phreaking for 400' │ 'What is 2600Hz?' │ CORRECT",
    " SecKC │ Badge Pirates corner ── firmware flashing │ 'the LEDs are doing the thing again'",
    " SecKC │ Last call │ 'same time next month' │ Attendance: 142 │ *** DOORS CLOSE ***",
  ];
  let eventIdx = 0;
  let charPos = 0;

  return (frame) => {
    const e = events[eventIdx % events.length];
    charPos += 2 + Math.floor(Math.random() * 2);
    if (charPos >= e.length + 10) {
      eventIdx++;
      charPos = 0;
    }
    const visible = e.slice(0, Math.min(charPos, e.length));
    const cursor = frame % 3 < 2 ? "█" : " ";
    return pad(`${visible}${cursor}`);
  };
}

// ── SCENE: SecKC Schedule (Real data from seckc.org) ──
// Upcoming events cycling with real dates, speakers, venues
function seckc_schedule() {
  const meetings = [
    { date: "APR 14 2026", speakers: "triw0lf, rand0h", venue: "Knuckleheads Garage", note: "talks + lockpicking + tunes" },
    { date: "MAY 12 2026", speakers: "CodexMafia, August Johnson", venue: "Knuckleheads Garage", note: "you won't want to miss this" },
    { date: "JUN 09 2026", speakers: "TBA", venue: "Knuckleheads Garage", note: "summer kicks off" },
    { date: "JUL 14 2026", speakers: "Bryson Bort, tuckner", venue: "Knuckleheads Garage", note: "bringing the heat" },
  ];
  let meetIdx = 0;

  return (frame) => {
    const m = meetings[meetIdx % meetings.length];
    const cycle = frame % 10;

    if (cycle < 3) {
      return pad(` SecKC │ NEXT MEETING: ${m.date} │ ${m.venue} │ 5-9PM`);
    } else if (cycle < 7) {
      return pad(` SecKC │ ${m.date} │ Speakers: ${m.speakers} │ ${m.note}`);
    } else {
      meetIdx++;
      const total = 2800 + meetIdx;
      return pad(` SecKC │ Community: ${total}+ members │ Est. 2011 │ seckc.org │ discord.gg/kSNjbxR`);
    }
  };
}

// ── SCENE: CyberRaid0 Origin ──
// The real origin story
function cyberraid0() {
  const phases = [
    " CyberRaid0 │ Kansas City │ The one that started it all",
    " CyberRaid0 │ Hackers. Makers. Builders. Breakers. │ No corporate BS. Just show up.",
    " CyberRaid0 ──▸ SecKC │ September 2011 │ The hacker hive is born",
    " SecKC │ Coach's Bar and Grill │ First meeting │ 'we should do this every month'",
    " SecKC │ Growing... │ Coach's ▸ Venue 2 ▸ Venue 3 ▸ Venue 4 ▸ kept outgrowing them all",
    " SecKC │ Tall Trellis Brew Co │ Olathe │ The long run",
    " SecKC │ 2025: Knuckleheads Garage │ 701 N Montgall │ KC MO 64120 │ Home.",
    " SecKC │ 2,800+ members │ 15 years │ Still the 2nd Tuesday │ Still showing up",
  ];
  let phaseIdx = 0;
  let charPos = 0;

  return (frame) => {
    const p = phases[phaseIdx % phases.length];
    charPos += 2;
    if (charPos >= p.length + 15) {
      phaseIdx++;
      charPos = 0;
    }
    const visible = p.slice(0, Math.min(charPos, p.length));
    const cursor = frame % 3 < 2 ? "█" : " ";
    return pad(`${visible}${cursor}`);
  };
}

// ── SCENE: Badge Pirates ──
// Hardware badge building, firmware, DEF CON prep
function badgePirates() {
  const events = [
    " Badge Pirates │ PCB rev 4.2 arrived │ 200 boards │ SMD rework station HOT",
    " Badge Pirates │ Flashing firmware... ████████████████████ 100% │ ESP32-S3 │ PASS",
    " Badge Pirates │ LED test ── R... G... B... RAINBOW │ all channels good",
    " Badge Pirates │ SAO header check │ i2c scan: 0x3C (OLED) 0x50 (EEPROM) │ DETECTED",
    " Badge Pirates │ Battery: 3.7v LiPo │ Runtime: 18h estimated │ USB-C charge circuit OK",
    " Badge Pirates │ Silkscreen: 'SecKC │ DC33 │ badgepirates.com' │ skull logo APPROVED",
    " Badge Pirates │ BOM cost: $14.72/unit │ qty: 200 │ deadline: T-minus 47 days to DEF CON",
    " Badge Pirates │ QA fail rate: 3/200 │ cold solder on U2 │ rework queue: 3",
    " Badge Pirates │ IR blaster test │ TV-B-Gone payload ── conference TV OFF │ (tradition)",
    " Badge Pirates │ 'are we doing an add-on this year?' │ 'always' │ SAO v2 design started",
    " Badge Pirates │ Final build night │ pizza + soldering │ 197/200 passing │ SHIP IT",
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

// ── SCENE: SecKCoin ──
// SKC blockchain activity
function seckcoin() {
  const txns = [
    { from: "haKCer",    to: "swag_table",  amt: "50 SKC",  note: "hoodie purchase" },
    { from: "CTF_POOL",  to: "triw0lf",     amt: "100 SKC", note: "1st place CTF" },
    { from: "VOLUNTEER", to: "ndf",          amt: "25 SKC",  note: "AV setup" },
    { from: "SPEAKER",   to: "rand0h",       amt: "75 SKC",  note: "talk: April 2026" },
    { from: "MINE",      to: "hakcer_node",  amt: "12.5 SKC", note: "block #48291" },
    { from: "haKCer",    to: "badge_table",  amt: "30 SKC",  note: "challenge coin" },
    { from: "CTF_POOL",  to: "CodexMafia",   amt: "75 SKC",  note: "2nd place CTF" },
    { from: "SPONSOR",   to: "SecKC_FUND",   amt: "500 SKC", note: "Check Point gold" },
  ];
  let txnIdx = 0;

  return (frame) => {
    const t = txns[txnIdx % txns.length];
    const cycle = frame % 8;

    if (cycle < 3) {
      const hash = Array.from({length: 8}, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("");
      return pad(` SKC │ tx:${hash} │ ${t.from} ▸ ${t.to} │ ${t.amt} │ ${t.note}`);
    } else if (cycle < 5) {
      const confs = Math.floor(Math.random() * 6) + 1;
      return pad(` SKC │ CONFIRMED │ ${confs}/6 confirmations │ block: #${48000 + txnIdx}`);
    } else {
      txnIdx++;
      const supply = (125000 + txnIdx * 12.5).toFixed(1);
      const holders = 284 + txnIdx;
      return pad(` SKC │ SecKCoin │ Supply: ${supply} │ Holders: ${holders} │ Redeemable for swag at meetings`);
    }
  };
}

// ── SCENE: SecKC Discord ──
// Channel activity from the Discord server
function seckcDiscord() {
  const messages = [
    { ch: "#general",     user: "haKCer",      msg: "who's coming tuesday" },
    { ch: "#general",     user: "rand0h",       msg: "always" },
    { ch: "#jobs",        user: "sysaaron",     msg: "hiring sr pentester, DM me" },
    { ch: "#jobs",        user: "triw0lf",      msg: "fully remote?" },
    { ch: "#ctf",         user: "CodexMafia",   msg: "spun up a new challenge box, 10.10.14.7" },
    { ch: "#ctf",         user: "ndf",          msg: "got user.txt in 12 minutes lol" },
    { ch: "#lockpicking", user: "tuckner",      msg: "finally SPP'd an american 1100" },
    { ch: "#lockpicking", user: "haKCer",       msg: "welcome to the club" },
    { ch: "#badges",      user: "badge_pirate", msg: "rev5 gerbers uploaded, review pls" },
    { ch: "#random",      user: "someone",      msg: "anyone got a USB rubber ducky I can borrow tuesday" },
    { ch: "#random",      user: "haKCer",       msg: "i got 3" },
    { ch: "#ham-radio",   user: "rf_nerd",      msg: "testing at next meeting, bring your FRN" },
  ];
  let msgIdx = 0;
  let charPos = 0;

  return (frame) => {
    const m = messages[msgIdx % messages.length];
    const full = ` SecKC Discord │ ${m.ch} │ ${m.user}: ${m.msg}`;

    charPos += 2 + Math.floor(Math.random() * 3);
    if (charPos >= full.length + 8) {
      msgIdx++;
      charPos = 0;
    }
    const visible = full.slice(0, Math.min(charPos, full.length));
    const cursor = frame % 3 < 2 ? "█" : " ";
    return pad(`${visible}${cursor}`);
  };
}

// ── SCENE: SecKC Venue History ──
// The journey through venues
function venueHistory() {
  const venues = [
    { year: "2011", name: "Coach's Bar and Grill",   note: "where it began │ 12 people in a bar" },
    { year: "2012", name: "Venue 2",                  note: "outgrew Coach's │ 'we need more chairs'" },
    { year: "2014", name: "Venue 3",                  note: "outgrew that one too │ 'we need a bigger room'" },
    { year: "2016", name: "Venue 4",                  note: "still growing │ 100+ showing up" },
    { year: "2018", name: "Tall Trellis Brew Co",     note: "Olathe │ the long run │ 150+ monthly" },
    { year: "2023", name: "9th & State / Up-Down KC", note: "West Bottoms + Crossroads │ special events" },
    { year: "2025", name: "Knuckleheads Garage",      note: "701 N Montgall │ KC MO 64120 │ HOME" },
  ];
  let venueIdx = 0;

  return (frame) => {
    const v = venues[venueIdx % venues.length];
    const cycle = frame % 8;

    if (cycle < 5) {
      const charPos = Math.min((cycle + 1) * 20, 100);
      const full = ` SecKC │ ${v.year} │ ${v.name} │ ${v.note}`;
      return pad(full.slice(0, Math.min(charPos, full.length)));
    } else {
      venueIdx++;
      return pad(` SecKC │ 5+ venues │ kept outgrowing them all │ 2,800+ members │ still the 2nd Tuesday`);
    }
  };
}

// ── SCENE: SecKC Talks ──
// Speaker announcements cycling real speaker names from seckc.org
function seckcTalks() {
  const talks = [
    { speaker: "triw0lf",         topic: "classified until showtime", date: "APR 2026" },
    { speaker: "rand0h",           topic: "classified until showtime", date: "APR 2026" },
    { speaker: "CodexMafia",       topic: "bringing the knowledge",    date: "MAY 2026" },
    { speaker: "August Johnson",   topic: "bringing the knowledge",    date: "MAY 2026" },
    { speaker: "Bryson Bort",      topic: "bringing the heat",         date: "JUL 2026" },
    { speaker: "tuckner",          topic: "bringing the heat",         date: "JUL 2026" },
    { speaker: "Joe 'Kingpin' Grand", topic: "hardware hacking legend", date: "JUN 2025" },
    { speaker: "Grifter",         topic: "OG SecKC energy",           date: "JUL 2025" },
    { speaker: "Jake Saunders",    topic: "AD misconfig to takeover",  date: "FEB 2026" },
    { speaker: "@sysaaron",        topic: "SBOMs that don't suck",     date: "FEB 2026" },
  ];
  let talkIdx = 0;

  return (frame) => {
    const t = talks[talkIdx % talks.length];
    const cycle = frame % 8;

    if (cycle < 2) {
      return pad(` SecKC TALKS │ ${t.date} │ NOW PRESENTING ────────────────────────────────────────────`);
    } else if (cycle < 6) {
      return pad(` SecKC TALKS │ ${t.speaker} │ "${t.topic}" │ Knuckleheads Garage`);
    } else {
      talkIdx++;
      return pad(` SecKC TALKS │ Want to speak? │ seckc.org/speak │ Submit your talk │ all levels welcome`);
    }
  };
}

// ── SCENE: RexKC ──
// Friendly hacker dinosaur in a fedora
function rexkc() {
  const actions = [
    " RexKC │ *tips fedora* │ m'hacker │ 🎩🦖",
    " RexKC │ adjusting fedora with tiny arms │ this is harder than it looks",
    " RexKC │ tail knocks over the lockpick table │ 'sorry sorry sorry' │ picks up 3 tension wrenches",
    " RexKC │ trying to type on a ThinkPad │ tiny arms can only reach G H B N │ 'someone help me SSH'",
    " RexKC │ nmap scan with two claws │ tab completion does the heavy lifting │ 'i evolved for this'",
    " RexKC │ fedora falls off during talk │ 12 people stop listening to help │ priority: hat",
    " RexKC │ eating pizza │ entire slice in one bite │ 'what, you need two bites? mammals.'",
    " RexKC │ CTF scoreboard: RexKC 0pts │ 'hard to capture flags with these arms tbh'",
    " RexKC │ giving a talk on extinct protocols │ 'IPX/SPX... gone too soon, like my people'",
    " RexKC │ at the badge pirates table │ can't hold the soldering iron │ supervises aggressively",
    " RexKC │ 'did you know T-Rex had the best binocular vision of any dinosaur?' │ *spots open port*",
    " RexKC │ wearing SecKC hoodie │ had to cut the sleeves because... you know │ looks great tho",
    " RexKC │ 65 million years old │ still more relevant than COBOL │ (barely)",
    " RexKC │ hacker dinosaur in a fedora │ feared by script kiddies │ loved by the community │ 🦖🎩",
    " RexKC │ 'the asteroid was the first denial of service attack' │ crowd groans │ tips fedora harder",
  ];
  let actionIdx = 0;
  let charPos = 0;

  return (frame) => {
    const a = actions[actionIdx % actions.length];
    charPos += 2 + Math.floor(Math.random() * 2);
    if (charPos >= a.length + 10) {
      actionIdx++;
      charPos = 0;
    }
    const visible = a.slice(0, Math.min(charPos, a.length));
    const cursor = frame % 3 < 2 ? "█" : " ";
    return pad(`${visible}${cursor}`);
  };
}

// ── SCENE: Stitches ──
// Brick In Yo Face rapper energy meets hacker culture
function stitchesRapper() {
  const lines = [
    " STITCHES │ I LOVE SELLING BLOW │ BRICK IN YO FACE │ 🧱🧱🧱",
    " STITCHES │ No Snitching Is My Statement │ also my InfoSec policy tbh",
    " STITCHES │ Album: For Drug Dealers Only │ Subtitle: And Also Penetration Testers",
    " STITCHES │ Album: Cocaine Holiday │ me after passing the OSCP",
    " STITCHES │ Album: I Need Rehab │ (from rotating API keys at 3am)",
    " STITCHES │ Album: Married to the Bricks │ me and my homelab │ til death",
    " STITCHES │ AK-47 face tattoo │ but have you tried tattooing your tmux config to your arm",
    " STITCHES │ PUT A BRICK IN YO FIREWALL │ CVE-2025-BRICK │ CVSS: 10.0",
    " STITCHES │ 'I get high off the supply chain' │ SolarWinds type beat",
    " STITCHES │ 'I love sellin blow' │ (whistle on a trunk line, phreaker remix)",
    " STITCHES │ feature request: Stitches x haKCer │ track: 'BRICK IN YO STATUSLINE'",
    " STITCHES │ Miami to KC pipeline │ from cocaine to Claude Code │ growth",
    " STITCHES │ 'no snitching' │ TLP:RED │ same energy different acronym",
    " STITCHES │ dropped the mixtape │ and the production database │ both went hard",
    " STITCHES │ face tattoo: AK-47 │ my face tattoo: #!/bin/bash │ we are not the same",
  ];
  let lineIdx = 0;
  let charPos = 0;

  return (frame) => {
    const l = lines[lineIdx % lines.length];
    charPos += 2 + Math.floor(Math.random() * 3);
    if (charPos >= l.length + 8) {
      lineIdx++;
      charPos = 0;
    }
    const visible = l.slice(0, Math.min(charPos, l.length));
    const cursor = frame % 3 < 2 ? "█" : " ";
    return pad(`${visible}${cursor}`);
  };
}

const SCENES = [
  { key: "meetup",     name: "Meetup Night",    init: seckc_meetup,   color: "#ff6b35" },
  { key: "schedule",   name: "Schedule",        init: seckc_schedule, color: "#7aa2f7" },
  { key: "cyberraid0", name: "CyberRaid0",      init: cyberraid0,     color: "#00ff41" },
  { key: "badges",     name: "Badge Pirates",   init: badgePirates,   color: "#e040fb" },
  { key: "seckcoin",   name: "SecKCoin",        init: seckcoin,       color: "#e0af68" },
  { key: "discord",    name: "Discord",         init: seckcDiscord,   color: "#5865F2" },
  { key: "venues",     name: "Venue History",   init: venueHistory,   color: "#9ece6a" },
  { key: "talks",      name: "Talks",           init: seckcTalks,     color: "#f7768e" },
  { key: "rexkc",      name: "RexKC",           init: rexkc,          color: "#4ade80" },
  { key: "stitches",   name: "Stitches",        init: stitchesRapper, color: "#ef4444" },
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
          hakcer statusline // seckc pack
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
            { name: "Meetup Night", desc: "Full meeting lifecycle - doors open, badge scan, lockpicking table, talks, CTF scoreboard, HaKCer Jeopardy, Badge Pirates corner, swag table, last call. 142 attendance." },
            { name: "Schedule", desc: "Real upcoming dates from seckc.org. Apr 14 (triw0lf, rand0h), May 12 (CodexMafia, August Johnson), Jun 9 (TBA), Jul 14 (Bryson Bort, tuckner). All at Knuckleheads Garage, 5-9PM." },
            { name: "CyberRaid0", desc: "The real origin. CyberRaid0 ▸ SecKC, September 2011. Coach's Bar and Grill. 'We should do this every month.' Five venues later, 2,800+ members, still the 2nd Tuesday." },
            { name: "Badge Pirates", desc: "Hardware badge build cycle. PCB arrival, ESP32-S3 firmware flash, LED test, SAO header i2c scan, BOM cost, QA pass rate, TV-B-Gone payload test, ship deadline countdown." },
            { name: "SecKCoin", desc: "SKC transactions - hoodie purchases, CTF prize payouts, speaker rewards, volunteer credits, mining blocks. Supply counter, holder count. Redeemable for swag." },
            { name: "Discord", desc: "Channel activity from the real SecKC Discord. #general, #jobs, #ctf, #lockpicking, #badges, #ham-radio, #random. Real community handles. discord.gg/kSNjbxR." },
            { name: "Venue History", desc: "The migration path. Coach's Bar ▸ outgrew it ▸ outgrew the next one ▸ Tall Trellis ▸ 9th & State / Up-Down specials ▸ Knuckleheads Garage. Five+ venues, kept growing." },
            { name: "Talks", desc: "Speaker rotation with real names from seckc.org. Joe 'Kingpin' Grand, Bryson Bort, Jake Saunders, triw0lf, CodexMafia. Submit at seckc.org/speak." },
            { name: "RexKC", desc: "Friendly hacker dinosaur in a fedora. Tiny arms vs ThinkPad keyboard. Knocks over the lockpick table with his tail. Gives talks on extinct protocols. Can't hold a soldering iron. Tips fedora." },
            { name: "Stitches", desc: "BRICK IN YO FIREWALL. Album titles remixed for infosec - Cocaine Holiday (passing the OSCP), Married to the Bricks (homelab life), I Need Rehab (3am API key rotation). TLP:RED = No Snitching." },
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
          <span style={{ color: "#e0af68" }}>Running total:</span> 47 scenes across 5 packs.
          Pack 1 (7): Matrix Rain, War Games, Nmap, BBS Login, Packet Race, JP Fence, Hacker Typer.
          Pack 2 (10): Traceroute, Wardialer, Sine Scroller, IRC, Hexdump, SSH Brute, DNS Exfil, Enigma, DEFCON, Metasploit.
          Pack 3 (10): Blue Box, Warez NFO, L0phtCrack, Morris Worm, cDc/BO, Phrack, Red Box, Sub7, Manifesto, Mitnick.
          Pack 4 (10): AOHell, AOL Chat, L.O.R.D., TradeWars, MUD, ICQ, AIM, Napster, mIRC/xDCC, WinNuke.
          Pack 5 - SecKC (10): Meetup Night, Schedule, CyberRaid0, Badge Pirates, SecKCoin, Discord, Venue History, Talks, RexKC, Stitches.
        </div>
      </div>
    </div>
  );
}
