// English everyday spells: key = German name in data/everyday_spells.js (the spell id is derived from it and stays).
// name: English name; description: rules text in English (feet and inches, as PF rules texts do); flavor: English flavour sentence.
window.EVERYDAY_SOURCES_EN = {
  frieren: { title: "Frieren – Beyond Journey’s End: Magic Overview" },
  reddit: { title: "r/Frieren: “Come up with a mundane spell that would be absolutely irresistible to Frieren”" },
  spacebattles: { title: "“Fear Not The Elf Who Knows 10,000 Spells” by Silver W. King (SpaceBattles)" },
};

window.EVERYDAY_SPELLS_EN = {
  // --- Kitchen ---
  "Apfelwandel": {
    name: "Apple Turn",
    description: "A red apple you touch turns green, or a green one turns red. Only the skin changes; taste, ripeness and nourishment stay as they were. The spell does not work on yellow apples.",
    flavor: "Why? Because some people simply prefer to look at green apples.",
  },
  "Pfannkuchenwende": {
    name: "Pancake Flip",
    description: "A pancake lifts, turns over by exactly 180 degrees and lands in the middle of the same pan. It does not tear in the process. On pancakes wider than 1 ft. across, the spell fails without exception.",
    flavor: "The only formula in this book that I cast before witnesses.",
  },
  "Salzentzug": {
    name: "Salt Draw",
    description: "Draws the excess salt out of one portion of food, such as a pan of mushrooms. The salt gathers as a crust on the rim of the vessel. The dish is afterwards salted exactly right – by the caster’s own taste.",
    flavor: "This formula has demonstrably saved more friendships than any healing magic.",
  },
  "Traubensäure": {
    name: "Sour Grapes",
    description: "Turns sweet grapes sour. It works in this direction only; the way back is not known. It has no effect on wine.",
    flavor: "Copied from the collection of an elf who was said to own a thousand such formulas. Why? Unknown. I cast it all the same.",
  },
  "Teewärme": {
    name: "Teacup Warmth",
    description: "Brings a cup of tea to a pleasant drinking temperature and keeps it there for one hour. If the tea is poured into another vessel, the spell ends.",
    flavor: "Ordo holds the warmth, Ignis gives only as much as is lost. A control loop.",
  },
  "Ein Eiswürfel": {
    name: "Just One Ice Cube",
    description: "Creates a single, crystal-clear ice cube directly inside a vessel within range. The cube melts normally.",
    flavor: "Colder than necessary. I left the Ordo share uncorrected on purpose.",
  },
  "Krustenknack": {
    name: "Crust Crackle",
    description: "A slice of stale bread becomes fresh and crisp again, as if it had just come from the oven. Mouldy bread stays mouldy.",
  },
  "Gerechter Kuchen": {
    name: "Fair Cake",
    description: "Fine lines of light show on a cake how to cut it into a stated number (2 to 12) of pieces of exactly equal size. Crumble topping is taken into account.",
    flavor: "For once, a formula that prevents a quarrel instead of winning it.",
  },
  "Kochstellen-Pfiff": {
    name: "Kettle Whistle",
    description: "A kettle gives a bright whistle as soon as its contents boil – even if it has no whistle of its own.",
  },

  // --- Household and writing room ---
  "Klecksrückruf": {
    name: "Blot Recall",
    description: "A fresh ink blot (no more than a few heartbeats old) lifts from the parchment and flows back into the inkwell. Dried ink stays where it is.",
    flavor: "Priceless to calligraphers. I learned it before all the others.",
  },
  "Federkielschliff": {
    name: "Quill Point",
    description: "Sharpens a quill to a perfect writing point, either broad or fine as you choose.",
  },
  "Eselsohrglätter": {
    name: "Dog-Ear Smoother",
    description: "Removes all creases, dog-ears and waves from the pages of a book or scroll. Tears and water stains remain.",
    flavor: "Every book has earned it.",
  },
  "Regalfinder": {
    name: "Shelf Finder",
    description: "The caster names a book title. If a book with exactly that title stands within 30 ft., its spine glows briefly. The spell does not find variant spellings.",
  },
  "Schleifenbinder": {
    name: "Bow Binder",
    description: "Ties shoelaces or a ribbon into a firm double bow – or undoes any knot, however tangled, in such a lace or ribbon.",
  },
  "Sockenpaar": {
    name: "Sock Match",
    description: "The caster knows in which direction the sock that matches a sock he touches lies, provided it is within 100 ft.",
    flavor: "The only formula I know that reckons in pairs instead of single things. Theoretically interesting.",
  },
  "Wäscheduft": {
    name: "Laundry Breeze",
    description: "Clothing smells for one day as if freshly washed and dried in the sun. It does not become any cleaner.",
  },
  "Rostlöser": {
    name: "Rust Release",
    description: "Removes rust or verdigris from a metal object and leaves it gleaming as on the day it was made. It cannot be used to repair constructs.",
    flavor: "An old sorceress is said to have polished the statue of a hero with it for decades.",
  },

  // --- Small pranks ---
  "Teppichfunke": {
    name: "Carpet Spark",
    description: "A harmless static discharge, exactly like the one after shuffling across a woollen carpet. No damage, no penalties – only an audible crackle and an indignant twitch.",
    flavor: "Tested on the sergeant. Result: he still does not know.",
  },
  "Niesreiz": {
    name: "Sneeze Tickle",
    description: "The target sneezes once, heartily. It loses no action and suffers no penalties. Creatures without a nose are immune.",
  },
  "Rückwärtsecho": {
    name: "Backward Echo",
    description: "The last three seconds of sound within 10 ft. of the caster ring out once more – backwards.",
  },
  "Bartzwirbel": {
    name: "Whisker Twirl",
    description: "The target’s beard twirls itself into two elegant points and stays that way for one hour. On the beardless, two twirled shadows appear briefly on the upper lip.",
  },

  // --- Nature and well-being ---
  "Blumenfeld": {
    name: "Flower Field",
    description: "On a patch of meadow 10 ft. by 10 ft., blossoms open for one day in a colour of the caster’s choosing. Nothing grows on stone, snow or blighted ground.",
    flavor: "Perfectly useless. I have cast it three times.",
  },
  "Ein bestimmtes Unkraut": {
    name: "One Particular Weed",
    description: "Pulls up, roots and all, every plant of one named kind (a dandelion, say) from a bed 5 ft. by 5 ft. All other plants are left untouched.",
  },
  "Mückenkreis": {
    name: "Gnat Circle",
    description: "Midges and biting flies keep away from a radius of 5 ft. around the caster. Larger vermin and swarms ignore the spell.",
  },
  "Schluckaufstille": {
    name: "Hiccup Hush",
    description: "Ends a bout of hiccups at once.",
    flavor: "More reliable than any home remedy. And quicker than a fright.",
  },
  "Warme Zehen": {
    name: "Warm Toes",
    description: "The target’s feet stay pleasantly warm for eight hours. The spell gives no protection against cold damage, nor against the weather on the rest of the body.",
  },
  "Katzenschoß": {
    name: "Cat’s Lap",
    description: "A house cat comes over and curls up in the caster’s lap for one minute. Then it leaves, as cats do.",
  },
  "Stiller Magen": {
    name: "Quiet Belly",
    description: "The caster’s rumbling stomach cannot be heard for ten minutes. Equally suited to council meetings and ambushes.",
  },

  // --- Senses ---
  "Mondschattenspur": {
    name: "Moonshade Trace",
    description: "The caster learns whether an elf within range has moonshade tincture in the body – a rare elven sleeping poison. Other poisons and other peoples are not shown by the spell.",
    flavor: "Why anyone invented this formula is written nowhere. That troubles me more than the poison.",
  },
  "Reifeprobe": {
    name: "Ripeness Test",
    description: "Shows whether a fruit or vegetable within range is unripe, ripe or overripe.",
  },
  "Namensschatten": {
    name: "Name Shadow",
    description: "The caster remembers the name of a person standing before him, provided he has heard that name at least once within the past week.",
    flavor: "Embarrassing moments at receptions: markedly rarer since.",
  },

  // --- Light and ornament ---
  "Dochtsauberkeit": {
    name: "Clean Wick",
    description: "Lights a candle or lamp so that it burns entirely free of smoke until it is put out.",
  },
  "Runder Kreidekreis": {
    name: "True Chalk Circle",
    description: "A chalk line drawn by hand in the shape of a circle rounds itself into a geometrically perfect circle. It grants no bonus to rituals – but it looks better.",
    flavor: "The only formula I consider vain. I use it daily.",
  },
  "Beschlagbild": {
    name: "Misted Picture",
    description: "A pane of glass mists over with frost flowers that form a picture the caster has in mind. No damage.",
  },

  // --- From the elf's collection (the Frieren list) ---
  "Schneeschale": {
    name: "Snow Bowl",
    description: "Turns the water in a bowl into loose, fine shaved snow. You must bring your own syrup.",
    flavor: "On a hot day in the field camp, more popular than any battle formula.",
  },
  "Ölfleckenlöser": {
    name: "Grease Lifter",
    description: "Removes a stubborn oil or grease stain completely. Ordinary prestidigitation fails against such stains; this formula can do nothing else.",
  },
  "Schmuckspur": {
    name: "Trinket Trail",
    description: "Shows the direction to a lost piece of jewellery that the caster has worn himself, provided it lies within 100 ft. Another person’s jewellery remains unfindable.",
    flavor: "An elf is said to have searched for a ring with it that mattered more to her than a dragon’s hoard.",
  },
  "Vogelfang": {
    name: "Finger Perch",
    description: "A small wild bird lands for one round on the caster’s outstretched finger and lets itself be held gently. Then it flies away unharmed.",
  },
  "Rückenkratzer": {
    name: "Back Scratcher",
    description: "An invisible hand scratches exactly the spot on the back that itches – even one you cannot reach yourself. After one minute the spot is soothed.",
    flavor: "The most requested formula, whenever I give a demonstration.",
  },
  "Schalenwacht": {
    name: "Shell Watch",
    description: "When the egg you touched is cracked open, not a single piece of shell falls into the bowl. The splinters stay in the caster’s hand.",
  },
  "Silberader": {
    name: "Silver Vein",
    description: "Shows whether silver ore lies within the cone and, if so, in which direction the strongest vein runs. Worked silver and other metals remain unseen.",
  },
  "Zungenschliff": {
    name: "Tongue Polish",
    description: "For one minute the caster can recite any tongue-twister quickly and without error. Spell formulas gain no bonus – the spell is deliberately drawn that narrowly.",
    flavor: "I do not stumble over my words. The structure of the formula is instructive all the same: Ordo on the sounds, not on the mind.",
  },
  "Stabholzflick": {
    name: "Wand Splice",
    description: "Joins the wood of a broken wand or staff together without a seam. Lost magic does not return thereby – but the staff looks like new again.",
  },
  "Zopfzauber": {
    name: "Plait Weave",
    description: "The caster’s own hair braids itself into a hairstyle of their choice and holds for one day, even in wind and rain.",
  },

  // --- Wishes from the tavern (the Reddit collection) ---
  "Kartoffelschäler": {
    name: "Potato Peeler",
    description: "A potato is peeled paper-thin in a single breath. The peel falls away as one long ribbon.",
    flavor: "Kitchen duty in camp: suddenly I was very popular.",
  },
  "Wein zu Wasser": {
    name: "Wine to Water",
    description: "A cup of wine becomes clear water for one hour – then wine again. Especially effective on priests who are expecting a miracle of their own.",
    flavor: "For the garrison chaplain. He has not forgiven it to this day.",
  },
  "Trockene Socken": {
    name: "Dry Socks",
    description: "A pair of socks stays dry for one day – in rain, when wading a brook, even inside a warrior’s boot.",
    flavor: "The most useful formula in this book. I stand by it.",
  },
  "Kühles Kissen": {
    name: "Cool Pillow",
    description: "Both sides of a pillow stay pleasantly cool all night long.",
  },
  "Kissenschüttler": {
    name: "Pillow Plump",
    description: "Plumps a pillow or blanket perfectly. The down spreads evenly.",
  },
  "Brotweiche": {
    name: "Soft Crumb",
    description: "Makes hard bread soft and fluffy again. The counterpart to Crust Crackle.",
  },
  "Steinbrot": {
    name: "Brick Loaf",
    description: "Soft, fresh bread becomes hard as a brick – for one day. Why anyone should want that, the source does not say.",
    flavor: "Serviceable as a missile. That was probably not the purpose.",
  },
  "Sirupquell": {
    name: "Syrup Spring",
    description: "Creates a cup of sweet fruit syrup in a flavour of the caster’s choice. It belongs with Snow Bowl as the cherry belongs on the cake.",
  },
  "Reibeisenrein": {
    name: "Grater Clean",
    description: "Cleans a cheese grater completely, every single hole. Ordinary prestidigitation fails at this time and again.",
  },
  "Weckruf": {
    name: "Wake Chime",
    description: "Wakes the caster at a previously chosen hour with a soft chime that only he can hear.",
    flavor: "Punctual for the changing of the watch. The others rarely thank me.",
  },
  "Schimmelblick": {
    name: "Mould Sight",
    description: "Shows whether hidden mould lurks in a loaf of bread or a cheese, and exactly where.",
  },
  "Garnentwirrer": {
    name: "Knot Unpicker",
    description: "Untangles a knotted thread, chain or necklace in one round, without anything breaking.",
  },
  "Bettenmacher": {
    name: "Bed Maker",
    description: "A bed makes itself: sheets drawn taut, blanket folded, pillows squared.",
  },
  "Käsereife": {
    name: "Cheese Ripener",
    description: "Ripens a mild cheese by several months: sharper, stronger, and a good deal more pungent.",
  },
  "Kordelretter": {
    name: "Drawstring Rescue",
    description: "Draws a cord that has slipped into a hem back out and evens up both ends.",
  },
  "Wasserwaage": {
    name: "Spirit Level",
    description: "Shows whether a floor or tabletop is exactly level and, if not, where it slopes.",
  },
  "Kieselfort": {
    name: "Pebble Begone",
    description: "Removes a pebble from your own shoe without your having to take the shoe off.",
  },
  "Heiße Suppe, kalte Schale": {
    name: "Hot Soup, Cool Bowl",
    description: "Warms the food in a bowl; the bowl itself stays cool enough to hold.",
  },
  "Regalordnung": {
    name: "Shelf Order",
    description: "The books on one shelf sort themselves by title, size, colour or subject – as the caster chooses.",
    flavor: "Sorted by school and order. Naturally.",
  },
  "Dämonenjucken": {
    name: "Demon Itch",
    description: "A demon feels a fierce itch for one round at a spot it cannot reach. No penalties – only a loss of dignity.",
    flavor: "Whoever fights demons needs a sense of humour.",
  },
  "Leichtgepäck": {
    name: "Light Pack",
    description: "A backpack weighs one tenth less for eight hours. Enough to notice on the march, too little to talk about.",
  },

  // --- Folk spells of the miners (after “Fear Not The Elf Who Knows 10,000 Spells”) ---
  "Heißtee": {
    name: "Quick Brew",
    description: "Turns a cup of water into hot herbal tea, after a recipe the caster knows.",
    flavor: "The oldest folk spell I have found. It has outlasted every cold.",
  },
  "Wildprobe": {
    name: "Game Check",
    description: "Shows whether a piece of meat or game is diseased, spoiled or wholesome.",
  },
  "Seilfeste": {
    name: "Rope Hold",
    description: "A rope will not break for one hour and gains +2 to its break value. Knots do not come undone of their own accord.",
  },
  "Lagerfeuerfunke": {
    name: "Campfire Spark",
    description: "Reliably lights a pile of firewood, even if it is damp. The embers stay warm for a night.",
  },
  "Morgenguss": {
    name: "Morning Shower",
    description: "A short, warm gush of water washes the caster from head to toe. The water vanishes afterwards without a trace.",
  },
  "Proviantfrische": {
    name: "Fresh Rations",
    description: "One day’s rations stay fresh for a month, as if just prepared.",
  },
};
