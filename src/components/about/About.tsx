import React, { FunctionComponent, useEffect } from 'react'
import { Helmet } from 'react-helmet'

import { Typography, Link } from '@material-ui/core'
import styled from 'styled-components'

import Breadcrumb from '../Breadcrumb'
import { MainContentContainer, ChildPaper } from '../MainContent'
import Footer from '../Footer'

import GenericLinkPhoto from '../photo/GenericLinkPhoto'


const CustomLink = styled(Link)`
	&&
	{
		background: rgba(253, 237, 221, 1);
		padding: .15rem;
	}
`


const CenteredText = styled(Typography)`
	text-align: center;
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

		<ChildPaper>
			<CenteredText variant='h4'>
				The Developer
			</CenteredText>
			<CenteredText variant='subtitle1'>
				<GenericLinkPhoto
					imageName='twitter_logo.png'
					link="https://twitter.com/SupremeKing93"
				/>
				<GenericLinkPhoto
					imageName='email_logo.png'
					link="mailto:rtomyj@gmail.com"
				/>
				<GenericLinkPhoto
					imageName='github_logo.png'
					link="https://github.com/rtomyj"
				/>
			</CenteredText>
			<br />

			<Typography variant='body1'>
				I started playing Yugioh when I was about 8 years old. I played at some local tourneys, but I wasn't exceptional by any means. I stopped playing when I got to high school, but I still collected cards for fun. My collecting then stopped when I got to college since it was hard convincing myself a pack of cards was more important than food/gas. Also, being a CS major and a Math minor with a full time job - hobbies were not really a priority.
				<br />
				<br />
				Anyways, I graduated sometime in 2018 and got a decent job in my field. Through it, I got more time and money for Yugioh again! I play HERO's and Neo Spacians primarily. Other archetypes I like are; Sacred Beasts, Cyber Dragons, and Toons. I primarily collect cards and play Duel Links. Tournaments have been on my mind as well.
				<br />
				<br />
				This website was created for two reasons. The first and most important was that I needed to learn technologies I wasn't exposed to (primarily Spring) that I needed to know for my job. In case you are wondering, it did help me become adept and am able to do my job faster than most and with ease. Secondly, I thought I could do a better job displaying content than Konami. This website began as a place to display info about the current and previous ban lists. However, I wanted to keep going and built a full blown Database for Yu-Gi-Oh content.
				<br />
				<br />
				I have some more plans for the website so please stay tuned. Something I wanted to start learning was Machine Learning / AI. The first step I see myself taking is creating a robust suggestion engine that uses card information (parsing text) to help Duelists find related cards easier. I haven't seen a good engine yet...
			</Typography>
		</ChildPaper>

		<ChildPaper>
			<CenteredText variant='h4'>
				YGO API
			</CenteredText>
			<CenteredText variant='subtitle1'>
				<GenericLinkPhoto
					imageName='api_logo.jpg'
					link="https://ygoapi.cfapps.io//api/v1/swagger-ui/index.html"
				/>
			</CenteredText>
			<br />

			<Typography variant='body1'>
				This website uses an new API created to support the site and also to help people who are learning about web APIs. It has a very easy to read/follow companion site that wsa created using Swagger. Click the above image to for the documentation.
			</Typography>
		</ChildPaper>

		<ChildPaper>
			<CenteredText variant='h4'>
				The Funding
			</CenteredText>
			<CenteredText variant='subtitle1'>
				Donations To Maintain Site • <CustomLink color='secondary' href='https://www.patreon.com/javigomez'>Patreon</CustomLink>
			</CenteredText>
			<br />

			<Typography variant='body1'>
				Besides time, hosting is another resource needed to have this website/API live and updated. If you like the website or learned a bit by messing with the API please consider donating.
				<br />
				<br />
				I am not a fan of Ads, but there are plans on adding minimal ads to help maintain the site in the future.
			</Typography>
		</ChildPaper>

		<Footer />
	</MainContentContainer>
	)


export default About