import { AxiosError, AxiosResponse } from 'axios'
import { RouteMap } from '../../components/pages/Routes'
import FetchHandler from '../FetchHandler'

beforeEach(() => {
	global.window = Object.create(window)
	Object.defineProperty(window, 'location', {
		value: {
			href: '',
		},
	})
})

test('verify user is redirected to 503 page on Network Error', () => {
	const err = new AxiosError()
	err.message = 'Network Error'
	FetchHandler.handleError(err)

	expect(location.href).toBe(RouteMap.NAME_maps_ROUTE[503])
})

test('verify user is redirected to 503 page on TypeError', () => {
	const err = new AxiosError()
	err.message = 'TypeError'
	FetchHandler.handleError(err)

	expect(location.href).toBe(RouteMap.NAME_maps_ROUTE[503])
})

test('verify user is redirected to 408 page on Request Aborted Error', () => {
	const err = new AxiosError()
	err.code = 'ECONNABORTED'
	FetchHandler.handleError(err)

	expect(location.href).toBe(RouteMap.NAME_maps_ROUTE[408])
})

test('verify user is redirected to 404-Server page on 404 error from API call', () => {
	const err = new AxiosError()
	err.response = { status: 404 } as AxiosResponse
	FetchHandler.handleError(err)

	expect(location.href).toBe(RouteMap.NAME_maps_ROUTE['404-Server'])
})

test('verify user is redirected to 400 page on 400 error from API call', () => {
	const err = new AxiosError()
	err.response = { status: 400 } as AxiosResponse
	FetchHandler.handleError(err)

	expect(location.href).toBe(RouteMap.NAME_maps_ROUTE[400])
})
