import React, {lazy, memo } from 'react'

import {StickyBox} from '../../util/StyledContainers'
import {LeftBoxPaper} from '../../util/grid/OneThirdTwoThirdsGrid'
import CardImageRounded from '../CardImageRounded'

const YGOCard = lazy( () => import('../YGOCard') )


const CardData = memo( ( { cardID, cardName, cardColor, cardEffect, cardAttribute, monsterType, monsterAtk, monsterDef, monsterAssociation, isLoading, cardImg } ) =>
{
	return(<StickyBox >
			<LeftBoxPaper>
				<CardImageRounded
					cardImg={cardImg}
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
		</StickyBox>
	)
},  (prevProps, newProps) => {
	if ( prevProps.isLoading !== newProps.isLoading )
		return false

	return true
})


export default CardData