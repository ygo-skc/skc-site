import { FC, memo, useCallback } from 'react'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { AcceptableBanListFormat } from '../../helper/BanListUtil'
import { scrollToTop } from '../../helper/Etc'

type BanListFormatProps = {
	format: AcceptableBanListFormat
	setFormat: React.Dispatch<React.SetStateAction<AcceptableBanListFormat>>
}

const BanListFormat: FC<BanListFormatProps> = memo(
	({ format, setFormat }) => {
		const handleFormatChanged = useCallback(
			(_: React.MouseEvent<HTMLElement>, value: AcceptableBanListFormat | null) => {
				// clicking the selected format again gives null - keep the current one
				if (value === null) return
				setFormat(value)
				scrollToTop()
			},
			[setFormat]
		)

		return (
			<ToggleButtonGroup className='ban-list-format' exclusive aria-label='Ban list format' value={format} onChange={handleFormatChanged}>
				<ToggleButton value={AcceptableBanListFormat.TCG}>TCG</ToggleButton>
				<ToggleButton value={AcceptableBanListFormat.MD}>Master Duel</ToggleButton>
			</ToggleButtonGroup>
		)
	},
	(prevProps, nextProps) => {
		return prevProps.format === nextProps.format
	}
)

BanListFormat.displayName = 'BanListFormat'
export default BanListFormat
