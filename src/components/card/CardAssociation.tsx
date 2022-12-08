import { FC } from 'react'
import { ImageWithNumber } from './ImageWithNumber'

import '../../css/card/card-association.css'

class _CardAssociation {
	static readonly levelImage = (<img src={`/assets/card_level.svg`} alt='Card Level' className='base-img' />)

	static readonly rankImage = (<img src={`/assets/card_rank.svg`} alt='Card Rank' className='base-img' />)

	static readonly pendulumScaleImage = (<img src={`/assets/card_pendulum_scale.svg`} alt='Card Rank' className='pend-img' />)
}

const CardAssociation: FC<{ monsterAssociation?: SKCMonsterAssociation; attribute?: string }> = ({ monsterAssociation, attribute }) => {
	if (monsterAssociation === undefined) return null
	if (monsterAssociation.level === undefined && monsterAssociation.rank === undefined && monsterAssociation.linkRating === undefined) return null

	return (
		<div className='card-association-parent'>
			<div className='card-association-sub-parent'>
				<img alt='Card Attribute' className='attribute-img' src={`/assets/${attribute}.svg`} />

				{monsterAssociation.level !== undefined && <ImageWithNumber imageComponent={_CardAssociation.levelImage} text={`x${monsterAssociation.level}`} />}
				{monsterAssociation.rank !== undefined && <ImageWithNumber imageComponent={_CardAssociation.rankImage} text={`x${monsterAssociation.rank}`} />}
				{monsterAssociation.scaleRating !== undefined && <ImageWithNumber imageComponent={_CardAssociation.pendulumScaleImage} text={`x${monsterAssociation.scaleRating}`} />}
				{monsterAssociation.linkRating !== undefined && <ImageWithNumber text={`L${monsterAssociation.linkRating}: ${monsterAssociation.linkArrows.join(' ')}`} />}
			</div>
		</div>
	)
}

export default CardAssociation
