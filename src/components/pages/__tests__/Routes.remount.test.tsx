import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'

/*
 * CardInformation and ProductInformation seed their reducer from a route param, and useReducer only
 * reads its initial state on the first render. Navigating /card/A -> /card/B stays on the same
 * route, so without a fresh mount the screen keeps showing card A.
 *
 * These stubs stand in for that: useState captures the param at mount, so the rendered id only
 * changes if the component actually remounted.
 */
jest.mock('../../header-footer/NavigationBar', () => ({ __esModule: true, default: () => <div>nav</div> }))
jest.mock('../../header-footer/Footer', () => ({ __esModule: true, default: () => <div>footer</div> }))

jest.mock('../CardInformation', () => ({
	__esModule: true,
	default: () => {
		const { useParams, Link } = jest.requireActual<typeof import('react-router-dom')>('react-router-dom')
		const { useState } = jest.requireActual<typeof import('react')>('react')
		const [idAtMount] = useState(useParams().cardId)

		return (
			<>
				<div>{`card screen for ${idAtMount}`}</div>
				<Link to='/card/B'>go to card B</Link>
			</>
		)
	},
}))

jest.mock('../ProductInformation', () => ({
	__esModule: true,
	default: () => {
		const { useParams, Link } = jest.requireActual<typeof import('react-router-dom')>('react-router-dom')
		const { useState } = jest.requireActual<typeof import('react')>('react')
		const [idAtMount] = useState(useParams().productId)

		return (
			<>
				<div>{`product screen for ${idAtMount}`}</div>
				<Link to='/product/SDK'>go to product SDK</Link>
			</>
		)
	},
}))

jest.mock('../Home', () => ({ __esModule: true, default: () => <div>home screen</div> }))
jest.mock('../BanList', () => ({ __esModule: true, default: () => <div>ban list screen</div> }))
jest.mock('../ProductBrowse', () => ({ __esModule: true, default: () => <div>product browse screen</div> }))
jest.mock('../CardsBrowse', () => ({ __esModule: true, default: () => <div>cards browse screen</div> }))
jest.mock('../About', () => ({ __esModule: true, default: () => <div>about screen</div> }))
jest.mock('../Privacy', () => ({ __esModule: true, default: () => <div>privacy screen</div> }))
jest.mock('../HttpErr', () => ({ __esModule: true, default: () => <div>http err screen</div> }))

import routes from '../Routes'

afterEach(() => {
	cleanup()
})

test('verify navigating to another card remounts the card screen', async () => {
	render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/card/A'] })} />)

	expect(await screen.findByText('card screen for A')).toBeInTheDocument()

	fireEvent.click(screen.getByRole('link', { name: 'go to card B' }))

	expect(await screen.findByText('card screen for B')).toBeInTheDocument()
})

test('verify navigating to another product remounts the product screen', async () => {
	render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/product/LOB'] })} />)

	expect(await screen.findByText('product screen for LOB')).toBeInTheDocument()

	fireEvent.click(screen.getByRole('link', { name: 'go to product SDK' }))

	expect(await screen.findByText('product screen for SDK')).toBeInTheDocument()
})
