import './index.css'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'

import Routes from './components/pages/Routes'
import MuiTheme from './components/MuiTheme'
import { Suspense, lazy } from 'react'
import { Skeleton } from '@mui/material'

const root = createRoot(document.getElementById('root') as Element)
const NavigationBar = lazy(() => import('./components/header-footer/NavigationBar'))
const Footer = lazy(() => import('./components/header-footer/Footer'))

root.render(
	<ThemeProvider theme={MuiTheme}>
		<div className='content'>
			<Suspense fallback={<Skeleton variant='rectangular' width='100%' height='7rem' />}>
				<NavigationBar />
			</Suspense>
			<div className='routes'>
				<div className='routes-wrapper'>
					<Routes />
				</div>
			</div>
		</div>
		<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='16.5rem' />}>
			<Footer />
		</Suspense>
	</ThemeProvider>
)
