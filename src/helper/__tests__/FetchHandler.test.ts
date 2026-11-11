import axios, { AxiosError, AxiosResponse } from 'axios'
import AppRoutes from '../AppRoutes'
import FetchHandler from '../FetchHandler'

// jest-location-mock (wired up in setupTests) spies on window.location.replace in a beforeAll hook,
// so call history has to be cleared between tests
beforeEach(() => {
	jest.clearAllMocks()
})

test('verify user is redirected to 503 page on Network Error', () => {
	const err = new AxiosError()
	err.message = 'Network Error'
	FetchHandler.handleError(err)

	expect(window.location.replace).toHaveBeenCalledWith(AppRoutes.ServiceUnavailable)
})

test('verify user is redirected to 503 page on TypeError', () => {
	const err = new AxiosError()
	err.name = 'TypeError'
	FetchHandler.handleError(err)

	expect(window.location.replace).toHaveBeenCalledWith(AppRoutes.ServiceUnavailable)
})

test('verify user is redirected to 408 page on Request Aborted Error', () => {
	const err = new AxiosError()
	err.code = 'ECONNABORTED'
	FetchHandler.handleError(err)

	expect(window.location.replace).toHaveBeenCalledWith(AppRoutes.RequestTimeout)
})

test('handle request cancelled', () => {
	const err = new axios.CanceledError('aborted')

	FetchHandler.handleError(err)

	expect(window.location.replace).not.toHaveBeenCalled()
})

test('verify user is redirected to 404-Server page on 404 error from API call', () => {
	const err = new AxiosError()
	err.response = { status: 404 } as AxiosResponse
	FetchHandler.handleError(err)

	expect(window.location.replace).toHaveBeenCalledWith(AppRoutes.Server404Error)
})

test('verify user is redirected to 400 page on 400 error from API call', () => {
	const err = new AxiosError()
	err.response = { status: 400 } as AxiosResponse
	FetchHandler.handleError(err)

	expect(window.location.replace).toHaveBeenCalledWith(AppRoutes.BadRequest)
})

test('verify user is redirected to GenericServerPage when server returns with non 400 or 404 error', () => {
	const err = new AxiosError()
	err.response = { status: 500 } as AxiosResponse
	FetchHandler.handleError(err)

	expect(window.location.replace).toHaveBeenCalledWith(AppRoutes.GenericServerError)
})

// pushing the error page would leave the failing page behind it - going back reloads that page, it fails
// again and pushes the error page again, so back never gets past it
test('error pages replace the failing page in history rather than pushing on top of it', () => {
	const err = new AxiosError()
	err.response = { status: 404 } as AxiosResponse
	FetchHandler.handleError(err)

	expect(window.location.replace).toHaveBeenCalledWith(AppRoutes.Server404Error)
	expect(window.location.assign).not.toHaveBeenCalled()
})

test('requests time out after 6 seconds unless a call asks for longer', () => {
	const get = jest.spyOn(FetchHandler.client, 'get').mockResolvedValue({ data: {} })

	FetchHandler.handleFetch('/default', () => {})
	expect(get).toHaveBeenLastCalledWith('/default', expect.objectContaining({ timeout: 6000 }))

	FetchHandler.handleFetch('/slow', () => {}, false, undefined, 10000)
	expect(get).toHaveBeenLastCalledWith('/slow', expect.objectContaining({ timeout: 10000 }))

	get.mockRestore()
})

test('requests ask for JSON, send no cookies and name the client with its version, like the iOS app', () => {
	const env = { ...process.env }
	process.env.REACT_APP_CLIENT_ID = 'React App - Test'
	process.env.REACT_APP_VERSION = '1.2.3'

	// the client is built when the module loads, so load a fresh copy that reads the env set above
	jest.isolateModules(() => {
		const { headers, responseType, withCredentials } = (jest.requireActual('../FetchHandler').default as typeof FetchHandler).client.defaults

		expect(headers.Accept).toBe('application/json')
		expect(headers.CLIENT_ID).toBe('React App - Test/1.2.3')
		expect(responseType).toBe('json')
		expect(withCredentials).toBe(false)
	})

	process.env = env
})
