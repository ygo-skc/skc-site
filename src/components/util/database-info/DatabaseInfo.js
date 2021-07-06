import React from 'react'

import Glance from './Glance'


export default function DatabaseInfo({ cardTotal, banListTotal, productTotal })
{
	return(
		<div style={{display: 'flex', gridGap: '2rem', maxWidth: '90%', margin: 'auto', marginTop: '2rem', marginBottom: '2rem'}} >
			<Glance total={cardTotal} subject='Cards' color='rgb(13, 50, 77)' action={() => window.location.assign(`/browse/card`)} />
			<Glance total={banListTotal} subject='Ban Lists' color='rgb(254, 95, 117)' action={() => window.location.assign(`/ban_list`)}  />
			<Glance total={productTotal} subject='Products' color='rgb(95, 10, 135)' action={() => window.location.assign(`/browse/product`)}  />
		</div>
	)
}