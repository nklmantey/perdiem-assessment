import { useEffect, useState } from 'react'

import { getGreeting } from '@/utils'

export function useGreeting(timezone: 'nyc' | 'local' | null) {
	const [currentGreeting, setCurrentGreeting] = useState('')

	useEffect(() => {
		const updateGreeting = () => {
			setCurrentGreeting(getGreeting(timezone))
		}

		updateGreeting()

		const interval = setInterval(updateGreeting, 60000)

		return () => clearInterval(interval)
	}, [timezone])

	return currentGreeting
}
