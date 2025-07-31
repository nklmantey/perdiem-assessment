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

export * from './schedule'
