import React from 'react'
import { Typography } from '@material-ui/core'


const ImageWithNumber = ({ imageComponent, text }) => {

	return(
		<div style={{display: 'inline-block'}} >
			{imageComponent}
			<Typography
				variant='subtitle1'
				textAlign='center'
				style={{ display: 'inline-block', color: 'rgba(0, 0, 0, .55)', lineHeight: '24px', verticalAlign: 'middle', margin: 'auto', fontWeight: '800'}}>
				{text}
			</Typography>
		</div>
	)

}


export {ImageWithNumber}