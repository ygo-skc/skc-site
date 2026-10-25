export type RecentlyViewedItem =
	| { kind: 'card'; id: string; name: string; cardColor: YGOCard.Color; viewedAt: string }
	| { kind: 'product'; id: string; name: string; productType: string; viewedAt: string }

// Omit on each member, so a card still needs cardColor and a product productType
type NewItem = RecentlyViewedItem extends infer I ? (I extends unknown ? Omit<I, 'viewedAt'> : never) : never

export const RECENTLY_VIEWED_KEY = 'recentlyViewed'
export const RECENTLY_VIEWED_LIMIT = 50

// newest first - storage can throw (private windows, blocked site data) or hold something else, so anything unreadable is an empty history
export function readRecentlyViewed(): RecentlyViewedItem[] {
	try {
		const items: unknown = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) ?? '[]')
		return Array.isArray(items) ? items.filter((item) => typeof item?.id === 'string' && (item.kind === 'card' || item.kind === 'product')) : []
	} catch {
		return []
	}
}

/*
 * Records a visit to a card or product page. A page seen again moves to the front with the new time instead of repeating,
 * and only the latest RECENTLY_VIEWED_LIMIT are kept
 */
export function recordRecentlyViewed(item: NewItem, viewedAt = new Date()) {
	const history = readRecentlyViewed().filter((seen) => seen.kind !== item.kind || seen.id !== item.id)
	try {
		localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify([{ ...item, viewedAt: viewedAt.toISOString() }, ...history].slice(0, RECENTLY_VIEWED_LIMIT)))
	} catch {
		// the visit just isn't remembered
	}
}
