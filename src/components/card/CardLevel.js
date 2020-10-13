import { Typography } from '@material-ui/core'
import React from 'react'


const levelImage = <img
	src={`${process.env.PUBLIC_URL}/Img/card_level.svg`}
	alt='Card Level Icon'
	style={{ width: '24px', height: '24px', display: 'inline-block', marginRight: '.35rem', verticalAlign: 'middle' }} />


const CardLevel = ( { level } ) =>
{
	console.log(level)
	if (level === undefined)	return undefined

	return(
		<div style={{ width: '100%', marginBottom: '.35rem', textAlign: 'right'}} >
			<div style={{ background: 'rgba(255, 255, 255, .75)', display: 'inline-block', padding: '.3rem', borderRadius: '4rem', textAlign: 'center'}} >
				{levelImage}
				<Typography
					variant='body1'
					textAlign='center'
					style={{ display: 'inline-block', color: 'rgba(0, 0, 0, .55)', lineHeight: '24px', verticalAlign: 'middle', margin: 'auto'}}>
					x {level}
				</Typography>
			</div>
		</div>
	)
}

export { CardLevel }