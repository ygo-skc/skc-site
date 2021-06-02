import React from 'react'
import {Typography, Button} from '@material-ui/core'
import Styled from 'styled-components'


const Description = Styled(Typography)`
	&& {
		white-space: pre-wrap;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
`


export default function YouTubeUploads({ thumbnailUrl, title, description, url })
{
	return(
		<div style={{background: 'linear-gradient(120deg, #FF4D4B, #DC4240)', flex: '0 0 17rem', padding: '1rem', marginRight: '1rem'}}>

			<div style={{ margin: 'auto', width: '98%', marginBottom: '1rem'}} >
				<img src={thumbnailUrl} width='100%' style={{borderRadius: '2rem', borderStyle: 'solid', borderColor: 'rgba(255, 255, 255, .5)', borderWidth: '.5rem'}} />
			</div>

			<Typography variant='h6' style={{color: 'rgba(255, 255, 255, .97)', fontWeight: '700'}} >
				{title}
			</Typography>

			<Button style={{background: 'rgba(255, 255, 255, .8)', color: 'black', textTransform: 'none'}} onClick={() => window.open(url)} >
				Watch
			</Button>
		</div>
	)
}