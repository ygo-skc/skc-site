import React, { FunctionComponent } from 'react'
import { Helmet } from 'react-helmet'

import { Typography, Link, Grid, Paper } from '@material-ui/core'
import styled from 'styled-components'

import Breadcrumb from '../Breadcrumb'
import { MainContentContainer } from '../MainContent'
import Footer from '../Footer'
import {DarkTranslucentDivider} from '../util/Divider'

import GenericLinkPhoto from '../util/photo/GenericLinkPhoto'

const CustomLink = styled(Link)`
	&&
	{
		background: rgba(253, 237, 221, 1);
		padding: .15rem;
	}
`


const CenteredText = styled(Typography)`
	&&
	{
		text-align: center;
	}
`


const HeaderWithSubheader = styled(CenteredText)`
	&&
	{
		margin-bottom: .55rem;
	}
`


const CenteredImage = styled.div`
	text-align: center;
	margin-bottom: 2rem;
	min-height: 100px;
`


const InfoPaper = styled(Paper)`
	&&
	{
		padding: 2.2rem;
		width: 100%;
		height: 10rem;
		background: black;
	}
`


const InfoPaper2 = styled(Paper)`
	&&
	{
		max-width: 100%;
		padding: 2.5rem;
		border-radius: 1.2rem;

		background: #f7f7f7;
	}
`


const AboutPaper = styled(Paper)`
	&&
	{
		padding: 2.2rem;
		border-radius: 0rem;
	}
`

const InfoContainer = styled.div`
	&&
	{
		max-width: 100%;
		margin-top: 2.5rem;
		padding-top: 7rem;
		padding-bottom: 7rem;
		padding-right: 1.2rem;
		padding-left: 1.2rem;


		background-image: linear-gradient(316deg, rgb(49, 14, 104) 0%, rgb(95, 15, 64) 74%);

		border-top-left-radius: 4rem;
		border-top-right-radius: 4rem;

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

		<div style={{width: '100%'}} >


			<InfoPaper2 style={{maxWidth: '1000px', margin: 'auto'}} >
				<CenteredText variant='h4'>
					About
				</CenteredText>
				<br />

				<Typography variant='h6'>
					Background
				</Typography>
				<ParagraphTypography variant='body1'>
					I started playing Yugioh when I was about 8 years old. I played at some local tourneys, but I wasn't exceptional by any means. I stopped playing when I got to high school, but I still collected cards for fun. My collecting then stopped when I got to college since it was hard convincing myself a pack of cards was more important than food/gas. Also, being a CS major and a Math minor with a full time job - hobbies were not really a priority.
				</ParagraphTypography>
					<br />
				<Typography variant='h6'>
					Purpose Of Site
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
				<Grid container spacing={2} >
					<Grid
						style={{display: 'inline-grid'}}
						item
						xs={12}
						sm={12}
						md={6}
						lg={4}
						xl={4}  >
						<InfoPaper2>
							<CenteredImage >
								<GenericLinkPhoto
									imageName='backend.png'
									link={`${process.env.REACT_APP_API_HOST}/api/v1/swagger-ui/index.html`}
								/>
							</CenteredImage>
							<HeaderWithSubheader variant='h4'>
								YGO API
							</HeaderWithSubheader>
							<CenteredText
								style={{color: '#c6694b'}}
								variant='subtitle1'>
								The Backend
							</CenteredText>

							<DarkTranslucentDivider />

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
						</InfoPaper2>
					</Grid>


					<Grid
						style={{display: 'inline-grid'}}
						item
						xs={12}
						sm={12}
						md={6}
						lg={4}
						xl={4} >
						<InfoPaper2  >
							<CenteredImage style={{height: '120px'}} >
								<form
									action="https://www.paypal.com/donate" method="post" target="_top">
									<input type="hidden" name="hosted_button_id" value="S3MFF6AVW662U" />
									<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
									<img alt="" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
								</form>
							</CenteredImage>
							<HeaderWithSubheader variant='h4'>
								Contributions
							</HeaderWithSubheader>
							<CenteredText
								style={{color: '#c6694b'}}
								variant='subtitle1'>
								Donations To Website
							</CenteredText>

							<DarkTranslucentDivider />

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
						</InfoPaper2>
					</Grid>


					<Grid
						style={{display: 'inline-grid'}}
						item
						xs={12}
						sm={12}
						md={6}
						lg={4}
						xl={4} >
						<InfoPaper2 style={{maxWidth: '100%'}} >
							<HeaderWithSubheader variant='h4'>
								Other Information
							</HeaderWithSubheader>
							<CenteredText
								style={{color: '#c6694b'}}
								variant='subtitle1'>
								Contact & Other Stuff
							</CenteredText>

							<DarkTranslucentDivider />

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
						</InfoPaper2>
					</Grid>


					<Grid
						style={{display: 'inline-grid'}}
						item
						xs={12}
						sm={12}
						md={6}
						lg={4}
						xl={4} >
						<InfoPaper2 style={{maxWidth: '100%'}} >
							<CenteredImage >
								<GenericLinkPhoto
									imageName='yt_channel_icon.jpeg'
									link={`https://www.youtube.com/channel/UCBZ_1wWyLQI3SV9IgLbyiNQ/videos`}
								/>
							</CenteredImage>
							<HeaderWithSubheader variant='h4'>
								More Ways To Support
							</HeaderWithSubheader>
							<CenteredText
								style={{color: '#c6694b'}}
								variant='subtitle1'>
								Subscribe On YouTube
							</CenteredText>

							<DarkTranslucentDivider />

							<Typography variant='body1'>
								To help keep the site up (and in no ways an excuse to buy more cards), I started an unboxing/pack opening channel. I feel that I could give you, the consumers, more content. While also making money to support this project.
							</Typography>

							<br />
							<Typography variant='body1'>
								The channel is pretty laid back and I won't be screaming/freaking out every time I get a rare card. In other words, It is an alternative to the fake or over the top reaction based Yugioh openings. Feel free to <CustomLink color='secondary' href={`https://www.youtube.com/channel/UCBZ_1wWyLQI3SV9IgLbyiNQ/videos`}>watch/subscribe</CustomLink>!
							</Typography>
						</InfoPaper2>
					</Grid>

				</Grid>
			</InfoContainer>
		</div>

		<Footer />
	</MainContentContainer>
	)


export default About