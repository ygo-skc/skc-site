import { byRarity, cardKind, contentFilterOptions, matchesFilters, matchesQuery, setNumber } from '../productFilters'

const item = (card: Partial<YGOCard.Deets>, rarities: string[], productPosition = '001'): YGOProduct.Content => ({
	productPosition,
	rarities,
	card: { cardID: card.cardName ?? 'id', cardName: 'Card', cardColor: 'effect', cardEffect: '', ...card } as YGOCard.Deets,
})

const fiend = item(
	{ cardName: 'Spirit of Yubel', cardAttribute: 'Dark', monsterType: 'Fiend/Tuner/Effect', monsterAssociation: { level: 10 } as YGOCard.MonsterAssociation },
	['Super Rare'],
	'001'
)
const xyz = item(
	{ cardName: 'Mimighoul Throne', cardColor: 'xyz', cardAttribute: 'Light', monsterType: 'Fiend/Xyz/Effect', monsterAssociation: { rank: 4 } as YGOCard.MonsterAssociation },
	['Secret Rare', 'Quarter Century Secret Rare'],
	'040'
)
const spell = item({ cardName: 'Nightmare Pain', cardColor: 'spell', cardAttribute: 'Spell', cardEffect: 'Add 1 Yubel' }, ['Common'], '060')

test('offers only what the set has, rarities rarest first', () => {
	const options = contentFilterOptions([spell, xyz, fiend])

	expect(options.filter((option) => option.name === 'rarities').map((option) => option.value)).toEqual(['Quarter Century Secret Rare', 'Secret Rare', 'Super Rare', 'Common'])
	// spells carry "Spell" as their attribute - only monsters' attributes are offered
	expect(options.filter((option) => option.name === 'attributes').map((option) => option.value)).toEqual(['Dark', 'Light'])
	expect(options.filter((option) => option.name === 'monsterTypes').map((option) => option.value)).toEqual(['Fiend'])
	// the frame words are card types, so only real sub types are left
	expect(options.filter((option) => option.name === 'monsterSubTypes').map((option) => option.value)).toEqual(['Tuner'])
	expect(options.filter((option) => ['levels', 'ranks'].includes(option.name)).map((option) => option.value)).toEqual(['Level 10', 'Rank 4'])
})

test('widens within a group and narrows across groups', () => {
	const dark = { name: 'attributes', value: 'Dark' }
	const light = { name: 'attributes', value: 'Light' }
	const secret = { name: 'rarities', value: 'Secret Rare' }

	expect([fiend, xyz, spell].filter((entry) => matchesFilters(entry, []))).toHaveLength(3)
	expect([fiend, xyz, spell].filter((entry) => matchesFilters(entry, [dark, light]))).toEqual([fiend, xyz])
	expect([fiend, xyz, spell].filter((entry) => matchesFilters(entry, [dark, secret]))).toEqual([])
	// levels and ranks share a pill, so either matches
	expect(
		[fiend, xyz].filter((entry) =>
			matchesFilters(entry, [
				{ name: 'levels', value: 'Level 10' },
				{ name: 'ranks', value: 'Rank 4' },
			])
		)
	).toEqual([fiend, xyz])
})

test('searches names, set numbers and effects', () => {
	const product = { productId: 'PHNI', productLocale: 'EN' }
	expect(setNumber(product, xyz)).toBe('PHNI-EN040')

	expect(matchesQuery(fiend, setNumber(product, fiend), 'yubel')).toBe(true)
	expect(matchesQuery(xyz, setNumber(product, xyz), 'en040')).toBe(true)
	expect(matchesQuery(spell, setNumber(product, spell), 'add 1')).toBe(true)
	expect(matchesQuery(spell, setNumber(product, spell), 'dragon')).toBe(false)
})

test('sorts unknown rarities after the known ones and tells spells and traps from monsters', () => {
	expect(['Common', 'Mosaic Rare', 'Ultra Rare'].sort(byRarity)).toEqual(['Ultra Rare', 'Common', 'Mosaic Rare'])
	expect([fiend, spell].map((entry) => cardKind(entry.card))).toEqual(['Monster', 'Spell'])
})
