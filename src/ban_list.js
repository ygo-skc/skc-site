import React, { Component } from 'react'

import 'typeface-roboto'
import { Typography } from '@material-ui/core';

import Grid from '@material-ui/core/Grid'

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Button from '@material-ui/core/Button'

/*
	Custom Components
*/
import BanListSection from './ban_list_section'
import BreadCrumb from './breadcrumb.js'
import handleFetchErrRedirect from './Helper/fetch_handler'
import TabbedView from './tabbed_view'

class BanList extends Component
{
	constructor(props)
	{
		super(props)
		this.state = {
			banListsStartDates: [],
			banListGrid: [],
			selectedBanList: '',
			months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

			forbidden: [],
			limited: [],
			semiLimited: [],

			banListContent: []
		}

		/*
			Binding methods to class context
		*/
		this.getDateString = this.getDateString.bind(this)
		this.fetchBanList = this.fetchBanList.bind(this)
		this.fetchBanListStartDates = this.fetchBanListStartDates.bind(this)
		this.changeBanList = this.changeBanList.bind(this)

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
				}, this.fetchBanList)

				let banListGrid = []
				this.state.banListsStartDates.forEach((item, ind) => {
					banListGrid.push(<Grid key={ind} item xs={6} sm={3} md={2} lg={1} xl={1} >
							<Button size='small' id={ind} onClick={this.changeBanList} >
								{this.getDateString(new Date(item))}
							</Button>
						</Grid>
					)
				})

				this.setState({
					banListGrid: banListGrid
				})
			})
	}

	changeBanList(button)
	{
		const selectedBanList = this.state.banListsStartDates[button.currentTarget.id]

		if (selectedBanList !== this.state.selectedBanList)
		{
			this.setState({
				selectedBanList: selectedBanList
			}, this.fetchBanList)
		}


	}


	fetchBanList(banListUrl = `http://localhost:9999/ban_list/${this.state.selectedBanList}`)
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

					<ExpansionPanel elevation={0} >
						<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
							<Typography style={{flexBasis: '20%', flexShrink: 0 }} variant='h6' >Ban Lists:</Typography>
							<Typography variant='subtitle1' >
								Currently viewing ban list effective {this.getDateString(new Date(this.state.selectedBanList))}
							</Typography>
						</ExpansionPanelSummary>

						<ExpansionPanelDetails>
							<Grid container >
								{this.state.banListGrid}
							</Grid>
						</ExpansionPanelDetails>
					</ExpansionPanel>


					<TabbedView
					content={
						[
							<BanListSection sectionName={'Forbidden'} sectionExplanation={"Forbidded cards cannot be used in a duel in the Advanced Format."} cards={this.state.forbidden} />,
							<BanListSection sectionName={'Limited'} sectionExplanation={"Below cards can only appear once in a  Main Deck or Side Deck."} cards={this.state.limited} />,
							<BanListSection sectionName={'Semi-Limited'} sectionExplanation={"Below cards can only appear twice in a  Main Deck or Side Deck."} cards={this.state.semiLimited} />
							]
					}
					/>
				</div>
			)
		}
}


export default BanList