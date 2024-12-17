import '../../css/card/card-information.css'

import { useState, useEffect, lazy, Suspense, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import { Chip, Skeleton, Typography } from '@mui/material'

import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'
import { CardImageRounded, Hint, Section } from 'skc-rcl'
import { decodeHTML } from 'entities'
import { cardInformationReducer, CardInformationType } from '../../reducers/CardInformationReducer'
import { cardSuggestionReducer, CardSuggestionType } from '../../reducers/CardSuggestionReducer'
import { Dates } from '../../helper/Dates'

import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone'

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

	const [cardState, cardDispatch] = useReducer(cardInformationReducer, {
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
		isLoadingData: true,
		uniqueRarities: [],
	})
	const [cardSuggestionState, suggestionDispatch] = useReducer(cardSuggestionReducer, {
		namedMaterials: [],
		namedReferences: [],
		hasSelfReference: false,
		referencedBy: [],
		materialFor: [],
		archetypes: new Set<string>(),
		isLoadingSuggestions: true,
		isLoadingSupport: true,
		suggestionRequestHasError: false,
		supportRequestHasError: false,
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
				productInfo: cardInfo.foundIn ?? [],
				restrictionInfo: cardInfo.restrictedIn ?? { TCG: [], MD: [], DL: [] },
			})
		})

		// fetch suggestions
		FetchHandler.handleFetch(
			`${DownstreamServices.SKC_SUGGESTION_ENDPOINTS.cardSuggestions}/${cardID}`,
			(cardSuggestionOutput: CardSuggestionOutput) => {
				suggestionDispatch({
					type: CardSuggestionType.UPDATE_SUGGESTIONS,
					suggestions: cardSuggestionOutput,
				})
			},
			false
		)?.catch(() => {
			suggestionDispatch({
				type: CardSuggestionType.FETCH_SUGGESTIONS_ERROR,
			})
		})

		FetchHandler.handleFetch(
			`${DownstreamServices.SKC_SUGGESTION_ENDPOINTS.cardSupport}/${cardID}`,
			(cardSupportOutput: CardSupportOutput) => {
				suggestionDispatch({
					type: CardSuggestionType.UPDATE_SUPPORT,
					support: cardSupportOutput,
				})
			},
			false
		)?.catch(() => {
			suggestionDispatch({
				type: CardSuggestionType.FETCH_SUPPORT_ERROR,
			})
		})
	}, [])

	return (
		<div className='generic-container'>
			<title>SKC - Card: {cardID}</title>
			<meta
				name={`SKC - Card: ${cardID}`}
				content={`Information for YuGiOh card ${cardState.cardName} such as ban lists it was in, products it can be found in, effect/stats, etc.`}
			/>
			<meta name='keywords' content={`YuGiOh, The Supreme Kings Castle, card, ${cardState.cardName}, ${cardID}, ${cardState.cardColor}`} />

			<meta property='og:title' content={`${cardState.cardName} - ${cardID}`} />
			<meta property='og:image' content={`https://images.thesupremekingscastle.com/cards/tn/${cardID}.jpg`} />
			<meta property='og:type' content='website' />
			<meta property='og:description' content={`Details For Yugioh Card - ${cardState.cardName}`} />

			<Suspense fallback={<Skeleton className='breadcrumb-skeleton' variant='rectangular' width='100%' height='2.5rem' />}>
				<Breadcrumb crumbs={dynamicCrumbs} />
			</Suspense>

			<div className='headline'>
				<Section sectionHeaderBackground={cardState.cardColor !== undefined ? (cardState.cardColor?.replace(/Pendulum-/gi, '') as cardColor) : ''} sectionName='Card Stats'>
					<div className='section-content'>
						<CardImageRounded size='md' cardID={cardID} loading='eager' />
						<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='10rem' />}>
							{cardState.isLoadingData ? (
								<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='10rem' />
							) : (
								<YGOCard
									cardName={cardState.cardName}
									cardColor={cardState.cardColor}
									cardEffect={decodeHTML(cardState.cardEffect)}
									cardAttribute={cardState.cardAttribute}
									monsterType={cardState.monsterType}
									monsterAttack={cardState.monsterAttack}
									monsterDefense={cardState.monsterDefense}
									monsterAssociation={cardState.monsterAssociation}
									cardID={cardID}
									fullDetails={true}
									isLoading={false}
								/>
							)}
						</Suspense>
					</div>
				</Section>

				<div className='group'>
					<Typography variant='h4' align='center'>
						Summary
					</Typography>

					<Typography variant='h6'>Archetypes</Typography>
					<div className='card-summary-section'>
						{cardSuggestionState.archetypes.size !== 0 ? (
							[...cardSuggestionState.archetypes].map((archetype) => <Chip className='dark-chip' key={archetype} label={archetype} />)
						) : (
							<Hint variant='tight' fullWidth={false}>
								Not tied to any archetype
							</Hint>
						)}
					</div>

					<Typography variant='h6'>Releases</Typography>
					<div className='card-summary-section'>
						{cardState.productInfo.length !== 0 && (
							<div className='card-printing-info-container'>
								<CalendarMonthTwoToneIcon />
								<div>
									<Typography variant='subtitle2'>
										{Dates.daysBetweenTwoDates(Dates.fromYYYYMMDDToDate(cardState.productInfo[0].productReleaseDate)).toLocaleString()} day(s) since last printing
									</Typography>
									{cardState.productInfo.length >= 2 && (
										<Typography variant='subtitle2'>
											{Dates.daysBetweenTwoDates(Dates.fromYYYYMMDDToDate(cardState.productInfo[cardState.productInfo.length - 1].productReleaseDate)).toLocaleString()} days since
											initial release
										</Typography>
									)}
								</div>
							</div>
						)}

						<Typography variant='subtitle2'>
							{cardState.uniqueRarities.length} unique {cardState.uniqueRarities.length == 1 ? 'rarity' : 'rarities'}
						</Typography>
						{cardState.uniqueRarities.map((uniqueRarity) => (
							<Chip className='dark-chip' key={uniqueRarity} label={uniqueRarity} />
						))}
					</div>
				</div>
			</div>

			<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='22rem' />}>
				<CardSuggestions cardSuggestionState={cardSuggestionState} cardColor={cardState.cardColor} cardName={cardState.cardName} />
			</Suspense>
			<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='40rem' />}>
				{cardState.isLoadingData ? (
					<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='20rem' />
				) : (
					<CardInformationRelatedContent
						cardName={cardState.cardName}
						cardColor={cardState.cardColor?.replace(/Pendulum-/gi, '') as cardColor}
						cardID={cardID}
						productInfo={cardState.productInfo}
						restrictedIn={cardState.restrictionInfo}
					/>
				)}
			</Suspense>
		</div>
	)
}

export default CardInformation
