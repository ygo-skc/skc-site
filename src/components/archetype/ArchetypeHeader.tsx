import { FC } from 'react'
import { Skeleton, Typography } from '@mui/material'

import { ArchetypeStats } from './archetypeStats'

type ArchetypeHeaderProps = {
	name: string
	stats?: ArchetypeStats
}

/*
 * white sheet: the purple eyebrow and the archetype's name (from the URL, so it shows before the answer), then its totals split by hairlines
 */
const ArchetypeHeader: FC<ArchetypeHeaderProps> = ({ name, stats }) => {
	const totals = stats && [
		{ label: 'cards', value: stats.cards },
		{ label: 'monsters', value: stats.monsters },
		{ label: 'Spells & Traps', value: stats.spellsAndTraps },
	]

	return (
		<header className='archetype-header' aria-busy={!stats}>
			<div className='archetype-header__title'>
				<Typography variant='subtitle2' component='p' className='archetype-header__eyebrow'>
					Archetype
				</Typography>
				<Typography variant='h1' className='archetype-header__name'>
					{name}
				</Typography>
			</div>

			<ul className='archetype-header__totals' aria-label='Totals'>
				{totals
					? totals.map(({ label, value }) => (
							<li key={label}>
								<Typography variant='h2' component='span' className='archetype-header__total-value'>
									{value.toLocaleString()}
								</Typography>
								<Typography variant='body2' component='span' className='archetype-header__total-label'>
									{label}
								</Typography>
							</li>
					  ))
					: Array.from({ length: 3 }, (_, index) => (
							<li key={index} aria-hidden='true'>
								<Typography variant='h2' component='span' className='archetype-header__total-value'>
									<Skeleton width='3ch' />
								</Typography>
								<Typography variant='body2' component='span'>
									<Skeleton width='9ch' />
								</Typography>
							</li>
					  ))}
			</ul>
		</header>
	)
}

export default ArchetypeHeader
