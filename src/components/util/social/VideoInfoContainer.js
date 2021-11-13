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

		color: rgb(255, 255, 255);
		font-weight: 800;
		line-height: 1.65rem;
	}
`


const Parent = Styled.div`
	&&
	{
		background: linear-gradient(120deg, #FF4D4B, #DC4240);

		margin-right: .5rem;
		margin-bottom: .5rem;
		border-radius: .85rem;
		width: 26rem;


		:hover {
			cursor: pointer;
			transform: scale(1.01);
		}
	}
`


export default function YouTubeUploads({ thumbnailImg, title, url })
{
	return(
		<Parent>
			<div style={{borderRadius: '.8rem', borderStyle: 'solid', borderColor: 'rgba(255, 255, 255, .5)', borderWidth: '.6rem'}}>
				<a href={url}>
					<img src={thumbnailImg.src}
						alt='YouTube Video Thumbnail For Channel: Supreme King'
						width='100%'
						style={{clipPath: 'inset(2.4rem 0rem 2.4rem 0rem round .2rem)', marginTop: '-2.4rem', marginBottom: '-2.4rem'}} />
				</a>
			</div>


			<div style={{display: 'flex', padding: '1rem'}}>
				<a href={url} style={{textDecoration: 'none'}}>
					<Title href={url} variant='h6' >
						{title}
					</Title>
				</a>
			</div>
		</Parent>
	)
}