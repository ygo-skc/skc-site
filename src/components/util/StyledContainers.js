import { Box } from '@material-ui/core'
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