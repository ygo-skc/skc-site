import '../../css/card/card-information.css'
import '../../css/util/headline.css'

import { useEffect, lazy, Suspense, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import { Chip, Skeleton, Typography } from '@mui/material'

import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'
import { CardImageRounded, Section } from 'skc-rcl'
import { decodeHTML } from 'entities'
import { cardInformationReducer, CardInformationType } from '../../reducers/CardInformationReducer'
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

const Hint = lazy(() =>
	import('skc-rcl').then((module) => {
		return { default: module.Hint }
	})
)

const CardInformation = () => {
	const [state, cardInformationDispatch] = useReducer(cardInformationReducer, {
		pageBreadcrumbs: ['Home', 'Card Browse', ''],
		card: {
			cardID: useParams<{ cardId: string }>().cardId ?? '',
			cardName: '',
			cardColor: undefined,
			cardEffect: '',
			cardAttribute: '',
			monsterType: '',
			monsterAttack: '',
			monsterDefense: '',
			monsterAssociation: undefined,
		},
		productInfo: [],
		restrictionInfo: { TCG: [], MD: [], DL: [] },
		isFetchingCardData: true,
		uniqueRarities: [],
		suggestions: { namedMaterials: [], namedReferences: [], referencedBy: [], materialFor: [], hasSelfReference: false },
		archetypes: new Set<string>(),
		isFetchingSuggestions: true,
		isFetchingSupport: true,
		suggestionRequestHasError: false,
		supportRequestHasError: false,
	})

	useEffect(() => {
		FetchHandler.handleFetch(`${DownstreamServices.NAME_maps_ENDPOINT.cardInstanceUrl}/${state.card.cardID}?allInfo=true`, (cardInfo: SKCCardInfo) => {
			cardInformationDispatch({
				type: CardInformationType.UPDATE_CARD,
				cardInfo: cardInfo,
			})
		})

		// fetch suggestions
		FetchHandler.handleFetch(
			`${DownstreamServices.SKC_SUGGESTION_ENDPOINTS.cardSuggestions}/${state.card.cardID}`,
			(cardSuggestionOutput: CardSuggestionOutput) => {
				cardInformationDispatch({
					type: CardInformationType.UPDATE_SUGGESTIONS,
					suggestions: cardSuggestionOutput,
				})
			},
			false
		)?.catch(() => {
			cardInformationDispatch({
				type: CardInformationType.FETCH_SUGGESTIONS_ERROR,
			})
		})

		FetchHandler.handleFetch(
			`${DownstreamServices.SKC_SUGGESTION_ENDPOINTS.cardSupport}/${state.card.cardID}`,
			(cardSupportOutput: CardSupportOutput) => {
				cardInformationDispatch({
					type: CardInformationType.UPDATE_SUPPORT,
					support: cardSupportOutput,
				})
			},
			false
		)?.catch(() => {
			cardInformationDispatch({
				type: CardInformationType.FETCH_SUPPORT_ERROR,
			})
		})
	}, [])

	return (
		<div className='generic-container'>
			<title>SKC - Card: {state.card.cardID}</title>
			<meta
				name={`SKC - Card: ${state.card.cardID}`}
				content={`Information for YuGiOh card ${state.card.cardName} such as ban lists it was in, products it can be found in, effect/stats, etc.`}
			/>
			<meta name='keywords' content={`YuGiOh, The Supreme Kings Castle, card, ${state.card.cardName}, ${state.card.cardID}, ${state.card.cardColor}`} />

			<meta property='og:title' content={`${state.card.cardName} - ${state.card.cardID}`} />
			<meta property='og:image' content={`https://images.thesupremekingscastle.com/cards/tn/${state.card.cardID}.jpg`} />
			<meta property='og:type' content='website' />
			<meta property='og:description' content={`Details For Yugioh Card - ${state.card.cardName}`} />

			<Suspense fallback={<Skeleton className='breadcrumb-skeleton' variant='rectangular' width='100%' height='2.5rem' />}>
				<Breadcrumb crumbs={state.pageBreadcrumbs} />
			</Suspense>

			<div className='headline-v1'>
				<Section sectionHeaderBackground={state.card.cardColor !== undefined ? (state.card.cardColor?.replace(/Pendulum-/gi, '') as cardColor) : ''} sectionName='Card Stats'>
					<div className='section-content'>
						<CardImageRounded size='md' cardID={state.card.cardID} loading='eager' />
						<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='10rem' />}>
							{state.isFetchingCardData ? (
								<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='10rem' />
							) : (
								<YGOCard
									cardName={state.card.cardName}
									cardColor={state.card.cardColor}
									cardEffect={decodeHTML(state.card.cardEffect)}
									cardAttribute={state.card.cardAttribute}
									monsterType={state.card.monsterType}
									monsterAttack={state.card.monsterAttack}
									monsterDefense={state.card.monsterDefense}
									monsterAssociation={state.card.monsterAssociation}
									cardID={state.card.cardID}
									fullDetails={true}
									isLoading={false}
								/>
							)}
						</Suspense>
					</div>
				</Section>

				<div className='group light-shadow'>
					<Typography variant='h3' align='center'>
						Summary
					</Typography>

					<div className='headline-section'>
						<Typography variant='h5'>Archetypes (BETA)</Typography>
						{state.isFetchingSuggestions && <Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='5rem' />}
						{!state.isFetchingSuggestions &&
							state.archetypes.size !== 0 &&
							[...state.archetypes].map((archetype) => <Chip className='dark-chip' key={archetype} label={archetype} />)}
						{!state.isFetchingSuggestions && state.archetypes.size === 0 && (
							<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='3rem' />}>
								<Hint variant='tight' fullWidth={false}>
									Not tied to any archetype
								</Hint>
							</Suspense>
						)}
					</div>

					<div className='headline-section'>
						<Typography variant='h5'>Releases</Typography>
						{state.productInfo.length !== 0 && (
							<div className='card-printing-info-container'>
								<CalendarMonthTwoToneIcon />
								<div>
									<Typography variant='subtitle2'>
										{Dates.daysBetweenTwoDates(Dates.fromYYYYMMDDToDate(state.productInfo[0].productReleaseDate)).toLocaleString()} day(s) since last printing
									</Typography>
									{state.productInfo.length >= 2 && (
										<Typography variant='subtitle2'>
											{Dates.daysBetweenTwoDates(Dates.fromYYYYMMDDToDate(state.productInfo[state.productInfo.length - 1].productReleaseDate)).toLocaleString()} days since initial
											release
										</Typography>
									)}
								</div>
							</div>
						)}

						<Typography variant='subtitle2'>
							{state.uniqueRarities.length} unique {state.uniqueRarities.length == 1 ? 'rarity' : 'rarities'}
						</Typography>
						{state.uniqueRarities.map((uniqueRarity) => (
							<Chip className='dark-chip' key={uniqueRarity} label={uniqueRarity} />
						))}
					</div>
				</div>
			</div>

			<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='22rem' />}>
				<CardSuggestions
					namedMaterials={state.suggestions.namedMaterials}
					namedReferences={state.suggestions.namedReferences}
					materialFor={state.suggestions.materialFor}
					referencedBy={state.suggestions.referencedBy}
					isFetchingSuggestions={state.isFetchingSuggestions}
					isFetchingSupport={state.isFetchingSupport}
					suggestionRequestHasError={state.suggestionRequestHasError}
					supportRequestHasError={state.supportRequestHasError}
					cardColor={state.card.cardColor}
					cardName={state.card.cardName}
				/>
			</Suspense>
			<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='40rem' />}>
				{state.isFetchingCardData ? (
					<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='20rem' />
				) : (
					<CardInformationRelatedContent
						cardName={state.card.cardName}
						cardColor={state.card.cardColor?.replace(/Pendulum-/gi, '') as cardColor}
						cardID={state.card.cardID}
						productInfo={state.productInfo}
						restrictedIn={state.restrictionInfo}
					/>
				)}
			</Suspense>
		</div>
	)
}

export default CardInformation
