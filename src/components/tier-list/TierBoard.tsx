import { FC } from 'react'
import { ButtonBase, Typography } from '@mui/material'
import { CardImageRounded } from 'skc-rcl'
import { useDroppable } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'

import { Place, Tier, TIERS, TierListState } from './tierListState'
import { placeId } from './dropTarget'

// just the card's art - the name is the button's label
export const TierCard: FC<{ card: YGOCard.Deets }> = ({ card }) => <CardImageRounded cardID={card.cardID} size='x-sm' loading='lazy' />

// dnd-kit's CollisionPriority.Low
const LOW_COLLISION_PRIORITY = 1

type PickProps = { picked?: string; onPick?: (cardID: string) => void; isDraggable: boolean }

// a card - a button that picks it, and (on desktop) something to drag
const EditCard: FC<PickProps & { card: YGOCard.Deets; tier: Tier; index: number }> = ({ card, tier, index, picked, onPick, isDraggable }) => {
	const { ref, isDragging } = useSortable({ id: card.cardID, index, group: tier, disabled: !isDraggable })

	return (
		<li ref={ref} className={`tier-row__card${isDragging ? ' tier-row__card--dragging' : ''}`}>
			<ButtonBase
				className='tier-row__pick'
				data-card-id={card.cardID}
				aria-label={`Rank ${card.cardName}`}
				aria-pressed={picked === card.cardID}
				onClick={() => onPick?.(card.cardID)}
			>
				<TierCard card={card} />
			</ButtonBase>
		</li>
	)
}

const TierRow: FC<PickProps & { tier: Tier; cards: YGOCard.Deets[]; isOver: boolean; compact: boolean }> = ({ tier, cards, isOver, compact, ...pick }) => {
	// a low priority, so a card in the row wins over the row around it
	const { ref } = useDroppable({ id: placeId(tier), disabled: !pick.isDraggable, collisionPriority: LOW_COLLISION_PRIORITY })

	return (
		<section ref={ref} className={`tier-row tier-row--${tier}${isOver ? ' tier-row--over' : ''}${compact ? ' tier-row--compact' : ''}`} aria-label={`${tier} tier`}>
			<Typography variant='h3' component='span' className='tier-row__letter' aria-hidden='true'>
				{tier}
			</Typography>
			{cards.length === 0 ? (
				<Typography variant='body2' className='tier-row__empty'>
					{compact ? 'No cards yet' : 'Drop cards here'}
				</Typography>
			) : (
				<ul className='tier-row__cards'>
					{cards.map((card, index) => (
						<EditCard key={card.cardID} card={card} tier={tier} index={index} {...pick} />
					))}
				</ul>
			)}
		</section>
	)
}

/*
 * The tiers, S to F, each a row with its letter block and its cards as their art (rcl's CardImageRounded). Every card is a button that
 * picks it for the tier picker, and on desktop can be dragged (smaller tiles on phones)
 */
const TierBoard: FC<{
	list: TierListState
	picked?: string
	onPick?: (cardID: string) => void
	isDraggable?: boolean
	overPlace?: Place
	compact?: boolean
}> = ({ list, picked, onPick, isDraggable = false, overPlace, compact = false }) => (
	<div className='tier-board'>
		{TIERS.map((tier) => (
			<TierRow key={tier} tier={tier} cards={list.tiers[tier]} isOver={overPlace === tier} compact={compact} picked={picked} onPick={onPick} isDraggable={isDraggable} />
		))}
	</div>
)

export default TierBoard
