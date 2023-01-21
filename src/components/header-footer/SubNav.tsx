import { Typography, Link } from '@mui/material'

import { RouteMap } from '../pages/Routes'

export default function SubNav() {
	return (
		<div className='scrollable-nav'>
			<Link underline='none' color='inherit' href={RouteMap.NAME_maps_ROUTE.Home}>
				<Typography className='nav-button' color='inherit'>
					Home
				</Typography>
			</Link>

			<Link underline='none' color='inherit' href={RouteMap.NAME_maps_ROUTE.BanList}>
				<Typography className='nav-button' color='inherit'>
					Ban List
				</Typography>
			</Link>

			<Link underline='none' color='inherit' href={RouteMap.NAME_maps_ROUTE.CardBrowse}>
				<Typography className='nav-button' color='inherit'>
					Card Browse
				</Typography>
			</Link>

			<Link underline='none' color='inherit' href={RouteMap.NAME_maps_ROUTE.ProductBrowse}>
				<Typography className='nav-button' color='inherit'>
					Product Browse
				</Typography>
			</Link>

			<Link underline='none' color='inherit' href={RouteMap.NAME_maps_ROUTE.About}>
				<Typography className='nav-button' color='inherit'>
					About
				</Typography>
			</Link>
		</div>
	)
}
