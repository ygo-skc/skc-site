import { fireEvent, render, screen, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'

import CardBrowseFilters from '../CardBrowseFilters'
import MuiTheme from '../../../MuiTheme'

jest.mock('skc-rcl', () => ({ YGOCardColorIndicator: () => null }))

const monsterTypes = ['Aqua', 'Beast', 'Cyberse', 'Dinosaur', 'Dragon', 'Fairy', 'Fiend', 'Fish', 'Insect', 'Machine', 'Plant', 'Psychic', 'Pyro', 'Zombie']

const renderFilters = (options: YGOData.CardBrowseValues[]) =>
	render(
		<ThemeProvider theme={MuiTheme}>
			<CardBrowseFilters options={options} selectedCriteria={[]} onChange={() => {}} />
		</ThemeProvider>
	)

test('long option lists get a field to find one', () => {
	renderFilters([{ name: 'attributes', value: 'Dark' }, ...monsterTypes.map((value) => ({ name: 'monsterTypes', value }))])

	fireEvent.click(screen.getByRole('button', { name: 'Monster type' }))
	const popover = screen.getByRole('dialog', { name: 'Monster type' })
	fireEvent.change(within(popover).getByRole('searchbox', { name: 'Find a monster type' }), { target: { value: 'fi' } })
	expect(
		within(popover)
			.getAllByRole('button', { pressed: false })
			.map((chip) => chip.textContent)
	).toEqual(['Fiend', 'Fish'])

	fireEvent.change(within(popover).getByRole('searchbox', { name: 'Find a monster type' }), { target: { value: 'wyrm' } })
	expect(within(popover).getByText(/No monster type matches/)).toBeInTheDocument()
})

test('every pill shows while the options load, so the row keeps its height', () => {
	renderFilters([])

	expect(screen.getAllByRole('button').map((pill) => pill.textContent)).toEqual(['Card type', 'Attribute', 'Monster type', 'Level / Rank / Link', 'Sub type'])
})

test('short lists have no find field, and pills with nothing to pick are left out', () => {
	renderFilters([{ name: 'attributes', value: 'Dark' }])

	expect(screen.queryByRole('button', { name: 'Monster type' })).not.toBeInTheDocument()
	fireEvent.click(screen.getByRole('button', { name: 'Attribute' }))
	expect(within(screen.getByRole('dialog', { name: 'Attribute' })).queryByRole('searchbox')).not.toBeInTheDocument()
})
