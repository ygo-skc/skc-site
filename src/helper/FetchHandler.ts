import axios, { AxiosError, AxiosResponse, CancelTokenSource } from 'axios'
import { RouteMap } from '../components/pages/Routes'

class FetchHandler {
	static readonly CLIENT_ID = process.env.REACT_APP_CLIENT_ID as string
	static readonly DEFAULT_TIMEOUT = 3000

	static readonly handleFetch = (
		endPoint: string,
		onJsonReceived: { (res: any): void },
		useDefaultErrorHandler = true,
		fetchToken: CancelTokenSource | undefined = undefined
	): Promise<void> | void => {
		const request = axios
			.get(endPoint, {
				headers: {
					CLIENT_ID: FetchHandler.CLIENT_ID,
				},
				timeout: FetchHandler.DEFAULT_TIMEOUT,
				cancelToken: fetchToken?.token,
			})
			.then((res: AxiosResponse) => {
				onJsonReceived(res.data)
			})

		if (useDefaultErrorHandler) {
			request.catch(FetchHandler.handleError)
		} else {
			return request
		}
	}

	static readonly handleError = (err: AxiosError) => {
		if (err.name === 'TypeError' || err.message === 'Network Error') {
			window.location.href = RouteMap.NAME_maps_ROUTE[503]
		} else if (err.code === 'ECONNABORTED') {
			// request timeout
			window.location.href = RouteMap.NAME_maps_ROUTE[408]
		} else if (err.response) {
			if (err.response.status === 404) {
				window.location.href = RouteMap.NAME_maps_ROUTE['404-Server']
			} else {
				window.location.href = RouteMap.NAME_maps_ROUTE[err.response.status]
			}
		} else if (axios.isCancel(err)) {
			console.log('Request cancelled')
		}
	}
}

export default FetchHandler
