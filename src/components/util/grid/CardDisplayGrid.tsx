import { useState, useEffect, memo, FC } from 'react'

import { Grid, IconButton, Box, Skeleton } from '@mui/material'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'

import CardImageRounded from '../../card/CardImageRounded'

import YGOCard from '../../card/YGOCard'

import { Hint } from '../Hints'

import Styled from 'styled-components'

async function getPlaceholderCardComponent() {
	const placeHolder = []

	for (let i = 0; i < 20; i++) {
		placeHolder.push(
			<Grid key={`skeleton-${i}`} item xs={6} sm={4} md={4} lg={3} xl={2} style={{ padding: '.3rem' }}>
				<Skeleton variant='rectangular' height='170' width='100%' style={{ borderRadius: '4rem', marginBottom: '1rem' }} />
				<Skeleton variant='rectangular' width='100%' height='100' />
			</Grid>
		)
	}

	return placeHolder
}

const GridItem = Styled(Grid)`
	&&
	{
		border-radius: 1.2rem;
		padding: .3rem;
		cursor: pointer;

		:hover
		{
			background: #eee;
		}
	}
`

type _CardDisplayGrid = {
	cardJsonResults: any
	numResultsDisplayed: number
	numItemsToLoadWhenNeeded: number
	loadMoreCallback: any
	isLoadMoreOptionVisible: boolean
	numResults: number
	isDataLoaded: boolean
}

const CardDisplayGrid: FC<_CardDisplayGrid> = memo(
	({ cardJsonResults, numResultsDisplayed, numItemsToLoadWhenNeeded, loadMoreCallback, isLoadMoreOptionVisible, numResults, isDataLoaded }) => {
		const [cardGridUI, setCardGridUI] = useState<JSX.Element[]>([])

		const [cardGridUISkeleton, setCardGridUISkeleton] = useState<JSX.Element[]>([])
		const [clearGrid, setClearGrid] = useState(false)

		const renderCards = () => {
			return cardJsonResults.slice(numResultsDisplayed - numItemsToLoadWhenNeeded, numResultsDisplayed).map((card: SKCCard) => {
				return (
					<GridItem id={card.cardID} key={card.cardID} item xs={6} sm={4} md={4} lg={3} xl={2} style={{}} onClick={() => window.location.assign(`/card/${card.cardID}`)}>
						<CardImageRounded cardImg={`https://images.thesupremekingscastle.com/cards/x-sm/${card.cardID}.jpg`} />

						<YGOCard
							cardName={card.cardName}
							cardColor={card.cardColor}
							cardEffect={card.cardEffect}
							monsterType={card.monsterType}
							cardID={card.cardID}
							fullDetails={false}
							effectMaxLineHeight={3}
							monsterAssociation={card.monsterAssociation}
							cardAttribute={card.cardAttribute}
						/>
					</GridItem>
				)
			})
		}

		useEffect(() => {
			if (isDataLoaded === false) getPlaceholderCardComponent().then((placeholders) => setCardGridUISkeleton(placeholders))
		}, [isDataLoaded])

		useEffect(() => {
			if (numResults === 0) {
				setClearGrid(true)
				return
			}

			setCardGridUI([...cardGridUI, ...renderCards()])
		}, [numResultsDisplayed, cardJsonResults, numResults])

		useEffect(() => {
			if (clearGrid === true) {
				setCardGridUI([])
				setClearGrid(false)
			}
		}, [clearGrid])

		return (
			<Box style={{ maxWidth: '100%' }}>
				<Grid container>{!isDataLoaded ? cardGridUISkeleton : numResults === 0 ? <Hint>{'No Content To Show'}</Hint> : cardGridUI}</Grid>

				{!isDataLoaded ? undefined : (
					<IconButton
						onClick={() => loadMoreCallback()}
						style={
							isLoadMoreOptionVisible
								? {
										display: 'block',
										margin: 'auto',
										background: '#310e68',
										backgroundImage: 'linear-gradient(316deg, #310e68 0%, #5f0f40 74%)',
										color: 'rgba(255, 255, 255, .95)',
										marginTop: '1.5rem',
										marginBottom: '1.5rem',
										fontSize: '2rem',
								  }
								: { display: 'none' }
						}
					>
						<ExpandMoreRoundedIcon />
					</IconButton>
				)}
			</Box>
		)
	},
	(prevProps, newProps) => {
		if (prevProps.isDataLoaded !== newProps.isDataLoaded) return false

		return true
	}
)

export default CardDisplayGrid
