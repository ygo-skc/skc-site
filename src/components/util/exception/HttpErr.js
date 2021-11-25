import React from 'react'
import Styled from 'styled-components'

import { MainContentContainer } from '../../MainContent'
import Breadcrumbs from '../../util/Breadcrumb'
import YGOCard from '../../card/YGOCard'

const ErrCard = Styled(YGOCard)`
	&&
	{
		width: 420px;
		max-width: 85%;
		margin: auto;
	}
`

const HTTP_ERR_maps_ERR_NAME = {
	400: '400 - Bad Request',
	404: '404 - Not Found',
	500: '500 - Internal Server Error',
	503: '503 - API is offline or Busy',
}

const HTTP_ERR_maps_ERR_TYPE = {
	400: 'Client Error',
	404: 'Client Error',
	500: 'Server Err',
	503: 'Server Err',
}

const HTTP_ERR_maps_ERR_DESCRIPTION = {
	400: 'The requested resource does not conform to the expected format.',
	404: `Requested webpage "${ window.location.href }" does not exist.
	\nUse the navigation to get back to an existing page.`,
	500: 'There was an error connecting to the server. Please come back at a different time.',
	503: 'There is an issue connecting to skc-api. Most of the websites functionality is impacted. Please try again later.',
}


export default function HttpErr( {httpErr} )
{
	return(
		<MainContentContainer >
			<Breadcrumbs crumbs={ [ 'Home', httpErr ] } />
				<ErrCard
					style={{width: '400px'}}
					cardColor='Err'
					cardName={ HTTP_ERR_maps_ERR_NAME[httpErr] }
					monsterType={ HTTP_ERR_maps_ERR_TYPE[httpErr] }
					cardEffect={ HTTP_ERR_maps_ERR_DESCRIPTION[httpErr] }
					cardID={`00000${httpErr}`}
					fullDetails={true} />
		</MainContentContainer>
	)
}