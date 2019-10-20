
import React from 'react'

import { Typography, Link, Paper } from '@material-ui/core'

export default function Home()
{
	return (
		<div style={{ height: '100%', marginTop: '30px' }} >
			<Paper style={{ padding: 40, marginLeft: 30, marginRight: 30 }} >
				<Typography variant='h5'>
					Yugioh Website
					</Typography>
				<Typography variant='h6' style={{ marginTop: 20 }} >
					Check out the latest <Link href={'/BanList'} >Ban List</Link> - last updated July.
					</Typography>
			</Paper>
		</div>
	)
}