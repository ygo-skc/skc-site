import '../../css/card/card-information.css'

import { useEffect, useEffectEvent, lazy, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { Skeleton } from '@mui/material'

import FetchHandler from '../../helper/FetchHandler'
import * as DownstreamServices from '../../helper/DownstreamServices'
import { cardInformationReducer, CardInformationType } from '../../reducers/CardInformationReducer'
import { recordCardView } from '../../helper/RecentlyViewed'

import Breadcrumb from '../header-footer/Breadcrumb'
import { useHistoryEntryReducer } from '../util/useHistoryEntry'
import CardInformationHeader from '../card/card-information/CardInformationHeader'
import CardReleases from '../card/card-information/CardReleases'

const CardSuggestions = lazy(() => import('../card/suggestion/CardSuggestions'))
const CardInformationRelatedContent = lazy(() => import('../card/card-information/CardInformationRelatedContent'))

// the card, its suggestions and support have all answered (or failed), so coming back to it can show it without fetching again
const isSettled = ({ isFetchingCardData, isFetchingSuggestions, isFetchingSupport }: ReturnType<typeof cardInformationReducer>) =>
	!isFetchingCardData && !isFetchingSuggestions && !isFetchingSupport

const CardInformation = () => {
	// each card gets its own mount (see Routes), so the id from the URL doesn't change while the page is up
	const { cardId = '' } = useParams<{ cardId: string }>()
	const [state, cardInformationDispatch, isRestored] = useHistoryEntryReducer(
		'card-information',
		cardInformationReducer,
		{
			pageBreadcrumbs: ['Home', 'Card Browse', ''],
			card: {
				cardID: cardId,
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
			suggestions: { namedMaterials: [], namedReferences: [], referencedBy: [], materialFor: [], hasSelfReference: false },
			archetypes: new Set<string>(),
			isFetchingSuggestions: true,
			isFetchingSupport: true,
			suggestionRequestHasError: false,
			supportRequestHasError: false,
		},
		isSettled
	)

	// coming back to the card is viewing it again, so it still goes to the top of the recents - with the card as it was restored
	const recordRestoredView = useEffectEvent(() => recordCardView(state.card))

	useEffect(() => {
		if (isRestored) {
			recordRestoredView()
			return
		}

		FetchHandler.handleFetch(`${DownstreamServices.SKC_API_ENDPOINTS.cardInstanceUrl}/${cardId}?allInfo=true`, (cardInfo: YGOCard.Info) => {
			cardInformationDispatch({
				type: CardInformationType.UPDATE_CARD,
				cardInfo: cardInfo,
			})
			// only once the card loads, so a bad id never lands in the history
			recordCardView(cardInfo)
		})

		// fetch suggestions
		FetchHandler.handleFetch(
			`${DownstreamServices.SKC_SUGGESTION_ENDPOINTS.cardSuggestions}/${cardId}`,
			(cardSuggestionOutput: YGOCard.Suggestion) => {
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
			`${DownstreamServices.SKC_SUGGESTION_ENDPOINTS.cardSupport}/${cardId}`,
			(cardSupportOutput: YGOCard.Support) => {
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
	}, [isRestored, cardId, cardInformationDispatch])

	return (
		<div className='generic-container'>
			<title>SKC - Card: {state.card.cardID}</title>
			<meta name='description' content={`Information for YuGiOh card ${state.card.cardName} such as ban lists it was in, products it can be found in, effect/stats, etc.`} />
			<meta name='keywords' content={`YuGiOh, The Supreme Kings Castle, card, ${state.card.cardName}, ${state.card.cardID}, ${state.card.cardColor}`} />

			<meta property='og:title' content={`${state.card.cardName} - ${state.card.cardID}`} />
			<meta property='og:image' content={`https://images.thesupremekingscastle.com/cards/tn/${state.card.cardID}.jpg`} />
			<meta property='og:type' content='website' />
			<meta property='og:description' content={`Details For Yugioh Card - ${state.card.cardName}`} />

			<Breadcrumb crumbs={state.pageBreadcrumbs} />

			<CardInformationHeader
				card={state.card}
				isFetchingCardData={state.isFetchingCardData}
				productInfo={state.productInfo}
				restrictionInfo={state.restrictionInfo}
				archetypes={state.archetypes}
				isFetchingArchetypes={state.isFetchingSuggestions}
			/>

			<CardReleases productInfo={state.productInfo} isFetchingCardData={state.isFetchingCardData} />

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
					<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='40rem' />
				) : (
					<CardInformationRelatedContent cardColor={state.card.cardColor?.replace(/Pendulum-/gi, '') as YGOCard.Color} restrictedIn={state.restrictionInfo} />
				)}
			</Suspense>
		</div>
	)
}

export default CardInformation
