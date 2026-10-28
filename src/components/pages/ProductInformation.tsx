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
import ProductSuggestions from '../product/ProductSuggestions'
import { recordProductView } from '../../helper/RecentlyViewed'
import { useHistoryEntryReducer } from '../util/useHistoryEntry'

// the product and its suggestions have answered (or failed), so coming back to it can show it without fetching again
const isProductSettled = (state: ReturnType<typeof productInformationReducer>) => state.productName !== '' && !state.productCardSuggestions.isFetchingData

export default function ProductInformation() {
	const [state, productInformationDispatch, isProductRestored] = useHistoryEntryReducer(
		'product-information',
		productInformationReducer,
		{
			pageBreadcrumbs: ['Home', 'Product Browse', ''],
			productId: useParams<{ productId: string }>().productId ?? '',
			productName: '',
			productCardSuggestions: {
				suggestions: { namedMaterials: [], namedReferences: [], materialArchetypes: [], referencedArchetypes: [] },
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

		FetchHandler.handleFetch<YGOProduct.Info>(`${DownstreamServices.SKC_API_ENDPOINTS.productDetails}/${state.productId}/en`, (productInfo: YGOProduct.Info) => {
			productInformationDispatch({
				type: ProductInformationActionType.UPDATE_PRODUCT,
				productInformation: productInfo,
			})
			// only once the product loads, so a bad id never lands in the history
			recordProductView(productInfo)
		})

		FetchHandler.handleFetch(
			`${DownstreamServices.SKC_SUGGESTION_ENDPOINTS.productCardSuggestions}/${state.productId}`,
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
	}, [isProductRestored])

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

			<ProductSuggestions
				suggestions={state.productCardSuggestions.suggestions}
				support={state.productCardSuggestions.support}
				isLoading={state.productCardSuggestions.isFetchingData}
				hasError={state.productCardSuggestions.requestHasError}
			/>
		</div>
	)
}
