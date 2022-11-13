import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'

import Footer from './components/header-footer/Footer'
import NavigationBar from './components/header-footer/NavigationBar'
import Routes from './components/pages/Routes'
import MuiTheme from './components/MuiTheme'

const root = createRoot(document.getElementById('root') as Element)

root.render(
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
	</ThemeProvider>
)
