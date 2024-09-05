import '../../../css/card/ygo-card-suggestion.css'
import { FC, Fragment, lazy, Suspense, useEffect, useState, useCallback } from 'react'
import { decodeHTML } from 'entities'
import { Skeleton } from '@mui/material'

import FetchHandler from '../../../helper/FetchHandler'
import DownstreamServices from '../../../helper/DownstreamServices'
import SuggestionSection from './SuggestionSection'

import { Section } from 'skc-rcl'

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

type _CardSuggestion = {
	cardID: string
	cardColor: cardColor
	cardName: string
}

const CardSuggestions: FC<_CardSuggestion> = ({ cardID, cardColor, cardName }) => {
	const [materialSuggestions, setMaterialSuggestions] = useState<React.JSX.Element[]>([])
	const [referenceSuggestions, setReferenceSuggestions] = useState<React.JSX.Element[]>([])
	const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(true)
	const [suggestionRequestHasError, setSuggestionRequestHasError] = useState<boolean>(false)

	const [materialFor, setMaterialFor] = useState<React.JSX.Element[]>([])
	const [referencedBy, setReferencedBy] = useState<React.JSX.Element[]>([])
	const [isLoadingSupport, setIsLoadingSupport] = useState<boolean>(true)
	const [supportRequestHasError, setSupportRequestHasError] = useState<boolean>(false)

	const isLoading = useCallback((): boolean => {
		return isLoadingSuggestions || isLoadingSupport
	}, [isLoadingSuggestions, isLoadingSupport])

	// if both requests fail, then we will consider it an error
	const hasError = useCallback((): boolean => {
		return suggestionRequestHasError && supportRequestHasError
	}, [suggestionRequestHasError, supportRequestHasError])

	const hasNoContent = useCallback(() => {
		return materialSuggestions.length === 0 && referenceSuggestions.length === 0 && materialFor.length === 0 && referencedBy.length === 0
	}, [materialFor.length, materialSuggestions.length, referenceSuggestions.length, referencedBy.length])

	const transformReferences = useCallback((references: CardReference[]): React.JSX.Element[] => {
		const YGOCardWithQuantity = lazy(() =>
			import('skc-rcl').then((module) => {
				return { default: module.YGOCardWithQuantity }
			})
		)

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
		const YGOCardWithImage = lazy(() =>
			import('skc-rcl').then((module) => {
				return { default: module.YGOCardWithImage }
			})
		)

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

	const LoadingUI = <Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='380px' />

	useEffect(() => {
		FetchHandler.handleFetch(
			`${DownstreamServices.SKC_SUGGESTION_ENDPOINTS.cardSuggestions}/${cardID}`,
			(json: CardSuggestionOutput) => {
				setMaterialSuggestions(transformReferences(json.namedMaterials))
				setReferenceSuggestions(transformReferences(json.namedReferences))
				setIsLoadingSuggestions(false)
			},
			false
		)?.catch(() => {
			setIsLoadingSuggestions(false)
			setSuggestionRequestHasError(true)
		})

		FetchHandler.handleFetch(
			`${DownstreamServices.SKC_SUGGESTION_ENDPOINTS.cardSupport}/${cardID}`,
			(json: CardSupportOutput) => {
				setMaterialFor(transformSupport(json.materialFor))
				setReferencedBy(transformSupport(json.referencedBy))
				setIsLoadingSupport(false)
			},
			false
		)?.catch(() => {
			setIsLoadingSupport(false)
			setSupportRequestHasError(true)
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
								suggestions={materialSuggestions}
								sectionName='Named Materials'
								sectionExplanation={`Other cards that are directly referenced as summoning material by ${cardName} card. Currently, only extra deck summonsing materials are suggested.`}
							/>
							<SuggestionSection suggestions={materialFor} sectionName='Material For' sectionExplanation={`${cardName} can be used as a material for the cards in this section.`} />
							<SuggestionSection
								suggestions={referenceSuggestions}
								sectionName='References'
								sectionExplanation={`${cardName} is referencing the below cards. If ${cardName} is an extra deck monster, its named summoning materials are omitted here.`}
							/>
							<SuggestionSection
								suggestions={referencedBy}
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
