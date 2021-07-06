import React from 'react'

import Glance from './Glance'


export default function DatabaseInfo({ cardTotal, banListTotal, productTotal })
{
	return(
		<div style={{display: 'grid', gridAutoFlow: 'column', gridGap: '1rem', maxWidth: '80%', margin: 'auto', marginTop: '2rem'}} >
			<Glance total={cardTotal} subject='Cards' />
			<Glance total={banListTotal} subject='Ban Lists' />
			<Glance total={productTotal} subject='Products' />
		</div>
	)
}