export enum BanListReducerType {
	UPDATE_LIST_CONTENT,
	UPDATE_LIST_CONTENT_DL_FORMAT,
	UPDATE_REMOVED_CONTENT,
	UPDATE_NEW_CONTENT,
	UPDATE_NEW_CONTENT_DL_FORMAT,
}

type BanListReducerAction =
	| (SKCBanListContentNormalFormat & {
			type: BanListReducerType.UPDATE_LIST_CONTENT
	  })
	| (SKCBanListContentDuelLinksFormat & {
			type: BanListReducerType.UPDATE_LIST_CONTENT_DL_FORMAT
	  })
	| (SKCBanListRemovedCards & { type: BanListReducerType.UPDATE_REMOVED_CONTENT })
	| (SKCBanListNewCardsNormalFormat & { type: BanListReducerType.UPDATE_NEW_CONTENT })
	| (SKCBanListNewCardsDuelLinksFormat & { type: BanListReducerType.UPDATE_NEW_CONTENT_DL_FORMAT })

export function currentBanListReducer(
	state: SKCBanListContentNormalFormat & SKCBanListContentDuelLinksFormat & SKCBanListDiffContentNormalFormat & SKCBanListDiffContentDuelLinksFormat,
	action: BanListReducerAction
) {
	switch (action.type) {
		case BanListReducerType.UPDATE_LIST_CONTENT:
			return {
				...state,
				forbidden: action.forbidden,
				limited: action.limited,
				semiLimited: action.semiLimited,
				limitedOne: [],
				limitedTwo: [],
				limitedThree: [],
				numForbidden: action.numForbidden,
				numLimited: action.numLimited,
				numSemiLimited: action.numSemiLimited,
				numLimitedOne: 0,
				numLimitedTwo: 0,
				numLimitedThree: 0,
			}
		case BanListReducerType.UPDATE_LIST_CONTENT_DL_FORMAT:
			return {
				...state,
				forbidden: action.forbidden,
				limited: [],
				semiLimited: [],
				limitedOne: action.limitedOne,
				limitedTwo: action.limitedTwo,
				limitedThree: action.limitedThree,
				numForbidden: action.numForbidden,
				numLimited: 0,
				numSemiLimited: 0,
				numLimitedOne: action.numLimitedOne,
				numLimitedTwo: action.numLimitedTwo,
				numLimitedThree: action.numLimitedThree,
			}
		case BanListReducerType.UPDATE_REMOVED_CONTENT:
			return {
				...state,
				removedCards: action.removedCards,
				numRemoved: action.numRemoved,
			}
		case BanListReducerType.UPDATE_NEW_CONTENT:
			return {
				...state,
				newForbidden: action.newForbidden,
				newLimited: action.newLimited,
				newSemiLimited: action.newSemiLimited,
				newLimitedOne: [],
				newLimitedTwo: [],
				newLimitedThree: [],
				numNewForbidden: action.numNewForbidden,
				numNewLimited: action.numNewLimited,
				numNewSemiLimited: action.numNewSemiLimited,
				numNewLimitedOne: 0,
				numNewLimitedTwo: 0,
				numNewLimitedThree: 0,
			}
		case BanListReducerType.UPDATE_NEW_CONTENT_DL_FORMAT:
			return {
				...state,
				newForbidden: action.newForbidden,
				newLimited: [],
				newSemiLimited: [],
				newLimitedOne: action.newLimitedOne,
				newLimitedTwo: action.newLimitedTwo,
				newLimitedThree: action.newLimitedThree,
				numNewForbidden: action.numNewForbidden,
				numNewLimited: 0,
				numNewSemiLimited: 0,
				numNewLimitedOne: action.numNewLimitedOne,
				numNewLimitedTwo: action.numNewLimitedTwo,
				numNewLimitedThree: action.numNewLimitedThree,
			}
		default:
			return state
	}
}
