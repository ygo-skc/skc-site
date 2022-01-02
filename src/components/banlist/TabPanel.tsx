import Styled from 'styled-components'
import { Typography, Box } from '@mui/material'
import { FC } from 'react'
import { ReactElement } from 'react-markdown/lib/react-markdown'

const Container = Styled(Box)`
	&&
	{
		padding: 0rem;
	}
`

type _TabPanel = {
	children: ReactElement
	value: number
	index: number
}

const TabPanel: FC<_TabPanel> = ({ children, value, index }) => {
	return (
		<Typography component='div' role='tabpanel' hidden={value !== index} id={`full-width-tabpanel-${index}`} aria-labelledby={`full-width-tab-${index}`}>
			<Container p={3}>{children}</Container>
		</Typography>
	)
}

export { TabPanel }
