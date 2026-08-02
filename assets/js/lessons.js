/* ==========================================================================
   Fretwork — Visual lessons

   Each practice block can have a lesson: a goal, numbered steps with diagrams
   and audio demos, the mistakes people actually make, and a self-check so you
   know whether you've got it.

   Keyed "w<week>|<block name>". Generic blocks that repeat across weeks fall
   back to SHARED by name.

   Shape:
     goal      one sentence — what success looks like
     steps     [{ text, viz(), audio: {label, play(G)} }]
     mistakes  [[symptom, cause and fix]]
     check     ["you've got it when …"]
   ========================================================================== */

(function () {
"use strict";

const V = () => window.Viz;
const G = () => window.Guitar;

/* Chromatic 1-2-3-4 walk used in every warm-up */
const chromaticNotes = (str) => [1, 2, 3, 4].map((f) => ({ string: str, fret: f }));

/* ============================ SHARED / RECURRING ========================= */
const SHARED = {

  "Warm-up + tune": {
    goal: "Get your hands moving and the guitar in tune before anything else. Two minutes, every session, no exceptions.",
    steps: [
      { text: "**Tune first.** An out-of-tune guitar teaches your ear the wrong thing. Use the tuner on the Tools page, or the reference tones below — play the tone, then your string, and turn the peg until the two sounds stop wobbling against each other.",
        audio: { label: "Play all 6 strings in tune", play: (g) => [0,1,2,3,4,5].forEach((s,i)=>g.note(s,0,{when:i*0.85, duration:1.6})) } },
      { text: "**The chromatic walk.** Put finger 1 on fret 1, finger 2 on fret 2, finger 3 on fret 3, finger 4 on fret 4 — one finger per fret, all on the low E string. Play each note as you place it. Then move to the A string and repeat, all the way to the high e.",
        viz: () => V().neck({ from: 0, to: 5, height: 176, showFingerKey: true,
          marks: [{string:0,fret:1,finger:1,step:1},{string:0,fret:2,finger:2,step:2},
                  {string:0,fret:3,finger:3,step:3},{string:0,fret:4,finger:4,step:4}],
          caption: "Start here on the low E string, then repeat the same shape on each of the other five strings. Click any dot to hear that note." }),
        audio: { label: "Hear the walk", play: (g) => g.sequence(chromaticNotes(0), { gap: 0.5 }) } },
      { text: "**Come back down.** From the high e string, walk back down using fingers 4-3-2-1. Keep the fingers you're not using hovering just above the strings rather than flying away — that hover is what eventually makes chord changes fast." },
      { text: "**Stay slow.** This is a warm-up, not a race. If any note buzzes, you're going too fast. Clean at slow speed becomes clean at fast speed; sloppy at slow speed just becomes sloppy at fast speed." },
    ],
    mistakes: [
      ["Fingers fly far away from the strings", "Every millimetre of travel is time you don't have during a chord change. Keep unused fingers within about 1 cm of the strings."],
      ["Using one finger for everything", "The whole point is one finger per fret. It feels awkward for the first two weeks and then it doesn't."],
      ["Skipping the tune-up because it 'sounds fine'", "It usually isn't. Untuned practice trains your ear to accept wrong pitches, which is much harder to undo later."],
    ],
    check: ["All 24 notes ring clean with no buzz", "You can do it without looking at your fretting hand the whole time", "Your hand isn't aching afterwards"],
  },

  "Warm-up: chromatic + tune": null,   // aliased below
  "Warm-up + barre prep": null,
};
SHARED["Warm-up: chromatic + tune"] = SHARED["Warm-up + tune"];

/* =============================== WEEK 1 ================================== */
const LESSONS = {

"w1|Tune up & posture check": {
  goal: "Hold the guitar so that your hands can actually do their job — and get it in tune.",
  steps: [
    { text: "**Sit forward on a chair**, both feet flat on the floor. Not a sofa, not the edge of a bed — you want a firm, level seat.",
      viz: () => V().posture() },
    { text: "**Rest the guitar's waist on your right thigh** (if you're right-handed). The body should sit against your chest without you gripping it. Let your right forearm rest over the top of the body — that's what holds the guitar in place, not your left hand." },
    { text: "**Angle the neck slightly upward**, about 15°. A neck pointing at the floor forces your wrist into a bend that will hurt within a week." },
    { text: "**Left hand:** thumb on the *back* of the neck, roughly behind your middle finger, pointing up toward the ceiling rather than lying along the neck. Your palm should not touch the neck at all — there's a visible gap.",
      viz: () => V().fingerKey() },
    { text: "**Now tune.** Play each reference tone below, then play your string, and adjust the tuning peg until the wobble between the two sounds disappears. Always tune *up* to the note — if you're sharp, go below and come back up.",
      audio: { label: "Play E A D G B e", play: (g) => [0,1,2,3,4,5].forEach((s,i)=>g.note(s,0,{when:i*1.1,duration:2})) } },
  ],
  mistakes: [
    ["Hunching over to look at the fretboard", "Your back will hurt and you'll never learn to play by feel. Raise the guitar instead, or accept a few wrong notes while you learn to find frets blind."],
    ["Palm wrapped around the neck like a baseball bat", "It feels secure and it makes every chord harder. Keep the thumb behind the neck and a gap under your palm."],
    ["Guitar slipping down your leg", "You're gripping with your left hand to compensate. Let your right forearm hold it, or use a strap even when sitting."],
  ],
  check: ["You can let go with your left hand entirely and the guitar doesn't move", "There's a visible gap between your palm and the neck", "All six strings sound in tune against the reference"],
},

"w1|One-finger note drill": {
  goal: "Make a single note ring cleanly, with no buzz and no dead string. This is the foundation of everything else — chords are just several of these at once.",
  steps: [
    { text: "**Where the finger goes.** \"Behind the fret\" means between two metal bars, pressed right up against the higher-numbered one. Not in the middle of the gap, and definitely not on top of the metal.",
      viz: () => V().fretPlacement() },
    { text: "**Do this now:** put finger 1 on the low E string just behind fret 1. Pluck that string with your right hand. Listen. If it buzzes, slide your finger slightly forward toward the fret and try again.",
      viz: () => V().neck({ from: 0, to: 4, height: 172, marks: [{ string: 0, fret: 1, finger: 1, color: "var(--good)" }],
        caption: "One finger, one string, one note. Click the dot to hear what it should sound like." }),
      audio: { label: "Hear a clean note", play: (g) => g.note(0, 1, { duration: 2.6 }) } },
    { text: "**How hard to press.** Almost certainly less than you think. Press until the note is clean, then slowly *release* pressure until it starts to buzz. The right amount is just barely above that point.",
      viz: () => V().pressureGauge() },
    { text: "**Work through the grid.** Play every string at fret 1, then every string at fret 2, then frets 3 and 4. That's 24 notes. Use finger 1 for fret 1, finger 2 for fret 2, and so on.",
      viz: () => V().neck({ from: 0, to: 5, height: 186, showFingerKey: true,
        marks: [0,1,2,3,4,5].flatMap((st) => [1,2,3,4].map((f) => ({ string: st, fret: f, finger: f, ghost: true }))),
        caption: "The full drill. Every dot is one note. Click any of them to hear it." }),
      audio: { label: "Hear the first string's four notes", play: (g) => g.sequence(chromaticNotes(0), { gap: 0.6 }) } },
    { text: "**Use the tip of your finger**, not the pad. Curl the finger so it comes down almost vertically. A flat finger touches the neighbouring string and kills it — that's the number one cause of \"dead\" strings in chords later." },
  ],
  mistakes: [
    ["A buzzing, rattling sound", "Either your finger is too far back from the fret, or you're not pressing hard enough. Move forward first — that fixes it more often than pressing harder."],
    ["A dull thud with no pitch", "Your finger is sitting on top of the metal fret. Slide back a few millimetres."],
    ["The note is clean but the string next to it goes silent", "Your finger is lying flat and touching it. Curl more and come down on the fingertip."],
    ["Your hand aches after two minutes", "You're squeezing far too hard. Do the release-until-it-buzzes exercise again — most beginners use three times the pressure needed."],
  ],
  check: ["All 24 notes ring clear with no buzz", "You can play a note without looking at your hand", "Your fretting hand feels tired but not painful"],
},

"w1|Em & Asus2 chords": {
  goal: "Play your first two chords with every string ringing. These two were chosen because they only need two fingers each.",
  steps: [
    { text: "**E minor.** Finger 2 on the A string (5th) at fret 2. Finger 3 on the D string (4th) at fret 2. Every other string rings open. Strum all six.",
      viz: () => V().chordOnNeck("Em", { caption: "Em — the friendliest chord on the guitar. All six strings are played." }),
      audio: { label: "Hear Em", play: (g) => g.chord("Em", { duration: 3 }) } },
    { text: "**Check it string by string.** Don't strum yet — pluck each string one at a time from low E to high e. All six should ring. If one is dead, that finger is lying flat against it. Curl more.",
      audio: { label: "Em, one string at a time", play: (g) => g.strumFrets(Fretwork.CHORDS.Em.frets, { speed: 0.62, duration: 2.4 }) } },
    { text: "**A suspended 2.** Finger 1 on the D string (4th) at fret 2. Finger 2 on the G string (3rd) at fret 2. Don't play the low E string — start your strum from the A string.",
      viz: () => V().chordOnNeck("Asus2", { caption: "Asus2 — the ✕ on the low E means don't play that string." }),
      audio: { label: "Hear Asus2", play: (g) => g.chord("Asus2", { duration: 3 }) } },
    { text: "**Strum both, eight times each.** Slow, relaxed, one strum per second. You're not learning to change between them yet — just to form each shape and have it sound clean.",
      audio: { label: "Em → Asus2", play: (g) => { g.chord("Em",{duration:2.6}); g.chord("Em",{when:1.4,duration:2.6}); g.chord("Asus2",{when:2.8,duration:2.6}); g.chord("Asus2",{when:4.2,duration:2.8}); } } },
    { text: "**Land all fingers at once.** Lift your whole hand off, then place both fingers simultaneously rather than one after the other. This feels harder now and saves you months later." },
  ],
  mistakes: [
    ["One string in the chord is silent", "A finger is leaning on it. Pluck each string individually to find which one, then curl that finger more."],
    ["The chord sounds muddy or buzzy overall", "You're probably not pressing right behind the frets. Check each finger's position individually."],
    ["You place fingers one at a time", "Fine today, a problem by week 4. Practise the whole-hand landing now while there are only two fingers to coordinate."],
  ],
  check: ["Em rings on all six strings", "Asus2 rings on five strings, low E not played", "You can form each shape in under three seconds from a lifted hand"],
},

"w1|Finger independence": {
  goal: "Teach your ring and little fingers to work separately. They start out useless — that's normal and it's fixable.",
  steps: [
    { text: "**The 1-2-3-4 walk.** On the low E string, place finger 1 at fret 1 and *leave it down*. Add finger 2 at fret 2, still leaving 1 down. Then 3 at fret 3, then 4 at fret 4. All four fingers stay on the string at once.",
      viz: () => V().neck({ from: 0, to: 5, height: 176, showFingerKey: true,
        marks: [{string:0,fret:1,finger:1,step:1},{string:0,fret:2,finger:2,step:2},
                {string:0,fret:3,finger:3,step:3},{string:0,fret:4,finger:4,step:4}],
        caption: "Add one finger at a time, keeping the previous ones down. Play each note as you add it." }),
      audio: { label: "Hear it", play: (g) => g.sequence(chromaticNotes(0), { gap: 0.55 }) } },
    { text: "**Then unwind.** Lift finger 4 and play fret 3. Lift 3 and play fret 2. Lift 2 and play fret 1. Then move to the A string and start again." },
    { text: "**Use the metronome at 50 bpm**, one note per click. Slow is the point. If you can't do it cleanly at 50, doing it at 80 is just practising mistakes faster.",
      audio: { label: "50 bpm click", play: (g) => { for (let i=0;i<8;i++) g.click(i%4===0, i*1.2); } } },
    { text: "**Your little finger will not cooperate.** This is universal. It has no independent tendon in the way the others do. Six weeks of this drill fixes it. Don't skip it because it's frustrating — it's frustrating for everyone." },
  ],
  mistakes: [
    ["Fingers 3 and 4 move together", "Anatomically normal. Slow down until they separate, even if that means 40 bpm."],
    ["Earlier fingers lift when you add a new one", "That's the actual exercise — keeping them down is the difficulty. Watch your hand and consciously hold them."],
    ["Wrist collapses forward", "Keep the wrist relatively straight. A collapsed wrist limits how far your little finger can reach."],
  ],
  check: ["All four fingers can sit on frets 1-4 at once", "You can lift finger 3 without finger 4 following it", "60 bpm, all six strings, no buzz"],
},

"w1|Listening": {
  goal: "Start hearing the beat consciously. Rhythm is a bigger obstacle than chords for most beginners, and this costs you nothing but attention.",
  steps: [
    { text: "**Pick three acoustic songs you love.** Any genre, any language. Play them and clap on the beat — the pulse you'd naturally tap your foot to." },
    { text: "**Find beat 1.** Most songs group beats in fours. Count \"1-2-3-4, 1-2-3-4\" out loud along with the music. Beat 1 is usually where the chord changes or the phrase restarts.",
      viz: () => V().countBar("1 &nbsp; 2 &nbsp; 3 &nbsp; 4 &nbsp;│&nbsp; 1 &nbsp; 2 &nbsp; 3 &nbsp; 4", "One bar of 4/4 time, repeating. Almost everything you'll play lives in this grid.") },
    { text: "**Listen for the guitar specifically.** Try to hear whether it's strummed or picked, and roughly how fast the strumming hand is moving. You're building a mental model of what you're aiming at." },
    { text: "**No guitar needed for this one.** Do it on a walk or a commute. It still counts as practice." },
  ],
  mistakes: [
    ["Clapping on every note instead of the beat", "The beat is steady even when the melody isn't. Tap your foot first, then match your hands to your foot."],
    ["Losing the count during the chorus", "Normal. Start again on the next obvious downbeat rather than trying to catch up."],
  ],
  check: ["You can clap a steady beat through a whole song", "You can say which count the chord changes land on"],
},

/* =============================== WEEK 2 ================================== */
"w2|Chord shape build": {
  goal: "Add Am and D to Em, and get all three ringing clean.",
  steps: [
    { text: "**A minor.** Finger 1 on the B string (2nd) fret 1. Finger 2 on the D string (4th) fret 2. Finger 3 on the G string (3rd) fret 2. Don't play the low E.",
      viz: () => V().chordOnNeck("Am"),
      audio: { label: "Hear Am", play: (g) => g.chord("Am", { duration: 3 }) } },
    { text: "**D major.** Finger 1 on the G string (3rd) fret 2. Finger 2 on the high e (1st) fret 2. Finger 3 on the B string (2nd) fret 3. Only play the top four strings — start your strum at the D string.",
      viz: () => V().chordOnNeck("D"),
      audio: { label: "Hear D", play: (g) => g.chord("D", { duration: 3 }) } },
    { text: "**Em, for comparison.** Notice Am and Em use the same two fingers in almost the same place — that's going to be useful in a moment.",
      viz: () => V().pivotMap("Am", "Em") },
    { text: "**Test every string.** For each chord, pluck the strings one at a time. Fix any dead string before moving on. It's much easier to fix now than after you've built muscle memory around it.",
      audio: { label: "Am, string by string", play: (g) => g.strumFrets(Fretwork.CHORDS.Am.frets, { speed: 0.6, duration: 2.4 }) } },
  ],
  mistakes: [
    ["D chord sounds thin or wrong", "You're probably hitting the low E or A string. Aim your strum to start on the D string — practise the aim without fretting anything."],
    ["The high e string is dead in Am", "Finger 3 is leaning over. Curl it and bring the wrist slightly forward."],
    ["The B string buzzes in D", "Finger 3 needs to be right behind fret 3, and it's a stretch. Move your thumb down the back of the neck to give it more reach."],
  ],
  check: ["Em, Am and D each ring on every string they should", "You can name which finger goes where without looking at the diagram"],
},

"w2|Place-and-lift drill": {
  goal: "Train your hand to land a whole chord shape at once, instead of building it finger by finger.",
  steps: [
    { text: "**Form the chord.** Take your time. Check it sounds clean.",
      audio: { label: "Target sound: Am", play: (g) => g.chord("Am", { duration: 2.8 }) } },
    { text: "**Lift your entire hand off the strings** — a few centimetres away, fingers still holding the shape in the air." },
    { text: "**Put it back down as one movement.** All fingers touch the strings at the same instant. Strum. Was it clean?" },
    { text: "**Ten times per chord**, for Em, Am and D. Count them. The goal isn't speed — it's that the shape arrives complete." },
    { text: "**Why this matters:** during a song you don't have time to place three fingers in sequence. Your hand needs to know the shape as one thing, the way it knows how to grip a cup." },
  ],
  mistakes: [
    ["Fingers arrive one at a time despite trying", "Slow the lift-and-return right down. Speed comes from the shape being memorised, not from moving faster."],
    ["The shape falls apart in the air", "That's the useful information — your hand doesn't own the shape yet. Keep going, it takes a few days."],
  ],
  check: ["All three chords land complete and clean from a lifted hand", "Ten clean landings in a row on your best chord"],
},

"w2|Slow changes": {
  goal: "Make your first chord change, with no time pressure at all.",
  steps: [
    { text: "**Am to Em.** Play Am, strum four times slowly. Then change to Em and strum four times. Repeat.",
      audio: { label: "Am → Em, slow", play: (g) => { g.chord("Am",{duration:2}); g.chord("Am",{when:1,duration:2}); g.chord("Em",{when:2,duration:2}); g.chord("Em",{when:3,duration:2.4}); } } },
    { text: "**Find the shortcut.** Am and Em use fingers 2 and 3 in the same fret — they just move across by one string. Finger 1 lifts off entirely.",
      viz: () => V().pivotMap("Am", "Em") },
    { text: "**Move the two fingers as a pair.** Don't lift them separately and re-aim. Keep their relative shape and slide the pair one string over." },
    { text: "**No metronome yet.** Take as long as you need between chords. Accuracy first; speed is a side effect of accuracy, not a separate skill." },
  ],
  mistakes: [
    ["Rebuilding the shape from scratch each time", "Look for the fingers that don't need to move. There's almost always at least one."],
    ["Rushing and getting a muddy chord", "Slow down until it's clean. A clean slow change becomes a clean fast change; a messy fast change stays messy."],
  ],
  check: ["Am → Em without looking down for more than a second", "Both chords still ring clean after the change"],
},

"w2|Song listening + chart reading": {
  goal: "Learn to read a chord chart, which is how almost all guitar music is written down.",
  steps: [
    { text: "**A chord chart is just lyrics with chord names floating above them.** The chord name sits above the exact syllable where you change to it.",
      viz: () => V().countBar("C&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Am<br><span style='color:var(--text-2);font-size:.9rem'>This is where the words go</span>", "Change to Am on the word where the 'Am' sits — not before, not after.") },
    { text: "**Find a chart for a song you like.** Search the song name plus \"chords\". Look at which chords it uses and check them against the ones you know." },
    { text: "**Don't try to play it yet.** This week the aim is just to be able to look at a chart and understand what it's telling you." },
    { text: "**Check the key and capo line.** Most charts tell you at the top, e.g. \"Capo 2\". That's covered properly in week 17 — for now, just notice it's there." },
  ],
  mistakes: [
    ["Picking a song with chords you don't know yet", "Filter for beginner songs. The Songs page in this app lists which curriculum week each song becomes playable."],
    ["Trying to read and play at the same time", "Learn the chord sequence first, then the words. Two new things at once is one too many."],
  ],
  check: ["You can look at a chart and say what the chord sequence is", "You can identify which of its chords you already know"],
},

/* =============================== WEEK 3 ================================== */
"w3|Metronome down-strums": {
  goal: "Strum in time. Not fast, not fancy — just perfectly steady.",
  steps: [
    { text: "**Set the metronome to 60 bpm.** One click per second. Hold an Em chord and strum downward once on every click.",
      audio: { label: "60 bpm with Em", play: (g) => { for(let i=0;i<8;i++){ g.click(i%4===0, i); g.chord("Em",{when:i,duration:1.4}); } } } },
    { text: "**The motion comes from your wrist**, not your whole arm and not your fingers. Think of flicking water off your hand. Your forearm stays fairly still." },
    { text: "**Keep the hand moving even between strums.** Down, back up (without hitting the strings), down again. A hand that stops and starts can never keep time.",
      viz: () => V().strumGrid("D-D-D-D-", { caption: "Four down-strums per bar. The dashes are where your hand travels back up without touching the strings." }) },
    { text: "**Two minutes without stopping.** That's the whole exercise. If you drift ahead or behind the click, don't stop — adjust and carry on. Recovering without stopping is itself a skill." },
    { text: "**Strum over the soundhole**, not right at the bridge (too harsh) or over the neck (too soft)." },
  ],
  mistakes: [
    ["Speeding up gradually", "Extremely common. Record 30 seconds and listen — you'll hear it. Fix it by counting out loud."],
    ["Strumming from the elbow", "Tiring and imprecise. Rest your forearm on the guitar's edge as a pivot and move from the wrist."],
    ["Hitting the strings too hard", "The pick digs in and snags. Brush across the strings rather than chopping at them."],
  ],
  check: ["Two full minutes at 60 bpm with no drift", "Your hand keeps moving continuously", "The chord still sounds clean while you strum"],
},

"w3|G and C chords": {
  goal: "Add the two chords that, with D and Em, unlock a huge chunk of popular music.",
  steps: [
    { text: "**G major.** Finger 2 on the low E (6th) fret 3. Finger 1 on the A string (5th) fret 2. Finger 3 on the high e (1st) fret 3. All six strings played.",
      viz: () => V().chordOnNeck("G"),
      audio: { label: "Hear G", play: (g) => g.chord("G", { duration: 3 }) } },
    { text: "**C major.** Finger 1 on the B string (2nd) fret 1. Finger 2 on the D string (4th) fret 2. Finger 3 on the A string (5th) fret 3. Don't play the low E.",
      viz: () => V().chordOnNeck("C"),
      audio: { label: "Hear C", play: (g) => g.chord("C", { duration: 3 }) } },
    { text: "**Anchor C with finger 3.** Place it on the A string fret 3 first and let the other two fall into place around it. Having a landing point makes the shape far more reliable." },
    { text: "**G and C share nothing obvious — but there's a trick.** If you play G with fingers 2-1-3 as described (rather than 1-2-3), the change to C becomes much smoother later. It's worth the extra awkwardness now.",
      audio: { label: "G → C", play: (g) => { g.chord("G",{duration:2.4}); g.chord("C",{when:1.6,duration:2.8}); } } },
  ],
  mistakes: [
    ["The high e string is dead in C", "Finger 1 is leaning on it. Curl and use the fingertip."],
    ["G feels like a stretch", "It is, at first. Move your thumb lower on the back of the neck to open your hand up."],
    ["You play G with fingers 1-2-3", "It works today and costs you speed for the next six months. Use 2-1-3."],
  ],
  check: ["G rings on all six strings", "C rings on five, low E not played", "You can form each in under three seconds"],
},

"w3|Chord change counter": {
  goal: "Measure your chord changes so you can see them improve. This is the highest-value drill in the whole beginner phase.",
  steps: [
    { text: "**Pick two chords** — start with Em and Am since they share fingers." },
    { text: "**Set a 60-second timer** (there's one built into the Tools page, under Chord Change Test)." },
    { text: "**Change back and forth as many times as you can.** One strum per chord. Count every clean change — if a string is dead or buzzing, it doesn't count.",
      audio: { label: "Target rhythm", play: (g) => { for(let i=0;i<6;i++){ g.chord(i%2?"Am":"Em",{when:i*0.75,duration:1.2}); } } } },
    { text: "**Write the number down.** Then beat it next week. The Tools page saves it to your tracker automatically." },
    { text: "**Typical progress:** 10–15 changes a minute in week 3, 25–35 by week 5, 50+ by week 8. If you're below that, it's practice volume, not talent." },
  ],
  mistakes: [
    ["Counting sloppy changes", "Only clean ones count. Honest numbers are the point — you're measuring to see real improvement."],
    ["Only ever testing your best pair", "Test your worst pair too. That's where the gains are."],
  ],
  check: ["You have a written number for at least two chord pairs", "The number is higher than last time you tested"],
},

"w3|Free play": {
  goal: "Enjoy it. This block is not optional filler — ending on something fun is what makes you come back tomorrow.",
  steps: [
    { text: "**Put on a backing track.** Search \"acoustic backing track G major 70 bpm\" on YouTube, or just play along to a song you like." },
    { text: "**Strum whatever chords you know** over the top. It won't always fit. That's fine — you're training your ear to notice when it does and doesn't." },
    { text: "**Play with other music, not alone.** Playing along to something forces your timing to be honest in a way that solo practice never does.",
      audio: { label: "Play a G-C-D loop", play: (g) => { ["G","C","D","G"].forEach((c,i)=>g.chord(c,{when:i*1.8,duration:2.4})); } } },
    { text: "**No goals here.** Don't count anything, don't fix anything. Ten minutes of just playing." },
  ],
  mistakes: [
    ["Skipping this block because it 'isn't real practice'", "It's the block that protects the habit. Drills without enjoyment is how people quit in month two."],
  ],
  check: ["You wanted to keep playing when the timer ended"],
},

/* =============================== WEEK 4 ================================== */
"w4|One-minute changes": {
  goal: "Systematically drill every chord pair you know, and log the numbers.",
  steps: [
    { text: "**Four pairs, one minute each:** G↔C, C↔D, G↔D, and Em↔C. Use the timer in Tools." },
    { text: "**One strum per chord**, back and forth, counting only clean changes.",
      audio: { label: "G ↔ C at speed", play: (g) => { for(let i=0;i<8;i++) g.chord(i%2?"C":"G",{when:i*0.62,duration:1}); } } },
    { text: "**Log all four numbers.** You'll notice one pair is much worse than the others — that's your homework for the week." },
    { text: "**Aim to add 3–5 changes per pair, per week.** That's a realistic, sustainable rate. Big jumps usually mean you got looser about what counts as clean." },
  ],
  mistakes: [
    ["Testing the same easy pair repeatedly", "It flatters the number and teaches you nothing. Cycle all four."],
    ["Getting discouraged by a low number", "Week 4 numbers are supposed to be low. The number's purpose is comparison against your own past, not against anyone else."],
  ],
  check: ["Four logged numbers this week", "Each one higher than last week's"],
},

"w4|Pivot finger hunt": {
  goal: "Find the fingers that don't have to move. This is what makes chord changes fast — not finger speed.",
  steps: [
    { text: "**C to Am — the best pivot you'll find.** Fingers 1 and 2 don't move at all. Finger 1 stays on the B string fret 1, finger 2 stays on the D string fret 2. *Only finger 3 moves*, from the A string fret 3 across to the G string fret 2. Leave the other two planted and this change becomes almost free.",
      viz: () => V().pivotMap("C", "Am"),
      audio: { label: "C → Am", play: (g) => { g.chord("C",{duration:2.2}); g.chord("Am",{when:1.4,duration:2.6}); } } },
    { text: "**G to Em — a landmark, not a pivot.** Nothing stays planted here, but both chords use the A string at fret 2. In G that's finger 1; in Em it's finger 2. Aim that finger at the same spot and swap which one it is — the rest of the shape follows from there.",
      viz: () => V().pivotMap("G", "Em"),
      audio: { label: "G → Em", play: (g) => { g.chord("G",{duration:2.2}); g.chord("Em",{when:1.4,duration:2.6}); } } },
    { text: "**G to C.** Nothing is shared, so this one is genuinely harder. The trick is a *guide* finger rather than a pivot: finger 3 moves from high e fret 3 down to A string fret 3 — same fret, different string.",
      viz: () => V().pivotMap("G", "C") },
    { text: "**For every pair you know, work out which of the three it is:** a true pivot (a finger stays put), a shared landmark note (same spot, different finger), or no overlap at all. The diagrams above label each one for you — green means planted, blue means shared spot with a finger swap, dashed means lifts off." },
  ],
  mistakes: [
    ["Lifting the whole hand off between every chord", "The most common speed killer. Anchor whatever can stay anchored."],
    ["Assuming every pair has a pivot", "Plenty don't — G↔C and G↔D have no overlap at all. For those, the skill is landing the whole shape at once, not finding a shortcut that isn't there."],
    ["Not knowing which finger is which", "1 = index, 2 = middle, 3 = ring, 4 = little. Consistent numbering is what makes all of this communicable."],
  ],
  check: ["You can say which fingers stay planted in C↔Am", "You know which of your pairs have no overlap", "You keep pivot fingers planted during the change"],
},

"w4|2-beat changes": {
  goal: "Put chord changes into time, with a metronome, at a tempo you can actually hold.",
  steps: [
    { text: "**60 bpm, two beats per chord.** Strum on beat 1 and beat 2, change chord, strum on 1 and 2 again. Cycle G-C-D-Em.",
      viz: () => V().strumGrid("D-D-", { caption: "Two strums, then change. The change happens during the gap after beat 2." }),
      audio: { label: "Hear it at 60 bpm", play: (g) => { const ch=["G","C","D","Em"]; for(let b=0;b<8;b++){ g.click(b%2===0,b); g.chord(ch[Math.floor(b/2)%4],{when:b,duration:1.4}); } } } },
    { text: "**Slow the metronome down until you never break time.** 50 bpm is fine. 40 is fine. The tempo is not the achievement — not stopping is." },
    { text: "**If you're going to be late, simplify.** Play one strum instead of two and change early. Never stop the beat to fix a chord." },
    { text: "**Raise the tempo 5 bpm** only when you can do a full minute with no breaks." },
  ],
  mistakes: [
    ["Stopping to fix a chord mid-exercise", "This is the habit that ruins performances. Play through the mistake and rejoin."],
    ["Setting the metronome too fast", "If you're breaking time, it's too fast. There's no prize for the number on the metronome."],
  ],
  check: ["A full minute of G-C-D-Em at 60 bpm without breaking time", "The changes land on the beat, not after it"],
},

"w4|Backing track play-along": {
  goal: "Play with other music. It exposes timing problems that solo practice hides.",
  steps: [
    { text: "**Find a 70 bpm backing track in G.** Or use a song you know that uses G, C and D." },
    { text: "**Play the G-C-D progression**, one bar each. Listen for whether your chord change lands with the track or after it.",
      audio: { label: "G-C-D, one bar each", play: (g) => { ["G","C","D"].forEach((c,i)=>{ for(let b=0;b<4;b++) g.click(b===0, i*4*0.85+b*0.85); g.chord(c,{when:i*4*0.85,duration:3.2}); }); } } },
    { text: "**If you fall behind, skip a chord and rejoin at the next bar.** Do not try to catch up by playing faster." },
    { text: "**Ten minutes.** This is the block where the week's drills turn into actual music." },
  ],
  mistakes: [
    ["Playing louder to compensate for being unsure", "Play quieter instead — you'll hear the track better and lock in faster."],
    ["Choosing a track that's too fast", "70 bpm feels slow and is exactly right for week 4."],
  ],
  check: ["You stayed with the track for a full song", "You rejoined after mistakes rather than stopping"],
},

/* =============================== WEEK 5 ================================== */
"w5|Eighth-note grid": {
  goal: "Understand where up-strums live, and get your hand moving continuously.",
  steps: [
    { text: "**Count out loud: \"1 and 2 and 3 and 4 and.\"** The numbers are down-strums. The \"ands\" are up-strums.",
      viz: () => V().countBar("1&nbsp; &amp; &nbsp;2&nbsp; &amp; &nbsp;3&nbsp; &amp; &nbsp;4&nbsp; &amp;", "Eight eighth-notes in one bar. Down on the numbers, up on the &amp;s.") },
    { text: "**Strum every one of those eight.** Down-up-down-up-down-up-down-up on a single Em chord, at 60 bpm.",
      viz: () => V().strumGrid("DUDUDUDU", { caption: "Continuous eighth notes. This is the base your hand should always be moving in." }),
      audio: { label: "Hear DUDUDUDU", play: (g) => g.playPattern("Em", "DUDUDUDU", 62, { bars: 2 }) } },
    { text: "**Up-strums only need the top three or four strings.** You don't have to hit all six going up — in fact it usually sounds better if you don't." },
    { text: "**The key idea:** your hand never stops. To skip a strum, you still move the hand — you just miss the strings on the way past. That's what makes every pattern possible from here on." },
  ],
  mistakes: [
    ["Up-strums are much louder than down-strums", "You're hitting all six strings going up. Aim for just the top three."],
    ["The hand stops between strums", "Then every pattern will feel impossible. Keep the pendulum going even during rests."],
    ["Losing the count", "Say it out loud. Not in your head — out loud. It genuinely works."],
  ],
  check: ["Continuous down-up strumming for a full minute at 60 bpm", "Your hand keeps moving during gaps"],
},

"w5|The pattern: D - DU - UDU": {
  goal: "Learn the single most useful strumming pattern in popular music.",
  steps: [
    { text: "**The pattern in the eighth-note grid.** Count \"1 and 2 and 3 and 4 and\". You strum on: 1, 2, the & after 2, the & after 3, 4, and the & after 4. You skip beat 3 itself.",
      viz: () => V().strumGrid("D-DU-UDU".slice(0,8), { caption: "The classic pattern. Down on 1, down-up on 2-&, skip 3, up on the & of 3, down-up on 4-&." }),
      audio: { label: "Hear it slowly on Em", play: (g) => g.playPattern("Em", "D-DU-UDU", 52, { bars: 2 }) } },
    { text: "**Say it out loud while you play:** \"down, down-up, up-down-up\". Rhythm lives in your voice before it lives in your hand." },
    { text: "**Hear it at real speed.** Once the shape of it is in your ear, your hand copies it far more easily than it follows a written instruction.",
      audio: { label: "At 76 bpm", play: (g) => g.playPattern("Em", "D-DU-UDU", 76, { bars: 2 }) } },
    { text: "**Keep the hand pendulum going.** On beat 3 your hand still travels downward — it just doesn't touch the strings. That missed stroke is what gives the pattern its bounce." },
    { text: "**One chord only, for now.** Get the pattern automatic on Em before adding chord changes to it." },
  ],
  mistakes: [
    ["The pattern sounds lumpy or uneven", "You've stopped the hand during the skip. Keep it moving; the gap should feel like a swing, not a stop."],
    ["You can do it slowly but it collapses at speed", "Then it isn't automatic yet. Stay slow for another day or two — this pattern is worth getting exactly right."],
    ["Adding chord changes too early", "One thing at a time. The pattern first, changes second."],
  ],
  check: ["The pattern runs continuously on one chord for a minute", "You can say it out loud while playing it", "It sounds like the audio demo"],
},

"w5|Pattern + changes": {
  goal: "Combine the pattern with chord changes — the moment it starts sounding like real playing.",
  steps: [
    { text: "**One bar per chord.** G, C, D, Em — one full pattern on each, then change.",
      audio: { label: "Pattern over G-C-D-Em", play: (g) => { ["G","C","D","Em"].forEach((c,i)=>g.playPattern(c,"D-DU-UDU",64,{bars:1,onStep:null}) && 0); } } },
    { text: "**Change on beat 1.** The chord must be down before the first down-strum of the bar. That means the change actually happens during the last up-strum of the previous bar." },
    { text: "**If you're late, simplify the last strum.** Drop the final \"& of 4\" up-strum and use that time to move your hand. Nobody will notice; everyone notices a broken beat." },
    { text: "**Slow it down as far as needed.** 55 bpm with clean changes beats 80 bpm with a stumble in every bar.",
      audio: { label: "Slow version", play: (g) => { ["G","C"].forEach((c,i)=>g.playPattern(c,"D-DU-UDU",50,{bars:1})); } } },
  ],
  mistakes: [
    ["The pattern falls apart at the chord change", "Drop back to down-strums only through the change, then add the pattern back once the change is reliable."],
    ["A gap appears between bars", "You're changing after beat 4 instead of during it. Start moving your fingers on the last up-strum."],
  ],
  check: ["Four chord changes without breaking the pattern", "No gap between bars"],
},

"w5|Two more patterns": {
  goal: "Build a small vocabulary of strumming patterns so every song doesn't sound the same.",
  steps: [
    { text: "**Pattern 2: all eighths.** DUDUDUDU. Driving and busy — good for uptempo songs.",
      viz: () => V().strumGrid("DUDUDUDU"),
      audio: { label: "Hear it", play: (g) => g.playPattern("G", "DUDUDUDU", 72, { bars: 2 }) } },
    { text: "**Pattern 3: D-DU-UD-U.** A close cousin of the main one with a different bounce.",
      viz: () => V().strumGrid("D-DU-UD-".slice(0,8)),
      audio: { label: "Hear it", play: (g) => g.playPattern("G", "D-DU-UD-", 72, { bars: 2 }) } },
    { text: "**Pattern 4: simple and slow.** D-D-D-D- for ballads. Never underestimate how good four steady down-strums sound on the right song.",
      viz: () => V().strumGrid("D-D-D-D-"),
      audio: { label: "Hear it", play: (g) => g.playPattern("C", "D-D-D-D-", 66, { bars: 2 }) } },
    { text: "**Five good patterns cover almost everything.** You now have four. Learn them properly rather than collecting twenty you half-know." },
  ],
  mistakes: [
    ["Every song ends up with the same pattern", "Deliberately play a song you know with a different pattern. It'll feel wrong for a minute and then it won't."],
  ],
  check: ["You can play three different patterns on demand", "You can switch between them without stopping"],
},

/* =============================== WEEK 6 ================================== */
"w6|Dm and A": {
  goal: "Add the last two open chords of Phase 1.",
  steps: [
    { text: "**D minor.** Finger 1 on the high e (1st) fret 1. Finger 2 on the G string (3rd) fret 2. Finger 3 on the B string (2nd) fret 3. Play from the D string down.",
      viz: () => V().chordOnNeck("Dm"),
      audio: { label: "Hear Dm", play: (g) => g.chord("Dm", { duration: 3 }) } },
    { text: "**A major.** Three fingers all in fret 2, on the D, G and B strings. Fingers 1, 2, 3 side by side. Don't play the low E.",
      viz: () => V().chordOnNeck("A"),
      audio: { label: "Hear A", play: (g) => g.chord("A", { duration: 3 }) } },
    { text: "**A is cramped — there are two ways round it.** Either squeeze all three fingertips into the fret side by side, or lay finger 1 flat across the three strings as a mini-barre. Try both and keep whichever gives you fewer dead strings." },
    { text: "**Compare D and Dm.** One finger moves down a fret. That single note is the entire difference between happy and sad.",
      audio: { label: "D then Dm", play: (g) => { g.chord("D",{duration:2.4}); g.chord("Dm",{when:1.7,duration:2.8}); } } },
  ],
  mistakes: [
    ["Strings dead in the A chord", "Three fingers in one fret is genuinely tight. Try the mini-barre version, or angle your hand so the fingers stack diagonally."],
    ["The high e is dead in Dm", "Finger 1 is flat. Curl it — this is the same fix as always."],
  ],
  check: ["Dm and A both ring cleanly", "You can hear the difference between D and Dm and say which is which"],
},

"w6|Dynamics drill": {
  goal: "Control your volume deliberately. This is what separates a strum that sounds musical from one that sounds mechanical.",
  steps: [
    { text: "**Four bars quiet, four bars loud**, on a single chord, keeping perfect time throughout.",
      audio: { label: "Quiet then loud", play: (g) => { for(let i=0;i<4;i++) g.chord("Em",{when:i*0.9,duration:1.4,velocity:0.35}); for(let i=4;i<8;i++) g.chord("Em",{when:i*0.9,duration:1.4,velocity:1}); } } },
    { text: "**Volume comes from strum speed and depth**, not from tension. Loud = the hand travels faster and digs slightly deeper. It does not mean gripping the pick harder." },
    { text: "**Stay relaxed at both extremes.** If your shoulder rises when you get loud, you're using the wrong muscles." },
    { text: "**Then try a gradual build** — eight bars going from very quiet to very loud, smoothly. Much harder than it sounds." },
  ],
  mistakes: [
    ["Quiet playing loses the beat", "Keep the same hand motion, just further from the strings. Don't slow the hand down to play quietly."],
    ["Loud playing speeds up", "Almost universal. Use the metronome for this drill specifically."],
  ],
  check: ["You can play the same pattern at three clearly different volumes", "The tempo doesn't change when the volume does"],
},

"w6|8-chord circuit": {
  goal: "Prove you can reach any of your eight chords from any other.",
  steps: [
    { text: "**The eight:** Em, Am, Dm, G, C, D, A, Asus2.",
      audio: { label: "Hear all eight", play: (g) => ["Em","Am","Dm","G","C","D","A","Asus2"].forEach((c,i)=>g.chord(c,{when:i*1.15,duration:1.9})) } },
    { text: "**Two bars each, in order**, keeping time. Then do it again in a different order." },
    { text: "**Then randomise.** Write the eight names on paper, shuffle, and play the sequence you get. Random order is much harder than a memorised one — and much more like a real song." },
    { text: "**Note which changes are worst** and add those pairs to your one-minute change tests next session." },
  ],
  mistakes: [
    ["Only ever practising chords in the same order", "You end up memorising a sequence rather than the chords. Randomise deliberately."],
  ],
  check: ["All eight chords played in time, in random order", "You know which two are your weakest"],
},

"w6|Song learning": {
  goal: "Learn a real song using only chords you already have.",
  steps: [
    { text: "**Choose from the Songs page.** Filter to your current week and pick something you actually want to play — motivation matters more than difficulty here." },
    { text: "**Learn the chord sequence first**, without the strumming pattern. Just one strum per chord, in order, until you know what comes next without thinking." },
    { text: "**Then add the pattern.** Then, much later, the words." },
    { text: "**Work on the verse and chorus only.** Bridges and intros can wait — a song you can play two sections of is more useful than one you can play the intro to." },
  ],
  mistakes: [
    ["Picking a song above your level", "The Songs page tells you which curriculum week each song unlocks at. Trust it — an out-of-reach song teaches nothing but frustration."],
    ["Practising the song from the top every time", "You'll get very good at the first eight bars and never learn the rest. Practise the hard section on its own."],
  ],
  check: ["You can play the verse chord sequence from memory", "You can play the chorus"],
},

/* =============================== WEEK 7 ================================== */
"w7|Section drilling": {
  goal: "Fix the hard part instead of playing the easy part repeatedly.",
  steps: [
    { text: "**Find the two bars that break down.** Play the song and notice exactly where you stumble. It's usually one specific chord change." },
    { text: "**Play only those two bars, twenty times.** Not the song — just the difficult transition, isolated and slow." },
    { text: "**Then add one bar either side.** Getting into and out of the hard bit is its own skill." },
    { text: "**This is the single biggest difference between people who improve fast and slowly.** Repeating what you can already do feels productive and isn't." },
  ],
  mistakes: [
    ["Starting from the beginning every time", "You'll have a brilliant intro and a shaky everything-else. Isolate."],
    ["Practising the hard part at full speed", "Slow it down until it's clean, then creep the tempo up 5 bpm at a time."],
  ],
  check: ["The bar that used to break down no longer does", "You can start playing from the middle of the song"],
},

"w7|Full run-through": {
  goal: "Play the whole song without stopping — mistakes included.",
  steps: [
    { text: "**Start to finish, three times.** No restarts, no matter what happens." },
    { text: "**When you make a mistake, keep going.** Skip a chord if you have to. Land on the next bar. The beat continues." },
    { text: "**Why this matters:** stopping to fix things is a practice-room habit that becomes a performance disaster. Train the recovery, not just the playing." },
    { text: "**Notice where the mistakes cluster.** Those are tomorrow's section-drilling targets." },
  ],
  mistakes: [
    ["Restarting after every error", "The one habit to break this week. Play through."],
    ["Playing it too fast because you know it", "Take it at the tempo where you can play it cleanly, not the tempo of the recording."],
  ],
  check: ["Three complete run-throughs with no restarts", "You recovered from at least one mistake without stopping"],
},

"w7|Sing or hum along": {
  goal: "Add your voice. It rewires your sense of timing more than any other single thing.",
  steps: [
    { text: "**Hum first, don't sing.** Words and chords at once is too much. Hum the melody while strumming." },
    { text: "**Simplify the strum while you hum.** Down-strums only until the two things coexist." },
    { text: "**Then add words to one section.** Usually the chorus, since it repeats." },
    { text: "**Being bad at singing is irrelevant here.** Nobody is listening. The point is that your strumming hand learns to run on autopilot while your attention is elsewhere — which is exactly what playing a song requires." },
  ],
  mistakes: [
    ["The strumming stops when you start singing", "Simplify the strum further. Down-strums on beats 1 and 3 is enough to start."],
    ["Refusing to try because you can't sing", "Then hum. The benefit is in the divided attention, not the tone of your voice."],
  ],
  check: ["You can hum the melody and strum at the same time", "The strumming doesn't falter when you start"],
},

"w7|Record yourself": {
  goal: "Hear what you actually sound like, rather than what you think you sound like.",
  steps: [
    { text: "**One take on your phone.** Prop it a metre away, pointing at the guitar." },
    { text: "**Listen back all the way through.** It will be uncomfortable. Everyone finds this uncomfortable." },
    { text: "**Note exactly one thing to fix.** Not five. One. The most common useful note is \"the tempo speeds up in the chorus\" or \"the G chord is buzzing\"." },
    { text: "**Keep the recording.** In week 20 you'll want to hear this again, and it'll be the most motivating thing in the app." },
  ],
  mistakes: [
    ["Deleting it immediately out of embarrassment", "Keep it. Week 1 you is the benchmark that proves week 20 you got better."],
    ["Listing twenty problems", "Pick one. Fix it. Record again next week."],
  ],
  check: ["A recording exists", "You've written down one specific thing to improve"],
},

/* =============================== WEEK 8 ================================== */
"w8|The 8-chord audit": {
  goal: "Find out honestly which chords are clean and which have been quietly wrong for weeks.",
  steps: [
    { text: "**One chord at a time, pluck every string individually.** Not a strum — a strum hides dead strings.",
      audio: { label: "How to test: G, string by string", play: (g) => g.strumFrets(Fretwork.CHORDS.G.frets, { speed: 0.62, duration: 2.4 }) } },
    { text: "**Score each chord out of 5.** 5 = every string rings clear. 4 = one slightly muted. 3 = one dead. Below that needs work." },
    { text: "**Write the scores down.** Anything under 4 gets extra time in week 9." },
    { text: "**Compare against week 1.** Most people find one chord they've been playing wrong for a month without noticing, because a strum papers over it." },
  ],
  mistakes: [
    ["Strumming instead of plucking individual strings", "The whole point is to find the string a strum hides."],
    ["Scoring generously", "An honest 3 is more useful than a flattering 5."],
  ],
  check: ["Eight written scores", "You know which chord is your weakest"],
},

"w8|One-minute change record": {
  goal: "Test all six main chord pairs and see eight weeks of progress as a number.",
  steps: [
    { text: "**The six pairs:** G↔C, C↔D, G↔D, Em↔C, Am↔C, and D↔A. One minute each, using the timer in Tools." },
    { text: "**Same rules as always.** One strum per chord, count only clean changes, be honest.",
      audio: { label: "Target: G ↔ C", play: (g) => { for(let i=0;i<10;i++) g.chord(i%2?"C":"G",{when:i*0.55,duration:0.95}); } } },
    { text: "**Compare against week 3.** Open the Tracker page — the numbers are logged there. Most people roughly triple their count between week 3 and week 8." },
    { text: "**Whichever pair is lowest is your Phase 2 homework.** Barre chords are coming, and slow open-chord changes make them much harder." },
  ],
  mistakes: [
    ["Only testing pairs you're good at", "The low numbers are the useful ones — they tell you where to spend week 9."],
    ["Comparing yourself to other people's numbers", "The only comparison that matters is against your own week 3."],
  ],
  check: ["Six logged numbers", "At least 40 changes per minute on your best pair", "You know which pair is weakest"],
},

"w8|Barre prep": {
  goal: "Start building the hand strength for barre chords, three weeks before you need it.",
  steps: [
    { text: "**Lay finger 1 flat across all six strings at fret 5.** Fret 5 first because it's the easiest place on the neck — the string tension is lowest there.",
      viz: () => V().neck({ from: 4, to: 8, height: 172,
        marks: [0,1,2,3,4,5].map(st => ({ string: st, fret: 5, label: "1", color: "var(--accent)" })),
        caption: "One finger, all six strings, fret 5. Some will buzz today — that's expected." }) },
    { text: "**Roll the finger slightly onto its side**, toward the headstock. The flat pad of your finger has creases in it that let strings slip through; the bony outer edge doesn't." },
    { text: "**Thumb goes behind the neck**, roughly opposite your index finger, pointing up. Not over the top." },
    { text: "**Strum and see how many ring.** Two or three out of six is a normal week-8 result. Then hold for 15 seconds, rest for 15, and repeat six times.",
      audio: { label: "What it should sound like", play: (g) => g.strumFrets([5,5,5,5,5,5], { duration: 2.6 }) } },
    { text: "**Then try fret 3, then fret 1.** They get progressively harder as you move toward the nut. Don't expect fret 1 to work yet." },
  ],
  mistakes: [
    ["Squeezing harder and harder", "Position beats force. Roll onto the side of the finger and move the thumb before you add pressure."],
    ["Sharp pain in the thumb or wrist joint", "Stop. Fatigue in the muscle is fine; joint pain is not. Rest a day."],
    ["Trying barre chords at fret 1 immediately", "Fret 1 has the highest tension and the widest fret. Work down from fret 5."],
  ],
  check: ["At least 3 of 6 strings ring at fret 5", "You can hold the barre for 15 seconds without cramping"],
},

"w8|Repertoire play": {
  goal: "Play everything you know, end to end. Eight weeks in — this is the checkpoint that shows how far you've come.",
  steps: [
    { text: "**Everything, in one sitting.** Every chord, every pattern, every song fragment." },
    { text: "**No fixing, no drilling.** This block is a performance, not practice." },
    { text: "**Compare against week 1.** Eight weeks ago you couldn't fret a clean note. Look at the tracker — the numbers are there." },
    { text: "**You're past the point where most people quit.** The dropout peak is weeks 3–6. If you're here, the hard part is behind you." },
  ],
  mistakes: [
    ["Turning it into another drill session", "Don't. This one is for morale, and morale is what gets you to week 48."],
  ],
  check: ["You played everything you know without stopping to fix things", "You noticed at least one thing that's easier than it used to be"],
},

};

/* Alias shared/recurring blocks into the map for every Phase 1 week */
for (let w = 1; w <= 48; w++) {
  Object.keys(SHARED).forEach((name) => {
    const key = `w${w}|${name}`;
    if (!LESSONS[key] && SHARED[name]) LESSONS[key] = SHARED[name];
  });
}

/* ------------------------------------------------------------------- API */
const Lessons = {
  get(weekN, blockName) {
    return LESSONS[`w${weekN}|${blockName}`] || SHARED[blockName] || null;
  },
  has(weekN, blockName) { return !!Lessons.get(weekN, blockName); },
  coverage(weekN) {
    const wk = window.CURRICULUM && CURRICULUM.week(weekN);
    if (!wk) return 0;
    return wk.blocks.filter((b) => Lessons.has(weekN, b.name)).length / wk.blocks.length;
  },
  all: LESSONS,
};

if (typeof window !== "undefined") window.Lessons = Lessons;
if (typeof module !== "undefined") module.exports = Lessons;

})();
