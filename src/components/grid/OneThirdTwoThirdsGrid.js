import React from 'react'
import { Grid } from '@material-ui/core'



export const OneThirdTwoThirdsGrid = ( { match, history, oneThirdComponent, twoThirdComponent } ) =>
{

	return(
		<Grid container spacing={0} style={{ margin: 'auto', width: '100%' }} >
			<Grid item xs={12} sm={5} md={4} lg={3} xl={2}
				style={{ paddingLeft: '1.25rem', paddingRight: '1.25rem' }} >
					{oneThirdComponent}
			</Grid>

			<Grid item xs={12} sm={7} md={8} lg={9} xl={10} style={{display: 'inline-grid'}} >
				{twoThirdComponent}
			</Grid>
		</Grid>)
		}