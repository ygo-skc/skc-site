import React, {lazy, Suspense } from 'react'
import { Typography } from '@material-ui/core'

import {StickyBox} from '../util/StyledContainers'

const YGOCard = lazy( () => import('./YGOCard') )
const CardImageRounded = lazy( () => import('./CardImageRounded') )

const CardData = ( { cardID, cardName, cardColor, cardEffect, cardAttribute, monsterType, monsterAtk, monsterDef, monsterAssociation, isLoading } ) =>
{
	return(<StickyBox>
		<Typography
			variant='h4'
			align='center'
			style={{marginBottom: '2rem'}} >
			Card Information
		</Typography>

		<CardImageRounded
			cardID={cardID}
			/>

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