import '../../css/util/grids-and-containers.css'

import { Suspense } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'

import SuspenseFallback from '../SuspenseFallback'
import NavigationBar from '../header-footer/NavigationBar'
import Footer from '../header-footer/Footer'
import { SiteSearchProvider } from '../util/search/SiteSearch'
import { ResultsViewProvider } from '../util/ResultsViewPreference'
import { ShortcutsProvider } from '../util/ShortcutsPreference'
import useGoToShortcuts from '../util/useGoToShortcuts'

// rendered inside ShortcutsProvider, so Settings can turn the shortcuts off
function GoToShortcuts() {
	useGoToShortcuts()
	return null
}

/*
 * Contains the base layout of the whole application that will be used as the base element in the React Router
 */
export default function Layout() {
	return (
		<ShortcutsProvider>
			<ResultsViewProvider>
				<SiteSearchProvider>
					<GoToShortcuts />
					<ScrollRestoration />
					<div className='content'>
						<NavigationBar />
						<div className='routes'>
							<div className='routes-wrapper'>
								<Suspense fallback={<SuspenseFallback />}>
									<Outlet />
								</Suspense>
							</div>
						</div>
					</div>
					<Footer />
				</SiteSearchProvider>
			</ResultsViewProvider>
		</ShortcutsProvider>
	)
}
