import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import SuspenseFallback from './SuspenseFallback'

import { Card } from './components/card/Card'
import { Browse } from './components/Browse'

const Home = lazy( () => import('./components/Home') )
const BanList = lazy( () => import('./components/banlist/BanList') )
const ProductInfo = lazy( () => import('./components/product/ProductInfo') )
const About = lazy( () => import( './components/about/About') )
const HttpErr = lazy( () => import('./components/exception/HttpErr') )


const NAME_maps_ROUTE : { [key: string]: string } =
{
	'Home': '/',
	'BanList': '/ban_list',
	'About': '/about',
	'Card': '/card/:cardId',
	'CardBrowse': '/cards/browse',
	'ProductInfo': '/product/:productId',

	'400': '/bad_request',
	'500': '/server_err',
	'503': '/service_unavailable'
}


export default function Routes()
{
	return (
		<Router >
			<Suspense
				fallback={ <SuspenseFallback /> } >
				<Switch>
					<Route
						path={NAME_maps_ROUTE.Home}
						exact
						component={Home} />
					<Route
						path={NAME_maps_ROUTE.BanList}
						exact
						component={BanList} />
					<Route
						path={NAME_maps_ROUTE.Card}
						exact
						component={Card} />
					<Route
						path={NAME_maps_ROUTE.CardBrowse}
						exact
						component={Browse} />
					<Route
						path={NAME_maps_ROUTE.ProductInfo}
						exact
						component={ProductInfo} />

					<Route
						path={NAME_maps_ROUTE.About}
						exact
						component={About} />

					{ /* Routes specifically for errs */ }
					<Route
						path={NAME_maps_ROUTE[400]}
						exact
						component={() => <HttpErr httpErr={400} />} />
					<Route
						path={NAME_maps_ROUTE[500]}
						exact
						component={() => <HttpErr httpErr={500} />} />
					<Route
						path={NAME_maps_ROUTE[503]}
						exact
						component={() => <HttpErr httpErr={503} />} />
					<Route
						component={() => <HttpErr httpErr={404} />} />
				</Switch>
			</Suspense>
		</Router>
	)
}


export { NAME_maps_ROUTE }