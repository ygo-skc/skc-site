import '../../css/util/grids-and-containers.css'

import { Suspense, lazy } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Skeleton } from '@mui/material'

import SuspenseFallback from '../SuspenseFallback'

const NavigationBar = lazy(() => import('../header-footer/NavigationBar'))
const Footer = lazy(() => import('../header-footer/Footer'))

/*
 * Contains the base layout of the whole application that will be used as the base element in the React Router
 */
export default function Layout() {
	return (
		<>
			<ScrollRestoration />
			<div className='content'>
				<Suspense fallback={<Skeleton variant='rectangular' width='100%' height='108px' />}>
					<NavigationBar />
				</Suspense>
				<div className='routes'>
					<div className='routes-wrapper'>
						<Suspense fallback={<SuspenseFallback />}>
							<Outlet />
						</Suspense>
					</div>
				</div>
			</div>
			<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='16.5rem' />}>
				<Footer />
			</Suspense>
		</>
	)
}
