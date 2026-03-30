const ARTICLE_NUMBER_PATTERN = /^\d{2}-\d{2,}$/

export function isValidArticleNumber(value: string) {
    return ARTICLE_NUMBER_PATTERN.test(value)
}

export function compareArticleNumbers(left: string, right: string) {
    const [, leftSequence = "0"] = left.split("-")
    const [, rightSequence = "0"] = right.split("-")

    return Number(leftSequence) - Number(rightSequence)
}

export function toArticleCode(articleNumber: string) {
    if (!isValidArticleNumber(articleNumber)) {
        throw new Error(`Invalid article number: ${articleNumber}`)
    }

    return `MPA-${articleNumber}`
}
