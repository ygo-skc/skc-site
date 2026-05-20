import { FunctionComponent, startTransition, useEffect, useState } from 'react'
import { Link, Typography } from '@mui/material'
import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'

type HealthCheckOutput = {
	version: string
	status: string
}

const Footer: FunctionComponent = () => {
	const [skcAPIVersion, setSkcAPIVersion] = useState('---')
	const [heartAPIVersion, setHeartAPIVersion] = useState('---')
	const [skcSuggestionEngineVersion, setSkcSuggestionEngineVersion] = useState('---')

	useEffect(() => {
		startTransition(() => {
			FetchHandler.handleFetch<HealthCheckOutput>(
				DownstreamServices.NAME_maps_ENDPOINT.status,
				(json) => {
					setSkcAPIVersion(json?.version)
				},
				false
			)?.catch(() => {})

			FetchHandler.handleFetch<HealthCheckOutput>(
				DownstreamServices.HEART_API_ENDPOINTS.status,
				(json) => {
					setHeartAPIVersion(json?.version)
				},
				false
			)?.catch(() => {})

			FetchHandler.handleFetch<HealthCheckOutput>(
				DownstreamServices.SKC_SUGGESTION_ENDPOINTS.status,
				(json) => {
					setSkcSuggestionEngineVersion(json?.version)
				},
				false
			)?.catch(() => {})
		})
	}, [])

	const versions = [
		{ label: 'SKC Web', value: `v${process.env.REACT_APP_VERSION}` },
		{ label: 'SKC API', value: `v${skcAPIVersion}` },
		{ label: 'Heart API', value: `v${heartAPIVersion}` },
		{ label: 'SKC Suggestion Engine', value: `v${skcSuggestionEngineVersion}` },
	]

	return (
		<footer className='footer'>
			<div className='footer-wrapper'>
				<div className='footer-grid'>
					<div className='footer-col'>
						<Typography className='footer-col-label' variant='h6'>
							The Supreme King's Castle
						</Typography>
						<Typography className='footer-font' variant='body1'>
							Copyright 2026
						</Typography>
						<Typography className='footer-font' variant='body1'>
							Konami owns all rights to Yu-Gi-Oh! and all card images used in this website.
						</Typography>
						<Typography className='footer-font' variant='body1'>
							This site is not affiliated with Konami and all assets are used under Fair Use.
						</Typography>
					</div>

					<div className='footer-col'>
						<Typography className='footer-col-label' variant='h6'>
							System Info
						</Typography>
						<div className='footer-versions'>
							{versions.map(({ label, value }) => (
								<div key={label} className='footer-version-row'>
									<Typography className='footer-font footer-version-label' variant='body1'>
										{label}
									</Typography>
									<Typography className='footer-font' variant='body1'>
										{value}
									</Typography>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className='footer-bottom'>
					<Link className='footer-link' href='/privacy' underline='none'>
						<Typography className='footer-font' variant='body1'>
							Privacy Policy &rarr;
						</Typography>
					</Link>
				</div>
			</div>
		</footer>
	)
}

export default Footer
