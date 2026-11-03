import { FC, useRef } from 'react'
import { Button, ButtonBase, IconButton, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { useDraggable, useDroppable } from '@dnd-kit/react'

import { rankedCount, TierListState } from './tierListState'
import { placeId } from './dropTarget'
import CardFrameRing from '../util/CardFrameRing'
import { useHistoryEntryState } from '../util/useHistoryEntry'

type TrayFilter = 'all' | 'monster' | 'spell' | 'trap'

const FILTERS: { value: TrayFilter; label: string }[] = [
	{ value: 'all', label: 'All' },
	{ value: 'monster', label: 'Monster' },
	{ value: 'spell', label: 'Spell' },
	{ value: 'trap', label: 'Trap' },
]

// spells and traps by their frame, every other frame is a monster - the API capitalises colours ("Spell"), so compare in lower case
const kindOf = (card: YGOCard.Deets): Exclude<TrayFilter, 'all'> => {
	const color = card.cardColor?.toLowerCase()
	return color === 'spell' || color === 'trap' ? color : 'monster'
}

type TrayCardProps = { card: YGOCard.Deets; onRemove: (card: YGOCard.Deets) => void; picked?: string; onPick: (cardID: string) => void; isDraggable: boolean; compact: boolean }

export const TrayCardFace: FC<{ card: YGOCard.Deets }> = ({ card }) => (
	<>
		<CardFrameRing cardColor={card.cardColor}>
			<img className='tier-list-tray__thumb' src={`https://images.thesupremekingscastle.com/cards/tn/${card.cardID}.jpg`} alt='' />
		</CardFrameRing>
		<Typography variant='body2' component='span' className='tier-list-tray__name'>
			{card.cardName}
		</Typography>
	</>
)

const TrayCard: FC<TrayCardProps> = ({ card, onRemove, picked, onPick, isDraggable, compact }) => {
	const { ref, isDragging } = useDraggable({ id: card.cardID, disabled: !isDraggable })

	return (
		<li ref={ref} className={`tier-list-tray__card${isDragging ? ' tier-list-tray__card--dragging' : ''}`}>
			{isDraggable && <DragIndicatorIcon className='tier-list-tray__handle' aria-hidden='true' />}
			<ButtonBase
				className='tier-list-tray__pick'
				data-card-id={card.cardID}
				aria-label={`Rank ${card.cardName}`}
				aria-pressed={picked === card.cardID}
				onClick={() => onPick(card.cardID)}
			>
				<TrayCardFace card={card} />
			</ButtonBase>
			{/* phones remove from the picker, so the row stays art and a name */}
			{!compact && (
				<IconButton size='small' aria-label={`Remove ${card.cardName} from tray`} onClick={() => onRemove(card)}>
					<CloseIcon />
				</IconButton>
			)}
		</li>
	)
}

// cards added from the search (a sideways row of art and names on phones) that aren't ranked yet - pick one to give it a tier, or take it off the list.
// The how-to sits under the heading, then All / Monster / Spell / Trap (kept in the history entry, so going back finds it), then the cards
const TierListTray: FC<{
	list: TierListState
	hint: string
	onRemove: (card: YGOCard.Deets) => void
	picked?: string
	onPick: (cardID: string) => void
	isDraggable?: boolean
	isOver?: boolean
	compact?: boolean
}> = ({ list, hint, onRemove, picked, onPick, isDraggable = false, isOver = false, compact = false }) => {
	const { ref } = useDroppable({ id: placeId('tray'), disabled: !isDraggable })
	const [filter, setFilter] = useHistoryEntryState<TrayFilter>('tierListTrayFilter', 'all')
	const allFilter = useRef<HTMLButtonElement>(null)
	// A–Z by name, whatever order the cards were added or came back from a tier in
	const shown = (filter === 'all' ? [...list.tray] : list.tray.filter((card) => kindOf(card) === filter)).sort((a, b) => a.cardName.localeCompare(b.cardName))

	return (
		<section ref={ref} className={`tier-list-tray${isOver ? ' tier-list-tray--over' : ''}${compact ? ' tier-list-tray--compact' : ''}`} aria-label='Tray'>
			<div className='tier-list-tray__head'>
				<Typography variant='h6' component='h2'>
					Tray
				</Typography>
				<Typography variant='body2' className='tier-list-tray__count'>
					{list.tray.length} unranked
				</Typography>
			</div>
			<Typography variant='body2' className='tier-list-tray__hint'>
				{hint}
			</Typography>

			{list.tray.length > 0 && (
				<ToggleButtonGroup
					exclusive
					fullWidth
					className='tier-list-tray__filter'
					aria-label='Show in tray'
					value={filter}
					onChange={(_event, next: TrayFilter | null) => next && setFilter(next)}
				>
					{FILTERS.map(({ value, label }) => (
						<ToggleButton key={value} value={value} className='tier-list-tray__filter-option' ref={value === 'all' ? allFilter : undefined}>
							<Typography variant='body2' component='span'>
								{label}
							</Typography>
						</ToggleButton>
					))}
				</ToggleButtonGroup>
			)}

			{list.tray.length === 0 ? (
				<Typography variant='body2' className='tier-list-tray__empty'>
					{list.tray.length + rankedCount(list) === 0 ? 'Search for a card to start your list.' : 'Every card is ranked.'}
				</Typography>
			) : shown.length === 0 ? (
				<div className='tier-list-tray__none'>
					<Typography variant='subtitle2' component='p' className='tier-list-tray__none-title'>
						No {filter}s
					</Typography>
					<Typography variant='body2' className='tier-list-tray__none-text'>
						{list.tray.length === 1 ? "The tray's 1 card is under another type." : `The tray's ${list.tray.length} cards are under other types.`}
					</Typography>
					{/* the button leaves with this tile, so focus moves to the filter it just changed */}
					<Button
						className='tier-list-tray__show-all'
						onClick={() => {
							setFilter('all')
							allFilter.current?.focus()
						}}
					>
						Show all {list.tray.length}
					</Button>
				</div>
			) : (
				<ul className='tier-list-tray__cards'>
					{shown.map((card) => (
						<TrayCard key={card.cardID} card={card} onRemove={onRemove} picked={picked} onPick={onPick} isDraggable={isDraggable} compact={compact} />
					))}
				</ul>
			)}
		</section>
	)
}

export default TierListTray
