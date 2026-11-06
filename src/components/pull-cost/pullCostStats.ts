/*
 * The odds behind the pull cost page. The reader supplies the average cases it takes to pull the card (E), which makes each case a
 * 1 in E draw that doesn't remember the ones before it - a geometric distribution. Boxes share a case's odds evenly, so any budget works
 */
export type PullOdds = {
	boxCost: number
	boxesPerCase: number
	avgCases: number
	caseCost: number
	avgCost: number
	boxOdds: number
	caseOdds: number
}

export type PullOutcomes = { none: number; one: number; more: number }

// undefined until the numbers can make a cost - below 1 case on average isn't a chase card
export function readOdds(boxCost: string, boxesPerCase: number, avgCases: string): PullOdds | undefined {
	const box = parseFloat(boxCost)
	const cases = parseFloat(avgCases)
	if (!(box > 0) || !(boxesPerCase > 0) || !(cases >= 1)) return undefined

	const caseCost = box * boxesPerCase
	return {
		boxCost: box,
		boxesPerCase,
		avgCases: cases,
		caseCost,
		avgCost: caseCost * cases,
		boxOdds: 1 / cases / boxesPerCase,
		caseOdds: 1 / cases,
	}
}

// chance of at least one pull within this many cases
export const chanceWithin = (odds: PullOdds, cases: number) => 1 - (1 - odds.caseOdds) ** cases

// the fewest whole cases that reach a chance - 0.5 is the median
export function casesForChance(odds: PullOdds, chance: number) {
	if (odds.caseOdds === 1) return 1
	return Math.ceil(Math.log(1 - chance) / Math.log(1 - odds.caseOdds))
}

// the fewest whole boxes that reach a chance - finer than cases, so the spend lands on the chance instead of a case past it
export function boxesForChance(odds: PullOdds, chance: number) {
	const perBox = 1 - (1 - odds.caseOdds) ** (1 / odds.boxesPerCase)
	if (perBox === 1) return 1
	// the nudge keeps float error on a box count that's exact from rounding up a box past it
	return Math.ceil(Math.log(1 - chance) / Math.log(1 - perBox) - 1e-9)
}

// the small nudge keeps float division (135.96 / 33.99) from losing a box the budget covers exactly
export const boxesForBudget = (odds: PullOdds, budget: number) => Math.floor(budget / odds.boxCost + 1e-9)

// how many times the card turns up in this many boxes (binomial)
export function outcomesWithin(odds: PullOdds, boxes: number): PullOutcomes {
	const perBox = 1 - (1 - odds.caseOdds) ** (1 / odds.boxesPerCase)
	const none = (1 - perBox) ** boxes
	const one = boxes === 0 ? 0 : boxes * perBox * (1 - perBox) ** (boxes - 1)
	return { none, one, more: Math.max(0, 1 - none - one) }
}

// the odds of one card out of several at the same rarity, each as likely as the others
export function oddsOfOneCard(odds: PullOdds, uniqueCards: number): PullOdds {
	return {
		...odds,
		avgCases: odds.avgCases * uniqueCards,
		avgCost: odds.avgCost * uniqueCards,
		boxOdds: odds.boxOdds / uniqueCards,
		caseOdds: odds.caseOdds / uniqueCards,
	}
}

// the coupon collector's problem - the last few cards take the longest since most pulls are duplicates by then
export function casesToCollectAll(odds: PullOdds, uniqueCards: number) {
	let pulls = 0
	for (let i = 1; i <= uniqueCards; i++) pulls += uniqueCards / i
	return pulls * odds.avgCases
}

// in cases - a geometric distribution's spread is about as large as its average
export const standardDeviation = (odds: PullOdds) => Math.sqrt(1 - odds.caseOdds) / odds.caseOdds

export const formatMoney = (value: number) => `$${Math.round(value).toLocaleString('en-US')}`

export const formatCount = (value: number) => parseFloat(value.toFixed(1)).toLocaleString('en-US')

// whole percents, with a decimal at the ends - anything short of certain never rounds to 0% or 100%
export function formatChance(chance: number) {
	if (chance <= 0 || chance >= 1) return `${Math.round(chance * 100)}%`
	if (chance < 0.01) return `${Math.max(chance * 100, 0.1).toFixed(1)}%`
	if (chance > 0.99) return `${Math.min(chance * 100, 99.9).toFixed(1)}%`
	return `${Math.round(chance * 100)}%`
}

// a chance as people out of 100, which reads easier than a percent - never rounds something possible down to nobody
export function formatPeople(chance: number) {
	if (chance <= 0) return 'none'
	if (chance >= 1) return 'all'
	if (chance < 0.01) return 'fewer than 1'
	if (chance > 0.99) return 'more than 99'
	return `about ${Math.round(chance * 100)}`
}

// the odds as the spreadsheet shows them - 0.625%
export const formatOdds = (odds: number) => `${parseFloat((odds * 100).toFixed(3))}%`

// "an" before a vowel sound. Rarities in capitals are read letter by letter (an SR, a UR, a GMR), so it's the letter's name that counts; words go by their first letter (an Ultimate Rare)
export const article = (word: string) => ((/^[A-Z]{2,}\b/.test(word) ? /^[AEFHILMNORSX]/ : /^[aeiou]/i).test(word) ? 'an' : 'a')
