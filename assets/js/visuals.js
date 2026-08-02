/* ==========================================================================
   Fretwork — Visual explainers

   Every diagram is inline SVG built from data, themed with the site's CSS
   variables. Nothing is an image file, so everything scales, stays sharp,
   and works offline.

   Orientation convention: the neck is drawn horizontally as if the guitar is
   on your lap and you're looking down at it — high e string on top, low E at
   the bottom, nut on the left. That matches what you actually see when
   playing, which is the opposite of a chord box.
   ========================================================================== */

(function () {
"use strict";

const STRING_NAMES = ["E", "A", "D", "G", "B", "e"];      // index 0 = low E (6th)
const STRING_NUM   = ["6", "5", "4", "3", "2", "1"];
const FINGER_NAME  = { 1: "Index", 2: "Middle", 3: "Ring", 4: "Pinky", T: "Thumb", 0: "Open" };
const DOT_FRETS    = [3, 5, 7, 9, 15, 17, 19, 21];

/* --------------------------------------------------------------- the neck */
/* opts:
     from, to        first and last fret shown (0 shows the nut)
     marks           [{string, fret, finger, label, color, muted, ghost, step}]
     showNotes       label each mark with its note name instead of finger
     height          px
     caption
     interactive     add data-play so clicking a dot sounds the note        */
function neck(opts = {}) {
  const {
    from = 0, to = 5, marks = [], height = 186,
    caption = "", interactive = true, showFingerKey = false,
  } = opts;

  const padL = 62, padR = 16, padT = 20, padB = 30;
  const W = 760, H = height + padT + padB;
  const nFrets = to - from + 1;
  const boardW = W - padL - padR;
  const fw = boardW / nFrets;                  // fret width
  const sh = height / 5;                       // string spacing
  const y = (s) => padT + (5 - s) * sh;        // s=0 (low E) at bottom
  const fx = (f) => padL + (f - from + 1) * fw;        // right edge of fret f
  const fcx = (f) => padL + (f - from + 0.5) * fw;     // centre of fret f

  let s = `<svg viewBox="0 0 ${W} ${H}" class="neck-svg" style="width:100%;height:auto;max-width:${W}px">`;

  /* fretboard surface */
  s += `<rect x="${padL}" y="${padT - 6}" width="${boardW}" height="${height + 12}" rx="4"
          fill="var(--surface-2)" stroke="var(--border)" stroke-width="1"/>`;

  /* inlay dots */
  for (let f = from; f <= to; f++) {
    if (f === 0) continue;
    if (DOT_FRETS.includes(f)) {
      s += `<circle cx="${fcx(f)}" cy="${padT + height / 2}" r="6" fill="var(--border)" opacity=".85"/>`;
    } else if (f === 12 || f === 24) {
      s += `<circle cx="${fcx(f)}" cy="${padT + height * 0.28}" r="6" fill="var(--border)" opacity=".85"/>
            <circle cx="${fcx(f)}" cy="${padT + height * 0.72}" r="6" fill="var(--border)" opacity=".85"/>`;
    }
  }

  /* frets */
  for (let f = from; f <= to; f++) {
    const isNut = f === 0;
    s += `<line x1="${fx(f)}" y1="${padT - 6}" x2="${fx(f)}" y2="${padT + height + 6}"
            stroke="${isNut ? "var(--text-2)" : "var(--text-3)"}" stroke-width="${isNut ? 5 : 2}"
            stroke-linecap="round" opacity="${isNut ? 1 : .75}"/>`;
  }
  if (from === 0) {
    s += `<line x1="${padL}" y1="${padT - 6}" x2="${padL}" y2="${padT + height + 6}"
            stroke="var(--text-2)" stroke-width="6" stroke-linecap="round"/>`;
  }

  /* fret numbers */
  for (let f = Math.max(from, 1); f <= to; f++) {
    s += `<text x="${fcx(f)}" y="${H - 9}" font-size="12" fill="var(--text-3)"
            text-anchor="middle" font-family="var(--mono)">${f}</text>`;
  }
  if (from === 0) {
    s += `<text x="${fcx(0)}" y="${H - 9}" font-size="10.5" fill="var(--text-3)"
            text-anchor="middle">open</text>`;
  }

  /* strings + labels */
  for (let st = 0; st <= 5; st++) {
    const thickness = 3.4 - st * 0.42;
    s += `<line x1="${padL}" y1="${y(st)}" x2="${W - padR}" y2="${y(st)}"
            stroke="var(--text-3)" stroke-width="${thickness}" opacity=".9"/>`;
    s += `<text x="${padL - 12}" y="${y(st) + 4}" font-size="12.5" fill="var(--text-2)"
            text-anchor="end" font-weight="600">${STRING_NAMES[st]}</text>`;
    s += `<text x="${padL - 40}" y="${y(st) + 4}" font-size="10.5" fill="var(--text-3)"
            text-anchor="middle" font-family="var(--mono)">${STRING_NUM[st]}</text>`;
  }

  /* marks */
  marks.forEach((m) => {
    const cy = y(m.string);
    const col = m.color || "var(--accent)";
    if (m.muted) {
      const cx = padL - 4;
      s += `<text x="${cx}" y="${cy + 5}" font-size="14" fill="var(--bad)" text-anchor="middle">✕</text>`;
      return;
    }
    if (m.fret === 0) {
      s += `<circle cx="${padL - 4}" cy="${cy}" r="7.5" fill="none" stroke="${col}" stroke-width="2.4"/>`;
      if (m.step != null)
        s += `<text x="${padL - 4}" y="${cy + 4}" font-size="10" fill="${col}" text-anchor="middle" font-weight="700">${m.step}</text>`;
      return;
    }
    const cx = fcx(m.fret);
    const r = 15;
    const attrs = interactive
      ? `class="neck-dot" data-string="${m.string}" data-fret="${m.fret}" style="cursor:pointer"` : "";
    s += `<g ${attrs}>`;
    if (m.ghost) {
      s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${col}" stroke-width="2" stroke-dasharray="4 3" opacity=".75"/>`;
      s += `<text x="${cx}" y="${cy + 4.5}" font-size="12.5" fill="${col}" text-anchor="middle" font-weight="700">${m.label ?? m.finger ?? ""}</text>`;
    } else {
      s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}" stroke="var(--bg)" stroke-width="2"/>`;
      s += `<text x="${cx}" y="${cy + 4.8}" font-size="13" fill="#16110a" text-anchor="middle" font-weight="700">${m.label ?? m.finger ?? ""}</text>`;
    }
    s += `</g>`;
    if (m.step != null && !m.ghost) {
      s += `<text x="${cx}" y="${cy - r - 6}" font-size="10" fill="var(--text-3)" text-anchor="middle" font-family="var(--mono)">${m.step}</text>`;
    }
  });

  s += `</svg>`;

  let html = `<div class="viz">${s}`;
  if (showFingerKey) html += fingerKey();
  if (caption) html += `<div class="viz-cap">${caption}</div>`;
  return html + `</div>`;
}

/* Chord shape rendered on the horizontal neck (easier to read than a chord box
   when you're actually holding the guitar) */
function chordOnNeck(name, opts = {}) {
  const shape = window.Fretwork && Fretwork.CHORDS[name];
  if (!shape) return "";
  const played = shape.frets.filter((f) => f > 0);
  const max = played.length ? Math.max(...played) : 3;
  const min = played.length ? Math.min(...played) : 1;
  const marks = shape.frets.map((f, i) => ({
    string: i, fret: f === -1 ? 0 : f, muted: f === -1,
    finger: shape.fingers ? shape.fingers[i] : "",
  }));
  return neck({
    from: min > 4 ? min - 1 : 0,
    to: Math.max(max + 1, 4),
    marks, showFingerKey: opts.showFingerKey !== false,
    caption: opts.caption || `${name} — numbers are which finger to use`,
    height: opts.height || 170,
  });
}

/* ------------------------------------------------------------ finger key */
function fingerKey(which = [1, 2, 3, 4]) {
  return `<div class="finger-key">` + which.map((f) =>
    `<span><i>${f}</i>${FINGER_NAME[f]}</span>`).join("") + `</div>`;
}

/* ------------------------------------ where to put the finger (side view) */
/* This is the single most misunderstood instruction in beginner guitar, so it
   gets its own diagram: three positions, one correct. */
function fretPlacement() {
  const W = 700, H = 210;
  const y0 = 96;
  const fretsX = [90, 260, 430, 600];
  let s = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto">`;
  /* neck side */
  s += `<rect x="30" y="${y0 - 26}" width="${W - 60}" height="70" rx="5" fill="var(--surface-2)" stroke="var(--border)"/>`;
  /* frets as metal bars */
  fretsX.forEach((x, i) => {
    s += `<rect x="${x - 4}" y="${y0 - 30}" width="8" height="78" rx="3" fill="var(--text-2)"/>`;
    s += `<text x="${x}" y="${y0 + 66}" font-size="11" fill="var(--text-3)" text-anchor="middle" font-family="var(--mono)">fret ${i + 1}</text>`;
  });
  /* the string */
  s += `<line x1="30" y1="${y0}" x2="${W - 30}" y2="${y0}" stroke="var(--text-2)" stroke-width="3"/>`;

  const finger = (cx, color, label, sub, ok) => {
    let g = `<g>`;
    g += `<ellipse cx="${cx}" cy="${y0 - 44}" rx="21" ry="27" fill="${color}" opacity=".9"/>`;
    g += `<text x="${cx}" y="${y0 - 39}" font-size="15" fill="#16110a" text-anchor="middle" font-weight="700">${ok ? "✓" : "✕"}</text>`;
    g += `<line x1="${cx}" y1="${y0 - 17}" x2="${cx}" y2="${y0 - 3}" stroke="${color}" stroke-width="3"/>`;
    g += `<text x="${cx}" y="${y0 - 80}" font-size="12.5" fill="${color}" text-anchor="middle" font-weight="700">${label}</text>`;
    g += `<text x="${cx}" y="${y0 + 26}" font-size="11" fill="var(--text-2)" text-anchor="middle">${sub}</text>`;
    return g + `</g>`;
  };
  s += finger(175, "var(--bad)", "Too far back", "buzzes", false);
  s += finger(408, "var(--good)", "Just behind the fret", "clean note", true);
  s += finger(600, "var(--bad)", "On top of the fret", "dead / muted", false);
  s += `</svg>`;
  return `<div class="viz">${s}<div class="viz-cap">"Behind the fret" means between the two metal bars, right up against the higher one — not on top of it, not in the middle of the gap.</div></div>`;
}

/* ---------------------------------------------- how hard to press (gauge) */
function pressureGauge() {
  const W = 680, H = 132;
  let s = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto">`;
  const bx = 40, bw = W - 80, by = 44, bh = 26;
  s += `<defs><linearGradient id="pg" x1="0" x2="1">
      <stop offset="0" stop-color="var(--bad)"/><stop offset="0.28" stop-color="var(--warn)"/>
      <stop offset="0.42" stop-color="var(--good)"/><stop offset="0.62" stop-color="var(--good)"/>
      <stop offset="1" stop-color="var(--bad)"/></linearGradient></defs>`;
  s += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="13" fill="url(#pg)" opacity=".85"/>`;
  const tick = (frac, label, sub) => {
    const x = bx + bw * frac;
    return `<line x1="${x}" y1="${by - 8}" x2="${x}" y2="${by + bh + 8}" stroke="var(--text)" stroke-width="2"/>
            <text x="${x}" y="${by - 15}" font-size="12" fill="var(--text)" text-anchor="middle" font-weight="650">${label}</text>
            <text x="${x}" y="${by + bh + 24}" font-size="10.5" fill="var(--text-3)" text-anchor="middle">${sub}</text>`;
  };
  s += tick(0.10, "Too light", "buzz / no note");
  s += tick(0.50, "Right here", "clean, relaxed");
  s += tick(0.90, "Too hard", "sore hand, notes sharp");
  s += `</svg>`;
  return `<div class="viz">${s}<div class="viz-cap">Find it by feel: press until the note is clean, then slowly release until it buzzes. The right pressure is barely above that buzzing point — most beginners use three times what's needed.</div></div>`;
}

/* ------------------------------------------------------- picking hand p-i-m-a */
function pimaHand() {
  const W = 620, H = 220;
  let s = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto">`;
  const strings = [
    ["6 (E)", "p", "var(--accent)"], ["5 (A)", "p", "var(--accent)"], ["4 (D)", "p", "var(--accent)"],
    ["3 (G)", "i", "var(--p2)"], ["2 (B)", "m", "var(--p3)"], ["1 (e)", "a", "var(--p4)"],
  ];
  strings.forEach((st, i) => {
    const y = 34 + i * 30;
    s += `<line x1="120" y1="${y}" x2="${W - 130}" y2="${y}" stroke="var(--text-3)" stroke-width="${3.2 - i * 0.35}"/>`;
    s += `<text x="108" y="${y + 4}" font-size="11.5" fill="var(--text-2)" text-anchor="end">${st[0]}</text>`;
    s += `<circle cx="${W - 108}" cy="${y}" r="14" fill="${st[2]}"/>`;
    s += `<text x="${W - 108}" y="${y + 5}" font-size="13" fill="#16110a" text-anchor="middle" font-weight="700">${st[1]}</text>`;
  });
  s += `<text x="${W - 108}" y="18" font-size="11" fill="var(--text-3)" text-anchor="middle">finger</text>`;
  s += `</svg>`;
  return `<div class="viz">${s}
    <div class="finger-key">
      <span><i style="background:var(--accent)">p</i>Thumb — bass strings</span>
      <span><i style="background:var(--p2)">i</i>Index — G string</span>
      <span><i style="background:var(--p3)">m</i>Middle — B string</span>
      <span><i style="background:var(--p4)">a</i>Ring — high e</span>
    </div>
    <div class="viz-cap">From Spanish: pulgar, índice, medio, anular. Each finger owns a string so your hand never has to decide.</div></div>`;
}

/* ----------------------------------------------------------- strum grid */
/* pattern: "D-DU-UDU" — one character per eighth note */
function strumGrid(pattern, opts = {}) {
  const steps = String(pattern).replace(/\s+/g, "").split("");
  const { caption = "", id = "" } = opts;
  const count = ["1", "&", "2", "&", "3", "&", "4", "&"];
  const W = 640, H = 150;
  const cw = (W - 40) / steps.length;
  let s = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto" ${id ? `id="${id}"` : ""}>`;
  steps.forEach((ch, i) => {
    const x = 20 + i * cw + cw / 2;
    const onBeat = i % 2 === 0;
    s += `<rect class="sg-cell" data-i="${i}" x="${20 + i * cw + 2}" y="14" width="${cw - 4}" height="${H - 46}"
            rx="8" fill="${onBeat ? "var(--surface-2)" : "var(--surface)"}" stroke="var(--border-soft)"/>`;
    s += `<text x="${x}" y="${H - 12}" font-size="15" fill="${onBeat ? "var(--text)" : "var(--text-3)"}"
            text-anchor="middle" font-weight="${onBeat ? 700 : 500}" font-family="var(--mono)">${count[i % 8]}</text>`;
    const cy = 60;
    if (ch === "D") {
      s += `<path d="M${x} ${cy - 26} L${x} ${cy + 20} M${x - 8} ${cy + 10} L${x} ${cy + 20} L${x + 8} ${cy + 10}"
              stroke="var(--accent)" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <text x="${x}" y="${cy + 42}" font-size="11" fill="var(--accent)" text-anchor="middle" font-weight="700">down</text>`;
    } else if (ch === "U") {
      s += `<path d="M${x} ${cy + 20} L${x} ${cy - 26} M${x - 8} ${cy - 16} L${x} ${cy - 26} L${x + 8} ${cy - 16}"
              stroke="var(--p2)" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <text x="${x}" y="${cy + 42}" font-size="11" fill="var(--p2)" text-anchor="middle" font-weight="700">up</text>`;
    } else if (ch === "x") {
      s += `<text x="${x}" y="${cy + 6}" font-size="22" fill="var(--p4)" text-anchor="middle" font-weight="700">✕</text>
            <text x="${x}" y="${cy + 42}" font-size="11" fill="var(--p4)" text-anchor="middle" font-weight="700">mute</text>`;
    } else {
      s += `<line x1="${x - 9}" y1="${cy}" x2="${x + 9}" y2="${cy}" stroke="var(--text-3)" stroke-width="2.6" stroke-linecap="round"/>
            <text x="${x}" y="${cy + 42}" font-size="10.5" fill="var(--text-3)" text-anchor="middle">skip</text>`;
    }
  });
  s += `</svg>`;
  return `<div class="viz">${s}<div class="viz-cap">${caption ||
    "Your hand keeps moving down-up-down-up the whole time. On a “skip”, the hand still moves — it just misses the strings."}</div></div>`;
}

/* ----------------------------------------------------------- sitting posture */
function posture() {
  const W = 460, H = 300;
  let s = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;max-width:400px">`;
  /* body */
  s += `<circle cx="150" cy="52" r="26" fill="var(--surface-3)" stroke="var(--border)" stroke-width="2"/>`;
  s += `<path d="M150 78 L150 178" stroke="var(--surface-3)" stroke-width="34" stroke-linecap="round"/>`;
  s += `<path d="M150 178 L150 200 L262 200" stroke="var(--surface-3)" stroke-width="30" stroke-linecap="round" fill="none"/>`;
  s += `<path d="M262 200 L262 262" stroke="var(--surface-3)" stroke-width="26" stroke-linecap="round"/>`;
  /* guitar body on right leg */
  s += `<ellipse cx="240" cy="168" rx="52" ry="44" fill="var(--accent)" opacity=".9"/>`;
  s += `<circle cx="240" cy="168" r="15" fill="var(--bg)"/>`;
  /* neck angled up */
  s += `<path d="M212 150 L92 96" stroke="#8a5a2b" stroke-width="15" stroke-linecap="round"/>`;
  s += `<rect x="74" y="78" width="26" height="22" rx="4" fill="#6b4520" transform="rotate(-24 87 89)"/>`;
  /* annotations */
  const note = (x, y, tx, ty, label) =>
    `<line x1="${x}" y1="${y}" x2="${tx}" y2="${ty}" stroke="var(--accent-line)" stroke-width="1.5" stroke-dasharray="3 3"/>
     <text x="${tx}" y="${ty - 6}" font-size="11.5" fill="var(--accent)" font-weight="650">${label}</text>`;
  s += note(150, 62, 300, 52, "Head up, look forward");
  s += note(122, 118, 300, 96, "Neck angled up ~15°");
  s += note(240, 212, 300, 250, "Guitar on your right leg");
  s += note(150, 150, 26, 150, "Shoulders");
  s += `<text x="26" y="164" font-size="11" fill="var(--text-3)">relaxed, not hunched</text>`;
  s += `</svg>`;
  return `<div class="viz">${s}<div class="viz-cap">Sit forward on the chair, both feet flat. If you're leaning over to see the fretboard, the guitar is too low — you'll learn faster by feel than by looking.</div></div>`;
}

/* ----------------------------------------------------------------- pick grip */
function pickGrip() {
  const W = 440, H = 210;
  let s = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;max-width:380px">`;
  s += `<ellipse cx="150" cy="120" rx="66" ry="52" fill="var(--surface-3)" stroke="var(--border)" stroke-width="2"/>`;
  s += `<path d="M96 96 L52 62" stroke="var(--surface-3)" stroke-width="26" stroke-linecap="round"/>`;
  s += `<path d="M232 104 L262 76 L292 116 L258 140 Z" fill="var(--accent)"/>`;
  s += `<path d="M186 108 L246 104" stroke="var(--text-2)" stroke-width="17" stroke-linecap="round"/>`;
  s += `<path d="M190 132 L240 126" stroke="var(--text-3)" stroke-width="15" stroke-linecap="round"/>`;
  s += `<text x="300" y="66" font-size="11.5" fill="var(--accent)" font-weight="650">Only the tip shows</text>`;
  s += `<text x="300" y="82" font-size="10.5" fill="var(--text-3)">2–4 mm past your thumb</text>`;
  s += `<text x="120" y="196" font-size="11.5" fill="var(--text-2)">Pick rests on the side of a curled index finger,</text>`;
  s += `<text x="120" y="212" font-size="11.5" fill="var(--text-2)">thumb laid flat on top. Hold it like a key, not a pen.</text>`;
  s += `</svg>`;
  return `<div class="viz">${s}<div class="viz-cap">Grip firmly enough that it doesn't fly out, loosely enough that it can pivot. If you're getting a harsh clicking sound, too much pick is sticking out.</div></div>`;
}

/* --------------------------------------------------- chord change pivot map */
/* Compares two chord shapes and tells you honestly what stays and what moves.
   Three distinct cases, and they teach different things:
     • true pivot   — same fret, same string, SAME finger. Leave it planted.
     • shared note  — same fret and string, but a DIFFERENT finger. Still a
                      useful landmark, but the finger has to swap.
     • no overlap   — the whole shape has to land at once.                  */
function analysePair(fromChord, toChord) {
  const A = window.Fretwork && Fretwork.CHORDS[fromChord];
  const B = window.Fretwork && Fretwork.CHORDS[toChord];
  if (!A || !B) return null;
  const pivots = [], shared = [];
  for (let i = 0; i < 6; i++) {
    const a = A.frets[i], b = B.frets[i];
    if (a > 0 && b > 0 && a === b) {
      const sameFinger = A.fingers && B.fingers && A.fingers[i] === B.fingers[i];
      (sameFinger ? pivots : shared).push({ string: i, fret: a, fa: A.fingers?.[i], fb: B.fingers?.[i] });
    }
  }
  return { A, B, pivots, shared };
}

function pivotMap(fromChord, toChord, caption = "") {
  const r = analysePair(fromChord, toChord);
  if (!r) return "";
  const { A, B, pivots, shared } = r;
  const isPivot = (i, f) => pivots.some((p) => p.string === i && p.fret === f);
  const isShared = (i, f) => shared.some((p) => p.string === i && p.fret === f);

  const marks = [];
  for (let i = 0; i < 6; i++) {
    const a = A.frets[i], b = B.frets[i];
    if (a > 0 && b > 0 && a === b) {
      const piv = isPivot(i, a);
      marks.push({
        string: i, fret: a,
        label: piv ? (A.fingers?.[i] ?? "") : `${A.fingers?.[i]}→${B.fingers?.[i]}`,
        color: piv ? "var(--good)" : "var(--p2)",
      });
    } else {
      if (a > 0) marks.push({ string: i, fret: a, label: A.fingers?.[i] ?? "", color: "var(--text-3)", ghost: true });
      if (b > 0) marks.push({ string: i, fret: b, label: B.fingers?.[i] ?? "", color: "var(--accent)" });
    }
  }

  const strName = (i) => ["low E (6th)", "A (5th)", "D (4th)", "G (3rd)", "B (2nd)", "high e (1st)"][i];
  let cap;
  if (pivots.length) {
    const list = pivots.map((p) => `finger ${p.fa} on the ${strName(p.string)} string, fret ${p.fret}`).join(" and ");
    const movers = [1, 2, 3, 4].filter((f) =>
      A.fingers?.includes(f) && B.fingers?.includes(f) && !pivots.some((p) => p.fa === f));
    cap = `${fromChord} → ${toChord}: green ${pivots.length === 1 ? "stays put" : "stay put"} — ${list}. ` +
          (movers.length ? `Only finger ${movers.join(" and ")} ${movers.length === 1 ? "moves" : "move"}. ` : "") +
          `Dashed = lifts off, solid orange = lands.`;
  } else if (shared.length) {
    const p = shared[0];
    cap = `${fromChord} → ${toChord}: no finger stays put, but both chords use the ${strName(p.string)} string at fret ${p.fret} ` +
          `(blue) — finger ${p.fa} becomes finger ${p.fb}. Use that note as your landmark: aim for it first and the rest of the shape follows.`;
  } else {
    cap = `${fromChord} → ${toChord}: nothing overlaps, so the whole shape has to land at once. ` +
          `Practise lifting off and placing all fingers together rather than one at a time.`;
  }

  return neck({ from: 0, to: 4, marks, height: 170, caption: caption || cap });
}

/* ------------------------------------------------------------- count bar */
function countBar(text, sub = "") {
  return `<div class="count-bar"><div class="count-line">${text}</div>${sub ? `<div class="viz-cap" style="margin-top:6px">${sub}</div>` : ""}</div>`;
}

/* ------------------------------------------------------- click-to-play wiring */
function wireAudio(root = document) {
  root.querySelectorAll(".neck-dot:not([data-wired])").forEach((el) => {
    el.setAttribute("data-wired", "1");
    el.addEventListener("click", () => {
      if (!window.Guitar) return;
      Guitar.note(+el.dataset.string, +el.dataset.fret, { duration: 2.2 });
      el.style.opacity = ".55";
      setTimeout(() => (el.style.opacity = "1"), 180);
    });
  });
}

window.Viz = {
  neck, chordOnNeck, fingerKey, fretPlacement, pressureGauge, pimaHand,
  strumGrid, posture, pickGrip, pivotMap, countBar, wireAudio,
  STRING_NAMES, FINGER_NAME,
};

})();
