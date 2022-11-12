export default function dateReducer(state: any, action: any) {
	switch (action.type) {
		case 'DATES_RECEIVED':
			return {
				banListStartDates: action.banListStartDates,
				banContentLinks: action.banContentLinks,
				isFetchingBanListDates: false,
			}
		case 'FETCHING_DATES':
			return {
				...state,
				isFetchingBanListDates: true,
			}
	}
}
