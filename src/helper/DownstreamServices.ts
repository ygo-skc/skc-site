class DownstreamServices {
	static readonly API_HOST = process.env.REACT_APP_API_HOST

	static readonly NAME_maps_ENDPOINT = {
		banListsUrl: `${DownstreamServices.API_HOST}/api/v1/ban_list/dates`,
		cardInstanceUrl: `${DownstreamServices.API_HOST}/api/v1/card/`,
		databaseStats: `${DownstreamServices.API_HOST}/api/v1/stats`,
		search: `${DownstreamServices.API_HOST}/api/v1/card/search`,
		browseCriteria: `${DownstreamServices.API_HOST}/api/v1/card/browse/criteria`,
		browse: `${DownstreamServices.API_HOST}/api/v1/card/browse`,
		productDetails: `${DownstreamServices.API_HOST}/api/v1/product`,
		productBrowse: `${DownstreamServices.API_HOST}/api/v1/products/en`,
		status: `${DownstreamServices.API_HOST}/api/v1/status`,
	}

	// SKC Suggestion Engine
	static readonly SKC_SUGGESTION_HOST_NAME = process.env.REACT_APP_SKC_SUGGESTION_HOST

	// Heart API
	static readonly HEART_API_HOST_NAME = process.env.REACT_APP_HEART_API_HOST
	static readonly HEART_API_ENDPOINTS: { status: string } = {
		status: `${DownstreamServices.HEART_API_HOST_NAME}/api/v1/status`,
	}
}
export default DownstreamServices
