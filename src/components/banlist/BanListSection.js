import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Typography, Box } from '@material-ui/core'

import { ChildBox } from '../MainContent'

import CardDisplayGrid from '../grid/CardDisplayGrid'


const BanListSection = ( { sectionExplanation, cards, isDataLoaded } ) =>
{
	const [cardTypeContentGrid, setCardTypeContentGrid] = useState([])

	const SectionInfoText = styled(Typography)`
		&&
		{
			color: #5e6d7d;
		}
	`


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
			<Box style={{backgroundColor: '#f6f2fb', padding: '1.4rem', margin: '1.5rem', borderRadius: '1.5rem'}} >
				<SectionInfoText variant='subtitle2' align='center' >
					{ sectionExplanation }
				</SectionInfoText>
			</Box>

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