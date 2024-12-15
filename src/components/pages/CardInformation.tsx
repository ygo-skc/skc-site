import { useState, useEffect, lazy, Suspense, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import { Skeleton, Typography } from '@mui/material'

import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'
import { CardImageRounded, Hint, Section } from 'skc-rcl'
import { decodeHTML } from 'entities'
import { cardInformationReducer, CardInformationType } from '../../reducers/CardInformationReducer'

const Breadcrumb = lazy(() => import('../header-footer/Breadcrumb'))
const CardSuggestions = lazy(() => import('../card/suggestion/CardSuggestions'))
const CardInformationRelatedContent = lazy(() => import('../card/card-information/CardInformationRelatedContent'))

const YGOCard = lazy(() =>
	import('skc-rcl').then((module) => {
		return { default: module.YGOCard }
	})
)

const CardInformation = () => {
	let { cardId: cardID } = useParams()
	cardID = cardID as string
	const crumbs = ['Home', 'Card Browse']

	const [isLoading, setIsLoading] = useState(true)

	const [{ cardName, cardColor, cardEffect, cardAttribute, monsterType, monsterAttack, monsterDefense, monsterAssociation, productInfo, restrictionInfo }, cardDispatch] =
		useReducer(cardInformationReducer, {
			cardName: '',
			cardColor: undefined,
			cardEffect: '',
			cardAttribute: '',
			monsterType: '',
			monsterAttack: '',
			monsterDefense: '',
			monsterAssociation: undefined,
			productInfo: [],
			restrictionInfo: { TCG: [], MD: [], DL: [] },
		})

	const [dynamicCrumbs, setDynamicCrumbs] = useState([...crumbs, ''])

	useEffect(() => {
		FetchHandler.handleFetch(`${DownstreamServices.NAME_maps_ENDPOINT.cardInstanceUrl}/${cardID}?allInfo=true`, (cardInfo: SKCCardInfo) => {
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
			<title>SKC - Card: {cardID}</title>
			<meta name={`SKC - Card: ${cardID}`} content={`Information for YuGiOh card ${cardName} such as ban lists it was in, products it can be found in, effect/stats, etc.`} />
			<meta name='keywords' content={`YuGiOh, The Supreme Kings Castle, card, ${cardName}, ${cardID}, ${cardColor}`} />

			<meta property='og:title' content={`${cardName} - ${cardID}`} />
			<meta property='og:image' content={`https://images.thesupremekingscastle.com/cards/tn/${cardID}.jpg`} />
			<meta property='og:type' content='website' />
			<meta property='og:description' content={`Details For Yugioh Card - ${cardName}`} />

			<Suspense fallback={<Skeleton className='breadcrumb-skeleton' variant='rectangular' width='100%' height='2.5rem' />}>
				<Breadcrumb crumbs={dynamicCrumbs} />
			</Suspense>

			<div style={{ maxWidth: '50%', margin: 'auto', display: 'grid', gridTemplateColumns: '47% 53%', gap: '2rem' }}>
				<Section sectionHeaderBackground={cardColor !== undefined ? (cardColor?.replace(/Pendulum-/gi, '') as cardColor) : ''} sectionName='Information'>
					<div className='section-content'>
						<CardImageRounded size='md' cardID={cardID} loading='eager' />
						<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='10rem' />}>
							{isLoading ? (
								<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='10rem' />
							) : (
								<YGOCard
									cardName={cardName}
									cardColor={cardColor}
									cardEffect={decodeHTML(cardEffect)}
									cardAttribute={cardAttribute}
									monsterType={monsterType}
									monsterAttack={monsterAttack}
									monsterDefense={monsterDefense}
									monsterAssociation={monsterAssociation}
									cardID={cardID}
									fullDetails={true}
									isLoading={false}
								/>
							)}
						</Suspense>
					</div>
				</Section>
				<div className='group' style={{ alignSelf: 'start', background: 'white', border: '3px solid gray' }}>
					<Typography variant='h4'>Archetypes</Typography>
					<Hint>Not tied to any archetype</Hint>
				</div>
			</div>

			<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='40rem' />}>
				<CardSuggestions cardID={cardID} cardColor={cardColor} cardName={cardName} />
				{isLoading ? (
					<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='20rem' />
				) : (
					<CardInformationRelatedContent
						cardName={cardName}
						cardColor={cardColor?.replace(/Pendulum-/gi, '') as cardColor}
						cardID={cardID}
						productInfo={productInfo}
						restrictedIn={restrictionInfo}
					/>
				)}
			</Suspense>
		</div>
	)
}

export default CardInformation
