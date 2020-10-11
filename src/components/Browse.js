import React, { useState, useEffect } from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { Chip, Typography, Paper, InputBase, IconButton, Box } from '@material-ui/core'

import SearchIcon from '@material-ui/icons/Search'

import Breadcrumb from './Breadcrumb'
import { MainContentContainer } from './MainContent'

import CardDisplayGrid from './grid/CardDisplayGrid'

import OneThirdTwoThirdsGrid from './grid/OneThirdTwoThirdsGrid'

import { handleFetch } from '../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../helper/YgoApiEndpoints'

import Styled from 'styled-components'

import {LightTranslucentDivider} from './util/Divider'

const MainBrowseInfoTypography = Styled(Typography)`
	&&
	{
		color: rgba(255, 255, 255, .95);
	}
`


const defaultDisplayNum = 40


export default function Browse( {history} )
{
	const [browseCriteria, setBrowseCriteria] = useState([])
	const [selectedCriteria, setSelectedCriteria] = useState(undefined)

	const [selectedCriteriaChips, setSelectedCriteriaChips] = useState([])
	const [jsonResults, setJsonResults] = useState(undefined)

	const [numResults, setNumResults] = useState(0)
	const [numResultsDisplayed, setNumResultsDisplayed] = useState(0)
	const [numResultsLoaded, setNumResultsLoaded] = useState(0)

	const [isLoadMoreVisible, setIsLoadMoreVisible] = useState(false)


	useEffect( () => {
		handleFetch(NAME_maps_ENDPOINT['browseCriteria'], history, (json) => {
			const browseCriteria = []
			console.log(json)
			for (const criteria of Object.keys(json))
			{
				if (criteria === '_links')	continue
				json[criteria].forEach(criteriaValue => {
					if (criteria === 'levels') criteriaValue = `Level ${criteriaValue}`
					else if (criteria === 'ranks') criteriaValue = `Rank ${criteriaValue}`
					else if (criteria === 'linkRatings') criteriaValue = `Link Rating ${criteriaValue}`

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
		if (selectedCriteria === undefined)	return
		if (selectedCriteria.length === 0)
		{
			reset(true)
			return
		}


		const criteriaMap = new Map()
		criteriaMap.set('cardColors', [])
		criteriaMap.set('attributes', [])
		criteriaMap.set('levels', [])
		criteriaMap.set('ranks', [])
		criteriaMap.set('linkRatings', [])

		const selectedCriteriaChips = selectedCriteria.map(criteria => {
			if (criteria.criteriaName === 'cardColors' || criteria.criteriaName === 'attributes')
				criteriaMap.get(criteria.criteriaName).push(criteria.criteriaValue)
			else if(criteria.criteriaName === 'levels'){
				criteriaMap.get(criteria.criteriaName).push(criteria.criteriaValue.replace('Level ', ""))
			}
			else if(criteria.criteriaName === 'ranks'){
				criteriaMap.get(criteria.criteriaName).push(criteria.criteriaValue.replace('Rank ', ""))
			}
			else if(criteria.criteriaName === 'linkRatings'){
				console.log('yo')
				criteriaMap.get(criteria.criteriaName).push(criteria.criteriaValue.replace('Link Rating ', ""))
			}

			return <Chip
				key={criteria.criteriaValue}
				label={criteria.criteriaValue}
				style={{backgroundColor: 'rgba(0, 0, 0, .37)'}} />
		})

		setSelectedCriteriaChips(selectedCriteriaChips)
		reset()

		console.log(`${NAME_maps_ENDPOINT['browse']}?cardColors=${criteriaMap.get('cardColors').join(',')}&attributes=${criteriaMap.get('attributes').join(',')}&levels=${criteriaMap.get('levels').join(',')}&ranks=${criteriaMap.get('ranks').join(',')}&linkRatings=${criteriaMap.get('linkRatings').join(',')}`)
		handleFetch(`${NAME_maps_ENDPOINT['browse']}?cardColors=${criteriaMap.get('cardColors').join(',')}&attributes=${criteriaMap.get('attributes').join(',')}&levels=${criteriaMap.get('levels').join(',')}&ranks=${criteriaMap.get('ranks').join(',')}&linkRatings=${criteriaMap.get('linkRatings').join(',')}`, history, json => {
			console.log("i ran")
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
		setIsLoadMoreVisible(false)
		setNumResults(0)
		setJsonResults([])
		if (fullReset)
		{
			setSelectedCriteriaChips([])
		}
	}



	return(
		<MainContentContainer style={{}} >
			<Breadcrumb crumbs={ ['Home', 'Card Browse Tool'] } />

			<OneThirdTwoThirdsGrid
				oneThirdComponent={

					<Box>

						<Typography
							variant='h4'
							align='center'
							style={{marginBottom: '2rem'}} >
							Card Browse Tool
						</Typography>

						<Paper style={{padding: '1.4rem', backgroundColor: '#7f5a83', backgroundImage: 'linear-gradient(315deg, #7f5a83 0%, #0d324d 74%)' }} >

							<MainBrowseInfoTypography
								style={{marginBottom: '1rem'}}
								variant='h6' >
								Current Criteria
							</MainBrowseInfoTypography>

							{selectedCriteriaChips}

							<br />
							<br />
							<Autocomplete
								multiple
								id='browseCriteriaFilter'
								options={browseCriteria}
								getOptionLabel={option => option.criteriaValue}
								groupBy={option => option.criteriaName}
								autoHighlight
								onChange={ (event, val)  => {
									setSelectedCriteria(val)
								}}
								renderTags={ () => null }
								disableCloseOnSelect
								onClose={ (event, reason) => {
									// setSelectedCriteria(intermediateSelectedCriteria)
								}}
								renderInput={(params) => (
									<div style={{ width: '100%', display: 'flex', backgroundColor: 'rgba(0, 0, 0, .37)' }} >
									<InputBase
										ref={params.InputProps.ref}
										inputProps={params.inputProps}
										style={{ color: 'white', flex: '1', margin: '.8rem', fontSize: '1.23rem' }}
										placeholder='Search...'
										/>
										<IconButton>
											<SearchIcon style={{ color: 'rgba(255, 255, 255, .56)' }} />
										</IconButton>
									</div>
								)}
							/>

							<LightTranslucentDivider />

							<MainBrowseInfoTypography variant='h6' >
								Results
							</MainBrowseInfoTypography>
							<MainBrowseInfoTypography variant='body1' >
								Total: {numResults}
							</MainBrowseInfoTypography>
							<MainBrowseInfoTypography variant='body1' >
								Displaying: {numResultsDisplayed}
							</MainBrowseInfoTypography>

							</Paper>
					</Box>
				}
				twoThirdComponent={
					<CardDisplayGrid
						cardJsonResults={jsonResults}
						numResultsDisplayed={numResultsDisplayed}
						numResultsLoaded={numResultsLoaded}
						loadMoreCallback={loadMore}
						isLoadMoreOptionVisible={isLoadMoreVisible}
						/>
				}
			/>
		</MainContentContainer>
	)
}