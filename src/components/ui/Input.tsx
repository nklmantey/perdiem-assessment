import { Ionicons } from '@expo/vector-icons'
import { useRef } from 'react'
import { TextInput, TextInputProps, TouchableOpacity, View } from 'react-native'
import Animated from 'react-native-reanimated'
import styled from 'styled-components'
import { Typography } from '../global'

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

type InputProps = {
	value: string
	onChangeText: (e: string) => void
	placeholder: string
	isValid?: boolean
	error?: string
} & TextInputProps

export default function Input({ placeholder, value, onChangeText, isValid = true, error, ...props }: InputProps) {
	const inputRef = useRef<TextInput>(null)

	return (
		<Container>
			<InputWrapper activeOpacity={0.9} onPress={() => inputRef.current?.focus()}>
				<AnimatedInputBase
					ref={inputRef}
					autoCorrect={false}
					autoCapitalize='none'
					value={value}
					onChangeText={onChangeText}
					placeholder={placeholder}
					placeholderTextColor={isValid ? '#a1a1a1' : 'maroon'}
					returnKeyLabel='done'
					returnKeyType='done'
					{...props}
				/>
			</InputWrapper>

			{error && (
				<ErrorContainer>
					<Ionicons name='alert-circle' size={13} color='maroon' />
					<Typography variant='danger'>{error}</Typography>
				</ErrorContainer>
			)}
		</Container>
	)
}

const Container = styled(View)`
	gap: 8px;
`

const InputWrapper = styled(TouchableOpacity)`
	width: 100%;
	background-color: #e9e9e9;
	border-radius: 8px;
	height: 40px;
`

const AnimatedInputBase = styled(AnimatedTextInput)`
	width: 100%;
	align-items: center;
	justify-content: center;
	font-family: PolysansNeutral;
	font-size: 14px;
	padding: 12px;
	height: 40px;
`

const ErrorContainer = styled(View)`
	flex-direction: row;
	width: 100%;
	flex-wrap: wrap;
	align-items: center;
	gap: 4px;
`
