import { FunctionComponent, Suspense, lazy } from 'react'
import { Helmet } from 'react-helmet'

import { Link, Skeleton, Typography } from '@mui/material'
import { Section } from 'skc-rcl'

import '../../css/main-pages/privacy.css'
const Breadcrumb = lazy(() => import('../header-footer/Breadcrumb'))

const Privacy: FunctionComponent = () => {
	return (
		<div className='generic-container'>
			<Helmet>
				<title>{`SKC - About`}</title>
				<meta name={`SKC - Privacy`} content={`Privacy policy for site and mobile app`} />
				<meta name='keywords' content={`YuGiOh, YGO-API, support, The Supreme Kings Castle`} />
			</Helmet>

			<Suspense fallback={<Skeleton className='breadcrumb-skeleton' variant='rectangular' width='100%' height='2.5rem' />}>
				<Breadcrumb crumbs={['Home', 'Privacy']} />
			</Suspense>

			<Section sectionName='Privacy Policy - Updated November 1, 2024'>
				<div className='section-content policy'>
					<Typography variant='body1'>
						The <strong>SKC Website</strong> and the mobile app <strong>SKC - Yugioh Card Database</strong> is committed to protecting and respecting your privacy. This Privacy
						Policy explains how we collect, use, and disclose information about you when you use our app.
					</Typography>

					<Typography variant='h4'>1. Information We Collect</Typography>
					<Typography variant='h6'>IP Address</Typography>
					<Typography>
						When you use the <strong>SKC Website</strong> or the mobile app <strong>SKC - Yugioh Card Database</strong>, we automatically collect your IP address. This information
						helps us improve our service, monitor app usage, and generate trending data.
					</Typography>

					<Typography variant='h6'>Search Patterns</Typography>
					<Typography>
						We track search patterns within the app to create trending data. This data is used solely for analyzing trends and enhancing the user experience, not for identifying
						individual users.
					</Typography>

					<Typography variant='h6'>Usage Data</Typography>
					<Typography>We may also collect certain information about your use of the app, including time and date of access and specific interactions with app features.</Typography>

					<Typography variant='h4'>2. How We Use Your Information</Typography>
					<Typography>
						We use the information we collect for the following purposes:
						<ul>
							<li>
								<strong>To Improve Our Services:</strong> By analyzing usage trends, we can make our app more relevant and useful for our users.
							</li>
							<li>
								<strong>For Security and Monitoring:</strong> Collecting IP addresses helps us protect our service from abuse and unauthorized access.
							</li>
							<li>
								<strong>To Generate Trending Data:</strong> We aggregate search patterns to create trending topics and insights that benefit our community.
							</li>
						</ul>
					</Typography>

					<Typography variant='h4'>3. How We Store and Protect Your Information</Typography>
					<Typography>
						We store your information securely in a MongoDB database hosted on AWS (Amazon Web Services). AWS provides industry-standard security measures to protect data, and we
						take additional steps to safeguard the information we collect. However, please note that no data transmission over the internet or storage system can be guaranteed to
						be 100% secure.
					</Typography>

					<Typography variant='h4'>4. Data Sharing and Disclosure</Typography>
					<Typography>
						We do not share or sell any personal information to third parties. All information collected, including IP addresses and search data, is used solely within our app and
						for purposes outlined in this Privacy Policy.
					</Typography>

					<Typography variant='h4'>5. Your Data Rights</Typography>
					<Typography>
						Depending on your location, you may have certain rights regarding your personal information. Since we collect only your IP address and search patterns, any requests
						regarding your data must include the specific IP address you used when accessing our app. These rights may include:
						<ul>
							<li>Access to the information we hold about you</li>
							<li>Correction of inaccurate or incomplete data related to your IP address, where applicable</li>
							<li>Deletion of data associated with your IP address, under certain conditions</li>
						</ul>
					</Typography>

					<Typography>
						To exercise any of these rights, please contact us at{' '}
						<Link className='link' color='secondary' href='mailto:admin@skc.cards'>
							admin@skc.cards
						</Link>
						.
					</Typography>

					<Typography variant='h4'>6. Changes to This Privacy Policy</Typography>
					<Typography>
						We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy in the app. We encourage you to review this
						Privacy Policy periodically for any updates.
					</Typography>

					<Typography variant='h4'>7. Contact Us</Typography>
					<Typography>
						If you have any questions about this Privacy Policy, please contact us via email:
						<Link className='link' color='secondary' href='mailto:admin@skc.cards'>
							admin@skc.cards
						</Link>
					</Typography>
				</div>
			</Section>
		</div>
	)
}

export default Privacy
