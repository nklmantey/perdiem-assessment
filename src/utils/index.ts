import { useAppInfoStore, useAuthStore } from '@/stores'

export type StoreScheduleItem = {
	id: string
	day_of_week: number
	is_open: boolean
	start_time: string
	end_time: string
}

export type ValidatedStoreSchedule = {
	day_of_week: number
	is_open: boolean
	start_time: string
	end_time: string
	dayName: string
}

export type StoreSchedule = {
	day_of_week: number
	is_open: boolean
	start_time: string
	end_time: string
	dayName: string
}

export function validateStoreSchedule(data: any[]): ValidatedStoreSchedule[] {
	const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

	const validSchedules = data
		.filter((item): item is StoreScheduleItem => {
			return (
				item.id &&
				typeof item.day_of_week === 'number' &&
				typeof item.is_open === 'boolean' &&
				item.start_time !== undefined &&
				item.end_time !== undefined
			)
		})
		.map((item) => ({
			day_of_week: item.day_of_week,
			is_open: item.is_open,
			start_time: item.start_time || '',
			end_time: item.end_time || '',
			dayName: dayNames[item.day_of_week - 1] || `Day ${item.day_of_week}`,
		}))
		.sort((a, b) => a.day_of_week - b.day_of_week)

	const completeSchedule: ValidatedStoreSchedule[] = []
	for (let day = 1; day <= 7; day++) {
		const existingDay = validSchedules.find((schedule) => schedule.day_of_week === day)
		if (existingDay) {
			completeSchedule.push(existingDay)
		} else {
			completeSchedule.push({
				day_of_week: day,
				is_open: false,
				start_time: '',
				end_time: '',
				dayName: dayNames[day - 1],
			})
		}
	}

	return completeSchedule
}

export function getLocalTimezone() {
	return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export function getGreeting(timezone: 'nyc' | 'local' | null): string {
	const now = new Date()

	let hour: number
	if (timezone === 'nyc') {
		hour = parseInt(
			now.toLocaleString('en-US', {
				timeZone: 'America/New_York',
				hour: 'numeric',
				hour12: false,
			})
		)
	} else {
		hour = now.getHours()
	}

	const cityName = timezone === 'nyc' ? 'NYC' : getLocalTimezone().split('/').pop() || 'Local'

	if (hour >= 5 && hour < 10) {
		return `Good Morning, ${cityName}!`
	} else if (hour >= 10 && hour < 12) {
		return `Late Morning Vibes! ${cityName}`
	} else if (hour >= 12 && hour < 17) {
		return `Good Afternoon, ${cityName}!`
	} else if (hour >= 17 && hour < 21) {
		return `Good Evening, ${cityName}!`
	} else {
		return `Night Owl in ${cityName}!`
	}
}

export function findNextStoreOpening(
	storeTimes: any[],
	storeOverrides: Record<string, any> = {}
): {
	openingTime: Date | null
	dayName: string
	startTime: string
	isOverride: boolean
} {
	const now = new Date()
	const validatedSchedule = validateStoreSchedule(storeTimes)

	for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
		const checkDate = new Date(now)
		checkDate.setDate(now.getDate() + dayOffset)

		const dayOfWeek = checkDate.getDay()
		const scheduleDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek

		const month = (checkDate.getMonth() + 1).toString()
		const day = checkDate.getDate().toString()
		const dateKey = `${month}/${day}`
		const override = storeOverrides[dateKey]

		if (override) {
			if (override.is_open && override.start_time) {
				const [hours, minutes] = override.start_time.split(':').map(Number)
				const openingTime = new Date(checkDate)
				openingTime.setHours(hours, minutes, 0, 0)

				return {
					openingTime,
					dayName: checkDate.toLocaleDateString('en-US', { weekday: 'long' }),
					startTime: override.start_time,
					isOverride: true,
				}
			}
		} else {
			const daySchedule = validatedSchedule.find((s) => s.day_of_week === scheduleDayOfWeek)

			if (daySchedule?.is_open && daySchedule?.start_time) {
				const [hours, minutes] = daySchedule.start_time.split(':').map(Number)
				const openingTime = new Date(checkDate)
				openingTime.setHours(hours, minutes, 0, 0)

				return {
					openingTime,
					dayName: daySchedule.dayName,
					startTime: daySchedule.start_time,
					isOverride: false,
				}
			}
		}
	}

	return {
		openingTime: null,
		dayName: '',
		startTime: '',
		isOverride: false,
	}
}

export function logNextStoreOpening(storeTimes: any[], storeOverrides: Record<string, any> = {}) {
	const result = findNextStoreOpening(storeTimes, storeOverrides)
	return result
}

export function performLogout() {
	const { logout: authLogout } = useAuthStore.getState()
	authLogout()

	const { clearAll: clearAppStore } = useAppInfoStore.getState()
	clearAppStore()
}
