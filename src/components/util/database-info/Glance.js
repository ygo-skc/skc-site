import React from 'react'
import { Typography, Box } from '@material-ui/core'
import styled from 'styled-components'

const Container = styled(Box)`
	&& {
		padding: 2rem;
		border-radius: 1.5rem;
		flex: 1;
		background: white;
		border-color: #ABC0A3;
		border-style: solid;
		animation: pulse-animation 3s infinite;


		:hover {
			cursor: pointer;
			transform: scale(1.02);
		}

		@keyframes pulse-animation {
			0% {
				box-shadow: 0 0 0 0rem rgba(0, 0, 0, 0.4);
			}
			25% {
				box-shadow: 0 0 0 .2rem rgba(0, 0, 0, .2);
			}
			50% {
				box-shadow: 0 0 0 .25rem rgba(0, 0, 0, 0);
			}
		}
	}
`


export default function DatabaseInfo({ total, subject, color, action })
{
	return(
		<Container item onClick={()=> action()} >
			<Typography variant='h1' align='center' style={{color: color}} >
				{total}
			</Typography>
			<Typography variant='h5' align='center' >
				{subject}
			</Typography>
		</Container>
	)
}