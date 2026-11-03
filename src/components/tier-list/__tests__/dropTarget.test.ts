import { dragPreview, dropTarget, landing, placeId } from '../dropTarget'
import { emptyTierList } from '../tierListState'

const card = (id: string): YGOCard.Deets => ({ cardID: id, cardName: `Card ${id}`, cardColor: 'effect', cardEffect: '' })

const list = emptyTierList()
list.tray = [card('1')]
list.tiers.A = [card('2'), card('3')]

test('container ids name their place', () => {
	expect(placeId('A')).toBe('place:A')
	expect(placeId('tray')).toBe('place:tray')
})

test('over a container appends', () => {
	expect(dropTarget(list, 'place:A')).toEqual({ to: 'A' })
	expect(dropTarget(list, 'place:F')).toEqual({ to: 'F' })
})

test('over the tray', () => {
	expect(dropTarget(list, 'place:tray')).toEqual({ to: 'tray' })
	expect(dropTarget(list, '1')).toEqual({ to: 'tray' })
})

test('over a card takes its place and index', () => {
	expect(dropTarget(list, '3')).toEqual({ to: 'A', index: 1 })
})

describe('dragPreview', () => {
	test('over another tier, the card takes the spot it is over or goes to the end', () => {
		expect(dragPreview(list, '1', '3').tiers.A.map((c) => c.cardID)).toEqual(['2', '1', '3'])
		expect(dragPreview(list, '2', 'place:F').tiers.F.map((c) => c.cardID)).toEqual(['2'])
	})

	test('over the tray, a tier card goes back to it', () => {
		const shown = dragPreview(list, '3', 'place:tray')
		expect(shown.tray.map((c) => c.cardID)).toEqual(['1', '3'])
		expect(shown.tiers.A.map((c) => c.cardID)).toEqual(['2'])
	})

	test('within its own place nothing changes, since dnd-kit shuffles it', () => {
		expect(dragPreview(list, '2', '3')).toBe(list)
		expect(dragPreview(list, '2', 'place:A')).toBe(list)
		expect(dragPreview(list, '1', 'place:tray')).toBe(list)
	})
})

describe('landing', () => {
	const spot = { to: 'A', index: 1 } as const

	test('over another place, it goes there', () => {
		expect(landing(list, '2', 'place:F', spot)).toEqual({ to: 'F' })
		expect(landing(list, '1', '3', undefined)).toEqual({ to: 'A', index: 1 })
	})

	test('within the place it is shown in, it stays on the spot it was shuffled to', () => {
		expect(landing(list, '2', '2', spot)).toEqual(spot)
		expect(landing(list, '2', undefined, spot)).toEqual(spot)
		expect(landing(list, '2', 'place:A', spot)).toEqual(spot)
	})

	test('shown in a tier without a shuffle, it keeps the spot the preview gave it', () => {
		const shown = dragPreview(list, '1', '3')
		expect(landing(shown, '1', '1', undefined)).toEqual({ to: 'A', index: 1 })
	})

	test('a card shown in the tray goes to the tray', () => {
		expect(landing(list, '1', undefined, undefined)).toEqual({ to: 'tray' })
	})
})

test('unknown id', () => {
	expect(dropTarget(list, 'place:Z')).toBeUndefined()
	expect(dropTarget(list, '99')).toBeUndefined()
})
