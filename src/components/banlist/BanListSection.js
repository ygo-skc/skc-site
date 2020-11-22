import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Typography, Grid } from '@material-ui/core'

import { ChildBox } from '../MainContent'

import CardDisplayGrid from '../grid/CardDisplayGrid'


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
				isDataLoaded={isDataLoaded}
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