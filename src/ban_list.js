import React, { Component } from 'react'

import 'typeface-roboto'

import BreadCrumb from './breadcrumb.js'

import BanListSection from './ban_list_section.js'

class BanList extends Component
{
	constructor(props)
	{
		super(props)
		this.state = {
			cards: []
		}

		let url = "http://localhost:8080/ban_list"

		fetch(url)
		.then((data) => data.json())
		.then((results) =>
		{
			this.setState({cards: results.cards})

		})

	}

		render()
		{
			return (
				<div>
					<BreadCrumb crumbs={['Home', 'Ban List']} />
					<BanListSection sectionName={'Forbidden'} cards={this.state.cards} />
					<BanListSection sectionName={'Limited'} cards={this.state.cards} />
					<BanListSection sectionName={'Semi-Limited'} cards={this.state.cards} />
				</div>
			)
		}
}


export default BanList