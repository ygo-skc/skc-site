import React from 'react'
import styled from 'styled-components'

import CardDetail from '../card/CardDetail'



export default function GenericErr(props)
{
	const CenteredContent = styled.div`
		-webkit-align-items: center;
		-webkit-box-align: center;
		justify-content: center;
		display: flex;
		margin-top: 30px;
	`
	return(
		<div>
			<CenteredContent>
				<CardDetail style={{ 'max-width': '550px', 'min-width': '550px' }}
					cardColor='err' cardName={props.errName} monsterType={props.errType}
					cardEffect={props.errDescription} cardID={props.errID} fullDetails={true} />
			</CenteredContent>
		</div>
	)
}