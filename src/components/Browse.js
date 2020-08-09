import React, { useState, useEffect } from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { TextField, Chip, Typography, Grid, Paper, Divider, Button } from '@material-ui/core'

import Breadcrumb from './Breadcrumb'
import { MainContentContainer } from './MainContent'

import {YGOCard} from './card/YGOCard'
import cardStyles from './card/YGOCardStyles'

import { handleFetch } from '../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../helper/YgoApiEndpoints'

import styled from 'styled-components'


const MainBrowseInfoTypography = styled(Typography)`
	&&
	{
	}
`


const defaultDisplayNum = 40


export const Browse =( {history} ) =>
{
	const [browseCriteria, setBrowseCriteria] = useState([])
	const [intermediateSelectedCriteria, setIntermediateSelectedCriteria] = useState([])
	const [selectedCriteria, setSelectedCriteria] = useState([])

	const [selectedCriteriaChips, setSelectedCriteriaChips] = useState([])
	const [jsonResults, setJsonResults] = useState(undefined)
	const [cardDataForSelectedCriteria, setCardDataForSelectedCriteria] = useState([])

	const [numResults, setNumResults] = useState(0)
	const [numResultsDisplayed, setNumResultsDisplayed] = useState(0)
	const [numResultsLoaded, setNumResultsLoaded] = useState(0)

	const [isLoadMoreVisible, setIsLoadMoreVisible] = useState(false)


	useEffect( () => {
		handleFetch(NAME_maps_ENDPOINT['browseCriteria'], history, (json) => {
			const browseCriteria = []
			for (const criteria of Object.keys(json))
			{
				json[criteria].forEach(criteriaValue => {
					if (criteria == 'levels') criteriaValue = `Level ${criteriaValue}`
					if (criteria == 'ranks') criteriaValue = `Rank ${criteriaValue}`
					if (criteria == 'linkRatings') criteriaValue = `Link Rating ${criteriaValue}`

					browseCriteria.push({
						'criteriaName': criteria
						, 'criteriaValue': criteriaValue
					})
				})
			}
			console.log(browseCriteria)
			setBrowseCriteria(browseCriteria)
		})
	}, [])

	useEffect( () => {
		if (selectedCriteria.length === 0)
		{
			reset(true)
			return
		}


		const criteriaMap = new Map()
		const selectedCriteriaChips = []
		criteriaMap.set('cardColors', [])
		criteriaMap.set('attributes', [])

		selectedCriteria.forEach(criteria => {
			if (criteria.criteriaName == 'cardColors' || criteria.criteriaName == 'attributes')
				criteriaMap.get(criteria.criteriaName).push(criteria.criteriaValue)


			selectedCriteriaChips.push(<Chip label={criteria.criteriaValue} />)
		})

		setSelectedCriteriaChips(selectedCriteriaChips)
		reset()

		handleFetch(`${NAME_maps_ENDPOINT['browse']}?cardColors=${criteriaMap.get('cardColors').join(',')}&attributes=${criteriaMap.get('attributes').join(',')}`, history, json => {
			setJsonResults(json.results)
			setNumResults(json.numResults)
		})
	}, [selectedCriteria])


	useEffect( () => {
		incrementNumResultsDisplayed(defaultDisplayNum)
	}, [numResults])


	useEffect( () => {
		if (jsonResults === undefined)	return

		const cards = []
		jsonResults.slice(numResultsDisplayed - numResultsLoaded, numResultsDisplayed).forEach( card => {
			console.log(card)
			cards.push(
				<Grid item xs={6} sm={4} md={3} lg={2} xl={1}
					style={{ padding: '.25rem', cursor: 'pointer' }} >
						<div style={{margin: 'auto', marginBottom: '.5rem', width: '85%'}} >
							<div
								style={{ borderRadius: '50%', overflow: 'hidden', width: '100%',  height: '0', paddingBottom: '100%' }} >
								<img src={`https://storage.googleapis.com/ygoprodeck.com/pics_artgame/${card.cardID}.jpg`} style={{  width: '100%', height: '100%', objectFit: 'cover' }} />
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
				</Grid>)
		})

		setCardDataForSelectedCriteria([...cardDataForSelectedCriteria, ...cards])
	}, [numResultsDisplayed])


	const loadMore = () => {
		const newCap = numResultsDisplayed + defaultDisplayNum

		incrementNumResultsDisplayed(newCap)
	}


	const incrementNumResultsDisplayed = (newCap) =>
	{
		if (numResults < newCap)
		{
			setNumResultsLoaded(numResults - numResultsDisplayed)
			setNumResultsDisplayed(numResults)
			setIsLoadMoreVisible(false)
		}
		else
		{
			setNumResultsLoaded(defaultDisplayNum)
			setNumResultsDisplayed(newCap)
			setIsLoadMoreVisible(true)
		}
	}


	const reset = (fullReset = false) =>
	{
		setCardDataForSelectedCriteria([])
		setNumResults(0)
		if (fullReset)
		{
			setSelectedCriteriaChips([])
		}
	}



	return(
		<MainContentContainer>
			<Breadcrumb crumbs={ ['Home', 'Browse'] } />

			<Grid container spacing={0} >
				<Grid item xs={12} sm={5} md={4} lg={3} xl={2}>

					<Paper style={{padding: '1.4rem'}} >
						<Autocomplete
							multiple
							limitTags={2}
							id='browseCriteriaFilter'
							options={browseCriteria}
							getOptionLabel={option => option.criteriaValue}
							groupBy={option => option.criteriaName}
							autoHighlight
							onChange={ (event, val)  => {
								setIntermediateSelectedCriteria(val)
							}}
							renderTags={ () => null }
							disableCloseOnSelect
							onClose={ (event, reason) => {
								setSelectedCriteria(intermediateSelectedCriteria)
							}}
							renderInput={(params) => (
								<TextField {...params} variant='filled' label='' placeholder='Card Type' />
							)}
						/>

						<Divider style={{marginTop: '1.5rem', marginBottom: '1.5rem'}} />

						<MainBrowseInfoTypography variant='h6' >
							Current Criteria
						</MainBrowseInfoTypography>

						{selectedCriteriaChips}

						<Divider style={{marginTop: '1.5rem', marginBottom: '1.5rem'}} />
						<Typography variant='h6' >
							Results
						</Typography>
						<Typography variant='body1' >
							Total: {numResults}
						</Typography>
						<Typography variant='body1' >
							Displaying: {numResultsDisplayed}
						</Typography>

					</Paper>

				</Grid>

				<Grid item xs={12} sm={7} md={8} lg={9} xl={10} >
					<Grid container >

						{cardDataForSelectedCriteria}

						<Button onClick={loadMore} style={(isLoadMoreVisible)? {display: 'block'} : {display: 'none'}} >
							Press me to load more
						</Button>

					</Grid>

				</Grid>
			</Grid>
		</MainContentContainer>
	)
}