import { FunctionComponent } from 'react'
import { Typography } from '@mui/material'

import { article, casesToCollectAll, chanceWithin, formatChance, formatCount, formatMoney, oddsOfOneCard, PullOdds } from './pullCostStats'

type PullCostChaseCardsProps = {
	odds: PullOdds
	rarity: string
	uniqueCards: number
	// the cheapest and priciest singles, 0 until entered
	lowest: number
	highest: number
	// what the budget buys
	cases: number
	spend: number
}

// the average is for any card at the rarity, but a set can have several at very different prices - which one you pull decides what it was worth
const PullCostChaseCards: FunctionComponent<PullCostChaseCardsProps> = ({ odds, rarity, uniqueCards, lowest, highest, cases, spend }) => {
	const isSeveral = uniqueCards > 1
	const name = rarity || 'card'
	const oneCard = oddsOfOneCard(odds, uniqueCards)
	const collectCases = casesToCollectAll(odds, uniqueCards)

	const low = lowest > 0 && highest > 0 ? Math.min(lowest, highest) : 0
	const high = lowest > 0 && highest > 0 ? Math.max(lowest, highest) : 0
	const prices = [
		{ label: 'Lowest single', price: low || lowest },
		{ label: 'Highest single', price: high || highest },
	].filter(({ price }) => price > 0)
	const expected = cases / odds.avgCases
	const worth = prices.map(({ price }) => formatMoney(expected * price)).join(' – ')

	if (!isSeveral && prices.length === 0) return null

	return (
		<section className='pull-cost__sheet' aria-labelledby='pull-cost-which'>
			<Typography variant='h6' component='h2' id='pull-cost-which'>
				Which one you pull
			</Typography>
			{isSeveral && (
				<Typography variant='body2' className='pull-cost__muted'>
					Your {formatCount(odds.avgCases)} case average is for pulling any one of the {formatCount(uniqueCards)} {name}s. Wanting one particular {name} is much harder, since only
					1 in {formatCount(uniqueCards)} of the {name}s you pull is that one. These figures assume every {name} is equally likely to turn up.
				</Typography>
			)}

			<dl className='pull-cost__tiles'>
				{isSeveral && (
					<>
						<div className='pull-cost__tile'>
							<Typography variant='subtitle2' component='dt' className='pull-cost__muted'>
								One specific {name}
							</Typography>
							<Typography variant='h6' component='dd'>
								{formatMoney(oneCard.avgCost)}
							</Typography>
							<Typography variant='body2' component='dd' className='pull-cost__muted'>
								{formatCount(oneCard.avgCases)} cases on average, {formatCount(uniqueCards)} times as many, to hit the exact one you want. Your budget has a{' '}
								{formatChance(chanceWithin(oneCard, cases))} chance of it.
							</Typography>
						</div>
						<div className='pull-cost__tile'>
							<Typography variant='subtitle2' component='dt' className='pull-cost__muted'>
								All {formatCount(uniqueCards)} {name}s
							</Typography>
							<Typography variant='h6' component='dd'>
								{formatMoney(collectCases * odds.caseCost)}
							</Typography>
							<Typography variant='body2' component='dd' className='pull-cost__muted'>
								{formatCount(collectCases)} cases on average. The first few come quickly, but the last ones take longest: by then most {name}s you pull are copies you already have.
							</Typography>
						</div>
					</>
				)}

				{prices.map(({ label, price }) => {
					const casesAtPrice = price / odds.caseCost
					return (
						<div key={label} className='pull-cost__tile'>
							<Typography variant='subtitle2' component='dt' className='pull-cost__muted'>
								{label}
							</Typography>
							<Typography variant='h6' component='dd'>
								{formatMoney(price)}
							</Typography>
							<Typography variant='body2' component='dd' className='pull-cost__muted'>
								Buying this card on its own costs {formatChance(price / odds.avgCost)} of what pulling {article(name)} {name} costs on average. Spend the same {formatMoney(price)}{' '}
								on boxes instead and you&apos;d have a {formatChance(chanceWithin(odds, casesAtPrice))} chance of any {name}
								{isSeveral && `, and only a ${formatChance(chanceWithin(oneCard, casesAtPrice))} chance of this exact card`}.
							</Typography>
						</div>
					)
				})}

				{prices.length > 0 && (
					<div className='pull-cost__tile'>
						<Typography variant='subtitle2' component='dt' className='pull-cost__muted'>
							What your budget&apos;s pulls are worth
						</Typography>
						<Typography variant='h6' component='dd'>
							{worth}
						</Typography>
						<Typography variant='body2' component='dd' className='pull-cost__muted'>
							If 100 people each spent {formatMoney(spend)}, together they&apos;d pull about {formatCount(expected * 100)} {name}s - some none, a few two or more. Shared out,
							that&apos;s {expected.toFixed(2)} each, worth this much at the {prices.length > 1 ? 'lowest and highest prices' : 'price you entered'}. The other cards you open are
							extra.
						</Typography>
					</div>
				)}
			</dl>

			{prices.length === 0 && (
				<Typography variant='body2' className='pull-cost__muted'>
					Add the lowest and highest single prices to see what a pull is worth.
				</Typography>
			)}
		</section>
	)
}

export default PullCostChaseCards
