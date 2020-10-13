import React from 'react'

import {ImageWithNumber} from './ImageWithText'


const levelImage = <img
	src={`${process.env.PUBLIC_URL}/Img/card_level.svg`}
	alt='Card Level Icon'
	style={{ width: '24px', height: '24px', display: 'inline-block', marginRight: '.35rem', verticalAlign: 'middle' }} />

const rankImage = <img
	src={`${process.env.PUBLIC_URL}/Img/card_rank.svg`}
	alt='Card Rank Icon'
	style={{ width: '24px', height: '24px', display: 'inline-block', marginRight: '.35rem', verticalAlign: 'middle' }} />


const CardLevel = ( { monsterAssociation } ) =>
{
	if (monsterAssociation === undefined)	return (null)
	if (monsterAssociation.level === undefined && monsterAssociation.rank === undefined)	return (null)


	return(
		<div style={{ width: '100%', marginBottom: '.35rem', textAlign: 'center'}} >
			<div style={{ background: 'rgba(255, 255, 255, .75)', display: 'inline-block', paddingTop: '.3rem', paddingBottom: '.3rem', paddingLeft: '.7rem', paddingRight: '.7rem', borderRadius: '4rem', textAlign: 'center'}} >
				<img
					style={{ width: '32px', height: '32px', display: 'inline-block', marginRight: '1.5rem', verticalAlign: 'middle' }}
					src={`${process.env.PUBLIC_URL}/Img/dark_attribute.svg`}
					/>

				{(monsterAssociation.level === undefined)?
					undefined
					: <ImageWithNumber
						imageComponent={levelImage}
						text={`x ${monsterAssociation.level}`}
						/>
				}

				{(monsterAssociation.rank === undefined)?
					undefined
					: <ImageWithNumber
						imageComponent={rankImage}
						text={`x ${monsterAssociation.rank}`}
						/>
				}
			</div>
		</div>
	)
}

export { CardLevel }