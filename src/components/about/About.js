import React from 'react'

import { Typography, Link } from '@material-ui/core'
import styled from 'styled-components'

import Breadcrumb from '../Breadcrumb'
import { MainContentContainer, ChildPaper } from '../MainContent'

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

export default function()
{
	return (
		<MainContentContainer>
			<Breadcrumb crumbs={['Home', 'About']} />

			<ChildPaper>
				<CenteredText variant='h4'>
					The Developer
				</CenteredText>
				<CenteredText variant='h5'>
					Javi Gomez • <CustomLink color='secondary' href='https://github.com/rtomyj'>GitHub</CustomLink> • <CustomLink color='secondary' href='mailto:rtomyj@gmail.com'>Email</CustomLink> • <CustomLink color='secondary' href='https://twitter.com/TheSupremeKin14'>Twitter</CustomLink>
				</CenteredText>
				<br />

				<Typography variant='body1'>
					Hey guys. I started playing Yugioh when I was about 8 years old. I played at some local tourneys, but I wasn't exceptional by any means. I stopped playing when I got to high school, but I still collected cards for fun. My collecting then stopped when I got to college since it was hard convincing myself a pack of cards was more important than food/gas. Also, being a CS major and a Math minor with a full time job - hobbies were not really a priority.
					<br />
					<br />
					Anyways, recently I graduated and  got a full time Programming gig. Through it, I got more time and money for Yugioh again! I play HERO's and Neo Spacians. I doubt I'll ever play tourneys again but it's been fun getting back into the game.
					<br />
					<br />
					While checking out the newest ban list to make sure I'm playing the Limited Format correctly, I thought about how ugly the Konami website was.
					This website was created as a side project to not only see if I can do a better job than Konami but also to learn the full stack of my new position. Full stack is the combination of both a product and the technology used for that product. For this website I used; <strong>Spring Boot</strong>, <strong>MySQL DB</strong>, and <strong>React.js</strong>.
				</Typography>
			</ChildPaper>

			<ChildPaper>
				<CenteredText variant='h4'>
					The API
				</CenteredText>
				<CenteredText variant='h5'>
					YGO API • <CustomLink color='secondary' href='https://ygoapi.cfapps.io/swagger-ui.html'>Documentation</CustomLink>
				</CenteredText>
				<br />

				<Typography variant='body1'>
					The API was also created by me. It has two main functions: to get the contents of a specific ban list (basic info about a card, forbidden/limited/semi-limited cards) and get detailed information about a certain card (effect, attack/defense, etc). Right now it is limited in content. However, I would like to create a full blown database of cards so developers can have a fun and familiar service to use while learning about REST and HTTP in general.
				</Typography>
			</ChildPaper>

			<ChildPaper>
				<CenteredText variant='h4'>
					The Funding
				</CenteredText>
				<CenteredText variant='h5'>
					Donations To Maintain Site • <CustomLink color='secondary' href='https://www.patreon.com/javigomez'>Patreon</CustomLink>
				</CenteredText>
				<br />

				<Typography variant='body1'>
					Since the website needs to be hosted somewhere and a good hosting platform costs money, donations are always welcome. If you use the website often/think its neat and you have a dollar or two laying around, use the link above.
					<br />
					<br />
					I have no plans for an Ad centric business model. Quite frankly, Ads are annoying, ugly and abuse user data.
					<br />
					<br />
					Donations will be used to keep the website and API up and running as well as motivate me to keep it going. Not only that, this website uses open source software that I would also love to fund since I couldn't have built this thing as easily without the frameworks used. A portion of donations will be going to certain frameworks.
				</Typography>
			</ChildPaper>
		</MainContentContainer>
	)
}