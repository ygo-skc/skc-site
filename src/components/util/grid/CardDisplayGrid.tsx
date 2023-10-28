import { memo, FC, lazy } from 'react'

import { Button } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import { Hint } from 'skc-rcl'
import { CardDisplayGridState, CardDisplayGridStateReducerAction } from '../../../helper/reducers/CardDisplayGridReducer'
import CardGridItems from './CardGridItems'

const PlaceHolderGridItems = lazy(() => import('./PlaceHolderGridItems'))

type CardDisplayGridProps = {
	cardGridState: CardDisplayGridState
	dispatch: React.Dispatch<CardDisplayGridStateReducerAction>
}

const CardDisplayGrid: FC<CardDisplayGridProps> = memo(
	({ cardGridState }) => {
		return (
			<div>
				<Grid2 container>
					{cardGridState.isLoading && <PlaceHolderGridItems />}
					{!cardGridState.isLoading && cardGridState.totalResults === 0 && <Hint fullWidth={false}>{'No Content To Show'}</Hint>}
					{!cardGridState.isLoading && cardGridState.totalResults !== 0 && <CardGridItems cards={cardGridState.results.splice(0, cardGridState.totalDisplaying)} />}
				</Grid2>

				{!cardGridState.isLoading && cardGridState.totalResults !== 0 && cardGridState.totalDisplaying < cardGridState.totalResults && (
					<Button
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
			prevProps.cardGridState.results.every((prevCard: SKCCard, index: number) => prevCard === prevProps.cardGridState.results[index])
		)
	}
)

CardDisplayGrid.displayName = 'CardDisplayGrid'
export default CardDisplayGrid
