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
			<Chip label={rarity} onClick={open} className='rarity-chip' aria-haspopup='menu' aria-expanded={isOpen} aria-controls={isOpen ? menuId : undefined} />
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
					<span className='rarity-chip__title'>
						<Typography variant='subtitle1' component='span'>
							{rarity}
						</Typography>
						<Chip label={printings.length} className='rarity-chip__count' aria-hidden='true' />
						<Typography variant='body2' component='span' className='visually-hidden'>
							{plural(printings.length, 'printing')}
						</Typography>
					</span>
					{['Set number', 'Product', 'Released'].map((label) => (
						<Typography key={label} variant='body2' component='span' className='rarity-chip__muted rarity-chip__label' aria-hidden='true'>
							{label}
						</Typography>
					))}
				</ListSubheader>
				{/* no ripple - mounting its span on hover makes Safari lay the row out on its own, off the menu's shared columns */}
				{printings.map(({ productId, productName, date, setNumber }) => (
					<MenuItem key={setNumber} component={Link} to={`/product/${productId}`} onClick={close} disableRipple className='rarity-chip__row'>
						<Typography variant='subtitle2' component='span'>
							{setNumber}
						</Typography>
						<Typography variant='body2' component='span' className='rarity-chip__name'>
							{productName}
						</Typography>
						<Typography variant='body2' component='time' dateTime={date} className='rarity-chip__muted rarity-chip__date'>
							{Dates.fromYYYYMMDDToDateStr(date)}
						</Typography>
					</MenuItem>
				))}
			</Menu>
		</>
	)
}

export default RarityChip
