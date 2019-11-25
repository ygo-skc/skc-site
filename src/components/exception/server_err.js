import React from 'react'

import BreadCrumb from '../Breadcrumb'
import GenericErr from './GenericErr'


function ServerError()
{
	return(
		<div>
			<BreadCrumb crumbs={['Home', '500 - Err']}/>
			<GenericErr errName='500 Internal Server Error' errType='Server Err' errDescription={`There was an error connecting to the server. Please come back at a different time.`} errID='00000500' />
		</div>
	)
}

export default ServerError