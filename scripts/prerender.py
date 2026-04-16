#!/usr/bin/env python3
"""
hakcerline pre-renderer.
Ports all 47 JSX frame generators to Python, runs each for 400 frames at width 120,
dumps JSON files into scenes/{pack}/{scene}.json

Output format per file:
{
  "id": "core_matrix_rain",
  "name": "Matrix Rain",
  "pack": "core",
  "frames": [ "...", "...", ... ]
}
"""

import json
import math
import os
import random
from pathlib import Path

FRAME_COUNT = 400
WIDTH = 120
OUT_ROOT = Path("/home/claude/hakcerline_bundle/scenes")

# Deterministic RNG per scene so re-rendering produces stable output
def seeded_rng(scene_id: str):
    rng = random.Random()
    rng.seed(scene_id)
    return rng

def pad(s: str, w: int = WIDTH) -> str:
    if len(s) >= w:
        return s[:w]
    return s + " " * (w - len(s))


# ═══════════════════════════════════════════════════════════════════
# PACK 1: CORE
# ═══════════════════════════════════════════════════════════════════

def gen_matrix_rain():
    rng = seeded_rng("core_matrix_rain")
    chars = list("ｦｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ")
    cols = WIDTH
    drops = [rng.randint(0, 20) for _ in range(cols)]
    speeds = [rng.choice([1, 1, 2, 3]) for _ in range(cols)]
    for frame in range(FRAME_COUNT):
        line = []
        for c in range(cols):
            if drops[c] % speeds[c] == 0:
                line.append(rng.choice(chars))
            else:
                line.append(" ")
            drops[c] += 1
            if drops[c] > 15 + rng.randint(0, 10):
                drops[c] = 0
        yield pad("".join(line))


def gen_wargames():
    rng = seeded_rng("core_wargames")
    boards = [
        [" │ │ ", "─┼─┼─", " │ │ "],
        ["X│ │ ", "─┼─┼─", " │ │ "],
        ["X│O│ ", "─┼─┼─", " │ │ "],
        ["X│O│ ", "─┼─┼─", "X│ │ "],
        ["X│O│O", "─┼─┼─", "X│ │ "],
        ["X│O│O", "─┼─┼─", "X│X│ "],
        ["X│O│O", "─┼─┼─", "X│X│X"],
    ]
    messages = [
        "GREETINGS PROFESSOR FALKEN",
        "SHALL WE PLAY A GAME?",
        "GLOBAL THERMONUCLEAR WAR",
        "A STRANGE GAME.",
        "THE ONLY WINNING MOVE IS",
        "NOT TO PLAY.",
        "HOW ABOUT A NICE GAME OF CHESS?",
    ]
    msg_idx = 0
    board_idx = 0
    last_msg_switch = 0
    for frame in range(FRAME_COUNT):
        bi = min(board_idx, len(boards) - 1)
        b = boards[bi]
        board_str = f"  {b[0]}  "
        mi = msg_idx % len(messages)
        msg = messages[mi]
        char_pos = ((frame - last_msg_switch) * 2) % (len(msg) + 20)
        visible = msg[:char_pos]
        pct = min(frame / 40, 1.0)
        bar = "█" * int(pct * 30) + "░" * (30 - int(pct * 30))
        yield pad(f" {board_str} │ {visible:<40} │ {bar} ")
        if char_pos > len(msg) + 10:
            msg_idx += 1
            last_msg_switch = frame
        if frame % 6 == 0 and board_idx < len(boards) - 1:
            board_idx += 1


def gen_nmap_sweep():
    rng = seeded_rng("core_nmap")
    ports = [
        ("22/tcp", "open", "ssh"),
        ("80/tcp", "open", "http"),
        ("443/tcp", "open", "https"),
        ("3306/tcp", "filtered", "mysql"),
        ("8080/tcp", "open", "http-proxy"),
        ("21/tcp", "closed", "ftp"),
        ("25/tcp", "filtered", "smtp"),
        ("53/tcp", "open", "domain"),
        ("6667/tcp", "closed", "irc"),
        ("1337/tcp", "open", "waste"),
        ("31337/tcp", "open", "Elite"),
    ]
    spinners = ["◐", "◓", "◑", "◒"]
    scan = ""
    port_idx = 0
    for frame in range(FRAME_COUNT):
        if frame % 3 == 0:
            p = ports[port_idx % len(ports)]
            scan += f" {p[0]} {p[1]} {p[2]} ▏"
            port_idx += 1
        visible = scan[-(WIDTH - 20):]
        spin = spinners[frame % 4]
        line = f" nmap ▸ {visible}"
        suffix = f" {spin} scanning"
        line = line[:WIDTH - len(suffix)] + suffix
        yield pad(line)


def gen_bbs_login():
    rng = seeded_rng("core_bbs_login")
    bbses = [
        ("THE DARK SIDE BBS", "PhreakMaster", "4", "14.4k"),
        ("RAZOR 1911 WHQ", "Sector9", "8", "28.8k"),
        ("FAIRLIGHT FTP", "Strider", "2", "T1"),
        ("PIRATES COVE", "CaptHook", "6", "9600"),
        ("HACKER'S HAVEN", "z3r0c00l", "3", "56.6k"),
        ("UNDERGROUND eXPRESS", "DarkLord", "12", "T3"),
        ("ACiD ARTPACKS", "RaD Man", "4", "33.6k"),
        ("iCE WHQ", "Phluid", "6", "ISDN"),
    ]
    bbs_idx = 0
    for frame in range(FRAME_COUNT):
        b = bbses[bbs_idx % len(bbses)]
        cycle = frame % 12
        if cycle < 2:
            dots = "." * (cycle + 1)
            num = rng.randint(1000, 9999)
            line = f" ☎ ATDT 1-900-555-{num}{dots}"
        elif cycle < 4:
            line = f" ☎ CONNECT {b[3]} ▏ CARRIER DETECT ▏ 8N1"
        elif cycle < 10:
            node = rng.randint(1, int(b[2]))
            line = f" ☎ {b[0]} │ SysOp: {b[1]} │ Node {node} of {b[2]} │ {b[3]}"
        else:
            line = " ☎ NO CARRIER"
            if cycle == 11:
                bbs_idx += 1
        yield pad(line)


def gen_packet_race():
    rng = seeded_rng("core_packets")
    packets = [
        {"pos": 0.0, "speed": 1.8, "char": "▄▀", "trail": "·"},
        {"pos": 20.0, "speed": 2.3, "char": "▀▄", "trail": "·"},
        {"pos": 40.0, "speed": 1.2, "char": "▄▀", "trail": "·"},
    ]
    for frame in range(FRAME_COUNT):
        line = [" "] * WIDTH
        for p in packets:
            pos = int(p["pos"]) % (WIDTH - 4)
            for t in range(1, 7):
                tp = pos - t
                if 0 <= tp < WIDTH:
                    line[tp] = p["trail"]
            if pos < WIDTH - 2:
                line[pos] = p["char"][0]
                line[pos + 1] = p["char"][1]
            p["pos"] += p["speed"]
            if p["pos"] >= WIDTH - 2:
                p["pos"] = 0.0
                p["speed"] = rng.uniform(1.0, 3.0)
        yield pad("".join(line))


def gen_jp_fence():
    rng = seeded_rng("core_jp_fence")
    zones = [
        "Sector 1: T-Rex Paddock",
        "Sector 4: Raptor Pen",
        "Sector 7: Dilophosaurus",
        "Sector 9: Triceratops",
        "Sector 11: Gallimimus",
        "Sector 12: Perimeter",
    ]
    for frame in range(FRAME_COUNT):
        zone = zones[frame % len(zones)]
        voltage = rng.randint(9800, 10200) if frame % 13 != 0 else 0
        if voltage > 0:
            status = "ARMED"
            fence = "╠═══╬═══╬═══╬═══╬═══╣"
            warn = ""
        else:
            status = "OFFLINE"
            fence = "╠═x═╬═x═╬═x═╬═x═╬═x═╣"
            warn = " ⚠ BREACH"
        yield pad(f" {fence} │ {zone:<28} │ {voltage:>5}V │ {status}{warn}")


def gen_hacker_typer():
    rng = seeded_rng("core_hacker_typer")
    code_lines = [
        "int main() { exploit_t *x = alloc_payload(0xDEAD);",
        "if (check_aslr(pid)) { bypass_nx(x->shellcode);",
        "memcpy(ret_addr, &jmp_esp, sizeof(void*));",
        "for(int i=0; i<buf_sz; i++) stack[i] ^= 0x41;",
        "connect(sock, (struct sockaddr*)&srv, sizeof(srv));",
        "send(sock, payload, payload_len, MSG_NOSIGNAL);",
        "recv(sock, response, 4096, 0); // await shell",
        "printf(\"[+] root shell obtained on %s\\n\", target);",
        "execve(\"/bin/sh\", args, envp); // game over",
        "free(x); close(sock); return 0xCAFEBABE; }",
    ]
    scroll = ""
    line_idx = 0
    char_idx = 0
    for frame in range(FRAME_COUNT):
        current = code_lines[line_idx % len(code_lines)]
        chars_to_add = rng.randint(2, 5)
        for _ in range(chars_to_add):
            if char_idx < len(current):
                scroll += current[char_idx]
                char_idx += 1
            else:
                scroll += " ▏ "
                line_idx += 1
                char_idx = 0
                break
        visible = scroll[-(WIDTH - 4):]
        cursor = "█" if frame % 2 == 0 else " "
        yield pad(f" {visible}{cursor}")


# ═══════════════════════════════════════════════════════════════════
# PACK 2: INFOSEC
# ═══════════════════════════════════════════════════════════════════

def gen_traceroute():
    rng = seeded_rng("infosec_traceroute")
    hops = [
        ("1", "gateway.local", "0.4ms", "AS---"),
        ("2", "10.0.0.1", "2.1ms", "AS7922"),
        ("3", "ae-2.r01.denvco01.us.bb.gin.ntt.net", "8.3ms", "AS2914"),
        ("4", "* * *", "", ""),
        ("5", "72.14.215.85", "12.7ms", "AS15169"),
        ("6", "108.170.248.33", "14.2ms", "AS15169"),
        ("7", "* * *", "", ""),
        ("8", "216.239.49.107", "18.9ms", "AS15169"),
        ("9", "lax17s55-in-f14.1e100.net", "19.1ms", "AS15169"),
        ("10", "poisontap.local", "0.1ms", "AS31337"),
        ("11", "* * *", "", ""),
        ("12", "darkcode.ai", "22.4ms", "AS13335"),
    ]
    hop_idx = 0
    scroll = ""
    for frame in range(FRAME_COUNT):
        if frame % 4 == 0:
            h = hops[hop_idx % len(hops)]
            if h[1] == "* * *":
                entry = f" {h[0]:>2}  * * *"
            else:
                jitter = float(h[2].replace("ms", "")) + rng.uniform(-2, 2)
                entry = f" {h[0]:>2}  {h[1]} ({jitter:.1f}ms) [{h[3]}]"
            scroll += entry + "  ▏"
            hop_idx += 1
        visible = scroll[-(WIDTH - 16):]
        yield pad(f" traceroute ▸ {visible}")


def gen_wardialer():
    rng = seeded_rng("infosec_wardialer")
    results = ["CARRIER", "VOICE", "NO ANSWER", "BUSY", "TONE", "VMB", "CARRIER", "BUSY", "NO ANSWER", "VOICE"]
    prefixes = ["913", "816", "785", "303", "720"]
    num_idx = 0
    for frame in range(FRAME_COUNT):
        prefix = prefixes[num_idx % len(prefixes)]
        suffix = str(1000 + (num_idx * 137) % 9000).zfill(4)
        number = f"({prefix}) 555-{suffix}"
        cycle = frame % 8
        if cycle < 3:
            dots = "." * (cycle + 1)
            spinner = ["\\", "|", "/", "-"][frame % 4]
            line = f" ToneLoc v1.10 │ SCANNING: {number}{dots} {spinner}"
        elif cycle < 6:
            result = results[num_idx % len(results)]
            marker = ">>>" if result == "CARRIER" else "   "
            line = f" ToneLoc v1.10 │ {number} ── {result} {marker}"
        else:
            num_idx += 1
            found = int(num_idx * 0.2)
            elapsed = int(frame * 0.08)
            line = f" ToneLoc v1.10 │ Scanned: {num_idx} │ Carriers: {found} │ Elapsed: {elapsed}m"
        yield pad(line)


def gen_sine_scroller():
    text = ("     GREETINGS TO ALL SCENERS ... FAIRLIGHT - RAZOR 1911 - PARADOX - "
            "SKID ROW - DEVIANCE ... REMEMBER THE AMIGA DAYS ... HACK THE PLANET ... ")
    text_double = text + text
    for frame in range(FRAME_COUNT):
        line = []
        for i in range(WIDTH):
            ch = text_double[(frame + i) % len(text_double)]
            wave = math.sin(frame * 0.15 + i * 0.12)
            if wave > 0.5:
                line.append(ch.upper())
            elif wave > 0:
                line.append(ch.lower())
            elif wave > -0.5:
                line.append("·" if ch != " " else " ")
            else:
                line.append(" ")
        yield "".join(line)


def gen_irc_channel():
    rng = seeded_rng("infosec_irc")
    messages = [
        ("#2600", "phreaker", "anyone got the latest phrack?"),
        ("#2600", "acidburn", "check ftp.fc.net/pub/phrack"),
        ("#hack", "z3r0c00l", "pool on the roof must have a leak"),
        ("#hack", "cerealkiller", "hack the planet!"),
        ("#defcon", "darktan", "badge firmware is up on github"),
        ("#defcon", "lost", "goons kicked me out of skytalks again"),
        ("#securit", "tbird", "new openssh 0day on oss-sec"),
        ("#securit", "mudge", "we knew about this one lol"),
        ("#seckc", "hakcer", "who's bringing the lockpicks thursday"),
        ("#seckc", "ndf", "i got the southord set"),
        ("#bbs", "sysop", "new warez drop on node 3"),
        ("#bbs", "elite", "ratio is 1:3 or gtfo"),
    ]
    msg_idx = 0
    char_pos = 0
    for frame in range(FRAME_COUNT):
        m = messages[msg_idx % len(messages)]
        full = f" {m[0]} <{m[1]}> {m[2]}"
        if char_pos < len(full):
            char_pos += rng.randint(2, 4)
        else:
            msg_idx += 1
            char_pos = 0
        visible = full[:char_pos]
        cursor = "█" if frame % 3 == 0 else ""
        yield pad(f"{visible}{cursor}")


def gen_hexdump():
    rng = seeded_rng("infosec_hexdump")
    addr = 0xDEAD0000
    for frame in range(FRAME_COUNT):
        b = [rng.randint(0, 255) for _ in range(16)]
        hex_str = " ".join(f"{x:02x}" for x in b[:8]) + "  " + " ".join(f"{x:02x}" for x in b[8:])
        ascii_str = "".join(chr(x) if 32 <= x < 127 else "." for x in b)
        current_addr = f"{addr + frame * 16:08x}"
        yield pad(f" 0x{current_addr}  {hex_str}  |{ascii_str}|")


def gen_ssh_brute():
    rng = seeded_rng("infosec_ssh_brute")
    users = ["root", "admin", "ubuntu", "pi", "test", "deploy", "git", "oracle", "postgres", "nobody", "ftpuser", "www-data"]
    ips = ["45.33.32.156", "185.220.101.34", "194.165.16.10", "103.224.182.250", "91.240.118.172", "80.82.77.139"]
    attempt_idx = 0
    for frame in range(FRAME_COUNT):
        user = users[attempt_idx % len(users)]
        ip = ips[attempt_idx % len(ips)]
        port = 40000 + rng.randint(0, 25000)
        cycle = frame % 6
        if frame > 0 and frame % 37 == 0:
            line = f" sshd: HONEYPOT TRIGGERED │ {ip}:{port} │ user={user} │ session captured ▸▸▸"
        elif cycle < 4:
            line = f" sshd: Failed password for {user} from {ip} port {port} ssh2"
            if cycle == 3:
                attempt_idx += 1
        else:
            count = attempt_idx + 1
            rate = count // max(1, int(frame * 0.08))
            line = f" sshd: {count} failed attempts │ {len(ips)} unique IPs │ rate: {rate}/min"
        yield pad(line)


def gen_dns_exfil():
    rng = seeded_rng("infosec_dns_exfil")
    domains = [".data.evil.ru", ".c2.darkops.cc", ".ex.sketchy.io", ".dns.tunnel.net"]
    query_idx = 0
    for frame in range(FRAME_COUNT):
        domain = domains[query_idx % len(domains)]
        chunk = "".join(rng.choice("0123456789abcdef") for _ in range(rng.randint(12, 32)))
        cycle = frame % 5
        if cycle < 3:
            qtype = rng.choice(["TXT", "A"])
            latency = rng.random() * 0.9
            line = f" dns ▸ {qtype} {chunk}{domain} ── {latency:.1f}ms"
        else:
            query_idx += 1
            total = query_idx * 47
            rate = int(total / max(1, frame * 0.08))
            line = f" dns ▸ ⚠ ANOMALY: {query_idx} encoded queries │ ~{total}B exfiltrated │ {rate} B/min"
        yield pad(line)


def gen_enigma():
    alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    plaintext = "HACK THE PLANET BEFORE THEY HACK YOU FIRST"
    rotors = [0, 0, 0]
    char_idx = 0
    pt_buf = ""
    ct_buf = ""
    for frame in range(FRAME_COUNT):
        rotors[2] = (rotors[2] + 1) % 26
        if rotors[2] == 0:
            rotors[1] = (rotors[1] + 1) % 26
        if rotors[1] == 0 and rotors[2] == 0:
            rotors[0] = (rotors[0] + 1) % 26
        r1, r2, r3 = alpha[rotors[0]], alpha[rotors[1]], alpha[rotors[2]]
        pt_char = plaintext[char_idx % len(plaintext)]
        if pt_char == " ":
            ct_char = " "
        else:
            shift = rotors[0] + rotors[1] + rotors[2]
            ct_char = alpha[(alpha.index(pt_char) + shift) % 26]
        pt_buf += pt_char
        ct_buf += ct_char
        char_idx += 1
        pt_visible = pt_buf[-32:]
        ct_visible = ct_buf[-32:]
        rotor_display = f"[{r1}][{r2}][{r3}]"
        lamp = f"█{ct_char}█"
        yield pad(f" ENIGMA {rotor_display} │ PT: {pt_visible:<32} │ CT: {ct_visible:<32} │ {lamp}")


def gen_defcon_level():
    levels = [
        (5, "FADE OUT", "LOW", "Normal readiness"),
        (4, "DOUBLE TAKE", "GUARDED", "Intel gathering increased"),
        (3, "ROUND HOUSE", "ELEVATED", "Air Force ready in 15 min"),
        (2, "FAST PACE", "HIGH", "Armed forces ready to deploy in 6h"),
        (1, "COCKED PISTOL", "SEVERE", "Maximum force readiness"),
    ]
    for frame in range(FRAME_COUNT):
        idx = (frame // 8) % len(levels)
        lvl, name, threat, events = levels[idx]
        blink = frame % 4 < 2
        alert = " ⚠⚠⚠" if lvl <= 2 and blink else ""
        bar = "█" * (6 - lvl) + "░" * (lvl - 1)
        yield pad(f" DEFCON {lvl} │ {name:<14} │ THREAT: {threat:<8} │ {bar} │ {events}{alert}")


def gen_metasploit():
    rng = seeded_rng("infosec_metasploit")
    exploits = [
        ("exploit/multi/handler", "reverse_tcp", "LHOST=10.0.0.5 LPORT=4444"),
        ("exploit/windows/smb/ms17_010", "eternalblue", "RHOSTS=192.168.1.0/24"),
        ("auxiliary/scanner/portscan/tcp", "scanner", "RHOSTS=10.10.10.0/24 PORTS=1-1024"),
        ("exploit/unix/ftp/vsftpd_234", "backdoor", "RHOST=192.168.1.10"),
        ("post/multi/manage/shell_to_meterpreter", "upgrade", "SESSION=1"),
        ("exploit/linux/ssh/ceragon_fibeair", "ssh_key", "RHOST=172.16.0.1"),
    ]
    exp_idx = 0
    for frame in range(FRAME_COUNT):
        e = exploits[exp_idx % len(exploits)]
        cycle = frame % 10
        if cycle < 2:
            line = f" msf6 > use {e[0]}"
        elif cycle < 4:
            line = f" msf6 exploit({e[1]}) > set {e[2]}"
        elif cycle < 6:
            spinner = ["-", "\\", "|", "/"][frame % 4]
            line = f" msf6 exploit({e[1]}) > exploit {spinner}"
        elif cycle < 8:
            if rng.random() > 0.3:
                target = e[2].split("=")[1].split(" ")[0] if "=" in e[2] else "target"
                line = f" [*] Meterpreter session {exp_idx + 1} opened │ {target} ▸▸▸"
            else:
                line = f" [-] Exploit failed: Connection refused"
        else:
            exp_idx += 1
            sessions = int(exp_idx * 0.7)
            line = f" msf6 > sessions -l │ Active: {sessions} │ Jobs: {exp_idx}"
        yield pad(line)


# ═══════════════════════════════════════════════════════════════════
# PACK 3: OLDSCHOOL
# ═══════════════════════════════════════════════════════════════════

def gen_blue_box():
    mf_tones = [
        ("KP", "1100+1700"), ("1", "700+900"), ("8", "900+1500"),
        ("0", "1300+1500"), ("0", "1300+1500"), ("5", "900+1100"),
        ("5", "900+1100"), ("1", "700+900"), ("2", "700+1100"),
        ("1", "700+900"), ("2", "700+1100"), ("ST", "1500+1700"),
    ]
    wave_chars = "▁▂▃▄▅▆▇█▇▆▅▄▃▂▁"
    for frame in range(FRAME_COUNT):
        cycle = frame % 60
        if cycle < 8:
            wave = "".join(wave_chars[(frame + i * 2) % len(wave_chars)] for i in range(30))
            yield pad(f" ☎ 2600Hz ████ TRUNK SEIZE ████ {wave} │ Cap'n Crunch whistle detected")
        elif cycle < 40:
            ti = ((cycle - 8) // 3) % len(mf_tones)
            digit, freq = mf_tones[ti]
            wave = "".join(wave_chars[(frame + i * 3) % len(wave_chars)] for i in range(16))
            dialed = " ".join(t[0] for t in mf_tones[:ti + 1])
            yield pad(f" ☎ MF TONE: {digit:<2} ({freq}Hz) │ {wave} │ DIALED: {dialed}")
        else:
            blink = frame % 4 < 2
            status = "CONNECTED" if blink else "C0NNECTED"
            trunk = 37 + (frame % 12)
            dur = int(frame * 0.08)
            yield pad(f" ☎ BLUE BOX │ {status} ── TOLL FREE ── OPERATOR TRUNK #{trunk} │ duration: {dur}m")


def gen_warez_nfo():
    lines = [
        "═══════════════════════════════════════════════════════════════════════════",
        "      ▄▄▄   ▄▄▄   ▄▄▄   ▄▄▄   ▄▄▄       RAZOR 1911       ▄▄▄   ▄▄▄    ",
        "═══════════════════════════════════════════════════════════════════════════",
        " Release: Microsoft.Office.97.Pro-RAZOR                                  ",
        " Date...: 1997/03/15        Size: 47x1.44MB                              ",
        " Cracker: The Renegade      Type: Application                            ",
        "───────────────────────────────────────────────────────────────────────────",
        " GREETZ: PARADOX - FAIRLIGHT - CLASS - MYTH - DRINK OR DIE - HYBRID      ",
        " SHOUTZ: #razor on EFnet - all our couriers - the scene lives            ",
        "───────────────────────────────────────────────────────────────────────────",
        " IF YOU LIKE THIS SOFTWARE, BUY IT. (lol)                                ",
        "═══════════════════════════════════════════════════════════════════════════",
    ]
    all_text = "  ▏  ".join(lines)
    for frame in range(FRAME_COUNT):
        offset = frame % len(all_text)
        visible = all_text[offset:offset + WIDTH]
        if len(visible) < WIDTH:
            visible += all_text[:WIDTH - len(visible)]
        yield pad(visible)


def gen_l0phtcrack():
    rng = seeded_rng("old_l0phtcrack")
    hashes = [
        ("Administrator", "aad3b435b51404ee", "CRACKED", "P@ssw0rd"),
        ("jsmith", "e52cac67419a9a22", "CRACKED", "summer99"),
        ("backup_svc", "31d6cfe0d16ae931", "CRACKED", "(empty)"),
        ("dbadmin", "a87f32deed765026", "WORKING", "????????"),
        ("ceo_mwilson", "0cb6948805f797bf", "CRACKED", "golf1234"),
        ("root", "7f2592ec69894a18", "WORKING", "????????"),
        ("sysadmin", "f9e37e83b83c4720", "CRACKED", "changeme!"),
    ]
    hash_idx = 0
    dict_pos = 0
    for frame in range(FRAME_COUNT):
        h = hashes[hash_idx % len(hashes)]
        cycle = frame % 8
        if cycle < 5:
            dict_pos += rng.randint(10000, 50000)
            mode = ["dictionary", "hybrid", "brute"][frame % 3]
            speed = f"{rng.randint(12000, 20000):,}"
            spinner = ["\\", "|", "/", "-"][frame % 4]
            yield pad(f" L0phtCrack 2.5 │ {h[0]}:{h[1]} │ {mode} {spinner} │ {speed} h/s │ dict pos: {dict_pos}")
        else:
            if h[2] == "CRACKED":
                hash_idx += 1
                yield pad(f" L0phtCrack 2.5 │ *** CRACKED *** {h[0]} ── {h[3]} │ {hash_idx} of {len(hashes)} recovered")
            else:
                hash_idx += 1
                yield pad(f" L0phtCrack 2.5 │ {h[0]} ── still working... │ switching to brute force mode")


def gen_morris_worm():
    rng = seeded_rng("old_morris")
    hosts = [
        "prep.ai.mit.edu", "ucbvax.berkeley.edu", "purdue.edu", "cs.utah.edu",
        "rand.org", "rice.edu", "ames.arc.nasa.gov", "think.com",
        "harvard.edu", "cmu.edu", "rutgers.edu", "stanford.edu",
        "ll.mit.edu", "sri.com", "uunet.uu.net", "bbn.com",
    ]
    infected = []
    host_idx = 0
    for frame in range(FRAME_COUNT):
        cycle = frame % 6
        if cycle < 2:
            target = hosts[host_idx % len(hosts)]
            yield pad(f" rtm_worm │ fingerd overflow ▸ {target} │ sending 536-byte payload...")
        elif cycle < 4:
            target = hosts[host_idx % len(hosts)]
            success = rng.random() > 0.2
            if success and target not in infected:
                infected.append(target)
            status = "INFECTED" if success else "PATCHED"
            host_idx += 1
            yield pad(f" rtm_worm │ sendmail DEBUG ▸ {target} │ {status} │ total: {len(infected)}/{len(hosts)}")
        else:
            bar = "".join("█" if h in infected else "░" for h in hosts)
            load = 1 + len(infected) * 0.8
            yield pad(f" rtm_worm │ NOV 2 1988 │ {bar} │ {len(infected)} hosts │ load avg: {load:.1f}")


def gen_cdc_bo():
    headers = [
        " cDc communications │ est. 1984 │ CULT OF THE DEAD COW │ Lubbock, TX",
        " cDc #337 │ 'Hacking for Rights' │ by Omega │ 12/29/98",
        " Back Orifice 2000 │ Remote Administration Suite │ v1.0.0",
        " BO2K ▸ Scanning subnet 192.168.1.0/24 for open servers...",
    ]
    targets = [
        ("192.168.1.14", "Win98 SE", "FRONTDESK"),
        ("192.168.1.23", "Win95 OSR2", "ACCOUNTING"),
        ("192.168.1.45", "WinNT 4.0", "FILESERV01"),
        ("192.168.1.67", "Win98", "RECEPTION"),
        ("192.168.1.89", "Win2000 RC2", "DEVBOX"),
    ]
    target_idx = 0
    for frame in range(FRAME_COUNT):
        big_cycle = frame // 10
        if big_cycle < len(headers):
            char_pos = (frame % 10) * 12
            line = headers[big_cycle]
            yield pad(line[:min(char_pos, len(line))])
        else:
            t = targets[target_idx % len(targets)]
            cycle = frame % 8
            if cycle < 2:
                yield pad(f" BO2K ▸ PING {t[0]} │ {t[2]} │ {t[1]} │ server responding on 31337")
            elif cycle < 5:
                cmds = ["dir C:\\", "net view", "ipconfig /all", "type passwords.txt", "net user"][frame % 5]
                yield pad(f" BO2K ▸ {t[0]} │ CMD> {cmds}")
            else:
                target_idx += 1
                connected = min(target_idx, len(targets))
                yield pad(f" BO2K ▸ Active: {connected}/{len(targets)} │ Stealth: ENABLED │ Plugin: bo2k_srv.dll │ Port: 31337")


def gen_phrack():
    rng = seeded_rng("old_phrack")
    articles = [
        "Phrack 7/3  │ The Conscience of a Hacker (The Mentor)",
        "Phrack 49/14 │ Smashing the Stack for Fun and Profit (Aleph1)",
        "Phrack 49/6  │ A Brief History of Hacking (Datastream Cowboy)",
        "Phrack 55/8  │ Raising The Bar For Win32 Exploits (dark spyrit)",
        "Phrack 56/5  │ Once Upon a free() (anonymous)",
        "Phrack 57/9  │ Advances in Format String Exploitation (riq, gera)",
        "Phrack 58/4  │ Bypassing PaX ASLR Protection (Tyler Durden)",
        "Phrack 60/7  │ Defeating Forensic Analysis on Unix (the grugq)",
        "Phrack 66/6  │ Attacking the Core: Kernel Exploiting Notes (twiz)",
        "Phrack 71/1  │ Phrack is not dead. │ 2024",
    ]
    article_idx = 0
    char_pos = 0
    for frame in range(FRAME_COUNT):
        art = articles[article_idx % len(articles)]
        full = f" ──[ {art} ]──"
        char_pos += rng.randint(1, 3)
        if char_pos >= len(full) + 15:
            article_idx += 1
            char_pos = 0
        visible = full[:min(char_pos, len(full))]
        cursor = "█" if frame % 3 < 2 else " "
        yield pad(f" {visible}{cursor}")


def gen_red_box():
    tones = [
        ("NICKEL", "1700Hz", 1, "66ms", 5),
        ("DIME", "1700Hz", 2, "66ms x2", 10),
        ("QUARTER", "1700+2200Hz", 5, "33ms x5", 25),
    ]
    wave_chars = "░▒▓█▓▒░"
    coin_count = 0
    total_cents = 0
    for frame in range(FRAME_COUNT):
        cycle = frame % 10
        tone = tones[frame % len(tones)]
        if cycle < 3:
            wave = "".join(wave_chars[(frame * 3 + i * 2) % len(wave_chars)] for i in range(20))
            yield pad(f" RED BOX │ {tone[0]} TONE │ {tone[1]} │ {tone[2]} pulse(s) │ {wave}")
        elif cycle < 6:
            total_cents += tone[4]
            coin_count += 1
            dollars = f"{total_cents / 100:.2f}"
            yield pad(f" RED BOX │ ACTS detected: {tone[0]} deposited │ Balance: ${dollars} │ Coins: {coin_count}")
        elif cycle < 8:
            target = "READY" if total_cents >= 50 else f"need ${(50 - total_cents) / 100:.2f} more"
            yield pad(f" RED BOX │ Call status: {target} │ Radio Shack tone dialer mod │ 6.5536MHz crystal")
        else:
            yield pad(f" RED BOX │ ☎ Courtesy of Cap'n Crunch, Joybubbles, and a 6.5MHz crystal from Radio Shack")


def gen_sub7():
    victims = [
        ("24.28.145.67", "27374", "d00d_2001", "Win98", "Houston"),
        ("68.42.117.203", "27374", "sk8rboi", "WinME", "Phoenix"),
        ("12.174.89.55", "1243", "coolcat99", "Win95", "Chicago"),
        ("209.68.14.91", "27374", "gamer_xxx", "Win2K", "Miami"),
        ("64.233.167.11", "6711", "newbie123", "WinXP", "Seattle"),
    ]
    victim_idx = 0
    for frame in range(FRAME_COUNT):
        v = victims[victim_idx % len(victims)]
        cycle = frame % 10
        if cycle < 2:
            yield pad(f" Sub7 2.2 │ Scanning... │ Found server on {v[0]}:{v[1]}")
        elif cycle < 4:
            yield pad(f" Sub7 2.2 │ CONNECTED │ {v[0]} │ {v[2]} │ {v[3]} │ {v[4]} │ port {v[1]}")
        elif cycle < 7:
            actions = [
                "FUN MANAGER ▸ Open CD-ROM",
                "FUN MANAGER ▸ Flip Screen",
                "FUN MANAGER ▸ Hide Taskbar",
                "KEYS ▸ Logging keystrokes",
                "CHAT ▸ 'I see you'",
            ]
            yield pad(f" Sub7 2.2 │ {v[0]} │ {actions[frame % len(actions)]} │ ☠")
        else:
            victim_idx += 1
            connected = min(victim_idx, len(victims))
            yield pad(f" Sub7 2.2 │ Connections: {connected} │ Notify: IRC #sub7 │ ICQ: 13371337")


def gen_manifesto():
    text = (
        "This is our world now... the world of the electron and the switch, "
        "the beauty of the baud. We make use of a service already existing without paying for "
        "what could be dirt-cheap if it wasn't run by profiteering gluttons, and you call us "
        "criminals. We explore... and you call us criminals. We seek after knowledge... and you "
        "call us criminals. We exist without skin color, without nationality, without religious "
        "bias... and you call us criminals. Yes, I am a criminal. My crime is that of curiosity. "
        "My crime is that of judging people by what they say and think, not what they look like. "
        "My crime is that of outsmarting you, something that you will never forgive me for. "
        "I am a hacker, and this is my manifesto.     ///The Mentor///  January 8, 1986  "
        "     Phrack Inc. Volume One, Issue 7, Phile 3     "
    )
    for frame in range(FRAME_COUNT):
        offset = frame % len(text)
        visible = text[offset:offset + WIDTH - 4]
        if len(visible) < WIDTH - 4:
            visible += text[:WIDTH - 4 - len(visible)]
        prefix = ">" if frame % 40 < 20 else "│"
        yield pad(f"{prefix} {visible}")


def gen_mitnick():
    phases = [
        ("finger @ariel.sdsc.edu", "tsutomu shimomura - not logged in"),
        ("rsh -l root toad.com", "IP sequence prediction... forging SYN"),
        ("SYN flood -> x-terminal", "server.login -> x-terminal: S 1382726990:138272"),
        ("spoofed ACK accepted", "connection ESTABLISHED from forged 130.92.6.97"),
        ("echo '+ +' >> /.rhosts", "trust relationship injected"),
        ("rsh x-terminal /bin/csh", "# root shell obtained"),
        ("tar cf - /usr/strstrstr/strstrstrstr", "retrieving SunOS source..."),
        ("// Christmas Day, 1994", "Shimomura on ski trip in Tahoe"),
    ]
    phase_idx = 0
    for frame in range(FRAME_COUNT):
        p = phases[phase_idx % len(phases)]
        cycle = frame % 8
        if cycle < 3:
            char_pos = min((cycle + 1) * 15, len(p[0]))
            cursor = "█" if frame % 2 == 0 else " "
            yield pad(f" mitnick@freedom │ $ {p[0][:char_pos]}{cursor}")
        elif cycle < 6:
            yield pad(f" mitnick@freedom │ {p[1]}")
        else:
            phase_idx += 1
            yield pad(f" mitnick@freedom │ {'─' * 66}")


# ═══════════════════════════════════════════════════════════════════
# PACK 4: AOL ERA
# ═══════════════════════════════════════════════════════════════════

def gen_aohell():
    actions = [
        ("PHISHER", "Sending IM as 'TOSAdvisor': Your account needs verification..."),
        ("PUNTER", "OLH $IM_IN <%n> {GoTo 8} ── target: SurfDude99 ── PUNTED"),
        ("MAIL BOMB", "Queuing 200 emails to AOL TOS... subj: 'i didnt do anything'"),
        ("CC GEN", "Algo: Luhn mod10 │ Prefix: 4024 │ Generated: 4024-XXXX-XXXX-XXXX"),
        ("SCROLLR", "lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll"),
        ("ROOM INV", "Mass invite ▸ 'Free AOL 4 Life' ▸ chat://room/FREE%20AOHELL"),
        ("OVERHEAD", "$im_in('Welcome to AOL!') // intercepting login creds"),
        ("PUNT WAR", "Counter-punt detected from xXDarkAngelXx ── deploying shield"),
    ]
    action_idx = 0
    for frame in range(FRAME_COUNT):
        a = actions[action_idx % len(actions)]
        cycle = frame % 8
        if cycle < 2:
            spinner = ["|", "/", "-", "\\"][frame % 4]
            yield pad(f" AOHell v3.0 │ {spinner} Loading {a[0]} module...")
        elif cycle < 6:
            yield pad(f" AOHell v3.0 │ [{a[0]}] {a[1]}")
        else:
            action_idx += 1
            s = int(action_idx * 1.5)
            yield pad(f" AOHell v3.0 │ Screennames harvested: {s * 12} │ Punts: {s} │ Keyword: AOL secret room")


def gen_aol_chatroom():
    rng = seeded_rng("aol_chatroom")
    messages = [
        ("OnlineHost", "*** You are in 'Town Square - 14' ***"),
        ("SurfDude99", "14/m/cali a/s/l?"),
        ("xXAngelXx", "16/f/tx hiii"),
        ("H4CK3RKING", "DOES ANYONE HAVE AOHELL 3.0"),
        ("OnlineHost", "*** TOSAdvisor has entered the room ***"),
        ("TOSAdvisor", "Reminder: Please do not share personal information."),
        ("SurfDude99", "lol thats a phisher dont give ur pw"),
        ("DarkShadow", "!punter xXAngelXx"),
        ("OnlineHost", "*** xXAngelXx has left the room ***"),
        ("H4CK3RKING", "LOL PUNTED"),
        ("BillyTheKid", "keyword: warez"),
        ("OnlineHost", "*** H4CK3RKING's connection has been terminated ***"),
        ("SurfDude99", "LMAOOO HE GOT TOSSED"),
        ("DarkShadow", "anyone got a new s/n generator? my 47th acct lol"),
    ]
    msg_idx = 0
    char_pos = 0
    for frame in range(FRAME_COUNT):
        m = messages[msg_idx % len(messages)]
        is_host = m[0] == "OnlineHost"
        full = f" {m[1]}" if is_host else f" {m[0]}: {m[1]}"
        char_pos += rng.randint(2, 4)
        if char_pos >= len(full) + 8:
            msg_idx += 1
            char_pos = 0
        visible = full[:min(char_pos, len(full))]
        yield pad(visible)


def gen_lord():
    rng = seeded_rng("aol_lord")
    events = [
        " The Daily Happenings of the Land...",
        " Seth Able the Bard attacked a small Thief for 12 hitpoints!",
        " Violet murdered Barak the Wizard in cold blood!",
        " Gandalf was killed by the Red Dragon today!",
        " haKCer found the Gem in the Dark Cloak Forest.",
        " haKCer flirted with Violet at the Inn. She blushed.",
        " Turgon cheated death and was resurrected by the Healer!",
        " ──────────────────────────────────────────────────────",
        " [L.O.R.D.] Forest ▸ You encounter a Huge Ugly Ogre! (HP: 45)",
        " [FIGHT] Your hit! 18 damage! Ogre swings... miss!",
        " [FIGHT] Critical strike!! 34 damage! The Ogre falls!",
        " [LOOT] You found 126 gold and a Huge Axe!",
        " [INN] Bartender says: 'What'll it be, haKCer?'",
        " [INN] You flirt with Violet. She giggles. (Charm +1)",
        " [FOREST] 8 forest fights remaining today.",
    ]
    event_idx = 0
    char_pos = 0
    for frame in range(FRAME_COUNT):
        e = events[event_idx % len(events)]
        char_pos += rng.randint(2, 3)
        if char_pos >= len(e) + 12:
            event_idx += 1
            char_pos = 0
        visible = e[:min(char_pos, len(e))]
        cursor = "█" if frame % 3 < 2 else " "
        yield pad(f"{visible}{cursor}")


def gen_tradewars():
    events = [
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
    ]
    event_idx = 0
    for frame in range(FRAME_COUNT):
        cycle = frame % 6
        if cycle == 0:
            event_idx += 1
        e = events[event_idx % len(events)]
        char_pos = min((cycle + 1) * 18, len(e))
        cursor = "█" if frame % 2 == 0 else " "
        yield pad(f"{e[:char_pos]}{cursor}")


def gen_mud_session():
    rng = seeded_rng("aol_mud")
    lines = [
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
    ]
    line_idx = 0
    char_pos = 0
    for frame in range(FRAME_COUNT):
        line = lines[line_idx % len(lines)]
        is_cmd = line.lstrip().startswith(">")
        speed = 3 if is_cmd else 4
        char_pos += speed
        if char_pos >= len(line) + 10:
            line_idx += 1
            char_pos = 0
        visible = line[:min(char_pos, len(line))]
        cursor = "█" if frame % 3 < 2 else " "
        yield pad(f"{visible}{cursor}")


def gen_icq():
    rng = seeded_rng("aol_icq")
    contacts = [
        ("13371337", "DarkLord", "Online"),
        ("42069420", "PhreakGirl", "Away"),
        ("99887766", "z3r0c00l", "Online"),
        ("11223344", "CyberPunk", "N/A"),
        ("55667788", "SysOp_Steve", "Online"),
    ]
    messages = [
        "yo u got the new sub7?",
        "check dcc on efnet",
        "my mom picked up the phone, lost carrier lol",
        "i got 3 new aol screennames",
        "brb gotta defrag c:",
        "anyone got a working keygen for photoshop?",
        "just cracked the school proxy lmao",
        "trade ya warez for mp3s",
    ]
    msg_idx = 0
    for frame in range(FRAME_COUNT):
        cycle = frame % 10
        contact = contacts[msg_idx % len(contacts)]
        msg = messages[msg_idx % len(messages)]
        if cycle < 2:
            yield pad(f" ICQ 99b │ UH OH! ▸▸▸ Message from {contact[1]} ({contact[0]})")
        elif cycle < 6:
            yield pad(f" ICQ 99b │ {contact[1]}: {msg}")
        elif cycle < 8:
            online = len([c for c in contacts if c[2] == "Online"])
            yield pad(f" ICQ 99b │ Contact List │ Online: {online}/{len(contacts)} │ System msg: 0 │ Flower: Authorized")
        else:
            msg_idx += 1
            kb = rng.randint(1, 14)
            yield pad(f" ICQ 99b │ ▸ Sending file: totally_not_a_virus.exe (247KB) ▸ Transfer: {kb}KB/s")


def gen_aim():
    rng = seeded_rng("aol_aim")
    buddies = [
        ("xXDrkAnglXx", "~*~if u cant handle me at my worst u dont deserve me at my best~*~"),
        ("sk8ordie2001", "blink 182 concert brb!!!1"),
        ("SmarterChild", None),
        ("h4x0r_elite", "hacking the gibson"),
        ("LiLpRiNcEsS04", "doin hw... im on tho lol"),
        ("CoolDude1337", None),
    ]
    chats = [
        ("h4x0r_elite", "dude did u see the new matrix trailer"),
        ("CoolDude1337", "a/s/l"),
        ("SmarterChild", "I'm SmarterChild! Ask me anything! Type HELP to begin."),
        ("sk8ordie2001", "broooo linkin park is so sick"),
        ("h4x0r_elite", "type /LInvisiblE to go invisible lol (jk its a punt)"),
    ]
    chat_idx = 0
    for frame in range(FRAME_COUNT):
        cycle = frame % 12
        if cycle < 2:
            on_ct = len([b for b in buddies if not b[1]])
            away_ct = len(buddies) - on_ct
            yield pad(f" AIM 5.2 │ Buddies: {on_ct} Online, {away_ct} Away │ *** door open sound ***")
        elif cycle < 5:
            b = buddies[(frame + chat_idx) % len(buddies)]
            if b[1]:
                yield pad(f" AIM 5.2 │ {b[0]} is away: {b[1][:65]}")
            else:
                idle = rng.randint(0, 45)
                warn = rng.randint(0, 20)
                yield pad(f" AIM 5.2 │ {b[0]} is Available │ Idle: {idle}m │ Warning: {warn}%")
        elif cycle < 9:
            c = chats[chat_idx % len(chats)]
            yield pad(f" AIM 5.2 │ {c[0]}: {c[1]}")
        else:
            chat_idx += 1
            signed = "on" if rng.random() > 0.5 else "off"
            yield pad(f" AIM 5.2 │ *** {buddies[chat_idx % len(buddies)][0]} has signed {signed} ***")


def gen_napster():
    rng = seeded_rng("aol_napster")
    songs = [
        ("Metallica", "Enter Sandman", "4.2MB", "128k", "mp3_lord_99"),
        ("Limp Bizkit", "Nookie", "3.8MB", "128k", "nu_metal_4eva"),
        ("Offspring", "Pretty Fly", "3.1MB", "96k", "punkrawk2001"),
        ("Eminem", "My Name Is", "4.5MB", "192k", "slim_shady_lp"),
        ("Smash Mouth", "All Star", "3.6MB", "128k", "somebody_420"),
        ("Blink 182", "All The Small Things", "3.3MB", "128k", "enema_of_state"),
        ("System of a Down", "Chop Suey", "3.4MB", "160k", "toxicity_fan"),
        ("Linkin Park", "In The End", "3.7MB", "128k", "hybrid_theory00"),
    ]
    song_idx = 0
    dl = 0.0
    for frame in range(FRAME_COUNT):
        s = songs[song_idx % len(songs)]
        cycle = frame % 12
        if cycle < 2:
            results = 147 + song_idx * 23
            yield pad(f" Napster ▸ Search: \"{s[0]}\" │ Results: {results} │ Users Online: 1,247,891")
        elif cycle < 10:
            dl += rng.random() * 8
            pct = min(int(dl), 100)
            speed = f"{2.8 + rng.random() * 1.5:.1f}"
            filled = int(dl // 5)
            bar = "█" * filled + "░" * (20 - filled)
            eta = f"{int((100 - dl) / 3)}m" if dl < 100 else "DONE"
            yield pad(f" Napster ▸ DL: {s[0]} - {s[1]}.mp3 │ {bar} {pct}% │ {speed}KB/s │ ETA: {eta}")
        else:
            song_idx += 1
            dl = 0.0
            lib = song_idx * 47
            yield pad(f" Napster ▸ Complete! │ {s[1]}.mp3 │ {s[2]} │ {s[3]} │ from: {s[4]} │ Library: {lib} songs")


def gen_mirc_xdcc():
    events = [
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
    ]
    event_idx = 0
    for frame in range(FRAME_COUNT):
        cycle = frame % 5
        if cycle == 0:
            event_idx += 1
        e = events[event_idx % len(events)]
        char_pos = min((cycle + 1) * 22, len(e))
        cursor = "█" if frame % 3 < 2 else " "
        yield pad(f"{e[:char_pos]}{cursor}")


def gen_winnuke():
    targets = [
        ("24.28.145.67", "BSOD", "Win95"),
        ("68.42.117.203", "BSOD", "Win95 OSR2"),
        ("12.174.89.55", "FAILED", "WinNT (patched)"),
        ("209.68.14.91", "BSOD", "Win98"),
        ("64.233.167.11", "BSOD", "Win95"),
    ]
    target_idx = 0
    nuke_ct = 0
    for frame in range(FRAME_COUNT):
        t = targets[target_idx % len(targets)]
        cycle = frame % 8
        if cycle < 2:
            yield pad(f" WinNuke v2 │ Target: {t[0]} │ Port 139 (NetBIOS) │ Sending OOB data...")
        elif cycle < 4:
            spinner = ["sending", "SENDING", "sending", "SENDING"][frame % 4]
            yield pad(f" WinNuke v2 │ {t[0]}:139 │ MSG_OOB ▸ {spinner} URG pointer overflow...")
        elif cycle < 6:
            icon = "☠" if t[1] == "BSOD" else "✗"
            if t[1] == "BSOD":
                nuke_ct += 1
            yield pad(f" WinNuke v2 │ {icon} {t[0]} ({t[2]}) ── {t[1]} │ \"A fatal exception 0E has occurred\"")
        else:
            target_idx += 1
            failed = target_idx - nuke_ct
            yield pad(f" WinNuke v2 │ Nuked: {nuke_ct} │ Failed: {failed} │ \"It is now safe to turn off your computer\"")


# ═══════════════════════════════════════════════════════════════════
# PACK 5: SECKC
# ═══════════════════════════════════════════════════════════════════

def gen_meetup_night():
    rng = seeded_rng("seckc_meetup")
    events = [
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
    ]
    event_idx = 0
    char_pos = 0
    for frame in range(FRAME_COUNT):
        e = events[event_idx % len(events)]
        char_pos += rng.randint(2, 3)
        if char_pos >= len(e) + 10:
            event_idx += 1
            char_pos = 0
        visible = e[:min(char_pos, len(e))]
        cursor = "█" if frame % 3 < 2 else " "
        yield pad(f"{visible}{cursor}")


def gen_schedule():
    meetings = [
        ("APR 14 2026", "triw0lf, rand0h", "Knuckleheads Garage", "talks + lockpicking + tunes"),
        ("MAY 12 2026", "CodexMafia, August Johnson", "Knuckleheads Garage", "you won't want to miss this"),
        ("JUN 09 2026", "TBA", "Knuckleheads Garage", "summer kicks off"),
        ("JUL 14 2026", "Bryson Bort, tuckner", "Knuckleheads Garage", "bringing the heat"),
    ]
    meet_idx = 0
    for frame in range(FRAME_COUNT):
        m = meetings[meet_idx % len(meetings)]
        cycle = frame % 10
        if cycle < 3:
            yield pad(f" SecKC │ NEXT MEETING: {m[0]} │ {m[2]} │ 5-9PM")
        elif cycle < 7:
            yield pad(f" SecKC │ {m[0]} │ Speakers: {m[1]} │ {m[3]}")
        else:
            meet_idx += 1
            total = 2800 + meet_idx
            yield pad(f" SecKC │ Community: {total}+ members │ Est. 2011 │ seckc.org │ discord.gg/kSNjbxR")


def gen_cyberraid0():
    phases = [
        " CyberRaid0 │ Kansas City │ The one that started it all",
        " CyberRaid0 │ Hackers. Makers. Builders. Breakers. │ No corporate BS. Just show up.",
        " CyberRaid0 ──▸ SecKC │ September 2011 │ The hacker hive is born",
        " SecKC │ Coach's Bar and Grill │ First meeting │ 'we should do this every month'",
        " SecKC │ Growing... │ Coach's ▸ Venue 2 ▸ Venue 3 ▸ Venue 4 ▸ kept outgrowing them all",
        " SecKC │ Tall Trellis Brew Co │ Olathe │ The long run",
        " SecKC │ 2025: Knuckleheads Garage │ 701 N Montgall │ KC MO 64120 │ Home.",
        " SecKC │ 2,800+ members │ 15 years │ Still the 2nd Tuesday │ Still showing up",
    ]
    phase_idx = 0
    char_pos = 0
    for frame in range(FRAME_COUNT):
        p = phases[phase_idx % len(phases)]
        char_pos += 2
        if char_pos >= len(p) + 15:
            phase_idx += 1
            char_pos = 0
        visible = p[:min(char_pos, len(p))]
        cursor = "█" if frame % 3 < 2 else " "
        yield pad(f"{visible}{cursor}")


def gen_badge_pirates():
    events = [
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
    ]
    event_idx = 0
    for frame in range(FRAME_COUNT):
        cycle = frame % 6
        if cycle == 0:
            event_idx += 1
        e = events[event_idx % len(events)]
        char_pos = min((cycle + 1) * 18, len(e))
        cursor = "█" if frame % 2 == 0 else " "
        yield pad(f"{e[:char_pos]}{cursor}")


def gen_seckcoin():
    rng = seeded_rng("seckc_seckcoin")
    txns = [
        ("haKCer", "swag_table", "50 SKC", "hoodie purchase"),
        ("CTF_POOL", "triw0lf", "100 SKC", "1st place CTF"),
        ("VOLUNTEER", "ndf", "25 SKC", "AV setup"),
        ("SPEAKER", "rand0h", "75 SKC", "talk: April 2026"),
        ("MINE", "hakcer_node", "12.5 SKC", "block #48291"),
        ("haKCer", "badge_table", "30 SKC", "challenge coin"),
        ("CTF_POOL", "CodexMafia", "75 SKC", "2nd place CTF"),
        ("SPONSOR", "SecKC_FUND", "500 SKC", "Check Point gold"),
    ]
    txn_idx = 0
    for frame in range(FRAME_COUNT):
        t = txns[txn_idx % len(txns)]
        cycle = frame % 8
        if cycle < 3:
            h = "".join(rng.choice("0123456789abcdef") for _ in range(8))
            yield pad(f" SKC │ tx:{h} │ {t[0]} ▸ {t[1]} │ {t[2]} │ {t[3]}")
        elif cycle < 5:
            confs = rng.randint(1, 6)
            yield pad(f" SKC │ CONFIRMED │ {confs}/6 confirmations │ block: #{48000 + txn_idx}")
        else:
            txn_idx += 1
            supply = f"{125000 + txn_idx * 12.5:.1f}"
            holders = 284 + txn_idx
            yield pad(f" SKC │ SecKCoin │ Supply: {supply} │ Holders: {holders} │ Redeemable for swag at meetings")


def gen_discord():
    rng = seeded_rng("seckc_discord")
    messages = [
        ("#general", "haKCer", "who's coming tuesday"),
        ("#general", "rand0h", "always"),
        ("#jobs", "sysaaron", "hiring sr pentester, DM me"),
        ("#jobs", "triw0lf", "fully remote?"),
        ("#ctf", "CodexMafia", "spun up a new challenge box, 10.10.14.7"),
        ("#ctf", "ndf", "got user.txt in 12 minutes lol"),
        ("#lockpicking", "tuckner", "finally SPP'd an american 1100"),
        ("#lockpicking", "haKCer", "welcome to the club"),
        ("#badges", "badge_pirate", "rev5 gerbers uploaded, review pls"),
        ("#random", "someone", "anyone got a USB rubber ducky I can borrow tuesday"),
        ("#random", "haKCer", "i got 3"),
        ("#ham-radio", "rf_nerd", "testing at next meeting, bring your FRN"),
    ]
    msg_idx = 0
    char_pos = 0
    for frame in range(FRAME_COUNT):
        m = messages[msg_idx % len(messages)]
        full = f" SecKC Discord │ {m[0]} │ {m[1]}: {m[2]}"
        char_pos += rng.randint(2, 4)
        if char_pos >= len(full) + 8:
            msg_idx += 1
            char_pos = 0
        visible = full[:min(char_pos, len(full))]
        cursor = "█" if frame % 3 < 2 else " "
        yield pad(f"{visible}{cursor}")


def gen_venue_history():
    venues = [
        ("2011", "Coach's Bar and Grill", "where it began │ 12 people in a bar"),
        ("2012", "Venue 2", "outgrew Coach's │ 'we need more chairs'"),
        ("2014", "Venue 3", "outgrew that one too │ 'we need a bigger room'"),
        ("2016", "Venue 4", "still growing │ 100+ showing up"),
        ("2018", "Tall Trellis Brew Co", "Olathe │ the long run │ 150+ monthly"),
        ("2023", "9th & State / Up-Down KC", "West Bottoms + Crossroads │ special events"),
        ("2025", "Knuckleheads Garage", "701 N Montgall │ KC MO 64120 │ HOME"),
    ]
    venue_idx = 0
    for frame in range(FRAME_COUNT):
        v = venues[venue_idx % len(venues)]
        cycle = frame % 8
        if cycle < 5:
            full = f" SecKC │ {v[0]} │ {v[1]} │ {v[2]}"
            char_pos = min((cycle + 1) * 20, 100)
            yield pad(full[:min(char_pos, len(full))])
        else:
            venue_idx += 1
            yield pad(" SecKC │ 5+ venues │ kept outgrowing them all │ 2,800+ members │ still the 2nd Tuesday")


def gen_talks():
    talks = [
        ("triw0lf", "classified until showtime", "APR 2026"),
        ("rand0h", "classified until showtime", "APR 2026"),
        ("CodexMafia", "bringing the knowledge", "MAY 2026"),
        ("August Johnson", "bringing the knowledge", "MAY 2026"),
        ("Bryson Bort", "bringing the heat", "JUL 2026"),
        ("tuckner", "bringing the heat", "JUL 2026"),
        ("Joe 'Kingpin' Grand", "hardware hacking legend", "JUN 2025"),
        ("Grifter", "OG SecKC energy", "JUL 2025"),
        ("Jake Saunders", "AD misconfig to takeover", "FEB 2026"),
        ("@sysaaron", "SBOMs that don't suck", "FEB 2026"),
    ]
    talk_idx = 0
    for frame in range(FRAME_COUNT):
        t = talks[talk_idx % len(talks)]
        cycle = frame % 8
        if cycle < 2:
            yield pad(f" SecKC TALKS │ {t[2]} │ NOW PRESENTING ────────────────────────────────────────────")
        elif cycle < 6:
            yield pad(f" SecKC TALKS │ {t[0]} │ \"{t[1]}\" │ Knuckleheads Garage")
        else:
            talk_idx += 1
            yield pad(" SecKC TALKS │ Want to speak? │ seckc.org/speak │ Submit your talk │ all levels welcome")


def gen_rexkc():
    rng = seeded_rng("seckc_rexkc")
    actions = [
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
    ]
    action_idx = 0
    char_pos = 0
    for frame in range(FRAME_COUNT):
        a = actions[action_idx % len(actions)]
        char_pos += rng.randint(2, 3)
        if char_pos >= len(a) + 10:
            action_idx += 1
            char_pos = 0
        visible = a[:min(char_pos, len(a))]
        cursor = "█" if frame % 3 < 2 else " "
        yield pad(f"{visible}{cursor}")


def gen_stitches():
    rng = seeded_rng("seckc_stitches")
    lines = [
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
    ]
    line_idx = 0
    char_pos = 0
    for frame in range(FRAME_COUNT):
        l = lines[line_idx % len(lines)]
        char_pos += rng.randint(2, 4)
        if char_pos >= len(l) + 8:
            line_idx += 1
            char_pos = 0
        visible = l[:min(char_pos, len(l))]
        cursor = "█" if frame % 3 < 2 else " "
        yield pad(f"{visible}{cursor}")


# ═══════════════════════════════════════════════════════════════════
# SCENE REGISTRY & WRITER
# ═══════════════════════════════════════════════════════════════════

SCENES = [
    # Pack 1: core
    ("core_matrix_rain", "Matrix Rain", "core", "matrix_rain", gen_matrix_rain),
    ("core_wargames", "War Games WOPR", "core", "wargames", gen_wargames),
    ("core_nmap", "Nmap Sweep", "core", "nmap_sweep", gen_nmap_sweep),
    ("core_bbs_login", "BBS Login", "core", "bbs_login", gen_bbs_login),
    ("core_packets", "Packet Race", "core", "packet_race", gen_packet_race),
    ("core_jp_fence", "JP Fence Monitor", "core", "jp_fence", gen_jp_fence),
    ("core_hacker_typer", "Hacker Typer", "core", "hacker_typer", gen_hacker_typer),
    # Pack 2: infosec
    ("infosec_traceroute", "Traceroute", "infosec", "traceroute", gen_traceroute),
    ("infosec_wardialer", "Wardialer", "infosec", "wardialer", gen_wardialer),
    ("infosec_sine_scroll", "Sine Scroller", "infosec", "sine_scroller", gen_sine_scroller),
    ("infosec_irc", "IRC Channel", "infosec", "irc_channel", gen_irc_channel),
    ("infosec_hexdump", "Hexdump", "infosec", "hexdump", gen_hexdump),
    ("infosec_ssh_brute", "SSH Brute Force", "infosec", "ssh_brute", gen_ssh_brute),
    ("infosec_dns_exfil", "DNS Exfil", "infosec", "dns_exfil", gen_dns_exfil),
    ("infosec_enigma", "Enigma Machine", "infosec", "enigma", gen_enigma),
    ("infosec_defcon", "DEFCON Level", "infosec", "defcon_level", gen_defcon_level),
    ("infosec_metasploit", "Metasploit", "infosec", "metasploit", gen_metasploit),
    # Pack 3: oldschool
    ("old_blue_box", "Blue Box", "oldschool", "blue_box", gen_blue_box),
    ("old_warez_nfo", "Warez NFO", "oldschool", "warez_nfo", gen_warez_nfo),
    ("old_l0phtcrack", "L0phtCrack", "oldschool", "l0phtcrack", gen_l0phtcrack),
    ("old_morris_worm", "Morris Worm", "oldschool", "morris_worm", gen_morris_worm),
    ("old_cdc_bo", "cDc / Back Orifice", "oldschool", "cdc_bo", gen_cdc_bo),
    ("old_phrack", "Phrack Ezine", "oldschool", "phrack", gen_phrack),
    ("old_red_box", "Red Box", "oldschool", "red_box", gen_red_box),
    ("old_sub7", "Sub7 RAT", "oldschool", "sub7", gen_sub7),
    ("old_manifesto", "The Manifesto", "oldschool", "manifesto", gen_manifesto),
    ("old_mitnick", "Mitnick Terminal", "oldschool", "mitnick", gen_mitnick),
    # Pack 4: aol
    ("aol_aohell", "AOHell", "aol", "aohell", gen_aohell),
    ("aol_chatroom", "AOL Chat Room", "aol", "aol_chatroom", gen_aol_chatroom),
    ("aol_lord", "L.O.R.D.", "aol", "lord", gen_lord),
    ("aol_tradewars", "TradeWars 2002", "aol", "tradewars", gen_tradewars),
    ("aol_mud", "MUD Session", "aol", "mud_session", gen_mud_session),
    ("aol_icq", "ICQ 99b", "aol", "icq", gen_icq),
    ("aol_aim", "AIM Buddy List", "aol", "aim", gen_aim),
    ("aol_napster", "Napster", "aol", "napster", gen_napster),
    ("aol_mirc", "mIRC / xDCC", "aol", "mirc_xdcc", gen_mirc_xdcc),
    ("aol_winnuke", "WinNuke", "aol", "winnuke", gen_winnuke),
    # Pack 5: seckc
    ("seckc_meetup", "Meetup Night", "seckc", "meetup_night", gen_meetup_night),
    ("seckc_schedule", "Schedule", "seckc", "schedule", gen_schedule),
    ("seckc_cyberraid0", "CyberRaid0", "seckc", "cyberraid0", gen_cyberraid0),
    ("seckc_badges", "Badge Pirates", "seckc", "badge_pirates", gen_badge_pirates),
    ("seckc_seckcoin", "SecKCoin", "seckc", "seckcoin", gen_seckcoin),
    ("seckc_discord", "Discord", "seckc", "discord", gen_discord),
    ("seckc_venues", "Venue History", "seckc", "venue_history", gen_venue_history),
    ("seckc_talks", "Talks", "seckc", "talks", gen_talks),
    ("seckc_rexkc", "RexKC", "seckc", "rexkc", gen_rexkc),
    ("seckc_stitches", "Stitches", "seckc", "stitches", gen_stitches),
]


def main():
    print(f"Pre-rendering {len(SCENES)} scenes at {WIDTH} cols x {FRAME_COUNT} frames...")
    for scene_id, name, pack, filename, gen_func in SCENES:
        out_dir = OUT_ROOT / pack
        out_dir.mkdir(parents=True, exist_ok=True)
        out_path = out_dir / f"{filename}.json"

        frames = list(gen_func())
        assert len(frames) == FRAME_COUNT, f"{scene_id}: expected {FRAME_COUNT}, got {len(frames)}"

        data = {
            "id": scene_id,
            "name": name,
            "pack": pack,
            "frames": frames,
        }

        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, separators=(",", ":"))

        size = out_path.stat().st_size
        print(f"  {pack:<10} {scene_id:<25} -> {filename}.json ({size:>6,} bytes)")

    total_files = sum(1 for p in OUT_ROOT.rglob("*.json"))
    total_size = sum(p.stat().st_size for p in OUT_ROOT.rglob("*.json"))
    print(f"\nWrote {total_files} JSON files, {total_size:,} bytes total")


if __name__ == "__main__":
    main()
