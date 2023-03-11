import { FC, Fragment } from 'react'
import CardImageRounded from '../util/photo/CardImageRounded'
import YGOCard from './YGOCard'

type _YGOCardWithImage = {
	card: SKCCard
}

const YGOCardWithImage: FC<_YGOCardWithImage> = ({ card }) => {
	return (
		<Fragment>
			<CardImageRounded cardImg={`https://images.thesupremekingscastle.com/cards/x-sm/${card.cardID}.jpg`} />

			<YGOCard
				cardName={card.cardName}
				cardColor={card.cardColor}
				cardEffect={card.cardEffect}
				monsterType={card.monsterType}
				cardID={card.cardID}
				fullDetails={false}
				monsterAssociation={card.monsterAssociation}
				cardAttribute={card.cardAttribute}
			/>
		</Fragment>
	)
}

export default YGOCardWithImage