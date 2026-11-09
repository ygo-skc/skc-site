import { cardEyebrow, cardGlance, relativeDays } from '../cardGlance'

const product = (productId: string, productName: string, productReleaseDate: string, rarities: string[][]) =>
	({
		productId,
		productName,
		productLocale: 'en',
		productReleaseDate,
		productContent: rarities.map((cardRarities, index) => ({ productPosition: `00${index}`, rarities: cardRarities })),
	} as unknown as YGOProduct.Info)

const noLists = { TCG: [], MD: [], DL: [] }

test('names the frame, attribute and level, rank or link rating of a monster', () => {
	const monster = { cardColor: 'Effect', cardAttribute: 'Fire', monsterAssociation: { level: 10 } } as unknown as YGOCard.Deets
	expect(cardEyebrow(monster)).toBe('Effect Monster · Fire · Level 10')
	expect(cardEyebrow({ ...monster, cardColor: 'Pendulum-Effect' } as unknown as YGOCard.Deets)).toBe('Pendulum Effect Monster · Fire · Level 10')
	expect(cardEyebrow({ ...monster, cardColor: 'Xyz', monsterAssociation: { rank: 4 } } as unknown as YGOCard.Deets)).toBe('Xyz Monster · Fire · Rank 4')
	expect(cardEyebrow({ ...monster, cardColor: 'Link', monsterAssociation: { linkRating: 3 } } as unknown as YGOCard.Deets)).toBe('Link Monster · Fire · Link 3')
})

test('calls spells and traps cards, without their attribute', () => {
	expect(cardEyebrow({ cardColor: 'Spell', cardAttribute: 'Spell' } as unknown as YGOCard.Deets)).toBe('Spell Card')
	expect(cardEyebrow({ cardColor: 'Trap', cardAttribute: 'Trap' } as unknown as YGOCard.Deets)).toBe('Trap Card')
})

test('counts each set number as a printing and each product once', () => {
	const glance = cardGlance(
		[
			product('MZMU', 'Maze of Muertos', '2026-02-20', [['Starlight Rare']]),
			product('MZMU', 'Maze of Muertos', '2026-02-20', [['Rare']]),
			product('SOI', 'Shadow of Infinity', '2006-02-18', [['Ultra Rare', 'Ultimate Rare']]),
		],
		noLists
	)

	expect(glance.printings).toBe(3)
	expect(glance.products).toBe(2)
	expect(glance.first).toEqual({ date: '2006-02-18', productName: 'Shadow of Infinity' })
	expect(glance.last).toEqual({ date: '2026-02-20', productName: 'Maze of Muertos' })
	// rarest first, each once
	expect(glance.rarities.map(({ rarity }) => rarity)).toEqual(['Starlight Rare', 'Ultimate Rare', 'Ultra Rare', 'Rare'])
})

test('lists the printings in each rarity, newest first, under every rarity a printing came in', () => {
	const glance = cardGlance(
		[product('SOI', 'Shadow of Infinity', '2006-02-18', [['Ultra Rare', 'Ultimate Rare']]), product('SDSA', 'Sacred Beasts', '2020-07-10', [['Ultra Rare']])],
		noLists
	)

	expect(glance.rarities).toEqual([
		{ rarity: 'Ultimate Rare', printings: [{ productId: 'SOI', productName: 'Shadow of Infinity', date: '2006-02-18', setNumber: 'SOI-EN000' }] },
		{
			rarity: 'Ultra Rare',
			printings: [
				{ productId: 'SDSA', productName: 'Sacred Beasts', date: '2020-07-10', setNumber: 'SDSA-EN000' },
				{ productId: 'SOI', productName: 'Shadow of Infinity', date: '2006-02-18', setNumber: 'SOI-EN000' },
			],
		},
	])
})

test('has no first or last printing for a card not printed yet', () => {
	const glance = cardGlance([], noLists)
	expect(glance.printings).toBe(0)
	expect(glance.first).toBeUndefined()
	expect(glance.last).toBeUndefined()
})

test('gives TCG and Master Duel their list count and the newest list the card was on', () => {
	const status = (banListDate: string) => ({ banListDate, cardID: '26202165', banStatus: 'Forbidden' })
	const glance = cardGlance([], { TCG: [status('2015-11-09'), status('2016-08-29'), status('2016-04-11')], MD: [], DL: [] })

	expect(glance.banLists).toEqual([
		{ format: 'TCG', lists: 3, latest: status('2016-08-29') },
		{ format: 'MD', lists: 0, latest: undefined },
	])
})

test('counts whole days from today, either way', () => {
	const today = new Date(2026, 10, 9, 15, 30)
	expect(relativeDays('2026-02-20', today)).toBe('262 days ago')
	expect(relativeDays('2006-02-18', today)).toBe('7,569 days ago')
	expect(relativeDays('2026-11-08', today)).toBe('1 day ago')
	expect(relativeDays('2026-11-09', today)).toBe('today')
	expect(relativeDays('2026-11-10', today)).toBe('in 1 day')
	expect(relativeDays('2026-12-09', today)).toBe('in 30 days')
})
