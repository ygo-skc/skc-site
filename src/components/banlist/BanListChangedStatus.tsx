import { Skeleton, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import CardImageRounded from '../card/CardImageRounded'
import YGOCard from '../card/YGOCard'

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
		setCardsWithNewStatus(
			cards.map((newStatus: SKCCardsPreviousBanListStatus) => {
				const card: SKCCard = newStatus.card

				return (
					<div
						onClick={() => window.location.assign(`/card/${card.cardID}`)}
						style={{
							width: '18rem',
							minWidth: '18rem',
							marginRight: '.75rem',
							cursor: 'pointer',
							backgroundColor: '#eee',
							padding: '1rem',
							borderRadius: '2.5rem',
							border: '2px solid #888',
						}}
					>
						<div style={{ display: 'flex' }}>
							<CardImageRounded cardImg={`https://images.thesupremekingscastle.com/cards/tn/${card.cardID}.jpg`} />
							<div style={{ minWidth: '60%', margin: 'auto' }}>
								<Typography align='right' variant='h5' style={{ marginBottom: '0rem' }}>
									Previously
								</Typography>
								<Typography align='right' variant='h6' style={{ color: 'black' }}>
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
		<div style={{ marginBottom: '1rem', background: 'white', padding: '1.5rem', borderRadius: '1.5rem', border: border }}>
			<Typography variant='h4'>
				Newly {newStatusName} ({numCards})
			</Typography>
			{isLoadingData ? <Skeleton variant='rectangular' height='20rem' /> : <div style={{ display: 'flex', overflowX: 'auto', paddingBottom: '1rem' }}>{cardsWithNewStatus}</div>}
		</div>
	)
}

export default BanListChangedStatus
