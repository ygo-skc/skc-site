import { useState, useEffect, lazy, FunctionComponent } from 'react'
import { Helmet } from 'react-helmet'

import { MainContentContainer } from '../util/MainContent'

import { handleFetch } from '../../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../../helper/DownstreamServices'

import createTable from '../util/TableHelpers'
import { getDateString } from '../../helper/Dates'
import Section from '../util/Section'
import { RightBoxSubHeaderTypography } from '../util/grid/OneThirdTwoThirdsGrid'

const Breadcrumb = lazy(() => import('../header-footer/Breadcrumb'))

const ProductBrowse: FunctionComponent = () => {
	const [productJson, setProductJson] = useState([])
	const [productGridItems, setProductGridItems] = useState<JSX.Element | undefined>(undefined)
	const [isDataLoaded, setIsDataLoaded] = useState(false)

	useEffect(() => {
		handleFetch(NAME_maps_ENDPOINT['productBrowse'], (json) => {
			setProductJson(json.products)
			setIsDataLoaded(true)
		})
	}, [])

	useEffect(() => {
		const headers: string[] = ['Name', 'ID', 'Type', 'Sub-Type', 'Release']
		const rowOnClick: { (): void }[] = []
		const productRows: string[][] = productJson.map((product: ProductInfo): string[] => {
			rowOnClick.push(() => window.location.assign(`/product/${product.productId}`))
			return [product.productName!, product.productId, product.productType!, product.productSubType!, getDateString(new Date(product.productReleaseDate))]
		})

		setProductGridItems(createTable(headers, productRows, rowOnClick, true))
	}, [productJson])

	return (
		<MainContentContainer style={{}}>
			<Helmet>
				<title>{`SKC - Product Browser`}</title>
				<meta name={`SKC - Product Browser`} content={`Browse all products in database to check the progression of YuGiOh.`} />
				<meta name='keywords' content={`YuGiOh, product browse, The Supreme Kings Castle`} />
			</Helmet>

			<Breadcrumb crumbs={['Home', 'Product Browse']} />

			<Section
				sectionName='Products In Database'
				sectionContent={
					<div className='section-content'>
						<RightBoxSubHeaderTypography variant='h5'>Sorted By Release Date</RightBoxSubHeaderTypography>
						<div
							style={{
								backgroundImage: 'linear-gradient(326deg, #a4508b 0%, #5f0a87 74%)',
								paddingTop: '0rem',
								paddingBottom: '0rem',
								paddingLeft: '0rem',
								paddingRight: '0rem',
								borderRadius: '1.1rem',
							}}
						>
							{isDataLoaded ? productGridItems : undefined}
						</div>
					</div>
				}
			></Section>
		</MainContentContainer>
	)
}

export default ProductBrowse
