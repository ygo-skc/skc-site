import { useState, useEffect, lazy, Suspense, useReducer, Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Skeleton } from '@mui/material'

import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'
import OneThirdTwoThirdsGrid from '../util/grid/OneThirdTwoThirdsGrid'

const Breadcrumb = lazy(() => import('../header-footer/Breadcrumb'))
const CardData = lazy(() => import('../card/card-information/CardData'))
const CardSuggestions = lazy(() => import('../card/suggestion/CardSuggestions'))
const CardInformationRelatedContent = lazy(() => import('../card/card-information/CardInformationRelatedContent'))

type CardInformationState = {
	cardName: string
	cardColor: cardColor
	cardAttribute?: string
	monsterType?: string
	monsterAssociation?: SKCMonsterAssociation
	monsterAtk?: string
	monsterDef?: string
	cardEffect: string
	productInfo: ProductInfo[]
	restrictionInfo: RestrictedIn
}

enum CardInformationType {
	UPDATE_CARD = 'UPDATE CARD',
	UPDATE_PRODUCTS = 'UPDATE PRODUCTS',
	UPDATE_RESTRICTIONS = 'UPDATE RESTRICTIONS',
}

type CardInformationAction =
	| {
			type: CardInformationType.UPDATE_CARD
			cardName: string
			cardEffect: string
			cardColor: cardColor
			cardAttribute?: string
			monsterType?: string
			monsterAssociation?: SKCMonsterAssociation
			monsterAtk?: string
			monsterDef?: string
	  }
	| { type: CardInformationType.UPDATE_PRODUCTS; productInfo: ProductInfo[] }
	| { type: CardInformationType.UPDATE_RESTRICTIONS; restrictionInfo: RestrictedIn }

function cardInformationReducer(state: CardInformationState, action: CardInformationAction): CardInformationState {
	switch (action.type) {
		case CardInformationType.UPDATE_CARD:
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
			}
		case CardInformationType.UPDATE_PRODUCTS:
			return {
				...state,
				productInfo: action.productInfo,
			}
		case CardInformationType.UPDATE_RESTRICTIONS:
			return {
				...state,
				restrictionInfo: action.restrictionInfo,
			}
	}
}

const CardInformation = () => {
	let { cardId } = useParams()
	cardId = cardId as string
	const crumbs = ['Home', 'Card Browse']

	const [isLoading, setIsLoading] = useState(true)

	const [{ cardName, cardColor, cardEffect, cardAttribute, monsterType, monsterAtk, monsterDef, monsterAssociation, productInfo, restrictionInfo }, cardDispatch] = useReducer(
		cardInformationReducer,
		{
			cardName: '',
			cardColor: undefined,
			cardEffect: '',
			cardAttribute: '',
			monsterType: '',
			monsterAtk: '',
			monsterDef: '',
			monsterAssociation: undefined,
			productInfo: [],
			restrictionInfo: { TCG: [], MD: [], DL: [] },
		}
	)

	const [dynamicCrumbs, setDynamicCrumbs] = useState([...crumbs, ''])

	useEffect(() => {
		FetchHandler.handleFetch(`${DownstreamServices.NAME_maps_ENDPOINT['cardInstanceUrl']}${cardId}?allInfo=true`, (cardInfo: SKCCardInfo) => {
			setDynamicCrumbs([...crumbs, cardInfo.cardID])

			cardDispatch({
				type: CardInformationType.UPDATE_CARD,
				cardName: cardInfo.cardName,
				cardColor: cardInfo.cardColor,
				cardEffect: cardInfo.cardEffect,
				cardAttribute: cardInfo.cardAttribute,
				monsterType: cardInfo.monsterType,
				monsterAtk: cardInfo.monsterAttack,
				monsterDef: cardInfo.monsterDefense,
				monsterAssociation: cardInfo.monsterAssociation,
			})

			cardDispatch({
				type: CardInformationType.UPDATE_PRODUCTS,
				productInfo: cardInfo.foundIn ?? [],
			})

			cardDispatch({
				type: CardInformationType.UPDATE_RESTRICTIONS,
				restrictionInfo: cardInfo.restrictedIn ?? { TCG: [], MD: [], DL: [] },
			})

			setIsLoading(false)
		})
	}, [])

	return (
		<div className='generic-container'>
			<Helmet>
				<title>SKC - Card: {cardId}</title>
				<meta name={`SKC - Card: ${cardId}`} content={`Information for YuGiOh card ${cardName} such as ban lists it was in, products it can be found in, effect/stats, etc.`} />
				<meta name='keywords' content={`YuGiOh, The Supreme Kings Castle, card, ${cardName}, ${cardId}, ${cardColor}`} />

				<meta property='og:title' content={`${cardName} - ${cardId}`} />
				<meta property='og:image' content={`https://images.thesupremekingscastle.com/cards/tn/${cardId}.jpg`} />
				<meta property='og:type' content='website' />
				<meta property='og:description' content={`Details For Yugioh Card - ${cardName}`} />
			</Helmet>

			<Suspense fallback={<Skeleton className='breadcrumb-skeleton' variant='rectangular' width='100%' height='2.5rem' />}>
				<Breadcrumb crumbs={dynamicCrumbs} />
			</Suspense>

			<OneThirdTwoThirdsGrid
				mirrored={false}
				oneThirdComponent={
					<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='20rem' />}>
						<CardData
							cardName={cardName}
							cardColor={cardColor}
							cardEffect={cardEffect}
							cardAttribute={cardAttribute}
							monsterType={monsterType}
							monsterAttack={monsterAtk}
							monsterDefense={monsterDef}
							monsterAssociation={monsterAssociation}
							cardID={cardId}
							isLoading={isLoading}
						/>
					</Suspense>
				}
				twoThirdComponent={
					<Suspense
						fallback={
							<Fragment>
								<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='20rem' />
								<br />
								<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='20rem' />
							</Fragment>
						}
					>
						<CardSuggestions cardID={cardId} cardColor={cardColor} cardName={cardName} />
						{isLoading ? (
							<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='20rem' />
						) : (
							<CardInformationRelatedContent
								cardName={cardName}
								cardColor={cardColor?.replace(/Pendulum-/gi, '') as cardColor}
								cardID={cardId}
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
