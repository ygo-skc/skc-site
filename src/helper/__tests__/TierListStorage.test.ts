import { readTierList, TIER_LIST_KEY, writeTierList } from '../TierListStorage'
import { DEFAULT_NAME, emptyTierList } from '../../components/tier-list/tierListState'

const card = (id: string): YGOCard.Deets => ({ cardID: id, cardName: `Card ${id}`, cardColor: 'effect', cardEffect: 'Effect text' })

beforeEach(() => {
	localStorage.clear()
	jest.restoreAllMocks()
})

test('round trips a list', () => {
	const list = emptyTierList()
	list.name = 'Coolest dragons'
	list.tray = [card('1')]
	list.tiers.S = [card('2'), card('3')]

	writeTierList(list)
	expect(readTierList()).toEqual(list)
})

test('nothing saved is an empty list', () => {
	expect(readTierList()).toEqual(emptyTierList())
})

test('drops malformed cards and unknown tiers', () => {
	localStorage.setItem(TIER_LIST_KEY, JSON.stringify({ name: 5, tray: [{ cardName: 'x' }, card('1'), null], tiers: { S: [card('2')], A: 'oops', Z: [card('3')] } }))

	const expected = emptyTierList()
	expected.name = DEFAULT_NAME
	expected.tray = [card('1')]
	expected.tiers.S = [card('2')]
	expect(readTierList()).toEqual(expected)
})

test('drops a card that appears twice', () => {
	localStorage.setItem(TIER_LIST_KEY, JSON.stringify({ name: 'x', tray: [card('1')], tiers: { S: [card('1'), card('2')], B: [card('2')] } }))

	const list = readTierList()
	expect(list.tray.map((c) => c.cardID)).toEqual(['1'])
	expect(list.tiers.S.map((c) => c.cardID)).toEqual(['2'])
	expect(list.tiers.B).toEqual([])
})

test('returns an empty list for unparsable JSON', () => {
	localStorage.setItem(TIER_LIST_KEY, '{not json')
	expect(readTierList()).toEqual(emptyTierList())
})

test('works when localStorage throws', () => {
	jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
		throw new Error('blocked')
	})
	jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
		throw new Error('blocked')
	})

	expect(readTierList()).toEqual(emptyTierList())
	expect(() => writeTierList(emptyTierList())).not.toThrow()
})

test('drops a card missing its effect text', () => {
	localStorage.setItem(TIER_LIST_KEY, JSON.stringify({ name: 'x', tray: [], tiers: { S: [{ cardID: '1', cardName: 'x', cardColor: 'effect' }, card('2')] } }))
	expect(readTierList().tiers.S.map((c) => c.cardID)).toEqual(['2'])
})
