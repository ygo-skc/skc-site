import React from 'react'
import PropTypes from 'prop-types'
import Styled from 'styled-components'

import { Typography, Box } from '@material-ui/core'

const Container = Styled(Box)`
	&&
	{
		@media only screen and (min-width: 0px)
		{
			padding: .8rem;
		}
		@media only screen and (min-width: 600px)
		{
			padding: .9rem;
		}
		@media only screen and (min-width: 800px)
		{
			padding: 1.2rem;
		}
		@media only screen and (min-width: 800px)
		{
			padding: 1.35rem;
		}
	}
`

function TabPanel(props)
{
	const { children, value, index, ...other } = props;

	console.log(props)

	return(
		<Typography component="div" role="tabpanel" hidden={value !== index} id={`full-width-tabpanel-${index}`}
			aria-labelledby={`full-width-tab-${index}`}
			{...other} >
			<Container p={3}>{children}</Container>
		</Typography>
	)
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

export default TabPanel