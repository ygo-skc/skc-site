import { Box } from '@mui/material'
import Styled from 'styled-components'

const StickyBox = Styled(Box)`
&&
{
	position: -webkit-sticky;
	position: sticky;
	top: 20;
}
`


export {StickyBox}