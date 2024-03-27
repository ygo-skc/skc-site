import { FC, memo, useCallback } from 'react'
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { AcceptableBanListFormat } from '../../helper/BanListUtil'
import { scrollToTop } from '../../helper/Etc'

type BanListFormatProps = {
	format: AcceptableBanListFormat
	setFormat: React.Dispatch<React.SetStateAction<AcceptableBanListFormat>>
}

const BanListFormat: FC<BanListFormatProps> = memo(
	({ format, setFormat }) => {
		const handleFormatChanged = useCallback(
			(_: React.ChangeEvent<HTMLInputElement>, value: string) => {
				setFormat(value as AcceptableBanListFormat)
				scrollToTop()
			},
			[setFormat]
		)

		return (
			<div className='group'>
				<FormControl>
					<FormLabel id='ban-list-format-label'>Format</FormLabel>
					<RadioGroup value={format} onChange={handleFormatChanged} row aria-labelledby='ban-list-format-label' name='ban-list-format-buttons-group'>
						<FormControlLabel value='TCG' control={<Radio />} label='TCG' />
						<FormControlLabel value='MD' control={<Radio />} label='Master Duel' />
						<FormControlLabel value='DL' control={<Radio />} label='Duel Links' />
					</RadioGroup>
				</FormControl>
			</div>
		)
	},
	(prevProps, nextProps) => {
		return prevProps.format === nextProps.format
	}
)

BanListFormat.displayName = 'BanListFormat'
export default BanListFormat
