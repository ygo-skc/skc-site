import { FC, memo } from 'react'

import { Box } from '@mui/material'
import CardImageRounded from '../CardImageRounded'

import YGOCard from '../YGOCard'

const CardData: FC<_CardData> = memo(
	({ cardID, cardName, cardColor, cardEffect, cardAttribute, monsterType, monsterAtk, monsterDef, monsterAssociation, isLoading, cardImg }) => {
		return (
			<Box className='sticky one-third-two-thirds-container'>
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
			</Box>
		)
	},
	(prevProps, newProps) => {
		if (prevProps.isLoading !== newProps.isLoading) return false

		return true
	}
)

export default CardData
