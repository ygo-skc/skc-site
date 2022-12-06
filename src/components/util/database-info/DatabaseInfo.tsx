import { lazy, startTransition, useEffect, useState } from 'react'

import Grid2 from '@mui/material/Unstable_Grid2'
import Glance from './Glance'
import Section from '../Section'

import '../../../css/suggestion-box/database-search-styles.css'
import DownstreamServices from '../../../helper/DownstreamServices'
import FetchHandler from '../../../helper/FetchHandler'
import { Skeleton } from '@mui/material'

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

	return (
		<Section
			maxWidth='1000px'
			sectionName='Content'
			sectionContent={
				<div className='section-content'>
					<div className='search-container'>
						<DatabaseSearch />
					</div>

					{isFetchingData && <Skeleton variant='rectangular' height='170' width='100%' className='rounded-skeleton' />}
					{!isFetchingData && (
						<div className='database-summary-container'>
							<Grid2 container spacing={3}>
								<Grid2 xs={6} sm={6} md={4} lg={4} xl={4}>
									<Glance total={cardTotal} subject='Cards' color='rgb(144, 13, 218)' action={() => window.location.assign(`/browse/card`)} />
								</Grid2>

								<Grid2 xs={6} sm={6} md={4} lg={4} xl={4}>
									<Glance total={banListTotal} subject='Ban Lists' color='#FE6D6B' action={() => window.location.assign(`/ban_list`)} />
								</Grid2>

								<Grid2 xs={6} sm={6} md={4} lg={4} xl={4}>
									<Glance total={productTotal} subject='Products' color='rgb(195, 47, 150)' action={() => window.location.assign(`/browse/product`)} />
								</Grid2>
							</Grid2>
						</div>
					)}
				</div>
			}
		/>
	)
}

export default DatabaseInfo
