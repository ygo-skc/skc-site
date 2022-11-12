import { Skeleton, Typography } from '@mui/material'
import { FC, startTransition, useEffect, useState } from 'react'
import CardImageRounded from '../card/CardImageRounded'
import YGOCard from '../card/YGOCard'
import { Hint } from '../util/Hints'

const BanListChangedStatus: FC<{
	newStatusName: 'Forbidden' | 'Limited' | 'Semi Limited' | 'Unlimited' | 'Limited One' | 'Limited Two' | 'Limited Three'
	cards: SKCCardsPreviousBanListStatus[]
	numCards: number
	isLoadingData: boolean
}> = ({ newStatusName, cards, numCards, isLoadingData }) => {
	const [cardsWithNewStatus, setCardsWithNewStatus] = useState<JSX.Element[]>([])

	let border
	if (newStatusName === 'Forbidden') {
		border = '5px solid #f50057'
	} else if (newStatusName === 'Limited' || newStatusName === 'Limited One') {
		border = '5px solid rgb(255, 145, 0)'
	} else if (newStatusName === 'Semi Limited' || newStatusName === 'Limited Two') {
		border = '5px solid rgb(76, 175, 80)'
	} else if (newStatusName === 'Limited Three') {
		border = '5px solid #00B5E2'
	} else if (newStatusName === 'Unlimited') {
		border = '5px solid black'
	}

	useEffect(() => {
		startTransition(() => {
			setCardsWithNewStatus(
				cards.map((newStatus: SKCCardsPreviousBanListStatus) => {
					const card: SKCCard = newStatus.card

					return (
						<div onClick={() => window.location.assign(`/card/${card.cardID}`)} className='ygo-card-info-parent'>
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
		})
	}, [cards])

	return (
		<div style={{ marginBottom: '1rem', background: 'white', padding: '1.5rem', borderRadius: '1.5rem', border: border }}>
			<Typography variant='h4'>
				Newly {newStatusName} ({numCards})
			</Typography>
			{isLoadingData ? (
				<Skeleton className='rounded-skeleton' variant='rectangular' height='20rem' />
			) : numCards === 0 ? (
				<Hint>Nothing here 🤨</Hint>
			) : (
				<div style={{ display: 'flex', overflowX: 'auto', paddingBottom: '1rem' }}>{cardsWithNewStatus}</div>
			)}
		</div>
	)
}

export default BanListChangedStatus
