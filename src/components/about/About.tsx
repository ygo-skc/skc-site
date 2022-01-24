import { FunctionComponent } from 'react'
import { Helmet } from 'react-helmet'

import Breadcrumb from '../header-footer/Breadcrumb'
import Section from '../util/Section'
import AboutSKC from './AboutSKC'
import Overview from './AboutServices'

const About: FunctionComponent = () => {
	return (
		<div className='generic-container'>
			<Helmet>
				<title>{`SKC - About`}</title>
				<meta name={`SKC - About`} content={`Find how to use API backed by site, how to support, etc.`} />
				<meta name='keywords' content={`YuGiOh, about, YGO-API, support, The Supreme Kings Castle`} />
			</Helmet>

			<Breadcrumb crumbs={['Home', 'About']} />

			<Section maxWidth='80%' sectionName='About SKC' sectionContent={<AboutSKC />} />
			<Section sectionName='Everything You Might Want To Know' sectionContent={<Overview />} />
		</div>
	)
}

export default About
