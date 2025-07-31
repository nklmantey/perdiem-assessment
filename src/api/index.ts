import axios from 'axios'

import { LoginInputType } from '@/schema'
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
			await GoogleSignin.hasPlayServices()
			console.log('HAS PLAY')

			const res = await GoogleSignin.signIn()
			console.log('THE DATA', res)

			// const googleCredential = auth.GoogleAuthProvider.credential(data?.idToken!)
			// const response = auth().signInWithCredential(googleCredential)

			// console.log('THE RESPONSE', response)
			// return response
		} catch (error: any) {
			console.log(error)
		}
	},
}
