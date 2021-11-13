import React from 'react'
import { Typography, Box } from '@material-ui/core'
import styled from 'styled-components'

const Container = styled(Box)`
	&& {
		padding: 2rem;
		border-radius: 1.5rem;
		flex: 1;
		background: white;
		border-color: rgb(135, 120, 229);
		border-style: solid;
		animation: pulse-animation 2s infinite;


		:hover {
			cursor: pointer;
			transform: scale(1.02);
		}

		@keyframes pulse-animation {
			0% {
				box-shadow: 0 0 0 0rem rgba(255, 184, 136, 0.4);
			}
			25% {
				box-shadow: 0 0 0 .4rem rgba(255, 184, 136, .2);
			}
			50% {
				box-shadow: 0 0 0 .75rem rgba(255, 184, 136, 0);
			}
		}
	}
`


export default function DatabaseInfo({ total, subject, color, action })
{
	return(
		<Container item onClick={()=> action()} >
			<Typography variant='h1' align='center' style={{color: '#626262'}} >
				{total}
			</Typography>
			<Typography variant='h5' align='center' style={{color: color}} >
				{subject}
			</Typography>
		</Container>
	)
}