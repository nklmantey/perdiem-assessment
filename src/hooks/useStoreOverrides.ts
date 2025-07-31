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

			console.log(`🔍 Checking override for ${dateSlot.label} (${dateKey}):`)

			try {
				const overrideData = await storeOverrideMutation.mutateAsync({ month, day })

				if (overrideData && !overrideData.message && Array.isArray(overrideData) && overrideData.length > 0) {
					const latestOverride = overrideData[overrideData.length - 1]
					const openOverride = overrideData.find((override) => override.is_open === true)
					const finalOverride = openOverride || latestOverride

					overrides[dateKey] = finalOverride
					hasOverrides = true
					console.log(`✅ Override found for ${dateSlot.label}:`, {
						is_open: finalOverride.is_open,
						start_time: finalOverride.start_time,
						end_time: finalOverride.end_time,
						all_overrides: overrideData,
					})
				} else {
					console.log(`❌ No override for ${dateSlot.label} - using regular schedule`)
				}
			} catch (error) {
				console.log(`❌ Error/404 for ${dateSlot.label} - no override exists`)
				continue
			}
		}

		console.log('📊 Final overrides summary:', {
			total_dates_checked: dateSlots.length,
			overrides_found: Object.keys(overrides).length,
			has_any_overrides: hasOverrides,
			override_dates: Object.keys(overrides),
			override_details: overrides,
		})

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
