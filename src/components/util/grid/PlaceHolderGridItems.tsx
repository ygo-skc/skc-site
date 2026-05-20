import { Skeleton } from '@mui/material'
import Grid from '@mui/material/Grid'
import { FC, memo } from 'react'

const PlaceHolderGridItems: FC<{ totalPlaceHolders?: number }> = memo(({ totalPlaceHolders = 10 }) => (
	<>
		{Array.from({ length: totalPlaceHolders }, (_, i) => (
			<Grid key={`skeleton-${i}`} size={{ xs: 6, sm: 4, md: 4, lg: 3, xl: 2 }} style={{ padding: '.3rem' }}>
				<Skeleton variant='rectangular' height='170px' width='100%' style={{ borderRadius: '4rem', marginBottom: '1rem' }} />
				<Skeleton variant='rectangular' width='100%' height='100px' />
			</Grid>
		))}
	</>
))

PlaceHolderGridItems.displayName = 'PlaceHolderGridItems'
export default PlaceHolderGridItems
