import { ActivityIndicator, TouchableOpacity } from 'react-native'

import { Typography } from '@/components/global'
import styled from 'styled-components'

type ButtonProps = {
	title: string
	onPress?: () => void
	isLoading?: boolean
	isDisabled?: boolean
	variant?: 'primary' | 'secondary' | 'danger'
}

const BUTTON_COLOR_MAP = {
	primary: '#eb1600',
	secondary: '#c9c9c9',
	danger: 'maroon',
}

export default function Button({ title, onPress, isLoading, isDisabled, variant = 'primary' }: ButtonProps) {
	const color = BUTTON_COLOR_MAP[variant]

	return (
		<ButtonContainer onPress={onPress} disabled={isDisabled || isLoading} activeOpacity={0.9} color={color}>
			{isLoading ? (
				<ActivityIndicator size='small' color='#e9e9e9' />
			) : (
				<Typography weight='median' variant='button'>
					{title}
				</Typography>
			)}
		</ButtonContainer>
	)
}

const ButtonContainer = styled(TouchableOpacity)<{ color: string }>`
	width: 100%;
	border-radius: 8px;
	align-items: center;
	padding: 12px;
	height: 40px;
	justify-content: center;
	background-color: ${(props) => props.color};
	opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`
