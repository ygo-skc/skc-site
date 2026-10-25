// a card keeps what search results carry, so it previews like one without another request
export type RecentCard = { kind: 'card'; id: string; name: string; card: YGOCard.Deets; viewedAt: string }
export type RecentProduct = { kind: 'product'; id: string; name: string; productType: string; productSubType: string; viewedAt: string }
export type RecentlyViewedItem = RecentCard | RecentProduct

export const RECENTLY_VIEWED_KEY = 'recentlyViewed'
export const RECENTLY_VIEWED_LIMIT = 50

const DAY_MS = 24 * 60 * 60 * 1000

function isRecentlyViewedItem(item: RecentlyViewedItem): boolean {
	if (typeof item?.id !== 'string' || typeof item.viewedAt !== 'string') return false
	return item.kind === 'card' ? typeof item.card?.cardID === 'string' : item.kind === 'product'
}

// newest first - storage can throw (private windows, blocked site data) or hold something else, so anything unreadable is an empty history
export function readRecentlyViewed(): RecentlyViewedItem[] {
	try {
		const items: unknown = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) ?? '[]')
		return Array.isArray(items) ? items.filter(isRecentlyViewedItem) : []
	} catch {
		return []
	}
}

function write(items: RecentlyViewedItem[]) {
	try {
		localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(items))
	} catch {
		// the history just isn't kept
	}
}

/*
 * A page seen again moves to the front with the new time instead of repeating, and only the latest RECENTLY_VIEWED_LIMIT are kept
 */
function record(item: RecentlyViewedItem) {
	const history = readRecentlyViewed().filter((seen) => seen.kind !== item.kind || seen.id !== item.id)
	write([item, ...history].slice(0, RECENTLY_VIEWED_LIMIT))
}

export function recordCardView(card: YGOCard.Deets, viewedAt = new Date()) {
	const { cardID, cardName, cardColor, cardAttribute, cardEffect, monsterType, monsterAssociation, monsterAttack, monsterDefense } = card
	record({
		kind: 'card',
		id: cardID,
		name: cardName,
		card: { cardID, cardName, cardColor, cardAttribute, cardEffect, monsterType, monsterAssociation, monsterAttack, monsterDefense },
		viewedAt: viewedAt.toISOString(),
	})
}

export function recordProductView(product: YGOProduct.Deets, viewedAt = new Date()) {
	record({
		kind: 'product',
		id: product.productId,
		name: product.productName,
		productType: product.productType,
		productSubType: product.productSubType,
		viewedAt: viewedAt.toISOString(),
	})
}

export function clearRecentlyViewed() {
	write([])
}

/*
 * The history under day headings, each visit with a short time - the time of day for today and yesterday, the weekday within
 * the last week, the date before that
 */
export function groupRecentlyViewed(items: RecentlyViewedItem[], now = new Date()) {
	const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
	const groups: { label: string; items: { item: RecentlyViewedItem; time: string }[] }[] = []

	items.forEach((item) => {
		const viewedAt = new Date(item.viewedAt)
		const startOfDay = new Date(viewedAt.getFullYear(), viewedAt.getMonth(), viewedAt.getDate()).getTime()
		// rounded, since a day across a clock change is an hour short or long
		const daysAgo = Math.round((startOfToday - startOfDay) / DAY_MS)

		const label = daysAgo <= 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : daysAgo < 7 ? 'Previous 7 days' : 'Older'
		const time =
			daysAgo <= 1
				? viewedAt.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
				: daysAgo < 7
				? viewedAt.toLocaleDateString(undefined, { weekday: 'short' })
				: viewedAt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

		const last = groups[groups.length - 1]
		if (last?.label === label) last.items.push({ item, time })
		else groups.push({ label, items: [{ item, time }] })
	})

	return groups
}
