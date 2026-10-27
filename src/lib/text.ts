/** Minúsculas e sem acentos, para busca que ignora caixa e acentuação. */
export function normalize(value: string) {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

export function matches(query: string, fields: (string | undefined)[]) {
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  if (!terms.length) return true
  const haystack = normalize(fields.filter(Boolean).join(' '))
  return terms.every((term) => haystack.includes(term))
}
