import React, { Component }from 'react'
import PropTypes from 'prop-types';

import { Typography, Box } from '@material-ui/core'

class TabPanel extends Component
{
	render(){
		const { children, value, index, ...other } = this.props;
		return(
			<Typography
				component="div"
				role="tabpanel"
				hidden={value !== index}
				id={`full-width-tabpanel-${index}`}
				aria-labelledby={`full-width-tab-${index}`}
				{...other}
			>
				<Box p={3}>{children}</Box>
			</Typography>
		)
	}
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

export default TabPanel