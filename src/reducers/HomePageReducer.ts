type HomePageDataState = {
	dbStats: APIRequest<SKC.DBStats>
	cotd: APIRequest<SKC.CardOfTheDay>
	upcomingTCGProducts: APIRequest<HeartAPI.Event>
}

export enum HomePageActionType {
	UPDATE_DB_STATS = 'UPDATE_DB_STATS',
	UPDATE_COTD = 'UPDATE_COTD',
	UPDATE_UPCOMING_TCG = 'UPDATE_UPCOMING_TCG',
	FETCH_COTD_ERROR = 'FETCH_COTD_ERROR',
	FETCH_UPCOMING_TCG_ERROR = 'FETCH_UPCOMING_TCG_ERROR',
}

type HomePageAction =
	| {
			type: HomePageActionType.UPDATE_DB_STATS
			dbStats: SKC.DBStats
	  }
	| {
			type: HomePageActionType.UPDATE_COTD
			cotd: SKC.CardOfTheDay
	  }
	| {
			type: HomePageActionType.UPDATE_UPCOMING_TCG
			upcomingTCGProducts: HeartAPI.Event
	  }
	| {
			type: HomePageActionType.FETCH_COTD_ERROR
	  }
	| {
			type: HomePageActionType.FETCH_UPCOMING_TCG_ERROR
	  }

export function homePageReducer(state: HomePageDataState, action: HomePageAction): HomePageDataState {
	switch (action.type) {
		case HomePageActionType.UPDATE_DB_STATS:
			return { ...state, dbStats: { ...action.dbStats, isFetchingData: false, requestHasError: false } }

		case HomePageActionType.UPDATE_COTD:
			return { ...state, cotd: { ...action.cotd, isFetchingData: false, requestHasError: false } }

		case HomePageActionType.UPDATE_UPCOMING_TCG:
			return { ...state, upcomingTCGProducts: { ...action.upcomingTCGProducts, isFetchingData: false, requestHasError: false } }

		case HomePageActionType.FETCH_COTD_ERROR:
			return { ...state, cotd: { ...state.cotd, isFetchingData: false, requestHasError: true } }

		case HomePageActionType.FETCH_UPCOMING_TCG_ERROR:
			return { ...state, upcomingTCGProducts: { ...state.upcomingTCGProducts, isFetchingData: false, requestHasError: true } }

		default:
			return { ...state }
	}
}
