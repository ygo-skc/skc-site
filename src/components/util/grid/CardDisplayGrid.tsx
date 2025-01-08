import { memo, FC, lazy, useCallback } from 'react'

import { Button } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Hint } from 'skc-rcl'
import { CardDisplayGridState, CardDisplayGridStateReducerAction, CardDisplayGridStateReducerActionType } from '../../../reducers/CardDisplayGridReducer'
import CardGridItems from './CardGridItems'

const PlaceHolderGridItems = lazy(() => import('./PlaceHolderGridItems'))

type CardDisplayGridProps = {
	cardGridState: CardDisplayGridState
	dispatch: React.Dispatch<CardDisplayGridStateReducerAction>
}

const CardDisplayGrid: FC<CardDisplayGridProps> = memo(
	({ cardGridState, dispatch }) => {
		const loadMoreCB = useCallback(() => {
			dispatch({ type: CardDisplayGridStateReducerActionType.LOAD_MORE })
		}, [])

		return (
			<div>
				<Grid container>
					{cardGridState.isLoading && <PlaceHolderGridItems />}
					{!cardGridState.isLoading && cardGridState.totalResults === 0 && <Hint fullWidth={false}>{'No Content To Show'}</Hint>}
					{!cardGridState.isLoading && cardGridState.totalResults !== 0 && <CardGridItems cards={cardGridState.results.slice(0, cardGridState.totalDisplaying)} />}
				</Grid>

				{!cardGridState.isLoading && cardGridState.totalResults !== 0 && cardGridState.totalDisplaying < cardGridState.totalResults && (
					<Button
						onClick={loadMoreCB}
						style={{
							padding: '1rem',
							margin: '0 auto',
							display: 'block',
						}}
					>
						Load More
					</Button>
				)}
			</div>
		)
	},
	(prevProps, newProps) => {
		return (
			prevProps.cardGridState.isLoading === newProps.cardGridState.isLoading &&
			prevProps.cardGridState.totalResults === newProps.cardGridState.totalResults &&
			prevProps.cardGridState.totalDisplaying === newProps.cardGridState.totalDisplaying &&
			prevProps.cardGridState.results.every((prevCard: YGOCard, index: number) => prevCard.cardID === newProps.cardGridState.results[index].cardID)
		)
	}
)

CardDisplayGrid.displayName = 'CardDisplayGrid'
export default CardDisplayGrid
