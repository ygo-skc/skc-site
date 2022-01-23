import { FunctionComponent } from 'react'
import { Helmet } from 'react-helmet'

import { Typography, Paper, Link } from '@mui/material'
import styled from 'styled-components'

import Breadcrumb from '../header-footer/Breadcrumb'
import Section from '../util/Section'
import Overview from './Overview'

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
			</div>

			<Section sectionName='Information' sectionContent={<Overview />} />
		</div>
	)
}

export default About
