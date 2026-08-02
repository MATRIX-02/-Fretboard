/* ==========================================================================
   Fretwork — Lesson renderer
   Turns a lesson object into HTML, and wires up its audio buttons.
   ========================================================================== */

(function () {
"use strict";

/* Minimal inline formatting: **bold** and *italic* */
function fmt(t) {
  return String(t)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+?)\*/g, "$1<em>$2</em>");
}

let audioRegistry = [];

function render(lesson, opts = {}) {
  if (!lesson) return "";
  const { compact = false, showGoal = true } = opts;
  audioRegistry = [];

  let h = `<div class="lesson">`;

  if (showGoal && lesson.goal) {
    h += `<div class="callout mb"><strong>What you're aiming for:</strong> ${fmt(lesson.goal)}</div>`;
  }

  h += `<div class="lesson-steps">`;
  lesson.steps.forEach((s, i) => {
    h += `<div class="step">
      <div class="step-n">${i + 1}</div>
      <div class="step-body">
        <p>${fmt(s.text)}</p>`;
    if (s.viz && window.Viz) {
      try { h += s.viz(); } catch (e) { console.warn("viz failed", e); }
    }
    if (s.audio) {
      const id = "aud" + audioRegistry.length;
      audioRegistry.push(s.audio);
      h += `<div class="play-row"><button class="play-btn" data-audio="${id}">▶ ${s.audio.label}</button></div>`;
    }
    h += `</div></div>`;
  });
  h += `</div>`;

  if (!compact && lesson.mistakes && lesson.mistakes.length) {
    h += `<div class="divider"></div>
      <div class="stat-lab mb">If it isn't working</div>
      <div class="mistake-list">` +
      lesson.mistakes.map(([sym, fix]) =>
        `<div class="mistake"><span class="mistake-icon">✕</span>
          <span><b>${fmt(sym)}</b>${fmt(fix)}</span></div>`).join("") +
      `</div>`;
  }

  if (!compact && lesson.check && lesson.check.length) {
    h += `<div class="divider"></div>
      <div class="stat-lab mb">You've got it when</div>
      <ul class="selfcheck">` +
      lesson.check.map((c) => `<li>${fmt(c)}</li>`).join("") + `</ul>`;
  }

  return h + `</div>`;
}

/* Bind the play buttons produced by the most recent render() call. Pass the
   same lesson so repeated renders on a page each get their own registry. */
function wire(root, lesson) {
  if (!root) return;
  const audios = [];
  (lesson ? lesson.steps : []).forEach((s) => { if (s.audio) audios.push(s.audio); });

  root.querySelectorAll("[data-audio]:not([data-wired])").forEach((btn, i) => {
    btn.setAttribute("data-wired", "1");
    const spec = audios[i];
    if (!spec) return;
    btn.addEventListener("click", () => {
      if (!window.Guitar) return;
      Guitar.context();
      Guitar.stopAll();
      setTimeout(() => {
        try { spec.play(Guitar); } catch (e) { console.warn("audio failed", e); }
      }, 90);
      btn.classList.add("playing");
      setTimeout(() => btn.classList.remove("playing"), 1400);
    });
  });

  if (window.Viz) Viz.wireAudio(root);
}

/* Render + inject + wire in one call */
function mount(el, lesson, opts) {
  if (!el) return;
  if (!lesson) { el.innerHTML = ""; return; }
  el.innerHTML = render(lesson, opts);
  wire(el, lesson);
}

window.LessonUI = { render, wire, mount, fmt };

})();
