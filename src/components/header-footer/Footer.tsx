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
			// fetch version for SKC API
			FetchHandler.handleFetch<HealthCheckOutput>(
				DownstreamServices.NAME_maps_ENDPOINT.status,
				(json) => {
					setSkcAPIVersion(json?.version)
				},
				false
			)?.catch(() => {})

			// FetchHandler version for SKC API
			FetchHandler.handleFetch<HealthCheckOutput>(
				DownstreamServices.HEART_API_ENDPOINTS.status,
				(json) => {
					setHeartAPIVersion(json?.version)
				},
				false
			)?.catch(() => {})

			// FetchHandler version for SKC Suggestion Engine
			FetchHandler.handleFetch<HealthCheckOutput>(
				DownstreamServices.SKC_SUGGESTION_ENDPOINTS.status,
				(json) => {
					setSkcSuggestionEngineVersion(json?.version)
				},
				false
			)?.catch(() => {})
		})
	}, [])

	return (
		<div className='footer'>
			<div className='footer-wrapper'>
				<Typography className='footer-font' variant='body1' align='center'>
					Copyright 2024
				</Typography>

				<Typography className='footer-font' variant='body1' align='center'>
					Konami owns all rights to Yu-Gi-Oh! and all card images used in this website.
				</Typography>
				<Typography className='footer-font' variant='body1' align='center'>
					This site is not affiliated with Konami and all assets are used under Fair Use.
				</Typography>

				<br />

				<Typography className='footer-font' variant='h6' align='center'>
					System Info
				</Typography>
				<Typography className='footer-font' variant='body1' align='center'>
					<strong>SKC Web:</strong> v{process.env.REACT_APP_VERSION}
				</Typography>
				<Typography className='footer-font' variant='body1' align='center'>
					<strong>SKC API:</strong> v{skcAPIVersion}
				</Typography>
				<Typography className='footer-font' variant='body1' align='center'>
					<strong>Heart API:</strong> v{heartAPIVersion}
				</Typography>
				<Typography className='footer-font' variant='body1' align='center'>
					<strong>SKC Suggestion Engine:</strong> v{skcSuggestionEngineVersion}
				</Typography>

				<br />

				<Typography className='footer-font' variant='h6' align='center'>
					<Link className='footer-link' href='/privacy'>
						Privacy Policy ➡️
					</Link>
				</Typography>
			</div>
		</div>
	)
}

export default Footer
