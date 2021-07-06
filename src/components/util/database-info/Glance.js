import React from 'react'
import { Typography, Paper } from '@material-ui/core'
import styled from 'styled-components'

const Container = styled(Paper)`
	&& {
		padding: 2rem;
		border-radius: 1.5rem;
		flex: 1;

		:hover {
			cursor: pointer;
			transform: scale(1.05);
		}
	}
`


export default function DatabaseInfo({ total, subject, color, action })
{
	return(
		<Container onClick={()=> action()} >
			<Typography variant='h1' align='center' style={{color: color}} >
				{total}
			</Typography>
			<Typography variant='h5' align='center' >
				{subject}
			</Typography>
		</Container>
	)
}