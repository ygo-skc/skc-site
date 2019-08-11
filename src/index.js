import React, { Component } from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from './home'
import BanList from './ban_list'
import ServerError from './Error_Pages/server_err'

render(
	<Router >
		<Route path='/' exact component={Home} />
		<Route path='/ban_list' component={BanList} />
		<Route path='/server_err' component={ServerError} />
	</Router>,
	document.getElementById('root')
)
