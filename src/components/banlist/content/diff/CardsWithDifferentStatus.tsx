import { Skeleton, Typography } from '@mui/material'
import { FC, useEffect, useState, memo } from 'react'
import CardImageRounded from '../../../util/photo/CardImageRounded'
import YGOCard from '../../../card/YGOCard'
import Hint from '../../../util/generic/Hints'

type _CardsWithDifferentStatus = {
	newStatusName: 'Forbidden' | 'Limited' | 'Semi Limited' | 'Unlimited' | 'Limited One' | 'Limited Two' | 'Limited Three'
	cards: SKCCardsPreviousBanListStatus[]
	numCards: number
	isLoadingData: boolean
}

const CardsWithDifferentStatus: FC<_CardsWithDifferentStatus> = memo(
	({ newStatusName, cards, numCards, isLoadingData }) => {
		const [cardsWithNewStatus, setCardsWithNewStatus] = useState<JSX.Element[]>([])

		useEffect(() => {
			setCardsWithNewStatus(
				cards.map((newStatus: SKCCardsPreviousBanListStatus) => {
					const card: SKCCard = newStatus.card

					return (
						<div key={`${newStatusName}-${card.cardID}`} onClick={() => window.location.assign(`/card/${card.cardID}`)} className='ygo-card-info-parent'>
							<div className='img-and-previous-status-parent'>
								<CardImageRounded cardImg={`https://images.thesupremekingscastle.com/cards/tn/${card.cardID}.jpg`} />
								<div className='ban-list-status-change-text-parent'>
									<Typography align='right' variant='h5' className='ban-list-status-change-text-1'>
										Previously
									</Typography>
									<Typography align='right' variant='h6' className='ban-list-status-change-text-2'>
										{newStatus.previousBanStatus}
									</Typography>
								</div>
							</div>
							<YGOCard
								cardID={card.cardID}
								cardName={card.cardName}
								cardColor={card.cardColor}
								cardEffect={card.cardEffect}
								monsterType={card.monsterType}
								cardAttribute={card.cardAttribute}
								monsterAttack={card.monsterAttack}
								monsterDefense={card.monsterDefense}
								monsterAssociation={card.monsterAssociation}
								fullDetails={false}
							/>
						</div>
					)
				})
			)
		}, [cards])

		return (
			<div>
				<Typography variant='h4'>
					Newly {newStatusName} ({numCards})
				</Typography>

				<div className='cards-with-different-status-content'>
					{isLoadingData ? (
						<Skeleton className='rounded-skeleton' variant='rectangular' height='20rem' width='100%' />
					) : numCards === 0 ? (
						<Hint>Nothing here 🤨</Hint>
					) : (
						cardsWithNewStatus
					)}
				</div>
			</div>
		)
	},
	(prevProps, nextProps) => {
		if (prevProps.isLoadingData !== nextProps.isLoadingData) return false
		return true
	}
)

export default CardsWithDifferentStatus
