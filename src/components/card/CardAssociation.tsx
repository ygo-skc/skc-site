import { FC } from 'react'
import { ImageWithNumber } from './ImageWithText'

class _CardAssociation {
	static readonly levelImage = (
		<img src={`/assets/card_level.svg`} alt='Card Level' style={{ width: '30px', height: '30px', display: 'inline-block', marginRight: '.35rem', verticalAlign: 'middle' }} />
	)

	static readonly rankImage = (
		<img src={`/assets/card_rank.svg`} alt='Card Rank' style={{ width: '30px', height: '30px', display: 'inline-block', marginRight: '.35rem', verticalAlign: 'middle' }} />
	)

	static readonly pendulumScaleImage = (
		<img
			src={`/assets/card_pendulum_scale.svg`}
			alt='Card Rank'
			style={{ width: '30px', height: '30px', display: 'inline-block', marginRight: '.35rem', marginLeft: '.5rem', verticalAlign: 'middle' }}
		/>
	)
}

const CardAssociation: FC<{ monsterAssociation?: SKCMonsterAssociation; attribute?: string }> = ({ monsterAssociation, attribute }) => {
	if (monsterAssociation === undefined) return null
	if (monsterAssociation.level === undefined && monsterAssociation.rank === undefined && monsterAssociation.linkRating === undefined) return null

	return (
		<div style={{ width: '100%', marginBottom: '.35rem', textAlign: 'center' }}>
			<div
				style={{
					background: 'rgba(255, 255, 255, .82)',
					display: 'inline-block',
					paddingTop: '.2rem',
					paddingBottom: '.2rem',
					paddingLeft: '.7rem',
					paddingRight: '.7rem',
					borderRadius: '4rem',
					textAlign: 'center',
				}}
			>
				<img
					alt='Card Attribute'
					style={{ width: '30px', height: '30px', display: 'inline-block', marginRight: '.85rem', verticalAlign: 'middle' }}
					src={`/assets/${attribute}.svg`}
				/>

				{monsterAssociation.level === undefined ? undefined : <ImageWithNumber imageComponent={_CardAssociation.levelImage} text={`x${monsterAssociation.level}`} />}

				{monsterAssociation.rank === undefined ? undefined : <ImageWithNumber imageComponent={_CardAssociation.rankImage} text={`x${monsterAssociation.rank}`} />}

				{monsterAssociation.scaleRating === undefined ? undefined : (
					<ImageWithNumber imageComponent={_CardAssociation.pendulumScaleImage} text={`x${monsterAssociation.scaleRating}`} />
				)}

				{monsterAssociation.linkRating === undefined ? undefined : <ImageWithNumber text={`L${monsterAssociation.linkRating}: ${monsterAssociation.linkArrows.join(' ')}`} />}
			</div>
		</div>
	)
}

export default CardAssociation
