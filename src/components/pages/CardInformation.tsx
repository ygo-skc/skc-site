import { useState, useEffect, lazy, Suspense, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Skeleton } from '@mui/material'

import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'
import OneThirdTwoThirdsGrid from '../util/grid/OneThirdTwoThirdsGrid'
import Breadcrumb from '../header-footer/Breadcrumb'

const CardData = lazy(() => import('../card/card-information/CardData'))
const CardSuggestions = lazy(() => import('../card/suggestion/CardSuggestions'))
const CardInformationRelatedContent = lazy(() => import('../card/card-information/CardInformationRelatedContent'))

class Card {
	static cardId: string | null = null
	static cardImg: HTMLImageElement
	static readonly crumbs = ['Home', 'Card Browse']
}

const CardInformation = () => {
	const { cardId } = useParams()

	if (Card.cardId === null) {
		Card.cardId = cardId as string

		const cardImage = new Image()
		cardImage.src = `https://images.thesupremekingscastle.com/cards/md/${Card.cardId}.jpg`
		Card.cardImg = cardImage
	}

	const [isLoading, setIsLoading] = useState(true)

	const [{ cardName, cardColor, cardEffect, cardAttribute, monsterType, monsterAtk, monsterDef, monsterAssociation, productInfo, restrictionInfo }, cardDispatch] = useReducer(
		(state: any, action: any) => {
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
				restrictionInfo: action.restrictionInfo,
			}
		},
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
			restrictionInfo: [],
		}
	)

	const [dynamicCrumbs, setDynamicCrumbs] = useState([...Card.crumbs, ''])

	useEffect(() => {
		FetchHandler.handleFetch(`${DownstreamServices.NAME_maps_ENDPOINT['cardInstanceUrl']}${Card.cardId}?allInfo=true`, (cardInfo: SKCCardInfo) => {
			setDynamicCrumbs([...Card.crumbs, cardInfo.cardID])

			cardDispatch({
				cardName: cardInfo.cardName,
				cardColor: cardInfo.cardColor,
				cardEffect: cardInfo.cardEffect,
				cardAttribute: cardInfo.cardAttribute,
				monsterType: cardInfo.monsterType,
				monsterAtk: cardInfo.monsterAttack,
				monsterDef: cardInfo.monsterDefense,
				monsterAssociation: cardInfo.monsterAssociation,
				productInfo: cardInfo.foundIn ?? [],
				restrictionInfo: cardInfo.restrictedIn ?? [],
			})
			setIsLoading(false)
		})
	}, [])

	return (
		<div className='generic-container'>
			<Helmet>
				<title>SKC - Card: {Card.cardId}</title>
				<meta
					name={`SKC - Card: ${Card.cardId}`}
					content={`Information for YuGiOh card ${cardName} such as ban lists it was in, products it can be found in, effect/stats, etc.`}
				/>
				<meta name='keywords' content={`YuGiOh, The Supreme Kings Castle, card, ${cardName}, ${Card.cardId}, ${cardColor}`} />

				<meta property='og:title' content={`${cardName} - ${Card.cardId}`} />
				<meta property='og:image' content={`https://images.thesupremekingscastle.com/cards/sm/${Card.cardId}.jpg`} />
				<meta property='og:type' content='website' />
				<meta property='og:description' content={`Details For Yugioh Card - ${cardName}`} />
			</Helmet>

			<Breadcrumb crumbs={dynamicCrumbs} />

			<OneThirdTwoThirdsGrid
				mirrored={false}
				oneThirdComponent={
					<Suspense fallback={<Skeleton width='100%' height='10rem' />}>
						<CardData
							cardName={cardName}
							cardColor={cardColor}
							cardEffect={cardEffect}
							cardAttribute={cardAttribute}
							monsterType={monsterType}
							monsterAttack={monsterAtk}
							monsterDefense={monsterDef}
							monsterAssociation={monsterAssociation}
							cardID={Card.cardId}
							isLoading={isLoading}
							cardImg={Card.cardImg}
						/>
					</Suspense>
				}
				twoThirdComponent={
					<Suspense fallback={<Skeleton width='100%' height='10rem' />}>
						<CardSuggestions cardID={Card.cardId} cardColor={cardColor} cardName={cardName} />
						{!isLoading && (
							<CardInformationRelatedContent
								cardName={cardName}
								cardColor={cardColor?.replace(/Pendulum-/gi, '') as cardColor}
								isLoading={isLoading}
								cardID={Card.cardId}
								productInfo={productInfo}
								restrictedIn={restrictionInfo}
							/>
						)}
					</Suspense>
				}
			/>
		</div>
	)
}

export default CardInformation
