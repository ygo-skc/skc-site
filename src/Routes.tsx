import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import SuspenseFallback from './SuspenseFallback'

const Home = lazy( () => import('./components/home/Home') )

const BanList = lazy( () => import('./components/banlist/BanList') )

const ProductBrowse = lazy( () => import('./components/product/ProductBrowse') )
const ProductInfo = lazy( () => import('./components/product/ProductInfo') )

const Browse = lazy( () => import('./components/Browse') )
const Card = lazy( () => import('./components/card/card-information/CardInformation') )

const About = lazy( () => import( './components/about/About') )
const HttpErr = lazy( () => import('./components/util/exception/HttpErr') )


const NAME_maps_ROUTE : { [key: string]: string } =
{
	'Home': '/',
	'BanList': '/ban_list',
	'About': '/about',
	'Card': '/card/:cardId',
	'CardBrowse': '/browse/card',
	'ProductBrowse': '/browse/product',
	'ProductInformation': '/product/:productId',

	'400': '/bad_request',
	'404': '/not_found',
	'500': '/server_err',
	'503': '/service_unavailable'
}


export default function SKCSiteRoutes()
{
	return (
		<Router >
			<Suspense
				fallback={ <SuspenseFallback /> } >
				<Routes>
					<Route
						path={NAME_maps_ROUTE.Home}
						element={ <Home/> } />
					<Route
						path={NAME_maps_ROUTE.BanList}
						element={ <BanList/> } />
					<Route
						path={NAME_maps_ROUTE.Card}
						element={ <Card/> } />
					<Route
						path={NAME_maps_ROUTE.CardBrowse}
						element={ <Browse/> } />

					<Route
						path={NAME_maps_ROUTE.ProductBrowse}
						element={ <ProductBrowse/> } />
					<Route
						path={NAME_maps_ROUTE.ProductInformation}
						element={ <ProductInfo/> } />

					<Route
						path={NAME_maps_ROUTE.About}
						element={ <About/> } />

					{ /* Routes specifically for errs */ }
					<Route
						path={NAME_maps_ROUTE[400]}
						element={ <HttpErr httpErr={400}/> } />
					<Route
						path={NAME_maps_ROUTE[500]}
						element={ <HttpErr httpErr={500}/> } />
					<Route
						path={NAME_maps_ROUTE[503]}
						element={ <HttpErr httpErr={503}/> } />
					<Route
						path={'/*'}
						element={ <HttpErr httpErr={404}/> } />
				</Routes>
			</Suspense>
		</Router>
	)
}


export { NAME_maps_ROUTE }