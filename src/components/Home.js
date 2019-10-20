
import React from 'react'

import { Typography, Link, Paper } from '@material-ui/core'

import { NAME_maps_ROUTE } from '../Routes'

export default function Home()
{
	return (
		<div style={{ height: '100%', marginTop: '30px' }} >
			<Paper style={{ padding: 40, marginLeft: 30, marginRight: 30 }} >
				<Typography variant='h5'>
					Yugioh Website
					</Typography>
				<Typography variant='h6' style={{ marginTop: 20 }} >
					Check out the latest <Link href={NAME_maps_ROUTE.BanList} >Ban List</Link> - last updated July.
					</Typography>
			</Paper>
		</div>
	)
}