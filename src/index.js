import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Home from './components/home'
import BanList from './components/banlist/BanList'
import ServerError from './components/exception/server_err'
import NotFound from './components/exception/not_found'

render(
	<Router >
		<Switch>
			<Route path='/' exact component={Home} />
			<Route path='/BanList' exact component={BanList} />
			<Route path='/server_err' exact component={ServerError} />
			<Route component={NotFound} />
		</Switch>
	</Router>,
	document.getElementById('root')
)
