import { FunctionComponent } from 'react'
import { Helmet } from 'react-helmet'

import Breadcrumb from '../header-footer/Breadcrumb'
import AboutSKC from '../about/AboutSKC'
import Overview from '../about/AboutServices'

import '../../css/main-pages/about.css'
import { Section } from 'skc-rcl'

const About: FunctionComponent = () => {
	return (
		<div className='generic-container'>
			<Helmet>
				<title>{`SKC - About`}</title>
				<meta name={`SKC - About`} content={`Find how to use API backed by site, how to support, etc.`} />
				<meta name='keywords' content={`YuGiOh, about, YGO-API, support, The Supreme Kings Castle`} />
			</Helmet>

			<Breadcrumb crumbs={['Home', 'About']} />

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
