import { siteConfig } from "@/lib/site"

export const contentInformation = {
    homepage: {
        frontMatter: {
            briefs: [
                {
                    label: "Latest Release",
                    title: `${siteConfig.issue} is now live`,
                    body: "A compact issue on film rot, campus screenings, and notebook criticism.",
                },
                {
                    label: "Call for Papers",
                    title: "Submissions are open",
                    body: "We welcome essays, viewing notes, and short pieces on cinema culture, especially the ones that arrived because you could not stop thinking about a screening.",
                },
                {
                    label: "Editorial Focus",
                    title: "Small-scale, serious, and a little strange",
                    body: "This journal prefers close attention over borrowed authority, and it does not mind if a good argument shows up wearing slightly muddy shoes.",
                },
            ],
            submission: {
                title: "Submit via GitHub Pull Request",
                body: "Contributors can propose new writing through pull requests to the content repository. Journal-bound pieces may be collected on dedicated journal branches before publication.",
            },
        },
    },
} as const

export const briefs = contentInformation.homepage.frontMatter.briefs

export const staticCopy = {
    homepage: {
        frontMatter: {
            title: "What is new, what is open, and where to start without wandering the halls for twenty minutes.",
            description:
                "The front page keeps the essentials in plain view: what has just been published, what we are asking for next, and where a new reader can begin with minimal fuss.",
        },
        latestJournal: {
            contentsDescription:
                "The latest issue at a glance, for readers who prefer a contents page to a dramatic entrance.",
        },
        standaloneArticles: {
            title: "Articles that refused to wait for an issue.",
            description:
                "These pieces stand on their own rather than turning up inside a journal issue. Think of them as quicker, smaller arrivals, though not necessarily smaller in opinion.",
        },
    },
    articles: {
        pageDescription:
            "Standalone articles, sorted for browsing, reading, and the occasional highly specific obsession.",
        selectedCategoryDescription:
            "Published pieces filed under this heading, gathered here for the sake of order and your patience.",
        missingCategoryDescription:
            "No published category quite matches this request. The archive is being stubborn, not personal.",
        spotlight: {
            hotArticlesTitle:
                "Good places to begin if you do not want to browse like an archivist.",
        },
        categories: {
            sectionDescription:
                "Standalone articles have their own shelving system here. It keeps the archive readable, and it also saves everyone from pretending every piece naturally belongs in an issue.",
            unavailableTitle: "Nothing is filed under this category just yet.",
            unavailableDescription:
                "Try the wider archive instead. The articles are still there; they are simply refusing this label for the moment.",
            categoryViewDescription:
                "Latest pieces filed under this heading, gathered together so you need not hunt for them one by one.",
        },
        notFound: {
            pageDescription:
                "Standalone articles, arranged for browsing, reading, and citing when a footnote simply will not leave you alone.",
            headerTitle: "The article you requested is not here.",
            headerDescription:
                "It may not have been published yet, the number may be off, or the archive has misplaced it in the very old-fashioned sense of the word.",
            recommendationsTitle: "Better to keep reading than sulk.",
            recommendationsDescription:
                "While that record is missing, these published pieces are close at hand and unlikely to disappoint the afternoon.",
        },
    },
    journals: {
        pageDescription:
            "Issue-based publications, arranged by number and gathered like proper periodicals, even when the contents are a little unruly.",
        contentsDescription:
            "The pieces gathered in this issue, listed plainly and without any ceremonial fog.",
    },
    submit: {
        pageDescription:
            "Submission guidance for standalone articles and issue-bound work, with as little mystery as we can reasonably manage.",
        cardTitle: "Submit through the content repository",
        cardDescription:
            "Contributions move through GitHub pull requests to the content repository. Standalone articles can go to the main branch; issue-bound work can gather on dedicated journal branches until everyone is ready to call it an issue.",
    },
    footer: {
        archiveMethodTitle: "Archive Method",
        archiveMethodDescription:
            "Articles and issues are published from a separate GitHub content repository rather than edited directly inside the site, which keeps the records tidier and the panic more localised.",
        editorialProcessTitle: "Editorial Process",
        discussionsDescription:
            "because even a modest film journal needs a place for arguments after the screening.",
        closingNote: "Independent publication. Read closely, disagree freely.",
    },
} as const

export const journalHighlights = [
    "On damp cellars and damaged reels",
    "Three arguments for the campus screening room",
    "Notebook: melodrama after midnight",
] as const

export const standaloneArticles = [
    {
        title: "Against clean restoration",
        category: "Film Analysis",
        contentType: "markdown",
        publishDate: "2026-03-17",
        summary:
            "A short argument for leaving visible damage, noise, and material history in the frame.",
    },
    {
        title: "The corridor shot as student cinema theology",
        category: "Student Film",
        contentType: "pdf",
        publishDate: "2026-03-18",
        summary:
            "On why low-budget filmmakers keep returning to hallways, thresholds, and fluorescent suspense.",
    },
    {
        title: "Viewing diary: five rainy screenings",
        category: "Film Analysis",
        contentType: "markdown",
        publishDate: "2026-03-19",
        summary:
            "Fragments on atmosphere, boredom, weather, and the accidental rhythms of programming.",
    },
    {
        title: "The tripod as moral problem in the first-year short",
        category: "Student Film",
        contentType: "markdown",
        publishDate: "2026-03-20",
        summary:
            "A note on why static framing in student productions often signals anxiety rather than control.",
    },
    {
        title: "Cafeteria realism and the mid-budget campus feature",
        category: "Student Film",
        contentType: "markdown",
        publishDate: "2026-03-21",
        summary:
            "How institutional interiors become an accidental style in films made with borrowed locations.",
    },
    {
        title: "Why the rehearsal take sometimes belongs in the final cut",
        category: "Student Film",
        contentType: "markdown",
        publishDate: "2026-03-22",
        summary:
            "On rough delivery, unfinished timing, and the documentary pressure of performance before polish.",
    },
    {
        title: "Projection booth notes after the late campus screening",
        category: "Exhibition Notes",
        contentType: "markdown",
        publishDate: "2026-03-23",
        summary:
            "A small record of lamp heat, misthreading, and the strange authority of whoever stays after the audience leaves.",
    },
    {
        title: "Hiss, room tone, and the ethics of cleaned dialogue",
        category: "Sound Studies",
        contentType: "markdown",
        publishDate: "2026-03-24",
        summary:
            "Why over-cleaned student audio can erase the environment that made a scene believable in the first place.",
    },
    {
        title: "Box labels, mildew, and the politics of minor preservation",
        category: "Archive Notes",
        contentType: "markdown",
        publishDate: "2026-03-25",
        summary:
            "On handwritten tape labels, damp shelving, and the practical labour behind keeping non-canonical film culture legible.",
    },
    {
        title: "Festival mornings and the first-badge feature",
        category: "Festival Notes",
        contentType: "markdown",
        publishDate: "2026-03-26",
        summary:
            "A note on exhausted premieres, apologetic Q-and-As, and the ambition that clings to low-budget debuts.",
    },
    {
        title: "Camcorder sunsets and the family film as accidental cinema",
        category: "Amateur Media",
        contentType: "markdown",
        publishDate: "2026-03-27",
        summary:
            "How domestic recordings turn weather, waiting, and repetition into forms of unplanned style.",
    },
    {
        title: "When the actor outruns the frame",
        category: "Performance",
        contentType: "markdown",
        publishDate: "2026-03-28",
        summary:
            "A short piece on performances that exceed the camera setup built to contain them.",
    },
    {
        title: "Notebook from the under-attended weekday screening",
        category: "Screening Reports",
        contentType: "markdown",
        publishDate: "2026-03-29",
        summary:
            "Sparse attendance, loud radiators, and the peculiar intimacy of watching a film with six strangers.",
    },
    {
        title: "Video essay without voiceover: a note on arrangement",
        category: "Video Essay",
        contentType: "markdown",
        publishDate: "2026-03-30",
        summary:
            "What happens when critical montage has to think through cuts, rhythm, and juxtaposition instead of explanatory speech.",
    },
    {
        title: "After the projector jam: notes from an interrupted matinee",
        category: "Exhibition Notes",
        contentType: "markdown",
        publishDate: "2026-03-31",
        summary:
            "A small account of delay, apology, and the audience behaviour that emerges when a screening briefly stops being a screening.",
    },
    {
        title: "Lav mic rustle and the fantasy of invisible recording",
        category: "Sound Studies",
        contentType: "pdf",
        publishDate: "2026-04-01",
        summary:
            "On clothing noise, close bodies, and the way low-budget dialogue recording reveals more proximity than the image does.",
    },
    {
        title: "Festival catalogue adjectives and the language of minor prestige",
        category: "Festival Notes",
        contentType: "markdown",
        publishDate: "2026-04-02",
        summary:
            "A reading of how small festivals describe difficult films when they want seriousness without scaring off the audience.",
    },
    {
        title: "Second screening notebook: ten people, one broken subtitle file",
        category: "Screening Reports",
        contentType: "markdown",
        publishDate: "2026-04-03",
        summary:
            "A brief record of awkward pauses, improvised translation, and the collective patience of a room that chooses to stay.",
    },
    {
        title: "MiniDV birthdays and the accidental theory of zooming in too late",
        category: "Amateur Media",
        contentType: "markdown",
        publishDate: "2026-04-04",
        summary:
            "How domestic camera mistakes become a style of lateness, hesitation, and emotional correction.",
    },
    {
        title: "Fog machine notes for the impossible warehouse scene",
        category: "Production Notes",
        contentType: "markdown",
        publishDate: "2026-04-05",
        summary:
            "On borrowed industrial space, cheap atmosphere, and the technical labour required to make thin resources look deliberate.",
    },
] as const
