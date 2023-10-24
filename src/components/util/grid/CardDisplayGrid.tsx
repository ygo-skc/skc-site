import { useEffect, memo, FC, useReducer, useCallback } from 'react'

import { Button, Skeleton } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import { Hint, YGOCardWithImage } from 'skc-rcl'

function getPlaceholderCardComponent() {
	const placeHolder = []

	for (let i = 0; i < 10; i++) {
		placeHolder.push(
			<Grid2 key={`skeleton-${i}`} xs={6} sm={4} md={4} lg={3} xl={2} style={{ padding: '.3rem' }}>
				<Skeleton variant='rectangular' height='170px' width='100%' style={{ borderRadius: '4rem', marginBottom: '1rem' }} />
				<Skeleton variant='rectangular' width='100%' height='100px' />
			</Grid2>
		)
	}

	return placeHolder
}

type _CardDisplayGrid = {
	cardJsonResults: any
	numResultsDisplayed: number
	numItemsToLoadWhenNeeded: number
	loadMoreCallback: any
	isLoadMoreOptionVisible: boolean
	numResults: number
	isDataLoaded: boolean
}

const CardDisplayGridItem: FC<{ card: SKCCard }> = ({ card }) => {
	const handleCardClicked = useCallback(() => window.location.assign(`/card/${card.cardID}`), [card])

	return (
		<Grid2 className='ygo-card-grid-item' id={card.cardID} key={card.cardID} xs={6} sm={4} md={4} lg={3} xl={2} onClick={handleCardClicked}>
			<YGOCardWithImage card={card} />
		</Grid2>
	)
}

const CardDisplayGrid: FC<_CardDisplayGrid> = memo(
	({ cardJsonResults, numResultsDisplayed, numItemsToLoadWhenNeeded, loadMoreCallback, isLoadMoreOptionVisible, numResults, isDataLoaded }) => {
		const [{ cardGridUI, updateGrid, cardGridUISkeleton }, cardGridDispatch] = useReducer(cardGridReducer, {
			cardGridUI: [],
			updateGrid: false,
			cardGridUISkeleton: getPlaceholderCardComponent(),
		})

		function cardGridReducer(state: { cardGridUI: JSX.Element[]; updateGrid: boolean; cardGridUISkeleton: JSX.Element[] }, action: any) {
			const renderCards = () => {
				return cardJsonResults
					.slice(numResultsDisplayed - numItemsToLoadWhenNeeded, numResultsDisplayed)
					.map((card: SKCCard) => <CardDisplayGridItem key={card.cardID} card={card} />)
			}
			switch (action.type) {
				case 'CLEAR_GRID':
					return {
						...state,
						cardGridUI: [],
						updateGrid: true,
					}
				case 'RENDER_GRID':
					return {
						...state,
						cardGridUI: [...renderCards()],
						updateGrid: false,
					}
				default:
					return state
			}
		}

		useEffect(() => {
			cardGridDispatch({ type: 'RENDER_GRID' })
		}, [updateGrid])

		useEffect(() => {
			cardGridDispatch({ type: 'CLEAR_GRID' })
		}, [numResults])

		return (
			<div>
				<Grid2 container>
					{!isDataLoaded && cardGridUISkeleton}
					{isDataLoaded && numResults === 0 && <Hint fullWidth={false}>{'No Content To Show'}</Hint>}
					{isDataLoaded && numResults !== 0 && cardGridUI}
				</Grid2>

				{!isDataLoaded ? undefined : (
					<Button onClick={loadMoreCallback} style={isLoadMoreOptionVisible ? { padding: '1rem', margin: '0 auto', display: 'block' } : { display: 'none' }}>
						Load More
					</Button>
				)}
			</div>
		)
	},
	(prevProps, newProps) => {
		if (prevProps.isDataLoaded !== newProps.isDataLoaded || prevProps.numResults !== newProps.numResults) return false

		return true
	}
)

CardDisplayGrid.displayName = 'CardDisplayGrid'
export default CardDisplayGrid
