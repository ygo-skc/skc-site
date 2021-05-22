import React from 'react'

import { AppBar, Toolbar, Button, Link } from '@material-ui/core'

import { NAME_maps_ROUTE } from '../Routes.tsx'

export default function NavigationBar()
{
	return (
		<AppBar position='static' className='app-bar' >
			<Toolbar >
				<Link
					underline='none'
					color='inherit'
					href={NAME_maps_ROUTE.Home} >
					<Button
						className='app-bar-button'
						color='inherit' >
						Supreme Kings Castle [BETA]
					</Button>
				</Link>

			</Toolbar>


			<div
				className='scrollable-nav' >

				<Link
					underline='none'
					color='inherit'
					href={ NAME_maps_ROUTE.Home } >
					<Button
						className='nav-button' color='inherit' >
						Home
					</Button>
				</Link>

				<Link
					underline='none'
					color='inherit'
					href={ NAME_maps_ROUTE.BanList } >
					<Button
						className='nav-button' color='inherit' >
						Ban List
					</Button>
				</Link>

				<Link
					underline='none'
					color='inherit'
					href={ NAME_maps_ROUTE.CardBrowse } >
					<Button
						className='nav-button' color='inherit' >
						Card Browse
					</Button>
				</Link>

				<Link
					underline='none'
					color='inherit'
					href={ NAME_maps_ROUTE.ProductBrowse } >
					<Button
						className='nav-button' color='inherit' >
						Product Browse
					</Button>
				</Link>

				<Link
					underline='none'
					color='inherit'
					href={ NAME_maps_ROUTE.About } >
					<Button
						className='nav-button' color='inherit' >
						About
					</Button>
				</Link>

			</div>
		</AppBar>
	)
}