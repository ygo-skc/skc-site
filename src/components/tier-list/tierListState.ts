export const TIERS = ['S', 'A', 'B', 'C', 'D', 'F'] as const
export type Tier = (typeof TIERS)[number]
export type Place = 'tray' | Tier

export type TierListState = { name: string; tray: YGOCard.Deets[]; tiers: Record<Tier, YGOCard.Deets[]> }

export type TierListAction =
	| { type: 'add'; card: YGOCard.Deets }
	// index is where the card ends up in its new place (arrayMove's meaning), the end when left out
	| { type: 'move'; cardID: string; to: Place; index?: number }
	| { type: 'remove'; cardID: string }
	| { type: 'rename'; name: string }
	| { type: 'reset' }

export const DEFAULT_NAME = 'Untitled tier list'

export const emptyTierList = (): TierListState => ({
	name: DEFAULT_NAME,
	tray: [],
	tiers: { S: [], A: [], B: [], C: [], D: [], F: [] },
})

const cardsIn = (state: TierListState, place: Place) => (place === 'tray' ? state.tray : state.tiers[place])

export function findPlace(state: TierListState, cardID: string): Place | undefined {
	return (['tray', ...TIERS] as Place[]).find((place) => cardsIn(state, place).some((card) => card.cardID === cardID))
}

export const rankedCount = (state: TierListState) => TIERS.reduce((count, tier) => count + state.tiers[tier].length, 0)

// a copy of the list with one place's cards swapped out
function withCards(state: TierListState, place: Place, cards: YGOCard.Deets[]): TierListState {
	return place === 'tray' ? { ...state, tray: cards } : { ...state, tiers: { ...state.tiers, [place]: cards } }
}

/*
 * Each card is on the page once - in the tray or in one tier - so adding a card that's already there does nothing
 */
export function tierListReducer(state: TierListState, action: TierListAction): TierListState {
	switch (action.type) {
		case 'add':
			return findPlace(state, action.card.cardID) ? state : { ...state, tray: [...state.tray, action.card] }
		case 'move': {
			const from = findPlace(state, action.cardID)
			if (!from) return state

			const card = cardsIn(state, from).find((c) => c.cardID === action.cardID) as YGOCard.Deets
			const taken = withCards(
				state,
				from,
				cardsIn(state, from).filter((c) => c.cardID !== action.cardID)
			)
			const target = [...cardsIn(taken, action.to)]
			target.splice(action.index ?? target.length, 0, card)
			return withCards(taken, action.to, target)
		}
		case 'remove': {
			const from = findPlace(state, action.cardID)
			return from
				? withCards(
						state,
						from,
						cardsIn(state, from).filter((c) => c.cardID !== action.cardID)
				  )
				: state
		}
		case 'rename':
			return { ...state, name: action.name }
		case 'reset':
			return emptyTierList()
	}
}
