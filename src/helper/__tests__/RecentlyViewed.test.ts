import { readRecentlyViewed, recordRecentlyViewed, RECENTLY_VIEWED_KEY, RECENTLY_VIEWED_LIMIT } from '../RecentlyViewed'

beforeEach(() => localStorage.clear())

test('records visits newest first with when they happened', () => {
	recordRecentlyViewed({ kind: 'card', id: '89631139', name: 'Blue-Eyes White Dragon', cardColor: 'normal' }, new Date('2026-10-01T10:00:00Z'))
	recordRecentlyViewed({ kind: 'product', id: 'LOB', name: 'Legend of Blue Eyes White Dragon', productType: 'Pack' }, new Date('2026-10-02T10:00:00Z'))

	expect(readRecentlyViewed()).toEqual([
		{ kind: 'product', id: 'LOB', name: 'Legend of Blue Eyes White Dragon', productType: 'Pack', viewedAt: '2026-10-02T10:00:00.000Z' },
		{ kind: 'card', id: '89631139', name: 'Blue-Eyes White Dragon', cardColor: 'normal', viewedAt: '2026-10-01T10:00:00.000Z' },
	])
})

test('moves a page seen again to the front instead of repeating it', () => {
	recordRecentlyViewed({ kind: 'card', id: '1', name: 'A', cardColor: 'effect' }, new Date('2026-10-01T00:00:00Z'))
	recordRecentlyViewed({ kind: 'card', id: '2', name: 'B', cardColor: 'spell' }, new Date('2026-10-02T00:00:00Z'))
	recordRecentlyViewed({ kind: 'card', id: '1', name: 'A', cardColor: 'effect' }, new Date('2026-10-03T00:00:00Z'))

	expect(readRecentlyViewed().map(({ id, viewedAt }) => [id, viewedAt])).toEqual([
		['1', '2026-10-03T00:00:00.000Z'],
		['2', '2026-10-02T00:00:00.000Z'],
	])
})

test('keeps a card and a product that share an id apart', () => {
	recordRecentlyViewed({ kind: 'card', id: 'X', name: 'Card', cardColor: 'trap' })
	recordRecentlyViewed({ kind: 'product', id: 'X', name: 'Product', productType: 'Deck' })

	expect(readRecentlyViewed()).toHaveLength(2)
})

test('keeps only the latest visits', () => {
	for (let i = 0; i < RECENTLY_VIEWED_LIMIT + 5; i++) recordRecentlyViewed({ kind: 'card', id: `${i}`, name: `${i}`, cardColor: 'effect' })

	const history = readRecentlyViewed()
	expect(history).toHaveLength(RECENTLY_VIEWED_LIMIT)
	expect(history[0].id).toBe(`${RECENTLY_VIEWED_LIMIT + 4}`)
})

test('reads unusable storage as an empty history', () => {
	localStorage.setItem(RECENTLY_VIEWED_KEY, 'not json')
	expect(readRecentlyViewed()).toEqual([])

	localStorage.setItem(RECENTLY_VIEWED_KEY, '{"kind":"card"}')
	expect(readRecentlyViewed()).toEqual([])
})
