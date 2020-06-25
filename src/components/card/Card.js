import React, { useState, useEffect } from 'react'
import { Chip, Typography } from '@material-ui/core'
import Styled from 'styled-components'

import Breadcrumb from '../Breadcrumb'
import CardDetail from './CardDetail'
import cardStyles from './CardDetailStyle'
import { handleFetch } from '../../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../../helper/YgoApiEndpoints'
import { MainContentContainer } from '../MainContent'


export const Card = ( { match, history } ) =>
{
	const cardId = match.params.cardId

	const [cardName, setCardName] = useState(undefined)
	const [cardColor, setCardColor] = useState(undefined)
	const [cardEffect, setCardEffect] = useState(undefined)
	const [monsterType, setMonsterType] = useState(undefined)
	const [monsterAtk, setMonsterAtk] = useState(undefined)
	const [monsterDef, setMonsterDef] = useState(undefined)

	useEffect( () => {
		handleFetch(`${NAME_maps_ENDPOINT['cardInstanceUrl']}${cardId}`, history, (json) => {
			setCardName(json.cardName)
			setCardColor(json.cardColor)
			setCardEffect(json.cardEffect)
			setMonsterType(json.monsterType)
			setMonsterAtk(json.monsterAttack)
			setMonsterDef(json.monsterDefense)
		})
	}, [])

	return (
		<MainContentContainer>
			<Breadcrumb crumbs={['Home']} />

			<div
				style={{ width: '400px', maxWidth: '90%', margin: 'auto' }}>
				<CardDetail
					isNew={ false }
					cardName={cardName}
					cardColor={cardColor}
					cardEffect={cardEffect}
					monsterType={monsterType}
					monsterAtk={monsterAtk}
					monsterDef={monsterDef}
					cardClicked={ false }
					cardStyles={ cardStyles }
					cardID={cardId}
					fullDetails={ true }
				/>
			</div>


			<div style={{ marginTop: '3.5rem' }} >
				<Typography variant='subtitle1' >Packs:</Typography>
				<br />
				<Chip label="Shadows in Valhalla | SHVA" />
			</div>

			<div style={{ marginTop: '1.5rem' }} >
				<Typography variant='subtitle1' >Banned In:</Typography>
				<br />
				<Chip label="June 15, 2020" />
			</div>

			<div style={{ marginTop: '1.5rem' }} >
				<Typography variant='subtitle1' >Depends On:</Typography>
				<br />
				<Chip label="Chaos Form" />
			</div>

			<div style={{ marginTop: '1.5rem' }} >
				<Typography variant='subtitle1' >Support:</Typography>
				<br />
				<Chip label="Blue-Eyes" />
				<Chip label="Ritual" />
				<Chip label="Dragon" />
			</div>
		</MainContentContainer>
	)
}