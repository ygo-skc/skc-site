const API_HOST = process.env.REACT_APP_API_HOST

const NAME_maps_ENDPOINT = {
	'banListsUrl':				`${API_HOST}/api/v1/ban/dates/`,
	'banListInstanceUrl':		`${API_HOST}/api/v1/ban/cards/`,
	'newCardsInBanList':			`${API_HOST}/api/v1/ban/new/`,
	'cardInstanceUrl':			`${API_HOST}/api/v1/card/`,
}

export default NAME_maps_ENDPOINT