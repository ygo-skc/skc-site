import { useState, useEffect, lazy, useReducer } from 'react'
import { Typography } from '@mui/material'
import { Helmet } from 'react-helmet'

import Section from '../util/Section'

import Breadcrumb from '../header-footer/Breadcrumb'

import OneThirdTwoThirdsGrid from '../util/grid/OneThirdTwoThirdsGrid'

import Fetch from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'

import createTable from '../util/TableHelpers'

import '../../css/util/divider.css'
import '../../css/suggestion-box/database-search-styles.css'
import CardBrowse from '../util/search/CardBrowse'

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
export default function BrowseCards() {
	const [{ selectedCriteria }, browseCriteriaDispatch] = useReducer(browseReducer, { selectedCriteria: [] })

	const [skcCardBrowseCriteriaOutput, setSkcCardBrowseCriteriaOutput] = useState<SKCCardBrowseCriteria>({} as SKCCardBrowseCriteria)
	const [jsonResults, setJsonResults] = useState([])

	const [numResults, setNumResults] = useState(0)
	const [numResultsDisplayed, setNumResultsDisplayed] = useState(0)
	const [numItemsToLoadWhenNeeded, _setNumItemsToLoadWhenNeeded] = useState(0)

	const [isLoadMoreVisible, _setIsLoadMoreVisible] = useState(false)
	const [isCardBrowseDataLoaded, _setIsCardBrowseDataLoaded] = useState(true)

	const browseSummaryStats: string[][] = []
	browseSummaryStats.push(['Total', numResults.toString()])
	browseSummaryStats.push(['Displaying', numResultsDisplayed.toString()])

	useEffect(() => {
		Fetch.handleFetch(DownstreamServices.NAME_maps_ENDPOINT['browseCriteria'], (json) => {
			setSkcCardBrowseCriteriaOutput(json)
		})
	}, [])

	useEffect(() => {
		if (selectedCriteria === undefined || selectedCriteria.length === 0) return

		const criteriaMap = new Map()
		criteriaMap.set('cardColors', [])
		criteriaMap.set('attributes', [])
		criteriaMap.set('monsterTypes', [])
		criteriaMap.set('monsterSubTypes', [])
		criteriaMap.set('levels', [])
		criteriaMap.set('ranks', [])
		criteriaMap.set('linkRatings', [])

		Fetch.handleFetch(
			`${DownstreamServices.NAME_maps_ENDPOINT['browse']}?cardColors=${criteriaMap.get('cardColors').join(',')}&attributes=${criteriaMap
				.get('attributes')
				.join(',')}&monsterTypes=${criteriaMap.get('monsterTypes').join(',')}&monsterSubTypes=${criteriaMap.get('monsterSubTypes').join(',')}&levels=${criteriaMap
				.get('levels')
				.join(',')}&ranks=${criteriaMap.get('ranks').join(',')}&linkRatings=${criteriaMap.get('linkRatings').join(',')}`,
			(json) => {
				setJsonResults(json.results)
				setNumResults(json.numResults)
				setNumResultsDisplayed(50)

				// setIsCardBrowseDataLoaded(true)
			}
		)
	}, [selectedCriteria])

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
									<CardBrowse browseCriteriaDispatch={browseCriteriaDispatch} selectedCriteria={selectedCriteria} skcCardBrowseCriteriaOutput={skcCardBrowseCriteriaOutput} />
								</div>

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
									loadMoreCallback={() => {}}
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
