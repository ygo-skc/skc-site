import { useEffect, useReducer } from 'react'
import { tierListReducer } from './tierListState'
import { readTierList, writeTierList } from '../../helper/TierListStorage'

// the reader's list, saved on the device after every change until they start over
export default function useTierList() {
	const [list, dispatch] = useReducer(tierListReducer, undefined, readTierList)

	useEffect(() => writeTierList(list), [list])

	return [list, dispatch] as const
}
