import { useState, useEffect, lazy, Suspense, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Skeleton } from '@mui/material'

import Fetch from '../../../helper/FetchHandler'
import DownstreamServices from '../../../helper/DownstreamServices'
import OneThirdTwoThirdsGrid from '../../util/grid/OneThirdTwoThirdsGrid'

const Breadcrumb = lazy(() => import('../../header-footer/Breadcrumb'))
const CardData = lazy(() => import('./CardData'))

class _Card {
	static cardId: string | null = null
	static cardImg: HTMLImageElement
	static readonly crumbs = ['Home', 'Card Browse']

	static readonly loadRelatedContent = (isLoading: boolean, cardName: string, cardColor: cardColor, productInfo: any, banListInfo: any) => {
		if (!isLoading) {
			const CardInformationRelatedContent = lazy(() => import('./CardInformationRelatedContent'))
			return (
				<CardInformationRelatedContent
					cardName={cardName}
					cardColor={cardColor?.replace(/Pendulum-/gi, '') as cardColor}
					isLoading={isLoading}
					cardID={_Card.cardId!}
					productInfo={productInfo}
					banListInfo={banListInfo}
				/>
			)
		}
	}
}

function cardDataReducer(state: any, action: any) {
	return {
		...state,
		cardName: action.cardName,
		cardColor: action.cardColor,
		cardEffect: action.cardEffect,
		cardAttribute: action.cardAttribute,
		monsterType: action.monsterType,
		monsterAtk: action.monsterAtk,
		monsterDef: action.monsterDef,
		monsterAssociation: action.monsterAssociation,
		productInfo: action.productInfo,
		banListInfo: action.banListInfo,
	}
}

const CardInformation = () => {
	const { cardId } = useParams()

	if (_Card.cardId === null) {
		_Card.cardId = cardId as string

		const cardImage = new Image()
		cardImage.src = `https://images.thesupremekingscastle.com/cards/lg/${_Card.cardId}.jpg`
		_Card.cardImg = cardImage
	}

	const [isLoading, setIsLoading] = useState(true)

	const [{ cardName, cardColor, cardEffect, cardAttribute, monsterType, monsterAtk, monsterDef, monsterAssociation, productInfo, banListInfo }, cardDispatch] = useReducer(
		cardDataReducer,
		{
			cardName: '',
			cardColor: '',
			cardEffect: '',
			cardAttribute: '',
			monsterType: '',
			monsterAtk: '',
			monsterDef: '',
			monsterAssociation: undefined,
			productInfo: [],
			banListInfo: [],
		}
	)

	const [dynamicCrumbs, setDynamicCrumbs] = useState([..._Card.crumbs, ''])

	useEffect(() => {
		Fetch.handleFetch(`${DownstreamServices.NAME_maps_ENDPOINT['cardInstanceUrl']}${_Card.cardId}?allInfo=true`, (json) => {
			setDynamicCrumbs([..._Card.crumbs, json.cardID])

			cardDispatch({
				cardName: json.cardName,
				cardColor: json.cardColor,
				cardEffect: json.cardEffect,
				cardAttribute: json.cardAttribute,
				monsterType: json.monsterType,
				monsterAtk: json.monsterAttack,
				monsterDef: json.monsterDefense,
				monsterAssociation: json.monsterAssociation,
				productInfo: json.foundIn === undefined ? [] : json.foundIn,
				banListInfo: json.restrictedIn === undefined ? [] : json.restrictedIn,
			})
			setIsLoading(false)
		})
	}, [])

	return (
		<div className='generic-container'>
			<Helmet>
				<title>SKC - Card: {_Card.cardId}</title>
				<meta
					name={`SKC - Card: ${_Card.cardId}`}
					content={`Information for YuGiOh card ${cardName} such as ban lists it was in, products it can be found in, effect/stats, etc.`}
				/>
				<meta name='keywords' content={`YuGiOh, The Supreme Kings Castle, card, ${cardName}, ${_Card.cardId}, ${cardColor}`} />
			</Helmet>

			<Breadcrumb crumbs={dynamicCrumbs} />

			<OneThirdTwoThirdsGrid
				mirrored={false}
				oneThirdComponent={
					<CardData
						cardName={cardName}
						cardColor={cardColor}
						cardEffect={cardEffect}
						cardAttribute={cardAttribute}
						monsterType={monsterType}
						monsterAttack={monsterAtk}
						monsterDefense={monsterDef}
						monsterAssociation={monsterAssociation}
						cardID={_Card.cardId}
						isLoading={isLoading}
						cardImg={_Card.cardImg}
					/>
				}
				twoThirdComponent={
					<Suspense fallback={<Skeleton width='100%' height='20rem' />}>{_Card.loadRelatedContent(isLoading, cardName, cardColor, productInfo, banListInfo)}</Suspense>
				}
			/>
		</div>
	)
}

export default CardInformation
