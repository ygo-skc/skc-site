import React, {memo } from 'react'

import { Box } from '@mui/material'
import {LeftBoxPaper} from '../../util/grid/OneThirdTwoThirdsGrid'
import CardImageRounded from '../CardImageRounded'

import YGOCard from '../YGOCard'


const CardData = memo( ( { cardID, cardName, cardColor, cardEffect, cardAttribute, monsterType, monsterAtk, monsterDef, monsterAssociation, isLoading, cardImg } ) =>
{
	return(
		<Box className='sticky' >
			<LeftBoxPaper>
				<CardImageRounded
					cardImg={cardImg.src}
					defaultVisibility={true}
					/>

				<YGOCard
					isNew={ false }
					cardName={cardName}
					cardColor={cardColor}
					cardEffect={cardEffect}
					cardAttribute={cardAttribute}
					monsterType={monsterType}
					monsterAtk={monsterAtk}
					monsterDef={monsterDef}
					monsterAssociation={monsterAssociation}
					cardID={cardID}
					fullDetails={ true }
					isLoading={ isLoading }
					/>
			</LeftBoxPaper>
		</Box>
	)
},  (prevProps, newProps) => {
	if ( prevProps.isLoading !== newProps.isLoading )
		return false

	return true
})


export default CardData