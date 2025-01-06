import '../../css/card/card-information.css'
import '../../css/util/headline.css'

import { useState, useEffect, lazy, Suspense, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import { Chip, Skeleton, Typography } from '@mui/material'

import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'
import { CardImageRounded, Hint, Section } from 'skc-rcl'
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

const CardInformation = () => {
	let { cardId: cardID } = useParams()
	cardID = cardID as string
	const crumbs = ['Home', 'Card Browse']

	const [cardInformationState, cardInformationDispatch] = useReducer(cardInformationReducer, {
		card: {
			cardID: '',
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

	const [dynamicCrumbs, setDynamicCrumbs] = useState([...crumbs, ''])

	useEffect(() => {
		FetchHandler.handleFetch(`${DownstreamServices.NAME_maps_ENDPOINT.cardInstanceUrl}/${cardID}?allInfo=true`, (cardInfo: SKCCardInfo) => {
			setDynamicCrumbs([...crumbs, cardInfo.cardID])

			cardInformationDispatch({
				type: CardInformationType.UPDATE_CARD,
				cardInfo: cardInfo,
			})
		})

		// fetch suggestions
		FetchHandler.handleFetch(
			`${DownstreamServices.SKC_SUGGESTION_ENDPOINTS.cardSuggestions}/${cardID}`,
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
			`${DownstreamServices.SKC_SUGGESTION_ENDPOINTS.cardSupport}/${cardID}`,
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
			<title>SKC - Card: {cardID}</title>
			<meta
				name={`SKC - Card: ${cardID}`}
				content={`Information for YuGiOh card ${cardInformationState.card.cardName} such as ban lists it was in, products it can be found in, effect/stats, etc.`}
			/>
			<meta name='keywords' content={`YuGiOh, The Supreme Kings Castle, card, ${cardInformationState.card.cardName}, ${cardID}, ${cardInformationState.card.cardColor}`} />

			<meta property='og:title' content={`${cardInformationState.card.cardName} - ${cardID}`} />
			<meta property='og:image' content={`https://images.thesupremekingscastle.com/cards/tn/${cardID}.jpg`} />
			<meta property='og:type' content='website' />
			<meta property='og:description' content={`Details For Yugioh Card - ${cardInformationState.card.cardName}`} />

			<Suspense fallback={<Skeleton className='breadcrumb-skeleton' variant='rectangular' width='100%' height='2.5rem' />}>
				<Breadcrumb crumbs={dynamicCrumbs} />
			</Suspense>

			<div className='headline-v1'>
				<Section
					sectionHeaderBackground={cardInformationState.card.cardColor !== undefined ? (cardInformationState.card.cardColor?.replace(/Pendulum-/gi, '') as cardColor) : ''}
					sectionName='Card Stats'
				>
					<div className='section-content'>
						<CardImageRounded size='md' cardID={cardID} loading='eager' />
						<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='10rem' />}>
							{cardInformationState.isFetchingCardData ? (
								<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='10rem' />
							) : (
								<YGOCard
									cardName={cardInformationState.card.cardName}
									cardColor={cardInformationState.card.cardColor}
									cardEffect={decodeHTML(cardInformationState.card.cardEffect)}
									cardAttribute={cardInformationState.card.cardAttribute}
									monsterType={cardInformationState.card.monsterType}
									monsterAttack={cardInformationState.card.monsterAttack}
									monsterDefense={cardInformationState.card.monsterDefense}
									monsterAssociation={cardInformationState.card.monsterAssociation}
									cardID={cardID}
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
						{cardInformationState.archetypes.size !== 0 ? (
							[...cardInformationState.archetypes].map((archetype) => <Chip className='dark-chip' key={archetype} label={archetype} />)
						) : (
							<Hint variant='tight' fullWidth={false}>
								Not tied to any archetype
							</Hint>
						)}
					</div>

					<div className='headline-section'>
						<Typography variant='h5'>Releases</Typography>
						{cardInformationState.productInfo.length !== 0 && (
							<div className='card-printing-info-container'>
								<CalendarMonthTwoToneIcon />
								<div>
									<Typography variant='subtitle2'>
										{Dates.daysBetweenTwoDates(Dates.fromYYYYMMDDToDate(cardInformationState.productInfo[0].productReleaseDate)).toLocaleString()} day(s) since last printing
									</Typography>
									{cardInformationState.productInfo.length >= 2 && (
										<Typography variant='subtitle2'>
											{Dates.daysBetweenTwoDates(
												Dates.fromYYYYMMDDToDate(cardInformationState.productInfo[cardInformationState.productInfo.length - 1].productReleaseDate)
											).toLocaleString()}{' '}
											days since initial release
										</Typography>
									)}
								</div>
							</div>
						)}

						<Typography variant='subtitle2'>
							{cardInformationState.uniqueRarities.length} unique {cardInformationState.uniqueRarities.length == 1 ? 'rarity' : 'rarities'}
						</Typography>
						{cardInformationState.uniqueRarities.map((uniqueRarity) => (
							<Chip className='dark-chip' key={uniqueRarity} label={uniqueRarity} />
						))}
					</div>
				</div>
			</div>

			<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='22rem' />}>
				<CardSuggestions
					namedMaterials={cardInformationState.suggestions.namedMaterials}
					namedReferences={cardInformationState.suggestions.namedReferences}
					materialFor={cardInformationState.suggestions.materialFor}
					referencedBy={cardInformationState.suggestions.referencedBy}
					isFetchingSuggestions={cardInformationState.isFetchingSuggestions}
					isFetchingSupport={cardInformationState.isFetchingSupport}
					suggestionRequestHasError={cardInformationState.suggestionRequestHasError}
					supportRequestHasError={cardInformationState.supportRequestHasError}
					cardColor={cardInformationState.card.cardColor}
					cardName={cardInformationState.card.cardName}
				/>
			</Suspense>
			<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='40rem' />}>
				{cardInformationState.isFetchingCardData ? (
					<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='20rem' />
				) : (
					<CardInformationRelatedContent
						cardName={cardInformationState.card.cardName}
						cardColor={cardInformationState.card.cardColor?.replace(/Pendulum-/gi, '') as cardColor}
						cardID={cardID}
						productInfo={cardInformationState.productInfo}
						restrictedIn={cardInformationState.restrictionInfo}
					/>
				)}
			</Suspense>
		</div>
	)
}

export default CardInformation
