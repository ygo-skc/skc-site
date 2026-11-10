import { byRarity, setNumber } from '../../product/productFilters'
import * as Dates from '../../../helper/Dates'
import { toBanStatus } from '../../../helper/BanStatus'

export type Printing = { date: string; productName: string }

// one set number the card was printed under in a rarity, e.g. MZMU-EN000 in Maze of Muertos
export type RarityPrinting = { productId: string; productName: string; date: string; setNumber: string }

export type RarityPrintings = { rarity: string; printings: RarityPrinting[] }

// where a card stands in a format - its lists newest first and, when the format's list dates are known, whether it's on the current
// list (current), the first list it was off again (offSince), and how far back the lists reach (since)
export type FormatStanding = {
	lists: YGOCard.RestrictionStatus[]
	latest?: YGOCard.RestrictionStatus
	current?: YGOCard.RestrictionStatus
	offSince?: string
	since?: string
}

export type FormatHistory = FormatStanding & { format: 'TCG' | 'MD' }

// "Nov 2015" - how far back a format's lists reach
export const monthYear = (date: string) => {
	const day = Dates.fromYYYYMMDDToDate(date)
	return `${Dates.getMonth(day)} ${Dates.getYear(day)}`
}

// the status as the ban list page spells it ("Semi Limited" -> "Semi-Limited"), or as the API sent it
export const statusLabel = ({ banStatus }: YGOCard.RestrictionStatus) => toBanStatus(banStatus) ?? banStatus

// the restrictions only hold the lists the card was on, so standing now comes from the format's own dates (newest first)
export const formatStanding = (restrictions: YGOCard.RestrictionStatus[], listDates: string[] = []): FormatStanding => {
	const lists = [...restrictions].sort((a, b) => b.banListDate.localeCompare(a.banListDate))
	const latest = lists[0]
	if (listDates.length === 0) return { lists, latest }

	const current = latest?.banListDate === listDates[0] ? latest : undefined
	const offSince = latest && !current ? listDates.filter((date) => date > latest.banListDate).sort()[0] : undefined
	return { lists, latest, current, offSince, since: listDates[listDates.length - 1] }
}

export type CardGlance = {
	printings: number
	products: number
	first?: Printing
	last?: Printing
	rarities: RarityPrintings[]
	banLists: FormatHistory[]
}

// "Effect Monster · Fire · Level 10", "Pendulum Effect Monster · Dark · Level 4", "Spell Card"
export const cardEyebrow = ({ cardColor, cardAttribute, monsterAssociation }: YGOCard.Deets): string => {
	const color = (cardColor as string | undefined) ?? ''
	if (/^(spell|trap)$/i.test(color)) return `${color} Card`
	if (/^token$/i.test(color)) return 'Token'

	const tier =
		monsterAssociation?.level !== undefined
			? `Level ${monsterAssociation.level}`
			: monsterAssociation?.rank !== undefined
			? `Rank ${monsterAssociation.rank}`
			: monsterAssociation?.linkRating !== undefined
			? `Link ${monsterAssociation.linkRating}`
			: undefined

	return [`${color.replace(/-/g, ' ')} Monster`, cardAttribute, tier].filter(Boolean).join(' · ')
}

const DAY_MS = 24 * 60 * 60 * 1000

export const plural = (count: number, word: string) => `${count.toLocaleString()} ${word}${count === 1 ? '' : 's'}`

// whole days between a YYYY-MM-DD date and today, both at local midnight - "today", "262 days ago", "in 30 days" for an upcoming printing
export const relativeDays = (date: string, today: Date = new Date()): string => {
	const [year, month, day] = date.split('-').map(Number)
	const days = Math.round((new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() - new Date(year, month - 1, day).getTime()) / DAY_MS)
	if (days === 0) return 'today'
	const count = `${Math.abs(days).toLocaleString()} ${Math.abs(days) === 1 ? 'day' : 'days'}`
	return days > 0 ? `${count} ago` : `in ${count}`
}

// a product can list the card more than once (MZMU-EN000 and MZMU-EN074), so printings count each set number and products count each product once
export const cardGlance = (productInfo: YGOProduct.Info[], restrictedIn: YGOCard.Restrictions, banListDates: { TCG?: string[]; MD?: string[] } = {}): CardGlance => {
	const byDate = [...productInfo].sort((a, b) => a.productReleaseDate.localeCompare(b.productReleaseDate))
	const printing = (product?: YGOProduct.Info): Printing | undefined => product && { date: product.productReleaseDate, productName: product.productName }

	// each rarity with the printings in it, newest first - a printing in two rarities (Ultra and Ultimate) shows under both
	const byRarityName = new Map<string, RarityPrinting[]>()
	for (const product of [...byDate].reverse()) {
		for (const content of product.productContent) {
			for (const rarity of content.rarities) {
				const entry = { productId: product.productId, productName: product.productName, date: product.productReleaseDate, setNumber: setNumber(product, content) }
				byRarityName.set(rarity, [...(byRarityName.get(rarity) ?? []), entry])
			}
		}
	}

	return {
		printings: productInfo.reduce((total, product) => total + product.productContent.length, 0),
		products: new Set(productInfo.map((product) => product.productId)).size,
		first: printing(byDate[0]),
		last: printing(byDate[byDate.length - 1]),
		rarities: Array.from(byRarityName.keys())
			.sort(byRarity)
			.map((rarity) => ({ rarity, printings: byRarityName.get(rarity) ?? [] })),
		banLists: (['TCG', 'MD'] as const).map((format) => ({ format, ...formatStanding(restrictedIn[format], banListDates[format]) })),
	}
}

// one product the card was printed in - its set numbers and rarities across every printing in it
export type CardRelease = {
	productId: string
	productName: string
	productType: string
	productSubType: string
	date: string
	setNumbers: string[]
	rarities: string[]
}

// the products the card is in, newest first - a product listed twice (MZMU-EN000 and MZMU-EN074) is one release
export const cardReleases = (productInfo: YGOProduct.Info[]): CardRelease[] => {
	const releases = new Map<string, CardRelease>()
	for (const product of productInfo) {
		const release = releases.get(product.productId) ?? {
			productId: product.productId,
			productName: product.productName,
			productType: product.productType,
			productSubType: product.productSubType,
			date: product.productReleaseDate,
			setNumbers: [],
			rarities: [],
		}
		for (const content of product.productContent) {
			release.setNumbers.push(setNumber(product, content))
			release.rarities.push(...content.rarities.filter((rarity) => !release.rarities.includes(rarity)))
		}
		releases.set(product.productId, release)
	}

	return Array.from(releases.values())
		.map((release) => ({ ...release, setNumbers: release.setNumbers.sort(), rarities: release.rarities.sort(byRarity) }))
		.sort((a, b) => b.date.localeCompare(a.date) || a.productName.localeCompare(b.productName))
}

// a stretch this long between printings is marked in the releases list
const QUIET_YEARS = 3

export type ReleaseYear = { year: number; releases: CardRelease[]; printings: number; quietYears?: number }

// whole years from one YYYY-MM-DD date to a later one
const wholeYears = (from: string, to: string) => Number(to.slice(0, 4)) - Number(from.slice(0, 4)) - (to.slice(5) < from.slice(5) ? 1 : 0)

// releases (newest first) under their year, each year with its printings and, after a long wait, the whole years from its newest
// release to the next printing
export const releaseYears = (releases: CardRelease[]): ReleaseYear[] => {
	const years: ReleaseYear[] = []
	for (const release of releases) {
		const year = Number(release.date.slice(0, 4))
		const newer = years[years.length - 1]
		if (newer?.year === year) {
			newer.releases.push(release)
			newer.printings += release.setNumbers.length
			continue
		}

		const quietYears = newer && wholeYears(release.date, newer.releases[newer.releases.length - 1].date)
		years.push({ year, releases: [release], printings: release.setNumbers.length, ...(quietYears >= QUIET_YEARS && { quietYears }) })
	}
	return years
}
