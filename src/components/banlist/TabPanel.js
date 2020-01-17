import React, {  } from 'react'
import PropTypes from 'prop-types'
import Styled from 'styled-components'

import { Typography, Box } from '@material-ui/core'

const Container = Styled(Box)`
	&&
	{
		padding: 0rem;
	}
`

export const TabPanel = ( { children, value, index } ) =>
{
	return(
		<Typography
			component="div"
			role="tabpanel"
			hidden={value !== index}
			id={`full-width-tabpanel-${index}`}
			aria-labelledby={`full-width-tab-${index}`} >
			<Container p={3}>
				{ children }
			</Container>
		</Typography>
	)
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};