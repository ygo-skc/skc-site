import { FunctionComponent, Suspense, lazy } from 'react'

import '../../css/main-pages/about.css'
import { Section } from 'skc-rcl'
import { Skeleton } from '@mui/material'

const Breadcrumb = lazy(() => import('../header-footer/Breadcrumb'))
const AboutSKC = lazy(() => import('../about/AboutSKC'))
const Overview = lazy(() => import('../about/Overview'))

const About: FunctionComponent = () => {
	return (
		<div className='generic-container'>
			<title>{`SKC - About`}</title>
			<meta name={`SKC - About`} content={`Find how to use API backed by site, how to support, etc.`} />
			<meta name='keywords' content={`YuGiOh, about, YGO-API, support, The Supreme Kings Castle`} />

			<Suspense fallback={<Skeleton className='breadcrumb-skeleton' variant='rectangular' width='100%' height='2.5rem' />}>
				<Breadcrumb crumbs={['Home', 'About']} />
			</Suspense>

			<Section maxWidth='1000px' sectionName='About SKC'>
				<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='20rem' />}>
					<AboutSKC />
				</Suspense>
			</Section>
			<Section sectionName='Everything You Might Want To Know'>
				<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='40rem' />}>
					<Overview />
				</Suspense>
			</Section>
		</div>
	)
}

export default About
