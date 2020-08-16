import React, {useState, useEffect} from 'react'

import { Grid, Button } from '@material-ui/core'


import {YGOCard} from '../card/YGOCard'
import cardStyles from '../card/YGOCardStyles'


export default function CardDisplayGrid({ cardJsonResults, numResultsDisplayed, numResultsLoaded, loadMoreCallback, isLoadMoreOptionVisible })
{
	const [cardGridUI, setCardGridUI] = useState([])


	useEffect( () => {
		if (cardJsonResults === undefined)	return

		const cards = cardJsonResults.slice(numResultsDisplayed - numResultsLoaded, numResultsDisplayed).map( card => {
			return <Grid
				key={card.cardID}
				item
				xs={6}
				sm={4}
				md={3}
				lg={2}
				xl={1}
				style={{ padding: '.25rem', cursor: 'pointer' }} >
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


	return(
		<Grid>

			<Grid container >

			{cardGridUI}
			<Button onClick={ () => loadMoreCallback()} style={(isLoadMoreOptionVisible)? {display: 'block'} : {display: 'none'}} >
				Press me to load more
			</Button>

			</Grid>

		</Grid>
	)
}