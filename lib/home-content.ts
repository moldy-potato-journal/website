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
            title: "Published standalone articles.",
            description:
                "These pieces are published independently of the journal issues and remain part of the main archive as standalone works.",
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
        description:
            "A short argument for leaving visible damage, noise, and material history in the frame.",
        abstract:
            "This article argues that the visible damage of a print should not always be treated as a defect to be erased. Scratches, instability, and noise can also function as records of circulation, storage, handling, and neglect, giving the image a material history that clean restoration sometimes flattens into a falsely timeless surface.",
    },
    {
        title: "The corridor shot as student cinema theology",
        category: "Student Film",
        contentType: "pdf",
        publishDate: "2026-03-18",
        description:
            "On why low-budget filmmakers keep returning to hallways, thresholds, and fluorescent suspense.",
        abstract:
            "This piece examines the corridor as one of the most persistent spaces in student and low-budget filmmaking. It suggests that hallways, thresholds, and badly lit institutional interiors return so often not only because they are available, but because they naturally stage hesitation, surveillance, delay, and the promise that something important might be waiting just outside the frame.",
    },
    {
        title: "Viewing diary: five rainy screenings",
        category: "Film Analysis",
        contentType: "markdown",
        publishDate: "2026-03-19",
        description:
            "Fragments on atmosphere, boredom, weather, and the accidental rhythms of programming.",
        abstract:
            "Written as a sequence of linked viewing notes, this article tracks how rain, scheduling, sparse attendance, and fatigue reshape the experience of cinema across five screenings. Rather than isolating the films from their conditions of exhibition, it treats boredom, atmosphere, and weather as part of the texture through which meaning is made.",
    },
    {
        title: "The tripod as moral problem in the first-year short",
        category: "Student Film",
        contentType: "markdown",
        publishDate: "2026-03-20",
        description:
            "A note on why static framing in student productions often signals anxiety rather than control.",
        abstract:
            "This article reconsiders the tripod-heavy image in early student film work, arguing that stillness often reflects caution before it reflects compositional confidence. What appears to be restraint may instead register fear of error, a pedagogical preference for safety, and an unspoken belief that movement risks amateurism more than inertia does.",
    },
    {
        title: "Cafeteria realism and the mid-budget campus feature",
        category: "Student Film",
        contentType: "markdown",
        publishDate: "2026-03-21",
        description:
            "How institutional interiors become an accidental style in films made with borrowed locations.",
        abstract:
            "Focusing on cafeterias, lecture rooms, and corridor junctions, this piece explores how campus interiors become a recurring visual system in films built from borrowed space. It argues that these locations do more than solve production problems: they generate their own textures of fluorescent realism, administrative melancholy, and unintended formal consistency.",
    },
    {
        title: "Why the rehearsal take sometimes belongs in the final cut",
        category: "Student Film",
        contentType: "markdown",
        publishDate: "2026-03-22",
        description:
            "On rough delivery, unfinished timing, and the documentary pressure of performance before polish.",
        abstract:
            "This article argues for the aesthetic value of rehearsal takes that retain uncertainty, bad timing, and incomplete polish. It suggests that such performances often preserve a documentary pressure that more finished takes smooth away, making visible the process of risk, adjustment, and mutual calibration between actor and camera.",
    },
    {
        title: "Projection booth notes after the late campus screening",
        category: "Exhibition Notes",
        contentType: "markdown",
        publishDate: "2026-03-23",
        description:
            "A small record of lamp heat, misthreading, and the strange authority of whoever stays after the audience leaves.",
        abstract:
            "Part technical note and part exhibition diary, this article records the overlooked labour of late campus projection: lamp heat, misthreaded reels, booth chatter, and after-screening explanations. It treats the projection booth as a space where institutional maintenance and interpretive authority briefly overlap after the audience has already gone home.",
    },
    {
        title: "Hiss, room tone, and the ethics of cleaned dialogue",
        category: "Sound Studies",
        contentType: "markdown",
        publishDate: "2026-03-24",
        description:
            "Why over-cleaned student audio can erase the environment that made a scene believable in the first place.",
        abstract:
            "This piece examines the post-production habit of aggressively cleaning dialogue in student films. It argues that removing hiss, room tone, and environmental leakage can produce clarity at the cost of atmosphere, stripping scenes of the acoustic evidence that once made bodies, rooms, and proximity feel convincing.",
    },
    {
        title: "Box labels, mildew, and the politics of minor preservation",
        category: "Archive Notes",
        contentType: "markdown",
        publishDate: "2026-03-25",
        description:
            "On handwritten tape labels, damp shelving, and the practical labour behind keeping non-canonical film culture legible.",
        abstract:
            "This article turns to the minor archive: badly labelled boxes, mildew-prone storage, and the improvised systems that keep non-canonical film materials retrievable. It argues that preservation is often less a matter of prestige than of repeated practical labour, where legibility depends on modest routines rather than heroic institutional narratives.",
    },
    {
        title: "Festival mornings and the first-badge feature",
        category: "Festival Notes",
        contentType: "markdown",
        publishDate: "2026-03-26",
        description:
            "A note on exhausted premieres, apologetic Q-and-As, and the ambition that clings to low-budget debuts.",
        abstract:
            "This piece studies the social texture of low-budget debuts in festival circulation, especially the first-badge feature screened to weary morning audiences. It considers how exhausted premieres, apologetic Q-and-As, and inflated catalogue language together produce a fragile atmosphere in which artistic ambition and institutional modesty remain tightly knotted.",
    },
    {
        title: "Camcorder sunsets and the family film as accidental cinema",
        category: "Amateur Media",
        contentType: "markdown",
        publishDate: "2026-03-27",
        description:
            "How domestic recordings turn weather, waiting, and repetition into forms of unplanned style.",
        abstract:
            "Looking at domestic camcorder footage, this article argues that family recordings often generate style by accident rather than design. Through repetition, waiting, zoom hesitation, and the stubborn persistence of weather, the home movie becomes a record not only of events but of the temporal drift surrounding them.",
    },
    {
        title: "When the actor outruns the frame",
        category: "Performance",
        contentType: "markdown",
        publishDate: "2026-03-28",
        description:
            "A short piece on performances that exceed the camera setup built to contain them.",
        abstract:
            "This article focuses on performances that exceed the frame prepared to contain them, especially in low-resource productions where coverage is thin and blocking is rigid. It argues that these moments reveal a productive mismatch between acting energy and visual design, exposing the limits of the setup as clearly as the force of the performer.",
    },
    {
        title: "Notebook from the under-attended weekday screening",
        category: "Screening Reports",
        contentType: "markdown",
        publishDate: "2026-03-29",
        description:
            "Sparse attendance, loud radiators, and the peculiar intimacy of watching a film with six strangers.",
        abstract:
            "Structured as a screening notebook, this article reflects on the altered social and sensory conditions of a weekday showing attended by only a handful of viewers. Loud radiators, empty seats, and heightened awareness of every cough or movement become part of the event, producing an intimacy that changes how the film is perceived and remembered.",
    },
    {
        title: "Video essay without voiceover: a note on arrangement",
        category: "Video Essay",
        contentType: "markdown",
        publishDate: "2026-03-30",
        description:
            "What happens when critical montage has to think through cuts, rhythm, and juxtaposition instead of explanatory speech.",
        abstract:
            "This article considers the video essay that refuses voiceover and therefore must construct argument through arrangement alone. It proposes that critical montage can think by means of rhythm, repetition, and juxtaposition, forcing interpretation to emerge from formal pressure rather than from explanatory commentary delivered over the image.",
    },
    {
        title: "After the projector jam: notes from an interrupted matinee",
        category: "Exhibition Notes",
        contentType: "markdown",
        publishDate: "2026-03-31",
        description:
            "A small account of delay, apology, and the audience behaviour that emerges when a screening briefly stops being a screening.",
        abstract:
            "Using a projector jam as its central event, this article studies what happens when exhibition temporarily fails and the audience is forced into visible waiting. It argues that interruption reveals the social infrastructure of the screening itself, exposing etiquette, embarrassment, patience, and improvised collective behaviour usually hidden by smooth projection.",
    },
    {
        title: "Lav mic rustle and the fantasy of invisible recording",
        category: "Sound Studies",
        contentType: "pdf",
        publishDate: "2026-04-01",
        description:
            "On clothing noise, close bodies, and the way low-budget dialogue recording reveals more proximity than the image does.",
        abstract:
            "This article addresses lavalier microphone rustle and related forms of unwanted closeness in low-budget dialogue recording. Rather than treating such noise as mere technical failure, it argues that these sounds reveal bodily proximity, wardrobe texture, and spatial intimacy with a precision the image often cannot match.",
    },
    {
        title: "Festival catalogue adjectives and the language of minor prestige",
        category: "Festival Notes",
        contentType: "markdown",
        publishDate: "2026-04-02",
        description:
            "A reading of how small festivals describe difficult films when they want seriousness without scaring off the audience.",
        abstract:
            "This piece analyses the descriptive language of small festival catalogues, especially the adjectives used to present difficult or austere work as prestigious but approachable. It suggests that such writing performs a delicate balancing act, signalling seriousness without alienating audiences who might otherwise decide they are about to have a difficult evening.",
    },
    {
        title: "Second screening notebook: ten people, one broken subtitle file",
        category: "Screening Reports",
        contentType: "markdown",
        publishDate: "2026-04-03",
        description:
            "A brief record of awkward pauses, improvised translation, and the collective patience of a room that chooses to stay.",
        abstract:
            "This article documents a screening damaged by subtitle failure and follows the improvised forms of collective spectatorship that emerged in response. Awkward pauses, whispered translations, and shared tolerance become central to the event, turning a technical problem into a test of how much communal labour an audience will voluntarily provide.",
    },
    {
        title: "MiniDV birthdays and the accidental theory of zooming in too late",
        category: "Amateur Media",
        contentType: "markdown",
        publishDate: "2026-04-04",
        description:
            "How domestic camera mistakes become a style of lateness, hesitation, and emotional correction.",
        abstract:
            "Focusing on the late or mistimed zoom in domestic MiniDV footage, this article argues that camera error often records attention in the act of catching up with feeling. Such moments transform technical delay into a recognisable style of hesitation, correction, and belated emotional emphasis.",
    },
    {
        title: "Fog machine notes for the impossible warehouse scene",
        category: "Production Notes",
        contentType: "markdown",
        publishDate: "2026-04-05",
        description:
            "On borrowed industrial space, cheap atmosphere, and the technical labour required to make thin resources look deliberate.",
        abstract:
            "This article examines the low-budget warehouse scene as a site where atmosphere is manufactured to compensate for limited means. Through notes on fog machines, borrowed industrial space, and controlled obscurity, it argues that technical labour often works not to eliminate scarcity but to make scarcity appear intentional and visually coherent.",
    },
] as const
