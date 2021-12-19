import { FC, lazy } from 'react'

import { Grid } from '@mui/material'
import Glance from './Glance'
import Section from '../Section'
const DatabaseSearch = lazy(() => import('../search/DatabaseSearch'))

type DatabaseInfoType = {
	cardTotal: number
	banListTotal: number
	productTotal: number
}

const DatabaseInfo: FC<DatabaseInfoType> = ({ cardTotal, banListTotal, productTotal }) => {
	return (
		<div style={{ margin: 'auto', maxWidth: '800px' }}>
			<Section
				sectionName='Content'
				sectionContent={
					<div className='section-content'>
						<DatabaseSearch />

						<div style={{ margin: 'auto', maxWidth: '600px' }}>
							<Grid container spacing={5}>
								<Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
									<Glance total={cardTotal} subject='Cards' color='#6C537A' action={() => window.location.assign(`/browse/card`)} />
								</Grid>

								<Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
									<Glance total={banListTotal} subject='Ban Lists' color='#FE6D6B' action={() => window.location.assign(`/ban_list`)} />
								</Grid>

								<Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
									<Glance total={productTotal} subject='Products' color='#A3508A' action={() => window.location.assign(`/browse/product`)} />
								</Grid>
							</Grid>
						</div>
					</div>
				}
			/>
		</div>
	)
}

export default DatabaseInfo
