import { FC, memo } from 'react'

import { Typography, Paper } from '@mui/material'
import { Skeleton } from '@mui/material'

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

type YGOCardType = {
	cardName: string,
	cardColor: string,
	cardEffect: string,
	monsterType: string,
	cardAttribute?: string,
	monsterAtk?: string,
	monsterDef?: string,
	monsterAssociation?: string,
	cardID: string,
	fullDetails: boolean,
	effectMaxLineHeight?: number,
	isLoading?: boolean,
	className?: string
}


const YGOCard:FC<YGOCardType> = memo(( {cardName, cardColor, cardEffect, monsterType, cardAttribute, monsterAtk, monsterDef, monsterAssociation, cardID, fullDetails, effectMaxLineHeight, isLoading, className }) =>
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