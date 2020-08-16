import React from 'react'

import { Badge } from '@material-ui/core'

import styled from 'styled-components'

import { YGOCard } from './YGOCard'


const CardBadge = styled(Badge)`
	&&
	{
		width: 100%;
		marginRight: 10px;

		.MuiBadge-badge {
			margin-right: 1.1rem;
			margin-bottom: .2rem;
			color: white;
		}
	}
`

const YGOCardStyled = styled(YGOCard)`
`


export default function CardDetails( { isNew, cardName, cardColor, cardEffect, monsterType, monsterAtk, monsterDef, cardClicked, cardStyles, cardID, fullDetails } )
{

	const cardClickedCallBack = (cardClicked) ? function () { cardClicked(cardID) } : undefined

	return (
		<CardBadge
			onClick={ cardClickedCallBack }
			badgeContent='NEW'
			variant='standard'
			overlap='rectangle'
			color='secondary'
			invisible={ !isNew } >
				<YGOCardStyled
					cardName={cardName}
					cardColor={cardColor}
					cardEffect={cardEffect}
					monsterType={monsterType}
					monsterAtk={monsterAtk}
					monsterDef={monsterDef}
					cardClicked={cardClicked}
					cardStyles={cardStyles}
					cardID={cardID}
					fullDetails={fullDetails}
					effectMaxLineHeight={2}
				/>
		</CardBadge>
	)

}
