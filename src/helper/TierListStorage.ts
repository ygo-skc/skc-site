import { DEFAULT_NAME, emptyTierList, TIERS, TierListState } from '../components/tier-list/tierListState'

export const TIER_LIST_KEY = 'tierList'

const isCard = (card: YGOCard.Deets) =>
	typeof card?.cardID === 'string' && typeof card.cardName === 'string' && typeof card.cardColor === 'string' && typeof card.cardEffect === 'string'

/*
 * The saved list, keeping only what still makes sense - storage can throw (private windows, blocked site data) or hold something
 * hand-edited or from another version, so bad cards and tiers are dropped and a card seen twice keeps its first place (tray, then S to F)
 */
export function readTierList(): TierListState {
	try {
		const saved = JSON.parse(localStorage.getItem(TIER_LIST_KEY) ?? 'null')
		const list = emptyTierList()
		if (saved === null || typeof saved !== 'object') return list

		const seen = new Set<string>()
		const keep = (cards: unknown) =>
			(Array.isArray(cards) ? cards : []).filter((card) => {
				if (!isCard(card) || seen.has(card.cardID)) return false
				seen.add(card.cardID)
				return true
			})

		list.name = typeof saved.name === 'string' ? saved.name : DEFAULT_NAME
		list.tray = keep(saved.tray)
		TIERS.forEach((tier) => (list.tiers[tier] = keep(saved.tiers?.[tier])))
		return list
	} catch {
		return emptyTierList()
	}
}

export function writeTierList(state: TierListState) {
	try {
		localStorage.setItem(TIER_LIST_KEY, JSON.stringify(state))
	} catch {
		// the list just isn't kept past this visit
	}
}
