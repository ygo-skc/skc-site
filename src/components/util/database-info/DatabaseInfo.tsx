import { FC, lazy } from 'react'

import Grid2 from '@mui/material/Unstable_Grid2'
import Glance from './Glance'
import Section from '../Section'

import '../../../css/suggestion-box/database-search-styles.css'

const DatabaseSearch = lazy(() => import('../search/DBSearch'))

type DatabaseInfoType = {
	cardTotal: number
	banListTotal: number
	productTotal: number
}

const DatabaseInfo: FC<DatabaseInfoType> = ({ cardTotal, banListTotal, productTotal }) => {
	return (
		<Section
			maxWidth='1000px'
			sectionName='Content'
			sectionContent={
				<div className='section-content'>
					<div className='search-container'>
						<DatabaseSearch />
					</div>
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
				</div>
			}
		/>
	)
}

export default DatabaseInfo
