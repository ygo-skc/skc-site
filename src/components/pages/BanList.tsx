import { lazy, useState, useEffect, Suspense, useReducer } from 'react'
import { Helmet } from 'react-helmet'

import { Skeleton } from '@mui/material'
import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'

import OneThirdTwoThirdsGrid from '../util/grid/OneThirdTwoThirdsGrid'

import BreadCrumb from '../header-footer/Breadcrumb'

import '../../css/main-pages/ban-list.css'
import Section from '../util/Section'

const BanListDates = lazy(() => import('../banlist/BanListDates'))
const BanListContentNormalFormat = lazy(() => import('../banlist/BanListContentNormalFormat'))

function dateReducer(_: { banListStartDates: string; banContentLinks: SKCBanListDateLinks }, action: any) {
	return { banListStartDates: action.banListStartDates, banContentLinks: action.banContentLinks }
}

function determineListSize(size: number | undefined): number {
	return size === undefined ? 0 : size
}

function currentlySelectedBanListReducer(state: any, action: any) {
	switch (action.type) {
		case 'UPDATE_LIST':
			return {
				...state,
				forbidden: action.forbidden,
				limited: action.limited,
				semiLimited: action.semiLimited,
				numForbidden: action.numForbidden,
				numLimited: action.numLimited,
				numSemiLimited: action.numSemiLimited,
			}
		case 'UPDATE_REMOVED':
			return {
				...state,
				removedCards: action.removedCards,
				numRemoved: action.numRemoved,
			}
		case 'UPDATE_NEW':
			return {
				...state,
				newForbiddenCards: action.newForbiddenCards,
				newLimitedCards: action.newLimitedCards,
				newSemiLimitedCards: action.newSemiLimitedCards,
				numNewForbidden: action.numNewForbidden,
				numNewLimited: action.numNewLimited,
				numNewSemiLimited: action.numNewSemiLimited,
			}
		default:
			return state
	}
}

export default function BanList() {
	const [{ banListStartDates, banContentLinks }, dateDispatch] = useReducer(dateReducer, { banListStartDates: [], banContentLinks: [] })

	const [selectedBanList, setSelectedBanList] = useState<string>('')
	const [isFetchingBanList, setIsFetchingBanList] = useState(true)
	const [isFetchingBanListNewContent, setFetchingBanListNewContent] = useState(true)
	const [isFetchingBanListRemovedContent, setFetchingBanListRemovedContent] = useState(true)
	const [format, setFormat] = useState<BanListFormat>('TCG')

	const [
		{
			forbidden,
			limited,
			semiLimited,
			numForbidden,
			numLimited,
			numSemiLimited,
			removedCards,
			numRemoved,
			newForbiddenCards,
			newLimitedCards,
			newSemiLimitedCards,
			numNewForbidden,
			numNewLimited,
			numNewSemiLimited,
		},
		selectedBanListDispatch,
	] = useReducer(currentlySelectedBanListReducer, {
		forbidden: [],
		limited: [],
		semiLimited: [],
		numForbidden: 0,
		numLimited: 0,
		numSemiLimited: 0,
		removedCards: [],
		numRemoved: 0,
		newForbiddenCards: [],
		newLimitedCards: [],
		newSemiLimitedCards: [],
		numNewForbidden: 0,
		numNewLimited: 0,
		numNewSemiLimited: 0,
	})

	useEffect(() => {
		FetchHandler.handleFetch(`${DownstreamServices.NAME_maps_ENDPOINT['banListsUrl']}?format=${format}`, (json) => {
			dateDispatch({
				type: 'UPDATE_BAN_LIST',
				banContentLinks: json.banListDates.map((item: SKCBanListDate) => item._links),
				banListStartDates: json.banListDates.map((item: SKCBanListDate) => item.effectiveDate),
			})
		})
	}, [format])

	useEffect(() => {
		if (banContentLinks.length !== 0) setSelectedBanList(banListStartDates[0])
	}, [banContentLinks, banListStartDates])

	useEffect(() => {
		if (selectedBanList && selectedBanList.length !== 0) {
			setIsFetchingBanList(true)
			setFetchingBanListNewContent(true)
			setFetchingBanListRemovedContent(true)

			FetchHandler.handleFetch(banContentLinks[banListStartDates.indexOf(selectedBanList)]['Ban List New Content'].href, (json) => {
				selectedBanListDispatch({
					type: 'UPDATE_NEW',
					newForbiddenCards: json.newForbidden,
					newLimitedCards: json.newLimited,
					newSemiLimitedCards: json.newSemiLimited,
					numNewForbidden: json.numNewForbidden,
					numNewLimited: json.numNewLimited,
					numNewSemiLimited: json.numNewSemiLimited,
				})

				setFetchingBanListNewContent(false)
			})

			FetchHandler.handleFetch(banContentLinks[banListStartDates.indexOf(selectedBanList)]['Ban List Removed Content'].href, (json) => {
				selectedBanListDispatch({
					type: 'UPDATE_REMOVED',
					removedCards: json.removedCards,
					numRemoved: determineListSize(json.numRemoved),
				})

				setFetchingBanListRemovedContent(false)
			})

			FetchHandler.handleFetch(banContentLinks[banListStartDates.indexOf(selectedBanList)]['Ban List Content'].href, (json) => {
				selectedBanListDispatch({
					type: 'UPDATE_LIST',
					forbidden: json.forbidden,
					limited: json.limited,
					semiLimited: json.semiLimited,
					numForbidden: determineListSize(json.numForbidden),
					numLimited: determineListSize(json.numLimited),
					numSemiLimited: determineListSize(json.numSemiLimited),
				})

				setIsFetchingBanList(false)
			})
		}
	}, [selectedBanList])

	return (
		<div className='generic-container'>
			<Helmet>
				<title>{`SKC - Ban List: ${selectedBanList}`}</title>
				<meta name={`SKC - Ban List: ${selectedBanList}`} content={`Ban list content/info for list effective ${selectedBanList}`} />
				<meta name='keywords' content={`YuGiOh, ban list, The Supreme Kings Castle, ${selectedBanList}`} />
			</Helmet>

			<BreadCrumb crumbs={['Home', 'Ban List']} />

			<OneThirdTwoThirdsGrid
				oneThirdComponent={
					<Suspense fallback={<Skeleton variant='rectangular' width='100%' height='300px' />}>
						<Section
							sticky
							sectionHeaderBackground={'ban-list'}
							sectionName='Overview'
							sectionContent={
								<div className='section-content'>
									<BanListDates
										format={format}
										setFormat={setFormat}
										banListStartDates={banListStartDates}
										setSelectedBanList={(ind: number) => setSelectedBanList(banListStartDates[ind])}
									/>
								</div>
							}
						/>
					</Suspense>
				}
				twoThirdComponent={
					<Suspense fallback={<div />}>
						{format === 'DL' ? undefined : (
							<BanListContentNormalFormat
								forbidden={forbidden}
								limited={limited}
								semiLimited={semiLimited}
								numForbidden={numForbidden}
								numLimited={numLimited}
								numSemiLimited={numSemiLimited}
								removedCards={removedCards}
								numRemoved={numRemoved}
								newForbiddenCards={newForbiddenCards}
								newLimitedCards={newLimitedCards}
								newSemiLimitedCards={newSemiLimitedCards}
								numNewForbidden={numNewForbidden}
								numNewLimited={numNewLimited}
								numNewSemiLimited={numNewSemiLimited}
								isFetchingBanListNewContent={isFetchingBanListNewContent}
								isFetchingBanListRemovedContent={isFetchingBanListRemovedContent}
								isFetchingBanList={isFetchingBanList}
							/>
						)}
					</Suspense>
				}
			/>
		</div>
	)
}
