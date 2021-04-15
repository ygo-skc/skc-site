import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { ChildBox } from '../MainContent'

import CardDisplayGrid from '../util/grid/CardDisplayGrid'

import { Hint } from '../util/Hints'


const BanListSection = ( { sectionExplanation, cards, isDataLoaded } ) =>
{
	const [cardTypeContentGrid, setCardTypeContentGrid] = useState([])


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
			<Hint variant='subtitle1'>
				{sectionExplanation}
			</Hint>
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