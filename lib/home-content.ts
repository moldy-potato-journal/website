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
