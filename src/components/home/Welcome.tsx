import { Button, Chip, Typography } from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { Link } from 'react-router-dom'

import AppRoutes from '../../helper/AppRoutes'

const PROMISES = ['No ads', 'No trackers', 'Updated every ban list']

// the pitch in home's welcome sheet - what the site is, what it promises, and the about page
export default function Welcome() {
	return (
		<div className='welcome__pitch'>
			<Typography variant='overline' component='p' className='welcome__eyebrow'>
				Welcome
			</Typography>

			<Typography id='welcome__title' variant='h3' component='h2'>
				A Yu-Gi-Oh! database that stays out of your way.
			</Typography>

			<Typography variant='body1' className='welcome__summary'>
				Card info, ban lists and products, loaded fast. New sets and ban lists land here as they&apos;re announced.
			</Typography>

			<ul className='welcome__promises'>
				{PROMISES.map((promise) => (
					<li key={promise}>
						<Chip className='welcome__promise' icon={<CheckRoundedIcon />} label={promise} />
					</li>
				))}
			</ul>

			<Button className='welcome__about' component={Link} to={AppRoutes.About} endIcon={<ChevronRightIcon />}>
				About the site
			</Button>
		</div>
	)
}
