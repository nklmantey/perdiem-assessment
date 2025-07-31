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
