import parseCriteriaQuery, { CriteriaSuggestion } from '../parseCriteriaQuery'

const group = (name: string, values: string[]) => values.map((value) => ({ name, value }))

const options = [
	...group('cardColors', ['Effect', 'Link', 'Pendulum-Effect', 'Synchro', 'Xyz']),
	...group('attributes', ['Dark', 'Fire', 'Light']),
	...group('monsterTypes', ['Beast', 'Beast-Warrior', 'Dragon', 'Sea Serpent', 'Warrior', 'Winged Beast']),
	...group('monsterSubTypes', ['Spirit', 'Tuner']),
	...group('levels', ['Level 4', 'Level 8']),
	...group('ranks', ['Rank 4']),
	...group('linkRatings', ['Link Rating 2']),
]

const values = (suggestion?: CriteriaSuggestion) => {
	if (suggestion?.kind === 'all') return suggestion.criteria.map((criteria) => criteria.value)
	if (suggestion?.kind === 'one') return [suggestion.criteria.value]
	return suggestion?.words
}

test('finds every criteria a phrase names, offering them all at once and one by one', () => {
	const [all, ...rest] = parseCriteriaQuery('light dragon lv 4 tuner', options, [])

	expect(all.kind).toBe('all')
	expect(values(all)).toEqual(['Light', 'Dragon', 'Level 4', 'Tuner'])
	expect(rest.map(values)).toEqual([['Light'], ['Dragon'], ['Level 4'], ['Tuner']])
})

test('understands short forms, plurals and multi word names', () => {
	expect(values(parseCriteriaQuery('xyz rank 4', options, [])[0])).toEqual(['Xyz', 'Rank 4'])
	expect(values(parseCriteriaQuery('lvl8 dragons', options, [])[0])).toEqual(['Level 8', 'Dragon'])
	expect(values(parseCriteriaQuery('sea serpent fire', options, [])[0])).toEqual(['Sea Serpent', 'Fire'])
	expect(values(parseCriteriaQuery('beast-warrior', options, [])[0])).toEqual(['Beast-Warrior'])
})

test('reads "link" with a number as a link rating and alone as the card type', () => {
	expect(values(parseCriteriaQuery('link 2', options, [])[0])).toEqual(['Link Rating 2'])
	expect(values(parseCriteriaQuery('dark link ', options, [])[0])).toEqual(['Dark', 'Link'])
})

test('offers what a word still being typed starts', () => {
	expect(parseCriteriaQuery('dark war', options, []).map(values)).toEqual([['Dark'], ['Beast-Warrior'], ['Warrior']])
	expect(parseCriteriaQuery('winged be', options, []).map(values)).toEqual([['Winged Beast']])
})

test('leaves out picked criteria and reports words that match nothing', () => {
	const suggestions = parseCriteriaQuery('dark dragon blorp ', options, [{ name: 'attributes', value: 'Dark' }])

	expect(suggestions).toEqual([
		{ kind: 'one', criteria: { name: 'monsterTypes', value: 'Dragon' } },
		{ kind: 'unknown', words: ['blorp'] },
	])
})

test('suggests nothing for an empty field', () => {
	expect(parseCriteriaQuery('  ', options, [])).toEqual([])
})
