import { memo } from 'react'

/*
 * Decorative backdrop for the navigation bar - storm sky, lightning, rock spire and lava sea, drawn with flat fills.
 * Sky and lava stretch with the bar (preserveAspectRatio='none') while the spire and lightning keep their proportions.
 */
const NavScene = memo(function NavScene() {
	return (
		<div className='site-nav__scene' aria-hidden='true'>
			<svg className='site-nav__sky' viewBox='0 0 1200 108' preserveAspectRatio='none'>
				<rect width='1200' height='108' fill='var(--nav-sky)' />
				<path
					fill='var(--nav-sky-high)'
					d='M0 0h1200v20c-60 8-110-6-170 2s-90 14-160 4-120 6-190 0-110-10-170-2S380 30 300 20 150 26 80 18 20 12 0 16z'
				/>
				<path
					fill='var(--nav-sky-low)'
					d='M0 52c70-8 140 6 210 0s120-12 190-4 140 10 210 2 150-12 230-4 170 10 230 2 100-6 130-2v62H0z'
				/>
			</svg>

			<svg className='site-nav__bolt' viewBox='0 0 230 70' preserveAspectRatio='xMaxYMin meet'>
				<g fill='none' strokeLinejoin='bevel' strokeLinecap='round'>
					<path
						stroke='var(--nav-bolt-halo)'
						strokeOpacity='.45'
						strokeWidth='5'
						d='M228 0l-30 14-6 10-34 8-14 12-38 6-22 14M158 32l-18-6-24 4M150 44l-10 14 4 10'
					/>
					<path stroke='var(--nav-bolt)' strokeWidth='1.6' d='M228 0l-30 14-6 10-34 8-14 12-38 6-22 14M158 32l-18-6-24 4M150 44l-10 14 4 10' />
				</g>
			</svg>

			<svg className='site-nav__spire' viewBox='0 0 74 100' preserveAspectRatio='xMidYMax meet'>
				<path
					fill='var(--nav-rock-shade)'
					d='M37 0l5 14 7-3-2 15 9 2-6 13 10 4-7 12 11 6-6 9 12 8-4 8H6l-1-8 10-7-6-9 10-6-6-11 9-5-5-12 8-3-3-14 7 3z'
				/>
				<path fill='var(--nav-rock)' d='M37 0l-5 14-7-3 3 14-8 3 5 12-9 5 6 11-10 6 6 9-10 7 1 8h28z' />
				<path fill='var(--nav-rock-light)' opacity='.8' d='M24 30l8-2 2 6-9 2zM18 56l12-3 2 6-13 3zM42 44l9-1 1 5-9 1z' />
				<rect x='22' y='78' width='30' height='14' fill='var(--nav-gate)' />
				<rect x='22' y='78' width='30' height='2.5' fill='var(--nav-gate-light)' />
				<rect x='33' y='83' width='8' height='9' fill='var(--nav-gate-door)' />
				<rect x='25' y='82' width='4' height='10' fill='var(--nav-gate-shade)' />
				<rect x='45' y='82' width='4' height='10' fill='var(--nav-gate-shade)' />
			</svg>

			<svg className='site-nav__lava' viewBox='0 0 1200 22' preserveAspectRatio='none'>
				<path
					fill='var(--nav-shore)'
					d='M0 0l40 4 60-2 50 5 70-3 60 4 80-2 60 4 70-3 50 2 90 1 60-3 80 4 60-2 70 3 50-2 70 4 60-3 50 2 50-1 40 3L1200 4V22H0z'
				/>
				<path
					fill='var(--nav-lava)'
					d='M0 10l30 2 26-3 34 3 30-2 40 3 36-3 30 2 44-2 30 3 40-3 34 2 36-2 40 3 30-3 44 2 36-2 30 3 40-2 34 2 36-3 30 3 44-2 30 2 40-3 34 3 36-2 40 2 30-2 44 3 38-2L1200 10V22H0z'
				/>
				<path
					fill='none'
					stroke='var(--nav-lava-crest)'
					strokeWidth='1.4'
					vectorEffect='non-scaling-stroke'
					d='M0 10l30 2 26-3 34 3 30-2 40 3 36-3 30 2 44-2 30 3 40-3 34 2 36-2 40 3 30-3 44 2 36-2 30 3 40-2 34 2 36-3 30 3 44-2 30 2 40-3 34 3 36-2 40 2 30-2 44 3 38-2L1200 10'
				/>
				<path
					fill='none'
					stroke='var(--nav-lava-crack)'
					strokeWidth='1.2'
					vectorEffect='non-scaling-stroke'
					d='M60 22l20-6 18 5M210 22l14-5 22 4 10-3M380 22l18-6 16 6M560 22l22-5 14 3M720 22l16-6 20 5 12-2M900 22l20-5 16 5M1060 22l18-6 22 6'
				/>
			</svg>
		</div>
	)
})

NavScene.displayName = 'NavScene'
export default NavScene
