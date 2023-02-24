import { Typography, Link } from '@mui/material'
import AppRoutes from '../../helper/AppRoutes'

export default function SubNav() {
	return (
		<div className='scrollable-nav'>
			<Link underline='none' color='inherit' href={AppRoutes.Home}>
				<Typography className='nav-button' color='inherit'>
					Home
				</Typography>
			</Link>

			<Link underline='none' color='inherit' href={AppRoutes.BanList}>
				<Typography className='nav-button' color='inherit'>
					Ban List
				</Typography>
			</Link>

			<Link underline='none' color='inherit' href={AppRoutes.CardBrowse}>
				<Typography className='nav-button' color='inherit'>
					Card Browse
				</Typography>
			</Link>

			<Link underline='none' color='inherit' href={AppRoutes.ProductBrowse}>
				<Typography className='nav-button' color='inherit'>
					Product Browse
				</Typography>
			</Link>

			<Link underline='none' color='inherit' href={AppRoutes.About}>
				<Typography className='nav-button' color='inherit'>
					About
				</Typography>
			</Link>
		</div>
	)
}
