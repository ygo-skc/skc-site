import { FC, memo } from 'react'
import { Section } from 'skc-rcl'

import CardImageRounded from '../../util/photo/CardImageRounded'

import YGOCard from '../YGOCard'

type _CardData = SKCCard & {
	isLoading: boolean
	cardImg: HTMLImageElement
}

const CardData: FC<_CardData> = memo(
	({ cardID, cardName, cardColor, cardEffect, cardAttribute, monsterType, monsterAttack, monsterDefense, monsterAssociation, isLoading, cardImg }) => {
		return (
			<Section sectionHeaderBackground={cardColor !== undefined ? (cardColor?.replace(/Pendulum-/gi, '') as cardColor) : ''} sectionName='Information'>
				<div className='sticky section-content'>
					<CardImageRounded cardImg={cardImg.src} defaultVisibility={true} />

					<YGOCard
						cardName={cardName}
						cardColor={cardColor}
						cardEffect={cardEffect}
						cardAttribute={cardAttribute}
						monsterType={monsterType}
						monsterAttack={monsterAttack}
						monsterDefense={monsterDefense}
						monsterAssociation={monsterAssociation}
						cardID={cardID}
						fullDetails={true}
						isLoading={isLoading}
					/>
				</div>
			</Section>
		)
	},
	(prevProps, newProps) => {
		if (prevProps.isLoading !== newProps.isLoading) return false

		return true
	}
)

export default CardData
