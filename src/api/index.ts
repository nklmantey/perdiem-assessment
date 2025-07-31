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

			// RES IS TOKEN
			return data
		} catch (error: any) {
			// ERROR IS 401
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
