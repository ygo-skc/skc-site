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
		border = '3px solid #ef7ea4'
	} else if (newStatusName === 'Limited') {
		border = '3px solid #f4f400'
	} else if (newStatusName === 'Semi Limited') {
		border = '3px solid #61ff86'
	} else if (newStatusName === 'Unlimited') {
		border = '3px solid black'
	}

	useEffect(() => {
		setCardsWithNewStatus(
			cards.map((newStatus: SKCCardsPreviousBanListStatus) => {
				const card: SKCCard = newStatus.card

				return (
					<div style={{ width: '14rem', minWidth: '14rem', marginRight: '.5rem' }}>
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
			{isLoadingData ? <Skeleton style={{ height: '30rem' }} /> : <div style={{ display: 'flex', overflowX: 'auto' }}>{cardsWithNewStatus}</div>}
		</div>
	)
}

export default BanListChangedStatus
