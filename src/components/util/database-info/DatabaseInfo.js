import React from 'react'

import Glance from './Glance'


export default function DatabaseInfo({ cardTotal, banListTotal, productTotal })
{
	return(
		<div style={{display: 'flex', gridGap: '1rem', maxWidth: '90%', margin: 'auto', marginTop: '2rem', marginBottom: '2rem'}} >
			<Glance total={cardTotal} subject='Cards' />
			<Glance total={banListTotal} subject='Ban Lists' />
			<Glance total={productTotal} subject='Products' />
		</div>
	)
}