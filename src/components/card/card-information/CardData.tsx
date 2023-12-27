import { decodeHTML } from 'entities'
import { FC, memo } from 'react'
import { CardImageRounded, Section, YGOCard } from 'skc-rcl'

type _CardData = SKCCard & {
	isLoading: boolean
}

const CardData: FC<_CardData> = memo(
	({ cardID, cardName, cardColor, cardEffect, cardAttribute, monsterType, monsterAttack, monsterDefense, monsterAssociation, isLoading }) => {
		return (
			<Section sectionHeaderBackground={cardColor !== undefined ? (cardColor?.replace(/Pendulum-/gi, '') as cardColor) : ''} sectionName='Information'>
				<div className='section-content'>
					<CardImageRounded variant='md' cardID={cardID} loading='eager' />

					<YGOCard
						cardName={cardName}
						cardColor={cardColor}
						cardEffect={decodeHTML(cardEffect)}
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

CardData.displayName = 'CardData'
export default CardData
