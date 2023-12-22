import '../../../css/util/database-search-styles.css'

import { lazy, startTransition, useCallback, useEffect, useState } from 'react'

import Grid2 from '@mui/material/Unstable_Grid2'

import DownstreamServices from '../../../helper/DownstreamServices'
import FetchHandler from '../../../helper/FetchHandler'
import { Skeleton } from '@mui/material'
import { Tile, Section } from 'skc-rcl'

const DatabaseSearch = lazy(() => import('../search/DBSearch'))

type DatabaseInfoProps = {
	cardTotal: number
	banListTotal: number
	productTotal: number
}

const DatabaseInfo = () => {
	const [cardTotal, setCardTotal] = useState(0)
	const [banListTotal, setBanListTotal] = useState(0)
	const [productTotal, setProductTotal] = useState(0)
	const [isFetchingData, setIsFetchingData] = useState(true)

	useEffect(() => {
		FetchHandler.handleFetch<DatabaseInfoProps>(DownstreamServices.NAME_maps_ENDPOINT['databaseStats'], (json) => {
			startTransition(() => {
				setCardTotal(json.cardTotal)
				setBanListTotal(json.banListTotal)
				setProductTotal(json.productTotal)
				setIsFetchingData(false)
			})
		})
	}, [])

	const handleBrowseTileClicked = useCallback(() => window.location.assign('/browse/card'), [])
	const handleBanListTileClicked = useCallback(() => window.location.assign('/ban_list'), [])
	const handleProductsTileClicked = useCallback(() => window.location.assign('/browse/product'), [])

	return (
		<Section sectionName='Content'>
			<div className='section-content'>
				<div className='search-container'>
					<DatabaseSearch />
				</div>

				{isFetchingData && <Skeleton variant='rectangular' height='170px' width='100%' className='rounded-skeleton' />}
				{!isFetchingData && (
					<div className='database-summary-container'>
						<Grid2 container spacing={3}>
							<Grid2 xs={6} sm={6} md={4} lg={4} xl={4}>
								<Tile variant='medium' total={cardTotal} subject='Cards' color='rgb(144, 13, 218)' action={handleBrowseTileClicked} />
							</Grid2>

							<Grid2 xs={6} sm={6} md={4} lg={4} xl={4}>
								<Tile variant='medium' total={banListTotal} subject='Ban Lists' color='#FE6D6B' action={handleBanListTileClicked} />
							</Grid2>

							<Grid2 xs={6} sm={6} md={4} lg={4} xl={4}>
								<Tile variant='medium' total={productTotal} subject='Products' color='rgb(195, 47, 150)' action={handleProductsTileClicked} />
							</Grid2>
						</Grid2>
					</div>
				)}
			</div>
		</Section>
	)
}

export default DatabaseInfo
