export enum BanListReducerType {
	UPDATE_LIST_CONTENT,
	UPDATE_REMOVED_CONTENT,
	UPDATE_NEW_CONTENT,
	FETCHING_INFO,
}

type Fetching = { isFetchingBanListNewContent: boolean; isFetchingBanListContent: boolean; isFetchingBanListRemovedContent: boolean }

type BanListReducerAction =
	| (YGOBanList.NormalFormatContent & {
			type: BanListReducerType.UPDATE_LIST_CONTENT
	  })
	| (YGOBanList.NormalFormatRemovedCards & { type: BanListReducerType.UPDATE_REMOVED_CONTENT })
	| (YGOBanList.NormalFormatNewlyAdded & { type: BanListReducerType.UPDATE_NEW_CONTENT })
	| { type: BanListReducerType.FETCHING_INFO }

export function currentBanListReducer(state: YGOBanList.NormalFormatContent & YGOBanList.NormalFormatDiff & Fetching, action: BanListReducerAction) {
	switch (action.type) {
		case BanListReducerType.UPDATE_LIST_CONTENT:
			return {
				...state,
				forbidden: action.forbidden,
				limited: action.limited,
				semiLimited: action.semiLimited,
				numForbidden: action.numForbidden,
				numLimited: action.numLimited,
				numSemiLimited: action.numSemiLimited,
				isFetchingBanListContent: false,
			}
		case BanListReducerType.UPDATE_REMOVED_CONTENT:
			return {
				...state,
				removedCards: action.removedCards,
				numRemoved: action.numRemoved,
				isFetchingBanListRemovedContent: false,
			}
		case BanListReducerType.UPDATE_NEW_CONTENT:
			return {
				...state,
				newForbidden: action.newForbidden,
				newLimited: action.newLimited,
				newSemiLimited: action.newSemiLimited,
				numNewForbidden: action.numNewForbidden,
				numNewLimited: action.numNewLimited,
				numNewSemiLimited: action.numNewSemiLimited,
				isFetchingBanListNewContent: false,
			}
		case BanListReducerType.FETCHING_INFO:
			return {
				...state,
				isFetchingBanListNewContent: true,
				isFetchingBanListContent: true,
				isFetchingBanListRemovedContent: true,
			}
		default:
			return state
	}
}
