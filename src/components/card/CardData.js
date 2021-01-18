import React, {lazy, Suspense } from 'react'

import {StickyBox} from '../util/StyledContainers'
// import CardImageRounded from './CardImageRounded'

const YGOCard = lazy( () => import('./YGOCard') )
const CardImageRounded = lazy( () => import('./CardImageRounded') )

const CardData = ( { cardID, cardName, cardColor, cardEffect, cardAttribute, monsterType, monsterAtk, monsterDef, monsterAssociation, isLoading } ) =>
{
	return(<StickyBox>
		<Suspense >
			<CardImageRounded
				cardID={cardID}
				timeout={0}
				/>
		</Suspense>

		<Suspense >
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
		</Suspense>
	</StickyBox>
	)
}


export default CardData