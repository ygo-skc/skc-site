import { FunctionComponent, lazy } from 'react'
import { Helmet } from 'react-helmet'

import { Typography, Paper, Grid, Link } from '@mui/material'
import styled from 'styled-components'

import Breadcrumb from '../header-footer/Breadcrumb'

const AboutInfoCard = lazy(() => import('./AboutInfoCard'))

const CenteredImage = styled.div`
	text-align: center;
`

const InfoPaper2 = styled(Paper)`
	&& {
		margin: auto;
		max-width: 1000px;
		padding: 0;
		border-radius: 1.2rem;

		background: white;
	}
`

const InfoPaper2Header = styled.div`
	&& {
		padding: 1.4rem;
		background: #ffa366;
		border-top-left-radius: 1.2rem;
		border-top-right-radius: 1.2rem;
	}
`

const InfoContainer = styled(InfoPaper2)`
	&& {
		max-width: 100%;
		background-color: #3f1286;
		background: radial-gradient(89.53% 145.96% at 60% 100.79%, #461495 0, #5418b3 17.58%, #461495 50.31%, #3f1286 97.03%);
		margin-top: 2rem;
	}
`

const InfoContainerHeader = styled(InfoPaper2Header)`
	&& {
		background: rgba(0, 0, 0, 0.4);
	}
`

const ParagraphTypography = styled(Typography)`
	&& {
		margin-left: 0.55rem;
	}
`

const About: FunctionComponent = () => {
	return (
		<div className='generic-container'>
			<Helmet>
				<title>{`SKC - About`}</title>
				<meta name={`SKC - About`} content={`Find how to use API backed by site, how to support, etc.`} />
				<meta name='keywords' content={`YuGiOh, about, YGO-API, support, The Supreme Kings Castle`} />
			</Helmet>

			<Breadcrumb crumbs={['Home', 'About']} />

			<div>
				<InfoPaper2>
					<InfoPaper2Header>
						<Typography variant='h1' style={{ color: 'white' }}>
							About SKC
						</Typography>
						<Typography variant='h3' style={{ color: 'white' }}>
							Why I Started The Project
						</Typography>
					</InfoPaper2Header>

					<div style={{ padding: '1.4rem' }}>
						<Typography variant='h6'>My Background</Typography>
						<ParagraphTypography variant='body1'>
							I started playing Yu-Gi-Oh! when I was about 8 years old. I would do some tournaments when I was in middle school and always found it fun to open packs. Starting high
							school I was less interested in tournaments and more into collecting, but around my Sophomore/Junior year It was hard to be into the hobby. I got back into it
							slightly in my early college days when i could afford the hobby a bit more, but ultimately I perceived it as a waste of time/money as I had little of either and
							looking back, I was right.
						</ParagraphTypography>
						<br />
						<ParagraphTypography>
							I graduated college some time in 2018 and got a job in my field. Through it, I got more money and slightly more time! In my field there is always something new to
							learn. Learning on the job is a hinderance in most cases. I figured I'd learn new technologies by building this web site and some web API's to support the backend. I
							was right about this too since everything I'm learning to build this site has helped me stay ahead of my colleagues.
						</ParagraphTypography>
						<br />
						<Typography variant='h6'>Purpose Of This Site</Typography>
						<ParagraphTypography>
							In short, I thought I could do a better job displaying content than Konami and other fan made sites. Take a look at the existing sites and come back and tell me mine
							isn't faster, cleaner and with less (no) invasive ads. This website began as a place to display info about the current and previous ban lists. However, I wanted to
							keep going and built a full blown Database for Yu-Gi-Oh content. There is some stuff missing and my site is far from perfect, but It will be one of the best sites for
							Yu-Gi-Oh content one day.
						</ParagraphTypography>
						<br />
						<Typography variant='h6'>Future Features</Typography>
						<ParagraphTypography>
							I have some more plans for the website so please stay tuned. Something I wanted to start learning was Machine Learning / AI. The first step I see myself taking is
							creating a robust suggestion engine that uses card information (parsing text) to help Duelists find related cards easier. I haven't seen a good engine yet...
						</ParagraphTypography>
						<br />
						<ParagraphTypography>
							I have also recently started selling cards online. I don't like the models sites like TCGPlayer or EBay have for sellers (or the UI they have for that matter) and
							want to have my own site where I can keep all the profit I make. Essentially, this site will be a hub for my Yu-Gi-Oh! related endeavors (see the{' '}
							<Link color='secondary' className='link' href='/'>
								home page
							</Link>{' '}
							for what I mean) and, one day, the best Yu-Gi-Oh! DB!
						</ParagraphTypography>
					</div>
				</InfoPaper2>

				<InfoContainer>
					<InfoContainerHeader>
						<Typography variant='h1' style={{ color: 'white' }}>
							Information
						</Typography>
						<Typography variant='h3' style={{ color: 'white' }}>
							SKC API, Donate, Contact Info, And More!
						</Typography>
					</InfoContainerHeader>

					<div style={{ padding: '1.4rem' }}>
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
											To help keep the site up (and in no ways an excuse to buy more cards), I started an unboxing/pack opening channel. I feel that I could give you, the
											consumers, more content. While also making money to support this project.
											<br />
											<br />
											The channel is pretty laid back and I won't be screaming/freaking out every time I get a rare card. In other words, It is an alternative to the fake or over
											the top reaction based Yugioh openings. Feel free to{' '}
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
				</InfoContainer>
			</div>
		</div>
	)
}

export default About
