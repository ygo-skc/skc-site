import './index.css'
import './css/util/section.css'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import routes from './components/pages/Routes'
import MuiTheme from './components/MuiTheme'

const root = createRoot(document.getElementById('root') as Element)

root.render(
	<ThemeProvider theme={MuiTheme}>
		<RouterProvider router={createBrowserRouter(routes)} />
	</ThemeProvider>
)
