import React from 'react'
import { render } from 'react-dom'

import NavigationBar from './components/NavigationBar'
import Routes from './Routes'

render(
	<div>
		<NavigationBar />
		<Routes />
	</div>,
	document.getElementById('root')
)
