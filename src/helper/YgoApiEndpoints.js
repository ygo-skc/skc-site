const host = 'http://localhost:9999'
//const host = 'https://ygoapi.cfapps.io'
//const host = 'https://ygoapi-dev.cfapps.io'

const NAME_maps_ENDPOINT = {
	'banListsUrl':				`${host}/api/v1/ban/dates/`,
	'banListInstanceUrl':		`${host}/api/v1/ban/cards/`,
	'newCardsInBanList':			`${host}/api/v1/ban/new/`,
	'cardInstanceUrl':			`${host}/api/v1/card/`,
}

export default NAME_maps_ENDPOINT