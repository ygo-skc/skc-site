import { Helmet } from 'react-helmet'
import OneThirdTwoThirdsGrid from '../util/grid/OneThirdTwoThirdsGrid'

import DatabaseInfo from '../util/database-info/DatabaseInfo'
import UpcomingTCGProducts from '../util/event/UpcomingTCGProducts'
import Welcome from '../home/Welcome'
import { Section } from 'skc-rcl'
import CardOfTheDay from '../card/CardOfTheDay'
import { Fragment, Suspense, lazy } from 'react'
import { Skeleton } from '@mui/material'

const Breadcrumb = lazy(() => import('../header-footer/Breadcrumb'))
const SocialMedia = lazy(() => import('../util/social/SocialMedia'))
const YouTubeData = lazy(() => import('../home/YouTubeData'))

export default function Home() {
	return (
		<div className='generic-container'>
			<Helmet>
				<title>The Supreme Kings Castle</title>
				<meta name={`The Supreme Kings Castle`} content={`YuGiOh Site for checking; card information, current and past ban lists, search cards, and browse cards.`} />
				<meta name='keywords' content={`YuGiOh, ban list, card info, The Supreme Kings Castle`} />
			</Helmet>

			<Suspense fallback={<Skeleton className='breadcrumb-skeleton' variant='rectangular' width='100%' height='2.5rem' />}>
				<Breadcrumb crumbs={['Home']} />
			</Suspense>

			<OneThirdTwoThirdsGrid
				mirrored={true}
				oneThirdComponent={<CardOfTheDay />}
				twoThirdComponent={
					<Fragment>
						<DatabaseInfo />
						<UpcomingTCGProducts />
					</Fragment>
				}
			/>

			<OneThirdTwoThirdsGrid
				mirrored={true}
				oneThirdComponent={
					<Section sectionName='Social'>
						<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='7rem' />}>
							<SocialMedia />
						</Suspense>
					</Section>
				}
				twoThirdComponent={
					<Section sectionName='Welcome'>
						<div className='section-content'>
							<div className='multi-section'>
								<Welcome />
							</div>
							<div className='multi-section'>
								<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='7rem' />}>
									<YouTubeData channel='skc' />
								</Suspense>
							</div>
						</div>
					</Section>
				}
			/>
		</div>
	)
}
