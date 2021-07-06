import React from 'react'

import { Paper, Typography } from '@material-ui/core'
import Glance from './Glance'


export default function DatabaseInfo({ cardTotal, banListTotal, productTotal })
{
	return(
		<Paper style={{background: '#fffde7', paddingTop: '1.5rem', paddingBottom: '1.5rem', marginTop: '2.25rem', marginBottom: '4rem', borderRadius: '1.75rem', paddingLeft: '1rem', paddingRight: '1rem'}} >
			<Typography variant='h2' style={{color: '#196A5F'}} >
				Contents
			</Typography>

			<div style={{display: 'flex', gridGap: '2rem', maxWidth: '95%', margin: 'auto', marginTop: '2rem', marginBottom: '2rem'}} >
				<Glance total={cardTotal} subject='Cards' color='rgb(13, 50, 77)' action={() => window.location.assign(`/browse/card`)} />
				<Glance total={banListTotal} subject='Ban Lists' color='rgb(254, 95, 117)' action={() => window.location.assign(`/ban_list`)}  />
				<Glance total={productTotal} subject='Products' color='rgb(95, 10, 135)' action={() => window.location.assign(`/browse/product`)}  />
			</div>
		</Paper>
	)
}