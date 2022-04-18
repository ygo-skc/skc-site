import { useEffect, useState, lazy, Suspense } from 'react'
import { Helmet } from 'react-helmet'

import Fetch from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'

import OneThirdTwoThirdsGrid from '../util/grid/OneThirdTwoThirdsGrid'
import Section from '../util/Section'

import DatabaseInfo from '../util/database-info/DatabaseInfo'

const Breadcrumb = lazy(() => import('../header-footer/Breadcrumb'))
const Welcome = lazy(() => import('./Welcome'))
const Event = lazy(() => import('../util/event/Event'))
const YouTubeData = lazy(() => import('./YouTubeData'))
const SocialMedia = lazy(() => import('../util/social/SocialMedia'))

export default function Home() {
	const [cardTotal, setCardTotal] = useState(0)
	const [banListTotal, setBanListTotal] = useState(0)
	const [productTotal, setProductTotal] = useState(0)

	useEffect(() => {
		Fetch.handleFetch(DownstreamServices.NAME_maps_ENDPOINT['databaseStats'], (json) => {
			setCardTotal(json.cardTotal)
			setBanListTotal(json.banListTotal)
			setProductTotal(json.productTotal)
		})
	}, [])

	return (
		<div className='generic-container'>
			<Helmet>
				<title>The Supreme Kings Castle</title>
				<meta name={`The Supreme Kings Castle`} content={`YuGiOh Site for checking; card information, current and past ban lists, search cards, and browse cards.`} />
				<meta name='keywords' content={`YuGiOh, ban list, card info, The Supreme Kings Castle`} />
			</Helmet>

			<Suspense fallback={null}>
				<Breadcrumb crumbs={['Home']} />
				<Event />
				<DatabaseInfo cardTotal={cardTotal} banListTotal={banListTotal} productTotal={productTotal} />
			</Suspense>

			<OneThirdTwoThirdsGrid
				mirrored={true}
				oneThirdComponent={<Section sticky sectionName='Social' sectionContent={<SocialMedia />} />}
				twoThirdComponent={
					<Section
						sectionName='Welcome'
						sectionContent={
							<div className='section-content'>
								<Welcome />
								<YouTubeData channel='skc' hasDarkBackground={true} />
								<YouTubeData channel='btsc' hasDarkBackground={false} />
							</div>
						}
					/>
				}
			/>
		</div>
	)
}
