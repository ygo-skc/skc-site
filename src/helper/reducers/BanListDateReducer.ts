export type BanListDateReducerState = {
	banListStartDates: string[]
	banContentLinks: SKCBanListDateLinks[]
	isFetchingBanListDates?: boolean
}

export enum BanListDateReducerActionType {
	DATES_RECEIVED,
	FETCHING_DATES,
}

export type BanListDateReducerAction = {
	type: BanListDateReducerActionType
	payload?: BanListDateReducerState
}

export default function dateReducer(state: BanListDateReducerState, action: BanListDateReducerAction) {
	switch (action.type) {
		case BanListDateReducerActionType.DATES_RECEIVED:
			return {
				banListStartDates: action.payload!.banListStartDates,
				banContentLinks: action.payload!.banContentLinks,
				isFetchingBanListDates: false,
			}
		case BanListDateReducerActionType.FETCHING_DATES:
			return {
				...state,
				isFetchingBanListDates: true,
			}
	}
}
