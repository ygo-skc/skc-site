import { Link, Typography } from '@mui/material'
import { Fragment } from 'react'

import Topic from './Topic'

export default function AboutSKC() {
	return (
		<div data-testid='about-skc' className='section-content'>
			<Typography variant='h4'>Why I Started The Project</Typography>

			<Topic
				header='My Background'
				details={
					<Fragment>
						<Typography variant='body1' className='topic-details'>
							I started playing Yu-Gi-Oh! when I was about 8 years old. I would do some tournaments when I was in middle school and always found it fun to open packs. Starting high
							school I was less interested in tournaments and more into collecting, but around my Sophomore/Junior year It was hard to be into the hobby. I got back into it
							slightly in my early college days when i could afford the hobby a bit more, but ultimately I perceived it as a waste of time/money as I had little of either and
							looking back, I was right.
						</Typography>
						<Typography variant='body1' className='topic-details'>
							I graduated college some time in 2018 and got a job in my field. Through it, I got more money and slightly more time! In my field there is always something new to
							learn. Learning on the job is a hindrance in most cases. I figured I&apos;d learn new technologies by building this web site and some web API&apos;s to support the
							backend. I was right about this too since everything I&apos;m learning to build this site has helped me stay ahead of my colleagues.
						</Typography>
					</Fragment>
				}
			/>

			<Topic
				header='Purpose Of This Site'
				details={
					<Typography variant='body1' className='topic-details'>
						In short, I thought I could do a better job displaying content than Konami and other fan made sites. Take a look at the existing sites and come back and tell me mine
						isn&apos;t faster, cleaner and with less (no) invasive ads. This website began as a place to display info about the current and previous ban lists. However, I wanted to
						keep going and built a full blown Database for Yu-Gi-Oh content. There is some stuff missing and my site is far from perfect, but It will be one of the best sites for
						Yu-Gi-Oh content one day.
					</Typography>
				}
			/>

			<Topic
				header='Future Features'
				details={
					<Fragment>
						<Typography variant='body1' className='topic-details'>
							I have some more plans for the website so please stay tuned. Something I wanted to start learning was Machine Learning / AI. The first step I see myself taking is
							creating a robust suggestion engine that uses card information (parsing text) to help Duelists find related cards easier. I haven&apos;t seen a good engine yet...
						</Typography>
						<Typography variant='body1' className='topic-details'>
							I have also recently started selling cards online. I don&apos;t like the models sites like TCGPlayer or EBay have for sellers (or the UI they have for that matter)
							and want to have my own site where I can keep all the profit I make. Essentially, this site will be a hub for my Yu-Gi-Oh! related endeavors (see the{' '}
							<Link color='secondary' className='link' href='/'>
								home page
							</Link>{' '}
							for what I mean) and, one day, the best Yu-Gi-Oh! DB!
						</Typography>
					</Fragment>
				}
			/>
		</div>
	)
}
