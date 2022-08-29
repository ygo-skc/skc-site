import axios, { AxiosError, AxiosResponse, CancelTokenSource } from 'axios'
import { _SKCSiteRoutes } from '../components/pages/Routes'

class Fetch {
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
					CLIENT_ID: Fetch.CLIENT_ID,
				},
				timeout: Fetch.DEFAULT_TIMEOUT,
				cancelToken: fetchToken?.token,
			})
			.then((res: AxiosResponse) => {
				onJsonReceived(res.data)
			})

		if (useDefaultErrorHandler) {
			request.catch(Fetch.handleError)
		} else {
			return request
		}
	}

	static readonly handleError = (err: AxiosError) => {
		if (err.name === 'TypeError' || err.message === 'Network Error') {
			window.location.href = _SKCSiteRoutes.NAME_maps_ROUTE[503]
		} else if (err.code === 'ECONNABORTED') {
			// request timeout
			window.location.href = _SKCSiteRoutes.NAME_maps_ROUTE[408]
		} else if (err.response) {
			if (err.response.status === 404) {
				window.location.href = _SKCSiteRoutes.NAME_maps_ROUTE['404-Server']
			} else {
				window.location.href = _SKCSiteRoutes.NAME_maps_ROUTE[err.response.status]
			}
		} else if (axios.isCancel(err)) {
			console.log('Request cancelled')
		}
	}
}

export default Fetch
