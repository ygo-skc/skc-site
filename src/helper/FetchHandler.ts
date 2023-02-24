import axios, { AxiosError, AxiosResponse, CancelTokenSource } from 'axios'
import AppRoutes from './AppRoutes'

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
			window.location.href = AppRoutes.ServiceUnavailable
		} else if (err.code === 'ECONNABORTED') {
			// request timeout
			window.location.href = AppRoutes.RequestTimeout
		} else if (err.response) {
			if (err.response.status === 404) {
				window.location.href = AppRoutes.Server404Error
			} else if (err.response.status === 400) {
				window.location.href = AppRoutes.BadRequest
			} else {
				window.location.href = AppRoutes.GenericServerError
			}
		} else if (axios.isCancel(err)) {
			console.log('Request cancelled')
		}
	}
}

export default FetchHandler
