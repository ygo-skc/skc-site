import { render } from 'react-dom'
import { ThemeProvider } from '@mui/material/styles'

import Footer from './components/header-footer/Footer'
import NavigationBar from './components/header-footer/NavigationBar'
import Routes from './components/Routes'
import MuiTheme from './components/MuiTheme'

render(
	<ThemeProvider theme={MuiTheme}>
		<div className='content'>
			<NavigationBar />
			<div className='routes'>
				<div className='routes-wrapper'>
					<Routes />
				</div>
			</div>
		</div>
		<Footer />
	</ThemeProvider>,
	document.getElementById('root')
)
