import { Skeleton } from '@mui/material'
import Grid from '@mui/material/Grid'
import { FC, Fragment, JSX, useEffect, useState } from 'react'

const PlaceHolderGridItems: FC<{ totalPlaceHolders?: number }> = ({ totalPlaceHolders = 10 }) => {
	const [placeHolderUI, setPlaceHolderUI] = useState<JSX.Element[]>([])

	useEffect(() => {
		const placeHolderUI = []

		for (let i = 0; i < totalPlaceHolders; i++) {
			placeHolderUI.push(
				<Grid key={`skeleton-${i}`} size={{ xs: 6, sm: 4, md: 4, lg: 3, xl: 2 }} style={{ padding: '.3rem' }}>
					<Skeleton variant='rectangular' height='170px' width='100%' style={{ borderRadius: '4rem', marginBottom: '1rem' }} />
					<Skeleton variant='rectangular' width='100%' height='100px' />
				</Grid>
			)
		}
		setPlaceHolderUI(placeHolderUI)
	}, [])

	return <Fragment>{placeHolderUI}</Fragment>
}

export default PlaceHolderGridItems
