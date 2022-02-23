import { FC, memo } from 'react'

import { Typography, Skeleton } from '@mui/material'
import CardAssociation from './CardAssociation'
import YGOCardStats from './YGOCardStats'

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
			<div className={[className, 'ygo-card-style-base', `${cardColor}-ygo-card-style`, 'YgoCardLightText'].join(' ')}>
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
			</div>
		)
	},
	(prevProps, newProps) => {
		if (prevProps.cardName !== newProps.cardName) return false

		return true
	}
)

export default YGOCard
