import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Home from '../components/Home'
import BanList from '../components/banlist/BanList'
import ServerError from '../components/exception/server_err'
import NotFound from '../components/exception/not_found'

export default function Routes()
{
	return (
		<Router >
			<Switch>
				<Route path='/' exact component={Home} />
				<Route path='/BanList' exact component={BanList} />
				<Route path='/server_err' exact component={ServerError} />
				<Route component={NotFound} />
			</Switch>
		</Router>
	)
}