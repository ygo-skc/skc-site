import { FC } from 'react'
import Styled from 'styled-components'

import Breadcrumbs from '../header-footer/Breadcrumb'
import { YGOCard } from 'skc-rcl'

class HttpErrMaps {
	static readonly HTTP_ERR_maps_ERR_NAME: { [key: string]: string } = {
		400: '400 - Bad Request',
		408: '408 - Request Timeout',
		422: '422 - Unprocessable Entity',
		'404-Client': '404 - Not Found (Client)',
		'404-Server': '404 - Not Found (Server)',
		500: '500 - Internal Server Error',
		503: '503 - API is offline or Busy',
	}

	static readonly HTTP_ERR_maps_ERR_TYPE: { [key: string]: string } = {
		400: 'Client Error',
		408: 'Client Error',
		422: 'Client Error',
		'404-Client': 'Client Error',
		'404-Server': 'Client Error',
		500: 'Server Err',
		503: 'Server Err',
	}

	static readonly HTTP_ERR_maps_ERR_DESCRIPTION: { [key: string]: string } = {
		400: 'The requested resource does not conform to the expected format.',
		408: 'The request was not completed in the allowed time frame. This could be due to higher than expected traffic or bad internet connection. Please try again later.',
		422: 'API could not process the request as it is not formatted the way the API was programmed. Are you trying to manipulate data in the browser?',
		'404-Client': `Requested webpage "${window.location.href}" does not exist.
		\nUse the navigation to get back to an existing page.`,
		'404-Server': `Resource was not found in Database. Did you use the correct identifier?`,
		500: 'There was an error connecting to the server. Please come back at a different time.',
		503: 'There is an issue connecting to skc-api. Most of the websites functionality is impacted. Please try again later.',
	}
}

const ErrCard = Styled(YGOCard)`
	&& {
		width: 400px;
		max-width: 85%;
		margin: auto;
	}
`

const HttpErr: FC<{ httpErr: string }> = ({ httpErr }) => {
	return (
		<div className='generic-container'>
			<Breadcrumbs crumbs={['Home', httpErr]} />
			<ErrCard
				cardColor='err'
				cardName={HttpErrMaps.HTTP_ERR_maps_ERR_NAME[httpErr]}
				monsterType={HttpErrMaps.HTTP_ERR_maps_ERR_TYPE[httpErr]}
				cardEffect={HttpErrMaps.HTTP_ERR_maps_ERR_DESCRIPTION[httpErr]}
				cardID={`00000${httpErr}`}
				fullDetails={true}
			/>
		</div>
	)
}

export default HttpErr
