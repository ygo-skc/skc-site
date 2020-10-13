import React from 'react'
import { Typography } from '@material-ui/core'


const ImageWithNumber = ({ imageComponent, text }) => {

	return(
		<div style={{display: 'inline-block'}} >
			{imageComponent}
			<Typography
				variant='body1'
				textAlign='center'
				style={{ display: 'inline-block', color: 'rgba(0, 0, 0, .55)', lineHeight: '24px', verticalAlign: 'middle', margin: 'auto'}}>
				{text}
			</Typography>
		</div>
	)

}


export {ImageWithNumber}