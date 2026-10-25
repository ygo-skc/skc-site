import axios, { AxiosError, AxiosResponse, CancelTokenSource } from 'axios'
import AppRoutes from './AppRoutes'

class FetchHandler {
	static readonly CLIENT_ID = process.env.REACT_APP_CLIENT_ID as string
	static readonly DEFAULT_TIMEOUT = 6000

	static readonly handleFetch = <T>(
		endPoint: string,
		onJsonReceived: (res: T) => void,
		useDefaultErrorHandler = true,
		fetchToken: CancelTokenSource | undefined = undefined,
		timeout = FetchHandler.DEFAULT_TIMEOUT
	): Promise<void> | void => {
		const request = axios
			.get(endPoint, {
				headers: {
					CLIENT_ID: FetchHandler.CLIENT_ID,
				},
				timeout,
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

	// replace, not assign: the error page takes the failing page's place in history. Pushed on top of it,
	// going back reloads the failing page, which fails and pushes the error page again - back never gets past it
	static readonly handleError = (err: AxiosError) => {
		if (err.name === 'TypeError' || err.message === 'Network Error') {
			window.location.replace(AppRoutes.ServiceUnavailable)
		} else if (err.code === 'ECONNABORTED') {
			// request timeout
			window.location.replace(AppRoutes.RequestTimeout)
		} else if (err.response) {
			if (err.response.status === 404) {
				window.location.replace(AppRoutes.Server404Error)
			} else if (err.response.status === 400) {
				window.location.replace(AppRoutes.BadRequest)
			} else {
				window.location.replace(AppRoutes.GenericServerError)
			}
		} else if (axios.isCancel(err)) {
			console.log('Request cancelled')
		}
	}
}

export default FetchHandler
