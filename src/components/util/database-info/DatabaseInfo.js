import React, { lazy } from 'react'

import { Paper, Typography, Grid } from '@mui/material'
import Glance from './Glance'
import styled from 'styled-components'
const DatabaseSearch = lazy(() => import('../DatabaseSearch'))

const DatabaseInfoPaper = styled(Paper)`
	&& {
		margin: auto;
		margin-top: 2.25rem;
		margin-bottom: 2.25rem;
		border-radius: 1.75rem;
		padding-left: 1rem;
		padding-right: 1rem;
		max-width: 800px;
		padding: 0rem;
	}
`


export default function DatabaseInfo({ history, cardTotal, banListTotal, productTotal })
{
	return(
		<DatabaseInfoPaper  >
			<div style={{background: '#5D5A6B', color: 'white', borderTopLeftRadius: '1.75rem', borderTopRightRadius: '1.75rem'}}>
				<Typography variant='h2' style={{color: 'white', paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '1.5rem', paddingBottom: '1.5rem'}} >
					Content
				</Typography>
			</div>

			<div style={{marginTop: '1.5rem', paddingLeft: '1rem', paddingRight: '1rem'}}>
				<DatabaseSearch history={history} />
			</div>

			<Grid container spacing={2} style={{maxWidth: '95%', margin: 'auto', paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '1.5rem', paddingBottom: '1.5rem'}} >
				<Grid
					item
					xs={6}
					sm={6}
					md={4}
					lg={4}
					xl={4} >
					<Glance total={cardTotal} subject='Cards' color='#6C537A' action={() => window.location.assign(`/browse/card`)} />
				</Grid>

				<Grid
					item
					xs={6}
					sm={6}
					md={4}
					lg={4}
					xl={4} >
					<Glance total={banListTotal} subject='Ban Lists' color='#FE6D6B' action={() => window.location.assign(`/ban_list`)}  />
				</Grid>

				<Grid
					item
					xs={6}
					sm={6}
					md={4}
					lg={4}
					xl={4} >
					<Glance total={productTotal} subject='Products' color='#A3508A' action={() => window.location.assign(`/browse/product`)}  />
				</Grid>
			</Grid>
		</DatabaseInfoPaper>
	)
}