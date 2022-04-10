import { FC, lazy } from 'react'

import { Grid } from '@mui/material'
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
				<div className='section-content section-rounded-end'>
					<div className='search-container'>
						<DatabaseSearch />

						<div>
							<Grid container spacing={3}>
								<Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
									<Glance total={cardTotal} subject='Cards' color='rgb(144, 13, 218)' action={() => window.location.assign(`/browse/card`)} />
								</Grid>

								<Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
									<Glance total={banListTotal} subject='Ban Lists' color='#FE6D6B' action={() => window.location.assign(`/ban_list`)} />
								</Grid>

								<Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
									<Glance total={productTotal} subject='Products' color='rgb(195, 47, 150)' action={() => window.location.assign(`/browse/product`)} />
								</Grid>
							</Grid>
						</div>
					</div>
				</div>
			}
		/>
	)
}

export default DatabaseInfo
