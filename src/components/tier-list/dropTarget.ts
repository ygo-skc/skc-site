import { findPlace, Place, TIERS, tierListReducer, TierListState } from './tierListState'

// drag and drop ids - a card is its cardID, a place (the tray or a tier) is `place:<place>`
export const placeId = (place: Place) => `place:${place}`

/*
 * Where a dragged card lands for what it was dropped over - over a place it goes to the end, over a tier card it takes that card's spot
 */
export function dropTarget(state: TierListState, overId: string): { to: Place; index?: number } | undefined {
	if (overId.startsWith('place:')) {
		const place = overId.slice('place:'.length) as Place
		return place === 'tray' || (TIERS as readonly string[]).includes(place) ? { to: place } : undefined
	}

	const to = findPlace(state, overId)
	if (!to || to === 'tray') return to && { to }
	return { to, index: state.tiers[to].findIndex((card) => card.cardID === overId) }
}

/*
 * The list as a drag shows it - a card over another place (a tier, or the tray) moves there, so that tier's cards make room for it.
 * Within its place it's left alone, since dnd-kit shuffles a tier's cards itself
 */
export function dragPreview(state: TierListState, cardID: string, overId: string): TierListState {
	const over = dropTarget(state, overId)
	return over && over.to !== findPlace(state, cardID) ? tierListReducer(state, { type: 'move', cardID, ...over }) : state
}

type Spot = { to: Place; index: number }

/*
 * Where a finished drag lands, from the list as the drag showed it. Over another place it goes there (a drop with no preview first);
 * otherwise it stays where it's shown - in a tier, on the spot dnd-kit shuffled it to (`spot`, none for a tray card, which doesn't shuffle)
 */
export function landing(state: TierListState, cardID: string, overId: string | undefined, spot: Spot | undefined): { to: Place; index?: number } | undefined {
	const over = overId === undefined ? undefined : dropTarget(state, overId)
	const place = findPlace(state, cardID)
	if (over && over.to !== place) return over
	if (!place || place === 'tray') return place && { to: place }
	return spot?.to === place ? spot : { to: place, index: state.tiers[place].findIndex((card) => card.cardID === cardID) }
}
