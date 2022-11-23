export enum CurrentlySelectedBanListReducerActionType {
	UPDATE_NORMAL_FORMAT_LIST,
	UPDATE_DUEL_LINKS_FORMAT_LIST,
	UPDATE_REMOVED,
	UPDATE_NEW_ADDITIONS_NORMAL_FORMAT,
	UPDATE_NEW_ADDITIONS_DUEL_LINKS_FORMAT,
}

export default function currentlySelectedBanListReducer(state: any, action: any) {
	switch (action.type) {
		case CurrentlySelectedBanListReducerActionType.UPDATE_NORMAL_FORMAT_LIST:
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
		case CurrentlySelectedBanListReducerActionType.UPDATE_DUEL_LINKS_FORMAT_LIST:
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
		case CurrentlySelectedBanListReducerActionType.UPDATE_REMOVED:
			return {
				...state,
				removedCards: action.removedCards,
				numRemoved: action.numRemoved,
			}
		case CurrentlySelectedBanListReducerActionType.UPDATE_NEW_ADDITIONS_NORMAL_FORMAT:
			return {
				...state,
				newForbiddenCards: action.newForbiddenCards,
				newLimitedCards: action.newLimitedCards,
				newSemiLimitedCards: action.newSemiLimitedCards,
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
		case CurrentlySelectedBanListReducerActionType.UPDATE_NEW_ADDITIONS_DUEL_LINKS_FORMAT:
			return {
				...state,
				newForbiddenCards: action.newForbiddenCards,
				newLimitedCards: [],
				newSemiLimitedCards: [],
				newLimitedOneCards: action.newLimitedOneCards,
				newLimitedTwoCards: action.newLimitedTwoCards,
				newLimitedThreeCards: action.newLimitedThreeCards,
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
