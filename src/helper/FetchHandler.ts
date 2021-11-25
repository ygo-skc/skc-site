import axios, { AxiosError, AxiosResponse } from 'axios'
import { NAME_maps_ROUTE } from '../Routes'

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID as string

function handleFetch(endPoint: string, onJsonReceived: {(res: any): void}) {
	axios
		.get(endPoint, {
			headers: {
				'CLIENT_ID': CLIENT_ID
			}, timeout: 1200
		})
		.then((res: AxiosResponse) => {
			if (res.status === 200) {
				onJsonReceived(res.data)
			}
		})
		.catch(handleRedirect)
}


function handleRedirect(err: AxiosError) {
	if ( err.name === 'TypeError' || err.message === 'Network Error' ) {
		window.location.href = NAME_maps_ROUTE[503]
	} else if (err.response) {
		if (err.response.status === 404) {
			window.location.href = NAME_maps_ROUTE['404-Server']
		} else {
			window.location.href = NAME_maps_ROUTE[err.response.status]
		}
	}
}


export { handleFetch, handleRedirect }