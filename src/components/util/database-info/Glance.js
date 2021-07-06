import React from 'react'
import { Typography, Paper } from '@material-ui/core'


export default function DatabaseInfo({ total, subject })
{
	return(
		<Paper style={{padding: '2rem', borderRadius: '1.5rem', flex: '1'}}>
			<Typography variant='h1' align='center' >
				{total}
			</Typography>
			<Typography variant='h5' align='center' >
				{subject}
			</Typography>
		</Paper>
	)
}