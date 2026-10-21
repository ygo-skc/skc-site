import { FC, memo, useCallback, useEffect, useState } from 'react'
import { IconButton, Typography } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'

type WalletAddressProps = {
	currency: string
	address: string
}

const COPIED_FEEDBACK_MS = 2000

/*
 * A crypto wallet address users can copy in one tap - long addresses are easy to mis-select by hand.
 */
const WalletAddress: FC<WalletAddressProps> = memo(({ currency, address }) => {
	const [isCopied, setIsCopied] = useState(false)

	useEffect(() => {
		if (!isCopied) return
		const timeout = setTimeout(() => setIsCopied(false), COPIED_FEEDBACK_MS)
		return () => clearTimeout(timeout)
	}, [isCopied])

	const handleCopy = useCallback(() => {
		navigator.clipboard.writeText(address).then(() => setIsCopied(true))
	}, [address])

	return (
		<div className='wallet'>
			<Typography variant='subtitle2' component='span' className='wallet__currency'>
				{currency}
			</Typography>
			<div className='wallet__field'>
				<Typography variant='body2' component='code' className='wallet__address'>
					{address}
				</Typography>
				<IconButton className='wallet__copy' size='small' onClick={handleCopy} aria-label={`Copy ${currency} address`}>
					{isCopied ? <CheckIcon fontSize='small' /> : <ContentCopyIcon fontSize='small' />}
				</IconButton>
			</div>
			<Typography variant='body2' component='span' role='status' className='wallet__status'>
				{isCopied ? 'Copied' : ''}
			</Typography>
		</div>
	)
})

WalletAddress.displayName = 'WalletAddress'
export default WalletAddress
