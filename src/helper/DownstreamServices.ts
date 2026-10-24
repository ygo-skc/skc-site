// SKC API
const API_HOST = process.env.REACT_APP_API_HOST
export const SKC_API_ENDPOINTS = {
	banListsUrl: `${API_HOST}/api/v1/ban_list/dates`,
	banListUrl: `${API_HOST}/api/v1/ban_list`,
	cardInstanceUrl: `${API_HOST}/api/v1/card`,
	databaseStats: `${API_HOST}/api/v1/stats`,
	search: `${API_HOST}/api/v1/card/search`,
	browseCriteria: `${API_HOST}/api/v1/card/browse/criteria`,
	browse: `${API_HOST}/api/v1/card/browse`,
	productDetails: `${API_HOST}/api/v1/product`,
	productBrowse: `${API_HOST}/api/v1/products/en`,
	status: `${API_HOST}/api/v1/status`,
}

// SKC Suggestion Engine
const SKC_SUGGESTION_HOST_NAME = process.env.REACT_APP_SKC_SUGGESTION_HOST
export const SKC_SUGGESTION_ENDPOINTS = {
	status: `${SKC_SUGGESTION_HOST_NAME}/api/v1/suggestions/status`,
	cardOfTheDay: `${SKC_SUGGESTION_HOST_NAME}/api/v1/suggestions/card-of-the-day`,
	cardSuggestions: `${SKC_SUGGESTION_HOST_NAME}/api/v1/suggestions/card`,
	cardSupport: `${SKC_SUGGESTION_HOST_NAME}/api/v1/suggestions/card/support`,
	productCardSuggestions: `${SKC_SUGGESTION_HOST_NAME}/api/v1/suggestions/product`,
	trending: `${SKC_SUGGESTION_HOST_NAME}/api/v1/suggestions/trending`,
}

// Heart API
const HEART_API_HOST_NAME = process.env.REACT_APP_HEART_API_HOST
export const HEART_API_ENDPOINTS = {
	status: `${HEART_API_HOST_NAME}/api/v1/status`,
	ytUploads: `${HEART_API_HOST_NAME}/api/v1/yt/channel/uploads`,
	events: `${HEART_API_HOST_NAME}/api/v1/events`,
	messages: `${HEART_API_HOST_NAME}/api/v1/message`,
}
