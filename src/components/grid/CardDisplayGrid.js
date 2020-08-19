import React, {useState, useEffect} from 'react'

import { Grid, Button } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'


import {YGOCard} from '../card/YGOCard'
import cardStyles from '../card/YGOCardStyles'

function getPlaceholderCardComponent()
{
	const placeHolder = []

	var i = 0;
	for (i = 0; i < 10; i++)
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
				<Skeleton variant='circle' height='100' width='100' style={{margin: 'auto'}} />
				<Skeleton variant='rect' width='100%' height='100' />
		</Grid>)
	}

	return placeHolder
}


export default function CardDisplayGrid({ cardJsonResults, numResultsDisplayed, numResultsLoaded, loadMoreCallback, isLoadMoreOptionVisible })
{
	const [cardGridUI, setCardGridUI] = useState([])

	const [isLoadingData, setIsLoadingData] = useState(false)
	const [cardGridUISkeleton, setCardGridUISkeleton] = useState([])

	useEffect( () => {
		if (cardJsonResults === undefined) return

		setIsLoadingData(true)
		setCardGridUISkeleton([...cardGridUI, getPlaceholderCardComponent()])
		setTimeout(() => {
			setIsLoadingData(false)
		}, 250);

		const cards = cardJsonResults.slice(numResultsDisplayed - numResultsLoaded, numResultsDisplayed).map( card => {
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
					<div style={{margin: 'auto', marginBottom: '.5rem', width: '85%'}} >
						<div
							style={{ borderRadius: '50%', overflow: 'hidden', width: '100%',  height: '0', paddingBottom: '100%' }} >
							<img src={`https://storage.googleapis.com/ygoprodeck.com/pics_artgame/${card.cardID}.jpg`} style={{  width: '100%', objectFit: 'cover' }} />
						</div>
					</div>
				<YGOCard
					isNew={ false }
					cardName={card.cardName}
					cardColor={card.cardColor}
					cardEffect={card.cardEffect + '\n\n\n'}
					monsterType={card.monsterType}
					cardStyles={ cardStyles }
					cardID={card.cardID}
					fullDetails={ false }
					effectMaxLineHeight={3}
				/>
			</Grid>

		})

		setCardGridUI([...cardGridUI, ...cards])
	}, [numResultsDisplayed])


	useEffect( () => {
		setCardGridUI([])
	}, [cardJsonResults])


	useEffect( () => {
		if (numResultsDisplayed == 0)
		{
			setCardGridUI([])
		}
	}, [numResultsDisplayed])


	return(
		<Grid>

			<Grid container >

				{(isLoadingData)? cardGridUISkeleton : cardGridUI}
				{
					(isLoadingData)?
					undefined :
					<Button onClick={ () => loadMoreCallback()} style={(isLoadMoreOptionVisible)? {display: 'block'} : {display: 'none'}} >
						Press me to load more
					</Button>
				}

			</Grid>

		</Grid>
	)
}