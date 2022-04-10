import { memo, useState, useEffect, useCallback, FC } from 'react'
import Styled from 'styled-components'

import { List, ListItemText, Collapse, Typography, ListItemButton } from '@mui/material'

import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'

const ListStatItem = Styled(ListItemButton)`
	&&
	{
		padding: .25rem;

		.MuiListItemText-secondary
		{
			font-size: 1.15rem;
		}

		.MuiListItemText-primary
		{
			font-weight: 700;
			font-size: 1.15rem;
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

function getListItemCardChild(cardName: string, previousBanStatus: string, cardId: string) {
	return <ListItemText onClick={() => window.location.assign(`/card/${cardId}`)} primary={cardName} secondary={`Previously ${previousBanStatus}`} />
}

type _BanListStats = {
	totalCardsInSelectedList: number
	selectedBanList: string
	newForbiddenCards: SKCCardsPreviousBanListStatus[]
	newLimitedCards: SKCCardsPreviousBanListStatus[]
	newSemiLimitedCards: SKCCardsPreviousBanListStatus[]
	numNewForbidden: number
	numNewLimited: number
	numNewSemiLimited: number
	removedCards: SKCCardsPreviousBanListStatus[]
	numRemoved: number
}

const BanListStats: FC<_BanListStats> = memo(
	({
		totalCardsInSelectedList,
		selectedBanList,
		newForbiddenCards,
		newLimitedCards,
		newSemiLimitedCards,
		numNewForbidden,
		numNewLimited,
		numNewSemiLimited,
		removedCards,
		numRemoved,
	}) => {
		const [isShowingNewCards, setIsShowingNewCards] = useState(false)
		const [isShowingNewForbiddenCards, setIsShowingNewForbiddenCards] = useState(false)
		const [isShowingNewLimitedCards, setIsShowingNewLimitedCards] = useState(false)
		const [isShowingNewSemiLimitedCards, setIsShowingNewSemiLimitedCards] = useState(false)

		const [removedCardsList, setRemovedCardsList] = useState<JSX.Element[]>([])

		const [isShowingRemovedCards, setIsShowingRemovedCards] = useState(false)

		const [newForbiddenCardsList, setNewForbiddenCardsList] = useState<JSX.Element[]>([])
		const [newLimitedCardsList, setNewLimitedCardsList] = useState<JSX.Element[]>([])
		const [newSemiLimitedCardsList, setNewSemiLimitedCardsList] = useState<JSX.Element[]>([])

		const showNewCards = useCallback(() => {
			setIsShowingNewCards(!isShowingNewCards)
		}, [isShowingNewCards])

		const showNewForbiddenCards = useCallback(() => {
			setIsShowingNewForbiddenCards(!isShowingNewForbiddenCards)
		}, [isShowingNewForbiddenCards])

		const showNewLimitedCards = useCallback(() => {
			setIsShowingNewLimitedCards(!isShowingNewLimitedCards)
		}, [isShowingNewLimitedCards])

		const showNewSemiLimitedCards = useCallback(() => {
			setIsShowingNewSemiLimitedCards(!isShowingNewSemiLimitedCards)
		}, [isShowingNewSemiLimitedCards])

		const showRemovedCards = useCallback(() => {
			setIsShowingRemovedCards(!isShowingRemovedCards)
		}, [isShowingRemovedCards])

		useEffect(() => {
			if (selectedBanList !== '') {
				setIsShowingNewForbiddenCards(false)
				setIsShowingNewLimitedCards(false)
				setIsShowingNewSemiLimitedCards(false)

				setIsShowingRemovedCards(false)
			}
			// eslint-disable-next-line
		}, [selectedBanList])

		useEffect(() => {
			const newForbiddenCardsList = newForbiddenCards.map((card, ind) => (
				<ListStatItem key={ind} style={{ marginLeft: '2.3rem', marginRight: '2.3rem' }}>
					{getListItemCardChild(card.cardName, card.previousBanStatus, card.cardId)}
				</ListStatItem>
			))

			setNewForbiddenCardsList(newForbiddenCardsList)
		}, [newForbiddenCards])

		useEffect(() => {
			const newLimitedCardsList = newLimitedCards.map((card, ind) => (
				<ListStatItem key={ind} style={{ marginLeft: '2.3rem', marginRight: '2.3rem' }}>
					{getListItemCardChild(card.cardName, card.previousBanStatus, card.cardId)}
				</ListStatItem>
			))

			setNewLimitedCardsList(newLimitedCardsList)
		}, [newLimitedCards])

		useEffect(() => {
			const newSemiLimitedCardsList = newSemiLimitedCards.map((card, ind) => (
				<ListStatItem key={ind} style={{ marginLeft: '2.3rem', marginRight: '2.3rem' }}>
					{getListItemCardChild(card.cardName, card.previousBanStatus, card.cardId)}
				</ListStatItem>
			))

			setNewSemiLimitedCardsList(newSemiLimitedCardsList)
		}, [newSemiLimitedCards])

		useEffect(() => {
			const removedCardsList = removedCards.map((card, ind) => (
				<ListStatItem key={ind} style={{ marginLeft: '1.15rem', marginRight: '1.15rem' }}>
					{getListItemCardChild(card.cardName, card.previousBanStatus, card.cardId)}
				</ListStatItem>
			))

			setRemovedCardsList(removedCardsList)
		}, [removedCards])

		return (
			<div>
				<Typography variant='h4'>Summary</Typography>

				<StatList style={{ width: '100%', maxWidth: '400px' }} aria-labelledby='nested-StatList-subheader'>
					<ListStatItem>
						<ListItemText primary='Total Cards' secondary={totalCardsInSelectedList} />
					</ListStatItem>

					<ListStatItem disabled={numNewForbidden + numNewLimited + numNewSemiLimited === 0 ? true : false} onClick={showNewCards}>
						<ListItemText
							primary='Newly & Updated'
							secondary={isNaN(numNewForbidden + numNewLimited + numNewSemiLimited) ? '' : numNewForbidden + numNewLimited + numNewSemiLimited}
						/>
						{isShowingNewCards ? <ExpandLess /> : <ExpandMore />}
					</ListStatItem>

					<Collapse in={isShowingNewCards} timeout='auto' unmountOnExit>
						<StatList disablePadding>
							<ListStatItem disabled={numNewForbidden === 0 ? true : false} onClick={showNewForbiddenCards} style={{ marginLeft: '1.15rem', marginRight: '1.15rem' }}>
								<ListItemText primary='Forbidden' secondary={numNewForbidden} />
								{isShowingNewForbiddenCards ? <ExpandLess /> : <ExpandMore />}
							</ListStatItem>
							<Collapse in={isShowingNewForbiddenCards} timeout='auto' unmountOnExit>
								<StatList disablePadding>{newForbiddenCardsList}</StatList>
							</Collapse>

							<ListStatItem disabled={numNewLimited === 0 ? true : false} onClick={showNewLimitedCards} style={{ marginLeft: '1.15rem', marginRight: '1.15rem' }}>
								<ListItemText primary='Limited' secondary={numNewLimited} />
								{isShowingNewForbiddenCards ? <ExpandLess /> : <ExpandMore />}
							</ListStatItem>
							<Collapse in={isShowingNewLimitedCards} timeout='auto' unmountOnExit>
								<StatList disablePadding>{newLimitedCardsList}</StatList>
							</Collapse>

							<ListStatItem disabled={numNewSemiLimited === 0 ? true : false} onClick={showNewSemiLimitedCards} style={{ marginLeft: '1.15rem', marginRight: '1.15rem' }}>
								<ListItemText primary='Semi-Limited' secondary={numNewSemiLimited} />
								{isShowingNewForbiddenCards ? <ExpandLess /> : <ExpandMore />}
							</ListStatItem>
							<Collapse in={isShowingNewSemiLimitedCards} timeout='auto' unmountOnExit>
								<StatList disablePadding>{newSemiLimitedCardsList}</StatList>
							</Collapse>
						</StatList>
					</Collapse>

					<ListStatItem disabled={numRemoved === 0 ? true : false} onClick={showRemovedCards}>
						<ListItemText primary='No Longer Restricted' secondary={numRemoved} />
						{isShowingRemovedCards ? <ExpandLess /> : <ExpandMore />}
					</ListStatItem>
					<Collapse in={isShowingRemovedCards} timeout='auto' unmountOnExit>
						<StatList disablePadding>{removedCardsList}</StatList>
					</Collapse>
				</StatList>
			</div>
		)
	},
	(prevProps, newProps) => {
		if (
			prevProps.selectedBanList !== newProps.selectedBanList ||
			prevProps.totalCardsInSelectedList !== newProps.totalCardsInSelectedList ||
			prevProps.numNewForbidden !== newProps.numNewForbidden ||
			prevProps.numNewLimited !== newProps.numNewLimited ||
			prevProps.numNewSemiLimited !== newProps.numNewSemiLimited ||
			prevProps.numRemoved !== newProps.numRemoved
		)
			return false

		return true
	}
)

export default BanListStats
