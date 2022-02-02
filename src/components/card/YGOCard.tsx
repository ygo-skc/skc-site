import { FC, memo } from 'react'

import { Typography, Paper, Skeleton } from '@mui/material'

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

type _YGOCard = SKCCard & {
	fullDetails: boolean
	effectMaxLineHeight?: number
	isLoading?: boolean
	className?: string
}

const YGOCard: FC<_YGOCard> = memo(
	({
		cardName,
		cardColor,
		cardEffect,
		monsterType,
		cardAttribute,
		monsterAttack,
		monsterDefense,
		monsterAssociation,
		cardID,
		fullDetails,
		effectMaxLineHeight,
		isLoading,
		className,
	}) => {
		if (isLoading) {
			return <Skeleton variant='rectangular' height='150' style={{ borderRadius: '.5rem' }} />
		}

		return (
			<CardContentComponent className={[className, `${cardColor}-ygo-card-style`.toLowerCase(), 'YgoCardLightText'].join(' ')}>
				<Typography variant='subtitle1' id='card-name' noWrap={true}>
					{cardName}
				</Typography>

				<CardAssociation monsterAssociation={monsterAssociation} attribute={cardAttribute} />

				<YGOCardStats
					cardColor={cardColor}
					cardEffect={cardEffect}
					monsterType={monsterType}
					monsterAtk={monsterAttack}
					monsterDef={monsterDefense}
					cardID={cardID}
					fullDetails={fullDetails}
					effectMaxLineHeight={effectMaxLineHeight}
				/>
			</CardContentComponent>
		)
	},
	(prevProps, newProps) => {
		if (prevProps.cardName !== newProps.cardName) return false

		return true
	}
)

export default YGOCard
