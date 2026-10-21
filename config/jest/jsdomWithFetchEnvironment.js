// Wired up by jest.testEnvironment in package.json.
// jsdom ships no Fetch API globals, but react-router's data router builds a Request for every
// navigation, so any test that navigates fails with "Request is not defined". Copy them in from
// node's realm, where they do exist.
//
// These are assigned as a set, overwriting jsdom's own AbortController/AbortSignal/FormData,
// because node's Request rejects a signal that came from a different realm.
const JSDOMEnvironment = require('jest-environment-jsdom').default

const FETCH_GLOBALS = ['Request', 'Response', 'Headers', 'fetch', 'FormData', 'ReadableStream', 'AbortController', 'AbortSignal']

module.exports = class JSDOMWithFetchEnvironment extends JSDOMEnvironment {
	constructor(...args) {
		super(...args)

		FETCH_GLOBALS.forEach((name) => {
			this.global[name] = globalThis[name]
		})
	}
}
