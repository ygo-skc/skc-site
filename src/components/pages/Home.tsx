import DatabaseInfo from '../util/DatabaseInfo'
import UpcomingTCGProducts from '../util/event/UpcomingTCGProducts'
import Welcome from '../home/Welcome'
import { Section } from 'skc-rcl'
import CardOfTheDay from '../card/CardOfTheDay'
import { Suspense, lazy, useEffect, useReducer } from 'react'
import { Skeleton } from '@mui/material'
import Trends from '../util/Trending'
import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'
import { HomePageActionType, homePageReducer } from '../../reducers/HomePageReducer'
import DiscordPresence from '../util/social/DiscordPresence'
import YouTubeData, { channelIDs, YouTubeChannelID } from '../home/YouTubeData'

import '../../css/util/headline.css'

const Breadcrumb = lazy(() => import('../header-footer/Breadcrumb'))

export default function Home() {
	const [{ dbStats, cotd, upcomingTCGProducts, skcYTUploads }, dispatch] = useReducer(homePageReducer, {
		dbStats: { cardTotal: 0, productTotal: 0, banListTotal: 0, isFetchingData: true, requestHasError: false },
		cotd: {
			date: '',
			version: 0,
			card: {
				cardID: '',
				cardName: '',
				cardColor: undefined,
				cardEffect: '',
				cardAttribute: '',
				monsterType: '',
				monsterAttack: '',
				monsterDefense: '',
				monsterAssociation: undefined,
			},
			isFetchingData: true,
			requestHasError: false,
		},
		upcomingTCGProducts: {
			service: '',
			events: [],
			isFetchingData: true,
			requestHasError: false,
		},
		skcYTUploads: {
			videos: [],
			total: 0,
			isFetchingData: true,
			requestHasError: false,
		},
	})

	useEffect(() => {
		// fetch DB Stats
		FetchHandler.handleFetch<SKC.DBStats>(DownstreamServices.NAME_maps_ENDPOINT.databaseStats, (json: SKC.DBStats) => {
			dispatch({ type: HomePageActionType.UPDATE_DB_STATS, dbStats: json })
		})

		// fetch card of the day
		FetchHandler.handleFetch(
			DownstreamServices.SKC_SUGGESTION_ENDPOINTS.cardOfTheDay,
			(json: SKC.CardOfTheDay) => {
				dispatch({ type: HomePageActionType.UPDATE_COTD, cotd: json })
			},
			false
		)?.catch(() => {
			dispatch({ type: HomePageActionType.FETCH_COTD_ERROR })
		})

		// fetch upcoming products
		FetchHandler.handleFetch(
			`${DownstreamServices.HEART_API_ENDPOINTS.events}?service=skc&tags=product-release`,
			(upcomingTCGProducts: HeartAPI.Event) => {
				dispatch({ type: HomePageActionType.UPDATE_UPCOMING_TCG, upcomingTCGProducts: upcomingTCGProducts })
			},
			false
		)?.catch(() => {
			dispatch({ type: HomePageActionType.FETCH_UPCOMING_TCG_ERROR })
		})

		// fetch skc yt channel videos
		FetchHandler.handleFetch<HeartAPI.YouTubeUploadsResponse>(
			`${DownstreamServices.HEART_API_ENDPOINTS.ytUploads}?channelId=${channelIDs.get(YouTubeChannelID.SKC)!.toString()}`,
			(skcYTUploads: HeartAPI.YouTubeUploadsResponse) => {
				dispatch({ type: HomePageActionType.UPDATE_SKC_YOUTUBE_UPLOADS, skcYTUploads: skcYTUploads })
			},
			false
		)?.catch(() => {
			dispatch({ type: HomePageActionType.FETCH_SKC_YOUTUBE_UPLOADS_ERROR })
		})
	}, [])

	return (
		<div className='generic-container'>
			<title>The Supreme Kings Castle</title>
			<meta name={`The Supreme Kings Castle`} content={`YuGiOh Site for checking; card information, current and past ban lists, search cards, and browse cards.`} />
			<meta name='keywords' content={`YuGiOh, ban list, card info, The Supreme Kings Castle`} />

			<Suspense fallback={<Skeleton className='breadcrumb breadcrumb__loading' variant='rectangular' width={260} height={30} />}>
				<Breadcrumb crumbs={['Home']} />
			</Suspense>

			<div className='headline-v2'>
				<DatabaseInfo stats={dbStats} />

				<Trends />

				<section className='suggestions' aria-label='Suggestions'>
					<CardOfTheDay cardOfTheDayData={cotd} />
					<DiscordPresence />
				</section>
			</div>

			<UpcomingTCGProducts upcomingTCGProducts={upcomingTCGProducts} />

			<Section sectionName='Welcome'>
				<div className='section-content'>
					<div className='multi-section'>
						<Welcome />
					</div>
					<div className='multi-section'>
						<YouTubeData channel={YouTubeChannelID.SKC} uploadsData={skcYTUploads} />
					</div>
				</div>
			</Section>
		</div>
	)
}
