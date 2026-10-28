import { ReactNode, useEffect } from 'react'
import { Link } from 'react-router-dom'
import FetchHandler from '../../helper/FetchHandler'
import * as DownstreamServices from '../../helper/DownstreamServices'
import * as Dates from '../../helper/Dates'
import { TrendActionType, trendsReducer } from '../../reducers/TrendingReducer'

import { Chip, Divider, Skeleton, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { CardImageRounded, ProductImage } from 'skc-rcl'

import '../../css/util/trending.css'
import { useHistoryEntryReducer, useHistoryEntryState } from './useHistoryEntry'
import CardFrameRing from './CardFrameRing'

type TrendKind = 'CARD' | 'PRODUCT'

type TrendItem = {
	id: string
	name: string
	link: string
	change: number
	occurrences: number
	detail: string // text that will display in spotlight child only - cards get card effect, products get product metadata
	color?: YGOCard.Color // cards only - the frame colour and its name, e.g. 'Pendulum-Effect' -> 'Pendulum Effect'
	typeLabel?: string
	image: (spotlight: boolean) => ReactNode
}

// how many trends to show - #1 in the banner, the rest in the list. the api returns 10
const TREND_COUNT = 10

// how far a trend moved - the arrow is for sighted readers, the words for screen readers (aria-label is ignored on a plain span or div)
function describeChange(change: number) {
	if (change > 0) return { direction: 'up', arrow: '▲', amount: change, words: `Up ${change}` }
	if (change < 0) return { direction: 'down', arrow: '▼', amount: -change, words: `Down ${-change}` }
	return { direction: 'same', arrow: '–', amount: undefined, words: 'No change' }
}

const ChangeText = ({ change, spaced }: { change: number; spaced?: boolean }) => {
	const { arrow, amount, words } = describeChange(change)

	return (
		<>
			<span aria-hidden='true'>{amount === undefined ? arrow : `${arrow}${spaced ? ' ' : ''}${amount}`}</span>
			<span className='trending__sr-only'>{words}</span>
		</>
	)
}

const TrendChange = ({ change }: { change: number }) => (
	<Chip size='small' className={`trending__change trending__change--${describeChange(change).direction}`} label={<ChangeText change={change} spaced />} />
)

// type and hit count for cards. Products will just get hit count
const TrendMeta = ({ item, showHits = true }: { item: TrendItem; showHits?: boolean }) => {
	const text = [item.typeLabel, showHits && `${item.occurrences} hits`].filter(Boolean).join(' · ')
	if (!text) return null

	return (
		<Typography variant='body2' className='trending__meta'>
			{text}
		</Typography>
	)
}

// both lists have answered (or failed), so coming back to Home can show them without fetching again
const isSettled = ({ cardTrendData, productTrendData }: ReturnType<typeof trendsReducer>) => !cardTrendData.isFetchingData && !productTrendData.isFetchingData

const Trends = () => {
	const [kind, setKind] = useHistoryEntryState<TrendKind>('trending-kind', 'CARD')
	const [{ cardTrendData, productTrendData }, dispatch, isRestored] = useHistoryEntryReducer(
		'trending',
		trendsReducer,
		{
			cardTrendData: {
				metrics: [],
				isFetchingData: true,
				requestHasError: false,
			},
			productTrendData: {
				metrics: [],
				isFetchingData: true,
				requestHasError: false,
			},
		},
		isSettled
	)

	useEffect(() => {
		if (isRestored) return

		FetchHandler.handleFetch<YGOCard.CardTrendData>(
			`${DownstreamServices.SKC_SUGGESTION_ENDPOINTS.trending}/CARD`,
			(trendingData: YGOCard.CardTrendData) => {
				dispatch({ type: TrendActionType.UPDATE_CARD_TRENDS, cardTrendData: trendingData })
			},
			false
		)?.catch(() => {
			dispatch({ type: TrendActionType.FETCH_CARD_TRENDS_ERROR })
		})

		FetchHandler.handleFetch<YGOCard.ProductTrendData>(
			`${DownstreamServices.SKC_SUGGESTION_ENDPOINTS.trending}/PRODUCT`,
			(trendingData: YGOCard.ProductTrendData) => {
				dispatch({ type: TrendActionType.UPDATE_PRODUCT_TRENDS, productTrendData: trendingData })
			},
			false
		)?.catch(() => {
			dispatch({ type: TrendActionType.FETCH_PRODUCT_TRENDS_ERROR })
		})
	}, [isRestored])

	const isFetchingData = kind === 'CARD' ? cardTrendData.isFetchingData : productTrendData.isFetchingData
	const items: TrendItem[] =
		kind === 'CARD'
			? cardTrendData.metrics.map(({ resource, change, occurrences }: YGOCard.CardTrendResource) => ({
					id: resource.cardID,
					name: resource.cardName,
					link: `/card/${resource.cardID}`,
					change,
					occurrences,
					detail: resource.cardEffect,
					color: resource.cardColor,
					typeLabel: resource.cardColor?.replace(/-/g, ' '),
					image: (spotlight: boolean) => (
						<CardImageRounded size={spotlight ? 'lg' : 'tn'} variant={spotlight ? 'rounded-rect' : 'circle'} cardID={resource.cardID} loading='eager' />
					),
			  }))
			: productTrendData.metrics.map(({ resource, change, occurrences }: YGOCard.ProductTrendResource) => ({
					id: resource.productId,
					name: resource.productName,
					link: `/product/${resource.productId}`,
					change,
					occurrences,
					detail: [resource.productType, resource.productReleaseDate && `Released ${Dates.fromYYYYMMDDToDateStr(resource.productReleaseDate)}`].filter(Boolean).join(' · '),
					image: (spotlight: boolean) => <ProductImage size={spotlight ? 'lg' : 'tn'} productID={resource.productId} loading='eager' className='trending__product-img' />,
			  }))
	const top = items.slice(0, TREND_COUNT)

	const spotlight = top[0]

	return (
		<div className='trending'>
			<div className='trending__sheet'>
				<div className='trending__header'>
					<Typography variant='h4'>Trending</Typography>
					<ToggleButtonGroup className='trending__tabs' exclusive aria-label='Trending type' value={kind} onChange={(_, value: TrendKind | null) => value && setKind(value)}>
						<ToggleButton value='CARD'>Cards</ToggleButton>
						<ToggleButton value='PRODUCT'>Products</ToggleButton>
					</ToggleButtonGroup>
				</div>

				<Divider className='trending__divider' />

				{isFetchingData ? (
					<Skeleton className='trending__skeleton' variant='rectangular' width='100%' />
				) : top.length === 0 ? (
					<Typography variant='body2' className='trending__empty'>
						Nothing trending right now
					</Typography>
				) : (
					<>
						<Link to={spotlight.link} className='trending__spotlight'>
							<div className='trending__spotlight-img'>{spotlight.image(true)}</div>
							<div className='trending__spotlight-text'>
								<Typography variant='overline' className='trending__eyebrow'>
									#1 trending
								</Typography>
								<Typography variant='h5' component='p' className='trending__spotlight-name'>
									{spotlight.name}
								</Typography>
								<TrendMeta item={spotlight} showHits={false} />
								{spotlight.detail && (
									<Typography variant='body2' className='trending__detail'>
										{spotlight.detail}
									</Typography>
								)}
							</div>
							<div className='trending__stats'>
								<div className='trending__stat'>
									<Typography variant='h4' component='span' className='trending__stat-value'>
										{spotlight.occurrences}
									</Typography>
									<Typography variant='caption' className='trending__stat-label'>
										hits
									</Typography>
								</div>
								<div className={`trending__stat trending__stat--${describeChange(spotlight.change).direction}`}>
									<Typography variant='h4' component='span' className='trending__stat-value'>
										<ChangeText change={spotlight.change} />
									</Typography>
									<Typography variant='caption' className='trending__stat-label'>
										{spotlight.change === 0 ? 'no change' : 'places'}
									</Typography>
								</div>
							</div>
						</Link>

						<Divider className='trending__divider' />

						{/* #1 is repeated as a plain row, shown only when the section is too narrow for the spotlight */}
						<ol className='trending__list'>
							{top.map((item, index) => (
								<li key={item.id} className={index === 0 ? 'trending__row trending__row--first' : 'trending__row'}>
									<Link to={item.link} className='trending__row-link'>
										<Typography variant='subtitle2' component='span' className='trending__rank'>
											{index + 1}
										</Typography>
										<CardFrameRing cardColor={item.color}>
											<div className='trending__thumb'>{item.image(false)}</div>
										</CardFrameRing>
										<div className='trending__row-text'>
											<Typography variant='subtitle2' component='span' className='trending__name'>
												{item.name}
											</Typography>
											<TrendMeta item={item} />
										</div>
										<TrendChange change={item.change} />
									</Link>
								</li>
							))}
						</ol>
					</>
				)}
			</div>
		</div>
	)
}

export default Trends
