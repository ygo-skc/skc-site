// the SKC iOS app - Safari shows its own Smart App Banner from the apple-itunes-app meta tag in public/index.html
export const IOS_APP_STORE_URL = 'https://apps.apple.com/us/app/skc-yugioh-database/id6737700875'

// browsers on iOS that report Safari in their user agent but never show the Smart App Banner, plus in-app browsers
const NOT_SAFARI = /CriOS|FxiOS|EdgiOS|OPiOS|OPT\/|GSA\/|Ddg\/|DuckDuckGo|YaBrowser|FBAN|FBAV|Instagram|Line\/|Twitter|Snapchat|Discord/

// iPads request desktop sites, so they report as a Mac - a touch screen tells them apart
export function isIOS(userAgent: string, maxTouchPoints: number): boolean {
	return /iPhone|iPad|iPod/.test(userAgent) || (/Macintosh/.test(userAgent) && maxTouchPoints > 1)
}

// true on iOS when the browser won't show Safari's Smart App Banner, so the site should show its own
export function needsAppBanner(userAgent: string, maxTouchPoints: number): boolean {
	return isIOS(userAgent, maxTouchPoints) && (!/Safari\//.test(userAgent) || NOT_SAFARI.test(userAgent))
}
