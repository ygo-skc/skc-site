import React, { lazy, useState, useEffect, Suspense } from 'react'
import Styled from 'styled-components'
import { Helmet } from 'react-helmet'

import { Paper, Box } from '@material-ui/core'


import { handleFetch } from '../../helper/FetchHandler'
import { BanListDates } from './BanListDates'
import NAME_maps_ENDPOINT from '../../helper/YgoApiEndpoints'

import OneThirdTwoThirdsGrid from '../grid/OneThirdTwoThirdsGrid'


// import BanListStats from './BanListStats'
import BreadCrumb from '../Breadcrumb'
const TabbedView = lazy( () => import('./TabbedView') )
const BanListSection = lazy( () => import('./BanListSection') )
// const BreadCrumb = lazy( () => import('../Breadcrumb') )
const BanListStats = lazy( () => import('./BanListStats') )
const Footer = lazy( () => import('../Footer') )


const BanContentParent = Styled(Paper)`
	&&
	{
		background-image: linear-gradient(315deg, #fc9842 0%, #fe5f75 74%);
		border-radius: .5rem;

		@media screen and (min-width: 0px)
		{
			padding: .67rem;
			margin-bottom: 1.5rem;
		}
		@media screen and (min-width: 600px)
		{
			padding: 1rem;
			margin-bottom: 1.5rem;
		}
		@media screen and (min-width: 960px)
		{
			padding: 1.1rem;
			margin-bottom: 1.5rem;
		}
		@media screen and (min-width: 1280px)
		{
			padding: 1.2rem;
			margin-bottom: 1.5rem;
		}
		@media screen and (min-width: 1920px)
		{
			padding: 1.2rem;
			margin-bottom: 1.5rem;
		}
	}
`

const BannedContentContainer = Styled(Paper)`
	&&
	{
		border-radius: 0rem;
	}
`



export default function BanList(props)
{
	const [banListStartDates, setBanListStartDates] = useState([])
	const [selectedBanList, setSelectedBanList] = useState('')
	const [banListInstanceLinks, setBanListInstanceLinks] = useState([])

	const [forbidden, setForbidden] = useState([])
	const [limited, setLimited] = useState([])
	const [semiLimited, setSemiLimited] = useState([])

	const [numForbidden, setNumForbidden] = useState(0)
	const [numLimited, setNumLimited] = useState(0)
	const [numSemiLimited, setNumSemiLimited] = useState(0)

	const [isSettingUpDates, setIsSettingUpDates] = useState(true)
	const [isFetchingBanList, setIsFetchingBanList] = useState(true)
	const [isDataLoaded, setIsDataLoaded] = useState(false)

	const [newForbiddenCards, setNewForbiddenCards] = useState([])
	const [newLimitedCards, setNewLimitedCards] = useState([])
	const [newSemiLimitedCards, setNewSemiLimitedCards] = useState([])

	const [numNewForbidden, setNumNewForbidden] = useState(undefined)
	const [numNewLimited, setNumNewLimited] = useState(undefined)
	const [numNewSemiLimited, setNumNewSemiLimited] = useState(undefined)

	const [removedCards, setRemovedCards] = useState([])
	const [numRemoved, setNumRemoved] = useState(undefined)


	useEffect(() => {
		handleFetch(NAME_maps_ENDPOINT['banListsUrl'], props.history, (resultJson) => {
			setBanListInstanceLinks(resultJson.banListDates.map(item => item._links['Ban List Content'].href))
			setBanListStartDates(resultJson.banListDates.map(item => item.effectiveDate))
			setIsSettingUpDates(false)
		})
		// eslint-disable-next-line
	}, [])


	useEffect(() => {
		if (banListInstanceLinks.length !== 0)
			setSelectedBanList(banListStartDates[0])
	}, [banListInstanceLinks, banListStartDates])


	useEffect( () => {
		if ( !isFetchingBanList )	setIsDataLoaded(true)
		else	setIsDataLoaded(false)
	}, [isFetchingBanList])


	useEffect(() => {
		if (selectedBanList !== '')
		{
			setIsFetchingBanList(true)

			handleFetch(banListInstanceLinks[banListStartDates.indexOf(selectedBanList)], props.history, (resultJson) => {
				setForbidden( resultJson.banListInstance.forbidden )
				setLimited( resultJson.banListInstance.limited )
				setSemiLimited( resultJson.banListInstance.semiLimited )

				setNumForbidden( (resultJson.banListInstance.numForbidden === undefined)? 0 : resultJson.banListInstance.numForbidden )
				setNumLimited( (resultJson.banListInstance.numLimited === undefined)? 0 : resultJson.banListInstance.numLimited )
				setNumSemiLimited( (resultJson.banListInstance.numSemiLimited === undefined)? 0 : resultJson.banListInstance.numSemiLimited )

				// Removed cards compared to previous ban list
				setRemovedCards(resultJson.banListInstance.removedContent.removedCards)
				setNumRemoved(resultJson.banListInstance.removedContent.numRemoved)

				// Newly added cads compared to previous ban list
				setNewForbiddenCards(resultJson.banListInstance.newContent.newForbidden)
				setNewLimitedCards(resultJson.banListInstance.newContent.newLimited)
				setNewSemiLimitedCards(resultJson.banListInstance.newContent.newSemiLimited)

				setNumNewForbidden(resultJson.banListInstance.newContent.numNewForbidden)
				setNumNewLimited(resultJson.banListInstance.newContent.numNewLimited)
				setNumNewSemiLimited(resultJson.banListInstance.newContent.numNewSemiLimited)

				setIsFetchingBanList(false)
			})

		}
		// eslint-disable-next-line
	}, [selectedBanList])



	return (
		<Box >
			<Helmet>
				<title>{`SKC - Ban List: ${selectedBanList}`}</title>
				<meta
					name={`SKC - Ban List: ${selectedBanList}`}
					content={`Ban list content/info for list effective ${selectedBanList}`}
					/>
				<meta name="keywords" content={`YuGiOh, ban list, The Supreme Kings Castle, ${selectedBanList}`} />
			</Helmet>

			<BreadCrumb crumbs={['Home', 'Ban List']} />

			<OneThirdTwoThirdsGrid
				oneThirdComponent={
					<div>
						<BanContentParent>

							{(isSettingUpDates)? undefined
								: <BanListDates
								selectedBanList={selectedBanList}
								banListStartDates={banListStartDates}
								setSelectedBanList={ (ind) => setSelectedBanList(banListStartDates[ind]) } />}

						</BanContentParent>

						<BanContentParent>
							<Suspense fallback={undefined} >
								<BanListStats
									totalCardsInSelectedList={numForbidden + numLimited + numSemiLimited}
									selectedBanList={selectedBanList}
									newForbiddenCards={newForbiddenCards}
									newLimitedCards={newLimitedCards}
									newSemiLimitedCards={newSemiLimitedCards}
									numNewForbidden={numNewForbidden}
									numNewLimited={numNewLimited}
									numNewSemiLimited={numNewSemiLimited}
									removedCards={removedCards}
									numRemoved={numRemoved}
								/>
							</Suspense>
						</BanContentParent>
					</div>
				}
				twoThirdComponent={
					<Box>

						<BannedContentContainer  >
							<Suspense fallback={undefined} >
								<TabbedView
									numForbidden={numForbidden}
									numLimited={numLimited}
									numSemiLimited={numSemiLimited}
									banList={selectedBanList}
									forbiddenContent={
										<Suspense fallback={undefined} >
											<BanListSection
												sectionName='Forbidden'
												sectionExplanation='Forbidden cards cannot be used in Deck/Side Deck in the Advanced Format'
												sectionExplanationBackground='rgba(255, 69, 87, .17)'
												cards={forbidden}
												newCards={newForbiddenCards}
												isDataLoaded={isDataLoaded}
												cardClicked={(cardID) => window.location.assign(`/card/${cardID}`)}
												banList={selectedBanList}
											/>
										</Suspense>
								}

								limitedContent={
									<Suspense fallback={undefined} >
										<BanListSection
											sectionName='Limited'
											sectionExplanation='Limited cards can be included in Deck/Side deck - max 1'
											sectionExplanationBackground='rgba(255, 108, 18, .17)'
											cards={limited}
											newCards={newLimitedCards}
											isDataLoaded={isDataLoaded}
											cardClicked={(cardID) => window.location.assign(`/card/${cardID}`)}
											banList={selectedBanList}
										/>
									</Suspense>
								}

								semiLimitedContent={
									<Suspense fallback={undefined} >
										<BanListSection
											sectionName='Semi-Limited'
											sectionExplanation='Semi-Limited cards can be included in Deck/Side deck - max 2'
											sectionExplanationBackground='rgba(240, 198, 32, .17)'
											cards={semiLimited}
											newCards={newSemiLimitedCards}
											isDataLoaded={isDataLoaded}
											cardClicked={(cardID) => window.location.assign(`/card/${cardID}`) }
											banList={selectedBanList}
										/>
									</Suspense>
								}
								/>
								</Suspense>

							</BannedContentContainer>

							<Suspense fallback={undefined} >
								<Footer />
							</Suspense>
						</Box>
					}
				/>


				{/* <BanListTable
					isDataLoaded={ isDataLoaded }
					bannedContent={ forbidden }
					contentTitle='Forbidden'
					contentExplanation='Forbidden cards cannot be used in Deck/Side Deck in the Advanced Format'
					contentColor='#ff4557'
					cardClicked={ cardID => setChosenCardID(cardID) }
				/>
				<br />
				<BanListTable
					isDataLoaded={ isDataLoaded }
					bannedContent={ limited }
					contentTitle='Limited'
					contentExplanation='Limited cards can be included in Deck/Side deck - max 1'
					contentColor='#ff6c12'
					cardClicked={ cardID => setChosenCardID(cardID) }
				/>
				<br />
				<BanListTable
					isDataLoaded={ isDataLoaded }
					bannedContent={ semiLimited }
					contentTitle='Semi-Limited'
					contentExplanation='Semi-Limited cards can be included in Deck/Side deck - max 2'
					contentColor='#f0c620'
					cardClicked={ cardID => setChosenCardID(cardID) }
				/> */}

		</Box>
	)
}
