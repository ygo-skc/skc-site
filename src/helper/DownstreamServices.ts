class DownstreamServices {
	// SKC API
	private static readonly API_HOST = process.env.REACT_APP_API_HOST
	static readonly NAME_maps_ENDPOINT = {
		banListsUrl: `${DownstreamServices.API_HOST}/api/v1/ban_list/dates`,
		banListUrl: `${DownstreamServices.API_HOST}/api/v1/ban_list`,
		cardInstanceUrl: `${DownstreamServices.API_HOST}/api/v1/card`,
		databaseStats: `${DownstreamServices.API_HOST}/api/v1/stats`,
		search: `${DownstreamServices.API_HOST}/api/v1/card/search`,
		browseCriteria: `${DownstreamServices.API_HOST}/api/v1/card/browse/criteria`,
		browse: `${DownstreamServices.API_HOST}/api/v1/card/browse`,
		productDetails: `${DownstreamServices.API_HOST}/api/v1/product`,
		productBrowse: `${DownstreamServices.API_HOST}/api/v1/products/en`,
		status: `${DownstreamServices.API_HOST}/api/v1/status`,
	}

	// SKC Suggestion Engine
	private static readonly SKC_SUGGESTION_HOST_NAME = process.env.REACT_APP_SKC_SUGGESTION_HOST
	static readonly SKC_SUGGESTION_ENDPOINTS = {
		status: `${DownstreamServices.SKC_SUGGESTION_HOST_NAME}/api/v1/suggestions/status`,
		cardOfTheDay: `${DownstreamServices.SKC_SUGGESTION_HOST_NAME}/api/v1/suggestions/card-of-the-day`,
		cardSuggestions: `${DownstreamServices.SKC_SUGGESTION_HOST_NAME}/api/v1/suggestions/card`,
		cardSupport: `${DownstreamServices.SKC_SUGGESTION_HOST_NAME}/api/v1/suggestions/card/support`,
	}

	// Heart API
	private static readonly HEART_API_HOST_NAME = process.env.REACT_APP_HEART_API_HOST
	static readonly HEART_API_ENDPOINTS = {
		status: `${DownstreamServices.HEART_API_HOST_NAME}/api/v1/status`,
		ytUploads: `${DownstreamServices.HEART_API_HOST_NAME}/api/v1/yt/channel/uploads`,
		events: `${DownstreamServices.HEART_API_HOST_NAME}/api/v1/events`,
		messages: `${DownstreamServices.HEART_API_HOST_NAME}/api/v1/message`,
	}
}
export default DownstreamServices
