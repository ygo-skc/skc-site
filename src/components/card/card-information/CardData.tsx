import { FC, memo } from 'react'

import CardImageRounded from '../CardImageRounded'

import YGOCard from '../YGOCard'
import Section from '../../util/Section'

const CardData: FC<_CardData> = memo(
	({ cardID, cardName, cardColor, cardEffect, cardAttribute, monsterType, monsterAtk, monsterDef, monsterAssociation, isLoading, cardImg }) => {
		return (
			<Section
				sectionHeaderBackground={cardColor !== undefined ? (cardColor?.replace(/Pendulum-/gi, '') as cardColor) : ''}
				sectionName='Information'
				sectionContent={
					<div className='sticky section-content'>
						<CardImageRounded cardImg={cardImg.src} defaultVisibility={true} />

						<YGOCard
							cardName={cardName}
							cardColor={cardColor}
							cardEffect={cardEffect}
							cardAttribute={cardAttribute}
							monsterType={monsterType}
							monsterAtk={monsterAtk}
							monsterDef={monsterDef}
							monsterAssociation={monsterAssociation}
							cardID={cardID}
							fullDetails={true}
							isLoading={isLoading}
						/>
					</div>
				}
			/>
		)
	},
	(prevProps, newProps) => {
		if (prevProps.isLoading !== newProps.isLoading) return false

		return true
	}
)

export default CardData
