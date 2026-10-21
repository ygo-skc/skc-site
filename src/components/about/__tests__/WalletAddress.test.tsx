import { act, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'

import WalletAddress from '../WalletAddress'
import MuiTheme from '../../MuiTheme'

const address = '3DbG1525F4HMf9Qttj5waDxJv747JrBh4g'
const writeText = jest.fn(() => Promise.resolve())

beforeEach(() => {
	Object.assign(navigator, { clipboard: { writeText } })
})

afterEach(() => {
	jest.clearAllMocks()
})

function renderWallet() {
	return render(
		<ThemeProvider theme={MuiTheme}>
			<WalletAddress currency='BTC (Bitcoin)' address={address} />
		</ThemeProvider>
	)
}

test('verify wallet shows its currency and full address', () => {
	renderWallet()

	expect(screen.getByText('BTC (Bitcoin)')).toBeInTheDocument()
	expect(screen.getByText(address)).toBeInTheDocument()
})

test('verify copy button puts the address on the clipboard', async () => {
	renderWallet()

	await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Copy BTC (Bitcoin) address' })))

	expect(writeText).toHaveBeenCalledWith(address)
})

test('verify copying is confirmed to the user', async () => {
	renderWallet()

	await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Copy BTC (Bitcoin) address' })))

	expect(screen.getByRole('status')).toHaveTextContent('Copied')
})

test('verify wallet text takes its look from theme typography variants', () => {
	renderWallet()

	expect(screen.getByText('BTC (Bitcoin)')).toHaveClass('MuiTypography-subtitle2')
	expect(screen.getByText(address)).toHaveClass('MuiTypography-body2')
	expect(screen.getByRole('status')).toHaveClass('MuiTypography-body2')
})
