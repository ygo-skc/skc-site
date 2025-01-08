import { useEffect } from 'react'
import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'

type TrendingData<T> = {
	metrics: TrendingResource<T>[]
}

type TrendingResource<T> = {
	resource: T
	occurrences: number
	change: number
}

const Trending = () => {
	useEffect(() => {
		FetchHandler.handleFetch(
			`${DownstreamServices.SKC_SUGGESTION_ENDPOINTS.trending}/card`,
			(trendingData: TrendingData<Omit<YGOCard, 'monsterType' | 'monsterAssociation' | 'monsterAttack' | 'monsterDefense'>>) => {
				console.log(trendingData)
			},
			false
		)?.catch(() => {})

		FetchHandler.handleFetch(
			`${DownstreamServices.SKC_SUGGESTION_ENDPOINTS.trending}/product`,
			(trendingData: YGOProduct) => {
				console.log(trendingData)
			},
			false
		)?.catch(() => {})
	})
	return <div></div>
}

export default Trending
