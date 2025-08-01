import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { getStoreOverride } from '@/api'
import { useDateTimePicker } from './useDateTimePicker'

export function useStoreOverrides(storeTimes: any) {
	const [storeOverrides, setStoreOverrides] = useState<Record<string, any>>({})
	const [overridesLoading, setOverridesLoading] = useState(false)
	const [hasAnyOverrides, setHasAnyOverrides] = useState(false)

	const { generateDateSlots } = useDateTimePicker()

	const storeOverrideMutation = useMutation({
		mutationKey: getStoreOverride.key,
		mutationFn: getStoreOverride.fn,
	})

	const fetchStoreOverrides = async () => {
		if (!storeTimes) return

		setOverridesLoading(true)
		const overrides: Record<string, any> = {}
		let hasOverrides = false

		const dateSlots = generateDateSlots()

		for (const dateSlot of dateSlots) {
			const month = (dateSlot.date.getMonth() + 1).toString()
			const day = dateSlot.date.getDate().toString()
			const dateKey = `${month}/${day}`

			try {
				const overrideData = await storeOverrideMutation.mutateAsync({ month, day })

				if (overrideData && !overrideData.message && Array.isArray(overrideData) && overrideData.length > 0) {
					const latestOverride = overrideData[overrideData.length - 1]
					const openOverride = overrideData.find((override) => override.is_open === true)
					const finalOverride = openOverride || latestOverride

					overrides[dateKey] = finalOverride
					hasOverrides = true
				} else {
				}
			} catch (error) {
				continue
			}
		}

		setStoreOverrides(overrides)
		setHasAnyOverrides(hasOverrides)
		setOverridesLoading(false)
	}

	useEffect(() => {
		if (storeTimes && Object.keys(storeOverrides).length === 0) {
			fetchStoreOverrides()
		}
	}, [storeTimes])

	return {
		storeOverrides,
		overridesLoading,
		hasAnyOverrides,
		storeOverrideMutation,
	}
}
