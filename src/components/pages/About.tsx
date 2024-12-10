import { FunctionComponent, Suspense, lazy } from 'react'

import AboutSKC from '../about/AboutSKC'
import Overview from '../about/Overview'

import '../../css/main-pages/about.css'
import { Section } from 'skc-rcl'
import { Skeleton } from '@mui/material'

const Breadcrumb = lazy(() => import('../header-footer/Breadcrumb'))

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
				<AboutSKC />
			</Section>
			<Section sectionName='Everything You Might Want To Know'>
				<Overview />
			</Section>
		</div>
	)
}

export default About
