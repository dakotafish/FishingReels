// Castline UI Kit — shared demo data
// Anglers, tournaments, and live-leaderboard fixtures used across screens.
//
// Avatar color rule: each angler has a unique trio drawn from the brand palette —
//   accent  = outer rounded square
//   disc    = inner circle background  (always a LIGHT palette hue, never buff/cream)
//   discText= initials color           (a saturated palette hue, never buff or black)

const ACCENTS = ["#E46B3B", "#577147", "#296E97", "#83BAD4", "#EDC73B", "#213845"];

const ANGLERS = [
  { id: "austin-cranford", first: "Austin", last: "Cranford", initials: "AC",
    state: "Oklahoma", disciplines: ["Jerkbait", "Flippin"], tag: "Jerkbait & Flippin",
    seasonLb: 52.10, rank: 1, events: 7, bigBag: 24.86, accent: "#E46B3B", disc: "#EDC73B", discText: "#577147",
    photo: "../../assets/stock-flyfishing.jpg",
    bio: "Tulsa-raised power fisherman known for grinding shallow grass lines and a jerkbait bite most write off as finished. Three-time regional qualifier chasing a first national title." },
  { id: "marcus-vinroe", first: "Marcus", last: "Vinroe", initials: "MV",
    state: "Alabama", disciplines: ["Deep Crank", "Ledge"], tag: "Deep Crank & Ledge",
    seasonLb: 49.74, rank: 2, events: 7, bigBag: 23.10, accent: "#296E97", disc: "#83BAD4", discText: "#213845",
    photo: "../../assets/stock-boats.jpg",
    bio: "Offshore specialist who lives on his electronics and built a reputation winning when the fish pull out to the ledges in summer." },
  { id: "dana-whitfield", first: "Dana", last: "Whitfield", initials: "DW",
    state: "Texas", disciplines: ["Frog", "Punch"], tag: "Frog & Punch",
    seasonLb: 47.92, rank: 3, events: 7, bigBag: 22.40, accent: "#577147", disc: "#AFE0BA", discText: "#296E97",
    photo: "../../assets/stock-openwater.png",
    bio: "Heavy-cover hunter from East Texas. If there's matted hydrilla, Dana is punching through it while everyone else idles past." },
  { id: "cole-rasmussen", first: "Cole", last: "Rasmussen", initials: "CR",
    state: "Minnesota", disciplines: ["Smallmouth", "Drop Shot"], tag: "Smallmouth & Drop Shot",
    seasonLb: 46.18, rank: 4, events: 7, bigBag: 19.95, accent: "#83BAD4", disc: "#B9D6CD", discText: "#E46B3B",
    photo: "../../assets/stock-openwater.png",
    bio: "Northern smallmouth ace translating finesse-river instincts into a national run on unfamiliar southern lakes." },
  { id: "priya-nandakumar", first: "Priya", last: "Nandakumar", initials: "PN",
    state: "Florida", disciplines: ["Sight Fish", "Spinnerbait"], tag: "Sight Fish & Spinnerbait",
    seasonLb: 45.03, rank: 5, events: 7, bigBag: 21.72, accent: "#213845", disc: "#EDC73B", discText: "#296E97",
    photo: "../../assets/stock-flyfishing.jpg",
    bio: "Sight-fishing phenom out of the Florida grass flats with the sharpest eyes on tour and a spinnerbait she never puts down." },
  { id: "wyatt-boudreaux", first: "Wyatt", last: "Boudreaux", initials: "WB",
    state: "Louisiana", disciplines: ["Swim Jig", "Flippin"], tag: "Swim Jig & Flippin",
    seasonLb: 43.66, rank: 6, events: 7, bigBag: 20.18, accent: "#213845", disc: "#83BAD4", discText: "#577147",
    photo: "../../assets/stock-boats.jpg",
    bio: "Bayou-bred junk fisherman who can win on a swim jig in a foot of muddy water nobody else will fish." },
  { id: "harlan-pope", first: "Harlan", last: "Pope", initials: "HP",
    state: "Tennessee", disciplines: ["Topwater", "Crank"], tag: "Topwater & Crank",
    seasonLb: 42.20, rank: 7, events: 6, bigBag: 18.40, accent: "#E46B3B", disc: "#AFE0BA", discText: "#296E97",
    photo: "../../assets/stock-openwater.png",
    bio: "River-system topwater specialist who built a following throwing a walking bait when conventional wisdom says go deep." },
  { id: "sofia-marchetti", first: "Sofia", last: "Marchetti", initials: "SM",
    state: "California", disciplines: ["Finesse", "Spook"], tag: "Finesse & Spook",
    seasonLb: 40.95, rank: 8, events: 6, bigBag: 17.85, accent: "#577147", disc: "#B9D6CD", discText: "#577147",
    photo: "../../assets/stock-flyfishing.jpg",
    bio: "West-coast finesse technician carrying clear-water Delta tactics east, one drop-shot limit at a time." },
  { id: "trey-ellington", first: "Trey", last: "Ellington", initials: "TE",
    state: "Georgia", disciplines: ["Shaky Head", "Dock"], tag: "Shaky Head & Dock",
    seasonLb: 39.40, rank: 9, events: 6, bigBag: 16.90, accent: "#296E97", disc: "#EDC73B", discText: "#213845",
    photo: "../../assets/stock-boats.jpg",
    bio: "Dock-skipping dock-hopper from Lake Lanier who turned a backyard fishery into a national platform." },
];

const TOURNAMENT = {
  name: "Primetime Bass Fishing Tournament",
  short: "Primetime Bass",
  day: "DAY 2", boats: 62, lake: "Lake Guntersville, AL",
  liveViewers: 12480,
  cut: 22.40,
  weather: { temp: 74, cond: "Clear", wind: "SE 8 mph" },
  tz: "ET",
};

// live leaderboard = anglers ordered by today's running weight.
// `viewers` + `img` drive the multi-cam strip; `follow` drives the "Following" filter.
const LIVE_BOARD = [
  { id: "austin-cranford", name: "Austin Cranford", initials: "AC", boat: "B-14", state: "OK", today: 18.42, fish: 5, viewers: 12483, follow: true,  img: "../../assets/stock-boats.jpg",     accent: "#E46B3B", disc: "#EDC73B", discText: "#577147", live: true },
  { id: "dana-whitfield", name: "Dana Whitfield", initials: "DW", boat: "B-22", state: "TX", today: 17.96, fish: 5, viewers: 8120,  follow: false, img: "../../assets/stock-openwater.png", accent: "#577147", disc: "#AFE0BA", discText: "#296E97", live: true },
  { id: "marcus-vinroe", name: "Marcus Vinroe", initials: "MV", boat: "B-07", state: "AL", today: 16.30, fish: 5, viewers: 5630,  follow: true,  img: "../../assets/stock-flyfishing.jpg", accent: "#296E97", disc: "#83BAD4", discText: "#213845", live: true },
  { id: "priya-nandakumar", name: "Priya Nandakumar", initials: "PN", boat: "B-31", state: "FL", today: 15.11, fish: 4, viewers: 4310,  follow: false, img: "../../assets/stock-openwater.png", accent: "#213845", disc: "#EDC73B", discText: "#296E97", live: false },
  { id: "wyatt-boudreaux", name: "Wyatt Boudreaux", initials: "WB", boat: "B-09", state: "LA", today: 14.88, fish: 5, viewers: 3920,  follow: true,  img: "../../assets/stock-boats.jpg",     accent: "#213845", disc: "#83BAD4", discText: "#577147", live: true },
  { id: "cole-rasmussen", name: "Cole Rasmussen", initials: "CR", boat: "B-18", state: "MN", today: 13.54, fish: 4, viewers: 2740,  follow: false, img: "../../assets/stock-flyfishing.jpg", accent: "#83BAD4", disc: "#B9D6CD", discText: "#E46B3B", live: false },
  { id: "harlan-pope", name: "Harlan Pope", initials: "HP", boat: "B-03", state: "TN", today: 12.07, fish: 4, viewers: 2110,  follow: true,  img: "../../assets/stock-openwater.png", accent: "#E46B3B", disc: "#AFE0BA", discText: "#296E97", live: true },
  { id: "sofia-marchetti", name: "Sofia Marchetti", initials: "SM", boat: "B-28", state: "CA", today: 10.62, fish: 3, viewers: 1480,  follow: false, img: "../../assets/stock-flyfishing.jpg", accent: "#577147", disc: "#B9D6CD", discText: "#577147", live: false },
];

const DISCIPLINES = ["All", "Jerkbait", "Flippin", "Deep Crank", "Frog", "Smallmouth", "Topwater", "Finesse", "Swim Jig"];

Object.assign(window, { ANGLERS, TOURNAMENT, LIVE_BOARD, DISCIPLINES, ACCENTS });
