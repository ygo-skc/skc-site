import '@testing-library/jest-dom'
// mocks window.location, which jsdom v21+ makes unforgeable/non-configurable
import 'jest-location-mock'

// jsdom ships no TextEncoder/TextDecoder, which react-router v7 requires on import
import { TextDecoder, TextEncoder } from 'node:util'

Object.assign(globalThis, { TextEncoder, TextDecoder })

// jsdom has no layout, so it ships no ResizeObserver either - a no-op stand-in lets components that measure themselves render
globalThis.ResizeObserver ??= class {
	observe() {}
	unobserve() {}
	disconnect() {}
}
