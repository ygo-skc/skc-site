import React, {lazy, memo } from 'react'

import {StickyBox} from '../../util/StyledContainers'
import {RightBoxPaper} from '../../util/grid/OneThirdTwoThirdsGrid'

const YGOCard = lazy( () => import('../YGOCard') )
const CardImageRounded = lazy( () => import('../CardImageRounded') )

const CardData = memo( ( { cardID, cardName, cardColor, cardEffect, cardAttribute, monsterType, monsterAtk, monsterDef, monsterAssociation, isLoading } ) =>
{
	return(<StickyBox >
		<RightBoxPaper>
			<CardImageRounded
				cardID={cardID}
				timeout={0}
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
		</RightBoxPaper>
	</StickyBox>
	)
},  (prevProps, newProps) => {
	if ( prevProps.isLoading !== newProps.isLoading )
		return false

	return true
})


export default CardData