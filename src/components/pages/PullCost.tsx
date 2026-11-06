import { FunctionComponent, ReactNode, useEffect, useId, useState } from 'react'
import { ButtonBase, IconButton, InputBase, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery, useTheme } from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'

import '../../css/main-pages/pull-cost.css'
import Breadcrumb from '../header-footer/Breadcrumb'
import { useHistoryEntryState } from '../util/useHistoryEntry'
import PullCostChart from '../pull-cost/PullCostChart'
import PullCostBreakdown from '../pull-cost/PullCostBreakdown'
import PullCostChaseCards from '../pull-cost/PullCostChaseCards'
import { boxesForBudget, casesForChance, chanceWithin, formatChance, formatCount, formatMoney, formatPeople, outcomesWithin, readOdds } from '../pull-cost/pullCostStats'

const BOXES_PER_CASE = [4, 6, 12, 24]

// numbers stay as typed, so a field can be empty on the way to a new value. An empty budget follows the average cost
const initialInputs = {
	product: 'Magnificent Monsters',
	rarity: 'GMR',
	boxCost: '334.00',
	boxesPerCase: 4,
	avgCases: '40',
	budget: '',
	uniqueCards: '18',
	lowestSingle: '',
	highestSingle: '',
}

type FieldProps = {
	label: string
	value: string
	onChange: (value: string) => void
	isMoney?: boolean
	isNumber?: boolean
	// dollars and cents - two decimals at most while typing, filled out to two on leaving the field
	isCents?: boolean
	// whole numbers from 1, with - and + buttons beside them
	isStepper?: boolean
	placeholder?: string
}

const CENTS = /^\d*(\.\d{0,2})?$/
const WHOLE = /^\d*$/
// keys a number field takes that a whole number can't use - a number input lets them through and reads the half-typed value as empty
const NOT_WHOLE = new Set(['.', ',', 'e', 'E', '+', '-'])

const Field: FunctionComponent<FieldProps> = ({ label, value, onChange, isMoney, isNumber, isCents, isStepper, placeholder }) => {
	const id = useId()
	const count = Math.max(parseInt(value, 10) || 1, 1)
	const pattern = isCents ? CENTS : isStepper ? WHOLE : undefined
	return (
		<div className='pull-cost-field'>
			<Typography variant='subtitle2' component='label' htmlFor={id} className='pull-cost__muted'>
				{label}
			</Typography>
			<Typography variant='body1' component='div' className='pull-cost-field__box'>
				{isMoney && <span aria-hidden='true'>$</span>}
				<InputBase
					fullWidth
					id={id}
					type={isNumber ? 'number' : 'text'}
					value={value}
					placeholder={placeholder}
					onChange={(event) => (!pattern || pattern.test(event.target.value)) && onChange(event.target.value)}
					onKeyDown={(event) => isStepper && NOT_WHOLE.has(event.key) && event.preventDefault()}
					onBlur={() => isCents && value !== '' && onChange(parseFloat(value).toFixed(2))}
					inputProps={isNumber ? { min: isStepper ? 1 : 0, step: isCents ? 0.01 : 1, inputMode: isCents ? 'decimal' : 'numeric' } : { maxLength: 80 }}
				/>
				{isStepper && (
					<span className='pull-cost-field__stepper'>
						<IconButton size='small' aria-label={`Fewer ${label.toLowerCase()}`} disabled={count <= 1} onClick={() => onChange(String(count - 1))}>
							<RemoveRoundedIcon />
						</IconButton>
						<IconButton size='small' aria-label={`More ${label.toLowerCase()}`} onClick={() => onChange(String(count + 1))}>
							<AddRoundedIcon />
						</IconButton>
					</span>
				)}
			</Typography>
		</div>
	)
}

// "an" before a vowel sound. Rarities in capitals are read letter by letter (an SR, a UR, a GMR), so it's the letter's name that counts; words go by their first letter (an Ultimate Rare)
const article = (word: string) => ((/^[A-Z]{2,}\b/.test(word) ? /^[AEFHILMNORSX]/ : /^[aeiou]/i).test(word) ? 'an' : 'a')

/*
 * How much a chase card costs to pull, and how sure that spend makes you. The reader's numbers go in the side column; the rest of
 * the page is worked out from them during render, so going back lands at the same height with the same picks
 */
const PullCost: FunctionComponent = () => {
	const [inputs, setInputs] = useHistoryEntryState('pullCost', initialInputs)
	const { product, rarity, boxCost, boxesPerCase, avgCases, budget, uniqueCards, lowestSingle, highestSingle } = inputs
	const change = (changed: Partial<typeof initialInputs>) => setInputs((current) => ({ ...current, ...changed }))

	const odds = readOdds(boxCost, boxesPerCase, avgCases)
	const target = rarity.trim() === '' ? 'the card' : `${article(rarity.trim())} ${rarity.trim()}`
	// phones put the answer before the inputs, under the page's title
	const isPhone = useMediaQuery(useTheme().breakpoints.down('md'), { noSsr: true })
	let headlineText = ''

	let results: ReactNode = (
		<section className='pull-cost__sheet'>
			<Typography variant='h6' component='h2'>
				Your odds show up here
			</Typography>
			<Typography variant='body1' className='pull-cost__muted'>
				Enter the cost of a box and the average cases it takes to pull one (at least 1).
			</Typography>
		</section>
	)

	if (odds) {
		const spend = budget === '' ? odds.avgCost : Math.max(parseFloat(budget) || 0, 0)
		const boxes = boxesForBudget(odds, spend)
		const cases = boxes / odds.boxesPerCase
		const chance = chanceWithin(odds, cases)
		// wide enough to reach 95% sure, and further if the budget goes past it
		const maxCases = Math.max(casesForChance(odds, 0.95), Math.ceil(cases), 1)
		const spendOnCases = (picked: number) => change({ budget: String(Math.round(picked * odds.caseCost * 100) / 100) })
		headlineText = `${formatChance(chance)} chance of ${target}`

		const scenarios = [
			{ label: 'Lucky, half the average cost', scale: 0.5 },
			{ label: 'Average cost', scale: 1 },
			{ label: 'Unlucky, double the average cost', scale: 2 },
		]

		results = (
			<>
				<section className='pull-cost__sheet' aria-labelledby='pull-cost-chance'>
					<div>
						<Typography variant='subtitle2' className='pull-cost__eyebrow'>
							{[product.trim(), rarity.trim()].filter(Boolean).join(' · ')}
						</Typography>
						<Typography variant='h1' component='h2' id='pull-cost-chance'>
							{headlineText}
						</Typography>
						<Typography variant='body1' className='pull-cost__muted'>
							{formatMoney(boxes * odds.boxCost)} buys {formatCount(boxes)} boxes ({formatCount(cases)} cases). If 100 people each spent this, {formatPeople(chance)} would pull{' '}
							{target} and {formatPeople(outcomesWithin(odds, boxes).none)} would pull nothing.
						</Typography>
					</div>

					<Field label='Your budget' value={budget} onChange={(value) => change({ budget: value })} isMoney isNumber placeholder={String(Math.round(odds.avgCost))} />

					<PullCostChart odds={odds} cases={cases} maxCases={maxCases} onCasesChange={spendOnCases} sliderLabel='Cases you can afford' />

					<Typography variant='body2' className='pull-cost__muted'>
						Further right is more money spent, higher is a better chance. The line flattens because each extra case only helps if you haven&apos;t pulled one yet.
					</Typography>

					<div className='pull-cost__scenarios'>
						{scenarios.map(({ label, scale }) => {
							// in whole boxes, as a budget buys them, so the button shows what clicking it spends and the chance the headline then reads
							const scenarioBoxes = Math.round(odds.avgCases * scale * odds.boxesPerCase)
							const scenarioCases = scenarioBoxes / odds.boxesPerCase
							return (
								<ButtonBase key={label} className='pull-cost__scenario' aria-pressed={boxes === scenarioBoxes} onClick={() => spendOnCases(scenarioCases)}>
									<Typography variant='subtitle2' component='span'>
										{label}
									</Typography>
									<Typography variant='h6' component='span'>
										{formatMoney(scenarioBoxes * odds.boxCost)}
									</Typography>
									<Typography variant='body2' component='span'>
										{formatCount(scenarioCases)} cases. {formatChance(chanceWithin(odds, scenarioCases))} chance of a pull by here.
									</Typography>
								</ButtonBase>
							)
						})}
					</div>
				</section>

				<PullCostChaseCards
					odds={odds}
					rarity={rarity.trim()}
					uniqueCards={Math.max(parseInt(uniqueCards, 10) || 1, 1)}
					lowest={parseFloat(lowestSingle) || 0}
					highest={parseFloat(highestSingle) || 0}
					cases={cases}
					spend={boxes * odds.boxCost}
				/>

				<PullCostBreakdown odds={odds} boxes={boxes} spend={boxes * odds.boxCost} onPickCases={spendOnCases} />
			</>
		)
	}

	// starts on the shown headline, so arriving (or coming back) announces nothing
	const [announcement, setAnnouncement] = useState(headlineText)
	useEffect(() => {
		const timer = setTimeout(() => setAnnouncement(headlineText), 800)
		return () => clearTimeout(timer)
	}, [headlineText])

	const title = (
		<div>
			<Typography variant='subtitle2' className='pull-cost__eyebrow'>
				Utilities
			</Typography>
			<Typography variant='h4' component='h1'>
				Pull cost calculator
			</Typography>
			{odds && (
				<Typography variant='body2' className='pull-cost__muted'>
					{formatMoney(odds.caseCost)} a case
				</Typography>
			)}
		</div>
	)

	const inputColumn = (
		<aside className='pull-cost__side' aria-label='Your numbers'>
			{!isPhone && title}

			<Field label='Product' value={product} onChange={(value) => change({ product: value })} />
			<Field label='Chase rarity' value={rarity} onChange={(value) => change({ rarity: value })} />
			<Field label='Cost of a sealed box' value={boxCost} onChange={(value) => change({ boxCost: value })} isMoney isNumber isCents />

			<div className='pull-cost-field'>
				<Typography variant='subtitle2' component='span' className='pull-cost__muted' id='pull-cost-per-case'>
					Boxes per case
				</Typography>
				<ToggleButtonGroup
					exclusive
					fullWidth
					className='pull-cost__per-case'
					aria-labelledby='pull-cost-per-case'
					value={boxesPerCase}
					onChange={(_, value) => value !== null && change({ boxesPerCase: value })}
				>
					{BOXES_PER_CASE.map((value) => (
						<ToggleButton key={value} value={value}>
							<Typography variant='body2' component='span'>
								{value}
							</Typography>
						</ToggleButton>
					))}
				</ToggleButtonGroup>
			</div>

			<Field label='Average cases to pull one' value={avgCases} onChange={(value) => change({ avgCases: value })} isNumber />
			<Field label='Unique cards at this rarity' value={uniqueCards} onChange={(value) => change({ uniqueCards: value })} isNumber isStepper />
			<div className='pull-cost__price-pair'>
				<Field label='Lowest single' value={lowestSingle} onChange={(value) => change({ lowestSingle: value })} isMoney isNumber isCents />
				<Field label='Highest single' value={highestSingle} onChange={(value) => change({ highestSingle: value })} isMoney isNumber isCents />
			</div>
		</aside>
	)

	const answer = <div className='pull-cost__results'>{results}</div>

	return (
		<div className='generic-container'>
			<title>{`SKC - Pull Cost`}</title>
			<meta name='description' content='See what it really costs to pull a chase rarity Yu-Gi-Oh! card, and your chances at any budget.' />
			<Breadcrumb crumbs={['Home', 'Pull Cost']} />
			{/* the headline after a settling pause, not on every keystroke or slider step - the slider reads out its own value */}
			<Typography variant='body2' role='status' className='visually-hidden'>
				{announcement}
			</Typography>

			{isPhone ? (
				<div className='pull-cost'>
					<div className='pull-cost__side'>{title}</div>
					{answer}
					{inputColumn}
				</div>
			) : (
				<div className='pull-cost'>
					{inputColumn}
					{answer}
				</div>
			)}
		</div>
	)
}

export default PullCost
