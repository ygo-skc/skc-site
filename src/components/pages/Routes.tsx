import '../../css/util/grids-and-containers.css'

import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import SuspenseFallback from '../SuspenseFallback'

import AppRoutes from '../../helper/AppRoutes'

const Home = lazy(() => import('./Home'))

const BanList = lazy(() => import('./BanList'))

const ProductBrowse = lazy(() => import('./ProductBrowse'))
const ProductInfo = lazy(() => import('./ProductInfo'))

const Browse = lazy(() => import('./CardsBrowse'))
const CardInformation = lazy(() => import('./CardInformation'))

const About = lazy(() => import('./About'))
const Privacy = lazy(() => import('./Privacy'))
const HttpErr = lazy(() => import('./HttpErr'))

export default function SKCSiteRoutes() {
	return (
		<Router>
			<Suspense fallback={<SuspenseFallback />}>
				<Routes>
					<Route index element={<Home />} />
					<Route path={AppRoutes.BanList} element={<BanList />}>
						<Route path=':specifiedFormat' element={<BanList />} />
					</Route>

					<Route path={AppRoutes.Card} element={<CardInformation />} />
					<Route path='browse'>
						<Route path='card' element={<Browse />} />
						<Route path='product' element={<ProductBrowse />} />
					</Route>

					<Route path={AppRoutes.ProductInformation} element={<ProductInfo />} />

					<Route path={AppRoutes.About} element={<About />} />
					<Route path={AppRoutes.Privacy} element={<Privacy />} />

					{/* Routes specifically for errs */}
					<Route path={AppRoutes.BadRequest} element={<HttpErr httpErr={'400'} />} />
					<Route path={AppRoutes.RequestTimeout} element={<HttpErr httpErr={'408'} />} />
					<Route path={AppRoutes.UnprocessableEntity} element={<HttpErr httpErr={'422'} />} />
					<Route path={AppRoutes.GenericServerError} element={<HttpErr httpErr={'500'} />} />
					<Route path={AppRoutes.ServiceUnavailable} element={<HttpErr httpErr={'503'} />} />
					<Route path={AppRoutes.Server404Error} element={<HttpErr httpErr={'404-Server'} />} />
					<Route path='/*' element={<HttpErr httpErr={'404-Client'} />} />
				</Routes>
			</Suspense>
		</Router>
	)
}
