enum AppRoutes {
	Home = '/',
	BanList = '/ban_list',
	About = '/about',
	Privacy = '/privacy',
	Card = '/card/:cardId',
	CardBrowse = '/browse/card',
	ProductBrowse = '/browse/product',
	ProductInformation = '/product/:productId',

	BadRequest = '/bad-request', // 400
	RequestTimeout = '/request-timeout', // 408
	UnprocessableEntity = '/unprocessable-entity', // 422
	Server404Error = '/not-found', // 404 from server/api
	GenericServerError = '/server-err', // 500
	ServiceUnavailable = '/service-unavailable', // 503
}

export default AppRoutes
