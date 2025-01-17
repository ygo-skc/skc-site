import '../../css/util/database-search-styles.css'

import { FC, lazy, useCallback } from 'react'

import Grid from '@mui/material/Grid2'

import { Skeleton } from '@mui/material'
import { Tile, Section } from 'skc-rcl'

const DatabaseSearch = lazy(() => import('./search/DBSearch'))

const DatabaseInfo: FC<{ stats: SKC.DBStats & { isFetchingData: boolean } }> = ({ stats }) => {
	const handleBrowseTileClicked = useCallback(() => window.location.assign('/browse/card'), [])
	const handleBanListTileClicked = useCallback(() => window.location.assign('/ban_list'), [])
	const handleProductsTileClicked = useCallback(() => window.location.assign('/browse/product'), [])

	return (
		<Section sectionName='Content'>
			<div className='section-content'>
				<div className='search-container'>
					<DatabaseSearch />
				</div>

				{stats.isFetchingData && <Skeleton variant='rectangular' height='170px' width='100%' className='rounded-skeleton' />}
				{!stats.isFetchingData && (
					<div className='database-summary-container'>
						<Grid container spacing={3}>
							<Grid size={{ xs: 6, sm: 6, md: 6, lg: 4, xl: 4 }}>
								<Tile variant='full-width' total={stats.cardTotal} subject='Cards' color='rgb(144, 13, 218)' action={handleBrowseTileClicked} />
							</Grid>

							<Grid size={{ xs: 6, sm: 6, md: 6, lg: 4, xl: 4 }}>
								<Tile variant='full-width' total={stats.banListTotal} subject='Ban Lists' color='#FE6D6B' action={handleBanListTileClicked} />
							</Grid>

							<Grid size={{ xs: 6, sm: 6, md: 6, lg: 4, xl: 4 }}>
								<Tile variant='full-width' total={stats.productTotal} subject='Products' color='rgb(195, 47, 150)' action={handleProductsTileClicked} />
							</Grid>
						</Grid>
					</div>
				)}
			</div>
		</Section>
	)
}

export default DatabaseInfo
