import { act, renderHook } from '@testing-library/react'

import useTierList from '../useTierList'
import { TIER_LIST_KEY } from '../../../helper/TierListStorage'

const card: YGOCard.Deets = { cardID: '89631139', cardName: 'Blue-Eyes White Dragon', cardColor: 'normal', cardEffect: '' }

beforeEach(() => localStorage.clear())

test('starts from storage and writes every change', () => {
	localStorage.setItem(TIER_LIST_KEY, JSON.stringify({ name: 'Coolest dragons', tray: [], tiers: {} }))
	const { result } = renderHook(() => useTierList())
	expect(result.current[0].name).toBe('Coolest dragons')

	act(() => result.current[1]({ type: 'add', card }))
	expect(JSON.parse(localStorage.getItem(TIER_LIST_KEY) as string).tray).toEqual([card])
})
