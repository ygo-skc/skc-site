import { lazy, Suspense } from 'react'
import { Helmet } from 'react-helmet'
import OneThirdTwoThirdsGrid from '../util/grid/OneThirdTwoThirdsGrid'
import Section from '../util/generic/Section'

import Breadcrumb from '../header-footer/Breadcrumb'
import DatabaseInfo from '../util/database-info/DatabaseInfo'
import UpcomingTCGProducts from '../util/event/UpcomingTCGProducts'
import Welcome from '../home/Welcome'

const YouTubeData = lazy(() => import('../home/YouTubeData'))
const SocialMedia = lazy(() => import('../util/social/SocialMedia'))

export default function Home() {
	return (
		<div className='generic-container'>
			<Helmet>
				<title>The Supreme Kings Castle</title>
				<meta name={`The Supreme Kings Castle`} content={`YuGiOh Site for checking; card information, current and past ban lists, search cards, and browse cards.`} />
				<meta name='keywords' content={`YuGiOh, ban list, card info, The Supreme Kings Castle`} />
			</Helmet>

			<Breadcrumb crumbs={['Home']} />
			<DatabaseInfo />
			<UpcomingTCGProducts />

			<OneThirdTwoThirdsGrid
				mirrored={true}
				oneThirdComponent={
					<Section
						sticky
						sectionName='Social'
						sectionContent={
							<Suspense fallback={null}>
								<SocialMedia /> /
							</Suspense>
						}
					/>
				}
				twoThirdComponent={
					<Section
						sectionName='Welcome'
						sectionContent={
							<div className='section-content'>
								<div className='multi-section'>
									<Welcome />
								</div>
								<Suspense fallback={null}>
									<div className='multi-section'>
										<YouTubeData channel='skc' />
									</div>
									<div className='multi-section'>
										<YouTubeData channel='btsc' />
									</div>
								</Suspense>
							</div>
						}
					/>
				}
			/>
		</div>
	)
}
