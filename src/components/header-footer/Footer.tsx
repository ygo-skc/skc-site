import '../../css/header-footer/footer.css'

import { FunctionComponent, startTransition, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'
import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'
import AppRoutes from '../../helper/AppRoutes'

import LavaSea from './LavaSea'

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

// [cx, cy, r, opacity] in the ember layer's 1200x300 space - clustered right so they rise away from the text
const embers = [
	[980, 230, 1.8, 1],
	[1040, 190, 1.3, 1],
	[1110, 240, 2, 1],
	[900, 250, 1.2, 1],
	[1160, 170, 1.4, 1],
	[1070, 120, 1.1, 0.7],
	[940, 150, 1, 0.6],
	[1130, 90, 1, 0.5],
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
			<div className='site-footer__scene' aria-hidden='true'>
				<svg className='site-footer__rim' viewBox='0 0 1200 12' preserveAspectRatio='none'>
					<path fill='var(--lava)' d='M0 0H1200V4l-40 3-60-2-70 4-50-3-80 3-60-2-70 4-60-3-80 3-50-2-70 3-60-3-80 4-50-3-70 2-60-3-80 4-50-2-70 3-60-3-40 2z' />
				</svg>
				<svg className='site-footer__embers' viewBox='0 0 1200 300' preserveAspectRatio='xMidYMax slice'>
					{embers.map(([cx, cy, r, opacity]) => (
						<circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} opacity={opacity} fill='var(--ember)' />
					))}
				</svg>
				<LavaSea className='site-footer__lava' />
			</div>

			<div className='site-footer__content'>
				<section className='site-footer__about'>
					<Typography variant='inherit' component='p' className='site-footer__brand'>
						SKC
					</Typography>
					<Typography variant='inherit' component='p'>
						© 2026. Konami owns all rights to Yu-Gi-Oh! and all card images used on this site.
					</Typography>
					<Typography variant='inherit' component='p'>
						Not affiliated with Konami; assets used under Fair Use.
					</Typography>
				</section>

				<section aria-labelledby='site-footer-system-info'>
					<Typography variant='inherit' component='h2' id='site-footer-system-info' className='site-footer__heading'>
						System Info
					</Typography>
					<dl className='site-footer__versions'>
						{systemInfo.map(({ name, version }) => (
							<div key={name} className='site-footer__version'>
								<Typography variant='inherit' component='dt'>
									{name}
								</Typography>
								<Typography variant='inherit' component='dd'>
									v{version}
								</Typography>
							</div>
						))}
					</dl>
				</section>

				<nav aria-labelledby='site-footer-explore'>
					<Typography variant='inherit' component='h2' id='site-footer-explore' className='site-footer__heading'>
						Explore
					</Typography>
					<ul className='site-footer__links'>
						{exploreLinks.map(({ to, label }) => (
							<li key={to}>
								<Link to={to}>{label}</Link>
							</li>
						))}
					</ul>
				</nav>
			</div>
		</footer>
	)
}

export default Footer
