import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import SuspenseFallback from '../SuspenseFallback'

import '../../css/util/grids-and-containers.css'

const Home = lazy(() => import('./Home'))

const BanList = lazy(() => import('./BanList'))

const ProductBrowse = lazy(() => import('./ProductBrowse'))
const ProductInfo = lazy(() => import('./ProductInfo'))

const Browse = lazy(() => import('./BrowseCards'))
const CardInformation = lazy(() => import('./CardInformation'))

const About = lazy(() => import('./About'))
const HttpErr = lazy(() => import('./HttpErr'))

class _SKCSiteRoutes {
	static readonly NAME_maps_ROUTE: { [key: string]: string } = {
		Home: '/',
		BanList: '/ban_list',
		About: '/about',
		Card: '/card/:cardId',
		CardBrowse: '/browse/card',
		ProductBrowse: '/browse/product',
		ProductInformation: '/product/:productId',

		'400': '/bad-request',
		'408': '/request-timeout',
		'422': '/unprocessable-entity',
		'404-Server': '/not-found',
		'500': '/server-err',
		'503': '/service-unavailable',
	}
}

export default function SKCSiteRoutes() {
	return (
		<Router>
			<Suspense fallback={<SuspenseFallback />}>
				<Routes>
					<Route path={_SKCSiteRoutes.NAME_maps_ROUTE.Home} element={<Home />} />
					<Route path={_SKCSiteRoutes.NAME_maps_ROUTE.BanList} element={<BanList />} />
					<Route path={_SKCSiteRoutes.NAME_maps_ROUTE.Card} element={<CardInformation />} />
					<Route path={_SKCSiteRoutes.NAME_maps_ROUTE.CardBrowse} element={<Browse />} />

					<Route path={_SKCSiteRoutes.NAME_maps_ROUTE.ProductBrowse} element={<ProductBrowse />} />
					<Route path={_SKCSiteRoutes.NAME_maps_ROUTE.ProductInformation} element={<ProductInfo />} />

					<Route path={_SKCSiteRoutes.NAME_maps_ROUTE.About} element={<About />} />

					{/* Routes specifically for errs */}
					<Route path={_SKCSiteRoutes.NAME_maps_ROUTE[400]} element={<HttpErr httpErr={'400'} />} />
					<Route path={_SKCSiteRoutes.NAME_maps_ROUTE[408]} element={<HttpErr httpErr={'408'} />} />
					<Route path={_SKCSiteRoutes.NAME_maps_ROUTE[422]} element={<HttpErr httpErr={'422'} />} />
					<Route path={_SKCSiteRoutes.NAME_maps_ROUTE[500]} element={<HttpErr httpErr={'500'} />} />
					<Route path={_SKCSiteRoutes.NAME_maps_ROUTE[503]} element={<HttpErr httpErr={'503'} />} />
					<Route path={_SKCSiteRoutes.NAME_maps_ROUTE['404-Server']} element={<HttpErr httpErr={'404-Server'} />} />
					<Route path={'/*'} element={<HttpErr httpErr={'404-Client'} />} />
				</Routes>
			</Suspense>
		</Router>
	)
}

export { _SKCSiteRoutes }
