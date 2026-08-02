# 🎸 Fretwork

A self-contained guitar learning site: a 48-week curriculum from first note to improvisation, a timed practice runner, a reminder system, and progress tracking. Everything runs locally in your browser — no account, no internet, no server required.

**Open `index.html` to start.**

---

## The pages

| Page | What it's for |
|---|---|
| `index.html` | Dashboard — today's session, streak, stats, activity heatmap, phase progress |
| `curriculum.html` | The full 48-week index. Click any week for its full detail |
| `week.html` | Current week in depth — blocks with tick-off, chord diagrams, weekly day grid |
| `practice.html` | Timed session runner: block-by-block timer, inline metronome, session log |
| `songs.html` | 92-song library — mainly Hindi, plus English staples — with chords, capo, strum and the week each unlocks |
| `tools.html` | Metronome, tuner, chord library, fretboard trainer, ear trainer, change test, scale finder |
| `tracker.html` | Charts, measured skills, repertoire list, goals, practice log, backup/restore |
| `reminders.html` | Daily notification, calendar export, habit-design checklist |
| `account.html` | Sign in, cross-device sync status, guest upgrade, setup guide |

---

## The plan: how long and what daily

**48 weeks, four phases.** At 5 sessions a week that's about 11 months; at 7 it's closer to 9.

| Phase | Weeks | Focus | You come out able to |
|---|---|---|---|
| 🌱 Foundations | 1–8 | Posture, 8 open chords, strumming in time | Play a full song from memory |
| 🎵 Rhythm & Song Craft | 9–20 | Barre chords, groove, capo, 7ths, percussion | A 5-song setlist, in any key |
| 🧭 Fretboard & Theory | 21–34 | Note map, keys, CAGED, triads, fingerstyle, ear training | Find any chord anywhere; transcribe by ear |
| 🔥 Improvisation & Artistry | 35–48 | Pentatonics, bending, modes, chord tones, arranging, writing | Improvise musically; arrange and write your own |

Weeks 8, 20, 34 and 48 are **checkpoints** — don't move past one until you've hit its milestone.

### The daily structure

Each week has 5–6 practice blocks, tiered so any amount of time counts:

- **Tier 1 — Core (~15–25 min).** Warm-up, tuning, and the week's single most important drill. On a bad day do only this. The streak still counts.
- **Tier 2 — Standard (~40–55 min).** Adds application drills and song work. This is the pace the 48-week timeline assumes.
- **Tier 3 — Deep (~75–95 min).** Adds creative work, recording and repertoire. Best on weekends.

Pick Short / Normal / Long at the start of each session and the runner builds the right queue.

**Suggested week shape:** Mon standard · Tue standard · Wed short · Thu standard · Fri long · Sat long · Sun rest or short. Rest days matter — hands adapt while you're not playing.

---

## Features currently built

**Learning**
- 48 weeks × 268 practice blocks, each with what to do *and* how to do it
- Per-week skills, theory note, song target and one measurable milestone
- Interactive chord diagrams (47 shapes with fingering numbers)
- Scale & key finder — 11 scales, diatonic chords, full fretboard map

**Songs (92 total — 65 Hindi/Urdu/Punjabi, 27 English)**
- Categories: unplugged staples, modern Bollywood, Indian indie, Hindi rock, 90s Indipop, 2000s Bollywood, ghazals, golden-era film, English classics, fingerstyle pieces, lead studies
- Each song lists key, capo, chord set, strum pattern, and the curriculum week where it becomes playable
- Filter by language, category, level, chord, or "only what I can play now"
- Recommendations lean Hindi and follow your current week; dashboard and week pages surface three picks each
- One click adds a song to your tracker repertoire with its chords and strum pre-filled

### Song levels

| Level | Weeks | What it means | Examples |
|---|---|---|---|
| 1 · First songs | 4–8 | 2–4 open chords, slow tempo | Pehla Nasha, Kabira, Iktara, Country Roads |
| 2 · Building | 9–16 | 4–6 open chords, real strumming | Channa Mereya, Tum Hi Ho, Baarishein, Choo Lo |
| 3 · Barre level | 17–26 | Barre chords, 7ths, dynamics | Tere Bin, Bekhayali, Kun Faya Kun, Hotel California |
| 4 · Fingerstyle | 27–38 | Picking, arrangement, richer harmony | Tum Itna Jo Muskura Rahe Ho, Lag Ja Gale, Blackbird |
| 5 · Advanced | 39–48 | Lead, solos, full arrangements | Kandisa, Bulleya, Sadda Haq, Little Wing |

> Keys and capos are the common guitar-chart versions, not always the studio recording. Move the capo to suit your voice — week 17 covers exactly how.

**Practice**
- Timed session runner with auto-advance, chime, keyboard control (space / ← / →)
- Metronome: tap tempo, 5 time signatures, subdivisions, accents, "2 & 4 only" groove mode, and an automatic speed trainer
- Reference tuner in 6 tunings, plus A440
- Fretboard note trainer with timed scoring
- Interval ear trainer (ascending / descending / harmonic, 3 difficulty levels)
- One-minute chord-change test — the highest-ROI beginner drill

**Tracking**
- Streak, best streak, total hours, weeks complete, pace vs. schedule
- 12-week activity heatmap and a practice-minutes bar chart
- Measured-skill history: change counts, fretboard accuracy, ear accuracy
- Repertoire list with status, goals list, per-session notes and mood
- JSON export / import, and a printable progress report

**Accounts & cross-device sync** *(optional — see `SETUP.md`)*
- Google sign-in, email + password, and guest mode
- Guest mode is a real account you can upgrade later without losing anything
- Progress syncs to every device automatically; other open tabs update live
- **Devices merge, they never overwrite** — sessions, practice days, songs, goals and completed weeks are combined from both sides, so nothing is lost when you use two devices in one day
- Works offline and pushes when you reconnect
- Runs local-only until you add Firebase credentials — no account required, ever

**Consistency**
- Browser notification at a set time on chosen days — only fires if you haven't practised yet
- `.ics` calendar export with a 10-minute alarm (works when the browser is closed, syncs to your phone)
- Habit-design checklist based on what actually predicts long-term adherence

---

## Features worth adding next

Roughly in order of value-per-effort.

**High value, easy**
1. **Song chord-chart viewer** — paste lyrics with chords, get a scrolling, transposable chart with a capo calculator. The natural next step for the song library.
2. **Practice-block favourites** — pin drills that are working and inject them into any session.
3. **Progress photos / audio snippets** — attach a 30-second recording to a session log. Hearing week 1 next to week 20 is the most motivating thing in the whole app.
4. **Printable weekly sheet** — one page per week for a music stand, no screen.

**High value, moderate**
5. **Real pitch-detection tuner** — `getUserMedia` + autocorrelation gives a true needle tuner from the laptop mic. ~150 lines.
6. **Backing-track generator** — Web Audio chord pads over a progression at a chosen tempo and key, for improvisation practice.
7. **Spaced repetition for chords and notes** — resurface the shapes you get wrong more often, Anki-style.
8. **Rhythm trainer** — tap along to a displayed rhythm; scores your timing accuracy in milliseconds.

**Bigger projects**
9. **PWA install + push** — a service worker and manifest would make it installable on your phone's home screen and let reminders fire without the app open. Now that it's hosted, this is the natural next step.
10. **Chrome extension wrapper** — real OS notifications that fire without a tab open, plus a popup showing today's blocks. Needs `manifest.json`, a service worker and the `alarms` permission.
10. **Interactive fretboard canvas** — click notes, overlay any scale or arpeggio, animate position shifts.
11. **Tab/chord-chart importer** — parse a pasted Ultimate Guitar chart into structured sections.
12. **PWA + offline install** — service worker and manifest so it installs as a desktop/phone app with background sync.
13. **Sync across devices** — the only feature that genuinely needs a backend. A GitHub Gist or a small cloud KV store would do it.

---

## Notes

- **Local by default.** Without an account, all data lives in your browser's `localStorage` and nothing is uploaded anywhere. Sign-in and sync are opt-in — see `SETUP.md`.
- **Back up occasionally.** Tracker → *Export backup*. Clearing browser data wipes your progress otherwise.
- **Audio needs one click.** Browsers block sound until you interact with the page — press any button once and audio works.
- **If a red banner appears** saying storage is blocked, run `start-local-server.bat` and use `http://localhost:8123` instead of opening the file directly.

## Structure

```
Guitar Claude/
├── index.html            Dashboard
├── curriculum.html       48-week index
├── week.html             Week detail
├── practice.html         Session runner
├── songs.html            92-song library (mainly Hindi)
├── tools.html            Metronome, tuner, trainers
├── tracker.html          Progress, songs, goals, backup
├── reminders.html        Notifications, calendar, habits
├── account.html          Sign in + sync status
├── start-local-server.bat
├── SETUP.md              Firebase + GitHub Pages walkthrough
└── assets/
    ├── css/style.css
    ├── icon.svg
    └── js/
        ├── curriculum.js   All 48 weeks of content
        ├── songs.js        The song library
        ├── firebase-config.js  Your Firebase keys (placeholders until you fill them)
        ├── sync.js         Auth + cross-device merge engine
        └── app.js          Storage, streaks, chords, audio
```
