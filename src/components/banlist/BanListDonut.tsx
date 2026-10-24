import { FC } from 'react'
import { Typography } from '@mui/material'
import { banStatusClass } from '../../helper/BanStatus'
import type { BanListTotal } from './BanListHeader'

// gap between segments, in percent of the ring
const GAP = 1

// a ring split by each status's share of the list, the total in the middle - decorative, the tiles beside it carry the numbers
const BanListDonut: FC<{ totals: BanListTotal[] }> = ({ totals }) => {
	const total = totals.reduce((sum, { count }) => sum + count, 0)
	const shown = totals.filter(({ count }) => count > 0)
	const gap = shown.length > 1 ? GAP : 0
	let start = 0

	return (
		<div className='ban-list-donut' aria-hidden='true'>
			<svg viewBox='0 0 64 64' className='ban-list-donut__ring'>
				<circle cx='32' cy='32' r='26' pathLength={100} className='ban-list-donut__track' />
				{total > 0 &&
					shown.map(({ status, count }) => {
						const share = (count / total) * 100
						const length = Math.max(share - gap, 0.5)
						const offset = -start
						start += share
						return (
							<circle
								key={status}
								cx='32'
								cy='32'
								r='26'
								pathLength={100}
								className={`ban-list-donut__segment ${banStatusClass(status)}`}
								strokeDasharray={`${length} ${100 - length}`}
								strokeDashoffset={offset}
							/>
						)
					})}
			</svg>
			<Typography variant='h6' component='span' className='ban-list-donut__total'>
				{total}
			</Typography>
		</div>
	)
}

export default BanListDonut
