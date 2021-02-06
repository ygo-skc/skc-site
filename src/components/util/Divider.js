import {Divider} from '@material-ui/core'
import Styled from 'styled-components'


const LightTranslucentDivider = Styled(Divider)`
	&&
	{
		margin: auto;
		margin-top: .75rem;
		margin-bottom: 2.25rem;
		background-color: rgba(255, 255, 255, .25);
		height: 3px;
		max-width: 400px;
		border-radius: 1000rem;
	}
`


const DarkTranslucentDivider = Styled(Divider)`
	&&
	{
		margin: auto;
		margin-top: .75rem;
		margin-bottom: 2.25rem;
		background-color: #ECBD0B;
background-image: linear-gradient(315deg, #ECBD0B 0%, #DC5010 44%);
		height: 3px;
		max-width: 400px;
		border-radius: 1000rem;
	}
`


export {LightTranslucentDivider, DarkTranslucentDivider}