import React from 'react'
import { render } from 'react-dom'

import { AppBar, Typography, Toolbar, Button, Link } from '@material-ui/core'

import Routes, { NAME_maps_ROUTE } from './Routes'

render(
	<div>
		<AppBar position="static">
			<Toolbar>
				<Typography variant="h6">
					Yugioh Website
				</Typography>
				<Link color="inherit" href={NAME_maps_ROUTE.BanList} >
					<Button color="inherit" >
						Ban List
					</Button>
				</Link>
			</Toolbar>
		</AppBar>

		<Routes />
	</div>,
	document.getElementById('root')
)
