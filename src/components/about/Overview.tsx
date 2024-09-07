import { Typography, Link } from '@mui/material'
import Grid from '@mui/material/Grid2'
import AboutInfoCard from './AboutInfoCard'

import { Fragment } from 'react'
import Topic from './Topic'

export default function Overview() {
	return (
		<div className='section-content'>
			<Typography variant='h4'>SKC API, Donate, Contact Info, And More!</Typography>

			<Grid container spacing={2}>
				<Grid className='grid' size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 4 }}>
					<AboutInfoCard
						title='SKC API'
						subtitle='The Backend'
						body={
							<Fragment>
								<Topic
									header='How Is Data Retrieved?'
									details={
										<Typography variant='body1' className='topic-details'>
											A new API was created in the process of creating this site. Though there are other API&apos;s available, at the time I wanted to learn a new technology and
											grow as a developer. It has since then grown to be a very robust and powerful source of data.
										</Typography>
									}
								/>

								<Topic
									header='Who Can Use The API?'
									details={
										<Typography variant='body1' className='topic-details'>
											Other than for curiosity or educational purposes you cannot use the API. This means that if you want to build your own site or have other commercial uses for
											the API, you cannot use it. The reason is due to having no available bandwidth. This site makes no money through ads or otherwise and I cannot add more
											instances to accommodate traffic that isn&apos;t in the immediate vision. The API itself is{' '}
											<Link className='link' color='secondary' href={`${process.env.REACT_APP_API_HOST}/api/v1/swagger-ui.html`}>
												documented
											</Link>
											.
										</Typography>
									}
								/>
							</Fragment>
						}
						imgName='backend.png'
						imgLink={`${process.env.REACT_APP_API_HOST}/api/v1/swagger-ui/index.html`}
					/>
				</Grid>

				<Grid className='grid' size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 4 }}>
					<AboutInfoCard
						title='Contributions'
						subtitle='Donations To Website'
						body={
							<Fragment>
								<Typography variant='body1'>As you can tell, this site has no ads and no trackers trying to get information about you. This has two intended effects:</Typography>
								<ol>
									<li>The interface is fast, clean and intuitive.</li>
									<li>Big corporations don&apos;t get browsing data about you.</li>
								</ol>

								<Typography variant='body1'>To help maintain this web page, you can donate using one of the options below.</Typography>
								<ul>
									<li>
										<strong>BTC (Bitcoin) Wallet:</strong> 3DbG1525F4HMf9Qttj5waDxJv747JrBh4g
									</li>
									<li>
										<strong>ZEC (Zcash) Wallet:</strong> t1UdXZkAUUNY35Kh2FiRoRk29Xu8SEYsXxS
									</li>
									<li>
										<Link className='link' color='secondary' href='https://www.paypal.com/donate?hosted_button_id=S3MFF6AVW662U'>
											PayPal
										</Link>
									</li>
								</ul>

								<div>
									<form action='https://www.paypal.com/donate' method='post' target='_top'>
										<input type='hidden' name='hosted_button_id' value='S3MFF6AVW662U' />
										<input
											type='image'
											src='https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif'
											name='submit'
											title='PayPal - The safer, easier way to pay online!'
											alt='Donate with PayPal button'
										/>
										<img alt='' src='https://www.paypal.com/en_US/i/scr/pixel.gif' width='1' height='1' />
									</form>
								</div>
							</Fragment>
						}
						imgName='monetary_contribution.png'
						imgLink='https://www.paypal.com/donate?token=cqxHbHEXK6-mxQeeArpzXbPNCngsNwSscv3vVARXBwyFL6NWebDRaj4Xze7jEZ1OYi9BtmxjfsKRGeEI'
					/>
				</Grid>

				<Grid className='grid' size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 4 }}>
					<AboutInfoCard
						title='Other Information'
						subtitle='Contact & Other Stuff'
						body={
							<Fragment>
								<Topic
									header='Contact'
									details={
										<Typography variant='body1' className='topic-details'>
											If you have questions or want to submit a bug/feature request you can always{' '}
											<Link className='link' color='secondary' href='mailto:thesupremeking25@gmail.com'>
												email me
											</Link>
											. Otherwise, feel free to follow me on{' '}
											<Link className='link' color='secondary' href='https://twitter.com/supreme_king_yt'>
												twitter
											</Link>
											. Though I don&apos;t really do social media, I will try my best to post updates there.
										</Typography>
									}
								/>

								<Topic
									header='Privacy'
									details={
										<Typography variant='body1' className='topic-details'>
											I have started storing usage patterns for some metrics. This is in an effort to help build a robust suggestion engine. Whats stored? Just your IP and what you
											accessed from the database (card, or product info for example). IP addresses are also logged for all requests to help in blacklisting potential DDOS actors.
										</Typography>
									}
								/>
							</Fragment>
						}
						imgName='information.png'
						imgLink='https://twitter.com/supreme_king_yt'
					/>
				</Grid>

				<Grid className='grid' size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 4 }}>
					<AboutInfoCard
						title='Watch Yu-Gi-Oh! Related Content'
						subtitle='Subscribe On YouTube'
						body={
							<Topic
								header='My YouTube Channel'
								details={
									<Typography variant='body1' className='topic-details'>
										Since this site is ad free and basically loses money, I started a YT channel to help fund the project. The channel has grown in size and has a wide array of
										content. If you want to support this project without donating, you can simply{' '}
										<Link className='link' color='secondary' href='https://www.youtube.com/channel/UCBZ_1wWyLQI3SV9IgLbyiNQ/videos'>
											watch/subscribe
										</Link>{' '}
										to the channel!
									</Typography>
								}
							/>
						}
						imgName='yt_channel_icon.jpeg'
						imgLink='https://www.youtube.com/channel/UCBZ_1wWyLQI3SV9IgLbyiNQ/videos'
					/>
				</Grid>
			</Grid>
		</div>
	)
}
