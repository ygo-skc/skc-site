
import React, { Component } from 'react'

import BreadCrumb from './breadcrumb'

import { Typography, Link, Paper } from '@material-ui/core'


class Home extends Component {
	constructor(props) {
		super(props)
		this.state =
			{
				breadCrumbs: ['Home']
			}
	}


	render() {
		return (
			<div style={{height: '100%'}} >
				<Paper style={{verticalAlign: 'middle', padding: 20}} >
					<Typography variant='h3'>
						Website Name
					</Typography>
					<Typography variant='h6' style={{marginTop: 20}} >
						Check out the <Link href={'/ban_list'} >Ban List</Link>
					</Typography>
				</Paper>
			</div>
		)
	}
}

export default Home