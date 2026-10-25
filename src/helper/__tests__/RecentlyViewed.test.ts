import { clearRecentlyViewed, groupRecentlyViewed, readRecentlyViewed, recordCardView, recordProductView, RECENTLY_VIEWED_KEY, RECENTLY_VIEWED_LIMIT } from '../RecentlyViewed'

const darkMagician = {
	cardID: '46986414',
	cardName: 'Dark Magician',
	cardColor: 'normal',
	cardAttribute: 'Dark',
	cardEffect: 'The ultimate wizard in terms of attack and defense.',
	monsterType: 'Spellcaster/Normal',
	monsterAttack: '2500',
	monsterDefense: '2100',
} as YGOCard.Deets

const phantomNightmare = {
	productId: 'PHNI',
	productLocale: 'EN',
	productName: 'Phantom Nightmare',
	productType: 'Pack',
	productSubType: 'Core Set',
	productReleaseDate: '2024-02-09',
	productTotal: 100,
}

const card = (cardID: string) => ({ ...darkMagician, cardID })

beforeEach(() => localStorage.clear())

test('records visits newest first with when they happened', () => {
	recordCardView(darkMagician, new Date('2026-10-01T10:00:00Z'))
	recordProductView(phantomNightmare, new Date('2026-10-02T10:00:00Z'))

	expect(readRecentlyViewed()).toEqual([
		{ kind: 'product', id: 'PHNI', name: 'Phantom Nightmare', productType: 'Pack', productSubType: 'Core Set', viewedAt: '2026-10-02T10:00:00.000Z' },
		{ kind: 'card', id: '46986414', name: 'Dark Magician', card: darkMagician, viewedAt: '2026-10-01T10:00:00.000Z' },
	])
})

test('keeps only what a card preview needs from the card page', () => {
	recordCardView({ ...darkMagician, foundIn: [], restrictedIn: { TCG: [], MD: [], DL: [] } } as YGOCard.Deets)

	expect(Object.keys((readRecentlyViewed()[0] as { card: object }).card)).not.toContain('foundIn')
})

test('moves a page seen again to the front instead of repeating it', () => {
	recordCardView(card('1'), new Date('2026-10-01T00:00:00Z'))
	recordCardView(card('2'), new Date('2026-10-02T00:00:00Z'))
	recordCardView(card('1'), new Date('2026-10-03T00:00:00Z'))

	expect(readRecentlyViewed().map(({ id, viewedAt }) => [id, viewedAt])).toEqual([
		['1', '2026-10-03T00:00:00.000Z'],
		['2', '2026-10-02T00:00:00.000Z'],
	])
})

test('keeps a card and a product that share an id apart', () => {
	recordCardView(card('PHNI'))
	recordProductView(phantomNightmare)

	expect(readRecentlyViewed()).toHaveLength(2)
})

test('keeps only the latest visits', () => {
	for (let i = 0; i < RECENTLY_VIEWED_LIMIT + 5; i++) recordCardView(card(`${i}`))

	const history = readRecentlyViewed()
	expect(history).toHaveLength(RECENTLY_VIEWED_LIMIT)
	expect(history[0].id).toBe(`${RECENTLY_VIEWED_LIMIT + 4}`)
})

test('clears the history', () => {
	recordCardView(darkMagician)
	clearRecentlyViewed()

	expect(readRecentlyViewed()).toEqual([])
})

test('reads unusable storage as an empty history', () => {
	localStorage.setItem(RECENTLY_VIEWED_KEY, 'not json')
	expect(readRecentlyViewed()).toEqual([])

	localStorage.setItem(RECENTLY_VIEWED_KEY, '{"kind":"card"}')
	expect(readRecentlyViewed()).toEqual([])

	// a card without its details can't be previewed
	localStorage.setItem(RECENTLY_VIEWED_KEY, '[{"kind":"card","id":"1","name":"x","viewedAt":"2026-10-01T00:00:00.000Z"}]')
	expect(readRecentlyViewed()).toEqual([])
})

test('groups visits under day headings with a short time', () => {
	const now = new Date(2026, 9, 25, 15, 0)
	recordCardView(card('older'), new Date(2026, 9, 10, 9, 0))
	recordCardView(card('week'), new Date(2026, 9, 20, 9, 0))
	recordCardView(card('yesterday'), new Date(2026, 9, 24, 21, 14))
	recordCardView(card('today-2'), new Date(2026, 9, 25, 8, 5))
	recordCardView(card('today'), new Date(2026, 9, 25, 14, 41))

	const groups = groupRecentlyViewed(readRecentlyViewed(), now)

	expect(groups.map(({ label, items }) => [label, items.map(({ item }) => item.id)])).toEqual([
		['Today', ['today', 'today-2']],
		['Yesterday', ['yesterday']],
		['Previous 7 days', ['week']],
		['Older', ['older']],
	])
	expect(groups[0].items[0].time).toMatch(/2:41/)
	expect(groups[2].items[0].time).toMatch(/Tue/)
	expect(groups[3].items[0].time).toMatch(/Oct 10/)
})
