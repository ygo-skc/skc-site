import React from 'react'
import styled from 'styled-components'

import { AppBar, Toolbar, Button, Link } from '@material-ui/core'

import { NAME_maps_ROUTE } from '../Routes.tsx'


const NavigationButton = styled(Button)`
&&
{
	margin: .4rem;

	font-size: .9rem;
	:hover
	{
		background: #5c5ca9;
	}
}
`

const NavScroll = styled.div`
	&&
	{
		white-space: nowrap;
		text-align: center;
		overflow: auto;
		background-color: rgba(0, 0, 0, .37);

		::-webkit-scrollbar
		{
			display: none;
		}
	}
`

export default function NavigationBar()
{
	return (
		<AppBar position='static' style={{background: '#310e68', backgroundImage: 'linear-gradient(316deg, #310e68 0%, #5f0f40 74%)'}} >
			<Toolbar style={{minHeight: '48px'}}>
				<Link
					underline='none'
					color='inherit'
					href={NAME_maps_ROUTE.Home} >
					<NavigationButton
						style={ { fontSize: '1.25rem', textTransform: 'none'} }
						color='inherit' >
						Supreme Kings Castle [BETA]
					</NavigationButton>
				</Link>

			</Toolbar>


			<NavScroll >

				<Link
					underline='none'
					color='inherit'
					href={ NAME_maps_ROUTE.Home } >
					<NavigationButton color='inherit' >
						Home
					</NavigationButton>
				</Link>

				<Link
					underline='none'
					color='inherit'
					href={ NAME_maps_ROUTE.BanList } >
					<NavigationButton color='inherit' >
						Ban List
					</NavigationButton>
				</Link>

				<Link
					underline='none'
					color='inherit'
					href={ NAME_maps_ROUTE.CardBrowse } >
					<NavigationButton color='inherit' >
						Card Browse
					</NavigationButton>
				</Link>

				<Link
					underline='none'
					color='inherit'
					href={ NAME_maps_ROUTE.ProductBrowse } >
					<NavigationButton color='inherit' >
						Product Browse
					</NavigationButton>
				</Link>

				<Link
					underline='none'
					color='inherit'
					href={ NAME_maps_ROUTE.About } >
					<NavigationButton color='inherit' >
						About
					</NavigationButton>
				</Link>

			</NavScroll>
		</AppBar>
	)
}