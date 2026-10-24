import '../../css/header-footer/app-banner.css'

import { useState } from 'react'
import { Button, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import { IOS_APP_STORE_URL, needsAppBanner } from '../../helper/IOSApp'

export const APP_BANNER_DISMISSED_KEY = 'appBannerDismissed'

function wasDismissed() {
	try {
		return localStorage.getItem(APP_BANNER_DISMISSED_KEY) === 'true'
	} catch {
		return false
	}
}

// a white capsule under the nav pointing iOS visitors to the app - only where Safari's own Smart App Banner can't show
const AppBanner = () => {
	const [isShown, setIsShown] = useState(() => needsAppBanner(navigator.userAgent, navigator.maxTouchPoints) && !wasDismissed())

	if (!isShown) return null

	const dismiss = () => {
		setIsShown(false)
		try {
			localStorage.setItem(APP_BANNER_DISMISSED_KEY, 'true')
		} catch {
			// storage blocked - the banner just comes back next visit
		}
	}

	return (
		<aside className='app-banner' aria-label='SKC iOS app'>
			<img className='app-banner__icon' src='/assets/skc_ios_app.png' alt='' />
			<div className='app-banner__text'>
				<Typography variant='subtitle2' component='p'>
					SKC on iPhone
				</Typography>
				<Typography variant='caption' component='p'>
					Card search, ban lists and more
				</Typography>
			</div>
			<Button className='app-banner__get' variant='contained' disableElevation href={IOS_APP_STORE_URL}>
				Get
			</Button>
			<IconButton className='app-banner__close' aria-label='Dismiss app banner' onClick={dismiss}>
				<CloseIcon />
			</IconButton>
		</aside>
	)
}

export default AppBanner
