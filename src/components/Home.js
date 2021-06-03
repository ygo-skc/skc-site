
import React, { useEffect, useState, lazy, Suspense } from 'react'
import { Helmet } from 'react-helmet'

import { Typography, Link } from '@material-ui/core'
import { MainContentContainer } from './MainContent'
import Breadcrumb from './Breadcrumb'
import { handleFetch } from '../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../helper/DownstreamServices'

import OneThirdTwoThirdsGrid from './util/grid/OneThirdTwoThirdsGrid'

import { LeftBoxPaper, RightBoxPaper, RightBoxHeaderTypography, RightBoxSubHeaderTypography } from './util/grid/OneThirdTwoThirdsGrid'

import {HEART_API_HOST_NAME} from '../helper/DownstreamServices'

const YouTubeUploads = lazy(() => import('./YouTubeUploads'))
const DatabaseSearch = lazy(() => import('./DatabaseSearch'))


export default function Home({ history }) {
	const [cardTotal, setCardTotal] = useState(0)
	const [banListTotal, setBanListTotal] = useState(0)
	const [yearsOfBanListCoverage, setYearsOfBanListCoverage] = useState(0)
	const [productTotal, setProductTotal] = useState(0)

	const [youtubeData, setYoutubeData] = useState(undefined)

	useEffect(() => {
		handleFetch(NAME_maps_ENDPOINT['databaseStats'], history, (json) => {
			setCardTotal(json.cardTotal)
			setBanListTotal(json.banListTotal)
			setYearsOfBanListCoverage(json.yearsOfBanListCoverage)
			setProductTotal(json.productTotal)
		})


		handleFetch(`${HEART_API_HOST_NAME}/v1/yt/channel/uploads?channelId=UCBZ_1wWyLQI3SV9IgLbyiNQ`, history, json => {
			setYoutubeData(json)
		})
	}, [history])


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

			<Breadcrumb crumbs={['Home']} />

			<Suspense>
				<DatabaseSearch history={history} />
				<YouTubeUploads history={history} youtubeData={youtubeData} />
			</Suspense>

			<OneThirdTwoThirdsGrid
				oneThirdComponent={
					<LeftBoxPaper>
						<RightBoxHeaderTypography variant='h4' >
							Social
						</RightBoxHeaderTypography>
						<RightBoxSubHeaderTypography variant='h5'>
							Join The Discord
						</RightBoxSubHeaderTypography>

						<Typography variant='body1' >
							Use Discord to chat with others within the community. This is my personal server I use with friends. There are chats for you fine people there too! Lets grow the community!
						</Typography>
						<br />

						<div style={{borderStyle: 'solid', borderColor: '#543fda', borderWidth: '.25rem', borderRadius: '1.1rem'}}>
							<iframe style={{borderStyle: 'solid', borderRadius: '1rem'}} src="https://discord.com/widget?id=659477868799197185&theme=light" width="100%" height="400" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
						</div>
					</LeftBoxPaper>
				}
				twoThirdComponent={
					<RightBoxPaper >
						<Typography variant='h4' >
							Yo!
						</Typography>

						<Typography variant='body1' >
							This is the Supreme Kings Castle. A site dedicated to Yu-Gi-Oh! content.
						</Typography>

						<br />

						<Typography variant='body1' >
							Currently there are <strong>{cardTotal} cards</strong>, <Link color='secondary' href='/ban_list'><strong>{banListTotal} ban lists</strong></Link> from the past <strong>{yearsOfBanListCoverage}</strong> years and information about <strong>{productTotal}</strong> products.
						</Typography>

						<br />

						<Typography variant='body1' >
							Yugioh is ever expanding and evolving. New products are continuously released and new ban lists established. As such this website will also  be continuously updated to accommodate.
							Enjoy the website ad free with a fast and beautiful UI. There is no tracking and the only money we make is though donations. Want to learn more? Check out the <Link color='secondary' href='/about'><strong>About</strong></Link> section
						</Typography>
					</RightBoxPaper>
					}
				/>
		</MainContentContainer>
	)
}