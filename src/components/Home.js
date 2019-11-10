
import React from 'react'

import { Typography, Link, Paper } from '@material-ui/core'

import { NAME_maps_ROUTE } from '../Routes'

export default function Home()
{
	return (
		<div style={{ height: '100%', width: '100%', marginTop: '30px', alignContent: 'center' }} >
			<Paper style={{ padding: 40, width: '75%', margin: 'auto'}} >
				<Typography variant='h5'>
					Welcome
					</Typography>
				<Typography variant='h6' style={{ marginTop: 20 }} >
					Check out the latest <Link href={NAME_maps_ROUTE.BanList} >Ban List</Link> - last updated October.
					</Typography>
			</Paper>
		</div>
	)
}