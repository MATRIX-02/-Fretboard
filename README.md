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
| `tools.html` | Metronome, tuner, chord library, strum patterns, progression player, fretboard trainer, ear trainer, change test, scale finder — all with guitar audio |
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

**Visual lessons** — every Phase 1 block (all 40, weeks 1–8)
- Numbered steps instead of one dense paragraph — tap "Show me how" on any block
- Fretboard diagrams showing exactly which finger goes on which string and fret; click any dot to hear that note
- Purpose-built explainers for the things text can't convey: where "behind the fret" actually is, how hard to press, pick grip, sitting posture, p-i-m-a picking assignments, strum-pattern grids
- Chord-change maps that compare two shapes and tell you what stays planted, what's a shared landmark, and what has to move — computed from the chord data, not hand-written
- "If it isn't working" troubleshooting (buzzing, dead strings, aching hand) and a self-check for every block

**Acoustic guitar audio** — synthesised, no files, works offline
- Extended Karplus–Strong: dual-polarisation strings (fast initial decay into a long ringing tail, with gentle beating between the two planes), pick-position comb filtering, a pick attack transient, dreadnought body resonances, and per-string character so wound basses are darker than plain trebles
- Voice stealing — restriking a string cuts the note already on it, so strummed chords don't pile into mud
- Human detune and velocity spread on strums; single notes stay exact
- Strum, fingerpicked arpeggio and Travis-picking engines
- Accurate to **0.25 cents** across the whole neck — verified by frequency analysis, so it's safe to tune and train your ear against
- No "click to unlock" step. Press play; if a browser genuinely refuses, a bar appears offering to play anyway

**Songs (92 total — 65 Hindi/Urdu/Punjabi, 27 English)**
- Categories: unplugged staples, modern Bollywood, Indian indie, Hindi rock, 90s Indipop, 2000s Bollywood, ghazals, golden-era film, English classics, fingerstyle pieces, lead studies
- Each song lists key, capo, chord set, strum pattern, and the curriculum week where it becomes playable
- Filter by language, category, level, chord, or "only what I can play now"
- Recommendations lean Hindi and follow your current week; dashboard and week pages surface three picks each
- **Press ▶ Play on any song** to hear its chords with that song's own strum pattern; fingerstyle songs are picked rather than strummed, Travis-picking songs use the Travis engine
- Click any individual chord name to hear just that shape
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

**Practice tools** — every one of these now uses the guitar synth
- Timed session runner with auto-advance, chime, keyboard control (space / ← / →)
- **Metronome** — tap tempo, 5 time signatures, subdivisions, accents, "2 & 4 only" groove mode, automatic speed trainer, and an option to strum a chord along with the click
- **Tuner** — real plucked reference tones in 6 tunings, with an adjustable A reference (432–446 Hz) if you're playing with someone else
- **Chord library** — click any of the 47 diagrams to hear it as a down-strum, up-strum, picked arpeggio, or one string at a time (which is how you find a dead string in your own version)
- **Strum pattern player** — 8 patterns, visual beat grid that lights up as it plays, adjustable tempo, count-in, loop
- **Progression player** — 8 common progressions played as real strummed chords, to practise changes against
- **Fretboard trainer** — hears the actual note you're being asked to name, right or wrong, plus a neck diagram of the position
- **Ear trainer** — intervals played on real fretted string positions, ascending / descending / harmonic, 3 levels
- **Chord change test** — with a pivot-finger diagram and a "hear both chords" reference
- **Scale finder** — 11 scales in every key, laid out as a playable one-position shape on the neck, playable ascending and descending, plus its diatonic chords

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
1. **Extend the visual lessons into Phase 2** — weeks 9–20 (barre chords especially) would benefit most. The diagram and audio libraries are already built, so this is content work rather than engineering.
2. **Song chord-chart viewer** — paste lyrics with chords, get a scrolling, transposable chart with a capo calculator. The natural next step for the song library.
3. **Practice-block favourites** — pin drills that are working and inject them into any session.
4. **Progress photos / audio snippets** — attach a 30-second recording to a session log. Hearing week 1 next to week 20 is the most motivating thing in the whole app.
5. **Printable weekly sheet** — one page per week for a music stand, no screen.

**High value, moderate**
6. **Real pitch-detection tuner** — `getUserMedia` + autocorrelation gives a true needle tuner from the laptop mic. ~150 lines.
7. **Backing-track generator** — Web Audio chord pads over a progression at a chosen tempo and key, for improvisation practice.
8. **Spaced repetition for chords and notes** — resurface the shapes you get wrong more often, Anki-style.
9. **Rhythm trainer** — tap along to a displayed rhythm; scores your timing accuracy in milliseconds.

**Bigger projects**
10. **PWA install + push** — a service worker and manifest would make it installable on your phone's home screen and let reminders fire without the app open. Now that it's hosted, this is the natural next step.
11. **Chrome extension wrapper** — real OS notifications that fire without a tab open, plus a popup showing today's blocks. Needs `manifest.json`, a service worker and the `alarms` permission.
12. **Interactive fretboard canvas** — click notes, overlay any scale or arpeggio, animate position shifts.
13. **Tab/chord-chart importer** — parse a pasted Ultimate Guitar chart into structured sections.
14. **Video demonstrations** — the one thing diagrams and synthesised audio can't replace is watching a real hand move. Short clips per technique would close that last gap.

---

## Notes

- **Local by default.** Without an account, all data lives in your browser's `localStorage` and nothing is uploaded anywhere. Sign-in and sync are opt-in — see `SETUP.md`.
- **Back up occasionally.** Tracker → *Export backup*. Clearing browser data wipes your progress otherwise.
- **Audio needs one click.** Browsers block sound until you interact with the page — press any play button once and audio works from then on.
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
        ├── lessons.js      Visual lesson content (Phase 1 complete)
        ├── lesson-ui.js    Lesson renderer
        ├── visuals.js      SVG diagram library
        ├── audio-guitar.js Plucked-string synthesis
        ├── firebase-config.js  Your Firebase keys (placeholders until you fill them)
        ├── sync.js         Auth + cross-device merge engine
        └── app.js          Storage, streaks, chords, audio
```
