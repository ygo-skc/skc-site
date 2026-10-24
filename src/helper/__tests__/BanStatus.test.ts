import { banStatusClass, cardKind, cardTypeLabel, toBanStatus } from '../BanStatus'

test('reads the API status spellings', () => {
	expect(toBanStatus('Forbidden')).toBe('Forbidden')
	expect(toBanStatus('Semi-Limited')).toBe('Semi-Limited')
	expect(toBanStatus('Semi Limited')).toBe('Semi-Limited')
	expect(toBanStatus('semiLimited')).toBe('Semi-Limited')
	expect(toBanStatus('unlimited')).toBe('Unlimited')
	expect(toBanStatus('Limited One')).toBeUndefined()
})

test('names the css modifier for a status', () => {
	expect(banStatusClass('Semi-Limited')).toBe('ban-status--semi-limited')
})

test('groups cards into monsters, spells and traps', () => {
	const card = (cardColor: YGOCard.Color, monsterType?: string): YGOCard.Deets => ({ cardID: '1', cardName: 'x', cardColor, monsterType, cardEffect: '' })

	expect(cardKind(card('spell'))).toBe('Spell')
	expect(cardKind(card('trap'))).toBe('Trap')
	expect(cardKind(card('pendulum-effect'))).toBe('Monster')
	expect(cardTypeLabel(card('fusion', 'Dragon/Fusion/Effect'))).toBe('Dragon/Fusion/Effect')
	expect(cardTypeLabel(card('trap'))).toBe('Trap')
})
