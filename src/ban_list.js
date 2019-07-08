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
			forbidden: [],
			limited: [],
			semiLimited: [],
		}

		let url = "http://localhost:8080/ban_list"

		fetch(url)
		.then((data) => data.json())
		.then((results) =>
		{
			this.setState({
				forbidden: results.bannedCards.forbidden,
				limited: results.bannedCards.limited,
				semiLimited: results.bannedCards.semiLimited,
			})
		})

	}

		render()
		{
			return (
				<div>
					<BreadCrumb crumbs={['Home', 'Ban List']} />
					<BanListSection sectionName={'Forbidden'} sectionExplanation={"Below cards cannot be used in Main Deck or Side Deck if playing in the Advanced format."} cards={this.state.forbidden} />
					<BanListSection sectionName={'Limited'} sectionExplanation={"Below cards can only appear once in a  Main Deck or Side Deck."} cards={this.state.limited} />
					<BanListSection sectionName={'Semi-Limited'} sectionExplanation={"Below cards can only appear twice in a  Main Deck or Side Deck."} cards={this.state.semiLimited} />
				</div>
			)
		}
}


export default BanList