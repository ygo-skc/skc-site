import { Typography } from '@material-ui/core'

import { RightBoxSubHeaderTypography } from '../util/grid/OneThirdTwoThirdsGrid'
import Link from '../util/Link'

export default function Welcome() {
	return(
		<div style={{paddingLeft: '.8rem', paddingRight: '.8rem', paddingTop: '1.5rem', paddingBottom: '1.5rem', background: '#fff', borderTopLeftRadius: '2rem', borderTopRightRadius: '2rem'}} >
			<RightBoxSubHeaderTypography variant='h5'>
				The BEST Yu-Gi-Oh! Site?
			</RightBoxSubHeaderTypography>

			<Typography variant='subtitle2' >
				Maybe one day!
			</Typography>
			<br />

			<Typography variant='body1' >
				This is a site dedicated to Yu-Gi-Oh! content. The main differences between this site and others is that this site is incredibly fast and intuitive and has no Ads or trackers.
			</Typography>

			<br />

			<Typography variant='body1' >
				Yugioh is ever expanding and evolving. New products are continuously released and new ban lists established. As such this website will also  be continuously updated to accommodate.
				Want to learn more? Check out the <Link color='secondary' href='/about'>About</Link> section
			</Typography>
		</div>
	)
}