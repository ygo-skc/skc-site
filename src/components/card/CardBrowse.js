import React, { useState, useEffect, lazy } from 'react'
import startCase from 'lodash.startcase'
import Autocomplete from '@mui/material/Autocomplete'
import { Chip, InputBase, IconButton, Typography, Box, Divider } from '@mui/material'
import { Helmet } from 'react-helmet'

import SearchIcon from '@mui/icons-material/Search'
import Section from '../util/Section'

import Breadcrumb from '../header-footer/Breadcrumb'

import OneThirdTwoThirdsGrid from '../util/grid/OneThirdTwoThirdsGrid'

import Fetch from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'

import RenderGroup from '../util/search/DBSearchGrouping'
import createTable from '../util/TableHelpers'

import '../../css/util/divider.css'
import '../../css/suggestion-box/database-search-styles.css'

const CardDisplayGrid = lazy(() => import('../util/grid/CardDisplayGrid'))

const defaultDisplayNum = 50

export default function Browse() {
	const [browseCriteria, setBrowseCriteria] = useState([])
	const [selectedCriteria, setSelectedCriteria] = useState(undefined)

	const [selectedCriteriaChips, setSelectedCriteriaChips] = useState([])
	const [jsonResults, setJsonResults] = useState([])

	const [numResults, setNumResults] = useState(0)
	const [numResultsDisplayed, setNumResultsDisplayed] = useState(0)
	const [numItemsToLoadWhenNeeded, setnumItemsToLoadWhenNeeded] = useState(0)

	const [isLoadMoreVisible, setIsLoadMoreVisible] = useState(false)
	const [isCardBrowseDataLoaded, setIsCardBrowseDataLoaded] = useState(true)

	const browseSummaryStats = []
	browseSummaryStats.push(['Total', numResults])
	browseSummaryStats.push(['Displaying', numResultsDisplayed])

	useEffect(() => {
		Fetch.handleFetch(DownstreamServices.NAME_maps_ENDPOINT['browseCriteria'], (json) => {
			const browseCriteria = []
			for (const criteria of Object.keys(json)) {
				if (criteria === '_links') continue
				json[criteria].forEach((criteriaValue) => {
					if (criteria === 'levels') criteriaValue = `Level ${criteriaValue}`
					else if (criteria === 'ranks') criteriaValue = `Rank ${criteriaValue}`
					else if (criteria === 'linkRatings') criteriaValue = `Link Rating ${criteriaValue}`

					browseCriteria.push({
						criteriaName: criteria,
						criteriaValue: criteriaValue,
					})
				})
			}
			setBrowseCriteria(browseCriteria)
		})
	}, [])

	useEffect(() => {
		if (selectedCriteria === undefined) return
		if (selectedCriteria.length === 0) {
			reset(true)
			return
		}

		const criteriaMap = new Map()
		criteriaMap.set('cardColors', [])
		criteriaMap.set('attributes', [])
		criteriaMap.set('monsterTypes', [])
		criteriaMap.set('monsterSubTypes', [])
		criteriaMap.set('levels', [])
		criteriaMap.set('ranks', [])
		criteriaMap.set('linkRatings', [])

		const selectedCriteriaChips = selectedCriteria.map((criteria) => {
			if (
				criteria.criteriaName === 'cardColors' ||
				criteria.criteriaName === 'attributes' ||
				criteria.criteriaName === 'monsterTypes' ||
				criteria.criteriaName === 'monsterSubTypes'
			)
				criteriaMap.get(criteria.criteriaName).push(criteria.criteriaValue)
			else if (criteria.criteriaName === 'levels') {
				criteriaMap.get(criteria.criteriaName).push(criteria.criteriaValue.replace('Level ', ''))
			} else if (criteria.criteriaName === 'ranks') {
				criteriaMap.get(criteria.criteriaName).push(criteria.criteriaValue.replace('Rank ', ''))
			} else if (criteria.criteriaName === 'linkRatings') {
				console.log('yo')
				criteriaMap.get(criteria.criteriaName).push(criteria.criteriaValue.replace('Link Rating ', ''))
			}

			return <Chip key={criteria.criteriaValue} label={criteria.criteriaValue} style={{ background: 'rgba(107, 52, 91, .8)' }} />
		})

		setSelectedCriteriaChips(selectedCriteriaChips)
		reset()

		setIsCardBrowseDataLoaded(false)
		Fetch.handleFetch(
			`${DownstreamServices.NAME_maps_ENDPOINT['browse']}?cardColors=${criteriaMap.get('cardColors').join(',')}&attributes=${criteriaMap
				.get('attributes')
				.join(',')}&monsterTypes=${criteriaMap.get('monsterTypes').join(',')}&monsterSubTypes=${criteriaMap.get('monsterSubTypes').join(',')}&levels=${criteriaMap
				.get('levels')
				.join(',')}&ranks=${criteriaMap.get('ranks').join(',')}&linkRatings=${criteriaMap.get('linkRatings').join(',')}`,
			(json) => {
				setJsonResults(json.results)
				setNumResults(json.numResults)

				setIsCardBrowseDataLoaded(true)
			}
		)
	}, [selectedCriteria])

	useEffect(() => {
		incrementNumResultsDisplayed(defaultDisplayNum)
	}, [numResults])

	const loadMore = () => {
		const newCap = numResultsDisplayed + defaultDisplayNum

		incrementNumResultsDisplayed(newCap)
	}

	const incrementNumResultsDisplayed = (newCap) => {
		if (numResults < newCap) {
			setnumItemsToLoadWhenNeeded(numResults - numResultsDisplayed)
			setNumResultsDisplayed(numResults)
			setIsLoadMoreVisible(false)
		} else {
			setnumItemsToLoadWhenNeeded(defaultDisplayNum)
			setNumResultsDisplayed(newCap)
			setIsLoadMoreVisible(true)
		}
	}

	const reset = (fullReset = false) => {
		setIsLoadMoreVisible(false)
		setNumResults(0)
		setJsonResults([])
		if (fullReset) {
			setSelectedCriteriaChips([])
		}
	}

	return (
		<div className='generic-container'>
			<Helmet>
				<title>{`SKC - Card Browser`}</title>
				<meta name={`SKC - Card Browser`} content={`Browse all cards in database to find the right card you want.`} />
				<meta name='keywords' content={`YuGiOh, card browse, The Supreme Kings Castle`} />
			</Helmet>

			<Breadcrumb crumbs={['Home', 'Card Browse Tool']} />

			<OneThirdTwoThirdsGrid
				oneThirdComponent={
					<Section
						sectionHeaderBackground='product'
						sectionName='Current Criteria'
						sticky={true}
						sectionContent={
							<div className='section-content'>
								<div style={{ minHeight: '1.5rem', marginBottom: '1rem' }}>
									{selectedCriteriaChips.length === 0 ? (
										<Typography variant='h5' align='center'>
											No Criteria Specified
										</Typography>
									) : (
										selectedCriteriaChips
									)}
								</div>

								<Autocomplete
									multiple
									id='browseCriteriaFilter'
									options={browseCriteria}
									getOptionLabel={(option) => option.criteriaValue}
									groupBy={(option) => option.criteriaName}
									autoHighlight
									onChange={(event, val) => {
										setSelectedCriteria(val)
									}}
									renderTags={() => null}
									renderGroup={(option) => {
										return <RenderGroup group={startCase(option.group)} children={option.children} />
									}}
									disableCloseOnSelect
									onClose={(event, reason) => {
										// setSelectedCriteria(intermediateSelectedCriteria)
									}}
									renderInput={(params) => (
										<div style={{ width: '100%', display: 'flex', backgroundColor: 'rgba(107, 52, 91, .9)', borderRadius: '1.25rem', marginBottom: '2.75rem' }}>
											<InputBase
												ref={params.InputProps.ref}
												inputProps={params.inputProps}
												style={{ color: 'white', flex: '1', margin: '.8rem', fontSize: '1.23rem' }}
												placeholder='Search Select Criteria...'
											/>
											<IconButton>
												<SearchIcon style={{ color: 'rgba(255, 255, 255, .7)' }} />
											</IconButton>
										</div>
									)}
									renderOption={(props, option) => {
										return (
											<Box component='li' {...props} className='search-suggestions-parent'>
												<Typography className='search-suggestion-text search-suggestion-header' variant='body1'>
													{option.criteriaValue}
												</Typography>
											</Box>
										)
									}}
								/>

								<Typography variant='h5'>Results</Typography>
								{createTable([], browseSummaryStats)}
							</div>
						}
					/>
				}
				twoThirdComponent={
					<Section
						sectionHeaderBackground='product'
						sectionName='Browse Results'
						sectionContent={
							<div className='section-content'>
								<Typography variant='h5'>Results Are Sorted Alphabetically</Typography>

								<CardDisplayGrid
									cardJsonResults={jsonResults}
									numResultsDisplayed={numResultsDisplayed}
									numItemsToLoadWhenNeeded={numItemsToLoadWhenNeeded}
									loadMoreCallback={loadMore}
									isLoadMoreOptionVisible={isLoadMoreVisible}
									numResults={numResults}
									isDataLoaded={isCardBrowseDataLoaded}
								/>
							</div>
						}
					></Section>
				}
			/>
		</div>
	)
}
