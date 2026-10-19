import { memo } from 'react'

import LavaSea from './LavaSea'

/*
 * Decorative backdrop for the navigation bar - storm sky, lightning, rock spire and lava sea, drawn with flat fills.
 * Sky and lava stretch with the bar (preserveAspectRatio='none') while the spire and lightning keep their proportions.
 */
const NavScene = memo(function NavScene() {
	return (
		<div className='site-nav__scene' aria-hidden='true'>
			<svg className='site-nav__sky' viewBox='0 0 1200 108' preserveAspectRatio='none'>
				<rect width='1200' height='108' fill='var(--sky)' />
				<path
					fill='var(--sky-high)'
					d='M0 0h1200v20c-60 8-110-6-170 2s-90 14-160 4-120 6-190 0-110-10-170-2S380 30 300 20 150 26 80 18 20 12 0 16z'
				/>
				<path fill='var(--sky-low)' d='M0 52c70-8 140 6 210 0s120-12 190-4 140 10 210 2 150-12 230-4 170 10 230 2 100-6 130-2v62H0z' />
			</svg>

			<svg className='site-nav__bolt' viewBox='0 0 230 70' preserveAspectRatio='xMaxYMin meet'>
				<g fill='none' strokeLinejoin='bevel' strokeLinecap='round'>
					<path
						stroke='var(--bolt-halo)'
						strokeOpacity='.45'
						strokeWidth='5'
						d='M228 0l-30 14-6 10-34 8-14 12-38 6-22 14M158 32l-18-6-24 4M150 44l-10 14 4 10'
					/>
					<path stroke='var(--bolt)' strokeWidth='1.6' d='M228 0l-30 14-6 10-34 8-14 12-38 6-22 14M158 32l-18-6-24 4M150 44l-10 14 4 10' />
				</g>
			</svg>

			<svg className='site-nav__spire' viewBox='0 0 74 100' preserveAspectRatio='xMidYMax meet'>
				<path
					fill='var(--rock-shade)'
					d='M37 0l5 14 7-3-2 15 9 2-6 13 10 4-7 12 11 6-6 9 12 8-4 8H6l-1-8 10-7-6-9 10-6-6-11 9-5-5-12 8-3-3-14 7 3z'
				/>
				<path fill='var(--rock)' d='M37 0l-5 14-7-3 3 14-8 3 5 12-9 5 6 11-10 6 6 9-10 7 1 8h28z' />
				<path fill='var(--rock-light)' opacity='.8' d='M24 30l8-2 2 6-9 2zM18 56l12-3 2 6-13 3zM42 44l9-1 1 5-9 1z' />
				<rect x='22' y='78' width='30' height='14' fill='var(--gate)' />
				<rect x='22' y='78' width='30' height='2.5' fill='var(--gate-light)' />
				<rect x='33' y='83' width='8' height='9' fill='var(--gate-door)' />
				<rect x='25' y='82' width='4' height='10' fill='var(--gate-shade)' />
				<rect x='45' y='82' width='4' height='10' fill='var(--gate-shade)' />
			</svg>

			<LavaSea className='site-nav__lava' />
		</div>
	)
})

NavScene.displayName = 'NavScene'
export default NavScene
