import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type User = {
	email: string
}

type AuthStore = {
	user: User | null
	token: string | null
	setUser: (user: User | null) => void
	setToken: (token: string | null) => void
	logout: () => void
}

export const useAuthStore = create<AuthStore>()(
	persist(
		(set) => ({
			user: null,
			token: null,
			setUser: (user: User | null) => set({ user }),
			setToken: (token: string | null) => set({ token }),
			logout: () => set({ user: null, token: null }),
		}),
		{
			name: 'auth-storage',
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
)
