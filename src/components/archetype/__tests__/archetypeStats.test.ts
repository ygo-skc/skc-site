import { archetypeStats, deckOf } from '../archetypeStats'

const monster = (cardName: string, cardColor: string, cardAttribute: string, monsterType: string, attack?: number, defense?: number) =>
	({ cardID: cardName, cardName, cardColor, cardAttribute, cardEffect: '', monsterType, monsterAttack: attack, monsterDefense: defense } as unknown as YGOCard.Deets)

const card = (cardName: string, cardColor: string) => ({ cardID: cardName, cardName, cardColor, cardAttribute: cardColor, cardEffect: '' } as unknown as YGOCard.Deets)

// the API sends frame colours capitalised, ATK / DEF as numbers, and leaves out "?" stats and a link's DEF
const cards = [
	monster('Elemental HERO Neos', 'Normal', 'Light', 'Warrior/Normal', 2500, 2000),
	monster('Elemental HERO Stratos', 'Effect', 'Wind', 'Warrior/Effect', 1800, 300),
	monster('Destiny HERO - Dreadmaster', 'Effect', 'Dark', 'Warrior/Effect'),
	monster('Elemental HERO Heat', 'Effect', 'Fire', 'Pyro/Effect', 1600, 1200),
	monster('Elemental HERO Cosmo Neos', 'Fusion', 'Light', 'Warrior/Fusion/Effect', 3500, 3000),
	monster('Xtra HERO Wonder Driver', 'Link', 'Light', 'Warrior/Link/Effect', 1900),
	card('Mask Change', 'Spell'),
	card('Favorite Contact', 'Trap'),
]

test('totals, and how many monsters have a fixed ATK', () => {
	const stats = archetypeStats(cards)

	expect(stats).toMatchObject({ cards: 8, monsters: 6, spellsAndTraps: 2, withAttack: 5 })
})

test('counts are most first, then by name', () => {
	const stats = archetypeStats(cards)

	expect(stats.cardTypes[0]).toEqual({ name: 'Effect', count: 3 })
	expect(stats.attributes).toEqual([
		{ name: 'Light', count: 3 },
		{ name: 'Dark', count: 1 },
		{ name: 'Fire', count: 1 },
		{ name: 'Wind', count: 1 },
	])
	expect(stats.monsterTypes).toEqual([
		{ name: 'Warrior', count: 5 },
		{ name: 'Pyro', count: 1 },
	])
})

test('cards sit in the main deck, the extra deck or with the spells and traps', () => {
	expect(archetypeStats(cards).decks).toEqual([
		{
			deck: 'Main Deck',
			count: 4,
			frames: [
				{ name: 'Effect', count: 3 },
				{ name: 'Normal', count: 1 },
			],
		},
		{
			deck: 'Extra Deck',
			count: 2,
			frames: [
				{ name: 'Fusion', count: 1 },
				{ name: 'Link', count: 1 },
			],
		},
		{
			deck: 'Spells & Traps',
			count: 2,
			frames: [
				{ name: 'Spell', count: 1 },
				{ name: 'Trap', count: 1 },
			],
		},
	])
	// pendulum extra deck frames start in the extra deck, pendulum main deck ones in the main
	expect(deckOf(monster('Odd-Eyes Arc Pendulum Dragon', 'Pendulum-Effect', 'Dark', 'Dragon/Pendulum/Effect', 2700, 2000))).toBe('Main Deck')
	expect(deckOf(monster('Odd-Eyes Vortex Dragon', 'Pendulum-Synchro', 'Dark', 'Dragon/Synchro/Pendulum/Effect', 2500, 3000))).toBe('Extra Deck')
})

test('the ATK spread is in ranges of 500 and the last range takes everything above it', () => {
	const spread = archetypeStats(cards).attackSpread

	expect(spread.map((bucket) => bucket.label)).toEqual(['0–499', '500–999', '1,000–1,499', '1,500–1,999', '2,000–2,499', '2,500–2,999', '3,000–3,499', '3,500+'])
	expect(spread.map((bucket) => bucket.count)).toEqual([0, 0, 0, 3, 0, 1, 0, 1])
})

test('highest ATK / DEF skip monsters without the stat', () => {
	const stats = archetypeStats(cards)

	expect(stats.highestAttack.map((card) => card.cardName)).toEqual([
		'Elemental HERO Cosmo Neos',
		'Elemental HERO Neos',
		'Xtra HERO Wonder Driver',
		'Elemental HERO Stratos',
		'Elemental HERO Heat',
	])
	expect(stats.highestDefense.map((card) => card.cardName)).toEqual(['Elemental HERO Cosmo Neos', 'Elemental HERO Neos', 'Elemental HERO Heat', 'Elemental HERO Stratos'])
})

test('an archetype with no cards has nothing to count', () => {
	expect(archetypeStats([])).toMatchObject({ cards: 0, withAttack: 0, highestAttack: [] })
})
