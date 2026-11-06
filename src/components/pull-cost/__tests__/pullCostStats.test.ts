import {
	boxesForBudget,
	boxesForChance,
	casesForChance,
	casesToCollectAll,
	chanceWithin,
	formatChance,
	formatOdds,
	formatPeople,
	oddsOfOneCard,
	outcomesWithin,
	PullOdds,
	readOdds,
	standardDeviation,
} from '../pullCostStats'

const odds = readOdds('334', 4, '40') as PullOdds

test('verify odds match the spreadsheet', () => {
	expect(odds.caseCost).toBe(1336)
	expect(odds.avgCost).toBe(53440)
	expect(odds.avgCost / 2).toBe(26720)
	expect(odds.avgCost * 2).toBe(106880)
	expect(odds.boxOdds).toBeCloseTo(0.00625)
	expect(odds.caseOdds).toBeCloseTo(0.025)
	expect(formatOdds(odds.boxOdds)).toBe('0.625%')
})

test('verify numbers that make no cost give no odds', () => {
	expect(readOdds('', 4, '40')).toBeUndefined()
	expect(readOdds('334', 4, '')).toBeUndefined()
	expect(readOdds('-1', 4, '40')).toBeUndefined()
	expect(readOdds('334', 4, '0.5')).toBeUndefined()
})

test('verify chance of a pull by cases bought', () => {
	expect(chanceWithin(odds, 0)).toBe(0)
	expect(chanceWithin(odds, 20)).toBeCloseTo(0.397, 3)
	expect(chanceWithin(odds, 40)).toBeCloseTo(0.637, 3)
	expect(chanceWithin(odds, 80)).toBeCloseTo(0.868, 3)
})

test('verify cases needed for a chance', () => {
	expect(casesForChance(odds, 0.25)).toBe(12)
	expect(casesForChance(odds, 0.5)).toBe(28)
	expect(casesForChance(odds, 0.75)).toBe(55)
	expect(casesForChance(odds, 0.95)).toBe(119)
	expect(chanceWithin(odds, casesForChance(odds, 0.5))).toBeGreaterThanOrEqual(0.5)
	expect(chanceWithin(odds, casesForChance(odds, 0.5) - 1)).toBeLessThan(0.5)
})

test('verify boxes needed for a chance land on it instead of a case past it', () => {
	expect(boxesForChance(odds, 0.5)).toBe(110)
	expect(boxesForChance(odds, 0.75)).toBe(220)
	expect(boxesForChance(odds, 0.9)).toBe(364)
	expect(boxesForChance(odds, 0.95)).toBe(474)
	expect(chanceWithin(odds, boxesForChance(odds, 0.5) / 4)).toBeGreaterThanOrEqual(0.5)
	expect(chanceWithin(odds, (boxesForChance(odds, 0.5) - 1) / 4)).toBeLessThan(0.5)
	expect(boxesForChance(readOdds('100', 4, '1') as PullOdds, 0.95)).toBe(1)
})

test('verify a guaranteed pull', () => {
	const certain = readOdds('100', 4, '1') as PullOdds
	expect(chanceWithin(certain, 1)).toBe(1)
	expect(chanceWithin(certain, 0)).toBe(0)
	expect(casesForChance(certain, 0.95)).toBe(1)
	expect(standardDeviation(certain)).toBe(0)
	expect(outcomesWithin(certain, 4).none).toBe(0)
})

test('verify boxes a budget buys, without float division losing one', () => {
	expect(boxesForBudget(odds, 1000)).toBe(2)
	expect(boxesForBudget(readOdds('33.99', 4, '40') as PullOdds, 135.96)).toBe(4)
})

test('verify outcomes add up and agree with the chance of a pull', () => {
	const { none, one, more } = outcomesWithin(odds, 160)
	expect(none + one + more).toBeCloseTo(1)
	expect(none).toBeCloseTo(1 - chanceWithin(odds, 40))
	expect(one).toBeGreaterThan(more)
	expect(outcomesWithin(odds, 0)).toEqual({ none: 1, one: 0, more: 0 })
})

test('verify chances read as people without rounding to nobody or everybody', () => {
	expect(formatPeople(0)).toBe('none')
	expect(formatPeople(0.004)).toBe('fewer than 1')
	expect(formatPeople(0.637)).toBe('about 64')
	expect(formatPeople(0.996)).toBe('more than 99')
	expect(formatPeople(1)).toBe('all')
})

test('verify the odds of one card out of several', () => {
	const oneCard = oddsOfOneCard(odds, 18)
	expect(oneCard.avgCases).toBe(720)
	expect(oneCard.avgCost).toBe(961920)
	expect(oneCard.caseOdds).toBeCloseTo(0.025 / 18)
	expect(chanceWithin(oneCard, 40)).toBeCloseTo(0.054, 3)
	expect(oddsOfOneCard(odds, 1)).toEqual(odds)
})

test('verify cases to collect every card, duplicates included', () => {
	expect(casesToCollectAll(odds, 1)).toBe(40)
	expect(casesToCollectAll(odds, 2)).toBeCloseTo(120)
	expect(casesToCollectAll(odds, 18)).toBeCloseTo(2516.5, 0)
})

test('verify the spread is about the size of the average', () => {
	expect(standardDeviation(odds)).toBeCloseTo(39.5, 1)
})

test('verify chances never round to a false certainty', () => {
	expect(formatChance(0)).toBe('0%')
	expect(formatChance(1)).toBe('100%')
	expect(formatChance(0.637)).toBe('64%')
	expect(formatChance(0.001)).toBe('0.1%')
	expect(formatChance(0.0001)).toBe('0.1%')
	expect(formatChance(0.9996)).toBe('99.9%')
})
