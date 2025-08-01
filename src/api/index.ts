import axios from 'axios'

import { LoginInputType } from '@/schema'
import { GoogleAuthProvider, getAuth, signInWithCredential } from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

const BASE_URL = 'https://coding-challenge-pd-1a25b1a14f34.herokuapp.com'

export const loginUserEmailAndPassword = {
	key: ['loginUserEmailAndPassword'],
	fn: async (payload: LoginInputType) => {
		const url = BASE_URL + '/auth'

		try {
			const { data } = await axios.post(url, payload)
			return data
		} catch (error: any) {
			console.log('error', error)
			throw new Error('Invalid credentials, try again')
		}
	},
}

export const loginUserGoogle = {
	key: ['loginUserGoogle'],
	fn: async () => {
		try {
			await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })

			const signInResult = await GoogleSignin.signIn()

			if (signInResult.type === 'cancelled') {
				throw new Error('Google sign in was cancelled by user')
			}

			const idToken = signInResult.data?.idToken

			if (!idToken) {
				throw new Error('Failed to get authentication token from Google')
			}

			const googleCredential = GoogleAuthProvider.credential(idToken)

			const authResult = await signInWithCredential(getAuth(), googleCredential)

			if (authResult.user) {
				return { authResult, idToken }
			}
		} catch (error) {
			if (error instanceof Error) {
				if (error.message.includes('cancelled')) {
					// USER CANCELLED, NO NEED FOR ERROR
					return
				}
			} else {
			}
		}
	},
}

export const getStoreTimes = {
	key: ['getStoreTimes'],
	fn: async () => {
		const url = BASE_URL + '/store-times'

		try {
			const { data } = await axios.get(url)
			return data
		} catch (error: any) {
			throw new Error('Failed to fetch, try again')
		}
	},
}

export const getStoreOverride = {
	key: ['getStoreOverride'],
	fn: async ({ month, day }: { month: string; day: string }) => {
		const url = BASE_URL + `/store-overrides/date/${month}/${day}`

		try {
			const { data } = await axios.get(url)
			return data
		} catch (error: any) {
			return { message: 'No store overrides' }
		}
	},
}
