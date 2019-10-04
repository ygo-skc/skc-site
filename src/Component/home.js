
import React from 'react'

import { Typography, Link, Paper } from '@material-ui/core'

function Home()
{
	return (
		<div style={{ height: '100%', 'WebkitAlignItems': 'center', 'WebkitBoxAlign': 'center', 'justifyContent': 'center', display: 'flex' }} >
			<Paper style={{ padding: 40, marginLeft: 30, marginRight: 30, marginBottom: 450, width: '100%' }} >
				<Typography variant='h4'>
					Yugioh Website
					</Typography>
				<Typography variant='h6' style={{ marginTop: 20 }} >
					Check out the latest <Link href={'/ban_list'} >Ban List</Link> - last updated July.
					</Typography>
			</Paper>
		</div>
	)
}

export default Home