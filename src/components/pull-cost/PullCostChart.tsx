import { FunctionComponent, PointerEvent, useMemo, useState } from 'react'
import { Slider, Typography } from '@mui/material'

import { chanceWithin, formatChance, formatCount, formatMoney, PullOdds } from './pullCostStats'

const SAMPLES = 60

type PullCostChartProps = {
	odds: PullOdds
	// what the budget buys, and the most cases the axis shows
	cases: number
	maxCases: number
	onCasesChange: (cases: number) => void
	sliderLabel: string
}

// chance of a pull by cases bought - a slider under the curve sets the budget, and hovering reads any point off it
const PullCostChart: FunctionComponent<PullCostChartProps> = ({ odds, cases, maxCases, onCasesChange, sliderLabel }) => {
	const [hoverCases, setHoverCases] = useState<number>()

	const curve = useMemo(() => {
		const points = Array.from({ length: SAMPLES + 1 }, (_, i) => {
			const chance = chanceWithin(odds, (i / SAMPLES) * maxCases)
			return `${((i / SAMPLES) * 100).toFixed(2)} ${(100 - chance * 100).toFixed(2)}`
		})
		return `M${points.join(' L')}`
	}, [odds, maxCases])

	const at = (value: number) => `${Math.min((value / maxCases) * 100, 100)}%`
	const height = (value: number) => `${100 - chanceWithin(odds, value) * 100}%`

	const onHover = (event: PointerEvent<HTMLDivElement>) => {
		if (event.pointerType !== 'mouse') return
		const { left, width } = event.currentTarget.getBoundingClientRect()
		setHoverCases(Math.round(((event.clientX - left) / width) * maxCases))
	}

	const scenarios = [
		{ label: 'Lucky', value: odds.avgCases / 2 },
		{ label: 'Average', value: odds.avgCases },
		{ label: 'Unlucky', value: odds.avgCases * 2 },
	]
	// a huge budget squeezes these together, so they go once they'd touch
	const isLabelled = maxCases <= odds.avgCases * 4

	return (
		// a mouse drag here never selects text - mui's slider doesn't cancel the selection a press starts, and it drags on pointer events, so it doesn't miss the mousedown
		<div className='pull-cost-chart' onMouseDown={(event) => event.preventDefault()}>
			<div
				className='pull-cost-chart__plot'
				role='img'
				aria-label={`Chance of a pull rises with spend: ${scenarios
					.map(({ label, value }) => `${label} ${formatMoney(value * odds.caseCost)}, ${formatChance(chanceWithin(odds, value))}`)
					.join('; ')}`}
				onPointerMove={onHover}
				onPointerLeave={() => setHoverCases(undefined)}
			>
				<span className='pull-cost-chart__grid' style={{ top: 0 }} />
				<span className='pull-cost-chart__grid' style={{ top: '50%' }} />
				<span className='pull-cost-chart__grid pull-cost-chart__grid--base' />
				<svg viewBox='0 0 100 100' preserveAspectRatio='none' aria-hidden='true'>
					<path className='pull-cost-chart__area' d={`${curve} L100 100 L0 100 Z`} />
					<path className='pull-cost-chart__line' d={curve} />
				</svg>
				{scenarios.map(({ label, value }) => (
					<span key={label} className='pull-cost-chart__ref' style={{ left: at(value) }} />
				))}
				<span className='pull-cost-chart__now' style={{ left: at(cases) }} />
				<span className='pull-cost-chart__dot' style={{ left: at(cases), top: height(cases) }} />
				<Typography variant='body2' component='span' className='pull-cost-chart__axis' style={{ top: 2 }}>
					100%
				</Typography>
				<Typography variant='body2' component='span' className='pull-cost-chart__axis' style={{ top: 'calc(50% + 2px)' }}>
					50%
				</Typography>
				{hoverCases !== undefined && (
					<div className={`pull-cost-chart__tip${hoverCases > maxCases * 0.6 ? ' pull-cost-chart__tip--left' : ''}`} style={{ left: at(hoverCases) }}>
						<Typography variant='subtitle2' component='p'>
							{formatChance(chanceWithin(odds, hoverCases))} chance
						</Typography>
						<Typography variant='body2' component='p'>
							{formatMoney(hoverCases * odds.caseCost)} · {formatCount(hoverCases)} cases
						</Typography>
					</div>
				)}
			</div>

			<Slider
				className='pull-cost-chart__slider'
				min={0}
				max={maxCases}
				step={1}
				value={Math.round(cases)}
				aria-label={sliderLabel}
				getAriaValueText={(value) => `${formatCount(value)} cases, ${formatMoney(value * odds.caseCost)}`}
				onChange={(_, value) => onCasesChange(value as number)}
			/>

			{isLabelled && (
				<div className='pull-cost-chart__labels' aria-hidden='true'>
					{scenarios.map(({ label, value }) => (
						<Typography key={label} variant='body2' component='span' style={{ left: at(value) }}>
							{label}
						</Typography>
					))}
				</div>
			)}
		</div>
	)
}

export default PullCostChart
