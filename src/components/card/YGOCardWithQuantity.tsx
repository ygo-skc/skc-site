import { Typography } from '@mui/material'
import { FC } from 'react'
import CardImageRounded from './CardImageRounded'
import YGOCard from './YGOCard'

import '../../css/card/ygo-card-with-quantity.css'

const YGOCardWithQuantity: FC<{
	card: SKCCard
	quantity: number
}> = ({ card, quantity }) => {
	return (
		<div className='light-shadow ygo-card-with-quantity-parent' onClick={() => window.location.assign(`/card/${card.cardID}`)}>
			<div className='header'>
				<CardImageRounded cardImg={`https://images.thesupremekingscastle.com/cards/tn/${card.cardID}.jpg`} />
				<div className='quantity-text-container'>
					<Typography align='right' variant='h5'>
						Quantity: {quantity}
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
}

export default YGOCardWithQuantity
