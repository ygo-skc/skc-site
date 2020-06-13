const API_HOST = process.env.REACT_APP_API_HOST

const NAME_maps_ENDPOINT = {
	'banListsUrl':				`${API_HOST}/api/v1/ban/dates/`,
	'banListInstanceUrl':		`${API_HOST}/api/v1/ban/cards/`,
	'newCardsInBanList':			`${API_HOST}/api/v1/ban/new/`,
	'removedCardsInBanList':			`${API_HOST}/api/v1/ban/removed/`,
	'cardInstanceUrl':			`${API_HOST}/api/v1/card/`,
	'databaseStats':				`${API_HOST}/api/v1/stats`,
}

export default NAME_maps_ENDPOINT