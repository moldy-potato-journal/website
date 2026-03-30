const JOURNAL_ISSUE_PATTERN = /^\d{2}-\d+$/

export function isValidJournalIssue(issue: string) {
    return JOURNAL_ISSUE_PATTERN.test(issue)
}

export function toJournalIssueCode(issue: string) {
    if (!isValidJournalIssue(issue)) {
        throw new Error(`Invalid journal issue: ${issue}`)
    }

    return `MPJ-${issue}`
}

export function compareJournalIssues(left: string, right: string) {
    const [leftYear, leftIssue] = left.split("-").map(Number)
    const [rightYear, rightIssue] = right.split("-").map(Number)

    if (leftYear !== rightYear) {
        return leftYear - rightYear
    }

    return leftIssue - rightIssue
}
