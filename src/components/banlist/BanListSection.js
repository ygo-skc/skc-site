import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Typography, Grid, CircularProgress } from '@material-ui/core'

import CardDetails from '../card/BanListYGOCard.js'
import cardStyles from '../card/YGOCardStyles'

import { ChildBox } from '../MainContent'

import CardDisplayGrid from '../grid/CardDisplayGrid'


const cardSectionTextColors = {
	'normal': 'rgba(249, 160, 16, 1)'
	, 'effect': 'rgba(248, 87, 0, 1)'
	, 'ritual': 'rgba(25, 118, 210, 0.66)'
	, 'fusion': 'rgba(131, 93, 196, 1)'
	, 'synchro': 'rgba(139, 139, 139, 0.91)'
	, 'xyz': 'rgba(33, 33, 33, 0.71)'
	, 'pendulum-normal': 'linear-gradient(45deg, #f9c414 0%, #00cdb1 50%)'
	, 'pendulum-effect': 'linear-gradient(45deg, #ff6410 0%, #00cdb1 50%)'
	, 'link': 'rgba(21, 101, 192, 0.8)'
	, 'spell': 'rgba(0, 146, 126, 0.85)'
	, 'trap': 'rgba(173, 20, 87, 0.78)'
}


const CardSectionBaseText = styled(Typography)`
	&&
	{
		margin-bottom: 1rem;
		margin-top: 2rem;
		text-transform: uppercase;
		letter-spacing: .25rem;

		@media screen and (min-width: 0px)
		{
			margin-left: .5rem;
		}
		@media screen and (min-width: 600px)
		{
			margin-left: .5rem;
		}
		@media screen and (min-width: 800px)
		{
			margin-left: 1rem;
		}
		@media screen and (min-width: 1500px)
		{
			margin-left: 1.2rem;
		}
		@media screen and (min-width: 1800px)
		{
			margin-left: 1.5rem;
		}
	}
`

const CardSectionBasePendulum = styled(CardSectionBaseText)`
	&&
	{
		-webkit-text-fill-color: transparent;
	}
`


const CardItem = styled(Grid)`
&&
{
	cursor: pointer;

	@media screen and (min-width: 0px)
	{
		padding-bottom: .75rem;
	}
	@media screen and (min-width: 600px)
	{
		padding: .5rem;
	}
	@media screen and (min-width: 800px)
	{
		padding: .7rem;
	}
	@media screen and (min-width: 960px)
	{
		padding: .5rem;
	}
	@media screen and (min-width: 1500px)
	{
		padding: .75rem;
	}
	@media screen and (min-width: 1800px)
	{
		padding: 1rem;
	}
}
`


const BanListSection = ( { sectionExplanation, cards, newCards, isDataLoaded } ) =>
{
	const [cardTypeContentGrid, setCardTypeContentGrid] = useState([])

	const SectionInfoText = styled(Typography)`
		&&
		{
			margin-top: .75rem;
			margin-bottom: 1.75rem;
			color: #2b3239;
		}
	`

	function isNewCard(cardID)
	{
		// eslint-disable-next-line
		if ( newCards != "" && cardID !== undefined )
		{
			const isNew = newCards.find( currentItem => {
				if (currentItem.id === cardID)	return true
				return false
			}, cardID)
			return (isNew === undefined)? false: true
		}

		return false
	}


	useEffect(() => {
		if ( isDataLoaded )
		{
			setCardTypeContentGrid(<CardDisplayGrid
				cardJsonResults={cards}
				numResultsDisplayed={cards.length}
				numResultsLoaded={cards.length}
				loadMoreCallback={undefined}
				isLoadMoreOptionVisible={false}
				showFooter={false}
			/>)
		}
		else setCardTypeContentGrid(undefined)
		// eslint-disable-next-line
	}, [isDataLoaded])



	return (
		<ChildBox >
			<SectionInfoText variant='subtitle2' align='center' >
				{ sectionExplanation }
			</SectionInfoText>

			{cardTypeContentGrid}
		</ChildBox>
	)
}


BanListSection.propTypes =
{
	sectionExplanation: PropTypes.string.isRequired,
	sectionExplanationBackground: PropTypes.string.isRequired,
	cards: PropTypes.array.isRequired,
	newCards: PropTypes.array.isRequired,
	isDataLoaded: PropTypes.bool.isRequired,
	cardClicked: PropTypes.func.isRequired
}


export default BanListSection