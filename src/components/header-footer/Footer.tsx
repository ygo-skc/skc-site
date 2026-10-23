import '../../css/header-footer/footer.css'

import { FunctionComponent, startTransition, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'
import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'
import AppRoutes from '../../helper/AppRoutes'

type HealthCheckOutput = {
	version: string
	status: string
}

const exploreLinks = [
	{ to: AppRoutes.BanList, label: 'Ban List' },
	{ to: AppRoutes.CardBrowse, label: 'Card Browse' },
	{ to: AppRoutes.ProductBrowse, label: 'Product Browse' },
	{ to: AppRoutes.Privacy, label: 'Privacy Policy' },
]

const Footer: FunctionComponent = () => {
	const [skcAPIVersion, setSkcAPIVersion] = useState('---')
	const [heartAPIVersion, setHeartAPIVersion] = useState('---')
	const [skcSuggestionEngineVersion, setSkcSuggestionEngineVersion] = useState('---')

	useEffect(() => {
		FetchHandler.handleFetch<HealthCheckOutput>(DownstreamServices.NAME_maps_ENDPOINT.status, (json) => startTransition(() => setSkcAPIVersion(json?.version)), false)?.catch(
			() => {}
		)

		FetchHandler.handleFetch<HealthCheckOutput>(DownstreamServices.HEART_API_ENDPOINTS.status, (json) => startTransition(() => setHeartAPIVersion(json?.version)), false)?.catch(
			() => {}
		)

		FetchHandler.handleFetch<HealthCheckOutput>(
			DownstreamServices.SKC_SUGGESTION_ENDPOINTS.status,
			(json) => startTransition(() => setSkcSuggestionEngineVersion(json?.version)),
			false
		)?.catch(() => {})
	}, [])

	const systemInfo = [
		{ name: 'SKC Web', version: process.env.REACT_APP_VERSION },
		{ name: 'SKC API', version: skcAPIVersion },
		{ name: 'Heart API', version: heartAPIVersion },
		{ name: 'Suggestion Engine', version: skcSuggestionEngineVersion },
	]

	return (
		<footer className='site-footer'>
			<div className='site-footer__content'>
				<section className='site-footer__about'>
					<Typography variant='h6' component='p' className='site-footer__brand'>
						SKC
					</Typography>
					<Typography variant='caption' component='p'>
						© 2026. Konami owns all rights to Yu-Gi-Oh! and all card images used on this site.
					</Typography>
					<Typography variant='caption' component='p'>
						Not affiliated with Konami; assets used under Fair Use.
					</Typography>
				</section>

				<section aria-labelledby='site-footer-system-info'>
					<Typography variant='subtitle2' component='h2' id='site-footer-system-info' className='site-footer__heading'>
						System Info
					</Typography>
					<dl className='site-footer__versions'>
						{systemInfo.map(({ name, version }) => (
							<div key={name} className='site-footer__version'>
								<Typography variant='caption' component='dt'>
									{name}
								</Typography>
								<Typography variant='caption' component='dd'>
									v{version}
								</Typography>
							</div>
						))}
					</dl>
				</section>

				<nav aria-labelledby='site-footer-explore'>
					<Typography variant='subtitle2' component='h2' id='site-footer-explore' className='site-footer__heading'>
						Explore
					</Typography>
					<ul className='site-footer__links'>
						{exploreLinks.map(({ to, label }) => (
							<Typography key={to} variant='body2' component='li'>
								<Link to={to}>{label}</Link>
							</Typography>
						))}
					</ul>
				</nav>
			</div>
		</footer>
	)
}

export default Footer
