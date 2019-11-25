import React from 'react'

import BreadCrumb from '../Breadcrumb.js'
import GenericErr from './GenericErr'


function NotFound()
{
	return (
		<div>
			<BreadCrumb crumbs={['Home', '404 - Err']}/>
			<GenericErr errName='404 Not Found' errType='Client Error' errDescription={`Requested webpage - ${window.location.href} - does not exist.
			\nUse the navigation to get back to an existing page.`} errID='00000400' />
		</div>
	)
}

export default NotFound