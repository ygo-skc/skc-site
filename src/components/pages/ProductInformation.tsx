import '../../css/main-pages/card-browse.css'
import '../../css/main-pages/product-information.css'

import { useEffect, startTransition } from 'react'
import { useParams } from 'react-router-dom'

import FetchHandler from '../../helper/FetchHandler'
import * as DownstreamServices from '../../helper/DownstreamServices'

import { productInformationReducer, ProductInformationActionType } from '../../reducers/ProductInformationReducer'
import Breadcrumb from '../header-footer/Breadcrumb'
import ProductInformationHeader from '../product/ProductInformationHeader'
import ProductContents from '../product/ProductContents'
import SuggestionsSheet, { SuggestionWording } from '../util/SuggestionsSheet'
import { recordProductView } from '../../helper/RecentlyViewed'
import { useHistoryEntryReducer } from '../util/useHistoryEntry'

// the product and its suggestions have answered (or failed), so coming back to it can show it without fetching again
const isProductSettled = (state: ReturnType<typeof productInformationReducer>) => state.productName !== '' && !state.productCardSuggestions.isFetchingData

const SET_WORDING: SuggestionWording = {
	intro: 'Cards outside this set that its cards name, or that name them',
	empty: 'No suggestions for this set.',
	namedMaterials: "Named as summoning material by this set's cards",
	materialFor: "Can use this set's cards as material",
	namedReferences: "Mentioned in this set's card text",
	referencedBy: "Mention this set's cards in their text",
}

export default function ProductInformation() {
	// each product gets its own mount (see Routes), so the id from the URL doesn't change while the page is up
	const { productId = '' } = useParams<{ productId: string }>()
	const [state, productInformationDispatch, isProductRestored] = useHistoryEntryReducer(
		'product-information',
		productInformationReducer,
		{
			pageBreadcrumbs: ['Home', 'Product Browse', ''],
			productId,
			productName: '',
			productCardSuggestions: {
				suggestions: { namedMaterials: [], namedReferences: [], relevantArchetypes: [], materialArchetypes: [], referencedArchetypes: [] },
				support: { referencedBy: [], materialFor: [] },
				associatedArchetypes: new Set<string>(),
				isFetchingData: true,
				requestHasError: false,
			},
		},
		isProductSettled
	)

	useEffect(() => {
		if (isProductRestored) return

		FetchHandler.handleFetch<YGOProduct.Info>(`${DownstreamServices.SKC_API_ENDPOINTS.productDetails}/${productId}/en`, (productInfo: YGOProduct.Info) => {
			productInformationDispatch({
				type: ProductInformationActionType.UPDATE_PRODUCT,
				productInformation: productInfo,
			})
			// only once the product loads, so a bad id never lands in the history
			recordProductView(productInfo)
		})

		FetchHandler.handleFetch(
			`${DownstreamServices.SKC_SUGGESTION_ENDPOINTS.productCardSuggestions}/${productId}`,
			(productCardSuggestions: YGOProduct.SuggestionData) => {
				startTransition(() => {
					productInformationDispatch({
						type: ProductInformationActionType.UPDATE_PRODUCT_CARD_SUGGESTIONS,
						productCardSuggestion: productCardSuggestions,
					})
				})
			},
			false
		)?.catch(() => {
			productInformationDispatch({
				type: ProductInformationActionType.FETCH_PRODUCT_CARD_SUGGESTIONS_ERROR,
			})
		})
	}, [isProductRestored, productId, productInformationDispatch])

	return (
		<div className='generic-container'>
			<title>{`SKC - Product: ${state.productName}`}</title>
			<meta name='description' content={`Contents, info, dates, etc for ${state.productName}`} />
			<meta name='keywords' content={`YuGiOh, product browse, The Supreme Kings Castle`} />

			<Breadcrumb crumbs={state.pageBreadcrumbs} />

			<ProductInformationHeader
				product={state.product}
				archetypes={[...state.productCardSuggestions.associatedArchetypes].sort()}
				isFetchingArchetypes={state.productCardSuggestions.isFetchingData}
			/>

			<ProductContents product={state.product} />

			<SuggestionsSheet
				suggestions={state.productCardSuggestions.suggestions}
				support={state.productCardSuggestions.support}
				isLoading={state.productCardSuggestions.isFetchingData}
				hasError={state.productCardSuggestions.requestHasError}
				wording={SET_WORDING}
			/>
		</div>
	)
}
