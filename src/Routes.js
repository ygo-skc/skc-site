import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Home from './components/Home'
import BanList from './components/banlist/BanList'
import About from './components/about/About'
import HttpErr from './components/exception/HttpErr'


const NAME_maps_ROUTE =
{
	'Home': '/',
	'BanList': '/ban_list',
	'About': '/about',

	400: '/bad_request',
	500: '/server_err',
}


export default function Routes()
{
	return (
		<Router >
			<Switch>
				<Route path={NAME_maps_ROUTE.Home} exact component={Home} />
				<Route path={NAME_maps_ROUTE.BanList} exact component={BanList} />
				<Route path={NAME_maps_ROUTE.About} exact component={About} />

				<Route path={NAME_maps_ROUTE[400]} exact component={() => <HttpErr httpErr={400} />} />
				<Route path={NAME_maps_ROUTE[500]} exact component={() => <HttpErr httpErr={500} />} />
				<Route component={() => <HttpErr httpErr={404} />} />
			</Switch>
		</Router>
	)
}


export { NAME_maps_ROUTE }