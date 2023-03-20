import { FC, Fragment, lazy, startTransition, Suspense, useEffect, useState } from 'react'
import { Skeleton } from '@mui/material'

import FetchHandler from '../../../helper/FetchHandler'
import DownstreamServices from '../../../helper/DownstreamServices'
import YGOCardWithImage from '../YGOCardWithImage'

import '../../../css/card/ygo-card-suggestion.css'
import { GenericNonBreakingErr, Section } from 'skc-rcl'

const Hint = lazy(() =>
	import('skc-rcl').then((module) => {
		return { default: module.Hint }
	})
)

const SuggestionSection = lazy(() => import('./SuggestionSection'))
const YGOCardWithQuantity = lazy(() => import('../YGOCardWithQuantity'))

type _CardSuggestion = {
	cardID: string
	cardColor: cardColor
	cardName: string
}

function transformReferences(references: CardReference[]): JSX.Element[] {
	return references !== null
		? references.map((reference: CardReference) => {
				return (
					<div key={reference.card.cardID} className='suggested-ygo-card-wrapper' onClick={() => window.location.assign(`/card/${reference.card.cardID}`)}>
						<YGOCardWithQuantity card={reference.card} occurrences={reference.occurrences} />
					</div>
				)
		  })
		: []
}

function transformSupport(support: SKCCard[]): JSX.Element[] {
	return support !== null
		? support.map((reference: SKCCard) => {
				return (
					<div key={reference.cardID} className='suggested-ygo-card-wrapper' onClick={() => window.location.assign(`/card/${reference.cardID}`)}>
						<YGOCardWithImage key={reference.cardID} card={reference} />
					</div>
				)
		  })
		: []
}

const CardSuggestions: FC<_CardSuggestion> = ({ cardID, cardColor, cardName }) => {
	const [materialSuggestions, setMaterialSuggestions] = useState<JSX.Element[]>([])
	const [referenceSuggestions, setReferenceSuggestions] = useState<JSX.Element[]>([])
	const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(true)
	const [suggestionRequestHasError, setSuggestionRequestHasError] = useState<boolean>(false)

	const [materialFor, setMaterialFor] = useState<JSX.Element[]>([])
	const [referencedBy, setReferencedBy] = useState<JSX.Element[]>([])
	const [isLoadingSupport, setIsLoadingSupport] = useState<boolean>(true)
	const [supportRequestHasError, setSupportRequestHasError] = useState<boolean>(false)

	const isLoading = (): boolean => {
		return isLoadingSuggestions || isLoadingSupport
	}

	// if both requests fail, then we will consider it an error
	const hasError = (): boolean => {
		return suggestionRequestHasError && supportRequestHasError
	}

	const hasNoContent = () => {
		return materialSuggestions.length === 0 && referenceSuggestions.length === 0 && materialFor.length === 0 && referencedBy.length === 0
	}

	const LoadingUI = <Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='380px' />

	useEffect(() => {
		startTransition(() => {
			FetchHandler.handleFetch(
				`${DownstreamServices.SKC_SUGGESTION_HOST_NAME}/api/v1/suggestions/card/${cardID}`,
				(json: CardSuggestionOutput) => {
					setMaterialSuggestions(transformReferences(json.namedMaterials))
					setReferenceSuggestions(transformReferences(json.namedReferences))
					setIsLoadingSuggestions(false)
				},
				false
			)?.catch((_err) => {
				setIsLoadingSuggestions(false)
				setSuggestionRequestHasError(true)
			})

			FetchHandler.handleFetch(
				`${DownstreamServices.SKC_SUGGESTION_HOST_NAME}/api/v1/suggestions/card/${cardID}/support`,
				(json: CardSupportOutput) => {
					setMaterialFor(transformSupport(json.materialFor))
					setReferencedBy(transformSupport(json.referencedBy))
					setIsLoadingSupport(false)
				},
				false
			)?.catch((_err) => {
				setIsLoadingSupport(false)
				setSupportRequestHasError(true)
			})
		})
	}, [cardID])

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
