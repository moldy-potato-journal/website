import { siteConfig } from "@/lib/site"

export const briefs = [
  {
    label: "Latest Release",
    title: `${siteConfig.issue} is now live`,
    body: "A compact issue on film rot, campus screenings, and notebook criticism.",
  },
  {
    label: "Call for Papers",
    title: "Submissions are open",
    body: "We welcome essays, viewing notes, and short pieces on cinema culture.",
  },
  {
    label: "Editorial Focus",
    title: "Small-scale, serious, and a little strange",
    body: "This journal prefers attentive criticism over institutional authority.",
  },
] as const

export const journalHighlights = [
  "On damp cellars and damaged reels",
  "Three arguments for the campus screening room",
  "Notebook: melodrama after midnight",
] as const

export const standaloneArticles = [
  {
    title: "Against clean restoration",
    category: "Film Analysis",
    summary:
      "A short argument for leaving visible damage, noise, and material history in the frame.",
  },
  {
    title: "The corridor shot as student cinema theology",
    category: "Student Film",
    summary:
      "On why low-budget filmmakers keep returning to hallways, thresholds, and fluorescent suspense.",
  },
  {
    title: "Viewing diary: five rainy screenings",
    category: "Film Analysis",
    summary:
      "Fragments on atmosphere, boredom, weather, and the accidental rhythms of programming.",
  },
  {
    title: "The tripod as moral problem in the first-year short",
    category: "Student Film",
    summary:
      "A note on why static framing in student productions often signals anxiety rather than control.",
  },
  {
    title: "Cafeteria realism and the mid-budget campus feature",
    category: "Student Film",
    summary:
      "How institutional interiors become an accidental style in films made with borrowed locations.",
  },
  {
    title: "Why the rehearsal take sometimes belongs in the final cut",
    category: "Student Film",
    summary:
      "On rough delivery, unfinished timing, and the documentary pressure of performance before polish.",
  },
  {
    title: "Projection booth notes after the late campus screening",
    category: "Exhibition Notes",
    summary:
      "A small record of lamp heat, misthreading, and the strange authority of whoever stays after the audience leaves.",
  },
  {
    title: "Hiss, room tone, and the ethics of cleaned dialogue",
    category: "Sound Studies",
    summary:
      "Why over-cleaned student audio can erase the environment that made a scene believable in the first place.",
  },
  {
    title: "Box labels, mildew, and the politics of minor preservation",
    category: "Archive Notes",
    summary:
      "On handwritten tape labels, damp shelving, and the practical labour behind keeping non-canonical film culture legible.",
  },
  {
    title: "Festival mornings and the first-badge feature",
    category: "Festival Notes",
    summary:
      "A note on exhausted premieres, apologetic Q-and-As, and the ambition that clings to low-budget debuts.",
  },
  {
    title: "Camcorder sunsets and the family film as accidental cinema",
    category: "Amateur Media",
    summary:
      "How domestic recordings turn weather, waiting, and repetition into forms of unplanned style.",
  },
  {
    title: "When the actor outruns the frame",
    category: "Performance",
    summary:
      "A short piece on performances that exceed the camera setup built to contain them.",
  },
  {
    title: "Notebook from the under-attended weekday screening",
    category: "Screening Reports",
    summary:
      "Sparse attendance, loud radiators, and the peculiar intimacy of watching a film with six strangers.",
  },
  {
    title: "Video essay without voiceover: a note on arrangement",
    category: "Video Essay",
    summary:
      "What happens when critical montage has to think through cuts, rhythm, and juxtaposition instead of explanatory speech.",
  },
] as const
