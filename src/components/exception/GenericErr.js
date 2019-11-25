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


export default function GenericErr(props)
{
	return(
		<div>
			<CenteredContent>
				<ErrCard
					cardColor='err' cardName={props.errName}
					monsterType={props.errType}
					cardEffect={props.errDescription} cardID={props.errID} fullDetails={true} />
			</CenteredContent>
		</div>
	)
}