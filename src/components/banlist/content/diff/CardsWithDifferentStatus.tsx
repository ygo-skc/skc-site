import { Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { YGOCardWithPreviousBanStatus } from 'skc-rcl'

type _CardsWithDifferentStatus = {
	newStatusName: 'Forbidden' | 'Limited' | 'Semi Limited' | 'Unlimited' | 'Limited One' | 'Limited Two' | 'Limited Three'
	cards: SKCCardsPreviousBanListStatus[]
	numCards: number
}

const CardsWithDifferentStatus: FC<_CardsWithDifferentStatus> = ({ newStatusName, cards, numCards }) => {
	const [cardsWithNewStatus, setCardsWithNewStatus] = useState<JSX.Element[]>([])

	useEffect(() => {
		setCardsWithNewStatus(
			cards.map((newStatus: SKCCardsPreviousBanListStatus) => {
				const card: SKCCard = newStatus.card

				return <YGOCardWithPreviousBanStatus key={`${newStatusName}-${card.cardID}`} card={card} previousBanStatus={newStatus.previousBanStatus} />
			})
		)
	}, [cards])

	return (
		<div className='cards-with-different-status-parent very-light-shadow'>
			<Typography variant='h4'>
				Newly {newStatusName} ({numCards})
			</Typography>

			<div className='cards-with-different-status-content'>{cardsWithNewStatus}</div>
		</div>
	)
}

export default CardsWithDifferentStatus
