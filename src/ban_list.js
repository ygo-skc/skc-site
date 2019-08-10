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
			numberOfCards: 2
		}

		/*
			Binding methods to class conext
		*/
		this.getDateString = this.getDateString.bind(this)
		this.fetchBanList = this.fetchBanList.bind(this)
		this.fetchBanListStartDates = this.fetchBanListStartDates.bind(this)
		this.test = this.test.bind(this)

		this.fetchBanListStartDates()

	}

	getDateString(date)
	{
		return `${this.state.months[date.getMonth()]} ${date.getDate() + 1}, ${date.getFullYear()}`
	}


	fetchBanListStartDates()
	{
		const banListsUrl = "http://localhost:9999/ban_list/startDates"

		fetch(banListsUrl)
		.then((data) => data.json())
			.then((resultJson) => {
				this.setState({
					banListsStartDates: resultJson.banListStartDates,
					selectedBanList: resultJson.banListStartDates[0]
				}, () => this.fetchBanList(`http://localhost:9999/ban_list/${this.state.selectedBanList}`))

				let banListGrid = []
				this.state.banListsStartDates.forEach((item, ind) => {
					banListGrid.push(<Grid item xs={6} sm={3} md={2} lg={1} xl={1} >
						<Typography onClick={this.test()} >{this.getDateString(new Date(item))}</Typography>
					</Grid>
					)
				})

				this.setState({
					banListGrid: banListGrid
				})
			})
	}

	test()
	{
		console.log('i work')
	}


	fetchBanList(banListUrl)
		{
		fetch(banListUrl)
			.then((data) => {
				if (data.ok) return data.json()
				else throw new Error(data.statusText)
			})
			.then((results) => {
			this.setState({
				forbidden: results.bannedCards.forbidden,
				limited: results.bannedCards.limited,
				semiLimited: results.bannedCards.semiLimited,
			})
		})
			.catch((err) => {
				handleFetchErrRedirect(this, 'test', '/server_err')
			})
	}

		render()
		{
			return (
				<div>
					<BreadCrumb crumbs={['Home', 'Ban List']} />
					<BanListSection sectionName={'Forbidden'} sectionExplanation={"Below cards cannot be used in Main Deck or Side Deck if playing in the Advanced format."} cards={this.state.forbidden} numberOfCards={this.state.numberOfCards} />
					<BanListSection sectionName={'Limited'} sectionExplanation={"Below cards can only appear once in a  Main Deck or Side Deck."} cards={this.state.limited} numberOfCards={this.state.numberOfCards} />
					<BanListSection sectionName={'Semi-Limited'} sectionExplanation={"Below cards can only appear twice in a  Main Deck or Side Deck."} cards={this.state.semiLimited} numberOfCards={this.state.numberOfCards} />
				</div>
			)
		}
}


export default BanList