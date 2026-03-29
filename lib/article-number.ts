const ARTICLE_NUMBER_PATTERN = /^\d{2}-\d{2,}$/

export function isValidArticleNumber(value: string) {
  return ARTICLE_NUMBER_PATTERN.test(value)
}
