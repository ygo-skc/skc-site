import React, { Component } from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import BreadCrumb from './breadcrumb.js'
import BanList from './ban_list.js'

class Home extends Component
{
	constructor(props)
	{
		super(props)
		this.state =
		{
			breadCrumbs: ['Home']
		}
	}


	render()
	{
		return (
			<div>
				<BreadCrumb crumbs={['Home']} />
				<p>home</p>
			</div>
		)
	}
}

render(
	<Router >
		<Route path='/' exact component={Home} />
		<Route path='/ban_list' component={BanList} />
	</Router>,
	document.getElementById('root')
)
