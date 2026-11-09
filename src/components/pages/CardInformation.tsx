import { useEffect, useEffectEvent } from 'react'
import { useParams } from 'react-router-dom'

import FetchHandler from '../../helper/FetchHandler'
import * as DownstreamServices from '../../helper/DownstreamServices'
import { cardInformationReducer, CardInformationType } from '../../reducers/CardInformationReducer'
import { recordCardView } from '../../helper/RecentlyViewed'

import Breadcrumb from '../header-footer/Breadcrumb'
import { useHistoryEntryReducer } from '../util/useHistoryEntry'
import CardInformationHeader from '../card/card-information/CardInformationHeader'
import CardReleases from '../card/card-information/CardReleases'
import CardSuggestions from '../card/suggestion/CardSuggestions'
import CardBanListInformation from '../card/card-information/CardBanListInformation'

// the card, its suggestions and support, and both formats' list dates have all answered (or failed), so coming back to it can show it
// without fetching again
const isSettled = ({ isFetchingCardData, isFetchingSuggestions, isFetchingSupport, banListDates }: ReturnType<typeof cardInformationReducer>) =>
	!isFetchingCardData && !isFetchingSuggestions && !isFetchingSupport && banListDates.TCG !== undefined && banListDates.MD !== undefined

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
			banListDates: {},
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

		// each format's list dates, so the ban history can say how far back it reaches and whether the card is on the current list -
		// without them the page just leaves those out
		for (const format of ['TCG', 'MD'] as const) {
			FetchHandler.handleFetch(
				`${DownstreamServices.SKC_API_ENDPOINTS.banListsUrl}?format=${format}`,
				({ banListDates }: YGOBanList.Dates) => {
					cardInformationDispatch({ type: CardInformationType.UPDATE_BAN_LIST_DATES, format, dates: banListDates.map(({ effectiveDate }) => effectiveDate) })
				},
				false
			)?.catch(() => {
				cardInformationDispatch({ type: CardInformationType.UPDATE_BAN_LIST_DATES, format, dates: [] })
			})
		}
	}, [isRestored, cardId, cardInformationDispatch])

	return (
		<div className='generic-container'>
			{/* the passcode until the card's name arrives */}
			<title>{`SKC - Card: ${state.card.cardName || state.card.cardID}`}</title>
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
				banListDates={state.banListDates}
			/>

			<CardReleases productInfo={state.productInfo} isFetchingCardData={state.isFetchingCardData} />

			<CardSuggestions
				namedMaterials={state.suggestions.namedMaterials}
				namedReferences={state.suggestions.namedReferences}
				materialFor={state.suggestions.materialFor}
				referencedBy={state.suggestions.referencedBy}
				isFetchingSuggestions={state.isFetchingSuggestions}
				isFetchingSupport={state.isFetchingSupport}
				suggestionRequestHasError={state.suggestionRequestHasError}
				supportRequestHasError={state.supportRequestHasError}
				cardName={state.card.cardName}
			/>

			{!state.isFetchingCardData && <CardBanListInformation restrictedIn={state.restrictionInfo} banListDates={state.banListDates} cardName={state.card.cardName} />}
		</div>
	)
}

export default CardInformation
