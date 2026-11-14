// English primer („Fibel der Kreise“ → Primer of Circles): same ids as data/primer.js.
// Only text fields; structure (part, gen, unnumbered, taskFirst, pageEach …) stays in data/primer.js.
// Missing fields fall back to German and are counted as untranslated.
window.PRIMER_EN = window.PRIMER_EN || { lessons: {} };
Object.assign(window.PRIMER_EN, {
  title: "Primer of Circles",
  subtitle: "First Primer",
  parts: {
    V: "Preliminaries",
    I: "The Workshop",
    II: "Hand and Circle",
    III: "The Glyphs",
    IV: "The Signs of the Substances",
    V2: "Quick Glyphs",
    VI: "Reading Circles",
    VII: "Small Formulas",
    VIII: "The Journeyman's Piece",
    A: "Appendix",
    W: "Everyday Spells",
  },
  boxes: {
    I: { praise: "“The quill writes as if it had never done anything else.”", fear: "The ink that grew mould overnight in the open pot.", saying: "Spare your knife and you won't spare your quills." },
    II: { praise: "“The circle closes, and no one can find where it began.”", fear: "The test disc on a Monday morning.", saying: "First the hand, then the power." },
    III: { praise: "“The sign is as calm as a stone well set.”", fear: "Forgetting an adjunct sign and noticing only at the casting.", saying: "The core commands, the adjunct sign requests." },
    IV: { praise: "“You read the substance before you smell it.”", fear: "Mixing up Saturn and Jupiter in front of the whole house.", saying: "No thing without a price, no price without a sign." },
    V2: { praise: "“Five strokes, and one knows what is coming.”", fear: "The timed drill with the candle burning down and the master watching.", saying: "The core is never shortened." },
    VI: { praise: "“You read that circle like a letter.”", fear: "A circle with a gap in which nothing seems to be missing.", saying: "Outside the world, inside the matter." },
    VII: { praise: "“You did not recite the formula, you knew it.”", fear: "Forgetting the formula in front of witnesses.", saying: "Three times is once." },
    VIII: { praise: "“This is your page. One can see it.”", fear: "The first stroke in the fair book.", saying: "What stands in the fair book, stands." },
  },
});
Object.assign(window.PRIMER_EN.lessons, {
  // --- Preliminaries ---------------------------------------------------------
  "v-use": {
    title: "How This Primer Is to Be Used",
    read: [
      "This primer is not a spellbook. It contains no formula that you could cast by opening it. It contains what a hand and a head must learn before a spellbook can be of any use to them.",
      "Every lesson begins with a reading piece. Read it twice: once for the sense, once for the words. New terms stand in red ink; what they mean is written in the margin, and at the end of the primer you will find them all again in the [[glossary]].",
      "Where a figure is shown, it is a [[master's view]]: small, so that you will not trace it. Formulas and signs are not traced but copied, first with the eye, then with the hand, last from memory.",
      "Practice does not happen in this primer. For that you have the [[wax tablet]], whose mistakes can be smoothed away, and the waste paper from the workshop. Into the primer goes only what the master has examined: his mark beneath every task.",
      "Later you will keep a [[fair book]]. What stands there stands for ever. That is why you learn here.",
    ],
    glosses: {
      "glossary": "Index of all the red terms in this primer, with the lesson in which each first appears (Appendix E).",
      "master's view": "A reduced pattern for looking at. Not to be traced – to be copied.",
      "wax tablet": "A wooden board with wax let into it. You write with the point of the stylus and smooth with the flat end.",
      "fair book": "Your own spellbook. Unlike the workbook, it is not a place for practice.",
    },
  },
  "v-preface": {
    title: "The Master's Preface",
    read: [
      "You hold your first primer in your hands, and you have probably hoped to find more sorcery in it. There is none. What it contains is how to cut a quill, how to make ink, how to draw a circle that holds. That is disappointing, and it is as it should be.",
      "I have had apprentices who could light a candle after three weeks and still could not close a circle after three years. Today they cast, if they are lucky, other people's spells out of other people's books, and they never quite know why something works. I have had others who did nothing but draw for a whole year. Those write their own formulas today.",
      "I shall give you nothing to trace. I shall show you what a thing looks like, and then you will draw it, again and again, until your hand can do it without your head helping. I shall examine what you draw, with the eye and with the disc, and I shall tell you what is wrong. I do not say it to hurt you, but because a fault I fail to see now will stand in your book later.",
      "What I ask of you: patience, clean hands and honesty about your faults. What you may ask of me: that I show you everything I know as soon as you can carry it. More than that the indenture does not say either.",
    ],
  },
  "v-contract": {
    title: "Indenture",
    read: ["The indenture is concluded on the first day in two identical copies: one for the master, one for the apprentice. It is read aloud, before a witness who is related to neither the one nor the other."],
  },
  "v-house": {
    title: "House Rules and Daily Plan",
    read: [
      "The house has no clock; it has a bell. Whoever fails to hear the bell has failed to hear it; excuses are allowed for sickness and fire, not for sleep.",
      "First: the workshop is entered with clean hands and left with a clean table. Second: no light without supervision, no flame beside paper. Third: what lies in the master's drawers stays there, even when the drawer stands open. Fourth: nothing that has been in the workshop goes into the mouth, not even the tip of a brush. Fifth: in the quiet hour there is no speaking, no knocking and no asking. Sixth: whoever breaks something says so before it is found.",
      "Offences earn a [[penance chore]]: carrying water, sweeping ashes, sorting rags, scraping soot. Ten penance chores in a year, and the indenture is reconsidered.",
    ],
    glosses: { "penance chore": "Menial work about the house in place of free time. Not meant as revenge, but as an occasion for reflection." },
  },
  "v-kit": {
    title: "The Equipment of the Apprentice's Chamber",
    read: ["What is listed here the apprentice receives on the first day or makes for himself in the first weeks. What is lost is replaced, but not twice. A piece is ticked off when it is there and the apprentice can use it."],
  },

  // --- I. The Workshop -------------------------------------------------------
  l1: {
    title: "The Wax Tablet",
    read: [
      "The first surface every apprentice writes on is not a page but the [[wax tablet]]: a board with a raised rim, filled with darkly stained wax. You write with the [[stylus]], whose point draws a pale line in the wax. The flat end smooths it out again.",
      "The wax forgives everything, and that is exactly why one begins here. A failed circle costs nothing on the tablet but a stroke of the thumb. On parchment it costs a page, in the fair book a formula.",
      "The tablet wants looking after. In summer the wax turns soft and smears; then you put it down in the cellar. In winter it turns brittle and splinters under the stylus; then you warm it briefly in your hand or by the stove, never over the flame. When the surface is furrowed after many weeks, the wax is gently melted at the top and drawn smooth again.",
    ],
    glosses: {
      "stylus": "A pin of bone, metal or hard wood. The point for writing, the flat end for smoothing.",
    },
    task: ["Smooth your tablet completely, until no line can be seen.", "Draw twenty straight lines, smooth, draw twenty arcs, smooth.", "Show the master your smoothed tablet: he tests with a fingernail whether the surface is even."],
    check: ["Smoothness", "Line"],
  },
  l2: {
    title: "The Quill",
    read: [
      "One writes with feathers from the wing of a large bird: goose for everyday work, swan for strong strokes, raven or crow for the finest lines. Only the outer flight feathers are taken. Whoever writes with the right hand looks for feathers from the left wing, for they curve away from the hand.",
      "A fresh quill is soft and tough. It is first soaked, to make it pliant, and then hardened: you push the barrel briefly into hot sand until the cloudy skin turns clear. This [[dutching]] makes it hard and springy. Too hot, and it splinters; too short, and it stays spongy.",
      "It is cut with the [[penknife]]: one long slanting cut on the underside, a short [[slit]] in the middle of the tip, then the shoulders, last the point itself, severed clean against a hard board. A quill lasts only a few pages; whoever writes, recuts. A blunt knife crushes the barrel instead of cutting it. That is why the penknife is the tool the apprentice looks after best.",
    ],
    glosses: {
      "dutching": "Hardening the quill barrel in hot sand or over a hot iron.",
      "penknife": "A small, very sharp knife for shaping and recutting quills.",
      "slit": "A short cleft in the tip of the quill. It holds the ink and lets it flow evenly.",
    },
    task: ["Prepare three quills: soak, harden, cut.", "Write ten trial strokes with each and note beside them what is wrong with the quill (spits, scratches, runs dry).", "Recut the worst one until it writes evenly."],
    check: ["Cut", "Slit", "Stroke"],
  },
  l3: {
    title: "Lampblack Ink and Indian Ink",
    read: [
      "The apprentice's first ink is [[lampblack ink]]. You hold a cold clay dish over a sooty oil lamp, scrape off the soot and grind it with a little gum and water until the mass is smooth. In solid form, pressed into sticks with glue and rubbed down on the grinding stone, it is called [[Indian ink]].",
      "Lampblack ink is deep black at once; it is not acid and eats nothing away. But it lies only on the surface: with a damp sponge or a sharp knife it is gone again. For practice sheets that is a virtue, for a spellbook a fault, for a formula that can be washed off can be washed off by anyone else as well.",
      "Too little binder, and the stroke turns grainy and grey; too much, and it shines and flakes off in drying. The right point is not found in a recipe but with trial strokes.",
    ],
    glosses: {
      "lampblack ink": "Ink of lamp soot and binder. Black and mild, but washable.",
      "Indian ink": "Lampblack ink in solid form, rubbed down with water on the grinding stone.",
    },
    task: ["Grind three small dishes of lampblack ink: with little, medium and much gum.", "Draw five strokes with each and let them dry.", "Run a damp finger over every stroke and note which one holds."],
    check: ["Blackness", "Adhesion"],
  },
  l4: {
    title: "Iron Gall Ink",
    read: [
      "The [[iron gall ink]] is the ink of books that are meant to last. It is made from four things. The [[oak galls]] are hard balls that a wasp causes to grow on oak leaves; [[vitriol]] is a green salt of iron; to these come gum from acacia resin as binder, and rainwater, wine or vinegar.",
      "First the galls are roughly crushed, not to dust. Second, they are steeped in the liquid, for days in the sun or more briefly over a small fire. Third, the brew is strained through a linen cloth. Fourth, the vitriol goes in, little by little: the brew turns grey at once and darkens to black as it dries. Fifth, the gum, until the ink runs from the quill like thin oil. Sixth, it rests for some days and is stirred daily.",
      "This ink eats into the page. That is why it holds, and that is why it is dangerous: with too much vitriol it turns brown and after years eats holes where it stood. This [[ink corrosion]] can be seen in old books whose letters look punched out. A spellbook with too sharp an ink falls apart from within.",
    ],
    glosses: {
      "iron gall ink": "Lasting black ink of oak galls, vitriol, gum and liquid. Sinks into the page.",
      "oak galls": "Round growths on oaks. They supply the tannin of the ink.",
      "vitriol": "Green iron salt. Turns the ink black; irritates skin and eyes.",
      "ink corrosion": "Destruction of the page by ink that is too acid, too rich in iron.",
    },
    box: { title: "What Went Wrong Here?", text: ["Pale and grey instead of black: too little vitriol, or steeped too briefly. Mould and a rotten smell: water without wine or vinegar, an open vessel. Feathering: too little gum, or unsized paper. Shine and flakes: too much gum. Crumbs in the quill: not strained. And always: never touch vitriol with bare hands, never use the kitchen pot, never breathe the fumes."] },
    task: ["Under supervision, make up a small quantity of ink and keep an ink diary for two weeks: day, colour of the brew, smell, trial stroke.", "At the end compare a trial stroke from the third day with one from the fourteenth."],
    check: ["Care", "Diary", "Result"],
  },
  l5: {
    title: "Colours and Their Poisons",
    read: [
      "Not everything in a circle is written in black. What is dangerous, what sets something off, what must be read first, stands in red: the [[rubric]]. In this primer it is the new terms; in your book it will be the threshold gates and the principal essence.",
      "The most beautiful red is [[vermilion]], made from quicksilver and sulphur. Beside it there is red lead, an orange-red from lead; white lead; verdigris, scraped from copper that hung over vinegar; and a bright yellow that contains arsenic. Whoever knows the signs of the substances already sees: these are the same substances that stand in the formulas as the price. Mercury, Saturn, Venus. Colour is alchemy.",
      "There are harmless colours too: red ochre from earth, yellow from saffron or weld, blue from woad, brown from walnut shells. They shine less, but they kill no one. For practice sheets they are enough.",
    ],
    glosses: {
      "rubric": "Red writing for what must be read first. From the Latin ruber, red.",
      "vermilion": "A bright red pigment of quicksilver and sulphur. Poisonous.",
    },
    box: { title: "The Poison in the Inkwell", text: [
      "The poisonous colours are not ground by the apprentice in this house. They stand in the master's locked cupboard, and whoever uses them does so with a brush of his own, which he never puts in his mouth, never points between his lips, and washes out after the work.",
      "An apprentice who licks a brush to shape its point does it with vermilion exactly once too often, and he notices only years later: in the trembling of his hand. For a draughtsman there is no worse end.",
    ] },
    task: ["Mix three harmless practice colours from red ochre, saffron and woad.", "Draw a circle with each and write the name of the colour beneath it in black.", "Tell the master, for vermilion, red lead and verdigris, the substance each is made of and its sign."],
    check: ["Mixing", "Knowledge"],
  },
  "w-soap": {
    title: "Soap and Lye",
    read: [
      "Whoever has worked with vermilion washes. The [[soap]] for it the workshop makes itself, from ashes out of the stove and fat from the kitchen.",
      "First the [[lye]]: beech ash is laid on straw in a tub with a hole in the bottom and rainwater is poured over it; what runs through is poured over again, until it is clear. Whether it is good, a fresh egg shows. It must float and show a patch the size of a coin.",
      "Tallow or oil is stirred with the lye in the kettle and cooked until the mass draws threads. This [[boiling]] yields soft soap; with salt, hard curd soap separates out. The teaching says that in it Sulfur and Sal have united, the burning of the fat and the firmness of the ash.",
      "Against rain one soaks cloth first in soapy water, then in a solution of [[alum]]. In the weave a soap forms that no longer dissolves, and the water beads off. This is how the master proofs his cloak and book pouch, for a wet fair book is a lost fair book.",
      "Over the master's own soap, which lies in a dish of its own, the little spell of cleansing has been spoken; it keeps it for a few washings.",
    ],
    glosses: {
      "soap": "Boiled from fat and lye. Washes hands, brushes and cloth.",
      "lye": "Water that has run through wood ash. Sharp, burns skin and eyes.",
      "boiling": "Long cooking of fat with lye until soap forms.",
      "alum": "A white, astringent salt. With soap in the weave it makes cloth waterproof.",
    },
    box: { title: "Lye Eats Skin", text: [
      "A splash of lye in the eye can blind. Therefore leather gloves, never the kitchen pot, and a bucket of clear water stands ready. After every vermilion, every red lead, every verdigris the apprentice washes hands and brushes with soap before he eats. The master checks: under the fingernails.",
    ] },
    task: ["Under supervision, make three lyes and test each with the egg.", "After your next rubrication, wash hands and brushes and show them to the master.", "Proof a rag with soap and alum, and beside an untreated one sprinkle it with water."],
    check: ["Test", "Cleanliness", "Proofing"],
  },
  l6: {
    title: "Parchment",
    read: [
      "The material called [[parchment]] is skin that is not tanned but dried under tension. The hide of a calf, sheep or goat lies some weeks in lime water until the hair loosens. Then it is cleaned on a curved beam with a blunt knife and, still wet, laced into a frame, the [[herse]].",
      "In the herse the skin is scraped, dampened, dried and stretched again, over and over, with a crescent-shaped knife. Only in this does skin become parchment: thin, firm, pale. Last it is ground with pumice and rubbed with chalk, so that the ink does not bead.",
      "Parchment has two sides. The [[hair side]] is yellower and speckled, the flesh side whiter and smoother. Glyphs are drawn on the flesh side, for the hair side drinks the ink unevenly. A large spellbook needs the skins of a whole small flock. That is why no one practises on parchment.",
    ],
    glosses: {
      "parchment": "Untanned animal skin, dried under tension and scraped. The carrier of the fair book.",
      "herse": "A wooden frame into which the wet skin is laced and stretched again.",
      "hair side": "The outer side of parchment, yellowish and speckled. The inner is called the flesh side.",
    },
    task: ["Have the master give you a piece of parchment and tell hair side from flesh side without asking.", "Draw a circle with iron gall ink on each side and compare the stroke under the lens."],
    check: ["Recognition", "Comparison"],
  },
  l7: {
    title: "Making Paper",
    read: [
      "Paper is cheaper than parchment and good for everything that need not last for ever: practice sheets, letters, scrolls. It is made from rags. Linen and hemp are sorted, cut up, stored damp for weeks until they rot, and then pounded to a pulp of fibres.",
      "The pulp floats in warm water in the [[vat]]. The papermaker dips the [[mould]], a frame with a wire sieve, lifts it out level and shakes it briefly so that the fibres felt together. The wet sheet is turned out onto a felt, the [[couching]], pressed, and dried on lines.",
      "Unsized paper sucks like a sponge; the ink runs. That is why every sheet is dipped in hot glue made from hide scraps and pressed once more. On some sieves a figure of wire is sewn fast. There the paper turns thinner, and if you hold the sheet to the light, you see the mill's [[watermark]].",
    ],
    glosses: {
      "vat": "A tub of warm water and fibre pulp.",
      "mould": "A frame with a wire sieve, with which the sheet is lifted from the vat.",
      "couching": "Turning the wet sheet out from the mould onto a felt.",
      "watermark": "The paper mill's sign, visible against the light, made by a wire figure in the sieve.",
    },
    task: ["Under guidance, make five sheets and dry them.", "Hold them to the light: which is cloudy, which is even? Note why.", "On a sized and an unsized sheet draw one stroke each with the same quill."],
    check: ["Evenness", "Reasoning"],
  },
  "w-seal": {
    title: "Sealing Wax and Signet",
    read: [
      "What is finished is closed: a letter, a deed, a fair book, a cupboard. The older [[seal]] is of beeswax, made tough with resin and coloured with red lead, vermilion or verdigris; it goes soft in the sun.",
      "Harder and glossier is [[sealing wax]]: [[shellac]], rosin and turpentine, stretched with chalk, coloured with vermilion and cast as a stick. You turn the stick above the flame, not in it, let the wax run onto the paper, breathe on the [[signet]] and press it straight in, until you have slowly counted to three. Black streaks are soot, bubbles come from too much heat, wax on the signet from forgetting to breathe on it.",
      "A seal does not protect, it bears witness. Whoever opens a letter breaks it, and everyone can see. That is why a seal belongs beneath the indenture, and why the apprentice receives a sign of his own at the end of his years.",
    ],
    glosses: {
      "seal": "The impression of a sign in wax or lacquer. Bears witness that a closure is untouched.",
      "sealing wax": "Hard lacquer of shellac and resins, cast as a stick, melted above the flame.",
      "shellac": "A hard, glossy resin that an insect secretes on trees.",
      "signet": "A stamp bearing one's own sign, cut in metal or stone.",
    },
    box: [
      { title: "The Watching Seal", text: [
        "Into the wax of a magical seal a spell of watchfulness is bound while it melts, with an addition that suits the formula. If anyone breaks the seal, the one who set it knows. This is how the master closes the poison cupboard and his fair book, and whoever so much as scratches at it must explain by evening why.",
      ] },
    ],
    task: ["Design your sign from an initial letter and a glyph and draw it into the first circle.", "Seal three times with the workshop's signet and set the best seal into the second circle.", "Which formula of your book would you bind into a watching seal, and what do you add to the wax?"],
    check: ["Design", "Impression", "Cleanliness"],
  },
  l8: {
    title: "Compasses, Rule and Cord",
    read: [
      "Before a single stroke stands on a page, it is made ready. With an awl or a little wheel you prick small holes at the margin through all the leaves of a gathering: the [[pricking]]. Between the holes you draw fine lines with rule and stylus: the [[ruling]]. First blind, as a groove without colour; later with the lead.",
      "The compasses divide and carry over. With them you take a distance and set it down again elsewhere, you halve, you divide a circle. Compasses with a loose joint are worse than none.",
      "For large circles on the ground one takes peg and cord. And for the right angle, when no square is at hand, the [[twelve-knot cord]]: twelve equal intervals, laid as a triangle of three, four and five parts. The angle between the short sides is right, and has been since men first built houses.",
    ],
    glosses: {
      "pricking": "Marking the lines by small holes at the margin, pricked through the whole gathering.",
      "ruling": "Drawing the guide lines between the pricked holes, first blind, later with lead.",
      "twelve-knot cord": "A cord with twelve equal intervals. Laid as a 3–4–5 triangle, it gives a right angle.",
    },
    task: ["Prepare a practice page: prick, rule, leave the margin free.", "Knot a twelve-knot cord and lay a right angle with it on the workshop floor.", "Check it with the master's square."],
    check: ["Preparation", "Angle"],
  },
  l9: {
    title: "Spell Chalk and Circles on the Ground",
    read: [
      "Not every circle fits on a page. Rituals and wards are drawn on the ground, with [[spell chalk]], charcoal, scattered salt or flour. The chalk is ordinary chalk, into which something that suits the formula is mixed as it is shaped, and above all it must be dry and clean. Damp chalk smears, and a smeared circle is an open circle.",
      "One draws with peg and cord. The commonest fault: the cord winds itself round the peg as you walk, grows shorter, and the circle becomes a [[spiral]] whose end does not meet its beginning. The remedy: instead of a loop, lay a loose ring round the peg, and always keep the cord taut.",
      "Whoever draws a circle on the ground begins and ends in the north, and afterwards does not step over the line again. Shoes are a greater risk than demons.",
    ],
    glosses: {
      "spell chalk": "Chalk for circles on the ground, clean, dry, often with an addition that suits the formula.",
      "spiral": "The commonest fault in a ground circle: the cord winds itself up and the circle does not close.",
    },
    task: ["In the yard, draw with peg, cord and chalk a circle three paces across.", "Have the master measure the distance to the peg at eight places with a rod.", "Repeat with a ring instead of a loop and compare."],
    check: ["Roundness", "Closure"],
  },

  // --- II. Hand and Circle ---------------------------------------------------
  l10: {
    title: "Posture, Breath, Pen Trial",
    read: [
      "One draws not with the fingers but with the whole arm. The fingers hold the quill, lightly, as one holds a small bird. The wrist does not rest fixed, it glides. The movement comes from the elbow and the shoulder. Whoever draws from the fingers draws small, cramped circles and has a cramp after an hour.",
      "Before every circle a breath: breathe in, set the quill down, draw as you breathe out. The line follows the breath; whoever holds the breath, trembles. That is not mysticism, that is muscle.",
      "Every newly cut quill is first tried on a scrap sheet, with strokes, loops, a circle. This [[pen trial]] stands in the margin of many old pages. In this primer you may put it in the empty margins, but only there.",
    ],
    glosses: { "pen trial": "Trial strokes with a freshly cut quill, mostly at the margin or on scrap sheets." },
    task: ["Sit at the desk as the master shows you and draw ten large arcs from the shoulder alone, the hand hovering.", "Draw ten circles, each with one breath.", "Make a pen trial in the margin of this page."],
    check: ["Posture", "Breath", "Looseness"],
  },
  l11: {
    title: "The Basic Strokes",
    read: [
      "All glyphs, even the most intricate, consist of five strokes. These [[basic strokes]] are the vertical, the horizontal, the arc, the hook and the loop. Whoever commands these five need not draw any glyph by heart; he assembles it.",
      "Every stroke has its direction. Verticals are drawn from top to bottom, horizontals from left to right, arcs clockwise unless otherwise said. The direction is called the [[ductus]]. A glyph drawn in the wrong ductus often looks right and still feels wrong, for the power follows the stroke, not the picture.",
    ],
    glosses: {
      "basic strokes": "Vertical, horizontal, arc, hook and loop. All glyphs are built from them.",
      "ductus": "The direction and order in which the strokes of a glyph are drawn.",
    },
    task: ["Draw each basic stroke twenty times on the wax tablet, in the right ductus.", "Let the master watch: he does not look at the result, but at the direction."],
    check: ["Form", "Ductus"],
  },
  l12: {
    title: "The Straight Line Without a Rule",
    read: [
      "A straight line freehand is not achieved by watching the quill but by watching the goal. Set two points. Lay the quill on the first, fix your eye on the second and draw swiftly, without stopping. Slow lines tremble; quick lines are straight or crooked, but never shaky, and crooked becomes straight with practice.",
      "Long straight lines are not drawn from the wrist but with the whole arm, and before the stroke you make the movement twice in the air, without touching down. This [[lead-in swing]] is permitted and is never unlearned.",
    ],
    glosses: { "lead-in swing": "Carrying out the movement of a stroke in the air before touching down." },
    task: ["Set twenty pairs of points at different distances and in different directions and join them freehand.", "Then lay the rule to each line: where does it stray by more than the width of a quill?", "Repeat until no more than two of twenty stray."],
    check: ["Straightness", "Hits", "Pace"],
  },
  l13: {
    title: "The Hundred Circles",
    read: [
      "Every formula you will ever cast stands in a circle. A circle that does not close holds nothing: the power runs away through the gap, like water from a cracked jug. That is why every training begins with the circle, and why it never quite ends with it.",
      "To draw a circle with the compasses, anyone learns in an hour. To draw a circle freehand that is [[round]], [[closed]] and [[even]], one learns in a year. The compasses stay in the workshop; in the field, in the dust, under pressure of time you have only your hand.",
      "Draw in one stroke. Do not lift off, do not mend. A mended circle is a circle with a seam, and it is at seams that things tear.",
    ],
    glosses: {
      "round": "Every point of the line equally far from the centre. Tested with the test disc (Appendix A).",
      "closed": "Beginning and end meet without a gap and without overlap.",
      "even": "Equal thickness of stroke, no trembling, no lifting off.",
    },
    task: [
      "On a large sheet draw a hundred circles about two fingers across, each in one stroke, clockwise.",
      "Count as you go: after every tenth circle a pause of three breaths.",
      "Show the sheet to the master. He lays the test disc on ten circles of his choice.",
      "Repeat the exercise every week, until nine of ten tested circles lie within the narrow ring. Then anticlockwise, then with the weak hand.",
    ],
    check: ["Roundness", "Closure", "Stroke", "Consistency of size"],
  },
  l14: {
    title: "Constructing Before Freehand I: Circle, Cross, Division by Six",
    read: [
      "Every figure is first constructed once, exactly, on a [[working page]] of its own, with compasses and rule. Only then is it drawn freehand, ten times, beside it. The construction is no aid for tracing, but the measure by which you judge your freehand figures.",
      "The cross: draw a diameter. Set the compasses in turn in both ends, with an opening larger than the radius, and strike an arc above and below. The line through the points of intersection is the [[perpendicular bisector]] and stands exactly square on the diameter.",
      "Division by six is the easiest of all divisions, for the radius fits exactly six times round the circle. Set the compasses to the circle with the opening unchanged and step all the way round. Every second point gives the triangle, all six the hexagon, two triangles one within the other the six-pointed star.",
    ],
    glosses: {
      "working page": "A page of its own for exact constructions with compasses and rule; the measure for the freehand drawing.",
      "perpendicular bisector": "The line that cuts a segment exactly in the middle, at a right angle. Constructed with two strokes of the compasses.",
    },
    task: ["Construct cross, triangle, hexagon and six-pointed star on a working page.", "Draw each figure ten times freehand beside it.", "Lay the test disc on your best freehand circle and the compasses to your best division by six."],
    check: ["Construction", "Freehand", "Division"],
  },
  l15: {
    title: "Constructing II: Square, Octagon, Five-Pointed Star",
    read: [
      "From the cross comes the square: the four ends of the two diameters are its corners. If you halve the four angles, again with two strokes of the compasses, you obtain eight points and the octagon.",
      "The five-pointed star is harder, and it is the first examination piece. Halve a horizontal radius. Set the compasses in that midpoint and open them to the topmost point of the circle. Strike an arc down to the horizontal diameter. The distance from there to the topmost point is the side of the pentagon. In that length lies a proportion that the builders call by this name: the [[golden section]].",
      "Whoever draws the five-pointed star freehand draws it in one stroke through all five points and arrives back at the start. A five-pointed star with a gap at the tip is a five-pointed star that lets something out.",
    ],
    glosses: { "golden section": "A division in which the smaller part is to the larger as the larger is to the whole. It lies in every five-pointed star." },
    task: ["Construct square, octagon and pentagon on a working page.", "Draw the five-pointed star ten times freehand, each in one stroke.", "Have the master measure the points of your best star with the compasses."],
    check: ["Construction", "Freehand", "Closure"],
  },
  l16: {
    title: "Constructing III: The Figures of the Orders",
    read: [
      "Every degree of a formula has its knot, and from the third order on the knots join into a figure that bears the load of the circle: triangle, square, five-pointed star, six-pointed star and so on up to the ninth order.",
      "The heptagon cannot be constructed exactly with compasses and rule. The workshops teach an [[approximation]]; whoever knows it cannot see the error in it. Whoever does not know it draws seven unequal sides and wonders why the formula pulls awry.",
    ],
    glosses: { "approximation": "A construction that is almost exact. For the heptagon so good that the eye cannot see the error." },
    task: ["Construct each figure once with compasses and rule on a working page.", "Afterwards draw it ten times freehand beside it.", "Lay the construction next to the freehand drawings and mark the best."],
    check: ["Division", "Closure", "Stroke"],
  },
  l17: {
    title: "Double Circle and Rings",
    read: [
      "One circle holds, a [[double circle]] protects. Between the two lines lies a band into which signs and words can be written, and the band must be of the same width everywhere. A double circle that grows narrow in one place is weak in that place.",
      "Around the circle of a formula there lie, besides, the [[spacing rings]]. Their number says how far the formula reaches: one for touch, more for the near and the far. They are drawn last, at equal distances, from the inside outwards.",
      "Freehand, the double circle succeeds if you draw the inner circle first and then the outer, with your eye fixed not on the quill but on the band. The eye keeps the distance, not the hand.",
    ],
    glosses: {
      "double circle": "Two circles about the same centre with an even band between them.",
      "spacing rings": "Rings outside the circle of a formula; their number gives the reach.",
    },
    task: ["Draw ten double circles freehand with a band one finger wide.", "Draw two and three spacing rings round three of them.", "Measure the band at four places; the master marks the greatest deviation."],
    check: ["Band", "Roundness", "Spacing"],
  },
  l18: {
    title: "The Pounce Pattern",
    read: [
      "Sometimes the master hands out a pattern that is too intricate to draw freely the first time. Then he gives no model to trace, but a [[pounce pattern]]: a sheet on which only single points of the figure are pricked through.",
      "You lay the pounce pattern on your sheet, dab a little bag of charcoal dust over the holes and lift it off. What remains are points, not lines. The lines between them you draw yourself. With each pass you get fewer points: twelve, then six, then three, then none.",
    ],
    glosses: { "pounce pattern": "A pounce sheet with pricked guide points. Charcoal dust carries over the points; the apprentice draws the lines himself." },
    task: ["Take the master's pounce sheet from Appendix B.", "Transfer the twelve points and join them freehand. Then six, then three.", "Last, draw the figure entirely without points."],
    check: ["Fidelity of form", "Closure", "Stroke"],
  },

  // --- III. The Glyphs -------------------------------------------------------
  l19: {
    title: "What a Glyph Is",
    read: [
      "A [[glyph]] is a sign that brings a thing into the circle: an essence, a movement, a price, a time. It is not magic. A sign on paper does nothing so long as no one sends power through it. But when power does go through, it takes exactly the path the sign gives it – the wrong one too.",
      "That is why in every workshop it is held: a faulty sign works with its faults. A fire triangle that is too open burns, but it burns outwards. A knot set askew holds, but it pulls.",
      "Every glyph has a [[core]] and may bear [[adjunct signs]]. The core decides what it is; the adjunct signs say how and where. Learn the cores first, and for so long that you draw them half asleep.",
      "The glyphs of this part are the same that stand in the circles of your later spellbook. What you learn here you will read again there.",
    ],
    glosses: {
      "glyph": "A sign that brings a thing into the circle: essence, school, movement, price or time.",
      "core": "The part of a glyph that decides what it is. Must never be missing.",
      "adjunct signs": "Additions to a glyph that give circumstances. May be dropped in the quick glyph.",
    },
    task: ["Write from memory on the wax tablet what core and adjunct signs are, and show it to the master."],
    check: ["Understanding"],
  },
  l20: {
    title: "The Essences",
    read: [
      "Sixteen [[essences]] are known to the doctrine, in eight pairs of opposites. Every formula carries several of them, in different proportions; the strongest is called the [[principal essence]] and stands in the core of the circle.",
      "To every essence belong an hour, a colour, a metal and a direction. You need not know them by heart in order to draw, but you must know them in order to understand why a formula comes more easily at noon than at midnight.",
    ],
    glosses: {
      "essences": "The sixteen basic substances of magic. A formula is a mixture of them.",
      "principal essence": "The essence with the greatest share. It stands in the middle of the circle and in the red arc of the essence ring.",
    },
    task: ["Draw each essence ten times on the wax tablet, its counterpart beside it.", "Have the master call out names and draw the glyph from memory.", "The other way round: the master draws, you name the name, the hour and the opposite pole."],
    check: ["Fidelity of form", "Memory", "Opposite poles"],
  },
  l21: {
    title: "The Schools",
    read: [
      "The essence is the noun of a formula, the [[school]] its verb: it says what happens to the substance – to ward, to summon, to know, to bind, to unleash, to deceive, to withdraw, to transform. Every school has its figure, which stands as the [[core seal]] in the middle of the circle.",
    ],
    glosses: { "school": "The manner of working; the verb of the formula.", "core seal": "The figure of the school at the centre of the circle, with the principal essence in it." },
    task: ["Draw each core seal once with compasses and rule, then five times freehand.", "Arrange the seals by the number of their corners."],
    check: ["Construction", "Freehand", "Arrangement"],
  },
  l22: {
    title: "The Signs of the Ring of Signs",
    read: [
      "In the [[ring of signs]] stand the signs that give the essence its movement: whether it issues as a column, spreads, pulls or thrusts. All the signs are drawn so that their point indicates the direction of working. Gathered in the north of the circle, they mean a directed effect; spread all round, an effect to every side.",
    ],
    glosses: { "ring of signs": "The ring between the spacing rings and the essence ring; it bears the signs of movement." },
    task: ["Draw each sign three times: upright, turned to the east, turned to the south.", "Explain to the master what a pull-sign drawn the wrong way round brings about."],
    check: ["Fidelity of form", "Direction"],
  },
  l23: {
    title: "The Cornerstones",
    read: [
      "In the four corners around the circle stand the [[cornerstones]]: they say what the formula demands of the caster. Voice, gesture, substance, focus. If a cornerstone is missing, the formula does not need it; if it stands there, it must not be lacking at the casting.",
      "The substance bears its [[alchemical sign]], for nothing comes from nothing: the substance is the price that the formula demands, and the sign says what kind of price it is. More on this in the fourth part.",
    ],
    glosses: { "cornerstones": "The components of a formula, in the corners around the circle.", "alchemical sign": "A sign for the kind of a substance, e.g. sulphur, salt, quicksilver or a metal." },
    task: ["Draw the cornerstones five times each.", "Name the cornerstones of three formulas from your book without looking."],
    check: ["Fidelity of form", "Knowledge"],
  },
  l24: {
    title: "The Time Marks",
    read: ["Above the circle stands the [[time mark]]: how long the casting takes. A point for an instant, a flash for the swift, an arc for a full movement, the hourglass for the ritual."],
    glosses: { "time mark": "The sign above the circle for the casting time of the formula." },
    task: ["Draw the time marks five times each, as small as they stand above a circle."],
    check: ["Fidelity of form", "Size"],
  },
  l25: {
    title: "Threshold Gates and Seal Band",
    read: [
      "Not every formula strikes a defenceless target. Where a target can resist it, a red [[threshold gate]] breaks the script band: an eye for the will, a block for toughness, an arrow for nimbleness. Two gates mean that a target can halve the effect; a dashed gate, that resistance is not needed.",
      "Beneath the band, in some formulas, lies a hatching, the [[seal band]]: this formula must hold against the force with which some beings keep magic from themselves.",
    ],
    glosses: { "threshold gate": "A red gate in the script band: here the target can defend itself.", "seal band": "Hatching beneath the script band: the formula must prevail against spell resistance." },
    task: ["Find all the gates in the master's view and name them.", "Draw a script band with two gates from memory."],
    check: ["Recognition", "Drawing"],
  },
  l26: {
    title: "The Gesture Sheet",
    read: [
      "Most formulas demand a [[gesture]]. It is not drawn, it is done; but it is drawn so that one does not forget it. Every school has its basic gestures, and every formula chooses from them.",
      "The gesture sheet every apprentice makes for himself, for no two hands are alike. You draw the outline of your own hand and enter how the fingers stand. A stranger's hand as a model teaches you the gestures of someone else.",
    ],
    glosses: { "gesture": "A movement of the hands that a formula demands. It follows the school and the shape of the effect." },
    task: ["Lay your hand flat on a sheet and draw its outline. That is your gesture sheet.", "Enter a basic gesture for each school: position of the fingers as dots, movement as an arrow.", "Perform three gestures for the master without looking at the sheet."],
    check: ["Accuracy", "Memory", "Posture"],
  },
  "g-sigil": {
    title: "Building Sigils",
    sentences: ["Shelter for this book", "A lamp above the door", "Peace in the chamber"],
    read: [
      "The core of a glyph says what happens, and is never altered. What holds only for this place, this target, this name, stands in the adjunct signs. An adjunct sign that one builds oneself is called a [[sigil]].",
      "It is built from the [[statement of intent]], which says in a few words what the sign is for. Write it in capital letters. Strike out every letter that has already occurred, then the vowels. Lay the rest one upon another, draw shared strokes only once, and simplify until the figure can be read in a single stroke.",
      "A sigil holds only for exactly what its sentence says. “Shelter for this book” shelters this book and no other. Whoever has a new target builds a new sigil. That is why it stands in no pattern book.",
    ],
    glosses: {
      "sigil": "An adjunct sign one builds oneself from the letters of a sentence. Holds only for what it describes.",
      "statement of intent": "A short sentence that says what a sigil is for.",
    },
    task: ["Build a sigil from each of the two other sentences, first on the wax tablet, then in the empty space.", "Choose a sentence of your own for a place in the workshop and build its sigil.", "Explain your sigil to the master letter by letter: where does the S sit, where the T?"],
    check: ["Striking out", "Merging", "Reasoning"],
  },
});

Object.assign(window.PRIMER_EN.lessons, {
  "l27": {
    title: "The Burning Log",
    read: [
      "Throw a log on the fire and watch. It burns: that is [[Sulfur]], the burning thing, which dwells in everything that has colour, scent and warmth. It smokes: that is [[Mercurius]], the volatile thing, which rises and changes. And in the end ash remains: that is [[Sal]], the fixed thing, which neither burns nor flies.",
      "The Doctrine calls these three the [[tria prima]], the three first principles. Every substance carries all three, but in differing measure. Wax is almost wholly Sulfur, salt almost wholly Sal, quicksilver the purest Mercurius. In the formulas they stand for fire, change and order.",
    ],
    glosses: {
      "Sulfur": "The burning principle: combustibility, colour, warmth. Sign: a triangle above a cross. Essence Ignis.",
      "Mercurius": "The volatile principle: evaporating, flowing, transforming. Essence Fluxus.",
      "Sal": "The fixed principle: ash, crystal, form. Sign: a circle with a bar. Essence Ordo.",
      "tria prima": "The three principles Sulfur, Mercurius and Sal.",
    },
    task: ["Draw each of the three signs ten times freehand.", "Assign eight substances to their prevailing principle: wax, salt, quicksilver, charcoal, chalk, spirits of wine, soap, sealing wax. The solution is printed upside down on the next page."],
    check: ["Signs", "Assignment"],
  },
  "l28": {
    title: "The Elements as Triangles",
    read: [
      "The four elements are the simplest glyphs of all: a triangle with its point upward, one with its point downward, and a crossbar. What strives upward, fire and air, points upward; what sinks, water and earth, points downward. The crossbar divides the light from the heavy of its direction: air is fire made gentle, earth is water made heavy.",
      "Each element has two [[qualities]]: hot or cold, moist or dry. Fire is hot and dry, air hot and moist, water cold and moist, earth cold and dry. Lay the qualities crosswise and each element lies between its two, with opposites facing one another. Above all four stands the [[quintessence]], the fifth, which cannot be drawn.",
      "The triangles are also an exercise in straightness. Construct the equilateral triangle once from the division into six, then draw it freehand until all three sides are equal.",
    ],
    glosses: {
      "qualities": "Hot, cold, moist, dry. Each element has two of them.",
      "quintessence": "The fifth element above the four; in the Doctrine, the origin of the essences.",
    },
    task: ["Draw each of the four element triangles ten times freehand; test the sides with the compasses.", "Draw the cross of qualities from memory and set the elements in it."],
    check: ["Triangles", "Cross"],
  },
  "l29": {
    title: "The Wandering Stars",
    read: [
      "Seven [[wandering stars]] run their courses, and to each belongs a metal. Their signs are built from only three parts: the [[circle]] for the perfect, the [[crescent]] for the changeable, the [[cross]] for matter. Whoever can draw these three with a sure hand can read all seven.",
      "Copper belongs to Venus. She is warm and moist like [[air]], and like air she binds without compelling: by attraction. Whoever puts copper into a formula gives it breadth and bonding.",
    ],
    glosses: {
      "wandering stars": "The seven moving heavenly bodies of the old teaching, each with its metal.",
      "circle": "Building block of the planetary signs: the perfect, the spirit.",
      "crescent": "Building block of the planetary signs: the changeable, the soul.",
      "cross": "Building block of the planetary signs: matter, the four elements.",
      "air": "Element of breath and breadth; warm and moist. Essence Aer.",
    },
    task: ["Draw circle, crescent and cross twenty times each.", "Compose all seven signs from them without looking at the master's view.", "Write the metal and the essence beside each sign."],
    check: ["Building blocks", "Composition", "Assignment"],
  },
  "l30": {
    title: "The Circle of the Week",
    read: [
      "Arrange the seven wandering stars by the time each needs for its course, from the slowest to the swiftest, and you obtain [[the old sequence]]: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon.",
      "Set them in that order on the seven corners of a heptagon and join each corner to the third one after it, so that a [[heptagram]] arises. Follow the lines of the star and you pass the wandering stars in a new order: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn. That is the week, in which every day belongs to a wandering star.",
      "For this reason, some workshops say, one draws tin glyphs most gladly on the day of Jupiter and silver glyphs on the day of the Moon. Whether that is true, you are to find out for yourself. Write it down in any case.",
    ],
    glosses: {
      "the old sequence": "The seven wandering stars by their time of revolution: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon.",
      "heptagram": "Seven-pointed star within the heptagon; its lines lead from the old sequence to the week.",
    },
    task: ["Construct a heptagon by the approximation from {{lesson:l16}} and draw the heptagram into it.", "Set the signs of the wandering stars on the corners in the old sequence.", "Follow the star and write the days of the week beside them."],
    check: ["Star", "Sequence", "Week"],
  },
  "l-time-week": {
    title: "The Days and Their Stars",
    read: [
      "In the circle of the week you saw how the heptagram orders the wandering stars into the week. Now take each day into your hand by itself. Each brings something with it: the sign of its star, the metal that belongs to it, a colour, and the essences for which it has an [[affinity]].",
      "Over many generations the workshops have written down what succeeded and what failed on which day. Out of that a custom has grown, not a rule. No one forbids you to draw a fire formula on the day of lead. But if it fails, your master will furrow his brow and glance across at the calendar.",
      "Beneath each day stands what is said of it. Read it as the experience of older colleagues: not all of it is true, but nothing in it was written down without reason. Where the country you live in keeps customs of its own for the day, they are set beside it.",
    ],
    glosses: {
      "affinity": "The inclination of a day, month or sign towards certain essences. Tradition, not rule.",
    },
    task: ["Keep a workshop journal for one week: each evening write down what succeeded and what did not.", "At the week’s end compare with the days given here: where does the custom hold, where not?", "Draw the seven signs of the stars from memory and write the metal and colour beside them."],
    check: ["Workshop journal", "Comparison", "Signs"],
  },
  "l-time": {
    title: "The Year and Its Patron Deities",
    read: [
      "The week is a small circle, the year a great one. The ring of the year shows two divisions of the year one above the other: outside the months, as people count them, inside the signs of the heavens, as the Sun passes through them.",
      "Many months stand under a [[patron deity]]. Where tradition knows one, its name is written beneath the month, and its sacred colours run as two narrow stripes along the outer edge. If several gods share the same colour, the workshop paints each with a different pigment: blue is not the same as blue, ultramarine is not azurite.",
      "What the god watches over colours the month. A month under a god of law has an affinity for order, one under a god of the sea for water. Which feasts the houses of the gods keep is not written in this primer; you will learn that in your own house, or not at all. Here what counts is what holds at the workbench.",
    ],
    glosses: {
      "patron deity": "The deity to whom a month belongs; its spheres of charge colour the month.",
    },
    task: ["Copy out the ring of the year, first the months, then the signs, and mark the day of your birth.", "Choose three months and write beside each what affinity it has and whether that fits what you know of its patron deity.", "Write down in which month and under which sign you were born, and what each is supposed to say about you."],
    check: ["Ring", "Months", "Birth"],
  },
  "l-time-sky": {
    title: "The Signs of the Heavens",
    read: [
      "On a clear night you can see that the whole sky turns, save one star: the [[pole star]]. The others circle it like apprentices round the master. The star chart shows the northern sky as it stands above you when you look northward and tip your head back.",
      "The red loop is the [[ecliptic]], the path of the Sun through the year. In summer it climbs high above the dashed celestial equator, in winter it sinks beneath it; that is why its path on the chart looks like a displaced circle. Upon it lie the signs, each a picture drawn from a few stars.",
      "The sign in which the Sun stood on your birthday is called your sign by the star-readers. On that day you cannot see it, for the Sun outshines it. Half a year later it stands high in the south at midnight.",
    ],
    glosses: {
      "pole star": "The star of the northern sky that stands fast while all the others turn about it.",
      "ecliptic": "The path on which the Sun travels through the constellations in the course of the year.",
    },
    task: ["On a clear night find the pole star and draw the stars around it just as you see them.", "Find your sign on the chart and trace its picture with the connecting lines.", "Write down what affinity your sign has and whether you recognise yourself in it."],
    check: ["Sky", "Sign", "Reading"],
  },
  "l31": {
    title: "Reading Substances",
    read: ["When a substance stands in the cornerstone of a formula, it brings its essences with it. A piece of tin gives order and life, a grain of sulphur gives fire. Whoever can read the signs of the substances can tell from the price of a formula alone where it is heading."],
    task: ["Cover the right-hand column and name for each substance its sign and its essence.", "Find three more substances in your book and read them in the same way."],
    check: ["Sign", "Essence"],
  },
  "l32": {
    title: "Mixtures in Parts",
    read: [
      "A formula is a mixture, and mixtures are written like a recipe: in [[parts]]. Ten parts make the whole. What lies between two parts is called strong or weak, scant or good.",
      "Whoever can read a formula in parts sees at once what it bears and what it merely seasons.",
    ],
    glosses: { "parts": "Measure of the share of an essence: one part is a tenth of the whole." },
    task: ["Read the mixtures aloud.", "For another formula of your book, write down the mixture in parts, going by its ring of essences alone."],
    check: ["Reading", "Writing"],
  },
  "l-inks": {
    title: "Inks by the Mixture",
    read: [
      "The base ink of the fair book is always iron gall, for it endures. What a formula bears is added to it: it is coloured in the colour of the principal essence, and to that comes a dust of that essence’s metal. Which colour and which metal belong to which essence is written in the Table and, for each formula, under its [[correspondences]].",
      "After that it grows harder. The second essence receives an [[admixture]], a knife-point of its metal, and you must be able to say why. The Doctrine gives the ingredient; the reason you must find yourself.",
      "From an apprentice’s workshop journal, for a fire formula with air: “Vermilion and gold dust, as the Table demands. And copper besides, for air fans the fire, and with more air it burns hotter.” Beneath it, in the master’s hand: “The ingredient is right. The reason is better than the ingredient.”",
      "Substances in the cornerstone of a formula are read differently from its correspondences: there gold belongs to light, here to fire. And for the poisonous pigments of the Table, what stands in {{lesson:l5}} and {{lesson:w-soap}} holds good.",
    ],
    glosses: {
      "correspondences": "Hour, colour, metal and direction that belong to an essence.",
      "admixture": "A knife-point of metal from the second essence of a formula, with a reason given.",
    },
    task: ["Cover the Table and name pigment and metal for three essences.", "Derive the ink of your first formula from {{lesson:l39}}: base ink, pigment, metal, admixture.", "Write the reason for the admixture in a single sentence and defend it before the master."],
    check: ["Table", "Derivation", "Reason"],
  },
  "l33": {
    title: "From Full Sign to Short Sign",
    read: [
      "At an inn table, in the rain, in a fight, there is no time for the full circle. Whoever has drawn a formula once in full and understood it may call it up by its [[quick glyph]]: five strokes instead of fifty.",
      "The quick glyph arises by leaving out all the adjunct signs and keeping of the core only what sets it apart from all the others. The core itself one may never leave out.",
      () =>
        "Many formulas share the same core. What separates one from another is its [[intent]]: the verb and the essence word of the Latin core line. Their initial letters stand beside the school figure. Whoever knows the core line knows the glyph as well. " +
        (window.SCRIPTS && SCRIPTS.mode() === "latin"
          ? "Formulas from foreign textbooks are written in transliteration: beside the figure then stand familiar capital letters, the initial sounds of the foreign core line, as the scholars transcribe them."
          : "Formulas from foreign textbooks keep their script: beside the figure then stand Greek letters, cuneiform signs, hieroglyphs or Ogham.") +
        " Beneath it, in small writing, stands the [[formal formula]], the Latin core line, so that the formula can also be looked up in the language of the trade.",
    ],
    glosses: { "quick glyph": "Short sign of a formula: circle, school figure, principal essence, intent, shape stroke, degree dots.", "intent": "Verb and essence word of the core line; in the quick glyph, their initial letters.", "formal formula": "Latin core line beneath a formula in a foreign language, for looking up in the language of the trade." },
    task: ["Derive the quick glyph in three steps, as shown in the master’s view.", "State in one sentence which parts you have left out, and why."],
    check: ["Derivation", "Reason"],
  },
  "l34": {
    title: "The Quick Glyphs of Your Formulas",
    read: ["Here stand the quick glyphs of the small formulas in your book. Learn them as one learns faces: not stroke by stroke, but as a whole."],
    task: ["Cover the names and name each glyph.", "Draw each glyph from memory, then compare."],
    check: ["Recognising", "Drawing"],
  },
  "l35": {
    title: "Three Drills",
    read: [
      "[[Timed drill]]: One quick glyph twenty times, in the time it takes a candle to burn down by a finger’s breadth. Afterwards mark the three worst.",
      "[[Blind drawing]]: Close your eyes, draw the glyph five times, open your eyes, compare. In this way the hand learns without the eye to help it.",
      "[[Air drawing]]: With outstretched finger, large, into the air. The master calls “wrong” as soon as a stroke is missing. Whoever practises so can cast in the dark.",
    ],
    glosses: { "Timed drill": "Exercise in speed with the form kept unchanged.", "Blind drawing": "Drawing with closed eyes; trains the memory of the hand.", "Air drawing": "Drawing with the finger in the air, as in casting." },
    task: ["One drill each day, for a week. Tick off the days: ☐ ☐ ☐ ☐ ☐ ☐ ☐"],
    check: ["Pace", "Form"],
  },
  "l36": {
    title: "From the Outside In",
    read: ["A circle is read from the outside in and drawn from the inside out. Outside stands what the world sees of the formula: its reach, its shape, its word. Inside stands what it is."],
    task: ["Read the circle aloud layer by layer, without looking at the list.", "Sum it up in one sentence."],
    check: ["Layers", "Summary"],
  },
  "l37": {
    title: "Circles with Gaps",
    read: ["In each of these circles a layer is missing. Whoever knows what ought to stand there has understood the circle; whoever merely sees that something is missing has only seen it. The solutions stand upside down behind the last circle; turn the page only when all the circles are completed."],
    taskFirst: "The four circles follow on the next pages.",
    task: ["Name the missing layer for each circle.", "Draw it on the wax tablet as it ought to be."],
    check: ["Recognising", "Completing"],
  },
  "l38": {
    title: "Comparing Two Circles",
    read: ["Related formulas have related circles. Lay two side by side and ask: what is the same, what is different, and why?"],
    taskFirst: "The two circles follow.",
    task: ["Name three things they have in common and three that differ.", "Predict which of the two reaches further and which lasts longer, going by the circle alone."],
    check: ["Comparison", "Reason"],
  },
  "l39": {
    title: "My First Spell",
    read: [
      "There comes a day when something happens for the first time. A light that does not come from a flame. A grain of dust that lifts. Most apprentices are frightened. Write it down while you still know it; later you will not believe it.",
    ],
  },
  "formula": {
    title: "",
    read: ["Learn the formula in three passes: each time more words are missing, until you speak it entirely from memory."],
    check: ["Circle", "Formula", "Gesture"],
  },
  "l40": {
    title: "Tailoring a Formula",
    read: [
      "Most of the formulas you will ever cast were written by someone else. But every formula can be narrowed. Whoever takes a general formula and narrows it to one single, exactly determined purpose obtains a [[cutting plan]]: a smaller, wilful, often lovable formula. Many everyday spells arose in this way.",
      "One tailors by fixing something that the [[base formula]] leaves open: the target, the duration, the reach, the shape. The core is never tailored. The school remains, the principal essence remains; only the adjunct signs grow more exact, and sometimes a secondary essence shifts.",
      "A good cutting plan is so narrow that it can no longer be used for anything else. That is no fault, but its very nature.",
    ],
    glosses: {
      "cutting plan": "A general formula narrowed to one single, exactly determined purpose.",
      "base formula": "The general formula from which a cutting plan arises.",
    },
    task: ["Read the comparison: what does the cutting plan fix that the base formula left open?", "Choose a small formula from your book and design a cutting plan of your own on the wax tablet: purpose, target, duration, name.", "Present it to the master and justify why the core remains unchanged."],
    check: ["Understanding", "Design", "Reason"],
  },
  "l41": {
    title: "Your Own Handbook",
    read: [
      "One day the master lays an empty book on your table. It is your [[fair book]], and the first page in it is your [[journeyman’s piece]]. On it stands a single small formula, complete: circle, formula, cornerstones, gesture, mixture.",
      "The page is planned beforehand, not upon itself. On scrap paper a draft is made at full size, with margin, circle and block of text. Then the parchment page is pricked and ruled, the circle drawn first, while the hand is steady, the script after. The rubric comes last.",
      "Mistakes on this page are not scraped away. A stroke that goes astray stays standing, and you draw the right one beside it. So in every fair book the first page shows who one was when one began.",
    ],
    glosses: { "journeyman’s piece": "The first page in the fair book, approved by the master. Ends the apprenticeship of this primer." },
    task: ["Design your first page on scrap paper at full size and have the draft approved.", "Transfer it to the fair book: pricking, ruling, circle, script, rubric.", "Show the finished page to the master. It will not be improved, only judged."],
    check: ["Draft", "Circle", "Script", "Overall impression"],
  },
  "l42": {
    title: "The Examination Before Three",
    read: [
      "At the end of the first primer there is no examination by the master alone. One is examined [[before three]]: an examiner who asks questions and sets tasks; an overseer who sees that everything is done fairly; a scribe who records what takes place. One’s own master may take one of the three roles, but not that of examiner.",
      "What is examined is what this primer has taught, and no more: a sheet of circles, glyphs from memory, a circle that is read, a small formula cast three times in succession, and the journeyman’s piece. Whoever passes may open the second primer.",
      "Whoever fails repeats after half a year. That is no disgrace. The disgrace would be to keep a book one cannot read.",
    ],
    glosses: { "before three": "Examination with examiner, overseer and scribe; one’s own master does not examine." },
  },
  "a-disc": { title: "A · The Test Disc" },
  "a-pounce": { title: "B · The Master’s Pounce Sheets" },
  "a-grade": { title: "C · The Master’s Grading Sheet" },
  "a-promote": { title: "D · Promotion Sheet" },
  "a-gloss": { title: "E · Glossary" },
});
