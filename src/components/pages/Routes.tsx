import { lazy } from 'react'
import { RouteObject, useParams } from 'react-router-dom'

import Layout from './Layout'

import AppRoutes from '../../helper/AppRoutes'

const Home = lazy(() => import('./Home'))

const BanList = lazy(() => import('./BanList'))

const ProductBrowse = lazy(() => import('./ProductBrowse'))
const ProductInformation = lazy(() => import('./ProductInformation'))

const Browse = lazy(() => import('./CardsBrowse'))
const CardInformation = lazy(() => import('./CardInformation'))

const About = lazy(() => import('./About'))
const Privacy = lazy(() => import('./Privacy'))
const HttpErr = lazy(() => import('./HttpErr'))

/*
 * Keyed components will allow clients to browse from one screen of same componenent to another.
 * Eg) card A -> card B navigation will work
 */
function KeyedCardInformation() {
	const { cardId } = useParams<{ cardId: string }>()

	return <CardInformation key={cardId} />
}

function KeyedProductInformation() {
	const { productId } = useParams<{ productId: string }>()

	return <ProductInformation key={productId} />
}

// route config rather than JSX so the app runs on a data router, which is what ScrollRestoration
// (and, later, route loaders) require. index.tsx turns this into the browser router
const routes: RouteObject[] = [
	{
		element: <Layout />,
		children: [
			{ index: true, element: <Home /> },
			{
				path: AppRoutes.BanList,
				element: <BanList />,
				children: [{ path: ':specifiedFormat', element: <BanList /> }],
			},

			{ path: AppRoutes.Card, element: <KeyedCardInformation /> },
			{
				path: 'browse',
				children: [
					{ path: 'card', element: <Browse /> },
					{ path: 'product', element: <ProductBrowse /> },
				],
			},

			{ path: AppRoutes.ProductInformation, element: <KeyedProductInformation /> },

			{ path: AppRoutes.About, element: <About /> },
			{ path: AppRoutes.Privacy, element: <Privacy /> },

			// Routes specifically for errs
			{ path: AppRoutes.BadRequest, element: <HttpErr httpErr={'400'} /> },
			{ path: AppRoutes.RequestTimeout, element: <HttpErr httpErr={'408'} /> },
			{ path: AppRoutes.UnprocessableEntity, element: <HttpErr httpErr={'422'} /> },
			{ path: AppRoutes.GenericServerError, element: <HttpErr httpErr={'500'} /> },
			{ path: AppRoutes.ServiceUnavailable, element: <HttpErr httpErr={'503'} /> },
			{ path: AppRoutes.Server404Error, element: <HttpErr httpErr={'404-Server'} /> },
			{ path: '*', element: <HttpErr httpErr={'404-Client'} /> },
		],
	},
]

export default routes
