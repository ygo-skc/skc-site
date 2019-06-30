import React, { Component } from 'react'

import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'

import NAME_maps_ROUTE from './Helper/site_map.js'

class BreadCrumb extends Component
{
	render()
	{
		let Crumbs = []
		this.props.crumbs.forEach((item, ind) =>
		{
			Crumbs.push(
				<Link color='inherit' href={NAME_maps_ROUTE[item]} key={ind} >
					{item}
				</Link>
			)
		})
		return(
			<div>
				<Paper elevation={0} >
					<Breadcrumbs aria-label='Breadcrumb'>
						{Crumbs}
					</Breadcrumbs>
				</Paper>
			</div>
		)
	}
}

export default BreadCrumb