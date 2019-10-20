import React from 'react'
import styled from 'styled-components'

import CardDetail from '../card/CardDetail'
import BreadCrumb from '../Breadcrumb.js'

function NotFound(props)
{
	const CenteredContent = styled.div`
		height: 100%;
		-webkit-align-items: center;
		-webkit-box-align: center;
		justify-content: center
		display: flex
	`
	return(
		<div>
			<BreadCrumb crumbs={['Home', '404 - Err']}/>
			<CenteredContent>
				<CardDetail style={{ 'max-width': '550px', 'min-width': '550px' }} cardColor='err' cardName='404 Not Found' monsterType='Client Error' cardEffect={`Requested webpage - ${window.location.href} - does not exist. \n\nUse the navigation to get back to an existing page.`} cardID='00000400' />
			</CenteredContent>
		</div>
	)
}

export default NotFound