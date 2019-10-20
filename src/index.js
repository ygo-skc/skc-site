import React from 'react'
import { render } from 'react-dom'

import { AppBar, Typography, Toolbar, Button, Link } from '@material-ui/core'

import Routes from './helper/Routes'

render(
	<div>
		<AppBar position="static">
			<Toolbar>
				<Typography variant="h6">
					Yugioh Website
				</Typography>
				<Link color="inherit" href="/Banlist" >
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
