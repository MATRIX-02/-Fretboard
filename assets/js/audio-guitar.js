/* ==========================================================================
   Fretwork — Acoustic guitar synthesis

   Extended Karplus–Strong. The plain algorithm sounds like a plucked *string*
   but not like a *guitar*; these are the things that close the gap, roughly in
   order of how much they matter to the ear:

   1. Dual polarisation. A real string vibrates in two planes that decay at
      different rates and are very slightly detuned by the bridge coupling.
      That's what produces the characteristic fast initial drop into a long
      quiet tail, plus gentle beating. Modelled as two delay lines summed.
   2. Pick-position comb filtering. Plucking a fifth of the way along the
      string cancels every fifth harmonic. This is most of what makes a guitar
      sound like a guitar rather than a generic string.
   3. Attack transient. The pick itself makes a broadband click before the
      string speaks. Without it, notes sound like they fade in.
   4. Body resonance. A dreadnought has an air (Helmholtz) resonance near
      100 Hz, a top-plate resonance near 200 Hz, and more around 400 Hz.
   5. String character. Wound bass strings are darker and ring longer; plain
      trebles are brighter and die sooner.
   6. Human detune and velocity variation, so a strum isn't six identical
      machine notes.
   7. Voice stealing — restriking a string stops the note already on it,
      instead of letting chords pile into mud.

   Still no audio files. Everything is generated, so it works offline and every
   note is exactly in tune.
   ========================================================================== */

(function () {
"use strict";

let ctx = null, master = null, bodyChain = null;
let blockedNotice = null;             // set when the browser refuses to start audio
const activeVoices = {};              // per-string voice stealing

/* ------------------------------------------------------------------ setup */
function buildBody(c) {
  /* Three resonant peaks + a soft top end = wooden box rather than raw string */
  const mk = (type, freq, Q, gain) => {
    const f = c.createBiquadFilter();
    f.type = type; f.frequency.value = freq; f.Q.value = Q;
    if (gain != null) f.gain.value = gain;
    return f;
  };
  const air  = mk("peaking", 104, 1.4, 6.5);    // Helmholtz air resonance
  const top  = mk("peaking", 212, 1.1, 4.5);    // top plate
  const mid  = mk("peaking", 415, 0.9, 2.5);    // secondary body mode
  const pres = mk("peaking", 2600, 0.7, 2.0);   // presence, string definition
  const roll = mk("highshelf", 6200, 0.7, -5);  // tame the fizz
  const hp   = mk("highpass", 62, 0.7);         // no subsonic rumble
  air.connect(top); top.connect(mid); mid.connect(pres); pres.connect(roll); roll.connect(hp);
  return { input: air, output: hp };
}

function context() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();

    master = ctx.createGain();
    master.gain.value = 0.8;

    bodyChain = buildBody(ctx);
    master.connect(bodyChain.input);

    /* Small room. Guitars are never heard completely dry. */
    const conv = ctx.createConvolver();
    const len = Math.floor(ctx.sampleRate * 1.35);
    const imp = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = imp.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        const t = i / len;
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.8) * (i < 900 ? i / 900 : 1);
      }
    }
    conv.buffer = imp;
    const wet = ctx.createGain(); wet.gain.value = 0.19;
    const dry = ctx.createGain(); dry.gain.value = 1.0;
    bodyChain.output.connect(dry); dry.connect(ctx.destination);
    bodyChain.output.connect(conv); conv.connect(wet); wet.connect(ctx.destination);
  }
  if (ctx.state === "suspended") {
    ctx.resume().then(() => { blockedNotice = null; }).catch(() => {});
  }
  return ctx;
}

/* True when the browser is still refusing to make sound */
function blocked() { return !!ctx && ctx.state !== "running"; }

/* --------------------------------------------------- blocked-audio warning */
/* No pre-emptive "click to unlock" gate — just try to play. Browsers almost
   always allow it, because every play button is itself a user gesture. On the
   rare occasion one refuses, this bar appears with a way to force it. */
function hideWarning() {
  const el = document.getElementById("audio-blocked");
  if (el) el.remove();
}
function showWarning(msg) {
  if (document.getElementById("audio-blocked") || !document.body) return;
  const bar = document.createElement("div");
  bar.id = "audio-blocked";
  bar.className = "audio-warn";
  bar.innerHTML =
    `<span>🔇 ${msg || "Your browser blocked the sound."}</span>
     <button class="btn btn-sm btn-primary" data-a="anyway">Play anyway</button>
     <button class="btn btn-sm" data-a="close">Dismiss</button>`;
  bar.addEventListener("click", (e) => {
    const b = e.target.closest("[data-a]");
    if (!b) return;
    if (b.dataset.a === "close") return hideWarning();
    if (ctx) ctx.resume().then(() => { if (!blocked()) hideWarning(); });
    else { context(); if (!blocked()) hideWarning(); }
  });
  document.body.appendChild(bar);
}

/* Called by everything that makes a sound. Returns the context, and surfaces
   the warning only if audio genuinely didn't start. */
function ensure() {
  const c = context();
  if (!c) { showWarning("This browser doesn't support Web Audio."); return null; }
  setTimeout(() => { blocked() ? showWarning() : hideWarning(); }, 320);
  return c;
}

/* Standard tuning open strings, low → high */
const OPEN = [82.41, 110.00, 146.83, 196.00, 246.94, 329.63];
function fretFreq(stringIdx, fret) { return OPEN[stringIdx] * Math.pow(2, fret / 12); }

/* --------------------------------------------------- one delay-line render */
/* Renders a single polarisation of the string into `out`, added on top of
   whatever is already there. Returns nothing.                              */
function renderString(out, total, SR, freq, exc, t60, brightness, weight) {
  const P = SR / freq;
  const b = brightness, a = 1 - b;
  const w = 2 * Math.PI * freq / SR;
  /* Phase delay of the one-pole loop filter, so the pitch stays exact */
  const pd = Math.atan2(a * Math.sin(w), 1 - a * Math.cos(w)) / w;
  const D = Math.max(2, P - pd);
  /* Per-sample feedback that gives the requested 60 dB decay time */
  const feedback = Math.pow(0.001, 1 / (SR * t60));

  const L = Math.ceil(D) + 2;
  const line = new Float32Array(L);
  for (let i = 0; i < L; i++) line[i] = exc[i % exc.length];

  let wp = 0, lp = 0;
  for (let i = 0; i < total; i++) {
    const rp = wp - D;
    let ri = Math.floor(rp);
    const frac = rp - ri;
    ri = ((ri % L) + L) % L;
    const s = line[ri] * (1 - frac) + line[(ri + 1) % L] * frac;
    lp = b * s + a * lp;
    line[wp] = lp * feedback;
    out[i] += s * weight;
    wp = (wp + 1) % L;
  }
}

/* ------------------------------------------------------------ the pluck */
function pluck(freq, opts = {}) {
  const c = ensure();
  if (!c) return null;

  const {
    when = 0,
    duration = 3.0,
    velocity = 0.85,
    palmMute = false,
    string = null,          // 0–5, used for tone character, panning and voice stealing
    pickPos = null,         // 0.08 (bridge, nasal) … 0.30 (neck, round)
    detuneCents = null,
    damping = 0.5,
  } = opts;

  const SR = c.sampleRate;
  const t0 = c.currentTime + when;

  /* Human detune is applied by strumFrets, never by default — single notes
     must stay exact so the tuner and the ear trainer can be trusted. */
  const f = freq * Math.pow(2, (detuneCents || 0) / 1200);

  /* --- string character --- */
  const wound = string != null ? string <= 2 : f < 175;
  const vel = Math.max(0.15, Math.min(1.3, velocity));

  /* Decay times, chosen so the summed envelope matches a measured acoustic:
     roughly −34 dB/s over the first 200 ms, then a −5 to −8 dB/s tail. A
     single exponential (one polarisation) sounds unmistakably synthetic. */
  let t60Fast = palmMute ? 0.12 : (wound ? 0.52 : 0.42);
  let t60Slow = palmMute ? 0.26 : (wound ? 11.0 : 8.0);
  /* Notes high up the neck die away sooner, as they do on a real instrument */
  if (f > 400) { t60Fast *= 0.85; t60Slow *= 0.65; }
  if (f > 700) { t60Slow *= 0.7; }

  /* Loop-filter brightness. Harder plucks are brighter; wound strings duller.
     The loop runs once per period, so a high string filters its harmonics far
     more times per second than a low one — left uncompensated, trebles come
     out duller than basses, which is backwards. The log term corrects for it
     so brightness rises with pitch the way it does on a real instrument. */
  let bright = palmMute ? 0.30 : (wound ? 0.42 : 0.48) + (vel - 0.85) * 0.10 - damping * 0.06;
  if (!palmMute) bright += Math.log2(Math.max(f, 60) / 82.41) * 0.052;
  bright = Math.max(0.20, Math.min(0.68, bright));

  const dur = palmMute ? Math.min(duration, 0.55) : duration;
  const total = Math.floor(SR * dur);
  const buf = c.createBuffer(1, total, SR);
  const out = buf.getChannelData(0);

  /* --- excitation ---------------------------------------------------- */
  const P = SR / f;
  const N = Math.max(4, Math.round(P));
  const exc = new Float32Array(N);
  for (let i = 0; i < N; i++) exc[i] = Math.random() * 2 - 1;

  /* Soften the noise; a harder pluck keeps more high end */
  const soften = 0.62 - vel * 0.22;
  let sm = 0;
  for (let i = 0; i < N; i++) { sm = sm * soften + exc[i] * (1 - soften); exc[i] = sm; }

  /* Pick-position comb — the single biggest "this is a guitar" cue.
     Plucking at a fraction β of the string length cancels harmonics 1/β. */
  const beta = pickPos != null ? pickPos : (wound ? 0.16 : 0.20) + (Math.random() - 0.5) * 0.03;
  const shift = Math.max(1, Math.round(beta * N));
  /* Comb depth: deeper = more nasal/bridge-like. Too deep and the fundamental
     is scooped out and the note sounds thin, so this stays moderate. */
  const COMB_DEPTH = 0.62;
  const combed = new Float32Array(N);
  for (let i = 0; i < N; i++) combed[i] = exc[i] - exc[(i - shift + N) % N] * COMB_DEPTH;

  /* Normalise so low and high notes are equally loud */
  let peak = 0;
  for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(combed[i]));
  if (peak > 0) for (let i = 0; i < N; i++) combed[i] /= peak;

  /* Two polarisations, detuned symmetrically about f (±0.43 cents) so they
     beat gently against each other without shifting the perceived pitch. */
  renderString(out, total, SR, f * 0.99975, combed, t60Fast, bright,        0.62);
  renderString(out, total, SR, f * 1.00025, combed, t60Slow, bright * 0.92, 0.38);

  /* --- attack transient: the pick hitting the string ------------------ */
  const atkLen = Math.floor(SR * (palmMute ? 0.006 : 0.011));
  let hp = 0, prev = 0;
  for (let i = 0; i < atkLen && i < total; i++) {
    const n = Math.random() * 2 - 1;
    hp = 0.86 * (hp + n - prev);        // one-pole highpass → click, not thump
    prev = n;
    out[i] += hp * 0.17 * vel * Math.pow(1 - i / atkLen, 2.2);
  }

  /* --- tail fade so nothing clicks off --- */
  const fade = Math.min(total, Math.floor(SR * 0.3));
  for (let i = 0; i < fade; i++) out[total - fade + i] *= 1 - i / fade;

  /* --- output chain ---------------------------------------------------- */
  const src = c.createBufferSource();
  src.buffer = buf;

  const tone = c.createBiquadFilter();
  tone.type = "lowpass";
  tone.frequency.value = palmMute ? 1500 : (wound ? 3600 : 5200);
  tone.Q.value = 0.6;

  const g = c.createGain();
  g.gain.setValueAtTime(vel * 0.34, t0);

  /* Gentle stereo spread across the strings — makes a strum feel wide */
  let node = g;
  if (c.createStereoPanner && string != null) {
    const p = c.createStereoPanner();
    p.pan.value = (string - 2.5) / 2.5 * 0.22;
    g.connect(p); node = p;
  }

  src.connect(tone); tone.connect(g); node.connect(master);

  /* --- voice stealing: restriking a string silences what was on it --- */
  if (string != null) {
    const prevVoice = activeVoices[string];
    if (prevVoice && prevVoice.gain) {
      try {
        const pg = prevVoice.gain.gain;
        pg.cancelScheduledValues(t0);
        pg.setValueAtTime(pg.value, t0);
        pg.linearRampToValueAtTime(0.0001, t0 + 0.022);
      } catch (e) { /* already finished */ }
    }
    activeVoices[string] = { gain: g, src };
  }

  src.start(t0);
  src.stop(t0 + dur + 0.06);
  return src;
}

/* ------------------------------------------------------------ note helpers */
function note(stringIdx, fret, opts = {}) {
  return pluck(fretFreq(stringIdx, fret), Object.assign({ string: stringIdx }, opts));
}

/* Strum a shape. frets is 6 entries low→high, -1 = muted. */
function strumFrets(frets, opts = {}) {
  const {
    direction = "down", speed = 0.026, when = 0,
    velocity = 0.85, palmMute = false, duration = 3.0,
  } = opts;
  const order = direction === "up" ? [5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5];
  let n = 0;
  order.forEach((i) => {
    if (frets[i] === -1 || frets[i] == null) return;
    /* Real strums accelerate slightly and aren't perfectly even */
    const jitter = (Math.random() - 0.5) * speed * 0.35;
    /* Up-strokes are lighter and favour the treble strings */
    const shade = direction === "up" ? (0.55 + i * 0.07) : (0.98 - i * 0.02);
    note(i, frets[i], {
      when: when + n * speed + jitter,
      velocity: velocity * shade * (0.92 + Math.random() * 0.14),
      duration, palmMute,
      pickPos: direction === "up" ? 0.22 : 0.17,
      /* A strummed chord is never perfectly in tune with itself — this small
         spread is a large part of why a real strum sounds alive. */
      detuneCents: (Math.random() * 2 - 1) * 1.7,
    });
    n++;
  });
}

function chord(name, opts = {}) {
  const shape = (window.Fretwork && Fretwork.CHORDS[name]);
  if (!shape) return;
  strumFrets(shape.frets, opts);
}

/* --------------------------------------------------------- strum patterns */
/* "D" down · "U" up · "-" skip (hand keeps moving) · "x" muted chuck */
function parsePattern(p) { return String(p).replace(/\s+/g, "").split(""); }

function playPattern(chordName, pattern, bpm = 70, opts = {}) {
  const shape = (window.Fretwork && Fretwork.CHORDS[chordName]);
  if (!shape) return { duration: 0 };
  const steps = parsePattern(pattern);
  const eighth = 30 / bpm;
  const { bars = 1, onStep = null, when = 0, velocity = 1 } = opts;

  for (let b = 0; b < bars; b++) {
    steps.forEach((s, i) => {
      const t = when + (b * steps.length + i) * eighth;
      /* Accent beat 1, then the backbeat — this is what makes it groove */
      const accent = i === 0 ? 1.0 : i === 4 ? 0.9 : i % 2 === 0 ? 0.8 : 0.62;
      if (s === "D") strumFrets(shape.frets, { when: t, direction: "down", velocity: velocity * accent, duration: 2.6 });
      else if (s === "U") strumFrets(shape.frets, { when: t, direction: "up", velocity: velocity * accent * 0.78, duration: 2.2 });
      else if (s === "x") strumFrets(shape.frets, { when: t, direction: "down", velocity: velocity * 0.55, palmMute: true, duration: 0.35 });
      if (onStep) setTimeout(() => onStep(i, s, b), t * 1000);
    });
  }
  return { duration: steps.length * eighth * bars };
}

/* Fingerpicked arpeggio — thumb on the lowest string, fingers on the top three */
function arpeggio(chordName, opts = {}) {
  const shape = (window.Fretwork && Fretwork.CHORDS[chordName]);
  if (!shape) return { duration: 0 };
  const { when = 0, gap = 0.21, duration = 3.2, pattern = null } = opts;
  const played = [];
  shape.frets.forEach((f, i) => { if (f >= 0) played.push({ string: i, fret: f }); });
  if (!played.length) return { duration: 0 };

  const bass = played[0];
  const treble = played.slice(1);
  const order = pattern || [
    bass, treble[treble.length - 3] || treble[0], treble[treble.length - 2] || treble[0],
    treble[treble.length - 1] || treble[0],
    treble[treble.length - 2] || treble[0], treble[treble.length - 3] || treble[0],
  ].filter(Boolean);

  order.forEach((n, i) => {
    note(n.string, n.fret, {
      when: when + i * gap, duration,
      velocity: (i === 0 ? 0.92 : 0.66) * (0.9 + Math.random() * 0.16),
      pickPos: 0.26,     // fingers pluck further from the bridge — rounder tone
    });
  });
  return { duration: order.length * gap };
}

/* Travis-style alternating bass under a picked melody */
function travis(chordName, opts = {}) {
  const shape = (window.Fretwork && Fretwork.CHORDS[chordName]);
  if (!shape) return { duration: 0 };
  const { when = 0, bpm = 80, bars = 1 } = opts;
  const eighth = 30 / bpm;
  const played = [];
  shape.frets.forEach((f, i) => { if (f >= 0) played.push({ string: i, fret: f }); });
  const bass = [played[0], played[1] || played[0]];
  const top = played.slice(-3);
  for (let b = 0; b < bars; b++) {
    for (let i = 0; i < 8; i++) {
      const t = when + (b * 8 + i) * eighth;
      if (i % 2 === 0) {
        const n = bass[(i / 2) % 2];
        note(n.string, n.fret, { when: t, velocity: 0.85, duration: 2.4, pickPos: 0.24 });
      } else {
        const n = top[(i >> 1) % top.length];
        if (n) note(n.string, n.fret, { when: t, velocity: 0.58, duration: 2.0, pickPos: 0.27 });
      }
    }
  }
  return { duration: 8 * eighth * bars };
}

/* ------------------------------------------------------------- sequences */
function sequence(notes, opts = {}) {
  const { gap = 0.5, duration = 2.0, onNote = null, velocity = 0.85 } = opts;
  notes.forEach((n, i) => {
    note(n.string, n.fret, {
      when: i * gap, duration,
      velocity: velocity * (0.93 + Math.random() * 0.12),
    });
    if (onNote) setTimeout(() => onNote(i, n), i * gap * 1000);
  });
  return { duration: notes.length * gap };
}

/* Metronome click — deliberately not a guitar, so it cuts through */
function click(accent = false, when = 0) {
  const c = ensure(); if (!c) return;
  const t = c.currentTime + when;
  const o = c.createOscillator(), g = c.createGain();
  o.type = "square";
  o.frequency.value = accent ? 1600 : 900;
  g.gain.setValueAtTime(accent ? 0.2 : 0.11, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
  o.connect(g); g.connect(c.destination);
  o.start(t); o.stop(t + 0.06);
}

function countIn(bpm = 70, beats = 4, then = null) {
  const spb = 60 / bpm;
  for (let i = 0; i < beats; i++) click(i === 0, i * spb);
  if (then) setTimeout(then, beats * spb * 1000);
  return beats * spb;
}

function stopAll() {
  if (!ctx || !master) return;
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(0.0001, now + 0.07);
  Object.keys(activeVoices).forEach((k) => delete activeVoices[k]);
  setTimeout(() => {
    if (!ctx || !master) return;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(0.8, ctx.currentTime);
  }, 180);
}

window.Guitar = {
  context, ensure, blocked, showWarning, hideWarning, pluck, note, chord, strumFrets, playPattern,
  arpeggio, travis, sequence, click, countIn, stopAll,
  fretFreq, OPEN, parsePattern,
  ready: () => !!ctx && ctx.state === "running",
};

})();
