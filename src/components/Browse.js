import React, { useState, useEffect } from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { TextField, Chip, Typography, Grid, Paper, Divider, Button } from '@material-ui/core'

import Breadcrumb from './Breadcrumb'
import { MainContentContainer } from './MainContent'

import CardDisplayGrid from './grid/CardDisplayGrid'

import {OneThirdTwoThirdsGrid} from './grid/OneThirdTwoThirdsGrid'

import { handleFetch } from '../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../helper/YgoApiEndpoints'

import Styled from 'styled-components'


const MainBrowseInfoTypography = Styled(Typography)`
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
		criteriaMap.set('cardColors', [])
		criteriaMap.set('attributes', [])

		const selectedCriteriaChips = selectedCriteria.map(criteria => {
			if (criteria.criteriaName == 'cardColors' || criteria.criteriaName == 'attributes')
				criteriaMap.get(criteria.criteriaName).push(criteria.criteriaValue)


			return <Chip key={criteria.criteriaValue} label={criteria.criteriaValue} />
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
		// setCardDataForSelectedCriteria([])
		setNumResults(0)
		if (fullReset)
		{
			setSelectedCriteriaChips([])
		}
	}



	return(
		<MainContentContainer>
			<Breadcrumb crumbs={ ['Home', 'Browse'] } />

			<OneThirdTwoThirdsGrid
				oneThirdComponent={
					<Paper style={{padding: '1.4rem'}} >


						<MainBrowseInfoTypography
							style={{marginBottom: '1rem'}}
							variant='h6' >
							Current Criteria
						</MainBrowseInfoTypography>

						{selectedCriteriaChips}

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
				}
				twoThirdComponent={
					<CardDisplayGrid
					cardJsonResults={jsonResults}
					numResultsDisplayed={numResultsDisplayed}
					numResultsLoaded={numResultsLoaded}
					loadMoreCallback={loadMore}
					isLoadMoreOptionVisible={isLoadMoreVisible} />
				}
			/>
		</MainContentContainer>
	)
}