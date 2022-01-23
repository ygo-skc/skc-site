import { Typography, Grid, Link } from '@mui/material'
import AboutInfoCard from './AboutInfoCard'

import styled from 'styled-components'

const CenteredImage = styled.div`
	text-align: center;
`

const ParagraphTypography = styled(Typography)`
	&& {
		margin-left: 0.55rem;
	}
`

export default function Overview() {
	return (
		<div className='section-content'>
			<Typography variant='h4'>SKC API, Donate, Contact Info, And More!</Typography>

			<div>
				<Grid container spacing={2}>
					<Grid style={{ display: 'inline-grid' }} item xs={12} sm={12} md={6} lg={4} xl={4}>
						<AboutInfoCard
							title='SKC API'
							subtitle='The Backend'
							body={
								<div>
									<Typography variant='body1'>
										A new API was created in the process of creating this site. Though there are other API's available, my purpose was in creating my own to learn a new stack.
									</Typography>
									<br />
									<Typography variant='body1'>
										This is good for other developers. It means you have another <strong>[FREE]</strong> choice when you want to learn about API's or need an API for a small
										project.
									</Typography>
									<br />
									<Typography variant='body1'>
										You can start using it by looking at the{' '}
										<Link className='link' color='secondary' href={`${process.env.REACT_APP_API_HOST}/api/v1/swagger-ui/index.html`}>
											documentation
										</Link>
										. As of right now, the only permissible uses are for education (learning about REST, needing data for a consumer, etc). If you have question on usage please
										email me.
									</Typography>
								</div>
							}
							imgPath='backend.png'
							imgLink={`${process.env.REACT_APP_API_HOST}/api/v1/swagger-ui/index.html`}
						/>
					</Grid>

					<Grid style={{ display: 'inline-grid' }} item xs={12} sm={12} md={6} lg={4} xl={4}>
						<AboutInfoCard
							title='Contributions'
							subtitle='Donations To Website'
							body={
								<div>
									<Typography variant='body1'>
										As you can tell, this site has no ads and no trackers trying to get information about you. This has two intended effects:
										<ol>
											<li>The interface is fast, clean and intuitive.</li>
											<li>Big corporations don't get browsing data about you.</li>
										</ol>
									</Typography>

									<Typography variant='body1'>
										To help maintain this web page, you can donate using one of the options below.
										<ul>
											<li style={{ wordBreak: 'break-all' }}>
												<strong>BTC (Bitcoin) Wallet:</strong> 3DbG1525F4HMf9Qttj5waDxJv747JrBh4g
											</li>
											<li style={{ wordBreak: 'break-all' }}>
												<strong>ZEC (Zcash) Wallet:</strong> t1UdXZkAUUNY35Kh2FiRoRk29Xu8SEYsXxS
											</li>
											<li>
												<Link className='link' color='secondary' href='https://www.paypal.com/donate?hosted_button_id=S3MFF6AVW662U'>
													PayPal
												</Link>
											</li>
										</ul>
									</Typography>

									<CenteredImage>
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
									</CenteredImage>
								</div>
							}
							imgPath='monetary_contribution.png'
							imgLink=''
						/>
					</Grid>

					<Grid style={{ display: 'inline-grid' }} item xs={12} sm={12} md={6} lg={4} xl={4}>
						<AboutInfoCard
							title='Other Information'
							subtitle='Contact & Other Stuff'
							body={
								<div>
									<Typography variant='h6'>Contact</Typography>
									<ParagraphTypography variant='body1'>
										If you have questions or want to submit a bug/feature request you can always{' '}
										<Link className='link' color='secondary' href='mailto:thesupremeking25@gmail.com'>
											email me
										</Link>
										. Otherwise, feel free to follow me on{' '}
										<Link className='link' color='secondary' href='https://twitter.com/SupremeKing93'>
											twitter
										</Link>
										. Though I don't really do social media, I will try my best to post updates there.
									</ParagraphTypography>

									<br />
									<Typography variant='h6'>Privacy</Typography>
									<ParagraphTypography variant='body1'>
										Though there are no trackers on this site, every request sent to the API has the IP address of the requester. This is strictly to fight DDOS attacks by
										blacklisting IPs based on attacks. Regular user IPs are not stored in a database and are only written to a log accessible only by me.
									</ParagraphTypography>
								</div>
							}
							imgPath='information.png'
							imgLink=''
						/>
					</Grid>

					<Grid style={{ display: 'inline-grid' }} item xs={12} sm={12} md={6} lg={4} xl={4}>
						<AboutInfoCard
							title='Watch Yu-Gi-Oh! Related Content'
							subtitle='Subscribe On YouTube'
							body={
								<Typography variant='body1'>
									To help keep the site up (and in no ways an excuse to buy more cards), I started an unboxing/pack opening channel. I feel that I could give you, the consumers,
									more content. While also making money to support this project.
									<br />
									<br />
									The channel is pretty laid back and I won't be screaming/freaking out every time I get a rare card. In other words, It is an alternative to the fake or over the
									top reaction based Yugioh openings. Feel free to{' '}
									<Link className='link' color='secondary' href='https://www.youtube.com/channel/UCBZ_1wWyLQI3SV9IgLbyiNQ/videos'>
										watch/subscribe
									</Link>
									!
								</Typography>
							}
							imgPath='yt_channel_icon.jpeg'
							imgLink='https://www.youtube.com/channel/UCBZ_1wWyLQI3SV9IgLbyiNQ/videos'
						/>
					</Grid>
				</Grid>
			</div>
		</div>
	)
}
