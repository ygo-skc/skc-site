import { FC, MouseEvent, useCallback, useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { Chip, ListSubheader, Menu, MenuItem, Typography } from '@mui/material'

import * as Dates from '../../../helper/Dates'
import { plural, RarityPrintings } from './cardGlance'

// a rarity chip that opens a menu of the printings in that rarity, each linking to its product
const RarityChip: FC<RarityPrintings> = ({ rarity, printings }) => {
	const [anchor, setAnchor] = useState<HTMLElement | null>(null)
	const menuId = useId()
	const isOpen = anchor !== null

	const open = useCallback((event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget), [])
	const close = useCallback(() => setAnchor(null), [])

	return (
		<>
			<Chip label={rarity} onClick={open} aria-haspopup='menu' aria-expanded={isOpen} aria-controls={isOpen ? menuId : undefined} />
			<Menu
				id={menuId}
				anchorEl={anchor}
				open={isOpen}
				onClose={close}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				transformOrigin={{ vertical: 'top', horizontal: 'left' }}
				slotProps={{ paper: { className: 'rarity-chip__panel' }, list: { 'aria-label': `${rarity} printings` } }}
			>
				<ListSubheader className='rarity-chip__heading'>
					<Typography variant='subtitle2' component='span'>
						{rarity}{' '}
						<Typography variant='inherit' component='span' className='rarity-chip__muted'>
							· {plural(printings.length, 'printing')}
						</Typography>
					</Typography>
				</ListSubheader>
				{printings.map(({ productId, productName, date, setNumber }) => (
					<MenuItem key={setNumber} component={Link} to={`/product/${productId}`} onClick={close} className='rarity-chip__row'>
						<Typography variant='body2' component='span' className='rarity-chip__name'>
							{productName}
						</Typography>
						<Typography variant='body2' component='span' className='rarity-chip__muted'>
							{setNumber} · <time dateTime={date}>{Dates.fromYYYYMMDDToDateStr(date)}</time>
						</Typography>
					</MenuItem>
				))}
			</Menu>
		</>
	)
}

export default RarityChip
