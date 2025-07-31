import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type Appointment = {
	date: Date
	time: Date
	formattedDate: string
	formattedTime: string
}

type AppInfoStore = {
	timezone: 'nyc' | 'local' | null
	setTimezone: (timezone: 'nyc' | 'local') => void
	storeTimes: any
	setStoreTimes: (data: any) => void
	appointment: Appointment | null
	setAppointment: (appointment: Appointment) => void
	clearAppointment: () => void
}

export const useAppInfoStore = create<AppInfoStore>()(
	persist(
		(set) => ({
			timezone: null,
			setTimezone: (timezone: 'nyc' | 'local') => set({ timezone }),
			storeTimes: null,
			setStoreTimes: (data: any) => set({ storeTimes: data }),
			appointment: null,
			setAppointment: (appointment: Appointment) => set({ appointment }),
			clearAppointment: () => set({ appointment: null }),
		}),
		{
			name: 'app-info-storage',
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
)
