import { isIOS, needsAppBanner } from '../IOSApp'

const SAFARI = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1'
const CHROME = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.7390.41 Mobile/15E148 Safari/604.1'
const FIREFOX = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/144.0 Mobile/15E148 Safari/605.1.15'
const IN_APP = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
const IPAD_SAFARI = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15'
const ANDROID_CHROME = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36'

test('verify iPads asking for desktop sites still count as iOS, but Macs do not', () => {
	expect(isIOS(IPAD_SAFARI, 5)).toBe(true)
	expect(isIOS(IPAD_SAFARI, 0)).toBe(false)
	expect(isIOS(SAFARI, 5)).toBe(true)
})

test('verify Safari gets no site banner since it shows its own', () => {
	expect(needsAppBanner(SAFARI, 5)).toBe(false)
	expect(needsAppBanner(IPAD_SAFARI, 5)).toBe(false)
})

test('verify other iOS browsers and in-app browsers get the site banner', () => {
	expect(needsAppBanner(CHROME, 5)).toBe(true)
	expect(needsAppBanner(FIREFOX, 5)).toBe(true)
	expect(needsAppBanner(IN_APP, 5)).toBe(true)
})

test('verify non-iOS devices get no banner', () => {
	expect(needsAppBanner(ANDROID_CHROME, 5)).toBe(false)
	expect(needsAppBanner(IPAD_SAFARI.replace('Version/18.6 ', 'Chrome/141 '), 0)).toBe(false)
})
