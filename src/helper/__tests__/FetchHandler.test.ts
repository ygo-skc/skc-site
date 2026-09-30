import axios, { AxiosError, AxiosResponse } from 'axios'
import AppRoutes from '../AppRoutes'
import FetchHandler from '../FetchHandler'

// jest-location-mock (wired up in setupTests) spies on window.location.assign in a beforeAll hook,
// so call history has to be cleared between tests
beforeEach(() => {
	jest.clearAllMocks()
})

test('verify user is redirected to 503 page on Network Error', () => {
	const err = new AxiosError()
	err.message = 'Network Error'
	FetchHandler.handleError(err)

	expect(window.location.assign).toHaveBeenCalledWith(AppRoutes.ServiceUnavailable)
})

test('verify user is redirected to 503 page on TypeError', () => {
	const err = new AxiosError()
	err.name = 'TypeError'
	FetchHandler.handleError(err)

	expect(window.location.assign).toHaveBeenCalledWith(AppRoutes.ServiceUnavailable)
})

test('verify user is redirected to 408 page on Request Aborted Error', () => {
	const err = new AxiosError()
	err.code = 'ECONNABORTED'
	FetchHandler.handleError(err)

	expect(window.location.assign).toHaveBeenCalledWith(AppRoutes.RequestTimeout)
})

test('handle request cancelled', () => {
	const err = new axios.CanceledError('aborted')

	FetchHandler.handleError(err)

	expect(window.location.assign).not.toHaveBeenCalled()
})

test('verify user is redirected to 404-Server page on 404 error from API call', () => {
	const err = new AxiosError()
	err.response = { status: 404 } as AxiosResponse
	FetchHandler.handleError(err)

	expect(window.location.assign).toHaveBeenCalledWith(AppRoutes.Server404Error)
})

test('verify user is redirected to 400 page on 400 error from API call', () => {
	const err = new AxiosError()
	err.response = { status: 400 } as AxiosResponse
	FetchHandler.handleError(err)

	expect(window.location.assign).toHaveBeenCalledWith(AppRoutes.BadRequest)
})

test('verify user is redirected to GenericServerPage when server returns with non 400 or 404 error', () => {
	const err = new AxiosError()
	err.response = { status: 500 } as AxiosResponse
	FetchHandler.handleError(err)

	expect(window.location.assign).toHaveBeenCalledWith(AppRoutes.GenericServerError)
})
