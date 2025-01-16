import '../../css/main-pages/product.css'
import '../../css/util/headline.css'

import { useEffect, lazy, useReducer, Suspense, startTransition } from 'react'
import { useParams } from 'react-router-dom'

import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'

import { Chip, Skeleton, Typography } from '@mui/material'
import ProductStats from '../product/ProductStats'
import { ProductImage, Section, SKCTable } from 'skc-rcl'
import cardDisplayGridReducer, { CardDisplayGridStateReducerActionType } from '../../reducers/CardDisplayGridReducer'
import { productInformationReducer, ProductInformationActionType } from '../../reducers/ProductInformationReducer'

const Breadcrumb = lazy(() => import('../header-footer/Breadcrumb'))
const CardDisplayGrid = lazy(() => import('../util/grid/CardDisplayGrid'))
const CardSuggestions = lazy(() => import('../card/suggestion/CardSuggestions'))

const Hint = lazy(() =>
	import('skc-rcl').then((module) => {
		return { default: module.Hint }
	})
)

export default function ProductInformation() {
	const [state, productInformationDispatch] = useReducer(productInformationReducer, {
		pageBreadcrumbs: ['Home', 'Product Browse', ''],
		productId: useParams<{ productId: string }>().productId ?? '',
		productName: '',
		productRarityStats: {},
		productSummary: [],
		productCardSuggestions: {
			suggestions: { namedMaterials: [], namedReferences: [], materialArchetypes: [], referencedArchetypes: [] },
			support: { referencedBy: [], materialFor: [] },
			associatedArchetypes: new Set<string>(),
			isFetchingData: true,
			requestHasError: false,
		},
	})

	const [gridState, cardDisplayGridDispatch] = useReducer(cardDisplayGridReducer, {
		results: [],
		totalResults: 0,
		totalDisplaying: 0,
		numItemsToLoadWhenNeeded: 0,
		isLoading: true,
	})

	useEffect(() => {
		FetchHandler.handleFetch<YGOProduct.Info>(`${DownstreamServices.NAME_maps_ENDPOINT.productDetails}/${state.productId}/en`, (productInfo: YGOProduct.Info) => {
			productInformationDispatch({
				type: ProductInformationActionType.UPDATE_PRODUCT,
				productInformation: productInfo,
			})

			const cards = productInfo.productContent.map((item: YGOProduct.Content) => item.card)
			cardDisplayGridDispatch({
				type: CardDisplayGridStateReducerActionType.INIT_GRID,
				results: cards,
				totalResults: cards.length,
				totalDisplaying: cards.length,
			})
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
	}, [])

	return (
		<div className='generic-container'>
			<title>{`SKC - Product: ${state.productName}`}</title>
			<meta name={`SKC - Product: ${state.productName}`} content={`Contents, info, dates, etc for ${state.productName}`} />
			<meta name='keywords' content={`YuGiOh, product browse, The Supreme Kings Castle`} />

			<Suspense fallback={<Skeleton className='breadcrumb-skeleton' variant='rectangular' width='100%' height='2.5rem' />}>
				<Breadcrumb crumbs={state.pageBreadcrumbs} />
			</Suspense>

			<div className='headline-v1'>
				<ProductImage className='product-info-img' productID={state.productId} size='lg' loading='eager' />

				<div className='group light-shadow'>
					<Typography variant='h3' align='center'>
						Summary
					</Typography>
					<div className='headline-section'>
						<Typography variant='h5'>Information</Typography>
						{!gridState.isLoading ? <SKCTable header={[]} rows={state.productSummary} /> : <Skeleton variant='rectangular' height='170px' />}
					</div>

					<div className='headline-section'>
						<Typography variant='h5'>Archetypes (BETA)</Typography>
						{state.productCardSuggestions.isFetchingData && <Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='5rem' />}
						{!state.productCardSuggestions.isFetchingData &&
							state.productCardSuggestions.associatedArchetypes.size !== 0 &&
							[...state.productCardSuggestions.associatedArchetypes].map((archetype) => <Chip className='dark-chip' key={archetype} label={archetype} />)}
						{!state.productCardSuggestions.isFetchingData && state.productCardSuggestions.associatedArchetypes.size === 0 && (
							<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='3rem' />}>
								<Hint variant='tight' fullWidth={false}>
									Not tied to any archetype
								</Hint>
							</Suspense>
						)}
					</div>
				</div>
			</div>

			<ProductStats isDataLoaded={!gridState.isLoading} cards={gridState.results} productRarityStats={state.productRarityStats} />

			<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='22rem' />}>
				<CardSuggestions
					namedMaterials={state.productCardSuggestions.suggestions.namedMaterials}
					namedReferences={state.productCardSuggestions.suggestions.namedReferences}
					materialFor={state.productCardSuggestions.support.materialFor}
					referencedBy={state.productCardSuggestions.support.referencedBy}
					isFetchingSuggestions={state.productCardSuggestions.isFetchingData}
					isFetchingSupport={state.productCardSuggestions.isFetchingData}
					suggestionRequestHasError={state.productCardSuggestions.requestHasError}
					supportRequestHasError={state.productCardSuggestions.requestHasError}
					cardColor={'xyz'}
					cardName={state.productName}
				/>
			</Suspense>

			<Section sectionName='Product Content'>
				<div className='section-content'>
					<Typography variant='h5'>Sorted By Pack Order</Typography>
					<CardDisplayGrid cardGridState={gridState} dispatch={cardDisplayGridDispatch} />
				</div>
			</Section>
		</div>
	)
}
