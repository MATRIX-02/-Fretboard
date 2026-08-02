/* ==========================================================================
   Fretwork — Song Library
   Mainly Hindi/Urdu, with English staples mixed in.

   Fields: t title · a artist · y year · lang hi|en · key · capo · ch chords
           strum · diff 1–5 · week (earliest curriculum week it fits)
           tag · why (why it's worth learning / what it teaches)

   NOTE ON KEYS AND CAPOS: these are the common guitar-chart versions, which
   often sit a little away from the studio recording. Move the capo up or down
   to suit your own voice — that's a feature, not an error. Week 17 teaches you
   exactly how to do this.
   ========================================================================== */

(function () {
"use strict";

const S = (t,a,y,lang,key,capo,ch,strum,diff,week,tag,why) =>
  ({t,a,y,lang,key,capo,ch,strum,diff,week,tag,why});

const SONGS = [

/* ============ TIER 1 — first songs, 2–4 open chords (weeks 4–8) ============ */
S("Pehla Nasha","Udit Narayan & Sadhana Sargam",1992,"hi","C",4,["C","Am","F","G"],"D DU UDU",1,5,"unplugged","The definitive Indian campfire song. Four open chords, slow tempo, everyone sings along."),
S("Kabira","Tochi Raina & Rekha Bhardwaj",2013,"hi","C",2,["C","G","Am","F"],"D DU UDU",1,5,"unplugged","I-V-vi-IV in its purest form. If you can play this, you can play a thousand songs."),
S("Iktara","Kavita Seth & Amitabh",2009,"hi","Am",2,["Am","G","F","C"],"D DU UDU",1,5,"unplugged","Gentle vi-V-IV-I loop. Great for practising a relaxed, unhurried strum."),
S("Tum Se Hi","Mohit Chauhan",2007,"hi","D",2,["D","A","Bm","G"],"D DU UDU",1,6,"unplugged","Jab We Met's heart. Four chords, and the Bm can be swapped for Bm7 or a capo-shifted Am early on."),
S("Give Me Some Sunshine","Suraj Jagan & Sharman Joshi",2009,"hi","G",0,["G","D","Em","C"],"D D DU",1,5,"unplugged","Written to be played on an acoustic in a hostel room. Sounds right even when played badly."),
S("Behti Hawa Sa Tha Woh","Shaan & Shantanu",2009,"hi","G",2,["G","D","Em","C"],"D DU UDU",1,6,"unplugged","3 Idiots' friendship anthem. Steady, forgiving tempo — ideal for your first full song."),
S("Knockin' on Heaven's Door","Bob Dylan",1973,"en","G",0,["G","D","Am","C"],"D DU UDU",1,4,"classic","Three chords, two bars each, forever. The standard first-song-you-finish."),
S("Country Roads","John Denver",1971,"en","G",0,["G","Em","D","C"],"D DU UDU",1,5,"classic","Fast enough to feel like real playing, simple enough that you can. Universally known."),
S("Let It Be","The Beatles",1970,"en","C",0,["C","G","Am","F"],"D DU UDU",1,6,"classic","The F is the only obstacle — use Fmaj7 until week 11."),
S("Horse With No Name","America",1971,"en","Em",0,["Em","D6/9"],"DU DU DU",1,4,"classic","Literally two chords for the whole song. Perfect for drilling a clean strum with zero chord anxiety."),
S("Zara Sa","KK",2008,"hi","Am",2,["Am","F","C","G"],"D DU UDU",1,6,"2000s","Jannat's big ballad. Same four chords, but the vocal makes it feel much bigger than it is."),
S("Ho Hey","The Lumineers",2012,"en","C",0,["Am","G","C","F"],"D D DU",1,5,"modern","Percussive, sparse, and famously forgiving. Good for practising strumming with gaps."),

/* ============ TIER 2 — 4–6 chords, first barre-adjacent (weeks 9–16) ============ */
S("Channa Mereya","Arijit Singh",2016,"hi","Am",1,["Am","F","C","G","Dm"],"D DU UDU",2,10,"unplugged","The modern standard. Slow enough to think, emotional enough to keep practising."),
S("Tum Hi Ho","Arijit Singh",2013,"hi","Bm",2,["Am","F","C","G","Dm"],"D DU DU",2,10,"unplugged","Everyone will ask for this one. With capo 2 it's all open shapes."),
S("Ilahi","Arijit Singh",2013,"hi","G",2,["G","D","Em","C","Am"],"D DU UDU",2,9,"unplugged","Yeh Jawaani Hai Deewani's travel song. Bright, mid-tempo, brilliant for change practice."),
S("Agar Tum Saath Ho","Arijit & Alka Yagnik",2015,"hi","C",1,["C","G","Am","F","Em"],"D DU UDU",2,12,"modern","Tamasha's ache. The Em adds a fifth colour to the standard four."),
S("Shayad","Arijit Singh",2020,"hi","C",2,["C","G","Am","F"],"D DU UDU",2,10,"modern","Love Aaj Kal. Clean, modern, four chords with a distinctive picked intro worth learning."),
S("Raabta","Arijit Singh",2012,"hi","G",2,["G","Em","C","D"],"D DU UDU",2,9,"modern","Agent Vinod's one great gift. Rock-solid four-chord loop."),
S("Tera Ban Jaunga","Akhil Sachdeva & Tulsi Kumar",2019,"hi","C",1,["C","G","Am","F"],"D DU UDU",2,10,"modern","Kabir Singh's gentle one. Ideal for practising dynamics — verse quiet, chorus open."),
S("Tujhe Kitna Chahne Lage","Arijit Singh",2019,"hi","Am",2,["Am","G","F","C","Dm"],"D DU UDU",2,12,"modern","Kabir Singh again. The Dm turnaround is your first taste of a non-obvious chord choice."),
S("Kesariya","Arijit Singh",2022,"hi","C",1,["C","G","Am","F","Em"],"D DU UDU",2,12,"modern","Brahmastra. Slightly higher tempo — good for testing whether your changes really are automatic."),
S("Apna Bana Le","Arijit Singh",2022,"hi","Am",2,["Am","F","C","G"],"D DU DU",2,11,"modern","Bhediya. Warm, folk-leaning, easy to sing while strumming."),
S("Baarishein","Anuv Jain",2019,"hi","C",3,["C","G","Am","F"],"D DU UDU",2,10,"indie","Written on an acoustic, so it sounds complete with just a guitar and a voice. Great fingerpicking candidate later."),
S("Husn","Anuv Jain",2023,"hi","C",2,["C","G","Am","F","Dm"],"D DU UDU",2,12,"indie","Anuv's biggest. Simple shapes, but the timing is deliberately loose — good phrasing practice."),
S("Riha","Anuv Jain",2020,"hi","G",2,["G","D","Em","C"],"D DU UDU",2,10,"indie","Sparse arrangement means every strum is exposed. Cleanliness matters here."),
S("Alag Aasmaan","Anuv Jain",2021,"hi","C",4,["C","G","Am","F"],"D DU UDU",2,11,"indie","Gentle, spacious. Try it fingerstyle once you reach week 30."),
S("Kho Gaye Hum Kahan","Prateek Kuhad & Jasleen Royal",2016,"hi","G",2,["G","D","Em","C"],"picked",2,12,"indie","Baar Baar Dekho. Mostly picked rather than strummed — a soft on-ramp to fingerstyle."),
S("Cold/Mess","Prateek Kuhad",2018,"en","C",2,["C","G","Am","F"],"D DU UDU",2,11,"indie","English lyrics, Indian indie sensibility. The song that made Prateek a household name."),
S("Tum Ho Toh","Prateek Kuhad",2015,"hi","D",0,["D","A","Bm","G"],"picked",2,13,"indie","Beautiful open-string picking. Slow enough to learn note by note."),
S("Choo Lo","The Local Train",2015,"hi","D",0,["D","A","Bm","G"],"D DU UDU",2,12,"rock","Indian indie-rock's most-played song. Big, open, satisfying to strum hard."),
S("Aaoge Tum Kabhi","The Local Train",2015,"hi","G",0,["G","D","Em","C"],"D DU UDU",2,11,"rock","Anthemic and forgiving. Perfect for practising loud confident strumming."),
S("Bandey","Indian Ocean",2007,"hi","Em",0,["Em","C","G","D"],"D DU DU",2,12,"rock","Chak De's rebel song. Driving rhythm — a good bridge toward percussive playing."),
S("O Sanam","Lucky Ali",1996,"hi","G",2,["G","Em","C","D"],"D DU UDU",2,10,"90s","The 90s Indipop template. Relaxed groove, huge nostalgia payoff."),
S("Dooba Dooba","Silk Route",1998,"hi","G",2,["G","D","Em","C"],"D DU UDU",2,10,"90s","One of the first Hindi songs most guitarists learn, and still one of the best."),
S("Maeri","Euphoria",1998,"hi","Am",0,["Am","G","F","E"],"D DU UDU",2,13,"90s","The Am–G–F–E descent is a different flavour from the usual four chords — worth having in your vocabulary."),
S("Wonderwall","Oasis",1995,"en","Em",2,["Em7","G","Dsus4","A7sus4","Cadd9"],"D DU UDU",2,15,"classic","Practically a chord-shape exercise in disguise: everything stays anchored on the top two strings."),
S("Riptide","Vance Joy",2013,"en","C",1,["Am","G","C","F"],"D DU UDU",2,10,"modern","Fast changes over easy shapes. A brilliant speed test for your one-minute drills."),
S("Perfect","Ed Sheeran",2017,"en","G",1,["G","Em","C","D"],"D D DU",2,11,"modern","6/8 feel — good for getting out of 4/4 autopilot."),
S("Stand By Me","Ben E. King",1961,"en","A",2,["G","Em","C","D"],"bass + D DU",2,12,"classic","The I-vi-IV-V progression at its source. Learn the bass line too."),
S("I'm Yours","Jason Mraz",2008,"en","C",0,["C","G","Am","F"],"D DU UDU",2,10,"modern","Reggae-adjacent upstroke emphasis — trains you to accent off-beats."),
S("Zombie","The Cranberries",1994,"en","Em",0,["Em","C","G","D"],"D DU UDU",2,14,"classic","Four chords, huge dynamic range. Play the verse soft and the chorus enormous."),

/* ============ TIER 3 — barre chords, 7ths, real rhythm (weeks 17–26) ============ */
S("Tum Mile","Neeraj Shridhar",2009,"hi","Bm",2,["Am","F","C","G","Dm","E"],"D DU UDU",3,18,"2000s","The E major against an A-minor tonality is your first taste of borrowed harmony."),
S("Abhi Mujh Mein Kahin","Sonu Nigam",2012,"hi","Cm",1,["Cm","Ab","Eb","Bb"],"D DU UDU",3,20,"modern","Agneepath. Full barre territory — this is the song that proves your barre work paid off."),
S("Bekhayali","Sachet Tandon",2019,"hi","F#m",2,["Em","C","G","D","Am"],"D DU DU",3,18,"modern","Kabir Singh's rock ballad. Long, dynamic, and genuinely rewarding to perform."),
S("Kun Faya Kun","A.R. Rahman, Javed Ali, Mohit Chauhan",2011,"hi","D",0,["D","G","A","Bm","F#m"],"D DU UDU",3,20,"rockstar","Eight minutes of qawwali build. Teaches you to sustain a groove and grow it."),
S("Phir Se Ud Chala","Mohit Chauhan",2011,"hi","G",0,["G","D","Em","C","Am"],"D DU UDU",3,17,"rockstar","Rockstar's opener. Wide-open strumming with a soaring melody."),
S("Nadaan Parindey","Mohit Chauhan",2011,"hi","Am",0,["Am","G","F","Dm","E"],"D DU DU",3,20,"rockstar","Raw and urgent. Good for practising aggressive dynamics without losing the beat."),
S("Tum Ho","Mohit Chauhan & Suzanne",2011,"hi","C",1,["C","G","Am","F","Em","Dm"],"picked",3,22,"rockstar","Six chords with a gorgeous picked arrangement. A natural fingerstyle project."),
S("Jeene Laga Hoon","Atif Aslam & Shreya",2013,"hi","F",1,["F","C","Dm","Bb","Am"],"D DU UDU",3,19,"modern","Bb and F in one song — full barre workout with a payoff you'll actually enjoy playing."),
S("Tere Bin","Atif Aslam",2004,"hi","Bm",2,["Am","G","F","C","Dm"],"D DU UDU",3,17,"2000s","Bas Ek Pal. The song that taught a generation of Indian teenagers to hold a barre."),
S("Aadat","Jal / Atif Aslam",2004,"ur","Bm",0,["Bm","G","D","A"],"D DU UDU",3,17,"2000s","Full barre Bm from the first bar. When this feels easy, your barre chords are done."),
S("Woh Lamhe","Atif Aslam",2006,"hi","Bm",0,["Bm","G","D","A"],"D DU UDU",3,18,"2000s","Same family as Aadat, more melodic. Good pair to learn together."),
S("Bulla Ki Jaana","Rabbi Shergill",2005,"pa","Am",0,["Am","G","F","C","Dm","E"],"D DU UDU",3,20,"rock","Sufi poetry over a driving acoustic. Excellent for endurance — it never lets up."),
S("Aahatein","Agnee",2007,"hi","Em",0,["Em","C","G","D","Am"],"D DU DU",3,18,"rock","Big, layered rock ballad. Try it with palm muting in the verses."),
S("Socha Hai","Farhan Akhtar / Rock On!!",2008,"hi","A",0,["A","D","E","F#m","Bm"],"D DU DU",3,19,"rock","Straight-ahead rock in A. Power chords work here too — try both versions."),
S("Senorita","Farhan, Hrithik, Abhay",2011,"hi","G",0,["G","C","D","Em","Am"],"flamenco-ish D DU",3,21,"rock","Zindagi Na Milegi Dobara. Rhythmically the most interesting song on this list — worth the effort."),
S("Khuda Jaane","KK & Shilpa Rao",2008,"hi","Am",1,["Am","F","C","G","Dm","E"],"D DU UDU",3,19,"2000s","Bachna Ae Haseeno. Six chords, strong movement, very satisfying to sing."),
S("Pal","KK",1999,"hi","C",0,["C","G","Am","F","Dm","Em"],"D DU UDU",3,18,"90s","Every Indian farewell, ever. Learn it — you will be asked."),
S("Yaaron","KK",1999,"hi","G",0,["G","D","Em","C","Am"],"D DU UDU",3,17,"90s","The other farewell song. Between this and Pal you're covered for life."),
S("Hotel California","Eagles",1976,"en","Bm",0,["Bm","F#","A","E","G","D","Em"],"arpeggios",3,24,"classic","Seven chords, a famous picked intro, and a solo to grow into. A whole curriculum in one song."),
S("Hallelujah","Leonard Cohen / Buckley",1984,"en","C",0,["C","Am","F","G","E7"],"picked / D DU",3,22,"classic","6/8, gentle, and famously beautiful. The E7 is your first functional secondary dominant."),
S("Wish You Were Here","Pink Floyd",1975,"en","G",0,["Em7","G","A7sus4","C","D"],"picked intro",3,22,"classic","That intro is a rite of passage. Slow, deliberate, entirely learnable."),
S("Someone Like You","Adele",2011,"en","A",0,["A","C#m","F#m","D"],"arpeggios",3,23,"modern","Constant arpeggiated pattern — one of the best right-hand consistency drills in pop."),
S("Say You Won't Let Go","James Arthur",2016,"en","D",2,["G","D","Em","C"],"D DU UDU",3,17,"modern","Easy chords, but the syncopated strum is where the song lives."),

/* ============ TIER 4 — fingerstyle, arrangement, nuance (weeks 27–38) ============ */
S("Tum Itna Jo Muskura Rahe Ho","Jagjit Singh",1982,"hi","Am",0,["Am","Dm","E7","G","C","F"],"fingerstyle",4,30,"ghazal","Ghazal harmony is richer than film pop — 7ths, minor movement, space between phrases."),
S("Hoshwalon Ko Khabar Kya","Jagjit Singh",1999,"hi","Cm",0,["Cm","Fm","G7","Ab","Bb"],"fingerstyle",4,32,"ghazal","Sarfarosh. Slow enough to voice every chord carefully. Superb for chord-melody practice."),
S("Hothon Se Chhu Lo Tum","Jagjit Singh",1981,"hi","C",0,["C","Am","Dm","G7","F","E7"],"fingerstyle",4,31,"ghazal","Prem Geet. The E7 → Am pull is textbook — you'll hear the theory you learned in week 25."),
S("Lag Ja Gale","Lata Mangeshkar",1964,"hi","Cm",0,["Cm","Ab","Eb","Bb","Fm"],"fingerstyle",4,33,"classic-film","One of the most beautiful melodies in Hindi cinema. Arrange it as chord-melody in week 45."),
S("Ajeeb Dastan Hai Yeh","Lata Mangeshkar",1960,"hi","C",0,["C","Am","F","G","Dm","E7"],"fingerstyle",4,32,"classic-film","Waltz feel in 3/4 — gets you out of the 4/4 rut permanently."),
S("Aaj Jaane Ki Zid Na Karo","Farida Khanum",1973,"ur","Dm",0,["Dm","Gm","A7","F","Bb"],"fingerstyle",4,34,"ghazal","Almost free-time. Teaches you to follow a voice rather than a metronome."),
S("Chura Liya Hai Tumne","Asha Bhosle",1973,"hi","C",0,["C","Am","Dm","G7","F","E7"],"fingerstyle",4,29,"classic-film","That iconic intro riff is worth learning on its own."),
S("Pal Pal Dil Ke Paas","Kishore Kumar",1973,"hi","G",0,["G","Em","Am","D7","C","B7"],"fingerstyle",4,30,"classic-film","Kishore at his warmest. The B7 is a proper secondary dominant in the wild."),
S("Yeh Shaam Mastani","Kishore Kumar",1971,"hi","C",0,["C","Am","F","G7","Dm"],"D DU UDU",4,28,"classic-film","Swing feel. Great for practising a lilting, triplet-based strum."),
S("Phir Le Aya Dil","Arijit Singh",2013,"hi","Am",0,["Am","Dm","F","G","E7","C"],"fingerstyle",4,31,"modern","Barfi!. Melodically demanding and harmonically richer than most film songs."),
S("Blackbird","The Beatles",1968,"en","G",0,["G","Am7","C","D7","Em"],"fingerstyle",4,31,"fingerstyle","The standard fingerstyle graduation piece. Bass and melody, two voices, one hand."),
S("Dust in the Wind","Kansas",1977,"en","C",0,["C","Cmaj7","Am","Asus2","G","D/F#"],"Travis picking",4,31,"fingerstyle","Pure Travis picking from start to finish. Perfect week-31 project."),
S("Tears in Heaven","Eric Clapton",1992,"en","A",0,["A","E/G#","F#m","A/E","D","E"],"fingerstyle",4,33,"fingerstyle","Slash chords and a walking bass — everything from week 29 applied at once."),
S("Nothing Else Matters","Metallica",1991,"en","Em",0,["Em","D","C","G","B7","Am"],"fingerstyle",4,30,"fingerstyle","Open-string arpeggios that sound far harder than they are. Enormously satisfying."),
S("Fast Car","Tracy Chapman",1988,"en","C",2,["Cmaj7","G","Em7","D"],"riff/picked",4,29,"fingerstyle","One repeating picked figure that carries the whole song. Fantastic right-hand discipline."),
S("Yellow","Coldplay",2000,"en","B",4,["G","D","C","Em"],"arpeggios + strum",4,27,"modern","Simple shapes with a capo, but the dynamic build is the real lesson."),
S("Kabhi Kabhi Aditi","Rashid Ali",2008,"hi","D",0,["D","A","G","Bm","F#m"],"D DU UDU",4,27,"2000s","Jaane Tu. Sunny, quick changes — a genuine tempo test."),
S("Masakali","Mohit Chauhan",2009,"hi","G",0,["G","C","D","Em","Am"],"D DU DU",4,28,"2000s","Delhi-6. Bright and bouncy with an unusual rhythmic feel."),

/* ============ TIER 5 — lead work, solos, advanced (weeks 39–48) ============ */
S("Kandisa","Indian Ocean",2000,"hi","Dm",0,["Dm","C","Bb","A7","Gm"],"complex",5,40,"rock","Odd-time sections and modal colour. The most musically ambitious thing on this list."),
S("Ma Rewa","Indian Ocean",2000,"hi","Em",0,["Em","D","C","G","Am"],"complex",5,39,"rock","Folk melody over rock rhythm. Excellent for learning to hold a groove through changes."),
S("Sultans of Swing","Dire Straits",1978,"en","Dm",0,["Dm","C","Bb","A","F","Gm"],"fingerstyle lead",5,44,"lead","Fingerstyle electric lead over a moving progression. The chord-tone lesson of week 43, in practice."),
S("Comfortably Numb (solo)","Pink Floyd",1979,"en","Bm",0,["Bm","A","G","D","Em"],"lead",5,41,"lead","The phrasing benchmark. Every note is bent, held and shaped — study it in week 40."),
S("Sweet Child O' Mine","Guns N' Roses",1987,"en","D",0,["D","C","G","A","Em"],"riff + lead",5,42,"lead","That riff is a string-skipping exercise. The solo is a pentatonic masterclass."),
S("Little Wing","Jimi Hendrix",1967,"en","Em",0,["Em","G","Am","Bm","C","D"],"chord-melody lead",5,45,"lead","Rhythm and lead fused into one part. The endgame of everything in Phase 4."),
S("Aisa Kyun Maa","Shankar Mahadevan",2010,"hi","C",0,["C","G","Am","F","Em","Dm"],"fingerstyle",5,45,"modern","Taare Zameen Par. Simple chords, but arranging it well as a solo piece is genuinely hard."),
S("Zinda","Siddharth Mahadevan",2013,"hi","Em",0,["Em","C","G","D","Am"],"power chords + lead",5,39,"rock","Bhaag Milkha Bhaag. Drive, palm muting and a soloing platform in one song."),
S("Bulleya","Amit Mishra & Shilpa Rao",2016,"hi","Am",0,["Am","F","C","G","Dm","E"],"D DU DU + lead",5,41,"modern","Ae Dil Hai Mushkil. Sufi-rock with room for a real improvised solo over the outro."),
S("Sadda Haq","Mohit Chauhan",2011,"hi","Em",0,["Em","C","G","D","Am","B7"],"power chords + lead",5,40,"rockstar","Rockstar's protest anthem. Riff, power chords, and a long instrumental to solo over."),
];

/* Difficulty labels + curriculum mapping ---------------------------------- */
const DIFFS = [
  { n:1, name:"First songs",   sub:"2–4 open chords, slow tempo",        weeks:"4–8"   },
  { n:2, name:"Building",      sub:"4–6 open chords, real strumming",     weeks:"9–16"  },
  { n:3, name:"Barre level",   sub:"Barre chords, 7ths, dynamics",        weeks:"17–26" },
  { n:4, name:"Fingerstyle",   sub:"Picking, arrangement, richer harmony", weeks:"27–38" },
  { n:5, name:"Advanced",      sub:"Lead, solos, full arrangements",      weeks:"39–48" },
];

const TAGS = {
  unplugged:   "Unplugged staples",
  modern:      "Modern Bollywood",
  indie:       "Indian indie",
  rock:        "Hindi rock",
  rockstar:    "Rockstar (2011)",
  "90s":       "90s Indipop",
  "2000s":     "2000s Bollywood",
  ghazal:      "Ghazal",
  "classic-film":"Golden-era film",
  classic:     "English classics",
  fingerstyle: "Fingerstyle pieces",
  lead:        "Lead & solo studies",
};

const LANGS = { hi:"Hindi", ur:"Urdu", pa:"Punjabi", en:"English" };

/* --------------------------------------------------------------- playback */
/* Turn the human-readable strum description into something the audio engine
   can actually play. Longest keys are matched first so "D DU DU" doesn't get
   caught by the "D DU" rule. */
const STRUM_MAP = [
  ["d du udu",  "D-DU-UDU"],
  ["d du ud",   "D-DU-UD-"],
  ["du du du",  "DUDUDU--"],
  ["d du du",   "D-DU-DU-"],
  ["d d du",    "D-D--DU-"],
  ["d du",      "D-DU----"],
  ["d d",       "D-D-D-D-"],
];

function playbackFor(strum) {
  const s = String(strum || "").toLowerCase();
  if (/travis/.test(s)) return { mode: "travis" };
  if (/fingerstyle|chord-melody|arpegg|picked|picking|riff\/picked|picked intro/.test(s)) {
    return { mode: "arpeggio" };
  }
  if (/power chord/.test(s)) return { mode: "strum", pattern: "D-D-DUD-", palmMute: true };
  for (const [key, pat] of STRUM_MAP) {
    if (s.includes(key)) return { mode: "strum", pattern: pat };
  }
  /* "complex", "lead", anything unrecognised — fall back to the common one */
  return { mode: "strum", pattern: "D-DU-UDU" };
}

const SONGLIB = {
  all: SONGS,
  playbackFor,
  STRUM_MAP,
  diffs: DIFFS,
  tags: TAGS,
  langs: LANGS,
  /* Sorted by how close a song sits to the given week, with a deliberate lean
     toward Hindi/Urdu/Punjabi — English songs need to be ~1.5 weeks closer to
     outrank one. Set biasHindi = false for a purely chronological list. */
  forWeek(w, spread = 4, biasHindi = true) {
    const score = (s) => Math.abs(s.week - w) + (biasHindi && s.lang === "en" ? 1.5 : 0);
    return SONGS.filter((s) => s.week <= w + spread && s.week >= w - 10)
                .sort((a, b) => score(a) - score(b));
  },
  playableAt(w) { return SONGS.filter((s) => s.week <= w); },
  count() { return SONGS.length; },
  byLang(l) { return SONGS.filter((s) => s.lang === l).length; },
};

if (typeof window !== "undefined") window.SONGLIB = SONGLIB;
if (typeof module !== "undefined") module.exports = SONGLIB;

})();
