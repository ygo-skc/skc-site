import { Chip } from '@mui/material'
import { FC, Fragment } from 'react'
import CardImageRounded from '../util/photo/CardImageRounded'
import YGOCard from './YGOCard'

import '../../css/card/ygo-card-with-quantity.css'

const YGOCardWithQuantity: FC<{
	card: SKCCard
	occurrences: number
}> = ({ card, occurrences }) => {
	return (
		<Fragment>
			<div className='header'>
				<CardImageRounded cardImg={`https://images.thesupremekingscastle.com/cards/tn/${card.cardID}.jpg`} />
				<div className='quantity-text-container'>
					<Chip className='quantity-chip' key={card.cardID} label={`${occurrences} Reference(s)`} />
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
		</Fragment>
	)
}

export default YGOCardWithQuantity
