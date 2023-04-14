import { FunctionComponent, startTransition, useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'

const Footer: FunctionComponent = () => {
	const [skcAPIVersion, setSkcAPIVersion] = useState('---')
	const [heartAPIVersion, setHeartAPIVersion] = useState('---')
	const [skcSuggestionEngineVersion, setSkcSuggestionEngineVersion] = useState('---')

	useEffect(() => {
		startTransition(() => {
			// fetch version for SKC API
			FetchHandler.handleFetch(
				DownstreamServices.NAME_maps_ENDPOINT['status'],
				(json) => {
					setSkcAPIVersion(json?.version)
				},
				false
			)

			// FetchHandler version for SKC API
			FetchHandler.handleFetch(
				DownstreamServices.HEART_API_ENDPOINTS.status,
				(json) => {
					setHeartAPIVersion(json?.version)
				},
				false
			)

			// FetchHandler version for SKC Suggestion Engine
			FetchHandler.handleFetch(
				DownstreamServices.SKC_SUGGESTION_ENDPOINTS.status,
				(json) => {
					setSkcSuggestionEngineVersion(json?.version)
				},
				false
			)
		})
	}, [])

	return (
		<div className='footer'>
			<div className='footer-wrapper'>
				<Typography className='footer-font' variant='body1' align='center'>
					Copyright 2023
				</Typography>

				<Typography className='footer-font' variant='body1' align='center'>
					Konami Digital Entertainment owns all rights to Yu-Gi-Oh!
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
			</div>
		</div>
	)
}

export default Footer
