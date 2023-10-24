import { useState, useEffect, lazy, useReducer, useCallback } from 'react'
import { Typography } from '@mui/material'
import { Helmet } from 'react-helmet'

import Breadcrumb from '../header-footer/Breadcrumb'
import OneThirdTwoThirdsGrid from '../util/grid/OneThirdTwoThirdsGrid'

import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'

import '../../css/util/database-info/database-search-styles.css'
import '../../css/main-pages/card-browse.css'
import CardBrowse from '../util/search/CardBrowse'
import { SKCTable, Section } from 'skc-rcl'

const CardDisplayGrid = lazy(() => import('../util/grid/CardDisplayGrid'))

function browseReducer(state: { selectedCriteria: BrowseCriteria[] }, action: any) {
	switch (action.type) {
		case 'UPDATE_SELECTED_CRITERIA':
			return {
				...state,
				selectedCriteria: action.selectedCriteria,
			}
		default:
			return state
	}
}

function generateBrowseQueryURL(selectedCriteria: BrowseCriteria[]) {
	const criteriaMap = new Map()
	criteriaMap.set('cardColors', [])
	criteriaMap.set('attributes', [])
	criteriaMap.set('monsterTypes', [])
	criteriaMap.set('monsterSubTypes', [])
	criteriaMap.set('levels', [])
	criteriaMap.set('ranks', [])
	criteriaMap.set('linkRatings', [])

	selectedCriteria.forEach((criteria: BrowseCriteria) => {
		switch (criteria.name) {
			case 'cardColors':
			case 'attributes':
			case 'monsterTypes':
			case 'monsterSubTypes':
				criteriaMap.get(criteria.name).push(criteria.value)
				break
			case 'levels':
				criteriaMap.get(criteria.name).push(criteria.value.replace('Level ', ''))
				break
			case 'ranks':
				criteriaMap.get(criteria.name).push(criteria.value.replace('Rank ', ''))
				break
			case 'linkRatings':
				criteriaMap.get(criteria.name).push(criteria.value.replace('Link Rating ', ''))
				break
		}
	})

	return `${DownstreamServices.NAME_maps_ENDPOINT['browse']}?cardColors=${criteriaMap.get('cardColors').join(',')}&attributes=${criteriaMap
		.get('attributes')
		.join(',')}&monsterTypes=${criteriaMap.get('monsterTypes').join(',')}&monsterSubTypes=${criteriaMap.get('monsterSubTypes').join(',')}&levels=${criteriaMap
		.get('levels')
		.join(',')}&ranks=${criteriaMap.get('ranks').join(',')}&linkRatings=${criteriaMap.get('linkRatings').join(',')}`
}

export default function BrowseCards() {
	const [{ selectedCriteria }, browseCriteriaDispatch] = useReducer(browseReducer, { selectedCriteria: [] })

	const [skcCardBrowseCriteriaOutput, setSkcCardBrowseCriteriaOutput] = useState<SKCCardBrowseCriteria>({} as SKCCardBrowseCriteria)
	const [jsonResults, setJsonResults] = useState<SKCCard[]>([])

	const [numResults, setNumResults] = useState(0)
	const [numResultsDisplayed, setNumResultsDisplayed] = useState(0)

	const [isCardBrowseDataLoaded, setIsCardBrowseDataLoaded] = useState(true)

	const browseSummaryStats: string[][] = []
	browseSummaryStats.push(['Total', numResults.toString()])
	browseSummaryStats.push(['Displaying', numResultsDisplayed.toString()])

	useEffect(() => {
		FetchHandler.handleFetch<SKCCardBrowseCriteria>(DownstreamServices.NAME_maps_ENDPOINT['browseCriteria'], (json) => {
			setSkcCardBrowseCriteriaOutput(json)
		})
	}, [])

	useEffect(() => {
		if (selectedCriteria === undefined || selectedCriteria.length === 0) {
			setJsonResults([])
			setNumResults(0)
			setNumResultsDisplayed(0)
		} else {
			setIsCardBrowseDataLoaded(false)
			setJsonResults([])

			FetchHandler.handleFetch<SKCCardBrowseResults>(generateBrowseQueryURL(selectedCriteria), (json) => {
				setJsonResults(json.results)
				setNumResults(json.numResults)
				setNumResultsDisplayed(50)

				setIsCardBrowseDataLoaded(true)
			})
		}
	}, [selectedCriteria])

	const handleLoadMore = useCallback(() => {}, [])

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
					<Section sectionHeaderBackground='product' sectionName='Current Criteria' sticky={true}>
						<div className='section-content'>
							<div className='group card-browse-group'>
								<CardBrowse browseCriteriaDispatch={browseCriteriaDispatch} selectedCriteria={selectedCriteria} skcCardBrowseCriteriaOutput={skcCardBrowseCriteriaOutput} />
							</div>

							<div className='group'>
								<Typography variant='h5'>Results</Typography>
								{<SKCTable header={[]} rows={browseSummaryStats} />}
							</div>
						</div>
					</Section>
				}
				twoThirdComponent={
					<Section sectionHeaderBackground='product' sectionName='Browse Results'>
						<div className='section-content'>
							<Typography variant='h5'>Results Are Sorted Alphabetically</Typography>

							<CardDisplayGrid
								cardJsonResults={jsonResults}
								numResultsDisplayed={numResultsDisplayed}
								numItemsToLoadWhenNeeded={50}
								loadMoreCallback={handleLoadMore}
								isLoadMoreOptionVisible={true}
								numResults={numResults}
								isDataLoaded={isCardBrowseDataLoaded}
							/>
						</div>
					</Section>
				}
			/>
		</div>
	)
}
