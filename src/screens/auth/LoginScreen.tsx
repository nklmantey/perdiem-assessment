import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView, StyleSheet, View } from 'react-native'
import styled from 'styled-components'

import { loginUserEmailAndPassword } from '@/api'
import { SafeareaContainer, Typography } from '@/components/global'
import { Button, Divider, Input } from '@/components/ui'
import { LoginInputType, loginSchema } from '@/schema'
import { useAuthStore } from '@/stores'
import { GoogleAuthProvider } from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner-native'

export default function LoginScreen() {
	const { setToken, setUser } = useAuthStore()

	const {
		control,
		handleSubmit,
		formState: { errors },
		getValues,
	} = useForm<LoginInputType>({
		resolver: zodResolver(loginSchema),
	})

	const { mutate: handleLoginUserEmailAndPassword, isPending } = useMutation({
		mutationKey: loginUserEmailAndPassword.key,
		mutationFn: loginUserEmailAndPassword.fn,
		onSuccess: (d) => {
			setToken(d.token)
			setUser({ email: getValues('email') })
			toast.success('Successful login')
		},
		onError: (e) => {
			toast.error(e.message)
		},
	})

	function onSubmit(payload: LoginInputType) {
		handleLoginUserEmailAndPassword(payload)
	}

	async function onLoginWithGoogle() {
		await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })

		const { data } = await GoogleSignin.signIn()
		console.log('idToken', data)

		const gc = GoogleAuthProvider.credential(data?.idToken!)
		console.log('gc', gc)
	}

	return (
		<SafeareaContainer>
			<ScrollView contentContainerStyle={styles.container}>
				<TextContainer>
					<Typography weight='median' size='lg'>
						Get started.
					</Typography>
					<Typography variant='secondary'>Fill in the information below to continue.</Typography>
				</TextContainer>

				<InputsContainer>
					<Controller
						control={control}
						name='email'
						render={({ field }) => (
							<Input
								placeholder='Email'
								value={field.value}
								onChangeText={field.onChange}
								isValid={!errors?.email?.message}
								error={errors?.email?.message}
							/>
						)}
					/>
					<Controller
						control={control}
						name='password'
						render={({ field }) => (
							<Input
								placeholder='Password'
								value={field.value}
								onChangeText={field.onChange}
								isValid={!errors?.password?.message}
								error={errors?.password?.message}
								secureTextEntry
							/>
						)}
					/>
				</InputsContainer>

				<ButtonsContainer>
					<Button title='Log in with email and password' onPress={handleSubmit(onSubmit)} isLoading={isPending} />
					<DividerContainer>
						<Divider />
						<Typography variant='secondary' weight='neutral'>
							or
						</Typography>
						<Divider />
					</DividerContainer>
					<Button title='Log in with Google' variant='secondary' onPress={onLoginWithGoogle} />
				</ButtonsContainer>
			</ScrollView>
		</SafeareaContainer>
	)
}

const TextContainer = styled(View)`
	gap: 4px;
	width: 100%;
`

const ButtonsContainer = styled(View)`
	gap: 12px;
	align-items: center;
	width: 100%;
`

const InputsContainer = styled(View)`
	gap: 12px;
	width: 100%;
`

const DividerContainer = styled(View)`
	flex-direction: row;
	align-items: center;
	gap: 12px;
`

// SEPARATED BECAUSE OF contentContainerStyle
const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		gap: 24,
	},
})
