import React, { memo, useState, useEffect, useCallback } from 'react'
import Styled from 'styled-components'

import { List, ListItemText, Collapse, ListItem } from '@material-ui/core'

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {LeftBoxSectionHeaderTypography} from '../grid/OneThirdTwoThirdsGrid'


const ListStatItem = Styled(ListItem)`
	&&
	{
		padding: .25rem;

		.MuiListItemText-secondary
		{
			font-size: 1.15rem;
			color: rgba(255, 255, 255, .95);
		}

		.MuiListItemText-primary
		{
			font-weight: 700;
			font-size: 1.15rem;
			color: rgba(255, 255, 255, .95);
		}
	}
`

const StatList = Styled(List)`
	&&
	{
		.MuiListItem-root
		{
			border-bottom: solid;
			border-color: rgba(255, 255, 255, .25);
			border-width: 1px;
		}
	}
`


function getListItemCardChild(cardName, previousBanStatus, cardId)
{
	return <ListItemText
		onClick={() => window.location.assign(`/card/${cardId}`)}
		primary={cardName}
		secondary={`Previously ${previousBanStatus}`}
	/>

}


const BanListStats = memo( ( { totalCardsInSelectedList, selectedBanList
	, newForbiddenCards, newLimitedCards, newSemiLimitedCards, numNewForbidden, numNewLimited, numNewSemiLimited, removedCards, numRemoved } ) =>
{
	const [isShowingNewCards, setIsShowingNewCards] = useState(false)
	const [isShowingNewForbiddenCards, setIsShowingNewForbiddenCards] = useState(false)
	const [isShowingNewLimitedCards, setIsShowingNewLimitedCards] = useState(false)
	const [isShowingNewSemiLimitedCards, setIsShowingNewSemiLimitedCards] = useState(false)

	const [removedCardsList, setRemovedCardsList] = useState({})

	const [isShowingRemovedCards, setIsShowingRemovedCards] = useState(false)

	const [newForbiddenCardsList, setNewForbiddenCardsList] = useState([])
	const [newLimitedCardsList, setNewLimitedCardsList] = useState([])
	const [newSemiLimitedCardsList, setNewSemiLimitedCardsList] = useState([])

	const showNewCards = useCallback( () => {
		setIsShowingNewCards(!isShowingNewCards)
	}, [isShowingNewCards])

	const showNewForbiddenCards = useCallback( () => {
		setIsShowingNewForbiddenCards(!isShowingNewForbiddenCards)
	}, [isShowingNewForbiddenCards])

	const showNewLimitedCards = useCallback( () => {
		setIsShowingNewLimitedCards(!isShowingNewLimitedCards)
	}, [isShowingNewLimitedCards])

	const showNewSemiLimitedCards = useCallback( () => {
		setIsShowingNewSemiLimitedCards(!isShowingNewSemiLimitedCards)
	}, [isShowingNewSemiLimitedCards])

	const showRemovedCards = useCallback( () => {
		setIsShowingRemovedCards(!isShowingRemovedCards)
	}, [isShowingRemovedCards])


	useEffect(() => {
		if (selectedBanList !== '')
		{
			setIsShowingNewForbiddenCards(false)
			setIsShowingNewLimitedCards(false)
			setIsShowingNewSemiLimitedCards(false)

			setIsShowingRemovedCards(false)
		}
		// eslint-disable-next-line
	}, [selectedBanList])


	useEffect( () => {
		const newForbiddenCardsList = []

		newForbiddenCards.forEach( (card, ind) => {
			newForbiddenCardsList.push(
				<ListStatItem
					key={ind}
					button
					style={{marginLeft: '2.3rem', marginRight: '2.3rem'}}  >
					{getListItemCardChild(card.cardName, card.previousBanStatus, card.cardId)}
				</ListStatItem>
			)
		})

		setNewForbiddenCardsList(newForbiddenCardsList)
	}, [newForbiddenCards])


	useEffect( () => {
		const newLimitedCardsList = []

		newLimitedCards.forEach( (card, ind) => {
			newLimitedCardsList.push(
				<ListStatItem key={ind} button style={{marginLeft: '2.3rem', marginRight: '2.3rem'}}  >
					{getListItemCardChild(card.cardName, card.previousBanStatus, card.cardId)}
				</ListStatItem>
			)
		})

		setNewLimitedCardsList(newLimitedCardsList)

	}, [newLimitedCards])


	useEffect( () => {
		const newSemiLimitedCardsList = []

		newSemiLimitedCards.forEach( (card, ind) => {
			newSemiLimitedCardsList.push(
				<ListStatItem key={ind} button style={{marginLeft: '2.3rem', marginRight: '2.3rem'}}  >
					{getListItemCardChild(card.cardName, card.previousBanStatus, card.cardId)}
				</ListStatItem>
			)
		})

		setNewSemiLimitedCardsList(newSemiLimitedCardsList)

	}, [newSemiLimitedCards])


	useEffect( () => {
		const removedCardsList = []

		removedCards.forEach( (card, ind) => {
			removedCardsList.push(
				<ListStatItem key={ind} button style={{marginLeft: '1.15rem', marginRight: '1.15rem'}}  >
					{getListItemCardChild(card.cardName, card.previousBanStatus, card.cardId)}
				</ListStatItem>)
		})
		setRemovedCardsList(removedCardsList)
	}, [removedCards])


	return(
		<div style={{padding: '.5rem'}} >
			<LeftBoxSectionHeaderTypography
				variant='h6' >
				Summary
			</LeftBoxSectionHeaderTypography>

			<StatList style={{ width: '100%', maxWidth: '400px' }}
				component="nav"
				aria-labelledby="nested-StatList-subheader">
				<ListStatItem >
					<ListItemText
						primary="Total Cards"
						secondary={totalCardsInSelectedList}
					/>
				</ListStatItem>

				<ListStatItem
					button
					disabled={( (numNewForbidden + numNewLimited + numNewSemiLimited) === 0 )? true : false}
					onClick={showNewCards} >
					<ListItemText
						primary="Newly Added"
						secondary={ ( isNaN(numNewForbidden + numNewLimited + numNewSemiLimited))? '' : numNewForbidden + numNewLimited + numNewSemiLimited }
					/>
						{isShowingNewCards ? <ExpandLess /> : <ExpandMore />}
				</ListStatItem>

				<Collapse
					in={isShowingNewCards}
					timeout="auto"
					unmountOnExit >
					<StatList
						component="div"
						disablePadding >
						<ListStatItem
							button
							disabled={(numNewForbidden === 0)? true : false }
							onClick={showNewForbiddenCards}
							style={{marginLeft: '1.15rem', marginRight: '1.15rem'}}  >
							<ListItemText
								primary="Forbidden"
								secondary={ numNewForbidden } />
							{isShowingNewForbiddenCards ? <ExpandLess /> : <ExpandMore />}
						</ListStatItem>
						<Collapse
							in={isShowingNewForbiddenCards}
							timeout="auto"
							unmountOnExit >
							<StatList
								component="div"
								disablePadding >
								{newForbiddenCardsList}
							</StatList>
						</Collapse>

						<ListStatItem
							button
							disabled={(numNewLimited === 0)? true : false }
							onClick={showNewLimitedCards}
							style={{marginLeft: '1.15rem', marginRight: '1.15rem'}}  >
							<ListItemText
								primary="Limited"
								secondary={ numNewLimited } />
							{isShowingNewForbiddenCards ? <ExpandLess /> : <ExpandMore />}
						</ListStatItem>
						<Collapse
							in={isShowingNewLimitedCards}
							timeout="auto"
							unmountOnExit >
							<StatList
								component="div"
								disablePadding >
								{ newLimitedCardsList }
							</StatList>
						</Collapse>

						<ListStatItem
							button
							disabled={(numNewSemiLimited === 0)? true : false }
							onClick={showNewSemiLimitedCards}
							style={{marginLeft: '1.15rem', marginRight: '1.15rem'}}  >
							<ListItemText
								primary="Semi-Limited"
								secondary={ numNewSemiLimited} />
								{ isShowingNewForbiddenCards ? <ExpandLess /> : <ExpandMore /> }
						</ListStatItem>
						<Collapse
							in={isShowingNewSemiLimitedCards}
							timeout="auto"
							unmountOnExit >
							<StatList
								component="div"
								disablePadding >
								{ newSemiLimitedCardsList }
							</StatList>
						</Collapse>
					</StatList>
				</Collapse>

				<ListStatItem
					button
					disabled={(numRemoved === 0)? true : false }
					onClick={ showRemovedCards } >
					<ListItemText
						primary="No Longer Restricted"
						secondary={numRemoved}
					/>
						{ isShowingRemovedCards ? <ExpandLess /> : <ExpandMore /> }
				</ListStatItem>
				<Collapse
					in={ isShowingRemovedCards }
					timeout="auto"
					unmountOnExit>
					<StatList
						component="div"
						disablePadding >
						{removedCardsList}
					</StatList>
				</Collapse>

			</StatList>
		</div>
	)
}, (prevProps, newProps) => {
	if ( prevProps.selectedBanList !== newProps.selectedBanList || prevProps.totalCardsInSelectedList !== newProps.totalCardsInSelectedList || prevProps.numNewForbidden !== newProps.numNewForbidden || prevProps.numNewLimited !== newProps.numNewLimited || prevProps.numNewSemiLimited !== newProps.numNewSemiLimited || prevProps.numRemoved !== newProps.numRemoved )
		return false

	return true
})

export default BanListStats