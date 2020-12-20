import React, {useState, useEffect, memo} from 'react'

import { Grid, IconButton, Box, Typography } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';


import CardImageRounded from '../card/CardImageRounded'

import YGOCard from '../card/YGOCard'
import Footer from '../Footer'


async function getPlaceholderCardComponent()
{
	const placeHolder = []

	var i = 0;
	for (i = 0; i < 20; i++)
	{
		placeHolder.push(<Grid
			key={`skeleton-${i}`}
			item
			xs={6}
			sm={4}
			md={4}
			lg={3}
			xl={2}
			style={{ padding: '.25rem' }} >
				<Skeleton variant='circle' height='150' width='150' style={{margin: 'auto'}} />
				<Skeleton variant='rect' width='100%' height='100' />
		</Grid>)
	}

	return placeHolder
}


const CardDisplayGrid = memo( ({ cardJsonResults, numResultsDisplayed, numItemsToLoadWhenNeeded, loadMoreCallback, isLoadMoreOptionVisible, showFooter=true, numResults, isDataLoaded}) =>
{
	const [cardGridUI, setCardGridUI] = useState([])

	const [cardGridUISkeleton, setCardGridUISkeleton] = useState([])
	const [clearGrid, setClearGrid] = useState(false)

	const renderCards = () =>
	{
		return cardJsonResults.slice(numResultsDisplayed - numItemsToLoadWhenNeeded, numResultsDisplayed).map( (card, index) => {
			return <Grid
				key={card.cardID}
				item
				xs={6}
				sm={4}
				md={4}
				lg={3}
				xl={2}
				style={{ padding: '.25rem', cursor: 'pointer' }}
				onClick={ () => window.location.assign(`/card/${card.cardID}`) } >

				<CardImageRounded
					cardID={card.cardID}
					timeout={index % 6 * 5}
					/>

				<YGOCard
					isNew={ false }
					cardName={card.cardName}
					cardColor={card.cardColor}
					cardEffect={card.cardEffect + '\n\n\n'}
					monsterType={card.monsterType}
					cardID={card.cardID}
					fullDetails={ false }
					effectMaxLineHeight={3}
				/>
			</Grid>

		})
	}


	useEffect( () => {
		if (isDataLoaded === false) getPlaceholderCardComponent().then( placeholders => setCardGridUISkeleton(placeholders) )
	}, [isDataLoaded])


	useEffect( () => {
		if (numResults === 0)
		{
			setClearGrid(true)
			return
		}

		setCardGridUI([...cardGridUI, ...renderCards()])
	}, [numResultsDisplayed, cardJsonResults, numResults])


	useEffect( () => {
		if (clearGrid === true)
		{
			setCardGridUI([])
			setClearGrid(false)
		}
	}, [clearGrid])


	return(
		<Box>
			<Grid>
				<Grid container >
					{(!isDataLoaded)? cardGridUISkeleton : (numResults === 0)? <Typography variant='h5' style={{margin: 'auto'}} >No Content To Show</Typography> : cardGridUI}
				</Grid>
			</Grid>

			{
				(!isDataLoaded)?
				undefined :
				<IconButton
					onClick={ () => loadMoreCallback()}
					style={(isLoadMoreOptionVisible)? {display: 'block', margin: 'auto', background: '#310e68', backgroundImage: 'linear-gradient(316deg, #310e68 0%, #5f0f40 74%)', color: 'rgba(255, 255, 255, .95)', marginTop: '1.5rem', marginBottom: '1.5rem'} : {display: 'none'}} >
					<ExpandMoreRoundedIcon />
				</IconButton>
			}

			{ (showFooter)? <Footer /> : undefined }
		</Box>
	)
}, (prevProps, newProps) => {
	if ( prevProps.isDataLoaded !== newProps.isDataLoaded || prevProps.numResults !== newProps.numResults || prevProps.numResultsDisplayed !== newProps.numResultsDisplayed || prevProps.cardJsonResults !== newProps.cardJsonResults )
		return false

	return true
})

export default CardDisplayGrid