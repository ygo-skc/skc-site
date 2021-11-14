import React, { useEffect, useState, lazy, Suspense } from 'react'
import { Helmet } from 'react-helmet'

import { Typography, Link } from '@mui/material'
import { MainContentContainer } from '../MainContent'
import { handleFetch } from '../../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../../helper/DownstreamServices'
import {StickyBox} from '../util/StyledContainers'

import OneThirdTwoThirdsGrid from '../util/grid/OneThirdTwoThirdsGrid'

import { LeftBoxPaper, RightBoxPaper, RightBoxHeaderTypography, RightBoxSubHeaderTypography } from '../util/grid/OneThirdTwoThirdsGrid'

const Breadcrumb = lazy(() => import('../util/Breadcrumb'))
const Welcome = lazy(() => import('./Welcome'))
const YouTubeData = lazy(() => import('./YouTubeData'))
const SocialMedia = lazy(() => import('../util/social/SocialMedia'))
const DatabaseInfo = lazy(() => import('../util/database-info/DatabaseInfo'))


export default function Home() {
	const [cardTotal, setCardTotal] = useState(0)
	const [banListTotal, setBanListTotal] = useState(0)
	const [productTotal, setProductTotal] = useState(0)

	const [youtubeData, setYoutubeData] = useState(undefined)

	useEffect(() => {
		handleFetch(NAME_maps_ENDPOINT['databaseStats'], (json) => {
			setCardTotal(json.cardTotal)
			setBanListTotal(json.banListTotal)
			setProductTotal(json.productTotal)
		})
	}, [])


	return (
		<MainContentContainer>
			<Helmet>
				<title>The Supreme Kings Castle</title>
				<meta
					name={`The Supreme Kings Castle`}
					content={`YuGiOh Site for checking; card information, current and past ban lists, search cards, and browse cards.`}
					/>
				<meta name="keywords" content={`YuGiOh, ban list, card info, The Supreme Kings Castle`} />
			</Helmet>

			<Suspense>
				<Breadcrumb crumbs={['Home']} />
				<DatabaseInfo cardTotal={cardTotal} banListTotal={banListTotal} productTotal={productTotal} />
			</Suspense>

			<OneThirdTwoThirdsGrid
				mirrored={true}
				oneThirdComponent={
					<StickyBox >
						<LeftBoxPaper>
							<SocialMedia />
						</LeftBoxPaper>
					</StickyBox>
				}
				twoThirdComponent={
					<RightBoxPaper style={{padding: '0rem', marginBottom: '2rem'}}>

						<div style={{background: '#5D5A6B', color: 'white', borderTopLeftRadius: '1.75rem', borderTopRightRadius: '1.75rem'}}>
							<Typography variant='h2' style={{color: 'white', paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '1.5rem', paddingBottom: '1.5rem'}} >
								Welcome
							</Typography>
						</div>
						<Welcome />
						<YouTubeData />
					</RightBoxPaper>
					}
				/>

		</MainContentContainer>
	)
}