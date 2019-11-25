import React from 'react'
import styled from 'styled-components'

import { AppBar, Toolbar, Button, Link } from '@material-ui/core'

import { NAME_maps_ROUTE } from '../Routes'


export default function NavigationBar(props)
{
	const NavigationButton = styled(Button)`
		&&
		{
			text-transform: none;

			:hover
			{
				background: #7E3390;
			}
		}
	`
	return (
		<AppBar position='static'>
			<Toolbar>
				<Link underline='none' color='inherit' href={NAME_maps_ROUTE.Home} >
					<NavigationButton color='inherit' >
						Yugioh Site
					</NavigationButton>
				</Link>
				<Link style={{marginLeft: '30px'}} underline='none' color='inherit' href={NAME_maps_ROUTE.BanList} >
					<NavigationButton color='inherit' >
						Ban Lists
					</NavigationButton>
				</Link>
			</Toolbar>
		</AppBar>
	)
}