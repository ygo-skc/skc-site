import React from 'react'
import styled from 'styled-components'

import CardDetail from '../card/CardDetail'


const CenteredContent = styled.div`
	-webkit-align-items: center;
	-webkit-box-align: center;
	justify-content: center;
	display: flex;
	margin-top: 30px;
`

const ErrCard = styled(CardDetail)`
	min-width: 550px;
	max-width: 550px;

	@media screen and (min-width: 0px)
	{
		margin: 8px;
	}
	@media screen and (min-width: 400px)
	{
		margin: 16px;
	}
	@media screen and (min-width: 600px)
	{
		margin: 16px;
	}
	@media screen and (min-width: 800px)
	{
		margin: 30px;
	}
	@media screen and (min-width: 1000px)
	{
		margin: 60px;
	}
`

const HTTP_ERR_maps_ERR_NAME = {
	400: 'Bad Request',
	404: '404 Not Found',
	500: '500 - Internal Server Error',
}

const HTTP_ERR_maps_ERR_TYPE = {
	400: 'Client Error',
	404: 'Client Error',
	500: 'Server Err',
}

const HTTP_ERR_maps_ERR_DESCRIPTION = {
	400: 'The requested resource does not conform to the expected format.',
	404: `Requested webpage - ${window.location.href} - does not exist.
	\nUse the navigation to get back to an existing page.`,
	500: 'There was an error connecting to the server. Please come back at a different time.',
}


export default function HttpErr(props)
{
	console.log(props)
	return(
		<div>
			<CenteredContent>
				<ErrCard
					cardColor='err'
					cardName={HTTP_ERR_maps_ERR_NAME[props.httpErr]}
					monsterType={HTTP_ERR_maps_ERR_TYPE[props.httpErr]}
					cardEffect={HTTP_ERR_maps_ERR_DESCRIPTION[props.httpErr]}
					cardID={`00000${props.httpErr}`}
					fullDetails={true} />
			</CenteredContent>
		</div>
	)
}