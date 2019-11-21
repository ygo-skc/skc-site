import React from 'react'
import styled from 'styled-components'

import { AppBar, Typography, Toolbar, Button, Link } from '@material-ui/core'

import { NAME_maps_ROUTE } from '../Routes'


export default function NavigationBar(props)
{
	const NavigationButton = styled(Button)`
		&& {
			background: #241776;
			text-transform: none;
			color: white;

			:hover {
				background: #7E3390;
			}
		}
	`
	return (
		<AppBar position="static">
			<Toolbar>
				<Typography variant="h6">
					Yugioh Website
				</Typography>
				<Link style={{marginLeft: '20px'}} underline="none" color="inherit" href={NAME_maps_ROUTE.BanList} >
					<NavigationButton>
						Ban List
					</NavigationButton>
				</Link>
			</Toolbar>
		</AppBar>
	)
}