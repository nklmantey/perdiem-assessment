import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type AuthUser = {
	email: string
}

type GoogleAuthUser = {
	email: string
	uid: string
	name?: string
	photoURL?: string
}

type AuthStore = {
	user: AuthUser | GoogleAuthUser | null
	token: string | null
	setUser: (user: AuthUser | GoogleAuthUser | null) => void
	setToken: (token: string | null) => void
	logout: () => void
}

export const useAuthStore = create<AuthStore>()(
	persist(
		(set) => ({
			user: null,
			token: null,
			setUser: (user: AuthUser | GoogleAuthUser | null) => set({ user }),
			setToken: (token: string | null) => set({ token }),
			logout: () => set({ user: null, token: null }),
		}),
		{
			name: 'auth-storage',
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
)
