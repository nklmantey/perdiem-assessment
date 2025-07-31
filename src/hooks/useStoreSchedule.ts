import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

import { getStoreTimes } from '@/api'
import { useAppInfoStore } from '@/stores'

export function useStoreSchedule() {
	const { storeTimes, setStoreTimes } = useAppInfoStore()

	const { data: storeTimesData } = useQuery({
		queryKey: getStoreTimes.key,
		queryFn: getStoreTimes.fn,
		staleTime: 24 * 60 * 60 * 1000,
		gcTime: 24 * 60 * 60 * 1000,
		enabled: !storeTimes,
	})

	useEffect(() => {
		if (storeTimesData && !storeTimes) {
			setStoreTimes(storeTimesData)
		}
	}, [storeTimesData, storeTimes, setStoreTimes])

	return storeTimes
}
