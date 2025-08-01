import { findNextStoreOpening } from '@/utils'
import * as Notifications from 'expo-notifications'
import { useEffect, useRef, useState } from 'react'

type NotificationCache = {
	nyc: {
		openingTime: Date | null
		dayName: string
		startTime: string
		isOverride: boolean
		notificationId?: string
	} | null
	local: {
		openingTime: Date | null
		dayName: string
		startTime: string
		isOverride: boolean
		notificationId?: string
	} | null
}

export function useStoreNotification(
	storeTimes: any[],
	storeOverrides: Record<string, any> = {},
	timezone: 'nyc' | 'local' | null,
	overridesLoading: boolean = false
) {
	const [notificationCache, setNotificationCache] = useState<NotificationCache>({
		nyc: null,
		local: null,
	})
	const lastStoreTimesRef = useRef<any[]>([])
	const lastStoreOverridesRef = useRef<Record<string, any>>({})
	const lastTimezoneRef = useRef<'nyc' | 'local' | null>(null)

	const scheduleNotification = async (
		openingData: {
			openingTime: Date | null
			dayName: string
			startTime: string
			isOverride: boolean
		},
		tz: 'nyc' | 'local'
	) => {
		if (!openingData.openingTime) {
			console.log(`[${tz}] No opening time available`)
			return
		}

		// Cancel existing notification for this timezone
		if (notificationCache[tz]?.notificationId) {
			await Notifications.cancelScheduledNotificationAsync(notificationCache[tz]!.notificationId!)
			console.log(`[${tz}] Cancelled existing notification: ${notificationCache[tz]!.notificationId}`)
		}

		// Calculate notification time (1 hour before opening)
		const notificationTime = new Date(openingData.openingTime)
		notificationTime.setHours(notificationTime.getHours() - 1)

		// Check if notification should be scheduled for today
		const now = new Date()
		const openingDate = new Date(openingData.openingTime)
		const isToday = openingDate.toDateString() === now.toDateString()

		console.log(`[${tz}] Store opens: ${openingData.openingTime.toLocaleString()}`)
		console.log(`[${tz}] Notification scheduled for: ${notificationTime.toLocaleString()}`)
		console.log(`[${tz}] Is today: ${isToday}`)

		// Only schedule if:
		// 1. Notification time is in the future
		// 2. Opening is today (not for future days)
		if (notificationTime > now && isToday) {
			const notificationId = await Notifications.scheduleNotificationAsync({
				content: {
					title: 'Store Opening Reminder',
					body: `The store opens in 1 hour at ${openingData.startTime} on ${openingData.dayName}`,
				},
				trigger: {
					date: notificationTime,
				},
			})

			console.log(`[${tz}] Scheduled notification: ${notificationId}`)
			return notificationId
		} else {
			if (notificationTime <= now) {
				console.log(`[${tz}] Notification time is in the past, not scheduling`)
			} else if (!isToday) {
				console.log(`[${tz}] Opening is not today, not scheduling notification`)
			}
		}

		return undefined
	}

	const updateNotificationCache = async () => {
		// Don't update if overrides are still loading
		if (overridesLoading) {
			console.log('Overrides still loading, skipping notification update')
			return
		}

		// Check if data has actually changed
		const storeTimesChanged = JSON.stringify(storeTimes) !== JSON.stringify(lastStoreTimesRef.current)
		const storeOverridesChanged = JSON.stringify(storeOverrides) !== JSON.stringify(lastStoreOverridesRef.current)
		const timezoneChanged = timezone !== lastTimezoneRef.current

		if (!storeTimesChanged && !storeOverridesChanged && !timezoneChanged) {
			console.log('No changes detected, skipping notification update')
			return
		}

		console.log('Updating notification cache...')
		console.log('Store times changed:', storeTimesChanged)
		console.log('Store overrides changed:', storeOverridesChanged)
		console.log('Timezone changed:', timezoneChanged)
		console.log('Overrides loading:', overridesLoading)

		// Update refs
		lastStoreTimesRef.current = storeTimes
		lastStoreOverridesRef.current = storeOverrides
		lastTimezoneRef.current = timezone

		// Calculate next opening for both timezones
		// Note: findNextStoreOpening currently doesn't handle timezone differences
		// Both will return the same result, but we'll schedule notifications appropriately
		const nextOpening = findNextStoreOpening(storeTimes, storeOverrides)
		console.log('Next opening found:', nextOpening)

		// Schedule notifications for both timezones
		const nycNotificationId = await scheduleNotification(nextOpening, 'nyc')
		const localNotificationId = await scheduleNotification(nextOpening, 'local')

		// Update cache
		setNotificationCache({
			nyc: nextOpening.openingTime ? { ...nextOpening, notificationId: nycNotificationId } : null,
			local: nextOpening.openingTime ? { ...nextOpening, notificationId: localNotificationId } : null,
		})
	}

	useEffect(() => {
		if (storeTimes && storeTimes.length > 0) {
			updateNotificationCache()
		}
	}, [storeTimes, storeOverrides, timezone, overridesLoading])

	// Cleanup notifications on unmount
	useEffect(() => {
		return () => {
			// Cancel all scheduled notifications when component unmounts
			Object.values(notificationCache).forEach((cache) => {
				if (cache?.notificationId) {
					Notifications.cancelScheduledNotificationAsync(cache.notificationId)
				}
			})
		}
	}, [])

	return {
		notificationCache,
		currentOpening: timezone ? notificationCache[timezone] : null,
	}
}
