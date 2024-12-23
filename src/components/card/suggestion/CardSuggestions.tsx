import '../../../css/card/ygo-card-suggestion.css'
import { FC, Fragment, lazy, Suspense, useCallback } from 'react'
import { decodeHTML } from 'entities'
import { Skeleton } from '@mui/material'

import SuggestionSection from './SuggestionSection'

import { Section, YGOCardWithImage, YGOCardWithQuantity } from 'skc-rcl'
import { CardSuggestionState } from '../../../reducers/CardSuggestionReducer'

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
	cardSuggestionState: CardSuggestionState
	cardColor: cardColor
	cardName: string
}

const CardSuggestions: FC<CardSuggestionProps> = ({ cardSuggestionState: cardSuggestionsState, cardColor, cardName }) => {
	const isLoading = useCallback((): boolean => {
		return cardSuggestionsState.isLoadingSuggestions || cardSuggestionsState.isLoadingSupport
	}, [cardSuggestionsState.isLoadingSuggestions, cardSuggestionsState.isLoadingSupport])

	// if both requests fail, then we will consider it an error
	const hasError = useCallback((): boolean => {
		return cardSuggestionsState.suggestionRequestHasError && cardSuggestionsState.supportRequestHasError
	}, [cardSuggestionsState.suggestionRequestHasError, cardSuggestionsState.supportRequestHasError])

	const hasNoContent = useCallback(() => {
		return (
			cardSuggestionsState.namedMaterials.length === 0 &&
			cardSuggestionsState.namedReferences.length === 0 &&
			cardSuggestionsState.materialFor.length === 0 &&
			cardSuggestionsState.referencedBy.length === 0
		)
	}, [cardSuggestionsState.materialFor, cardSuggestionsState.materialFor, cardSuggestionsState.namedReferences, cardSuggestionsState.referencedBy])

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

	return (
		<Section sectionHeaderBackground={cardColor !== undefined ? (cardColor?.replace(/Pendulum-/gi, '') as cardColor) : ''} sectionName='Suggestions'>
			<div className='section-content'>
				<Suspense fallback={LoadingUI}>
					{!isLoading() && !hasError() && hasNoContent() && <Hint fullWidth={false}>Nothing here 🤔</Hint>}
					{isLoading() && LoadingUI}
					{!isLoading() && hasError() && <GenericNonBreakingErr errExplanation={'🤯 Suggestion Engine Is Offline 🤯'} />}
				</Suspense>
				{!isLoading() && !hasError() && (
					<Fragment>
						<SuggestionSection
							suggestions={transformReferences(cardSuggestionsState.namedMaterials)}
							sectionName='Named Materials'
							sectionExplanation={`Other cards that are directly referenced as summoning material by ${cardName} card. Currently, only extra deck summonsing materials are suggested.`}
						/>
						<SuggestionSection
							suggestions={transformSupport(cardSuggestionsState.materialFor)}
							sectionName='Material For'
							sectionExplanation={`${cardName} can be used as a material for the cards in this section.`}
						/>
						<SuggestionSection
							suggestions={transformReferences(cardSuggestionsState.namedReferences)}
							sectionName='References'
							sectionExplanation={`${cardName} is referencing the below cards. If ${cardName} is an extra deck monster, its named summoning materials are omitted here.`}
						/>
						<SuggestionSection
							suggestions={transformSupport(cardSuggestionsState.referencedBy)}
							sectionName='Referenced By'
							sectionExplanation={`Cards that directly reference ${cardName}. Omits extra deck monsters that reference ${cardName} as a summoning material.`}
						/>
					</Fragment>
				)}
			</div>
		</Section>
	)
}

export default CardSuggestions
