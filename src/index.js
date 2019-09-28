import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Home from './Component/home'
import BanList from './Component/BanList/ban_list'
import ServerError from './Component/Exceptions/server_err'
import NotFound from './Component/Exceptions/not_found'

render(
	<Router >
		<Switch>
			<Route path='/' exact component={Home} />
			<Route path='/ban_list' exact component={BanList} />
			<Route path='/server_err' exact component={ServerError} />
			<Route component={NotFound} />
		</Switch>
	</Router>,
	document.getElementById('root')
)
