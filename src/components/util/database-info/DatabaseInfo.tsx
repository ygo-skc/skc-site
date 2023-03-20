import { lazy, startTransition, useCallback, useEffect, useState } from 'react'

import Grid2 from '@mui/material/Unstable_Grid2'

import '../../../css/util/database-info/database-search-styles.css'
import DownstreamServices from '../../../helper/DownstreamServices'
import FetchHandler from '../../../helper/FetchHandler'
import { Skeleton } from '@mui/material'
import { Glance, Section } from 'skc-rcl'

const DatabaseSearch = lazy(() => import('../search/DBSearch'))

const DatabaseInfo = () => {
	const [cardTotal, setCardTotal] = useState(0)
	const [banListTotal, setBanListTotal] = useState(0)
	const [productTotal, setProductTotal] = useState(0)
	const [isFetchingData, setIsFetchingData] = useState(true)

	useEffect(() => {
		FetchHandler.handleFetch(DownstreamServices.NAME_maps_ENDPOINT['databaseStats'], (json) => {
			startTransition(() => {
				setCardTotal(json.cardTotal)
				setBanListTotal(json.banListTotal)
				setProductTotal(json.productTotal)
				setIsFetchingData(false)
			})
		})
	}, [])

	const handleBrowseGlanceClicked = useCallback(() => window.location.assign('/browse/card'), [])
	const handleBanListGlanceClicked = useCallback(() => window.location.assign('/ban_list'), [])
	const handleProductsGlanceClicked = useCallback(() => window.location.assign('/browse/product'), [])

	return (
		<Section sectionName='Content' maxWidth='1000px'>
			<div className='section-content'>
				<div className='search-container'>
					<DatabaseSearch />
				</div>

				{isFetchingData && <Skeleton variant='rectangular' height='170' width='100%' className='rounded-skeleton' />}
				{!isFetchingData && (
					<div className='database-summary-container'>
						<Grid2 container spacing={3}>
							<Grid2 xs={6} sm={6} md={4} lg={4} xl={4}>
								<Glance variant='medium' total={cardTotal} subject='Cards' color='rgb(144, 13, 218)' action={handleBrowseGlanceClicked} />
							</Grid2>

							<Grid2 xs={6} sm={6} md={4} lg={4} xl={4}>
								<Glance variant='medium' total={banListTotal} subject='Ban Lists' color='#FE6D6B' action={handleBanListGlanceClicked} />
							</Grid2>

							<Grid2 xs={6} sm={6} md={4} lg={4} xl={4}>
								<Glance variant='medium' total={productTotal} subject='Products' color='rgb(195, 47, 150)' action={handleProductsGlanceClicked} />
							</Grid2>
						</Grid2>
					</div>
				)}
			</div>
		</Section>
	)
}

export default DatabaseInfo
