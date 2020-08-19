import React, { lazy, useState, useEffect, useMemo } from 'react'
import Styled from 'styled-components'

import { Paper, Box } from '@material-ui/core'


/*
	Custom Components
*/
import { BanListSection } from './BanListSection'
import { TabbedView } from './TabbedView'
import { handleFetch } from '../../helper/FetchHandler'
import { BanListDates } from './BanListDates'
import NAME_maps_ENDPOINT from '../../helper/YgoApiEndpoints'

import {OneThirdTwoThirdsGrid} from '../grid/OneThirdTwoThirdsGrid'


const BreadCrumb = lazy( () => import('../Breadcrumb') )
const BanListStats = lazy( () => import('./BanListStats') )


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
			setBanListStartDates(resultJson.banListStartDates)
			setSelectedBanList(resultJson.banListStartDates[0])
		})
		// eslint-disable-next-line
	}, [])


	useEffect( () => {
		if ( !isFetchingBanList )	setIsDataLoaded(true)
		else	setIsDataLoaded(false)
	}, [isFetchingBanList])


	useEffect(() => {
		if (selectedBanList !== '')
		{
			setIsSettingUpDates(false)
			setIsFetchingBanList(true)

			handleFetch(`${NAME_maps_ENDPOINT['banListInstanceUrl']}/${selectedBanList}?saveBandwidth=true&allInfo=true`, props.history, (resultJson) => {

				setForbidden( resultJson.banListInstance.forbidden )
				setLimited( resultJson.banListInstance.limited )
				setSemiLimited( resultJson.banListInstance.semiLimited )

				setNumForbidden( (resultJson.banListInstance.numForbidden == undefined)? 0 : resultJson.banListInstance.numForbidden )
				setNumLimited( (resultJson.banListInstance.numLimited == undefined)? 0 : resultJson.banListInstance.numLimited )
				setNumSemiLimited( (resultJson.banListInstance.numSemiLimited == undefined)? 0 : resultJson.banListInstance.numSemiLimited )

				// Removed cards compared to previous ban list
				setRemovedCards(resultJson.banListInstance.removedContent.removedCards)
				setNumRemoved(resultJson.banListInstance.removedContent.numRemoved)

				// Newly added cads compared to previous ban list
				setNewForbiddenCards(resultJson.banListInstance.newContent.newCards.forbidden)
				setNewLimitedCards(resultJson.banListInstance.newContent.newCards.limited)
				setNewSemiLimitedCards(resultJson.banListInstance.newContent.newCards.semiLimited)

				setNumNewForbidden(resultJson.banListInstance.newContent.newCards.numForbidden)
				setNumNewLimited(resultJson.banListInstance.newContent.newCards.numLimited)
				setNumNewSemiLimited(resultJson.banListInstance.newContent.newCards.numSemiLimited)

				setIsFetchingBanList(false)
			})

		}
		// eslint-disable-next-line
	}, [selectedBanList])



	return (
		<Box style={{}} >
			<BreadCrumb crumbs={['Home', 'Ban List']} />


			<OneThirdTwoThirdsGrid
				oneThirdComponent={
					<div>
						<BanContentParent
							style={ (isSettingUpDates)? {display: 'none'}: {display: 'block' }  } >

							{(isSettingUpDates)? undefined
								: <BanListDates
								selectedBanList={selectedBanList}
								banListStartDates={banListStartDates}
								setSelectedBanList={ (ind) => setSelectedBanList(banListStartDates[ind]) } />}

						</BanContentParent>

						<BanContentParent
							style={ (isSettingUpDates)? {display: 'none'}: { display: 'block', marginBottom: '0rem' }  } >
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
						</BanContentParent>
					</div>
				}
				twoThirdComponent={
					<BannedContentContainer  >
						<TabbedView
							numForbidden={numForbidden}
							numLimited={numLimited}
							numSemiLimited={numSemiLimited}
							banList={selectedBanList}
							forbiddenContent={
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
							}

							limitedContent={
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
							}

							semiLimitedContent={
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
							}
						/>
						</BannedContentContainer>
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
