import React, { memo, useState, useEffect, useCallback } from 'react'
import Styled from 'styled-components'

import { Typography, List, ListItemText, Collapse, ListItem } from '@material-ui/core'

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';


const ListStatItem = Styled(ListItem)`
	&&
	{
		padding: .25rem;
	}
`


export const BanListStats = memo( ( { numForbidden, numLimited, numSemiLimited, selectedBanList
	, newForbiddenCards, newLimitedCards, newSemiLimitedCards, removedCards, handleFetchCardInfo, cardClicked } ) =>
{
	console.log('stats rendered')
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
				<ListStatItem key={ind} button onClick={ () => cardClicked(card.id) } style={{paddingLeft: '3rem'}}  >
					<ListItemText primary={card.name} secondary={`Was: ${card.previousStatus}`} />
				</ListStatItem>
			)
		})

		setNewForbiddenCardsList(newForbiddenCardsList)
	}, [newForbiddenCards])


	useEffect( () => {
		const newLimitedCardsList = []

		newLimitedCards.forEach( (card, ind) => {
			newLimitedCardsList.push(
				<ListStatItem key={ind} button onClick={ () => cardClicked(card.id) } style={{paddingLeft: '3rem'}}  >
					<ListItemText primary={card.name} secondary={`Was: ${card.previousStatus}`} />
				</ListStatItem>
			)
		})

		setNewLimitedCardsList(newLimitedCardsList)

	}, [newLimitedCards])


	useEffect( () => {
		const newSemiLimitedCardsList = []

		newSemiLimitedCards.forEach( (card, ind) => {
			newSemiLimitedCardsList.push(
				<ListStatItem key={ind} button onClick={ () => cardClicked(card.id) } style={{paddingLeft: '3rem'}}  >
					<ListItemText primary={card.name} secondary={`Was: ${card.previousStatus}`} />
				</ListStatItem>
			)
		})

		setNewSemiLimitedCardsList(newSemiLimitedCardsList)

	}, [newSemiLimitedCards])


	useEffect( () => {
		const removedCardsList = []

		console.log(removedCards)

		removedCards.forEach( (card, ind) => {
			removedCardsList.push(
				<ListStatItem key={ind} button onClick={ () => cardClicked(card.id) } style={{paddingLeft: '3rem'}}  >
					<ListItemText primary={card.name} secondary={`Was: ${card.previousStatus}`}  />
				</ListStatItem>)
		})
		setRemovedCardsList(removedCardsList)
	}, [removedCards])


	return(
		<div style={{padding: '.75rem'}} >
			<Typography variant='h4'>
				List Stats
			</Typography>
			<List style={{ width: '100%', maxWidth: '400px' }}
				component="nav"
				aria-labelledby="nested-list-subheader">
				<ListStatItem >
					<ListItemText
						primary="Total Cards"
						secondary={numForbidden + numLimited + numSemiLimited} />
				</ListStatItem>

				<ListStatItem
					button
					onClick={showNewCards}>
					<ListItemText primary="Newly Added (Compared To Previous)" />
						{isShowingNewCards ? <ExpandLess /> : <ExpandMore />}
				</ListStatItem>

				<Collapse
					in={isShowingNewCards}
					timeout="auto"
					unmountOnExit >
					<List
						component="div"
						disablePadding >
						<ListStatItem
							button
							onClick={showNewForbiddenCards}
							style={{paddingLeft: '2.5rem'}}  >
							<ListItemText
								primary="Forbidden"
								secondary={newForbiddenCards.length} />
							{isShowingNewForbiddenCards ? <ExpandLess /> : <ExpandMore />}
						</ListStatItem>
						<Collapse
							in={isShowingNewForbiddenCards}
							timeout="auto"
							unmountOnExit >
							<List
								component="div"
								disablePadding >
								{newForbiddenCardsList}
							</List>
						</Collapse>

						<ListStatItem
							button
							onClick={showNewLimitedCards}
							style={{paddingLeft: '2.5rem'}}  >
							<ListItemText
								primary="Limited"
								secondary={newLimitedCards.length} />
							{isShowingNewForbiddenCards ? <ExpandLess /> : <ExpandMore />}
						</ListStatItem>
						<Collapse
							in={isShowingNewLimitedCards}
							timeout="auto"
							unmountOnExit >
							<List
								component="div"
								disablePadding >
								{ newLimitedCardsList }
							</List>
						</Collapse>

						<ListStatItem
							button
							onClick={showNewSemiLimitedCards}
							style={{paddingLeft: '2.5rem'}}  >
							<ListItemText
								primary="Semi-Limited"
								secondary={newSemiLimitedCards.length} />
								{ isShowingNewForbiddenCards ? <ExpandLess /> : <ExpandMore /> }
						</ListStatItem>
						<Collapse
							in={isShowingNewSemiLimitedCards}
							timeout="auto"
							unmountOnExit >
							<List
								component="div"
								disablePadding >
								{ newSemiLimitedCardsList }
							</List>
						</Collapse>
					</List>
				</Collapse>

				<ListStatItem
					button
					onClick={ showRemovedCards } >
					<ListItemText
						primary="Removed (Compared To Previous)" />
						{ isShowingRemovedCards ? <ExpandLess /> : <ExpandMore /> }
				</ListStatItem>
				<Collapse
					in={ isShowingRemovedCards }
					timeout="auto"
					unmountOnExit>
					<List
						component="div"
						disablePadding >
						{removedCardsList}
					</List>
				</Collapse>

			</List>
		</div>
	)
}, (prevProps, newProps) => {
	if ( prevProps.selectedBanList !== newProps.selectedBanList || prevProps.newForbiddenCards !== newProps.newForbiddenCards || prevProps.newLimitedCards !== newProps.newLimitedCards || prevProps.newSemiLimitedCards !== newProps.newSemiLimitedCards || prevProps.removedCards !== newProps.removedCards )	return false

	return true
})