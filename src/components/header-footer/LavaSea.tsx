import { memo } from 'react'

type LavaSeaProps = {
	className: string
}

/*
 * Jagged lava shoreline shared by the navigation bar and footer. Decorative - the parent scene is already aria-hidden.
 * Stretches to any width (preserveAspectRatio='none'); the outlines use non-scaling strokes so they stay crisp when stretched.
 */
const LavaSea = memo(function LavaSea({ className }: LavaSeaProps) {
	return (
		<svg className={className} viewBox='0 0 1200 22' preserveAspectRatio='none'>
			<path fill='var(--basalt)' d='M0 0l40 4 60-2 50 5 70-3 60 4 80-2 60 4 70-3 50 2 90 1 60-3 80 4 60-2 70 3 50-2 70 4 60-3 50 2 50-1 40 3L1200 4V22H0z' />
			<path
				fill='var(--lava)'
				d='M0 10l30 2 26-3 34 3 30-2 40 3 36-3 30 2 44-2 30 3 40-3 34 2 36-2 40 3 30-3 44 2 36-2 30 3 40-2 34 2 36-3 30 3 44-2 30 2 40-3 34 3 36-2 40 2 30-2 44 3 38-2L1200 10V22H0z'
			/>
			<path
				fill='none'
				stroke='var(--lava-crest)'
				strokeWidth='1.4'
				vectorEffect='non-scaling-stroke'
				d='M0 10l30 2 26-3 34 3 30-2 40 3 36-3 30 2 44-2 30 3 40-3 34 2 36-2 40 3 30-3 44 2 36-2 30 3 40-2 34 2 36-3 30 3 44-2 30 2 40-3 34 3 36-2 40 2 30-2 44 3 38-2L1200 10'
			/>
			<path
				fill='none'
				stroke='var(--lava-crack)'
				strokeWidth='1.2'
				vectorEffect='non-scaling-stroke'
				d='M60 22l20-6 18 5M210 22l14-5 22 4 10-3M380 22l18-6 16 6M560 22l22-5 14 3M720 22l16-6 20 5 12-2M900 22l20-5 16 5M1060 22l18-6 22 6'
			/>
		</svg>
	)
})

LavaSea.displayName = 'LavaSea'
export default LavaSea
