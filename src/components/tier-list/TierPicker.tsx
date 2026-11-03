import { FC, useEffect, useRef } from 'react'
import { Button, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'

import { Place, TIERS } from './tierListState'

/*
 * Where a picked card goes - the tiers as a segmented control (its current tier pressed), back to the tray, or off the list.
 * The way to rank without dragging: keyboards on desktop, taps on phones. Esc (or a click outside the tooltip) puts the card down
 */
const TierPicker: FC<{ cardName: string; current: Place; onPick: (to: Place) => void; onRemove: () => void; onClose: () => void }> = ({
	cardName,
	current,
	onPick,
	onRemove,
	onClose,
}) => {
	const focusTier = useRef<HTMLButtonElement>(null)

	// focus lands on the card's tier (S for a tray card) so a keyboard picks without hunting for the picker - without scrolling, since the
	// tooltip is still at the page's top-left before it's placed and autoFocus would scroll the page up to it
	useEffect(() => focusTier.current?.focus({ preventScroll: true }), [])

	return (
		<div className='tier-picker' onKeyDown={(event) => event.key === 'Escape' && onClose()}>
			<Typography variant='body2' className='tier-picker__label'>
				Move {/* the card in near-black against the muted sentence - colour, not weight, sets it apart */}
				<Typography variant='inherit' component='span' className='tier-picker__name'>
					{cardName}
				</Typography>{' '}
				to
			</Typography>
			<ToggleButtonGroup
				exclusive
				fullWidth
				className='tier-picker__tiers'
				aria-label={`Move ${cardName} to`}
				value={current}
				onChange={(_event, to: Place | null) => to && onPick(to)}
			>
				{TIERS.map((tier) => (
					<ToggleButton
						key={tier}
						value={tier}
						className={`tier-picker__tier tier-picker__tier--${tier}`}
						ref={tier === (current === 'tray' ? 'S' : current) ? focusTier : undefined}
					>
						<Typography variant='subtitle1' component='span' className='tier-picker__letter'>
							{tier}
						</Typography>
					</ToggleButton>
				))}
			</ToggleButtonGroup>
			<div className='tier-picker__actions'>
				{current !== 'tray' && (
					<Button className='tier-picker__action' onClick={() => onPick('tray')}>
						Back to tray
					</Button>
				)}
				<Button className='tier-picker__action tier-picker__action--remove' onClick={onRemove}>
					Remove
				</Button>
			</div>
		</div>
	)
}

export default TierPicker
