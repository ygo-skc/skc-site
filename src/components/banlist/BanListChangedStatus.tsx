import { Skeleton, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import CardImageRounded from '../card/CardImageRounded'
import YGOCard from '../card/YGOCard'

const BanListChangedStatus: FC<{
	newStatusName: 'Forbidden' | 'Limited' | 'Semi Limited' | 'Unlimited'
	cards: SKCCardsPreviousBanListStatus[]
	numCards: number
	isLoadingData: boolean
}> = ({ newStatusName, cards, numCards, isLoadingData }) => {
	const [cardsWithNewStatus, setCardsWithNewStatus] = useState<JSX.Element[]>([])

	var border
	if (newStatusName === 'Forbidden') {
		border = '3px solid #f50057'
	} else if (newStatusName === 'Limited') {
		border = '3px solid rgb(255, 145, 0)'
	} else if (newStatusName === 'Semi Limited') {
		border = '3px solid rgb(76, 175, 80)'
	} else if (newStatusName === 'Unlimited') {
		border = '3px solid black'
	}

	useEffect(() => {
		setCardsWithNewStatus(
			cards.map((newStatus: SKCCardsPreviousBanListStatus) => {
				const card: SKCCard = newStatus.card

				return (
					<div onClick={() => window.location.assign(`/card/${card.cardID}`)} style={{ width: '12rem', minWidth: '12rem', marginRight: '.75rem', cursor: 'pointer' }}>
						<CardImageRounded cardImg={`https://images.thesupremekingscastle.com/cards/x-sm/${card.cardID}.jpg`} />
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
		<div style={{ marginBottom: '1rem', background: 'white', padding: '1rem', borderRadius: '1.5rem', border: border }}>
			<Typography variant='h4'>
				Newly {newStatusName} ({numCards})
			</Typography>
			{isLoadingData ? <Skeleton variant='rectangular' height='20rem' /> : <div style={{ display: 'flex', overflowX: 'auto' }}>{cardsWithNewStatus}</div>}
		</div>
	)
}

export default BanListChangedStatus
