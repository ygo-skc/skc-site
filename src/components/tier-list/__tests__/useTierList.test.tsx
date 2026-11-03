import { act, render, screen } from '@testing-library/react'

import useTierList from '../useTierList'
import { TIER_LIST_KEY } from '../../../helper/TierListStorage'

const card: YGOCard.Deets = { cardID: '89631139', cardName: 'Blue-Eyes White Dragon', cardColor: 'normal', cardEffect: '' }

let add: () => void

function Probe() {
	const [list, dispatch] = useTierList()
	add = () => dispatch({ type: 'add', card })
	return <span data-testid='name'>{list.name}</span>
}

beforeEach(() => localStorage.clear())

test('starts from storage and writes every change', () => {
	localStorage.setItem(TIER_LIST_KEY, JSON.stringify({ name: 'Coolest dragons', tray: [], tiers: {} }))
	render(<Probe />)
	expect(screen.getByTestId('name')).toHaveTextContent('Coolest dragons')

	act(() => add())
	expect(JSON.parse(localStorage.getItem(TIER_LIST_KEY) as string).tray).toEqual([card])
})
