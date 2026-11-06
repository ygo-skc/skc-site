import { FunctionComponent } from 'react'
import { ButtonBase, Typography } from '@mui/material'

import { boxesForChance, chanceWithin, formatChance, formatCount, formatMoney, formatOdds, formatPeople, outcomesWithin, PullOdds, standardDeviation } from './pullCostStats'

const CONFIDENCE_LEVELS = [0.5, 0.75, 0.9, 0.95]

type PullCostBreakdownProps = {
	odds: PullOdds
	// what the budget buys
	boxes: number
	spend: number
	onPickCases: (cases: number) => void
}

const PullCostBreakdown: FunctionComponent<PullCostBreakdownProps> = ({ odds, boxes, spend, onPickCases }) => {
	const outcomes = outcomesWithin(odds, boxes)
	// in whole boxes, as a budget buys them - whole cases overshoot (28 cases is 51%, not 50%)
	const casesForChance = (chance: number) => boxesForChance(odds, chance) / odds.boxesPerCase
	const median = casesForChance(0.5)
	const lowQuartile = casesForChance(0.25)
	const highQuartile = casesForChance(0.75)
	const spread = standardDeviation(odds)

	const tiles = [
		{
			label: 'Average cost',
			value: formatMoney(odds.avgCost),
			note: `${formatCount(odds.avgCases)} cases. What everyone spends, shared out evenly. A few very unlucky buyers drag it up, so most people spend less.`,
		},
		{
			label: 'Typical cost (median)',
			value: formatMoney(median * odds.caseCost),
			note: `${formatCount(median)} cases. Half of buyers spend less than this and half spend more, so it's a fairer number to plan around.`,
		},
		{
			label: 'Common range (middle half)',
			value: `${formatMoney(lowQuartile * odds.caseCost)} – ${formatMoney(highQuartile * odds.caseCost)}`,
			note: `${formatCount(lowQuartile)} to ${formatCount(highQuartile)} cases. Half of all buyers land in this range. A quarter get there sooner and a quarter need longer.`,
		},
		{
			label: 'How much results swing (standard deviation)',
			value: formatMoney(spread * odds.caseCost),
			note: `${formatCount(spread)} cases. How far results tend to land from the average. The bigger it is, the more luck decides what you pay.`,
		},
		{ label: 'Odds per box', value: `1 in ${formatCount(odds.avgCases * odds.boxesPerCase)}`, note: `${formatOdds(odds.boxOdds)}. The chance each box you open has it.` },
		{ label: 'Odds per case', value: `1 in ${formatCount(odds.avgCases)}`, note: `${formatOdds(odds.caseOdds)}. The chance each case you open has it.` },
	]

	const outcomeRows = [
		{ label: 'Nothing', chance: outcomes.none, isNone: true },
		{ label: 'Exactly one', chance: outcomes.one },
		{ label: 'Two or more', chance: outcomes.more },
	]

	return (
		<>
			<section className='pull-cost__sheet' aria-labelledby='pull-cost-sure'>
				<Typography variant='h6' component='h2' id='pull-cost-sure'>
					How much to spend for a given chance
				</Typography>
				<Typography variant='body2' className='pull-cost__muted'>
					A 90% chance means about 90 of every 100 people spending that much would pull one, and about 10 still wouldn&apos;t. No budget is a guarantee. Pick a row to use it as
					your budget.
				</Typography>
				<ul className='pull-cost__sure'>
					{CONFIDENCE_LEVELS.map((level) => {
						const cases = casesForChance(level)
						return (
							<li key={level}>
								<ButtonBase className='pull-cost__sure-row' onClick={() => onPickCases(cases)}>
									<Typography variant='subtitle1' component='span'>
										{formatChance(chanceWithin(odds, cases))} chance
									</Typography>
									<Typography variant='body2' component='span' className='pull-cost__muted'>
										{formatCount(cases)} cases
									</Typography>
									<Typography variant='subtitle1' component='span'>
										{formatMoney(cases * odds.caseCost)}
									</Typography>
								</ButtonBase>
							</li>
						)
					})}
				</ul>
			</section>

			<section className='pull-cost__sheet' aria-labelledby='pull-cost-outcomes'>
				<Typography variant='h6' component='h2' id='pull-cost-outcomes'>
					What your budget might get you
				</Typography>
				<Typography variant='body2' className='pull-cost__muted'>
					If 100 people each spent {formatMoney(spend)} on {formatCount(boxes)} boxes, {formatPeople(outcomes.none)} would pull nothing, {formatPeople(outcomes.one)} would pull
					exactly one and {formatPeople(outcomes.more)} would pull two or more.
				</Typography>
				<div className='pull-cost__outcomes'>
					{outcomeRows.map(({ label, chance, isNone }) => (
						<div key={label} className='pull-cost__outcome'>
							<Typography variant='body2' component='span'>
								{label}
							</Typography>
							<span className='pull-cost__outcome-track' aria-hidden='true'>
								<span className={`pull-cost__outcome-bar${isNone ? ' pull-cost__outcome-bar--none' : ''}`} style={{ width: `${chance * 100}%` }} />
							</span>
							<Typography variant='subtitle2' component='span'>
								{formatChance(chance)}
							</Typography>
						</div>
					))}
				</div>
			</section>

			<section className='pull-cost__sheet' aria-labelledby='pull-cost-numbers'>
				<Typography variant='h6' component='h2' id='pull-cost-numbers'>
					The numbers, explained
				</Typography>
				<dl className='pull-cost__tiles'>
					{tiles.map(({ label, value, note }) => (
						<div key={label} className='pull-cost__tile'>
							<Typography variant='subtitle2' component='dt' className='pull-cost__muted'>
								{label}
							</Typography>
							<Typography variant='h6' component='dd'>
								{value}
							</Typography>
							<Typography variant='body2' component='dd' className='pull-cost__muted'>
								{note}
							</Typography>
						</div>
					))}
				</dl>
				<Typography variant='body2' className='pull-cost__muted pull-cost__fine-print'>
					Past luck doesn&apos;t count: after {formatCount(median)} empty cases, the next case is still 1 in {formatCount(odds.avgCases)}, so you&apos;re never &quot;due&quot; one.
					These are estimates that depend on your average being right, and they don&apos;t count what the other cards resell for.
				</Typography>
			</section>
		</>
	)
}

export default PullCostBreakdown
