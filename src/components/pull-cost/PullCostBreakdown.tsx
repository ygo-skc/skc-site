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
	// the share who pull one for less than the average - more than half, since a few unlucky buyers pull the average up
	const belowAverage = chanceWithin(odds, odds.avgCases)

	const boxRaffle = formatCount(odds.avgCases * odds.boxesPerCase)
	// each note is a list of plain sentences - read by someone who has never met an average or a spread
	const tiles = [
		{
			label: 'Average cost',
			value: formatMoney(odds.avgCost),
			note: [
				`${formatCount(odds.avgCases)} cases.`,
				'Add up what every buyer spends to get one, then split it evenly.',
				`A few very unlucky buyers spend far more than everyone else and pull this up, so ${formatPeople(belowAverage)} in 100 buyers spend less than it.`,
			],
		},
		{
			label: 'Typical cost (median)',
			value: formatMoney(median * odds.caseCost),
			note: [
				`${formatCount(median)} cases.`,
				'Line up 100 buyers from luckiest to unluckiest - the one in the middle spends this. Half spend less, half spend more.',
				"It's lower than the average because the unlucky few don't pull it up, so it's the better number to plan around.",
			],
		},
		{
			label: 'Common range (middle half)',
			value: `${formatMoney(lowQuartile * odds.caseCost)} – ${formatMoney(highQuartile * odds.caseCost)}`,
			note: [
				`${formatCount(lowQuartile)} to ${formatCount(highQuartile)} cases.`,
				'In that same line of 100 buyers, the middle 50 spend somewhere in here.',
				'25 get lucky and spend less, and 25 spend more - some of them much more.',
			],
		},
		{
			label: 'How much results swing (standard deviation)',
			value: formatMoney(spread * odds.caseCost),
			note: [
				`${formatCount(spread)} cases.`,
				"How far one buyer's cost usually lands from the average, above or below.",
				spread >= odds.avgCases * 0.8
					? "Here it's about as big as the average itself, so two people chasing the same card can spend wildly different amounts - luck decides more than budget."
					: 'The bigger it is next to the average, the more luck decides what you pay.',
			],
		},
		{
			label: 'Odds per box',
			value: `1 in ${boxRaffle}`,
			note: [
				`A ${formatOdds(odds.boxOdds)} chance in every box.`,
				`Each box is a fresh draw, like a raffle with ${boxRaffle} tickets and one prize, so opening ${boxRaffle} boxes still doesn't promise one.`,
			],
		},
		{
			label: 'Odds per case',
			value: `1 in ${formatCount(odds.avgCases)}`,
			note: [`A ${formatOdds(odds.caseOdds)} chance in every case, drawn fresh each time.`, "Earlier empty cases don't make the next one any more likely."],
		},
	]

	const outcomeRows = [
		{ label: 'None', chance: outcomes.none, isNone: true },
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
					If 100 people each spent {formatMoney(spend)} on {formatCount(boxes)} boxes, {formatPeople(outcomes.none)} would pull none, {formatPeople(outcomes.one)} would pull
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
								{note.join(' ')}
							</Typography>
						</div>
					))}
				</dl>
				<Typography variant='body2' className='pull-cost__muted pull-cost__fine-print'>
					Past luck doesn&apos;t count: after {formatCount(Math.round(odds.avgCases))} empty cases, the next case is still 1 in {formatCount(odds.avgCases)}, so you&apos;re never
					&quot;due&quot; one. These are estimates that depend on your average being right, and they don&apos;t count what the other cards resell for.
				</Typography>
			</section>
		</>
	)
}

export default PullCostBreakdown
