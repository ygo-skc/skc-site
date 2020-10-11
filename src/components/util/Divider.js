import {Divider} from '@material-ui/core'
import Styled from 'styled-components'


const LightTranslucentDivider = Styled(Divider)`
	&&
	{
		margin-top: 1.75rem;
		margin-bottom: 1.75rem;
		background-color: rgba(255, 255, 255, .25);
	}
`


export {LightTranslucentDivider}