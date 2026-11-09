import { FC } from 'react'

import SuggestionsSheet from '../../util/SuggestionsSheet'

type CardSuggestionProps = Omit<YGOCard.Suggestion, 'card' | 'relevantArchetypes' | 'materialArchetypes' | 'referencedArchetypes' | 'hasSelfReference'> &
	Omit<YGOCard.Support, 'card'> & {
		cardName: string
		isFetchingSuggestions: boolean
		isFetchingSupport: boolean
		suggestionRequestHasError: boolean
		supportRequestHasError: boolean
	}

// the product page's suggestions sheet in one card's words - an error only when both requests fail, otherwise it shows what loaded
const CardSuggestions: FC<CardSuggestionProps> = ({
	namedMaterials,
	namedReferences,
	materialFor,
	referencedBy,
	isFetchingSuggestions,
	isFetchingSupport,
	suggestionRequestHasError,
	supportRequestHasError,
	cardName,
}) => {
	// the suggestions can answer before the card does
	const name = cardName || 'this card'

	return (
		<SuggestionsSheet
			suggestions={{ namedMaterials, namedReferences }}
			support={{ materialFor, referencedBy }}
			isLoading={isFetchingSuggestions || isFetchingSupport}
			hasError={suggestionRequestHasError && supportRequestHasError}
			skeletonColumns={2}
			// halfway between a card with a few links and one with full columns, so neither moves the page far when they arrive
			skeletonRows={4}
			wording={{
				intro: `Cards that ${name} names, or that name it`,
				empty: 'No suggestions for this card.',
				namedMaterials: `Named as summoning material by ${name}`,
				materialFor: `Can use ${name} as material`,
				namedReferences: `Mentioned in ${name}'s text`,
				referencedBy: `Mention ${name} in their text`,
			}}
		/>
	)
}

export default CardSuggestions
