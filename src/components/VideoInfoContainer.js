import React from 'react'
import {Typography, Button} from '@material-ui/core'
import Styled from 'styled-components'


const Title = Styled(Typography)`
	&& {
		white-space: pre-wrap;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;

		color: rgba(255, 255, 255, .97);
		fontWeight: 700;
	}
`


const Parent = Styled.div`
	&&
	{
		background: linear-gradient(120deg, #FF4D4B, #DC4240);
		flex: 0 0 25rem;
		padding: 1rem;
		margin-right: 1.5rem;
		border-radius: .5rem;
	}
`


export default function YouTubeUploads({ thumbnailUrl, title, description, url })
{
	return(
		<Parent>
			<div style={{marginBottom: '1rem', borderRadius: '3rem', borderStyle: 'solid', borderColor: 'rgba(255, 255, 255, .5)', borderWidth: '1rem'}}>
				<img src={thumbnailUrl} width='100%' style={{borderRadius: '2rem'}} />
			</div>

			<Title variant='h6' >
				{title}
			</Title>

			<div style={{display: 'flex'}}>
				<div style={{flex: '1'}} >
				</div>
				<Button style={{background: 'rgba(255, 255, 255, .8)', color: 'black', textTransform: 'none'}} onClick={() => window.open(url)} >
					Watch
				</Button>
			</div>
		</Parent>
	)
}