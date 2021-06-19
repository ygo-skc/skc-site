import React, {memo} from 'react'

import { Typography, Paper } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import Styled from 'styled-components'

import CardAssociation from './CardAssociation'
import YGOCardStats from './YGOCardStats'

const CardContentComponent = Styled(Paper)`
	&&
	{
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		border-radius: 1rem;
		padding: .4rem;
		padding-top: .65rem;
		padding-bottom: .65rem;
	}
`


const YGOCard = memo(( {cardName, cardColor, cardEffect, monsterType, cardAttribute, monsterAtk, monsterDef, monsterAssociation, cardID, fullDetails, effectMaxLineHeight, isLoading, className }) =>
{
	if (isLoading)
	{
		return(
			<Skeleton variant='rect' height='150' style={{ borderRadius: '.5rem' }} />
		)
	}

	return(
		<CardContentComponent className={[className, `${cardColor}YgoCardParent`, 'YgoCardLightText'].join(' ')} >
			<Typography
				variant='subtitle1'
				id='CardName'
				noWrap={true}
				>
					{ cardName }
			</Typography>

			<CardAssociation monsterAssociation={monsterAssociation} attribute={cardAttribute} />

			<YGOCardStats
				cardColor={cardColor}
				cardEffect={cardEffect}
				monsterType={monsterType}
				monsterAtk={monsterAtk}
				monsterDef={monsterDef}
				cardID={cardID}
				fullDetails={fullDetails}
				effectMaxLineHeight={effectMaxLineHeight}
			/>
		</CardContentComponent>
	)
}, (prevProps, newProps) => {
	if ( prevProps.cardName !== newProps.cardName )
		return false

	return true
})


export default YGOCard