import { DEFAULT_NAME, emptyTierList, findPlace, rankedCount, TierListState, tierListReducer } from '../tierListState'

const card = (id: string): YGOCard.Deets => ({ cardID: id, cardName: `Card ${id}`, cardColor: 'effect', cardEffect: '' })
const ids = (cards: YGOCard.Deets[]) => cards.map((c) => c.cardID)

function listWith(tray: string[], tiers: Partial<Record<'S' | 'A' | 'B' | 'C' | 'D' | 'F', string[]>> = {}): TierListState {
	const list = emptyTierList()
	list.tray = tray.map(card)
	Object.entries(tiers).forEach(([tier, cards]) => (list.tiers[tier as 'S'] = cards.map(card)))
	return list
}

test('empty list has the default name and every tier', () => {
	const list = emptyTierList()
	expect(list.name).toBe(DEFAULT_NAME)
	expect(Object.keys(list.tiers)).toEqual(['S', 'A', 'B', 'C', 'D', 'F'])
	expect(list.tray).toEqual([])
})

test('add puts a new card at the end of the tray', () => {
	const list = tierListReducer(listWith(['1']), { type: 'add', card: card('2') })
	expect(ids(list.tray)).toEqual(['1', '2'])
})

test('add ignores a card already on the board or tray', () => {
	let list = tierListReducer(emptyTierList(), { type: 'add', card: card('1') })
	list = tierListReducer(list, { type: 'move', cardID: '1', to: 'S' })
	list = tierListReducer(list, { type: 'add', card: card('1') })
	list = tierListReducer(list, { type: 'add', card: card('1') })
	expect(list.tray).toEqual([])
	expect(ids(list.tiers.S)).toEqual(['1'])
})

test('move from tray to a tier at an index', () => {
	const list = tierListReducer(listWith(['1'], { A: ['2', '3'] }), { type: 'move', cardID: '1', to: 'A', index: 1 })
	expect(ids(list.tiers.A)).toEqual(['2', '1', '3'])
	expect(list.tray).toEqual([])
})

test('move within a tier to a later index', () => {
	const start = listWith([], { A: ['1', '2', '3'] })
	expect(ids(tierListReducer(start, { type: 'move', cardID: '1', to: 'A', index: 2 }).tiers.A)).toEqual(['2', '3', '1'])
	expect(ids(tierListReducer(start, { type: 'move', cardID: '1', to: 'A', index: 1 }).tiers.A)).toEqual(['2', '1', '3'])
})

test('move without an index appends', () => {
	const list = tierListReducer(listWith(['1'], { B: ['2'] }), { type: 'move', cardID: '1', to: 'B' })
	expect(ids(list.tiers.B)).toEqual(['2', '1'])
})

test('move back to the tray appends', () => {
	const list = tierListReducer(listWith(['1'], { C: ['2'] }), { type: 'move', cardID: '2', to: 'tray' })
	expect(ids(list.tray)).toEqual(['1', '2'])
	expect(list.tiers.C).toEqual([])
})

test('move of an unknown cardID returns the same state object', () => {
	const start = listWith(['1'])
	expect(tierListReducer(start, { type: 'move', cardID: 'nope', to: 'S' })).toBe(start)
})

test('remove drops the card from wherever it is', () => {
	const start = listWith(['1'], { D: ['2'] })
	expect(tierListReducer(start, { type: 'remove', cardID: '1' }).tray).toEqual([])
	expect(tierListReducer(start, { type: 'remove', cardID: '2' }).tiers.D).toEqual([])
})

test('rename keeps the text as typed', () => {
	expect(tierListReducer(emptyTierList(), { type: 'rename', name: '  Coolest dragons ' }).name).toBe('  Coolest dragons ')
})

test('reset returns an empty list', () => {
	expect(tierListReducer(listWith(['1'], { S: ['2'] }), { type: 'reset' })).toEqual(emptyTierList())
})

test('findPlace and rankedCount', () => {
	const list = listWith(['1'], { S: ['2'], F: ['3'] })
	expect(findPlace(list, '1')).toBe('tray')
	expect(findPlace(list, '3')).toBe('F')
	expect(findPlace(list, '9')).toBeUndefined()
	expect(rankedCount(list)).toBe(2)
})
