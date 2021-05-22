import React, { FunctionComponent, lazy } from 'react'
import { Helmet } from 'react-helmet'

import { Typography, Link, Grid, Paper } from '@material-ui/core'
import styled from 'styled-components'

import Breadcrumb from '../Breadcrumb'
import { MainContentContainer } from '../MainContent'

const AboutInfoCard = lazy( () => import('./AboutInfoCard') )

const CustomLink = styled(Link)`
	&&
	{
		background: rgba(253, 237, 221, 1);
		padding: .15rem;
	}
`


const CenteredImage = styled.div`
	text-align: center;
	margin-bottom: 2rem;
	min-height: 100px;
`


const InfoPaper2 = styled(Paper)`
	&&
	{
		max-width: 100%;
		padding: 1.4rem;
		border-radius: 1.2rem;

		background: #f7f7f7;
	}
`

const InfoContainer = styled.div`
	&&
	{
		max-width: 100%;
		margin-top: 2.5rem;
		padding-top: 6rem;
		padding-bottom: 6rem;
		padding-right: 2rem;
		padding-left: 2rem;


		background-image: linear-gradient(316deg, rgb(49, 14, 104) 0%, rgb(95, 15, 64) 74%);

		border-top-left-radius: 2.5rem;
		border-top-right-radius: 2.5rem;

		border-bottom-left-radius: .75rem;
		border-bottom-right-radius: .75rem;
	}
`


const ParagraphTypography = styled(Typography)`
	&&
	{
		margin-left: .55rem;
	}
`


const About: FunctionComponent = () => (
	<MainContentContainer>
		<Helmet>
			<title>{`SKC - About`}</title>
			<meta
				name={`SKC - About`}
				content={`Find how to use API backed by site, how to support, etc.`}
				/>
			<meta name="keywords" content={`YuGiOh, about, YGO-API, support, The Supreme Kings Castle`} />
		</Helmet>

		<Breadcrumb crumbs={['Home', 'About']} />

		<div style={{width: '98%', margin: 'auto'}} >
			<InfoPaper2 style={{maxWidth: '1000px', margin: 'auto'}} >
				<Typography variant='h1' >
					About SKC
				</Typography>
				<Typography variant='h2' style={{marginBottom: '3rem'}} >
					Why I Started The Project
				</Typography>

				<Typography variant='h6'>
					Background
				</Typography>
				<ParagraphTypography variant='body1'>
					I started playing Yugioh when I was about 8 years old. I played at some local tourneys, but I wasn't exceptional by any means. I stopped playing when I got to high school, but I still collected cards for fun. My collecting then stopped when I got to college since it was hard convincing myself a pack of cards was more important than food/gas. Also, being a CS major and a Math minor with a full time job - hobbies were not really a priority.
				</ParagraphTypography>
					<br />
				<Typography variant='h6'>
					Purpose
				</Typography>
				<ParagraphTypography>
					I graduated sometime in 2018 and got a decent job in my field. Through it, I got more time and money for Yugioh again! I play HERO's and Neo Spacians primarily. Other archetypes I like are; Sacred Beasts, Cyber Dragons, and Toons. I primarily collect cards and play Duel Links. Tournaments have been on my mind as well.
				</ParagraphTypography>
					<br />
				<ParagraphTypography>
					This website was created for two reasons. The first and most important was that I needed to learn technologies I wasn't exposed to (primarily Spring) that I needed to know for my job. In case you are wondering, it did help me become adept and am able to do my job faster than most and with ease. Secondly, I thought I could do a better job displaying content than Konami. This website began as a place to display info about the current and previous ban lists. However, I wanted to keep going and built a full blown Database for Yu-Gi-Oh content.
				</ParagraphTypography>
					<br />
				<Typography variant='h6'>
					Future Features
				</Typography>
				<ParagraphTypography>
					I have some more plans for the website so please stay tuned. Something I wanted to start learning was Machine Learning / AI. The first step I see myself taking is creating a robust suggestion engine that uses card information (parsing text) to help Duelists find related cards easier. I haven't seen a good engine yet...
				</ParagraphTypography>
			</InfoPaper2>

			<InfoContainer>
				<Typography
					variant='h1'
					style={{color: 'white'}}>
					Additional Information
				</Typography>
				<Typography
					variant='h2'
					style={{color: 'white', marginBottom: '3rem'}}>
					Learn about the SKC API, donate, find ways to contact me, and other things!
				</Typography>

				<Grid container spacing={2} >
					<Grid
						style={{display: 'inline-grid'}}
						item
						xs={12}
						sm={12}
						md={6}
						lg={4}
						xl={4}  >
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
										This is good for other developers. It means you have another <strong>[FREE]</strong> choice when you want to learn about API's or need an API for a small project.
									</Typography>
									<br />
									<Typography variant='body1'>
										You can start using it by looking at the <CustomLink color='secondary' href={`${process.env.REACT_APP_API_HOST}/api/v1/swagger-ui/index.html`}>documentation</CustomLink>. As of right now, the only permissible uses are for education (learning about REST, needing data for a consumer, etc). If you have question on usage please email me.
									</Typography>
								</div>
							}
							imgPath='backend.png'
							imgLink={`${process.env.REACT_APP_API_HOST}/api/v1/swagger-ui/index.html`}
						/>
					</Grid>


					<Grid
						style={{display: 'inline-grid'}}
						item
						xs={12}
						sm={12}
						md={6}
						lg={4}
						xl={4} >
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
											<li style={{wordBreak: 'break-all'}}><strong>BTC (Bitcoin) Wallet:</strong> 3DbG1525F4HMf9Qttj5waDxJv747JrBh4g</li>
											<li style={{wordBreak: 'break-all'}}><strong>ZEC (Zcash) Wallet:</strong> t1UdXZkAUUNY35Kh2FiRoRk29Xu8SEYsXxS</li>
											<li><CustomLink color='secondary' href='https://www.paypal.com/donate?hosted_button_id=S3MFF6AVW662U'>PayPal</CustomLink></li>
										</ul>
									</Typography>


									<CenteredImage >
										<form
											action="https://www.paypal.com/donate" method="post" target="_top">
											<input type="hidden" name="hosted_button_id" value="S3MFF6AVW662U" />
											<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
											<img alt="" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
										</form>
									</CenteredImage>
								</div>
							}
							imgPath='monetary_contribution.png'
							imgLink=""
						/>
					</Grid>


					<Grid
						style={{display: 'inline-grid'}}
						item
						xs={12}
						sm={12}
						md={6}
						lg={4}
						xl={4} >
						<AboutInfoCard
							title='Other Information'
							subtitle='Contact & Other Stuff'
							body={
								<div>
									<Typography variant='h6'>
										Contact
									</Typography>
									<ParagraphTypography variant='body1'>
										If you have questions or want to submit a bug/feature request you can always <CustomLink color='secondary' href='mailto:thesupremeking25@gmail.com'>email me</CustomLink>. Otherwise, feel free to follow me on <CustomLink color='secondary' href='https://twitter.com/SupremeKing93'>twitter</CustomLink>. Though I don't really do social media, I will try my best to post updates there.
									</ParagraphTypography>

									<br />
									<Typography variant='h6'>
										Privacy
									</Typography>
									<ParagraphTypography variant='body1' >
										Though there are no trackers on this site, every request sent to the API has the IP address of the requester. This is strictly to fight DDOS attacks by blacklisting IPs based on attacks. Regular user IPs are not stored in a database and are only written to a log accessible only by me.
									</ParagraphTypography>
								</div>
							}
							imgPath='information.png'
							imgLink=""
						/>
					</Grid>

					<Grid
						style={{display: 'inline-grid'}}
						item
						xs={12}
						sm={12}
						md={6}
						lg={4}
						xl={4} >
							<AboutInfoCard
								title='Subscribe On YouTube'
								subtitle='Subscribe On YouTube'
								body={
									<Typography variant='body1'>
										To help keep the site up (and in no ways an excuse to buy more cards), I started an unboxing/pack opening channel. I feel that I could give you, the consumers, more content. While also making money to support this project.

										<br /><br />

										The channel is pretty laid back and I won't be screaming/freaking out every time I get a rare card. In other words, It is an alternative to the fake or over the top reaction based Yugioh openings. Feel free to <CustomLink color='secondary' href={`https://www.youtube.com/channel/UCBZ_1wWyLQI3SV9IgLbyiNQ/videos`}>watch/subscribe</CustomLink>!
									</Typography>
								}
								imgPath='yt_channel_icon.jpeg'
								imgLink='https://www.youtube.com/channel/UCBZ_1wWyLQI3SV9IgLbyiNQ/videos'
							/>

					</Grid>

				</Grid>
			</InfoContainer>
		</div>
	</MainContentContainer>
	)


export default About