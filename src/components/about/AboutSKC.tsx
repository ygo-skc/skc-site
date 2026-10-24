import { useState } from 'react'
import { Link, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'

import AppRoutes from '../../helper/AppRoutes'

type AboutTopic = 'background' | 'purpose' | 'future'

export default function AboutSKC() {
	const [topic, setTopic] = useState<AboutTopic>('background')

	return (
		<div data-testid='about-skc' className='section-content about-skc'>
			<div className='about-skc__header'>
				<Typography id='about-skc-title' variant='h2' className='about-skc__title'>
					Why I Started The Project
				</Typography>

				<ToggleButtonGroup
					className='about-skc__topics'
					exclusive
					aria-labelledby='about-skc-title'
					value={topic}
					onChange={(_, value: AboutTopic | null) => value && setTopic(value)}
				>
					<ToggleButton value='background'>
						<Typography variant='body2' component='span' className='about-skc__topic-label'>
							My Background
						</Typography>
					</ToggleButton>
					<ToggleButton value='purpose'>
						<Typography variant='body2' component='span' className='about-skc__topic-label'>
							Purpose Of This Site
						</Typography>
					</ToggleButton>
					<ToggleButton value='future'>
						<Typography variant='body2' component='span' className='about-skc__topic-label'>
							Future Features
						</Typography>
					</ToggleButton>
				</ToggleButtonGroup>
			</div>

			{topic === 'background' && (
				<div className='about-skc__topic'>
					<Typography variant='h3' className='visually-hidden'>
						My Background
					</Typography>
					<Typography variant='body1' className='about-skc__text'>
						I started playing Yu-Gi-Oh! when I was about 8 years old. I would do some tournaments when I was in middle school and always found it fun to open packs. Starting high
						school I was less interested in tournaments and more into collecting, but around my Sophomore/Junior year It was hard to be into the hobby. I got back into it slightly
						in my early college days when i could afford the hobby a bit more, but ultimately I perceived it as a waste of time/money as I had little of either and looking back, I
						was right.
					</Typography>
					<Typography variant='body1' className='about-skc__text'>
						I graduated college some time in 2018 and got a job in my field. Through it, I got more money and slightly more time! In my field there is always something new to
						learn. Learning on the job is a hindrance in most cases. I figured I&apos;d learn new technologies by building this web site and some web API&apos;s to support the
						backend. I was right about this too since everything I&apos;m learning to build this site has helped me stay ahead of my colleagues.
					</Typography>
				</div>
			)}

			{topic === 'purpose' && (
				<div className='about-skc__topic'>
					<Typography variant='h3' className='visually-hidden'>
						Purpose Of This Site
					</Typography>
					<Typography variant='body1' className='about-skc__text'>
						In short, I thought I could do a better job displaying content than Konami and other fan made sites. Take a look at the existing sites and come back and tell me mine
						isn&apos;t faster, cleaner and with less (no) invasive ads. This website began as a place to display info about the current and previous ban lists. However, I wanted to
						keep going and built a full blown Database for Yu-Gi-Oh content. There is some stuff missing and my site is far from perfect, but It will be one of the best sites for
						Yu-Gi-Oh content one day.
					</Typography>
				</div>
			)}

			{topic === 'future' && (
				<div className='about-skc__topic'>
					<Typography variant='h3' className='visually-hidden'>
						Future Features
					</Typography>
					<Typography variant='body1' className='about-skc__text'>
						I have some more plans for the website so please stay tuned. Something I wanted to start learning was Machine Learning / AI. The first step I see myself taking is
						creating a robust suggestion engine that uses card information (parsing text) to help Duelists find related cards easier. I haven&apos;t seen a good engine yet...
					</Typography>
					<Typography variant='body1' className='about-skc__text'>
						I have also recently started selling cards online. I don&apos;t like the models sites like TCGPlayer or EBay have for sellers (or the UI they have for that matter) and
						want to have my own site where I can keep all the profit I make. Essentially, this site will be a hub for my Yu-Gi-Oh! related endeavors (see the{' '}
						<Link color='secondary' className='link' href={AppRoutes.Home}>
							home page
						</Link>{' '}
						for what I mean) and, one day, the best Yu-Gi-Oh! DB!
					</Typography>
				</div>
			)}
		</div>
	)
}
