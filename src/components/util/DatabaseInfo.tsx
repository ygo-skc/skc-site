import '../../css/util/database-search-styles.css'

import { FC, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import Grid from '@mui/material/Grid'

import { Skeleton } from '@mui/material'
import { Tile, Section } from 'skc-rcl'

import AppRoutes from '../../helper/AppRoutes'
import SearchField from './search/SearchField'

const DatabaseInfo: FC<{ stats: SKC.DBStats & { isFetchingData: boolean } }> = ({ stats }) => {
	const navigate = useNavigate()

	const handleBrowseTileClicked = useCallback(() => navigate(AppRoutes.CardBrowse), [navigate])
	const handleBanListTileClicked = useCallback(() => navigate(AppRoutes.BanList), [navigate])
	const handleProductsTileClicked = useCallback(() => navigate(AppRoutes.ProductBrowse), [navigate])

	return (
		<Section sectionName='Content'>
			<div className='section-content'>
				<div className='search-container'>
					<SearchField />
				</div>

				{stats.isFetchingData && <Skeleton variant='rectangular' height='170px' width='100%' className='rounded-skeleton' />}
				{!stats.isFetchingData && (
					<div className='database-summary-container'>
						<Grid container spacing={3}>
							<Grid size={{ xs: 6, sm: 6, md: 6, lg: 4, xl: 4 }}>
								<Tile variant='full-width' total={stats.cardTotal} subject='Cards' color='var(--accent-text)' action={handleBrowseTileClicked} />
							</Grid>

							<Grid size={{ xs: 6, sm: 6, md: 6, lg: 4, xl: 4 }}>
								<Tile variant='full-width' total={stats.banListTotal} subject='Ban Lists' color='var(--accent-text)' action={handleBanListTileClicked} />
							</Grid>

							<Grid size={{ xs: 6, sm: 6, md: 6, lg: 4, xl: 4 }}>
								<Tile variant='full-width' total={stats.productTotal} subject='Products' color='var(--accent-text)' action={handleProductsTileClicked} />
							</Grid>
						</Grid>
					</div>
				)}
			</div>
		</Section>
	)
}

export default DatabaseInfo
