// what each criteria group from the browse criteria endpoint is called on screen
export const criteriaGroupLabel: Record<string, string> = {
	cardColors: 'Card type',
	attributes: 'Attribute',
	monsterTypes: 'Monster type',
	monsterSubTypes: 'Sub type',
	levels: 'Level',
	ranks: 'Rank',
	linkRatings: 'Link rating',
}

export type CriteriaSuggestion =
	| { kind: 'all'; criteria: YGOData.CardBrowseValues[] }
	| { kind: 'one'; criteria: YGOData.CardBrowseValues }
	| { kind: 'unknown'; words: string[] }

const MAX_PARTIAL_MATCHES = 8

// short forms people type for the numbered criteria
const ALIASES: Record<string, string> = { lv: 'level', lvl: 'level', rk: 'rank', lr: 'link rating' }

// lower case words, with hyphens and slashes as spaces and numbers split off their prefix ("lv4" -> "lv 4")
const normalize = (text: string) =>
	text
		.toLowerCase()
		.replace(/[-_/]/g, ' ')
		.replace(/([a-z])(\d)/g, '$1 $2')
		.split(/\s+/)
		.filter(Boolean)
		.flatMap((word) => (ALIASES[word] ?? word).split(' '))

const isSame = (a: YGOData.CardBrowseValues, b: YGOData.CardBrowseValues) => a.name === b.name && a.value === b.value

/*
 * turns what's typed into the field into the criteria it names - "light dragon lv 4 tuner" -> Light, Dragon, Level 4, Tuner. words are matched
 * whole (up to three at a time, so "sea serpent" works, and a plural "dragons" matches Dragon); "link 2" is a link rating while "link" alone
 * is the card type. a last word still being typed offers the criteria it starts. picked criteria are left out, and words that match nothing
 * come back so the field can say so
 */
export default function parseCriteriaQuery(query: string, options: YGOData.CardBrowseValues[], picked: YGOData.CardBrowseValues[]): CriteriaSuggestion[] {
	const words = normalize(query)
	if (words.length === 0) return []

	const phrases = options.map((option) => ({ option, phrase: normalize(option.value).join(' ') }))
	const find = (phrase: string) => phrases.find((candidate) => candidate.phrase === phrase || candidate.phrase === phrase.replace(/s$/, ''))?.option

	const matched: YGOData.CardBrowseValues[] = []
	const unknown: string[] = []
	for (let i = 0; i < words.length; ) {
		// "link 2" is shorthand for "link rating 2"
		if (words[i] === 'link' && /^\d+$/.test(words[i + 1] ?? '')) {
			const option = find(`link rating ${words[i + 1]}`)
			if (option) {
				matched.push(option)
				i += 2
				continue
			}
		}

		const span = [3, 2, 1].find((length) => i + length <= words.length && find(words.slice(i, i + length).join(' ')))
		if (span) {
			matched.push(find(words.slice(i, i + span).join(' '))!)
			i += span
		} else {
			unknown.push(words[i])
			i++
		}
	}

	// the last words, if they didn't match whole and the query doesn't end in a space, are still being typed - offer what they start
	let partial: YGOData.CardBrowseValues[] = []
	if (!/\s$/.test(query) && unknown.length > 0 && unknown[unknown.length - 1] === words[words.length - 1]) {
		for (const length of [3, 2, 1]) {
			const tail = unknown.slice(-length)
			if (tail.length < length) continue

			const start = tail.join(' ')
			const found = phrases.filter(({ phrase }) => phrase.startsWith(start) || phrase.includes(` ${start}`)).map(({ option }) => option)
			if (found.length > 0) {
				partial = found
				unknown.splice(-length)
				break
			}
		}
	}

	const isNew = (option: YGOData.CardBrowseValues, index: number, list: YGOData.CardBrowseValues[]) =>
		!picked.some((pick) => isSame(pick, option)) && list.findIndex((other) => isSame(other, option)) === index
	const toAdd = matched.filter(isNew)
	const offered = partial.filter((option) => !toAdd.some((match) => isSame(match, option))).filter(isNew).slice(0, MAX_PARTIAL_MATCHES)

	return [
		...(toAdd.length > 1 ? [{ kind: 'all' as const, criteria: toAdd }] : []),
		...toAdd.map((criteria) => ({ kind: 'one' as const, criteria })),
		...offered.map((criteria) => ({ kind: 'one' as const, criteria })),
		...(unknown.length > 0 ? [{ kind: 'unknown' as const, words: unknown }] : []),
	]
}
