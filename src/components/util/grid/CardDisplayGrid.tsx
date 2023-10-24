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
	isLoading: boolean
}

const CardDisplayGrid: FC<CardDisplayGridProps> = memo(
	({ cardGridState, isLoading }) => {
		return (
			<div>
				<Grid2 container>
					{isLoading && <PlaceHolderGridItems />}
					{!isLoading && cardGridState.totalResults === 0 && <Hint fullWidth={false}>{'No Content To Show'}</Hint>}
					{!isLoading && cardGridState.totalResults !== 0 && <CardGridItems cards={cardGridState.results.splice(0, cardGridState.totalDisplaying)} />}
				</Grid2>

				{!isLoading && cardGridState.totalDisplaying >= cardGridState.totalResults ? undefined : (
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
		if (prevProps.isLoading !== newProps.isLoading || prevProps.cardGridState.totalResults !== newProps.cardGridState.totalResults) return false

		return true
	}
)

CardDisplayGrid.displayName = 'CardDisplayGrid'
export default CardDisplayGrid
