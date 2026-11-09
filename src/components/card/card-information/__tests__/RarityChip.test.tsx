import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

import RarityChip from '../RarityChip'
import MuiTheme from '../../../MuiTheme'

const printings = [
	{ productId: 'MZMU', productName: 'Maze of Muertos', date: '2026-02-20', setNumber: 'MZMU-EN074' },
	{ productId: 'SOI', productName: 'Shadow of Infinity', date: '2006-02-18', setNumber: 'SOI-EN001' },
]

const renderChip = () =>
	render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<RarityChip rarity='Ultra Rare' printings={printings} />
			</MemoryRouter>
		</ThemeProvider>
	)

// the open menu is modal, so it hides the page (the chip with it) from the accessibility tree
const chip = () => screen.getByRole('button', { name: 'Ultra Rare', hidden: true })

test('hovering the chip opens nothing', () => {
	renderChip()
	fireEvent.mouseEnter(chip())
	expect(screen.queryByRole('menu')).not.toBeInTheDocument()
	expect(chip()).toHaveAttribute('aria-expanded', 'false')
})

test('clicking the chip opens a menu of the printings in that rarity, each linking to its product', () => {
	renderChip()

	fireEvent.click(chip())

	expect(chip()).toHaveAttribute('aria-expanded', 'true')
	const menu = screen.getByRole('menu', { name: 'Ultra Rare printings' })
	expect(menu).toHaveTextContent('Ultra Rare · 2 printings')
	expect(screen.getByRole('menuitem', { name: /Maze of Muertos/ })).toHaveAttribute('href', '/product/MZMU')
	expect(screen.getByRole('menuitem', { name: /Shadow of Infinity/ })).toHaveTextContent('SOI-EN001 · Feb 18, 2006')
})

test('Escape closes the menu', () => {
	renderChip()
	fireEvent.click(chip())

	fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })

	expect(chip()).toHaveAttribute('aria-expanded', 'false')
})
