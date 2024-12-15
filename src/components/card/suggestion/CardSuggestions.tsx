import '../../../css/card/ygo-card-suggestion.css'
import { FC, Fragment, lazy, Suspense, useEffect, useCallback, useReducer } from 'react'
import { decodeHTML } from 'entities'
import { Skeleton } from '@mui/material'

import FetchHandler from '../../../helper/FetchHandler'
import DownstreamServices from '../../../helper/DownstreamServices'
import SuggestionSection from './SuggestionSection'

import { Section, YGOCardWithImage, YGOCardWithQuantity } from 'skc-rcl'
import { cardSuggestionReducer, CardSuggestionType } from '../../../reducers/CardSuggestionReducer'

const Hint = lazy(() =>
	import('skc-rcl').then((module) => {
		return { default: module.Hint }
	})
)

const GenericNonBreakingErr = lazy(() =>
	import('skc-rcl').then((module) => {
		return { default: module.GenericNonBreakingErr }
	})
)

type CardSuggestionProps = {
	cardID: string
	cardColor: cardColor
	cardName: string
}

const CardSuggestions: FC<CardSuggestionProps> = ({ cardID, cardColor, cardName }) => {
	const [
		{ namedMaterials, namedReferences, referencedBy, materialFor, isLoadingSuggestions, isLoadingSupport, suggestionRequestHasError, supportRequestHasError },
		suggestionDispatch,
	] = useReducer(cardSuggestionReducer, {
		namedMaterials: [],
		namedReferences: [],
		referencedBy: [],
		materialFor: [],
		isLoadingSuggestions: true,
		isLoadingSupport: true,
		suggestionRequestHasError: false,
		supportRequestHasError: false,
	})

	const isLoading = useCallback((): boolean => {
		return isLoadingSuggestions || isLoadingSupport
	}, [isLoadingSuggestions, isLoadingSupport])

	// if both requests fail, then we will consider it an error
	const hasError = useCallback((): boolean => {
		return suggestionRequestHasError && supportRequestHasError
	}, [suggestionRequestHasError, supportRequestHasError])

	const hasNoContent = useCallback(() => {
		return namedMaterials.length === 0 && namedReferences.length === 0 && materialFor.length === 0 && referencedBy.length === 0
	}, [materialFor, materialFor, namedReferences, referencedBy])

	const transformReferences = useCallback((references: CardReference[]): React.JSX.Element[] => {
		return references !== null
			? references.map((reference: CardReference) => {
					reference.card.cardEffect = decodeHTML(reference.card.cardEffect)
					return (
						<a key={reference.card.cardID} href={`/card/${reference.card.cardID}`} className='suggested-ygo-card-wrapper aggregate-anchor'>
							<YGOCardWithQuantity card={reference.card} occurrences={reference.occurrences} />
						</a>
					)
			  })
			: []
	}, [])

	const transformSupport = useCallback((support: CardReference[]): React.JSX.Element[] => {
		return support !== null
			? support.map((reference: CardReference) => {
					const card = reference.card
					card.cardEffect = decodeHTML(card.cardEffect)
					return (
						<a key={card.cardID} href={`/card/${card.cardID}`} className='suggested-ygo-card-wrapper aggregate-anchor'>
							<YGOCardWithImage key={card.cardID} card={card} imgLoadingType='lazy' />
						</a>
					)
			  })
			: []
	}, [])

	const LoadingUI = <Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='50rem' />

	useEffect(() => {
		FetchHandler.handleFetch(
			`${DownstreamServices.SKC_SUGGESTION_ENDPOINTS.cardSuggestions}/${cardID}`,
			(json: CardSuggestionOutput) => {
				suggestionDispatch({
					type: CardSuggestionType.UPDATE_SUGGESTIONS,
					namedMaterials: json.namedMaterials,
					namedReferences: json.namedReferences,
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
			(json: CardSupportOutput) => {
				suggestionDispatch({
					type: CardSuggestionType.UPDATE_SUPPORT,
					referencedBy: json.referencedBy,
					materialFor: json.materialFor,
				})
			},
			false
		)?.catch(() => {
			suggestionDispatch({
				type: CardSuggestionType.FETCH_SUPPORT_ERROR,
			})
		})
	}, [cardID, transformSupport, transformReferences])

	return (
		<Section sectionHeaderBackground={cardColor !== undefined ? (cardColor?.replace(/Pendulum-/gi, '') as cardColor) : ''} sectionName='Suggestions'>
			<div className='section-content'>
				<Suspense fallback={LoadingUI}>
					{!isLoading() && !hasError() && hasNoContent() && <Hint fullWidth={false}>Nothing here 🤔</Hint>}
					{isLoading() && LoadingUI}
					{!isLoading() && !hasError() && (
						<Fragment>
							<SuggestionSection
								suggestions={transformReferences(namedMaterials)}
								sectionName='Named Materials'
								sectionExplanation={`Other cards that are directly referenced as summoning material by ${cardName} card. Currently, only extra deck summonsing materials are suggested.`}
							/>
							<SuggestionSection
								suggestions={transformSupport(materialFor)}
								sectionName='Material For'
								sectionExplanation={`${cardName} can be used as a material for the cards in this section.`}
							/>
							<SuggestionSection
								suggestions={transformReferences(namedReferences)}
								sectionName='References'
								sectionExplanation={`${cardName} is referencing the below cards. If ${cardName} is an extra deck monster, its named summoning materials are omitted here.`}
							/>
							<SuggestionSection
								suggestions={transformSupport(referencedBy)}
								sectionName='Referenced By'
								sectionExplanation={`Cards that directly reference ${cardName}. Omits extra deck monsters that reference ${cardName} as a summoning material.`}
							/>
						</Fragment>
					)}
					{!isLoading() && hasError() && <GenericNonBreakingErr errExplanation={'🤯 Suggestion Engine Is Offline 🤯'} />}
				</Suspense>
			</div>
		</Section>
	)
}

export default CardSuggestions
