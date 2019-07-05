import React, { Component } from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import BreadCrumb from './breadcrumb.js'
import BanList from './ban_list.js'

import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'

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
				<Typography variant='subtitle1'>
					Check out the <Link href={'/ban_list'} >Ban List</Link>
				</Typography>
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
