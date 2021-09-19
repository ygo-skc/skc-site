import React, { lazy } from 'react'

import { Paper, Typography, Grid } from '@material-ui/core'
import Glance from './Glance'
import styled from 'styled-components'
const DatabaseSearch = lazy(() => import('../DatabaseSearch'))

const DatabaseInfoPaper = styled(Paper)`
	&& {
		background: #fffef8;
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
			<div style={{background: '#26a190', color: 'white', borderTopLeftRadius: '1.75rem', borderTopRightRadius: '1.75rem'}}>
				<Typography variant='h2' style={{color: 'white', paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '1.5rem', paddingBottom: '1.5rem'}} >
					Content
				</Typography>
			</div>

			<div style={{marginTop: '2rem', marginBottom: '2rem', paddingLeft: '1rem', paddingRight: '1rem'}}>
				<DatabaseSearch history={history} />
			</div>

			<Grid container spacing={2} style={{maxWidth: '95%', margin: 'auto', marginTop: '2rem', marginBottom: '2rem', paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '1.5rem', paddingBottom: '1.5rem'}} >
				<Grid
					item
					xs={6}
					sm={6}
					md={4}
					lg={4}
					xl={4} >
					<Glance total={cardTotal} subject='Cards' color='rgb(13, 50, 77)' action={() => window.location.assign(`/browse/card`)} />
				</Grid>

				<Grid
					item
					xs={6}
					sm={6}
					md={4}
					lg={4}
					xl={4} >
					<Glance total={banListTotal} subject='Ban Lists' color='rgb(254, 95, 117)' action={() => window.location.assign(`/ban_list`)}  />
				</Grid>

				<Grid
					item
					xs={6}
					sm={6}
					md={4}
					lg={4}
					xl={4} >
					<Glance total={productTotal} subject='Products' color='rgb(95, 10, 135)' action={() => window.location.assign(`/browse/product`)}  />
				</Grid>
			</Grid>
		</DatabaseInfoPaper>
	)
}