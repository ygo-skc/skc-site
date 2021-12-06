import axios, { AxiosError, AxiosResponse } from 'axios'
import { NAME_maps_ROUTE } from '../Routes'

class Fetch {
	static readonly CLIENT_ID = process.env.REACT_APP_CLIENT_ID as string
	static readonly DEFAULT_TIMEOUT = 1200
}


function handleFetch(endPoint: string, onJsonReceived: {(res: any): void}, useDefaultErrorHandler = true): Promise<void> | void {
	const request = axios
		.get(endPoint, {
			headers: {
				'CLIENT_ID': Fetch.CLIENT_ID
			},
			timeout: Fetch.DEFAULT_TIMEOUT
		})
		.then((res: AxiosResponse) => {
			onJsonReceived(res.data)
		})

	if (useDefaultErrorHandler) {
		request
			.catch(handleError)
	} else {
		return request
	}
}


function handleError(err: AxiosError) {
	if ( err.name === 'TypeError' || err.message === 'Network Error') {
		window.location.href = NAME_maps_ROUTE[503]
	} else if(err.code === 'ECONNABORTED') {	// request timeout
		window.location.href = NAME_maps_ROUTE[408]
	} else if (err.response) {
		if (err.response.status === 404) {
			window.location.href = NAME_maps_ROUTE['404-Server']
		} else {
			window.location.href = NAME_maps_ROUTE[err.response.status]
		}
	}
}

export { handleFetch, handleError }