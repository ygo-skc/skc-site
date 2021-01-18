import React, { useState, useEffect } from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { Chip, Paper, InputBase, IconButton } from '@material-ui/core'
import { Helmet } from 'react-helmet'

import SearchIcon from '@material-ui/icons/Search'

import Breadcrumb from './Breadcrumb'
import { MainContentContainer } from './MainContent'

import CardDisplayGrid from './grid/CardDisplayGrid'

import OneThirdTwoThirdsGrid from './grid/OneThirdTwoThirdsGrid'

import { handleFetch } from '../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../helper/YgoApiEndpoints'

import {LightTranslucentDivider, DarkTranslucentDivider} from './util/Divider'
import {StickyBox} from './util/StyledContainers'

import {RenderGroup, SearchSuggestionTypography} from './util/Search'

import {LeftBoxSectionTypography, LeftBoxSectionHeaderTypography, RightBoxPaper, RightBoxHeaderTypography, RightBoxSubHeaderTypography, RightBoxHeaderContainer} from './grid/OneThirdTwoThirdsGrid'


const defaultDisplayNum = 50


export default function Browse( {history} )
{
	const [browseCriteria, setBrowseCriteria] = useState([])
	const [selectedCriteria, setSelectedCriteria] = useState(undefined)

	const [selectedCriteriaChips, setSelectedCriteriaChips] = useState([])
	const [jsonResults, setJsonResults] = useState([])

	const [numResults, setNumResults] = useState(0)
	const [numResultsDisplayed, setNumResultsDisplayed] = useState(0)
	const [numItemsToLoadWhenNeeded, setnumItemsToLoadWhenNeeded] = useState(0)

	const [isLoadMoreVisible, setIsLoadMoreVisible] = useState(false)
	const [isCardBrowseDataLoaded, setIsCardBrowseDataLoaded] = useState(true)


	useEffect( () => {
		handleFetch(NAME_maps_ENDPOINT['browseCriteria'], history, (json) => {
			const browseCriteria = []
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


		setIsCardBrowseDataLoaded(false)
		handleFetch(`${NAME_maps_ENDPOINT['browse']}?cardColors=${criteriaMap.get('cardColors').join(',')}&attributes=${criteriaMap.get('attributes').join(',')}&levels=${criteriaMap.get('levels').join(',')}&ranks=${criteriaMap.get('ranks').join(',')}&linkRatings=${criteriaMap.get('linkRatings').join(',')}`, history, json => {
			setJsonResults(json.results)
			setNumResults(json.numResults)

			setIsCardBrowseDataLoaded(true)
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
			setnumItemsToLoadWhenNeeded(numResults - numResultsDisplayed)
			setNumResultsDisplayed(numResults)
			setIsLoadMoreVisible(false)
		}
		else
		{
			setnumItemsToLoadWhenNeeded(defaultDisplayNum)
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
		<MainContentContainer  >
			<Helmet>
				<title>{`SKC - Card Browser`}</title>
				<meta
					name={`SKC - Card Browser`}
					content={`Browse all cards in database to find the right card you want.`}
					/>
				<meta name="keywords" content={`YuGiOh, card browse, The Supreme Kings Castle`} />
			</Helmet>

			<Breadcrumb crumbs={ ['Home', 'Card Browse Tool'] } />

			<OneThirdTwoThirdsGrid
				oneThirdComponent={

					<StickyBox>
						<Paper style={{padding: '1.4rem', backgroundColor: '#7f5a83', backgroundImage: 'linear-gradient(315deg, #7f5a83 0%, #0d324d 74%)' }} >

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
								renderGroup={option => {
									return (
										<RenderGroup
											group={option.group}
											children={option.children}
										/>
									)
								}}
								disableCloseOnSelect
								onClose={ (event, reason) => {
									// setSelectedCriteria(intermediateSelectedCriteria)
								}}
								renderInput={(params) => (
									<div style={{ width: '100%', display: 'flex', backgroundColor: 'rgba(0, 0, 0, .37)', borderRadius: '1.25rem', marginBottom: '2.75rem' }} >
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

							renderOption={option => {
								return (
									<div style={{ padding: '0rem', margin: '0rem' }} >
										<SearchSuggestionTypography variant='body1'>{option.criteriaValue}</SearchSuggestionTypography>
									</div>
								)
							}}
							/>


							<LeftBoxSectionHeaderTypography variant='h6' >
								Current Criteria
							</LeftBoxSectionHeaderTypography>

							<div style={{minHeight: '1.5rem'}} >
								{selectedCriteriaChips}
							</div>

							<LightTranslucentDivider />

							<LeftBoxSectionHeaderTypography variant='h6' >
								Results
							</LeftBoxSectionHeaderTypography>
							<LeftBoxSectionTypography variant='body1' >
								Total: {numResults}
							</LeftBoxSectionTypography>
							<LeftBoxSectionTypography variant='body1' >
								Displaying: {numResultsDisplayed}
							</LeftBoxSectionTypography>

							</Paper>
					</StickyBox>
				}
				twoThirdComponent={
					<RightBoxPaper>
						<RightBoxHeaderContainer >
							<RightBoxHeaderTypography variant='h4' >
								Browse Results
							</RightBoxHeaderTypography>
							<RightBoxSubHeaderTypography variant='subtitle1' >
								Sorted Alphabetically
							</RightBoxSubHeaderTypography>
							<DarkTranslucentDivider />
						</RightBoxHeaderContainer>

						<CardDisplayGrid
							cardJsonResults={jsonResults}
							numResultsDisplayed={numResultsDisplayed}
							numItemsToLoadWhenNeeded={numItemsToLoadWhenNeeded}
							loadMoreCallback={loadMore}
							isLoadMoreOptionVisible={isLoadMoreVisible}
							numResults={numResults}
							isDataLoaded={isCardBrowseDataLoaded}
							/>
					</RightBoxPaper>
				}
			/>
		</MainContentContainer>
	)
}